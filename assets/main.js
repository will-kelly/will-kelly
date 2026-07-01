/* Small interactions: mobile nav toggle + footer year. */
(function () {
  "use strict";

  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    // Date.now() is unavailable in some sandboxes; guard defensively.
    try { yearEl.textContent = String(new Date().getFullYear()); } catch (e) { /* keep default */ }
  }
})();
