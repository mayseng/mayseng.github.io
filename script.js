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

// Boot sequence lines
const bootLines = [
  "[BOOT] Initializing system...",
  "[BOOT] Loading kernel modules...",
  "[BOOT] WARNING: Corruption detected.",
  "[BOOT] Attempting repair...",
  "[BOOT] Repair failed.",
  "[BOOT] Launching Glitch Terminal..."
];

let lineIndex = 0;

// Boot typing effect
function typeBootLine() {
  if (lineIndex < bootLines.length) {
    bootText.textContent += bootLines[lineIndex] + "\n";
    lineIndex++;
    setTimeout(typeBootLine, 800);
  } else {
    setTimeout(() => {
      bootScreen.classList.add("hidden");
      terminal.classList.remove("hidden");
      startTerminal();
    }, 1000);
  }
}
typeBootLine();

// === Terminal Start ===
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

  // Corruption increases slowly
  corruptionTimer = setInterval(() => {
    corruptionLevel++;
    updateCorruption();
    if (corruptionLevel % 10 === 0) glitchEvent();
  }, 5000);

  // FIX: command listener
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const cmd = input.value.trim();
      if (cmd !== "") {
        printLine("> " + cmd);
        handleCommand(cmd);
      }
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
  switch(cmd.toLowerCase()) {
    case "help":
      printLine("Available commands: help, hello, repair, shutdown, unlock, clear");
      break;
    case "hello":
      printLine("...It sees you.");
      break;
    case "repair":
      corruptionLevel = Math.max(0, corruptionLevel - 10);
      printLine("Repair attempt successful. Corruption reduced.");
      updateCorruption();
      break;
    case "shutdown":
      printLine("System shutting down...");
      setTimeout(() => location.reload(), 2000);
      break;
    case "unlock":
      printLine(">>> SECRET FILE UNLOCKED <<<");
      printLine("lorem.ipsum.corruptum...");
      break;
    case "clear":
      output.innerHTML = "";
      break;
    default:
      printLine("Unknown command: " + cmd);
  }
}
