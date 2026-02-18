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
  const isEating = player.eatAnim > 0 && player.alive;
  const chew = isEating ? Math.sin(performance.now() * 0.03 + player.id * 1.8) : 0;
  const legSwing = player.onGround ? Math.sin(player.runPhase * 8) * 5 : 0;
  const headYOffset = isEating ? Math.abs(chew) * 1.7 : 0;

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

  const jumpLean = (player.onGround ? 0 : clamp(player.vy / 700, -0.2, 0.3)) + (isEating ? chew * 0.03 : 0);

  ctx.save();
  ctx.rotate(jumpLean);

  ctx.beginPath();
  ctx.ellipse(0, 3, 17, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawEar(-7, -20, player.onGround ? -0.1 : -0.35, player.color, player.outline);
  drawEar(7, -20, player.onGround ? 0.1 : 0.35, player.color, player.outline);

  ctx.beginPath();
  ctx.arc(10, headYOffset, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(12, -2 + headYOffset, 1.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f6a6c2";
  ctx.beginPath();
  ctx.arc(15, 2 + headYOffset, 2.2, 0, Math.PI * 2);
  ctx.fill();

  if (isEating) {
    ctx.strokeStyle = "#8a4b33";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(12.5, 4.5 + headYOffset);
    ctx.lineTo(14.3, 5.1 + chew * 1.1 + headYOffset);
    ctx.stroke();

    ctx.fillStyle = "#ff9c50";
    ctx.beginPath();
    ctx.moveTo(17, 4.5 + headYOffset);
    ctx.lineTo(20.5, 2.3 + headYOffset);
    ctx.lineTo(20.2, 6.2 + headYOffset);
    ctx.closePath();
    ctx.fill();
  }

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
