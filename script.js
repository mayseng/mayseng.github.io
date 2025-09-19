const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// --- New maze: simpler layout, clearer path and a glowing exit
// 1 = wall, 0 = empty, 2 = exit
const map = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,2,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,1,1,0,0,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,0,0,1,1,0,1],
  [1,0,1,1,1,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,1],
  [1,1,1,1,1,1,1,1,1,1]
];

const TILE = 64; // wall size
let posX = 1.5, posY = 1.5; // player start position (just inside maze)
let dir = 0; // facing angle

// Controls
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

  // Collision detection with walls
  if (map[Math.floor(posY)][Math.floor(posX + moveX)] === 0 || map[Math.floor(posY)][Math.floor(posX + moveX)] === 2) {
    posX += moveX;
  }
  if (map[Math.floor(posY + moveY)] && (map[Math.floor(posY + moveY)][Math.floor(posX)] === 0 || map[Math.floor(posY + moveY)][Math.floor(posX)] === 2)) {
    posY += moveY;
  }
}

function render() {
  ctx.fillStyle = "#001d3d"; // dark blue background for atmosphere
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
      // Distance fix (to avoid fish-eye)
      const correctedDistance = distance * Math.cos(rayAngle - dir);

      // Wall height on screen
      const wallHeight = (1 / correctedDistance) * 600;

      if (hitExit) {
        // Glowing exit colors - bright and shifting
        const glow = 128 + 127 * Math.sin(Date.now() * 0.005 + x * 0.05);
        ctx.fillStyle = `rgb(${glow}, ${glow}, 0)`; // glowing yellow
        ctx.fillRect(x, (canvas.height / 2) - wallHeight / 2, 1, wallHeight);
      } else {
        // Wall shading: deep blue with green highlights fading with distance
        let shade = 255 / (correctedDistance * 1.5);
        shade = Math.min(255, Math.max(40, shade));
        ctx.fillStyle = `rgb(0, ${shade}, ${shade / 2})`;
        ctx.fillRect(x, (canvas.height / 2) - wallHeight / 2, 1, wallHeight);

        // Draw a faint highlight line on wall edges for depth
        if (x % 50 < 2) {
          ctx.fillStyle = `rgba(255,255,255,0.05)`;
          ctx.fillRect(x, (canvas.height / 2) - wallHeight / 2, 1, wallHeight);
        }
      }
    }
  }

  // Mini map in bottom left corner for easier navigation
  drawMiniMap();
}

function drawMiniMap() {
  const mapScale = 10;
  const offsetX = 10;
  const offsetY = canvas.height - map.length * mapScale - 10;

  // Background
  ctx.fillStyle = "#000a16cc";
  ctx.fillRect(offsetX - 2, offsetY - 2, map[0].length * mapScale + 4, map.length * mapScale + 4);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = "#007f7f"; // wall color on minimap
      } else if (map[y][x] === 2) {
        ctx.fillStyle = "#ffff33"; // exit color on minimap
      } else {
        ctx.fillStyle = "#002b2b"; // empty space
      }
      ctx.fillRect(offsetX + x * mapScale, offsetY + y * mapScale, mapScale, mapScale);
    }
  }

  // Player position on minimap
  ctx.fillStyle = "#00ffcc";
  ctx.beginPath();
  ctx.arc(offsetX + posX * mapScale, offsetY + posY * mapScale, 4, 0, Math.PI * 2);
  ctx.fill();

  // Player facing direction on minimap
  ctx.strokeStyle = "#00ffcc";
  ctx.beginPath();
  ctx.moveTo(offsetX + posX * mapScale, offsetY + posY * mapScale);
  ctx.lineTo(offsetX + (posX + Math.cos(dir) * 1.5) * mapScale, offsetY + (posY + Math.sin(dir) * 1.5) * mapScale);
  ctx.stroke();
}

gameLoop();
