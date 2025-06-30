import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { GardenScene } from './scenes/GardenScene';
import { BattleScene } from './scenes/BattleScene';
import { CollectionScene } from './scenes/CollectionScene';
import { EvolutionScene } from './scenes/EvolutionScene';

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    GardenScene,
    BattleScene,
    CollectionScene,
    EvolutionScene
  ]
};

const game = new Phaser.Game(config);