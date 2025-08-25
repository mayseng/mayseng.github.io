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
 
