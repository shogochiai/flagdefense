export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data) {
    this.veggieMonsters = data.veggieMonsters || [];
    this.playerData = data.playerData || {};
    this.wildMonster = data.wildMonster;
    this.fromGarden = data.fromGarden || false;
    this.playerMonster = this.playerData.team[0] || this.createStarterMonster();
  }

  create() {
    this.createBackground();
    this.createBattleUI();
    this.createMonsters();
    this.createActionMenu();
    this.startBattle();
  }
  
  createBackground() {
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xffd700, 0xffd700, 1);
    gradient.fillRect(0, 0, 1024, 450);
    
    gradient.fillStyle(0x90ee90);
    gradient.fillRect(0, 450, 1024, 318);
    
    this.add.ellipse(750, 500, 350, 120, 0x7cfc00);
    this.add.ellipse(274, 500, 350, 120, 0x7cfc00);
    
    for (let i = 0; i < 5; i++) {
      const flower = this.add.circle(
        Phaser.Math.Between(50, 974),
        Phaser.Math.Between(480, 600),
        Phaser.Math.Between(10, 20),
        Phaser.Math.Between(0xff69b4, 0xffff00),
        0.7
      );
    }
  }
  
  createBattleUI() {
    this.wildHealthBar = this.createHealthBar(60, 60, this.wildMonster.name, false);
    this.playerHealthBar = this.createHealthBar(564, 280, this.playerMonster.name, true);
    
    this.messageBox = this.add.rectangle(512, 640, 960, 200, 0x000000);
    this.messageBox.setStrokeStyle(5, 0xffffff);
    
    this.messageText = this.add.text(512, 640, '', {
      fontSize: '28px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 920 }
    }).setOrigin(0.5);
  }
  
  createHealthBar(x, y, name, showExp) {
    const container = this.add.container(x, y);
    
    const bgPanel = this.add.rectangle(0, 0, 420, 140, 0xf5f5f5);
    bgPanel.setStrokeStyle(4, 0x000000);
    bgPanel.setOrigin(0);
    container.add(bgPanel);
    
    const nameText = this.add.text(15, 15, name, {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#000000'
    });
    container.add(nameText);
    
    const levelText = this.add.text(380, 15, 'Lv.5', {
      fontSize: '20px',
      fill: '#000000'
    });
    levelText.setOrigin(1, 0);
    container.add(levelText);
    
    const hpLabel = this.add.text(15, 50, 'HP', {
      fontSize: '18px',
      fill: '#000000'
    });
    container.add(hpLabel);
    
    const hpBarBg = this.add.rectangle(60, 58, 320, 24, 0x555555);
    hpBarBg.setOrigin(0, 0.5);
    container.add(hpBarBg);
    
    const hpBarFill = this.add.rectangle(62, 58, 316, 20, 0x00ff00);
    hpBarFill.setOrigin(0, 0.5);
    container.add(hpBarFill);
    
    if (showExp) {
      const expBarBg = this.add.rectangle(60, 90, 320, 12, 0x333333);
      expBarBg.setOrigin(0, 0.5);
      container.add(expBarBg);
      
      const expBarFill = this.add.rectangle(62, 90, 150, 8, 0x0099ff);
      expBarFill.setOrigin(0, 0.5);
      container.add(expBarFill);
      
      const hpText = this.add.text(200, 110, `${this.playerMonster.stats.hp}/${this.playerMonster.stats.hp}`, {
        fontSize: '18px',
        fill: '#000000'
      }).setOrigin(0.5);
      container.add(hpText);
      
      container.expBar = expBarFill;
      container.hpText = hpText;
    }
    
    container.hpBar = hpBarFill;
    container.maxHp = showExp ? this.playerMonster.stats.hp : this.wildMonster.stats.hp;
    container.currentHp = container.maxHp;
    
    return container;
  }
  
  createMonsters() {
    this.wildMonsterSprite = this.createMonsterSprite(750, 250, this.wildMonster, false);
    this.playerMonsterSprite = this.createMonsterSprite(274, 400, this.playerMonster, true);
  }
  
  createMonsterSprite(x, y, monster, isPlayer) {
    const container = this.add.container(x, y);
    
    const size = isPlayer ? 100 : 80;
    const veggie = this.add.circle(0, 0, size, this.getMonsterColor(monster));
    veggie.setStrokeStyle(5, 0xffffff);
    container.add(veggie);
    
    const eyes = this.add.container(0, -size/3);
    const eyeSize = size / 10;
    const leftEye = this.add.circle(-size/3, 0, eyeSize * 2, 0xffffff);
    const rightEye = this.add.circle(size/3, 0, eyeSize * 2, 0xffffff);
    const leftPupil = this.add.circle(-size/3, 0, eyeSize, 0x000000);
    const rightPupil = this.add.circle(size/3, 0, eyeSize, 0x000000);
    eyes.add([leftEye, rightEye, leftPupil, rightPupil]);
    container.add(eyes);
    
    if (monster.type === 'Leaf') {
      const leaf = this.add.ellipse(0, -size * 1.2, size * 0.6, size * 0.3, 0x228b22);
      container.add(leaf);
    } else if (monster.type === 'Root') {
      const roots = this.add.graphics();
      roots.lineStyle(4, 0x8b4513);
      for (let i = -2; i <= 2; i++) {
        roots.moveTo(i * size/5, size/2);
        roots.lineTo(i * size/4, size);
      }
      roots.strokePath();
      container.add(roots);
    }
    
    const nameTag = this.add.text(0, size + 30, monster.name, {
      fontSize: '20px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    container.add(nameTag);
    
    container.setScale(isPlayer ? 1 : 0.8);
    return container;
  }
  
  getMonsterColor(monster) {
    const elementColors = {
      'Sun': 0xffd700,
      'Water': 0x4169e1,
      'Earth': 0x8b4513,
      'Wind': 0x87ceeb
    };
    return elementColors[monster.element] || 0x228b22;
  }
  
  createActionMenu() {
    this.actionMenu = this.add.container(768, 580);
    
    const menuBg = this.add.rectangle(0, 0, 480, 240, 0xffffff);
    menuBg.setStrokeStyle(4, 0x000000);
    this.actionMenu.add(menuBg);
    
    const actions = [
      { text: 'たたかう', x: -120, y: -60, action: 'fight' },
      { text: 'つかまえる', x: 120, y: -60, action: 'catch' },
      { text: 'アイテム', x: -120, y: 60, action: 'item' },
      { text: 'にげる', x: 120, y: 60, action: 'run' }
    ];
    
    actions.forEach(action => {
      const button = this.add.text(action.x, action.y, action.text, {
        fontSize: '28px',
        fill: '#000000',
        backgroundColor: '#eeeeee',
        padding: { x: 25, y: 15 }
      }).setOrigin(0.5);
      
      button.setInteractive({ useHandCursor: true });
      button.on('pointerover', () => button.setBackgroundColor('#ffff00'));
      button.on('pointerout', () => button.setBackgroundColor('#eeeeee'));
      button.on('pointerdown', () => this.handleAction(action.action));
      
      this.actionMenu.add(button);
    });
    
    this.actionMenu.setVisible(false);
    
    this.moveMenu = this.createMoveMenu();
  }
  
  createMoveMenu() {
    const menu = this.add.container(768, 580);
    menu.setVisible(false);
    
    const menuBg = this.add.rectangle(0, 0, 480, 240, 0xffffff);
    menuBg.setStrokeStyle(4, 0x000000);
    menu.add(menuBg);
    
    const backButton = this.add.text(-200, -90, '< 戻る', {
      fontSize: '20px',
      fill: '#666666'
    });
    backButton.setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      menu.setVisible(false);
      this.actionMenu.setVisible(true);
    });
    menu.add(backButton);
    
    this.playerMonster.moves.forEach((move, index) => {
      const x = (index % 2) * 240 - 120;
      const y = Math.floor(index / 2) * 60 - 30;
      
      const moveButton = this.add.text(x, y, move, {
        fontSize: '24px',
        fill: '#000000',
        backgroundColor: '#e0e0e0',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5);
      
      moveButton.setInteractive({ useHandCursor: true });
      moveButton.on('pointerover', () => moveButton.setBackgroundColor('#ffff00'));
      moveButton.on('pointerout', () => moveButton.setBackgroundColor('#e0e0e0'));
      moveButton.on('pointerdown', () => this.playerAttack(move));
      
      menu.add(moveButton);
    });
    
    return menu;
  }
  
  startBattle() {
    this.showMessage(`野生の ${this.wildMonster.name} が現れた！`);
    this.time.delayedCall(2500, () => {
      this.showMessage(`ゆけっ！ ${this.playerMonster.name}！`);
      this.time.delayedCall(2500, () => {
        this.actionMenu.setVisible(true);
        this.showMessage('どうする？');
      });
    });
  }
  
  handleAction(action) {
    this.actionMenu.setVisible(false);
    
    switch (action) {
      case 'fight':
        this.moveMenu.setVisible(true);
        break;
      case 'catch':
        this.attemptCatch();
        break;
      case 'run':
        this.runAway();
        break;
      case 'item':
        this.showMessage('アイテムがありません！');
        this.time.delayedCall(2000, () => {
          this.actionMenu.setVisible(true);
        });
        break;
    }
  }
  
  playerAttack(moveName) {
    this.moveMenu.setVisible(false);
    
    const damage = Math.floor(this.playerMonster.stats.attack * (0.8 + Math.random() * 0.4));
    this.wildHealthBar.currentHp = Math.max(0, this.wildHealthBar.currentHp - damage);
    
    this.showMessage(`${this.playerMonster.name} の ${moveName}！`);
    this.animateAttack(this.playerMonsterSprite, this.wildMonsterSprite);
    
    this.time.delayedCall(1500, () => {
      this.updateHealthBar(this.wildHealthBar);
      this.showMessage(`${this.wildMonster.name} に ${damage} のダメージ！`);
      
      if (this.wildHealthBar.currentHp <= 0) {
        this.time.delayedCall(2000, () => {
          this.victory();
        });
      } else {
        this.time.delayedCall(2000, () => {
          this.enemyAttack();
        });
      }
    });
  }
  
  enemyAttack() {
    const moveName = Phaser.Utils.Array.GetRandom(this.wildMonster.moves);
    const damage = Math.floor(this.wildMonster.stats.attack * (0.8 + Math.random() * 0.4));
    this.playerHealthBar.currentHp = Math.max(0, this.playerHealthBar.currentHp - damage);
    
    this.showMessage(`${this.wildMonster.name} の ${moveName}！`);
    this.animateAttack(this.wildMonsterSprite, this.playerMonsterSprite);
    
    this.time.delayedCall(1500, () => {
      this.updateHealthBar(this.playerHealthBar);
      this.showMessage(`${this.playerMonster.name} に ${damage} のダメージ！`);
      
      if (this.playerHealthBar.currentHp <= 0) {
        this.time.delayedCall(2000, () => {
          this.defeat();
        });
      } else {
        this.time.delayedCall(2000, () => {
          this.actionMenu.setVisible(true);
          this.showMessage('どうする？');
        });
      }
    });
  }
  
  attemptCatch() {
    if (this.playerData.items.veggieball <= 0) {
      this.showMessage('ベジボールがない！');
      this.time.delayedCall(2000, () => {
        this.actionMenu.setVisible(true);
      });
      return;
    }
    
    this.playerData.items.veggieball--;
    this.showMessage(`ベジボールを投げた！`);
    
    const catchRate = (1 - this.wildHealthBar.currentHp / this.wildHealthBar.maxHp) * 0.5 + 0.3;
    
    const ball = this.add.circle(274, 400, 20, 0xff6347);
    ball.setStrokeStyle(3, 0xffffff);
    
    this.tweens.add({
      targets: ball,
      x: this.wildMonsterSprite.x,
      y: this.wildMonsterSprite.y,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        ball.destroy();
        this.wildMonsterSprite.setVisible(false);
        
        const shakeCount = 3;
        let shakes = 0;
        
        const shakeBall = this.add.circle(this.wildMonsterSprite.x, this.wildMonsterSprite.y, 25, 0xff6347);
        shakeBall.setStrokeStyle(4, 0xffffff);
        
        const shakeTimer = this.time.addEvent({
          delay: 1000,
          callback: () => {
            shakes++;
            this.tweens.add({
              targets: shakeBall,
              rotation: Phaser.Math.Between(-0.5, 0.5),
              duration: 200,
              yoyo: true,
              repeat: 2
            });
            
            if (shakes >= shakeCount) {
              shakeTimer.remove();
              
              if (Math.random() < catchRate) {
                this.showMessage(`やった！ ${this.wildMonster.name} を捕まえた！`);
                this.playerData.collection.push(this.wildMonster);
                if (this.playerData.team.length < 6) {
                  this.playerData.team.push(this.wildMonster);
                }
                shakeBall.setFillStyle(0x00ff00);
                this.time.delayedCall(3000, () => {
                  this.returnToGarden();
                });
              } else {
                shakeBall.destroy();
                this.wildMonsterSprite.setVisible(true);
                this.showMessage(`ああ！ 捕まえられなかった！`);
                this.time.delayedCall(2000, () => {
                  this.enemyAttack();
                });
              }
            }
          },
          callbackScope: this,
          repeat: shakeCount - 1
        });
      }
    });
  }
  
  runAway() {
    const escapeChance = this.playerMonster.stats.speed / (this.playerMonster.stats.speed + this.wildMonster.stats.speed);
    
    if (Math.random() < escapeChance) {
      this.showMessage('うまく逃げ切れた！');
      this.time.delayedCall(2000, () => {
        this.returnToGarden();
      });
    } else {
      this.showMessage('逃げられない！');
      this.time.delayedCall(2000, () => {
        this.enemyAttack();
      });
    }
  }
  
  victory() {
    this.showMessage(`${this.wildMonster.name} を倒した！`);
    const expGain = 50;
    const moneyGain = Math.floor(Math.random() * 1000) + 200;
    this.playerData.money += moneyGain;
    
    this.time.delayedCall(2500, () => {
      this.showMessage(`${moneyGain} 円を手に入れた！`);
      this.time.delayedCall(2500, () => {
        this.checkEvolution();
      });
    });
  }
  
  defeat() {
    this.showMessage(`${this.playerMonster.name} は倒れてしまった...`);
    this.time.delayedCall(2500, () => {
      this.returnToGarden();
    });
  }
  
  checkEvolution() {
    if (this.playerMonster.evolvesTo && Math.random() < 0.3) {
      const evolution = this.veggieMonsters.find(m => m.id === this.playerMonster.evolvesTo);
      if (evolution) {
        this.scene.start('EvolutionScene', {
          veggieMonsters: this.veggieMonsters,
          playerData: this.playerData,
          evolvingMonster: this.playerMonster,
          evolution: evolution
        });
        return;
      }
    }
    this.returnToGarden();
  }
  
  returnToGarden() {
    if (this.fromGarden) {
      this.scene.start('GardenScene', {
        veggieMonsters: this.veggieMonsters,
        playerData: this.playerData
      });
    } else {
      this.scene.start('MenuScene', {
        veggieMonsters: this.veggieMonsters
      });
    }
  }
  
  animateAttack(attacker, target) {
    const originalX = attacker.x;
    
    this.tweens.add({
      targets: attacker,
      x: attacker.x + (attacker === this.playerMonsterSprite ? 100 : -100),
      duration: 300,
      yoyo: true,
      onComplete: () => {
        this.cameras.main.shake(300, 0.02);
        target.setTint(0xff0000);
        this.time.delayedCall(300, () => {
          target.clearTint();
        });
      }
    });
  }
  
  updateHealthBar(healthBar) {
    const hpPercent = healthBar.currentHp / healthBar.maxHp;
    healthBar.hpBar.displayWidth = 316 * hpPercent;
    
    if (hpPercent < 0.2) {
      healthBar.hpBar.setFillStyle(0xff0000);
    } else if (hpPercent < 0.5) {
      healthBar.hpBar.setFillStyle(0xffff00);
    }
    
    if (healthBar.hpText) {
      healthBar.hpText.setText(`${Math.floor(healthBar.currentHp)}/${healthBar.maxHp}`);
    }
  }
  
  showMessage(text) {
    this.messageText.setText(text);
  }
  
  createStarterMonster() {
    return {
      id: 'tomato',
      name: 'トマトン',
      type: 'Fruit',
      element: 'Sun',
      stage: 1,
      evolvesTo: 'super_tomato',
      stats: { hp: 80, attack: 75, defense: 65, speed: 70, special: 85 },
      moves: ['ジューシースプラッシュ', 'サンビーム', 'ビタミンC爆弾', 'リコピンシールド']
    };
  }
}