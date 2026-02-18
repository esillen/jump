import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { state, ui } from "../state.js";

export function syncScoreboard() {
  ui.scoreboard.innerHTML = "";

  state.players.forEach((player) => {
    const block = document.createElement("div");
    block.className = "score";
    block.style.border = `2px solid ${player.outline}`;
    block.innerHTML = `${player.name}<small>Score: ${player.score} | Carrots ${player.carrots}/${GAMEPLAY_CONSTANTS.CARROTS_PER_POINT}</small>`;
    ui.scoreboard.appendChild(block);
  });

  const seconds = Math.ceil(state.matchTime);
  const minutesPart = String(Math.floor(seconds / 60));
  const secondsPart = String(seconds % 60).padStart(2, "0");
  ui.timer.textContent = `${minutesPart}:${secondsPart}`;
}
