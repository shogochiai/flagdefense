// GDPベースの敵システム

export interface NationData {
  id: string;
  name: string;
  gdp: number; // 10億ドル単位
  flag: string;
  colors: string[];
}

import { FULL_NATION_DATABASE } from './nations-full-database';

// 全250カ国のデータベースを使用
export const NATION_DATABASE: NationData[] = FULL_NATION_DATABASE.map(nation => ({
  id: nation.id,
  name: nation.name,
  gdp: nation.gdp,
  flag: nation.flag,
  colors: nation.colors
}));

// デバッグ用: 全国家数を確認
console.log(`Total nations in database: ${NATION_DATABASE.length}`);

export class GDPEnemySystem {
  // GDPから敵のHPを計算
  static calculateHP(gdp: number, wave: number, enemyType: 'normal' | 'tank' | 'boss' = 'normal'): number {
    // 基本HP（GDPの平方根を使用してスケーリング）
    const baseHP = Math.max(5, Math.floor(Math.sqrt(gdp) * 10));
    
    // Wave進行による補正（緩やかに上昇）
    const waveFactor = 1 + (wave / 100) * 0.5;
    
    // 敵タイプによる補正
    const typeMultipliers = {
      normal: 1.0,
      tank: 2.0,
      boss: 5.0
    };
    
    return Math.floor(baseHP * waveFactor * typeMultipliers[enemyType]);
  }

  // GDPから報酬を計算
  static calculateReward(gdp: number, enemyType: 'normal' | 'tank' | 'boss' = 'normal'): number {
    // 基本報酬（GDPの対数を使用）
    const baseReward = 10 + Math.floor(Math.log10(gdp + 1) * 5);
    
    // 敵タイプによるボーナス
    const typeBonus = {
      normal: 1.0,
      tank: 2.5,
      boss: 10.0
    };
    
    return Math.floor(baseReward * typeBonus[enemyType]);
  }

  // GDPから移動速度を計算（小国ほど速い）
  static calculateSpeed(gdp: number): number {
    // 大国は遅く、小国は速い
    const baseSpeed = 50;
    const gdpFactor = Math.max(0.5, 1 - Math.log10(gdp + 1) / 10);
    return baseSpeed * gdpFactor;
  }

  // Wave用の国家リストを生成
  static generateWaveNations(wave: number): NationData[] {
    const nations: NationData[] = [];
    
    // Waveに応じた国家の制限（より多様な国家が出現するよう調整）
    let maxGDP = 1; // 初期は極小国のみ
    let minGDP = 0;
    
    if (wave <= 3) {
      maxGDP = 10;      // Wave 1-3: 極小国・マイクロ国家
      minGDP = 0;
    } else if (wave <= 5) {
      maxGDP = 50;      // Wave 4-5: 小国
      minGDP = 0;
    } else if (wave <= 10) {
      maxGDP = 500;     // Wave 6-10: 小～中規模国
      minGDP = 5;
    } else if (wave <= 15) {
      maxGDP = 1000;    // Wave 11-15: 中規模国
      minGDP = 10;
    } else if (wave <= 20) {
      maxGDP = 2000;    // Wave 16-20: 中～大規模国
      minGDP = 50;
    } else if (wave <= 30) {
      maxGDP = 5000;    // Wave 21-30: 大国も含む
      minGDP = 100;
    } else {
      maxGDP = 30000;   // Wave 31+: 全ての国
      minGDP = 200;
    }
    
    // GDP制限に基づいて国をフィルタ
    const availableNations = NATION_DATABASE.filter(n => n.gdp >= minGDP && n.gdp <= maxGDP);
    
    // より多様な国が出るように、重複を減らす
    const enemyCount = Math.min(30, Math.floor(wave * 1.5) + 3);
    const selectedNations = new Set<string>();
    
    for (let i = 0; i < enemyCount; i++) {
      // 未選択の国を優先的に選ぶ（ただし、選択肢がなくなったら重複を許可）
      const unselectedNations = availableNations.filter(n => !selectedNations.has(n.id));
      const pool = unselectedNations.length > 0 ? unselectedNations : availableNations;
      
      const randomNation = pool[Math.floor(Math.random() * pool.length)];
      nations.push(randomNation);
      selectedNations.add(randomNation.id);
    }
    
    // Waveが進むにつれて、より強い国を後ろに配置
    nations.sort((a, b) => a.gdp - b.gdp);
    
    return nations;
  }

  // レアリティ判定
  static getRarity(gdp: number): { tier: string; color: string; stars: number } {
    if (gdp >= 10000) return { tier: 'legendary', color: '#FFD700', stars: 5 };
    if (gdp >= 1000) return { tier: 'epic', color: '#9B30FF', stars: 4 };
    if (gdp >= 100) return { tier: 'rare', color: '#0080FF', stars: 3 };
    if (gdp >= 10) return { tier: 'uncommon', color: '#32CD32', stars: 2 };
    return { tier: 'common', color: '#808080', stars: 1 };
  }
}

// 敵クラス（GDPベース）
export class GDPEnemy {
  id: number;
  nation: NationData;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  pathProgress: number = 0;
  type: 'normal' | 'tank' | 'boss';

  constructor(nation: NationData, wave: number, type: 'normal' | 'tank' | 'boss' = 'normal') {
    this.id = Date.now() + Math.random();
    this.nation = nation;
    this.x = -50;
    this.y = 0;
    this.type = type;
    
    // GDPベースでステータス計算
    this.hp = GDPEnemySystem.calculateHP(nation.gdp, wave, type);
    this.maxHp = this.hp;
    this.speed = GDPEnemySystem.calculateSpeed(nation.gdp);
    this.reward = GDPEnemySystem.calculateReward(nation.gdp, type);
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;
    return this.hp <= 0;
  }

  // サイズもGDPに基づいて変更
  getSize(): number {
    const baseSize = this.type === 'boss' ? 30 : this.type === 'tank' ? 25 : 20;
    const gdpFactor = Math.min(1.5, 1 + Math.log10(this.nation.gdp + 1) / 10);
    return baseSize * gdpFactor;
  }
}