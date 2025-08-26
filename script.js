const bootText = document.getElementById("boot-text");
const bootScreen = document.getElementById("boot-screen");
const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const input = document.getElementById("command-input");
const corruptionBar = document.getElementById("corruption-bar");
const glitchSound = document.getElementById("glitch-sound");

let corruptionLevel = parseInt(localStorage.getItem("corruption")) || 0;
let lastVisit = localStorage.getItem("lastVisit");
let corruptionTimer;

// Boot sequence text
const bootLines = [
  "[BOOT] Initializing system...",
  "[BOOT] Loading kernel modules...",
  "[BOOT] WARNING: Corruption detected.",
  "[BOOT] Attempting repair...",
  "[BOOT] Repair failed.",
  "[BOOT] Launching Glitch Terminal..."
];

let lineIndex = 0;

function typeBootLine() {
  if (lineIndex < bootLines.length) {
    bootText.textContent += bootLines[lineIndex] + "\n";
    lineIndex++;
    setTimeout(typeBootLine, 1000);
  } else {
    setTimeout(() => {
      bootScreen.classList.add("hidden");
      terminal.classList.remove("hidden");
      startTerminal();
    }, 1000);
  }
}

typeBootLine();

// Terminal
function startTerminal() {
  if (lastVisit) {
    printLine(`System remembers you... Last login: ${lastVisit}`);
    printLine(`Corruption spread increased by 5% since then.`);
    corruptionLevel += 5;
  } else {
    printLine("Welcome new user. Type 'help' for commands.");
  }

  localStorage.setItem("lastVisit", new Date().toLocaleString());
  updateCorruption();

  // Corruption increases over time
  corruptionTimer = setInterval(() => {
    corruptionLevel++;
    updateCorruption();
    if (corruptionLevel % 10 === 0) glitchEvent();
  }, 5000);

  // Command input
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      handleCommand(input.value.trim());
      input.value = "";
    }
  });

  // Cursor trails
  document.addEventListener("mousemove", e => {
    for (let i = 0; i < 2; i++) {
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      trail.style.left = (e.pageX + Math.random()*10 - 5) + "px";
      trail.style.top = (e.pageY + Math.random()*10 - 5) + "px";
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 800);
    }
  });
}

function printLine(text) {
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function updateCorruption() {
  if (corruptionLevel > 100) corruptionLevel = 100;
  corruptionBar.style.width = corruptionLevel + "%";
  localStorage.setItem("corruption", corruptionLevel);
}

function glitchEvent() {
  glitchSound.play();
  document.body.style.filter = "invert(1) blur(2px)";
  setTimeout(() => { document.body.style.filter = "none"; }, 300);
  printLine("[ERROR] System glitch occurred.");
}

function handleCommand(cmd) {
  if (cmd === "help") {
    printLine("Available commands: help, hello, repair, shutdown, unlock, clear");
  } else if (cmd === "hello") {
    printLine("...It sees you.");
  } else if (cmd === "repair") {
    corruptionLevel = Math.max(0, corruptionLevel - 10);
    printLine("Repair attempt successful. Corruption reduced.");
    updateCorruption();
  } else if (cmd === "shutdown") {
    printLine("System shutting down...");
    setTimeout(() => location.reload(), 2000);
  } else if (cmd === "unlock") {
    printLine(">>> SECRET FILE UNLOCKED <<<");
    printLine("Lorem ipsum corruptum est...");
  } else if (cmd === "clear") {
    output.innerHTML = "";
  } else {
    printLine("Unknown command: " + cmd);
  }
}
