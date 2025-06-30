export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.text('vegetableData', '../../assets/vegetables/datasheet.yaml');
  }

  create() {
    this.scene.start('PreloadScene');
  }
}