import { initNavbar } from "./navbar.js";
import { initAnimations } from "./animations.js";
import { initScroll } from "./scroll.js";

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initAnimations();
  initScroll();
});
