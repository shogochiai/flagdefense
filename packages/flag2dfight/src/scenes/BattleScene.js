export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
    this.battleEnded = false;
    this.cpuEnabled = true; // CPU for Player 2
  }

  init(data) {
    this.p1Character = data.p1;
    this.p2Character = data.p2;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0);
    
    this.ground = this.add.rectangle(0, height - 100, width, 100, 0x654321).setOrigin(0);
    this.physics.add.existing(this.ground, true);
    
    this.createPlayer1();
    this.createPlayer2();
    this.createUI();
    this.createControls();
    
    this.physics.add.collider(this.player1, this.ground);
    this.physics.add.collider(this.player2, this.ground);
    this.physics.add.collider(this.player1, this.player2, this.handlePlayerCollision, null, this);
    
    this.battleTimer = 99;
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }
  
  createPlayer1() {
    this.player1 = this.physics.add.sprite(200, 300, null);
    this.player1.setSize(80, 120);
    this.player1.displayWidth = 80;
    this.player1.displayHeight = 120;
    
    // Create flag sprite or rectangle
    const flagKey = `flag_${this.p1Character.id}`;
    if (this.textures.exists(flagKey)) {
      this.player1.flag = this.add.image(0, 0, flagKey);
      this.player1.flag.setScale(0.4);
    } else {
      const flag1 = this.add.rectangle(0, 0, 60, 40, 0xffffff);
      if (this.p1Character.colors && this.p1Character.colors.length > 0) {
        flag1.setFillStyle(parseInt(this.p1Character.colors[0].replace('#', '0x')));
      }
      this.player1.flag = flag1;
    }
    
    // Add attack hitbox
    this.player1.attackHitbox = this.add.rectangle(0, 0, 40, 80, 0xff0000, 0);
    this.physics.add.existing(this.player1.attackHitbox, false);
    this.player1.attackHitbox.body.enable = false;
    
    this.player1.setData({
      hp: this.p1Character.stats.hp,
      maxHp: this.p1Character.stats.hp,
      attack: this.p1Character.stats.attack,
      defense: this.p1Character.stats.defense,
      speed: this.p1Character.stats.speed * 10,
      isAttacking: false,
      attackCooldown: 0,
      facingRight: true,
      stunned: false
    });
  }
  
  createPlayer2() {
    const width = this.cameras.main.width;
    this.player2 = this.physics.add.sprite(width - 200, 300, null);
    this.player2.setSize(80, 120);
    this.player2.displayWidth = 80;
    this.player2.displayHeight = 120;
    
    // Create flag sprite or rectangle
    const flagKey = `flag_${this.p2Character.id}`;
    if (this.textures.exists(flagKey)) {
      this.player2.flag = this.add.image(0, 0, flagKey);
      this.player2.flag.setScale(0.4);
    } else {
      const flag2 = this.add.rectangle(0, 0, 60, 40, 0xffffff);
      if (this.p2Character.colors && this.p2Character.colors.length > 0) {
        flag2.setFillStyle(parseInt(this.p2Character.colors[0].replace('#', '0x')));
      }
      this.player2.flag = flag2;
    }
    
    // Add attack hitbox
    this.player2.attackHitbox = this.add.rectangle(0, 0, 40, 80, 0xff0000, 0);
    this.physics.add.existing(this.player2.attackHitbox, false);
    this.player2.attackHitbox.body.enable = false;
    
    // CPU AI variables
    this.player2.setData('nextAction', 0);
    this.player2.setData('actionCooldown', 0);
    
    this.player2.setData({
      hp: this.p2Character.stats.hp,
      maxHp: this.p2Character.stats.hp,
      attack: this.p2Character.stats.attack,
      defense: this.p2Character.stats.defense,
      speed: this.p2Character.stats.speed * 10,
      isAttacking: false,
      attackCooldown: 0,
      facingRight: false,
      stunned: false
    });
  }
  
  createUI() {
    const uiY = 40;
    
    this.p1HealthBar = this.createHealthBar(50, uiY, this.p1Character.name);
    this.p2HealthBar = this.createHealthBar(this.cameras.main.width - 350, uiY, this.p2Character.name);
    
    this.timerText = this.add.text(this.cameras.main.width / 2, uiY, '99', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
  }
  
  createHealthBar(x, y, name) {
    const container = this.add.container(x, y);
    
    const nameText = this.add.text(0, -20, name, {
      fontSize: '20px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    container.add(nameText);
    
    const barBg = this.add.rectangle(0, 0, 300, 30, 0x000000);
    barBg.setOrigin(0, 0.5);
    container.add(barBg);
    
    const barFill = this.add.rectangle(2, 0, 296, 26, 0x00ff00);
    barFill.setOrigin(0, 0.5);
    container.add(barFill);
    
    container.barFill = barFill;
    return container;
  }
  
  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    
    this.input.keyboard.on('keydown-SPACE', () => {
      this.playerAttack(this.player1, this.player2);
    });
    
    this.input.keyboard.on('keydown-ENTER', () => {
      this.playerAttack(this.player2, this.player1);
    });
  }
  
  update(time, delta) {
    if (this.battleEnded) return;
    
    this.updatePlayer1();
    if (this.cpuEnabled) {
      this.updateCPU(time, delta);
    } else {
      this.updatePlayer2();
    }
    this.updateFlags();
    this.updateHealthBars();
    this.updateAttackCooldowns(delta);
    
    if (this.player1.getData('hp') <= 0 || this.player2.getData('hp') <= 0 || this.battleTimer <= 0) {
      this.endBattle();
    }
  }
  
  updatePlayer1() {
    if (this.player1.getData('stunned')) return;
    
    const speed = this.player1.getData('speed');
    
    if (this.cursors.left.isDown) {
      this.player1.setVelocityX(-speed);
      this.player1.setData('facingRight', false);
    } else if (this.cursors.right.isDown) {
      this.player1.setVelocityX(speed);
      this.player1.setData('facingRight', true);
    } else {
      this.player1.setVelocityX(0);
    }
    
    if (this.cursors.up.isDown && this.player1.body.touching.down) {
      this.player1.setVelocityY(-400);
    }
  }
  
  updatePlayer2() {
    if (this.player2.getData('stunned')) return;
    
    const speed = this.player2.getData('speed');
    
    if (this.wasd.A.isDown) {
      this.player2.setVelocityX(-speed);
      this.player2.setData('facingRight', false);
    } else if (this.wasd.D.isDown) {
      this.player2.setVelocityX(speed);
      this.player2.setData('facingRight', true);
    } else {
      this.player2.setVelocityX(0);
    }
    
    if (this.wasd.W.isDown && this.player2.body.touching.down) {
      this.player2.setVelocityY(-400);
    }
  }
  
  updateCPU(time, delta) {
    if (this.player2.getData('stunned')) return;
    
    const speed = this.player2.getData('speed');
    const distance = Math.abs(this.player1.x - this.player2.x);
    const heightDiff = Math.abs(this.player1.y - this.player2.y);
    
    // Update action cooldown
    let actionCooldown = this.player2.getData('actionCooldown') - delta;
    if (actionCooldown < 0) actionCooldown = 0;
    this.player2.setData('actionCooldown', actionCooldown);
    
    if (actionCooldown <= 0) {
      // AI decision making
      if (distance < 120 && heightDiff < 50) {
        // Close enough to attack
        this.playerAttack(this.player2, this.player1);
        this.player2.setData('actionCooldown', 800);
      } else if (distance > 250) {
        // Move closer
        if (this.player1.x < this.player2.x) {
          this.player2.setVelocityX(-speed);
          this.player2.setData('facingRight', false);
        } else {
          this.player2.setVelocityX(speed);
          this.player2.setData('facingRight', true);
        }
        this.player2.setData('actionCooldown', 100);
      } else if (distance < 80) {
        // Too close, back off
        if (this.player1.x < this.player2.x) {
          this.player2.setVelocityX(speed * 0.5);
        } else {
          this.player2.setVelocityX(-speed * 0.5);
        }
        this.player2.setData('actionCooldown', 200);
      } else {
        // Random movement
        const rand = Math.random();
        if (rand < 0.3 && this.player2.body.touching.down) {
          this.player2.setVelocityY(-400);
        } else if (rand < 0.6) {
          this.player2.setVelocityX(0);
        }
        this.player2.setData('actionCooldown', 300);
      }
    }
  }
  
  updateFlags() {
    if (this.player1.flag) {
      this.player1.flag.x = this.player1.x;
      this.player1.flag.y = this.player1.y;
    }
    
    if (this.player2.flag) {
      this.player2.flag.x = this.player2.x;
      this.player2.flag.y = this.player2.y;
    }
    
    // Update attack hitboxes
    if (this.player1.attackHitbox) {
      const offset = this.player1.getData('facingRight') ? 60 : -60;
      this.player1.attackHitbox.x = this.player1.x + offset;
      this.player1.attackHitbox.y = this.player1.y;
    }
    
    if (this.player2.attackHitbox) {
      const offset = this.player2.getData('facingRight') ? 60 : -60;
      this.player2.attackHitbox.x = this.player2.x + offset;
      this.player2.attackHitbox.y = this.player2.y;
    }
  }
  
  updateAttackCooldowns(delta) {
    // Update player 1 cooldown
    let cd1 = this.player1.getData('attackCooldown') - delta;
    if (cd1 < 0) cd1 = 0;
    this.player1.setData('attackCooldown', cd1);
    
    // Update player 2 cooldown
    let cd2 = this.player2.getData('attackCooldown') - delta;
    if (cd2 < 0) cd2 = 0;
    this.player2.setData('attackCooldown', cd2);
  }
  
  updateHealthBars() {
    const p1Percent = this.player1.getData('hp') / this.player1.getData('maxHp');
    this.p1HealthBar.barFill.displayWidth = 296 * p1Percent;
    
    const p2Percent = this.player2.getData('hp') / this.player2.getData('maxHp');
    this.p2HealthBar.barFill.displayWidth = 296 * p2Percent;
    
    if (p1Percent < 0.3) this.p1HealthBar.barFill.setFillStyle(0xff0000);
    else if (p1Percent < 0.6) this.p1HealthBar.barFill.setFillStyle(0xffff00);
    
    if (p2Percent < 0.3) this.p2HealthBar.barFill.setFillStyle(0xff0000);
    else if (p2Percent < 0.6) this.p2HealthBar.barFill.setFillStyle(0xffff00);
  }
  
  playerAttack(attacker, defender) {
    if (this.battleEnded) return;
    if (attacker.getData('attackCooldown') > 0) return;
    
    attacker.setData('attackCooldown', 600);
    
    // Visual attack effect
    attacker.setTint(0xffff00);
    this.time.delayedCall(100, () => {
      if (!this.battleEnded) attacker.clearTint();
    });
    
    // Enable attack hitbox
    attacker.attackHitbox.body.enable = true;
    attacker.attackHitbox.setFillStyle(0xff0000, 0.3);
    
    // Check collision with defender
    const hitboxBounds = attacker.attackHitbox.getBounds();
    const defenderBounds = defender.getBounds();
    
    if (Phaser.Geom.Rectangle.Overlaps(hitboxBounds, defenderBounds)) {
      const damage = Math.max(5, attacker.getData('attack') - defender.getData('defense') / 2);
      const currentHp = defender.getData('hp');
      defender.setData('hp', Math.max(0, currentHp - damage));
      
      // Hit effect
      defender.setTint(0xff0000);
      defender.setData('stunned', true);
      
      // Knockback
      const knockback = attacker.x < defender.x ? 300 : -300;
      defender.setVelocityX(knockback);
      defender.setVelocityY(-200);
      
      // Create damage text
      const damageText = this.add.text(defender.x, defender.y - 50, `-${Math.round(damage)}`, {
        fontSize: '24px',
        fill: '#ff0000',
        stroke: '#000000',
        strokeThickness: 3
      });
      
      this.tweens.add({
        targets: damageText,
        y: damageText.y - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => damageText.destroy()
      });
      
      this.time.delayedCall(300, () => {
        if (!this.battleEnded) {
          defender.clearTint();
          defender.setData('stunned', false);
        }
      });
    }
    
    // Disable hitbox after short time
    this.time.delayedCall(150, () => {
      attacker.attackHitbox.body.enable = false;
      attacker.attackHitbox.setFillStyle(0xff0000, 0);
    });
  }
  
  handlePlayerCollision(player1, player2) {
    // 衝突時の処理
  }
  
  updateTimer() {
    this.battleTimer--;
    this.timerText.setText(this.battleTimer);
    
    if (this.battleTimer <= 10) {
      this.timerText.setFill('#ff0000');
    }
  }
  
  endBattle() {
    if (this.battleEnded) return;
    this.battleEnded = true;
    
    this.timerEvent.remove();
    
    // Stop all physics
    this.physics.pause();
    
    // Disable all inputs
    this.input.keyboard.removeAllKeys();
    
    let winner = null;
    let winnerChar = null;
    if (this.player1.getData('hp') <= 0) {
      winner = this.p2Character.name;
      winnerChar = this.p2Character;
    } else if (this.player2.getData('hp') <= 0) {
      winner = this.p1Character.name;
      winnerChar = this.p1Character;
    } else {
      if (this.player1.getData('hp') > this.player2.getData('hp')) {
        winner = this.p1Character.name;
        winnerChar = this.p1Character;
      } else {
        winner = this.p2Character.name;
        winnerChar = this.p2Character;
      }
    }
    
    // Victory effect
    const victoryText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'K.O.!', {
      fontSize: '96px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#ff0000',
      strokeThickness: 8
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: victoryText,
      scale: { from: 0, to: 1.5 },
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(1000, () => {
          this.scene.start('GameOverScene', { 
            winner,
            winnerChar,
            p1Char: this.p1Character,
            p2Char: this.p2Character
          });
        });
      }
    });
  }
}