const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const revealTargets = document.querySelectorAll(
  ".hero, .education-item, .project-card, .skill-panel, .interest-panel, .media-item, .paper-preview"
);

if (revealTargets.length) {
  document.body.classList.add("js-reveal");

  revealTargets.forEach((element) => {
    element.classList.add("reveal-target");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      }
    );

    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }
}
