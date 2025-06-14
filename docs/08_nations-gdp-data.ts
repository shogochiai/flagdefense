// 国家別GDPデータ（2023年推定、10億ドル単位）
export const nationsGDP = {
  // === 超大国（10兆ドル以上） ===
  usa: 25462,
  china: 17963,
  
  // === 大国（1兆-10兆ドル） ===
  japan: 4231,
  germany: 4072,
  india: 3732,
  uk: 3070,
  france: 2957,
  italy: 2107,
  canada: 2139,
  south_korea: 1709,
  russia: 2062,
  brazil: 2126,
  australia: 1553,
  spain: 1398,
  mexico: 1414,
  indonesia: 1289,
  netherlands: 991,
  saudi_arabia: 1108,
  turkey: 1029,
  switzerland: 905,
  
  // === 中規模国（1000億-1兆ドル） ===
  poland: 688,
  belgium: 579,
  sweden: 635,
  ireland: 545,
  argentina: 491,
  austria: 479,
  norway: 482,
  israel: 481,
  uae: 449,
  egypt: 469,
  denmark: 398,
  singapore: 497,
  malaysia: 430,
  vietnam: 409,
  philippines: 404,
  thailand: 495,
  bangladesh: 460,
  nigeria: 477,
  colombia: 343,
  chile: 344,
  finland: 301,
  pakistan: 376,
  romania: 301,
  czech_republic: 330,
  portugal: 287,
  new_zealand: 249,
  greece: 219,
  iraq: 264,
  algeria: 195,
  qatar: 225,
  kazakhstan: 225,
  hungary: 188,
  kuwait: 161,
  
  // === 小規模国（100億-1000億ドル） ===
  morocco: 134,
  ecuador: 115,
  slovakia: 127,
  kenya: 113,
  ethiopia: 126,
  puerto_rico: 113,
  dominican_republic: 113,
  oman: 108,
  guatemala: 95,
  bulgaria: 100,
  venezuela: 92,
  luxembourg: 86,
  croatia: 70,
  panama: 76,
  uruguay: 65,
  costa_rica: 68,
  tanzania: 75,
  slovenia: 62,
  lithuania: 71,
  serbia: 63,
  azerbaijan: 78,
  belarus: 72,
  dr_congo: 64,
  jordan: 50,
  cameroon: 48,
  bolivia: 44,
  uganda: 48,
  latvia: 41,
  paraguay: 42,
  estonia: 38,
  nepal: 41,
  cambodia: 30,
  el_salvador: 33,
  honduras: 32,
  cyprus: 28,
  senegal: 31,
  zimbabwe: 28,
  zambia: 30,
  iceland: 28,
  bosnia: 24,
  georgia: 24,
  haiti: 23,
  mali: 20,
  gabon: 21,
  albania: 19,
  mozambique: 18,
  malta: 18,
  burkina_faso: 20,
  botswana: 20,
  mongolia: 17,
  nicaragua: 16,
  laos: 15,
  macedonia: 14,
  mauritius: 13,
  namibia: 13,
  moldova: 14,
  bahrain: 44,
  benin: 19,
  niger: 17,
  rwanda: 13,
  kyrgyzstan: 12,
  tajikistan: 11,
  mauritania: 10,
  
  // === 極小国（10億ドル未満） ===
  togo: 9,
  montenegro: 6,
  maldives: 6,
  barbados: 6,
  fiji: 5,
  liberia: 4,
  sierra_leone: 4,
  suriname: 3.6,
  burundi: 3.6,
  south_sudan: 3.5,
  bhutan: 3,
  lesotho: 2.5,
  gambia: 2.2,
  central_african: 2.5,
  belize: 2.8,
  djibouti: 3.7,
  seychelles: 2,
  antigua_barbuda: 1.8,
  comoros: 1.3,
  solomon_islands: 1.6,
  guinea_bissau: 1.6,
  grenada: 1.3,
  saint_kitts_nevis: 1.1,
  vanuatu: 1,
  samoa: 0.9,
  saint_vincent: 0.9,
  dominica: 0.6,
  tonga: 0.5,
  sao_tome: 0.5,
  micronesia: 0.4,
  palau: 0.3,
  marshall_islands: 0.3,
  kiribati: 0.2,
  nauru: 0.15,
  tuvalu: 0.06,
  
  // === 特別地域・自治地域 ===
  hong_kong: 382,
  taiwan: 790,
  palestine: 19,
  greenland: 3,
  faroe: 3,
  guam: 6,
  virgin_islands_us: 4,
  bermuda: 7,
  cayman: 6,
  aruba: 3.5,
  curacao: 3,
  french_polynesia: 6,
  new_caledonia: 10,
  
  // === 非承認・ミクロ国家 ===
  vatican: 0.8,
  monaco: 8,
  liechtenstein: 7,
  san_marino: 2,
  andorra: 3.5,
  
  // === 部分承認国家 ===
  kosovo: 10,
  northern_cyprus: 4,
  abkhazia: 0.5,
  south_ossetia: 0.1,
  transnistria: 1,
  somaliland: 2,
  
  // === 架空・極小国家 ===
  sealand: 0.001,
  liberland: 0.001,
  molossia: 0.001,
  hutt_river: 0.001,
  conch_republic: 0.001,
  christiania: 0.001,
  ladonia: 0.001,
  uzupis: 0.001,
  whangamomona: 0.001,

  // === 自治領・王室属領 ===
  isle_of_man: 7,
  jersey: 6,
  guernsey: 3.5,
  gibraltar: 2.5,
  anguilla: 0.3,
  reunion: 22,
  mayotte: 3,
};

// GDP階層判定関数
export const getGDPTier = (gdpBillion) => {
  if (gdpBillion >= 10000) return 'super';
  if (gdpBillion >= 1000) return 'major';
  if (gdpBillion >= 100) return 'large';
  if (gdpBillion >= 10) return 'medium';
  if (gdpBillion >= 1) return 'small';
  if (gdpBillion >= 0.1) return 'tiny';
  return 'micro';
};

// 敵HP計算関数（GDP基準）
export const calculateEnemyHP = (countryId, waveNumber, enemyType = 'soldier') => {
  const gdp = nationsGDP[countryId] || 1;
  
  // 基本HP（GDPの平方根を使用してスケーリング）
  const baseHP = Math.max(5, Math.floor(Math.sqrt(gdp) * 10));
  
  // Wave進行による補正（緩やかに上昇）
  const waveFactor = 1 + (waveNumber / 100) * 0.5;
  
  // 敵タイプによる補正
  const typeMultipliers = {
    soldier: 1.0,
    jet: 0.8,
    tank: 2.0,
    elite: 3.0,
    boss: 5.0
  };
  
  const typeMultiplier = typeMultipliers[enemyType] || 1;
  
  return Math.floor(baseHP * waveFactor * typeMultiplier);
};

// 報酬計算関数（GDP基準）
export const calculateReward = (countryId, enemyType = 'soldier') => {
  const gdp = nationsGDP[countryId] || 1;
  
  // 基本報酬（GDPの対数を使用）
  const baseReward = 10 + Math.floor(Math.log10(gdp + 1) * 5);
  
  // 敵タイプによるボーナス
  const typeBonus = {
    soldier: 1.0,
    jet: 1.2,
    tank: 2.5,
    elite: 4.0,
    boss: 10.0
  };
  
  return Math.floor(baseReward * (typeBonus[enemyType] || 1));
};