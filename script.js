const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const TILE = 64;
const FOV = Math.PI / 3;
const NUM_RAYS = canvas.width;

let posX = 2.5, posY = 2.5;
let dir = 0;

const SPEED = 0.07;
const ROT_SPEED = 0.04;

// 20x20 map with wider spaces (more 0s)
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,2,1],
  [1,0,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,1,0,1],
  [1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,0,0,0,1],
  [1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,1,1,1,0,1],
  [1,0,0,1,1,1,0,1,1,1,0,1,1,0,0,0,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,1,0,0,1,1,0,1,0,1],
  [1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1],
  [1,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (keys["arrowleft"] || keys["a"]) dir -= ROT_SPEED;
  if (keys["arrowright"] || keys["d"]) dir += ROT_SPEED;

  let moveX = 0, moveY = 0;
  if (keys["arrowup"] || keys["w"]) {
    moveX += Math.cos(dir) * SPEED;
    moveY += Math.sin(dir) * SPEED;
  }
  if (keys["arrowdown"] || keys["s"]) {
    moveX -= Math.cos(dir) * SPEED;
    moveY -= Math.sin(dir) * SPEED;
  }

  if (map[Math.floor(posY)][Math.floor(posX + moveX)] !== 1) posX += moveX;
  if (map[Math.floor(posY + moveY)][Math.floor(posX)] !== 1) posY += moveY;
}

function render() {
  // Sky
  ctx.fillStyle = "#87cefa";
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  // Floor
  ctx.fillStyle = "#444";
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  for (let x = 0; x < NUM_RAYS; x++) {
    const rayAngle = dir - FOV / 2 + FOV * (x / NUM_RAYS);
    let distance = 0;
    let hit = false;
    let rayX = posX;
    let rayY = posY;

    while (!hit && distance < 30) {
      rayX += Math.cos(rayAngle) * 0.05;
      rayY += Math.sin(rayAngle) * 0.05;
      distance += 0.05;

      const mapValue = map[Math.floor(rayY)]?.[Math.floor(rayX)];
      if (mapValue === 1 || mapValue === 2) hit = true;
    }

    const wallHeight = (1 / distance) * 500;

    // Adjust color by depth
    const shade = Math.max(0.2, 1 - distance / 12);
    ctx.fillStyle = `rgba(${200 * shade}, ${255 * shade}, ${255 * shade}, 1)`;
    ctx.fillRect(x, (canvas.height / 2) - wallHeight / 2, 1, wallHeight);
  }

  drawGoal();
  checkVictory();
}

function drawGoal() {
  const goalX = 18;
  const goalY = 1;

  const dx = goalX + 0.5 - posX;
  const dy = goalY + 0.5 - posY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 5) {
    const size = 80 + 10 * Math.sin(Date.now() * 0.005);
    const glow = 180 + 75 * Math.sin(Date.now() * 0.01);

    ctx.fillStyle = `rgba(${glow}, ${glow}, 100, 0.8)`;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 + 50, size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ EXIT AHEAD ✨", canvas.width / 2, canvas.height / 2 + 100);
  }
}

let hasWon = false;
function checkVictory() {
  if (hasWon) return;
  const currentTile = map[Math.floor(posY)][Math.floor(posX)];
  if (currentTile === 2) {
    hasWon = true;
    setTimeout(() => {
      alert("🎉 You reached the end of the maze! 🎉");
    }, 300);
  }
}

gameLoop();
