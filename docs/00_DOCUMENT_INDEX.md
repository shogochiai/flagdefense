# Flag Defence ドキュメント読み順ガイド

## 📚 ドキュメント一覧（推奨読み順）

### Phase 1: プロジェクト概要
1. **01_README.md** - プロジェクト全体の概要とゲーム紹介
2. **02_game-specification.md** - ゲームの基本仕様書
3. **03_game-progression-250.md** - 250カ国版のゲーム進行設計

### Phase 2: システム設計
4. **04_class-diagram.md** - システム全体のクラス構造
5. **05_sequence-state-diagrams.md** - シーケンス図と状態遷移図
6. **06_level-design-math.md** - 数学的レベルデザイン理論

### Phase 3: データ設計
7. **07_nations-full-list.ts** - 250カ国の完全データベース
8. **08_nations-gdp-data.ts** - GDP情報と計算ロジック
9. **09_gdp-based-system.md** - GDPベースの敵強度システム

### Phase 4: 機能詳細
10. **10_gacha-tower-system.md** - ガチャとタワーシステム詳細
11. **11_save-system.ts** - セーブデータ管理実装
12. **12_save-select-ui.tsx** - セーブ選択画面UI
13. **13_attack-effects-system.ts** - 国別攻撃エフェクト

### Phase 5: UI/UX設計
14. **14_gacha-ui-design.tsx** - ガチャUIコンポーネント
15. **15_flag-image-system.tsx** - 国旗画像表示システム

### Phase 6: 実装詳細
16. **16_sample.tsx** - プロトタイプ実装（参考）
17. **17_implementation-notes.md** - 実装時の注意点
18. **18_implementation-changes.md** - 変更履歴

### Phase 7: プロジェクト管理
19. **19_cpm-task-breakdown.md** - タスク分解と人員配置
20. **20_test-strategy.md** - テスト戦略と実装

## 🎯 読者別推奨パス

### ゲームデザイナー向け
1, 2, 3, 6, 9, 10 → ゲームメカニクスの理解

### フロントエンドエンジニア向け
1, 4, 11, 12, 14, 15, 16 → UI実装の理解

### バックエンドエンジニア向け
1, 4, 5, 7, 8, 11 → データ構造とロジックの理解

### QAエンジニア向け
1, 2, 5, 20 → テスト観点の理解

### プロジェクトマネージャー向け
1, 19, 20 → プロジェクト全体像の把握

## 📝 ドキュメント更新ルール

1. 新規ドキュメント追加時は番号を付与
2. このINDEXファイルを更新
3. 関連するドキュメントにリンクを追加
4. 変更履歴を **18_implementation-changes.md** に記録

## 🔗 外部リソース

- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

最終更新: 2024年12月