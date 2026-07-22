/**
 * NAV.JS — Sistema de Navegação Compartilhado
 * Holding Vera Global
 *
 * Funcionalidades:
 * - Menu mobile (abrir/fechar)
 * - Fechar ao clicar em link
 * - Fechar ao pressionar ESC
 * - Header com efeito scroll (glassmorphism)
 * - Header escondendo/aparecendo ao rolar
 * - Atualização automática do ano
 * - Active link automático baseado em window.location.pathname
 */

// ============================================================
// NAVEGAÇÃO MOBILE
// ============================================================
const toggle = document.querySelector("[data-nav-toggle]");
const drawer = document.querySelector("[data-nav-drawer]");
const navLinks = document.querySelectorAll(".nav-link");

if (toggle && drawer) {
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    drawer.classList.toggle("is-open", open);
    toggle.classList.toggle("is-active", open);
  };

  const isOpen = () => drawer.classList.contains("is-open");

  // Abrir/fechar menu ao clicar no toggle
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    setOpen(!isOpen());
  });

  // Fechar ao clicar em qualquer link de navegação
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen()) {
        setOpen(false);
      }
    });
  });

  // Fechar ao clicar fora do conteúdo do menu (no overlay)
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) {
      setOpen(false);
    }
  });

  // Fechar ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Garantir estado fechado no carregamento inicial
  setOpen(false);
}

// ============================================================
// HEADER SCROLL EFFECT
// ============================================================
const header = document.querySelector("[data-header]");

if (header) {
  let lastScroll = 0;
  let ticking = false;

  const handleScroll = () => {
    const currentScroll = window.scrollY;

    // Adicionar classe is-scrolled após 60px
    if (currentScroll > 60) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    // Esconder/mostrar header baseado na direção do scroll
    if (currentScroll > lastScroll && currentScroll > 200) {
      // Scroll para baixo + mais de 200px = esconder
      header.classList.add("is-hidden");
    } else {
      // Scroll para cima = mostrar
      header.classList.remove("is-hidden");
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
}

// ============================================================
// ACTIVE LINK AUTOMÁTICO
// ============================================================
const currentPath = window.location.pathname.split("/").pop() || "index.html";

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPath) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

// ============================================================
// ATUALIZAÇÃO AUTOMÁTICA DO ANO
// ============================================================
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
