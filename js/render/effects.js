import { ctx, state } from "../state.js";
import { clamp } from "../utils.js";

export function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.globalAlpha = clamp(particle.life, 0, 1);
    ctx.fillStyle = "#bf1828";
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

export function drawChunks() {
  state.chunks.forEach((chunk) => {
    ctx.save();
    ctx.translate(chunk.x, chunk.y);
    ctx.rotate(chunk.rot);
    ctx.fillStyle = "#a20e1a";
    ctx.fillRect(-chunk.s * 0.5, -chunk.s * 0.5, chunk.s, chunk.s * 0.75);
    ctx.restore();
  });
}
