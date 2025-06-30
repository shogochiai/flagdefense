export class GardenScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GardenScene' });
  }

  init(data) {
    this.veggieMonsters = data.veggieMonsters || [];
    this.playerData = data.playerData || {};
  }

  create() {
    this.createBackground();
    this.createGarden();
    this.createPlayer();
    this.createUI();
    this.setupControls();
    this.setupTimers();
  }
  
  createBackground() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height * 0.6, 0x87ceeb).setOrigin(0);
    this.add.rectangle(0, height * 0.6, width, height * 0.4, 0x8fbc8f).setOrigin(0);
    
    for (let i = 0; i < 3; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(100, 900),
        Phaser.Math.Between(50, 150),
        Phaser.Math.Between(100, 150),
        Phaser.Math.Between(50, 70),
        0xffffff,
        0.8
      );
      
      this.tweens.add({
        targets: cloud,
        x: cloud.x + 200,
        duration: Phaser.Math.Between(30000, 50000),
        repeat: -1
      });
    }
  }
  
  createGarden() {
    this.plots = [];
    const plotSize = 120;
    const startX = 200;
    const startY = 350;
    const cols = 4;
    const rows = 3;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const x = startX + col * (plotSize + 20);
        const y = startY + row * (plotSize + 20);
        
        const plot = this.add.container(x, y);
        
        const soil = this.add.rectangle(0, 0, plotSize, plotSize, 0x8b4513);
        soil.setStrokeStyle(3, 0x654321);
        plot.add(soil);
        
        const plotText = this.add.text(0, 0, '', {
          fontSize: '16px',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5);
        plot.add(plotText);
        
        soil.setInteractive({ useHandCursor: true });
        soil.on('pointerdown', () => this.interactWithPlot(index));
        soil.on('pointerover', () => {
          soil.setFillStyle(0xa0522d);
          this.showPlotInfo(index);
        });
        soil.on('pointerout', () => {
          soil.setFillStyle(0x8b4513);
        });
        
        plot.soil = soil;
        plot.plotText = plotText;
        plot.plant = null;
        plot.growth = 0;
        plot.watered = false;
        
        this.plots.push(plot);
      }
    }
  }
  
  createPlayer() {
    this.player = this.physics.add.sprite(100, 400, null);
    this.player.setSize(32, 48);
    this.player.displayWidth = 40;
    this.player.displayHeight = 60;
    
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x228b22);
    playerGraphics.fillCircle(0, -20, 15);
    playerGraphics.fillStyle(0x8b4513);
    playerGraphics.fillRect(-15, -5, 30, 30);
    this.player.add(playerGraphics);
    
    this.player.setCollideWorldBounds(true);
  }
  
  createUI() {
    const uiContainer = this.add.container(10, 10);
    
    const uiBg = this.add.rectangle(0, 0, 350, 200, 0x000000, 0.7);
    uiBg.setOrigin(0);
    uiContainer.add(uiBg);
    
    this.moneyText = this.add.text(10, 10, `お金: ¥${this.playerData.money}`, {
      fontSize: '20px',
      fill: '#ffffff'
    });
    uiContainer.add(this.moneyText);
    
    this.seedsText = this.add.text(10, 40, this.getSeedsText(), {
      fontSize: '18px',
      fill: '#ffffff'
    });
    uiContainer.add(this.seedsText);
    
    this.waterText = this.add.text(10, 100, `水: ${this.playerData.garden.waterLevel}%`, {
      fontSize: '18px',
      fill: '#87ceeb'
    });
    uiContainer.add(this.waterText);
    
    this.fertilizerText = this.add.text(10, 130, `肥料: ${this.playerData.items.fertilizer}`, {
      fontSize: '18px',
      fill: '#8b4513'
    });
    uiContainer.add(this.fertilizerText);
    
    this.veggieballText = this.add.text(10, 160, `ベジボール: ${this.playerData.items.veggieball}`, {
      fontSize: '18px',
      fill: '#ff6347'
    });
    uiContainer.add(this.veggieballText);
    
    const menuButton = this.add.text(924, 10, 'メニュー', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 15, y: 8 }
    });
    menuButton.setInteractive({ useHandCursor: true });
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene', { veggieMonsters: this.veggieMonsters });
    });
    
    this.actionMenu = this.createActionMenu();
    this.plotInfoPanel = this.createPlotInfoPanel();
  }
  
  createActionMenu() {
    const menu = this.add.container(512, 600);
    menu.setVisible(false);
    
    const bg = this.add.rectangle(0, 0, 600, 150, 0x000000, 0.9);
    bg.setStrokeStyle(3, 0xffffff);
    menu.add(bg);
    
    const actions = [
      { text: '種をまく', action: 'plant', x: -200 },
      { text: '水をやる', action: 'water', x: -67 },
      { text: '肥料をやる', action: 'fertilize', x: 67 },
      { text: '収穫する', action: 'harvest', x: 200 }
    ];
    
    actions.forEach(action => {
      const button = this.add.text(action.x, 0, action.text, {
        fontSize: '24px',
        fill: '#ffffff',
        backgroundColor: '#228b22',
        padding: { x: 15, y: 10 }
      }).setOrigin(0.5);
      
      button.setInteractive({ useHandCursor: true });
      button.on('pointerover', () => button.setBackgroundColor('#27ae60'));
      button.on('pointerout', () => button.setBackgroundColor('#228b22'));
      button.on('pointerdown', () => this.performAction(action.action));
      
      menu.add(button);
      menu[action.action + 'Button'] = button;
    });
    
    return menu;
  }
  
  createPlotInfoPanel() {
    const panel = this.add.container(800, 300);
    panel.setVisible(false);
    
    const bg = this.add.rectangle(0, 0, 300, 200, 0x000000, 0.8);
    bg.setStrokeStyle(2, 0xffffff);
    panel.add(bg);
    
    const title = this.add.text(0, -80, '畑の情報', {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    panel.add(title);
    
    const info = this.add.text(0, 0, '', {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    panel.add(info);
    
    panel.infoText = info;
    return panel;
  }
  
  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    this.spaceKey = this.input.keyboard.addKey('SPACE');
  }
  
  setupTimers() {
    this.time.addEvent({
      delay: 5000,
      callback: this.updatePlants,
      callbackScope: this,
      loop: true
    });
    
    this.time.addEvent({
      delay: 10000,
      callback: this.decreaseWater,
      callbackScope: this,
      loop: true
    });
    
    this.time.addEvent({
      delay: 30000,
      callback: this.randomEncounter,
      callbackScope: this,
      loop: true
    });
  }
  
  update() {
    const speed = 200;
    
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }
    
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }
  }
  
  interactWithPlot(index) {
    this.currentPlotIndex = index;
    const plot = this.plots[index];
    
    this.actionMenu.setVisible(true);
    
    this.actionMenu.plantButton.setVisible(!plot.plant);
    this.actionMenu.waterButton.setVisible(plot.plant && !plot.watered);
    this.actionMenu.fertilizeButton.setVisible(plot.plant && plot.growth < 100);
    this.actionMenu.harvestButton.setVisible(plot.plant && plot.growth >= 100);
  }
  
  performAction(action) {
    const plot = this.plots[this.currentPlotIndex];
    
    switch (action) {
      case 'plant':
        this.plantSeed(plot);
        break;
      case 'water':
        this.waterPlant(plot);
        break;
      case 'fertilize':
        this.fertilizePlant(plot);
        break;
      case 'harvest':
        this.harvestPlant(plot);
        break;
    }
    
    this.actionMenu.setVisible(false);
    this.updateUI();
  }
  
  plantSeed(plot) {
    const availableSeeds = Object.keys(this.playerData.items.seeds).filter(
      seed => this.playerData.items.seeds[seed] > 0
    );
    
    if (availableSeeds.length === 0) {
      this.showMessage('種がありません！');
      return;
    }
    
    const seedType = Phaser.Utils.Array.GetRandom(availableSeeds);
    this.playerData.items.seeds[seedType]--;
    
    const monster = this.veggieMonsters.find(m => m.id === seedType);
    plot.plant = monster;
    plot.growth = 0;
    plot.watered = false;
    
    const plantGraphic = this.add.circle(0, 0, 20, parseInt(monster.element === 'Sun' ? '0xffff00' : '0x228b22'));
    plot.add(plantGraphic);
    plot.plantGraphic = plantGraphic;
    
    this.showMessage(`${monster.name}の種を植えました！`);
  }
  
  waterPlant(plot) {
    if (this.playerData.garden.waterLevel < 10) {
      this.showMessage('水が足りません！');
      return;
    }
    
    this.playerData.garden.waterLevel -= 10;
    plot.watered = true;
    plot.soil.setFillStyle(0x654321);
    
    this.showMessage('水をあげました！');
  }
  
  fertilizePlant(plot) {
    if (this.playerData.items.fertilizer <= 0) {
      this.showMessage('肥料がありません！');
      return;
    }
    
    this.playerData.items.fertilizer--;
    plot.growth = Math.min(100, plot.growth + 30);
    
    this.updatePlantVisual(plot);
    this.showMessage('肥料をあげました！成長が早まります！');
  }
  
  harvestPlant(plot) {
    const monster = plot.plant;
    
    if (Math.random() < 0.7) {
      this.playerData.collection.push(monster);
      if (this.playerData.team.length < 6) {
        this.playerData.team.push(monster);
      }
      this.showMessage(`${monster.name}を収穫しました！`);
    } else {
      this.showMessage(`野生の${monster.name}が現れた！`);
      this.scene.start('BattleScene', {
        veggieMonsters: this.veggieMonsters,
        playerData: this.playerData,
        wildMonster: monster,
        fromGarden: true
      });
    }
    
    plot.plant = null;
    plot.growth = 0;
    plot.watered = false;
    if (plot.plantGraphic) {
      plot.plantGraphic.destroy();
      plot.plantGraphic = null;
    }
    plot.plotText.setText('');
    plot.soil.setFillStyle(0x8b4513);
  }
  
  updatePlants() {
    this.plots.forEach(plot => {
      if (plot.plant && plot.watered && plot.growth < 100) {
        plot.growth += 10;
        plot.watered = false;
        plot.soil.setFillStyle(0x8b4513);
        this.updatePlantVisual(plot);
      }
    });
  }
  
  updatePlantVisual(plot) {
    if (plot.plantGraphic) {
      const scale = 0.5 + (plot.growth / 100) * 1;
      plot.plantGraphic.setScale(scale);
      
      if (plot.growth >= 100) {
        plot.plotText.setText('収穫可能！');
        plot.plantGraphic.setStrokeStyle(3, 0xffff00);
      } else {
        plot.plotText.setText(`${plot.growth}%`);
      }
    }
  }
  
  decreaseWater() {
    this.playerData.garden.waterLevel = Math.max(0, this.playerData.garden.waterLevel - 5);
    this.updateUI();
  }
  
  randomEncounter() {
    if (Math.random() < 0.1) {
      const wildMonster = Phaser.Utils.Array.GetRandom(this.veggieMonsters);
      this.showMessage(`野生の${wildMonster.name}が畑に現れた！`);
      
      this.time.delayedCall(1500, () => {
        this.scene.start('BattleScene', {
          veggieMonsters: this.veggieMonsters,
          playerData: this.playerData,
          wildMonster: wildMonster,
          fromGarden: true
        });
      });
    }
  }
  
  showPlotInfo(index) {
    const plot = this.plots[index];
    let infoText = '空き地';
    
    if (plot.plant) {
      infoText = `${plot.plant.name}\\n成長度: ${plot.growth}%\\n`;
      infoText += plot.watered ? '水やり済み' : '水やりが必要';
    }
    
    this.plotInfoPanel.infoText.setText(infoText);
    this.plotInfoPanel.setVisible(true);
  }
  
  showMessage(text) {
    const message = this.add.text(512, 300, text, {
      fontSize: '32px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: message,
      y: 250,
      alpha: 0,
      duration: 2000,
      onComplete: () => message.destroy()
    });
  }
  
  getSeedsText() {
    const seeds = this.playerData.items.seeds;
    return `種: トマト×${seeds.tomato || 0} 人参×${seeds.carrot || 0} コーン×${seeds.corn || 0}`;
  }
  
  updateUI() {
    this.moneyText.setText(`お金: ¥${this.playerData.money}`);
    this.seedsText.setText(this.getSeedsText());
    this.waterText.setText(`水: ${this.playerData.garden.waterLevel}%`);
    this.fertilizerText.setText(`肥料: ${this.playerData.items.fertilizer}`);
    this.veggieballText.setText(`ベジボール: ${this.playerData.items.veggieball}`);
  }
}