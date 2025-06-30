export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
    this.flagMonsters = [];
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 480, 50);
    
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading Flag Monsters...',
      style: {
        font: '24px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 460 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    const flagCountries = [
      'usa', 'japan', 'uk', 'germany', 'france', 'brazil', 
      'canada', 'russia', 'china', 'india', 'italy', 'spain',
      'australia', 'mexico', 'south_korea', 'netherlands',
      'argentina', 'sweden', 'norway', 'finland', 'denmark',
      'poland', 'turkey', 'egypt', 'south_africa', 'kenya'
    ];
    
    flagCountries.forEach(country => {
      this.load.image(`flag_${country}`, `../../assets/flags/img/${country}.png`);
    });
    
    this.load.image('grass_tile', '../../assets/textures/grass.png');
    this.load.image('water_tile', '../../assets/textures/water.png');
    this.load.image('stone_tile', '../../assets/textures/stone.png');
    this.load.image('pokeball', '../../assets/items/pokeball.png');
    
    this.load.spritesheet('player', '../../assets/sprites/player.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    
    this.load.audio('bgm_world', ['../../assets/sounds/world.mp3']);
    this.load.audio('bgm_battle', ['../../assets/sounds/battle.mp3']);
    this.load.audio('sfx_encounter', ['../../assets/sounds/encounter.mp3']);
    this.load.audio('sfx_capture', ['../../assets/sounds/capture.mp3']);
  }

  create() {
    this.createFlagMonsters();
    this.scene.start('MenuScene', { flagMonsters: this.flagMonsters });
  }
  
  createFlagMonsters() {
    const types = ['Fire', 'Water', 'Grass', 'Electric', 'Rock', 'Flying', 'Psychic', 'Dark'];
    
    const monsters = [
      {
        id: 'usa',
        name: 'アメリフリー',
        type: 'Flying',
        stats: { hp: 100, attack: 90, defense: 85, speed: 95 },
        moves: ['イーグルストライク', 'フリーダムビーム', 'スターシールド', 'リバティウィング'],
        description: '自由の象徴を持つ飛行タイプのフラッグモン。星条旗の力で戦う。',
        rarity: 'legendary'
      },
      {
        id: 'japan',
        name: 'ニホンマル',
        type: 'Psychic',
        stats: { hp: 85, attack: 80, defense: 75, speed: 100 },
        moves: ['サンライズビーム', '侍スラッシュ', '桜吹雪', '禅パワー'],
        description: '日出ずる国の力を秘めた超能力タイプ。和の心で戦う。',
        rarity: 'rare'
      },
      {
        id: 'brazil',
        name: 'ブラジリア',
        type: 'Grass',
        stats: { hp: 80, attack: 85, defense: 70, speed: 105 },
        moves: ['アマゾンウィップ', 'サンバキック', 'カーニバルダンス', 'ジャングルコール'],
        description: 'アマゾンの生命力を持つ草タイプ。陽気な性格で踊りながら戦う。',
        rarity: 'uncommon'
      },
      {
        id: 'germany',
        name: 'ゲルマニック',
        type: 'Rock',
        stats: { hp: 110, attack: 95, defense: 110, speed: 60 },
        moves: ['アイアンウォール', 'テクノパンチ', 'エンジニアリング', 'プレシジョンストライク'],
        description: '堅固な防御を誇る岩タイプ。精密な技術で相手を圧倒する。',
        rarity: 'rare'
      },
      {
        id: 'uk',
        name: 'ブリティオン',
        type: 'Water',
        stats: { hp: 90, attack: 85, defense: 90, speed: 85 },
        moves: ['ロイヤルウェーブ', 'ユニオンジャック', 'ティータイム', 'フォグミスト'],
        description: '海を支配した歴史を持つ水タイプ。優雅に戦う。',
        rarity: 'rare'
      },
      {
        id: 'france',
        name: 'フランソワーズ',
        type: 'Fire',
        stats: { hp: 85, attack: 95, defense: 75, speed: 90 },
        moves: ['レボリューションフレア', 'エッフェルスピア', 'グルメアタック', 'トリコロールビーム'],
        description: '情熱的な炎タイプ。革命の精神で戦う。',
        rarity: 'uncommon'
      },
      {
        id: 'china',
        name: 'チャイナドラゴ',
        type: 'Dark',
        stats: { hp: 95, attack: 100, defense: 80, speed: 80 },
        moves: ['ドラゴンクロー', '太極拳', '万里の長城', '五星紅旗'],
        description: '古代の力を秘めた闇タイプ。龍の力で戦う。',
        rarity: 'legendary'
      },
      {
        id: 'canada',
        name: 'カナディアン',
        type: 'Grass',
        stats: { hp: 100, attack: 75, defense: 85, speed: 70 },
        moves: ['メープルストーム', 'アイスホッケー', 'ムースチャージ', 'ポライトシールド'],
        description: '自然と共生する草タイプ。礼儀正しく戦う。',
        rarity: 'common'
      }
    ];
    
    this.flagMonsters = monsters;
  }
}