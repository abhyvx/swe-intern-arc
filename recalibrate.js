/*! Daily recalibration: fold missed work into remaining days. Never send you back. */
(function () {
  const C = window.CURRICULUM;
  if (!C) return;

  // Snapshot original spine once (enrich may have already run).
  if (!C._base) {
    C._base = {
      meta: { ...C.meta },
      phases: C.phases.map((p) => ({ ...p, modules: undefined })),
      lessons: C.lessons.map((l) => ({
        ...l,
        steps: l.steps.map((s) => ({ ...s })),
      })),
    };
  }

  function isoToday() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function addDays(iso, n) {
    const d = new Date(iso + "T12:00:00");
    d.setDate(d.getDate() + n);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function phaseForDate(iso) {
    if (iso <= C.meta.freeUntil) return "summer";
    if (iso < C.meta.classStart) return "bridge";
    return "fall";
  }

  function dow(iso) {
    return new Date(iso + "T12:00:00").getDay(); // 0 Sun
  }

  /** Realistic daily minute caps by phase. Slightly raised when behind. */
  function dayCap(iso, behind) {
    const phase = phaseForDate(iso);
    const w = dow(iso);
    let cap;
    if (phase === "summer") cap = w === 0 || w === 6 ? 160 : 150;
    else if (phase === "bridge") cap = 70;
    else {
      // Fall: protect class days; denser Fri/Sat for projects
      if (w === 5 || w === 6) cap = 90;
      else if (w === 0) cap = 60;
      else cap = 75;
    }
    if (behind) {
      if (phase === "summer") cap = Math.min(180, cap + 25);
      else if (phase === "bridge") cap = Math.min(95, cap + 15);
      else cap = Math.min(110, cap + 15);
    }
    return cap;
  }

  function isFiller(step) {
    const id = String(step.id || "");
    return id.startsWith("fill-") || /fall drill/i.test(step.title || "");
  }

  function isWinterCritical(step, lesson) {
    const blob = `${step.id} ${step.title} ${lesson.title} ${step.engine}`.toLowerCase();
    return (
      /star|resume|application|interview|gambit|netkv|demo|oa|behavioral/.test(blob) ||
      step.engine === "build" ||
      step.engine === "dsa"
    );
  }

  function stepKey(lessonId, stepId) {
    return `${lessonId}::${stepId}`;
  }

  function remainingDays(fromIso, toIso) {
    const out = [];
    let cur = fromIso;
    while (cur <= toIso) {
      out.push(cur);
      cur = addDays(cur, 1);
    }
    return out;
  }

  /**
   * Build live curriculum from incomplete work only.
   * Missed past-dated steps are packed into today and future days.
   */
  window.recalibrate = function recalibrate(state) {
    const today = isoToday();
    const done = state.completedSteps || {};
    const base = C._base.lessons;

    // Incomplete steps in original order, tagged with lesson context
    const backlog = [];
    let overdueCount = 0;
    let expectedDoneByToday = 0;
    let actuallyDoneOfExpected = 0;

    base.forEach((les) => {
      const origDate = les.date || C.meta.start;
      les.steps.forEach((st) => {
        const key = stepKey(les.id, st.id);
        const finished = !!done[key];
        if (origDate <= today) {
          expectedDoneByToday += 1;
          if (finished) actuallyDoneOfExpected += 1;
        }
        if (finished) return;
        if (origDate < today) overdueCount += 1;
        backlog.push({
          step: { ...st },
          lessonId: les.id,
          lessonTitle: les.title,
          concept: les.concept,
          why: les.why,
          moduleTitle: les.moduleTitle,
          origDate,
          phaseId: les.phaseId,
        });
      });
    });

    const daysBehind =
      expectedDoneByToday === 0
        ? 0
        : Math.max(0, Math.ceil((overdueCount / Math.max(1, expectedDoneByToday)) * 7));

    let status = "on_track";
    if (overdueCount > 2) status = "behind";
    else if (overdueCount === 0 && actuallyDoneOfExpected > expectedDoneByToday * 0.95 && backlog.length) {
      // Finished everything scheduled through today and still have future work → ahead if pointer past today
      const nextOrig = backlog[0]?.origDate;
      if (nextOrig && nextOrig > today) status = "ahead";
    } else if (overdueCount === 0 && actuallyDoneOfExpected >= expectedDoneByToday && backlog[0]?.origDate > today) {
      status = "ahead";
    }

    // Trim filler first if overloaded vs remaining capacity
    const end = C.meta.end;
    const days = remainingDays(today, end);
    let work = backlog.slice();
    let trimmed = 0;
    const totalMin = (arr) => arr.reduce((n, x) => n + (x.step.min || 20), 0);
    let capacity = days.reduce((n, d) => n + dayCap(d, status === "behind"), 0);

    if (totalMin(work) > capacity) {
      status = "behind";
      capacity = days.reduce((n, d) => n + dayCap(d, true), 0);
      const core = [];
      const fillers = [];
      work.forEach((x) => {
        if (isFiller(x.step) && !isWinterCritical(x.step, { title: x.lessonTitle })) fillers.push(x);
        else core.push(x);
      });
      work = core.slice();
      let used = totalMin(work);
      fillers.forEach((x) => {
        const m = x.step.min || 20;
        if (used + m <= capacity) {
          work.push(x);
          used += m;
        } else trimmed += 1;
      });
      // Keep original curriculum order among survivors
      const allow = new Set(work.map((x) => stepKey(x.lessonId, x.step.id)));
      work = backlog.filter((x) => allow.has(stepKey(x.lessonId, x.step.id)));
    }

    // Soft priority: before winterReady, pack winter-critical earlier when behind
    if (today < C.meta.winterReady && status === "behind") {
      const crit = [];
      const rest = [];
      work.forEach((x) => {
        if (isWinterCritical(x.step, { title: x.lessonTitle }) && x.origDate <= C.meta.winterReady) crit.push(x);
        else rest.push(x);
      });
      // Keep relative order within each bucket (stable)
      work = crit.concat(rest);
    }

    // Pack into live lessons per day
    const liveLessons = [];
    let bi = 0;
    let sessionN = 0;

    days.forEach((date) => {
      if (bi >= work.length) return;
      let left = dayCap(date, status === "behind");
      let daySession = 0;

      while (bi < work.length && left > 0) {
        const batch = [];
        let used = 0;
        const startTitle = work[bi].lessonTitle;

        while (bi < work.length) {
          const item = work[bi];
          const m = item.step.min || 20;
          // Allow one overflow step if day empty so progress never stalls
          if (used > 0 && used + m > left) break;
          if (used === 0 && m > left) {
            batch.push(item);
            bi += 1;
            used += m;
            break;
          }
          // Prefer keep same original lesson together when possible
          if (batch.length && item.lessonTitle !== startTitle && used >= left * 0.55) break;
          batch.push(item);
          bi += 1;
          used += m;
          if (used >= left) break;
        }

        if (!batch.length) break;
        left -= used;
        daySession += 1;
        sessionN += 1;
        const phaseId = phaseForDate(date);
        const first = batch[0];
        const title =
          batch.length === 1
            ? first.step.title
            : daySession === 1
              ? `Today · ${first.lessonTitle}`
              : `Continue · ${first.lessonTitle}`;

        liveLessons.push({
          id: `live-${date}-${daySession}`,
          title,
          concept: first.concept || "Recalibrated session from your remaining work.",
          why:
            status === "behind"
              ? "Missed work was folded into this day. Stay realistic; finish what is here."
              : first.why || "Stay on the arc.",
          phaseId,
          moduleId: `day-${date}`,
          moduleTitle: date <= C.meta.freeUntil ? "Recalibrated free block" : date < C.meta.classStart ? "Recalibrated bridge" : "Recalibrated fall",
          moduleEngine: first.step.engine || "systems",
          date,
          origDate: first.origDate,
          steps: batch.map((x) => ({
            ...x.step,
            // Preserve original identity for completion keys
            _origLessonId: x.lessonId,
            id: x.step.id,
          })),
        });
      }
    });

    // If still overflow past end date, append compressed overflow day(s) after end (honest)
    if (bi < work.length) {
      let overflowDate = addDays(end, 1);
      while (bi < work.length) {
        const batch = work.slice(bi, bi + 4);
        bi += batch.length;
        liveLessons.push({
          id: `live-overflow-${overflowDate}`,
          title: "Overflow catch-up",
          concept: "Past the arc end date. Finish these to close gaps.",
          why: "Backlog exceeded realistic packing through December. Do these next.",
          phaseId: "fall",
          moduleId: `day-${overflowDate}`,
          moduleTitle: "Overflow",
          moduleEngine: "pro",
          date: overflowDate,
          steps: batch.map((x) => ({ ...x.step, _origLessonId: x.lessonId })),
        });
        overflowDate = addDays(overflowDate, 1);
      }
      status = "behind";
    }

    // Rebuild phases.modules for Schedule view
    const byPhase = { summer: [], bridge: [], fall: [] };
    const byDate = {};
    liveLessons.forEach((les) => {
      if (!byDate[les.date]) byDate[les.date] = [];
      byDate[les.date].push(les);
    });
    Object.keys(byDate)
      .sort()
      .forEach((date) => {
        const lessons = byDate[date];
        const phaseId = phaseForDate(date);
        const pid = byPhase[phaseId] ? phaseId : "fall";
        byPhase[pid].push({
          id: `day-${date}`,
          title: lessons[0].moduleTitle,
          engine: lessons[0].moduleEngine,
          date,
          why: lessons[0].why,
          lessons,
        });
      });

    C.phases = C._base.phases.map((p) => ({
      ...p,
      modules: byPhase[p.id] || [],
    }));
    C.lessons = liveLessons;
    C.lessonIndex = Object.fromEntries(liveLessons.map((l, i) => [l.id, i]));

    const todayMin = liveLessons.filter((l) => l.date === today).reduce((n, l) => n + l.steps.reduce((a, s) => a + (s.min || 20), 0), 0);

    const statusLabel =
      status === "behind"
        ? `Behind · ~${Math.max(1, daysBehind || Math.ceil(overdueCount / 3))}d`
        : status === "ahead"
          ? "Ahead"
          : "On track";

    C.pace = {
      status,
      statusLabel,
      overdueSteps: overdueCount,
      daysBehind,
      todayMinutes: todayMin,
      trimmedFiller: trimmed,
      recalibratedFor: today,
      remainingSessions: liveLessons.length,
      message:
        status === "behind"
          ? `Recalibrated for today. ${overdueCount} missed step${overdueCount === 1 ? "" : "s"} folded forward.${
              trimmed ? ` Dropped ${trimmed} filler drill${trimmed === 1 ? "" : "s"} to stay realistic.` : ""
            }`
          : status === "ahead"
            ? "Recalibrated. You are ahead of the original calendar."
            : "Recalibrated. You are on track for the deadlines.",
    };

    return C.pace;
  };
})();
