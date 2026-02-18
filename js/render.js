import { GAMEPLAY_CONSTANTS } from "./GAMEPLAY_CONSTANTS.js";
import { canvas, ctx } from "./state.js";
import { drawArena, drawArenaLabel } from "./render/arena.js";
import { drawBackground } from "./render/background.js";
import { drawPlayers } from "./render/characters.js";
import { drawChunks, drawParticles } from "./render/effects.js";
import { drawCarrots } from "./render/items.js";

export function drawFrame() {
  const screenWidth = canvas.clientWidth;
  const screenHeight = canvas.clientHeight;
  if (canvas.width !== screenWidth || canvas.height !== screenHeight) {
    canvas.width = screenWidth;
    canvas.height = screenHeight;
  }

  const scale = Math.min(
    canvas.width / GAMEPLAY_CONSTANTS.WORLD_WIDTH,
    canvas.height / GAMEPLAY_CONSTANTS.WORLD_HEIGHT
  );
  const offsetX = (canvas.width - GAMEPLAY_CONSTANTS.WORLD_WIDTH * scale) / 2;
  const offsetY = (canvas.height - GAMEPLAY_CONSTANTS.WORLD_HEIGHT * scale) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  drawBackground();
  drawArena();
  drawChunks();
  drawCarrots();
  drawPlayers();
  drawParticles();
  drawArenaLabel();

  ctx.restore();
}
