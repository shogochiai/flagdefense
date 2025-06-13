import { describe, it, expect } from 'vitest';
import { AbilityProcessor } from '../nation-abilities';
import { GDPEnemy } from '../gdp-enemy-system';

describe('AbilityProcessor', () => {
  const mockEnemy = new GDPEnemy(
    { id: 'test', name: 'Test', gdp: 100, flag: '🏳️', colors: ['#000'] },
    1
  );

  describe('processAttack', () => {
    it('should process basic attack without abilities', () => {
      const result = AbilityProcessor.processAttack(
        'unknown_nation',
        100,
        mockEnemy,
        [mockEnemy],
        () => {}
      );

      expect(result.totalDamage).toBe(100);
      expect(result.affectedEnemies).toContain(mockEnemy);
      expect(result.effects).toHaveLength(0);
    });

    it('should apply USA ability (範囲攻撃)', () => {
      const enemies = [
        mockEnemy,
        new GDPEnemy({ id: 'test2', name: 'Test2', gdp: 100, flag: '🏳️', colors: ['#000'] }, 1)
      ];
      
      // Position enemies close together
      enemies[0].x = 100;
      enemies[0].y = 100;
      enemies[1].x = 120;
      enemies[1].y = 100;

      const result = AbilityProcessor.processAttack(
        'usa',
        100,
        enemies[0],
        enemies,
        () => {}
      );

      expect(result.effects).toContain('範囲攻撃!');
      expect(result.affectedEnemies.length).toBeGreaterThan(1);
    });

    it('should apply Japan ability (精密射撃)', () => {
      const result = AbilityProcessor.processAttack(
        'japan',
        100,
        mockEnemy,
        [mockEnemy],
        () => {}
      );
      
      // Japan has 30% damage increase
      expect(result.totalDamage).toBe(130);
      expect(result.affectedEnemies).toContain(mockEnemy);
    });

    it('should apply Monaco ability (コイン生成)', () => {
      let bonusCoins = 0;
      const result = AbilityProcessor.processAttack(
        'monaco',
        100,
        mockEnemy,
        [mockEnemy],
        (coins) => { bonusCoins = coins; }
      );

      expect(result.effects).toContain('💰 コイン生成!');
      expect(bonusCoins).toBeGreaterThan(0);
    });
  });

  describe('getTowerModifiers', () => {
    it('should return default modifiers for unknown nations', () => {
      const modifiers = AbilityProcessor.getTowerModifiers('unknown');
      expect(modifiers).toEqual({
        damage: 1.0,
        range: 1.0,
        attackSpeed: 1.0
      });
    });

    it('should return China modifiers (マルチターゲット)', () => {
      const modifiers = AbilityProcessor.getTowerModifiers('china');
      // China has multi-target ability, no attack speed bonus
      expect(modifiers.attackSpeed).toBe(1.0);
      expect(modifiers.damage).toBe(1.0);
      expect(modifiers.range).toBe(1.0);
    });

    it('should return UK modifiers (貫通弾)', () => {
      const modifiers = AbilityProcessor.getTowerModifiers('uk');
      // UK has pierce ability, no range bonus
      expect(modifiers.range).toBe(1.0);
      expect(modifiers.damage).toBe(1.0);
      expect(modifiers.attackSpeed).toBe(1.0);
    });
  });

  describe('getAbilityDescription', () => {
    it('should return ability descriptions', () => {
      expect(AbilityProcessor.getAbilityDescription('usa')).toBe('範囲攻撃ダメージ+50%');
      expect(AbilityProcessor.getAbilityDescription('japan')).toBe('ダメージ+30%、射程+20%');
      expect(AbilityProcessor.getAbilityDescription('china')).toBe('攻撃が3体同時に命中');
      expect(AbilityProcessor.getAbilityDescription('germany')).toBe('コイン獲得+40%');
      expect(AbilityProcessor.getAbilityDescription('india')).toBe('敵の移動速度-30%（2秒）');
      expect(AbilityProcessor.getAbilityDescription('uk')).toBe('攻撃が敵を貫通');
      expect(AbilityProcessor.getAbilityDescription('france')).toBe('範囲攻撃、ダメージ+20%');
    });

    it('should return default description for unknown nations', () => {
      expect(AbilityProcessor.getAbilityDescription('unknown')).toBe('特殊能力なし');
    });

    it('should handle special micro nations', () => {
      expect(AbilityProcessor.getAbilityDescription('nauru')).toBe('コイン獲得+80%');
      expect(AbilityProcessor.getAbilityDescription('tuvalu')).toBe('敵を押し戻す効果');
      expect(AbilityProcessor.getAbilityDescription('monaco')).toBe('コイン獲得が0〜200%でランダム');
      expect(AbilityProcessor.getAbilityDescription('vatican')).toBe('特殊能力なし');
    });
  });
});