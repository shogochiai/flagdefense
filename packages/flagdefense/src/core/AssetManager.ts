import yaml from 'js-yaml';

export interface AssetMetadata {
  id: string;
  japanese_name: string;
  japanese_reading: string;
  english_name: string;
  image_path: string;
  [key: string]: any;
}

export interface AssetConfig {
  assetType: 'flags' | 'vegetables' | string;
  basePath: string;
  datasheetPath: string;
  imageFolder: string;
}

export class AssetManager<T extends AssetMetadata = AssetMetadata> {
  private assets: Map<string, T> = new Map();
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private config: AssetConfig;
  
  constructor(config: AssetConfig) {
    this.config = config;
  }
  
  async loadAssets(): Promise<void> {
    try {
      console.log('Loading assets from:', this.config.datasheetPath);
      const response = await fetch(this.config.datasheetPath);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch datasheet: ${response.status} ${response.statusText}`);
      }
      
      let yamlText = await response.text();
      console.log('YAML loaded, length:', yamlText.length);
      
      // Fix known issue in datasheet - Kosovo entry missing "- id:" prefix
      yamlText = yamlText.replace(
        /currency: "香港ドル（HKD）"\n    japanese_name: "コソボ共和国"/,
        'currency: "香港ドル（HKD）"\n\n  - id: "kosovo"\n    japanese_name: "コソボ共和国"'
      );
      
      let data: any;
      try {
        data = yaml.load(yamlText);
        console.log('Parsed YAML data:', Object.keys(data || {}));
      } catch (yamlError) {
        console.error('YAML parsing error:', yamlError);
        if (yamlError instanceof Error) {
          console.error('YAML error message:', yamlError.message);
          console.error('Error around:', yamlError.message.substring(0, 500));
        }
        throw yamlError;
      }
      
      const assetArray = data[this.config.assetType] || [];
      console.log(`Found ${assetArray.length} ${this.config.assetType}`);
      
      for (const asset of assetArray) {
        this.assets.set(asset.id, asset);
      }
      
      console.log('Assets loaded successfully');
    } catch (error) {
      console.error('Error loading assets:', error);
      throw error;
    }
  }
  
  getAsset(id: string): T | undefined {
    return this.assets.get(id);
  }
  
  getAllAssets(): T[] {
    return Array.from(this.assets.values());
  }
  
  getAssetImagePath(id: string): string {
    const asset = this.getAsset(id);
    if (!asset) return '';
    
    return `${this.config.basePath}/${asset.image_path}`;
  }
  
  async preloadImage(id: string): Promise<HTMLImageElement | null> {
    if (this.imageCache.has(id)) {
      return this.imageCache.get(id)!;
    }
    
    const imagePath = this.getAssetImagePath(id);
    if (!imagePath) return null;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(id, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = imagePath;
    });
  }
  
  async preloadAllImages(): Promise<void> {
    const promises = Array.from(this.assets.keys()).map(id => 
      this.preloadImage(id)
    );
    await Promise.all(promises);
  }
  
  getImageFromCache(id: string): HTMLImageElement | undefined {
    return this.imageCache.get(id);
  }
}