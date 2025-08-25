let lastInteraction = Date.now();
const statusEl = document.getElementById("status");
const titleEl = document.getElementById("title");

// Apply glitch data-text to title
titleEl.setAttribute("data-text", titleEl.textContent);

// Detect interaction
function resetDecay() {
  lastInteraction = Date.now();
  statusEl.textContent = "It breathes with you...";
  statusEl.style.color = "#aaa";
}
window.addEventListener("mousemove", resetDecay);
window.addEventListener("click", resetDecay);
window.addEventListener("keydown", resetDecay);

// Decay effect if inactive
setInterval(() => {
  let now = Date.now();
  if (now - lastInteraction > 5000) { // 5 sec of inactivity
    statusEl.textContent = "It is decaying...";
    statusEl.style.color = "#ff0033";

    // Add glitch effect to background
    document.body.style.background = `radial-gradient(circle at center, #100010, #000 80%)`;
  } else {
    document.body.style.background = `radial-gradient(circle at center, #0a0a0a, #000 80%)`;
  }
}, 1000);
