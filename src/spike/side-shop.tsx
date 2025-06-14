import React, { useState } from 'react';
import { NATION_DATABASE, GDPEnemySystem } from './gdp-enemy-system';
import { AbilityProcessor } from './nation-abilities';

interface SideShopProps {
  coins: number;
  lives: number;
  ownedNations: string[];
  powerupsPurchased: Record<string, number>;
  defeatedNations: Record<string, typeof NATION_DATABASE[0]>;
  onPurchase: (itemId: string, cost: number) => void;
  onLivesPurchase: () => void;
  onNationPurchase: (nationId: string, cost: number) => void;
  onShowNationFact?: (nationId: string, nationName: string, flag: string) => void;
}

export const SideShop: React.FC<SideShopProps> = ({
  coins,
  lives,
  ownedNations,
  powerupsPurchased,
  defeatedNations,
  onPurchase,
  onLivesPurchase,
  onNationPurchase,
  onShowNationFact
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [nationSkipCount, setNationSkipCount] = useState(0);
  const [defeatedSkipCount, setDefeatedSkipCount] = useState(0);
  const [selectedDefeatedNation, setSelectedDefeatedNation] = useState<typeof NATION_DATABASE[0] | null>(null);
  const [hoveredNation, setHoveredNation] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getLifePrice = () => 300 + (lives - 1) * 200;

  const getNationPrice = (gdp: number) => {
    const basePrice = 100;
    const gdpFactor = Math.log10(gdp + 1) * 200;
    return Math.floor(basePrice + gdpFactor);
  };

  const powerups = [
    { id: 'damage_boost', name: 'ダメージ+10%', icon: '⚔️', cost: 300, max: 10 },
    { id: 'range_boost', name: '射程+10%', icon: '🎯', cost: 250, max: 10 },
    { id: 'speed_boost', name: '速度+10%', icon: '⚡', cost: 400, max: 10 },
    { id: 'coin_multiplier', name: 'コイン+20%', icon: '💰', cost: 500, max: 10 }
  ];

  const allAvailableNations = NATION_DATABASE.filter(n => !ownedNations.includes(n.id))
    .sort((a, b) => getNationPrice(a.gdp) - getNationPrice(b.gdp));
  
  const availableNations = allAvailableNations.slice(nationSkipCount * 12, (nationSkipCount + 1) * 12);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-l-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col gap-2 p-2">
        {/* パワーアップセクション */}
        <div className="bg-gray-800 rounded-lg">
          <button
            onClick={() => toggleSection('powerups')}
            className="w-full px-3 py-2 text-left font-bold text-yellow-400 hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>🆙 <ruby>強化<rt>きょうか</rt></ruby></span>
            <span className="text-xs">{expandedSection === 'powerups' ? '▼' : '◀'}</span>
          </button>
          {expandedSection === 'powerups' && (
            <div className="p-2 space-y-1">
              {powerups.map(item => {
                const purchased = powerupsPurchased[item.id] || 0;
                const canPurchase = coins >= item.cost && purchased < item.max;
                return (
                  <button
                    key={item.id}
                    onClick={() => canPurchase && onPurchase(item.id, item.cost)}
                    disabled={!canPurchase}
                    className={`w-full px-2 py-1 rounded text-xs flex items-center justify-between ${
                      canPurchase 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{item.icon} {item.name}</span>
                    <span>💰{item.cost} ({purchased}/{item.max})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 残機セクション */}
        <div className="bg-gray-800 rounded-lg">
          <button
            onClick={() => toggleSection('lives')}
            className="w-full px-3 py-2 text-left font-bold text-red-400 hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>❤️ <ruby>残機<rt>ざんき</rt></ruby></span>
            <span className="text-xs">{expandedSection === 'lives' ? '▼' : '◀'}</span>
          </button>
          {expandedSection === 'lives' && (
            <div className="p-2">
              <button
                onClick={onLivesPurchase}
                disabled={coins < getLifePrice()}
                className={`w-full px-2 py-1 rounded text-xs ${
                  coins >= getLifePrice()
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                ❤️ <ruby>追加<rt>ついか</rt></ruby><ruby>残機<rt>ざんき</rt></ruby> 💰{getLifePrice()}
              </button>
            </div>
          )}
        </div>

        {/* 国家購入セクション */}
        <div className="bg-gray-800 rounded-lg">
          <button
            onClick={() => toggleSection('nations')}
            className="w-full px-3 py-2 text-left font-bold text-green-400 hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>🏳️ <ruby>国家<rt>こっか</rt></ruby></span>
            <span className="text-xs">{expandedSection === 'nations' ? '▼' : '◀'}</span>
          </button>
          {expandedSection === 'nations' && (
            <div className="p-2 space-y-1">
              <div className="flex justify-between mb-2 min-w-full">
                <button
                  onClick={() => setNationSkipCount(Math.max(0, nationSkipCount - 1))}
                  disabled={nationSkipCount === 0}
                  className={`px-2 py-1 text-xs rounded w-16 ${
                    nationSkipCount === 0 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  ◀ <ruby>前<rt>まえ</rt></ruby>へ
                </button>
                <span className="text-xs text-gray-400 text-center flex-1">
                  {nationSkipCount * 12 + 1}-{Math.min((nationSkipCount + 1) * 12, allAvailableNations.length)} / {allAvailableNations.length}
                </span>
                <button
                  onClick={() => setNationSkipCount(nationSkipCount + 1)}
                  disabled={(nationSkipCount + 1) * 12 >= allAvailableNations.length}
                  className={`px-2 py-1 text-xs rounded w-16 ${
                    (nationSkipCount + 1) * 12 >= allAvailableNations.length
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <ruby>次<rt>つぎ</rt></ruby>へ ▶
                </button>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1">
                {availableNations.map(nation => {
                  const price = getNationPrice(nation.gdp);
                  const canPurchase = coins >= price;
                  const rarity = GDPEnemySystem.getRarity(nation.gdp);
                  return (
                    <button
                      key={nation.id}
                      onClick={() => canPurchase && onNationPurchase(nation.id, price)}
                      disabled={!canPurchase}
                      onMouseEnter={(e) => {
                        setHoveredNation(nation.id);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPosition({ x: rect.left - 200, y: rect.top });
                      }}
                      onMouseLeave={() => setHoveredNation(null)}
                      className={`w-full px-2 py-1 rounded text-xs flex items-center justify-between ${
                        canPurchase
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="truncate max-w-[120px]">{nation.flag} {nation.name}</span>
                      <span className="flex-shrink-0">
                        <span className="text-yellow-300">★{rarity.stars}</span> 💰{price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 撃破履歴セクション */}
        <div className="bg-gray-800 rounded-lg">
          <button
            onClick={() => toggleSection('defeated')}
            className="w-full px-3 py-2 text-left font-bold text-orange-400 hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>🏆 <ruby>撃破<rt>げきは</rt></ruby></span>
            <span className="text-xs">{expandedSection === 'defeated' ? '▼' : '◀'}</span>
          </button>
          {expandedSection === 'defeated' && (
            <div className="p-2 space-y-1">
              {Object.keys(defeatedNations).length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">
                  まだ<ruby>国家<rt>こっか</rt></ruby>を<ruby>撃破<rt>げきは</rt></ruby>していません
                </p>
              ) : (
                <>
                  <div className="flex justify-between mb-2 min-w-full">
                    <button
                      onClick={() => setDefeatedSkipCount(Math.max(0, defeatedSkipCount - 1))}
                      disabled={defeatedSkipCount === 0}
                      className={`px-2 py-1 text-xs rounded w-16 ${
                        defeatedSkipCount === 0 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      ◀ <ruby>前<rt>まえ</rt></ruby>へ
                    </button>
                    <span className="text-xs text-gray-400 text-center flex-1">
                      {defeatedSkipCount * 12 + 1}-{Math.min((defeatedSkipCount + 1) * 12, Object.keys(defeatedNations).length)} / {Object.keys(defeatedNations).length}
                    </span>
                    <button
                      onClick={() => setDefeatedSkipCount(defeatedSkipCount + 1)}
                      disabled={(defeatedSkipCount + 1) * 12 >= Object.keys(defeatedNations).length}
                      className={`px-2 py-1 text-xs rounded w-16 ${
                        (defeatedSkipCount + 1) * 12 >= Object.keys(defeatedNations).length
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      <ruby>次<rt>つぎ</rt></ruby>へ ▶
                    </button>
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {Object.values(defeatedNations)
                      .sort((a, b) => b.gdp - a.gdp)
                      .slice(defeatedSkipCount * 12, (defeatedSkipCount + 1) * 12)
                      .map(nation => {
                        const rarity = GDPEnemySystem.getRarity(nation.gdp);
                        return (
                          <button
                            key={nation.id}
                            onClick={() => {
                              if (onShowNationFact) {
                                onShowNationFact(nation.id, nation.name, nation.flag);
                              }
                              setSelectedDefeatedNation(nation);
                            }}
                            className="w-full px-2 py-1 rounded text-xs flex items-center justify-between bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer"
                          >
                            <span className="truncate max-w-[120px]">{nation.flag} {nation.name}</span>
                            <span className="flex-shrink-0">
                              <span className="text-yellow-300">★{rarity.stars}</span> GDP:{nation.gdp.toLocaleString()}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Custom Tooltip */}
      {hoveredNation && (
        <div 
          className="fixed z-50 bg-black bg-opacity-90 text-white p-2 rounded shadow-lg text-xs pointer-events-none"
          style={{ 
            left: `${tooltipPosition.x}px`, 
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-50%)'
          }}
        >
          {AbilityProcessor.getAbilityDescription(hoveredNation)}
        </div>
      )}

      {/* 撃破国家詳細モーダル */}
    {selectedDefeatedNation && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedDefeatedNation(null)}>
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-xl backdrop-blur-sm shadow-2xl animate-bounce" onClick={(e) => e.stopPropagation()}>
          <div className="text-2xl font-bold mb-2">🎉 <ruby>撃破<rt>げきは</rt></ruby><ruby>国家<rt>こっか</rt></ruby><ruby>情報<rt>じょうほう</rt></ruby>！</div>
          <div className="text-3xl font-bold text-center">
            {selectedDefeatedNation.flag} {selectedDefeatedNation.name}
          </div>
          <div className="text-sm mt-2 text-center opacity-90">
            {AbilityProcessor.getAbilityDescription(selectedDefeatedNation.id)}
          </div>
          <div className="text-sm mt-2 text-center">
            <span className="text-yellow-300">★{GDPEnemySystem.getRarity(selectedDefeatedNation.gdp).stars}</span>
            <span className="ml-2">GDP: ${selectedDefeatedNation.gdp.toLocaleString()}</span>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => setSelectedDefeatedNation(null)}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-bold transition-all"
            >
              <ruby>閉<rt>と</rt></ruby>じる
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};