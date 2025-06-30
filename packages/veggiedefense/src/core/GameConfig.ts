export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GRID_SIZE: 40,
  STARTING_COINS: 200,
  STARTING_LIVES: 20,
  WAVE_DELAY: 3000,
  CELL_SIZE: 40,
};

export const WAVE_CONFIG = [
  { enemies: ["aphid"], count: 5, interval: 1000 },
  { enemies: ["aphid", "caterpillar"], count: 8, interval: 800 },
  { enemies: ["caterpillar", "locust"], count: 10, interval: 700 },
  { enemies: ["aphid", "caterpillar", "locust"], count: 15, interval: 600 },
  { enemies: ["snail"], count: 3, interval: 2000 },
  { enemies: ["caterpillar", "locust", "snail"], count: 20, interval: 500 },
  { enemies: ["beetle"], count: 2, interval: 3000 },
  { enemies: ["locust", "beetle"], count: 15, interval: 400 },
  { enemies: ["snail", "beetle"], count: 10, interval: 1000 },
  { enemies: ["aphid", "caterpillar", "locust", "snail", "beetle"], count: 30, interval: 300 },
];

export const PATH_POINTS = [
  { x: 0, y: 300 },
  { x: 150, y: 300 },
  { x: 150, y: 150 },
  { x: 300, y: 150 },
  { x: 300, y: 450 },
  { x: 500, y: 450 },
  { x: 500, y: 200 },
  { x: 650, y: 200 },
  { x: 650, y: 300 },
  { x: 800, y: 300 },
];