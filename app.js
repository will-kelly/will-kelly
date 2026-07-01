/* Will Kelly — willkelly.com POC
   Vanilla JS: mobile nav, footer year, and the AI/content-ops readiness diagnostic. */

(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Diagnostic ----------
     Each question offers 4 options scored 0..3. Max raw = questions * 3.
     Normalized to 0..100. Tiers drive tailored guidance — mirroring the
     "sell the diagnostic" positioning: honest read first, plan second. */

  var QUESTIONS = [
    {
      id: 'source',
      text: 'Where does your documentation actually live?',
      opts: [
        { label: 'Scattered across tools & people', v: 0 },
        { label: 'A wiki nobody trusts', v: 1 },
        { label: 'Mostly one system, some drift', v: 2 },
        { label: 'One governed source of truth', v: 3 }
      ]
    },
    {
      id: 'ownership',
      text: 'Who owns content quality and freshness?',
      opts: [
        { label: 'No one, really', v: 0 },
        { label: 'Whoever complains loudest', v: 1 },
        { label: 'A part-time champion', v: 2 },
        { label: 'Clear owners with SLAs', v: 3 }
      ]
    },
    {
      id: 'metadata',
      text: 'How structured is your content metadata?',
      opts: [
        { label: 'What metadata?', v: 0 },
        { label: 'Titles and folders', v: 1 },
        { label: 'Tags, owners, review dates', v: 2 },
        { label: 'Governed taxonomy + lifecycle', v: 3 }
      ]
    },
    {
      id: 'ai',
      text: 'How is your team using AI on this content today?',
      opts: [
        { label: 'Banned or ignored', v: 0 },
        { label: 'Ad-hoc copy/paste into chatbots', v: 1 },
        { label: 'A few shared prompts', v: 2 },
        { label: 'Governed assistants on trusted sources', v: 3 }
      ]
    },
    {
      id: 'debt',
      text: 'Can you quantify your documentation debt?',
      opts: [
        { label: 'No idea how bad it is', v: 0 },
        { label: 'We know it’s bad', v: 1 },
        { label: 'Rough sense of hotspots', v: 2 },
        { label: 'Measured, prioritized backlog', v: 3 }
      ]
    },
    {
      id: 'pilot',
      text: 'What happens after an AI pilot succeeds?',
      opts: [
        { label: 'It quietly dies', v: 0 },
        { label: 'Endless "next pilot"', v: 1 },
        { label: 'Partial rollout, no standard', v: 2 },
        { label: 'Operationalized with governance', v: 3 }
      ]
    }
  ];

  var TIERS = [
    {
      min: 0, max: 39,
      tier: 'Pre-foundational',
      color: '#d5533f',
      headline: 'You’re fighting a data problem with willpower.',
      summary: 'Right now the pain is real but invisible — no source of truth, no owners, no way to size the debt. AI on top of this amplifies the mess. The good news: this is exactly where a diagnostic pays for itself fastest.',
      actions: [
        'Establish a single source of truth before touching AI tooling',
        'Run a documentation debt audit to make the cost visible to leadership',
        'Name owners and basic review SLAs — governance beats another tool'
      ]
    },
    {
      min: 40, max: 69,
      tier: 'Emerging',
      color: '#e0a021',
      headline: 'Real foundations, uneven discipline.',
      summary: 'You’ve got pockets of structure and some AI experimentation, but drift and inconsistent ownership will cap how far AI can safely go. The work now is standardizing what already works and killing the "endless pilot" loop.',
      actions: [
        'Tighten metadata: tags, owners, and review dates as non-negotiables',
        'Codify shared prompts into governed assistants on trusted sources',
        'Define what "operationalized" means so pilots have a finish line'
      ]
    },
    {
      min: 70, max: 89,
      tier: 'Operationalizing',
      color: '#1f9d6b',
      headline: 'You’re past pilots — now scale the system.',
      summary: 'Governance, ownership, and structured content are mostly in place. The opportunity is compounding: knowledge graphs, documentation-health agents, and repeatable Claude blueprints that turn your content ops into a durable advantage.',
      actions: [
        'Layer documentation-health agents onto your governed sources',
        'Package internal playbooks so wins repeat across teams',
        'Measure freshness and reuse as ongoing operational metrics'
      ]
    },
    {
      min: 90, max: 100,
      tier: 'Exemplary',
      color: '#1f9d6b',
      headline: 'This is the model others should copy.',
      summary: 'Single source of truth, clear ownership, governed AI, measured debt. You don’t need rescue — you need leverage: turning your operating model into productized IP and a story that lands with executive buyers.',
      actions: [
        'Externalize your methodology as a repeatable framework',
        'Use case-study frameworks to capture proof even without hard metrics',
        'Stress-test governance against new AI use cases before they arrive'
      ]
    }
  ];

  var listEl = document.getElementById('questions');
  var app = document.getElementById('diagnostic-app');
  var form = document.getElementById('diagnostic-form');
  var resultEl = document.getElementById('result');
  var scoreBtn = document.getElementById('scoreBtn');
  var resetBtn = document.getElementById('resetBtn');

  if (!listEl || !form) return; // diagnostic markup absent; nothing to wire

  // Render questions
  QUESTIONS.forEach(function (q, qi) {
    var li = document.createElement('li');
    li.className = 'q-item';

    var p = document.createElement('p');
    p.className = 'q-text';
    p.innerHTML = '<span class="q-num">' + (qi + 1) + '</span><span>' + q.text + '</span>';
    li.appendChild(p);

    var opts = document.createElement('div');
    opts.className = 'q-opts';
    q.opts.forEach(function (o, oi) {
      var id = 'q' + qi + '_' + oi;
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = q.id;
      input.id = id;
      input.value = String(o.v);

      var label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = o.label;

      opts.appendChild(input);
      opts.appendChild(label);
    });
    li.appendChild(opts);
    listEl.appendChild(li);
  });

  function tierFor(score) {
    for (var i = 0; i < TIERS.length; i++) {
      if (score >= TIERS[i].min && score <= TIERS[i].max) return TIERS[i];
    }
    return TIERS[TIERS.length - 1];
  }

  function computeScore() {
    var raw = 0, answered = 0;
    QUESTIONS.forEach(function (q) {
      var checked = form.querySelector('input[name="' + q.id + '"]:checked');
      if (checked) { raw += Number(checked.value); answered++; }
    });
    return { answered: answered, pct: Math.round((raw / (QUESTIONS.length * 3)) * 100) };
  }

  function showResult() {
    var res = computeScore();

    if (res.answered < QUESTIONS.length) {
      // Gentle nudge; scroll to first unanswered question.
      var firstUnanswered = QUESTIONS.find(function (q) {
        return !form.querySelector('input[name="' + q.id + '"]:checked');
      });
      if (firstUnanswered) {
        var node = form.querySelector('input[name="' + firstUnanswered.id + '"]');
        if (node && node.closest('.q-item')) {
          node.closest('.q-item').style.outline = '2px solid var(--accent)';
          node.closest('.q-item').style.outlineOffset = '3px';
          node.closest('.q-item').scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function () { node.closest('.q-item').style.outline = 'none'; }, 1600);
        }
      }
      scoreBtn.textContent = 'Answer all six to score (' + res.answered + '/' + QUESTIONS.length + ')';
      setTimeout(function () { scoreBtn.textContent = 'See my readiness score'; }, 1800);
      return;
    }

    var t = tierFor(res.pct);

    document.getElementById('scoreValue').textContent = String(res.pct);
    document.getElementById('scoreTier').textContent = t.tier;
    document.getElementById('scoreTier').style.color = t.color;
    document.getElementById('resultHeadline').textContent = t.headline;
    document.getElementById('resultSummary').textContent = t.summary;

    var ul = document.getElementById('resultActions');
    ul.innerHTML = '';
    t.actions.forEach(function (a) {
      var li = document.createElement('li');
      li.textContent = a;
      ul.appendChild(li);
    });

    resultEl.hidden = false;
    if (app) app.setAttribute('data-state', 'result');

    // Animate gauge after paint.
    requestAnimationFrame(function () {
      var fill = document.getElementById('gaugeFill');
      fill.style.width = res.pct + '%';
      fill.style.background = t.color;
    });

    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  scoreBtn.addEventListener('click', showResult);

  form.addEventListener('reset', function () {
    resultEl.hidden = true;
    if (app) app.removeAttribute('data-state');
    var fill = document.getElementById('gaugeFill');
    if (fill) fill.style.width = '0';
  });
})();
