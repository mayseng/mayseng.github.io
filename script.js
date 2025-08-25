let lastInteraction = Date.now();
const statusEl = document.getElementById("status");
const titleEl = document.getElementById("title");

// Add glitch data-text for glitch layers
titleEl.setAttribute("data-text", titleEl.textContent);

// Detect activity
function resetDecay() {
  lastInteraction = Date.now();
  statusEl.textContent = "It breathes with you...";
  statusEl.style.color = "#aaa";
}
window.addEventListener("mousemove", resetDecay);
window.addEventListener("click", resetDecay);
window.addEventListener("keydown", resetDecay);

// Decay effect
setInterval(() => {
  let now = Date.now();
  if (now - lastInteraction > 6000) { // 6 seconds inactivity
    statusEl.textContent = "It is decaying...";
    statusEl.style.color = "#ff0033";

    // Background turns darker, particles dim
    document.body.style.background = `radial-gradient(circle at center, #150015, #000 90%)`;
    document.querySelectorAll(".particles").forEach(p => {
      p.style.background = "rgba(255, 0, 51, 0.3)";
    });
  } else {
    document.body.style.background = `radial-gradient(circle at center, #0a0a0a, #000 80%)`;
    document.querySelectorAll(".particles").forEach(p => {
      p.style.background = "rgba(0, 255, 204, 0.3)";
    });
