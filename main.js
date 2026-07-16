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
  var cards = Array.prototype.slice.call(document.querySelectorAll(".catalog .card"));
  var emptyState = document.getElementById("empty-state");
  var searchInput = document.getElementById("catalog-search");
  var countEl = document.getElementById("catalog-count");

  var activeFilter = "all";
  var query = "";

  // Precompute lowercased searchable text per card once.
  cards.forEach(function (card) {
    card.dataset.text = (card.textContent || "").toLowerCase().replace(/\s+/g, " ");
  });

  var totalCards = cards.length;

  function applyCatalog() {
    var q = query.trim().toLowerCase();
    var visibleCount = 0;

    shelves.forEach(function (shelf) {
      var typeMatch = activeFilter === "all" ||
        shelf.getAttribute("data-group") === activeFilter;
      var shelfHasVisible = false;

      var shelfCards = Array.prototype.slice.call(shelf.querySelectorAll(".card"));
      shelfCards.forEach(function (card) {
        var textMatch = !q || card.dataset.text.indexOf(q) !== -1;
        var show = typeMatch && textMatch;
        card.classList.toggle("is-hidden", !show);
        if (show) { shelfHasVisible = true; visibleCount++; }
      });

      shelf.classList.toggle("is-hidden", !shelfHasVisible);
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
    if (countEl) {
      if (!q && activeFilter === "all") {
        countEl.textContent = totalCards + " entries";
      } else {
        countEl.textContent = visibleCount + " / " + totalCards;
      }
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeFilter = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      applyCatalog();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      query = searchInput.value;
      applyCatalog();
    });
  }

  applyCatalog();

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
