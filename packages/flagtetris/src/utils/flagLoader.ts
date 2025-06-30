import { FlagData } from '../types/game';
import { flagImageMap } from './flagImages';

export async function loadFlagData(): Promise<FlagData[]> {
  // For now, we'll use a subset of flags with their data
  // In production, this would load from the YAML file
  const flagData: FlagData[] = [
    { id: 'japan', name: { en: 'Japan', ja: '日本' }, emoji: '🇯🇵', capital: 'Tokyo', population: 125800000, gdp: 4940877780, continent: 'Asia' },
    { id: 'usa', name: { en: 'United States', ja: 'アメリカ合衆国' }, emoji: '🇺🇸', capital: 'Washington D.C.', population: 331900000, gdp: 25462700000, continent: 'North America' },
    { id: 'china', name: { en: 'China', ja: '中国' }, emoji: '🇨🇳', capital: 'Beijing', population: 1412000000, gdp: 17963171479, continent: 'Asia' },
    { id: 'brazil', name: { en: 'Brazil', ja: 'ブラジル' }, emoji: '🇧🇷', capital: 'Brasília', population: 215000000, gdp: 2126809205, continent: 'South America' },
    { id: 'germany', name: { en: 'Germany', ja: 'ドイツ' }, emoji: '🇩🇪', capital: 'Berlin', population: 83200000, gdp: 4072191736, continent: 'Europe' },
    { id: 'france', name: { en: 'France', ja: 'フランス' }, emoji: '🇫🇷', capital: 'Paris', population: 67750000, gdp: 2779090011, continent: 'Europe' },
    { id: 'uk', name: { en: 'United Kingdom', ja: 'イギリス' }, emoji: '🇬🇧', capital: 'London', population: 68500000, gdp: 3070667732, continent: 'Europe' },
    { id: 'italy', name: { en: 'Italy', ja: 'イタリア' }, emoji: '🇮🇹', capital: 'Rome', population: 58900000, gdp: 2010431598, continent: 'Europe' },
    { id: 'canada', name: { en: 'Canada', ja: 'カナダ' }, emoji: '🇨🇦', capital: 'Ottawa', population: 38200000, gdp: 1988336332, continent: 'North America' },
    { id: 'south_korea', name: { en: 'South Korea', ja: '韓国' }, emoji: '🇰🇷', capital: 'Seoul', population: 51700000, gdp: 1810955871, continent: 'Asia' },
    { id: 'spain', name: { en: 'Spain', ja: 'スペイン' }, emoji: '🇪🇸', capital: 'Madrid', population: 47400000, gdp: 1397509272, continent: 'Europe' },
    { id: 'australia', name: { en: 'Australia', ja: 'オーストラリア' }, emoji: '🇦🇺', capital: 'Canberra', population: 25700000, gdp: 1552667363, continent: 'Oceania' },
    { id: 'mexico', name: { en: 'Mexico', ja: 'メキシコ' }, emoji: '🇲🇽', capital: 'Mexico City', population: 128900000, gdp: 1293038432, continent: 'North America' },
    { id: 'india', name: { en: 'India', ja: 'インド' }, emoji: '🇮🇳', capital: 'New Delhi', population: 1408000000, gdp: 3732224152, continent: 'Asia' },
    { id: 'russia', name: { en: 'Russia', ja: 'ロシア' }, emoji: '🇷🇺', capital: 'Moscow', population: 143400000, gdp: 2240422438, continent: 'Europe' },
    { id: 'netherlands', name: { en: 'Netherlands', ja: 'オランダ' }, emoji: '🇳🇱', capital: 'Amsterdam', population: 17500000, gdp: 991114635, continent: 'Europe' },
    { id: 'switzerland', name: { en: 'Switzerland', ja: 'スイス' }, emoji: '🇨🇭', capital: 'Bern', population: 8700000, gdp: 807706035, continent: 'Europe' },
    { id: 'sweden', name: { en: 'Sweden', ja: 'スウェーデン' }, emoji: '🇸🇪', capital: 'Stockholm', population: 10400000, gdp: 635663801, continent: 'Europe' },
    { id: 'belgium', name: { en: 'Belgium', ja: 'ベルギー' }, emoji: '🇧🇪', capital: 'Brussels', population: 11600000, gdp: 578996125, continent: 'Europe' },
    { id: 'argentina', name: { en: 'Argentina', ja: 'アルゼンチン' }, emoji: '🇦🇷', capital: 'Buenos Aires', population: 45800000, gdp: 487227446, continent: 'South America' },
  ];

  return flagData;
}

export async function loadFlagImages(flagData: FlagData[]): Promise<Map<string, string>> {
  const flagImages = new Map<string, string>();
  
  for (const flag of flagData) {
    const imagePath = flagImageMap[flag.id];
    if (imagePath) {
      flagImages.set(flag.id, imagePath);
    }
  }
  
  return flagImages;
}