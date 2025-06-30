// 完全版国家データベース（250カ国）
// GDPデータとティア情報を統合

import { allNations } from '../../docs/07_nations-full-list';
import { nationsGDP } from '../../docs/08_nations-gdp-data';

// 国家データの型定義
export interface Nation {
  id: string;
  name: string;
  gdp: number;
  flag: string;
  colors: string[];
  tier?: number;
  cost?: number;
  damage?: number;
  range?: number;
}

// 国旗絵文字マッピング（主要国のみ）
const flagEmojis: Record<string, string> = {
  usa: '🇺🇸', china: '🇨🇳', japan: '🇯🇵', germany: '🇩🇪', india: '🇮🇳',
  uk: '🇬🇧', france: '🇫🇷', italy: '🇮🇹', canada: '🇨🇦', south_korea: '🇰🇷',
  brazil: '🇧🇷', australia: '🇦🇺', spain: '🇪🇸', mexico: '🇲🇽', indonesia: '🇮🇩',
  netherlands: '🇳🇱', saudi_arabia: '🇸🇦', turkey: '🇹🇷', switzerland: '🇨🇭',
  poland: '🇵🇱', belgium: '🇧🇪', sweden: '🇸🇪', ireland: '🇮🇪', argentina: '🇦🇷',
  austria: '🇦🇹', norway: '🇳🇴', israel: '🇮🇱', uae: '🇦🇪', egypt: '🇪🇬',
  denmark: '🇩🇰', singapore: '🇸🇬', malaysia: '🇲🇾', vietnam: '🇻🇳', philippines: '🇵🇭',
  thailand: '🇹🇭', bangladesh: '🇧🇩', nigeria: '🇳🇬', colombia: '🇨🇴', chile: '🇨🇱',
  finland: '🇫🇮', pakistan: '🇵🇰', romania: '🇷🇴', czech: '🇨🇿', new_zealand: '🇳🇿',
  greece: '🇬🇷', portugal: '🇵🇹', iraq: '🇮🇶', peru: '🇵🇪', kazakhstan: '🇰🇿',
  hungary: '🇭🇺', ukraine: '🇺🇦', morocco: '🇲🇦', slovakia: '🇸🇰', kenya: '🇰🇪',
  ethiopia: '🇪🇹', dominican: '🇩🇴', guatemala: '🇬🇹', ecuador: '🇪🇨', sri_lanka: '🇱🇰',
  myanmar: '🇲🇲', luxembourg: '🇱🇺', panama: '🇵🇦', uruguay: '🇺🇾', croatia: '🇭🇷',
  tanzania: '🇹🇿', slovenia: '🇸🇮', lithuania: '🇱🇹', serbia: '🇷🇸', tunisia: '🇹🇳',
  lebanon: '🇱🇧', libya: '🇱🇾', jordan: '🇯🇴', uganda: '🇺🇬', sudan: '🇸🇩',
  nepal: '🇳🇵', cambodia: '🇰🇭', cyprus: '🇨🇾', estonia: '🇪🇪', iceland: '🇮🇸',
  senegal: '🇸🇳', georgia: '🇬🇪', bosnia: '🇧🇦', albania: '🇦🇱', honduras: '🇭🇳',
  malta: '🇲🇹', bolivia: '🇧🇴', paraguay: '🇵🇾', laos: '🇱🇦', armenia: '🇦🇲',
  macedonia: '🇲🇰', jamaica: '🇯🇲', mongolia: '🇲🇳', namibia: '🇳🇦', moldova: '🇲🇩',
  latvia: '🇱🇻', niger: '🇳🇪', rwanda: '🇷🇼', kyrgyzstan: '🇰🇬', haiti: '🇭🇹',
  zambia: '🇿🇲', tajikistan: '🇹🇯', papua_new_guinea: '🇵🇬', mauritius: '🇲🇺',
  kosovo: '🇽🇰', guyana: '🇬🇾', madagascar: '🇲🇬', montenegro: '🇲🇪', maldives: '🇲🇻',
  barbados: '🇧🇧', fiji: '🇫🇯', liberia: '🇱🇷', sierra_leone: '🇸🇱', suriname: '🇸🇷',
  burundi: '🇧🇮', east_timor: '🇹🇱', djibouti: '🇩🇯', belize: '🇧🇿', eritrea: '🇪🇷',
  antigua: '🇦🇬', seychelles: '🇸🇨', tonga: '🇹🇴', dominica: '🇩🇲', vanuatu: '🇻🇺',
  samoa: '🇼🇸', solomon_islands: '🇸🇧', comoros: '🇰🇲', grenada: '🇬🇩', micronesia: '🇫🇲',
  kiribati: '🇰🇮', palau: '🇵🇼', marshall_islands: '🇲🇭', nauru: '🇳🇷', tuvalu: '🇹🇻',
  monaco: '🇲🇨', liechtenstein: '🇱🇮', san_marino: '🇸🇲', vatican: '🇻🇦', andorra: '🇦🇩'
};

// allNationsからGDP付き国家データベースを生成
export const FULL_NATION_DATABASE: Nation[] = allNations.map(nation => {
  const gdpValue = (nationsGDP as any)[nation.id] || 0.1; // GDPがない場合は0.1をデフォルト
  return {
    id: nation.id,
    name: nation.name,
    gdp: gdpValue,
    flag: flagEmojis[nation.id] || nation.flag,
    colors: nation.colors,
    tier: nation.tier,
    cost: nation.cost,
    damage: nation.damage,
    range: nation.range
  };
});

// GDPでソート（降順）
export const NATIONS_BY_GDP = [...FULL_NATION_DATABASE].sort((a, b) => b.gdp - a.gdp);

// ティア別に分類
export const NATIONS_BY_TIER = {
  1: FULL_NATION_DATABASE.filter(n => n.tier === 1),
  2: FULL_NATION_DATABASE.filter(n => n.tier === 2),
  3: FULL_NATION_DATABASE.filter(n => n.tier === 3),
  4: FULL_NATION_DATABASE.filter(n => n.tier === 4),
  5: FULL_NATION_DATABASE.filter(n => n.tier === 5),
  6: FULL_NATION_DATABASE.filter(n => n.tier === 6)
};

// 簡易アクセス用の辞書
export const NATION_DICT = FULL_NATION_DATABASE.reduce((acc, nation) => {
  acc[nation.id] = nation;
  return acc;
}, {} as Record<string, Nation>);