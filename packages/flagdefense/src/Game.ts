import { FlagAssetManager } from './core/FlagAssetManager';
import { FlagRenderer } from './core/FlagRenderer';
import { GameConfig, defaultGameConfig } from './core/GameConfig';
import { Tower } from './entities/Tower';
import { Enemy } from './entities/Enemy';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private flagManager: FlagAssetManager;
  private renderer: FlagRenderer;
  
  private towers: Tower[] = [];
  private enemies: Enemy[] = [];
  private money: number;
  private lives: number;
  private wave: number = 1;
  private lastEnemySpawn: number = 0;
  private isRunning: boolean = false;
  private animationId: number | null = null;
  
  private path: Array<{x: number, y: number}> = [];
  
  constructor(canvas: HTMLCanvasElement, config: GameConfig = defaultGameConfig) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    
    this.config = config;
    this.flagManager = new FlagAssetManager();
    this.renderer = new FlagRenderer(this.flagManager, canvas);
    
    this.money = config.gameplay.startingMoney;
    this.lives = config.gameplay.startingLives;
    
    this.setupCanvas();
    this.generatePath();
  }
  
  private setupCanvas(): void {
    this.canvas.width = this.config.canvas.width;
    this.canvas.height = this.config.canvas.height;
  }
  
  private generatePath(): void {
    const points = [
      { x: -50, y: 200 },
      { x: 200, y: 200 },
      { x: 200, y: 400 },
      { x: 400, y: 400 },
      { x: 400, y: 100 },
      { x: 600, y: 100 },
      { x: 600, y: 500 },
      { x: 800, y: 500 },
      { x: 800, y: 300 },
      { x: this.config.canvas.width + 50, y: 300 }
    ];
    
    this.path = points;
  }
  
  async initialize(): Promise<void> {
    console.log('Game initializing...');
    await this.flagManager.loadAssets();
    console.log('Assets loaded, preloading images...');
    await this.flagManager.preloadAllImages();
    console.log('Game initialization complete');
  }
  
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.gameLoop();
  }
  
  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  private gameLoop = (): void => {
    if (!this.isRunning) return;
    
    this.update();
    this.render();
    
    this.animationId = requestAnimationFrame(this.gameLoop);
  };
  
  private update(): void {
    const currentTime = Date.now();
    
    // Spawn enemies
    if (currentTime - this.lastEnemySpawn > this.config.gameplay.enemySpawnInterval) {
      this.spawnEnemy();
      this.lastEnemySpawn = currentTime;
    }
    
    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const reachedEnd = enemy.move(this.path, 16);
      
      if (reachedEnd) {
        this.lives--;
        this.enemies.splice(i, 1);
        if (this.lives <= 0) {
          this.gameOver();
        }
      } else if (enemy.isDead()) {
        this.money += enemy.value;
        this.enemies.splice(i, 1);
      }
    }
    
    // Tower shooting
    for (const tower of this.towers) {
      if (tower.canFire(currentTime)) {
        for (const enemy of this.enemies) {
          if (tower.isInRange(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2)) {
            enemy.takeDamage(tower.damage);
            tower.fire(currentTime);
            break;
          }
        }
      }
    }
  }
  
  private spawnEnemy(): void {
    const availableFlags = this.flagManager.getFlagsByTier(
      Math.min(this.wave, 6)
    );
    
    if (availableFlags.length === 0) return;
    
    const randomFlag = availableFlags[
      Math.floor(Math.random() * availableFlags.length)
    ];
    
    const enemy = new Enemy(randomFlag, this.path, this.config);
    this.enemies.push(enemy);
  }
  
  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = this.config.canvas.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render path
    this.renderPath();
    
    // Render towers
    for (const tower of this.towers) {
      tower.render(this.renderer, this.config);
    }
    
    // Render enemies
    for (const enemy of this.enemies) {
      enemy.render(this.renderer, this.config);
    }
    
    // Render UI
    this.renderUI();
  }
  
  private renderPath(): void {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.5)';
    this.ctx.lineWidth = 40;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i++) {
      this.ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }
  
  private renderUI(): void {
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Money: $${this.money}`, this.config.ui.statsPosition.x, this.config.ui.statsPosition.y);
    this.ctx.fillText(`Lives: ${this.lives}`, this.config.ui.statsPosition.x, this.config.ui.statsPosition.y + 30);
    this.ctx.fillText(`Wave: ${this.wave}`, this.config.ui.statsPosition.x, this.config.ui.statsPosition.y + 60);
    this.ctx.restore();
  }
  
  private gameOver(): void {
    this.stop();
    alert('Game Over!');
  }
  
  addTower(x: number, y: number, flagId: string): boolean {
    const flagData = this.flagManager.getAsset(flagId);
    if (!flagData) return false;
    
    if (this.money < flagData.game_stats.cost) return false;
    
    const tower = new Tower(x, y, flagData, this.config);
    this.towers.push(tower);
    this.money -= flagData.game_stats.cost;
    
    return true;
  }
  
  handleClick(x: number, y: number): void {
    // Simple tower placement for testing
    const flags = this.flagManager.getAllAssets();
    if (flags.length > 0) {
      const randomFlag = flags[Math.floor(Math.random() * flags.length)];
      this.addTower(x - 30, y - 20, randomFlag.id);
    }
  }
}