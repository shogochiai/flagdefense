import React, { useState, useEffect } from 'react';
import { Star, Package, Sparkles, Globe, Zap, Shield, Coins } from 'lucide-react';

// ガチャ結果表示コンポーネント
export const GachaResultModal: React.FC<{
  nation: any;
  gdp: number;
  onClose: () => void;
}> = ({ nation, gdp, onClose }) => {
  const [showEffect, setShowEffect] = useState(true);
  const rarity = getRarityInfo(gdp);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowEffect(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className={`relative bg-gray-900 p-8 rounded-lg border-4 ${rarity.borderColor} 
        transform transition-all duration-500 ${showEffect ? 'scale-110' : 'scale-100'}`}>
        
        {/* レアリティエフェクト */}
        {showEffect && (
          <div className="absolute inset-0 pointer-events-none">
            {rarity.tier === 'legendary' && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg" />
            )}
            {rarity.tier === 'epic' && (
              <div className="absolute inset-0 animate-pulse bg-purple-500/20 rounded-lg" />
            )}
          </div>
        )}
        
        {/* NEW! バッジ */}
        <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
          NEW!
        </div>
        
        {/* レアリティ表示 */}
        <div className="text-center mb-4">
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(rarity.stars)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className={`text-lg font-bold ${rarity.textColor}`}>
            {rarity.tierName}
          </div>
        </div>
        
        {/* 国旗表示 */}
        <div className="relative mb-6">
          <div className="w-48 h-32 mx-auto bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
            <img 
              src={`/img/${nation.id}.png`} 
              alt={nation.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // フォールバック表示
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-full h-full flex items-center justify-center text-6xl">
              {nation.flag}
            </div>
          </div>
          
          {/* 国名 */}
          <h2 className="text-2xl font-bold text-center mt-4">{nation.name}</h2>
        </div>
        
        {/* ステータス表示 */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">GDP</span>
            <span className="font-bold">${formatGDP(gdp)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">攻撃力</span>
            <span className="font-bold">{Math.floor(Math.sqrt(gdp) * 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">射程</span>
            <span className="font-bold">{100 + Math.floor(Math.log10(gdp + 1) * 20)}</span>
          </div>
          
          {/* 特殊能力 */}
          {nation.specialAbility && (
            <div className="mt-2 p-2 bg-gray-800 rounded">
              <div className="text-sm text-yellow-400">特殊能力</div>
              <div className="text-xs">{nation.specialAbility.description}</div>
            </div>
          )}
        </div>
        
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
        >
          戦場へ配置
        </button>
      </div>
    </div>
  );
};

// 国旗インベントリ表示
export const FlagInventory: React.FC<{
  ownedNations: string[];
  selectedNation: string | null;
  onSelect: (nationId: string) => void;
}> = ({ ownedNations, selectedNation, onSelect }) => {
  const [filter, setFilter] = useState<'all' | 'legendary' | 'epic' | 'rare' | 'common'>('all');
  
  return (
    <div className="bg-black/50 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
        <Package className="w-5 h-5" />
        保有国旗 ({ownedNations.length}/250)
      </h3>
      
      {/* フィルター */}
      <div className="flex gap-2 mb-3 text-sm">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          全て
        </button>
        <button
          onClick={() => setFilter('legendary')}
          className={`px-3 py-1 rounded ${filter === 'legendary' ? 'bg-yellow-600' : 'bg-gray-700'}`}
        >
          ★5
        </button>
        <button
          onClick={() => setFilter('epic')}
          className={`px-3 py-1 rounded ${filter === 'epic' ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          ★4
        </button>
      </div>
      
      {/* 国旗グリッド */}
      <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto">
        {ownedNations.map(nationId => (
          <button
            key={nationId}
            onClick={() => onSelect(nationId)}
            className={`relative p-2 rounded border-2 transition-all ${
              selectedNation === nationId
                ? 'border-yellow-400 bg-yellow-900/30 scale-110'
                : 'border-gray-600 hover:border-gray-400'
            }`}
          >
            <img
              src={`/img/${nationId}.png`}
              alt={nationId}
              className="w-12 h-8 object-cover"
            />
            {/* レベル表示 */}
            <div className="absolute -top-1 -right-1 bg-blue-600 text-xs px-1 rounded">
              Lv1
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// アップグレードショップ
export const UpgradeShop: React.FC<{
  coins: number;
  selectedTower: any;
  onPurchase: (upgradeId: string) => void;
}> = ({ coins, selectedTower, onPurchase }) => {
  const upgrades = [
    {
      id: 'damage_boost',
      name: '攻撃力強化',
      icon: <Zap className="w-4 h-4" />,
      cost: 100,
      effect: '+20% ダメージ',
      color: 'text-red-400'
    },
    {
      id: 'range_extend',
      name: '射程延長',
      icon: <Globe className="w-4 h-4" />,
      cost: 150,
      effect: '+15% 射程',
      color: 'text-blue-400'
    },
    {
      id: 'attack_speed',
      name: '連射強化',
      icon: <Sparkles className="w-4 h-4" />,
      cost: 200,
      effect: '-10% 攻撃間隔',
      color: 'text-yellow-400'
    },
    {
      id: 'piercing',
      name: '貫通弾',
      icon: <Shield className="w-4 h-4" />,
      cost: 300,
      effect: '敵を貫通',
      color: 'text-purple-400'
    }
  ];
  
  return (
    <div className="bg-black/50 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        アップグレード
      </h3>
      
      {selectedTower ? (
        <div className="space-y-2">
          {upgrades.map(upgrade => (
            <button
              key={upgrade.id}
              onClick={() => onPurchase(upgrade.id)}
              disabled={coins < upgrade.cost}
              className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                coins >= upgrade.cost
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={upgrade.color}>{upgrade.icon}</div>
                <div className="text-left">
                  <div className="font-bold">{upgrade.name}</div>
                  <div className="text-xs text-gray-400">{upgrade.effect}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4" />
                <span>{upgrade.cost}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          国旗を選択してください
        </div>
      )}
    </div>
  );
};

// ヘルパー関数
const getRarityInfo = (gdp: number) => {
  if (gdp >= 10000) return {
    tier: 'legendary',
    tierName: 'LEGENDARY',
    stars: 5,
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-400'
  };
  if (gdp >= 1000) return {
    tier: 'epic',
    tierName: 'EPIC',
    stars: 4,
    borderColor: 'border-purple-400',
    textColor: 'text-purple-400'
  };
  if (gdp >= 100) return {
    tier: 'rare',
    tierName: 'RARE',
    stars: 3,
    borderColor: 'border-blue-400',
    textColor: 'text-blue-400'
  };
  if (gdp >= 10) return {
    tier: 'uncommon',
    tierName: 'UNCOMMON',
    stars: 2,
    borderColor: 'border-green-400',
    textColor: 'text-green-400'
  };
  return {
    tier: 'common',
    tierName: 'COMMON',
    stars: 1,
    borderColor: 'border-gray-400',
    textColor: 'text-gray-400'
  };
};

const formatGDP = (gdp: number) => {
  if (gdp >= 1000) return `${(gdp / 1000).toFixed(1)}T`;
  if (gdp >= 1) return `${gdp.toFixed(1)}B`;
  return `${(gdp * 1000).toFixed(0)}M`;
};