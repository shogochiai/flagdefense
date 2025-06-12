# ガチャ＆国旗タワーディフェンスシステム

## コアコンセプト
- Waveクリア = 1回ガチャ
- 獲得した国の国旗のみ配置可能
- 国旗は重複なし（コレクション要素）
- ショップでパワーアップアイテム購入

## ガチャシステム

### 基本仕様
```javascript
const gachaSystem = {
  // 未獲得の国からランダムに1つ選択
  pullGacha: (ownedNations: string[], allNations: Nation[]) => {
    const available = allNations.filter(n => !ownedNations.includes(n.id));
    if (available.length === 0) return null; // 全て獲得済み
    
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  },
  
  // レアリティ（GDP基準）
  getRarity: (gdp: number) => {
    if (gdp >= 10000) return { tier: 'legendary', color: '#FFD700', stars: 5 };
    if (gdp >= 1000) return { tier: 'epic', color: '#9B30FF', stars: 4 };
    if (gdp >= 100) return { tier: 'rare', color: '#0080FF', stars: 3 };
    if (gdp >= 10) return { tier: 'uncommon', color: '#32CD32', stars: 2 };
    return { tier: 'common', color: '#808080', stars: 1 };
  }
};
```

### ガチャ演出
- Wave クリア → 画面中央にガチャ演出
- 国旗がスピンして徐々に減速
- レアリティに応じたエフェクト（虹演出など）
- 獲得国の情報表示（GDP、攻撃タイプなど）

## 国旗タワーシステム

### 配置ルール
- 獲得した国旗のみ配置可能
- 同じ国旗を複数配置可能（レベルシステム）
- 配置済み国旗の移動・回収可能

### 国旗パラメータ
```javascript
const flagTowerStats = {
  // 基本ステータス（GDPベース）
  getBaseStats: (nationId: string, gdp: number) => {
    const tier = getGDPTier(gdp);
    return {
      damage: Math.floor(Math.sqrt(gdp) * 2),
      range: 100 + Math.floor(Math.log10(gdp + 1) * 20),
      attackSpeed: 1000 - Math.min(500, gdp / 50), // ms
      piercing: gdp >= 1000 ? 2 : 1, // 貫通数
    };
  },
  
  // 特殊能力（地域・文化別）
  getSpecialAbility: (nationId: string) => {
    const abilities = {
      // 軍事大国
      usa: { type: 'multishot', value: 3 },
      russia: { type: 'aoe', radius: 50 },
      china: { type: 'rapid_fire', multiplier: 2 },
      
      // 経済大国
      japan: { type: 'money_boost', percent: 20 },
      germany: { type: 'efficiency', costReduction: 15 },
      switzerland: { type: 'interest', coinsPerSecond: 5 },
      
      // 技術先進国
      south_korea: { type: 'laser', penetration: true },
      singapore: { type: 'smart_targeting', priorityHigh: true },
      israel: { type: 'iron_dome', missileDefense: true },
      
      // 資源国
      saudi_arabia: { type: 'oil_bomb', burnDamage: 10 },
      australia: { type: 'mining_boost', resourceMultiplier: 1.5 },
      norway: { type: 'freeze', slowPercent: 50 },
      
      // 島国
      maldives: { type: 'tsunami', waveDamage: true },
      fiji: { type: 'healing_aura', regen: 5 },
      iceland: { type: 'volcanic', lavaDamage: true },
      
      // 小国特殊
      vatican: { type: 'holy_damage', bonusVsEvil: 200 },
      monaco: { type: 'gambling', critChance: 25 },
      liechtenstein: { type: 'banking', interestRate: 10 }
    };
    
    return abilities[nationId] || { type: 'standard' };
  }
};
```

## 攻撃エフェクトシステム

### エフェクトタイプ
```javascript
const attackEffects = {
  // 通常攻撃
  standard: (ctx, from, to) => {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    drawLine(ctx, from, to);
  },
  
  // レーザー
  laser: (ctx, from, to) => {
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00FFFF';
    drawLine(ctx, from, to);
  },
  
  // 爆発
  explosion: (ctx, position, radius) => {
    const gradient = ctx.createRadialGradient(
      position.x, position.y, 0,
      position.x, position.y, radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 128, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillCircle(position.x, position.y, radius);
  },
  
  // ミサイル
  missile: (ctx, from, to, progress) => {
    const x = from.x + (to.x - from.x) * progress;
    const y = from.y + (to.y - from.y) * progress;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x - 5, y - 2, 10, 4);
    // 煙跡
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    ctx.fillCircle(x - 10, y, 3);
  },
  
  // 氷結
  freeze: (ctx, target) => {
    ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
    ctx.fillRect(target.x - 20, target.y - 20, 40, 40);
    // 氷の結晶
    drawSnowflake(ctx, target.x, target.y, 15);
  }
};
```

## アップグレードシステム

### ショップアイテム
```javascript
const shopItems = {
  // 汎用アップグレード
  damage_boost: {
    name: '攻撃力強化',
    cost: 100,
    effect: { damage: '+20%' },
    maxLevel: 10
  },
  
  range_extender: {
    name: '射程延長',
    cost: 150,
    effect: { range: '+15%' },
    maxLevel: 8
  },
  
  attack_speed: {
    name: '攻撃速度上昇',
    cost: 200,
    effect: { attackSpeed: '-10%' },
    maxLevel: 5
  },
  
  // 特殊アップグレード
  multishot: {
    name: 'マルチショット',
    cost: 500,
    effect: { targets: '+1' },
    maxLevel: 3,
    requirement: { gdp: 1000 }
  },
  
  piercing: {
    name: '貫通弾',
    cost: 300,
    effect: { piercing: '+1' },
    maxLevel: 5
  },
  
  explosive: {
    name: '爆発弾',
    cost: 800,
    effect: { aoeRadius: 30 },
    maxLevel: 1,
    requirement: { gdp: 5000 }
  },
  
  // レア強化
  golden_flag: {
    name: '金の国旗',
    cost: 2000,
    effect: { allStats: '+50%', goldGeneration: true },
    maxLevel: 1,
    requirement: { stars: 50 } // 50カ国獲得
  }
};
```

## 国別特殊演出例

### アメリカ（USA）
- 攻撃: 星条旗模様のミサイル
- 効果: 3方向同時攻撃
- 音: イーグルの鳴き声

### 日本（Japan）
- 攻撃: 桜吹雪エフェクト
- 効果: 撃破時にボーナスコイン
- 音: 和太鼓

### ロシア（Russia）
- 攻撃: 雪の結晶
- 効果: 範囲凍結攻撃
- 音: バラライカ

### ブラジル（Brazil）
- 攻撃: サッカーボール
- 効果: 跳ね返り攻撃
- 音: サンバのリズム

### エジプト（Egypt）
- 攻撃: ピラミッド型レーザー
- 効果: 貫通＋呪い効果
- 音: 砂嵐

## プログレッション要素

### コレクション報酬
- 10カ国: 攻撃力+10%（全体）
- 25カ国: 新エフェクト解放
- 50カ国: レジェンダリーアップグレード解放
- 100カ国: 特殊モード解放
- 150カ国: ∞Wave解放
- 200カ国: 真エンディング
- 250カ国: 完全制覇称号

### 地域コンプリート
- アジア制覇: アジア国家の攻撃力+20%
- ヨーロッパ制覇: 射程+15%
- アフリカ制覇: 資源獲得+30%
- 南米制覇: 特殊能力クールダウン-20%
- オセアニア制覇: Wave開始時ボーナス

## バランス設計

### GDP別の役割
- **超大国**（GDP 10兆+）: 高火力・高コスト
- **大国**（GDP 1-10兆）: バランス型
- **中堅国**（GDP 1000億-1兆）: 特殊能力特化
- **小国**（GDP 100億-1000億）: 低コスト・補助特化
- **極小国**（GDP 100億未満）: ユニーク能力・ネタ枠

これにより、どの国を引いても活用方法があり、コレクション要素と戦略性を両立します。