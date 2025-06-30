class FlagDataManager {
  constructor() {
    this.flags = [];
    this.flagsById = {};
  }

  async loadFlagData() {
    try {
      // For now, use hardcoded data instead of YAML parsing
      this.flags = this.getHardcodedFlags();
      
      // Create lookup map
      this.flags.forEach(flag => {
        this.flagsById[flag.id] = flag;
      });
      
      console.log(`Loaded ${this.flags.length} flags`);
      return this.flags;
    } catch (error) {
      console.error('Error loading flag data:', error);
      return [];
    }
  }
  
  getHardcodedFlags() {
    return [
      {
        id: 'usa',
        japanese_name: 'アメリカ合衆国',
        english_name: 'United States',
        game_stats: { tier: 6, colors: ['#B22234', '#FFFFFF', '#3C3B6E'] },
        gdp_info: { gdp_tier: 'super' },
        continent: 'North America',
        category: '北米'
      },
      {
        id: 'japan',
        japanese_name: '日本',
        english_name: 'Japan',
        game_stats: { tier: 5, colors: ['#BC002D', '#FFFFFF'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'Asia',
        category: 'アジア'
      },
      {
        id: 'brazil',
        japanese_name: 'ブラジル',
        english_name: 'Brazil',
        game_stats: { tier: 4, colors: ['#009739', '#FFDA27', '#012169'] },
        gdp_info: { gdp_tier: 'medium' },
        continent: 'South America',
        category: '南米'
      },
      {
        id: 'germany',
        japanese_name: 'ドイツ',
        english_name: 'Germany',
        game_stats: { tier: 5, colors: ['#000000', '#DD0000', '#FFCE00'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'Europe',
        category: 'ヨーロッパ'
      },
      {
        id: 'france',
        japanese_name: 'フランス',
        english_name: 'France',
        game_stats: { tier: 5, colors: ['#002395', '#FFFFFF', '#ED2939'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'Europe',
        category: 'ヨーロッパ'
      },
      {
        id: 'uk',
        japanese_name: 'イギリス',
        english_name: 'United Kingdom',
        game_stats: { tier: 5, colors: ['#012169', '#FFFFFF', '#C8102E'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'Europe',
        category: 'ヨーロッパ'
      },
      {
        id: 'china',
        japanese_name: '中国',
        english_name: 'China',
        game_stats: { tier: 6, colors: ['#DE2910', '#FFDE00'] },
        gdp_info: { gdp_tier: 'super' },
        continent: 'Asia',
        category: 'アジア'
      },
      {
        id: 'russia',
        japanese_name: 'ロシア',
        english_name: 'Russia',
        game_stats: { tier: 4, colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
        gdp_info: { gdp_tier: 'medium' },
        continent: 'Europe',
        category: 'ヨーロッパ'
      },
      {
        id: 'canada',
        japanese_name: 'カナダ',
        english_name: 'Canada',
        game_stats: { tier: 4, colors: ['#FF0000', '#FFFFFF'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'North America',
        category: '北米'
      },
      {
        id: 'australia',
        japanese_name: 'オーストラリア',
        english_name: 'Australia',
        game_stats: { tier: 4, colors: ['#012169', '#FFFFFF', '#E4002B'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'Oceania',
        category: 'オセアニア'
      },
      {
        id: 'italy',
        japanese_name: 'イタリア',
        english_name: 'Italy',
        game_stats: { tier: 4, colors: ['#009246', '#FFFFFF', '#CE2B37'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'Europe',
        category: 'ヨーロッパ'
      },
      {
        id: 'spain',
        japanese_name: 'スペイン',
        english_name: 'Spain',
        game_stats: { tier: 4, colors: ['#AA151B', '#F1BF00'] },
        gdp_info: { gdp_tier: 'medium' },
        continent: 'Europe',
        category: 'ヨーロッパ'
      },
      {
        id: 'india',
        japanese_name: 'インド',
        english_name: 'India',
        game_stats: { tier: 5, colors: ['#FF9933', '#FFFFFF', '#138808'] },
        gdp_info: { gdp_tier: 'medium' },
        continent: 'Asia',
        category: 'アジア'
      },
      {
        id: 'mexico',
        japanese_name: 'メキシコ',
        english_name: 'Mexico',
        game_stats: { tier: 3, colors: ['#006847', '#FFFFFF', '#CE1126'] },
        gdp_info: { gdp_tier: 'medium' },
        continent: 'North America',
        category: '北米'
      },
      {
        id: 'south_korea',
        japanese_name: '韓国',
        english_name: 'South Korea',
        game_stats: { tier: 4, colors: ['#FFFFFF', '#C60C30', '#003478'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'Asia',
        category: 'アジア'
      },
      {
        id: 'netherlands',
        japanese_name: 'オランダ',
        english_name: 'Netherlands',
        game_stats: { tier: 4, colors: ['#AE1C28', '#FFFFFF', '#21468B'] },
        gdp_info: { gdp_tier: 'high' },
        continent: 'Europe',
        category: 'ヨーロッパ'
      }
    ];
  }

  getAllFlags() {
    return this.flags;
  }

  getFlagById(id) {
    return this.flagsById[id];
  }

  getRandomFlags(count) {
    const shuffled = [...this.flags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getFlagsByCategory(category) {
    return this.flags.filter(flag => flag.category === category);
  }

  getFlagsByContinent(continent) {
    return this.flags.filter(flag => flag.continent === continent);
  }

  getFlagsByTier(tier) {
    return this.flags.filter(flag => flag.game_stats.tier === tier);
  }
}

export default new FlagDataManager();