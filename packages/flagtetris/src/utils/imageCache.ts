export class ImageCache {
  private cache: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  async loadImage(src: string): Promise<HTMLImageElement> {
    // Check if already cached
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Load new image
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  get(src: string): HTMLImageElement | undefined {
    return this.cache.get(src);
  }

  has(src: string): boolean {
    return this.cache.has(src);
  }

  async preloadImages(sources: string[]): Promise<void> {
    await Promise.all(sources.map(src => this.loadImage(src).catch(() => {})));
  }
}