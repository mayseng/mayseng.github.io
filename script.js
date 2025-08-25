let lastInteraction = Date.now();
const statusEl = document.getElementById("status");
const titleEl = document.getElementById("title");
const eye = document.getElementById("eye");

titleEl.setAttribute("data-text", titleEl.textContent);

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
  for (let i = 0; i < 2; i++) {
    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    trail.style.left = (e.pageX + Math.random()*10 - 5) + "px";
    trail.style.top = (e.pageY + Math.random()*10 - 5) + "px";
    document.body.appendChild(trail);
    setTimeout(()=>trail.remove(), 1000);
  }
});

// Click energy orbs
window.addEventListener("click", (e)=>{
  resetDecay();
  const orb = document.createElement("div");
  orb.className="energy-orb";
  orb.style.left = `${e.pageX-10}px`;
  orb.style.top = `${e.pageY-10}px`;
  document.body.appendChild(orb);
  setTimeout(()=>orb.remove(),2500);
});

window.addEventListener("keydown", resetDecay);

// Inactivity decay
setInterval(()=>{
  let now = Date.now();
  if(now-lastInteraction>6000){
    statusEl.textContent="It is decaying...";
    statusEl.style.color="#ff3366";
    document.body.style.filter="hue-rotate(45deg) brightness(0.7)";
  }else{
    document.body.style.filter="hue-rotate(0deg) brightness(1)";
  }
},1000);
