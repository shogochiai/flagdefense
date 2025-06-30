# Asset Abstraction Guide for VeggieDefense

This document explains how the asset abstraction layer in flagdefense-v2 works and how to adapt it for veggiedefense.

## Core Architecture

The abstraction layer consists of four main components:

### 1. AssetManager (Base Class)
Located in `src/core/AssetManager.ts`

This is the generic asset management class that handles:
- Loading asset metadata from YAML files
- Caching images
- Providing asset lookup methods

Key features:
- Generic type parameter `T extends AssetMetadata` allows for custom asset types
- Configurable through `AssetConfig` interface
- Built-in image preloading and caching

### 2. AssetRenderer (Base Class)
Located in `src/core/AssetRenderer.ts`

Abstract renderer that provides:
- Canvas-based rendering with fallback support
- Configurable render options (size, shadows, borders)
- Abstract `renderFallback` method for custom fallback rendering

### 3. Specific Implementations

#### FlagAssetManager
Extends AssetManager with flag-specific functionality:
- Filtering by tier, GDP tier, continent
- Flag color extraction
- Game stat access

#### FlagRenderer
Extends AssetRenderer with flag-specific rendering:
- Color-based fallback rendering (stripes)
- Emoji rendering support
- Batch rendering capabilities

## Creating VeggieDefense

To create veggiedefense using this pattern:

### 1. Create VegetableAssetManager

```typescript
import { AssetManager, AssetMetadata, AssetConfig } from './AssetManager';

export interface VegetableData extends AssetMetadata {
  physical_properties: {
    length_cm: string;
    weight_g: string;
    shape: string;
    color: string;
  };
  nutritional_info: {
    main_nutrients: string;
    health_benefits: string;
    calories: number;
  };
  game_stats: {
    cost: number;
    damage: number;
    range: number;
    tier: number;
    effect_type: 'splash' | 'slow' | 'poison' | 'normal';
  };
  category: string;
  subcategory: string;
  scientific_name: string;
  family: string;
}

export class VegetableAssetManager extends AssetManager<VegetableData> {
  constructor() {
    const config: AssetConfig = {
      assetType: 'vegetables',
      basePath: '/vegetables',
      datasheetPath: '/vegetables/datasheet.yaml',
      imageFolder: 'img'
    };
    super(config);
  }
  
  getVegetablesByCategory(category: string): VegetableData[] {
    return this.getAllAssets().filter(veg => 
      veg.category === category
    );
  }
  
  getVegetablesByNutrient(nutrient: string): VegetableData[] {
    return this.getAllAssets().filter(veg => 
      veg.nutritional_info.main_nutrients.toLowerCase().includes(nutrient.toLowerCase())
    );
  }
}
```

### 2. Create VegetableRenderer

```typescript
export class VegetableRenderer extends AssetRenderer<VegetableData> {
  protected renderFallback(
    vegetable: VegetableData,
    x: number,
    y: number,
    options: RenderOptions
  ): void {
    // Custom vegetable fallback rendering
    // Could show a colored circle/shape based on vegetable properties
    const color = this.getVegetableColor(vegetable);
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(
      x + options.width / 2,
      y + options.height / 2,
      Math.min(options.width, options.height) / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }
  
  private getVegetableColor(vegetable: VegetableData): string {
    // Extract primary color from vegetable data
    const colorMap: Record<string, string> = {
      'red': '#FF6B6B',
      'green': '#51CF66',
      'orange': '#FF922B',
      'yellow': '#FFD43B',
      'purple': '#845EF7'
    };
    
    const color = vegetable.physical_properties.color.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (color.includes(key)) return value;
    }
    return '#CCC';
  }
}
```

### 3. Adapt Game Entities

Replace flag references with vegetable references in Tower and Enemy classes:
- Change `FlagData` to `VegetableData`
- Change `FlagRenderer` to `VegetableRenderer`
- Update game mechanics to use vegetable properties

### 4. Update Configuration

In `vite.config.ts`, ensure the publicDir points to the assets folder:
```typescript
publicDir: '../assets'
```

## Key Benefits

1. **Reusability**: Core logic is shared between flag and vegetable versions
2. **Type Safety**: Generic types ensure proper typing throughout
3. **Extensibility**: Easy to add new asset types or game mechanics
4. **Separation of Concerns**: Asset management is separate from game logic
5. **Performance**: Built-in caching and preloading

## Migration Checklist

- [ ] Copy flagdefense-v2 to veggiedefense
- [ ] Create VegetableData interface matching datasheet.yaml
- [ ] Implement VegetableAssetManager
- [ ] Implement VegetableRenderer
- [ ] Update game entities to use vegetable types
- [ ] Adjust game balance for vegetable theme
- [ ] Update UI text and styling
- [ ] Test all functionality

This abstraction pattern makes it easy to create themed variations of the tower defense game while maintaining code quality and reusability.