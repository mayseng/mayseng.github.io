const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const TILE = 64;
const FOV = Math.PI / 3;
const NUM_RAYS = canvas.width;

let posX = 1.5, posY = 1.5;
let dir = 0;
let pitch = 0;

const SPEED = 0.07;
const ROT_SPEED = 0.04;

// Maze 20x20 (1=wall, 0=empty, 2=exit)
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,0,1],
  [1,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,1,0,1],
  [1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,1,0,1],
  [1,0,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
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
  // Rotation
  if (keys["arrowleft"] || keys["a"]) dir -= ROT_SPEED;
  if (keys["arrowright"] || keys["d"]) dir += ROT_SPEED;

  // Movement
  let moveX = 0, moveY = 0;
  if (keys["arrowup"] || keys["w"]) {
    moveX += Math.cos(dir) * SPEED;
    moveY += Math.sin(dir) * SPEED;
  }
  if (keys["arrowdown"] || keys["s"]) {
    moveX -= Math.cos(dir) * SPEED;
    moveY -= Math.sin(dir) * SPEED;
  }

  // Collision detection with wall
  if (map[Math.floor(posY)][Math.floor(posX + moveX)] === 0 || map[Math.floor(posY)][Math.floor(posX + moveX)] === 2) {
    posX += moveX;
  }
  if (map[Math.floor(posY + moveY)] && (map[Math.floor(posY + moveY)][Math.floor(posX)] === 0 || map[Math.floor(posY + moveY)][Math.floor(posX)] === 2)) {
    posY += moveY;
  }
}

function render() {
  // Clear screen: sky and floor for immersive effect
  drawSkyAndFloor();

  // Raycasting walls
  for (let x = 0; x < NUM_RAYS; x++) {
    castRay(x);
  }

  drawChestIfClose();

  drawMiniMap();

  checkVictory();
}

function drawSkyAndFloor() {
  // Sky (ceiling)
  const gradientSky = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
  gradientSky.addColorStop(0, "#87ceeb");
  gradientSky.addColorStop(1, "#003366");
  ctx.fillStyle = gradientSky;
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  // Floor
  const gradientFloor = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
  gradientFloor.addColorStop(0, "#555");
  gradientFloor.addColorStop(1, "#222");
  ctx.fillStyle = gradientFloor;
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
}

function castRay(x) {
  const rayAngle = dir - FOV / 2 + FOV * (x / NUM_RAYS);

  let distance = 0;
  let hit = false;
  let side = 0; // 0 vertical wall, 1 horizontal wall
  let wallType = 0;
  let wallX;

  // DDA algorithm variables
  let mapX = Math.floor(posX);
  let mapY = Math.floor(posY);

  const deltaDistX = Math.abs(1 / Math.cos(rayAngle));
  const deltaDistY = Math.abs(1 / Math.sin(rayAngle));

  let stepX, stepY;
  let sideDistX, sideDistY;

  if (Math.cos(rayAngle) < 0) {
    stepX = -1;
    sideDistX = (posX - mapX) * deltaDistX;
  } else {
    stepX = 1;
    sideDistX = (mapX + 1.0 - posX) * deltaDistX;
  }

  if (Math.sin(rayAngle) < 0) {
    stepY = -1;
    sideDistY = (posY - mapY) * deltaDistY;
  } else {
    stepY = 1;
    sideDistY = (mapY + 1.0 - posY) * deltaDistY;
  }

  // DDA loop to find wall
  while (!hit) {
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      mapX += stepX;
      side = 0;
    } else {
      sideDistY += deltaDistY;
      mapY += stepY;
      side = 1;
    }

    if (map[mapY] && map[mapY][mapX] > 0) {
      hit = true;
      wallType = map[mapY][mapX];
    }

    // Stop if distance too far
    if (Math.sqrt((mapX - posX) ** 2 + (mapY - posY) ** 2) > 20) break;
  }

  // Calculate distance to wall
  if (side === 0) {
    distance = (mapX - posX + (1 - stepX) / 2) / Math.cos(rayAngle);
  } else {
    distance = (mapY - posY + (1 - stepY) / 2) / Math.sin(rayAngle);
  }

  if (distance <= 0) distance = 0.01;

  // Correct fish-eye
  const correctedDistance = distance * Math.cos(rayAngle - dir);

  // Calculate wall height on screen
  const wallHeight = Math.min(canvas.height, (TILE / correctedDistance) * 350);

  // Determine color based on wall type and side for shading
  let color;
  if (wallType === 1) {
    color = side === 1 ? "#4b8b8b" : "#66b2b2"; // Different shade on sides
  } else if (wallType === 2) {
    color = "#ffdf00"; // exit color
  }

  // Darken color with distance for depth effect
  const shade = Math.max(0.2, 1 - correctedDistance / 12);
  color = shadeColor(color, shade);

  // Draw wall slice
  ctx.fillStyle = color;
  ctx.fillRect(x, (canvas.height / 2) - wallHeight / 2, 1, wallHeight);
}

function shadeColor(color, percent) {
  // shade rgb hex color, percent 0-1, darker as percent -> 0
  let f=parseInt(color.slice(1),16),
      t=0,
      R=f>>16,
      G=f>>8&0x00FF,
      B=f&0x0000FF;
  return "#" + (0x1000000 + (Math.floor(R*percent)<<16) + (Math.floor(G*percent)<<8) + Math.floor(B*percent)).toString(16).slice(1);
}

function drawChestIfClose() {
  const exitX = 18.5;
  const exitY = 1.5;

  const dx = exitX - posX;
  const dy = exitY - posY;
  const dist = Math.sqrt(dx*dx + dy*dy);

  if (dist < 6) {
    // Pulse effect on chest glow
    const glow = 128 + 127 * Math.sin(Date.now() * 0.008);
    const size = 120 + 40 * Math.sin(Date.now() * 0.01);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 50;

    ctx.shadowColor = `rgba(${glow}, ${glow/2}, 0, 0.9)`;
    ctx.shadowBlur = 30;

    // Chest base
    ctx.fillStyle = `rgb(${glow}, ${glow/2}, 0)`;
    ctx.fillRect(cx - size/2, cy - size/3, size, size * 0.6);

    // Chest lid (trapezoid)
    ctx.beginPath();
    ctx.moveTo(cx - size/2, cy - size/3);
    ctx.lineTo(cx + size/2, cy - size/3);
    ctx.lineTo(cx + size/3, cy - size/2);
    ctx.lineTo(cx - size/3, cy - size/2);
    ctx.closePath();
    ctx.fill();

    // Lock (small gold rectangle)
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(cx - size/12, cy - size/6, size/6, size/10);

    // Sparkles around chest
    for(let i=0; i<5; i++){
      const sparkleX = cx + (Math.random()-0.5) * size;
      const sparkleY = cy - size/3 + (Math.random()-0.5) * size/2;
      const sparkleSize = Math.random() * 3 + 2;
      ctx.fillStyle = `rgba(255, 255, 100, ${Math.random()})`;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawMiniMap() {
  const scale = 8;
  const offsetX = 10;
  const offsetY = canvas.height - map.length * scale - 10;

  // Background for minimap
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(offsetX - 2, offsetY - 2, map[0].length * scale + 4, map.length * scale + 4);

  // Draw map tiles
  for(let y=0; y<map.length; y++) {
    for(let x=0; x<map[y].length; x++) {
      if(map[y][x] === 1) ctx.fillStyle = "#447777";
      else if(map[y][x] === 2) ctx.fillStyle = "#ffdf00";
      else ctx.fillStyle = "#002222";

      ctx.fillRect(offsetX + x*scale, offsetY + y*scale, scale, scale);
    }
  }

  // Draw player dot and direction
  ctx.fillStyle = "#00ffcc";
  ctx.beginPath();
  ctx.arc(offsetX + posX*scale, offsetY + posY*scale, 5, 0, Math.PI*2);
  ctx.fill();

  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(offsetX + posX*scale, offsetY + posY*scale);
  ctx.lineTo(offsetX + (posX + Math.cos(dir)*1.5)*scale, offsetY + (posY + Math.sin(dir)*1.5)*scale);
  ctx.stroke();
}

// Victory check & screen
let hasWon = false;
function checkVictory() {
  if (hasWon) return;

  if (map[Math.floor(posY)][Math.floor(posX)] === 2) {
    hasWon = true;
    // Show victory screen after 0.5s delay
    setTimeout(() => {
      alert("🎉 Congratulations! You found the treasure! 🎉");
      // You can also reset or do more here
    }, 500);
  }
}

gameLoop();
