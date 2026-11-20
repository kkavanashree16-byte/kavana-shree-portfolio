// Interactive portfolio simulations. All calculations run locally in the browser.
const byId = id => document.getElementById(id);

const hours = byId('study-hours');
if (hours) {
  const hoursValue = byId('study-hours-value');
  hours.addEventListener('input', () => hoursValue.textContent = `${hours.value} hour${hours.value === '1' ? '' : 's'}`);
  byId('make-study-plan').addEventListener('click', () => {
    const total = Number(hours.value), priority = byId('study-priority').value;
    const priorityMins = Math.round(total * 60 * 0.5), otherMins = total * 60 - priorityMins;
    byId('study-plan-output').innerHTML = `<strong>Your ${total}-hour sample plan</strong><ul><li>${priority}: ${priorityMins} min — focused practice</li><li>Second subject: ${Math.round(otherMins * .65)} min — revision</li><li>Breaks & recap: ${Math.round(otherMins * .35)} min</li></ul><span>Tip: start with your priority subject while your focus is fresh.</span>`;
  });
}

const fruitExamples = {
  banana: ['Ripe', 'Yellow colour with small brown speckles — example visual cue.'],
  tomato: ['Ripe', 'Even red colour — example visual cue.'],
  mango: ['Almost ripe', 'Mostly yellow/orange skin — example visual cue.'],
  avocado: ['Ready to check', 'Colour alone is not reliable; firmness should also be checked.']
};
if (byId('scan-fruit')) byId('scan-fruit').addEventListener('click', () => {
  const [stage, note] = fruitExamples[byId('fruit-choice').value];
  byId('fruit-output').innerHTML = `<strong>Sample result: ${stage}</strong><br>${note}`;
});

const passwordInput = byId('demo-password');
if (passwordInput) passwordInput.addEventListener('input', () => {
  const value = passwordInput.value;
  const score = [value.length >= 8, value.length >= 12, /[a-z]/.test(value) && /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
  const level = !value ? 'Not checked' : score <= 2 ? 'Weak' : score <= 3 ? 'Medium' : 'Strong';
  const bars = byId('strength-meter').querySelectorAll('i');
  bars.forEach((bar, index) => bar.classList.toggle('filled', index < Math.min(4, Math.ceil(score * .8))));
  byId('password-output').innerHTML = value ? `<strong>Example strength: ${level}</strong><br>${value.length} characters · ${score}/5 simple checks passed.` : 'Your check runs locally in this browser.';
});

function estimateHome() {
  const area = Math.max(300, Math.min(10000, Number(byId('home-area').value) || 300));
  const rate = Number(byId('home-location').value), beds = Number(byId('home-beds').value);
  const estimate = area * rate * (1 + Math.max(0, beds - 2) * .035);
  byId('home-output').innerHTML = `<strong>Illustrative estimate: ₹${(estimate / 100000).toFixed(1)} lakh</strong><br>${area.toLocaleString('en-IN')} sq. ft. × ₹${rate.toLocaleString('en-IN')}/sq. ft., with a small bedroom adjustment.`;
}
if (byId('estimate-home')) byId('estimate-home').addEventListener('click', estimateHome);

function setThermassure(excursion) {
  byId('device-temp').textContent = excursion ? '8.6°C' : '4.8°C';
  byId('device-state').textContent = excursion ? 'TEMPERATURE ALERT' : 'DEVICE CONNECTED';
  byId('device-dot').classList.toggle('is-alert', excursion);
  byId('device-battery').textContent = excursion ? '91%' : '92%';
  byId('device-sync').textContent = 'JUST NOW';
  byId('thermassure-output').innerHTML = excursion ? '<strong>Excursion detected</strong><br>Example temperature is above the illustrative 2–8°C range. A real system would record and report this event.' : '<strong>Temperature normal</strong><br>Example reading is within the illustrative 2–8°C range.';
}
if (byId('normal-reading')) byId('normal-reading').addEventListener('click', () => setThermassure(false));
if (byId('excursion-reading')) byId('excursion-reading').addEventListener('click', () => setThermassure(true));
