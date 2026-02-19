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
      h: GAMEPLAY_CONSTANTS.WORLD_HEIGHT - state.arena.groundY,
      isGround: true
    };
  }

  const plat = state.arena.platforms.find((platform) => overlap(fake, platform));
  return plat ? { ...plat, isGround: false } : null;
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

function nearestThreat(player) {
  const targets = state.players.filter((other) => other.id !== player.id && other.alive);
  const close = targets.filter((other) => {
    const dist = Math.hypot(other.x - player.x, other.y - player.y);
    return dist < 180;
  });
  if (!close.length) return null;
  return close.reduce((best, current) => {
    const bestDistance = Math.hypot(best.x - player.x, best.y - player.y);
    const currentDistance = Math.hypot(current.x - player.x, current.y - player.y);
    return currentDistance < bestDistance ? current : best;
  }, close[0]);
}

function platformOverhead(player) {
  return state.arena.platforms.find((platform) => {
    const withinX = player.x > platform.x + 8 && player.x < platform.x + platform.w - 8;
    const above = platform.y < player.y - 16;
    const closeY = platform.y > player.y - 210;
    return withinX && above && closeY;
  });
}

function moveToward(value, deadzone = 8) {
  if (Math.abs(value) <= deadzone) return 0;
  return value > 0 ? 1 : -1;
}

function navigateToTarget(player, targetX, targetY, jumpBias) {
  const dx = targetX - player.x;
  const dy = targetY - player.y;

  if (dy < -46) {
    const overhead = platformOverhead(player);
    if (overhead) {
      const leftEscape = overhead.x - 24;
      const rightEscape = overhead.x + overhead.w + 24;
      const escapeX = Math.abs(player.x - leftEscape) < Math.abs(player.x - rightEscape) ? leftEscape : rightEscape;
      const move = moveToward(escapeX - player.x, 4);
      const jump = player.onGround && Math.abs(escapeX - player.x) < 20 && Math.random() < jumpBias;
      return { move, jump };
    }
  }

  if (dy > 56) {
    const support = platformBelow(player.x, player.y + player.h / 2 + 4, player.w * 0.8);
    if (support && !support.isGround) {
      const leftEdge = support.x - 18;
      const rightEdge = support.x + support.w + 18;
      const edgeX = Math.abs(player.x - leftEdge) < Math.abs(player.x - rightEdge) ? leftEdge : rightEdge;
      return { move: moveToward(edgeX - player.x, 4), jump: false };
    }
  }

  const move = moveToward(dx, 6);
  const jump =
    player.onGround &&
    ((dy < -8 && Math.abs(dx) < 260 && Math.random() < jumpBias) ||
      (nearEdge(player) && Math.abs(dx) > 24 && Math.random() < jumpBias * 0.9));

  return { move, jump };
}

function getHardBotInput(player, nearestCarrot, dt) {
  player.aiLockTimer = Math.max(0, player.aiLockTimer - dt);

  const threat = nearestThreat(player);
  if (threat) {
    const tdx = threat.x - player.x;
    const tdy = threat.y - player.y;
    const move = moveToward(tdx, 5);
    const jump =
      player.onGround &&
      ((tdy < -10 && Math.abs(tdx) < 250 && Math.random() < 0.72) ||
        (Math.abs(tdx) < 34 && Math.random() < 0.2) ||
        (nearEdge(player) && Math.abs(tdx) > 20 && Math.random() < 0.9));
    return { move, jump };
  }

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
      player.aiLockTimer = 1.0;
      return { move: 0, jump: false };
    }

    if (player.aiLockTimer > 0 && Math.abs(dx) < 20 && Math.abs(dy) < 28 && player.onGround) {
      return { move: 0, jump: false };
    }

    return navigateToTarget(player, carrot.x, carrot.y, 0.74);
  }

  const target = nearestOpponent(player);
  if (!target) return { move: 0, jump: false };

  return navigateToTarget(player, target.x, target.y, 0.6);
}

function getEasyBotInput(player, nearestCarrot, dt) {
  player.aiWanderTimer -= dt;
  if (player.aiWanderTimer <= 0) {
    player.aiWanderTimer = 0.5 + Math.random() * 1.9;
    player.aiWanderDir = Math.random() < 0.5 ? -1 : 1;
  }

  const carrot = nearestCarrot(player);
  if (carrot) {
    const dx = carrot.x - player.x;
    const dy = carrot.y - player.y;

    if (Math.abs(dx) < 26 && Math.abs(dy) < 30 && player.onGround) {
      return { move: 0, jump: false };
    }

    if (Math.abs(dy) < 46 && Math.random() < 0.35) {
      return { move: moveToward(dx, 16) * 0.55, jump: false };
    }
  }

  const target = nearestOpponent(player);
  let move = 0;
  if (target && Math.random() < 0.14) {
    const dx = target.x - player.x;
    if (Math.abs(dx) > 38) move = dx > 0 ? 0.45 : -0.45;
  } else if (Math.random() < 0.4) {
    move = player.aiWanderDir * 0.33;
  }

  const jump = player.onGround && Math.random() < 0.004;
  return { move, jump };
}

export function getBotInput(player, nearestCarrot, dt) {
  if (player.type === "easy-bot") return getEasyBotInput(player, nearestCarrot, dt);
  return getHardBotInput(player, nearestCarrot, dt);
}
