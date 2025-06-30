export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {
    this.veggieMonsters = data.veggieMonsters || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.createBackground();
    
    const titleContainer = this.add.container(width / 2, height / 4);
    
    const title1 = this.add.text(0, -40, 'VEGGIE', {
      fontSize: '84px',
      fontFamily: 'Arial Black',
      fill: '#228b22',
      stroke: '#ffffff',
      strokeThickness: 10
    }).setOrigin(0.5);
    titleContainer.add(title1);
    
    const title2 = this.add.text(0, 40, 'POKÉMON', {
      fontSize: '84px',
      fontFamily: 'Arial Black',
      fill: '#ff6347',
      stroke: '#ffffff',
      strokeThickness: 10
    }).setOrigin(0.5);
    titleContainer.add(title2);
    
    this.tweens.add({
      targets: titleContainer,
      y: height / 4 + 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const subtitle = this.add.text(width / 2, height / 4 + 120, '野菜モンスターを育てて集めよう！', {
      fontSize: '28px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    const menuItems = [
      { text: '新しい冒険', scene: 'GardenScene', color: '#27ae60' },
      { text: 'コレクション', scene: 'CollectionScene', color: '#3498db' },
      { text: '交換所', scene: 'TradeScene', color: '#e74c3c' },
      { text: '設定', scene: 'SettingsScene', color: '#f39c12' }
    ];
    
    const menuContainer = this.add.container(width / 2, height / 2 + 100);
    
    menuItems.forEach((item, index) => {
      const menuBg = this.add.rectangle(0, index * 70, 400, 60, 0x000000, 0.7);
      menuBg.setStrokeStyle(3, 0xffffff);
      menuContainer.add(menuBg);
      
      const menuIcon = this.add.circle(-150, index * 70, 20, parseInt(item.color.replace('#', '0x')));
      menuContainer.add(menuIcon);
      
      const menuText = this.add.text(0, index * 70, item.text, {
        fontSize: '36px',
        fill: item.color,
        fontFamily: 'Arial'
      }).setOrigin(0.5);
      menuContainer.add(menuText);
      
      menuBg.setInteractive({ useHandCursor: true });
      
      menuBg.on('pointerover', () => {
        menuBg.setFillStyle(0xffffff, 0.3);
        menuText.setScale(1.1);
        menuIcon.setScale(1.2);
      });
      
      menuBg.on('pointerout', () => {
        menuBg.setFillStyle(0x000000, 0.7);
        menuText.setScale(1);
        menuIcon.setScale(1);
      });
      
      menuBg.on('pointerdown', () => {
        if (item.scene === 'GardenScene') {
          this.scene.start('GardenScene', { 
            veggieMonsters: this.veggieMonsters,
            playerData: this.createNewPlayerData()
          });
        } else if (item.scene === 'CollectionScene') {
          this.scene.start('CollectionScene', { 
            veggieMonsters: this.veggieMonsters,
            collection: []
          });
        }
      });
    });
    
    const versionText = this.add.text(width - 10, height - 10, 'v1.0.0', {
      fontSize: '18px',
      fill: '#95a5a6'
    }).setOrigin(1, 1);
    
    this.createFloatingVeggies();
  }
  
  createBackground() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x98fb98, 0x98fb98, 1);
    gradient.fillRect(0, 0, width, height);
  }
  
  createFloatingVeggies() {
    const veggies = ['tomato', 'carrot', 'broccoli', 'corn', 'eggplant', 'potato'];
    
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(50, 974);
      const y = Phaser.Math.Between(500, 700);
      const veggie = this.add.circle(x, y, 25, 0x228b22, 0.3);
      
      this.tweens.add({
        targets: veggie,
        y: y - Phaser.Math.Between(20, 40),
        x: x + Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000)
      });
      
      this.tweens.add({
        targets: veggie,
        rotation: Phaser.Math.Between(0, 6),
        duration: Phaser.Math.Between(5000, 8000),
        repeat: -1
      });
    }
  }
  
  createNewPlayerData() {
    return {
      name: 'ファーマー',
      level: 1,
      experience: 0,
      money: 5000,
      collection: [],
      team: [],
      garden: {
        plots: Array(12).fill(null),
        waterLevel: 100,
        fertilizer: 10
      },
      items: {
        veggieball: 10,
        fertilizer: 5,
        waterCan: 1,
        seeds: {
          tomato: 3,
          carrot: 3,
          corn: 2
        }
      }
    };
  }
}