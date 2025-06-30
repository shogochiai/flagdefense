export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
    this.selectedCharacter = null;
    this.cpuCharacter = null;
    this.selectedDifficulty = 'normal';
  }

  init(data) {
    this.veggieCharacters = data.veggieCharacters || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);
    
    const title = this.add.text(width / 2, 60, 'CHARACTER SELECT', {
      fontSize: '56px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);
    
    this.playerIndicator = this.add.text(width / 2, 120, 'キャラクターを選択', {
      fontSize: '36px',
      fill: '#27ae60'
    }).setOrigin(0.5);
    
    this.createCharacterGrid();
    this.createInfoPanels();
    this.createDifficultySelector();
    this.createStartButton();
  }
  
  createCharacterGrid() {
    const gridStartX = 150;
    const gridStartY = 200;
    const cardWidth = 140;
    const cardHeight = 120;
    const spacing = 15;
    const cols = 7;
    
    this.veggieCharacters.forEach((character, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = gridStartX + col * (cardWidth + spacing);
      const y = gridStartY + row * (cardHeight + spacing);
      
      const card = this.add.container(x, y);
      
      const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x34495e);
      bg.setStrokeStyle(3, 0x7f8c8d);
      card.add(bg);
      
      const veggieImage = this.add.image(0, -20, `veggie_${character.id}`);
      veggieImage.setDisplaySize(60, 60);
      card.add(veggieImage);
      
      const name = this.add.text(0, 45, character.name, {
        fontSize: '14px',
        fill: '#ffffff',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
      card.add(name);
      
      card.setInteractive(new Phaser.Geom.Rectangle(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight), Phaser.Geom.Rectangle.Contains);
      
      card.on('pointerover', () => {
        bg.setFillStyle(0x4a5f7a);
        card.setScale(1.05);
        this.showCharacterInfo(character);
      });
      
      card.on('pointerout', () => {
        if (character !== this.selectedCharacter) {
          bg.setFillStyle(0x34495e);
        }
        card.setScale(1);
      });
      
      card.on('pointerdown', () => {
        this.selectCharacter(character, bg);
      });
      
      character.card = card;
      character.bg = bg;
    });
  }
  
  createInfoPanels() {
    this.p1Panel = this.createPlayerPanel(100, 500, 'PLAYER', 0x27ae60);
    this.cpuPanel = this.createPlayerPanel(1180, 500, 'CPU', 0xe74c3c);
  }
  
  createPlayerPanel(x, y, label, color) {
    const panel = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 200, 150, 0x2c3e50);
    bg.setStrokeStyle(3, color);
    panel.add(bg);
    
    const labelText = this.add.text(0, -60, label, {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);
    panel.add(labelText);
    
    const nameText = this.add.text(0, 0, '未選択', {
      fontSize: '20px',
      fill: '#95a5a6'
    }).setOrigin(0.5);
    panel.add(nameText);
    
    const statsText = this.add.text(0, 40, '', {
      fontSize: '14px',
      fill: '#bdc3c7',
      align: 'center'
    }).setOrigin(0.5);
    panel.add(statsText);
    
    panel.nameText = nameText;
    panel.statsText = statsText;
    return panel;
  }
  
  createDifficultySelector() {
    const x = 640;
    const y = 500;
    
    const diffTitle = this.add.text(x, y - 40, 'CPU難易度', {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    const difficulties = [
      { level: 'easy', text: 'かんたん', color: '#27ae60' },
      { level: 'normal', text: 'ふつう', color: '#f39c12' },
      { level: 'hard', text: 'むずかしい', color: '#e74c3c' }
    ];
    
    const buttonWidth = 150;
    const buttonHeight = 40;
    const startX = x - (difficulties.length * buttonWidth + (difficulties.length - 1) * 20) / 2;
    
    difficulties.forEach((diff, index) => {
      const buttonX = startX + index * (buttonWidth + 20) + buttonWidth / 2;
      const button = this.add.rectangle(buttonX, y + 20, buttonWidth, buttonHeight, 0x333333);
      button.setStrokeStyle(2, 0xffffff);
      
      const buttonText = this.add.text(buttonX, y + 20, diff.text, {
        fontSize: '20px',
        fill: diff.color
      }).setOrigin(0.5);
      
      button.setInteractive({ useHandCursor: true });
      
      if (diff.level === this.selectedDifficulty) {
        button.setFillStyle(0x555555);
        button.setStrokeStyle(3, parseInt(diff.color.replace('#', '0x')));
      }
      
      button.on('pointerdown', () => {
        this.selectedDifficulty = diff.level;
        this.scene.restart();
      });
      
      button.on('pointerover', () => {
        button.setFillStyle(0x666666);
      });
      
      button.on('pointerout', () => {
        if (diff.level === this.selectedDifficulty) {
          button.setFillStyle(0x555555);
        } else {
          button.setFillStyle(0x333333);
        }
      });
    });
  }
  
  showCharacterInfo(character) {
    const infoText = `体力: ${character.stats.hp}\n` +
                    `攻撃: ${character.stats.attack}\n` +
                    `防御: ${character.stats.defense}\n` +
                    `速度: ${character.stats.speed}`;
    
    const centerX = this.cameras.main.width / 2;
    const centerY = 620;
    
    if (!this.infoDisplay) {
      this.infoDisplay = this.add.container(centerX, centerY);
      
      const infoBg = this.add.rectangle(0, 0, 400, 120, 0x000000, 0.8);
      infoBg.setStrokeStyle(2, 0xffffff);
      this.infoDisplay.add(infoBg);
      
      this.infoName = this.add.text(0, -40, '', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial Black'
      }).setOrigin(0.5);
      this.infoDisplay.add(this.infoName);
      
      this.infoDesc = this.add.text(0, -10, '', {
        fontSize: '16px',
        fill: '#ecf0f1'
      }).setOrigin(0.5);
      this.infoDisplay.add(this.infoDesc);
      
      this.infoStats = this.add.text(0, 30, '', {
        fontSize: '14px',
        fill: '#bdc3c7'
      }).setOrigin(0.5);
      this.infoDisplay.add(this.infoStats);
    }
    
    this.infoName.setText(character.name);
    this.infoDesc.setText(character.description);
    this.infoStats.setText(infoText);
  }
  
  selectCharacter(character, bg) {
    if (this.selectedCharacter && this.selectedCharacter.bg) {
      this.selectedCharacter.bg.setFillStyle(0x34495e);
      this.selectedCharacter.bg.setStrokeStyle(3, 0x7f8c8d);
    }
    
    this.selectedCharacter = character;
    bg.setStrokeStyle(5, 0x27ae60);
    bg.setFillStyle(0x27ae60, 0.3);
    
    this.p1Panel.nameText.setText(character.name);
    this.p1Panel.statsText.setText(`必殺技:\n${character.special}`);
    
    // CPU対戦相手をランダムに選択
    const availableOpponents = this.veggieCharacters.filter(c => c.id !== character.id);
    this.cpuCharacter = Phaser.Utils.Array.GetRandom(availableOpponents);
    
    this.cpuPanel.nameText.setText(this.cpuCharacter.name);
    this.cpuPanel.statsText.setText(`必殺技:\n${this.cpuCharacter.special}`);
    
    this.updateStartButton();
  }
  
  createStartButton() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.startButton = this.add.text(width / 2, height - 60, 'START BATTLE', {
      fontSize: '42px',
      fontFamily: 'Arial Black',
      fill: '#7f8c8d',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    this.startButton.setInteractive({ useHandCursor: true });
    this.updateStartButton();
  }
  
  updateStartButton() {
    if (this.selectedCharacter && this.cpuCharacter) {
      this.startButton.setFill('#ffffff');
      
      this.startButton.removeAllListeners();
      this.startButton.on('pointerover', () => {
        this.startButton.setScale(1.1);
        this.startButton.setFill('#f39c12');
      });
      this.startButton.on('pointerout', () => {
        this.startButton.setScale(1);
        this.startButton.setFill('#ffffff');
      });
      this.startButton.on('pointerdown', () => {
        this.scene.start('BattleScene', {
          p1: this.selectedCharacter,
          p2: this.cpuCharacter,
          difficulty: this.selectedDifficulty
        });
      });
    } else {
      this.startButton.setFill('#7f8c8d');
      this.startButton.removeAllListeners();
    }
  }
}