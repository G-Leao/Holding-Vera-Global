/**
 * Animations Module - Elegant scroll reveal animations
 * @module animations
 */

export function initAnimations() {
  // --- Scroll Reveal using Intersection Observer ---
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));

  // --- Stagger children animation ---
  const staggerContainers = document.querySelectorAll("[data-stagger]");
  staggerContainers.forEach((container) => {
    const children = container.children;
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("is-visible");
              }, index * 120);
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.1 },
    );
    staggerObserver.observe(container);
  });

  // --- Counter animation for metrics ---
  const counters = document.querySelectorAll("[data-counter]");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-counter"), 10);
    if (isNaN(target)) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(counter, target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    counterObserver.observe(counter);
  });
}

function animateCounter(element, target) {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const duration = 1500;
  const stepTime = Math.floor(duration / 60);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current + "+";
  }, stepTime);
}

/**
 * Smooth parallax effect for hero sections
 */
export function initParallax() {
  const parallaxElements = document.querySelectorAll("[data-parallax]");
  if (parallaxElements.length === 0) return;

  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    },
    { passive: true },
  );
}
