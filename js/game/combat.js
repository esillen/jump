import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { state } from "../state.js";
import { spawnGore } from "./effects.js";

function killPlayer(victim, killer) {
  if (!victim.alive) return;

  victim.alive = false;
  victim.respawnTimer = GAMEPLAY_CONSTANTS.RESPAWN_SECONDS;
  victim.vx = 0;
  victim.vy = 0;

  killer.kills += 1;
  killer.score += 1;
  spawnGore(victim.x, victim.y, victim.color);
}

export function resolveStomps() {
  for (let i = 0; i < state.players.length; i += 1) {
    for (let j = 0; j < state.players.length; j += 1) {
      if (i === j) continue;

      const a = state.players[i];
      const b = state.players[j];
      if (!a.alive || !b.alive) continue;

      const horizontal = Math.abs(a.x - b.x) < (a.w + b.w) * 0.33;
      const aBottom = a.y + a.h / 2;
      const bTop = b.y - b.h / 2;
      const vertical = aBottom >= bTop - 2 && aBottom <= bTop + 18;

      if (horizontal && vertical && a.vy > GAMEPLAY_CONSTANTS.STOMP_MIN_DOWNWARD_VELOCITY && a.y < b.y) {
        killPlayer(b, a);
        a.vy = GAMEPLAY_CONSTANTS.STOMP_BOUNCE_VELOCITY;
      }
    }
  }
}
