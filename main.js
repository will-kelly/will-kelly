// Will Kelly — catalog site interactions
// The catalog is data-driven: CATALOG below is the single source of truth.
// Cards render from it, and search / filter / counts / detail all read the same data.

(function () {
  "use strict";

  /* ============================================================
     CATALOG DATA
     Each entry: id, group, name, blurb, specs[], optional status,
     and a detail object (use / get / pairs) for the expandable view.
     ============================================================ */
  var CATALOG = [
    /* ---- AGENTS (AGT) ---- */
    {
      id: "AGT-01", group: "agents", name: "Documentation Health Agent",
      blurb: "A Claude Project that audits a knowledge base for stale, orphaned, and duplicated pages, then ranks fixes by cost impact so IT leadership can act on the worst debt first.",
      specs: [
        { k: "Surface", v: "Claude Project" },
        { k: "Output", v: "Prioritized triage report" },
        { k: "License", v: "MIT" }
      ],
      status: { label: "Live", kind: "live" },
      detail: {
        use: "A wiki or knowledge base has quietly rotted and nobody can say which pages are worth saving.",
        get: "A ranked triage report that flags stale, orphaned, and duplicated pages and orders fixes by cost impact.",
        pairs: "Feeds the Documentation Debt Audit (IP-02) with evidence."
      }
    },
    {
      id: "AGT-02", group: "agents", name: "Knowledge Graph Builder",
      blurb: "Turns scattered docs, wikis, and intake forms into a structured client knowledge graph — surfacing the relationships and gaps that flat documentation hides.",
      specs: [
        { k: "Surface", v: "Claude Project" },
        { k: "Output", v: "Entity & relationship map" },
        { k: "License", v: "MIT" }
      ],
      status: { label: "Live", kind: "live" },
      detail: {
        use: "Client knowledge lives in a dozen disconnected docs and no one can see how the pieces relate.",
        get: "A structured entity-and-relationship map that exposes the connections — and the gaps — flat docs hide.",
        pairs: "Has a human-readable twin in the Client Knowledge Graph template (TPL-04)."
      }
    },
    {
      id: "AGT-03", group: "agents", name: "Content Pipeline Automations",
      blurb: "Claude workflows that move an asset from brief to versioned, reviewed, repurposed output — the operational glue that keeps a content system from drifting back to chaos.",
      specs: [
        { k: "Surface", v: "Claude workflow set" },
        { k: "Output", v: "Automated lifecycle steps" },
        { k: "License", v: "MIT" }
      ],
      status: { label: "Live", kind: "live" },
      detail: {
        use: "Content ships in one-off bursts and drifts back to chaos the moment attention moves elsewhere.",
        get: "A set of Claude workflows that carry an asset from brief to versioned, reviewed, repurposed output.",
        pairs: "Enforces the Content Lifecycle Checklist (FWK-03) automatically."
      }
    },
    {
      id: "AGT-04", group: "agents", name: "Blueprint Packs — Doc Triage & Wiki Health",
      blurb: "Ready-to-load Claude Project packs for content ops, documentation triage, and wiki health. Drop-in configurations with use cases and integration notes.",
      specs: [
        { k: "Surface", v: "Claude Project packs" },
        { k: "Output", v: "Configured projects" },
        { k: "License", v: "MIT" }
      ],
      status: { label: "On Gumroad", kind: "ship" },
      detail: {
        use: "A team wants working Claude Projects on day one instead of building system prompts from scratch.",
        get: "Drop-in project packs for content ops, doc triage, and wiki health — each with use cases and integration notes.",
        pairs: "Built on the Prompt Engineering Library (AGT-05)."
      }
    },
    {
      id: "AGT-05", group: "agents", name: "Prompt Engineering Library",
      blurb: "System prompts and few-shot examples distilled from real consulting delivery — reusable building blocks for operations teams standing up their own agents.",
      specs: [
        { k: "Surface", v: "Prompt library" },
        { k: "Output", v: "Reusable prompts" },
        { k: "License", v: "MIT" }
      ],
      status: { label: "Live", kind: "live" },
      detail: {
        use: "An ops team is standing up its own agents and needs proven building blocks, not blank-page prompting.",
        get: "System prompts and few-shot examples distilled from real consulting delivery, ready to adapt.",
        pairs: "Underpins the Blueprint Packs (AGT-04) and Content Pipeline Automations (AGT-03)."
      }
    },
    {
      id: "AGT-06", group: "agents", name: "Custom GPT Governance Playbook",
      blurb: "A governance model that prevents AI tool sprawl while preserving practitioner autonomy — the rules that keep an org's agents accountable instead of feral.",
      specs: [
        { k: "Surface", v: "Governance playbook" },
        { k: "Output", v: "Policy & guardrails" },
        { k: "License", v: "CC0-1.0" }
      ],
      status: { label: "Live", kind: "live" },
      detail: {
        use: "Custom agents are multiplying across an org with no shared rules, and IT is losing the thread.",
        get: "A governance model with the policy and guardrails to keep agents accountable without smothering practitioner autonomy.",
        pairs: "Pairs with the AI Pilot Readiness Checklist (IP-01) at rollout."
      }
    },

    /* ---- FRAMEWORKS (FWK) ---- */
    {
      id: "FWK-01", group: "frameworks", name: "30 · 60 · 90-Day Content Ops Plan",
      blurb: "A day-by-day playbook for standing up content operations from scratch — at a startup or inside an enterprise.",
      specs: [
        { k: "Format", v: "Phased playbook" },
        { k: "License", v: "CC0-1.0" }
      ],
      detail: {
        use: "You're standing up a content ops practice and need a credible first-quarter plan, not a blank calendar.",
        get: "A day-by-day, phase-by-phase playbook that works at a startup or inside an enterprise.",
        pairs: "The natural starting point before the Content Lifecycle Checklist (FWK-03)."
      }
    },
    {
      id: "FWK-02", group: "frameworks", name: "GTM Content Ops Accelerator",
      blurb: "Aligns content production to pipeline stages so marketing stops publishing blind and starts feeding the funnel deliberately.",
      specs: [
        { k: "Format", v: "Alignment framework" },
        { k: "License", v: "CC0-1.0" }
      ],
      detail: {
        use: "Marketing is publishing on instinct with no line back to the pipeline it's supposed to feed.",
        get: "A framework that maps content production to funnel stages so every asset has a job.",
        pairs: "Sits alongside the Tech Storytelling Strategy Guide (FWK-05)."
      }
    },
    {
      id: "FWK-03", group: "frameworks", name: "Content Lifecycle Checklist",
      blurb: "Ensures every asset gets versioned, reviewed, and repurposed — the discipline that turns one-off publishing into a system.",
      specs: [
        { k: "Format", v: "Operating checklist" },
        { k: "License", v: "CC0-1.0" }
      ],
      detail: {
        use: "Assets ship once and are never revisited, versioned, or reused.",
        get: "An operating checklist that makes versioning, review, and repurposing non-optional.",
        pairs: "Automated end-to-end by the Content Pipeline Automations agent (AGT-03)."
      }
    },
    {
      id: "FWK-04", group: "frameworks", name: "Case Study Framework",
      blurb: "Extracts a compelling story even when the customer won't share metrics — structure that survives an NDA.",
      specs: [
        { k: "Format", v: "Narrative framework" },
        { k: "License", v: "CC0-1.0" }
      ],
      detail: {
        use: "A customer agreed to a case study but won't hand over numbers or a logo.",
        get: "A narrative structure that lands a persuasive story without the metrics an NDA blocks.",
        pairs: "Complements the Tech Storytelling Strategy Guide (FWK-05)."
      }
    },
    {
      id: "FWK-05", group: "frameworks", name: "Tech Storytelling Strategy Guide",
      blurb: "Narrative frameworks that land with technical and executive buyers at the same time — without dumbing either one down.",
      specs: [
        { k: "Format", v: "Strategy guide" },
        { k: "License", v: "CC0-1.0" }
      ],
      detail: {
        use: "The same story has to convince an engineer and a CTO, and today it satisfies neither.",
        get: "Narrative frameworks that hold technical credibility and executive relevance at once.",
        pairs: "Extends into the Multi-Generational Messaging Guide (FWK-06)."
      }
    },
    {
      id: "FWK-06", group: "frameworks", name: "Multi-Generational Messaging Guide",
      blurb: "Frames technical complexity for CIO, CTO, and practitioner audiences — one message, three altitudes.",
      specs: [
        { k: "Format", v: "Messaging guide" },
        { k: "License", v: "CC0-1.0" }
      ],
      detail: {
        use: "One announcement has to reach the CIO, the CTO, and the person doing the work — each at their own altitude.",
        get: "A guide for framing the same technical message three ways without losing the thread.",
        pairs: "Builds on the Tech Storytelling Strategy Guide (FWK-05)."
      }
    },
    {
      id: "FWK-07", group: "frameworks", name: "CTRL+ALT+SharePoint Methodology",
      blurb: "A proprietary governance methodology for taming SharePoint documentation debt — refined across 15+ enterprise deployments.",
      specs: [
        { k: "Format", v: "Governance methodology" },
        { k: "License", v: "Proprietary" }
      ],
      detail: {
        use: "A SharePoint estate has sprawled into unmanaged documentation debt and reorgs only make it worse.",
        get: "A governance methodology refined across 15+ enterprise deployments for taming the sprawl.",
        pairs: "Formalizes what the Documentation Health Agent (AGT-01) surfaces."
      }
    },
    {
      id: "FWK-08", group: "frameworks", name: "Notion Editorial Workflow",
      blurb: "A lightweight publishing pipeline built entirely in Notion — intake, brief, review, and ship without a heavyweight CMS.",
      specs: [
        { k: "Format", v: "Workflow blueprint" },
        { k: "License", v: "CC0-1.0" }
      ],
      detail: {
        use: "A team needs a real publishing pipeline but a heavyweight CMS is overkill.",
        get: "A blueprint that runs intake, brief, review, and ship entirely inside Notion.",
        pairs: "Instantiated by the Content Operations Hub template (TPL-01)."
      }
    },

    /* ---- PRODUCTIZED IP (IP) ---- */
    {
      id: "IP-01", group: "ip", name: "AI Pilot Readiness Checklist",
      blurb: "Surfaces adoption blockers and governance gaps before a pilot ships — so the pilot doesn't quietly stall in month two.",
      specs: [
        { k: "Format", v: "Diagnostic checklist" },
        { k: "Channel", v: "Gumroad" }
      ],
      detail: {
        use: "An AI pilot is about to launch and no one has pressure-tested whether the org is actually ready.",
        get: "A diagnostic checklist that surfaces adoption blockers and governance gaps before they stall the pilot.",
        pairs: "Enforced at rollout by the Custom GPT Governance Playbook (AGT-06)."
      }
    },
    {
      id: "IP-02", group: "ip", name: "Documentation Debt Audit",
      blurb: "A framework that turns vague “our docs are a mess” into a quantified, prioritized liability IT leadership can fund.",
      specs: [
        { k: "Format", v: "Audit framework" },
        { k: "Channel", v: "Gumroad" }
      ],
      detail: {
        use: "Everyone agrees the docs are a mess, but no one can put a number or a priority on it.",
        get: "An audit framework that converts vague complaints into a quantified, fundable liability.",
        pairs: "Takes its evidence from the Documentation Health Agent (AGT-01)."
      }
    },
    {
      id: "IP-03", group: "ip", name: "Confluence → Notion Pre-Flight",
      blurb: "A migration pre-flight assessment that catches the structural landmines before the content move, not after.",
      specs: [
        { k: "Format", v: "Assessment" },
        { k: "Channel", v: "Gumroad" }
      ],
      detail: {
        use: "A Confluence-to-Notion migration is scheduled and nobody has mapped what will break.",
        get: "A pre-flight assessment that catches structural landmines before the move, not after.",
        pairs: "Hands off to the Notion Editorial Workflow (FWK-08) once migrated."
      }
    },
    {
      id: "IP-04", group: "ip", name: "Content Ops Maturity Scorecard",
      blurb: "A React-based self-serve diagnostic that scores a team's content operations maturity and points to the next investment.",
      specs: [
        { k: "Format", v: "React diagnostic" },
        { k: "Channel", v: "Gumroad" }
      ],
      detail: {
        use: "A team wants an honest read on how mature its content operations really are.",
        get: "A self-serve React diagnostic that scores maturity and names the next investment to make.",
        pairs: "Points toward the 30 · 60 · 90-Day Content Ops Plan (FWK-01)."
      }
    },

    /* ---- TEMPLATES (TPL) ---- */
    {
      id: "TPL-01", group: "templates", name: "Content Operations Hub",
      blurb: "The central operating surface — everything an editorial team touches, in one linked Notion workspace.",
      specs: [
        { k: "Format", v: "Notion template" },
        { k: "Channel", v: "Notion Marketplace" }
      ],
      detail: {
        use: "An editorial team's work is scattered across tools with no single place to run the operation.",
        get: "One linked Notion workspace that holds everything the team touches.",
        pairs: "The operating surface for the Notion Editorial Workflow (FWK-08)."
      }
    },
    {
      id: "TPL-02", group: "templates", name: "Editorial Calendar & Brief Builder",
      blurb: "Plan, brief, and schedule in one place — so writers start from a real brief instead of a blank page.",
      specs: [
        { k: "Format", v: "Notion template" },
        { k: "Channel", v: "Notion Marketplace" }
      ],
      detail: {
        use: "Writers start from a blank page because planning and briefing live somewhere else.",
        get: "A template that unifies planning, briefing, and scheduling so work starts from a real brief.",
        pairs: "Plugs into the Content Operations Hub (TPL-01)."
      }
    },
    {
      id: "TPL-03", group: "templates", name: "Consulting Deliverable Tracker",
      blurb: "Keeps fractional engagements honest — scope, status, and handoffs visible to client and consultant alike.",
      specs: [
        { k: "Format", v: "Notion template" },
        { k: "Channel", v: "Notion Marketplace" }
      ],
      detail: {
        use: "A fractional engagement is drifting because scope, status, and handoffs live only in someone's head.",
        get: "A tracker that keeps scope, status, and handoffs visible to client and consultant alike.",
        pairs: "Complements the Content Operations Hub (TPL-01) for consulting work."
      }
    },
    {
      id: "TPL-04", group: "templates", name: "Client Knowledge Graph",
      blurb: "A relational template that captures how a client's people, systems, and docs actually connect — the human-readable twin of the AGT-02 agent.",
      specs: [
        { k: "Format", v: "Notion template" },
        { k: "Channel", v: "Notion Marketplace" }
      ],
      detail: {
        use: "You need a readable map of how a client's people, systems, and docs connect — without running an agent.",
        get: "A relational Notion template that captures those connections by hand.",
        pairs: "The human-readable twin of the Knowledge Graph Builder agent (AGT-02)."
      }
    }
  ];

  /* ============================================================
     helpers
     ============================================================ */
  var root = document.documentElement;

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function searchIndex(item) {
    var parts = [item.id, item.name, item.blurb];
    item.specs.forEach(function (s) { parts.push(s.k, s.v); });
    if (item.status) parts.push(item.status.label);
    if (item.detail) parts.push(item.detail.use, item.detail.get, item.detail.pairs || "");
    return parts.join(" ").toLowerCase();
  }

  /* ============================================================
     render cards
     ============================================================ */
  function renderCard(item) {
    var card = el("article", "card");
    card.setAttribute("data-group", item.group);
    card.setAttribute("data-search", searchIndex(item));

    card.appendChild(el("div", "card__id", item.id));
    card.appendChild(el("h4", null, item.name));
    card.appendChild(el("p", null, item.blurb));

    var spec = el("dl", "spec");
    item.specs.forEach(function (s) {
      var row = el("div");
      row.appendChild(el("dt", null, s.k));
      row.appendChild(el("dd", null, s.v));
      spec.appendChild(row);
    });
    if (item.status) {
      var row = el("div");
      row.appendChild(el("dt", null, "Status"));
      var dd = el("dd");
      dd.appendChild(el("span", "pill pill--" + item.status.kind, item.status.label));
      row.appendChild(dd);
      spec.appendChild(row);
    }
    card.appendChild(spec);

    if (item.detail) {
      var moreId = "more-" + item.id.toLowerCase();
      var toggle = el("button", "card__toggle");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", moreId);
      toggle.innerHTML = '<span class="card__toggle-label">Details</span>' +
        '<span class="card__toggle-icon" aria-hidden="true">+</span>';

      var more = el("div", "card__more");
      more.id = moreId;
      more.hidden = true;
      var rows = [
        { k: "Use when", v: item.detail.use },
        { k: "You get", v: item.detail.get }
      ];
      if (item.detail.pairs) rows.push({ k: "Pairs with", v: item.detail.pairs });
      rows.forEach(function (r) {
        var block = el("div", "more__row");
        block.appendChild(el("span", "more__k", r.k));
        block.appendChild(el("p", "more__v", r.v));
        more.appendChild(block);
      });

      toggle.addEventListener("click", function () {
        var open = card.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        more.hidden = !open;
        toggle.querySelector(".card__toggle-label").textContent = open ? "Close" : "Details";
        toggle.querySelector(".card__toggle-icon").textContent = open ? "−" : "+";
      });

      card.appendChild(toggle);
      card.appendChild(more);
    }

    return card;
  }

  function mountCatalog() {
    var grids = {};
    Array.prototype.slice.call(document.querySelectorAll(".grid[data-cat]")).forEach(function (g) {
      grids[g.getAttribute("data-cat")] = g;
    });
    CATALOG.forEach(function (item) {
      var grid = grids[item.group];
      if (grid) grid.appendChild(renderCard(item));
    });
  }

  /* ============================================================
     counts
     ============================================================ */
  function renderCounts() {
    var counts = { all: CATALOG.length, agents: 0, frameworks: 0, ip: 0, templates: 0 };
    CATALOG.forEach(function (i) { counts[i.group] = (counts[i.group] || 0) + 1; });
    Array.prototype.slice.call(document.querySelectorAll(".chip__n")).forEach(function (n) {
      var key = n.getAttribute("data-count");
      if (counts[key] != null) n.textContent = counts[key];
    });
  }

  /* ============================================================
     filter + search
     ============================================================ */
  var state = { filter: "all", query: "" };

  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var shelves = Array.prototype.slice.call(document.querySelectorAll(".shelf"));
  var emptyState = document.getElementById("empty-state");
  var resultCount = document.getElementById("result-count");
  var searchInput = document.getElementById("catalog-search");

  function apply() {
    var q = state.query.trim().toLowerCase();
    var total = 0;

    shelves.forEach(function (shelf) {
      var group = shelf.getAttribute("data-group");
      var groupMatch = state.filter === "all" || group === state.filter;
      var visibleInShelf = 0;

      Array.prototype.slice.call(shelf.querySelectorAll(".card")).forEach(function (card) {
        var textMatch = !q || card.getAttribute("data-search").indexOf(q) !== -1;
        var show = groupMatch && textMatch;
        card.classList.toggle("is-hidden", !show);
        if (show) visibleInShelf++;
      });

      shelf.classList.toggle("is-hidden", visibleInShelf === 0);
      total += visibleInShelf;
    });

    if (emptyState) emptyState.hidden = total !== 0;

    if (resultCount) {
      if (q || state.filter !== "all") {
        resultCount.textContent = total + (total === 1 ? " entry" : " entries");
      } else {
        resultCount.textContent = "";
      }
    }
  }

  function setFilter(filter, opts) {
    state.filter = filter;
    chips.forEach(function (c) {
      c.classList.toggle("is-active", c.getAttribute("data-filter") === filter);
    });
    if (!opts || !opts.silent) writeHash();
    apply();
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      setFilter(chip.getAttribute("data-filter"));
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value;
      apply();
    });
    // Esc clears the search field
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && searchInput.value) {
        searchInput.value = "";
        state.query = "";
        apply();
      }
    });
  }

  /* ---------- deep-linkable filter (#f=agents) ---------- */
  var VALID = { all: 1, agents: 1, frameworks: 1, ip: 1, templates: 1 };

  function writeHash() {
    var h = state.filter === "all" ? "" : "f=" + state.filter;
    var base = location.pathname + location.search;
    try {
      history.replaceState(null, "", h ? base + "#" + h : base);
    } catch (e) { /* no-op */ }
  }

  function readHash() {
    var m = location.hash.match(/f=([a-z]+)/);
    if (m && VALID[m[1]]) setFilter(m[1], { silent: true });
  }

  window.addEventListener("hashchange", readHash);

  /* ============================================================
     boot
     ============================================================ */
  mountCatalog();
  renderCounts();
  readHash();
  apply();

  /* ---------- year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- theme toggle ---------- */
  var toggle = document.getElementById("theme-toggle");

  function preferredTheme() {
    var stored = null;
    try { stored = localStorage.getItem("wk-theme"); } catch (e) {}
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    if (toggle) {
      toggle.querySelector(".toggle__label").textContent = t === "dark" ? "Dark" : "Light";
    }
  }

  applyTheme(preferredTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("wk-theme", next); } catch (e) {}
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealTargets = Array.prototype.slice.call(
    document.querySelectorAll(".area, .card, .principle, .timeline li, .license__card, .license__rules")
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
