// 国家別特殊能力システム

export interface AbilityEffect {
  type: 'damage' | 'slow' | 'splash' | 'money' | 'range' | 'multi' | 'pierce';
  value: number;
  duration?: number;
}

export interface NationAbility {
  id: string;
  name: string;
  description: string;
  effects: AbilityEffect[];
  cooldown?: number;
}

// 国家別の特殊能力定義
export const NATION_ABILITIES: Record<string, NationAbility> = {
  // 超大国
  usa: {
    id: 'usa',
    name: 'エアストライク',
    description: '範囲攻撃ダメージ+50%',
    effects: [{ type: 'splash', value: 1.5 }]
  },
  china: {
    id: 'china',
    name: '人海戦術',
    description: '攻撃が3体同時に命中',
    effects: [{ type: 'multi', value: 3 }]
  },
  
  // 大国
  japan: {
    id: 'japan',
    name: '精密射撃',
    description: 'ダメージ+30%、射程+20%',
    effects: [
      { type: 'damage', value: 1.3 },
      { type: 'range', value: 1.2 }
    ]
  },
  germany: {
    id: 'germany',
    name: '効率化',
    description: 'コイン獲得+40%',
    effects: [{ type: 'money', value: 1.4 }]
  },
  india: {
    id: 'india',
    name: 'スロー効果',
    description: '敵の移動速度-30%（2秒）',
    effects: [{ type: 'slow', value: 0.7, duration: 2000 }]
  },
  uk: {
    id: 'uk',
    name: '貫通弾',
    description: '攻撃が敵を貫通',
    effects: [{ type: 'pierce', value: 2 }]
  },
  france: {
    id: 'france',
    name: '芸術的爆発',
    description: '範囲攻撃、ダメージ+20%',
    effects: [
      { type: 'splash', value: 1.2 },
      { type: 'damage', value: 1.2 }
    ]
  },
  
  // 中規模国
  italy: {
    id: 'italy',
    name: 'ピザ投げ',
    description: '回転攻撃で周囲の敵に命中',
    effects: [{ type: 'splash', value: 1.0 }]
  },
  brazil: {
    id: 'brazil',
    name: 'カーニバル',
    description: '攻撃速度+50%',
    effects: [{ type: 'damage', value: 1.0 }] // 攻撃速度は別途処理
  },
  canada: {
    id: 'canada',
    name: 'アイスショット',
    description: '敵を凍結（1秒）',
    effects: [{ type: 'slow', value: 0, duration: 1000 }]
  },
  south_korea: {
    id: 'south_korea',
    name: 'テクノロジー',
    description: 'ダメージ+25%、射程+25%',
    effects: [
      { type: 'damage', value: 1.25 },
      { type: 'range', value: 1.25 }
    ]
  },
  spain: {
    id: 'spain',
    name: '情熱の炎',
    description: '継続ダメージ効果',
    effects: [{ type: 'damage', value: 1.1 }]
  },
  australia: {
    id: 'australia',
    name: 'ブーメラン',
    description: '跳ね返り攻撃（2体）',
    effects: [{ type: 'multi', value: 2 }]
  },
  
  // 小規模国
  singapore: {
    id: 'singapore',
    name: '貿易ボーナス',
    description: 'コイン獲得+60%',
    effects: [{ type: 'money', value: 1.6 }]
  },
  ireland: {
    id: 'ireland',
    name: 'ラッキーショット',
    description: '20%の確率で3倍ダメージ',
    effects: [{ type: 'damage', value: 1.0 }] // 特殊処理
  },
  israel: {
    id: 'israel',
    name: 'アイアンドーム',
    description: '射程+40%',
    effects: [{ type: 'range', value: 1.4 }]
  },
  
  // 極小国
  iceland: {
    id: 'iceland',
    name: '氷河',
    description: '強力なスロー効果（-50%）',
    effects: [{ type: 'slow', value: 0.5, duration: 3000 }]
  },
  malta: {
    id: 'malta',
    name: '要塞',
    description: 'ダメージ+40%だが攻撃速度-20%',
    effects: [{ type: 'damage', value: 1.4 }]
  },
  monaco: {
    id: 'monaco',
    name: 'カジノ',
    description: 'コイン獲得が0〜200%でランダム',
    effects: [{ type: 'money', value: 1.0 }] // 特殊処理
  },
  liechtenstein: {
    id: 'liechtenstein',
    name: '精密機械',
    description: 'ダメージ+50%',
    effects: [{ type: 'damage', value: 1.5 }]
  },
  
  // マイクロ国家
  nauru: {
    id: 'nauru',
    name: '採掘',
    description: 'コイン獲得+80%',
    effects: [{ type: 'money', value: 1.8 }]
  },
  tuvalu: {
    id: 'tuvalu',
    name: '波の力',
    description: '敵を押し戻す効果',
    effects: [{ type: 'slow', value: -0.5, duration: 500 }] // 負の値で後退
  },
  
  // デフォルト
  default: {
    id: 'default',
    name: '通常攻撃',
    description: '特殊能力なし',
    effects: []
  }
};

// 攻撃処理用のヘルパークラス
export class AbilityProcessor {
  // 特殊能力を適用した攻撃
  static processAttack(
    towerNationId: string,
    baseDamage: number,
    targetEnemy: any,
    allEnemies: any[],
    onCoinEarned?: (amount: number) => void
  ): {
    affectedEnemies: any[],
    totalDamage: number,
    effects: string[]
  } {
    const ability = NATION_ABILITIES[towerNationId] || NATION_ABILITIES.default;
    let affectedEnemies = [targetEnemy];
    let totalDamage = baseDamage;
    const appliedEffects: string[] = [];

    ability.effects.forEach(effect => {
      switch (effect.type) {
        case 'damage':
          // アイルランドの特殊処理
          if (towerNationId === 'ireland' && Math.random() < 0.2) {
            totalDamage = baseDamage * 3;
            appliedEffects.push('クリティカル!');
          } else {
            totalDamage = baseDamage * effect.value;
          }
          break;

        case 'splash':
          // 範囲攻撃
          const splashRadius = 60;
          const nearbyEnemies = allEnemies.filter(e => 
            e !== targetEnemy &&
            Math.sqrt(
              Math.pow(e.x - targetEnemy.x, 2) + 
              Math.pow(e.y - targetEnemy.y, 2)
            ) <= splashRadius
          );
          affectedEnemies = [targetEnemy, ...nearbyEnemies];
          totalDamage = baseDamage * effect.value;
          appliedEffects.push('範囲攻撃!');
          break;

        case 'multi':
          // 複数体攻撃
          const additionalTargets = allEnemies
            .filter(e => e !== targetEnemy)
            .slice(0, effect.value - 1);
          affectedEnemies = [targetEnemy, ...additionalTargets];
          appliedEffects.push('マルチ!');
          break;

        case 'pierce':
          // 貫通攻撃（直線上の敵）
          const angle = Math.atan2(targetEnemy.y - 200, targetEnemy.x - 400); // タワー位置から
          const piercedEnemies = allEnemies.filter(e => {
            if (e === targetEnemy) return false;
            const enemyAngle = Math.atan2(e.y - 200, e.x - 400);
            return Math.abs(enemyAngle - angle) < 0.1;
          }).slice(0, effect.value - 1);
          affectedEnemies = [targetEnemy, ...piercedEnemies];
          appliedEffects.push('貫通!');
          break;

        case 'slow':
          // スロー効果
          targetEnemy.speedModifier = effect.value;
          targetEnemy.speedModifierUntil = Date.now() + (effect.duration || 2000);
          appliedEffects.push('スロー!');
          break;

        case 'money':
          // コイン獲得ボーナス
          if (onCoinEarned) {
            const bonus = towerNationId === 'monaco' 
              ? Math.random() * 2 
              : effect.value - 1;
            onCoinEarned(Math.floor(targetEnemy.reward * bonus));
            appliedEffects.push('💰 コイン生成!');
          }
          break;
      }
    });

    // ブラジルの攻撃速度ボーナス（別途処理が必要）
    if (towerNationId === 'brazil') {
      appliedEffects.push('高速!');
    }

    return {
      affectedEnemies,
      totalDamage,
      effects: appliedEffects
    };
  }

  // タワーのステータス補正
  static getTowerModifiers(nationId: string): {
    damage: number,
    range: number,
    attackSpeed: number
  } {
    const ability = NATION_ABILITIES[nationId] || NATION_ABILITIES.default;
    let damageModifier = 1;
    let rangeModifier = 1;
    let attackSpeedModifier = 1;

    ability.effects.forEach(effect => {
      if (effect.type === 'damage') {
        damageModifier *= effect.value;
      } else if (effect.type === 'range') {
        rangeModifier *= effect.value;
      }
    });

    // 特殊な国家の処理
    if (nationId === 'brazil') {
      attackSpeedModifier = 0.67; // 50%速い = 間隔が2/3
    } else if (nationId === 'malta') {
      attackSpeedModifier = 1.2; // 20%遅い
    }

    return {
      damage: damageModifier,
      range: rangeModifier,
      attackSpeed: attackSpeedModifier
    };
  }

  // 能力の説明文を取得
  static getAbilityDescription(nationId: string): string {
    const ability = NATION_ABILITIES[nationId] || NATION_ABILITIES.default;
    return ability.description;
  }
}