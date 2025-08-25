let lastInteraction = Date.now();
const statusEl = document.getElementById("status");
const titleEl = document.getElementById("title");
const eye = document.getElementById("eye");

// Glitch text
titleEl.setAttribute("data-text", titleEl.textContent);

// Reset decay
function resetDecay() {
  lastInteraction = Date.now();
  statusEl.textContent = "It breathes with you...";
  statusEl.style.color = "#aaa";
}

// Eye tracking & cursor trails
window.addEventListener("mousemove", (e) => {
  resetDecay();

  // Move the eye
  eye.style.left = e.pageX + "px";
  eye.style.top = e.pageY + "px";

  // Cursor trail
  const trail = document.createElement("div");
  trail.className = "cursor-trail";
  trail.style.left = e.pageX + "px";
  trail.style.top = e.pageY + "px";
  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 800);
});

// Click spawns energy orb
window.addEventListener("click", (e) => {
  resetDecay();
  spawnEnergyOrb(e.pageX, e.pageY);
});

window.addEventListener("keydown", resetDecay);

// Inactivity decay
setInterval(() => {
  let now = Date.now();
  if (now - lastInteraction > 6000) {
    statusEl.textContent = "It is decaying...";
    statusEl.style.color = "#ff3366";
    document.body.style.filter = "hue-rotate(45deg) brightness(0.7)";
  } else {
    document.body.style.filter = "hue-rotate(0deg) brightness(1)";
  }
}, 1000);

// Energy orb feature
function spawnEnergyOrb(x, y) {
  const orb = document.createElement("div");
  orb.className = "energy-orb";
  orb.style.left = `${x - 7}px`;
  orb.style.top = `${y - 7}px`;
  document.body.appendChild(orb);
  setTimeout(() => orb.remove(), 2500);
}
