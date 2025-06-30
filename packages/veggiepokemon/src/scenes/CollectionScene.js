export class CollectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CollectionScene' });
  }

  init(data) {
    this.veggieMonsters = data.veggieMonsters || [];
    this.collection = data.collection || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0xf0f8ff).setOrigin(0);
    
    const title = this.add.text(width / 2, 50, 'ベジモン図鑑', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: '#228b22',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    const backButton = this.add.text(60, 50, '< 戻る', {
      fontSize: '28px',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0, 0.5);
    
    backButton.setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene', { veggieMonsters: this.veggieMonsters });
    });
    
    this.createGrid();
    this.createInfoPanel();
    this.createStatistics();
  }
  
  createGrid() {
    const gridContainer = this.add.container(120, 140);
    const cols = 7;
    const rows = 5;
    const cardSize = 110;
    const spacing = 10;
    
    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (index >= this.veggieMonsters.length) break;
        
        const monster = this.veggieMonsters[index];
        const x = col * (cardSize + spacing);
        const y = row * (cardSize + spacing);
        
        const card = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, cardSize, cardSize, 0xffffff);
        bg.setStrokeStyle(3, 0x228b22);
        card.add(bg);
        
        const isCollected = this.collection.some(m => m.id === monster.id);
        
        if (isCollected) {
          const veggie = this.add.circle(0, -15, 35, this.getMonsterColor(monster));
          veggie.setStrokeStyle(3, 0x000000);
          card.add(veggie);
          
          const name = this.add.text(0, 35, monster.name, {
            fontSize: '14px',
            fill: '#000000',
            fontFamily: 'Arial'
          }).setOrigin(0.5);
          card.add(name);
          
          const typeIcon = this.add.text(40, -40, this.getTypeIcon(monster.type), {
            fontSize: '16px'
          }).setOrigin(0.5);
          card.add(typeIcon);
          
          bg.setInteractive({ useHandCursor: true });
          bg.on('pointerover', () => {
            bg.setFillStyle(0xe0ffe0);
            bg.setScale(1.05);
            this.showMonsterInfo(monster);
          });
          bg.on('pointerout', () => {
            bg.setFillStyle(0xffffff);
            bg.setScale(1);
          });
          bg.on('pointerdown', () => {
            this.showDetailedInfo(monster);
          });
        } else {
          const question = this.add.text(0, 0, '?', {
            fontSize: '64px',
            fill: '#cccccc',
            fontFamily: 'Arial Black'
          }).setOrigin(0.5);
          card.add(question);
          
          const number = this.add.text(0, -45, `No.${index + 1}`, {
            fontSize: '14px',
            fill: '#999999'
          }).setOrigin(0.5);
          card.add(number);
        }
        
        gridContainer.add(card);
        index++;
      }
    }
  }
  
  createInfoPanel() {
    this.infoPanel = this.add.container(920, 400);
    
    const panelBg = this.add.rectangle(0, 0, 380, 600, 0xffffff);
    panelBg.setStrokeStyle(4, 0x228b22);
    this.infoPanel.add(panelBg);
    
    this.infoTitle = this.add.text(0, -280, '詳細情報', {
      fontSize: '28px',
      fill: '#228b22',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);
    this.infoPanel.add(this.infoTitle);
    
    this.infoContent = this.add.text(0, 0, '左のモンスターを選択してください', {
      fontSize: '18px',
      fill: '#666666',
      align: 'center',
      wordWrap: { width: 340 }
    }).setOrigin(0.5);
    this.infoPanel.add(this.infoContent);
  }
  
  createStatistics() {
    const stats = this.add.text(512, 720, 
      `捕獲数: ${this.collection.length} / ${this.veggieMonsters.length}`, {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#228b22',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    const completion = Math.floor((this.collection.length / this.veggieMonsters.length) * 100);
    const progressBar = this.add.graphics();
    progressBar.fillStyle(0xcccccc);
    progressBar.fillRect(312, 680, 400, 20);
    progressBar.fillStyle(0x228b22);
    progressBar.fillRect(312, 680, 400 * (completion / 100), 20);
  }
  
  showMonsterInfo(monster) {
    const info = `${monster.name}\\n\\n` +
                `タイプ: ${monster.type}\\n` +
                `属性: ${monster.element}\\n` +
                `進化段階: ${monster.stage}\\n\\n` +
                `HP: ${monster.stats.hp}\\n` +
                `攻撃: ${monster.stats.attack}\\n` +
                `防御: ${monster.stats.defense}\\n` +
                `素早さ: ${monster.stats.speed}\\n` +
                `特殊: ${monster.stats.special}\\n\\n` +
                `${monster.description}\\n\\n` +
                `レア度: ${this.getRarityText(monster.rarity)}\\n` +
                `成長時間: ${monster.growthTime}秒`;
                
    this.infoContent.setText(info);
  }
  
  showDetailedInfo(monster) {
    const detailPanel = this.add.container(512, 384);
    
    const bg = this.add.rectangle(0, 0, 700, 500, 0x000000, 0.9);
    bg.setStrokeStyle(5, 0xffffff);
    detailPanel.add(bg);
    
    const closeButton = this.add.text(320, -220, 'X', {
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#ff0000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    closeButton.setInteractive({ useHandCursor: true });
    closeButton.on('pointerdown', () => detailPanel.destroy());
    detailPanel.add(closeButton);
    
    const monsterSprite = this.add.circle(-200, -100, 60, this.getMonsterColor(monster));
    monsterSprite.setStrokeStyle(5, 0xffffff);
    detailPanel.add(monsterSprite);
    
    const nameText = this.add.text(-200, -20, monster.name, {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);
    detailPanel.add(nameText);
    
    const movesTitle = this.add.text(100, -180, '技リスト', {
      fontSize: '24px',
      fill: '#ffff00'
    }).setOrigin(0.5);
    detailPanel.add(movesTitle);
    
    monster.moves.forEach((move, index) => {
      const moveText = this.add.text(100, -120 + index * 30, `・${move}`, {
        fontSize: '20px',
        fill: '#ffffff'
      }).setOrigin(0.5);
      detailPanel.add(moveText);
    });
    
    const evolutionInfo = this.add.text(0, 100, 
      monster.evolvesTo ? `進化先: ${monster.evolvesTo}` : '最終進化形態', {
      fontSize: '22px',
      fill: '#00ff00'
    }).setOrigin(0.5);
    detailPanel.add(evolutionInfo);
    
    const flavorText = this.add.text(0, 180, monster.description, {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);
    detailPanel.add(flavorText);
  }
  
  getMonsterColor(monster) {
    const elementColors = {
      'Sun': 0xffd700,
      'Water': 0x4169e1,
      'Earth': 0x8b4513,
      'Wind': 0x87ceeb
    };
    const typeColors = {
      'Fruit': 0xff6347,
      'Root': 0xdaa520,
      'Leaf': 0x228b22,
      'Seed': 0xffa500,
      'Flower': 0xff69b4,
      'Stem': 0x32cd32,
      'Bulb': 0xdda0dd,
      'Fungi': 0x8b7355
    };
    return elementColors[monster.element] || typeColors[monster.type] || 0x228b22;
  }
  
  getTypeIcon(type) {
    const icons = {
      'Fruit': '🍎',
      'Root': '🥕',
      'Leaf': '🌿',
      'Seed': '🌰',
      'Flower': '🌸',
      'Stem': '🌱',
      'Bulb': '🧅',
      'Fungi': '🍄'
    };
    return icons[type] || '🌾';
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