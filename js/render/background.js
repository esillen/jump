import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { ctx } from "../state.js";

function puffCloud(x, y, scale) {
  ctx.beginPath();
  ctx.arc(x, y, 24 * scale, 0, Math.PI * 2);
  ctx.arc(x + 28 * scale, y - 4 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x - 26 * scale, y + 2 * scale, 19 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function hill(x, y, width, height) {
  ctx.beginPath();
  ctx.ellipse(x, y, width, height, 0, Math.PI, Math.PI * 2);
  ctx.fill();
}

export function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, GAMEPLAY_CONSTANTS.WORLD_HEIGHT);
  gradient.addColorStop(0, "#c2f0ff");
  gradient.addColorStop(0.6, "#e7fbff");
  gradient.addColorStop(1, "#dff8df");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAMEPLAY_CONSTANTS.WORLD_WIDTH, GAMEPLAY_CONSTANTS.WORLD_HEIGHT);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  for (let i = 0; i < 8; i += 1) {
    const x = 140 * i + 70;
    const y = 100 + Math.sin(i * 1.2) * 18;
    puffCloud(x, y, 1 + (i % 3) * 0.14);
  }

  ctx.fillStyle = "#bdeeb1";
  hill(180, 710, 300, 90);
  hill(580, 710, 360, 120);
  hill(1030, 710, 320, 100);
}
