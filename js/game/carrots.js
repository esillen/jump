import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { state } from "../state.js";
import { pick, rnd } from "../utils.js";

function spawnCarrot() {
  if (state.carrots.length >= GAMEPLAY_CONSTANTS.MAX_CARROTS) return;

  const freeSpots = state.arena.carrotSpots.filter((spot) => {
    return !state.carrots.some((carrot) => Math.hypot(carrot.x - spot.x, carrot.y - spot.y) < 24);
  });
  if (!freeSpots.length) return;

  const spawn = pick(freeSpots);
  state.carrots.push({
    x: spawn.x,
    y: spawn.y,
    spawnAnim: 0,
    collector: null,
    collectTime: 0
  });
}

export function nearestCarrot(player) {
  if (!state.carrots.length) return null;

  let best = state.carrots[0];
  let bestDistance = Infinity;
  state.carrots.forEach((carrot) => {
    const distance = Math.hypot(carrot.x - player.x, carrot.y - player.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = carrot;
    }
  });
  return best;
}

export function updateCarrots(dt) {
  state.carrotTimer -= dt;
  if (state.carrotTimer <= 0) {
    spawnCarrot();
    state.carrotTimer = rnd(
      GAMEPLAY_CONSTANTS.CARROT_RESPAWN_MIN_SECONDS,
      GAMEPLAY_CONSTANTS.CARROT_RESPAWN_MAX_SECONDS
    );
  }

  state.carrots.forEach((carrot) => {
    carrot.spawnAnim = Math.min(1, carrot.spawnAnim + dt * 2.4);

    let collector = null;
    for (const player of state.players) {
      if (!player.alive) continue;
      const distance = Math.hypot(player.x - carrot.x, player.y - carrot.y);
      if (distance < 32 && player.onGround && Math.abs(player.vx) < 20) {
        collector = player;
        break;
      }
    }

    if (!collector) {
      carrot.collector = null;
      carrot.collectTime = 0;
      return;
    }

    if (carrot.collector !== collector.id) {
      carrot.collector = collector.id;
      carrot.collectTime = 0;
    } else {
      carrot.collectTime += dt;
    }
  });

  const collected = state.carrots.filter(
    (carrot) => carrot.collectTime >= GAMEPLAY_CONSTANTS.CARROT_COLLECT_SECONDS
  );
  if (!collected.length) return;

  collected.forEach((carrot) => {
    const player = state.players.find((entry) => entry.id === carrot.collector);
    if (!player) return;

    player.carrots += 1;
    if (player.carrots >= GAMEPLAY_CONSTANTS.CARROTS_PER_POINT) {
      player.carrots -= GAMEPLAY_CONSTANTS.CARROTS_PER_POINT;
      player.score += 1;
    }
  });

  state.carrots = state.carrots.filter(
    (carrot) => carrot.collectTime < GAMEPLAY_CONSTANTS.CARROT_COLLECT_SECONDS
  );
}
