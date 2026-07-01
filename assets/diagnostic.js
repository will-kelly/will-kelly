/* ============================================================
   AI Readiness Diagnostic — vanilla JS, no dependencies.
   A live demo of the productized diagnostics Will builds:
   score the org across four dimensions, return a tier + a
   short, prioritized remediation list. Anti-vendor-theater:
   the answers that hurt score the lowest.
   ============================================================ */
(function () {
  "use strict";

  // Each question scores 0–4. Six questions => 24 max => normalized to 100.
  const QUESTIONS = [
    {
      dimension: "Documentation health",
      text: "When someone needs to answer a customer or internal question, where do they actually look first?",
      options: [
        { label: "They ping a specific person — the knowledge lives in someone's head.", score: 0 },
        { label: "They search a wiki, but half the results are stale or contradictory.", score: 1 },
        { label: "There's a canonical source, but no one owns keeping it current.", score: 2 },
        { label: "Documentation is versioned, owned, and trusted enough to cite in decisions.", score: 4 },
      ],
    },
    {
      dimension: "Governance",
      text: "How do AI tools get adopted across the org today?",
      options: [
        { label: "Individuals paste company data into whatever tool they found. No policy.", score: 0 },
        { label: "There's a policy on paper, but no one enforces or measures it.", score: 1 },
        { label: "Approved tools exist, with light guardrails on data and usage.", score: 3 },
        { label: "Clear governance: approved tools, data boundaries, and an owner accountable for it.", score: 4 },
      ],
    },
    {
      dimension: "Workflow discipline",
      text: "How does content or knowledge move from 'created' to 'reviewed' to 'live'?",
      options: [
        { label: "Ad hoc. Whoever's loudest ships it. No consistent review.", score: 0 },
        { label: "We have a process, but people route around it when they're busy.", score: 1 },
        { label: "A defined workflow exists and is mostly followed.", score: 3 },
        { label: "Workflows force prioritization and review — the process is the default path.", score: 4 },
      ],
    },
    {
      dimension: "Metadata & structure",
      text: "Could an AI system reliably find and cite the *right* internal source right now?",
      options: [
        { label: "No — content is unstructured, untagged, and scattered across tools.", score: 0 },
        { label: "Partially — some is structured, but there's no consistent metadata.", score: 1 },
        { label: "Mostly — key content is tagged and organized, gaps remain.", score: 3 },
        { label: "Yes — consistent structure and metadata make retrieval trustworthy.", score: 4 },
      ],
    },
    {
      dimension: "Adoption reality",
      text: "Where is your AI effort on the pilot-to-practice curve?",
      options: [
        { label: "We ran a flashy pilot; nothing changed in daily work afterward.", score: 0 },
        { label: "A few enthusiasts use it; it hasn't reached the broader team.", score: 1 },
        { label: "Several teams use AI in real workflows, unevenly.", score: 3 },
        { label: "AI is embedded in how the work gets done, with measured outcomes.", score: 4 },
      ],
    },
    {
      dimension: "Measurement",
      text: "How do you know whether your documentation or AI investment is actually paying off?",
      options: [
        { label: "We don't measure it. It's a vibe / a line item.", score: 0 },
        { label: "We track activity (docs written, tools bought) but not impact.", score: 1 },
        { label: "We track a few outcome signals, informally.", score: 3 },
        { label: "We tie it to reuse, time saved, and decision quality — and review it.", score: 4 },
      ],
    },
  ];

  const MAX = QUESTIONS.length * 4;

  const TIERS = [
    {
      min: 0, max: 34,
      name: "Vendor theater",
      verdict:
        "You're likely to buy tools before fixing the underlying data and workflow problems. AI here amplifies chaos rather than resolving it — the classic pilot that never becomes practice.",
      recs: [
        "Start with a documentation debt audit, not a tool purchase.",
        "Name a single owner for your canonical knowledge source.",
        "Set a minimum AI-usage governance policy before rollout, not after.",
      ],
    },
    {
      min: 35, max: 59,
      name: "Fragile foundation",
      verdict:
        "The intent is there, but process routes around discipline and knowledge still lives in the wrong places. AI will help pockets of the org while frustrating everyone else.",
      recs: [
        "Make the review workflow the default path, not the exception.",
        "Introduce consistent metadata so retrieval becomes trustworthy.",
        "Move from measuring activity to measuring reuse and time saved.",
      ],
    },
    {
      min: 60, max: 79,
      name: "Operationalizing",
      verdict:
        "You've moved past experiments into real practice, unevenly. The remaining gains come from closing consistency gaps and tightening the feedback loop between usage and outcomes.",
      recs: [
        "Standardize the workflows that already mostly work across every team.",
        "Instrument outcomes so wins are visible and repeatable.",
        "Codify governance so scaling doesn't reintroduce sprawl.",
      ],
    },
    {
      min: 80, max: 100,
      name: "Compounding",
      verdict:
        "Documentation, governance, workflow, and adoption reinforce each other. AI is compounding your operational advantage instead of masking gaps. The work now is defending discipline as you scale.",
      recs: [
        "Protect the discipline — audit for drift as headcount grows.",
        "Package what works internally as a repeatable playbook.",
        "Push measurement toward decision quality, not just efficiency.",
      ],
    },
  ];

  // ---- state ----
  const answers = new Array(QUESTIONS.length).fill(null);
  let current = 0;

  // ---- elements ----
  const el = (id) => document.getElementById(id);
  const stage = el("diag-stage");
  const result = el("diag-result");
  const bar = el("diag-bar");
  const dimEl = el("diag-dimension");
  const counterEl = el("diag-counter");
  const questionEl = el("diag-question");
  const optionsEl = el("diag-options");
  const backBtn = el("diag-back");

  if (!stage) return; // diagnostic not on this page

  function renderQuestion() {
    const q = QUESTIONS[current];
    dimEl.textContent = q.dimension;
    counterEl.textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
    questionEl.textContent = q.text;
    bar.style.width = `${(current / QUESTIONS.length) * 100}%`;

    optionsEl.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "diag-option" + (answers[current] === i ? " selected" : "");
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", answers[current] === i ? "true" : "false");
      btn.innerHTML = `<span class="dot" aria-hidden="true"></span><span>${opt.label}</span>`;
      btn.addEventListener("click", () => choose(i));
      optionsEl.appendChild(btn);
    });

    backBtn.disabled = current === 0;
  }

  function choose(i) {
    answers[current] = i;
    // reflect selection immediately, then advance
    renderQuestion();
    window.setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        current += 1;
        renderQuestion();
      } else {
        showResult();
      }
    }, 220);
  }

  function goBack() {
    if (current > 0) {
      current -= 1;
      renderQuestion();
    }
  }

  function computeScore() {
    const raw = answers.reduce((sum, ai, qi) => {
      if (ai === null) return sum;
      return sum + QUESTIONS[qi].options[ai].score;
    }, 0);
    return Math.round((raw / MAX) * 100);
  }

  function tierFor(score) {
    return TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[0];
  }

  function showResult() {
    const score = computeScore();
    const tier = tierFor(score);

    bar.style.width = "100%";
    stage.hidden = true;
    result.hidden = false;

    const ring = el("diag-ring");
    ring.style.setProperty("--pct", score);
    animateNumber(el("diag-score"), score);

    el("diag-tier").textContent = tier.name;
    el("diag-verdict").textContent = tier.verdict;

    const recsEl = el("diag-recs");
    recsEl.innerHTML = "";
    tier.recs.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = r;
      recsEl.appendChild(li);
    });

    result.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function animateNumber(node, target) {
    const start = performance.now();
    const dur = 700;
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function restart() {
    answers.fill(null);
    current = 0;
    result.hidden = true;
    stage.hidden = false;
    renderQuestion();
    document.getElementById("diagnostic").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  backBtn.addEventListener("click", goBack);
  el("diag-restart").addEventListener("click", restart);

  renderQuestion();
})();
