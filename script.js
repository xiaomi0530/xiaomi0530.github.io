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
const projects = [...document.querySelectorAll(".project-card")];
const projectLinks = [...document.querySelectorAll(".project-index a")];
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
  let activeProject = projects[0]?.id;
  projects.forEach((project) => {
    if (project.getBoundingClientRect().top <= marker) activeProject = project.id;
  });
  projectLinks.forEach((link) => {
    if (activeId === "projects" && link.hash === "#" + activeProject) link.setAttribute("aria-current", "location");
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

// Attach captions outside scroll frames so labels stay visible while reading.
const plates = document.querySelectorAll(".paper-preview, .media-item:has(img), .touch-card, .sxq-frame, .instrument-preview");
plates.forEach((frame, index) => {
  const img = frame.querySelector("img");
  let caption = frame.parentElement.querySelector(":scope > figcaption");
  let host = frame.parentElement;
  if (!caption) {
    host = document.createElement("div");
    host.className = "image-plate";
    if (frame.matches(".paper-preview")) host.classList.add("paper-plate");
    frame.before(host);
    host.append(frame);
    caption = document.createElement("p");
    caption.textContent = img.alt;
    host.append(caption);
  }
  caption.classList.add("plate-caption");
  const number = document.createElement("span");
  number.className = "plate-number";
  number.textContent = "FIG. " + String(index + 1).padStart(2, "0");
  caption.prepend(number);
  if (img.getAttribute("src").includes("BBCPU_evl")) frame.classList.add("bbc-evaluation");

  if (frame.matches(".paper-preview, .media-scroll-preview, .touch-card, .sxq-frame:not(.sxq-frame-static), .instrument-preview")) {
    const track = document.createElement("div");
    track.className = "preview-progress";
    track.setAttribute("aria-hidden", "true");
    const fill = document.createElement("span");
    track.append(fill);
    frame.after(track);
    const update = () => {
      const range = frame.scrollHeight - frame.clientHeight;
      track.hidden = range <= 1;
      fill.style.transform = "scaleX(" + (range > 0 ? Math.min(1, Math.max(0, frame.scrollTop / range)) : 1) + ")";
    };
    frame.addEventListener("scroll", update, { passive: true });
    img.addEventListener("load", update);
    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(frame);
      resizeObserver.observe(img);
    } else window.addEventListener("resize", update);
    update();
  }
});

const viewer = document.querySelector(".image-viewer");
const stage = viewer.querySelector(".viewer-stage");
const canvasImage = viewer.querySelector(".viewer-image");
let sourceImage = null;
let scale = 1;
let fitWidth = 0;
let fitHeight = 0;

function resizeImage() {
  canvasImage.style.width = fitWidth * scale + "px";
  canvasImage.style.height = fitHeight * scale + "px";
  stage.classList.toggle("is-zoomed", scale > 1);
  viewer.querySelector('[data-viewer="out"]').disabled = scale <= 1;
  viewer.querySelector('[data-viewer="in"]').disabled = scale >= 8;
}
function fitImage() {
  if (!canvasImage.naturalWidth || !viewer.open) return;
  const ratio = Math.min(1, Math.max(1, stage.clientWidth - 32) / canvasImage.naturalWidth,
    Math.max(1, stage.clientHeight - 32) / canvasImage.naturalHeight);
  fitWidth = canvasImage.naturalWidth * ratio;
  fitHeight = canvasImage.naturalHeight * ratio;
  scale = 1;
  resizeImage();
  stage.scrollTo(0, 0);
}
function zoomImage(factor) {
  const previous = scale;
  scale = Math.min(8, Math.max(1, scale * factor));
  const x = stage.scrollLeft + stage.clientWidth / 2;
  const y = stage.scrollTop + stage.clientHeight / 2;
  resizeImage();
  stage.scrollTo(Math.max(0, x * scale / previous - stage.clientWidth / 2),
    Math.max(0, y * scale / previous - stage.clientHeight / 2));
}
canvasImage.addEventListener("load", fitImage);
canvasImage.draggable = false;
document.querySelectorAll(".project-card img:not(.repo-link img), .interest-panel img").forEach((img) => {
  img.classList.add("zoomable");
  img.tabIndex = 0;
  img.setAttribute("role", "button");
  img.setAttribute("aria-haspopup", "dialog");
  img.setAttribute("aria-label", "放大查看：" + img.alt);
  const open = (event) => {
    event.preventDefault();
    sourceImage = img;
    canvasImage.alt = img.alt;
    viewer.querySelector("#viewer-title").textContent = img.alt;
    canvasImage.src = img.currentSrc || img.src;
    viewer.showModal();
    fitImage();
  };
  img.addEventListener("click", open);
  img.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") open(event);
  });
});
viewer.addEventListener("click", (event) => {
  const action = event.target.closest("[data-viewer]")?.dataset.viewer;
  if (action === "close") viewer.close();
  if (action === "fit") fitImage();
  if (action === "in") zoomImage(1.5);
  if (action === "out") zoomImage(1 / 1.5);
  if (event.target === viewer) {
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  }
});
viewer.addEventListener("keydown", (event) => {
  if (event.key === "+" || event.key === "=") { event.preventDefault(); zoomImage(1.5); }
  if (event.key === "-") { event.preventDefault(); zoomImage(1 / 1.5); }
  if (event.key === "0") { event.preventDefault(); fitImage(); }
});
viewer.addEventListener("close", () => sourceImage?.focus({ preventScroll: true }));
window.addEventListener("resize", () => { if (viewer.open) fitImage(); });

let drag = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "mouse" || event.button !== 0 || scale <= 1) return;
  drag = { x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop };
  stage.setPointerCapture(event.pointerId);
  stage.classList.add("is-dragging");
  event.preventDefault();
});
stage.addEventListener("pointermove", (event) => {
  if (!drag) return;
  stage.scrollTo(drag.left - event.clientX + drag.x, drag.top - event.clientY + drag.y);
});
stage.addEventListener("lostpointercapture", () => {
  drag = null;
  stage.classList.remove("is-dragging");
});
