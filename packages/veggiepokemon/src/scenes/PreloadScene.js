export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
    this.veggieMonsters = [];
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(262, 354, 500, 60);
    
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 60,
      text: 'Loading Veggie Monsters...',
      style: {
        font: '32px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '28px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x27ae60, 1);
      progressBar.fillRect(272, 364, 480 * value, 40);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    const vegetables = [
      'tomato', 'carrot', 'broccoli', 'corn', 'eggplant', 'bell_pepper',
      'cucumber', 'onion', 'potato', 'pumpkin', 'spinach', 'garlic',
      'asparagus', 'avocado', 'cabbage', 'celery', 'lettuce', 'pea',
      'zucchini', 'mushroom', 'cauliflower', 'radish', 'beet', 'turnip'
    ];
    
    vegetables.forEach(veggie => {
      this.load.image(`veggie_${veggie}`, `../../assets/vegetables/img/${veggie}.png`);
    });
    
    this.load.image('garden_tile', '../../assets/textures/garden.png');
    this.load.image('soil_tile', '../../assets/textures/soil.png');
    this.load.image('water_tile', '../../assets/textures/water.png');
    this.load.image('veggieball', '../../assets/items/veggieball.png');
    this.load.image('fertilizer', '../../assets/items/fertilizer.png');
    
    this.load.spritesheet('farmer', '../../assets/sprites/farmer.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    
    this.load.audio('bgm_garden', ['../../assets/sounds/garden.mp3']);
    this.load.audio('bgm_battle', ['../../assets/sounds/battle.mp3']);
    this.load.audio('sfx_plant', ['../../assets/sounds/plant.mp3']);
    this.load.audio('sfx_water', ['../../assets/sounds/water.mp3']);
    this.load.audio('sfx_harvest', ['../../assets/sounds/harvest.mp3']);
    this.load.audio('sfx_evolve', ['../../assets/sounds/evolve.mp3']);
  }

  create() {
    this.createVeggieMonsters();
    this.scene.start('MenuScene', { veggieMonsters: this.veggieMonsters });
  }
  
  createVeggieMonsters() {
    const types = ['Leaf', 'Root', 'Fruit', 'Seed', 'Flower', 'Stem', 'Bulb', 'Fungi'];
    const elements = ['Water', 'Earth', 'Sun', 'Wind'];
    
    const monsters = [
      {
        id: 'tomato',
        name: 'トマトン',
        type: 'Fruit',
        element: 'Sun',
        stage: 1,
        evolvesTo: 'super_tomato',
        stats: { hp: 80, attack: 75, defense: 65, speed: 70, special: 85 },
        moves: ['ジューシースプラッシュ', 'サンビーム', 'ビタミンC爆弾', 'リコピンシールド'],
        description: '太陽の恵みを受けて育つフルーツタイプ。熟すと強力な攻撃力を発揮する。',
        rarity: 'common',
        growthTime: 120
      },
      {
        id: 'super_tomato',
        name: 'トマトキング',
        type: 'Fruit',
        element: 'Sun',
        stage: 2,
        evolvesTo: null,
        stats: { hp: 120, attack: 110, defense: 90, speed: 85, special: 125 },
        moves: ['メガジューシーブラスト', 'ソーラーレイ', 'トマトメテオ', 'キングシールド'],
        description: '完熟した王者。圧倒的な特殊攻撃力を誇る。',
        rarity: 'rare',
        growthTime: 240
      },
      {
        id: 'carrot',
        name: 'キャロッタ',
        type: 'Root',
        element: 'Earth',
        stage: 1,
        evolvesTo: 'golden_carrot',
        stats: { hp: 70, attack: 80, defense: 85, speed: 65, special: 60 },
        moves: ['ルートドリル', 'アースパワー', 'ベータカロテンビーム', '地中潜伏'],
        description: '地中深くに根を張るルートタイプ。防御力が高い。',
        rarity: 'common',
        growthTime: 100
      },
      {
        id: 'broccoli',
        name: 'ブロッコン',
        type: 'Flower',
        element: 'Wind',
        stage: 1,
        evolvesTo: 'mega_broccoli',
        stats: { hp: 90, attack: 70, defense: 100, speed: 50, special: 70 },
        moves: ['フラワーガード', 'ウィンドバリア', '栄養素ドレイン', 'ヘルシーオーラ'],
        description: '緑の花を咲かせるフラワータイプ。鉄壁の防御を誇る。',
        rarity: 'uncommon',
        growthTime: 150
      },
      {
        id: 'corn',
        name: 'コーンボム',
        type: 'Seed',
        element: 'Sun',
        stage: 1,
        evolvesTo: 'popcorn_master',
        stats: { hp: 85, attack: 90, defense: 60, speed: 75, special: 80 },
        moves: ['ポップコーンボム', 'シードマシンガン', 'ゴールデンレイン', 'コーンフィールド'],
        description: '爆発的な攻撃を得意とするシードタイプ。',
        rarity: 'common',
        growthTime: 130
      },
      {
        id: 'eggplant',
        name: 'ナスビー',
        type: 'Fruit',
        element: 'Water',
        stage: 1,
        evolvesTo: 'shadow_eggplant',
        stats: { hp: 75, attack: 85, defense: 70, speed: 90, special: 75 },
        moves: ['パープルミスト', 'ウォーターアブソーブ', 'シャドウスライス', 'ナス忍法'],
        description: '水分を多く含む神秘的なフルーツタイプ。素早い動きが特徴。',
        rarity: 'uncommon',
        growthTime: 140
      },
      {
        id: 'potato',
        name: 'ポテトロック',
        type: 'Root',
        element: 'Earth',
        stage: 1,
        evolvesTo: 'sweet_potato',
        stats: { hp: 110, attack: 75, defense: 110, speed: 40, special: 55 },
        moves: ['ロックスラム', 'でんぷんアーマー', 'アースクエイク', 'ポテトウォール'],
        description: '重厚な体を持つルートタイプ。圧倒的な耐久力を誇る。',
        rarity: 'common',
        growthTime: 110
      },
      {
        id: 'pumpkin',
        name: 'パンプキング',
        type: 'Fruit',
        element: 'Earth',
        stage: 2,
        evolvesTo: null,
        stats: { hp: 130, attack: 95, defense: 95, speed: 45, special: 100 },
        moves: ['ハロウィンボム', 'パンプキンフィールド', 'ジャックランタン', 'キングプレッシャー'],
        description: '巨大な体を持つ伝説のフルーツタイプ。',
        rarity: 'legendary',
        growthTime: 300
      },
      {
        id: 'spinach',
        name: 'スピナッチ',
        type: 'Leaf',
        element: 'Wind',
        stage: 1,
        evolvesTo: 'iron_spinach',
        stats: { hp: 65, attack: 70, defense: 60, speed: 95, special: 90 },
        moves: ['リーフカッター', 'アイアンブースト', 'ウィンドスピン', '光合成'],
        description: '鉄分豊富なリーフタイプ。素早さと特殊攻撃が得意。',
        rarity: 'common',
        growthTime: 90
      },
      {
        id: 'garlic',
        name: 'ガーリック',
        type: 'Bulb',
        element: 'Earth',
        stage: 1,
        evolvesTo: 'vampire_garlic',
        stats: { hp: 70, attack: 95, defense: 75, speed: 60, special: 80 },
        moves: ['スメルアタック', 'バルブボム', 'アロマセラピー', 'ガーリックバリア'],
        description: '強烈な匂いで敵を攻撃するバルブタイプ。',
        rarity: 'uncommon',
        growthTime: 120
      },
      {
        id: 'mushroom',
        name: 'マッシュルーム',
        type: 'Fungi',
        element: 'Earth',
        stage: 1,
        evolvesTo: 'giant_mushroom',
        stats: { hp: 85, attack: 65, defense: 80, speed: 55, special: 95 },
        moves: ['スポアクラウド', 'マッシュルームボム', 'ポイズンミスト', 'ファンガスフィールド'],
        description: '神秘的な力を持つキノコタイプ。特殊攻撃が得意。',
        rarity: 'rare',
        growthTime: 160
      }
    ];
    
    this.veggieMonsters = monsters;
  }
}