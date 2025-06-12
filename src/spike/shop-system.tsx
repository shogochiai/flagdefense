// ショップシステム

import React, { useState } from 'react';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'powerup' | 'lives' | 'special';
  icon: string;
  effect?: () => void;
  maxPurchases?: number;
  purchased?: number;
}

interface ShopSystemProps {
  coins: number;
  lives: number;
  onPurchase: (item: ShopItem, newCoins: number) => void;
  onLivesPurchase: (newLives: number) => void;
  onClose: () => void;
}

export const ShopSystem: React.FC<ShopSystemProps> = ({ 
  coins, 
  lives,
  onPurchase, 
  onLivesPurchase,
  onClose 
}) => {
  const [purchasedItems, setPurchasedItems] = useState<Record<string, number>>({});

  const shopItems: ShopItem[] = [
    // 残機
    {
      id: 'extra_life',
      name: '追加残機',
      description: '残機を1つ追加',
      cost: 500,
      type: 'lives',
      icon: '❤️',
      maxPurchases: 5
    },
    {
      id: 'full_heal',
      name: '完全回復',
      description: '残機を最大まで回復（3機）',
      cost: 1000,
      type: 'lives',
      icon: '💖',
      maxPurchases: 1
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
      description: 'ガチャを1回追加で引ける',
      cost: 800,
      type: 'special',
      icon: '🎫',
      maxPurchases: 3
    }
  ];

  const handlePurchase = (item: ShopItem) => {
    if (coins < item.cost) return;
    
    const purchased = purchasedItems[item.id] || 0;
    if (item.maxPurchases && purchased >= item.maxPurchases) return;

    const newCoins = coins - item.cost;
    
    // 残機の特殊処理
    if (item.type === 'lives') {
      if (item.id === 'extra_life') {
        onLivesPurchase(lives + 1);
      } else if (item.id === 'full_heal') {
        onLivesPurchase(3);
      }
    }
    
    setPurchasedItems({
      ...purchasedItems,
      [item.id]: purchased + 1
    });
    
    onPurchase(item, newCoins);
  };

  const getCategoryItems = (type: string) => 
    shopItems.filter(item => item.type === type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">ショップ</h2>
          <div className="flex gap-4">
            <div className="bg-gray-800 px-4 py-2 rounded">
              💰 {coins} コイン
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded">
              ❤️ {lives} 残機
            </div>
          </div>
        </div>

        {/* 残機 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-red-400">残機</h3>
          <div className="grid grid-cols-2 gap-4">
            {getCategoryItems('lives').map(item => {
              const purchased = purchasedItems[item.id] || 0;
              const isMaxed = item.maxPurchases && purchased >= item.maxPurchases;
              const canAfford = coins >= item.cost;
              
              return (
                <div
                  key={item.id}
                  className={`bg-gray-800 p-4 rounded-lg border-2 ${
                    isMaxed ? 'border-gray-700 opacity-50' : 
                    canAfford ? 'border-gray-600 hover:border-blue-500 cursor-pointer' : 
                    'border-gray-700 opacity-70'
                  }`}
                  onClick={() => !isMaxed && canAfford && handlePurchase(item)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="font-semibold">{item.name}</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400">💰 {item.cost}</span>
                    {item.maxPurchases && (
                      <span className="text-sm text-gray-500">
                        {purchased}/{item.maxPurchases}
                      </span>
                    )}
                  </div>
                  {isMaxed && (
                    <div className="text-center text-red-500 mt-2">売り切れ</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* パワーアップ */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-400">パワーアップ</h3>
          <div className="grid grid-cols-2 gap-4">
            {getCategoryItems('powerup').map(item => {
              const purchased = purchasedItems[item.id] || 0;
              const isMaxed = item.maxPurchases && purchased >= item.maxPurchases;
              const canAfford = coins >= item.cost;
              
              return (
                <div
                  key={item.id}
                  className={`bg-gray-800 p-4 rounded-lg border-2 ${
                    isMaxed ? 'border-gray-700 opacity-50' : 
                    canAfford ? 'border-gray-600 hover:border-blue-500 cursor-pointer' : 
                    'border-gray-700 opacity-70'
                  }`}
                  onClick={() => !isMaxed && canAfford && handlePurchase(item)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="font-semibold">{item.name}</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400">💰 {item.cost}</span>
                    {item.maxPurchases && (
                      <span className="text-sm text-gray-500">
                        購入済み: {purchased}/{item.maxPurchases}
                      </span>
                    )}
                  </div>
                  {isMaxed && (
                    <div className="text-center text-red-500 mt-2">最大購入済み</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 特殊アイテム */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-purple-400">特殊アイテム</h3>
          <div className="grid grid-cols-2 gap-4">
            {getCategoryItems('special').map(item => {
              const purchased = purchasedItems[item.id] || 0;
              const isMaxed = item.maxPurchases && purchased >= item.maxPurchases;
              const canAfford = coins >= item.cost;
              
              return (
                <div
                  key={item.id}
                  className={`bg-gray-800 p-4 rounded-lg border-2 ${
                    isMaxed ? 'border-gray-700 opacity-50' : 
                    canAfford ? 'border-gray-600 hover:border-purple-500 cursor-pointer' : 
                    'border-gray-700 opacity-70'
                  }`}
                  onClick={() => !isMaxed && canAfford && handlePurchase(item)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="font-semibold">{item.name}</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400">💰 {item.cost}</span>
                    {item.maxPurchases && (
                      <span className="text-sm text-gray-500">
                        {purchased > 0 ? `購入済み (${purchased})` : '未購入'}
                      </span>
                    )}
                  </div>
                  {isMaxed && (
                    <div className="text-center text-red-500 mt-2">売り切れ</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-lg font-semibold"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};