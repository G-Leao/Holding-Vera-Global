/* ============================================================
   HOLDING VERA GLOBAL 2.0 — GLOBAL.JS
   Utilitários compartilhados: header, scroll reveal, parallax,
   contadores e motor de canvas (JavaScript Vanilla).
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var lowPower = navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency <= 4
    : false;

  /* ---------------- Header ---------------- */
  function initHeader() {
    var header = document.querySelector("[data-header]");
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!header) return;

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      window.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* Estado ativo da página */
    var current = document.body.getAttribute("data-page");
    if (current) {
      var link = document.querySelector(
        '[data-nav] a[data-page-link="' + current + '"]',
      );
      if (link) link.setAttribute("aria-current", "page");
    }
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    items.forEach(function (el, i) {
      var group = el.closest("[data-reveal-group]");
      if (group && !el.style.getPropertyValue("--reveal-delay")) {
        var siblings = Array.prototype.slice.call(
          group.querySelectorAll("[data-reveal]"),
        );
        el.style.setProperty(
          "--reveal-delay",
          Math.min(siblings.indexOf(el), 6) * 90 + "ms",
        );
      } else if (!group) {
        el.style.setProperty("--reveal-delay", (i % 3) * 60 + "ms");
      }
      io.observe(el);
    });
  }

  /* ---------------- Parallax mínimo ---------------- */
  function initParallax() {
    var items = Array.prototype.slice.call(
      document.querySelectorAll("[data-parallax]"),
    );
    if (!items.length || reduceMotion) return;
    var running = false;

    function update() {
      running = false;
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.06;
        var offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = "translate3d(0," + offset.toFixed(2) + "px,0)";
      });
    }

    function onScroll() {
      if (running) return;
      running = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  /* ---------------- Contadores ---------------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }
      var start = performance.now();
      var dur = 1400;
      function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          run(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------------- Ano no rodapé ---------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------- Motor de canvas reutilizável ----------------
     VG.canvas(el, draw) cuida de: devicePixelRatio, resize,
     requestAnimationFrame, pausa fora da viewport e reduced-motion. */
  function canvasEngine(el, draw, options) {
    if (!el) return null;
    var opts = options || {};
    var ctx = el.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 2);
    var w = 0;
    var h = 0;
    var raf = null;
    var visible = true;
    var t = 0;

    function resize() {
      var rect = el.getBoundingClientRect();
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (opts.onResize) opts.onResize(w, h);
      if (reduceMotion) frame(0, true);
    }

    function frame(now, once) {
      ctx.clearRect(0, 0, w, h);
      t += 1;
      draw(ctx, w, h, t);
      if (!once && visible && !reduceMotion) raf = requestAnimationFrame(frame);
    }

    var io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !raf && !reduceMotion)
          raf = requestAnimationFrame(frame);
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
      io.observe(el);
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    if (!reduceMotion) raf = requestAnimationFrame(frame);
    return { resize: resize };
  }

  /* Paleta compartilhada para os canvas */
  var palette = {
    line: "rgba(120, 165, 235, 0.30)",
    lineSoft: "rgba(120, 165, 235, 0.13)",
    accent: "rgba(0, 180, 255, 0.85)",
    accentSoft: "rgba(0, 180, 255, 0.28)",
    blue: "rgba(59, 130, 246, 0.75)",
    dot: "rgba(200, 225, 255, 0.9)",
  };

  window.VG = {
    canvas: canvasEngine,
    palette: palette,
    reduceMotion: reduceMotion,
    lowPower: lowPower,
  };

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initReveal();
    initParallax();
    initCounters();
    initYear();
  });
})();
