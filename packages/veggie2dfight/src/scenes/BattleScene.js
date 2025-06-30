export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data) {
    this.p1Character = data.p1;
    this.p2Character = data.p2;
    this.difficulty = data.difficulty || 'normal';
    this.cpuState = {
      lastAction: 0,
      reactionTime: this.getDifficultySettings().reactionTime,
      attackCooldown: 0,
      specialCooldown: 0,
      blockChance: this.getDifficultySettings().blockChance
    };
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.createBackground();
    this.createPlayers();
    this.createUI();
    this.createControls();
    this.setupPhysics();
    
    this.battleTimer = 99;
    this.roundNumber = 1;
    this.wins = { p1: 0, p2: 0 };
    this.roundEnded = false;
    
    this.startRound();
  }
  
  createBackground() {
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x98fb98, 0x98fb98, 1);
    gradient.fillRect(0, 0, 1280, 500);
    
    this.add.rectangle(0, 500, 1280, 220, 0x8b7355).setOrigin(0);
    
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(100, 1180),
        Phaser.Math.Between(50, 150),
        Phaser.Math.Between(80, 120),
        Phaser.Math.Between(40, 60),
        0xffffff,
        0.6
      );
      
      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(50, 100),
        duration: Phaser.Math.Between(20000, 30000),
        repeat: -1,
        yoyo: true
      });
    }
    
    const ground = this.add.rectangle(0, 620, 1280, 100, 0x228b22).setOrigin(0);
    this.physics.add.existing(ground, true);
    this.ground = ground;
  }
  
  createPlayers() {
    this.player1 = this.createFighter(300, 400, this.p1Character, true);
    this.player2 = this.createFighter(980, 400, this.p2Character, false);
  }
  
  createFighter(x, y, character, isPlayer1) {
    const fighter = this.physics.add.sprite(x, y, null);
    fighter.setSize(80, 120);
    fighter.displayWidth = 100;
    fighter.displayHeight = 140;
    
    const fighterContainer = this.add.container(x, y);
    
    const veggieImage = this.add.image(0, -20, `veggie_${character.id}`);
    veggieImage.setDisplaySize(80, 80);
    fighterContainer.add(veggieImage);
    
    const eyes = this.add.container(0, -20);
    const leftEye = this.add.circle(-15, 0, 8, 0xffffff);
    const rightEye = this.add.circle(15, 0, 8, 0xffffff);
    const leftPupil = this.add.circle(-15, 0, 4, 0x000000);
    const rightPupil = this.add.circle(15, 0, 4, 0x000000);
    eyes.add([leftEye, rightEye, leftPupil, rightPupil]);
    fighterContainer.add(eyes);
    
    const limbs = this.add.graphics();
    limbs.lineStyle(8, character.color);
    limbs.moveTo(-20, 20);
    limbs.lineTo(-30, 40);
    limbs.moveTo(20, 20);
    limbs.lineTo(30, 40);
    limbs.moveTo(-10, 40);
    limbs.lineTo(-10, 60);
    limbs.moveTo(10, 40);
    limbs.lineTo(10, 60);
    limbs.strokePath();
    fighterContainer.add(limbs);
    
    fighter.fighterContainer = fighterContainer;
    
    fighter.setData({
      character: character,
      hp: character.stats.hp,
      maxHp: character.stats.hp,
      attack: character.stats.attack,
      defense: character.stats.defense,
      speed: character.stats.speed * 15,
      isAttacking: false,
      isBlocking: false,
      facingRight: isPlayer1,
      comboCount: 0,
      specialReady: true
    });
    
    fighter.setCollideWorldBounds(true);
    fighter.setBounce(0.2);
    
    return fighter;
  }
  
  createUI() {
    this.createHealthBars();
    this.createRoundIndicator();
    this.createComboDisplay();
    
    this.timerText = this.add.text(640, 60, '99', {
      fontSize: '56px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);
    
    // 操作説明を追加
    const controlsP1 = this.add.text(50, 680, '移動:←→ ジャンプ:↑ ガード:↓ 攻撃:G 必殺技:H', {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    
    const difficultyText = this.add.text(1230, 680, `CPU難易度: ${this.getDifficultyText()}`, {
      fontSize: '16px',
      fill: this.getDifficultyColor(),
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 0);
  }
  
  createHealthBars() {
    this.p1HealthBar = this.createHealthBar(50, 50, this.p1Character, true);
    this.p2HealthBar = this.createHealthBar(1230, 50, this.p2Character, false);
  }
  
  createHealthBar(x, y, character, isLeft) {
    const container = this.add.container(x, y);
    
    const barWidth = 500;
    const barHeight = 40;
    
    const barBg = this.add.rectangle(0, 0, barWidth, barHeight, 0x000000);
    barBg.setOrigin(isLeft ? 0 : 1, 0);
    container.add(barBg);
    
    const barFill = this.add.rectangle(isLeft ? 2 : -2, 2, barWidth - 4, barHeight - 4, 0x00ff00);
    barFill.setOrigin(isLeft ? 0 : 1, 0);
    container.add(barFill);
    
    const name = this.add.text(isLeft ? 10 : -10, 50, character.name, {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    name.setOrigin(isLeft ? 0 : 1, 0);
    container.add(name);
    
    const specialBar = this.add.rectangle(isLeft ? 0 : 0, 80, 200, 15, 0x333333);
    specialBar.setOrigin(isLeft ? 0 : 1, 0);
    container.add(specialBar);
    
    const specialFill = this.add.rectangle(isLeft ? 2 : -2, 82, 196, 11, 0xffff00);
    specialFill.setOrigin(isLeft ? 0 : 1, 0);
    container.add(specialFill);
    
    container.barFill = barFill;
    container.specialFill = specialFill;
    container.barWidth = barWidth - 4;
    
    return container;
  }
  
  createRoundIndicator() {
    const container = this.add.container(640, 120);
    
    for (let i = 0; i < 3; i++) {
      const dot = this.add.circle(-30 + i * 30, 0, 10, 0x666666);
      container.add(dot);
      container[`round${i + 1}`] = dot;
    }
  }
  
  createComboDisplay() {
    this.p1Combo = this.add.text(200, 150, '', {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    this.p2Combo = this.add.text(1080, 150, '', {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
  }
  
  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    this.p1Attack = this.input.keyboard.addKey('G');
    this.p1Special = this.input.keyboard.addKey('H');
    this.p2Attack = this.input.keyboard.addKey('L');
    this.p2Special = this.input.keyboard.addKey('K');
  }
  
  setupPhysics() {
    this.physics.add.collider(this.player1, this.ground);
    this.physics.add.collider(this.player2, this.ground);
    this.physics.add.collider(this.player1, this.player2, this.handlePlayerCollision, null, this);
  }
  
  startRound() {
    this.roundEnded = false;
    this.showRoundStart();
    this.time.delayedCall(2000, () => {
      this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
      });
    });
  }
  
  showRoundStart() {
    const roundText = this.add.text(640, 360, `ROUND ${this.roundNumber}`, {
      fontSize: '96px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: roundText,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 2000,
      onComplete: () => roundText.destroy()
    });
    
    this.time.delayedCall(1500, () => {
      const fightText = this.add.text(640, 360, 'FIGHT!', {
        fontSize: '120px',
        fontFamily: 'Arial Black',
        fill: '#ff0000',
        stroke: '#ffffff',
        strokeThickness: 12
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: fightText,
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        duration: 1000,
        onComplete: () => fightText.destroy()
      });
    });
  }
  
  update() {
    if (this.roundEnded) return;
    
    this.updatePlayer1Controls();
    this.updateCPUControls();
    this.updateHealthBars();
    this.updateFacingDirection();
    this.updateFighterPositions();
    
    if (this.player1.getData('hp') <= 0 || this.player2.getData('hp') <= 0 || this.battleTimer <= 0) {
      this.endRound();
    }
  }
  
  updatePlayer1Controls() {
    const speed = this.player1.getData('speed');
    
    if (!this.player1.getData('isAttacking')) {
      if (this.cursors.left.isDown) {
        this.player1.setVelocityX(-speed);
      } else if (this.cursors.right.isDown) {
        this.player1.setVelocityX(speed);
      } else {
        this.player1.setVelocityX(0);
      }
      
      if (this.cursors.up.isDown && this.player1.body.touching.down) {
        this.player1.setVelocityY(-600);
      }
      
      this.player1.setData('isBlocking', this.cursors.down.isDown);
    }
    
    if (Phaser.Input.Keyboard.JustDown(this.p1Attack)) {
      this.playerAttack(this.player1, this.player2);
    }
    
    if (Phaser.Input.Keyboard.JustDown(this.p1Special)) {
      this.playerSpecial(this.player1, this.player2);
    }
  }
  
  updateCPUControls() {
    const currentTime = this.time.now;
    const distance = Math.abs(this.player2.x - this.player1.x);
    const heightDiff = this.player2.y - this.player1.y;
    const speed = this.player2.getData('speed');
    
    // CPUのクールダウンを更新
    if (this.cpuState.attackCooldown > 0) {
      this.cpuState.attackCooldown -= 16;
    }
    if (this.cpuState.specialCooldown > 0) {
      this.cpuState.specialCooldown -= 16;
    }
    
    // 反応時間チェック
    if (currentTime - this.cpuState.lastAction < this.cpuState.reactionTime) {
      return;
    }
    
    if (!this.player2.getData('isAttacking')) {
      // 移動AI
      if (distance > 150) {
        // プレイヤーに近づく
        if (this.player1.x < this.player2.x) {
          this.player2.setVelocityX(-speed);
        } else {
          this.player2.setVelocityX(speed);
        }
      } else if (distance < 80) {
        // 近すぎる場合は離れる
        if (this.player1.x < this.player2.x) {
          this.player2.setVelocityX(speed * 0.7);
        } else {
          this.player2.setVelocityX(-speed * 0.7);
        }
      } else {
        this.player2.setVelocityX(0);
      }
      
      // ジャンプAI
      if (this.player2.body.touching.down) {
        if (heightDiff > 50 && Math.random() < 0.3) {
          this.player2.setVelocityY(-600);
        } else if (distance < 100 && Math.random() < 0.1) {
          // 回避ジャンプ
          this.player2.setVelocityY(-600);
        }
      }
      
      // ブロックAI
      const shouldBlock = distance < 150 && 
                         this.player1.getData('isAttacking') && 
                         Math.random() < this.cpuState.blockChance;
      this.player2.setData('isBlocking', shouldBlock);
      
      // 攻撃AI
      if (distance < 120 && this.cpuState.attackCooldown <= 0) {
        if (this.player2.getData('specialReady') && 
            this.cpuState.specialCooldown <= 0 && 
            Math.random() < this.getDifficultySettings().specialChance) {
          this.playerSpecial(this.player2, this.player1);
          this.cpuState.specialCooldown = 5000;
          this.cpuState.lastAction = currentTime;
        } else if (Math.random() < this.getDifficultySettings().attackChance) {
          this.playerAttack(this.player2, this.player1);
          this.cpuState.attackCooldown = 800;
          this.cpuState.lastAction = currentTime;
        }
      }
    }
  }
  
  updateFacingDirection() {
    this.player1.setData('facingRight', this.player1.x < this.player2.x);
    this.player2.setData('facingRight', this.player2.x < this.player1.x);
    
    this.player1.fighterContainer.setScale(this.player1.getData('facingRight') ? 1 : -1, 1);
    this.player2.fighterContainer.setScale(this.player2.getData('facingRight') ? 1 : -1, 1);
  }
  
  updateFighterPositions() {
    this.player1.fighterContainer.x = this.player1.x;
    this.player1.fighterContainer.y = this.player1.y;
    this.player2.fighterContainer.x = this.player2.x;
    this.player2.fighterContainer.y = this.player2.y;
  }
  
  playerAttack(attacker, defender) {
    if (attacker.getData('isAttacking')) return;
    
    attacker.setData('isAttacking', true);
    
    const distance = Phaser.Math.Distance.Between(attacker.x, attacker.y, defender.x, defender.y);
    
    if (distance < 150) {
      const isBlocked = defender.getData('isBlocking');
      const damage = isBlocked ? 
        Math.floor(attacker.getData('attack') * 0.3) : 
        attacker.getData('attack');
      
      const currentHp = defender.getData('hp');
      defender.setData('hp', Math.max(0, currentHp - damage));
      
      if (!isBlocked) {
        defender.setTint(0xff0000);
        const knockback = attacker.x < defender.x ? 300 : -300;
        defender.setVelocityX(knockback);
        defender.setVelocityY(-200);
        
        attacker.setData('comboCount', attacker.getData('comboCount') + 1);
        this.showCombo(attacker);
      } else {
        this.showBlock(defender);
      }
      
      this.time.delayedCall(200, () => {
        defender.clearTint();
      });
    }
    
    this.animateAttack(attacker);
    
    this.time.delayedCall(400, () => {
      attacker.setData('isAttacking', false);
    });
  }
  
  playerSpecial(attacker, defender) {
    if (!attacker.getData('specialReady') || attacker.getData('isAttacking')) return;
    
    attacker.setData('isAttacking', true);
    attacker.setData('specialReady', false);
    
    this.showSpecialMove(attacker);
    
    const distance = Phaser.Math.Distance.Between(attacker.x, attacker.y, defender.x, defender.y);
    
    if (distance < 200) {
      const damage = attacker.getData('attack') * 2;
      const currentHp = defender.getData('hp');
      defender.setData('hp', Math.max(0, currentHp - damage));
      
      defender.setTint(0xffff00);
      const knockback = attacker.x < defender.x ? 500 : -500;
      defender.setVelocityX(knockback);
      defender.setVelocityY(-400);
      
      this.cameras.main.shake(500, 0.02);
      
      this.time.delayedCall(300, () => {
        defender.clearTint();
      });
    }
    
    this.time.delayedCall(1000, () => {
      attacker.setData('isAttacking', false);
    });
    
    this.time.delayedCall(5000, () => {
      attacker.setData('specialReady', true);
    });
  }
  
  animateAttack(attacker) {
    this.tweens.add({
      targets: attacker.fighterContainer,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 100,
      yoyo: true
    });
  }
  
  showSpecialMove(attacker) {
    const character = attacker.getData('character');
    const specialText = this.add.text(attacker.x, attacker.y - 100, character.special, {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      fill: '#ffff00',
      stroke: '#ff0000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: specialText,
      y: specialText.y - 50,
      alpha: 0,
      duration: 1500,
      onComplete: () => specialText.destroy()
    });
  }
  
  showCombo(attacker) {
    const combo = attacker.getData('comboCount');
    if (combo > 1) {
      const comboDisplay = attacker === this.player1 ? this.p1Combo : this.p2Combo;
      comboDisplay.setText(`${combo} HIT COMBO!`);
      
      this.time.delayedCall(1000, () => {
        comboDisplay.setText('');
      });
    }
  }
  
  showBlock(defender) {
    const blockText = this.add.text(defender.x, defender.y - 80, 'BLOCK!', {
      fontSize: '24px',
      fontFamily: 'Arial Black',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: blockText,
      y: blockText.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => blockText.destroy()
    });
  }
  
  updateHealthBars() {
    const p1Percent = this.player1.getData('hp') / this.player1.getData('maxHp');
    this.p1HealthBar.barFill.displayWidth = this.p1HealthBar.barWidth * p1Percent;
    
    const p2Percent = this.player2.getData('hp') / this.player2.getData('maxHp');
    this.p2HealthBar.barFill.displayWidth = this.p2HealthBar.barWidth * p2Percent;
    
    if (p1Percent < 0.3) this.p1HealthBar.barFill.setFillStyle(0xff0000);
    else if (p1Percent < 0.6) this.p1HealthBar.barFill.setFillStyle(0xffff00);
    
    if (p2Percent < 0.3) this.p2HealthBar.barFill.setFillStyle(0xff0000);
    else if (p2Percent < 0.6) this.p2HealthBar.barFill.setFillStyle(0xffff00);
    
    const p1Special = this.player1.getData('specialReady') ? 1 : 0;
    const p2Special = this.player2.getData('specialReady') ? 1 : 0;
    this.p1HealthBar.specialFill.displayWidth = 196 * p1Special;
    this.p2HealthBar.specialFill.displayWidth = 196 * p2Special;
  }
  
  updateTimer() {
    this.battleTimer--;
    this.timerText.setText(this.battleTimer);
    
    if (this.battleTimer <= 10) {
      this.timerText.setFill('#ff0000');
    }
  }
  
  handlePlayerCollision(player1, player2) {
    player1.setData('comboCount', 0);
    player2.setData('comboCount', 0);
    
    // プレイヤー同士を押し離す
    const centerX = (player1.x + player2.x) / 2;
    const pushDistance = 50;
    
    if (player1.x < player2.x) {
      player1.setX(centerX - pushDistance);
      player2.setX(centerX + pushDistance);
    } else {
      player1.setX(centerX + pushDistance);
      player2.setX(centerX - pushDistance);
    }
  }
  
  endRound() {
    if (this.roundEnded) return;
    this.roundEnded = true;
    
    // 両プレイヤーの動きを停止
    this.player1.setVelocity(0, 0);
    this.player2.setVelocity(0, 0);
    this.player1.setData('isAttacking', false);
    this.player2.setData('isAttacking', false);
    this.player1.setData('isBlocking', false);
    this.player2.setData('isBlocking', false);
    
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
    
    let roundWinner = null;
    if (this.player1.getData('hp') <= 0) {
      roundWinner = 'p2';
      // 倒れるアニメーション
      this.player1.setTint(0x666666);
      this.player1.fighterContainer.setRotation(-Math.PI / 4);
    } else if (this.player2.getData('hp') <= 0) {
      roundWinner = 'p1';
      // 倒れるアニメーション
      this.player2.setTint(0x666666);
      this.player2.fighterContainer.setRotation(Math.PI / 4);
    } else {
      roundWinner = this.player1.getData('hp') > this.player2.getData('hp') ? 'p1' : 'p2';
    }
    
    this.wins[roundWinner]++;
    
    const winnerName = roundWinner === 'p1' ? this.p1Character.name : this.p2Character.name;
    this.showRoundEnd(winnerName);
    
    this.time.delayedCall(3000, () => {
      if (this.wins.p1 >= 2 || this.wins.p2 >= 2) {
        this.endMatch();
      } else {
        this.nextRound();
      }
    });
  }
  
  showRoundEnd(winnerName) {
    const koText = this.add.text(640, 360, 'K.O.', {
      fontSize: '144px',
      fontFamily: 'Arial Black',
      fill: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 12
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: koText,
      scaleX: 2,
      scaleY: 2,
      duration: 1000,
      ease: 'Bounce.easeOut'
    });
    
    this.time.delayedCall(1000, () => {
      const winnerText = this.add.text(640, 480, `${winnerName} WINS!`, {
        fontSize: '48px',
        fontFamily: 'Arial Black',
        fill: '#ffff00',
        stroke: '#000000',
        strokeThickness: 6
      }).setOrigin(0.5);
    });
  }
  
  nextRound() {
    this.roundNumber++;
    this.battleTimer = 99;
    this.roundEnded = false;
    
    // キャラクターをリセット
    this.player1.clearTint();
    this.player2.clearTint();
    this.player1.fighterContainer.setRotation(0);
    this.player2.fighterContainer.setRotation(0);
    
    this.player1.setData('hp', this.p1Character.stats.hp);
    this.player2.setData('hp', this.p2Character.stats.hp);
    this.player1.setData('specialReady', true);
    this.player2.setData('specialReady', true);
    this.player1.setData('comboCount', 0);
    this.player2.setData('comboCount', 0);
    
    this.player1.setPosition(300, 400);
    this.player2.setPosition(980, 400);
    this.player1.setVelocity(0, 0);
    this.player2.setVelocity(0, 0);
    
    this.player1.fighterContainer.setPosition(300, 400);
    this.player2.fighterContainer.setPosition(980, 400);
    
    this.timerText.setFill('#ffffff');
    
    this.startRound();
  }
  
  endMatch() {
    const winner = this.wins.p1 >= 2 ? this.p1Character : this.p2Character;
    this.scene.start('VictoryScene', { winner });
  }
  
  getDifficultySettings() {
    const settings = {
      easy: {
        reactionTime: 800,
        attackChance: 0.3,
        specialChance: 0.1,
        blockChance: 0.2
      },
      normal: {
        reactionTime: 400,
        attackChance: 0.5,
        specialChance: 0.2,
        blockChance: 0.4
      },
      hard: {
        reactionTime: 200,
        attackChance: 0.7,
        specialChance: 0.3,
        blockChance: 0.6
      }
    };
    return settings[this.difficulty] || settings.normal;
  }
  
  getDifficultyText() {
    const texts = {
      easy: 'かんたん',
      normal: 'ふつう',
      hard: 'むずかしい'
    };
    return texts[this.difficulty] || 'ふつう';
  }
  
  getDifficultyColor() {
    const colors = {
      easy: '#27ae60',
      normal: '#f39c12',
      hard: '#e74c3c'
    };
    return colors[this.difficulty] || '#f39c12';
  }
}