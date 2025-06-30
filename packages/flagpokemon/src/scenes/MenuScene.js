export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {
    this.flagMonsters = data.flagMonsters || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    gradient.fillRect(0, 0, width, height);
    
    const title = this.add.text(width / 2, height / 4, 'FLAG POKÉMON', {
      fontSize: '72px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: title,
      y: height / 4 + 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const subtitle = this.add.text(width / 2, height / 4 + 80, '国旗モンスターを集めよう！', {
      fontSize: '24px',
      fill: '#ffdd00'
    }).setOrigin(0.5);
    
    const menuItems = [
      { text: '新しい冒険', scene: 'WorldScene' },
      { text: 'コレクション', scene: 'CollectionScene' },
      { text: '設定', scene: 'SettingsScene' }
    ];
    
    const menuContainer = this.add.container(width / 2, height / 2 + 50);
    
    menuItems.forEach((item, index) => {
      const menuBg = this.add.rectangle(0, index * 70, 300, 50, 0x333333);
      menuBg.setStrokeStyle(2, 0xffffff);
      menuContainer.add(menuBg);
      
      const menuText = this.add.text(0, index * 70, item.text, {
        fontSize: '28px',
        fill: '#ffffff'
      }).setOrigin(0.5);
      menuContainer.add(menuText);
      
      menuBg.setInteractive({ useHandCursor: true });
      
      menuBg.on('pointerover', () => {
        menuBg.setFillStyle(0x555555);
        menuText.setScale(1.1);
      });
      
      menuBg.on('pointerout', () => {
        menuBg.setFillStyle(0x333333);
        menuText.setScale(1);
      });
      
      menuBg.on('pointerdown', () => {
        if (item.scene === 'WorldScene') {
          this.scene.start('WorldScene', { 
            flagMonsters: this.flagMonsters,
            playerData: this.createNewPlayerData()
          });
        } else if (item.scene === 'CollectionScene') {
          this.scene.start('CollectionScene', { 
            flagMonsters: this.flagMonsters,
            collection: []
          });
        }
      });
    });
    
    const versionText = this.add.text(width - 10, height - 10, 'v1.0.0', {
      fontSize: '16px',
      fill: '#666666'
    }).setOrigin(1, 1);
  }
  
  createNewPlayerData() {
    return {
      name: 'トレーナー',
      badges: 0,
      money: 3000,
      collection: [],
      team: [],
      items: {
        pokeball: 10,
        potion: 5,
        superPotion: 2
      }
    };
  }
}