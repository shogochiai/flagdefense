// 改善されたショップシステム

import React, { useState } from 'react';
import { NATION_DATABASE, GDPEnemySystem } from './gdp-enemy-system';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'powerup' | 'lives' | 'special' | 'nation' | 'gacha';
  icon: string;
  effect?: () => void;
  maxPurchases?: number;
  purchased?: number;
  nationId?: string;
}

interface ShopSystemProps {
  coins: number;
  lives: number;
  ownedNations: string[];
  onPurchase: (item: ShopItem, newCoins: number) => void;
  onLivesPurchase: (newLives: number) => void;
  onNationPurchase: (nationId: string) => void;
  onGachaPurchase: () => void;
  onClose: () => void;
}

export const ShopSystemV2: React.FC<ShopSystemProps> = ({ 
  coins, 
  lives,
  ownedNations,
  onPurchase, 
  onLivesPurchase,
  onNationPurchase,
  onGachaPurchase,
  onClose 
}) => {
  console.log('ShopSystemV2 component is rendering');
  const [purchasedItems, setPurchasedItems] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'powerup' | 'lives' | 'nations' | 'special'>('powerup');

  // 残機の価格計算（現在の残機数に応じて上昇）
  const getLifePrice = () => {
    const basePrice = 300;
    const increment = 200;
    return basePrice + (lives - 1) * increment; // 3機なら300円、4機なら500円、5機なら700円
  };

  // 国家の購入価格計算（GDP比例）
  const getNationPrice = (gdp: number) => {
    const basePrice = 100;
    const gdpFactor = Math.log10(gdp + 1) * 200;
    return Math.floor(basePrice + gdpFactor);
  };

  const shopItems: ShopItem[] = [
    // 残機（動的価格）
    {
      id: 'extra_life',
      name: '追加残機',
      description: '残機を1つ追加',
      cost: getLifePrice(),
      type: 'lives',
      icon: '❤️'
    },
    
    // パワーアップ
    {
      id: 'damage_boost',
      name: 'ダメージブースト',
      description: '全タワーのダメージ+10%（永続）',
      cost: 300,
      type: 'powerup',
      icon: '⚔️',
      maxPurchases: 10
    },
    {
      id: 'range_boost',
      name: '射程ブースト',
      description: '全タワーの射程+10%（永続）',
      cost: 250,
      type: 'powerup',
      icon: '🎯',
      maxPurchases: 10
    },
    {
      id: 'speed_boost',
      name: '攻撃速度ブースト',
      description: '全タワーの攻撃速度+10%（永続）',
      cost: 400,
      type: 'powerup',
      icon: '⚡',
      maxPurchases: 10
    },
    {
      id: 'coin_multiplier',
      name: 'コイン倍率アップ',
      description: 'コイン獲得量+20%（永続）',
      cost: 600,
      type: 'powerup',
      icon: '💰',
      maxPurchases: 5
    },
    
    // 特殊アイテム
    {
      id: 'slow_field',
      name: 'スローフィールド',
      description: '次のWaveで敵の速度-30%',
      cost: 200,
      type: 'special',
      icon: '🕸️',
      maxPurchases: 1
    },
    {
      id: 'double_coins',
      name: 'ダブルコイン',
      description: '次のWaveでコイン獲得2倍',
      cost: 350,
      type: 'special',
      icon: '🪙',
      maxPurchases: 1
    },
    {
      id: 'shield',
      name: 'シールド',
      description: '次のWaveで最初の3体の敵を無視',
      cost: 150,
      type: 'special',
      icon: '🛡️',
      maxPurchases: 1
    },
    {
      id: 'gacha_ticket',
      name: 'ガチャチケット',
      description: 'Wave完了時に追加でガチャを引ける',
      cost: 800,
      type: 'special',
      icon: '🎫',
      maxPurchases: 3
    }
  ];

  // 国家アイテムを動的に生成
  const nationItems: ShopItem[] = NATION_DATABASE
    .filter(nation => !ownedNations.includes(nation.id))
    .map(nation => ({
      id: `nation_${nation.id}`,
      name: `${nation.flag} ${nation.name}`,
      description: `GDP: ${nation.gdp.toLocaleString()}億ドル`,
      cost: getNationPrice(nation.gdp),
      type: 'nation' as const,
      icon: nation.flag,
      nationId: nation.id
    }))
    .sort((a, b) => a.cost - b.cost); // 安い順にソート

  const handlePurchase = (item: ShopItem) => {
    if (coins < item.cost) return;
    
    const purchased = purchasedItems[item.id] || 0;
    if (item.maxPurchases && purchased >= item.maxPurchases) return;

    const newCoins = coins - item.cost;
    
    // 特殊処理
    if (item.type === 'lives') {
      onLivesPurchase(lives + 1);
    } else if (item.type === 'nation' && item.nationId) {
      onNationPurchase(item.nationId);
    } else if (item.type === 'gacha') {
      onGachaPurchase();
    }
    
    setPurchasedItems({
      ...purchasedItems,
      [item.id]: purchased + 1
    });
    
    onPurchase(item, newCoins);
  };

  const tabs = [
    { id: 'powerup', label: 'パワーアップ', icon: '⚡' },
    { id: 'lives', label: '残機', icon: '❤️' },
    { id: 'nations', label: '国家購入', icon: '🌍' },
    { id: 'special', label: '特殊アイテム', icon: '✨' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto" role="dialog">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl w-full max-w-5xl max-h-[85vh] my-8 shadow-2xl border border-gray-700 flex flex-col">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 flex-shrink-0">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            ショップ
          </h2>
          <div className="flex gap-4">
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-yellow-600 shadow-lg">
              <span className="text-lg">💰 {coins.toLocaleString()}</span>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-red-600 shadow-lg">
              <span className="text-lg">❤️ {lives}</span>
            </div>
          </div>
        </div>

        {/* タブ */}
        <div className="flex gap-2 mb-4 overflow-x-auto flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="text-xl mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2">
          {/* パワーアップタブ */}
          {activeTab === 'powerup' && (
            <div className="grid grid-cols-2 gap-4">
              {shopItems.filter(item => item.type === 'powerup').map(item => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  purchased={purchasedItems[item.id] || 0}
                  canAfford={coins >= item.cost}
                  onPurchase={() => handlePurchase(item)}
                />
              ))}
            </div>
          )}

          {/* 残機タブ */}
          {activeTab === 'lives' && (
            <div className="grid grid-cols-2 gap-4">
              {shopItems.filter(item => item.type === 'lives').map(item => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  purchased={purchasedItems[item.id] || 0}
                  canAfford={coins >= item.cost}
                  onPurchase={() => handlePurchase(item)}
                  highlight={item.type === 'gacha'}
                />
              ))}
            </div>
          )}

          {/* 国家購入タブ */}
          {activeTab === 'nations' && (
            <div className="grid grid-cols-3 gap-4">
              {nationItems.length > 0 ? (
                nationItems.map(item => {
                  const nation = NATION_DATABASE.find(n => n.id === item.nationId);
                  const rarity = nation ? GDPEnemySystem.getRarity(nation.gdp) : null;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => coins >= item.cost && handlePurchase(item)}
                      className={`bg-gray-800 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        coins >= item.cost
                          ? `border-${rarity?.color || 'gray'}-600 hover:border-${rarity?.color || 'gray'}-400 hover:shadow-lg`
                          : 'border-gray-700 opacity-50 cursor-not-allowed'
                      }`}
                      style={{
                        borderColor: rarity?.color,
                        boxShadow: coins >= item.cost ? `0 0 20px ${rarity?.color}40` : ''
                      }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{item.icon}</div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <div className="text-sm text-gray-400 mb-2">
                          {'★'.repeat(rarity?.stars || 1)}
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{item.description}</p>
                        <div className="text-yellow-400 font-bold">
                          💰 {item.cost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-8">
                  全ての国家を所有しています！
                </div>
              )}
            </div>
          )}

          {/* 特殊アイテムタブ */}
          {activeTab === 'special' && (
            <div className="grid grid-cols-2 gap-4">
              {shopItems.filter(item => item.type === 'special').map(item => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  purchased={purchasedItems[item.id] || 0}
                  canAfford={coins >= item.cost}
                  onPurchase={() => handlePurchase(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl text-xl font-bold shadow-lg transition-all flex-shrink-0"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

// アイテムカードコンポーネント
const ShopItemCard: React.FC<{
  item: ShopItem;
  purchased: number;
  canAfford: boolean;
  onPurchase: () => void;
  highlight?: boolean;
}> = ({ item, purchased, canAfford, onPurchase, highlight }) => {
  const isMaxed = item.maxPurchases && purchased >= item.maxPurchases;
  
  return (
    <div
      onClick={() => !isMaxed && canAfford && onPurchase()}
      className={`p-6 rounded-xl border-2 transition-all ${
        highlight
          ? 'bg-gradient-to-br from-purple-900 to-purple-800 border-purple-600 hover:border-purple-400'
          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
      } ${
        isMaxed ? 'opacity-50' : 
        canAfford ? 'cursor-pointer hover:shadow-xl' : 
        'opacity-70 cursor-not-allowed'
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{item.icon}</span>
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-1">{item.name}</h4>
          <p className="text-sm text-gray-400 mb-3">{item.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-yellow-400 font-bold text-lg">
              💰 {item.cost.toLocaleString()}
            </span>
            {item.maxPurchases && (
              <span className="text-sm text-gray-500">
                購入済み: {purchased}/{item.maxPurchases}
              </span>
            )}
          </div>
          {isMaxed && (
            <div className="text-center text-red-500 mt-2 font-semibold">最大購入済み</div>
          )}
        </div>
      </div>
    </div>
  );
};