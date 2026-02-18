import { KEYBOARD_LAYOUTS } from "./GAMEPLAY_CONSTANTS.js";
import { keysDown, refreshLobbyReadyChecks, state } from "./state.js";
import { clamp } from "./utils.js";

const keyLatch = new Set();
const gamepadLatch = new Map();

export function setupKeyboard() {
  window.addEventListener("keydown", (e) => {
    keysDown.add(e.code);
  });

  window.addEventListener("keyup", (e) => {
    keysDown.delete(e.code);
  });
}

export function pollGamepad(index) {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp = pads[index];
  if (!gp) return { move: 0, jump: false };

  const axis = gp.axes[0] || 0;
  const move = Math.abs(axis) < 0.25 ? 0 : clamp(axis, -1, 1);
  return {
    move,
    jump: !!(gp.buttons[0]?.pressed || gp.buttons[12]?.pressed)
  };
}

export function getHumanInput(player) {
  const layout = KEYBOARD_LAYOUTS[player.id % KEYBOARD_LAYOUTS.length];
  let move = 0;
  if (keysDown.has(layout.left)) move -= 1;
  if (keysDown.has(layout.right)) move += 1;

  const kbJump = keysDown.has(layout.jump);
  const gp = pollGamepad(player.gamepadIndex);
  if (Math.abs(gp.move) > Math.abs(move)) move = gp.move;

  return {
    move: clamp(move, -1, 1),
    jump: kbJump || gp.jump
  };
}

function keyJustPressed(code) {
  const isDown = keysDown.has(code);
  const wasDown = keyLatch.has(code);
  if (isDown && !wasDown) {
    keyLatch.add(code);
    return true;
  }
  if (!isDown && wasDown) keyLatch.delete(code);
  return false;
}

function gamepadButtonJustPressed(gamepadIndex, buttonIndex) {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp = pads[gamepadIndex];
  if (!gp) return false;

  const current = !!gp.buttons[buttonIndex]?.pressed;
  const prev = gamepadLatch.get(`${gamepadIndex}:${buttonIndex}`) || false;
  gamepadLatch.set(`${gamepadIndex}:${buttonIndex}`, current);
  return current && !prev;
}

export function updateTitleInputs() {
  let startRequested = keyJustPressed("Space") || keyJustPressed("Enter");

  state.slots.forEach((slot) => {
    if (slot.type === "off") {
      slot.ready = false;
      return;
    }

    if (slot.type.endsWith("bot")) {
      slot.ready = true;
    } else {
      const layout = KEYBOARD_LAYOUTS[slot.id % KEYBOARD_LAYOUTS.length];
      const keyboardToggle = keyJustPressed(layout.jump);
      const gamepadToggle = gamepadButtonJustPressed(slot.gamepadIndex, 0);
      if (keyboardToggle || gamepadToggle) slot.ready = !slot.ready;
    }

    if (gamepadButtonJustPressed(slot.gamepadIndex, 9)) startRequested = true;
  });

  refreshLobbyReadyChecks();
  return { startRequested };
}
