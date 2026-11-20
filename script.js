const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav-links");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
  }));
}

// Project category filters.
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const selected = button.dataset.filter;
    projectCards.forEach(card => {
      const categories = (card.dataset.category || "").split(" ");
      card.classList.toggle("hidden", selected !== "all" && !categories.includes(selected));
    });
  });
});

// Copy email address.
const toast = document.getElementById("toast");
const copyEmail = document.getElementById("copyEmail");
if (copyEmail && toast) {
  copyEmail.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("kkavanashree16@gmail.com");
      toast.textContent = "Email copied to clipboard";
    } catch {
      toast.textContent = "Email: kkavanashree16@gmail.com";
    }
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  });
}
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Scroll reveal. Classes are removed when elements leave the viewport,
// so the flow effect plays again when visitors scroll back up.
const revealTargets = document.querySelectorAll(
  "main section, .hero-main, .hero-aside, .experience, .project-card, .capability, .education-entry, .credential-list > div, .contact-inner"
);

revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  if (element.matches(".hero-main, .experience, .project-card:nth-child(odd), .education-entry")) {
    element.classList.add("reveal-left");
  } else if (element.matches(".hero-aside, .project-card:nth-child(even)")) {
    element.classList.add("reveal-right");
  }
  if (index < 2) element.classList.add("is-visible");
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -45px 0px"
  });

  revealTargets.forEach((element, index) => {
    if (index >= 2) observer.observe(element);
  });
} else {
  revealTargets.forEach(element => element.classList.add("is-visible"));
}
