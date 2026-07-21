/* ============================================================
   HOLDING VERA GLOBAL — TECNOLOGIA.JS
   Cyber/futuristic page — Particles, stats animation, scroll effects
   ============================================================ */

(function () {
  "use strict";

  // ---- Canvas Particles ----
  function initParticles() {
    const canvas = document.getElementById("particlesCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    function resize() {
      const hero = document.querySelector(".tech-hero");
      canvas.width = hero ? hero.offsetWidth : window.innerWidth;
      canvas.height = hero ? hero.offsetHeight : window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(
        80,
        Math.floor((canvas.width * canvas.height) / 15000),
      );
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });
  }

  // ---- Animate stats bars ----
  function animateStats() {
    const statsSection = document.querySelector(".tech-stats");
    if (!statsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.querySelectorAll(".tech-stat-bar").forEach((bar) => {
              bar.classList.add("animated");
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(statsSection);
  }

  // ---- Fade in service cards ----
  function animateCards() {
    const cards = document.querySelectorAll(".tech-service-card, .tech-pillar");
    cards.forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
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

  // ---- Initialize ----
  document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    animateStats();
    animateCards();

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
