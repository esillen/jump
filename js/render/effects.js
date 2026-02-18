import { ctx, state } from "../state.js";
import { clamp } from "../utils.js";

export function drawBloodMarks() {
  state.bloodMarks.forEach((mark) => {
    const alpha = clamp(mark.life / 3.2, 0, 0.75);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#8c0f1a";

    if (mark.kind === "pool") {
      ctx.beginPath();
      ctx.ellipse(mark.x, mark.y, mark.rx, mark.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.fillRect(mark.x - (mark.width * 0.5 + (mark.side < 0 ? mark.width * 0.2 : 0)), mark.y, mark.width, mark.down);
    ctx.beginPath();
    ctx.arc(mark.x, mark.y + mark.down, mark.width * 0.8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

export function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.globalAlpha = clamp(particle.life, 0, 1);
    if (particle.kind === "flower") {
      ctx.fillStyle = particle.color || "#ff8cb8";
      for (let i = 0; i < 5; i += 1) {
        const a = (Math.PI * 2 * i) / 5;
        ctx.beginPath();
        ctx.arc(
          particle.x + Math.cos(a) * particle.size * 0.9,
          particle.y + Math.sin(a) * particle.size * 0.9,
          particle.size * 0.65,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.fillStyle = "#ffe98a";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#bf1828";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
}

export function drawCarrotCrumbs() {
  state.carrotCrumbs.forEach((crumb) => {
    ctx.globalAlpha = clamp(crumb.life * 3, 0, 1);
    ctx.fillStyle = crumb.color;
    ctx.beginPath();
    ctx.arc(crumb.x, crumb.y, crumb.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

export function drawChunks() {
  state.chunks.forEach((chunk) => {
    ctx.save();
    ctx.translate(chunk.x, chunk.y);
    ctx.rotate(chunk.rot);
    if (chunk.kind === "flower") {
      const petal = chunk.s * 0.34;
      ctx.fillStyle = chunk.color || "#ff8cb8";
      for (let i = 0; i < 5; i += 1) {
        const a = (Math.PI * 2 * i) / 5;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * petal, Math.sin(a) * petal, petal * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ffe98a";
      ctx.beginPath();
      ctx.arc(0, 0, petal * 0.55, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = chunk.color || "#a20e1a";
      ctx.fillRect(-chunk.s * 0.5, -chunk.s * 0.5, chunk.s, chunk.s * 0.75);
    }
    ctx.restore();
  });
}
