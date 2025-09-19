const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Wall {
  constructor(x1, y1, x2, y2) {
    this.a = { x: x1, y: y1 };
    this.b = { x: x2, y: y2 };
  }

  draw() {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}

class Ray {
  constructor(x, y, angle) {
    this.pos = { x, y };
    this.dir = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  }

  cast(wall) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const pt = {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
      };
      return pt;
    }
  }

  draw(walls) {
    let closest = null;
    let record = Infinity;
    for (let wall of walls) {
      const pt = this.cast(wall);
      if (pt) {
        const d = Math.hypot(this.pos.x - pt.x, this.pos.y - pt.y);
        if (d < record) {
          record = d;
          closest = pt;
        }
      }
    }

    if (closest) {
      ctx.strokeStyle = 'rgba(255,255,0,0.3)';
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(closest.x, closest.y);
      ctx.stroke();
    }
  }
}

class Particle {
  constructor() {
    this.pos = { x: canvas.width / 2, y: canvas.height / 2 };
    this.rays = [];
    for (let a = 0; a < 360; a += 1) {
      this.rays.push(new Ray(this.pos.x, this.pos.y, a * Math.PI / 180));
    }
  }

  update(x, y) {
    this.pos.x = x;
    this.pos.y = y;
    for (let ray of this.rays) {
      ray.pos.x = x;
      ray.pos.y = y;
    }
  }

  draw(walls) {
    for (let ray of this.rays) {
      ray.draw(walls);
    }
  }
}

// Create walls
const walls = [];
walls.push(new Wall(100, 100, 300, 150));
walls.push(new Wall(300, 150, 500, 300));
walls.push(new Wall(500, 300, 600, 100));
walls.push(new Wall(600, 100, 100, 100));

// Add edges
walls.push(new Wall(0, 0, canvas.width, 0));
walls.push(new Wall(canvas.width, 0, canvas.width, canvas.height));
walls.push(new Wall(canvas.width, canvas.height, 0, canvas.height));
walls.push(new Wall(0, canvas.height, 0, 0));

const particle = new Particle();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let wall of walls) {
    wall.draw();
  }

  particle.draw(walls);
  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
  particle.update(e.clientX, e.clientY);
});

animate();
