export interface Vegetable {
  id: string;
  name: string;
  emoji: string;
  imagePath: string;
  color: string;
  attack: number;
  range: number;
  attackSpeed: number;
  cost: number;
  description: string;
  ability?: {
    name: string;
    description: string;
    cooldown: number;
  };
}

// All 57 veggie defenders for the ultimate tower defense party!
export const vegetables: Vegetable[] = [
  // === BASIC TIER (50-80 cost) ===
  {
    id: "tomato",
    name: "トマト",
    emoji: "🍅",
    imagePath: "/assets/vegetables/img/tomato.png",
    color: "#FF6347",
    attack: 10,
    range: 100,
    attackSpeed: 1.5,
    cost: 50,
    description: "基本的な攻撃野菜。バランスの取れた性能。"
  },
  {
    id: "cucumber",
    name: "キュウリ",
    emoji: "🥒",
    imagePath: "/assets/vegetables/img/cucumber.png",
    color: "#90EE90",
    attack: 7,
    range: 120,
    attackSpeed: 2.0,
    cost: 80,
    description: "バランス型の野菜。コスパが良い。"
  },
  {
    id: "lettuce",
    name: "レタス",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/lettuce.png",
    color: "#90EE90",
    attack: 6,
    range: 80,
    attackSpeed: 1.8,
    cost: 60,
    description: "軽快な攻撃を繰り出す。"
  },
  {
    id: "spinach",
    name: "ホウレンソウ",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/spinach.png",
    color: "#006400",
    attack: 8,
    range: 90,
    attackSpeed: 1.6,
    cost: 70,
    description: "力強い攻撃を繰り出す。"
  },
  {
    id: "pea",
    name: "エンドウ",
    emoji: "🫛",
    imagePath: "/assets/vegetables/img/pea.png",
    color: "#32CD32",
    attack: 5,
    range: 100,
    attackSpeed: 3.0,
    cost: 55,
    description: "高速連射で制圧。"
  },

  // === SPEED TIER (75-100 cost) ===
  {
    id: "corn",
    name: "トウモロコシ",
    emoji: "🌽",
    imagePath: "/assets/vegetables/img/corn.png",
    color: "#FFD700",
    attack: 8,
    range: 80,
    attackSpeed: 2.5,
    cost: 75,
    description: "攻撃速度が速い野菜。連射で敵を圧倒。"
  },
  {
    id: "asparagus",
    name: "アスパラガス",
    emoji: "🌱",
    imagePath: "/assets/vegetables/img/asparagus.png",
    color: "#87A96B",
    attack: 9,
    range: 140,
    attackSpeed: 2.2,
    cost: 85,
    description: "スマートな長距離攻撃。"
  },
  {
    id: "green_bean",
    name: "インゲン",
    emoji: "🫘",
    imagePath: "/assets/vegetables/img/green_bean.png",
    color: "#00FF00",
    attack: 7,
    range: 110,
    attackSpeed: 2.3,
    cost: 75,
    description: "スナップ攻撃で素早く反撃。"
  },
  {
    id: "celery",
    name: "セロリ",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/celery.png",
    color: "#7FFF00",
    attack: 6,
    range: 100,
    attackSpeed: 2.8,
    cost: 70,
    description: "クリスプな連続攻撃。"
  },

  // === RANGE TIER (100-120 cost) ===
  {
    id: "carrot",
    name: "ニンジン",
    emoji: "🥕",
    imagePath: "/assets/vegetables/img/carrot.png",
    color: "#FF8C00",
    attack: 15,
    range: 150,
    attackSpeed: 1.0,
    cost: 100,
    description: "長距離から敵を狙撃する野菜。",
    ability: {
      name: "貫通ショット",
      description: "一直線上の敵を貫通する",
      cooldown: 8
    }
  },
  {
    id: "daikon",
    name: "大根",
    emoji: "🥕",
    imagePath: "/assets/vegetables/img/daikon.png",
    color: "#FFFAFA",
    attack: 12,
    range: 130,
    attackSpeed: 1.3,
    cost: 90,
    description: "清らかな遠距離攻撃。"
  },
  {
    id: "burdock",
    name: "ゴボウ",
    emoji: "🌿",
    imagePath: "/assets/vegetables/img/burdock.png",
    color: "#8B4513",
    attack: 14,
    range: 140,
    attackSpeed: 0.9,
    cost: 110,
    description: "地中からの奇襲攻撃。"
  },
  {
    id: "green_onion",
    name: "ネギ",
    emoji: "🌱",
    imagePath: "/assets/vegetables/img/green_onion.png",
    color: "#9ACD32",
    attack: 11,
    range: 125,
    attackSpeed: 1.4,
    cost: 85,
    description: "鋭い攻撃で敵を切り裂く。"
  },

  // === SPECIAL TIER (60-120 cost) ===
  {
    id: "broccoli",
    name: "ブロッコリー",
    emoji: "🥦",
    imagePath: "/assets/vegetables/img/broccoli.png",
    color: "#228B22",
    attack: 5,
    range: 90,
    attackSpeed: 1.2,
    cost: 60,
    description: "敵の速度を遅くする効果を持つ。",
    ability: {
      name: "スローフィールド",
      description: "範囲内の敵の移動速度を50%減少",
      cooldown: 12
    }
  },
  {
    id: "garlic",
    name: "ニンニク",
    emoji: "🧄",
    imagePath: "/assets/vegetables/img/garlic.png",
    color: "#F5F5DC",
    attack: 8,
    range: 70,
    attackSpeed: 1.0,
    cost: 90,
    description: "周囲の敵にダメージを与えるオーラ。",
    ability: {
      name: "ガーリックオーラ",
      description: "周囲に継続ダメージフィールド",
      cooldown: 10
    }
  },
  {
    id: "ginger",
    name: "ショウガ",
    emoji: "🫚",
    imagePath: "/assets/vegetables/img/ginger.png",
    color: "#BC9A6A",
    attack: 10,
    range: 85,
    attackSpeed: 1.5,
    cost: 95,
    description: "刺激的な攻撃で敵を麻痺。",
    ability: {
      name: "ジンジャーショック",
      description: "敵を一時的にスタン",
      cooldown: 15
    }
  },
  {
    id: "chili_pepper",
    name: "唐辛子",
    emoji: "🌶️",
    imagePath: "/assets/vegetables/img/chili_pepper.png",
    color: "#DC143C",
    attack: 12,
    range: 100,
    attackSpeed: 1.0,
    cost: 120,
    description: "継続ダメージを与える炎攻撃。",
    ability: {
      name: "ファイアブレス",
      description: "前方に炎を放射し継続ダメージ",
      cooldown: 15
    }
  },

  // === POWER TIER (150-200 cost) ===
  {
    id: "eggplant",
    name: "ナス",
    emoji: "🍆",
    imagePath: "/assets/vegetables/img/eggplant.png",
    color: "#663399",
    attack: 20,
    range: 70,
    attackSpeed: 0.8,
    cost: 150,
    description: "高火力だが攻撃速度が遅い重火器野菜。"
  },
  {
    id: "potato",
    name: "ジャガイモ",
    emoji: "🥔",
    imagePath: "/assets/vegetables/img/potato.png",
    color: "#D2691E",
    attack: 25,
    range: 60,
    attackSpeed: 0.5,
    cost: 200,
    description: "超重火力の野菜。爆発ダメージ付き。",
    ability: {
      name: "ポテト地雷",
      description: "地面に地雷を設置",
      cooldown: 20
    }
  },
  {
    id: "sweet_potato",
    name: "サツマイモ",
    emoji: "🍠",
    imagePath: "/assets/vegetables/img/sweet_potato.png",
    color: "#D2691E",
    attack: 22,
    range: 65,
    attackSpeed: 0.7,
    cost: 180,
    description: "甘い香りで敵を誘い込み爆発。"
  },
  {
    id: "pumpkin",
    name: "カボチャ",
    emoji: "🎃",
    imagePath: "/assets/vegetables/img/pumpkin.png",
    color: "#FF8C00",
    attack: 28,
    range: 50,
    attackSpeed: 0.4,
    cost: 220,
    description: "特大カボチャ砲弾で範囲攻撃。",
    ability: {
      name: "パンプキンボム",
      description: "巨大なカボチャを落下",
      cooldown: 25
    }
  },
  {
    id: "cabbage",
    name: "キャベツ",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/cabbage.png",
    color: "#90EE90",
    attack: 18,
    range: 75,
    attackSpeed: 0.9,
    cost: 160,
    description: "重厚な防御と反撃。"
  },

  // === EXOTIC TIER (100-150 cost) ===
  {
    id: "bell_pepper",
    name: "ピーマン",
    emoji: "🫑",
    imagePath: "/assets/vegetables/img/bell_pepper.png",
    color: "#00A86B",
    attack: 13,
    range: 95,
    attackSpeed: 1.2,
    cost: 110,
    description: "カラフルな攻撃で敵を混乱。"
  },
  {
    id: "onion",
    name: "タマネギ",
    emoji: "🧅",
    imagePath: "/assets/vegetables/img/onion.png",
    color: "#C0A080",
    attack: 16,
    range: 85,
    attackSpeed: 1.1,
    cost: 130,
    description: "層状攻撃で段階的ダメージ。",
    ability: {
      name: "オニオンティアーズ",
      description: "敵の視界を奪う",
      cooldown: 18
    }
  },
  {
    id: "mushroom",
    name: "キノコ",
    emoji: "🍄",
    imagePath: "/assets/vegetables/img/mushroom.png",
    color: "#8B4513",
    attack: 14,
    range: 80,
    attackSpeed: 1.0,
    cost: 100,
    description: "胞子攻撃で周囲に拡散。"
  },
  {
    id: "lotus_root",
    name: "レンコン",
    emoji: "🥔",
    imagePath: "/assets/vegetables/img/lotus_root.png",
    color: "#F5DEB3",
    attack: 15,
    range: 100,
    attackSpeed: 1.3,
    cost: 125,
    description: "穴からの多方向攻撃。"
  },

  // === LEAFY TIER (70-100 cost) ===
  {
    id: "bok_choy",
    name: "チンゲン菜",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/bok_choy.png",
    color: "#90EE90",
    attack: 9,
    range: 85,
    attackSpeed: 1.7,
    cost: 75,
    description: "クリスプな連続攻撃。"
  },
  {
    id: "chinese_cabbage",
    name: "白菜",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/chinese_cabbage.png",
    color: "#F0FFF0",
    attack: 10,
    range: 90,
    attackSpeed: 1.4,
    cost: 85,
    description: "優しい攻撃で敵を包み込む。"
  },
  {
    id: "komatsuna",
    name: "小松菜",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/komatsuna.png",
    color: "#2E8B57",
    attack: 8,
    range: 95,
    attackSpeed: 1.6,
    cost: 80,
    description: "柔らかい攻撃が継続的にヒット。"
  },
  {
    id: "mizuna",
    name: "水菜",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/mizuna.png",
    color: "#00FF7F",
    attack: 7,
    range: 105,
    attackSpeed: 1.9,
    cost: 70,
    description: "繊細な攻撃で確実にダメージ。"
  },
  {
    id: "arugula",
    name: "ルッコラ",
    emoji: "🥬",
    imagePath: "/assets/vegetables/img/arugula.png",
    color: "#228B22",
    attack: 9,
    range: 88,
    attackSpeed: 1.8,
    cost: 78,
    description: "ペッパーな攻撃で刺激。"
  },

  // === ROOT TIER (90-140 cost) ===
  {
    id: "turnip",
    name: "カブ",
    emoji: "🥔",
    imagePath: "/assets/vegetables/img/turnip.png",
    color: "#FFFAFA",
    attack: 11,
    range: 78,
    attackSpeed: 1.2,
    cost: 90,
    description: "優しい攻撃で安定ダメージ。"
  },
  {
    id: "taro",
    name: "里芋",
    emoji: "🥔",
    imagePath: "/assets/vegetables/img/taro.png",
    color: "#9B7653",
    attack: 17,
    range: 70,
    attackSpeed: 0.9,
    cost: 140,
    description: "地中からの重厚な攻撃。"
  },

  // === SPECIALTY TIER (80-120 cost) ===
  {
    id: "okra",
    name: "オクラ",
    emoji: "🌿",
    imagePath: "/assets/vegetables/img/okra.png",
    color: "#8FBC8F",
    attack: 10,
    range: 92,
    attackSpeed: 1.5,
    cost: 88,
    description: "ネバネバ攻撃で敵を束縛。",
    ability: {
      name: "スライムトラップ",
      description: "敵の移動を完全停止",
      cooldown: 14
    }
  },
  {
    id: "bitter_gourd",
    name: "ゴーヤ",
    emoji: "🥒",
    imagePath: "/assets/vegetables/img/bitter_gourd.png",
    color: "#006400",
    attack: 13,
    range: 82,
    attackSpeed: 1.1,
    cost: 105,
    description: "苦い攻撃で敵の士気を下げる。"
  },
  {
    id: "bitter_melon",
    name: "ニガウリ",
    emoji: "🥒",
    imagePath: "/assets/vegetables/img/bitter_melon.png",
    color: "#228B22",
    attack: 12,
    range: 86,
    attackSpeed: 1.2,
    cost: 100,
    description: "強烈な苦みで敵を弱体化。"
  },
  {
    id: "broad_bean",
    name: "そら豆",
    emoji: "🫘",
    imagePath: "/assets/vegetables/img/broad_bean.png",
    color: "#7CFC00",
    attack: 14,
    range: 88,
    attackSpeed: 1.0,
    cost: 115,
    description: "ハーティな豆砲撃。"
  },
  {
    id: "garlic_chive",
    name: "ニラ",
    emoji: "🌿",
    imagePath: "/assets/vegetables/img/garlic_chive.png",
    color: "#228B22",
    attack: 11,
    range: 94,
    attackSpeed: 1.3,
    cost: 92,
    description: "香り高い攻撃で敵をかく乱。"
  },
  {
    id: "zucchini",
    name: "ズッキーニ",
    emoji: "🥒",
    imagePath: "/assets/vegetables/img/zucchini.png",
    color: "#2E8B57",
    attack: 10,
    range: 98,
    attackSpeed: 1.6,
    cost: 85,
    description: "万能型のバランス攻撃。"
  },

  // === FRUIT WARRIORS (80-180 cost) ===
  {
    id: "apple",
    name: "リンゴ",
    emoji: "🍎",
    imagePath: "/assets/vegetables/img/apple.png",
    color: "#FF6B6B",
    attack: 12,
    range: 105,
    attackSpeed: 1.4,
    cost: 95,
    description: "甘い攻撃で敵を魅了。"
  },
  {
    id: "banana",
    name: "バナナ",
    emoji: "🍌",
    imagePath: "/assets/vegetables/img/banana.png",
    color: "#FFE66D",
    attack: 9,
    range: 110,
    attackSpeed: 1.8,
    cost: 80,
    description: "掃射攻撃で陣地を守る。",
    ability: {
      name: "バナナスリップ",
      description: "敵を転倒させる",
      cooldown: 10
    }
  },
  {
    id: "strawberry",
    name: "イチゴ",
    emoji: "🍓",
    imagePath: "/assets/vegetables/img/strawberry.png",
    color: "#FF1744",
    attack: 11,
    range: 90,
    attackSpeed: 1.7,
    cost: 88,
    description: "甘酸っぱい連続攻撃。"
  },
  {
    id: "watermelon",
    name: "スイカ",
    emoji: "🍉",
    imagePath: "/assets/vegetables/img/watermelon.png",
    color: "#FF6B6B",
    attack: 30,
    range: 45,
    attackSpeed: 0.3,
    cost: 250,
    description: "巨大スイカ砲弾で大ダメージ。",
    ability: {
      name: "ウォーターメロンボム",
      description: "巨大スイカが爆発",
      cooldown: 30
    }
  },
  {
    id: "grape",
    name: "ブドウ",
    emoji: "🍇",
    imagePath: "/assets/vegetables/img/grape.png",
    color: "#6B3AA0",
    attack: 6,
    range: 95,
    attackSpeed: 2.5,
    cost: 75,
    description: "ブドウ弾を連射。"
  },
  {
    id: "orange",
    name: "オレンジ",
    emoji: "🍊",
    imagePath: "/assets/vegetables/img/orange.png",
    color: "#FF8C00",
    attack: 13,
    range: 100,
    attackSpeed: 1.3,
    cost: 100,
    description: "ビタミンC砲弾で元気に攻撃。"
  },
  {
    id: "lemon",
    name: "レモン",
    emoji: "🍋",
    imagePath: "/assets/vegetables/img/lemon.png",
    color: "#FFF700",
    attack: 10,
    range: 115,
    attackSpeed: 1.5,
    cost: 85,
    description: "酸っぱい攻撃で敵をひるませる。"
  },
  {
    id: "pineapple",
    name: "パイナップル",
    emoji: "🍍",
    imagePath: "/assets/vegetables/img/pineapple.png",
    color: "#FFD700",
    attack: 18,
    range: 85,
    attackSpeed: 0.8,
    cost: 140,
    description: "トロピカル攻撃で大ダメージ。"
  },
  {
    id: "avocado",
    name: "アボカド",
    emoji: "🥑",
    imagePath: "/assets/vegetables/img/avocado.png",
    color: "#6B8E23",
    attack: 16,
    range: 75,
    attackSpeed: 1.0,
    cost: 130,
    description: "クリーミーな攻撃で安定ダメージ。"
  },
  {
    id: "mango",
    name: "マンゴー",
    emoji: "🥭",
    imagePath: "/assets/vegetables/img/mango.png",
    color: "#FFD700",
    attack: 15,
    range: 95,
    attackSpeed: 1.2,
    cost: 110,
    description: "トロピカルな甘い攻撃。"
  },
  {
    id: "peach",
    name: "桃",
    emoji: "🍑",
    imagePath: "/assets/vegetables/img/peach.png",
    color: "#FFDAB9",
    attack: 12,
    range: 92,
    attackSpeed: 1.4,
    cost: 95,
    description: "柔らかい攻撃で敵を包み込む。"
  },
  {
    id: "pear",
    name: "梨",
    emoji: "🍐",
    imagePath: "/assets/vegetables/img/pear.png",
    color: "#D3D3A3",
    attack: 11,
    range: 97,
    attackSpeed: 1.5,
    cost: 90,
    description: "優しい攻撃で安定ダメージ。"
  },
  {
    id: "persimmon",
    name: "柿",
    emoji: "🟠",
    imagePath: "/assets/vegetables/img/persimmon.png",
    color: "#FF7F00",
    attack: 14,
    range: 88,
    attackSpeed: 1.1,
    cost: 105,
    description: "熱した柿で忍耐強く攻撃。"
  },
  {
    id: "kiwi",
    name: "キウイ",
    emoji: "🥝",
    imagePath: "/assets/vegetables/img/kiwi.png",
    color: "#8FBC8F",
    attack: 10,
    range: 102,
    attackSpeed: 1.6,
    cost: 82,
    description: "ファジーな攻撃で素早く反撃。"
  },
  {
    id: "mandarin",
    name: "みかん",
    emoji: "🍊",
    imagePath: "/assets/vegetables/img/mandarin.png",
    color: "#FFA500",
    attack: 9,
    range: 108,
    attackSpeed: 1.9,
    cost: 78,
    description: "ビタミン攻撃で元気に戦う。"
  },

  // === SPECIAL FOOD TIER (120-180 cost) ===
  {
    id: "pasta",
    name: "パスタ",
    emoji: "🍝",
    imagePath: "/assets/vegetables/img/pasta.png",
    color: "#FFDAB9",
    attack: 14,
    range: 90,
    attackSpeed: 1.3,
    cost: 120,
    description: "ファンタジー攻撃で楽しく戦う。"
  },
  {
    id: "pizza",
    name: "ピザ",
    emoji: "🍕",
    imagePath: "/assets/vegetables/img/pizza.png",
    color: "#FF6347",
    attack: 20,
    range: 70,
    attackSpeed: 0.9,
    cost: 160,
    description: "パーティーピザで範囲攻撃。",
    ability: {
      name: "ピザパーティー",
      description: "周囲の塔を強化",
      cooldown: 20
    }
  },
  {
    id: "ramen",
    name: "ラーメン",
    emoji: "🍜",
    imagePath: "/assets/vegetables/img/ramen.png",
    color: "#DEB887",
    attack: 17,
    range: 80,
    attackSpeed: 1.0,
    cost: 140,
    description: "暖かいスープ攻撃で敵を溶かす。"
  },
  {
    id: "sushi",
    name: "寿司",
    emoji: "🍣",
    imagePath: "/assets/vegetables/img/sushi.png",
    color: "#FFB6C1",
    attack: 22,
    range: 65,
    attackSpeed: 0.7,
    cost: 180,
    description: "エレガントな攻撃で確実にダメージ。"
  }
];

export interface Enemy {
  id: string;
  name: string;
  health: number;
  speed: number;
  damage: number;
  reward: number;
  color: string;
  personality?: string;
}

// Party crashers trying to eat our veggies!
export const enemies: Enemy[] = [
  {
    id: "aphid",
    name: "アブラムシ",
    health: 20,
    speed: 60,
    damage: 1,
    reward: 10,
    color: "#98FB98",
    personality: "sneaky"
  },
  {
    id: "caterpillar",
    name: "イモムシ",
    health: 40,
    speed: 40,
    damage: 2,
    reward: 20,
    color: "#90EE90",
    personality: "hungry"
  },
  {
    id: "locust",
    name: "バッタ",
    health: 30,
    speed: 80,
    damage: 1,
    reward: 15,
    color: "#8FBC8F",
    personality: "jumpy"
  },
  {
    id: "snail",
    name: "カタツムリ",
    health: 100,
    speed: 20,
    damage: 3,
    reward: 30,
    color: "#A0522D",
    personality: "slow"
  },
  {
    id: "beetle",
    name: "カブトムシ",
    health: 150,
    speed: 35,
    damage: 5,
    reward: 50,
    color: "#8B4513",
    personality: "tough"
  },
  {
    id: "grasshopper",
    name: "キリギリス",
    health: 35,
    speed: 90,
    damage: 2,
    reward: 18,
    color: "#7CFC00",
    personality: "energetic"
  },
  {
    id: "spider",
    name: "クモ",
    health: 45,
    speed: 70,
    damage: 3,
    reward: 25,
    color: "#696969",
    personality: "sneaky"
  },
  {
    id: "worm",
    name: "ミミズ",
    health: 25,
    speed: 50,
    damage: 1,
    reward: 12,
    color: "#DEB887",
    personality: "wiggly"
  },
  {
    id: "moth",
    name: "ガ",
    health: 28,
    speed: 85,
    damage: 2,
    reward: 16,
    color: "#D3D3D3",
    personality: "fluttery"
  },
  {
    id: "ant",
    name: "アリ",
    health: 15,
    speed: 75,
    damage: 1,
    reward: 8,
    color: "#000000",
    personality: "organized"
  },
  {
    id: "fly",
    name: "ハエ",
    health: 18,
    speed: 95,
    damage: 1,
    reward: 10,
    color: "#2F4F4F",
    personality: "annoying"
  },
  {
    id: "ladybug",
    name: "テントウムシ",
    health: 35,
    speed: 65,
    damage: 2,
    reward: 20,
    color: "#DC143C",
    personality: "lucky"
  },
  {
    id: "dragonfly",
    name: "トンボ",
    health: 50,
    speed: 100,
    damage: 3,
    reward: 35,
    color: "#00CED1",
    personality: "swift"
  },
  {
    id: "bee",
    name: "ハチ",
    health: 40,
    speed: 75,
    damage: 4,
    reward: 28,
    color: "#FFD700",
    personality: "busy"
  },
  {
    id: "mantis",
    name: "カマキリ",
    health: 80,
    speed: 55,
    damage: 6,
    reward: 45,
    color: "#228B22",
    personality: "patient"
  },
  {
    id: "stinkbug",
    name: "カメムシ",
    health: 60,
    speed: 45,
    damage: 3,
    reward: 30,
    color: "#8B4513",
    personality: "smelly"
  },
  {
    id: "cicada",
    name: "セミ",
    health: 55,
    speed: 60,
    damage: 2,
    reward: 25,
    color: "#D2691E",
    personality: "noisy"
  },
  {
    id: "centipede",
    name: "ムカデ",
    health: 90,
    speed: 40,
    damage: 5,
    reward: 40,
    color: "#8B0000",
    personality: "creepy"
  },
  {
    id: "scorpion",
    name: "サソリ",
    health: 120,
    speed: 50,
    damage: 8,
    reward: 60,
    color: "#4B0082",
    personality: "dangerous"
  },
  {
    id: "butterfly",
    name: "チョウ",
    health: 22,
    speed: 70,
    damage: 1,
    reward: 15,
    color: "#FF69B4",
    personality: "graceful"
  }
];

// Party mode enemy waves!
export const partyWaves = [
  { enemies: ['ant', 'ant', 'ant', 'ant', 'ant'], name: 'Ant March!' },
  { enemies: ['butterfly', 'moth', 'dragonfly'], name: 'Flying Fiesta!' },
  { enemies: ['snail', 'snail', 'caterpillar', 'caterpillar'], name: 'Slow & Steady!' },
  { enemies: ['bee', 'bee', 'bee', 'ladybug'], name: 'Buzzing Party!' },
  { enemies: ['beetle', 'mantis', 'scorpion'], name: 'Boss Rush!' }
];