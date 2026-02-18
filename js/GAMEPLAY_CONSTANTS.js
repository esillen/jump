export const GAMEPLAY_CONSTANTS = {
  WORLD_WIDTH: 1280,
  WORLD_HEIGHT: 720,
  GRAVITY: 1850,
  MATCH_TIME_SECONDS: 180,
  TARGET_SCORE: 10,
  MAX_PLAYERS: 4,
  MAX_CARROTS: 2,
  CARROTS_PER_POINT: 3,
  CARROT_COLLECT_SECONDS: 1.5,
  CARROT_RESPAWN_MIN_SECONDS: 4.5,
  CARROT_RESPAWN_MAX_SECONDS: 9,
  CARROT_INITIAL_SPAWN_MIN_SECONDS: 4,
  CARROT_INITIAL_SPAWN_MAX_SECONDS: 8,
  PLAYER_WIDTH: 42,
  PLAYER_HEIGHT: 38,
  PLAYER_ACCELERATION: 5400,
  PLAYER_MAX_SPEED: 720,
  PLAYER_GROUND_FRICTION: 0.82,
  PLAYER_AIR_FRICTION: 0.93,
  JUMP_VELOCITY: -760,
  JUMP_BUFFER_SECONDS: 0.16,
  JUMP_COOLDOWN_SECONDS: 0.08,
  STOMP_BOUNCE_VELOCITY: -540,
  STOMP_MIN_DOWNWARD_VELOCITY: 220,
  RESPAWN_SECONDS: 1.2,
  GORE_PARTICLE_COUNT: 24,
  GORE_CHUNK_COUNT: 5
};

export const PLAYER_COLORS = ["#f8f8ff", "#fff0f5", "#e8f7ff", "#fff7d7"];
export const PLAYER_OUTLINES = ["#778", "#977", "#678", "#997"];

export const KEYBOARD_LAYOUTS = [
  { left: "KeyA", right: "KeyD", jump: "KeyW" },
  { left: "ArrowLeft", right: "ArrowRight", jump: "ArrowUp" },
  { left: "KeyJ", right: "KeyL", jump: "KeyI" },
  { left: "KeyF", right: "KeyH", jump: "KeyT" }
];

export const ARENAS = [
  {
    name: "Bloom Ridge",
    groundY: 668,
    platforms: [
      { x: 120, y: 560, w: 220, h: 20 },
      { x: 390, y: 500, w: 200, h: 20 },
      { x: 690, y: 540, w: 220, h: 20 },
      { x: 980, y: 480, w: 180, h: 20 },
      { x: 510, y: 390, w: 250, h: 20 },
      { x: 170, y: 360, w: 180, h: 20 },
      { x: 910, y: 320, w: 190, h: 20 }
    ],
    spawns: [
      { x: 170, y: 300 },
      { x: 1080, y: 260 },
      { x: 520, y: 330 },
      { x: 740, y: 500 }
    ],
    carrotSpots: [
      { x: 220, y: 530 },
      { x: 470, y: 470 },
      { x: 760, y: 510 },
      { x: 1040, y: 450 },
      { x: 610, y: 360 }
    ]
  },
  {
    name: "Cloud Meadow",
    groundY: 670,
    platforms: [
      { x: 90, y: 590, w: 170, h: 20 },
      { x: 310, y: 530, w: 200, h: 20 },
      { x: 570, y: 470, w: 180, h: 20 },
      { x: 800, y: 520, w: 190, h: 20 },
      { x: 1040, y: 580, w: 170, h: 20 },
      { x: 350, y: 370, w: 180, h: 20 },
      { x: 660, y: 330, w: 220, h: 20 },
      { x: 930, y: 390, w: 170, h: 20 }
    ],
    spawns: [
      { x: 130, y: 550 },
      { x: 1120, y: 540 },
      { x: 680, y: 290 },
      { x: 420, y: 330 }
    ],
    carrotSpots: [
      { x: 150, y: 560 },
      { x: 390, y: 500 },
      { x: 650, y: 440 },
      { x: 890, y: 490 },
      { x: 1080, y: 550 },
      { x: 760, y: 300 }
    ]
  },
  {
    name: "Petal Drift",
    groundY: 672,
    platforms: [
      { x: 170, y: 610, w: 150, h: 18 },
      { x: 380, y: 560, w: 170, h: 18 },
      { x: 620, y: 610, w: 170, h: 18 },
      { x: 860, y: 560, w: 180, h: 18 },
      { x: 1060, y: 500, w: 130, h: 18 },
      { x: 550, y: 450, w: 190, h: 18 },
      { x: 290, y: 430, w: 140, h: 18 },
      { x: 850, y: 370, w: 170, h: 18 }
    ],
    spawns: [
      { x: 220, y: 580 },
      { x: 1070, y: 470 },
      { x: 610, y: 420 },
      { x: 900, y: 340 }
    ],
    carrotSpots: [
      { x: 230, y: 580 },
      { x: 430, y: 530 },
      { x: 670, y: 580 },
      { x: 910, y: 530 },
      { x: 1110, y: 470 },
      { x: 620, y: 420 }
    ]
  }
];
