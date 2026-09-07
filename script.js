const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const canvas = document.querySelector("#ambient-canvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let points = [];

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(22, Math.floor((width * height) / 42000));
  points = Array.from({ length: count }, (_, index) => ({
    x: (index * 97) % width,
    y: (index * 53) % height,
    vx: 0.12 + ((index % 5) * 0.025),
    vy: 0.08 + ((index % 7) * 0.018),
    r: 2 + (index % 4)
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  for (const point of points) {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x > width + 20) point.x = -20;
    if (point.y > height + 20) point.y = -20;

    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(19, 92, 69, 0.45)";
    ctx.fill();
  }

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(53, 111, 159, ${0.18 * (1 - distance / 150)})`;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();
