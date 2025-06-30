export interface Position {
  x: number;
  y: number;
}

export interface Block {
  flagId: string;
  position: Position;
}

export interface Tetromino {
  blocks: Block[];
  shape: number[][];
  position: Position;
  flagId: string;
}

export interface GameState {
  board: (string | null)[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
}

export interface FlagData {
  id: string;
  name: {
    en: string;
    ja: string;
  };
  emoji: string;
  capital?: string;
  population?: number;
  gdp?: number;
  continent?: string;
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BLOCK_SIZE = 30;

export const TETROMINO_SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};