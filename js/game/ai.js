import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { state } from "../state.js";
import { overlap } from "../utils.js";

function platformBelow(x, y, width) {
  const fake = { x: x - width / 2, y, w: width, h: 6 };
  const hitsGround = fake.y + fake.h >= state.arena.groundY && fake.y <= GAMEPLAY_CONSTANTS.WORLD_HEIGHT;
  if (hitsGround) {
    return {
      x: 0,
      y: state.arena.groundY,
      w: GAMEPLAY_CONSTANTS.WORLD_WIDTH,
      h: GAMEPLAY_CONSTANTS.WORLD_HEIGHT - state.arena.groundY
    };
  }

  return state.arena.platforms.find((platform) => overlap(fake, platform));
}

function nearEdge(player) {
  const below = platformBelow(player.x, player.y + player.h / 2 + 4, player.w * 0.4);
  return !below;
}

export function getBotInput(player, nearestCarrot) {
  const targets = state.players.filter((other) => other.id !== player.id && other.alive);
  const carrot = nearestCarrot(player);

  let focusX = player.x;
  let focusY = player.y;

  if (carrot && Math.random() < 0.55) {
    focusX = carrot.x;
    focusY = carrot.y;
  } else if (targets.length) {
    const target = targets.reduce((best, current) => {
      const bestDistance = Math.abs(best.x - player.x) + Math.abs(best.y - player.y);
      const currentDistance = Math.abs(current.x - player.x) + Math.abs(current.y - player.y);
      return currentDistance < bestDistance ? current : best;
    }, targets[0]);

    focusX = target.x;
    focusY = target.y;
  }

  let move = 0;
  if (Math.abs(focusX - player.x) > 8) move = focusX > player.x ? 1 : -1;

  const shouldJump =
    (focusY + 12 < player.y && player.onGround && Math.random() < 0.3) ||
    (player.onGround && Math.random() < 0.02) ||
    (player.onGround && nearEdge(player));

  return { move, jump: shouldJump };
}
