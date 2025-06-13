// 国家別特殊能力システム v2.0
// 250カ国すべてに対応した包括的なアビリティシステム

import { FULL_NATION_DATABASE } from './nations-full-database';

export interface AbilityEffect {
  type: 'damage' | 'slow' | 'splash' | 'money' | 'range' | 'multi' | 'pierce' 
    | 'chain' | 'laser' | 'freeze' | 'explosion' | 'buff' | 'debuff' | 'summon' | 'transform';
  value: number;
  duration?: number;
  chance?: number; // 発動確率
  radius?: number; // 効果範囲
  target?: 'enemy' | 'ally' | 'self' | 'global'; // 対象
}

export interface NationAbility {
  id: string;
  name: string;
  description: string;
  effects: AbilityEffect[];
  cooldown?: number;
  specialEffect?: string; // 特殊視覚効果
}

// 250カ国の特殊能力定義
export const NATION_ABILITIES_V2: Record<string, NationAbility> = {
  // ========== 超大国（GDP 10兆ドル以上） ==========
  usa: {
    id: 'usa',
    name: 'スーパーエアストライク',
    description: '巨大爆発+範囲ダメージ+スタン',
    effects: [
      { type: 'explosion', value: 3.0, radius: 150 },
      { type: 'freeze', value: 1000, target: 'enemy' },
      { type: 'damage', value: 1.5 }
    ]
  },
  china: {
    id: 'china',
    name: '万里の長城',
    description: '全敵スロー+5体同時攻撃+防御バフ',
    effects: [
      { type: 'multi', value: 5 },
      { type: 'debuff', value: 0.5, target: 'enemy', duration: 3000 },
      { type: 'buff', value: 1.3, target: 'ally' }
    ]
  },

  // ========== 大国（GDP 1兆〜10兆ドル） ==========
  japan: {
    id: 'japan',
    name: 'ハイテク精密攻撃',
    description: 'レーザー+ダメージ+射程ボーナス',
    effects: [
      { type: 'laser', value: 2.0 },
      { type: 'damage', value: 1.4 },
      { type: 'range', value: 1.3 }
    ]
  },
  germany: {
    id: 'germany',
    name: '工業力',
    description: '全タワー強化+コイン生成',
    effects: [
      { type: 'buff', value: 1.2, target: 'global', duration: 5000 },
      { type: 'money', value: 1.6 }
    ]
  },
  india: {
    id: 'india',
    name: 'IT革命',
    description: '敵をデバフ+変換効果',
    effects: [
      { type: 'debuff', value: 0.6, target: 'enemy' },
      { type: 'transform', value: 0.2, chance: 0.3 }, // 30%で敵を弱体化
      { type: 'money', value: 1.3 }
    ]
  },
  uk: {
    id: 'uk',
    name: '大英帝国の威光',
    description: '貫通+連鎖+ダメージ',
    effects: [
      { type: 'pierce', value: 3 },
      { type: 'chain', value: 2 },
      { type: 'damage', value: 1.2 }
    ]
  },
  france: {
    id: 'france',
    name: 'ルーブル芸術爆発',
    description: '美しい爆発+魅了効果',
    effects: [
      { type: 'explosion', value: 2.5, radius: 120 },
      { type: 'freeze', value: 1500, chance: 0.5 },
      { type: 'damage', value: 1.3 }
    ],
    specialEffect: 'rainbow_explosion'
  },
  brazil: {
    id: 'brazil',
    name: 'カーニバル熱狂',
    description: '高速攻撃+範囲+コイン',
    effects: [
      { type: 'damage', value: 1.2 },
      { type: 'splash', value: 1.5 },
      { type: 'money', value: 1.4 }
    ]
  },
  italy: {
    id: 'italy',
    name: 'ローマ帝国の復活',
    description: '召喚+範囲強化',
    effects: [
      { type: 'summon', value: 2 }, // 2体の援軍召喚
      { type: 'splash', value: 1.8 },
      { type: 'damage', value: 1.1 }
    ]
  },
  canada: {
    id: 'canada',
    name: '極寒ブリザード',
    description: '全体凍結+継続ダメージ',
    effects: [
      { type: 'freeze', value: 2000, target: 'enemy' },
      { type: 'damage', value: 1.3 },
      { type: 'slow', value: 0.3, duration: 5000 }
    ]
  },
  russia: {
    id: 'russia',
    name: '核の冬',
    description: '超強力全体凍結+爆発',
    effects: [
      { type: 'freeze', value: 3000, target: 'enemy' },
      { type: 'explosion', value: 4.0, radius: 200 },
      { type: 'debuff', value: 0.3, target: 'enemy' }
    ],
    specialEffect: 'nuclear_winter'
  },
  south_korea: {
    id: 'south_korea',
    name: 'K-POPウェーブ',
    description: '連鎖攻撃+魅了+バフ',
    effects: [
      { type: 'chain', value: 4 },
      { type: 'freeze', value: 500, chance: 0.3 },
      { type: 'buff', value: 1.2, target: 'ally' }
    ]
  },
  australia: {
    id: 'australia',
    name: 'ブーメランストーム',
    description: '跳ね返り攻撃+貫通',
    effects: [
      { type: 'multi', value: 3 },
      { type: 'pierce', value: 2 },
      { type: 'damage', value: 1.2 }
    ]
  },
  mexico: {
    id: 'mexico',
    name: 'マヤの呪い',
    description: '変換+デバフ+爆発',
    effects: [
      { type: 'transform', value: 0.5, chance: 0.2 },
      { type: 'debuff', value: 0.6, target: 'enemy' },
      { type: 'explosion', value: 1.8, radius: 80 }
    ]
  },
  spain: {
    id: 'spain',
    name: '無敵艦隊',
    description: '複数レーザー+貫通',
    effects: [
      { type: 'laser', value: 1.5 },
      { type: 'multi', value: 3 },
      { type: 'pierce', value: 2 }
    ]
  },
  indonesia: {
    id: 'indonesia',
    name: '火山噴火',
    description: '巨大爆発+継続ダメージ',
    effects: [
      { type: 'explosion', value: 2.8, radius: 140 },
      { type: 'damage', value: 1.4 },
      { type: 'slow', value: 0.5, duration: 3000 }
    ],
    specialEffect: 'lava_flow'
  },
  saudi_arabia: {
    id: 'saudi_arabia',
    name: 'オイルマネー爆撃',
    description: '爆発するたびにコイン生成',
    effects: [
      { type: 'explosion', value: 2.5, radius: 100 },
      { type: 'money', value: 2.0 },
      { type: 'damage', value: 1.3 }
    ]
  },
  turkey: {
    id: 'turkey',
    name: 'オスマンの栄光',
    description: '征服効果+範囲制圧',
    effects: [
      { type: 'transform', value: 0.3, chance: 0.15 },
      { type: 'splash', value: 2.0 },
      { type: 'buff', value: 1.15, target: 'self' }
    ]
  },

  // ========== 大国（GDP 1000億〜1兆ドル） ==========
  netherlands: {
    id: 'netherlands',
    name: 'チューリップバブル',
    description: '確率で大量コイン+連鎖',
    effects: [
      { type: 'money', value: 5.0, chance: 0.1 },
      { type: 'chain', value: 3 },
      { type: 'damage', value: 1.1 }
    ],
    specialEffect: 'coin_explosion'
  },
  switzerland: {
    id: 'switzerland',
    name: '時計仕掛けの精密さ',
    description: '時間停止+必中攻撃',
    effects: [
      { type: 'freeze', value: 2000, target: 'enemy' },
      { type: 'damage', value: 1.8 },
      { type: 'pierce', value: 2 }
    ]
  },
  poland: {
    id: 'poland',
    name: 'ヴィスワの奇跡',
    description: '防御強化+反撃',
    effects: [
      { type: 'buff', value: 1.5, target: 'self' },
      { type: 'damage', value: 1.3 },
      { type: 'multi', value: 2 }
    ]
  },
  sweden: {
    id: 'sweden',
    name: 'ノーベル爆弾',
    description: '科学的大爆発',
    effects: [
      { type: 'explosion', value: 3.5, radius: 160 },
      { type: 'damage', value: 1.2 },
      { type: 'debuff', value: 0.7, target: 'enemy' }
    ]
  },
  belgium: {
    id: 'belgium',
    name: 'EUの中心',
    description: '周囲強化+経済効果',
    effects: [
      { type: 'buff', value: 1.3, target: 'ally' },
      { type: 'money', value: 1.5 },
      { type: 'range', value: 1.2 }
    ]
  },
  ireland: {
    id: 'ireland',
    name: '幸運のクローバー',
    description: 'クリティカル+幸運効果',
    effects: [
      { type: 'damage', value: 3.0, chance: 0.25 },
      { type: 'money', value: 1.8 },
      { type: 'chain', value: 2, chance: 0.5 }
    ]
  },
  singapore: {
    id: 'singapore',
    name: '貿易ハブ',
    description: '経済特化+全体バフ',
    effects: [
      { type: 'money', value: 2.2 },
      { type: 'buff', value: 1.1, target: 'global' },
      { type: 'range', value: 1.3 }
    ]
  },
  thailand: {
    id: 'thailand',
    name: 'ムエタイキック',
    description: '高速連打+スタン',
    effects: [
      { type: 'multi', value: 4 },
      { type: 'freeze', value: 800, chance: 0.3 },
      { type: 'damage', value: 1.1 }
    ]
  },
  argentina: {
    id: 'argentina',
    name: 'タンゴの情熱',
    description: '魅了+連鎖効果',
    effects: [
      { type: 'freeze', value: 1200, chance: 0.4 },
      { type: 'chain', value: 3 },
      { type: 'money', value: 1.3 }
    ]
  },
  norway: {
    id: 'norway',
    name: 'フィヨルドの守護',
    description: '防御+反射攻撃',
    effects: [
      { type: 'buff', value: 1.4, target: 'self' },
      { type: 'pierce', value: 3 },
      { type: 'damage', value: 1.2 }
    ]
  },
  israel: {
    id: 'israel',
    name: 'アイアンドーム',
    description: '超射程+迎撃システム',
    effects: [
      { type: 'range', value: 1.8 },
      { type: 'laser', value: 1.5 },
      { type: 'multi', value: 2 }
    ]
  },
  austria: {
    id: 'austria',
    name: 'モーツァルトの調べ',
    description: '魅了+全体強化',
    effects: [
      { type: 'freeze', value: 1000, target: 'enemy' },
      { type: 'buff', value: 1.2, target: 'ally' },
      { type: 'damage', value: 1.1 }
    ]
  },
  nigeria: {
    id: 'nigeria',
    name: 'ナイジャパワー',
    description: '人口の力で圧倒',
    effects: [
      { type: 'summon', value: 3 },
      { type: 'damage', value: 1.3 },
      { type: 'splash', value: 1.2 }
    ]
  },
  egypt: {
    id: 'egypt',
    name: 'ファラオの呪い',
    description: 'ミイラ化+変換',
    effects: [
      { type: 'transform', value: 0.8, chance: 0.1 },
      { type: 'slow', value: 0.2, duration: 4000 },
      { type: 'damage', value: 1.2 }
    ],
    specialEffect: 'mummy_wrap'
  },
  bangladesh: {
    id: 'bangladesh',
    name: 'ベンガルタイガー',
    description: '素早い連続攻撃',
    effects: [
      { type: 'multi', value: 3 },
      { type: 'damage', value: 1.2 },
      { type: 'pierce', value: 1 }
    ]
  },
  uae: {
    id: 'uae',
    name: 'ドバイの輝き',
    description: '豪華な攻撃+コイン',
    effects: [
      { type: 'laser', value: 2.0 },
      { type: 'money', value: 1.8 },
      { type: 'damage', value: 1.1 }
    ],
    specialEffect: 'gold_laser'
  },
  malaysia: {
    id: 'malaysia',
    name: 'ペトロナスツイン',
    description: '2連撃+貫通',
    effects: [
      { type: 'multi', value: 2 },
      { type: 'pierce', value: 2 },
      { type: 'damage', value: 1.15 }
    ]
  },
  vietnam: {
    id: 'vietnam',
    name: 'ゲリラ戦術',
    description: '隠れ身+奇襲攻撃',
    effects: [
      { type: 'damage', value: 2.0, chance: 0.3 },
      { type: 'debuff', value: 0.6, target: 'enemy' },
      { type: 'money', value: 1.2 }
    ]
  },
  philippines: {
    id: 'philippines',
    name: '台風の力',
    description: '旋風攻撃+ノックバック',
    effects: [
      { type: 'splash', value: 1.8 },
      { type: 'slow', value: -1.0, duration: 500 }, // ノックバック
      { type: 'damage', value: 1.1 }
    ]
  },

  // ========== 中規模国（GDP 100億〜1000億ドル） ==========
  denmark: {
    id: 'denmark',
    name: 'ヴァイキングの襲撃',
    description: '略奪+高速攻撃',
    effects: [
      { type: 'money', value: 1.6 },
      { type: 'multi', value: 2 },
      { type: 'damage', value: 1.1 }
    ]
  },
  pakistan: {
    id: 'pakistan',
    name: '核の威嚇',
    description: '爆発+威嚇効果',
    effects: [
      { type: 'explosion', value: 2.0, radius: 90 },
      { type: 'debuff', value: 0.7, target: 'enemy' },
      { type: 'damage', value: 1.1 }
    ]
  },
  chile: {
    id: 'chile',
    name: 'アンデスの雷',
    description: '電撃+連鎖',
    effects: [
      { type: 'chain', value: 3 },
      { type: 'damage', value: 1.2 },
      { type: 'freeze', value: 300, chance: 0.2 }
    ]
  },
  colombia: {
    id: 'colombia',
    name: 'エメラルドビーム',
    description: '美しいレーザー攻撃',
    effects: [
      { type: 'laser', value: 1.3 },
      { type: 'money', value: 1.3 },
      { type: 'pierce', value: 1 }
    ],
    specialEffect: 'emerald_beam'
  },
  czech_republic: {
    id: 'czech_republic',
    name: 'ボヘミアの結晶',
    description: '反射攻撃+防御',
    effects: [
      { type: 'pierce', value: 2 },
      { type: 'buff', value: 1.2, target: 'self' },
      { type: 'damage', value: 1.1 }
    ]
  },
  finland: {
    id: 'finland',
    name: '白い死神',
    description: '狙撃+隠密',
    effects: [
      { type: 'damage', value: 2.5, chance: 0.2 },
      { type: 'range', value: 1.4 },
      { type: 'pierce', value: 1 }
    ]
  },
  romania: {
    id: 'romania',
    name: 'ドラキュラの呪い',
    description: '吸血+回復効果',
    effects: [
      { type: 'damage', value: 1.3 },
      { type: 'transform', value: 0.1, chance: 0.1 },
      { type: 'buff', value: 1.1, target: 'self' }
    ],
    specialEffect: 'vampire_bite'
  },
  portugal: {
    id: 'portugal',
    name: '大航海時代',
    description: '探索ボーナス+連鎖',
    effects: [
      { type: 'chain', value: 2 },
      { type: 'money', value: 1.4 },
      { type: 'range', value: 1.2 }
    ]
  },
  iraq: {
    id: 'iraq',
    name: 'バビロンの雷',
    description: '古代の力',
    effects: [
      { type: 'explosion', value: 1.8, radius: 80 },
      { type: 'damage', value: 1.2 },
      { type: 'slow', value: 0.6, duration: 2000 }
    ]
  },
  new_zealand: {
    id: 'new_zealand',
    name: 'ハカの威嚇',
    description: '威嚇+強化',
    effects: [
      { type: 'debuff', value: 0.7, target: 'enemy' },
      { type: 'buff', value: 1.2, target: 'self' },
      { type: 'damage', value: 1.1 }
    ]
  },
  kazakhstan: {
    id: 'kazakhstan',
    name: '草原の疾風',
    description: '高速移動+連撃',
    effects: [
      { type: 'multi', value: 3 },
      { type: 'damage', value: 1.1 },
      { type: 'range', value: 1.1 }
    ]
  },
  qatar: {
    id: 'qatar',
    name: '砂漠の蜃気楼',
    description: '幻影+回避',
    effects: [
      { type: 'summon', value: 1 },
      { type: 'debuff', value: 0.8, target: 'enemy' },
      { type: 'money', value: 1.5 }
    ]
  },
  greece: {
    id: 'greece',
    name: '経済危機の逆襲',
    description: '高ダメージだがコイン減少',
    effects: [
      { type: 'damage', value: 2.0 },
      { type: 'explosion', value: 1.5, radius: 70 },
      { type: 'money', value: 0.5 }
    ],
    specialEffect: 'debt_counter'
  },

  // ========== 小国（GDP 10億〜100億ドル） ==========
  iceland: {
    id: 'iceland',
    name: '氷河の怒り',
    description: '完全凍結+氷爆発',
    effects: [
      { type: 'freeze', value: 2500 },
      { type: 'explosion', value: 1.5, radius: 60 },
      { type: 'slow', value: 0.3, duration: 3000 }
    ],
    specialEffect: 'ice_shatter'
  },
  malta: {
    id: 'malta',
    name: '騎士団の砦',
    description: '防御特化+反撃',
    effects: [
      { type: 'buff', value: 1.6, target: 'self' },
      { type: 'damage', value: 1.4 },
      { type: 'pierce', value: 1 }
    ]
  },
  monaco: {
    id: 'monaco',
    name: 'カジノロイヤル',
    description: 'ランダムコイン+幸運',
    effects: [
      { type: 'money', value: 4.0, chance: 0.25 },
      { type: 'damage', value: 1.2 },
      { type: 'chain', value: 2, chance: 0.5 }
    ],
    specialEffect: 'dice_roll'
  },
  liechtenstein: {
    id: 'liechtenstein',
    name: '精密工業',
    description: '高精度攻撃',
    effects: [
      { type: 'damage', value: 1.8 },
      { type: 'pierce', value: 2 },
      { type: 'range', value: 1.1 }
    ]
  },
  luxembourg: {
    id: 'luxembourg',
    name: '金融帝国',
    description: '圧倒的コイン生成',
    effects: [
      { type: 'money', value: 3.0 },
      { type: 'buff', value: 1.1, target: 'global' },
      { type: 'damage', value: 1.0 }
    ]
  },

  // ========== 極小国（GDP 10億ドル未満） ==========
  vatican: {
    id: 'vatican',
    name: '聖なる祝福',
    description: '全体回復+聖なる光',
    effects: [
      { type: 'buff', value: 1.5, target: 'global', duration: 3000 },
      { type: 'laser', value: 1.5 },
      { type: 'money', value: 1.2 }
    ],
    specialEffect: 'holy_light'
  },
  san_marino: {
    id: 'san_marino',
    name: '山頂の要塞',
    description: '防御+時間経過でコイン',
    effects: [
      { type: 'buff', value: 1.3, target: 'self' },
      { type: 'money', value: 1.5 },
      { type: 'damage', value: 1.1 }
    ]
  },
  andorra: {
    id: 'andorra',
    name: 'ピレネーの守護者',
    description: '山岳防御+反撃',
    effects: [
      { type: 'damage', value: 1.3 },
      { type: 'buff', value: 1.2, target: 'self' },
      { type: 'slow', value: 0.7, duration: 2000 }
    ]
  },
  nauru: {
    id: 'nauru',
    name: 'リン鉱石採掘',
    description: '最高のコイン効率',
    effects: [
      { type: 'money', value: 2.5 },
      { type: 'damage', value: 0.8 }
    ]
  },
  tuvalu: {
    id: 'tuvalu',
    name: '満潮の力',
    description: '波の押し戻し効果',
    effects: [
      { type: 'slow', value: -2.0, duration: 1000 }, // 強力なノックバック
      { type: 'splash', value: 1.2 },
      { type: 'damage', value: 0.9 }
    ]
  },
  marshall_islands: {
    id: 'marshall_islands',
    name: '環礁の守り',
    description: '防御リング+反射',
    effects: [
      { type: 'buff', value: 1.2, target: 'ally' },
      { type: 'pierce', value: 1 },
      { type: 'damage', value: 0.9 }
    ]
  },
  palau: {
    id: 'palau',
    name: 'クラゲの毒',
    description: '毒効果+スロー',
    effects: [
      { type: 'slow', value: 0.5, duration: 3000 },
      { type: 'damage', value: 1.1 },
      { type: 'debuff', value: 0.8, target: 'enemy' }
    ]
  },
  kiribati: {
    id: 'kiribati',
    name: '赤道の太陽',
    description: '灼熱ビーム',
    effects: [
      { type: 'laser', value: 1.2 },
      { type: 'damage', value: 1.0 },
      { type: 'slow', value: 0.8, duration: 1500 }
    ]
  },
  
  // ========== 特殊国家（ミーム要素） ==========
  north_korea: {
    id: 'north_korea',
    name: '謎の技術',
    description: '毎回ランダムな効果',
    effects: [], // 特殊処理で毎回ランダム
    specialEffect: 'random_effect'
  },
  venezuela: {
    id: 'venezuela',
    name: 'ハイパーインフレ',
    description: 'コスト増加だが強力',
    effects: [
      { type: 'damage', value: 2.0 },
      { type: 'explosion', value: 1.8, radius: 100 },
      { type: 'money', value: 0.3 }
    ],
    specialEffect: 'inflation_counter'
  },
  zimbabwe: {
    id: 'zimbabwe',
    name: '100兆ドル札',
    description: '瞬間的に大量コインだが...',
    effects: [
      { type: 'money', value: 10.0 },
      { type: 'damage', value: 1.0 }
    ],
    specialEffect: 'money_evaporate'
  },
  sealand: {
    id: 'sealand',
    name: '海上要塞',
    description: '独立宣言！',
    effects: [
      { type: 'buff', value: 2.0, target: 'self' },
      { type: 'pierce', value: 1 },
      { type: 'money', value: 1.1 }
    ],
    specialEffect: 'rebel_flag'
  },

  // デフォルト（未定義の国用）
  default: {
    id: 'default',
    name: '通常攻撃',
    description: '特殊能力なし',
    effects: []
  }
};

// 残りの国のアビリティを生成する関数
export function generateRemainingAbilities(): Record<string, NationAbility> {
  const remainingAbilities: Record<string, NationAbility> = {};
  
  // nations-full-databaseからインポート
  // Import at the top of the file instead of using require
  
  // すでに定義済みの国のIDセット
  const definedNations = new Set(Object.keys(NATION_ABILITIES_V2));
  
  // 未定義の国をフィルタリング
  const undefinedNations = FULL_NATION_DATABASE.filter((nation: any) => 
    !definedNations.has(nation.id) && nation.id !== 'default'
  );
  
  // GDPベースでアビリティテンプレートを定義
  const getAbilityTemplate = (gdp: number): { name: string; description: string; effects: AbilityEffect[] } => {
    // GDP 1兆ドル以上: 強力な複合効果
    if (gdp >= 1000) {
      return {
        name: '大国の威光',
        description: '強力な範囲攻撃+バフ効果',
        effects: [
          { type: 'damage', value: 1.5 },
          { type: 'splash', value: 1.3 },
          { type: 'buff', value: 1.2, target: 'ally', duration: 2000 }
        ]
      };
    }
    // GDP 5000億〜1兆ドル: 中程度の複合効果
    else if (gdp >= 500) {
      return {
        name: '先進国の技術',
        description: '連鎖攻撃+経済効果',
        effects: [
          { type: 'chain', value: 3 },
          { type: 'damage', value: 1.3 },
          { type: 'money', value: 1.2 }
        ]
      };
    }
    // GDP 1000億〜5000億ドル: バランス型
    else if (gdp >= 100) {
      return {
        name: '新興国の成長',
        description: 'マルチ攻撃+スロー効果',
        effects: [
          { type: 'multi', value: 2 },
          { type: 'damage', value: 1.2 },
          { type: 'slow', value: 0.7, duration: 2000 }
        ]
      };
    }
    // GDP 500億〜1000億ドル: 特化型
    else if (gdp >= 50) {
      return {
        name: '地域大国の力',
        description: '貫通攻撃+デバフ',
        effects: [
          { type: 'pierce', value: 1 },
          { type: 'damage', value: 1.1 },
          { type: 'debuff', value: 0.8, target: 'enemy', duration: 2500 }
        ]
      };
    }
    // GDP 100億〜500億ドル: 支援型
    else if (gdp >= 10) {
      return {
        name: '発展途上国の団結',
        description: 'バフ+経済支援',
        effects: [
          { type: 'buff', value: 1.15, target: 'ally' },
          { type: 'money', value: 1.3 },
          { type: 'damage', value: 1.0 }
        ]
      };
    }
    // GDP 50億〜100億ドル: 防御型
    else if (gdp >= 5) {
      return {
        name: '小国の抵抗',
        description: '防御強化+反撃',
        effects: [
          { type: 'buff', value: 1.2, target: 'self' },
          { type: 'damage', value: 1.1 },
          { type: 'slow', value: 0.8, duration: 1500 }
        ]
      };
    }
    // GDP 50億ドル未満: 経済特化
    else {
      return {
        name: '資源の活用',
        description: 'コイン生成特化',
        effects: [
          { type: 'money', value: 1.5 },
          { type: 'damage', value: 0.9 }
        ]
      };
    }
  };
  
  // 各国のアビリティを生成
  undefinedNations.forEach((nation: any) => {
    const template = getAbilityTemplate(nation.gdp);
    
    // 国名に基づいて少しカスタマイズ
    let customName = template.name;
    let customDescription = template.description;
    let customEffects = [...template.effects];
    
    // 島国の場合
    if (nation.name.toLowerCase().includes('island') || 
        nation.name.toLowerCase().includes('isle')) {
      customName = '島国の守護';
      customDescription = '海洋防御+波の力';
      customEffects = [
        { type: 'splash', value: 1.2 },
        { type: 'slow', value: 0.6, duration: 2000 },
        { type: 'damage', value: 1.0 }
      ];
    }
    
    // アフリカの国
    else if (['algeria', 'angola', 'benin', 'botswana', 'burkina_faso', 'burundi', 
               'cameroon', 'cape_verde', 'central_african_republic', 'chad', 'comoros',
               'congo', 'djibouti', 'equatorial_guinea', 'eritrea', 'eswatini', 'ethiopia',
               'gabon', 'gambia', 'ghana', 'guinea', 'guinea_bissau', 'ivory_coast',
               'kenya', 'lesotho', 'liberia', 'libya', 'madagascar', 'malawi', 'mali',
               'mauritania', 'mauritius', 'morocco', 'mozambique', 'namibia', 'niger',
               'rwanda', 'sao_tome', 'senegal', 'seychelles', 'sierra_leone', 'somalia',
               'south_africa', 'south_sudan', 'sudan', 'tanzania', 'togo', 'tunisia',
               'uganda', 'zambia', 'zimbabwe'].includes(nation.id)) {
      if (nation.gdp < 10) {
        customName = 'サバンナの戦士';
        customDescription = '速攻+機動力';
        customEffects = [
          { type: 'damage', value: 1.2 },
          { type: 'multi', value: 2 },
          { type: 'money', value: 1.1 }
        ];
      }
    }
    
    // 中南米の国
    else if (['antigua', 'bahamas', 'barbados', 'belize', 'bolivia', 'costa_rica',
               'cuba', 'dominica', 'dominican', 'ecuador', 'el_salvador', 'grenada',
               'guatemala', 'guyana', 'haiti', 'honduras', 'jamaica', 'nicaragua',
               'panama', 'paraguay', 'peru', 'saint_kitts', 'saint_lucia', 'saint_vincent',
               'suriname', 'trinidad', 'uruguay'].includes(nation.id)) {
      if (nation.gdp < 50) {
        customName = '熱帯の嵐';
        customDescription = '範囲攻撃+混乱';
        customEffects = [
          { type: 'splash', value: 1.1 },
          { type: 'debuff', value: 0.8, target: 'enemy', duration: 2000 },
          { type: 'damage', value: 1.0 }
        ];
      }
    }
    
    // 東欧の国
    else if (['albania', 'armenia', 'azerbaijan', 'belarus', 'bosnia', 'bulgaria',
               'croatia', 'estonia', 'georgia', 'hungary', 'kosovo', 'latvia',
               'lithuania', 'macedonia', 'moldova', 'montenegro', 'serbia',
               'slovakia', 'slovenia', 'ukraine'].includes(nation.id)) {
      if (nation.gdp < 100) {
        customName = '鉄のカーテンの遺産';
        customDescription = '防御+反撃強化';
        customEffects = [
          { type: 'buff', value: 1.25, target: 'self' },
          { type: 'pierce', value: 1 },
          { type: 'damage', value: 1.1 }
        ];
      }
    }
    
    // 太平洋島嶼国
    else if (['fiji', 'micronesia', 'papua_new_guinea', 'samoa', 'solomon_islands',
               'tonga', 'vanuatu'].includes(nation.id)) {
      customName = '太平洋の守護者';
      customDescription = '海の恵み+防御';
      customEffects = [
        { type: 'money', value: 1.4 },
        { type: 'buff', value: 1.15, target: 'ally' },
        { type: 'damage', value: 0.95 }
      ];
    }
    
    // 中央アジアの国
    else if (['kyrgyzstan', 'tajikistan', 'turkmenistan', 'uzbekistan'].includes(nation.id)) {
      customName = 'シルクロードの商人';
      customDescription = '経済+連携攻撃';
      customEffects = [
        { type: 'money', value: 1.35 },
        { type: 'chain', value: 2 },
        { type: 'damage', value: 1.05 }
      ];
    }
    
    remainingAbilities[nation.id] = {
      id: nation.id,
      name: customName,
      description: customDescription,
      effects: customEffects
    };
  });
  
  return remainingAbilities;
}

// すべてのアビリティを統合した完全版データベース
export const ALL_NATION_ABILITIES: Record<string, NationAbility> = {
  ...NATION_ABILITIES_V2,
  ...generateRemainingAbilities()
};

// アビリティを取得する関数（存在しない場合はdefaultを返す）
export function getNationAbility(nationId: string): NationAbility {
  return ALL_NATION_ABILITIES[nationId] || ALL_NATION_ABILITIES.default;
}