import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { ctx, state } from "../state.js";

function drawPlatform(platform) {
  ctx.fillStyle = "#9ddf84";
  ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
  ctx.fillStyle = "#80c96a";
  ctx.fillRect(platform.x, platform.y + 6, platform.w, platform.h - 6);

  for (let i = platform.x + 8; i < platform.x + platform.w - 4; i += 10) {
    ctx.fillStyle = "#69b85a";
    ctx.fillRect(i, platform.y + platform.h - 2, 4, 5 + Math.sin(i * 0.2) * 2);
  }
}

function drawFlowers() {
  state.decorations.forEach((flower) => {
    ctx.strokeStyle = "#5fb84a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(flower.x, flower.y + 3);
    ctx.lineTo(flower.x, flower.y - 9 * flower.s);
    ctx.stroke();

    ctx.fillStyle = flower.c;
    for (let i = 0; i < 5; i += 1) {
      const angle = (Math.PI * 2 * i) / 5;
      ctx.beginPath();
      ctx.arc(
        flower.x + Math.cos(angle) * 4 * flower.s,
        flower.y - 10 * flower.s + Math.sin(angle) * 4 * flower.s,
        3 * flower.s,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.fillStyle = "#ffe98a";
    ctx.beginPath();
    ctx.arc(flower.x, flower.y - 10 * flower.s, 2.3 * flower.s, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawArena() {
  ctx.fillStyle = "#72c95d";
  ctx.fillRect(
    0,
    state.arena.groundY,
    GAMEPLAY_CONSTANTS.WORLD_WIDTH,
    GAMEPLAY_CONSTANTS.WORLD_HEIGHT - state.arena.groundY
  );

  ctx.fillStyle = "#5ab248";
  for (let i = 0; i < GAMEPLAY_CONSTANTS.WORLD_WIDTH; i += 12) {
    ctx.fillRect(i, state.arena.groundY, 4, 8 + Math.sin(i * 0.03) * 3);
  }

  state.arena.platforms.forEach(drawPlatform);
  drawFlowers();
}

export function drawArenaLabel() {
  if (state.screen !== "game") return;
  ctx.fillStyle = "rgba(30,60,45,0.6)";
  ctx.font = "18px Trebuchet MS";
  ctx.fillText(state.arena.name, 16, 28);
}
