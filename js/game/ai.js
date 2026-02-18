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

function nearestOpponent(player) {
  const targets = state.players.filter((other) => other.id !== player.id && other.alive);
  if (!targets.length) return null;
  return targets.reduce((best, current) => {
    const bestDistance = Math.abs(best.x - player.x) + Math.abs(best.y - player.y);
    const currentDistance = Math.abs(current.x - player.x) + Math.abs(current.y - player.y);
    return currentDistance < bestDistance ? current : best;
  }, targets[0]);
}

function getHardBotInput(player, nearestCarrot, dt) {
  player.aiLockTimer = Math.max(0, player.aiLockTimer - dt);

  let carrot = null;
  if (player.aiLockCarrotId !== null) {
    carrot = state.carrots.find((entry) => entry.id === player.aiLockCarrotId) || null;
  }
  if (!carrot) {
    carrot = nearestCarrot(player);
    player.aiLockCarrotId = carrot ? carrot.id : null;
  }

  if (carrot) {
    const dx = carrot.x - player.x;
    const dy = carrot.y - player.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 34 && player.onGround) {
      player.aiLockCarrotId = carrot.id;
      player.aiLockTimer = 1.2;
      return { move: 0, jump: false };
    }

    if (player.aiLockTimer > 0 && Math.abs(dx) < 54 && player.onGround) {
      return { move: 0, jump: false };
    }

    let move = 0;
    if (Math.abs(dx) > 6) move = dx > 0 ? 1 : -1;

    const jumpToCarrot =
      player.onGround &&
      ((dy + 8 < 0 && Math.abs(dx) < 240 && Math.random() < 0.72) ||
        (nearEdge(player) && Math.abs(dx) > 20));

    return { move, jump: jumpToCarrot };
  }

  const target = nearestOpponent(player);
  if (!target) return { move: 0, jump: false };

  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const move = Math.abs(dx) > 8 ? (dx > 0 ? 1 : -1) : 0;
  const jump = player.onGround && ((dy + 12 < 0 && Math.random() < 0.45) || (nearEdge(player) && Math.random() < 0.85));
  return { move, jump };
}

function getEasyBotInput(player, dt) {
  player.aiWanderTimer -= dt;
  if (player.aiWanderTimer <= 0) {
    player.aiWanderTimer = 0.4 + Math.random() * 1.4;
    player.aiWanderDir = Math.random() < 0.5 ? -1 : 1;
  }

  const target = nearestOpponent(player);
  let move = 0;

  if (target && Math.random() < 0.22) {
    const dx = target.x - player.x;
    if (Math.abs(dx) > 34) move = dx > 0 ? 0.6 : -0.6;
  } else if (Math.random() < 0.35) {
    move = player.aiWanderDir * 0.35;
  }

  const jump = player.onGround && Math.random() < 0.006;
  return { move, jump };
}

export function getBotInput(player, nearestCarrot, dt) {
  if (player.type === "easy-bot") return getEasyBotInput(player, dt);
  return getHardBotInput(player, nearestCarrot, dt);
}
