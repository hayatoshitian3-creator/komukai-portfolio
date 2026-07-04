const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("nav-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => siteNav.classList.remove("nav-open"));
  });
}

const yearEl = document.getElementById("current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
