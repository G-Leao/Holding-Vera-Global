/* ============================================================
   HOLDING VERA GLOBAL — EMPRESAS.JS
   Ecosystem page interactions
   ============================================================ */

(function () {
  "use strict";

  // ---- Animated Counter ----
  function animateCounters() {
    const counters = document.querySelectorAll("[data-count]");
    counters.forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.querySelector(".eco-metric-suffix");
      const suffixText = suffix ? suffix.textContent : "";
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        if (suffix) {
          el.innerHTML = `<span class="eco-metric-value">${current}<span class="eco-metric-suffix">${suffixText}</span></span>`;
        } else {
          // If this is the .eco-hero-stat-num, don't replace the entire element
          if (el.classList.contains("eco-hero-stat-num")) {
            if (target === 100) {
              el.textContent = current + "%";
            } else {
              el.textContent = current;
            }
          } else {
            el.textContent = current;
          }
        }
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (suffix) {
            el.innerHTML = `<span class="eco-metric-value">${target}<span class="eco-metric-suffix">${suffixText}</span></span>`;
          } else {
            if (el.classList.contains("eco-hero-stat-num")) {
              el.textContent = target + (target === 100 ? "%" : "");
            } else {
              el.textContent = target;
            }
          }
        }
      }
      requestAnimationFrame(update);
    });
  }

  // ---- Intersection Observer for animated elements ----
  function setupObservers() {
    const observerOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };

    // Counter observer - triggers once
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.disconnect();
        }
      });
    }, observerOptions);

    const metricsSection = document.querySelector(".eco-metrics-section");
    if (metricsSection) counterObserver.observe(metricsSection);

    // Fade-in observer for company sections
    const appearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("eco-visible");
            appearObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );

    document
      .querySelectorAll(
        ".eco-company-grid, .eco-intro-layout, .eco-synergies-grid, .eco-metrics-header",
      )
      .forEach((el) => appearObserver.observe(el));
  }

  // ---- Parallax effect on hero ----
  function setupParallax() {
    const hero = document.querySelector(".eco-hero");
    if (!hero || window.innerWidth < 768) return;

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const bg = hero.querySelector(".eco-hero-bg");
      if (bg) {
        bg.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    });
  }

  // ---- Globe connection pulse ----
  function setupGlobePulse() {
    const dots = document.querySelectorAll(".eco-globe-dots span");
    dots.forEach((dot, i) => {
      dot.style.animationDelay = `${i * 0.4}s`;
    });
  }

  // ---- Initialize ----
  document.addEventListener("DOMContentLoaded", () => {
    setupObservers();
    setupParallax();
    setupGlobePulse();

    // Set year
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Back to top
    const backBtn = document.querySelector("[data-back-to-top]");
    if (backBtn) {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 400) {
          backBtn.classList.add("is-visible");
        } else {
          backBtn.classList.remove("is-visible");
        }
      });
      backBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });

  // ---- Scroll-triggered reveal via CSS class ----
  document
    .querySelectorAll(".eco-company-grid, .eco-intro-layout")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    });

  // Add visible class styles
  const style = document.createElement("style");
  style.textContent = `
    .eco-company-grid.eco-visible,
    .eco-intro-layout.eco-visible,
    .eco-synergies-grid.eco-visible,
    .eco-metrics-header.eco-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
})();
