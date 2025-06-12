import React, { useState } from 'react';

// Tidy First: シンプルなガチャシステム
const ALL_NATIONS = [
  { id: 'japan', name: '日本', gdp: 4200, flag: '🇯🇵' },
  { id: 'usa', name: 'アメリカ', gdp: 25000, flag: '🇺🇸' },
  { id: 'china', name: '中国', gdp: 17000, flag: '🇨🇳' },
  { id: 'germany', name: 'ドイツ', gdp: 4000, flag: '🇩🇪' },
  { id: 'uk', name: 'イギリス', gdp: 3100, flag: '🇬🇧' },
  { id: 'france', name: 'フランス', gdp: 2900, flag: '🇫🇷' },
  { id: 'india', name: 'インド', gdp: 3700, flag: '🇮🇳' },
  { id: 'italy', name: 'イタリア', gdp: 2100, flag: '🇮🇹' },
  { id: 'brazil', name: 'ブラジル', gdp: 2100, flag: '🇧🇷' },
  { id: 'canada', name: 'カナダ', gdp: 2100, flag: '🇨🇦' },
  { id: 'nauru', name: 'ナウル', gdp: 0.15, flag: '🏳️' },
  { id: 'tuvalu', name: 'ツバル', gdp: 0.06, flag: '🏳️' },
];

interface SimpleGachaProps {
  onNationPulled?: (nation: typeof ALL_NATIONS[0]) => void;
}

export const SimpleGacha: React.FC<SimpleGachaProps> = ({ onNationPulled }) => {
  const [ownedNations, setOwnedNations] = useState<string[]>([]);
  const [lastPulled, setLastPulled] = useState<typeof ALL_NATIONS[0] | null>(null);
  const [showResult, setShowResult] = useState(false);

  const pullGacha = () => {
    // 未所持の国からランダムに選択
    const availableNations = ALL_NATIONS.filter(n => !ownedNations.includes(n.id));
    
    if (availableNations.length === 0) {
      alert('全ての国を獲得済みです！');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableNations.length);
    const pulledNation = availableNations[randomIndex];

    setOwnedNations([...ownedNations, pulledNation.id]);
    setLastPulled(pulledNation);
    setShowResult(true);

    if (onNationPulled) {
      onNationPulled(pulledNation);
    }

    // 3秒後に結果を隠す
    setTimeout(() => setShowResult(false), 3000);
  };

  const getRarityColor = (gdp: number) => {
    if (gdp >= 10000) return 'text-yellow-400'; // Legendary
    if (gdp >= 1000) return 'text-purple-400';  // Epic
    if (gdp >= 100) return 'text-blue-400';     // Rare
    return 'text-gray-400';                      // Common
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">ガチャシステム（仮）</h2>
      
      {/* ガチャボタン */}
      <button
        onClick={pullGacha}
        className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 
                   hover:from-yellow-600 hover:to-orange-600 rounded-lg font-bold text-white 
                   transform hover:scale-105 transition-all"
      >
        🎰 ガチャを引く！
      </button>

      {/* 結果表示 */}
      {showResult && lastPulled && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg animate-pulse">
          <p className="text-center text-2xl mb-2">✨ NEW! ✨</p>
          <div className="text-center">
            <p className="text-4xl mb-2">{lastPulled.flag}</p>
            <p className={`text-xl font-bold ${getRarityColor(lastPulled.gdp)}`}>
              {lastPulled.name}
            </p>
            <p className="text-sm text-gray-400">GDP: ${lastPulled.gdp}B</p>
          </div>
        </div>
      )}

      {/* 所持国家一覧 */}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">
          獲得済み: {ownedNations.length} / {ALL_NATIONS.length}
        </p>
        <div className="flex flex-wrap gap-2">
          {ownedNations.map(nationId => {
            const nation = ALL_NATIONS.find(n => n.id === nationId);
            return nation ? (
              <span key={nationId} className="text-2xl" title={nation.name}>
                {nation.flag}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};