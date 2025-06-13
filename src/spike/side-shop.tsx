import React, { useState } from 'react';
import { NATION_DATABASE, GDPEnemySystem } from './gdp-enemy-system';
import { AbilityProcessor } from './nation-abilities';

interface SideShopProps {
  coins: number;
  lives: number;
  ownedNations: string[];
  powerupsPurchased: Record<string, number>;
  onPurchase: (itemId: string, cost: number) => void;
  onLivesPurchase: () => void;
  onNationPurchase: (nationId: string, cost: number) => void;
}

export const SideShop: React.FC<SideShopProps> = ({
  coins,
  lives,
  ownedNations,
  powerupsPurchased,
  onPurchase,
  onLivesPurchase,
  onNationPurchase
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [nationSkipCount, setNationSkipCount] = useState(0);

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
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-l-xl shadow-2xl overflow-hidden">
      <div className="flex flex-col gap-2 p-2">
        {/* パワーアップセクション */}
        <div className="bg-gray-800 rounded-lg">
          <button
            onClick={() => toggleSection('powerups')}
            className="w-full px-3 py-2 text-left font-bold text-yellow-400 hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>🆙 強化</span>
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
            <span>❤️ 残機</span>
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
                ❤️ 追加残機 💰{getLifePrice()}
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
            <span>🏳️ 国家</span>
            <span className="text-xs">{expandedSection === 'nations' ? '▼' : '◀'}</span>
          </button>
          {expandedSection === 'nations' && (
            <div className="p-2 space-y-1">
              <div className="flex justify-between mb-2">
                <button
                  onClick={() => setNationSkipCount(Math.max(0, nationSkipCount - 1))}
                  disabled={nationSkipCount === 0}
                  className={`px-2 py-1 text-xs rounded ${
                    nationSkipCount === 0 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  ◀ 前へ
                </button>
                <span className="text-xs text-gray-400">
                  {nationSkipCount * 12 + 1}-{Math.min((nationSkipCount + 1) * 12, allAvailableNations.length)} / {allAvailableNations.length}
                </span>
                <button
                  onClick={() => setNationSkipCount(nationSkipCount + 1)}
                  disabled={(nationSkipCount + 1) * 12 >= allAvailableNations.length}
                  className={`px-2 py-1 text-xs rounded ${
                    (nationSkipCount + 1) * 12 >= allAvailableNations.length
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  次へ ▶
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
                      className={`w-full px-2 py-1 rounded text-xs flex items-center justify-between ${
                        canPurchase
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                      title={AbilityProcessor.getAbilityDescription(nation.id)}
                    >
                      <span>{nation.flag} {nation.name}</span>
                      <span>
                        <span className="text-yellow-300">★{rarity.stars}</span> 💰{price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};