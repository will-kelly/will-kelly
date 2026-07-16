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

  /* ---------- catalog filtering ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var shelves = Array.prototype.slice.call(document.querySelectorAll(".shelf"));
  var emptyState = document.getElementById("empty-state");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");

      var anyVisible = false;
      shelves.forEach(function (shelf) {
        var match = filter === "all" || shelf.getAttribute("data-group") === filter;
        shelf.classList.toggle("is-hidden", !match);
        if (match) anyVisible = true;
      });
      if (emptyState) emptyState.hidden = anyVisible;
    });
  });

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
