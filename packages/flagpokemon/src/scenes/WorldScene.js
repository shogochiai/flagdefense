export class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data) {
    this.flagMonsters = data.flagMonsters || [];
    this.playerData = data.playerData || {};
  }

  create() {
    this.createWorld();
    this.createPlayer();
    this.createUI();
    this.setupControls();
    this.setupEncounters();
  }
  
  createWorld() {
    const mapWidth = 30;
    const mapHeight = 20;
    const tileSize = 32;
    
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const tile = this.add.rectangle(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          tileSize,
          tileSize,
          this.getTileColor(x, y)
        );
        tile.setStrokeStyle(1, 0x333333);
      }
    }
    
    this.grassAreas = [];
    for (let i = 0; i < 5; i++) {
      const grassArea = this.add.rectangle(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 500),
        Phaser.Math.Between(100, 200),
        Phaser.Math.Between(100, 200),
        0x4a7c59,
        0.5
      );
      this.physics.add.existing(grassArea, true);
      this.grassAreas.push(grassArea);
    }
  }
  
  getTileColor(x, y) {
    const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1);
    if (noise > 0.3) return 0x4a7c59;
    if (noise > 0) return 0x8fbc8f;
    if (noise > -0.3) return 0x87ceeb;
    return 0x4682b4;
  }
  
  createPlayer() {
    this.player = this.physics.add.sprite(480, 320, null);
    this.player.setSize(24, 24);
    this.player.displayWidth = 32;
    this.player.displayHeight = 48;
    
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0xff0000);
    playerGraphics.fillCircle(0, -12, 12);
    playerGraphics.fillStyle(0xffffff);
    playerGraphics.fillCircle(0, 0, 8);
    this.player.add(playerGraphics);
    
    this.player.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);
  }
  
  createUI() {
    const uiContainer = this.add.container(10, 10);
    uiContainer.setScrollFactor(0);
    
    const uiBg = this.add.rectangle(0, 0, 300, 100, 0x000000, 0.7);
    uiBg.setOrigin(0);
    uiContainer.add(uiBg);
    
    this.moneyText = this.add.text(10, 10, `お金: ¥${this.playerData.money}`, {
      fontSize: '18px',
      fill: '#ffffff'
    });
    uiContainer.add(this.moneyText);
    
    this.pokeballText = this.add.text(10, 35, `モンスターボール: ${this.playerData.items.pokeball}`, {
      fontSize: '18px',
      fill: '#ffffff'
    });
    uiContainer.add(this.pokeballText);
    
    this.teamText = this.add.text(10, 60, `チーム: ${this.playerData.team.length}/6`, {
      fontSize: '18px',
      fill: '#ffffff'
    });
    uiContainer.add(this.teamText);
    
    const menuButton = this.add.text(860, 10, 'メニュー', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 10, y: 5 }
    });
    menuButton.setScrollFactor(0);
    menuButton.setInteractive({ useHandCursor: true });
    
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene', { flagMonsters: this.flagMonsters });
    });
  }
  
  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
  }
  
  setupEncounters() {
    this.time.addEvent({
      delay: 100,
      callback: this.checkEncounter,
      callbackScope: this,
      loop: true
    });
  }
  
  update() {
    const speed = 160;
    
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
  
  checkEncounter() {
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      return;
    }
    
    for (const grassArea of this.grassAreas) {
      if (Phaser.Geom.Rectangle.Contains(grassArea.getBounds(), this.player.x, this.player.y)) {
        if (Math.random() < 0.02) {
          this.startEncounter();
          break;
        }
      }
    }
  }
  
  startEncounter() {
    const randomMonster = Phaser.Utils.Array.GetRandom(this.flagMonsters);
    
    this.cameras.main.flash(500);
    this.time.delayedCall(500, () => {
      this.scene.start('BattleScene', {
        flagMonsters: this.flagMonsters,
        playerData: this.playerData,
        wildMonster: randomMonster
      });
    });
  }
}