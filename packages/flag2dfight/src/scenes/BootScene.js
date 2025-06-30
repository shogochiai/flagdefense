export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.text('flagData', '../../assets/flags/datasheet.yaml');
  }

  create() {
    this.scene.start('PreloadScene');
  }
}