const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// --- Map setup (1 = wall, 0 = empty)
const map = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,1,0,0,0,1],
  [1,0,0,1,0,1,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1]
];

const TILE = 64; // wall size
let posX = 2.5, posY = 2.5; // player position
let dir = 0; // facing angle

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Main game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  const speed = 0.05;
  const rotSpeed = 0.03;

  if (keys["ArrowLeft"] || keys["a"]) dir -= rotSpeed;
  if (keys["ArrowRight"] || keys["d"]) dir += rotSpeed;

  let moveX = 0, moveY = 0;
  if (keys["ArrowUp"] || keys["w"]) {
    moveX += Math.cos(dir) * speed;
    moveY += Math.sin(dir) * speed;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    moveX -= Math.cos(dir) * speed;
    moveY -= Math.sin(dir) * speed;
  }

  // Collision detection
  if (map[Math.floor(posY)][Math.floor(posX + moveX)] === 0) posX += moveX;
  if (map[Math.floor(posY + moveY)][Math.floor(posX)] === 0) posY += moveY;
}

function render() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const numRays = canvas.width;
  const fov = Math.PI / 3;

  for (let x = 0; x < numRays; x++) {
    const rayAngle = dir - fov/2 + fov * (x / numRays);
    let distance = 0;
    let hit = false;

    let rayX = posX;
    let rayY = posY;

    while (!hit && distance < 20) {
      rayX += Math.cos(rayAngle) * 0.05;
      rayY += Math.sin(rayAngle) * 0.05;
      distance += 0.05;

      if (map[Math.floor(rayY)]?.[Math.floor(rayX)] === 1) hit = true;
    }

    if (hit) {
      const wallHeight = (1 / distance) * 400;
      ctx.fillStyle = `rgb(${100/distance*5}, ${255/distance*2}, ${150/distance*3})`;
      ctx.fillRect(x, (canvas.height/2) - wallHeight/2, 1, wallHeight);
    }
  }
}

gameLoop();
