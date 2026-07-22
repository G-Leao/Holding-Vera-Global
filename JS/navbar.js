/**
 * Navbar Module - Premium Header with scroll effects and mobile drawer
 * @module navbar
 */

export function initNavbar() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");
  const links = document.querySelectorAll(".nav-link");

  // --- Mobile toggle ---
  // Only wire the drawer if both the toggle and the drawer exist.
  if (toggle && drawer) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      toggle.classList.toggle("is-active", open);
    };

    const isOpen = () => drawer.classList.contains("is-open");

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      setOpen(!isOpen());
    });

    // Close on link click
    links.forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    // Close when clicking outside the drawer content (on the overlay itself)
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) setOpen(false);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // --- Scroll effect: glassmorphism on scroll ---
  // Only attach if the header exists.
  if (header) {
    let lastScroll = 0;

    function handleScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll > 60) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }

      // Hide/show on scroll direction
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.classList.add("is-hidden");
      } else {
        header.classList.remove("is-hidden");
      }

      lastScroll = currentScroll;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // --- Active link highlight ---
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}
