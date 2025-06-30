# GDPベース国力システム設計

## 基本概念
各国の敵の強さ（HP）をGDP（国内総生産）に比例させることで、リアルな経済力を反映したゲームバランスを実現。

## GDP階層と基本HP計算

### GDP階層分類
```javascript
// GDP階層（10億ドル単位）
const gdpTiers = {
  micro: { min: 0, max: 0.1, baseHP: 10 },        // < 1億ドル
  tiny: { min: 0.1, max: 1, baseHP: 20 },         // 1億-10億ドル
  small: { min: 1, max: 10, baseHP: 40 },         // 10億-100億ドル
  medium: { min: 10, max: 100, baseHP: 80 },      // 100億-1000億ドル
  large: { min: 100, max: 1000, baseHP: 160 },    // 1000億-1兆ドル
  major: { min: 1000, max: 10000, baseHP: 320 },  // 1兆-10兆ドル
  super: { min: 10000, max: 100000, baseHP: 640 } // 10兆ドル以上
};

// HP計算式
const calculateHP = (gdpBillion, waveNumber) => {
  const tier = getGDPTier(gdpBillion);
  const gdpFactor = Math.sqrt(gdpBillion) / 10; // GDP の平方根でスケーリング
  const waveFactor = 1 + (waveNumber / 100);    // Wave進行で緩やかに上昇
  
  return Math.floor(tier.baseHP * gdpFactor * waveFactor);
};
```

## 国家別GDP例（2023年推定、10億ドル）

### 超大国（10兆ドル以上）
- アメリカ: 25,000 → HP: 1000-2000
- 中国: 17,000 → HP: 800-1600
- 日本: 4,200 → HP: 400-800
- ドイツ: 4,000 → HP: 400-800

### 大国（1兆-10兆ドル）
- イギリス: 3,100 → HP: 350-700
- フランス: 2,900 → HP: 340-680
- インド: 3,700 → HP: 380-760
- イタリア: 2,100 → HP: 290-580

### 中規模国（1000億-1兆ドル）
- スペイン: 1,400 → HP: 240-480
- 韓国: 1,700 → HP: 260-520
- オーストラリア: 1,500 → HP: 250-500
- メキシコ: 1,400 → HP: 240-480

### 小規模国（100億-1000億ドル）
- シンガポール: 500 → HP: 140-280
- イスラエル: 480 → HP: 140-280
- UAE: 450 → HP: 130-260
- ニュージーランド: 250 → HP: 100-200

### 極小国（10億ドル未満）
- モナコ: 8 → HP: 35-70
- リヒテンシュタイン: 7 → HP: 35-70
- サンマリノ: 2 → HP: 25-50
- ナウル: 0.15 → HP: 10-20

## 報酬とコストのバランス

### 撃破報酬
```javascript
const calculateReward = (gdpBillion) => {
  const baseReward = 10;
  const gdpBonus = Math.log10(gdpBillion + 1) * 5;
  return Math.floor(baseReward + gdpBonus);
};
```

### タワーコスト調整
```javascript
// GDP比例でタワーコストも調整
const calculateTowerCost = (baseGDP, towerTier) => {
  const tierMultiplier = [1, 2, 4, 8, 16, 32][towerTier - 1];
  const gdpFactor = Math.sqrt(baseGDP) / 100;
  return Math.floor(50 * tierMultiplier * (1 + gdpFactor));
};
```

## 残機システム

### 基本仕様
- 初期残機: 3
- 最大残機: 9
- 基地HPが0になると残機を1消費して復活
- 復活時、画面上の敵は全て消滅
- 残機0でゲームオーバー

### 残機価格
```javascript
const getLifePrice = (currentLives, waveNumber) => {
  const basePrice = 500;
  const multiplier = Math.pow(1.5, currentLives - 3); // 購入するほど高額に
  const waveBonus = Math.floor(waveNumber / 10) * 100;
  return Math.floor(basePrice * multiplier + waveBonus);
};

// 例：
// 3→4機目: 500コイン
// 4→5機目: 750コイン
// 5→6機目: 1125コイン
// 6→7機目: 1688コイン
```

## Wave設計（25秒制限）

### 敵の出現パターン
```javascript
const generateWaveEnemies = (waveNumber, targetCountries) => {
  const enemies = [];
  const spawnInterval = 500; // 0.5秒間隔
  const maxEnemies = 50;     // 最大50体（25秒で完了）
  
  // GDP順にソートして、弱い国から強い国へ
  const sortedCountries = targetCountries.sort((a, b) => a.gdp - b.gdp);
  
  // 前半: 弱い国（60%）
  // 中盤: 中堅国（30%）
  // 終盤: 強国（10%）
  
  return enemies;
};
```

### Wave進行の急激な変化への対処
```javascript
// GDP階層が変わるWaveでの警告
const checkDifficultySpike = (currentWave, nextWave) => {
  const currentMaxGDP = getMaxGDPForWave(currentWave);
  const nextMaxGDP = getMaxGDPForWave(nextWave);
  
  if (nextMaxGDP / currentMaxGDP > 5) {
    return {
      warning: true,
      message: "次のWaveから大国が出現します！残機の準備を！",
      recommendedLives: 5
    };
  }
  return { warning: false };
};
```

## 難易度曲線の例

### Wave 1-10: マイクロ国家
- 平均GDP: 0.1-10億ドル
- 敵HP: 10-50
- 残機消費: ほぼなし

### Wave 11-25: 小国
- 平均GDP: 10-100億ドル
- 敵HP: 50-200
- 残機消費: 0-1回

### Wave 26-40: 中堅国
- 平均GDP: 100-500億ドル
- 敵HP: 200-500
- 残機消費: 1-2回

### Wave 41-60: 地域大国
- 平均GDP: 500-1000億ドル
- 敵HP: 500-1000
- 残機消費: 2-3回（ここで残機購入推奨）

### Wave 61-80: 経済大国
- 平均GDP: 1000-5000億ドル
- 敵HP: 1000-2000
- 残機消費: 3-4回

### Wave 81-100: 超大国
- 平均GDP: 5000億ドル以上
- 敵HP: 2000-5000
- 残機消費: 4-5回（残機必須）

## バランス調整のポイント

1. **GDP急上昇への対策**
   - 残機システムで継続可能に
   - 事前警告で準備期間を提供
   - 残機購入の戦略的タイミング

2. **25秒制限の実現**
   - 敵の出現間隔: 0.5秒
   - 最大敵数: 50体/Wave
   - 高HP敵は少数精鋭で配置

3. **経済的リアリティ**
   - 実際のGDPデータを反映
   - 経済規模と軍事力の相関を表現
   - 小国から超大国への段階的成長