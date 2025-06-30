# ゲームプログレッション設計（250カ国版）

## 国家分類システム

### 6ティア構成
- **Tier 1**: 未承認・極小国家（9カ国）- コスト10-50
- **Tier 2**: 部分承認国家（10カ国）- コスト60-150
- **Tier 3**: 自治地域・特別地域（36カ国）- コスト160-400
- **Tier 4**: 広く認知された地域・小国（40カ国）- コスト410-800
- **Tier 5**: 小規模国家（50カ国）- コスト810-1500
- **Tier 6**: 中規模国家・大国（105カ国）- コスト1510-2500

## プログレッションシステム

### Wave進行による解放
```
Wave 1-2: Tier 1の一部解放（3カ国）
Wave 3-5: Tier 1全解放（9カ国）
Wave 6-10: Tier 2解放（19カ国）
Wave 11-15: Tier 3の前半解放（37カ国）
Wave 16-20: Tier 3全解放（55カ国）
Wave 21-25: Tier 4の前半解放（75カ国）
Wave 26-30: Tier 4全解放（95カ国）
Wave 31-40: Tier 5の前半解放（120カ国）
Wave 41-50: Tier 5全解放（145カ国）
Wave 51-75: Tier 6の前半解放（195カ国）
Wave 76-100: Tier 6全解放（250カ国）
```

### 解放ペース
- 初期（Wave1-10）: 1-2カ国/Wave
- 前期（Wave11-30）: 2-3カ国/Wave
- 中期（Wave31-50）: 2-3カ国/Wave
- 後期（Wave51-75）: 2カ国/Wave
- 終盤（Wave76-100）: 2カ国/Wave

## 難易度カーブ

### コイン獲得ペース
```javascript
// Wave報酬の基本式
const getWaveReward = (wave) => {
  const baseReward = 50;
  const waveMultiplier = Math.floor(wave / 10) * 0.2 + 1;
  const enemyCount = Math.min(50, wave + 9);
  return Math.floor(baseReward * waveMultiplier * enemyCount);
};

// パッシブインカム
const getPassiveIncome = (wave) => {
  return Math.floor(wave / 5) + 1; // 5Wave毎に+1
};
```

### 理論火力の成長
```
Wave 1-10: 2-50 DPS
Wave 11-20: 50-150 DPS
Wave 21-30: 150-300 DPS
Wave 31-40: 300-500 DPS
Wave 41-50: 500-800 DPS
Wave 51-75: 800-1500 DPS
Wave 76-100: 1500-3000 DPS
```

## UI改善案

### 国家選択UI
1. **タブ分け**: Tier別タブ（6タブ）
2. **フィルター機能**:
   - 地域別（アジア、ヨーロッパ、アフリカ等）
   - 購入可能のみ表示
   - お気に入り機能
3. **検索機能**: 国名検索
4. **ソート機能**:
   - コスト順
   - DPS順
   - 効率順（DPS/コスト）

### 進捗表示
- 解放済み国家数: 15/250
- 次の解放まで: Wave 18で3カ国解放
- コレクション達成率: 6%

## ゲームバランス調整

### 敵のスケーリング
```javascript
// 敵HP計算（250カ国対応版）
const getEnemyHP = (wave, enemyType) => {
  const tierUnlocked = Math.min(6, Math.ceil(wave / 15));
  const baseHP = 10 + wave * 5;
  
  const typeMultipliers = {
    soldier: 1.0,
    jet: 0.8,
    tank: 2.0,
    elite: 3.0,
    boss: 5.0
  };
  
  return Math.floor(baseHP * typeMultipliers[enemyType]);
};
```

### Wave構成
- Wave 1-25: 基礎段階（soldier, jet, tank）
- Wave 26-50: 発展段階（elite出現率20%）
- Wave 51-75: 高難度段階（elite出現率40%）
- Wave 76-100: エンドゲーム（boss頻出）

## エンドゲームコンテンツ

### Wave 100以降
- 無限Wave継続可能
- 全国家解放後は「プレステージ」システム
- 国家の強化要素追加
- リーダーボード実装

### 実績システム
- 地域制覇（各大陸の全国家解放）
- 効率プレイ（最少Waveで全国家解放）
- 完全制覇（全250カ国解放）