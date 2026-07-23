/*! Product builds: industry skills, hackathon demos, interview defense */
window.PROJECTS = [
  {
    id: "gambit",
    title: "Gambit",
    stack: "Python · FastAPI · React · data/ML path you can explain",
    blurb:
      "Turn Gambit into a product you can demo in 90 seconds and defend for 20 minutes: one live path, honest model sheet, API contract, deployable demo.",
    whyItMatters:
      "Sports/analytics products teach data → API → UI. Interviewers and hackathon judges both ask: what is unique, what fails, what did you build.",
    gate: "Start during free block after you can open the repo. Continue schedule already points here.",
    order: 1,
    links: [
      { label: "Gambit repo", url: "https://github.com/abhyvx/Gambit" },
      { label: "FastAPI tutorial", url: "https://fastapi.tiangolo.com/tutorial/first-steps/" },
      { label: "React Learn", url: "https://react.dev/learn" },
      { label: "sklearn getting started", url: "https://scikit-learn.org/stable/getting_started.html" },
      { label: "Example: well-written project README", url: "https://github.com/othneildrew/Best-README-Template" },
    ],
    chapters: [
      {
        id: "g1",
        title: "1. Make it boot and map the real path",
        steps: [
          {
            min: 25,
            learn:
              "A product demo starts with run commands that work. If README is wrong, the project is not shippable.",
            example:
              "Good README chunk:\n## Run API\ncd backend && uvicorn app.main:app --reload\n## Run UI\ncd frontend && npm run dev",
            do: "Clone/open Gambit. Run API and UI (or record exact errors). Fix or document blockers in repo notes. Update README run section until you can cold-start.",
            prove: "Cold start from README on your machine. Paste working commands at top of GAMBIT_PATH.md.",
            resource: { label: "Gambit repo", url: "https://github.com/abhyvx/Gambit" },
          },
          {
            min: 45,
            learn:
              "Ownership means a numbered call chain: UI event → HTTP handler → service → data/model → response. Judges ask for this on a whiteboard.",
            example:
              "Hop style:\n1. web/src/pages/Match.tsx onClick\n2. GET /predict?team=...\n3. api/routes/predict.py\n4. models/elo.py compute()\n5. JSON { score, conf }",
            do: "Pick ONE user-visible feature (prediction, ranking, match view). Walk the code. Write 6+ hops as file::function in GAMBIT_PATH.md.",
            prove: "6+ hops with real names. No vague boxes.",
            resource: { label: "Gambit repo", url: "https://github.com/abhyvx/Gambit" },
          },
          {
            min: 30,
            learn:
              "Prove an intermediate value. Prints/tests beat storytelling.",
            example:
              "print('features', features[:5])\n# or\nassert score >= 0",
            do: "Add one temporary print or assert on the path. Run the feature once. Record what you saw. Remove or gate the print.",
            prove: "Observed value written next to the hop it came from.",
            resource: { label: "FastAPI first steps", url: "https://fastapi.tiangolo.com/tutorial/first-steps/" },
          },
        ],
      },
      {
        id: "g2",
        title: "2. Honest model + API contract",
        steps: [
          {
            min: 40,
            learn:
              "If it is a heuristic, say heuristic. Fake ML gets destroyed in interviews. FEATURES → RULE/MODEL → OUTPUT is the literacy bar.",
            example:
              "FEATURES: team rating, recent form\nINFER: weighted sum / elo update\nOUTPUT: win probability 0..1\nFAILURE: missing team id → 400",
            do: "Skim sklearn getting started for vocabulary only. Write FEATURES → INFER → OUTPUT → FAILURES for your path in plain English.",
            prove: "Every jargon word has a one-line definition beside it.",
            resource: { label: "sklearn getting started", url: "https://scikit-learn.org/stable/getting_started.html" },
          },
          {
            min: 45,
            learn:
              "APIs need contracts: path, query/body, status codes, example JSON. That is how real products integrate.",
            example:
              "GET /v1/predict?home=X&away=Y\n200 {\"p_home\":0.61,\"model\":\"elo_v1\"}\n404 {\"error\":\"unknown_team\"}",
            do: "Document the endpoint(s) your path uses in ARCHITECTURE.md. If response shape is messy, add a Pydantic model or typed dict and return clean JSON.",
            prove: "Example request/response in ARCHITECTURE.md. Hit it with curl or browser.",
            resource: { label: "FastAPI response model", url: "https://fastapi.tiangolo.com/tutorial/response-model/" },
          },
        ],
      },
      {
        id: "g3",
        title: "3. Hackathon-ready demo + defense",
        steps: [
          {
            min: 35,
            learn:
              "Hackathon demos are timed stories: problem → live click → wow detail → tech one-liner → what’s next.",
            example:
              "90s script:\n1. Problem (10s)\n2. Click path (40s)\n3. Unique twist (20s)\n4. Stack (10s)\n5. Ask (10s)",
            do: "Write a 90-second demo script. Rehearse twice on phone video. Fix UI friction that wastes seconds.",
            prove: "Script in GAMBIT_PATH.md. One take under 100 seconds.",
            resource: { label: "Demo tips (YCombinator)", url: "https://www.ycombinator.com/library/8g-how-to-demo" },
          },
          {
            min: 40,
            learn:
              "ARCHITECTURE.md is your leave-behind for interviews and teammates.",
            example:
              "Sections: Overview, Data flow, Module map, Failure modes, How to run, What I'd build next",
            do: "Finish ARCHITECTURE.md for the traced module. Link it from README.",
            prove: "README links to ARCHITECTURE.md. Oral: explain it in 10 minutes with notes only.",
            resource: { label: "Gambit repo", url: "https://github.com/abhyvx/Gambit" },
          },
          {
            min: 50,
            learn:
              "Optional stretch used in real teams: Dockerize API or add CI on a pure function.",
            example:
              "GitHub Actions: checkout → setup-python → pytest\nDockerfile: FROM python:3.11-slim + uvicorn CMD",
            do: "Add either Dockerfile for API OR pytest CI on one pure helper used by the path.",
            prove: "Green CI run or `docker run` serves a health/predict route.",
            resource: {
              label: "GitHub Actions quickstart",
              url: "https://docs.github.com/en/actions/writing-workflows/quickstart",
            },
          },
        ],
      },
    ],
  },
  {
    id: "netkv",
    title: "NetKV (Mini-Redis)",
    stack: "Python sockets · pytest · Docker · GitHub Actions",
    blurb:
      "Build a tiny Redis-like TCP key-value server. This is how networked services actually work: accept loop, protocol, in-memory state, tests, container.",
    whyItMatters:
      "Systems interviews and backend jobs care that you understand sockets, protocols, and concurrency basics. Also pairs with CMSC 216 mental models.",
    gate: "Free-block schedule builds this Jul 30 to Aug 12. Use this playbook to go deeper than the daily path.",
    order: 2,
    links: [
      { label: "Python sockets HOWTO", url: "https://docs.python.org/3/howto/sockets.html" },
      { label: "Build Your Own Redis challenge", url: "https://codingchallenges.fyi/challenges/challenge-redis/" },
      { label: "Redis SET command", url: "https://redis.io/docs/latest/commands/set/" },
      { label: "pytest", url: "https://docs.pytest.org/en/stable/getting-started.html" },
      { label: "Docker build an image", url: "https://docs.docker.com/get-started/docker-concepts/building-images/build-an-image/" },
      {
        label: "Example echo server pattern",
        url: "https://docs.python.org/3/library/socket.html#example",
      },
    ],
    chapters: [
      {
        id: "n1",
        title: "1. TCP echo then line protocol",
        steps: [
          {
            min: 30,
            learn:
              "TCP gives a byte stream. You invent framing. Line-based framing (`\\n`) is enough for v1.",
            example:
              "Client sends: SET name abhy\\n\nServer replies: OK\\n",
            do: "Read sockets HOWTO server section. Sketch bind → listen → accept → recv → send in NOTES.md with one sentence each.",
            prove: "6 labeled bullets in ~/umd-prep/miniredis/NOTES.md",
            resource: { label: "Python sockets HOWTO", url: "https://docs.python.org/3/howto/sockets.html" },
          },
          {
            min: 50,
            learn:
              "Echo proves the accept loop before SET/GET complexity.",
            example:
              "server: while True: conn,addr=accept(); data=conn.recv(1024); conn.sendall(data)",
            do: "Implement server_echo.py + client_echo.py. README with exact run commands. Round-trip one line.",
            prove: "Cold README run echoes.",
            resource: {
              label: "socket examples",
              url: "https://docs.python.org/3/library/socket.html#example",
            },
          },
          {
            min: 55,
            learn:
              "Parse in pure functions so tests don't need a live port.",
            example:
              "parse('SET a b') -> ('SET','a','b')\nparse('GET a') -> ('GET','a')\nparse('LOL') -> error",
            do: "protocol.py + test_protocol.py for SET/GET/DEL/bad input. pytest -v green (8+ tests).",
            prove: "8+ green tests.",
            resource: { label: "pytest getting started", url: "https://docs.pytest.org/en/stable/getting-started.html" },
          },
        ],
      },
      {
        id: "n2",
        title: "2. In-memory KV + product polish",
        steps: [
          {
            min: 60,
            learn:
              "State = dict in the process. Responses are text. Errors must not crash the accept loop.",
            example:
              "store = {}\nSET → store[k]=v; return 'OK'\nGET → store.get(k) or '(nil)'",
            do: "Wire protocol into server_kv.py. Support SET/GET/DEL. Client can issue multiple commands. Update README with a scripted demo session.",
            prove: "Scripted session works. Follow README cold.",
            resource: {
              label: "Build Your Own Redis",
              url: "https://codingchallenges.fyi/challenges/challenge-redis/",
            },
          },
          {
            min: 45,
            learn:
              "TTL is how caches expire. Lazy expiry on read is a valid v1.",
            example:
              "store[k] = (value, expires_at)\nOn GET: if now > expires_at: delete; return nil",
            do: "Implement EXPIRE or SET with TTL. Test that a key dies after sleep.",
            prove: "Automated test proves expiry.",
            resource: { label: "Redis SET", url: "https://redis.io/docs/latest/commands/set/" },
          },
          {
            min: 50,
            learn:
              "Docker + CI are how teams ship services.",
            example:
              "Dockerfile CMD [\"python\",\"server_kv.py\"]\nActions: pip install -r requirements.txt && pytest",
            do: "Dockerfile that runs the server. GitHub Actions runs pytest on push. Document both in README.",
            prove: "docker run works; Actions green URL saved in README.",
            resource: {
              label: "Docker build an image",
              url: "https://docs.docker.com/get-started/docker-concepts/building-images/build-an-image/",
            },
          },
        ],
      },
      {
        id: "n3",
        title: "3. Defend it",
        steps: [
          {
            min: 30,
            learn:
              "Systems oral: accept loop, protocol, storage, failure modes (disconnect, bad command, huge payload).",
            example:
              "If recv returns b'': client closed. Loop should accept the next client.",
            do: "Write ARCHITECTURE.md (flow + failure modes). Record a 5-minute explanation.",
            prove: "Doc + recording path noted.",
            resource: {
              label: "Build Your Own Redis",
              url: "https://codingchallenges.fyi/challenges/challenge-redis/",
            },
          },
        ],
      },
    ],
  },
  {
    id: "terp",
    title: "TerpButler",
    stack: "Flask/Next · SQLite · TypeScript",
    blurb:
      "Campus product you can put in front of hackathon judges: boots, real README, three reliability fixes, one polished user flow.",
    whyItMatters:
      "Campus problems win local hackathons when the demo is tight. Reliability + clear UX beats feature spam.",
    gate: "Unlock after Gambit path hops exist and NetKV SET/GET works. Do not start early.",
    order: 3,
    optional: true,
    links: [
      { label: "TerpButler repo", url: "https://github.com/abhyvx/TerpButler" },
      { label: "React Learn", url: "https://react.dev/learn" },
      { label: "SQLBolt", url: "https://sqlbolt.com/" },
      { label: "TS Handbook basic types", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html" },
    ],
    chapters: [
      {
        id: "t1",
        title: "1. Boot + honest README",
        steps: [
          {
            min: 50,
            learn:
              "If it does not boot, it is not a product.",
            example:
              "README must include: what it does, prerequisites, backend command, frontend command, known bugs.",
            do: "Install deps. Start backend and frontend. Write exact commands and errors. Replace default Next.js README fluff.",
            prove: "Cold boot from README. Known bugs list ranked by ease.",
            resource: { label: "TerpButler", url: "https://github.com/abhyvx/TerpButler" },
          },
        ],
      },
      {
        id: "t2",
        title: "2. Three fixes that create a story",
        steps: [
          {
            min: 45,
            learn:
              "Reliability work is resume-real: validation, loading states, empty states, error messages.",
            example:
              "Before: crash on empty input\nAfter: 400 + UI message 'Enter a course id'",
            do: "Fix bug #1 with a regression note or test.",
            prove: "Commit with clear message.",
            resource: { label: "TerpButler", url: "https://github.com/abhyvx/TerpButler" },
          },
          {
            min: 45,
            learn: "Second fix should be user-visible.",
            do: "Fix bug #2 (session, loading, or bad empty state).",
            prove: "Commit + screenshot note of before/after.",
            resource: { label: "React Learn", url: "https://react.dev/learn" },
          },
          {
            min: 45,
            learn: "Typing removes whole classes of bugs.",
            do: "Fix bug #3 OR remove three `any`s with real types.",
            prove: "Commit.",
            resource: {
              label: "TS basic types",
              url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html",
            },
          },
        ],
      },
      {
        id: "t3",
        title: "3. Demo flow + data",
        steps: [
          {
            min: 35,
            learn:
              "Hackathon judges need one golden path under 90 seconds.",
            do: "Pick one user flow. Write 90s script. Remove clicks that do not help the story.",
            prove: "Timed rehearsal under 100s.",
            resource: { label: "How to demo", url: "https://www.ycombinator.com/library/8g-how-to-demo" },
          },
          {
            min: 30,
            learn: "SQL on your own DB proves backend literacy.",
            do: "Write 5 SQLite queries against the app DB (list, filter, join or aggregate).",
            prove: "Queries saved in TERP_MAP.md with results notes.",
            resource: { label: "SQLBolt", url: "https://sqlbolt.com/" },
          },
        ],
      },
    ],
  },
  {
    id: "hackstack",
    title: "Hackathon stack drill",
    stack: "Idea → MVP scope → demo script · uses your existing repos",
    blurb:
      "A repeatable method to ship a demoworthy slice in 24 to 36 hours using Gambit, NetKV, or TerpButler as the base instead of a random tutorial app.",
    whyItMatters:
      "Winning rooms is scoping + demo craft + a sharp unique twist, not more features.",
    gate: "Use before any hackathon. Requires at least one product bootable.",
    order: 4,
    links: [
      { label: "How to demo (YC)", url: "https://www.ycombinator.com/library/8g-how-to-demo" },
      { label: "MLH hackathon tips", url: "https://news.mlh.io/posts" },
      { label: "NeetCode roadmap (skills under pressure)", url: "https://neetcode.io/roadmap" },
    ],
    chapters: [
      {
        id: "h1",
        title: "1. Scope like a winner",
        steps: [
          {
            min: 25,
            learn:
              "One sentence problem, one user, one golden path, one twist. Everything else is cut.",
            example:
              "Problem: students miss seats\nUser: UMD undergrad\nPath: search course → see open seat → notify\nTwist: uses live scrape + SMS you already understand from realtime systems",
            do: "Fill a one-pager: problem, user, golden path (5 clicks max), twist, non-goals (explicit cuts).",
            prove: "One-pager saved as HACK_SCOPE.md",
            resource: { label: "How to demo (YC)", url: "https://www.ycombinator.com/library/8g-how-to-demo" },
          },
          {
            min: 20,
            learn:
              "Reuse a base. Greenfield in 24h usually loses.",
            do: "Choose base: Gambit, NetKV, or TerpButler. List 3 files you will touch and 3 you will not.",
            prove: "Base + file list in HACK_SCOPE.md",
            resource: { label: "Gambit", url: "https://github.com/abhyvx/Gambit" },
          },
        ],
      },
      {
        id: "h2",
        title: "2. Build order and demo",
        steps: [
          {
            min: 30,
            learn:
              "Order: data stub → API → UI → twist → polish. Never polish first.",
            example:
              "Hour 0-4 stub\n4-10 API\n10-16 UI path\n16-20 twist\n20-24 demo script + bug squash",
            do: "Write an hour-by-hour plan for a 24h hack on your chosen base.",
            prove: "Plan in HACK_SCOPE.md",
            resource: { label: "How to demo (YC)", url: "https://www.ycombinator.com/library/8g-how-to-demo" },
          },
          {
            min: 25,
            learn:
              "Practice the demo before features are 'done'.",
            do: "Write 90s script now using today's half-built UI. Note friction. Fix friction before new features.",
            prove: "Script + friction list.",
            resource: { label: "How to demo (YC)", url: "https://www.ycombinator.com/library/8g-how-to-demo" },
          },
        ],
      },
    ],
  },
];
