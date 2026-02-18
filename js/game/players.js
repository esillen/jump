import { GAMEPLAY_CONSTANTS } from "../GAMEPLAY_CONSTANTS.js";
import { state } from "../state.js";
import { clamp, overlap, pick, rnd } from "../utils.js";

function respawnPlayer(player) {
  const spot = pick(state.arena.spawns);
  player.x = spot.x + rnd(-20, 20);
  player.y = spot.y;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.alive = true;
  player.eatAnim = 0;
}

function collideWithWorld(player, prevX, prevY) {
  const body = { x: player.x - player.w / 2, y: player.y - player.h / 2, w: player.w, h: player.h };
  const staticBodies = [
    {
      x: 0,
      y: state.arena.groundY,
      w: GAMEPLAY_CONSTANTS.WORLD_WIDTH,
      h: GAMEPLAY_CONSTANTS.WORLD_HEIGHT - state.arena.groundY
    },
    ...state.arena.platforms
  ];

  staticBodies.forEach((platform) => {
    if (!overlap(body, platform)) return;

    const prevBody = { x: prevX - player.w / 2, y: prevY - player.h / 2, w: player.w, h: player.h };

    if (prevBody.y + prevBody.h <= platform.y + 2 && player.vy >= 0) {
      player.y = platform.y - player.h / 2;
      player.vy = 0;
      player.onGround = true;
      body.y = player.y - player.h / 2;
      return;
    }

    if (prevBody.y >= platform.y + platform.h - 2 && player.vy < 0) {
      player.y = platform.y + platform.h + player.h / 2;
      player.vy *= 0.2;
      body.y = player.y - player.h / 2;
      return;
    }

    if (prevBody.x + prevBody.w <= platform.x + 2 && player.vx > 0) {
      player.x = platform.x - player.w / 2;
      player.vx = 0;
      body.x = player.x - player.w / 2;
      return;
    }

    if (prevBody.x >= platform.x + platform.w - 2 && player.vx < 0) {
      player.x = platform.x + platform.w + player.w / 2;
      player.vx = 0;
      body.x = player.x - player.w / 2;
    }
  });
}

function updatePlayer(player, dt, resolveInput) {
  if (!player.alive) {
    player.respawnTimer -= dt;
    if (player.respawnTimer <= 0) respawnPlayer(player);
    return;
  }

  const input = resolveInput(player);
  player.vx += input.move * GAMEPLAY_CONSTANTS.PLAYER_ACCELERATION * dt;
  player.vx *= player.onGround
    ? GAMEPLAY_CONSTANTS.PLAYER_GROUND_FRICTION
    : GAMEPLAY_CONSTANTS.PLAYER_AIR_FRICTION;
  player.vx = clamp(player.vx, -GAMEPLAY_CONSTANTS.PLAYER_MAX_SPEED, GAMEPLAY_CONSTANTS.PLAYER_MAX_SPEED);

  if (Math.abs(input.move) > 0.1) player.face = Math.sign(input.move);

  if (input.jump && !player.jumpPressedLast) player.jumpBuffer = GAMEPLAY_CONSTANTS.JUMP_BUFFER_SECONDS;
  player.jumpBuffer -= dt;
  player.jumpPressedLast = input.jump;

  player.jumpCooldown -= dt;
  if (player.jumpBuffer > 0 && player.onGround && player.jumpCooldown <= 0) {
    player.vy = GAMEPLAY_CONSTANTS.JUMP_VELOCITY;
    player.onGround = false;
    player.jumpBuffer = 0;
    player.jumpCooldown = GAMEPLAY_CONSTANTS.JUMP_COOLDOWN_SECONDS;
  }

  player.vy += GAMEPLAY_CONSTANTS.GRAVITY * dt;

  const prevX = player.x;
  const prevY = player.y;
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  player.x = clamp(player.x, player.w / 2, GAMEPLAY_CONSTANTS.WORLD_WIDTH - player.w / 2);

  player.onGround = false;
  collideWithWorld(player, prevX, prevY);

  if (player.onGround && Math.abs(player.vx) > 20) {
    player.runPhase += dt * (Math.abs(player.vx) / 50);
  }
}

export function updatePlayers(dt, resolveInput) {
  state.players.forEach((player) => {
    updatePlayer(player, dt, resolveInput);
  });
}
