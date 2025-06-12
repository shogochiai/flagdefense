// Tidy First: 動作確認のための最小限のテスト

describe('Spike Tests - 基本動作確認', () => {
  // 敵の移動テスト
  test('敵が右に移動する', () => {
    const enemy = { x: 0, y: 200 };
    const deltaTime = 16; // 1フレーム
    const speed = 0.05;
    
    enemy.x += deltaTime * speed;
    
    expect(enemy.x).toBeGreaterThan(0);
    expect(enemy.x).toBeCloseTo(0.8); // 16 * 0.05
  });

  // タワーの射程判定テスト
  test('タワーが敵を射程内で検出できる', () => {
    const tower = { x: 100, y: 200, range: 100 };
    const enemyInRange = { x: 150, y: 200 };
    const enemyOutOfRange = { x: 250, y: 200 };
    
    const distanceToInRange = Math.sqrt(
      Math.pow(enemyInRange.x - tower.x, 2) + 
      Math.pow(enemyInRange.y - tower.y, 2)
    );
    const distanceToOutOfRange = Math.sqrt(
      Math.pow(enemyOutOfRange.x - tower.x, 2) + 
      Math.pow(enemyOutOfRange.y - tower.y, 2)
    );
    
    expect(distanceToInRange).toBeLessThanOrEqual(tower.range);
    expect(distanceToOutOfRange).toBeGreaterThan(tower.range);
  });

  // ダメージ計算テスト
  test('敵がダメージを受ける', () => {
    const enemy = { hp: 10 };
    const damage = 3;
    
    enemy.hp -= damage;
    
    expect(enemy.hp).toBe(7);
  });

  // コイン報酬テスト
  test('敵を倒すとコインを獲得', () => {
    let coins = 100;
    const reward = 10;
    
    // 敵を倒した
    coins += reward;
    
    expect(coins).toBe(110);
  });

  // タワー購入テスト
  test('コインが足りればタワーを購入できる', () => {
    const coins = 100;
    const towerCost = 50;
    
    const canBuy = coins >= towerCost;
    
    expect(canBuy).toBe(true);
  });

  // Wave生成テスト
  test('Waveに応じて敵の数が増える', () => {
    const wave1EnemyCount = 1 * 3; // wave * 3
    const wave5EnemyCount = 5 * 3;
    
    expect(wave1EnemyCount).toBe(3);
    expect(wave5EnemyCount).toBe(15);
  });
});

// ガチャシステムのテスト
describe('Gacha System Tests', () => {
  test('未所持の国からランダムに選択される', () => {
    const allNations = ['japan', 'usa', 'germany', 'france', 'uk'];
    const ownedNations = ['japan', 'usa'];
    
    const availableNations = allNations.filter(n => !ownedNations.includes(n));
    
    expect(availableNations).toEqual(['germany', 'france', 'uk']);
    expect(availableNations.length).toBe(3);
  });

  test('全て所持済みの場合は引けない', () => {
    const allNations = ['japan', 'usa'];
    const ownedNations = ['japan', 'usa'];
    
    const availableNations = allNations.filter(n => !ownedNations.includes(n));
    
    expect(availableNations.length).toBe(0);
  });

  test('GDPによってレアリティが決まる', () => {
    const getRarity = (gdp: number) => {
      if (gdp >= 10000) return 'legendary';
      if (gdp >= 1000) return 'epic';
      if (gdp >= 100) return 'rare';
      return 'common';
    };
    
    expect(getRarity(25000)).toBe('legendary'); // USA
    expect(getRarity(4200)).toBe('epic');       // Japan
    expect(getRarity(500)).toBe('rare');        // Medium country
    expect(getRarity(10)).toBe('common');       // Small country
  });
});