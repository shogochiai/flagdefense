export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {
    this.flagCharacters = data.flagCharacters || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x111111).setOrigin(0);
    
    const title = this.add.text(width / 2, height / 3, 'FLAG 2D FIGHT', {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: title,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const menuItems = [
      { text: 'VS MODE', scene: 'CharacterSelectScene' },
      { text: 'TRAINING', scene: 'TrainingScene' },
      { text: 'OPTIONS', scene: 'OptionsScene' }
    ];
    
    menuItems.forEach((item, index) => {
      const menuY = height / 2 + index * 60;
      const menuText = this.add.text(width / 2, menuY, item.text, {
        fontSize: '32px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);
      
      menuText.setInteractive({ useHandCursor: true });
      
      menuText.on('pointerover', () => {
        menuText.setScale(1.2);
        menuText.setFill('#ffff00');
      });
      
      menuText.on('pointerout', () => {
        menuText.setScale(1);
        menuText.setFill('#ffffff');
      });
      
      menuText.on('pointerdown', () => {
        if (item.scene === 'CharacterSelectScene') {
          this.scene.start('CharacterSelectScene', { flagCharacters: this.flagCharacters });
        }
      });
    });
    
    const instructionText = this.add.text(width / 2, height - 50, 'Click to select', {
      fontSize: '20px',
      fill: '#aaaaaa'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: instructionText,
      alpha: 0,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }
}