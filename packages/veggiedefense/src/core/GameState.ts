import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Vegetable } from '../data/vegetables';

export interface GameState {
  coins: number;
  lives: number;
  wave: number;
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  selectedVegetable: Vegetable | null;
  selectedTower: Tower | null;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  waveInProgress: boolean;
  enemiesSpawned: number;
  lastSpawnTime: number;
}

export const createInitialGameState = (): GameState => ({
  coins: 200,
  lives: 20,
  wave: 0,
  towers: [],
  enemies: [],
  projectiles: [],
  selectedVegetable: null,
  selectedTower: null,
  isPaused: false,
  isGameOver: false,
  isVictory: false,
  waveInProgress: false,
  enemiesSpawned: 0,
  lastSpawnTime: 0,
});