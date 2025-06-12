// GDPベースの敵システム

export interface NationData {
  id: string;
  name: string;
  gdp: number; // 10億ドル単位
  flag: string;
  colors: string[];
}

// 簡易版国家データ（後で全250カ国に拡張）
export const NATION_DATABASE: NationData[] = [
  // 超大国
  { id: 'usa', name: 'アメリカ', gdp: 25462, flag: '🇺🇸', colors: ['#B22234', '#FFFFFF', '#3C3B6E'] },
  { id: 'china', name: '中国', gdp: 17963, flag: '🇨🇳', colors: ['#EE1C25', '#FFFF00'] },
  
  // 大国
  { id: 'japan', name: '日本', gdp: 4231, flag: '🇯🇵', colors: ['#FFFFFF', '#BC002D'] },
  { id: 'germany', name: 'ドイツ', gdp: 4072, flag: '🇩🇪', colors: ['#000000', '#FF0000', '#FFD700'] },
  { id: 'india', name: 'インド', gdp: 3732, flag: '🇮🇳', colors: ['#FF9933', '#FFFFFF', '#00A550', '#000080'] },
  { id: 'uk', name: 'イギリス', gdp: 3070, flag: '🇬🇧', colors: ['#012169', '#FFFFFF', '#C8102E'] },
  { id: 'france', name: 'フランス', gdp: 2957, flag: '🇫🇷', colors: ['#002654', '#FFFFFF', '#ED2939'] },
  
  // 中規模国
  { id: 'italy', name: 'イタリア', gdp: 2107, flag: '🇮🇹', colors: ['#00A550', '#FFFFFF', '#FF0000'] },
  { id: 'brazil', name: 'ブラジル', gdp: 2126, flag: '🇧🇷', colors: ['#00A550', '#FFD700', '#002776'] },
  { id: 'canada', name: 'カナダ', gdp: 2139, flag: '🇨🇦', colors: ['#FF0000', '#FFFFFF'] },
  { id: 'south_korea', name: '韓国', gdp: 1709, flag: '🇰🇷', colors: ['#FFFFFF', '#FF0000', '#0033A0'] },
  { id: 'spain', name: 'スペイン', gdp: 1398, flag: '🇪🇸', colors: ['#FF0000', '#FFD700'] },
  { id: 'australia', name: 'オーストラリア', gdp: 1553, flag: '🇦🇺', colors: ['#00008B', '#FFFFFF', '#FF0000'] },
  
  // 小規模国
  { id: 'singapore', name: 'シンガポール', gdp: 497, flag: '🇸🇬', colors: ['#FF0000', '#FFFFFF'] },
  { id: 'ireland', name: 'アイルランド', gdp: 545, flag: '🇮🇪', colors: ['#00A550', '#FFFFFF', '#FF8200'] },
  { id: 'israel', name: 'イスラエル', gdp: 481, flag: '🇮🇱', colors: ['#FFFFFF', '#0066CC'] },
  
  // 極小国
  { id: 'iceland', name: 'アイスランド', gdp: 28, flag: '🇮🇸', colors: ['#003897', '#FFFFFF', '#D72828'] },
  { id: 'malta', name: 'マルタ', gdp: 18, flag: '🇲🇹', colors: ['#FFFFFF', '#FF0000'] },
  { id: 'monaco', name: 'モナコ', gdp: 8, flag: '🇲🇨', colors: ['#FF0000', '#FFFFFF'] },
  { id: 'liechtenstein', name: 'リヒテンシュタイン', gdp: 7, flag: '🇱🇮', colors: ['#002B7F', '#CE1126'] },
  
  // マイクロ国家
  { id: 'nauru', name: 'ナウル', gdp: 0.15, flag: '🇳🇷', colors: ['#002B7F', '#FFD700'] },
  { id: 'tuvalu', name: 'ツバル', gdp: 0.06, flag: '🇹🇻', colors: ['#00BFFF', '#FFD700'] },
];

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
    
    // Waveが進むにつれて大国が出現
    let maxGDP = 10; // 初期は小国のみ
    
    if (wave <= 5) {
      maxGDP = 50;
    } else if (wave <= 10) {
      maxGDP = 500;
    } else if (wave <= 20) {
      maxGDP = 2000;
    } else if (wave <= 30) {
      maxGDP = 5000;
    } else {
      maxGDP = 30000; // 全ての国が出現可能
    }
    
    // GDP制限に基づいて国をフィルタ
    const availableNations = NATION_DATABASE.filter(n => n.gdp <= maxGDP);
    
    // ランダムに選択（同じ国が複数出現可能）
    const enemyCount = Math.min(50, wave * 2 + 3);
    for (let i = 0; i < enemyCount; i++) {
      const randomNation = availableNations[Math.floor(Math.random() * availableNations.length)];
      nations.push(randomNation);
    }
    
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