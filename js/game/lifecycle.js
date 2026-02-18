import {
  ARENAS,
  GAMEPLAY_CONSTANTS,
  PLAYER_COLORS,
  PLAYER_OUTLINES
} from "../GAMEPLAY_CONSTANTS.js";
import { refreshLobbyReadyChecks, setScreen, state, ui } from "../state.js";
import { pick, rnd } from "../utils.js";

function canStartMatch() {
  const active = state.slots.filter((slot) => slot.type !== "off");
  return active.length >= 2 && active.every((slot) => slot.ready);
}

function resetPlayer(slot, spawn) {
  return {
    id: slot.id,
    name: `P${slot.id + 1}`,
    type: slot.type,
    gamepadIndex: slot.gamepadIndex,
    color: PLAYER_COLORS[slot.id],
    outline: PLAYER_OUTLINES[slot.id],
    x: spawn.x,
    y: spawn.y,
    w: GAMEPLAY_CONSTANTS.PLAYER_WIDTH,
    h: GAMEPLAY_CONSTANTS.PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    onGround: false,
    jumpBuffer: 0,
    jumpCooldown: 0,
    jumpPressedLast: false,
    alive: true,
    respawnTimer: 0,
    score: 0,
    kills: 0,
    carrots: 0,
    face: 1,
    runPhase: 0,
    eatAnim: 0
  };
}

function makeDecorations() {
  const flowers = [];
  for (let i = 0; i < 55; i += 1) {
    flowers.push({
      x: rnd(30, GAMEPLAY_CONSTANTS.WORLD_WIDTH - 30),
      y: rnd(state.arena.groundY + 8, GAMEPLAY_CONSTANTS.WORLD_HEIGHT - 16),
      c: pick(["#ff8cb8", "#fff0a6", "#c8a8ff", "#ffa180"]),
      s: rnd(0.6, 1.25)
    });
  }
  return flowers;
}

export function beginMatch() {
  if (!canStartMatch()) return false;

  setScreen("game");
  state.arena = pick(ARENAS);
  state.decorations = makeDecorations();
  state.particles = [];
  state.chunks = [];
  state.bloodMarks = [];
  state.carrotCrumbs = [];
  state.carrots = [];
  state.carrotTimer = rnd(
    GAMEPLAY_CONSTANTS.CARROT_INITIAL_SPAWN_MIN_SECONDS,
    GAMEPLAY_CONSTANTS.CARROT_INITIAL_SPAWN_MAX_SECONDS
  );
  state.matchTime = GAMEPLAY_CONSTANTS.MATCH_TIME_SECONDS;
  state.winnerId = null;

  const spawns = [...state.arena.spawns];
  state.players = state.slots
    .filter((slot) => slot.type !== "off")
    .map((slot, i) => resetPlayer(slot, spawns[i % spawns.length]));

  return true;
}

export function backToTitle() {
  setScreen("title");
  state.slots.forEach((slot) => {
    if (slot.type === "bot") slot.ready = true;
  });
  refreshLobbyReadyChecks();
}

export function endMatch() {
  setScreen("end");

  const sorted = [...state.players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.kills !== a.kills) return b.kills - a.kills;
    return b.carrots - a.carrots;
  });

  state.winnerId = sorted[0]?.id ?? null;
  ui.results.innerHTML = "";

  sorted.forEach((player, index) => {
    const row = document.createElement("div");
    row.className = "result-row";
    row.innerHTML = `
      <span>${index + 1}.</span>
      <strong>${player.name}</strong>
      <span>${player.score} pts</span>
      <span class="crown">${index === 0 ? "👑" : ""}</span>
    `;
    ui.results.appendChild(row);
  });
}
