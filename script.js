// Core interactions: project filters, contact copy and footer year.
const filterButtons = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const selected = button.dataset.filter;
    projectCards.forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      const show = selected === 'all' || categories.includes(selected);
      card.classList.toggle('hidden', !show);
      if (show) card.removeAttribute('aria-hidden'); else card.setAttribute('aria-hidden', 'true');
    });
  });
});

const toast = document.getElementById('toast');
const copyEmail = document.getElementById('copyEmail');
if (copyEmail && toast) {
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('kkavanashree16@gmail.com');
      toast.textContent = 'Email copied to clipboard';
    } catch {
      toast.textContent = 'Email: kkavanashree16@gmail.com';
    }
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2200);
  });
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
