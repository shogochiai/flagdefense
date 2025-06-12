# Flag Defence - プロジェクトドキュメント

## 📁 ドキュメント構成

### 1. [ゲーム仕様書](./game-specification.md)
- ゲームの基本コンセプト
- 20カ国の初期国家データ
- ゲームシステムの詳細
- バランス設計

### 2. アーキテクチャドキュメント
- [クラス図](./architecture/class-diagram.md) - システム全体のクラス構造
- [シーケンス図](./architecture/sequence-diagram.md) - 主要な処理フロー
- [状態図](./architecture/state-diagram.md) - ゲームオブジェクトの状態遷移

### 3. プロジェクト管理
- [CPMタスク分解](./project-management/cpm-breakdown.md) - Critical Path Methodによるタスク管理
- チーム編成案
- リスク管理計画

### 4. [テスト戦略](./testing/test-strategy.md)
- テストピラミッド（Unit 60%, Integration 30%, E2E 10%）
- Playwright E2Eテスト
- React Testing Library ユニットテスト
- パフォーマンステスト

### 5. 技術仕様
- [250カ国データベース](./nations-full-list.ts) - 全世界の国家データ

## 🎮 ゲーム概要

**Flag Defence**は、世界各国の国旗をタワーとして配置し、GDPに基づいた強さを持つ敵から基地を守るタワーディフェンスゲームです。

### 主な特徴
- 🌍 250以上の実在国家が登場
- 💰 GDP基準の敵の強さとバランス
- 🎰 ガチャシステムで国家を収集
- 🛒 ショップでパワーアップ購入
- 💾 10個のセーブスロット
- 🎯 国家別の特殊能力

## 🛠️ 技術スタック

- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **ゲーム描画**: HTML5 Canvas API
- **状態管理**: React Hooks
- **データ永続化**: LocalStorage
- **テスト**: Vitest + Playwright

## 📊 開発フロー

```mermaid
graph LR
    A[仕様策定] --> B[プロトタイプ]
    B --> C[Tidy First開発]
    C --> D[機能実装]
    D --> E[統合テスト]
    E --> F[最適化]
    F --> G[リリース]
```

## 🚀 今後の拡張予定

1. **マルチプレイヤー対戦**
2. **シーズンイベント**
3. **実績システム**
4. **リーダーボード**
5. **モバイル対応**

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。