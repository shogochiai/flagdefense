export class CollectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CollectionScene' });
  }

  init(data) {
    this.flagMonsters = data.flagMonsters || [];
    this.collection = data.collection || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);
    
    const title = this.add.text(width / 2, 40, 'フラッグモンスター図鑑', {
      fontSize: '42px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    const backButton = this.add.text(50, 40, '< 戻る', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 15, y: 8 }
    }).setOrigin(0, 0.5);
    
    backButton.setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene', { flagMonsters: this.flagMonsters });
    });
    
    this.createGrid();
    this.createInfoPanel();
  }
  
  createGrid() {
    const gridContainer = this.add.container(100, 120);
    const cols = 6;
    const rows = 4;
    const cardSize = 120;
    const spacing = 10;
    
    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (index >= this.flagMonsters.length) break;
        
        const monster = this.flagMonsters[index];
        const x = col * (cardSize + spacing);
        const y = row * (cardSize + spacing);
        
        const card = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, cardSize, cardSize, 0x444444);
        bg.setStrokeStyle(2, 0x666666);
        card.add(bg);
        
        const isCollected = this.collection.some(m => m.id === monster.id);
        
        if (isCollected) {
          const flag = this.add.rectangle(0, -20, 80, 50, 0xffffff);
          flag.setStrokeStyle(2, 0x000000);
          card.add(flag);
          
          const name = this.add.text(0, 40, monster.name, {
            fontSize: '14px',
            fill: '#ffffff'
          }).setOrigin(0.5);
          card.add(name);
          
          bg.setInteractive({ useHandCursor: true });
          bg.on('pointerover', () => {
            bg.setFillStyle(0x666666);
            this.showMonsterInfo(monster);
          });
          bg.on('pointerout', () => {
            bg.setFillStyle(0x444444);
          });
        } else {
          const question = this.add.text(0, 0, '?', {
            fontSize: '48px',
            fill: '#666666'
          }).setOrigin(0.5);
          card.add(question);
          
          const number = this.add.text(0, -45, `No.${index + 1}`, {
            fontSize: '12px',
            fill: '#888888'
          }).setOrigin(0.5);
          card.add(number);
        }
        
        gridContainer.add(card);
        index++;
      }
    }
  }
  
  createInfoPanel() {
    this.infoPanel = this.add.container(860, 320);
    
    const panelBg = this.add.rectangle(0, 0, 350, 500, 0x333333);
    panelBg.setStrokeStyle(3, 0xffffff);
    this.infoPanel.add(panelBg);
    
    this.infoTitle = this.add.text(0, -220, '詳細情報', {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    this.infoPanel.add(this.infoTitle);
    
    this.infoContent = this.add.text(0, 0, '左のモンスターを選択してください', {
      fontSize: '16px',
      fill: '#aaaaaa',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5);
    this.infoPanel.add(this.infoContent);
    
    const stats = this.add.text(width / 2, height - 50, 
      `捕獲数: ${this.collection.length} / ${this.flagMonsters.length}`, {
      fontSize: '20px',
      fill: '#ffdd00'
    }).setOrigin(0.5);
  }
  
  showMonsterInfo(monster) {
    const info = `${monster.name}\\n\\n` +
                `タイプ: ${monster.type}\\n\\n` +
                `HP: ${monster.stats.hp}\\n` +
                `攻撃: ${monster.stats.attack}\\n` +
                `防御: ${monster.stats.defense}\\n` +
                `素早さ: ${monster.stats.speed}\\n\\n` +
                `${monster.description}\\n\\n` +
                `レア度: ${this.getRarityText(monster.rarity)}`;
                
    this.infoContent.setText(info);
  }
  
  getRarityText(rarity) {
    const rarityMap = {
      'common': '★',
      'uncommon': '★★',
      'rare': '★★★',
      'legendary': '★★★★★'
    };
    return rarityMap[rarity] || '★';
  }
}