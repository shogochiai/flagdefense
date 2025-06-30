import { GameState } from './GameState';
import { GAME_CONFIG, PATH_POINTS } from './GameConfig';
import { AssetManager } from './AssetManager';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private assetManager: AssetManager;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.assetManager = AssetManager.getInstance();
  }

  render(gameState: GameState): void {
    this.clearCanvas();
    this.drawBackground();
    this.drawPath();
    this.drawGrid();
    this.drawTowers(gameState);
    this.drawEnemies(gameState);
    this.drawProjectiles(gameState);
    this.drawUI(gameState);
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
  }

  private drawBackground(): void {
    this.ctx.fillStyle = '#87CEEB'; // Sky blue
    this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    
    this.ctx.fillStyle = '#90EE90'; // Light green for grass
    this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
  }

  private drawPath(): void {
    this.ctx.strokeStyle = '#D2691E'; // Brown path
    this.ctx.lineWidth = 40;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.ctx.beginPath();
    PATH_POINTS.forEach((point, index) => {
      if (index === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.stroke();
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;
    
    for (let x = 0; x <= GAME_CONFIG.CANVAS_WIDTH; x += GAME_CONFIG.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, GAME_CONFIG.CANVAS_HEIGHT);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= GAME_CONFIG.CANVAS_HEIGHT; y += GAME_CONFIG.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(GAME_CONFIG.CANVAS_WIDTH, y);
      this.ctx.stroke();
    }
  }

  private drawTowers(gameState: GameState): void {
    gameState.towers.forEach(tower => {
      // Draw range circle when selected
      if (gameState.selectedTower === tower) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(tower.position.x, tower.position.y, tower.range, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      // Draw tower base
      this.ctx.fillStyle = '#8B4513';
      this.ctx.fillRect(
        tower.position.x - 15,
        tower.position.y - 15,
        30,
        30
      );

      // Draw vegetable image
      const image = this.assetManager.getImage(tower.vegetable.imagePath);
      if (image) {
        const size = 32; // Size of the vegetable image
        this.ctx.drawImage(
          image,
          tower.position.x - size / 2,
          tower.position.y - size / 2,
          size,
          size
        );
      } else {
        // Fallback to emoji if image not loaded
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(tower.vegetable.emoji, tower.position.x, tower.position.y);
      }

      // Draw level indicator
      if (tower.level > 1) {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Lv${tower.level}`, tower.position.x, tower.position.y + 20);
      }
    });
  }

  private drawEnemies(gameState: GameState): void {
    gameState.enemies.forEach(enemy => {
      // Draw health bar
      const healthBarWidth = 30;
      const healthBarHeight = 4;
      const healthPercentage = enemy.getHealthPercentage();
      
      this.ctx.fillStyle = '#FF0000';
      this.ctx.fillRect(
        enemy.position.x - healthBarWidth / 2,
        enemy.position.y - 20,
        healthBarWidth,
        healthBarHeight
      );
      
      this.ctx.fillStyle = '#00FF00';
      this.ctx.fillRect(
        enemy.position.x - healthBarWidth / 2,
        enemy.position.y - 20,
        healthBarWidth * healthPercentage,
        healthBarHeight
      );

      // Draw enemy
      this.ctx.fillStyle = enemy.data.color;
      this.ctx.beginPath();
      this.ctx.arc(enemy.position.x, enemy.position.y, 12, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw status effects
      if (enemy.slowedUntil > Date.now()) {
        this.ctx.strokeStyle = '#00FFFF';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
      
      if (enemy.burnUntil > Date.now()) {
        this.ctx.strokeStyle = '#FF4500';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    });
  }

  private drawProjectiles(gameState: GameState): void {
    gameState.projectiles.forEach(projectile => {
      this.ctx.fillStyle = projectile.color;
      this.ctx.beginPath();
      this.ctx.arc(projectile.position.x, projectile.position.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private drawUI(gameState: GameState): void {
    // Draw UI background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, 50);

    // Draw game info
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    
    this.ctx.fillText(`💰 ${gameState.coins}`, 20, 25);
    this.ctx.fillText(`❤️ ${gameState.lives}`, 120, 25);
    this.ctx.fillText(`Wave: ${gameState.wave}`, 220, 25);

    // Draw game over or victory message
    if (gameState.isGameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
      
      this.ctx.fillStyle = '#FF0000';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2);
    } else if (gameState.isVictory) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
      
      this.ctx.fillStyle = '#00FF00';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('VICTORY!', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2);
    }
  }
}