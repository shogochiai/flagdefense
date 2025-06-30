export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {
    this.veggieCharacters = data.veggieCharacters || [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);
    
    this.createVeggieAnimation();
    
    const title1 = this.add.text(width / 2, height / 3 - 40, 'VEGGIE', {
      fontSize: '96px',
      fontFamily: 'Arial Black',
      fill: '#27ae60',
      stroke: '#ffffff',
      strokeThickness: 10
    }).setOrigin(0.5);
    
    const title2 = this.add.text(width / 2, height / 3 + 40, '2D FIGHT', {
      fontSize: '96px',
      fontFamily: 'Arial Black',
      fill: '#e74c3c',
      stroke: '#ffffff',
      strokeThickness: 10
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: [title1, title2],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const menuItems = [
      { text: 'BATTLE MODE', scene: 'CharacterSelectScene', color: '#e74c3c' },
      { text: 'TRAINING', scene: 'TrainingScene', color: '#f39c12' },
      { text: 'GALLERY', scene: 'GalleryScene', color: '#27ae60' },
      { text: 'OPTIONS', scene: 'OptionsScene', color: '#3498db' }
    ];
    
    menuItems.forEach((item, index) => {
      const menuY = height / 2 + 100 + index * 60;
      const menuContainer = this.add.container(width / 2, menuY);
      
      const menuBg = this.add.rectangle(0, 0, 400, 50, 0x34495e);
      menuBg.setStrokeStyle(3, 0xffffff);
      menuContainer.add(menuBg);
      
      const menuText = this.add.text(0, 0, item.text, {
        fontSize: '32px',
        fontFamily: 'Arial',
        fill: item.color
      }).setOrigin(0.5);
      menuContainer.add(menuText);
      
      menuBg.setInteractive({ useHandCursor: true });
      
      menuBg.on('pointerover', () => {
        menuBg.setFillStyle(0x4a5f7a);
        menuText.setScale(1.1);
        this.tweens.add({
          targets: menuContainer,
          x: width / 2 + 10,
          duration: 100
        });
      });
      
      menuBg.on('pointerout', () => {
        menuBg.setFillStyle(0x34495e);
        menuText.setScale(1);
        this.tweens.add({
          targets: menuContainer,
          x: width / 2,
          duration: 100
        });
      });
      
      menuBg.on('pointerdown', () => {
        if (item.scene === 'CharacterSelectScene') {
          this.scene.start('CharacterSelectScene', { veggieCharacters: this.veggieCharacters });
        }
      });
    });
    
    const copyrightText = this.add.text(width / 2, height - 30, '© 2024 Veggie Fight Productions', {
      fontSize: '18px',
      fill: '#95a5a6'
    }).setOrigin(0.5);
  }
  
  createVeggieAnimation() {
    const veggies = ['tomato', 'carrot', 'broccoli', 'corn', 'eggplant'];
    
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = Phaser.Math.Between(50, 150);
      const veggie = this.add.circle(x, y, 20, 0x27ae60, 0.3);
      
      this.tweens.add({
        targets: veggie,
        y: y + Phaser.Math.Between(20, 40),
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
}