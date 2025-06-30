export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
    this.veggieCharacters = [];
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(340, 330, 600, 60);
    
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading Veggie Fighters...',
      style: {
        font: '28px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 10,
      text: '0%',
      style: {
        font: '24px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x27ae60, 1);
      progressBar.fillRect(350, 340, 580 * value, 40);
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
      'arugula', 'banana', 'bitter_gourd', 'bok_choy', 'broad_bean',
      'burdock', 'chili_pepper', 'chinese_cabbage', 'daikon', 'garlic_chive',
      'ginger', 'grape', 'green_bean', 'green_onion', 'kiwi', 'komatsuna',
      'lemon', 'lotus_root', 'mandarin', 'mango', 'mizuna', 'okra',
      'orange', 'peach', 'pear', 'persimmon', 'pineapple', 'strawberry',
      'sweet_potato', 'taro', 'turnip', 'watermelon', 'zucchini'
    ];
    
    vegetables.forEach(veggie => {
      this.load.image(`veggie_${veggie}`, `assets/vegetables/img/${veggie}.png`);
    });
    
    this.load.image('kitchen_bg', '../../assets/backgrounds/kitchen.png');
    this.load.image('farm_bg', '../../assets/backgrounds/farm.png');
    this.load.image('market_bg', '../../assets/backgrounds/market.png');
    
    this.load.audio('bgm_menu', ['../../assets/sounds/menu.mp3']);
    this.load.audio('bgm_battle', ['../../assets/sounds/battle.mp3']);
    this.load.audio('sfx_hit', ['../../assets/sounds/hit.mp3']);
    this.load.audio('sfx_slice', ['../../assets/sounds/slice.mp3']);
    this.load.audio('sfx_squish', ['../../assets/sounds/squish.mp3']);
    this.load.audio('sfx_special', ['../../assets/sounds/special.mp3']);
  }

  create() {
    this.createVeggieCharacters();
    this.scene.start('MenuScene', { veggieCharacters: this.veggieCharacters });
  }
  
  createVeggieCharacters() {
    const characters = [
      { id: 'tomato', name: 'トマト将軍', stats: { hp: 120, attack: 28, defense: 22, speed: 18 }, special: 'リコピンブラスト', description: 'ジューシーな攻撃で敵を圧倒する' },
      { id: 'carrot', name: 'キャロット侍', stats: { hp: 90, attack: 35, defense: 15, speed: 30 }, special: 'ベータカロテン斬り', description: '素早い斬撃で敵を切り裂く' },
      { id: 'broccoli', name: 'ブロッコリー騎士', stats: { hp: 110, attack: 25, defense: 30, speed: 15 }, special: '鉄壁の森ガード', description: '硬い防御で攻撃を跳ね返す' },
      { id: 'corn', name: 'コーン砲兵', stats: { hp: 100, attack: 30, defense: 20, speed: 20 }, special: 'ポップコーン爆撃', description: '遠距離から爆発攻撃を仕掛ける' },
      { id: 'eggplant', name: 'ナス忍者', stats: { hp: 85, attack: 32, defense: 18, speed: 35 }, special: '紫煙の術', description: '影に潜み素早く攻撃する' },
      { id: 'bell_pepper', name: 'パプリカ戦士', stats: { hp: 95, attack: 28, defense: 25, speed: 22 }, special: 'カラフルコンボ', description: '色とりどりの技で戦う' },
      { id: 'cucumber', name: 'キューカンバー槍兵', stats: { hp: 80, attack: 30, defense: 20, speed: 28 }, special: 'ひんやり突き', description: '冷たい槍で敵を貫く' },
      { id: 'onion', name: 'オニオン魔法使い', stats: { hp: 75, attack: 35, defense: 15, speed: 25 }, special: '涙目催眠術', description: '敵を涙で視界を奪う' },
      { id: 'potato', name: 'ポテト重戦士', stats: { hp: 130, attack: 26, defense: 35, speed: 10 }, special: 'でんぷんバリア', description: '重厚な体で攻撃を受け止める' },
      { id: 'pumpkin', name: 'パンプキン大王', stats: { hp: 140, attack: 30, defense: 28, speed: 8 }, special: 'ハロウィンクラッシュ', description: '巨体で敵を押しつぶす' },
      { id: 'spinach', name: 'スピナッチ格闘家', stats: { hp: 95, attack: 33, defense: 20, speed: 25 }, special: 'アイアンパンチ', description: '鉄分パワーで強烈な一撃' },
      { id: 'garlic', name: 'ガーリック僧侶', stats: { hp: 80, attack: 22, defense: 28, speed: 20 }, special: '浄化の香り', description: '神聖な香りで敵を浄化' },
      { id: 'asparagus', name: 'アスパラ騎兵', stats: { hp: 88, attack: 30, defense: 18, speed: 32 }, special: '緑の槍突撃', description: '素早い突進攻撃' },
      { id: 'avocado', name: 'アボカド守護者', stats: { hp: 115, attack: 24, defense: 32, speed: 12 }, special: '健康バリア', description: '良質な脂肪で防御' },
      { id: 'cabbage', name: 'キャベツ戦車', stats: { hp: 125, attack: 27, defense: 30, speed: 10 }, special: '千切りストーム', description: '回転攻撃で敵を粉砕' },
      { id: 'celery', name: 'セロリ魔術師', stats: { hp: 70, attack: 36, defense: 14, speed: 28 }, special: '繊維の呪文', description: '魔法攻撃のスペシャリスト' },
      { id: 'lettuce', name: 'レタス衛兵', stats: { hp: 85, attack: 26, defense: 24, speed: 24 }, special: 'リーフシールド', description: 'バランスの取れた戦士' },
      { id: 'pea', name: 'ピー豆鉄砲', stats: { hp: 75, attack: 34, defense: 16, speed: 30 }, special: '豆マシンガン', description: '連続射撃が得意' },
      { id: 'arugula', name: 'ルッコラ暗殺者', stats: { hp: 78, attack: 38, defense: 12, speed: 36 }, special: 'ビターアサシン', description: '苦味の刃で敵を斬る' },
      { id: 'banana', name: 'バナナ道化師', stats: { hp: 92, attack: 29, defense: 21, speed: 26 }, special: 'スリップトラップ', description: 'トリッキーな戦法' },
      { id: 'bitter_gourd', name: 'ゴーヤ武闘家', stats: { hp: 98, attack: 31, defense: 23, speed: 22 }, special: '苦味パンチ', description: '苦い経験を与える' },
      { id: 'bok_choy', name: 'チンゲンサイ僧', stats: { hp: 87, attack: 25, defense: 27, speed: 21 }, special: '青菜瞑想', description: '心を落ち着けて戦う' },
      { id: 'broad_bean', name: 'そら豆剣士', stats: { hp: 93, attack: 32, defense: 19, speed: 24 }, special: '豆剣乱舞', description: '華麗な剣技' },
      { id: 'burdock', name: 'ゴボウ地底王', stats: { hp: 105, attack: 28, defense: 26, speed: 16 }, special: '地中強襲', description: '地面から奇襲攻撃' },
      { id: 'chili_pepper', name: 'チリペッパー炎術師', stats: { hp: 82, attack: 40, defense: 10, speed: 33 }, special: '激辛ファイア', description: '燃える攻撃力' },
      { id: 'chinese_cabbage', name: '白菜将軍', stats: { hp: 118, attack: 26, defense: 29, speed: 14 }, special: '白菜砲撃', description: '重厚な攻撃' },
      { id: 'daikon', name: '大根侍大将', stats: { hp: 122, attack: 29, defense: 27, speed: 17 }, special: '大根おろし斬り', description: '伝統的な剣術' },
      { id: 'garlic_chive', name: 'ニラ忍者頭領', stats: { hp: 83, attack: 34, defense: 17, speed: 31 }, special: 'ニラ手裏剣', description: '素早い暗器術' },
      { id: 'ginger', name: 'ジンジャー拳法家', stats: { hp: 91, attack: 33, defense: 20, speed: 27 }, special: '生姜激震拳', description: '体を温める格闘技' },
      { id: 'grape', name: 'グレープ貴族', stats: { hp: 86, attack: 27, defense: 22, speed: 23 }, special: 'ワインスプラッシュ', description: '優雅な攻撃' },
      { id: 'green_bean', name: 'インゲン弓兵', stats: { hp: 79, attack: 31, defense: 18, speed: 29 }, special: '豆矢の雨', description: '正確な遠距離攻撃' },
      { id: 'green_onion', name: 'ネギ剣豪', stats: { hp: 88, attack: 36, defense: 16, speed: 28 }, special: 'ネギ二刀流', description: '二刀流の達人' },
      { id: 'kiwi', name: 'キウイ野人', stats: { hp: 94, attack: 30, defense: 22, speed: 23 }, special: 'ワイルドクラッシュ', description: '野性的な戦い方' },
      { id: 'komatsuna', name: '小松菜武士', stats: { hp: 89, attack: 28, defense: 24, speed: 25 }, special: '菜っ葉斬り', description: '正統派の剣術' },
      { id: 'lemon', name: 'レモン錬金術師', stats: { hp: 77, attack: 37, defense: 13, speed: 32 }, special: '酸性爆弾', description: '化学攻撃の専門家' },
      { id: 'lotus_root', name: 'レンコン砲台', stats: { hp: 108, attack: 29, defense: 28, speed: 13 }, special: '穴あき砲撃', description: '多方向攻撃' },
      { id: 'mandarin', name: 'みかん陽術師', stats: { hp: 84, attack: 26, defense: 21, speed: 26 }, special: 'ビタミンCビーム', description: '太陽の力を操る' },
      { id: 'mango', name: 'マンゴー王子', stats: { hp: 96, attack: 31, defense: 21, speed: 24 }, special: 'トロピカルストーム', description: '南国の力' },
      { id: 'mizuna', name: '水菜忍者', stats: { hp: 81, attack: 32, defense: 17, speed: 34 }, special: '水遁の術', description: '水を操る忍術' },
      { id: 'okra', name: 'オクラ粘着兵', stats: { hp: 90, attack: 27, defense: 25, speed: 21 }, special: 'ネバネバトラップ', description: '粘液で敵を捕える' },
      { id: 'orange', name: 'オレンジ闘士', stats: { hp: 97, attack: 30, defense: 22, speed: 23 }, special: 'シトラスバースト', description: '爽やかな攻撃' },
      { id: 'peach', name: 'ピーチ姫武者', stats: { hp: 88, attack: 28, defense: 23, speed: 26 }, special: '桃色乱舞', description: '優美な戦闘スタイル' },
      { id: 'pear', name: '梨侍', stats: { hp: 92, attack: 29, defense: 24, speed: 22 }, special: '梨汁飛沫斬り', description: 'みずみずしい剣技' },
      { id: 'persimmon', name: '柿武将', stats: { hp: 102, attack: 27, defense: 26, speed: 18 }, special: '熟柿爆弾', description: '熟練の技' },
      { id: 'pineapple', name: 'パイナップル戦士', stats: { hp: 106, attack: 32, defense: 24, speed: 19 }, special: 'トゲトゲアタック', description: '鋭い攻撃' },
      { id: 'strawberry', name: 'イチゴ騎士団長', stats: { hp: 85, attack: 30, defense: 20, speed: 29 }, special: 'ベリーソード', description: '甘い見た目に反して強力' },
      { id: 'sweet_potato', name: 'サツマイモ相撲取り', stats: { hp: 135, attack: 28, defense: 33, speed: 9 }, special: '芋投げ', description: '重量級の戦士' },
      { id: 'taro', name: '里芋忍者', stats: { hp: 95, attack: 29, defense: 24, speed: 23 }, special: 'ぬめり遁術', description: 'つかみどころのない戦法' },
      { id: 'turnip', name: 'カブ戦士', stats: { hp: 91, attack: 28, defense: 23, speed: 24 }, special: 'カブ投げ', description: 'シンプルで強力' },
      { id: 'watermelon', name: 'スイカ破壊王', stats: { hp: 145, attack: 35, defense: 30, speed: 7 }, special: 'スイカ割り', description: '圧倒的な破壊力' },
      { id: 'zucchini', name: 'ズッキーニ槍術士', stats: { hp: 87, attack: 31, defense: 19, speed: 28 }, special: 'グリーンランス', description: '長距離槍術の達人' }
    ];
    
    this.veggieCharacters = characters;
  }
}