import { AssetManager, AssetMetadata } from './AssetManager';

export interface RenderOptions {
  width: number;
  height: number;
  fallbackColors?: string[];
  borderRadius?: number;
  shadowBlur?: number;
  shadowColor?: string;
}

export abstract class AssetRenderer<T extends AssetMetadata = AssetMetadata> {
  protected assetManager: AssetManager<T>;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  
  constructor(assetManager: AssetManager<T>, canvas: HTMLCanvasElement) {
    this.assetManager = assetManager;
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
  }
  
  async render(
    assetId: string, 
    x: number, 
    y: number, 
    options: RenderOptions
  ): Promise<void> {
    const asset = this.assetManager.getAsset(assetId);
    if (!asset) {
      console.warn(`Asset not found: ${assetId}`);
      return;
    }
    
    const image = this.assetManager.getImageFromCache(assetId);
    
    if (image) {
      this.renderImage(image, x, y, options);
    } else {
      this.renderFallback(asset, x, y, options);
    }
  }
  
  protected renderImage(
    image: HTMLImageElement,
    x: number,
    y: number,
    options: RenderOptions
  ): void {
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
    
    this.ctx.drawImage(image, x, y, options.width, options.height);
    this.ctx.restore();
  }
  
  protected abstract renderFallback(
    asset: T,
    x: number,
    y: number,
    options: RenderOptions
  ): void;
  
  clearArea(x: number, y: number, width: number, height: number): void {
    this.ctx.clearRect(x, y, width, height);
  }
  
  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
  }
}