const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav-links");

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

// Project category filters.
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const selected = button.dataset.filter;
    projectCards.forEach(card => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("hidden", selected !== "all" && !categories.includes(selected));
    });
  });
});

// Copy email address.
const toast = document.getElementById("toast");
document.getElementById("copyEmail").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("kkavanashree16@gmail.com");
    toast.textContent = "Email copied to clipboard";
  } catch {
    toast.textContent = "Email: kkavanashree16@gmail.com";
  }
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
});

document.getElementById("year").textContent = new Date().getFullYear();
