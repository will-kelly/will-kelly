// Will Kelly — catalog site interactions

(function () {
  "use strict";

  /* ---------- year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
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

  /* ---------- catalog filtering + search ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var shelves = Array.prototype.slice.call(document.querySelectorAll(".shelf"));
  var emptyState = document.getElementById("empty-state");
  var emptyReset = document.getElementById("empty-reset");
  var searchInput = document.getElementById("catalog-search");
  var tally = document.getElementById("tally");

  // index every card once: element, its group, and a lowercased search haystack
  var cards = shelves.reduce(function (acc, shelf) {
    var group = shelf.getAttribute("data-group");
    Array.prototype.slice.call(shelf.querySelectorAll(".card")).forEach(function (card) {
      acc.push({ el: card, group: group, text: (card.textContent || "").toLowerCase() });
    });
    return acc;
  }, []);

  var activeFilter = "all";
  var query = "";

  // seed the per-category counts on the chips (fixed totals, not live results)
  document.querySelectorAll(".chip__n").forEach(function (span) {
    var key = span.getAttribute("data-count");
    var n = key === "all" ? cards.length : cards.filter(function (c) { return c.group === key; }).length;
    span.textContent = "(" + n + ")";
  });

  function apply() {
    var visible = 0;
    var narrowed = activeFilter !== "all" || query !== "";

    cards.forEach(function (c) {
      var matchFilter = activeFilter === "all" || c.group === activeFilter;
      var matchQuery = query === "" || c.text.indexOf(query) !== -1;
      var show = matchFilter && matchQuery;
      c.el.classList.toggle("is-hidden", !show);
      // when the shelf is reordered by a filter/search, a promoted card may still
      // be sitting at reveal opacity:0 — force its final revealed state so it shows
      if (show && narrowed) c.el.classList.add("is-in");
      if (show) visible += 1;
    });

    // a shelf is shown only when it still has at least one visible card
    shelves.forEach(function (shelf) {
      var hasVisible = shelf.querySelectorAll(".card:not(.is-hidden)").length > 0;
      shelf.classList.toggle("is-hidden", !hasVisible);
    });

    if (emptyState) emptyState.hidden = visible !== 0;
    if (tally) {
      tally.hidden = visible === 0;
      if (visible !== 0) {
        var scope = activeFilter === "all" ? "" : " · " + activeFilter;
        var q = query ? ' · "' + query + '"' : "";
        tally.textContent = visible + (visible === 1 ? " entry" : " entries") + scope + q;
      }
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeFilter = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      apply();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      query = searchInput.value.trim().toLowerCase();
      apply();
    });
  }

  if (emptyReset) {
    emptyReset.addEventListener("click", function () {
      activeFilter = "all";
      query = "";
      if (searchInput) searchInput.value = "";
      chips.forEach(function (c) {
        c.classList.toggle("is-active", c.getAttribute("data-filter") === "all");
      });
      apply();
    });
  }

  apply();

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
