export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
    this.flagCharacters = [];
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading Flags...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 25,
      text: '',
      style: {
        font: '14px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
    
    this.load.on('fileprogress', (file) => {
      assetText.setText('Loading: ' + file.key);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    // Load flag images directly without YAML parsing for now
    const flagCountries = [
      'usa', 'china', 'japan', 'germany', 'india', 'uk', 'france', 'brazil',
      'italy', 'canada', 'south_korea', 'spain', 'australia', 'russia', 'mexico',
      'indonesia', 'netherlands', 'saudi_arabia', 'turkey', 'switzerland',
      'poland', 'sweden', 'belgium', 'argentina', 'ireland', 'austria',
      'nigeria', 'israel', 'uae', 'egypt', 'denmark', 'singapore', 'malaysia',
      'norway', 'philippines', 'south_africa', 'thailand', 'bangladesh',
      'vietnam', 'colombia', 'chile', 'finland', 'pakistan', 'romania',
      'czech_republic', 'portugal', 'iraq', 'peru', 'greece', 'new_zealand',
      'qatar', 'algeria', 'hungary', 'kazakhstan', 'kuwait', 'morocco',
      'ecuador', 'slovakia', 'kenya', 'angola', 'ethiopia', 'oman',
      'dominican_republic', 'guatemala', 'myanmar', 'luxembourg', 'panama',
      'ghana', 'bulgaria', 'venezuela', 'tanzania', 'croatia', 'belarus',
      'costa_rica', 'uruguay', 'slovenia', 'lithuania', 'serbia', 'uganda',
      'libya', 'jordan', 'azerbaijan', 'paraguay', 'bolivia', 'cameroon',
      'bahrain', 'latvia', 'tunisia', 'estonia', 'nepal', 'yemen',
      'cambodia', 'el_salvador', 'cyprus', 'honduras', 'iceland', 'senegal'
    ];
    
    // Load flag images with error handling
    flagCountries.forEach(country => {
      this.load.image(`flag_${country}`, `/packages/assets/flags/img/${country}.png`);
    });
    
    // Skip audio/background loading for now
  }

  create() {
    this.parseFlagData();
    this.scene.start('MenuScene', { flagCharacters: this.flagCharacters });
  }
  
  parseFlagData() {
    // Create character data for available flags
    const flagCountries = [
      { id: 'usa', name: 'アメリカ合衆国', englishName: 'United States', colors: ['#B22234', '#FFFFFF', '#3C3B6E'] },
      { id: 'japan', name: '日本', englishName: 'Japan', colors: ['#BC002D', '#FFFFFF'] },
      { id: 'brazil', name: 'ブラジル', englishName: 'Brazil', colors: ['#009739', '#FFDA27', '#012169'] },
      { id: 'germany', name: 'ドイツ', englishName: 'Germany', colors: ['#000000', '#DD0000', '#FFCE00'] },
      { id: 'france', name: 'フランス', englishName: 'France', colors: ['#002395', '#FFFFFF', '#ED2939'] },
      { id: 'uk', name: 'イギリス', englishName: 'United Kingdom', colors: ['#012169', '#FFFFFF', '#C8102E'] },
      { id: 'china', name: '中国', englishName: 'China', colors: ['#DE2910', '#FFDE00'] },
      { id: 'russia', name: 'ロシア', englishName: 'Russia', colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
      { id: 'canada', name: 'カナダ', englishName: 'Canada', colors: ['#FF0000', '#FFFFFF'] },
      { id: 'australia', name: 'オーストラリア', englishName: 'Australia', colors: ['#012169', '#FFFFFF', '#E4002B'] },
      { id: 'italy', name: 'イタリア', englishName: 'Italy', colors: ['#009246', '#FFFFFF', '#CE2B37'] },
      { id: 'spain', name: 'スペイン', englishName: 'Spain', colors: ['#AA151B', '#F1BF00'] },
      { id: 'india', name: 'インド', englishName: 'India', colors: ['#FF9933', '#FFFFFF', '#138808'] },
      { id: 'mexico', name: 'メキシコ', englishName: 'Mexico', colors: ['#006847', '#FFFFFF', '#CE1126'] },
      { id: 'south_korea', name: '韓国', englishName: 'South Korea', colors: ['#FFFFFF', '#C60C30', '#003478'] },
      { id: 'netherlands', name: 'オランダ', englishName: 'Netherlands', colors: ['#AE1C28', '#FFFFFF', '#21468B'] },
      { id: 'argentina', name: 'アルゼンチン', englishName: 'Argentina', colors: ['#75AADB', '#FFFFFF'] },
      { id: 'sweden', name: 'スウェーデン', englishName: 'Sweden', colors: ['#006AA7', '#FECC00'] },
      { id: 'switzerland', name: 'スイス', englishName: 'Switzerland', colors: ['#FF0000', '#FFFFFF'] },
      { id: 'poland', name: 'ポーランド', englishName: 'Poland', colors: ['#FFFFFF', '#DC143C'] }
    ];
    
    this.flagCharacters = flagCountries.map((country, index) => {
      const tier = Math.floor(Math.random() * 5) + 1;
      const baseStats = {
        hp: 70 + (tier * 10),
        attack: 15 + (tier * 3),
        defense: 10 + (tier * 2),
        speed: 20 - (tier * 2) + Math.random() * 10
      };
      
      const specialMoves = {
        usa: 'イーグルストライク',
        japan: '桜吹雪',
        brazil: 'サンバキック',
        germany: 'アイアンウォール',
        france: 'エッフェル塔アタック',
        uk: 'ロイヤルガード',
        china: '龍の舞',
        russia: 'シベリアンブリザード',
        canada: 'メープルスラッシュ',
        australia: 'カンガルーキック',
        italy: 'ローマンラッシュ',
        spain: 'フラメンコフューリー',
        india: 'タイガーストライク',
        mexico: 'ルチャスラム',
        south_korea: 'テコンドーコンボ',
        netherlands: 'ウィンドミルスピン'
      };
      
      return {
        id: country.id,
        name: country.name,
        englishName: country.englishName,
        stats: baseStats,
        special: specialMoves[country.id] || '特殊攻撃',
        colors: country.colors,
        emoji: '',
        tier: tier,
        gdp_tier: 'standard',
        continent: 'Unknown',
        category: 'Country'
      };
    });
    
    console.log(`Parsed ${this.flagCharacters.length} flag characters`);
  }
}