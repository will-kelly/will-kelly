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
  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var emptyState = document.getElementById("empty-state");
  var countEl = document.getElementById("catalog-count");
  var searchEl = document.getElementById("catalog-search");
  var totalCards = cards.length;

  var activeFilter = "all";
  var query = "";

  // Pre-compute a lowercase haystack per card once.
  cards.forEach(function (card) {
    card._haystack = (card.textContent || "").toLowerCase().replace(/\s+/g, " ");
  });

  function apply() {
    var q = query.trim().toLowerCase();
    var shown = 0;

    shelves.forEach(function (shelf) {
      var groupMatch = activeFilter === "all" ||
        shelf.getAttribute("data-group") === activeFilter;

      var shelfCards = Array.prototype.slice.call(shelf.querySelectorAll(".card"));
      var shelfVisible = 0;

      shelfCards.forEach(function (card) {
        var textMatch = q === "" || card._haystack.indexOf(q) !== -1;
        var visible = groupMatch && textMatch;
        card.classList.toggle("is-hidden", !visible);
        if (visible) { shelfVisible++; shown++; }
      });

      // Hide a shelf if its category is filtered out or it has no matches.
      shelf.classList.toggle("is-hidden", !groupMatch || shelfVisible === 0);
    });

    if (emptyState) emptyState.hidden = shown !== 0;

    if (countEl) {
      if (q === "" && activeFilter === "all") {
        countEl.textContent = totalCards + " entries indexed";
      } else {
        countEl.textContent = "Showing " + shown + " of " + totalCards + " entries";
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

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      query = searchEl.value;
      apply();
    });
    // "/" focuses search from anywhere; Escape clears it.
    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      var typing = tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchEl.focus();
      } else if (e.key === "Escape" && e.target === searchEl && searchEl.value) {
        searchEl.value = "";
        query = "";
        apply();
      }
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
