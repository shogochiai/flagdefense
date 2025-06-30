export class EvolutionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EvolutionScene' });
  }

  init(data) {
    this.veggieMonsters = data.veggieMonsters || [];
    this.playerData = data.playerData || {};
    this.evolvingMonster = data.evolvingMonster;
    this.evolution = data.evolution;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
    
    this.showMessage('おや...？');
    
    this.time.delayedCall(2000, () => {
      this.showMessage(`${this.evolvingMonster.name} の様子が...！`);
      this.createEvolutionAnimation();
    });
  }
  
  createEvolutionAnimation() {
    const centerX = 512;
    const centerY = 384;
    
    const monsterSprite = this.add.circle(centerX, centerY, 80, this.getMonsterColor(this.evolvingMonster));
    monsterSprite.setStrokeStyle(5, 0xffffff);
    
    this.time.delayedCall(2000, () => {
      const light = this.add.graphics();
      light.fillStyle(0xffffff, 0.8);
      
      this.tweens.add({
        targets: monsterSprite,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 2000,
        ease: 'Sine.easeInOut',
        repeat: 2,
        yoyo: true
      });
      
      for (let i = 0; i < 20; i++) {
        const particle = this.add.circle(
          centerX + Phaser.Math.Between(-100, 100),
          centerY + Phaser.Math.Between(-100, 100),
          Phaser.Math.Between(5, 15),
          0xffff00,
          0.8
        );
        
        this.tweens.add({
          targets: particle,
          x: centerX,
          y: centerY,
          alpha: 0,
          duration: 2000,
          ease: 'Cubic.easeIn',
          onComplete: () => particle.destroy()
        });
      }
      
      this.time.delayedCall(4000, () => {
        const flash = this.add.rectangle(centerX, centerY, width, height, 0xffffff);
        
        this.tweens.add({
          targets: flash,
          alpha: 0,
          duration: 1000,
          onComplete: () => {
            flash.destroy();
            monsterSprite.destroy();
            this.showEvolution();
          }
        });
      });
    });
  }
  
  showEvolution() {
    const centerX = 512;
    const centerY = 384;
    
    const evolutionSprite = this.add.circle(centerX, centerY, 120, this.getMonsterColor(this.evolution));
    evolutionSprite.setStrokeStyle(6, 0xffffff);
    evolutionSprite.setScale(0);
    
    this.tweens.add({
      targets: evolutionSprite,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut'
    });
    
    this.showMessage(`おめでとう！ ${this.evolvingMonster.name} は ${this.evolution.name} に進化した！`);
    
    this.time.delayedCall(2000, () => {
      const statsContainer = this.add.container(centerX, centerY + 200);
      
      const statsBg = this.add.rectangle(0, 0, 400, 150, 0x000000, 0.8);
      statsBg.setStrokeStyle(3, 0xffffff);
      statsContainer.add(statsBg);
      
      const statsText = this.add.text(0, -50, 'ステータスが上昇した！', {
        fontSize: '24px',
        fill: '#ffff00'
      }).setOrigin(0.5);
      statsContainer.add(statsText);
      
      const improvements = [
        `HP: ${this.evolvingMonster.stats.hp} → ${this.evolution.stats.hp}`,
        `攻撃: ${this.evolvingMonster.stats.attack} → ${this.evolution.stats.attack}`,
        `防御: ${this.evolvingMonster.stats.defense} → ${this.evolution.stats.defense}`
      ];
      
      improvements.forEach((text, index) => {
        const statText = this.add.text(0, -10 + index * 25, text, {
          fontSize: '18px',
          fill: '#ffffff'
        }).setOrigin(0.5);
        statsContainer.add(statText);
      });
    });
    
    this.time.delayedCall(4000, () => {
      const newMoves = this.evolution.moves.filter(move => !this.evolvingMonster.moves.includes(move));
      if (newMoves.length > 0) {
        this.showMessage(`${this.evolution.name} は ${newMoves[0]} を覚えた！`);
      }
    });
    
    const continueButton = this.add.text(512, 650, '続ける', {
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#228b22',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5);
    continueButton.setInteractive({ useHandCursor: true });
    continueButton.on('pointerdown', () => {
      const teamIndex = this.playerData.team.findIndex(m => m.id === this.evolvingMonster.id);
      if (teamIndex !== -1) {
        this.playerData.team[teamIndex] = this.evolution;
      }
      
      this.scene.start('GardenScene', {
        veggieMonsters: this.veggieMonsters,
        playerData: this.playerData
      });
    });
  }
  
  showMessage(text) {
    const existingMessage = this.children.getByName('message');
    if (existingMessage) {
      existingMessage.destroy();
    }
    
    const message = this.add.text(512, 100, text, {
      fontSize: '36px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center',
      wordWrap: { width: 800 }
    }).setOrigin(0.5);
    message.setName('message');
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
}