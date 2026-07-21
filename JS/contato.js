/* ============================================================
   HOLDING VERA GLOBAL — CONTATO.JS
   Contact page — smooth scroll, card interactions
   ============================================================ */

(function () {
  "use strict";

  // ---- Card reveal animation ----
  function animateCards() {
    const cards = document.querySelectorAll(".ctt-card, .ctt-info-card");
    cards.forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    cards.forEach((card) => observer.observe(card));
  }

  // ---- Map pin animation on scroll ----
  function animateMapPin() {
    const pin = document.querySelector(".ctt-map-pin");
    if (!pin) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pin.style.animation = "pinAppear 0.8s ease forwards";
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(pin);
  }

  // ---- Initialize ----
  document.addEventListener("DOMContentLoaded", () => {
    animateCards();
    animateMapPin();

    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

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
