import { describe, it, expect } from 'vitest';
import { GDPEnemySystem, GDPEnemy, NATION_DATABASE } from '../gdp-enemy-system';

describe('GDPEnemySystem', () => {
  describe('calculateHP', () => {
    it('should calculate correct HP for normal enemy', () => {
      const hp = GDPEnemySystem.calculateHP(100, 1, 'normal');
      expect(hp).toBeGreaterThan(0);
      expect(hp).toBeLessThan(1000);
    });

    it('should increase HP with wave progression', () => {
      const hp1 = GDPEnemySystem.calculateHP(100, 1);
      const hp10 = GDPEnemySystem.calculateHP(100, 10);
      expect(hp10).toBeGreaterThan(hp1);
    });

    it('should apply type multipliers correctly', () => {
      const normal = GDPEnemySystem.calculateHP(100, 1, 'normal');
      const tank = GDPEnemySystem.calculateHP(100, 1, 'tank');
      const boss = GDPEnemySystem.calculateHP(100, 1, 'boss');
      
      // GDP 100: baseHP = max(5, floor(sqrt(100) * 10)) = 100
      // Wave 1 factor = 1.005
      // normal: floor(100 * 1.005 * 1) = 100
      // tank: floor(100 * 1.005 * 2) = 200
      // boss: floor(100 * 1.005 * 5) = 502
      expect(normal).toBe(100);
      expect(tank).toBe(200);
      expect(boss).toBe(502);
    });
  });

  describe('calculateReward', () => {
    it('should calculate base reward based on GDP', () => {
      const reward1 = GDPEnemySystem.calculateReward(1);
      const reward100 = GDPEnemySystem.calculateReward(100);
      expect(reward100).toBeGreaterThan(reward1);
    });

    it('should apply type bonuses', () => {
      const normal = GDPEnemySystem.calculateReward(100, 'normal');
      const tank = GDPEnemySystem.calculateReward(100, 'tank');
      const boss = GDPEnemySystem.calculateReward(100, 'boss');
      
      expect(tank).toBe(normal * 2.5);
      expect(boss).toBe(normal * 10);
    });
  });

  describe('calculateSpeed', () => {
    it('should make smaller GDP nations faster', () => {
      const speedSmall = GDPEnemySystem.calculateSpeed(1);
      const speedLarge = GDPEnemySystem.calculateSpeed(10000);
      expect(speedSmall).toBeGreaterThan(speedLarge);
    });
  });

  describe('generateWaveNations', () => {
    it('should generate correct number of enemies', () => {
      const wave1 = GDPEnemySystem.generateWaveNations(1);
      const wave10 = GDPEnemySystem.generateWaveNations(10);
      
      expect(wave1.length).toBe(4); // 1 * 1.5 + 3 = 4.5 → 4
      expect(wave10.length).toBe(18); // 10 * 1.5 + 3 = 18
    });

    it('should respect GDP limits by wave', () => {
      const wave1Nations = GDPEnemySystem.generateWaveNations(1);
      const wave20Nations = GDPEnemySystem.generateWaveNations(20);
      
      wave1Nations.forEach(nation => {
        expect(nation.gdp).toBeLessThanOrEqual(10);
      });
      
      const maxGdpWave20 = Math.max(...wave20Nations.map(n => n.gdp));
      expect(maxGdpWave20).toBeGreaterThan(10);
    });

    it('should sort nations by GDP', () => {
      const nations = GDPEnemySystem.generateWaveNations(10);
      for (let i = 1; i < nations.length; i++) {
        expect(nations[i].gdp).toBeGreaterThanOrEqual(nations[i-1].gdp);
      }
    });
  });

  describe('getRarity', () => {
    it('should return correct rarity tiers', () => {
      expect(GDPEnemySystem.getRarity(5).tier).toBe('common');
      expect(GDPEnemySystem.getRarity(50).tier).toBe('uncommon');
      expect(GDPEnemySystem.getRarity(500).tier).toBe('rare');
      expect(GDPEnemySystem.getRarity(5000).tier).toBe('epic');
      expect(GDPEnemySystem.getRarity(15000).tier).toBe('legendary');
    });

    it('should return correct star counts', () => {
      expect(GDPEnemySystem.getRarity(5).stars).toBe(1);
      expect(GDPEnemySystem.getRarity(50).stars).toBe(2);
      expect(GDPEnemySystem.getRarity(500).stars).toBe(3);
      expect(GDPEnemySystem.getRarity(5000).stars).toBe(4);
      expect(GDPEnemySystem.getRarity(15000).stars).toBe(5);
    });
  });
});

describe('GDPEnemy', () => {
  const testNation = { id: 'test', name: 'Test', gdp: 100, flag: '🏳️', colors: ['#000'] };

  it('should initialize with correct properties', () => {
    const enemy = new GDPEnemy(testNation, 1);
    
    expect(enemy.nation).toBe(testNation);
    expect(enemy.type).toBe('normal');
    expect(enemy.hp).toBeGreaterThan(0);
    expect(enemy.maxHp).toBe(enemy.hp);
    expect(enemy.pathProgress).toBe(0);
  });

  it('should handle different enemy types', () => {
    const normal = new GDPEnemy(testNation, 1, 'normal');
    const tank = new GDPEnemy(testNation, 1, 'tank');
    const boss = new GDPEnemy(testNation, 1, 'boss');
    
    expect(tank.hp).toBeGreaterThan(normal.hp);
    expect(boss.hp).toBeGreaterThan(tank.hp);
  });

  it('should take damage correctly', () => {
    const enemy = new GDPEnemy(testNation, 1);
    const initialHp = enemy.hp;
    
    const isDead = enemy.takeDamage(10);
    expect(enemy.hp).toBe(initialHp - 10);
    expect(isDead).toBe(false);
    
    const isDeadNow = enemy.takeDamage(enemy.hp);
    expect(isDeadNow).toBe(true);
  });

  it('should calculate size based on type and GDP', () => {
    const normal = new GDPEnemy(testNation, 1, 'normal');
    const tank = new GDPEnemy(testNation, 1, 'tank');
    const boss = new GDPEnemy(testNation, 1, 'boss');
    
    expect(tank.getSize()).toBeGreaterThan(normal.getSize());
    expect(boss.getSize()).toBeGreaterThan(tank.getSize());
  });
});

describe('NATION_DATABASE', () => {
  it('should have 242 nations', () => {
    expect(NATION_DATABASE.length).toBe(242);
  });

  it('should have required properties for each nation', () => {
    NATION_DATABASE.forEach(nation => {
      expect(nation).toHaveProperty('id');
      expect(nation).toHaveProperty('name');
      expect(nation).toHaveProperty('gdp');
      expect(nation).toHaveProperty('flag');
      expect(nation).toHaveProperty('colors');
      expect(nation.colors).toBeInstanceOf(Array);
      expect(nation.colors.length).toBeGreaterThan(0);
    });
  });

  it('should have valid GDP values', () => {
    NATION_DATABASE.forEach(nation => {
      expect(nation.gdp).toBeGreaterThan(0);
      expect(nation.gdp).toBeLessThan(30000);
    });
  });
});