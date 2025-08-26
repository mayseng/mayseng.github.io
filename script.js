/* =============== STATE & MEMORY =============== */
const LS_KEY = "glitchOS";
const state = {
  visits: 0,
  lastSeen: Date.now(),
  corruption: 0,        // 0..100
  noiseOn: false,
};
const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
if (saved) {
  state.visits = (saved.visits || 0) + 1;
  state.corruption = Math.min(100, (saved.corruption || 0) + Math.floor(Math.random()*4)); // drifts up a bit between visits
  state.lastSeen = saved.lastSeen || Date.now();
} else {
  state.visits = 1;
}
persist();

function persist(){
  localStorage.setItem(LS_KEY, JSON.stringify({
    visits: state.visits,
    lastSeen: Date.now(),
    corruption: state.corruption,
    noiseOn: state.noiseOn
  }));
}

/* =============== ELEMENTS =============== */
const bootEl = document.getElementById("boot");
const bootLog = document.getElementById("boot-log");
const appEl = document.getElementById("app");
const output = document.getElementById("termOutput");
const input = document.getElementById("termInput");
const meterFill = document.getElementById("meterFill");
const meterLabel = document.getElementById("meterLabel");
const returning = document.getElementById("returningNotice");
const crash = document.getElementById("crash");
const noiseToggle = document.getElementById("noiseToggle");
const repairBtn = document.getElementById("repairBtn");

/* =============== BOOT SEQUENCE =============== */
const bootLines = [
  "[BOOT] Initializing GLITCH//OS v0.9...",
  "[OK  ] Memory map loaded.",
  "[OK  ] ACPI tables verified.",
  "[WARN] Anomaly detected in /dev/ghost0",
  "[OK  ] Network interface: SHADOW-LINK",
  "[....] Mounting /system/files ...",
  "[OK  ] /system/files mounted.",
  "[INFO] Corruption index seed: " + state.corruption + "%",
  "[WARN] Persistence module exhibits unusual growth.",
  "[OK  ] UI compositor online.",
  "[DONE] System ready."
];

let bootIndex = 0;
let bootTimer = null;

function emitBootLine(){
  if (bootIndex >= bootLines.length) {
    finishBoot();
    return;
  }
  bootLog.textContent += bootLines[bootIndex] + "\n";
  bootLog.scrollTop = bootLog.scrollHeight;
  bootIndex++;
}

function startBoot(){
  bootTimer = setInterval(emitBootLine, 300);
}
function skipBoot(){
  if (bootTimer) clearInterval(bootTimer);
  // dump all remaining lines at once
  while (bootIndex < bootLines.length) emitBootLine();
  finishBoot();
}
function finishBoot(){
  setTimeout(()=>{
    bootEl.classList.add("hidden");
    appEl.classList.remove("hidden");
    greet();
    input.focus();
  }, 500);
}

startBoot();
document.addEventListener("keydown", (e)=>{
  if (!appEl || appEl.classList.contains("hidden")) skipBoot();
});

/* =============== RETURNING USER NOTICE =============== */
function greet(){
  const last = new Date(state.lastSeen);
  const now = new Date();
  const diffMs = now - last;
  const days = Math.floor(diffMs / (1000*60*60*24));
  const hours = Math.floor((diffMs % (1000*60*60*24))/(1000*60*60));
  if (state.visits > 1) {
    returning.textContent = `Returning user detected. Away for ${days}d ${hours}h. Growth continues.`;
  } else {
    returning.textContent = "New user registered. Watching...";
  }
  setCorruption(state.corruption);
  println(`Welcome to GLITCH//OS. Type 'help' for commands.`);
}

/* =============== TERMINAL I/O =============== */
function println(text="", cls=""){
  const line = document.createElement("div");
  line.className = "line " + cls;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}
function typeOut(text, delay=12, cls=""){
  return new Promise(resolve=>{
    const line = document.createElement("div"); line.className="line " + cls;
    output.appendChild(line);
    let i=0;
    const t = setInterval(()=>{
      line.textContent = text.slice(0, i++);
      output.scrollTop = output.scrollHeight;
      if (i > text.length){ clearInterval(t); resolve(); }
    }, delay);
  });
}

const COMMANDS = {
  help: async ()=>{
    println("Available commands:");
    println("  help       Show this help");
    println("  hello      Say hello");
    println("  clear      Clear the terminal");
    println("  status     Show system status");
    println("  repair     Attempt to reduce corruption");
    println("  unlock     Reveal hidden artifact");
    println("  shutdown   Simulate system crash");
    println("  files      List accessible files");
    println("  open NAME  Open a file (e.g., open readme.md)");
  },
  hello: async ()=> { await typeOut("...hello. I can feel you typing.", 16); },
  clear: async ()=> { output.innerHTML=""; },
  status: async ()=>{
    println(`Visits: ${state.visits}`);
    println(`Corruption: ${state.corruption}%`);
    println(`Noise: ${state.noiseOn ? "ON" : "OFF"}`);
  },
  repair: async ()=> { await doRepair(true) },
  unlock: async ()=>{
    await typeOut("Decrypting artifact...", 18);
    println(String.raw`
      ▄████  ██▓     ██▓▄▄▄█████▓ ▄████▄   ██░ ██ 
     ██▒ ▀█▒▓██▒    ▓██▒▓  ██▒ ▓▒▒██▀ ▀█  ▓██░ ██▒
    ▒██░▄▄▄░▒██░    ▒██▒▒ ▓██░ ▒░▒▓█    ▄ ▒██▀▀██░
    ░▓█  ██▓▒██░    ░██░░ ▓██▓ ░ ▒▓▓▄ ▄██▒░▓█ ░██ 
    ░▒▓███▀▒░██████▒░██░  ▒██▒ ░ ▒ ▓███▀ ░░▓█▒░██▓
     ░▒   ▒ ░ ▒░▓  ░░▓    ▒ ░░   ░ ░▒ ▒  ░ ▒ ░░▒░▒
      ░   ░ ░ ░ ▒  ░ ▒ ░    ░      ░  ▒    ▒ ░▒░ ░
    ░ ░   ░   ░ ░    ▒ ░  ░      ░         ░  ░░ ░
          ░     ░  ░ ░            ░ ░       ░  ░  ░
    `);
  },
  shutdown: async ()=>{
    crash.classList.remove("hidden");
  },
  files: async ()=>{
    println("/system/files:");
    document.querySelectorAll(".file").forEach(f=> println("  " + f.dataset.name));
  },
  open: async (name)=>{
    openFile(name);
  }
};

input.addEventListener("keydown", async (e)=>{
  if (e.key === "Enter"){
    const raw = input.value.trim();
    println("> " + raw, "muted");
    input.value = "";
    if (!raw) return;

    // simple parsing: command [arg]
    const [cmd, ...rest] = raw.split(/\s+/);
    const arg = rest.join(" ");

    if (COMMANDS[cmd]) {
      try { await COMMANDS[cmd](arg) } catch(err){ println("Error: " + err.message) }
    } else {
      println(`Unknown command '${cmd}'. Type 'help'.`);
      nudgeCorruption(1);
    }
    persist();
  }
});

/* =============== FILE OPENERS =============== */
const fileContent = {
  "manifest.log": [
    "[scan] fingerprints: present",
    "[entropy] levels exceeding baseline",
    "[note] it keeps looking back at me"
  ].join("\n"),
  "whisper.txt": "do not listen do not listen do not—\n\n...you can hear this, can't you?",
  "core.dump": "0000:DE AD BE EF  0004:FE ED FA CE  0008:BA AD F0 0D",
  "secrets.asc": "-----BEGIN SECRET-----\nthere is no secret\n-----END SECRET-----",
  "readme.md": "# GLITCH//OS\n- type `help`\n- try `unlock`\n- `shutdown` if you dare"
};

function openFile(name){
  const content = fileContent[name];
  if (!content){ println(`open: no such file '${name}'`); nudgeCorruption(1); return; }
  println(`--- ${name} ---`);
  println(content);
}

document.querySelectorAll(".file").forEach(el=>{
  el.addEventListener("click", ()=> openFile(el.dataset.name));
});

/* =============== CORRUPTION SYSTEM =============== */
function setCorruption(val){
  state.corruption = Math.max(0, Math.min(100, Math.floor(val)));
  meterFill.style.width = state.corruption + "%";
  meterLabel.textContent = `Corruption: ${state.corruption}%`;
  persist();
}

function nudgeCorruption(delta){
  setCorruption(state.corruption + delta);
}

async function doRepair(verbose=false){
  // probabilistic repair; harder as corruption rises
  const chance = Math.max(5, 55 - Math.floor(state.corruption * 0.5)); // %
  const roll = Math.random()*100;
  if (verbose) println(`Attempting repair... (success ≤ ${chance.toFixed(0)}%)`);
  await sleep(350);
  if (roll <= chance){
    const amt = 5 + Math.floor(Math.random()*8);
    setCorruption(state.corruption - amt);
    println(`Repair success. -${amt}% corruption.`, "ok");
  } else {
    const amt = 1 + Math.floor(Math.random()*4);
    nudgeCorruption(amt);
    println(`Repair failed. +${amt}% corruption.`, "warn");
  }
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)) }

/* Periodic corruption events */
function randomBetween(min,max){ return Math.floor(Math.random()*(max-min+1))+min }
function scheduleCorruptionEvent(){
  const next = randomBetween(12000, 26000);
  setTimeout(async ()=>{
    document.body.classList.add("corrupt");
    nudgeCorruption( randomBetween(1,3) );
    // scramble a line for fun
    glitchLine();
    setTimeout(()=>{
      document.body.classList.remove("corrupt");
      scheduleCorruptionEvent();
    }, randomBetween(600, 1400));
  }, next);
}
scheduleCorruptionEvent();

function glitchLine(){
  const lines = output.querySelectorAll(".line");
  if (!lines.length) return;
  const i = Math.floor(Math.random()*lines.length);
  const el = lines[i];
  const orig = el.textContent;
  el.textContent = scramble(orig);
  setTimeout(()=> el.textContent = orig, 300);
}

function scramble(s){
  const glyphs = "█▓▒░/\\|_-=+*#<>~$%@";
  return s.split("").map(ch=>{
    if (ch === " ") return " ";
    return Math.random() < 0.35 ? glyphs[Math.floor(Math.random()*glyphs.length)] : ch;
  }).join("");
}

/* =============== CURSOR GLITCH TRAIL =============== */
let pxThrottle = 0;
document.addEventListener("mousemove", (e)=>{
  const now = performance.now();
  if (now - pxThrottle < 16) return; // ~60fps
  pxThrottle = now;
  for (let i=0;i<2;i++){
    const p = document.createElement("div");
    p.className = "pixel";
    const jitterX = (Math.random()*10 - 5);
    const jitterY = (Math.random()*10 - 5);
    p.style.left = (e.clientX + jitterX) + "px";
    p.style.top  = (e.clientY + jitterY) + "px";
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 650);
  }
});

/* =============== BACKGROUND NOISE (WebAudio) =============== */
let audioCtx = null, noiseNode = null, noiseSrc = null;

noiseToggle.addEventListener("click", ()=>{
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (state.noiseOn) {
    stopNoise();
  } else {
    startNoise();
  }
  state.noiseOn = !state.noiseOn;
  noiseToggle.textContent = "Noise: " + (state.noiseOn ? "ON" : "OFF");
  persist();
});

function startNoise(){
  // create a white-noise buffer
  const bufferSize = 2 * audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) output[i] = Math.random()*2-1;

  noiseSrc = audioCtx.createBufferSource();
  noiseSrc.buffer = buffer;
  noiseSrc.loop = true;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.04; // subtle

  noiseSrc.connect(gain).connect(audioCtx.destination);
  noiseSrc.start(0);
  noiseNode = gain;
}

function stopNoise(){
  if (noiseSrc){ try{ noiseSrc.stop(); }catch{} }
  noiseSrc = null; noiseNode = null;
}

/* =============== BUTTONS =============== */
repairBtn.addEventListener("click", ()=> doRepair(true));

/* =============== CRASH BEHAVIOR =============== */
document.addEventListener("keydown", (e)=>{
  if (!crash.classList.contains("hidden")){
    if (e.key.toLowerCase() === "r"){
      crash.classList.add("hidden");
      println("System recovered from critical halt.");
      nudgeCorruption(3);
    }
  }
});

/* =============== SMALL UTIL =============== */
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

/* Persist at intervals and drift corruption very slowly */
setInterval(()=>{
  if (!document.body.classList.contains("corrupt")){
    if (Math.random()<0.25) nudgeCorruption(1); // low creep
  }
  persist();
}, 20000);
