# テスト戦略

## テストピラミッド

```
        E2E Tests (Playwright)
              /     \
            10%      \
           /          \
    Integration Tests  \
    (React Testing Library)
           30%           \
          /               \
    Unit Tests             \
    (Jest/Vitest)           \
         60%                 \
```

## 1. 単体テスト (Jest/Vitest)

### 対象コンポーネント

#### ユーティリティ関数
```typescript
// gdp-calculations.test.ts
describe('GDP Calculations', () => {
  test('calculateEnemyHP returns correct HP based on GDP', () => {
    expect(calculateEnemyHP('usa', 1, 'soldier')).toBeGreaterThan(1000);
    expect(calculateEnemyHP('nauru', 1, 'soldier')).toBeLessThan(50);
  });
  
  test('getRarity returns correct tier', () => {
    expect(getRarity(25000).tier).toBe('legendary');
    expect(getRarity(100).tier).toBe('rare');
  });
});
```

#### ゲームロジック
```typescript
// wave-manager.test.ts
describe('WaveManager', () => {
  test('generates correct enemy count', () => {
    const enemies = WaveManager.generateEnemies(5);
    expect(enemies.length).toBeLessThanOrEqual(50);
    expect(enemies.length).toBeGreaterThan(0);
  });
  
  test('increases difficulty properly', () => {
    const wave1HP = getEnemyHPForWave(1, 'soldier');
    const wave10HP = getEnemyHPForWave(10, 'soldier');
    expect(wave10HP).toBeGreaterThan(wave1HP);
  });
});
```

#### セーブシステム
```typescript
// save-manager.test.ts
describe('SaveManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  test('creates new save', () => {
    const save = SaveManager.createSave('Test Save', mockGameData);
    expect(save).toBeDefined();
    expect(save.name).toBe('Test Save');
  });
  
  test('enforces max save limit', () => {
    for (let i = 0; i < 10; i++) {
      SaveManager.createSave(`Save ${i}`, mockGameData);
    }
    const save11 = SaveManager.createSave('Save 11', mockGameData);
    expect(save11).toBeNull();
  });
});
```

## 2. 統合テスト (React Testing Library)

### UIコンポーネント統合

```typescript
// gacha-flow.test.tsx
describe('Gacha Flow Integration', () => {
  test('complete gacha sequence', async () => {
    const { getByText, getByRole } = render(<Game />);
    
    // Wave完了をシミュレート
    act(() => {
      mockWaveComplete();
    });
    
    // ガチャ画面が表示される
    expect(getByText(/NEW!/)).toBeInTheDocument();
    
    // 国家情報が表示される
    expect(getByText(/GDP/)).toBeInTheDocument();
    
    // 閉じるボタンクリック
    fireEvent.click(getByRole('button', { name: '戦場へ配置' }));
    
    // インベントリに追加される
    expect(getByTestId('flag-inventory')).toContainElement(
      getByAltText(/flag/)
    );
  });
});
```

### タワー配置フロー
```typescript
// tower-placement.test.tsx
describe('Tower Placement', () => {
  test('places tower with sufficient coins', async () => {
    const { container } = render(<GameCanvas coins={100} />);
    const canvas = container.querySelector('canvas');
    
    // 国旗選択
    fireEvent.click(getByTestId('nation-japan'));
    
    // キャンバスクリック
    fireEvent.click(canvas, {
      clientX: 300,
      clientY: 200
    });
    
    // タワーが配置される
    expect(mockTowerManager.placedTowers).toHaveLength(1);
    
    // コインが減る
    expect(getByTestId('coins-display')).toHaveTextContent('70');
  });
});
```

## 3. E2Eテスト (Playwright)

### 基本ゲームフロー
```typescript
// game-flow.spec.ts
test.describe('Complete Game Flow', () => {
  test('new player experience', async ({ page }) => {
    await page.goto('/');
    
    // セーブ選択画面
    await expect(page.locator('h1')).toContainText('セーブデータ選択');
    
    // 新規ゲーム作成
    await page.locator('.border-dashed').click();
    await page.fill('input[placeholder="セーブ名を入力"]', 'E2E Test');
    await page.click('button:has-text("作成")');
    
    // ゲーム開始
    await page.click('button:has-text("ゲーム開始")');
    
    // Wave 1 開始
    await expect(page.locator('text=/Wave 0/')).toBeVisible();
    await page.click('button:has-text("Wave開始")');
    
    // 敵の出現を待つ
    await page.waitForTimeout(2000);
    
    // Wave完了を待つ
    await expect(page.locator('text=/NEW!/')).toBeVisible({ timeout: 30000 });
    
    // ガチャ結果を閉じる
    await page.click('button:has-text("戦場へ配置")');
    
    // 獲得した国旗が表示される
    await expect(page.locator('[data-testid="flag-inventory"] img')).toHaveCount(1);
  });
});
```

### セーブ/ロードテスト
```typescript
// save-load.spec.ts
test.describe('Save System', () => {
  test('saves and loads game state', async ({ page }) => {
    // ゲーム進行
    await startNewGame(page);
    await completeWaves(page, 5);
    
    const coinsBefore = await page.locator('[data-testid="coins"]').textContent();
    
    // リロード
    await page.reload();
    
    // セーブ選択
    await page.click('text=/E2E Test/');
    await page.click('button:has-text("ゲーム開始")');
    
    // 状態が復元される
    const coinsAfter = await page.locator('[data-testid="coins"]').textContent();
    expect(coinsAfter).toBe(coinsBefore);
  });
});
```

### パフォーマンステスト
```typescript
// performance.spec.ts
test.describe('Performance', () => {
  test('handles 50 enemies smoothly', async ({ page }) => {
    await startGameAtWave(page, 50);
    
    // FPS測定開始
    const metrics = await page.evaluate(() => {
      return new Promise(resolve => {
        let frames = 0;
        let lastTime = performance.now();
        const startTime = lastTime;
        
        function countFrames() {
          frames++;
          const currentTime = performance.now();
          
          if (currentTime - startTime > 5000) {
            resolve({
              fps: frames / 5,
              totalFrames: frames
            });
          } else {
            requestAnimationFrame(countFrames);
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    });
    
    expect(metrics.fps).toBeGreaterThan(30);
  });
});
```

## 4. ビジュアルレグレッションテスト

```typescript
// visual-regression.spec.ts
test.describe('Visual Regression', () => {
  test('gacha result modal', async ({ page }) => {
    await showGachaResult(page, 'japan');
    await expect(page).toHaveScreenshot('gacha-result-japan.png');
  });
  
  test('game canvas with towers', async ({ page }) => {
    await setupGameWithTowers(page, ['usa', 'japan', 'germany']);
    await expect(page.locator('canvas')).toHaveScreenshot('game-with-towers.png');
  });
});
```

## 5. テスト環境設定

### Jest設定
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/test/mocks/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Playwright設定
```javascript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
```

## 6. CI/CDパイプライン

```yaml
# .github/workflows/test.yml
name: Test Pipeline

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration
      
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run dev &
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## テスト実行コマンド

```bash
# 単体テスト
npm run test:unit

# 統合テスト
npm run test:integration

# E2Eテスト
npm run test:e2e

# 全テスト実行
npm run test:all

# カバレッジレポート
npm run test:coverage

# ウォッチモード
npm run test:watch
```