import { ctx, state } from "../state.js";
import { clamp } from "../utils.js";

function drawEar(x, y, tilt, fill, stroke) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f8c8d8";
  ctx.beginPath();
  ctx.ellipse(0, 0, 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFoot(x, y) {
  ctx.beginPath();
  ctx.ellipse(x, y, 6, 4, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawRabbit(player) {
  const legSwing = player.onGround ? Math.sin(player.runPhase * 8) * 5 : 0;

  ctx.save();
  ctx.translate(player.x, player.y);

  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(0, player.h * 0.45, 18, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(player.face, 1);

  ctx.fillStyle = player.color;
  ctx.strokeStyle = player.outline;
  ctx.lineWidth = 2;

  const jumpLean = player.onGround ? 0 : clamp(player.vy / 700, -0.2, 0.3);

  ctx.save();
  ctx.rotate(jumpLean);

  ctx.beginPath();
  ctx.ellipse(0, 3, 17, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawEar(-7, -20, player.onGround ? -0.1 : -0.35, player.color, player.outline);
  drawEar(7, -20, player.onGround ? 0.1 : 0.35, player.color, player.outline);

  ctx.beginPath();
  ctx.arc(10, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(12, -2, 1.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f6a6c2";
  ctx.beginPath();
  ctx.arc(15, 2, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = player.color;
  ctx.strokeStyle = player.outline;
  drawFoot(-8, 14 + legSwing);
  drawFoot(7, 14 - legSwing);

  ctx.restore();
  ctx.restore();
}

export function drawPlayers() {
  state.players.forEach((player) => {
    if (!player.alive) return;
    drawRabbit(player);
  });
}
