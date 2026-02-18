import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { state } from "../state.js";
import { rnd } from "../utils.js";

export function spawnGore(x, y) {
  for (let i = 0; i < GAMEPLAY_CONSTANTS.GORE_PARTICLE_COUNT; i += 1) {
    state.particles.push({
      x: x + rnd(-12, 12),
      y: y + rnd(-8, 8),
      vx: rnd(-250, 250),
      vy: rnd(-420, -40),
      life: rnd(0.4, 1.1),
      size: rnd(2, 5)
    });
  }

  for (let i = 0; i < GAMEPLAY_CONSTANTS.GORE_CHUNK_COUNT; i += 1) {
    state.chunks.push({
      x: x + rnd(-8, 8),
      y: y + rnd(-10, 10),
      vx: rnd(-160, 160),
      vy: rnd(-310, -80),
      rot: rnd(0, Math.PI * 2),
      vr: rnd(-7, 7),
      s: rnd(6, 11),
      ttl: rnd(5, 9),
      grounded: false
    });
  }
}

export function updateParticles(dt) {
  state.particles = state.particles.filter((particle) => {
    particle.life -= dt;
    particle.vy += GAMEPLAY_CONSTANTS.GRAVITY * 0.75 * dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    return particle.life > 0;
  });
}

export function updateChunks(dt) {
  state.chunks = state.chunks.filter((chunk) => {
    chunk.ttl -= dt;
    if (chunk.ttl <= 0) return false;

    if (!chunk.grounded) {
      chunk.vy += GAMEPLAY_CONSTANTS.GRAVITY * dt;
      chunk.x += chunk.vx * dt;
      chunk.y += chunk.vy * dt;
      chunk.rot += chunk.vr * dt;
      if (chunk.y + chunk.s >= state.arena.groundY) {
        chunk.y = state.arena.groundY - chunk.s;
        chunk.vx *= 0.3;
        chunk.vy = 0;
        chunk.vr *= 0.2;
        chunk.grounded = true;
      }
    }

    return true;
  });
}
