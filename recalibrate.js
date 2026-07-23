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
      // Keep original curriculum order among survivors (never reorder learning deps)
      const allow = new Set(work.map((x) => stepKey(x.lessonId, x.step.id)));
      work = backlog.filter((x) => allow.has(stepKey(x.lessonId, x.step.id)));
    }

    // IMPORTANT: never reorder the spine. Foundations before later work.
    // Recalibration only moves unfinished steps onto later calendar days.
    // Deadlines change pace caps / status, not prerequisite order.

    // Pack into live lessons per day (consume work front-to-back only)
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
        const startLessonId = work[bi].lessonId;

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
          // Keep the same original lesson (building block) together before mixing
          if (batch.length && item.lessonId !== startLessonId) {
            // If this day still has room, only continue if we finished the prior block
            break;
          }
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
        const dayLabel = first.moduleTitle || first.lessonTitle;
        const prev = liveLessons[liveLessons.length - 1];
        const splitContinue =
          prev &&
          prev.date === date &&
          prev.steps.length &&
          prev.steps[0]._origLessonId === first.lessonId;

        liveLessons.push({
          id: `live-${date}-${daySession}`,
          title: splitContinue ? `${first.lessonTitle} (continued)` : first.lessonTitle,
          concept: first.concept || "",
          why: first.why || "Finish this block before later ones.",
          phaseId,
          moduleId: `day-${date}`,
          moduleTitle: dayLabel,
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
        const first = batch[0];
        liveLessons.push({
          id: `live-overflow-${overflowDate}`,
          title: first.lessonTitle || first.step.title,
          concept: first.concept || "Extra catch-up past the planned end date.",
          why: first.why || "Finish these to close remaining gaps.",
          phaseId: "fall",
          moduleId: `day-${overflowDate}`,
          moduleTitle: first.moduleTitle || "Catch-up",
          moduleEngine: first.step.engine || "pro",
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
        const titles = [];
        lessons.forEach((l) => {
          if (l.moduleTitle && !titles.includes(l.moduleTitle)) titles.push(l.moduleTitle);
        });
        const dayTitle = titles.slice(0, 2).join(" · ") || lessons[0].title;
        byPhase[pid].push({
          id: `day-${date}`,
          title: dayTitle,
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

    const todayLessons = liveLessons.filter((l) => l.date === today);
    const todaySteps = todayLessons.flatMap((l) => l.steps);
    const todayMin = todaySteps.reduce((n, s) => n + (s.min || 20), 0);
    const todayTitles = todaySteps.slice(0, 4).map((s) => s.title);
    const todayMore = todaySteps.length - todayTitles.length;

    const folded = backlog.filter((x) => x.origDate < today);
    const foldedTitles = folded.slice(0, 3).map((x) => x.step.title);
    const foldedMore = folded.length - foldedTitles.length;

    const nextDay = liveLessons.find((l) => l.date > today);
    const doneCount = Object.values(done).filter(Boolean).length;
    const totalBase = base.reduce((n, l) => n + l.steps.length, 0);

    const statusLabel =
      status === "behind"
        ? `Behind · ${overdueCount} late`
        : status === "ahead"
          ? "Ahead"
          : "On track";

    const parts = [];
    if (status === "behind") {
      parts.push(`Behind: ${overdueCount} unfinished step${overdueCount === 1 ? "" : "s"} from earlier days.`);
    } else if (status === "ahead") {
      parts.push("Ahead of the original calendar.");
    } else {
      parts.push("On track with the calendar.");
    }
    if (folded.length) {
      parts.push(
        `Moved into today/later (in order): ${foldedTitles.join("; ")}${
          foldedMore > 0 ? ` (+${foldedMore} more)` : ""
        }.`
      );
    }
    if (todaySteps.length) {
      parts.push(
        `Today (${todayMin}m): ${todayTitles.join("; ")}${todayMore > 0 ? ` (+${todayMore} more)` : ""}.`
      );
    } else {
      parts.push("Nothing packed for today.");
    }
    if (nextDay) {
      const nd = new Date(nextDay.date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      parts.push(`Next after today: ${nextDay.title} (${nd}).`);
    }
    if (trimmed) {
      parts.push(`Dropped ${trimmed} filler drill${trimmed === 1 ? "" : "s"} to fit deadlines.`);
    }
    parts.push(`Progress ${doneCount}/${totalBase} steps done · ${liveLessons.length} sessions left.`);

    C.pace = {
      status,
      statusLabel,
      overdueSteps: overdueCount,
      daysBehind,
      todayMinutes: todayMin,
      todayTitles,
      foldedCount: folded.length,
      foldedTitles,
      trimmedFiller: trimmed,
      recalibratedFor: today,
      remainingSessions: liveLessons.length,
      doneCount,
      totalBase,
      message: parts.join(" "),
      summaryLines: parts,
    };

    return C.pace;
  };
})();
