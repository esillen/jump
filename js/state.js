import { ARENAS, GAMEPLAY_CONSTANTS } from "./GAMEPLAY_CONSTANTS.js";

export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

export const ui = {
  title: document.getElementById("ui-title"),
  game: document.getElementById("ui-game"),
  end: document.getElementById("ui-end"),
  lobby: document.getElementById("lobby"),
  childModeToggle: document.getElementById("child-mode-toggle"),
  timer: document.getElementById("timer"),
  scoreboard: document.getElementById("scoreboard"),
  results: document.getElementById("results"),
  backBtn: document.getElementById("back-btn")
};

export const keysDown = new Set();

export const state = {
  screen: "title",
  players: [],
  slots: [],
  arena: ARENAS[0],
  decorations: [],
  particles: [],
  chunks: [],
  bloodMarks: [],
  carrotCrumbs: [],
  carrots: [],
  carrotTimer: 5,
  childMode: true,
  matchTime: GAMEPLAY_CONSTANTS.MATCH_TIME_SECONDS,
  winnerId: null
};

export function setScreen(screenName) {
  state.screen = screenName;
  ui.title.classList.toggle("active", screenName === "title");
  ui.game.classList.toggle("active", screenName === "game");
  ui.end.classList.toggle("active", screenName === "end");
}

export function setupLobby(defaultSlots) {
  state.slots = defaultSlots;
  ui.lobby.innerHTML = "";

  state.slots.forEach((slot) => {
    const card = document.createElement("div");
    card.className = "slot";
    card.innerHTML = `
      <h3>Player ${slot.id + 1}</h3>
      <div class="slot-row">
        <label>Type</label>
        <select data-role="type">
          <option value="human">Human</option>
          <option value="bot">Bot</option>
          <option value="off">Off</option>
        </select>
      </div>
      <div class="slot-row">
        <label>Ready</label>
        <span data-role="ready-text" class="ready-pill">Not Ready</span>
      </div>
    `;

    const typeSel = card.querySelector("[data-role=type]");
    const readyText = card.querySelector("[data-role=ready-text]");
    typeSel.value = slot.type;

    typeSel.addEventListener("change", () => {
      slot.type = typeSel.value;
      if (slot.type === "off") {
        slot.ready = false;
      }
      if (slot.type === "bot" && !slot.ready) {
        slot.ready = true;
      }
      updateReadyVisual(card, readyText, slot);
    });

    updateReadyVisual(card, readyText, slot);

    ui.lobby.appendChild(card);
  });
}

export function refreshLobbyReadyChecks() {
  const cards = Array.from(ui.lobby.querySelectorAll(".slot"));
  cards.forEach((card, i) => {
    const readyText = card.querySelector("[data-role=ready-text]");
    updateReadyVisual(card, readyText, state.slots[i]);
  });
}

function updateReadyVisual(card, readyText, slot) {
  if (slot.type === "off") {
    readyText.textContent = "Off";
    readyText.classList.remove("on");
    card.classList.remove("ready");
    return;
  }

  if (slot.ready) {
    readyText.textContent = "Ready";
    readyText.classList.add("on");
    card.classList.add("ready");
  } else {
    readyText.textContent = "Not Ready";
    readyText.classList.remove("on");
    card.classList.remove("ready");
  }
}
