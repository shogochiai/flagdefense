# GitHub Pagesへのデプロイ方法

Flag DefenceをGitHub Pagesにデプロイする手順です。

## 自動デプロイ（GitHub Actions使用）

1. **GitHubリポジトリを作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/flagdefence.git
   git push -u origin main
   ```

2. **GitHub Pagesを有効化**
   - GitHubリポジトリの Settings → Pages に移動
   - Source: "GitHub Actions" を選択

3. **自動デプロイ**
   - mainブランチにpushすると自動的にデプロイされます
   - Actions タブでデプロイの進行状況を確認できます

4. **アクセス**
   - デプロイ完了後、以下のURLでアクセスできます：
   - `https://YOUR_USERNAME.github.io/flagdefence/`

## 手動デプロイ（gh-pagesパッケージ使用）

1. **gh-pagesをインストール**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **デプロイ実行**
   ```bash
   npm run deploy
   ```

## 重要な設定

### vite.config.ts
```typescript
base: '/flagdefence/', // リポジトリ名に合わせて変更
```

### 画像パスについて
現在、国旗画像は `img/<nationname>.png` というパスで参照されています。
GitHub Pagesでも正しく表示されるように、ベースパスが自動的に追加されます。

## トラブルシューティング

1. **404エラーが出る場合**
   - vite.config.tsのbaseパスがリポジトリ名と一致しているか確認
   - GitHub Pagesが有効になっているか確認

2. **画像が表示されない場合**
   - imgフォルダがgitに含まれているか確認
   - 画像ファイル名が正しいか確認（大文字小文字に注意）

3. **ビルドエラーが出る場合**
   - Node.jsのバージョンが20以上か確認
   - npm ciでクリーンインストールを試す