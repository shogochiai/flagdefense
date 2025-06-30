export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
    this.selectedCharacters = { p1: null, p2: null };
    this.currentPlayer = 'p1';
  }

  init(data) {
    this.flagCharacters = data.flagCharacters || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x222222).setOrigin(0);
    
    const title = this.add.text(width / 2, 50, 'CHARACTER SELECT', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    this.playerIndicator = this.add.text(width / 2, 100, 'Player 1 Select', {
      fontSize: '32px',
      fill: '#00ff00'
    }).setOrigin(0.5);
    
    const gridStartX = 150;
    const gridStartY = 180;
    const cardWidth = 180;
    const cardHeight = 120;
    const spacing = 20;
    const cols = 4;
    
    this.flagCharacters.forEach((character, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = gridStartX + col * (cardWidth + spacing);
      const y = gridStartY + row * (cardHeight + spacing);
      
      const card = this.add.container(x, y);
      
      const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x444444);
      bg.setStrokeStyle(3, 0xffffff);
      card.add(bg);
      
      // Try to load actual flag image
      const flagKey = `flag_${character.id}`;
      if (this.textures.exists(flagKey)) {
        const flag = this.add.image(0, -20, flagKey);
        flag.setScale(0.3); // Scale down flag to fit card
        card.add(flag);
      } else {
        // Fallback to colored rectangle
        const flag = this.add.rectangle(0, -20, 120, 60, 0xffffff);
        if (character.colors && character.colors.length > 0) {
          flag.setFillStyle(parseInt(character.colors[0].replace('#', '0x')));
        }
        card.add(flag);
      }
      
      // Add emoji if available
      const displayName = character.emoji ? `${character.emoji} ${character.name}` : character.name;
      const name = this.add.text(0, 40, displayName, {
        fontSize: '16px',
        fill: '#ffffff'
      }).setOrigin(0.5);
      card.add(name);
      
      card.setInteractive(new Phaser.Geom.Rectangle(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight), Phaser.Geom.Rectangle.Contains);
      
      card.on('pointerover', () => {
        bg.setFillStyle(0x666666);
        card.setScale(1.1);
        this.showCharacterInfo(character);
      });
      
      card.on('pointerout', () => {
        bg.setFillStyle(0x444444);
        card.setScale(1);
      });
      
      card.on('pointerdown', () => {
        this.selectCharacter(character, card, bg);
      });
    });
    
    this.infoPanel = this.add.container(width - 200, height / 2);
    this.infoBackground = this.add.rectangle(0, 0, 350, 300, 0x333333);
    this.infoPanel.add(this.infoBackground);
    
    this.infoText = this.add.text(0, -100, '', {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    this.infoPanel.add(this.infoText);
    
    this.statsText = this.add.text(0, 0, '', {
      fontSize: '16px',
      fill: '#aaaaaa',
      align: 'left'
    }).setOrigin(0.5);
    this.infoPanel.add(this.statsText);
    
    const startButton = this.add.text(width / 2, height - 50, 'START BATTLE', {
      fontSize: '36px',
      fill: '#888888',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    startButton.setInteractive({ useHandCursor: true });
    
    this.startButton = startButton;
    this.updateStartButton();
  }
  
  showCharacterInfo(character) {
    const title = character.emoji ? `${character.emoji} ${character.name}` : character.name;
    this.infoText.setText(`${title}\\n${character.englishName}\\n\\n必殺技: ${character.special}`);
    
    const statsText = `HP: ${character.stats.hp}\\n` +
                     `攻撃力: ${character.stats.attack}\\n` +
                     `防御力: ${character.stats.defense}\\n` +
                     `スピード: ${Math.round(character.stats.speed)}\\n` +
                     `ティア: ${character.tier}`;
    this.statsText.setText(statsText);
  }
  
  selectCharacter(character, card, bg) {
    this.selectedCharacters[this.currentPlayer] = character;
    
    if (this.currentPlayer === 'p1') {
      bg.setStrokeStyle(4, 0x00ff00);
      this.currentPlayer = 'p2';
      this.playerIndicator.setText('Player 2 Select');
      this.playerIndicator.setFill('#ff0000');
    } else {
      bg.setStrokeStyle(4, 0xff0000);
    }
    
    this.updateStartButton();
  }
  
  updateStartButton() {
    if (this.selectedCharacters.p1 && this.selectedCharacters.p2) {
      this.startButton.setFill('#ffffff');
      this.startButton.on('pointerover', () => {
        this.startButton.setScale(1.2);
        this.startButton.setFill('#ffff00');
      });
      this.startButton.on('pointerout', () => {
        this.startButton.setScale(1);
        this.startButton.setFill('#ffffff');
      });
      this.startButton.on('pointerdown', () => {
        this.scene.start('BattleScene', { 
          p1: this.selectedCharacters.p1,
          p2: this.selectedCharacters.p2
        });
      });
    }
  }
}