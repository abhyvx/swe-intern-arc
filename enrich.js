/*! Enrich every curriculum step with full teach fields + multi resources from TEACH_BANK */
(function enrichAll() {
  const C = window.CURRICULUM;
  const bank = window.TEACH_BANK;
  if (!C?.lessons || !bank?.topics) {
    console.error("enrich: missing CURRICULUM or TEACH_BANK");
    return;
  }

  const topics = Object.entries(bank.topics).map(([id, t]) => ({ id, ...t }));

  function score(step, topic) {
    const hay = `${step.id} ${step.title} ${step.learn || ""} ${step.do || ""} ${(step.teach && step.teach.idea) || ""}`.toLowerCase();
    let s = 0;
    topic.keys.forEach((k) => {
      if (hay.includes(k.toLowerCase())) s += k.length > 4 ? 3 : 2;
    });
    return s;
  }

  function bestTopic(step) {
    let best = null;
    let bestScore = 0;
    topics.forEach((t) => {
      const sc = score(step, t);
      if (sc > bestScore) {
        bestScore = sc;
        best = t;
      }
    });
    // engine fallbacks
    if (!best || bestScore < 2) {
      const fb = {
        systems: "cCompile",
        dsa: "neetcodePractice",
        build: "codebase",
        pro: "git",
      }[step.engine];
      best = bank.topics[fb] || best;
    }
    return best;
  }

  function mergeResources(existing, topicRes) {
    const out = [];
    const seen = new Set();
    function add(r) {
      if (!r?.url) return;
      const key = r.url;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ label: r.label, url: r.url, use: r.use || "Open while learning" });
    }
    (existing || []).forEach(add);
    if (existing?.url) add(existing); // single resource form
    (topicRes || []).forEach(add);
    return out;
  }

  function enrichStep(step) {
    const topic = bestTopic(step);
    const prev = step.teach || {};
    const resources = mergeResources(step.resources || (step.resource ? [step.resource] : []), topic.resources);

    // Prefer explicit rich fields already on the step; fill gaps from topic
    const teach = {
      why: prev.why && prev.why.length > 40 ? prev.why : topic.why,
      idea: prev.idea && prev.idea.length > 40 ? prev.idea : topic.idea,
      when: prev.when && prev.when.length > 20 ? prev.when : topic.when,
      walkthrough: prev.walkthrough && String(prev.walkthrough).length > 10 ? prev.walkthrough : topic.walkthrough,
      bugs: prev.bugs && prev.bugs.length > 20 ? prev.bugs : topic.bugs,
      syntax: prev.syntax || topic.syntax || "",
      code: prev.code || topic.code || "",
    };

    step.teach = teach;
    step.learn = teach.idea;
    step.example = step.example || teach.walkthrough || teach.code || "";
    step.resources = resources;
    step.resource = resources[0];
    step.topicId = topic.id || step.topicId;
    return step;
  }

  C.lessons.forEach((les) => {
    les.steps.forEach(enrichStep);
  });

  // Also enrich project playbook steps lightly
  if (window.PROJECTS) {
    window.PROJECTS.forEach((p) => {
      (p.chapters || []).forEach((ch) => {
        (ch.steps || []).forEach((s) => {
          const fake = {
            id: p.id + " " + (ch.title || ""),
            title: ch.title || p.title,
            learn: s.learn || "",
            do: s.do || "",
            engine: "build",
            teach: { idea: s.learn || "", why: p.whyItMatters || "", when: p.blurb || "" },
            resources: s.resource ? [s.resource] : [],
            resource: s.resource,
          };
          const topic = bestTopic(fake);
          s.teach = {
            why: p.whyItMatters || topic.why,
            idea: s.learn || topic.idea,
            when: topic.when,
            walkthrough: s.example || topic.walkthrough,
            bugs: topic.bugs,
            syntax: topic.syntax,
            code: s.example || topic.code,
          };
          s.resources = mergeResources(s.resource ? [s.resource] : [], topic.resources);
          if (!s.resource && s.resources[0]) s.resource = s.resources[0];
        });
      });
    });
  }

  C.meta.enriched = true;
  console.info("[enrich] steps taught:", C.lessons.reduce((n, l) => n + l.steps.length, 0));
})();
