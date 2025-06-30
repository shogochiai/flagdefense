import { FlagData } from '../core/FlagAssetManager';
import { FlagRenderer } from '../core/FlagRenderer';
import { GameConfig } from '../core/GameConfig';

export class Tower {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public flagData: FlagData;
  public damage: number;
  public range: number;
  public fireRate: number;
  private lastFireTime: number = 0;
  
  constructor(
    x: number,
    y: number,
    flagData: FlagData,
    config: GameConfig
  ) {
    this.x = x;
    this.y = y;
    this.flagData = flagData;
    this.width = config.assets.flagSize.width;
    this.height = config.assets.flagSize.height;
    this.damage = flagData.game_stats.damage;
    this.range = flagData.game_stats.range;
    this.fireRate = 1000; // milliseconds between shots
  }
  
  canFire(currentTime: number): boolean {
    return currentTime - this.lastFireTime >= this.fireRate;
  }
  
  fire(currentTime: number): void {
    this.lastFireTime = currentTime;
  }
  
  isInRange(targetX: number, targetY: number): boolean {
    const dx = targetX - (this.x + this.width / 2);
    const dy = targetY - (this.y + this.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.range;
  }
  
  render(renderer: FlagRenderer, config: GameConfig): void {
    renderer.render(this.flagData.id, this.x, this.y, {
      width: this.width,
      height: this.height,
      borderRadius: config.assets.borderRadius,
      shadowBlur: config.assets.shadowBlur
    });
  }
  
  renderRange(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.range,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.restore();
  }
}