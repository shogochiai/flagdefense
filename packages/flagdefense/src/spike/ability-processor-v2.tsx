// アビリティ処理システム v2.0
// 新しいアビリティタイプに対応

import { AbilityEffect, NationAbility, ALL_NATION_ABILITIES } from './nation-abilities-v2';
import { FULL_NATION_DATABASE } from './nations-full-database';

export interface ProcessAttackResult {
  affectedEnemies: any[];
  totalDamage: number;
  effects: string[];
  specialResults?: any;
}

export class AbilityProcessorV2 {
  // ランダムアビリティのプール（北朝鮮用）
  private static randomAbilityPool: AbilityEffect[] = [
    { type: 'damage', value: 3.0 },
    { type: 'explosion', value: 2.5, radius: 120 },
    { type: 'freeze', value: 2000 },
    { type: 'chain', value: 5 },
    { type: 'laser', value: 2.0 },
    { type: 'money', value: 3.0 },
    { type: 'transform', value: 0.5, chance: 0.3 },
    { type: 'debuff', value: 0.3, target: 'enemy' }
  ];

  // 攻撃処理
  static processAttack(
    towerNationId: string,
    baseDamage: number,
    targetEnemy: any,
    allEnemies: any[],
    allTowers?: any[],
    onCoinEarned?: (amount: number) => void,
    onSpecialEffect?: (effect: string, data?: any) => void
  ): ProcessAttackResult {
    const ability = ALL_NATION_ABILITIES[towerNationId] || ALL_NATION_ABILITIES.default;
    let affectedEnemies = [targetEnemy];
    let totalDamage = baseDamage;
    const appliedEffects: string[] = [];
    const specialResults: any = {};

    // 北朝鮮の特殊処理
    let effects = ability.effects;
    if (towerNationId === 'north_korea') {
      const randomEffect = this.randomAbilityPool[Math.floor(Math.random() * this.randomAbilityPool.length)];
      effects = [randomEffect];
      appliedEffects.push('？？？');
    }

    // 各エフェクトを処理
    effects.forEach(effect => {
      switch (effect.type) {
        case 'damage':
          if (effect.chance && Math.random() > effect.chance) break;
          totalDamage *= effect.value;
          if (effect.value >= 2.0) {
            appliedEffects.push('強撃！');
          }
          break;

        case 'splash':
          const splashRadius = effect.radius || 60;
          const nearbyEnemies = allEnemies.filter(e => 
            e !== targetEnemy &&
            Math.sqrt(
              Math.pow(e.x - targetEnemy.x, 2) + 
              Math.pow(e.y - targetEnemy.y, 2)
            ) <= splashRadius
          );
          affectedEnemies = [targetEnemy, ...nearbyEnemies];
          totalDamage *= effect.value;
          appliedEffects.push('範囲攻撃！');
          break;

        case 'multi':
          const additionalTargets = allEnemies
            .filter(e => e !== targetEnemy && !affectedEnemies.includes(e))
            .slice(0, effect.value - 1);
          affectedEnemies = [...affectedEnemies, ...additionalTargets];
          appliedEffects.push(`${effect.value}連撃！`);
          break;

        case 'pierce':
          const angle = Math.atan2(targetEnemy.y - 400, targetEnemy.x - 400);
          const piercedEnemies = allEnemies.filter(e => {
            if (affectedEnemies.includes(e)) return false;
            const enemyAngle = Math.atan2(e.y - 400, e.x - 400);
            return Math.abs(enemyAngle - angle) < 0.15;
          }).slice(0, effect.value - 1);
          affectedEnemies = [...affectedEnemies, ...piercedEnemies];
          appliedEffects.push('貫通！');
          break;

        case 'chain':
          const chainTargets: any[] = [];
          let lastTarget = targetEnemy;
          
          for (let i = 0; i < effect.value; i++) {
            const nextTarget = allEnemies
              .filter(e => !affectedEnemies.includes(e) && !chainTargets.includes(e))
              .reduce((nearest, enemy) => {
                const dist = Math.sqrt(
                  Math.pow(enemy.x - lastTarget.x, 2) + 
                  Math.pow(enemy.y - lastTarget.y, 2)
                );
                const nearestDist = nearest ? Math.sqrt(
                  Math.pow(nearest.x - lastTarget.x, 2) + 
                  Math.pow(nearest.y - lastTarget.y, 2)
                ) : Infinity;
                return dist < nearestDist ? enemy : nearest;
              }, null);
            
            if (nextTarget) {
              chainTargets.push(nextTarget);
              lastTarget = nextTarget;
            } else {
              break;
            }
          }
          
          affectedEnemies = [...affectedEnemies, ...chainTargets];
          appliedEffects.push(`連鎖${chainTargets.length + 1}！`);
          break;

        case 'laser':
          const laserAngle = Math.atan2(targetEnemy.y - 400, targetEnemy.x - 400);
          const laserTargets = allEnemies.filter(e => {
            const enemyAngle = Math.atan2(e.y - 400, e.x - 400);
            return Math.abs(enemyAngle - laserAngle) < 0.05;
          });
          affectedEnemies = laserTargets;
          totalDamage *= effect.value;
          appliedEffects.push('レーザー！');
          break;

        case 'freeze':
          if (effect.chance && Math.random() > effect.chance) break;
          
          if (effect.target === 'enemy') {
            // 全体凍結
            allEnemies.forEach(enemy => {
              enemy.frozen = true;
              enemy.frozenUntil = Date.now() + effect.value;
            });
            appliedEffects.push('全体凍結！');
          } else {
            // 単体凍結
            affectedEnemies.forEach(enemy => {
              enemy.frozen = true;
              enemy.frozenUntil = Date.now() + effect.value;
            });
            appliedEffects.push('凍結！');
          }
          break;

        case 'explosion':
          const explosionRadius = effect.radius || 100;
          const explosionTargets = allEnemies.filter(e => {
            const dist = Math.sqrt(
              Math.pow(e.x - targetEnemy.x, 2) + 
              Math.pow(e.y - targetEnemy.y, 2)
            );
            return dist <= explosionRadius;
          });
          affectedEnemies = explosionTargets;
          totalDamage *= effect.value;
          appliedEffects.push('大爆発！');
          
          if (onSpecialEffect && ability.specialEffect) {
            onSpecialEffect('explosion', {
              x: targetEnemy.x,
              y: targetEnemy.y,
              radius: explosionRadius,
              type: ability.specialEffect
            });
          }
          break;

        case 'slow':
          affectedEnemies.forEach(enemy => {
            if (effect.value < 0) {
              // ノックバック
              enemy.knockback = -effect.value;
              enemy.knockbackUntil = Date.now() + (effect.duration || 500);
              appliedEffects.push('ノックバック！');
            } else {
              // スロー
              enemy.speedModifier = effect.value;
              enemy.speedModifierUntil = Date.now() + (effect.duration || 2000);
              appliedEffects.push('スロー！');
            }
          });
          break;

        case 'buff':
          if (!allTowers) break;
          
          let buffTargets: any[] = [];
          if (effect.target === 'global') {
            buffTargets = allTowers;
            appliedEffects.push('全体強化！');
          } else if (effect.target === 'ally') {
            // 周囲の味方
            const tower = allTowers.find(t => t.nationId === towerNationId);
            if (tower) {
              buffTargets = allTowers.filter(t => {
                const dist = Math.sqrt(
                  Math.pow(t.x - tower.x, 2) + 
                  Math.pow(t.y - tower.y, 2)
                );
                return dist <= 150 && t !== tower;
              });
            }
            appliedEffects.push('味方強化！');
          } else if (effect.target === 'self') {
            const tower = allTowers.find(t => t.nationId === towerNationId);
            if (tower) buffTargets = [tower];
            appliedEffects.push('自己強化！');
          }
          
          buffTargets.forEach(tower => {
            tower.buffMultiplier = (tower.buffMultiplier || 1) * effect.value;
            tower.buffUntil = Date.now() + (effect.duration || 3000);
          });
          break;

        case 'debuff':
          if (effect.target === 'enemy') {
            affectedEnemies.forEach(enemy => {
              enemy.debuffMultiplier = effect.value;
              enemy.debuffUntil = Date.now() + (effect.duration || 2000);
            });
            appliedEffects.push('弱体化！');
          }
          break;

        case 'money':
          if (onCoinEarned) {
            let bonus = effect.value - 1;
            
            // 特殊処理
            if (towerNationId === 'monaco' || towerNationId === 'netherlands') {
              if (effect.chance && Math.random() < effect.chance) {
                bonus *= 10; // 大当たり！
                appliedEffects.push('💰 大当たり！');
              }
            }
            
            if (towerNationId === 'zimbabwe' && onSpecialEffect) {
              // お金が蒸発する演出
              setTimeout(() => {
                onCoinEarned(-Math.floor(targetEnemy.reward * bonus * 0.9));
                onSpecialEffect('money_evaporate', {});
              }, 1000);
            }
            
            onCoinEarned(Math.floor(targetEnemy.reward * bonus));
            appliedEffects.push('💰 コイン生成！');
          }
          break;

        case 'summon':
          specialResults.summonCount = effect.value;
          appliedEffects.push(`召喚${effect.value}体！`);
          if (onSpecialEffect) {
            onSpecialEffect('summon', {
              count: effect.value,
              nationId: towerNationId
            });
          }
          break;

        case 'transform':
          if (effect.chance && Math.random() < effect.chance) {
            affectedEnemies.forEach(enemy => {
              enemy.transformed = true;
              enemy.originalType = enemy.type;
              enemy.type = 'weakened';
              enemy.hp *= effect.value;
              enemy.speed *= 0.5;
            });
            appliedEffects.push('変換！');
            
            if (onSpecialEffect && ability.specialEffect) {
              onSpecialEffect(ability.specialEffect, {
                enemies: affectedEnemies
              });
            }
          }
          break;

        case 'range':
          // タワーのステータス補正で処理
          break;
      }
    });

    // 特殊エフェクトの発動
    if (ability.specialEffect && onSpecialEffect) {
      switch (ability.specialEffect) {
        case 'rainbow_explosion':
        case 'nuclear_winter':
        case 'lava_flow':
        case 'coin_explosion':
        case 'emerald_beam':
        case 'vampire_bite':
        case 'gold_laser':
        case 'mummy_wrap':
        case 'ice_shatter':
        case 'dice_roll':
        case 'holy_light':
        case 'debt_counter':
        case 'inflation_counter':
        case 'money_evaporate':
        case 'rebel_flag':
          onSpecialEffect(ability.specialEffect, {
            x: targetEnemy.x,
            y: targetEnemy.y,
            affectedEnemies
          });
          break;
      }
    }

    return {
      affectedEnemies,
      totalDamage,
      effects: appliedEffects,
      specialResults
    };
  }

  // タワーのステータス補正
  static getTowerModifiers(nationId: string): {
    damage: number,
    range: number,
    attackSpeed: number,
    cost?: number
  } {
    const ability = ALL_NATION_ABILITIES[nationId] || ALL_NATION_ABILITIES.default;
    const nation = FULL_NATION_DATABASE.find(n => n.id === nationId);
    
    let damageModifier = 1;
    let rangeModifier = 1;
    let attackSpeedModifier = 1;
    let costModifier = 1;

    ability.effects.forEach(effect => {
      if (effect.type === 'damage' && !effect.chance) {
        damageModifier *= effect.value;
      } else if (effect.type === 'range') {
        rangeModifier *= effect.value;
      }
    });

    // 特殊な国家の処理
    if (nationId === 'brazil' || nationId === 'thailand') {
      attackSpeedModifier = 0.67; // 50%速い
    } else if (nationId === 'malta') {
      attackSpeedModifier = 1.2; // 20%遅い
    }

    // ベネズエラのインフレ
    if (nationId === 'venezuela') {
      costModifier = 1.0 + (Date.now() % 10000) / 10000; // 時間経過でコスト増加
    }

    // GDP補正
    if (nation) {
      const gdpTier = Math.floor(Math.log10(nation.gdp + 1));
      damageModifier *= (1 + gdpTier * 0.1);
      rangeModifier *= (1 + gdpTier * 0.05);
    }

    return {
      damage: damageModifier,
      range: rangeModifier,
      attackSpeed: attackSpeedModifier,
      cost: costModifier
    };
  }

  // 能力の説明文を取得
  static getAbilityDescription(nationId: string): string {
    const ability = ALL_NATION_ABILITIES[nationId];
    return ability?.description || '特殊能力なし';
  }

  // 国の能力情報を取得
  static getNationAbilityInfo(nationId: string): NationAbility | null {
    return ALL_NATION_ABILITIES[nationId] || null;
  }
}