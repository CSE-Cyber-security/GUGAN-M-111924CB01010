const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");
const strengthText = document.getElementById("strengthText");
const meterFill = document.getElementById("meterFill");
const meter = document.querySelector(".meter");
const feedback = document.getElementById("feedback");

const checks = {
  length: value => value.length >= 8,
  lower: value => /[a-z]/.test(value),
  upper: value => /[A-Z]/.test(value),
  number: value => /[0-9]/.test(value),
  symbol: value => /[^A-Za-z0-9]/.test(value)
};

toggleButton.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleButton.textContent = isHidden ? "Hide" : "Show";
  toggleButton.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  let score = 0;

  Object.entries(checks).forEach(([id, test]) => {
    const passed = test(value);
    const item = document.getElementById(id);
    item.classList.toggle("valid", passed);
    item.querySelector(".check").textContent = passed ? "✓" : "○";
    if (passed) score++;
  });

  // Reward length beyond the minimum, while keeping the displayed score capped.
  if (value.length >= 12) score = Math.min(5, score + 1);
  if (!value) score = 0;

  const levels = [
    { label: "Not entered", color: "#64748b", message: "Start typing to check your password." },
    { label: "Very weak", color: "#ef6262", message: "Add more character types and make it longer." },
    { label: "Weak", color: "#f28b55", message: "A few improvements will make this stronger." },
    { label: "Fair", color: "#e8bd58", message: "Good start. Try adding length and variety." },
    { label: "Strong", color: "#55c99a", message: "Good password structure. Keep it unique." },
    { label: "Very strong", color: "#63a8ff", message: "Great structure. A unique passphrase is even better." }
  ];
  const level = !value ? levels[0] : levels[Math.min(score, 5)];
  const percentage = !value ? 0 : Math.max(12, Math.min(100, score * 20));

  strengthText.textContent = level.label;
  strengthText.style.color = level.color;
  meterFill.style.width = percentage + "%";
  meterFill.style.background = level.color;
  meter.setAttribute("aria-valuenow", String(Math.min(score, 4)));
  feedback.textContent = level.message;
});
