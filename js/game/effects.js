import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { state } from "../state.js";
import { rnd } from "../utils.js";

function spawnBloodPool(x, y, sizeScale = 1) {
  state.bloodMarks.push({
    kind: "pool",
    x,
    y,
    rx: rnd(2.5, 7.5) * sizeScale,
    ry: rnd(1.8, 4.8) * sizeScale,
    life: rnd(4.5, 8.5)
  });
}

function spawnBloodDrip(x, y, side) {
  state.bloodMarks.push({
    kind: "drip",
    x: x + side * 0.8,
    y,
    side,
    width: rnd(1.2, 2.6),
    down: 0,
    maxDown: rnd(10, 24),
    life: rnd(2.6, 5.2)
  });
}

export function spawnGore(x, y, rabbitColor = "#a20e1a") {
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
      color: rabbitColor,
      ttl: rnd(5, 9),
      grounded: false
    });
  }
}

export function spawnCarrotCrumb(player) {
  const face = player.face || 1;
  const mouthX = player.x + face * 15;
  const mouthY = player.y + 2;
  state.carrotCrumbs.push({
    x: mouthX,
    y: mouthY,
    vx: face * rnd(90, 220),
    vy: rnd(-140, -40),
    life: rnd(0.2, 0.45),
    size: rnd(1.6, 3.3),
    color: Math.random() < 0.6 ? "#ff9c50" : "#ffd78c"
  });
}

export function updateParticles(dt) {
  const alive = [];
  state.particles.forEach((particle) => {
    const prevX = particle.x;
    const prevY = particle.y;

    particle.life -= dt;
    if (particle.life <= 0) return;

    particle.vy += GAMEPLAY_CONSTANTS.GRAVITY * 0.75 * dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;

    if (particle.y >= state.arena.groundY) {
      spawnBloodPool(particle.x, state.arena.groundY + 1, particle.size / 4);
      return;
    }

    for (const platform of state.arena.platforms) {
      const withinX = particle.x >= platform.x && particle.x <= platform.x + platform.w;
      const withinY = particle.y >= platform.y && particle.y <= platform.y + platform.h;

      const topHit = prevY <= platform.y && particle.y >= platform.y && withinX;
      if (topHit) {
        spawnBloodPool(particle.x, platform.y + 1, particle.size / 4);
        const distLeft = Math.abs(particle.x - platform.x);
        const distRight = Math.abs(platform.x + platform.w - particle.x);
        if (Math.min(distLeft, distRight) < 8 && Math.random() < 0.7) {
          const side = distLeft < distRight ? -1 : 1;
          spawnBloodDrip(side < 0 ? platform.x : platform.x + platform.w, platform.y + 1, side);
        }
        return;
      }

      const leftHit =
        prevX < platform.x && particle.x >= platform.x && withinY && prevY >= platform.y && prevY <= platform.y + platform.h;
      if (leftHit) {
        spawnBloodDrip(platform.x, particle.y, -1);
        return;
      }

      const rightHit =
        prevX > platform.x + platform.w &&
        particle.x <= platform.x + platform.w &&
        withinY &&
        prevY >= platform.y &&
        prevY <= platform.y + platform.h;
      if (rightHit) {
        spawnBloodDrip(platform.x + platform.w, particle.y, 1);
        return;
      }
    }

    alive.push(particle);
  });
  state.particles = alive;
}

export function updateBloodMarks(dt) {
  state.bloodMarks = state.bloodMarks.filter((mark) => {
    mark.life -= dt;
    if (mark.life <= 0) return false;
    if (mark.kind === "drip") {
      mark.down = Math.min(mark.maxDown, mark.down + dt * 34);
    }
    return true;
  });
}

export function updateCarrotCrumbs(dt) {
  state.carrotCrumbs = state.carrotCrumbs.filter((crumb) => {
    crumb.life -= dt;
    crumb.vy += GAMEPLAY_CONSTANTS.GRAVITY * 0.55 * dt;
    crumb.x += crumb.vx * dt;
    crumb.y += crumb.vy * dt;
    return crumb.life > 0;
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
