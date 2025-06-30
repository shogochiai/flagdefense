import { AssetManager, AssetMetadata, AssetConfig } from './AssetManager';

export interface FlagData extends AssetMetadata {
  flag_emoji: string;
  gdp_info: {
    gdp_billion_usd: number;
    gdp_tier: string;
    gdp_rank: number;
  };
  game_stats: {
    cost: number;
    damage: number;
    range: number;
    tier: number;
    colors: string[];
  };
  flag_design?: {
    stripes?: number;
    stars?: number;
    main_colors?: string[];
    symbolism?: Record<string, string>;
  };
  trivia?: {
    historical_facts?: string[];
    design_facts?: string[];
  };
  category: string;
  continent: string;
  capital: string;
  population: string;
  area_km2: number;
  independence?: string;
  official_language: string;
  currency: string;
}

export class FlagAssetManager extends AssetManager<FlagData> {
  constructor() {
    const config: AssetConfig = {
      assetType: 'flags',
      basePath: '/flags',
      datasheetPath: '/flags/datasheet.yaml',
      imageFolder: 'img'
    };
    super(config);
  }
  
  getFlagsByTier(tier: number): FlagData[] {
    return this.getAllAssets().filter(flag => 
      flag.game_stats.tier === tier
    );
  }
  
  getFlagsByGdpTier(gdpTier: string): FlagData[] {
    return this.getAllAssets().filter(flag => 
      flag.gdp_info.gdp_tier === gdpTier
    );
  }
  
  getFlagsByContinent(continent: string): FlagData[] {
    return this.getAllAssets().filter(flag => 
      flag.continent === continent
    );
  }
  
  getTopFlagsByGdp(count: number): FlagData[] {
    return this.getAllAssets()
      .sort((a, b) => b.gdp_info.gdp_billion_usd - a.gdp_info.gdp_billion_usd)
      .slice(0, count);
  }
  
  getFlagColors(id: string): string[] {
    const flag = this.getAsset(id);
    return flag?.game_stats.colors || [];
  }
}