export class AssetManager {
  private static instance: AssetManager;
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  private constructor() {}

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  async loadImage(path: string): Promise<HTMLImageElement> {
    // Check if already loaded
    if (this.imageCache.has(path)) {
      return this.imageCache.get(path)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }

    // Start loading
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.imageCache.set(path, img);
        this.loadingPromises.delete(path);
        resolve(img);
      };
      
      img.onerror = (error) => {
        console.error(`Failed to load image: ${path}`, error);
        this.loadingPromises.delete(path);
        reject(new Error(`Failed to load image: ${path}`));
      };
      
      img.src = path;
    });

    this.loadingPromises.set(path, loadPromise);
    return loadPromise;
  }

  async loadAllVegetableImages(vegetables: Array<{ imagePath: string }>): Promise<void> {
    const loadPromises = vegetables.map(veg => this.loadImage(veg.imagePath));
    await Promise.all(loadPromises);
  }

  getImage(path: string): HTMLImageElement | null {
    return this.imageCache.get(path) || null;
  }

  clearCache(): void {
    this.imageCache.clear();
    this.loadingPromises.clear();
  }
}