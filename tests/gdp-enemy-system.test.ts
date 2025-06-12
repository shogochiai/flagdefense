import { describe, it, expect } from 'vitest';
import { GDPEnemySystem, GDPEnemy, NATION_DATABASE } from '../src/spike/gdp-enemy-system';

describe('GDPEnemySystem', () => {
  describe('calculateHP', () => {
    it('小国（GDP < 10）の基本HPが最小値5以上', () => {
      const hp = GDPEnemySystem.calculateHP(0.5, 1, 'normal');
      expect(hp).toBeGreaterThanOrEqual(5);
    });
    
    it('大国（GDP > 10000）のHPが適切にスケール', () => {
      const hp = GDPEnemySystem.calculateHP(25000, 1, 'normal');
      expect(hp).toBeGreaterThan(1000);
      expect(hp).toBeLessThan(2000); // 上限チェック
    });
    
    it('Boss敵のHPが通常の5倍', () => {
      const normalHP = GDPEnemySystem.calculateHP(100, 1, 'normal');
      const bossHP = GDPEnemySystem.calculateHP(100, 1, 'boss');
      // 浮動小数点の誤差を考慮
      expect(Math.round(bossHP / normalHP)).toBe(5);
    });
    
    it('Tank敵のHPが通常の2倍', () => {
      const normalHP = GDPEnemySystem.calculateHP(100, 1, 'normal');
      const tankHP = GDPEnemySystem.calculateHP(100, 1, 'tank');
      expect(tankHP).toBe(normalHP * 2);
    });
    
    it('Wave進行でHPが増加する', () => {
      const wave1HP = GDPEnemySystem.calculateHP(100, 1, 'normal');
      const wave10HP = GDPEnemySystem.calculateHP(100, 10, 'normal');
      const wave50HP = GDPEnemySystem.calculateHP(100, 50, 'normal');
      
      expect(wave10HP).toBeGreaterThan(wave1HP);
      expect(wave50HP).toBeGreaterThan(wave10HP);
      expect(wave50HP).toBeLessThan(wave1HP * 2); // 緩やかな上昇
    });
  });

  describe('calculateReward', () => {
    it('GDPが高いほど報酬が多い', () => {
      const smallReward = GDPEnemySystem.calculateReward(10, 'normal');
      const mediumReward = GDPEnemySystem.calculateReward(1000, 'normal');
      const largeReward = GDPEnemySystem.calculateReward(10000, 'normal');
      
      expect(mediumReward).toBeGreaterThan(smallReward);
      expect(largeReward).toBeGreaterThan(mediumReward);
    });
    
    it('Boss敵の報酬が10倍', () => {
      const normalReward = GDPEnemySystem.calculateReward(100, 'normal');
      const bossReward = GDPEnemySystem.calculateReward(100, 'boss');
      expect(bossReward).toBe(normalReward * 10);
    });
  });

  describe('calculateSpeed', () => {
    it('小国ほど移動速度が速い', () => {
      const smallSpeed = GDPEnemySystem.calculateSpeed(10);
      const largeSpeed = GDPEnemySystem.calculateSpeed(10000);
      
      expect(smallSpeed).toBeGreaterThan(largeSpeed);
    });
    
    it('速度に最小値がある', () => {
      const speed = GDPEnemySystem.calculateSpeed(100000);
      expect(speed).toBeGreaterThan(0);
      expect(speed).toBeGreaterThanOrEqual(25); // 最小速度
    });
  });

  describe('generateWaveNations', () => {
    it('初期Waveでは小国のみ出現', () => {
      const nations = GDPEnemySystem.generateWaveNations(1);
      const maxGDP = Math.max(...nations.map(n => n.gdp));
      expect(maxGDP).toBeLessThanOrEqual(50);
    });
    
    it('Wave30以降は全ての国が出現可能', () => {
      const nations = GDPEnemySystem.generateWaveNations(35);
      // 少なくとも1つは大国が含まれる可能性がある
      expect(nations.length).toBeGreaterThan(0);
    });
    
    it('Waveが進むほど敵の数が増える', () => {
      const wave1 = GDPEnemySystem.generateWaveNations(1);
      const wave10 = GDPEnemySystem.generateWaveNations(10);
      
      expect(wave10.length).toBeGreaterThan(wave1.length);
      expect(wave10.length).toBeLessThanOrEqual(50); // 上限チェック
    });
  });

  describe('getRarity', () => {
    it('GDP基準でレアリティが正しく判定される', () => {
      expect(GDPEnemySystem.getRarity(25000)).toEqual({
        tier: 'legendary',
        color: '#FFD700',
        stars: 5
      });
      
      expect(GDPEnemySystem.getRarity(2000)).toEqual({
        tier: 'epic',
        color: '#9B30FF',
        stars: 4
      });
      
      expect(GDPEnemySystem.getRarity(0.1)).toEqual({
        tier: 'common',
        color: '#808080',
        stars: 1
      });
    });
  });
});

describe('GDPEnemy', () => {
  const testNation = {
    id: 'test',
    name: 'テスト国',
    gdp: 1000,
    flag: '🏳️',
    colors: ['#000', '#FFF']
  };

  it('敵が正しく初期化される', () => {
    const enemy = new GDPEnemy(testNation, 1, 'normal');
    
    expect(enemy.nation).toBe(testNation);
    expect(enemy.hp).toBeGreaterThan(0);
    expect(enemy.hp).toBe(enemy.maxHp);
    expect(enemy.speed).toBeGreaterThan(0);
    expect(enemy.reward).toBeGreaterThan(0);
    expect(enemy.pathProgress).toBe(0);
  });

  it('ダメージを受けてHPが減る', () => {
    const enemy = new GDPEnemy(testNation, 1, 'normal');
    const initialHP = enemy.hp;
    
    const isDead = enemy.takeDamage(10);
    expect(enemy.hp).toBe(initialHP - 10);
    expect(isDead).toBe(false);
  });

  it('HPが0以下で死亡判定', () => {
    const enemy = new GDPEnemy(testNation, 1, 'normal');
    const isDead = enemy.takeDamage(enemy.hp + 10);
    
    expect(enemy.hp).toBeLessThan(0);
    expect(isDead).toBe(true);
  });

  it('Boss敵のサイズが大きい', () => {
    const normal = new GDPEnemy(testNation, 1, 'normal');
    const boss = new GDPEnemy(testNation, 1, 'boss');
    
    expect(boss.getSize()).toBeGreaterThan(normal.getSize());
  });
});