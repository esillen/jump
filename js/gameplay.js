import { GAMEPLAY_CONSTANTS } from "./GAMEPLAY_CONSTANTS.js";
import { getBotInput } from "./game/ai.js";
import { updateCarrots, nearestCarrot } from "./game/carrots.js";
import { resolveStomps } from "./game/combat.js";
import { updateBloodMarks, updateCarrotCrumbs, updateChunks, updateParticles } from "./game/effects.js";
import { backToTitle as toTitle, beginMatch as startMatch, endMatch } from "./game/lifecycle.js";
import { updatePlayers } from "./game/players.js";
import { syncScoreboard } from "./game/scoreboard.js";
import { getHumanInput } from "./input.js";
import { state } from "./state.js";

function resolvePlayerInput(player, dt) {
  if (player.type.endsWith("bot")) return getBotInput(player, nearestCarrot, dt);
  return getHumanInput(player);
}

export function beginMatch() {
  if (!startMatch()) return;
  syncScoreboard();
}

export function backToTitle() {
  toTitle();
}

export function updateGame(dt) {
  state.matchTime = Math.max(0, state.matchTime - dt);
  if (state.matchTime <= 0) {
    endMatch();
    return;
  }

  updatePlayers(dt, resolvePlayerInput);
  resolveStomps();
  updateCarrots(dt);
  updateCarrotCrumbs(dt);
  updateParticles(dt);
  updateBloodMarks(dt);
  updateChunks(dt);
  syncScoreboard();

  if (state.players.some((player) => player.score >= GAMEPLAY_CONSTANTS.TARGET_SCORE)) {
    endMatch();
  }
}
