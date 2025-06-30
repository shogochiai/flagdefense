export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data) {
    this.winner = data.winner;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
    
    this.createConfetti();
    
    const victoryText = this.add.text(width / 2, height / 3, 'VICTORY!', {
      fontSize: '96px',
      fontFamily: 'Arial Black',
      fill: '#ffff00',
      stroke: '#ff0000',
      strokeThickness: 10
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: victoryText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const winnerContainer = this.add.container(width / 2, height / 2);
    
    const veggie = this.add.circle(0, 0, 60, this.winner.color);
    veggie.setStrokeStyle(6, 0xffffff);
    winnerContainer.add(veggie);
    
    const winnerName = this.add.text(0, 100, this.winner.name, {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);
    winnerContainer.add(winnerName);
    
    this.tweens.add({
      targets: winnerContainer,
      y: height / 2 + 20,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const menuButton = this.add.text(width / 2 - 150, height - 100, 'メインメニュー', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      backgroundColor: '#27ae60',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    const rematchButton = this.add.text(width / 2 + 150, height - 100, '再戦', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      backgroundColor: '#e74c3c',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    menuButton.setInteractive({ useHandCursor: true });
    rematchButton.setInteractive({ useHandCursor: true });
    
    menuButton.on('pointerover', () => {
      menuButton.setScale(1.1);
    });
    menuButton.on('pointerout', () => {
      menuButton.setScale(1);
    });
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
    
    rematchButton.on('pointerover', () => {
      rematchButton.setScale(1.1);
    });
    rematchButton.on('pointerout', () => {
      rematchButton.setScale(1);
    });
    rematchButton.on('pointerdown', () => {
      this.scene.start('CharacterSelectScene');
    });
  }
  
  createConfetti() {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    
    for (let i = 0; i < 100; i++) {
      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, 1280),
        Phaser.Math.Between(-100, -500),
        Phaser.Math.Between(10, 20),
        Phaser.Math.Between(10, 20),
        Phaser.Utils.Array.GetRandom(colors)
      );
      
      this.tweens.add({
        targets: confetti,
        y: 800,
        rotation: Phaser.Math.Between(0, 6),
        duration: Phaser.Math.Between(3000, 5000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }
  }
}