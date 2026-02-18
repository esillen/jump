import { GAMEPLAY_CONSTANTS } from "./GAMEPLAY_CONSTANTS.js";
import { backToTitle, beginMatch, updateGame } from "./gameplay.js";
import { setupKeyboard, updateTitleInputs } from "./input.js";
import { drawFrame } from "./render.js";
import { setScreen, setupLobby, state, ui } from "./state.js";

let lastTime = performance.now();

function createDefaultSlots() {
  return Array.from({ length: GAMEPLAY_CONSTANTS.MAX_PLAYERS }, (_, id) => ({
    id,
    type: id < 2 ? "human" : "hard-bot",
    ready: id >= 2,
    gamepadIndex: id
  }));
}

function update(dt) {
  if (state.screen === "game") updateGame(dt);
  if (state.screen === "title") {
    const { startRequested } = updateTitleInputs();
    if (startRequested) beginMatch();
  }
}

function frame(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;

  update(dt);
  drawFrame();
  requestAnimationFrame(frame);
}

function init() {
  setScreen("title");
  setupLobby(createDefaultSlots());
  setupKeyboard();
  ui.childModeToggle.checked = true;
  state.childMode = true;
  ui.childModeToggle.addEventListener("change", () => {
    state.childMode = ui.childModeToggle.checked;
  });

  ui.backBtn.addEventListener("click", backToTitle);

  requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    frame(timestamp);
  });
}

init();
