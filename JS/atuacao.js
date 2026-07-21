/* ============================================================
   HOLDING VERA GLOBAL — ATUACAO.JS
   Expertise page interactions — SVG circle animations & scroll effects
   ============================================================ */

(function () {
  "use strict";

  // ---- SVG Gradient definition for progress circles ----
  function injectSvgGradient() {
    const svgNS = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(svgNS, "defs");
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.id = "specGradient";
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "100%");

    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#3b82f6");

    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#8b5cf6");

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);

    // Add defs to each circle SVG
    document.querySelectorAll(".exp-spec-circle svg").forEach((svg) => {
      svg.prepend(defs.cloneNode(true));
    });
  }

  // ---- Animate specialization circles ----
  function animateCircles() {
    const circles = document.querySelectorAll(".exp-spec-circle");
    circles.forEach((circle) => {
      const pct = parseInt(circle.dataset.pct, 10);
      const circumference = 2 * Math.PI * 42; // r=42
      const offset = circumference - (pct / 100) * circumference;
      circle.style.setProperty("--target", offset.toString());
      circle.classList.add("animated");
    });
  }

  // ---- Intersection Observer for circles ----
  function setupObservers() {
    const observerOptions = { threshold: 0.3 };

    const circleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCircles();
          circleObserver.disconnect();
        }
      });
    }, observerOptions);

    const specSection = document.querySelector(".exp-spec");
    if (specSection) circleObserver.observe(specSection);

    // Fade-in for cards on scroll
    const appearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            appearObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    document.querySelectorAll(".exp-card").forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      appearObserver.observe(card);
    });
  }

  // ---- Hero parallax ----
  function setupParallax() {
    const hero = document.querySelector(".exp-hero");
    if (!hero || window.innerWidth < 768) return;
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const bars = hero.querySelector(".exp-hero-bars");
      if (bars) {
        bars.style.transform = `translateY(${scrolled * 0.08}px)`;
      }
    });
  }

  // ---- Initialize ----
  document.addEventListener("DOMContentLoaded", () => {
    injectSvgGradient();
    setupObservers();
    setupParallax();

    // Year
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Back to top
    const backBtn = document.querySelector("[data-back-to-top]");
    if (backBtn) {
      window.addEventListener("scroll", () => {
        backBtn.classList.toggle("is-visible", window.pageYOffset > 400);
      });
      backBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });
})();
