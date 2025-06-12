# Tidy First テスト戦略実装ガイド

## Kent Beckの"Tidy First?"に基づく開発アプローチ

### 基本原則
1. **動作するコードを最初に書く**
2. **その後でテストを書く**
3. **最後にリファクタリング**
4. **小さな変更を頻繁にコミット**

## Phase 1: スパイクソリューション（最初の3日間）

### 目的
最小限の動作するゲームを作り、技術的な実現可能性を検証する。

### 実装順序

#### Day 1: 最小限のゲームループ
```typescript
// src/spike/minimal-game.tsx
export const MinimalGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enemies, setEnemies] = useState<any[]>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId: number;
    
    const gameLoop = () => {
      // とりあえず動く最小限のコード
      ctx.clearRect(0, 0, 800, 400);
      
      // 敵を描画（ただの四角）
      enemies.forEach(enemy => {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, 20, 20);
        enemy.x += 1; // 単純に右に移動
      });
      
      animationId = requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
    return () => cancelAnimationFrame(animationId);
  }, [enemies]);
  
  return (
    <div>
      <canvas ref={canvasRef} width={800} height={400} />
      <button onClick={() => setEnemies([...enemies, { x: 0, y: 200 }])}>
        敵を追加
      </button>
    </div>
  );
};
```

#### Day 2: タワー配置と攻撃
```typescript
// 動作確認を優先、美しさは後回し
const handleCanvasClick = (e: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // とりあえずタワーを配置
  towers.push({ x, y, range: 100 });
  
  // 攻撃ロジック（最小限）
  towers.forEach(tower => {
    const target = enemies.find(enemy => {
      const dist = Math.sqrt((enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2);
      return dist < tower.range;
    });
    
    if (target) {
      // 線を引くだけの攻撃表現
      ctx.strokeStyle = 'yellow';
      ctx.beginPath();
      ctx.moveTo(tower.x, tower.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
      
      target.hp -= 1;
    }
  });
};
```

#### Day 3: Wave管理とガチャ
```typescript
// 最低限のWave管理
let currentWave = 1;
const startWave = () => {
  // 固定数の敵を生成
  for (let i = 0; i < currentWave * 2; i++) {
    setTimeout(() => {
      enemies.push({ x: 0, y: 200, hp: 10 });
    }, i * 1000);
  }
};

// 超シンプルなガチャ
const pullGacha = () => {
  const nations = ['japan', 'usa', 'germany'];
  const random = nations[Math.floor(Math.random() * nations.length)];
  alert(`獲得: ${random}`);
  ownedNations.push(random);
};
```

## Phase 2: テスト追加（Day 4-5）

### 動作確認後にテストを追加

```typescript
// src/tests/spike-tests.spec.ts
describe('Spike Tests - 動作確認', () => {
  test('敵が右に移動する', () => {
    const enemy = { x: 0, y: 200 };
    moveEnemy(enemy);
    expect(enemy.x).toBeGreaterThan(0);
  });
  
  test('タワーが敵を検出できる', () => {
    const tower = { x: 100, y: 200, range: 100 };
    const enemy = { x: 150, y: 200 };
    expect(isInRange(tower, enemy)).toBe(true);
  });
  
  test('ガチャで国が取得できる', () => {
    const before = ownedNations.length;
    pullGacha();
    expect(ownedNations.length).toBe(before + 1);
  });
});
```

## Phase 3: 整理とリファクタリング（Day 6-10）

### Tidy First原則に従った整理

#### Step 1: 明らかな重複を削除
```typescript
// Before: 重複したコード
enemies.forEach(enemy => {
  ctx.fillStyle = 'red';
  ctx.fillRect(enemy.x, enemy.y, 20, 20);
});

towers.forEach(tower => {
  ctx.fillStyle = 'blue';
  ctx.fillRect(tower.x - 10, tower.y - 10, 20, 20);
});

// After: 共通化
const drawEntity = (entity: Entity, color: string, size: number) => {
  ctx.fillStyle = color;
  ctx.fillRect(entity.x - size/2, entity.y - size/2, size, size);
};
```

#### Step 2: 明確な境界を作る
```typescript
// ゲームロジックとレンダリングを分離
class GameState {
  update(deltaTime: number) {
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    this.towers.forEach(tower => tower.update(this.enemies));
  }
}

class Renderer {
  render(gameState: GameState, ctx: CanvasRenderingContext2D) {
    this.clearCanvas(ctx);
    this.drawPath(ctx);
    gameState.enemies.forEach(e => this.drawEnemy(e, ctx));
    gameState.towers.forEach(t => this.drawTower(t, ctx));
  }
}
```

#### Step 3: テストを追加しながら整理
```typescript
// リファクタリング後のテスト
describe('GameState', () => {
  let gameState: GameState;
  
  beforeEach(() => {
    gameState = new GameState();
  });
  
  test('update moves enemies along path', () => {
    const enemy = gameState.spawnEnemy();
    const initialProgress = enemy.pathProgress;
    
    gameState.update(16); // 1 frame
    
    expect(enemy.pathProgress).toBeGreaterThan(initialProgress);
  });
});
```

## Phase 4: 機能追加サイクル（Day 11以降）

### Tidy Firstサイクルの繰り返し

1. **新機能のスパイク実装**
```typescript
// 例: セーブ機能のスパイク
const quickSave = () => {
  const data = { enemies, towers, wave: currentWave };
  localStorage.setItem('save', JSON.stringify(data));
};

const quickLoad = () => {
  const data = JSON.parse(localStorage.getItem('save') || '{}');
  if (data.enemies) enemies = data.enemies;
  if (data.towers) towers = data.towers;
};
```

2. **動作確認テスト追加**
```typescript
test('quickSave stores game state', () => {
  quickSave();
  const saved = localStorage.getItem('save');
  expect(saved).toBeTruthy();
  expect(JSON.parse(saved)).toHaveProperty('wave');
});
```

3. **適切な設計にリファクタリング**
```typescript
class SaveManager {
  private static readonly STORAGE_KEY = 'flagdefence_saves';
  
  save(gameState: GameState): void {
    const saveData = this.serialize(gameState);
    this.persist(saveData);
  }
  
  load(): GameState | null {
    const saveData = this.retrieve();
    return saveData ? this.deserialize(saveData) : null;
  }
}
```

## 実装優先順位（Tidy First方式）

### Week 1: コアループ確立
1. Canvas描画（汚くても動く）
2. 敵の移動（単純な実装）
3. タワー配置（クリックのみ）
4. 攻撃処理（線を引くだけ）
5. 基本的なテスト追加

### Week 2: ゲーム性追加
1. Wave管理（ハードコード可）
2. ガチャ（配列からランダム）
3. 国旗表示（色付き四角で代替）
4. セーブ機能（LocalStorage直接）
5. 統合テスト追加

### Week 3: 品質向上
1. コードの整理と分離
2. パフォーマンス改善
3. エラーハンドリング
4. UIの改善
5. E2Eテスト追加

### Week 4: 完成度向上
1. 画像統合
2. エフェクト追加
3. バランス調整
4. 最終テスト
5. リリース準備

## アンチパターンの回避

### 避けるべきこと
- 最初から完璧な設計を目指す
- テストのためのテストを書く
- 動かないコードのリファクタリング
- 大規模な変更を一度に行う

### 推奨されること
- 小さく始めて成長させる
- 動作確認を最優先
- 頻繁なコミット（1時間に1回以上）
- ペアプログラミングでの知識共有

## 成功指標

### スパイクフェーズ
- 3日で遊べるプロトタイプ完成
- 技術的リスクの洗い出し完了

### テスト追加フェーズ
- 主要機能に最低1つのテスト
- CI/CDパイプライン稼働

### リファクタリングフェーズ
- コードの重複50%削減
- 新機能追加時間50%短縮

このアプローチにより、早期に動くものを作り、段階的に品質を上げていくことで、リスクを最小限に抑えながら開発を進められます。