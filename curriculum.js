/*! SWE Intern Arc: day spine
 * Summer free time: Jul 23 to Aug 15 (dense daily learning)
 * Bridge: Aug 16 to Aug 30 (travel + settle + 216 preview)
 * Fall: Aug 31 to Dec 15 (classes + winter intern ready by early Nov)
 * Every step: learn (concept + worked idea) · do · prove · resource
 * ISO dates internal only.
 */
window.CURRICULUM = {
  meta: {
    name: "SWE Intern Arc",
    person: "Abhy",
    start: "2026-07-23",
    end: "2026-12-15",
    freeUntil: "2026-08-15",
    classStart: "2026-08-31",
    winterReady: "2026-11-01",
    north:
      "By Dec: defendable projects, C/216 survival, DSA patterns, winter + Summer 2027 intern materials.",
  },
  engines: [
    {
      id: "systems",
      name: "C and systems",
      blurb: "Memory, pointers, processes, gdb. CMSC 216 survival and backend intuition.",
    },
    {
      id: "dsa",
      name: "Algorithms",
      blurb: "Interview patterns with theory, worked examples, then timed code.",
    },
    {
      id: "build",
      name: "Products",
      blurb: "Gambit, NetKV, TerpButler. Real demos you can ship and explain.",
    },
    {
      id: "pro",
      name: "Engineering practice",
      blurb: "Git, pytest, SQL, Docker, CI, cloud. How real teams ship.",
    },
  ],
  phases: [],
  lessons: [],
  lessonIndex: {},
};

(function buildCurriculum() {
  const C = window.CURRICULUM;

  const R = {
    beej: { label: "Beej Guide to C", url: "https://beej.us/guide/bgc/" },
    beejPtr: { label: "Beej pointers", url: "https://beej.us/guide/bgc/html/split/pointers.html" },
    gccWarn: { label: "GCC warning options", url: "https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html" },
    cs50ptr: { label: "CS50 pointers lecture", url: "https://www.youtube.com/watch?v=XISnO2YhQ-A" },
    malloc: { label: "malloc(3)", url: "https://man7.org/linux/man-pages/man3/malloc.3.html" },
    gdb: { label: "GDB sample session", url: "https://sourceware.org/gdb/current/onlinedocs/gdb.html/Sample-Session.html" },
    gdbYt: { label: "GDB tutorial video", url: "https://www.youtube.com/watch?v=PorfLSr3DDI" },
    ostep: { label: "OSTEP book", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
    ostepIntro: { label: "OSTEP intro PDF", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf" },
    ostepCpu: { label: "OSTEP CPU intro", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf" },
    ostepVm: { label: "OSTEP VM intro", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf" },
    roadmap: { label: "NeetCode roadmap", url: "https://neetcode.io/roadmap" },
    practice: { label: "NeetCode 150", url: "https://neetcode.io/practice" },
    hashYt: { label: "Hash table explainer", url: "https://www.youtube.com/watch?v=shs0yu1-PtA" },
    twoSum: { label: "Two Sum", url: "https://leetcode.com/problems/two-sum/" },
    twoSumYt: { label: "NeetCode Two Sum", url: "https://www.youtube.com/watch?v=KLlXCFG5TnA" },
    containsDup: { label: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/" },
    validAnagram: { label: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/" },
    groupAnagram: { label: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/" },
    buySell: { label: "Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    validPal: { label: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/" },
    longestSub: {
      label: "Longest Substring",
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    },
    container: { label: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/" },
    parentheses: { label: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/" },
    binSearch: { label: "Binary Search", url: "https://leetcode.com/problems/binary-search/" },
    binSearchYt: { label: "NeetCode Binary Search", url: "https://www.youtube.com/watch?v=s4AKP8M-riQ" },
    invertTree: { label: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/" },
    maxDepth: { label: "Max Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
    levelOrder: { label: "Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
    linkedListCycle: { label: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/" },
    mergeTwoLists: { label: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    reverseList: { label: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/" },
    sockets: { label: "Python sockets HOWTO", url: "https://docs.python.org/3/howto/sockets.html" },
    pytest: { label: "pytest getting started", url: "https://docs.pytest.org/en/stable/getting-started.html" },
    codingRedis: {
      label: "Build Your Own Redis",
      url: "https://codingchallenges.fyi/challenges/challenge-redis/",
    },
    redisDoc: { label: "Redis GET/SET docs", url: "https://redis.io/docs/latest/commands/set/" },
    missingGit: { label: "Missing Semester Git", url: "https://missing.csail.mit.edu/2020/version-control/" },
    missingShell: { label: "Missing Semester Shell", url: "https://missing.csail.mit.edu/2020/shell-tools/" },
    sqlbolt: { label: "SQLBolt", url: "https://sqlbolt.com/" },
    tsBasic: { label: "TS Basic Types", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html" },
    tsPlay: { label: "TypeScript Playground", url: "https://www.typescriptlang.org/play" },
    docker: { label: "Docker Get Started", url: "https://docs.docker.com/get-started/" },
    dockerBuild: {
      label: "Build an image",
      url: "https://docs.docker.com/get-started/docker-concepts/building-images/build-an-image/",
    },
    actions: {
      label: "GitHub Actions quickstart",
      url: "https://docs.github.com/en/actions/writing-workflows/quickstart",
    },
    fastapi: { label: "FastAPI first steps", url: "https://fastapi.tiangolo.com/tutorial/first-steps/" },
    sklearn: { label: "sklearn getting started", url: "https://scikit-learn.org/stable/getting_started.html" },
    numpy: { label: "NumPy beginners", url: "https://numpy.org/doc/stable/user/absolute_beginners.html" },
    nextwork: { label: "NextWork roadmaps", url: "https://www.nextwork.org/roadmaps/" },
    awsFree: { label: "AWS Free Tier", url: "https://aws.amazon.com/free/" },
    star: { label: "STAR method", url: "https://www.themuse.com/advice/star-interview-method" },
    gambit: { label: "Gambit repo", url: "https://github.com/abhyvx/Gambit" },
    terp: { label: "TerpButler repo", url: "https://github.com/abhyvx/TerpButler" },
    xcode: {
      label: "What are Xcode Command Line Tools?",
      url: "https://mac.install.guide/commandlinetools/index.html",
    },
    python3: { label: "Python 3 tutorial intro", url: "https://docs.python.org/3/tutorial/introduction.html" },
    dictPy: { label: "Python dict docs", url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries" },
    calc: { label: "Paul Calc II notes", url: "https://tutorial.math.lamar.edu/Classes/CalcII/CalcII.aspx" },
    assembly: { label: "CSAPP sample chapter info", url: "https://csapp.cs.cmu.edu/3e/students.html" },
    make: { label: "GNU Make intro", url: "https://www.gnu.org/software/make/manual/html_node/Introduction.html" },
    guideC: { label: "Guide: How C programs run", url: "guides/how-c-programs-run.html", use: "Read the whole page before practice" },
    guideHash: { label: "Guide: Hash maps and Two Sum", url: "guides/hash-maps-and-two-sum.html", use: "Read before coding Two Sum" },
    guidePtr: { label: "Guide: Pointers in C", url: "guides/pointers-in-c.html", use: "Read before pointer labs" },
    guideRepo: { label: "Guide: Reading a codebase", url: "guides/reading-a-codebase.html", use: "Read before opening Gambit" },
    guideTcp: { label: "Guide: TCP sockets and protocols", url: "guides/tcp-sockets-and-protocols.html", use: "Read before NetKV echo" },
  };

  function normResources(o) {
    if (o.resources && o.resources.length) return o.resources;
    if (o.resource?.url) {
      return [{ label: o.resource.label, url: o.resource.url, use: o.resource.use || o.resourceUse || "Use while learning this step" }];
    }
    throw new Error("missing resource");
  }

  function S(id, title, o) {
    const resources = normResources(o);
    const teach = o.teach || {
      why: o.why || "This skill shows up in coursework, interviews, or your products.",
      idea: o.idea || o.learn || "",
      when: o.when || "You will reuse this in later labs and projects in this arc.",
      walkthrough: o.walkthrough || o.example || "",
      bugs: o.bugs || "If stuck: re-read the idea, then the top resource, then retry a smaller piece.",
    };
    return {
      id,
      title,
      min: o.min || 20,
      engine: o.engine,
      teach,
      example: o.example || teach.walkthrough || "",
      learn: teach.idea,
      do: o.do,
      prove: o.prove,
      resources,
      resource: resources[0],
      where: o.where || "mac",
    };
  }

  const phases = [
    {
      id: "summer",
      title: "Summer free block",
      range: ["2026-07-23", "2026-08-15"],
      goal: "Most free time. Learn C memory, DSA patterns, ship Mini-Redis core, own one Gambit path.",
    },
    {
      id: "bridge",
      title: "Travel and settle",
      range: ["2026-08-16", "2026-08-30"],
      goal: "Protect gains. Light reps. Preview 216 ideas before classes.",
    },
    {
      id: "fall",
      title: "Fall semester + winter intern push",
      range: ["2026-08-31", "2026-12-15"],
      goal: "216 primary on class days. Keep DSA and build alive. Winter-intern ready by early November.",
    },
  ];
  C.phases = phases;

  // days accumulate modules as { date, title, why, lessons[] }
  const dayBag = {};

  function addDay(date, title, why, lessons) {
    dayBag[date] = { date, title, why, lessons };
  }

  function L(id, title, concept, steps) {
    return { id, title, concept, steps };
  }

  // ========== SUMMER DAYS ==========

  addDay(
    "2026-07-23",
    "How programs run + hash maps",
    "By tonight you understand compile vs run, and why a dict makes Two Sum fast.",
    [
      L("s0723-a", "Session A: How C programs actually run", "Stop treating Terminal as magic. Learn the pipeline.", [
        S("s0723-1", "Tools check (only if needed)", {
          min: 15,
          engine: "systems",
          why: "Every later C lab needs gcc. Every DSA/server lab needs python3. Confirm once.",
          idea: "gcc is the compiler. python3 runs interview practice and NetKV. On a Mac, gcc usually comes from Command Line Tools (small package), NOT the huge Xcode app.",
          when: "Any new machine, or after an OS update breaks compilers.",
          walkthrough: "Terminal → gcc --version → version line means good. If command not found → xcode-select --install → wait → retry.",
          bugs: "If python3 missing: install from python.org. Do not continue C labs without gcc.",
          do: "1) Open Terminal. 2) gcc --version. 3) python3 --version. 4) Only if gcc fails: xcode-select --install. 5) mkdir -p ~/umd-prep/cmsc216 ~/umd-prep/dsa ~/umd-prep/miniredis ~/umd-prep/notes && ls ~/umd-prep",
          prove: "Both versions work. ls shows four folders.",
          resources: [R.guideC, R.xcode],
        }),
        S("s0723-2", "Compile and run your first C program with understanding", {
          min: 40,
          engine: "systems",
          why: "CMSC 216 is C. If you only copy commands, you drown when errors appear.",
          idea: "A .c file is text. gcc turns it into a binary you run with ./name. -Wall -Wextra turns silent mistakes into warnings. main is the entry. sizeof measures bytes on THIS machine.",
          when: "Every 216 lab. Explaining compile vs run. Systems debugging.",
          walkthrough: "#include <stdio.h>\nint main(void) {\n  printf(\"%zu\\n\", sizeof(int));\n  return 0;\n}\ngcc -Wall -Wextra -o hello hello.c && ./hello",
          bugs: "expected ';' → check line above. unused variable → delete/use it. running .c instead of binary → use ./hello after compile.",
          example: "#include <stdio.h>\n\nint main(void) {\n  printf(\"Abhy\\n\");\n  printf(\"int=%zu long=%zu ptr=%zu\\n\", sizeof(int), sizeof(long), sizeof(char*));\n  return 0;\n}",
          do: "Read Guide: How C programs run first. Create ~/umd-prep/cmsc216/hello.c printing your name and sizeof(int/long/char*). Compile -Wall -Wextra. Fix warnings. Run. Write one sentence in NOTES.md: difference between hello.c and ./hello.",
          prove: "Zero warnings. Sizes printed. Sentence written.",
          resources: [R.guideC, R.beej, R.gccWarn],
        }),
      ]),
      L("s0723-b", "Session B: Hash maps until Two Sum makes sense", "Learn the idea, then code it yourself.", [
        S("s0723-3", "What a dict is for (not just syntax)", {
          min: 30,
          engine: "dsa",
          why: "Most Easy interview wins replace an inner scan with a map/set.",
          idea: "A hash map stores key → value with average O(1) lookup. Python dict is that tool. Use it when you would otherwise re-scan a list for 'have I seen X?'.",
          when: "Two Sum family, anagrams, duplicates, caching id→object in APIs.",
          walkthrough: "seen = {2: 0} means value 2 was at index 0. Checking if 7 is in seen is one step, not a full scan.",
          bugs: "List as dict key fails (unhashable). Store-after-check order bugs.",
          do: "Read Guide: Hash maps and Two Sum. In python3: create a dict, set three keys, .get a missing key. Open NeetCode Arrays and Hashing; write first 5 problem names into dsa/ROADMAP.md.",
          prove: "Explain key/value/O(1) aloud. ROADMAP.md has 5 names.",
          resources: [R.guideHash, R.dictPy, R.roadmap, R.hashYt],
        }),
        S("s0723-4", "Build Two Sum yourself", {
          min: 40,
          engine: "dsa",
          why: "Watching NeetCode without regenerating the idea fails under pressure.",
          idea: "One pass: for each x, need = target - x. If need in map, return indices. Else map[x] = i.",
          when: "Any find-a-pair / complement problem. Template for many hash questions.",
          walkthrough: "nums=[2,7,11], target=9\ni=0 store 2→0\ni=1 need=2 found → [0,1]",
          bugs: "Returning values not indices. Using same element twice. Pasting a solution you cannot rewrite.",
          example: "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        need = target - x\n        if need in seen:\n            return [seen[need], i]\n        seen[x] = i",
          do: "Paper draft 5 min. Code in Python. Cap 40. Stuck at 15: watch NeetCode once, close it, rewrite from memory. Save dsa/01_two_sum.py with Big-O. Voice note: why map beats nested loops.",
          prove: "File + complexity + voice note. No blind paste.",
          resources: [R.guideHash, R.twoSum, R.twoSumYt],
          where: "either",
        }),
      ]),
      L("s0723-c", "Session C: Read Gambit with a method", "Owning a repo is a skill.", [
        S("s0723-5", "Find the API entry with a method", {
          min: 45,
          engine: "build",
          why: "Projects die in interviews when you cannot find where work happens.",
          idea: "Do not read every file. Chase one behavior: User → UI → API → data/model. Search app=, routes, main.py, fetch(.",
          when: "Internship onboarding, hackathons, project defense.",
          walkthrough: "Open repo → search route keywords → open handler → write filepath::function as hop 1.",
          bugs: "Wandering node_modules. Skipping README. Guessing folder purpose without opening entry files.",
          do: "Read Guide: Reading a codebase. Open Gambit. Find API entry + one route/handler. Write filepath + symbol into notes/GAMBIT_PATH.md.",
          prove: "Real filepath and symbol written.",
          resources: [R.guideRepo, R.gambit, R.fastapi],
        }),
      ]),
    ]
  );

  addDay(
    "2026-07-24",
    "Arrays in C + Contains Duplicate pattern",
    "You can fill and print a C array cleanly, and you can detect duplicates with a set in O(n).",
    [
      L("s0724-a", "Session A: Arrays are contiguous memory", "Indexing is address arithmetic.", [
        S("s0724-1", "Array lab with -Wall", {
          min: 40,
          engine: "systems",
          learn:
            "`int a[10];` reserves 10 ints in a row. `a[i]` is like `*(a+i)`. Worked idea: printing `a` decays to a pointer to the first element; `sizeof(a)` in the declaring scope is 40 if int is 4 bytes.",
          do: "Write `arrays.c`: fill `int a[10]` with 0..9, print values and addresses with `%p` for `&a[i]` for i=0 and i=1. Compile `-Wall -Wextra`. How many bytes between addresses?",
          prove: "Addresses differ by sizeof(int). Zero warnings.",
          resource: R.beej,
        }),
      ]),
      L("s0724-b", "Session B: Set membership", "Duplicate check is the hash-set pattern.", [
        S("s0724-2", "Contains Duplicate", {
          min: 30,
          engine: "dsa",
          learn:
            "Insert into a set while scanning. If insert fails or value already in set, duplicate exists. Worked idea: `[1,2,3,1]` → when second 1 arrives, set already has 1.",
          do: "Solve Contains Duplicate. Save `02_contains_duplicate.py` with Big-O. Then re-type the core loop once without looking.",
          prove: "File saved. Retype done.",
          resource: R.containsDup,
        }),
      ]),
      L("s0724-c", "Session C: Gambit UI entry", "Know both ends of the stack.", [
        S("s0724-3", "Find the frontend entry", {
          min: 35,
          engine: "build",
          learn:
            "UI entry is often `package.json` scripts plus `src/main` or `app/page`. Worked idea: `npm run dev` is not architecture; the component that calls the API is.",
          do: "In Gambit, find how the UI starts and one place it calls the backend (fetch/axios/trpc/etc). Write filepath + 3 lines of what it sends/receives.",
          prove: "Filepath + request shape noted.",
          resource: R.gambit,
        }),
      ]),
    ]
  );

  addDay(
    "2026-07-25",
    "Pointers core day",
    "You can explain * and & without hand-waving, and Valid Anagram with counts.",
    [
      L("s0725-a", "Session A: CS50 pointers then code", "This is the heart of 216.", [
        S("s0725-1", "Learn pointers before coding them", {
          min: 40,
          engine: "systems",
          why: "CMSC 216 is mostly memory. If * and & are fuzzy, every lab feels like noise.",
          idea: "Variables live at addresses. &x is the address of x. A pointer stores an address. *p follows that address to a value. Declaration int *p means p is a pointer; expression *p means follow it.",
          when: "Almost every 216 assignment, strings as char*, linked structures, interview pass-by-pointer talk.",
          walkthrough: "int x=42; int *p=&x; printf(\"%d\", *p); *p=7; // x becomes 7",
          bugs: "segfault → often * on garbage/NULL. Confusing declaration * with dereference *. swap(int a,int b) cannot affect callers.",
          do: "Read Guide: Pointers in C. Watch CS50 pointers with the guide open. Write five truths in POINTERS.md in your words: address, *, &, dereference, array decay.",
          prove: "Five truths written without copying the transcript.",
          resources: [R.guidePtr, R.cs50ptr, R.beejPtr],
        }),
        S("s0725-2", "ptr_lab.c", {
          min: 35,
          engine: "systems",
          learn:
            "If `p = &x` then `*p = 7` writes into x. Worked idea: print x, &x, p, *p before and after mutation.",
          do: "Write `ptr_lab.c` as: int x=42; int *p=&x; print four values; *p=7; print x. `gcc -Wall -Wextra`. Then on phone record 40s explaining why x changed.",
          prove: "x prints 7. Recording saved.",
          resource: R.beejPtr,
          where: "either",
        }),
      ]),
      L("s0725-b", "Session B: Anagram counts", "Counting is hashing.", [
        S("s0725-3", "Valid Anagram", {
          min: 30,
          engine: "dsa",
          learn:
            "Count letters of s, decrement with t (or use Counter). If all zero, anagram. Worked idea: 'an' vs 'na' both counts {a:1,n:1}.",
          do: "Solve Valid Anagram. Save `03_valid_anagram.py`.",
          prove: "Accepted/file saved.",
          resource: R.validAnagram,
        }),
      ]),
    ]
  );

  addDay(
    "2026-07-26",
    "swap, strlen, gdb",
    "You write pointer swap and strlen, and you can stop a program in gdb.",
    [
      L("s0726-a", "Session A: Pass by pointer", "C passes copies unless you pass addresses.", [
        S("s0726-1", "Implement swap", {
          min: 35,
          engine: "systems",
          learn:
            "`void swap(int *a, int *b)` swaps through pointers. Worked idea: wrong version `void swap(int a,int b)` cannot affect callers.",
          do: "Write `swap.c` with swap and a main that prints before/after. Also implement `size_t my_strlen(const char *s)` walking until '\\0'. Test \"\", \"a\", \"hello\".",
          prove: "swap works. my_strlen matches strlen on three tests. -Wall clean.",
          resource: R.beejPtr,
        }),
        S("s0726-2", "First gdb session", {
          min: 30,
          engine: "systems",
          learn:
            "`gdb ./prog`, `break main`, `run`, `next`, `print x` lets you see state. Worked idea: compile with `-g` for debug symbols.",
          do: "Compile swap with `gcc -g -Wall -o swap swap.c`. Run gdb: break main, run, next a few times, print a variable. Write the exact commands you used.",
          prove: "Five commands listed with what you saw.",
          resource: R.gdbYt,
        }),
      ]),
      L("s0726-b", "Session B: Group Anagrams", "Map from key → list.", [
        S("s0726-3", "Group Anagrams", {
          min: 40,
          engine: "dsa",
          learn:
            "Key = sorted string or 26-count tuple. Append words to map[key]. Worked idea: 'eat' and 'tea' share key 'aet'.",
          do: "Solve Group Anagrams. Save `04_group_anagrams.py`. Retype once from memory.",
          prove: "File + retype.",
          resource: R.groupAnagram,
        }),
      ]),
    ]
  );

  addDay(
    "2026-07-27",
    "Gambit path trace (real code)",
    "You number a real data→score path with file names and one debug proof.",
    [
      L("s0727-a", "Session A: Trace one path", "Depth beats repo tourism.", [
        S("s0727-1", "Pick and number the hops", {
          min: 50,
          engine: "build",
          learn:
            "A defendable path is 5+ hops you can teach: input → transform → model/heuristic → output. Worked idea: write hop as `file::function → next`.",
          do: "In Gambit pick ONE path (data in to score/prediction out). Number at least 5 hops with real files/functions in `~/umd-prep/notes/GAMBIT_PATH.md`.",
          prove: "5+ hops with real names.",
          resource: R.gambit,
        }),
        S("s0727-2", "Add one proof print or assert", {
          min: 35,
          engine: "build",
          learn:
            "A print of an intermediate tensor/score/feature proves you are not narrating fiction.",
          do: "Add one debug print or tiny assert on that path. Run enough to see it. Note the observed value in GAMBIT_PATH.md. Revert or keep behind a flag.",
          prove: "Observed value written.",
          resource: R.gambit,
        }),
      ]),
      L("s0727-b", "Session B: Stock pattern", "Running min is a one-pass pattern.", [
        S("s0727-3", "Buy and Sell Stock", {
          min: 30,
          engine: "dsa",
          learn:
            "Track min_price so far and best profit. Worked idea: prices [7,1,5,3,6,4] → min becomes 1, profit peaks at 5.",
          do: "Solve Best Time to Buy and Sell Stock. Save `05_buy_sell.py`.",
          prove: "File saved.",
          resource: R.buySell,
        }),
      ]),
    ]
  );

  addDay(
    "2026-07-28",
    "malloc + internship 10 min + Valid Palindrome",
    "Heap allocation is concrete. Two pointers on strings.",
    [
      L("s0728-a", "Session A: Heap", "Stack frames vs heap blocks.", [
        S("s0728-1", "malloc array from argv", {
          min: 45,
          engine: "systems",
          learn:
            "`malloc(n * sizeof(int))` returns NULL on failure. Always free. Worked idea: `int *a = malloc(...); if (!a) return 1; ... free(a);`",
          do: "Write `heap_lab.c` that reads n from argv[1], mallocs n ints, fills 0..n-1, prints, frees. Handle missing argv. `gcc -Wall -Wextra`.",
          prove: "Runs for n=8. Frees. Clean warnings.",
          resource: R.malloc,
        }),
      ]),
      L("s0728-b", "Session B: Two pointers palindrome", "Skip junk, compare inward.", [
        S("s0728-2", "Valid Palindrome", {
          min: 30,
          engine: "dsa",
          learn:
            "Left and right indices. Skip non-alnum. Compare lowercased. Worked idea: 'A man, a plan...' becomes pointers moving past commas.",
          do: "Solve Valid Palindrome. Save `06_valid_palindrome.py`.",
          prove: "File saved.",
          resource: R.validPal,
        }),
      ]),
      L("s0728-c", "Session C: 10 min work capture", "Only the useful minimum.", [
        S("s0728-3", "Three lines from AIQuest today", {
          min: 10,
          engine: "pro",
          learn:
            "Winter interviews need real stories. Three lines beat a blank brain in November.",
          do: "Append to `~/umd-prep/notes/WORK.md`: date, Did, Stuck, Tomorrow. One sentence each. No essays.",
          prove: "Four lines exist for today.",
          resource: R.star,
        }),
      ]),
    ]
  );

  addDay(
    "2026-07-29",
    "structs + pytest + sockets theory",
    "Structs by pointer, and the network ideas Mini-Redis needs.",
    [
      L("s0729-a", "Session A: structs", "Grouping fields + pointer mutate.", [
        S("s0729-1", "Point move lab", {
          min: 35,
          engine: "systems",
          learn:
            "`struct Point { int x; int y; };` then `void move(struct Point *p, int dx, int dy)`. Worked idea: `p->x` is `(*p).x`.",
          do: "Write `struct_lab.c` with Point, move via pointer, print before/after. -Wall clean.",
          prove: "Demo runs.",
          resource: R.beej,
        }),
      ]),
      L("s0729-b", "Session B: pytest", "Tests unlock fearless protocol changes.", [
        S("s0729-2", "calc + tests", {
          min: 35,
          engine: "pro",
          learn:
            "`assert add(2,3)==5` in test_*.py run by pytest. Worked idea: failing test is a gift.",
          do: "In `~/umd-prep/miniredis/` create `calc.py` and `test_calc.py`. Run `python3 -m pytest -v` (install pytest if needed).",
          prove: "Green pytest output.",
          resource: R.pytest,
        }),
        S("s0729-3", "Sockets HOWTO skim with notes", {
          min: 30,
          engine: "build",
          learn:
            "TCP: socket → bind → listen → accept → recv/send. Worked idea: accept returns a new socket for one client.",
          do: "Read Python sockets HOWTO client/server sections. Write 6 bullets: socket, bind, listen, accept, send, recv.",
          prove: "6 bullets in miniredis/NOTES.md",
          resource: R.sockets,
        }),
      ]),
    ]
  );

  addDay(
    "2026-07-30",
    "TCP echo server (Mini-Redis foundation)",
    "A working echo means your accept loop is real.",
    [
      L("s0730-a", "Session A: Build echo", "Byte streams before protocols.", [
        S("s0730-1", "Echo server + client", {
          min: 70,
          engine: "build",
          why: "NetKV is a networked service. If the accept loop is fuzzy, SET/GET will feel like magic.",
          idea: "TCP is a byte stream. Server: bind, listen, accept, recv, send. Echo proves the loop before inventing SET/GET.",
          when: "Any socket service, Redis-like stores, debugging realtime connections at a high level.",
          walkthrough: "accept → recv line → send same bytes back → loop. Client connects and prints the reply.",
          bugs: "Address already in use → kill old process. Client hangs → missing response newline. Do not debug protocol until echo works.",
          do: "Read Guide: TCP sockets. Implement server_echo.py and client_echo.py in ~/umd-prep/miniredis/. README with run commands. Round-trip one line.",
          prove: "Cold README echo works.",
          resources: [R.guideTcp, R.sockets],
        }),
      ]),
      L("s0730-b", "Session B: Sliding window intro", "Window grows and shrinks.", [
        S("s0730-2", "Longest Substring attempt", {
          min: 40,
          engine: "dsa",
          learn:
            "Sliding window + set/map of chars. Expand right; shrink left on duplicate. Worked idea: 'abcabcbb' max window length 3.",
          do: "Attempt Longest Substring Without Repeating Characters. Cap 40. Save best code + stuck notes in `07_longest_sub.py`.",
          prove: "File with attempt and note of failing case if any.",
          resource: R.longestSub,
        }),
      ]),
    ]
  );

  addDay(
    "2026-07-31",
    "Protocol parser with tests",
    "SET/GET/DEL parsing is green before wiring the socket.",
    [
      L("s0731-a", "Session A: Line protocol", "Parse pure functions first.", [
        S("s0731-1", "Read Redis SET mental model", {
          min: 15,
          engine: "build",
          learn:
            "SET key value stores a string. GET returns it. Your version can be text lines, not the real RESP binary protocol yet.",
          do: "Skim Redis SET docs and Build Your Own Redis overview. Decide your line format, e.g. `SET foo bar` / `GET foo` / `DEL foo`.",
          prove: "Format written at top of protocol.py docstring.",
          resource: R.codingRedis,
        }),
        S("s0731-2", "parser + pytest", {
          min: 55,
          engine: "build",
          learn:
            "Pure parse functions return structured commands or errors. Worked idea: `parse('SET a b') -> ('SET','a','b')`.",
          do: "Implement parse in `protocol.py` with tests for SET/GET/DEL/bad input. `pytest -v` green (5+ tests).",
          prove: "5+ green tests.",
          resource: R.pytest,
        }),
      ]),
      L("s0731-b", "Session B: Container or review", "Two pointers on arrays.", [
        S("s0731-3", "Container With Most Water or re-solve Two Sum blank", {
          min: 35,
          engine: "dsa",
          learn:
            "Heights[i], heights[j], area = min(h)*width. Move the smaller height pointer. Or rebuild Two Sum from empty file.",
          do: "Attempt Container With Most Water OR rewrite Two Sum from blank in 35 min. Save file.",
          prove: "Attempt saved.",
          resource: R.container,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-01",
    "Wire SET/GET over TCP",
    "Mini-Redis speaks: set a key, get it back.",
    [
      L("s0801-a", "Session A: Dict behind the socket", "State lives in a process dict.", [
        S("s0801-1", "SET/GET server", {
          min: 70,
          engine: "build",
          learn:
            "After parse, mutate a dict. Respond with simple text OK / value / error. Worked idea: one connection can issue many commands in a loop.",
          do: "Upgrade echo server into `server_kv.py` supporting SET and GET using protocol.py. Demo from client. Update README.",
          prove: "SET then GET returns the value. README updated.",
          resource: R.codingRedis,
        }),
      ]),
      L("s0801-b", "Session B: Stack parentheses", "Stack matches nesting.", [
        S("s0801-2", "Valid Parentheses", {
          min: 30,
          engine: "dsa",
          learn:
            "Push openers; on closer, stack top must match. Worked idea: '([])' works; '([)]' fails.",
          do: "Solve Valid Parentheses. Save `08_parentheses.py`.",
          prove: "File saved.",
          resource: R.parentheses,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-02",
    "DEL + README stranger test + Binary Search theory",
    "Demo must work from README alone. Binary search halves sorted ranges.",
    [
      L("s0802-a", "Session A: Finish KV MVP", "DEL + stranger README.", [
        S("s0802-1", "Add DEL and polish README", {
          min: 50,
          engine: "build",
          learn:
            "DEL removes a key. README must list: install, run server, example session, run tests.",
          do: "Implement DEL. Rewrite README so a friend could run without you. Follow your own README from a clean terminal.",
          prove: "You followed README successfully cold.",
          resource: R.codingRedis,
        }),
      ]),
      L("s0802-b", "Session B: Binary search", "Sorted array power move.", [
        S("s0802-2", "Watch then solve Binary Search", {
          min: 40,
          engine: "dsa",
          learn:
            "lo, hi, mid. If nums[mid] < target, lo = mid+1; else hi = mid-1. Worked idea: each step throws away half.",
          do: "Watch NeetCode binary search once. Solve Binary Search. Save `09_binary_search.py`.",
          prove: "File saved. You can draw one iteration on paper.",
          resource: R.binSearch,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-03",
    "Gambit features honesty + FastAPI hello",
    "Only claim ML you can explain. Touch FastAPI for API literacy.",
    [
      L("s0803-a", "Session A: Honest model sheet", "FEATURES to OUTPUT.", [
        S("s0803-1", "Write FEATURES → INFER → OUTPUT", {
          min: 45,
          engine: "build",
          learn:
            "If it is a heuristic, say so. Worked idea: inputs listed, formula/model named, output meaning clear.",
          do: "Skim sklearn getting started for vocabulary. In GAMBIT_PATH.md write FEATURES → TRAIN/INFER → OUTPUT for your traced path in plain English.",
          prove: "No jargon without a definition beside it.",
          resource: R.sklearn,
        }),
        S("s0803-2", "FastAPI hello route", {
          min: 35,
          engine: "pro",
          learn:
            "Decorator routes map URLs to functions. Worked idea: `@app.get('/')` returns JSON.",
          do: "Follow FastAPI first steps. Run uvicorn/local server. Hit the route with browser or curl.",
          prove: "Successful response shown.",
          resource: R.fastapi,
        }),
      ]),
      L("s0803-b", "Session B: SQL start", "SELECT is backend literacy.", [
        S("s0803-3", "SQLBolt 1 to 6", {
          min: 45,
          engine: "pro",
          learn:
            "SELECT, WHERE, filtering rows. Worked idea: `WHERE year > 2010` removes rows before projection.",
          do: "Complete SQLBolt lessons 1 through 6 for real (not skim).",
          prove: "Lessons completed in the site.",
          resource: R.sqlbolt,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-04",
    "SQL joins + Git real conflict",
    "Joins and merge conflicts are weekday pro skills.",
    [
      L("s0804-a", "Session A: Joins", "Combine tables with keys.", [
        S("s0804-1", "SQLBolt 7 to 12", {
          min: 50,
          engine: "pro",
          learn:
            "INNER JOIN keeps matches. Aggregates collapse groups. Worked idea: customers joined to orders on customer_id.",
          do: "Complete SQLBolt 7 through 12.",
          prove: "Completed.",
          resource: R.sqlbolt,
        }),
      ]),
      L("s0804-b", "Session B: Git conflict lab", "You must not fear merge.", [
        S("s0804-2", "Create and fix a conflict", {
          min: 40,
          engine: "pro",
          learn:
            "Two branches edit the same lines → conflict markers. Worked idea: edit, commit both sides, merge, resolve, commit.",
          do: "Do Missing Semester Git. In a throwaway repo create a real conflict and fix it. Write the commands you used.",
          prove: "Conflict fixed. Commands listed.",
          resource: R.missingGit,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-05",
    "TypeScript types + trees intro",
    "Types on paper, recursion on trees.",
    [
      L("s0805-a", "Session A: TS basics", "Types catch bugs before runtime.", [
        S("s0805-1", "Task type in playground", {
          min: 40,
          engine: "pro",
          learn:
            "string, number, boolean, arrays, object types. Worked idea: `type Task = { id: string; done: boolean }`.",
          do: "Read TS Basic Types. In Playground define Task and a function that marks done. Screenshot or copy the snippet to notes.",
          prove: "Snippet saved.",
          resource: R.tsBasic,
        }),
      ]),
      L("s0805-b", "Session B: Tree Easy pair", "Recursion talk track.", [
        S("s0805-2", "Invert + Max Depth", {
          min: 50,
          engine: "dsa",
          learn:
            "Invert swaps left/right recursively. Max depth = 1 + max(child depths). Worked idea: empty node depth 0.",
          do: "Solve Invert Binary Tree and Max Depth. Save 10 and 11. Record 60s on phone explaining recursion for max depth.",
          prove: "Files + recording.",
          resource: R.invertTree,
          where: "either",
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-06",
    "Docker for Mini-Redis",
    "One-command demo starts looking like engineering.",
    [
      L("s0806-a", "Session A: Image and run", "Image = filesystem + start command.", [
        S("s0806-1", "Docker modules + Dockerfile", {
          min: 70,
          engine: "pro",
          learn:
            "Dockerfile FROM python, COPY, CMD/ENTRYPOINT. Worked idea: bind port 6379-like with `-p`.",
          do: "Do Docker Get Started 1-2. Write Dockerfile for Mini-Redis server. Build and run. Document in README.",
          prove: "Container serves SET/GET from host client or documented equivalent.",
          resource: R.dockerBuild,
        }),
      ]),
      L("s0806-b", "Session B: Light DSA", "Keep pattern memory warm.", [
        S("s0806-2", "Re-solve 2 Easy from blank", {
          min: 35,
          engine: "dsa",
          learn: "From-blank retrieval is the interview.",
          do: "Delete or hide solutions. Re-solve Two Sum and Valid Parentheses from empty files in 35 min total.",
          prove: "Both rewritten.",
          resource: R.practice,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-07",
    "GitHub Actions CI + OSTEP intro",
    "Green CI + OS vocabulary for 216.",
    [
      L("s0807-a", "Session A: CI", "Tests on every push.", [
        S("s0807-1", "Actions pytest workflow", {
          min: 45,
          engine: "pro",
          learn:
            "YAML workflow runs on push. Worked idea: checkout → setup-python → pytest.",
          do: "Put miniredis on GitHub if needed. Add ci.yml running pytest. Confirm green run.",
          prove: "Green run URL or screenshot note.",
          resource: R.actions,
        }),
      ]),
      L("s0807-b", "Session B: OSTEP intro", "What an OS even is.", [
        S("s0807-2", "Read OSTEP intro", {
          min: 40,
          engine: "systems",
          learn:
            "Virtualization of CPU/memory/devices. Worked idea: process = running program with its own abstraction.",
          do: "Read OSTEP intro PDF. Write 8 takeaways in cmsc216/OSTEP.md.",
          prove: "8 takeaways.",
          resource: R.ostepIntro,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-08",
    "Gambit oral + ARCHITECTURE draft",
    "If you cannot teach it, you do not own it.",
    [
      L("s0808-a", "Session A: Defense pack", "Oral then docs.", [
        S("s0808-1", "12 minute Gambit oral", {
          min: 25,
          engine: "build",
          learn: "Notes only. No scrolling the repo during the talk.",
          do: "Record 12 minutes explaining Gambit path: problem, hop list, failure modes. List gaps after.",
          prove: "Recording + gaps list in GAMBIT_PATH.md",
          resource: R.gambit,
          where: "phone",
        }),
        S("s0808-2", "ARCHITECTURE.md for one module", {
          min: 50,
          engine: "build",
          learn:
            "Inputs, outputs, failure modes, next feature. Worked idea: one page beats a wiki nobody reads.",
          do: "Write ARCHITECTURE.md in the Gambit repo (or umd-prep copy) for the traced module. Fix two gaps from the oral.",
          prove: "Doc exists with four sections.",
          resource: R.gambit,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-09",
    "NextWork AWS project 1",
    "Cloud as a finished writeup, not console tourism.",
    [
      L("s0809-a", "Session A: Guided cloud project", "Follow NextWork exactly.", [
        S("s0809-1", "Finish beginner project 1", {
          min: 80,
          engine: "pro",
          learn:
            "Services + what you built + cost notes is the resume artifact.",
          do: "Open NextWork roadmaps. Complete beginner project 1. Write `~/umd-prep/aws/project-01.md` with services, steps, cost. Skim Free Tier; delete unused resources.",
          prove: "Writeup exists. Resources cleaned or noted none left.",
          resource: R.nextwork,
        }),
      ]),
      L("s0809-b", "Session B: Linked list warm-up", "Pointers in Python form.", [
        S("s0809-2", "Reverse Linked List", {
          min: 35,
          engine: "dsa",
          learn:
            "prev, cur, nextTemp loop. Worked idea: reverse edges one by one.",
          do: "Solve Reverse Linked List. Save `12_reverse_list.py`.",
          prove: "File saved.",
          resource: R.reverseList,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-10",
    "TTL stretch or Medium + work bullets draft",
    "Systems stretch + start winter materials early.",
    [
      L("s0810-a", "Session A: TTL or Medium", "Pick based on energy.", [
        S("s0810-1", "Mini-Redis TTL lazy expiry OR one Medium", {
          min: 50,
          engine: "build",
          learn:
            "TTL: store expiry timestamp; on GET if expired, delete. Or attempt a Medium in a known pattern.",
          do: "Implement lazy TTL with a test OR attempt one NeetCode Medium timeboxed. Save notes.",
          prove: "Feature works with proof OR Medium notes saved.",
          resource: R.redisDoc,
        }),
      ]),
      L("s0810-b", "Session B: Four truthful bullets", "Winter apps need these.", [
        S("s0810-2", "Draft AIQuest bullets", {
          min: 30,
          engine: "pro",
          learn:
            "Contribution + skill. No fake metrics. Worked idea: 'Built X by doing Y, resulting in Z' only if Z is real.",
          do: "From WORK.md draft 4 bullets into `RESUME_BULLETS.md`. Read STAR page once.",
          prove: "4 bullets. Each speakable in 20 seconds.",
          resource: R.star,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-11",
    "Ship day: stranger demo",
    "One finish line crossed before the free block ends.",
    [
      L("s0811-a", "Session A: Ship", "Runnable > almost.", [
        S("s0811-1", "Cold README demo of Mini-Redis", {
          min: 60,
          engine: "build",
          learn: "A stranger session is the bar.",
          do: "On a clean terminal, follow only README to run Mini-Redis demo (SET/GET/DEL + tests). Fix README holes until it works.",
          prove: "Cold run succeeds.",
          resource: R.codingRedis,
        }),
        S("s0811-2", "5 minute Mini-Redis oral", {
          min: 10,
          engine: "build",
          learn: "Teach accept loop, protocol, dict, tests.",
          do: "Phone: 5 minute oral. Notes only.",
          prove: "Recording saved.",
          resource: R.sockets,
          where: "phone",
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-12",
    "Shell fluency + second AWS or NumPy",
    "CLI speed matters in 216 and servers.",
    [
      L("s0812-a", "Session A: Shell tools", "Pipes and composition.", [
        S("s0812-1", "Missing Semester shell + tiny script", {
          min: 45,
          engine: "pro",
          learn:
            "Pipes connect stdout to stdin. Worked idea: `cat x | grep y | wc -l`.",
          do: "Do Missing Semester shell lesson. Write a tiny bash helper useful to you (e.g. cd umd-prep + ls).",
          prove: "Script runs.",
          resource: R.missingShell,
        }),
      ]),
      L("s0812-b", "Session B: NumPy or NextWork 2", "Pick one deep block.", [
        S("s0812-2", "NumPy snippets OR NextWork project 2", {
          min: 50,
          engine: "build",
          learn: "Arrays/vector ops show up in Gambit-like work; second cloud project doubles signal.",
          do: "Either run 8 NumPy beginner snippets and note them, OR finish NextWork project 2 with project-02.md.",
          prove: "Notes or writeup exists.",
          resource: R.numpy,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-13",
    "Merge Two Lists + STAR stories",
    "Linked list pattern + behavioral ammo.",
    [
      L("s0813-a", "Session A: Merge lists", "Dummy head pattern.", [
        S("s0813-1", "Merge Two Sorted Lists", {
          min: 40,
          engine: "dsa",
          learn:
            "Dummy node simplifies edge cases. Compare heads, advance smaller. Worked idea: attach remainder when one list empties.",
          do: "Solve Merge Two Sorted Lists. Save `13_merge_lists.py`.",
          prove: "File saved.",
          resource: R.mergeTwoLists,
        }),
      ]),
      L("s0813-b", "Session B: Two STAR stories", "Winter interviews ask these.", [
        S("s0813-2", "Write two STAR stories", {
          min: 35,
          engine: "pro",
          learn:
            "Situation, Task, Action, Result. Prefer real AIQuest debug + one docs/cost/test story.",
          do: "Write 2 STAR stories in `BRAG.md` with labels S/T/A/R. Phone: speak one in 90 seconds.",
          prove: "Two labeled stories + oral done.",
          resource: R.star,
          where: "either",
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-14",
    "Review tournament + closeout light",
    "Retrieval day. Pack knowledge before travel.",
    [
      L("s0814-a", "Session A: From-blank tournament", "3 problems, empty files.", [
        S("s0814-1", "Re-solve three", {
          min: 55,
          engine: "dsa",
          learn: "Misses become tomorrow's drill list.",
          do: "From blank: Two Sum, Valid Parentheses, Max Depth (or Invert). 55 min total. Mark fails.",
          prove: "Results logged in dsa/REVIEW.md",
          resource: R.practice,
        }),
      ]),
      L("s0814-b", "Session B: Closeout packet", "Capture work before context dies.", [
        S("s0814-2", "INTERNSHIP_CLOSEOUT.md", {
          min: 40,
          engine: "pro",
          learn: "Tools, bugs, thanks, final bullets.",
          do: "Write INTERNSHIP_CLOSEOUT.md: projects, tools, bugs fixed, what you would redo, thanks, paste final 4 bullets.",
          prove: "All sections present.",
          resource: R.star,
        }),
      ]),
    ]
  );

  addDay(
    "2026-08-15",
    "Free-block finale",
    "Lock demos. Rest enough to travel. You should feel different than Jul 23.",
    [
      L("s0815-a", "Session A: Final proofs", "Show yourself the artifacts.", [
        S("s0815-1", "Run both demos cold", {
          min: 40,
          engine: "build",
          learn: "Confidence is a green run + an oral.",
          do: "Cold run Mini-Redis README demo. Open GAMBIT_PATH.md and ARCHITECTURE and speak 5 minutes without code.",
          prove: "Both done. Note time in SHIP.md",
          resource: R.gambit,
        }),
        S("s0815-2", "Pack list for school machine", {
          min: 15,
          engine: "pro",
          learn: "umd-prep must survive travel.",
          do: "Confirm git remotes for Mini-Redis/Gambit. List what must be on the school laptop. Optional rest after.",
          prove: "Remotes verified or push done.",
          resource: R.missingGit,
        }),
      ]),
    ]
  );

  // ========== BRIDGE Aug 16-30 ==========
  function eachDate(from, to, fn) {
    const a = new Date(from + "T12:00:00");
    const b = new Date(to + "T12:00:00");
    let i = 0;
    for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1), i++) {
      fn(d.toISOString().slice(0, 10), d.getDay(), i);
    }
  }

  addDay("2026-08-16", "Travel eve: optional micro only", "Do not start new systems. Protect energy.", [
    L("b0816", "Optional review or rest", "Rest is allowed.", [
      S("b0816-1", "Re-read GAMBIT_PATH or rest", {
        min: 20,
        engine: "build",
        learn: "Spaced review beats new chaos the day before travel.",
        do: "Either re-read GAMBIT_PATH.md for 20 min OR deliberately rest. Mark which.",
        prove: "Choice noted in SHIP.md",
        resource: R.gambit,
      }),
    ]),
  ]);

  addDay("2026-08-17", "Travel", "Access check only.", [
    L("b0817", "Arrive", "Heavy learning paused.", [
      S("b0817-1", "Confirm umd-prep reachable", {
        min: 15,
        engine: "pro",
        learn: "If files are only on one disk, fix that now.",
        do: "Open ~/umd-prep or clone repos on the machine you will use. Sleep.",
        prove: "Folders open.",
        resource: R.missingGit,
      }),
    ]),
  ]);

  // Aug 18-30: rotating concrete bridge days
  const bridgePlans = [
    {
      title: "Pointers rewrite from memory",
      why: "216 will assume this is automatic.",
      concept: "Retrieve pointer knowledge without notes first.",
      steps: [
        S("br-ptr-1", "Blank page pointers", {
          min: 35,
          engine: "systems",
          learn: "Write definitions before peeking POINTERS.md.",
          do: "From memory write: *, &, dereference, array decay, swap signature. Then compare to POINTERS.md and fix gaps. Recompile ptr_lab.c.",
          prove: "Gaps fixed. ptr_lab runs.",
          resource: R.beejPtr,
        }),
        S("br-ptr-2", "One Easy LC", {
          min: 30,
          engine: "dsa",
          learn: "Keep hands warm.",
          do: "One Easy from your past set, from blank if possible.",
          prove: "Solution file touched today.",
          resource: R.practice,
        }),
      ],
    },
    {
      title: "OSTEP processes",
      why: "Process abstraction shows up early in systems courses.",
      concept: "What is a process, mechanistically.",
      steps: [
        S("br-os-1", "CPU intro chapter", {
          min: 45,
          engine: "systems",
          learn: "Process API ideas: create, destroy, wait, status.",
          do: "Read OSTEP CPU intro PDF. Write 8 takeaways + 2 questions you will ask in 216.",
          prove: "Takeaways in OSTEP.md",
          resource: R.ostepCpu,
        }),
        S("br-os-2", "Linked List Cycle", {
          min: 35,
          engine: "dsa",
          learn: "Floyd tortoise/hare or set of nodes.",
          do: "Solve Linked List Cycle. Save file.",
          prove: "File saved.",
          resource: R.linkedListCycle,
        }),
      ],
    },
    {
      title: "Make and multi-file C",
      why: "216 projects are not one .c file forever.",
      concept: "Header + source + Makefile.",
      steps: [
        S("br-make-1", "Two-file C program", {
          min: 50,
          engine: "systems",
          learn: "util.h declares; util.c defines; main.c includes. Makefile builds.",
          do: "Split a small helper (e.g. my_strlen) into .h/.c and main. Write a Makefile. Build with make.",
          prove: "`make` builds and runs.",
          resource: R.make,
        }),
      ],
    },
    {
      title: "Level order + BFS idea",
      why: "Queue + tree is an interview staple.",
      concept: "BFS layer by layer.",
      steps: [
        S("br-bfs-1", "Level Order Traversal", {
          min: 45,
          engine: "dsa",
          learn: "Queue nodes; for each layer size, drain that many.",
          do: "Solve Binary Tree Level Order Traversal. Save file. Draw one queue state on paper.",
          prove: "File + drawing photo/note.",
          resource: R.levelOrder,
        }),
      ],
    },
    {
      title: "MATH 241 warm skills",
      why: "Calc will not wait for your internship brain.",
      concept: "Integration techniques review.",
      steps: [
        S("br-math-1", "Integration practice block", {
          min: 40,
          engine: "pro",
          learn: "u-sub and parts show up constantly.",
          do: "From Paul Calc II notes, do 6 integrals (u-sub and parts mix). Show work on paper or tablet.",
          prove: "6 attempts with answers checked.",
          resource: R.calc,
        }),
        S("br-math-2", "One DSA Easy", {
          min: 25,
          engine: "dsa",
          learn: "Short keep-warm.",
          do: "One Easy timed 25 min.",
          prove: "Logged.",
          resource: R.roadmap,
        }),
      ],
    },
    {
      title: "Mini-Redis harden hour",
      why: "Keep the systems project alive across travel.",
      concept: "Fix README friction or add one test.",
      steps: [
        S("br-mr-1", "Improve one sharp edge", {
          min: 45,
          engine: "build",
          learn: "Harden error messages or add a test for bad commands.",
          do: "Add one test or improve error handling in Mini-Redis. Commit.",
          prove: "Commit done. pytest still green.",
          resource: R.pytest,
        }),
      ],
    },
    {
      title: "Gambit gap fix",
      why: "Oral gaps become study tickets.",
      concept: "Close one misunderstanding in code.",
      steps: [
        S("br-gam-1", "Fix one oral gap", {
          min: 40,
          engine: "build",
          learn: "Read the exact function you fumbled.",
          do: "From GAMBIT_PATH gaps, open the file you botched. Write 10 lines correcting your understanding. Optional tiny comment in code.",
          prove: "Correction written.",
          resource: R.gambit,
        }),
      ],
    },
  ];

  eachDate("2026-08-18", "2026-08-30", (iso, dow, i) => {
    if (dayBag[iso]) return;
    const plan = bridgePlans[i % bridgePlans.length];
    addDay(iso, plan.title, plan.why, [
      L(`b-${iso}`, plan.title, plan.concept, plan.steps.map((st, idx) => ({ ...st, id: `${st.id}-${iso}-${idx}` }))),
    ]);
  });

  // ========== FALL Aug 31 - Dec 15 ==========
  // Dense weekly teaching. Each scheduled day has multi-step lessons with examples.
  // Recruiting for winter/spring internships is engineering practice, not a fake "pack" project.

  const climbingStairs = { label: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/" };
  const numIslands = { label: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/" };
  const houseRobber = { label: "House Robber", url: "https://leetcode.com/problems/house-robber/" };
  const ycDemo = { label: "How to demo (YC)", url: "https://www.ycombinator.com/library/8g-how-to-demo" };
  const fastapiResp = { label: "FastAPI response model", url: "https://fastapi.tiangolo.com/tutorial/response-model/" };

  const fallWeeks = [
    {
      title: "Fall W1: memory map + boot camp",
      mon: [
        S("fw1-s1", "Stack vs heap vs global in one program", {
          min: 40, engine: "systems",
          learn: "Locals live on the stack, malloc on the heap, globals/statics in data. Printing addresses makes the model real for 216.",
          example: "int local=1;\nstatic int dur=2;\nint *h=malloc(sizeof(int));\nprintf(\"%p %p %p\", (void*)&local,(void*)&dur,(void*)h);",
          do: "Write memory_map.c that prints addresses of a local, a static/global, and a malloc block. Annotate which region in comments. gcc -Wall -Wextra. Free the heap block.",
          prove: "Program runs. Comments name stack/heap/data. Zero warnings.",
          resource: R.beejPtr,
        }),
        S("fw1-s2", "Redraw pointer truths from class week", {
          min: 25, engine: "systems",
          learn: "216 assumes * and & are automatic. Retrieval > rereading.",
          example: "int x=3; int *p=&x; *p=9; // x is 9",
          do: "From memory rewrite five pointer truths. Diff against POINTERS.md. Fix gaps. Recompile ptr_lab.c.",
          prove: "Gaps fixed. ptr_lab runs.",
          resource: R.cs50ptr,
        }),
      ],
      tue: [
        S("fw1-d1", "Hashing blank tournament", {
          min: 45, engine: "dsa",
          learn: "Set/map patterns must come back without notes.",
          example: "seen=set();\nfor n in nums:\n  if n in seen: return True\n  seen.add(n)",
          do: "From blank files: Contains Duplicate + Valid Anagram in 45 min. Log misses in dsa/REVIEW.md.",
          prove: "Both attempted. Misses logged.",
          resource: R.practice,
        }),
      ],
      thu: [
        S("fw1-b1", "NetKV cold boot on school network", {
          min: 40, engine: "build",
          learn: "Travel breaks paths. A product that only works on one laptop is not a product.",
          example: "python server_kv.py\npython client.py\nSET a 1 → GET a",
          do: "Follow NetKV README cold. Run pytest. Fix breakage. 5 min oral of accept loop on phone.",
          prove: "Tests green. Oral saved.",
          resource: R.codingRedis,
          where: "either",
        }),
      ],
      sat: [
        S("fw1-g1", "Gambit golden path still boots", {
          min: 50, engine: "build",
          learn: "Hackathon bases die when install instructions rot.",
          example: "README: API command + UI command + one curl to predict/health",
          do: "Cold start Gambit. Hit one endpoint. Update README if wrong. Confirm GAMBIT_PATH hops still match code.",
          prove: "Cold start works. Path file dated today.",
          resource: R.gambit,
        }),
        S("fw1-p1", "Resume evidence inventory (not fluff)", {
          min: 25, engine: "pro",
          learn: "Intern apps need evidence: bullets tied to artifacts (repo, metrics only if real, STAR).",
          example: "Bullet ↔ artifact\nNetKV ↔ README demo\nGambit ↔ ARCHITECTURE.md\nAIQuest ↔ WORK.md",
          do: "Create EVIDENCE.md mapping each resume bullet to a file/demo. No fake metrics.",
          prove: "Every draft bullet has an artifact link/path.",
          resource: R.star,
        }),
      ],
    },
    {
      title: "Fall W2: gdb + binary search mastery",
      mon: [
        S("fw2-s1", "Find a bug with gdb, not printf spam", {
          min: 45, engine: "systems",
          learn: "break, run, backtrace, print are enough to start. Compile with -g.",
          example: "gcc -g -Wall -o lab lab.c\ngdb ./lab\n(gdb) break main\n(gdb) run\n(gdb) print x",
          do: "Introduce a deliberate bug in a C lab. Use gdb to find it. Write the exact commands and what each showed.",
          prove: "Command log with observations. Bug fixed.",
          resource: R.gdb,
        }),
      ],
      tue: [
        S("fw2-d1", "Binary search invariant", {
          min: 50, engine: "dsa",
          learn: "Maintain lo..hi as the range that may still hold target. Mid calculation must avoid sticky loops.",
          example: "while lo<=hi:\n  mid=(lo+hi)//2\n  if nums[mid]<target: lo=mid+1\n  elif nums[mid]>target: hi=mid-1\n  else: return mid",
          do: "Watch NeetCode binary search once. Solve from blank. Write the loop invariant in 6 lines in REVIEW.md.",
          prove: "Accepted/file saved + invariant written.",
          resource: R.binSearchYt,
        }),
      ],
      thu: [
        S("fw2-b1", "Close one Gambit architecture gap with code citation", {
          min: 45, engine: "build",
          learn: "Gaps from orals become tickets. Close with file:line evidence.",
          example: "Gap: 'not sure where features built'\nClosed: services/features.py:42 build_row()",
          do: "Pick one GAMBIT_PATH gap. Open the file. Write the corrected understanding with file:line. Optional tiny comment in code.",
          prove: "Gap marked closed with citation.",
          resource: R.gambit,
        }),
      ],
      sat: [
        S("fw2-p1", "SQL joins that backends actually use", {
          min: 50, engine: "pro",
          learn: "INNER JOIN keeps matches. Aggregates answer 'how many per group'.",
          example: "SELECT c.name, COUNT(o.id)\nFROM customers c\nJOIN orders o ON o.customer_id=c.id\nGROUP BY c.name;",
          do: "Complete or redo SQLBolt 7-12. Save 3 example queries you wrote by hand in sql/NOTES.md.",
          prove: "3 queries saved with what they return in plain English.",
          resource: R.sqlbolt,
        }),
      ],
    },
    {
      title: "Fall W3: processes + BFS",
      mon: [
        S("fw3-s1", "What a process is (OSTEP)", {
          min: 50, engine: "systems",
          learn: "A process is a running program with its own abstracted CPU/memory view. 216 will talk create/wait/status.",
          example: "Cheat sheet headers: create, destroy, wait, status, why fork exists (even if not coded yet)",
          do: "Read OSTEP CPU intro PDF. Make a 1-page cheat sheet in your words + 2 office-hour questions.",
          prove: "Cheat sheet exists.",
          resource: R.ostepCpu,
        }),
      ],
      tue: [
        S("fw3-d1", "BFS level order", {
          min: 45, engine: "dsa",
          learn: "Queue nodes. Process layer by layer using layer size.",
          example: "q=deque([root])\nwhile q:\n  level=[]\n  for _ in range(len(q)):\n    n=q.popleft(); level.append(n.val)\n    ...",
          do: "Solve Level Order from blank. Draw one queue state on paper/photo.",
          prove: "File + drawing.",
          resource: R.levelOrder,
        }),
      ],
      thu: [
        S("fw3-b1", "NetKV: better errors or second client example", {
          min: 50, engine: "build",
          learn: "Product polish is error messages and docs that prevent misuse.",
          example: "ERR wrong number of args for 'SET'\nERR unknown command",
          do: "Improve bad-command errors OR add a second client example script. Commit + README note.",
          prove: "Commit hash noted. pytest green.",
          resource: R.sockets,
        }),
      ],
      sat: [
        S("fw3-p1", "MATH 241 technique block", {
          min: 40, engine: "pro",
          learn: "Calc grades matter for GPA; keep a weekly technique block.",
          example: "Pick 5: u-sub / parts mix from current unit",
          do: "Do 5 problems from current MATH 241 unit (Paul notes if stuck). Show work.",
          prove: "5 attempts checked.",
          resource: R.calc,
        }),
      ],
    },
    {
      title: "Fall W4: virtual memory + API contracts",
      mon: [
        S("fw4-s1", "Address spaces and segfaults", {
          min: 45, engine: "systems",
          learn: "Each process has an address space illusion. Segfaults are often illegal deref / freed memory.",
          example: "int *p=NULL; *p=1; // segfault",
          do: "Read OSTEP VM intro. Write 6 takeaways + connect to one segfault you caused in C labs.",
          prove: "Takeaways in OSTEP.md",
          resource: R.ostepVm,
        }),
      ],
      tue: [
        S("fw4-d1", "Medium in a known pattern", {
          min: 50, engine: "dsa",
          learn: "Write approach before code. Timebox. Notes beat ego.",
          example: "Approach:\n1. pattern = sliding window\n2. need map of counts\n3. shrink when invalid",
          do: "Pick one Medium on NeetCode in window/hash/tree. 45 min code + 5 min notes even if unsolved.",
          prove: "Approach notes saved.",
          resource: R.roadmap,
        }),
      ],
      thu: [
        S("fw4-b1", "Gambit: clean response model", {
          min: 55, engine: "build",
          learn: "Typed responses are how APIs become products.",
          example: "class PredictOut(BaseModel):\n  p_home: float\n  model: str",
          do: "Add/confirm a clean response model on your predict/score route. Document example JSON in ARCHITECTURE.md. curl it.",
          prove: "Example JSON + curl command recorded.",
          resource: fastapiResp,
        }),
      ],
      sat: [
        S("fw4-p1", "TypeScript on a real function", {
          min: 45, engine: "pro",
          learn: "any hides bugs. Type the inputs/outputs you actually use.",
          example: "type TeamId = string\nfunction score(home: TeamId, away: TeamId): number",
          do: "Type one real function in Gambit/TerpButler UI or Playground exercise saved to notes if repo blocked.",
          prove: "Snippet or commit.",
          resource: R.tsBasic,
        }),
      ],
    },
    {
      title: "Fall W5: make + linked lists",
      mon: [
        S("fw5-s1", "Multi-file C + Makefile", {
          min: 55, engine: "systems",
          learn: "Headers declare, .c defines, make builds. 216 projects grow past one file.",
          example: "util.h / util.c / main.c\nmake → gcc -Wall -c ... && gcc -o app ...",
          do: "Extend your Makefile project with a second helper + make clean. Build and run.",
          prove: "`make` and `make clean` work.",
          resource: R.make,
        }),
      ],
      tue: [
        S("fw5-d1", "Reverse + merge lists from blank", {
          min: 55, engine: "dsa",
          learn: "prev/cur/nextTemp reverse. Dummy head merge.",
          example: "dummy=ListNode(0); tail=dummy\nwhile l1 and l2: attach smaller; advance",
          do: "From blank: Reverse Linked List + Merge Two Sorted Lists in 55 min.",
          prove: "Both files saved.",
          resource: R.reverseList,
        }),
      ],
      thu: [
        S("fw5-b1", "Rebuild NetKV Docker image", {
          min: 45, engine: "build",
          learn: "Images rot after dependency changes. Rebuild on the school machine.",
          example: "docker build -t netkv .\ndocker run --rm -p 6379:6379 netkv",
          do: "Rebuild image. Fix Dockerfile if needed. Document the exact commands.",
          prove: "Container serves SET/GET or documented equivalent.",
          resource: R.dockerBuild,
        }),
      ],
      sat: [
        S("fw5-p1", "Behavioral story polish from real work", {
          min: 30, engine: "pro",
          learn: "STAR with labeled parts. Prefer debug + reliability/tests/docs.",
          example: "S: ...\nT: ...\nA: ...\nR: ...",
          do: "Refine one STAR in BRAG.md. Record 90s oral.",
          prove: "Oral saved. Story labeled.",
          resource: R.star,
          where: "either",
        }),
      ],
    },
    {
      title: "Fall W6: graphs prelude + cloud finish",
      mon: [
        S("fw6-s1", "Growing 216 sheet from YOUR lectures", {
          min: 40, engine: "systems",
          learn: "Exam sheets fail when they are generic. Fill with what your class actually covered.",
          example: "Topic | definition in my words | tiny example | still fuzzy?",
          do: "Create/update 216_SHEET.md with this month's lecture topics. If behind, add pointers/malloc/processes from OSTEP.",
          prove: "At least 8 rows filled.",
          resource: R.ostep,
        }),
      ],
      tue: [
        S("fw6-d1", "Number of Islands or tree redo", {
          min: 50, engine: "dsa",
          learn: "Grid DFS/BFS marks visited components.",
          example: "if grid[r][c]=='1': dfs mark '0'; islands += 1",
          do: "Attempt Number of Islands OR blank redo Level Order + Max Depth if graph not ready.",
          prove: "Attempt saved with notes.",
          resource: numIslands,
        }),
      ],
      thu: [
        S("fw6-b1", "Gambit 12-minute whiteboard", {
          min: 25, engine: "build",
          learn: "No scrolling. Notes only. Gaps become next tickets.",
          do: "Record 12 min Gambit defense. Update gaps list.",
          prove: "Recording + updated gaps.",
          resource: R.gambit,
          where: "phone",
        }),
      ],
      sat: [
        S("fw6-p1", "Finish second cloud writeup or cost cleanup", {
          min: 60, engine: "pro",
          learn: "Cloud signal is a finished writeup + no surprise bills.",
          example: "project-02.md: services, architecture sketch, cost, delete checklist",
          do: "Complete NextWork project 2 writeup OR verify AWS resources deleted and note proof.",
          prove: "Writeup or cleanup log dated.",
          resource: R.nextwork,
        }),
      ],
    },
    {
      title: "Fall W7: DP intro + TerpButler gate check",
      mon: [
        S("fw7-s1", "Reproduce one 216 lecture demo from scratch", {
          min: 50, engine: "systems",
          learn: "If you can rebuild it without looking, you own it.",
          do: "Pick one lecture demo. Rewrite from memory. Compare. gdb if broken.",
          prove: "Working rewrite + short diff notes of what you forgot.",
          resource: R.gdbYt,
        }),
      ],
      tue: [
        S("fw7-d1", "Climbing Stairs recurrence", {
          min: 40, engine: "dsa",
          learn: "dp[i]=dp[i-1]+dp[i-2]. Write the recurrence before code.",
          example: "dp[1]=1; dp[2]=2\nfor i in 3..n: dp[i]=dp[i-1]+dp[i-2]",
          do: "Solve Climbing Stairs. Comment the recurrence. Optional: House Robber if finished early.",
          prove: "File with recurrence comment.",
          resource: climbingStairs,
        }),
      ],
      thu: [
        S("fw7-b1", "TerpButler only if gates met", {
          min: 60, engine: "build",
          learn: "Do not open a third product early. Gates: Gambit hops + NetKV SET/GET.",
          example: "If gates fail: polish NetKV tests instead.",
          do: "If gates met: boot TerpButler, replace default README, list top 5 bugs. Else add 2 NetKV tests and commit.",
          prove: "Either TERP_MAP.md started or NetKV tests added.",
          resource: R.terp,
        }),
      ],
      sat: [
        S("fw7-p1", "Resume PDF from evidence only", {
          min: 40, engine: "pro",
          learn: "Bullets map to EVIDENCE.md. No inflation.",
          do: "Update Downloads/Abhy_Career resume PDF/text with AIQuest + NetKV + Gambit lines that you can demo.",
          prove: "Resume updated. Each new bullet has evidence.",
          resource: R.star,
        }),
      ],
    },
    {
      title: "Fall W8: complexity talk + Mediums",
      mon: [
        S("fw8-s1", "Count operations in a C nested loop", {
          min: 40, engine: "systems",
          learn: "Interviewers ask Big-O on code you write, including C.",
          example: "for i in 0..n-1:\n  for j in i+1..n-1: // ~ n^2/2",
          do: "Write a small C nested loop. Estimate iterations. Document why nested is required or how to improve.",
          prove: "Notes with estimate.",
          resource: R.gccWarn,
        }),
      ],
      tue: [
        S("fw8-d1", "Medium with approach-first discipline", {
          min: 55, engine: "dsa",
          learn: "Approach paragraph before typing code.",
          do: "One Medium 50 min. Approach notes mandatory before code.",
          prove: "Notes timestamped above code in file.",
          resource: R.roadmap,
        }),
      ],
      thu: [
        S("fw8-b1", "Confirm CI still green", {
          min: 30, engine: "build",
          learn: "Green CI is maintenance, not a one-time trophy.",
          do: "Push a trivial NetKV or Gambit change. Confirm Actions green. Fix if red.",
          prove: "Green run link in SHIP.md",
          resource: R.actions,
        }),
      ],
      sat: [
        S("fw8-p1", "MATH 241 timed set", {
          min: 40, engine: "pro",
          learn: "Timed practice beats last-minute cram.",
          do: "40 min timed problems from current unit or past quiz style.",
          prove: "Score/notes logged.",
          resource: R.calc,
        }),
      ],
    },
    {
      title: "Fall W9: early Nov materials lock",
      mon: [
        S("fw9-s1", "216 project progress with blockers listed", {
          min: 55, engine: "systems",
          learn: "Office hours need specific questions.",
          example: "Blocker: segfault in parse_args line 88 after free",
          do: "Make measurable progress on current 216 assignment. Write blockers as OH questions.",
          prove: "Progress note + questions list.",
          resource: R.beej,
        }),
      ],
      tue: [
        S("fw9-d1", "Four-pattern blank set", {
          min: 70, engine: "dsa",
          learn: "Hash, two pointers, stack, tree: one each from blank.",
          do: "70 min tournament across those four patterns. Log fails.",
          prove: "REVIEW.md updated.",
          resource: R.practice,
        }),
      ],
      thu: [
        S("fw9-b1", "90-second demos for both products", {
          min: 40, engine: "build",
          learn: "Interview and hackathon demos share the same script muscles.",
          example: "problem → click path → twist → stack → ask",
          do: "Write and time 90s scripts for NetKV and Gambit. Use YC demo guidance.",
          prove: "Both scripts timed aloud under 100s.",
          resource: ycDemo,
        }),
      ],
      sat: [
        S("fw9-p1", "Target list for winter/spring SWE intern roles", {
          min: 45, engine: "pro",
          learn: "A target list with links and status beats random applying.",
          example: "Company | role link | status | date | notes",
          do: "Create APPLICATIONS.md with 12+ SWE intern targets (winter/spring/summer as available). Freeze bullets/STAR references.",
          prove: "12 rows. Bullets frozen pointer to EVIDENCE.md",
          resource: R.star,
        }),
      ],
    },
    {
      title: "Fall W10: apply + product Q&A",
      mon: [
        S("fw10-s1", "Same-day 216 lecture redo", {
          min: 45, engine: "systems",
          learn: "Rewrite definitions the day you hear them.",
          do: "Redo today's lecture into 216_SHEET.md + one practice problem.",
          prove: "Dated section added.",
          resource: R.ostep,
        }),
      ],
      tue: [
        S("fw10-d1", "Drill your weakest pattern", {
          min: 45, engine: "dsa",
          learn: "Fails from W9 become today's focus.",
          do: "Two problems in your weakest pattern. Second from blank.",
          prove: "Logged.",
          resource: R.roadmap,
        }),
      ],
      thu: [
        S("fw10-b1", "Self mock: 8 product questions", {
          min: 35, engine: "build",
          learn: "Answer without opening the repo first.",
          example: "What fails if input is empty? What's the time complexity of infer? What would you build next?",
          do: "Write 8 likely questions. Answer on voice notes. Fix docs where you fail.",
          prove: "Q list + fixes noted.",
          resource: R.gambit,
          where: "either",
        }),
      ],
      sat: [
        S("fw10-p1", "Submit a truthful batch", {
          min: 60, engine: "pro",
          learn: "Quality batch with real bullets. Log everything.",
          do: "Submit 5 applications or tracked outreaches. Update APPLICATIONS.md statuses.",
          prove: "5 rows marked submitted/sent.",
          resource: R.star,
        }),
      ],
    },
    {
      title: "Fall W11: systems sheet + mixed set",
      mon: [
        S("fw11-s1", "Expand 216 sheet for remaining exams", {
          min: 45, engine: "systems",
          learn: "Fragile topics get rewritten from memory.",
          do: "Update 216_SHEET.md. Mark fuzzy rows. Schedule OH if needed.",
          prove: "Fuzzy list explicit.",
          resource: R.ostepVm,
        }),
      ],
      tue: [
        S("fw11-d1", "Mixed Easy/Medium timed set", {
          min: 60, engine: "dsa",
          learn: "No cherry-picking after first pick.",
          do: "3 problems in 60 min from roadmap order.",
          prove: "Times logged.",
          resource: R.practice,
        }),
      ],
      thu: [
        S("fw11-b1", "Cold run NetKV during crunch", {
          min: 25, engine: "build",
          learn: "Demos die in finals week if never exercised.",
          do: "Cold README run once. Fix if broken.",
          prove: "SHIP.md note.",
          resource: R.codingRedis,
        }),
      ],
      sat: [
        S("fw11-p1", "Follow-ups + STAR bank", {
          min: 30, engine: "pro",
          learn: "Polite follow-ups. Keep stories current.",
          do: "Update APPLICATION statuses. Send 2 follow-ups if appropriate. Polish STAR bank.",
          prove: "Statuses updated.",
          resource: R.star,
        }),
      ],
    },
    {
      title: "Fall W12: finals priority",
      mon: [
        S("fw12-s1", "Five fragile 216 topics from memory", {
          min: 50, engine: "systems",
          learn: "GPA is part of hireability.",
          do: "Rewrite 5 fragile topics from memory into a one-pager. Compare to sheet.",
          prove: "One-pager done.",
          resource: R.beej,
        }),
      ],
      tue: [
        S("fw12-d1", "Light DSA or rest near exams", {
          min: 25, engine: "dsa",
          learn: "Honesty over fake streaks.",
          do: "One Easy from blank OR intentional rest if exam within 48h. Mark which.",
          prove: "Choice logged.",
          resource: R.practice,
        }),
      ],
      thu: [
        S("fw12-b1", "Archive demo links", {
          min: 20, engine: "build",
          learn: "Future you needs paths to README, ARCHITECTURE, recordings.",
          do: "SHIP.md index of demos and docs for Gambit + NetKV (+ Terp if active).",
          prove: "Index complete.",
          resource: R.gambit,
        }),
      ],
      sat: [
        S("fw12-p1", "Application hygiene", {
          min: 20, engine: "pro",
          learn: "Keep the tracker truthful.",
          do: "Update APPLICATIONS.md. No new spray if exams dominate.",
          prove: "Tracker current.",
          resource: R.star,
        }),
      ],
    },
    {
      title: "Fall W13: map systems learning to products",
      mon: [
        S("fw13-s1", "Write how 216 changed your NetKV explanation", {
          min: 35, engine: "systems",
          learn: "Connect coursework language to your systems project.",
          do: "Half-page: pointers/processes/memory → how you explain NetKV now vs August.",
          prove: "Paragraph in SHIP.md",
          resource: R.ostep,
        }),
      ],
      tue: [
        S("fw13-d1", "Final blank tournament", {
          min: 70, engine: "dsa",
          learn: "Four from blank.",
          do: "4 problems 70 min. Log.",
          prove: "REVIEW.md final section.",
          resource: R.practice,
        }),
      ],
      thu: [
        S("fw13-b1", "Dual oral: NetKV + Gambit", {
          min: 25, engine: "build",
          learn: "5 + 10 minutes. Notes only.",
          do: "Record dual oral. List remaining gaps.",
          prove: "Recording saved.",
          resource: ycDemo,
          where: "phone",
        }),
      ],
      sat: [
        S("fw13-p1", "Summer 2027 target draft", {
          min: 30, engine: "pro",
          learn: "Winter proof feeds summer pipeline.",
          do: "In APPLICATIONS.md add Summer 2027 section with 10 company targets.",
          prove: "10 rows.",
          resource: R.star,
        }),
      ],
    },
    {
      title: "Fall W14: December close",
      mon: [
        S("fw14-s1", "Exam finish or OSTEP for fun", {
          min: 40, engine: "systems",
          learn: "If exams remain, study. If done, one light OSTEP chapter.",
          do: "Study or skim one OSTEP chapter with 5 notes.",
          prove: "Notes or exam study log.",
          resource: R.ostepIntro,
        }),
      ],
      tue: [
        S("fw14-d1", "Optional Medium or rest", {
          min: 40, engine: "dsa",
          learn: "Intentional choice.",
          do: "One Medium or rest marked intentionally.",
          prove: "Choice logged.",
          resource: R.roadmap,
        }),
      ],
      thu: [
        S("fw14-b1", "Public README honesty pass", {
          min: 35, engine: "build",
          learn: "Repos must match reality.",
          do: "Final README pass on NetKV and Gambit. ARCHITECTURE linked. No fake claims.",
          prove: "READMEs updated.",
          resource: R.gambit,
        }),
      ],
      sat: [
        S("fw14-p1", "What you can defend now", {
          min: 20, engine: "pro",
          learn: "Calibration beat vibes.",
          do: "Write 10 lines: skills/demos you can defend now that you could not on Jul 23.",
          prove: "SHIP.md section dated.",
          resource: R.star,
        }),
      ],
    },
  ];

  function addFallWeek(weekIndex, weekStartIso) {
    const w = fallWeeks[weekIndex];
    if (!w) return;
    const start = new Date(weekStartIso + "T12:00:00");
    const slots = [
      { off: 0, key: "mon", label: "Mon" }, // if week starts Monday Aug 31 2026 is Monday
      { off: 1, key: "tue", label: "Tue" },
      { off: 3, key: "thu", label: "Thu" },
      { off: 5, key: "sat", label: "Sat" },
    ];
    slots.forEach((slot) => {
      const d = new Date(start);
      d.setDate(d.getDate() + slot.off);
      const iso = d.toISOString().slice(0, 10);
      if (iso > "2026-12-15") return;
      const steps = w[slot.key];
      if (!steps || !steps.length) return;
      if (dayBag[iso]) return;
      addDay(
        iso,
        w.title + " · " + slot.label,
        w.title,
        [L(`fall-w${weekIndex}-${slot.key}`, w.title + " (" + slot.label + ")", w.title, steps.map((st, idx) => ({ ...st, id: st.id + "-" + iso })))]
      );
    });
  }

  // Aug 31 2026 is Monday
  eachDate("2026-08-31", "2026-12-15", (iso, dow, i) => {
    if (dow === 1) {
      // Monday starts a week
      const weekIndex = Math.min(fallWeeks.length - 1, Math.floor(i / 7));
      addFallWeek(weekIndex, iso);
    }
  });

  // Fill any remaining fall dates with a short concrete drill (not vague homework)
  eachDate("2026-08-31", "2026-12-15", (iso, dow) => {
    if (dayBag[iso]) return;
    const drills = {
      0: S("fill-sun-"+iso, "Review from blank (short)", {
        min: 30, engine: "dsa",
        learn: "Sunday retrieval keeps patterns alive.",
        example: "Pick one Easy you already solved. Empty file. 25 min.",
        do: "Re-solve one prior Easy from blank. Log pass/fail.",
        prove: "File touched + log line.",
        resource: R.practice,
      }),
      2: S("fill-wed-"+iso, "216 same-day definitions", {
        min: 35, engine: "systems",
        learn: "Rewrite today's definitions before they fade.",
        example: "Term | my definition | tiny example",
        do: "Add today's 216 terms to 216_SHEET.md. One tiny C snippet if applicable.",
        prove: "Dated rows added.",
        resource: R.beej,
      }),
      4: S("fill-fri-"+iso, "Engineering practice hour", {
        min: 35, engine: "pro",
        learn: "SQL, git, or cloud hygiene beats idle scrolling.",
        example: "Option A: 3 SQL queries\nOption B: clean git status on products\nOption C: AWS cost check",
        do: "Pick A/B/C and execute. Note which.",
        prove: "Artifact dated today.",
        resource: R.sqlbolt,
      }),
      3: S("fill-thu2-"+iso, "Product micro-commit", {
        min: 40, engine: "build",
        learn: "Small commits compound.",
        do: "One small improvement to Gambit, NetKV, or TerpButler docs/tests/UI. Commit.",
        prove: "Commit done.",
        resource: R.gambit,
      }),
      5: S("fill-sat2-"+iso, "Demo friction hunt", {
        min: 40, engine: "build",
        learn: "Remove a click that wastes demo time.",
        do: "Run a 90s demo once. Fix one friction. Update script.",
        prove: "Friction + fix noted.",
        resource: ycDemo,
      }),
      6: S("fill-sat3-"+iso, "Deep product Saturday", {
        min: 70, engine: "build",
        learn: "Long block on the weakest bootable product.",
        do: "Follow next unfinished chapter step in Projects for Gambit or NetKV.",
        prove: "Playbook progress or SHIP note.",
        resource: R.codingRedis,
      }),
      1: S("fill-mon2-"+iso, "C lab reinforcement", {
        min: 40, engine: "systems",
        learn: "One clean -Wall program beats passive notes.",
        do: "Write/compile one small C program related to this week's 216 topic.",
        prove: "Zero warnings run.",
        resource: R.beej,
      }),
    };
    const step = drills[dow] || drills[2];
    addDay(iso, "Fall drill · " + ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dow], "Keep moving with a concrete drill.", [
      L("fill-"+iso, "Drill", "Concrete practice for this weekday.", [step]),
    ]);
  });

  // Assemble phases → modules → lessons for app
  const byPhase = { summer: [], bridge: [], fall: [] };
  Object.keys(dayBag)
    .sort()
    .forEach((date) => {
      const d = dayBag[date];
      let phaseId = "fall";
      if (date <= "2026-08-15") phaseId = "summer";
      else if (date <= "2026-08-30") phaseId = "bridge";
      const mod = {
        id: `day-${date}`,
        title: d.title,
        engine: "systems",
        date,
        why: d.why,
        lessons: d.lessons,
      };
      byPhase[phaseId].push(mod);
    });

  C.phases = phases.map((p) => ({
    ...p,
    modules: byPhase[p.id] || [],
  }));

  C.lessons = [];
  C.phases.forEach((ph) => {
    ph.modules.forEach((m) => {
      m.lessons.forEach((les) => {
        C.lessons.push({
          ...les,
          phaseId: ph.id,
          moduleId: m.id,
          moduleTitle: m.title,
          moduleEngine: m.engine,
          date: m.date,
          why: m.why,
        });
      });
    });
  });
  C.lessonIndex = Object.fromEntries(C.lessons.map((l, i) => [l.id, i]));
})();
