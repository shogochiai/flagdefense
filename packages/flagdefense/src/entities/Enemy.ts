import { FlagData } from '../core/FlagAssetManager';
import { FlagRenderer } from '../core/FlagRenderer';
import { GameConfig } from '../core/GameConfig';

export class Enemy {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public flagData: FlagData;
  public health: number;
  public maxHealth: number;
  public speed: number;
  public value: number;
  public pathIndex: number = 0;
  
  constructor(
    flagData: FlagData,
    path: Array<{x: number, y: number}>,
    config: GameConfig
  ) {
    this.flagData = flagData;
    this.x = path[0].x;
    this.y = path[0].y;
    this.width = config.assets.flagSize.width * 0.8;
    this.height = config.assets.flagSize.height * 0.8;
    this.health = flagData.gdp_info.gdp_billion_usd / 100;
    this.maxHealth = this.health;
    this.speed = config.gameplay.enemySpeed * (1 + flagData.game_stats.tier * 0.1);
    this.value = Math.floor(flagData.game_stats.cost * 0.5);
  }
  
  takeDamage(damage: number): void {
    this.health -= damage;
  }
  
  isDead(): boolean {
    return this.health <= 0;
  }
  
  move(path: Array<{x: number, y: number}>, deltaTime: number): boolean {
    if (this.pathIndex >= path.length - 1) {
      return true; // Reached end
    }
    
    const target = path[this.pathIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 5) {
      this.pathIndex++;
      if (this.pathIndex >= path.length - 1) {
        return true;
      }
    } else {
      const moveDistance = this.speed * deltaTime / 16;
      this.x += (dx / distance) * moveDistance;
      this.y += (dy / distance) * moveDistance;
    }
    
    return false;
  }
  
  render(renderer: FlagRenderer, config: GameConfig): void {
    renderer.render(this.flagData.id, this.x, this.y, {
      width: this.width,
      height: this.height,
      borderRadius: config.assets.borderRadius,
      shadowBlur: config.assets.shadowBlur * 0.5
    });
    
    this.renderHealthBar(renderer['ctx']);
  }
  
  private renderHealthBar(ctx: CanvasRenderingContext2D): void {
    const barWidth = this.width;
    const barHeight = 4;
    const barY = this.y - 8;
    
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fillRect(this.x, barY, barWidth, barHeight);
    
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillRect(this.x, barY, barWidth * healthPercent, barHeight);
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, barY, barWidth, barHeight);
  }
}