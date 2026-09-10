const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-entering");
      entry.target.addEventListener("animationend", () => {
        entry.target.classList.remove("is-entering");
      }, { once: true });
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
  document.querySelectorAll(".project-topline, .panel-head, .interest-panel > h3")
    .forEach((element) => observer.observe(element));
}

const sections = [...document.querySelectorAll("main > .section")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
let framePending = false;
function updateNavigation() {
  const marker = document.querySelector(".site-header").getBoundingClientRect().bottom + 64;
  let activeId = "";
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) activeId = section.id;
  });
  navLinks.forEach((link) => {
    if (link.hash === "#" + activeId) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  framePending = false;
}
window.addEventListener("scroll", () => {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(updateNavigation);
}, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();

document.querySelectorAll(".paper-preview, .media-scroll-preview, .sxq-frame:not(.sxq-frame-static), .touch-card, .food-strip")
  .forEach((preview) => {
    preview.tabIndex = 0;
    if (!preview.hasAttribute("aria-label")) {
      const label = preview.querySelector("img")?.alt;
      if (label) preview.setAttribute("aria-label", label);
    }
  });
