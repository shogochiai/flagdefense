export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data) {
    this.flagMonsters = data.flagMonsters || [];
    this.playerData = data.playerData || {};
    this.wildMonster = data.wildMonster;
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
    gradient.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x98d8c8, 0x98d8c8, 1);
    gradient.fillRect(0, 0, 960, 400);
    
    gradient.fillStyle(0x8fbc8f);
    gradient.fillRect(0, 400, 960, 240);
    
    this.add.ellipse(700, 450, 300, 100, 0x7fbc7f);
    this.add.ellipse(260, 450, 300, 100, 0x7fbc7f);
  }
  
  createBattleUI() {
    this.wildHealthBar = this.createHealthBar(50, 50, this.wildMonster.name, false);
    this.playerHealthBar = this.createHealthBar(510, 250, this.playerMonster.name, true);
    
    this.messageBox = this.add.rectangle(480, 540, 900, 180, 0x000000);
    this.messageBox.setStrokeStyle(4, 0xffffff);
    
    this.messageText = this.add.text(480, 540, '', {
      fontSize: '24px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 850 }
    }).setOrigin(0.5);
  }
  
  createHealthBar(x, y, name, showExp) {
    const container = this.add.container(x, y);
    
    const bgPanel = this.add.rectangle(0, 0, 400, 120, 0xf0f0f0);
    bgPanel.setStrokeStyle(3, 0x000000);
    bgPanel.setOrigin(0);
    container.add(bgPanel);
    
    const nameText = this.add.text(10, 10, name, {
      fontSize: '20px',
      fontFamily: 'Arial',
      fill: '#000000'
    });
    container.add(nameText);
    
    const hpLabel = this.add.text(10, 40, 'HP', {
      fontSize: '16px',
      fill: '#000000'
    });
    container.add(hpLabel);
    
    const hpBarBg = this.add.rectangle(50, 45, 300, 20, 0x555555);
    hpBarBg.setOrigin(0, 0.5);
    container.add(hpBarBg);
    
    const hpBarFill = this.add.rectangle(52, 45, 296, 16, 0x00ff00);
    hpBarFill.setOrigin(0, 0.5);
    container.add(hpBarFill);
    
    if (showExp) {
      const expBarBg = this.add.rectangle(50, 75, 300, 10, 0x333333);
      expBarBg.setOrigin(0, 0.5);
      container.add(expBarBg);
      
      const expBarFill = this.add.rectangle(52, 75, 100, 6, 0x0099ff);
      expBarFill.setOrigin(0, 0.5);
      container.add(expBarFill);
      
      container.expBar = expBarFill;
    }
    
    container.hpBar = hpBarFill;
    container.maxHp = showExp ? this.playerMonster.stats.hp : this.wildMonster.stats.hp;
    container.currentHp = container.maxHp;
    
    return container;
  }
  
  createMonsters() {
    this.wildMonsterSprite = this.add.container(700, 200);
    const wildFlag = this.add.rectangle(0, 0, 120, 80, 0xffffff);
    wildFlag.setStrokeStyle(3, 0x000000);
    this.wildMonsterSprite.add(wildFlag);
    
    const wildName = this.add.text(0, -60, this.wildMonster.name, {
      fontSize: '18px',
      fill: '#000000'
    }).setOrigin(0.5);
    this.wildMonsterSprite.add(wildName);
    
    this.playerMonsterSprite = this.add.container(260, 350);
    const playerFlag = this.add.rectangle(0, 0, 120, 80, 0xffffff);
    playerFlag.setStrokeStyle(3, 0x000000);
    this.playerMonsterSprite.add(playerFlag);
    
    const playerName = this.add.text(0, 60, this.playerMonster.name, {
      fontSize: '18px',
      fill: '#000000'
    }).setOrigin(0.5);
    this.playerMonsterSprite.add(playerName);
  }
  
  createActionMenu() {
    this.actionMenu = this.add.container(720, 480);
    
    const menuBg = this.add.rectangle(0, 0, 400, 200, 0xffffff);
    menuBg.setStrokeStyle(3, 0x000000);
    this.actionMenu.add(menuBg);
    
    const actions = [
      { text: 'たたかう', x: -100, y: -50, action: 'fight' },
      { text: 'つかまえる', x: 100, y: -50, action: 'catch' },
      { text: 'アイテム', x: -100, y: 50, action: 'item' },
      { text: 'にげる', x: 100, y: 50, action: 'run' }
    ];
    
    actions.forEach(action => {
      const button = this.add.text(action.x, action.y, action.text, {
        fontSize: '24px',
        fill: '#000000',
        backgroundColor: '#dddddd',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5);
      
      button.setInteractive({ useHandCursor: true });
      button.on('pointerover', () => button.setBackgroundColor('#ffff00'));
      button.on('pointerout', () => button.setBackgroundColor('#dddddd'));
      button.on('pointerdown', () => this.handleAction(action.action));
      
      this.actionMenu.add(button);
    });
    
    this.actionMenu.setVisible(false);
  }
  
  startBattle() {
    this.showMessage(`野生の ${this.wildMonster.name} が現れた！`);
    this.time.delayedCall(2000, () => {
      this.showMessage(`ゆけっ！ ${this.playerMonster.name}！`);
      this.time.delayedCall(2000, () => {
        this.actionMenu.setVisible(true);
        this.showMessage('どうする？');
      });
    });
  }
  
  handleAction(action) {
    this.actionMenu.setVisible(false);
    
    switch (action) {
      case 'fight':
        this.playerAttack();
        break;
      case 'catch':
        this.attemptCatch();
        break;
      case 'run':
        this.runAway();
        break;
      case 'item':
        this.showMessage('アイテムがありません！');
        this.time.delayedCall(1500, () => {
          this.actionMenu.setVisible(true);
        });
        break;
    }
  }
  
  playerAttack() {
    const damage = Math.floor(this.playerMonster.stats.attack * (0.8 + Math.random() * 0.4));
    this.wildHealthBar.currentHp = Math.max(0, this.wildHealthBar.currentHp - damage);
    
    this.showMessage(`${this.playerMonster.name} の攻撃！`);
    this.animateAttack(this.playerMonsterSprite, this.wildMonsterSprite);
    
    this.time.delayedCall(1000, () => {
      this.updateHealthBar(this.wildHealthBar);
      this.showMessage(`${this.wildMonster.name} に ${damage} のダメージ！`);
      
      if (this.wildHealthBar.currentHp <= 0) {
        this.time.delayedCall(1500, () => {
          this.victory();
        });
      } else {
        this.time.delayedCall(1500, () => {
          this.enemyAttack();
        });
      }
    });
  }
  
  enemyAttack() {
    const damage = Math.floor(this.wildMonster.stats.attack * (0.8 + Math.random() * 0.4));
    this.playerHealthBar.currentHp = Math.max(0, this.playerHealthBar.currentHp - damage);
    
    this.showMessage(`${this.wildMonster.name} の攻撃！`);
    this.animateAttack(this.wildMonsterSprite, this.playerMonsterSprite);
    
    this.time.delayedCall(1000, () => {
      this.updateHealthBar(this.playerHealthBar);
      this.showMessage(`${this.playerMonster.name} に ${damage} のダメージ！`);
      
      if (this.playerHealthBar.currentHp <= 0) {
        this.time.delayedCall(1500, () => {
          this.defeat();
        });
      } else {
        this.time.delayedCall(1500, () => {
          this.actionMenu.setVisible(true);
          this.showMessage('どうする？');
        });
      }
    });
  }
  
  attemptCatch() {
    if (this.playerData.items.pokeball <= 0) {
      this.showMessage('モンスターボールがない！');
      this.time.delayedCall(1500, () => {
        this.actionMenu.setVisible(true);
      });
      return;
    }
    
    this.playerData.items.pokeball--;
    this.showMessage(`モンスターボールを投げた！`);
    
    const catchRate = (1 - this.wildHealthBar.currentHp / this.wildHealthBar.maxHp) * 0.5 + 0.3;
    
    this.time.delayedCall(1500, () => {
      if (Math.random() < catchRate) {
        this.showMessage(`やった！ ${this.wildMonster.name} を捕まえた！`);
        this.playerData.collection.push(this.wildMonster);
        if (this.playerData.team.length < 6) {
          this.playerData.team.push(this.wildMonster);
        }
        this.time.delayedCall(2000, () => {
          this.returnToWorld();
        });
      } else {
        this.showMessage(`ああ！ 捕まえられなかった！`);
        this.time.delayedCall(1500, () => {
          this.enemyAttack();
        });
      }
    });
  }
  
  runAway() {
    this.showMessage('うまく逃げ切れた！');
    this.time.delayedCall(1500, () => {
      this.returnToWorld();
    });
  }
  
  victory() {
    this.showMessage(`${this.wildMonster.name} を倒した！`);
    const expGain = 50;
    const moneyGain = Math.floor(Math.random() * 500) + 100;
    this.playerData.money += moneyGain;
    
    this.time.delayedCall(2000, () => {
      this.showMessage(`${moneyGain} 円を手に入れた！`);
      this.time.delayedCall(2000, () => {
        this.returnToWorld();
      });
    });
  }
  
  defeat() {
    this.showMessage(`${this.playerMonster.name} は倒れてしまった...`);
    this.time.delayedCall(2000, () => {
      this.returnToWorld();
    });
  }
  
  returnToWorld() {
    this.scene.start('WorldScene', {
      flagMonsters: this.flagMonsters,
      playerData: this.playerData
    });
  }
  
  animateAttack(attacker, target) {
    this.tweens.add({
      targets: attacker,
      x: attacker.x + (attacker === this.playerMonsterSprite ? 50 : -50),
      duration: 200,
      yoyo: true,
      onComplete: () => {
        this.cameras.main.shake(200, 0.01);
        target.setTint(0xff0000);
        this.time.delayedCall(200, () => {
          target.clearTint();
        });
      }
    });
  }
  
  updateHealthBar(healthBar) {
    const hpPercent = healthBar.currentHp / healthBar.maxHp;
    healthBar.hpBar.displayWidth = 296 * hpPercent;
    
    if (hpPercent < 0.2) {
      healthBar.hpBar.setFillStyle(0xff0000);
    } else if (hpPercent < 0.5) {
      healthBar.hpBar.setFillStyle(0xffff00);
    }
  }
  
  showMessage(text) {
    this.messageText.setText(text);
  }
  
  createStarterMonster() {
    return {
      id: 'japan',
      name: 'ニホンマル',
      type: 'Psychic',
      stats: { hp: 85, attack: 80, defense: 75, speed: 100 },
      moves: ['サンライズビーム', '侍スラッシュ', '桜吹雪', '禅パワー']
    };
  }
}