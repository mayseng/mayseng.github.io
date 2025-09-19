const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Bigger maze: 15x15, with path and walls
// 0 = empty, 1 = wall, 2 = exit
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,2,1],
  [1,0,1,1,1,0,1,0,1,1,1,1,0,0,1],
  [1,0,1,0,1,0,0,0,1,0,0,1,0,1,1],
  [1,0,1,0,1,1,1,1,1,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,1,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,1,0,1,1],
  [1,0,1,1,1,0,1,1,1,1,0,1,0,0,1],
  [1,0,0,0,1,0,0,0,0,1,0,1,1,0,1],
  [1,1,1,0,1,1,1,1,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,0,0,0,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const TILE = 64; // tile size
let posX = 1.5, posY = 1.5; // start pos near top-left corner
let dir = 0; // facing angle

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  const speed = 0.06;
  const rotSpeed = 0.04;

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

  if (map[Math.floor(posY)][Math.floor(posX + moveX)] === 0 || map[Math.floor(posY)][Math.floor(posX + moveX)] === 2) {
    posX += moveX;
  }
  if (map[Math.floor(posY + moveY)] && (map[Math.floor(posY + moveY)][Math.floor(posX)] === 0 || map[Math.floor(posY + moveY)][Math.floor(posX)] === 2)) {
    posY += moveY;
  }
}

function render() {
  ctx.fillStyle = "#001d3d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const numRays = canvas.width;
  const fov = Math.PI / 3;

  for (let x = 0; x < numRays; x++) {
    const rayAngle = dir - fov / 2 + fov * (x / numRays);
    let distance = 0;
    let hit = false;
    let hitExit = false;

    let rayX = posX;
    let rayY = posY;

    while (!hit && distance < 20) {
      rayX += Math.cos(rayAngle) * 0.02;
      rayY += Math.sin(rayAngle) * 0.02;
      distance += 0.02;

      let mapX = Math.floor(rayX);
      let mapY = Math.floor(rayY);

      if (map[mapY]?.[mapX] === 1) hit = true;
      if (map[mapY]?.[mapX] === 2) {
        hit = true;
        hitExit = true;
      }
    }

    if (hit) {
      const correctedDistance = distance * Math.cos(rayAngle - dir);
      const wallHeight = (1 / correctedDistance) * 600;

      if (hitExit) {
        // Leave space for the chest to be drawn later (transparent wall)
        ctx.fillStyle = `rgba(255, 255, 0, 0.3)`;
        ctx.fillRect(x, (canvas.height / 2) - wallHeight / 2, 1, wallHeight);
      } else {
        let shade = 255 / (correctedDistance * 1.5);
        shade = Math.min(255, Math.max(40, shade));
        ctx.fillStyle = `rgb(0, ${shade}, ${shade / 2})`;
        ctx.fillRect(x, (canvas.height / 2) - wallHeight / 2, 1, wallHeight);
      }
    }
  }

  drawChest();
  drawMiniMap();
}

function drawChest() {
  // Draw a simple glowing treasure chest at the exit (far right)
  // We'll position it in the center of the view when player is close

  // Calculate vector from player to exit tile
  const exitX = 13.5;
  const exitY = 1.5;
  const dx = exitX - posX;
  const dy = exitY - posY;
  const distToExit = Math.sqrt(dx*dx + dy*dy);

  if (distToExit < 5) {
    // Project the chest in front of the player (distance-based size)
    // We'll just draw a glowing square in the middle of the screen with pulsing effect

    const maxChestSize = 150;
    const size = Math.min(maxChestSize, 400 / distToExit);

    // Pulsing glow
    const glow = 128 + 127 * Math.sin(Date.now() * 0.005);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Chest base
    ctx.fillStyle = `rgb(${glow}, ${glow/2}, 0)`;
    ctx.shadowColor = `rgba(${glow}, ${glow/2}, 0, 0.8)`;
    ctx.shadowBlur = 30;
    ctx.fillRect(cx - size/2, cy - size/3, size, size * 0.6);

    // Chest lid (a trapezoid)
    ctx.beginPath();
    ctx.moveTo(cx - size/2, cy - size/3);
    ctx.lineTo(cx + size/2, cy - size/3);
    ctx.lineTo(cx + size/3, cy - size/2);
    ctx.lineTo(cx - size/3, cy - size/2);
    ctx.closePath();
    ctx.fill();

    // Chest details: lock (small rectangle)
    ctx.fillStyle = `rgb(255, 215, 0)`;
    ctx.shadowBlur = 0;
    ctx.fillRect(cx - size/12, cy - size/6, size/6, size/10);
  }
}

function drawMiniMap() {
  const mapScale = 8;
  const offsetX = 10;
  const offsetY = canvas.height - map.length * mapScale - 10;

  ctx.fillStyle = "#000a16cc";
  ctx.fillRect(offsetX - 2, offsetY - 2, map[0].length * mapScale + 4, map.length * mapScale + 4);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = "#007f7f"; // wall
      } else if (map[y][x] === 2) {
        ctx.fillStyle = "#ffff33"; // exit
      } else {
        ctx.fillStyle = "#002b2b"; // empty
      }
      ctx.fillRect(offsetX + x * mapScale, offsetY + y * mapScale, mapScale, mapScale);
    }
  }

  // Player on mini map
  ctx.fillStyle = "#00ffcc";
  ctx.beginPath();
  ctx.arc(offsetX + posX * mapScale, offsetY + posY * mapScale, 4, 0, Math.PI * 2);
  ctx.fill();

  // Player facing direction on mini map
  ctx.strokeStyle = "#00ffcc";
  ctx.beginPath();
  ctx.moveTo(offsetX + posX * mapScale, offsetY + posY * mapScale);
  ctx.lineTo(offsetX + (posX + Math.cos(dir) * 1.5) * mapScale, offsetY + (posY + Math.sin(dir) * 1.5) * mapScale);
  ctx.stroke();
}

gameLoop();
