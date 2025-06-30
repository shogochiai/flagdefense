# 国旗画像システム実装メモ

## ファイル構成
```
/img/
  ├── usa.png          # アメリカ国旗
  ├── japan.png        # 日本国旗
  ├── china.png        # 中国国旗
  ├── germany.png      # ドイツ国旗
  ├── uk.png           # イギリス国旗
  ├── france.png       # フランス国旗
  ├── ...              # その他250カ国分
  └── [nationId].png   # 国家IDと同名のPNGファイル
```

## 画像仕様
- **推奨サイズ**: 60x40px または 90x60px（3:2比率）
- **ファイル形式**: PNG（透過なし推奨）
- **命名規則**: 国家IDと完全一致（小文字、アンダースコア区切り）

## 実装済み機能

### 1. 画像キャッシュシステム
- 一度ロードした画像はメモリに保持
- 高速な再描画が可能

### 2. フォールバック機能
- 画像が見つからない場合は色パターンで代替表示
- 各国家のcolors配列を使用して国旗風に描画

### 3. プリロード機能
- ゲーム開始時に必要な国旗を事前読み込み
- ロード進捗の取得が可能

### 4. Canvas描画対応
- drawFlagOnCanvas関数で簡単に国旗を描画
- 影や枠線の自動追加

### 5. React コンポーネント
- FlagImageコンポーネントでUI表示
- エラーハンドリング付き

## 使用方法

### ゲーム内での実装例
```javascript
// ゲーム開始時のプリロード
useEffect(() => {
  const priorityNations = ['usa', 'japan', 'china', 'germany', 'uk'];
  FlagImageSystem.preloadFlags(priorityNations);
}, []);

// Canvas内での描画
const gameLoop = () => {
  // タワーの描画
  placedTowers.forEach(tower => {
    const nation = nations.find(n => n.id === tower.nationId);
    drawFlagOnCanvas(ctx, tower.nationId, tower.x, tower.y, 40, 30, nation.colors);
  });
  
  // 敵の描画
  enemies.forEach(enemy => {
    drawFlagOnCanvas(ctx, enemy.nationId, enemy.x, enemy.y, 30, 20, enemy.colors);
  });
};

// UIでの表示
<FlagImage 
  nationId="japan" 
  width={30} 
  height={20}
  fallback={<span>🇯🇵</span>}
/>
```

## パフォーマンス考慮事項

1. **選択的プリロード**
   - 全250カ国を一度にロードせず、必要に応じて段階的に読み込む
   - 現在のWaveで使用する国旗のみプリロード

2. **画像サイズ最適化**
   - 実際の表示サイズに合わせて画像を最適化
   - 大きすぎる画像は避ける

3. **キャッシュ管理**
   - メモリ使用量が多い場合は古い画像を解放する仕組みを検討

## エラーハンドリング

1. **画像が存在しない場合**
   - colors配列による自動フォールバック
   - コンソールに警告を出力（本番環境では抑制推奨）

2. **ロード失敗時**
   - 再試行はしない（パフォーマンスのため）
   - フォールバック表示を継続

## 今後の拡張案

1. **SVG対応**
   - より軽量で拡大縮小に強い
   - 動的な色変更が可能

2. **スプライトシート**
   - 全国旗を1枚の画像にまとめる
   - HTTPリクエスト数の削減

3. **WebP形式対応**
   - より高い圧縮率
   - ブラウザサポートの確認が必要