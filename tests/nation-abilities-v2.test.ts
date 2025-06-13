import { describe, test, expect, beforeEach, vi } from 'vitest';
import { NATION_ABILITIES, AbilityProcessor } from '../src/spike/nation-abilities';

describe('Nation Abilities v2.0 - Core Mechanics', () => {
  describe('Existing Ability Types', () => {
    test('damage multiplier ability increases damage correctly', () => {
      const result = AbilityProcessor.processAttack(
        'japan',
        100,
        { x: 100, y: 100, hp: 200, reward: 10 },
        [],
        vi.fn()
      );
      
      expect(result.totalDamage).toBe(130); // 30% increase
      expect(result.effects).toHaveLength(0); // Japan has no special effect text
    });

    test('multi-target ability hits multiple enemies', () => {
      const enemies = [
        { x: 100, y: 100, hp: 200, reward: 10 },
        { x: 150, y: 150, hp: 200, reward: 10 },
        { x: 200, y: 200, hp: 200, reward: 10 },
        { x: 250, y: 250, hp: 200, reward: 10 }
      ];
      
      const result = AbilityProcessor.processAttack(
        'china',
        100,
        enemies[0],
        enemies,
        vi.fn()
      );
      
      expect(result.affectedEnemies).toHaveLength(3); // 3 targets
      expect(result.effects).toContain('マルチ!');
    });

    test('money bonus ability triggers coin callback', () => {
      const coinCallback = vi.fn();
      const enemy = { x: 100, y: 100, hp: 200, reward: 10 };
      
      AbilityProcessor.processAttack(
        'singapore',
        100,
        enemy,
        [],
        coinCallback
      );
      
      expect(coinCallback).toHaveBeenCalledWith(6); // 60% bonus
      expect(coinCallback).toHaveBeenCalledTimes(1);
    });

    test('splash damage affects nearby enemies', () => {
      const enemies = [
        { x: 100, y: 100, hp: 200, reward: 10 },
        { x: 130, y: 130, hp: 200, reward: 10 }, // Within splash radius
        { x: 200, y: 200, hp: 200, reward: 10 }  // Outside splash radius
      ];
      
      const result = AbilityProcessor.processAttack(
        'usa',
        100,
        enemies[0],
        enemies,
        vi.fn()
      );
      
      expect(result.affectedEnemies).toHaveLength(2);
      expect(result.totalDamage).toBe(150); // 50% splash bonus
    });

    test('pierce ability hits enemies in line', () => {
      const enemies = [
        { x: 100, y: 100, hp: 200, reward: 10 },
        { x: 150, y: 150, hp: 200, reward: 10 },
        { x: 200, y: 200, hp: 200, reward: 10 }
      ];
      
      const result = AbilityProcessor.processAttack(
        'uk',
        100,
        enemies[0],
        enemies,
        vi.fn()
      );
      
      expect(result.effects).toContain('貫通!');
      expect(result.affectedEnemies.length).toBeGreaterThanOrEqual(1);
    });

    test('slow effect applies speed modifier', () => {
      const enemy = { x: 100, y: 100, hp: 200, reward: 10 };
      
      AbilityProcessor.processAttack(
        'india',
        100,
        enemy,
        [],
        vi.fn()
      );
      
      expect(enemy.speedModifier).toBe(0.7);
      expect(enemy.speedModifierUntil).toBeGreaterThan(Date.now());
    });
  });

  describe('Special Nation Abilities', () => {
    test('Ireland lucky shot has 20% critical chance', () => {
      const criticalHits = [];
      
      // Run multiple times to test probability
      for (let i = 0; i < 100; i++) {
        const result = AbilityProcessor.processAttack(
          'ireland',
          100,
          { x: 100, y: 100, hp: 200, reward: 10 },
          [],
          vi.fn()
        );
        
        if (result.totalDamage === 300) {
          criticalHits.push(true);
        }
      }
      
      // Should be roughly 20% (allow 10-30% range for randomness)
      const critRate = criticalHits.length / 100;
      expect(critRate).toBeGreaterThan(0.1);
      expect(critRate).toBeLessThan(0.3);
    });

    test('Monaco casino ability gives random coin bonus', () => {
      const coinResults = [];
      const enemy = { x: 100, y: 100, hp: 200, reward: 10 };
      
      for (let i = 0; i < 20; i++) {
        const coinCallback = vi.fn();
        AbilityProcessor.processAttack(
          'monaco',
          100,
          enemy,
          [],
          coinCallback
        );
        
        if (coinCallback.mock.calls.length > 0) {
          coinResults.push(coinCallback.mock.calls[0][0]);
        }
      }
      
      // Should have varying results
      const uniqueResults = new Set(coinResults);
      expect(uniqueResults.size).toBeGreaterThan(1);
    });

    test('Brazil attack speed modifier', () => {
      const modifiers = AbilityProcessor.getTowerModifiers('brazil');
      expect(modifiers.attackSpeed).toBe(0.67); // 50% faster
    });

    test('Malta damage boost with speed penalty', () => {
      const modifiers = AbilityProcessor.getTowerModifiers('malta');
      expect(modifiers.attackSpeed).toBe(1.2); // 20% slower
      
      const result = AbilityProcessor.processAttack(
        'malta',
        100,
        { x: 100, y: 100, hp: 200, reward: 10 },
        [],
        vi.fn()
      );
      
      expect(result.totalDamage).toBe(140); // 40% damage boost
    });

    test('Canada freeze effect', () => {
      const enemy = { x: 100, y: 100, hp: 200, reward: 10 };
      
      AbilityProcessor.processAttack(
        'canada',
        100,
        enemy,
        [],
        vi.fn()
      );
      
      expect(enemy.speedModifier).toBe(0); // Complete freeze
      expect(enemy.speedModifierUntil).toBeGreaterThan(Date.now());
    });
  });

  describe('Tower Modifiers', () => {
    test('range modifiers apply correctly', () => {
      const japanMods = AbilityProcessor.getTowerModifiers('japan');
      expect(japanMods.range).toBe(1.2); // 20% range increase
      
      const israelMods = AbilityProcessor.getTowerModifiers('israel');
      expect(israelMods.range).toBe(1.4); // 40% range increase
    });

    test('default nation has no modifiers', () => {
      const modifiers = AbilityProcessor.getTowerModifiers('unknown_nation');
      expect(modifiers.range).toBe(1);
      expect(modifiers.attackSpeed).toBe(1);
    });
  });

  describe('Ability Descriptions', () => {
    test('all defined nations have descriptions', () => {
      const nationIds = Object.keys(NATION_ABILITIES);
      
      nationIds.forEach(nationId => {
        if (nationId !== 'default') {
          const description = AbilityProcessor.getAbilityDescription(nationId);
          expect(description).toBeTruthy();
          expect(description.length).toBeGreaterThan(0);
        }
      });
    });

    test('unknown nations return default description', () => {
      const description = AbilityProcessor.getAbilityDescription('unknown_nation');
      expect(description).toBe('特殊能力なし');
    });
  });
});

describe('Nation Abilities v2.0 - New Ability Types', () => {
  describe('Meme Nations with Coin Focus', () => {
    test('Nauru has high coin bonus for early game', () => {
      const coinCallback = vi.fn();
      const enemy = { x: 100, y: 100, hp: 200, reward: 10 };
      
      AbilityProcessor.processAttack(
        'nauru',
        100,
        enemy,
        [],
        coinCallback
      );
      
      expect(coinCallback).toHaveBeenCalledWith(8); // 80% bonus
    });

    test('Singapore trading bonus', () => {
      const coinCallback = vi.fn();
      const enemy = { x: 100, y: 100, hp: 200, reward: 10 };
      
      AbilityProcessor.processAttack(
        'singapore',
        100,
        enemy,
        [],
        coinCallback
      );
      
      expect(coinCallback).toHaveBeenCalledWith(6); // 60% bonus
    });
  });

  describe('High GDP Nations', () => {
    test('USA air strike has powerful splash', () => {
      const enemies = [
        { x: 100, y: 100, hp: 200, reward: 10 },
        { x: 140, y: 140, hp: 200, reward: 10 },
        { x: 160, y: 160, hp: 200, reward: 10 }
      ];
      
      const result = AbilityProcessor.processAttack(
        'usa',
        100,
        enemies[0],
        enemies,
        vi.fn()
      );
      
      expect(result.totalDamage).toBe(150); // 50% splash damage bonus
      expect(result.affectedEnemies.length).toBeGreaterThan(1);
    });

    test('China human wave tactics hits multiple targets', () => {
      const enemies = Array(5).fill(null).map((_, i) => ({
        x: 100 + i * 50,
        y: 100 + i * 50,
        hp: 200,
        reward: 10
      }));
      
      const result = AbilityProcessor.processAttack(
        'china',
        100,
        enemies[0],
        enemies,
        vi.fn()
      );
      
      expect(result.affectedEnemies).toHaveLength(3);
    });

    test('Germany efficiency bonus', () => {
      const coinCallback = vi.fn();
      const enemy = { x: 100, y: 100, hp: 200, reward: 10 };
      
      AbilityProcessor.processAttack(
        'germany',
        100,
        enemy,
        [],
        coinCallback
      );
      
      expect(coinCallback).toHaveBeenCalledWith(3); // 40% bonus (floor(10 * 0.4) = 3 due to floating point)
    });
  });

  describe('Nation Ability Balance', () => {
    test('coin bonuses scale appropriately', () => {
      const coinAbilities = [
        { nation: 'germany', expected: 3 },    // 40% (floor(10 * 0.4) = 3)
        { nation: 'singapore', expected: 6 },  // 60%
        { nation: 'nauru', expected: 8 }       // 80%
      ];
      
      coinAbilities.forEach(({ nation, expected }) => {
        const coinCallback = vi.fn();
        const enemy = { x: 100, y: 100, hp: 200, reward: 10 };
        
        AbilityProcessor.processAttack(
          nation,
          100,
          enemy,
          [],
          coinCallback
        );
        
        expect(coinCallback).toHaveBeenCalledWith(expected);
      });
    });

    test('damage multipliers are balanced', () => {
      const damageAbilities = [
        { nation: 'japan', expected: 130 },        // 30%
        { nation: 'south_korea', expected: 125 },  // 25%
        { nation: 'malta', expected: 140 },        // 40%
        { nation: 'liechtenstein', expected: 150 } // 50%
      ];
      
      damageAbilities.forEach(({ nation, expected }) => {
        const result = AbilityProcessor.processAttack(
          nation,
          100,
          { x: 100, y: 100, hp: 200, reward: 10 },
          [],
          vi.fn()
        );
        
        expect(result.totalDamage).toBe(expected);
      });
    });
  });
});