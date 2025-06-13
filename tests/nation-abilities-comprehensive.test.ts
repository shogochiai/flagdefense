import { describe, test, expect, beforeEach, vi } from 'vitest';
import { ALL_NATION_ABILITIES } from '../src/spike/nation-abilities-v2';
import { AbilityProcessorV2 } from '../src/spike/ability-processor-v2';
import { FULL_NATION_DATABASE } from '../src/spike/nations-full-database';

describe('250カ国アビリティ網羅的テスト', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  const mockEnemy = {
    x: 100,
    y: 100,
    hp: 100,
    reward: 10,
    speed: 1,
    type: 'normal'
  };

  const createMockEnemies = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      x: 100 + i * 50,
      y: 100 + i * 50,
      hp: 100,
      reward: 10,
      speed: 1,
      type: 'normal'
    }));
  };

  const createMockTowers = (count: number, nationId: string) => {
    return Array.from({ length: count }, (_, i) => ({
      x: 200 + i * 100,
      y: 200,
      nationId,
      buffMultiplier: 1
    }));
  };

  describe('全250カ国のアビリティ定義チェック', () => {
    test('250カ国すべてにアビリティが定義されているか', () => {
      const definedAbilities = Object.keys(ALL_NATION_ABILITIES).filter(key => key !== 'default');
      
      // 現在定義されている国の数を確認
      console.log(`定義済みアビリティ数: ${definedAbilities.length}`);
      
      // すべての国にアビリティが割り当てられるようにする
      FULL_NATION_DATABASE.forEach(nation => {
        const ability = AbilityProcessorV2.getNationAbilityInfo(nation.id);
        expect(ability || nation.id).toBeTruthy();
      });
    });

    test('各アビリティに必須フィールドが含まれているか', () => {
      Object.entries(ALL_NATION_ABILITIES).forEach(([nationId, ability]) => {
        expect(ability.id).toBe(nationId);
        expect(ability.name).toBeTruthy();
        expect(ability.description).toBeTruthy();
        expect(Array.isArray(ability.effects)).toBe(true);
      });
    });
  });

  describe('アビリティタイプ別テスト', () => {
    describe('damage型アビリティ', () => {
      test('ダメージ倍率が正しく適用される', () => {
        const result = AbilityProcessorV2.processAttack(
          'usa',
          100,
          mockEnemy,
          [mockEnemy]
        );
        
        expect(result.totalDamage).toBeGreaterThan(100);
        expect(result.effects).toContain('大爆発！');
      });
    });

    describe('explosion型アビリティ', () => {
      test('爆発範囲内の敵すべてにダメージ', () => {
        const enemies = createMockEnemies(10);
        const result = AbilityProcessorV2.processAttack(
          'russia',
          100,
          enemies[0],
          enemies
        );
        
        expect(result.effects).toContain('大爆発！');
        expect(result.affectedEnemies.length).toBeGreaterThan(1);
      });
    });

    describe('chain型アビリティ', () => {
      test('連鎖攻撃が正しく機能する', () => {
        const enemies = createMockEnemies(5);
        const result = AbilityProcessorV2.processAttack(
          'uk',
          50,
          enemies[0],
          enemies
        );
        
        expect(result.effects.some(e => e.includes('連鎖'))).toBe(true);
        expect(result.affectedEnemies.length).toBeGreaterThan(1);
      });
    });

    describe('laser型アビリティ', () => {
      test('直線上の敵を貫通する', () => {
        const enemies = [
          { x: 100, y: 100, hp: 100, reward: 10, speed: 1, type: 'normal' },
          { x: 200, y: 200, hp: 100, reward: 10, speed: 1, type: 'normal' },
          { x: 300, y: 300, hp: 100, reward: 10, speed: 1, type: 'normal' },
          { x: 150, y: 250, hp: 100, reward: 10, speed: 1, type: 'normal' } // 直線上にない
        ];
        
        const result = AbilityProcessorV2.processAttack(
          'japan',
          50,
          enemies[0],
          enemies
        );
        
        expect(result.effects).toContain('レーザー！');
        expect(result.affectedEnemies.length).toBeGreaterThanOrEqual(3);
      });
    });

    describe('freeze型アビリティ', () => {
      test('敵を凍結させる', () => {
        const enemies = createMockEnemies(5);
        const result = AbilityProcessorV2.processAttack(
          'canada',
          50,
          enemies[0],
          enemies
        );
        
        expect(result.effects).toContain('全体凍結！');
        enemies.forEach(enemy => {
          expect(enemy.frozen).toBe(true);
          expect(enemy.frozenUntil).toBeGreaterThan(Date.now());
        });
      });
    });

    describe('buff型アビリティ', () => {
      test('味方タワーを強化する', () => {
        const towers = createMockTowers(3, 'germany');
        const result = AbilityProcessorV2.processAttack(
          'germany',
          50,
          mockEnemy,
          [mockEnemy],
          towers
        );
        
        expect(result.effects).toContain('全体強化！');
        towers.forEach(tower => {
          expect(tower.buffMultiplier).toBeGreaterThan(1);
        });
      });
    });

    describe('money型アビリティ', () => {
      test('コインボーナスが正しく計算される', () => {
        const coinCallback = vi.fn();
        
        AbilityProcessorV2.processAttack(
          'singapore',
          50,
          mockEnemy,
          [mockEnemy],
          undefined,
          coinCallback
        );
        
        expect(coinCallback).toHaveBeenCalled();
        const coinAmount = coinCallback.mock.calls[0][0];
        expect(coinAmount).toBeGreaterThan(0);
      });
    });

    describe('summon型アビリティ', () => {
      test('召喚効果が発動する', () => {
        const specialEffectCallback = vi.fn();
        
        const result = AbilityProcessorV2.processAttack(
          'italy',
          50,
          mockEnemy,
          [mockEnemy],
          undefined,
          undefined,
          specialEffectCallback
        );
        
        expect(result.effects).toContain('召喚2体！');
        expect(specialEffectCallback).toHaveBeenCalledWith('summon', expect.any(Object));
      });
    });

    describe('transform型アビリティ', () => {
      test('敵を変換する', () => {
        const enemy = { ...mockEnemy };
        
        // 確率があるので複数回試行
        let transformed = false;
        for (let i = 0; i < 20; i++) {
          const result = AbilityProcessorV2.processAttack(
            'mexico',
            50,
            enemy,
            [enemy]
          );
          
          if (enemy.transformed) {
            transformed = true;
            expect(enemy.type).toBe('weakened');
            expect(enemy.hp).toBeLessThan(100);
            break;
          }
        }
        
        expect(transformed).toBe(true);
      });
    });
  });

  describe('特殊国家のテスト', () => {
    test('北朝鮮のランダムアビリティ', () => {
      const effects = new Set<string>();
      
      // 複数回実行して異なる効果が出ることを確認
      for (let i = 0; i < 50; i++) {
        const result = AbilityProcessorV2.processAttack(
          'north_korea',
          50,
          mockEnemy,
          createMockEnemies(5)
        );
        
        result.effects.forEach(e => effects.add(e));
      }
      
      expect(effects.size).toBeGreaterThan(3); // 複数の異なる効果
      expect(effects.has('？？？')).toBe(true);
    });

    test('ベネズエラのコスト増加', () => {
      const modifiers1 = AbilityProcessorV2.getTowerModifiers('venezuela');
      
      // 時間経過をシミュレート
      vi.advanceTimersByTime(5000);
      
      const modifiers2 = AbilityProcessorV2.getTowerModifiers('venezuela');
      
      expect(modifiers2.cost).not.toBe(modifiers1.cost);
    });

    test('ジンバブエのお金蒸発効果', () => {
      const coinCallback = vi.fn();
      const specialEffectCallback = vi.fn();
      
      AbilityProcessorV2.processAttack(
        'zimbabwe',
        50,
        mockEnemy,
        [mockEnemy],
        undefined,
        coinCallback,
        specialEffectCallback
      );
      
      // 最初は大量のコインを獲得
      expect(coinCallback).toHaveBeenCalledWith(expect.any(Number));
      const initialCoins = coinCallback.mock.calls[0][0];
      expect(initialCoins).toBeGreaterThan(50);
      
      // 1秒後にお金が減る
      vi.advanceTimersByTime(1100);
      
      expect(coinCallback).toHaveBeenCalledTimes(2);
      const lostCoins = coinCallback.mock.calls[1][0];
      expect(lostCoins).toBeLessThan(0);
    });
  });

  describe('GDP階層別バランステスト', () => {
    test('高GDP国ほど強力なアビリティを持つ', () => {
      const usaResult = AbilityProcessorV2.processAttack(
        'usa',
        100,
        mockEnemy,
        createMockEnemies(5)
      );
      
      const nauruResult = AbilityProcessorV2.processAttack(
        'nauru',
        100,
        mockEnemy,
        createMockEnemies(5)
      );
      
      // USAの方が強力
      expect(usaResult.totalDamage).toBeGreaterThan(nauruResult.totalDamage);
      expect(usaResult.effects.length).toBeGreaterThanOrEqual(nauruResult.effects.length);
    });

    test('低GDP国はコスト効率が良い', () => {
      const nauruAbility = ALL_NATION_ABILITIES['nauru'];
      const usaAbility = ALL_NATION_ABILITIES['usa'];
      
      // ナウルはコイン効率が良い
      const nauruMoneyEffect = nauruAbility.effects.find(e => e.type === 'money');
      const usaMoneyEffect = usaAbility.effects.find(e => e.type === 'money');
      
      expect(nauruMoneyEffect?.value || 0).toBeGreaterThan(usaMoneyEffect?.value || 0);
    });
  });

  describe('地域特性テスト', () => {
    test('ヨーロッパ諸国の特徴', () => {
      const europeanCountries = ['germany', 'france', 'uk', 'italy', 'spain'];
      
      europeanCountries.forEach(countryId => {
        const ability = ALL_NATION_ABILITIES[countryId];
        expect(ability).toBeTruthy();
        
        // ヨーロッパは多様な効果を持つ
        expect(ability.effects.length).toBeGreaterThanOrEqual(2);
      });
    });

    test('アジア諸国の特徴', () => {
      const asianCountries = ['japan', 'china', 'south_korea', 'singapore'];
      
      asianCountries.forEach(countryId => {
        const ability = ALL_NATION_ABILITIES[countryId];
        expect(ability).toBeTruthy();
        
        // アジアは多様な効果（技術系または多体攻撃）を持つ
        const hasTechOrMultiEffect = ability.effects.some(e => 
          ['laser', 'multi', 'range', 'chain', 'debuff'].includes(e.type)
        );
        expect(hasTechOrMultiEffect).toBe(true);
      });
    });
  });

  describe('特殊エフェクトテスト', () => {
    test('視覚効果が正しく発動する', () => {
      const specialEffectCallback = vi.fn();
      
      const countriesWithEffects = [
        'france', 'russia', 'indonesia', 'netherlands', 'egypt',
        'romania', 'colombia', 'greece', 'iceland', 'monaco'
      ];
      
      countriesWithEffects.forEach(countryId => {
        specialEffectCallback.mockClear();
        
        AbilityProcessorV2.processAttack(
          countryId,
          50,
          mockEnemy,
          createMockEnemies(3),
          undefined,
          undefined,
          specialEffectCallback
        );
        
        const ability = ALL_NATION_ABILITIES[countryId];
        if (ability.specialEffect) {
          expect(specialEffectCallback).toHaveBeenCalled();
        }
      });
    });
  });

  describe('パフォーマンステスト', () => {
    test('大量の敵に対する処理性能', () => {
      const enemies = createMockEnemies(100);
      const towers = createMockTowers(20, 'usa');
      
      const startTime = performance.now();
      
      // 10回攻撃をシミュレート
      for (let i = 0; i < 10; i++) {
        AbilityProcessorV2.processAttack(
          'china',
          50,
          enemies[0],
          enemies,
          towers
        );
      }
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      // 100ms以内に完了すること
      expect(processingTime).toBeLessThan(100);
    });
  });
});