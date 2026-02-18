import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { ctx, state } from "../state.js";
import { clamp } from "../utils.js";

export function drawCarrots() {
  state.carrots.forEach((carrot) => {
    ctx.save();
    ctx.translate(carrot.x, carrot.y);

    const yOffset = (1 - carrot.spawnAnim) * 30;
    const alpha = clamp(carrot.spawnAnim, 0, 1);
    const pulse = 1 + Math.sin(performance.now() * 0.012 + carrot.x * 0.1) * 0.06;
    ctx.globalAlpha = alpha;
    ctx.scale(carrot.spawnAnim * pulse, carrot.spawnAnim * pulse);
    ctx.translate(0, -yOffset);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff9c50";
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(9, -14);
    ctx.lineTo(-9, -14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#66c355";
    ctx.beginPath();
    ctx.arc(-4, -14, 5, Math.PI, 2 * Math.PI);
    ctx.arc(4, -14, 5, Math.PI, 2 * Math.PI);
    ctx.fill();

    if (carrot.collector !== null) {
      const progress = carrot.collectTime / GAMEPLAY_CONSTANTS.CARROT_COLLECT_SECONDS;
      const barWidth = 40;
      const barHeight = 7;
      const barX = -barWidth / 2;
      const barY = -34;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = "#8adf6c";
      ctx.fillRect(barX + 1, barY + 1, (barWidth - 2) * clamp(progress, 0, 1), barHeight - 2);
    }

    ctx.restore();
  });
}
