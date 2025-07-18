# FlagTetris

国旗を使った教育的なテトリスゲーム

## 概要

FlagTetrisは、世界の国旗を使った教育的なテトリスゲームです。プレイヤーは国旗ブロックを操作しながら、各国の名前、位置、基本情報を学ぶことができます。

## ゲームの特徴

- **国旗ブロック**: テトロミノは世界各国の国旗で構成されています
- **教育要素**: ブロックが配置されると、その国の情報が表示されます
- **進行度**: ゲームが進むにつれて、より多くの国が登場します
- **スコアシステム**: ラインを消すだけでなく、国名を正しく答えることでボーナスポイント

## 技術仕様

- **フレームワーク**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: CSS Modules
- **国旗データ**: packages/assets/flags/datasheet.yaml を使用

## ゲームルール

### 基本操作
- **←/→**: ブロックを左右に移動
- **↓**: ソフトドロップ（落下速度アップ）
- **↑**: ブロックを回転
- **スペース**: ハードドロップ（即座に落下）
- **P**: ポーズ/再開

### スコアリング
- 1ライン消去: 100点
- 2ライン同時消去: 300点
- 3ライン同時消去: 500点
- 4ライン同時消去（テトリス）: 800点
- 国名正解ボーナス: +50点

### 教育モード
- ブロックが配置されると、その国の情報がサイドパネルに表示
- オプションで国名クイズモードを有効化可能

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## プロジェクト構成

```
FlagTetris/
├── src/
│   ├── components/     # UIコンポーネント
│   ├── core/          # ゲームロジック
│   ├── hooks/         # カスタムフック
│   ├── types/         # TypeScript型定義
│   ├── utils/         # ユーティリティ関数
│   └── App.tsx        # メインアプリケーション
├── public/            # 静的アセット
├── package.json
└── vite.config.ts
```