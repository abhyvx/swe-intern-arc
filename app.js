(() => {
  const KEY = "abhy-plan-v10";
  const OLD_KEY = "abhy-plan-v9";
  const C = window.CURRICULUM;
  const PROJECTS = window.PROJECTS;

  const defaultState = () => ({
    version: 10,
    theme: "dark",
    completedSteps: {},
    completedLessons: {},
    projectSteps: {},
    practiceOpen: {},
    lessonPtr: 0,
    stepPtr: 0,
    trackFilter: "all",
    segmentFilter: "summer",
    updatedAt: null,
  });

  let state = load();

  function load() {
    try {
      let raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!raw) {
        const legacy = JSON.parse(localStorage.getItem(OLD_KEY) || "null");
        if (legacy) {
          raw = { ...legacy, version: 10 };
          localStorage.setItem(KEY, JSON.stringify(raw));
        } else raw = {};
      }
      return {
        ...defaultState(),
        ...raw,
        version: 10,
        completedSteps: raw.completedSteps || {},
        completedLessons: raw.completedLessons || {},
        projectSteps: raw.projectSteps || {},
        practiceOpen: raw.practiceOpen || {},
      };
    } catch {
      return defaultState();
    }
  }

  function save() {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(state));
    document.documentElement.setAttribute("data-theme", state.theme || "dark");
    const meta = document.getElementById("saveMeta");
    if (meta && state.updatedAt) {
      meta.textContent = `Saved ${new Date(state.updatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }
  }

  function toast(m) {
    const el = document.getElementById("toast");
    el.textContent = m;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 1400);
  }

  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function engineName(id) {
    return C.engines.find((e) => e.id === id)?.name || id;
  }

  function fmtDay(iso) {
    if (!iso) return "";
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function stepKey(lessonId, stepId) {
    return `${lessonId}::${stepId}`;
  }

  /** Completion keys always use original curriculum lesson ids. */
  function progressKey(lesson, step) {
    return stepKey(step._origLessonId || lesson.id, step.id);
  }

  function practiceKey(lesson, step) {
    return progressKey(lesson, step);
  }

  function totalSteps() {
    const base = C._base?.lessons || C.lessons;
    return base.reduce((n, l) => n + l.steps.length, 0);
  }

  function completedCount() {
    return Object.values(state.completedSteps).filter(Boolean).length;
  }

  function isStepDone(lesson, step) {
    return !!state.completedSteps[progressKey(lesson, step)];
  }

  function lessonFullyDone(lesson) {
    return lesson.steps.every((s) => isStepDone(lesson, s));
  }

  function applyPlan() {
    if (typeof window.recalibrate === "function") window.recalibrate(state);
    state.lessonPtr = 0;
    state.stepPtr = 0;
    clampPointers();
  }

  function clampPointers() {
    if (!C.lessons.length) return;
    if (state.lessonPtr >= C.lessons.length) state.lessonPtr = C.lessons.length - 1;
    if (state.lessonPtr < 0) state.lessonPtr = 0;

    while (state.lessonPtr < C.lessons.length && lessonFullyDone(C.lessons[state.lessonPtr])) {
      state.completedLessons[C.lessons[state.lessonPtr].id] = true;
      if (state.lessonPtr < C.lessons.length - 1) state.lessonPtr += 1;
      else break;
    }

    const lesson = C.lessons[state.lessonPtr];
    if (!lesson) return;
    let idx = 0;
    while (idx < lesson.steps.length && isStepDone(lesson, lesson.steps[idx])) idx += 1;
    if (idx >= lesson.steps.length) idx = Math.max(0, lesson.steps.length - 1);
    state.stepPtr = idx;
  }

  function currentLesson() {
    return C.lessons[state.lessonPtr];
  }

  function currentStep() {
    return currentLesson()?.steps[state.stepPtr];
  }

  function phaseById(id) {
    return C.phases.find((p) => p.id === id);
  }

  function phaseUnlocked(phase) {
    const idx = C.phases.findIndex((p) => p.id === phase.id);
    if (idx <= 0) return true;
    const prev = C.phases[idx - 1];
    const prevLessons = C.lessons.filter((l) => l.phaseId === prev.id);
    const allDone = prevLessons.length === 0 || prevLessons.every(lessonFullyDone);
    const today = new Date();
    const start = new Date(phase.range[0] + "T12:00:00");
    return allDone || today >= start;
  }

  function canJumpTo(lesson) {
    const idx = C.lessonIndex[lesson.id];
    if (idx <= state.lessonPtr) return true;
    for (let i = 0; i < idx; i++) {
      if (!lessonFullyDone(C.lessons[i])) return false;
    }
    return true;
  }

  function jumpToLesson(id) {
    const idx = C.lessonIndex[id];
    if (idx == null) return;
    const les = C.lessons[idx];
    if (!canJumpTo(les) && !lessonFullyDone(les) && idx > state.lessonPtr) {
      toast("Finish earlier sessions first");
      return;
    }
    state.lessonPtr = idx;
    state.stepPtr = 0;
    clampPointers();
    showTab("continue");
    render();
  }

  function renderPace() {
    const pace = C.pace || {};
    const chip = document.getElementById("paceChip");
    const line = document.getElementById("paceLine");
    if (chip) {
      chip.textContent = pace.statusLabel || "On track";
      chip.dataset.status = pace.status || "on_track";
    }
    if (line) {
      const when = pace.recalibratedFor ? fmtDay(pace.recalibratedFor) : "";
      line.textContent = `${pace.message || "Recalibrated."}${
        pace.todayMinutes != null ? ` Today ~${pace.todayMinutes}m.` : ""
      }${when ? ` (${when})` : ""}`;
    }
  }

  function renderContinue() {
    clampPointers();
    const les = currentLesson();
    if (!les) {
      document.getElementById("lessonTitle").textContent = "Arc complete";
      document.getElementById("currentStep").innerHTML = `<p class="muted">Nothing left in the live plan.</p>`;
      document.getElementById("completeBtn").style.display = "none";
      renderPace();
      return;
    }
    const step = currentStep();
    const phase = phaseById(les.phaseId);
    const pct = totalSteps() ? Math.round((completedCount() / totalSteps()) * 100) : 0;

    document.getElementById("progressChip").textContent = `${pct}%`;
    document.getElementById("greeting").textContent =
      les.date && les.date <= C.meta.freeUntil
        ? "Free block through mid August · learn hard"
        : les.date && les.date < C.meta.classStart
          ? "Bridge · keep skills alive"
          : "Fall · 216 + winter intern ready";

    document.getElementById("phaseLabel").textContent = `${phase?.title || ""} · ${les.moduleTitle}`;
    document.getElementById("dayDate").textContent = les.date ? fmtDay(les.date) : "";
    document.getElementById("lessonTitle").textContent = les.title;
    document.getElementById("lessonConcept").textContent = les.concept;
    document.getElementById("dayWhy").textContent = les.why || "";
    renderPace();

    const whereLabel =
      step.where === "phone" ? "Phone" : step.where === "either" ? "Mac or phone" : "Mac";

    const teach = step.teach || {};
    const resources = step.resources || (step.resource ? [step.resource] : []);
    const resHtml = resources
      .map(
        (r) =>
          `<a class="resource-btn" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label)}${
            r.use ? ` <span class="res-use">· ${esc(r.use)}</span>` : ""
          }</a>`
      )
      .join("");

    const pkey = practiceKey(les, step);
    const practiced = !!(state.practiceOpen && state.practiceOpen[pkey]) || isStepDone(les, step);
    const how = document.getElementById("howTo");
    if (how) {
      how.textContent = practiced
        ? "Practice: write and run it yourself. Use resources only if stuck. Then prove it."
        : "Learn first: read Why, The idea, When, Walkthrough, Fixes. Open the guide links. Then unlock practice.";
    }

    document.getElementById("currentStep").innerHTML = `
      <div class="step-top">
        <span class="track-pill track-${esc(step.engine)}">${esc(engineName(step.engine))}</span>
        <span class="mins">${step.min}m · ${esc(whereLabel)}</span>
      </div>
      <h3 class="step-title">${esc(step.title)}</h3>
      <div class="teach-panel">
        <div class="block"><p class="block-label">Why this matters</p><p>${esc(teach.why || "")}</p></div>
        <div class="block"><p class="block-label">The idea</p><p>${esc(teach.idea || step.learn || "")}</p></div>
        <div class="block"><p class="block-label">When / where you use it</p><p>${esc(teach.when || "")}</p></div>
        ${
          teach.syntax
            ? `<div class="block"><p class="block-label">Syntax</p><pre class="example">${esc(teach.syntax)}</pre></div>`
            : ""
        }
        ${
          teach.code
            ? `<div class="block"><p class="block-label">Code to study (then write your own)</p><pre class="example">${esc(teach.code)}</pre></div>`
            : ""
        }
        ${
          teach.walkthrough || step.example
            ? `<div class="block"><p class="block-label">Walkthrough</p><pre class="example">${esc(
                teach.walkthrough || step.example || ""
              )}</pre></div>`
            : ""
        }
        <div class="block"><p class="block-label">How to fix common failures</p><p>${esc(teach.bugs || "")}</p></div>
        <div class="block"><p class="block-label">Resources (docs, videos, guides)</p><div class="res-list">${resHtml}</div></div>
      </div>
      ${
        practiced
          ? `<div class="practice-panel">
        <p class="block-label">Your turn</p>
        <div class="block"><p class="block-label">Do</p><p>${esc(step.do)}</p></div>
        <div class="block"><p class="block-label">Prove you understand</p><p>${esc(step.prove)}</p></div>
      </div>`
          : `<button type="button" class="btn" id="unlockPractice">I understand the idea · start practice</button>`
      }
    `;

    const unlockBtn = document.getElementById("unlockPractice");
    if (unlockBtn) {
      unlockBtn.onclick = () => {
        state.practiceOpen = state.practiceOpen || {};
        state.practiceOpen[pkey] = true;
        render();
      };
    }

    const locked = les.steps
      .slice(state.stepPtr + 1)
      .map((s) => `<li><span class="lock">Locked</span> ${esc(s.title)} · ${s.min}m</li>`)
      .join("");
    document.getElementById("lockedSteps").innerHTML =
      locked || `<li class="muted">Last step in this session. Complete it to unlock the next.</li>`;

    const nextLes = C.lessons[state.lessonPtr + 1];
    const box = document.getElementById("nextLessonBox");
    if (nextLes) {
      box.hidden = false;
      const when = nextLes.date ? `${fmtDay(nextLes.date)} · ` : "";
      document.getElementById("nextLessonTitle").textContent = when + nextLes.title;
    } else box.hidden = true;

    const completeBtn = document.getElementById("completeBtn");
    completeBtn.style.display = practiced ? "" : "none";
    completeBtn.textContent = isStepDone(les, step)
      ? "Step complete · continue"
      : "Mark step complete";
  }

  function renderMap() {
    const seg = state.segmentFilter || "summer";
    document.getElementById("segmentFilters").innerHTML = C.phases
      .map(
        (p) =>
          `<button type="button" class="chip-btn ${seg === p.id ? "active" : ""}" data-segment="${p.id}">${esc(
            p.title
          )}</button>`
      )
      .join("");

    document.getElementById("scheduleLede").textContent =
      (C.pace?.message ? C.pace.message + " " : "") +
      "Free time through " +
      fmtDay(C.meta.freeUntil) +
      ". Classes " +
      fmtDay(C.meta.classStart) +
      ". Winter intern materials target " +
      fmtDay(C.meta.winterReady) +
      ".";

    const phase = phaseById(seg);
    const unlocked = phaseUnlocked(phase);
    const modules = phase.modules || [];

    if (!unlocked) {
      document.getElementById("phaseMap").innerHTML = `<article class="phase-card locked">
        <h2 class="h2">${esc(phase.title)}</h2>
        <p class="blurb">${esc(phase.goal)}</p>
        <p class="muted">Locked until prior segment is done or the calendar reaches this segment.</p>
        <ul class="title-only">${modules
          .slice(0, 8)
          .map((m) => `<li>${esc(fmtDay(m.date))} · ${esc(m.title)}</li>`)
          .join("")}</ul>
      </article>`;
      return;
    }

    document.getElementById("phaseMap").innerHTML = `
      <article class="phase-card active">
        <h2 class="h2">${esc(phase.title)}</h2>
        <p class="blurb">${esc(phase.goal)}</p>
      </article>
      <ul class="lesson-map">${modules
        .map((m) => {
          const lessons = m.lessons || [];
          const flat = C.lessons.filter((l) => l.moduleId === m.id);
          const done = flat.length && flat.every(lessonFullyDone);
          const cur = currentLesson();
          const isCur = !!(cur && flat.some((l) => l.id === cur.id));
          const first = flat[0];
          const cls = done ? "done" : isCur ? "current" : "pending";
          return `<li class="${cls}">
            <button type="button" data-jump-lesson="${esc(first?.id || "")}" ${
              first && (done || isCur || canJumpTo(first)) ? "" : "disabled"
            }>
              <span><strong>${esc(fmtDay(m.date))}</strong> · ${esc(m.title)}</span>
              <span class="meta">${lessons.length} sessions${done ? " · done" : isCur ? " · now" : ""}</span>
            </button>
            <p class="day-why">${esc(m.why || "")}</p>
          </li>`;
        })
        .join("")}</ul>`;
  }

  function renderSkills() {
    const filters = [{ id: "all", name: "All" }, ...C.engines];
    document.getElementById("engineFilters").innerHTML = filters
      .map(
        (f) =>
          `<button type="button" class="chip-btn ${state.trackFilter === f.id ? "active" : ""}" data-engine-filter="${f.id}">${esc(
            f.name
          )}</button>`
      )
      .join("");

    const filter = state.trackFilter;
    document.getElementById("trackPanel").innerHTML = C.engines
      .filter((e) => filter === "all" || filter === e.id)
      .map((e) => {
        const steps = [];
        C.lessons.forEach((l) => {
          l.steps.forEach((s) => {
            if (s.engine === e.id) steps.push({ lesson: l, step: s });
          });
        });
        const done = steps.filter((x) => isStepDone(x.lesson, x.step)).length;
        const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
        const next = steps.find((x) => !isStepDone(x.lesson, x.step));
        const upcoming = steps
          .filter((x) => !isStepDone(x.lesson, x.step))
          .slice(0, 6)
          .map(
            (x) =>
              `<li>${x.lesson.date ? esc(fmtDay(x.lesson.date)) + " · " : ""}${esc(x.step.title)}</li>`
          )
          .join("");

        return `<article class="track-card">
          <div class="phase-top">
            <h2 class="h2">${esc(e.name)}</h2>
            <span class="meta">${pct}%</span>
          </div>
          <p class="blurb">${esc(e.blurb)}</p>
          <div class="bar"><i style="width:${pct}%"></i></div>
          ${
            next
              ? `<button type="button" class="btn" data-jump-lesson="${esc(next.lesson.id)}">Jump to next ${esc(
                  e.name
                )} step</button>`
              : `<p class="muted">Caught up.</p>`
          }
          <h3 class="h3">Coming up</h3>
          <ul class="up-titles">${upcoming || "<li>None</li>"}</ul>
        </article>`;
      })
      .join("");
  }

  function terpUnlocked() {
    const hops = Object.keys(state.completedSteps).some(
      (k) => k.includes("s0727-1") && state.completedSteps[k]
    );
    const kv = Object.keys(state.completedSteps).some(
      (k) => k.includes("s0801-1") && state.completedSteps[k]
    );
    return hops && kv;
  }

  function renderProjects() {
    const sorted = [...PROJECTS].sort((a, b) => a.order - b.order);
    document.getElementById("projectList").innerHTML = sorted
      .map((p) => {
        const locked = p.optional && !terpUnlocked();
        const links = (p.links || [])
          .map((l) => `<a class="res" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
          .join(" ");

        let done = 0;
        let total = 0;
        p.chapters.forEach((ch, ci) => {
          ch.steps.forEach((_, si) => {
            total += 1;
            if (state.projectSteps[`proj:${p.id}:${ci}:${si}`]) done += 1;
          });
        });

        const chapters = locked
          ? `<p class="muted">Locked until Gambit path hops (Jul 27) and NetKV SET/GET (Aug 1) are done in Continue.</p>`
          : p.chapters
              .map((ch, ci) => {
                const steps = ch.steps
                  .map((s, si) => {
                    const key = `proj:${p.id}:${ci}:${si}`;
                    const on = !!state.projectSteps[key];
                    const t = s.teach || {};
                    const rs = (s.resources || (s.resource ? [s.resource] : []))
                      .map((r) => `<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label)}${r.use ? ` · ${esc(r.use)}` : ""}</a>`)
                      .join("<br>");
                    return `<label class="proj-step ${on ? "on" : ""}">
                      <input type="checkbox" data-pkey="${esc(key)}" ${on ? "checked" : ""}>
                      <div>
                        <div class="task-meta"><span class="mins">${s.min}m</span></div>
                        <p class="block-label">Why</p><p>${esc(t.why || "")}</p>
                        <p class="block-label">Idea</p><p>${esc(t.idea || s.learn || "")}</p>
                        ${t.syntax ? `<p class="block-label">Syntax</p><pre class="example">${esc(t.syntax)}</pre>` : ""}
                        ${t.code ? `<p class="block-label">Code</p><pre class="example">${esc(t.code)}</pre>` : ""}
                        <p class="block-label">Do</p><p>${esc(s.do)}</p>
                        <p class="block-label">Prove</p><p>${esc(s.prove)}</p>
                        <p class="block-label">Resources</p><div class="res-list">${rs}</div>
                      </div>
                    </label>`;
                  })
                  .join("");
                return `<div class="chapter"><h3 class="h3">${esc(ch.title)}</h3>${steps}</div>`;
              })
              .join("");

        return `<article class="proj ${locked ? "locked" : ""}">
          <div class="phase-top">
            <h2 class="h2">${esc(p.title)}</h2>
            <span class="meta">${done}/${total}</span>
          </div>
          <p class="stack">${esc(p.stack || "")}</p>
          <p class="blurb">${esc(p.blurb)}</p>
          <p class="why-matter"><strong>Why it matters:</strong> ${esc(p.whyItMatters || "")}</p>
          <p class="muted">${esc(p.gate || "")}</p>
          <div class="links">${links}</div>
          ${chapters}
        </article>`;
      })
      .join("");
  }

  function render() {
    renderContinue();
    renderMap();
    renderSkills();
    renderProjects();
    save();
  }

  function showTab(name) {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
  }

  function completeCurrent() {
    const les = currentLesson();
    const step = currentStep();
    if (!les || !step) return;
    state.completedSteps[progressKey(les, step)] = true;

    applyPlan();
    toast(C.lessons.length ? "Recalibrated · next up" : "Arc complete");
    render();
  }

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showTab(btn.dataset.tab);
      render();
    });
  });

  document.getElementById("themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    save();
  });

  document.getElementById("completeBtn").addEventListener("click", completeCurrent);

  document.body.addEventListener("click", (e) => {
    const jump = e.target.closest("[data-jump-lesson]");
    if (jump && jump.dataset.jumpLesson) {
      jumpToLesson(jump.dataset.jumpLesson);
      return;
    }
    const seg = e.target.closest("[data-segment]");
    if (seg) {
      state.segmentFilter = seg.dataset.segment;
      renderMap();
      save();
      return;
    }
    const filt = e.target.closest("[data-engine-filter]");
    if (filt) {
      state.trackFilter = filt.dataset.engineFilter;
      renderSkills();
      save();
    }
  });

  document.body.addEventListener("change", (e) => {
    if (e.target.dataset.pkey) {
      state.projectSteps[e.target.dataset.pkey] = e.target.checked;
      renderProjects();
      save();
    }
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), state }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "swe-intern-arc-progress.json";
    a.click();
    toast("Exported");
  });

  document.getElementById("importBtn").addEventListener("click", () => {
    document.getElementById("importFile").click();
  });

  document.getElementById("importFile").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const incoming = data.state || data;
        state = {
          ...defaultState(),
          ...incoming,
          version: 10,
          completedSteps: incoming.completedSteps || {},
          completedLessons: incoming.completedLessons || {},
          projectSteps: incoming.projectSteps || {},
          practiceOpen: incoming.practiceOpen || {},
        };
        applyPlan();
        render();
        toast("Imported · recalibrated");
      } catch {
        toast("Import failed");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all arc progress?")) return;
    const theme = state.theme;
    state = defaultState();
    state.theme = theme;
    applyPlan();
    render();
    toast("Reset");
  });

  // Boot: recalibrate from progress, then set segment from today
  applyPlan();
  const today = new Date().toISOString().slice(0, 10);
  if (today <= C.meta.freeUntil) state.segmentFilter = "summer";
  else if (today < C.meta.classStart) state.segmentFilter = "bridge";
  else state.segmentFilter = "fall";

  save();
  render();
})();
