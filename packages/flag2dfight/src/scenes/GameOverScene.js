export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.winner = data.winner;
    this.winnerChar = data.winnerChar;
    this.p1Char = data.p1Char;
    this.p2Char = data.p2Char;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
    
    const gameOverText = this.add.text(width / 2, height / 3, 'GAME OVER', {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      fill: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 8
    }).setOrigin(0.5);
    
    // Display winner with flag
    if (this.winnerChar) {
      const flagKey = `flag_${this.winnerChar.id}`;
      if (this.textures.exists(flagKey)) {
        const winnerFlag = this.add.image(width / 2, height / 2 - 50, flagKey);
        winnerFlag.setScale(0.5);
      }
    }
    
    const winnerText = this.add.text(width / 2, height / 2 + 50, `${this.winner} WINS!`, {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: winnerText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Create menu buttons
    const buttonY = height - 150;
    
    // Rematch button
    const rematchButton = this.add.text(width / 2 - 150, buttonY, 'REMATCH', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      backgroundColor: '#008800',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    rematchButton.on('pointerover', () => {
      rematchButton.setScale(1.1);
      rematchButton.setBackgroundColor('#00bb00');
    });
    
    rematchButton.on('pointerout', () => {
      rematchButton.setScale(1);
      rematchButton.setBackgroundColor('#008800');
    });
    
    rematchButton.on('pointerdown', () => {
      this.scene.start('BattleScene', {
        p1: this.p1Char,
        p2: this.p2Char
      });
    });
    
    // Menu button
    const menuButton = this.add.text(width / 2 + 150, buttonY, 'MAIN MENU', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      backgroundColor: '#880000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    menuButton.on('pointerover', () => {
      menuButton.setScale(1.1);
      menuButton.setBackgroundColor('#bb0000');
    });
    
    menuButton.on('pointerout', () => {
      menuButton.setScale(1);
      menuButton.setBackgroundColor('#880000');
    });
    
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
    
    // Add hint text
    const hintText = this.add.text(width / 2, height - 50, 'Choose your next action', {
      fontSize: '18px',
      fill: '#aaaaaa'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: hintText,
      alpha: 0.3,
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
  }
}