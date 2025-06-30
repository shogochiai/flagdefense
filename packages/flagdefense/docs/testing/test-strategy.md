# Flag Defence - テスト戦略

## テストピラミッド構成

```
         /\
        /E2E\      10% - End-to-End Tests (Playwright)
       /------\
      /  統合  \    30% - Integration Tests
     /----------\
    /   ユニット  \  60% - Unit Tests (React Testing Library + Vitest)
   /--------------\
```

## 1. ユニットテスト (60%)

### 対象コンポーネント

#### ゲームロジック
```typescript
// gdp-enemy-system.test.ts
describe('GDPEnemySystem', () => {
  describe('calculateHP', () => {
    it('小国（GDP < 10）の基本HPが最小値5以上', () => {
      const hp = GDPEnemySystem.calculateHP(0.5, 1, 'normal');
      expect(hp).toBeGreaterThanOrEqual(5);
    });
    
    it('大国（GDP > 10000）のHPが適切にスケール', () => {
      const hp = GDPEnemySystem.calculateHP(25000, 1, 'normal');
      expect(hp).toBeGreaterThan(1000);
    });
    
    it('Boss敵のHPが通常の5倍', () => {
      const normalHP = GDPEnemySystem.calculateHP(100, 1, 'normal');
      const bossHP = GDPEnemySystem.calculateHP(100, 1, 'boss');
      expect(bossHP).toBe(normalHP * 5);
    });
  });
});

// nation-abilities.test.ts
describe('AbilityProcessor', () => {
  it('日本の精密射撃がダメージを30%増加', () => {
    const result = AbilityProcessor.processAttack('japan', 10, mockEnemy, []);
    expect(result.totalDamage).toBe(13);
  });
  
  it('アメリカのエアストライクが範囲攻撃を実行', () => {
    const enemies = [mockEnemy1, mockEnemy2, mockEnemy3];
    const result = AbilityProcessor.processAttack('usa', 10, mockEnemy1, enemies);
    expect(result.affectedEnemies.length).toBeGreaterThan(1);
  });
});
```

#### パスシステム
```typescript
// improved-path.test.ts
describe('PathSystem', () => {
  it('パスの全長を正しく計算', () => {
    const points = [{x: 0, y: 0}, {x: 100, y: 0}, {x: 100, y: 100}];
    const path = new PathSystem(points);
    expect(path.getTotalLength()).toBe(200);
  });
  
  it('距離に基づく位置を正確に返す', () => {
    const path = new PathSystem([{x: 0, y: 0}, {x: 100, y: 0}]);
    const pos = path.getPositionAtDistance(50);
    expect(pos).toEqual({x: 50, y: 0, angle: 0});
  });
});
```

#### セーブシステム
```typescript
// save-slots.test.ts
describe('SaveSlotManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  it('10個のスロットを管理できる', () => {
    const slots = SaveSlotManager.getAllSlots();
    expect(slots).toHaveLength(10);
  });
  
  it('セーブとロードが正しく動作', () => {
    const saveData = { wave: 5, coins: 100, /* ... */ };
    SaveSlotManager.saveToSlot(1, saveData);
    const loaded = SaveSlotManager.loadSlot(1);
    expect(loaded).toMatchObject(saveData);
  });
});
```

## 2. 統合テスト (30%)

### React Component統合テスト

```typescript
// integrated-game.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('IntegratedGameV2', () => {
  it('Wave開始でタイマーが動作', async () => {
    render(<IntegratedGameV2 />);
    const startButton = screen.getByText(/Wave 1 開始/);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Wave 1 進行中/)).toBeInTheDocument();
    });
  });
  
  it('タワー配置でコインが減少', async () => {
    render(<IntegratedGameV2 />);
    const canvas = screen.getByRole('img'); // Canvas要素
    
    // 初期コイン確認
    expect(screen.getByText(/💰 100 コイン/)).toBeInTheDocument();
    
    // クリックイベント
    fireEvent.click(canvas, { clientX: 400, clientY: 200 });
    
    // コイン減少確認
    await waitFor(() => {
      expect(screen.getByText(/💰 50 コイン/)).toBeInTheDocument();
    });
  });
});
```

### システム間統合テスト

```typescript
// gacha-integration.test.ts
describe('ガチャシステム統合', () => {
  it('Wave完了後にガチャが引ける', async () => {
    const game = new GameController();
    game.startWave();
    
    // 全敵を撃破
    await game.defeatAllEnemies();
    
    expect(game.showGacha).toBe(true);
    const nation = await game.pullGacha();
    expect(game.ownedNations).toContain(nation.id);
  });
});
```

## 3. E2Eテスト (10%) - Playwright

### 基本ゲームフロー
```typescript
// e2e/game-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Flag Defence E2E', () => {
  test('完全なゲームサイクル', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // タイトル確認
    await expect(page.locator('h1')).toContainText('Flag Defence');
    
    // Wave開始
    await page.click('button:has-text("Wave 1 開始")');
    
    // タワー配置
    await page.click('canvas', { position: { x: 400, y: 300 } });
    
    // コイン減少確認
    await expect(page.locator('text=💰 50 コイン')).toBeVisible();
    
    // 25秒待機（またはモック）
    await page.waitForTimeout(2000); // 実際はモックする
    
    // ガチャモーダル確認
    await expect(page.locator('text=Wave 1 クリア！')).toBeVisible();
  });
  
  test('セーブ・ロード機能', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // ゲーム進行
    await page.click('button:has-text("Wave 1 開始")');
    await page.waitForTimeout(1000);
    
    // セーブ
    await page.click('button:has-text("💾 セーブ")');
    await page.click('text=スロット 1');
    await page.fill('input[placeholder="セーブ名を入力"]', 'テストセーブ');
    await page.click('button:has-text("確定")');
    
    // リロード
    await page.reload();
    
    // ロード
    await page.click('button:has-text("📂 ロード")');
    await page.click('text=テストセーブ');
    
    // 状態復元確認
    await expect(page.locator('text=🌊 Wave: 2')).toBeVisible();
  });
});
```

### ショップ機能テスト
```typescript
test('ショップでアイテム購入', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // コイン追加（デバッグ機能使用）
  await page.click('button:has-text("+100コイン")');
  await page.click('button:has-text("+100コイン")');
  
  // ショップ開く
  await page.click('button:has-text("🛒 ショップ")');
  
  // アイテム購入
  await page.click('text=ダメージブースト');
  
  // 効果確認（次の攻撃で確認する必要あり）
  await page.click('button:has-text("閉じる")');
  
  // コイン減少確認
  await expect(page.locator('text=💰 0 コイン')).toBeVisible();
});
```

## テスト環境設定

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      exclude: ['node_modules/', 'src/test/'],
      threshold: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    }
  }
});
```

### playwright.config.ts
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

## CI/CDパイプライン

```yaml
# .github/workflows/test.yml
name: Test Suite

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

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run dev &
      - run: npx wait-on http://localhost:3000
      - run: npm run test:e2e
```

## テスト実行コマンド

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:unit && npm run test:e2e"
  }
}
```

## モック戦略

1. **時間関連**: `vi.useFakeTimers()` でWaveタイマーをモック
2. **Canvas**: `jest-canvas-mock` でCanvas APIをモック
3. **LocalStorage**: `localStorage` のモック実装
4. **Math.random**: シード値固定でガチャ結果を予測可能に

## パフォーマンステスト

```typescript
// performance/game-performance.spec.ts
test('60FPSを維持できる', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    return new Promise(resolve => {
      let frames = 0;
      const start = performance.now();
      
      function count() {
        frames++;
        if (performance.now() - start < 1000) {
          requestAnimationFrame(count);
        } else {
          resolve(frames);
        }
      }
      
      requestAnimationFrame(count);
    });
  });
  
  expect(metrics).toBeGreaterThan(55); // 55+ FPS
});
```