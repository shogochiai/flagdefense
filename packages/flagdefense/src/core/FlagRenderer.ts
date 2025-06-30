import { AssetRenderer, RenderOptions } from './AssetRenderer';
import { FlagAssetManager, FlagData } from './FlagAssetManager';

export class FlagRenderer extends AssetRenderer<FlagData> {
  constructor(flagManager: FlagAssetManager, canvas: HTMLCanvasElement) {
    super(flagManager, canvas);
  }
  
  protected renderFallback(
    flag: FlagData,
    x: number,
    y: number,
    options: RenderOptions
  ): void {
    const colors = options.fallbackColors || flag.game_stats.colors || ['#CCC', '#999'];
    
    this.ctx.save();
    
    if (options.shadowBlur) {
      this.ctx.shadowBlur = options.shadowBlur;
      this.ctx.shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0.5)';
    }
    
    if (options.borderRadius) {
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, options.width, options.height, options.borderRadius);
      this.ctx.clip();
    }
    
    if (colors.length === 1) {
      this.ctx.fillStyle = colors[0];
      this.ctx.fillRect(x, y, options.width, options.height);
    } else if (colors.length === 2) {
      const halfHeight = options.height / 2;
      this.ctx.fillStyle = colors[0];
      this.ctx.fillRect(x, y, options.width, halfHeight);
      this.ctx.fillStyle = colors[1];
      this.ctx.fillRect(x, y + halfHeight, options.width, halfHeight);
    } else {
      const stripeHeight = options.height / colors.length;
      colors.forEach((color, index) => {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y + (index * stripeHeight), options.width, stripeHeight);
      });
    }
    
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, options.width, options.height);
    
    this.ctx.restore();
  }
  
  renderWithEmoji(
    assetId: string,
    x: number,
    y: number,
    options: RenderOptions & { fontSize?: number }
  ): void {
    const flag = this.assetManager.getAsset(assetId) as FlagData;
    if (!flag) return;
    
    this.ctx.save();
    this.ctx.font = `${options.fontSize || 24}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      flag.flag_emoji,
      x + options.width / 2,
      y + options.height / 2
    );
    this.ctx.restore();
  }
  
  async renderBatch(
    renders: Array<{
      assetId: string;
      x: number;
      y: number;
      options: RenderOptions;
    }>
  ): Promise<void> {
    for (const { assetId, x, y, options } of renders) {
      await this.render(assetId, x, y, options);
    }
  }
}