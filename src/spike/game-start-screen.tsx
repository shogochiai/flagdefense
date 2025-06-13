import React, { useState } from 'react';

export interface GameSettings {
  initialCoins: number;
  initialLives: number;
  towerLifespan: number;
  startingNation: string;
}

interface GameStartScreenProps {
  onStartGame: (settings: GameSettings) => void;
}

export const GameStartScreen: React.FC<GameStartScreenProps> = ({ onStartGame }) => {
  const [settings, setSettings] = useState<GameSettings>({
    initialCoins: 200,
    initialLives: 3,
    towerLifespan: 3,
    startingNation: 'nauru'
  });

  const handleStart = () => {
    onStartGame(settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full p-8">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
            Flag Defence
          </h1>
          <p className="text-xl text-gray-400">世界の国旗で基地を守れ！</p>
        </div>

        <div className="bg-black bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">ゲーム設定</h2>
          
          <div className="space-y-6">
            {/* 初期コイン */}
            <div>
              <label className="block text-lg mb-2">
                初期コイン: 💰 {settings.initialCoins}
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="50"
                value={settings.initialCoins}
                onChange={(e) => setSettings({ ...settings, initialCoins: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* 初期ライフ */}
            <div>
              <label className="block text-lg mb-2">
                初期ライフ: ❤️ {settings.initialLives}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.initialLives}
                onChange={(e) => setSettings({ ...settings, initialLives: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* タワー寿命 */}
            <div>
              <label className="block text-lg mb-2">
                タワー寿命: 🏰 {settings.towerLifespan} Wave
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.towerLifespan}
                onChange={(e) => setSettings({ ...settings, towerLifespan: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-sm text-gray-400 mt-1">
                配置したタワーが消えるまでのWave数
              </p>
            </div>

            {/* 開始国家 */}
            <div>
              <label className="block text-lg mb-2">
                開始国家: 🏳️
              </label>
              <select
                value={settings.startingNation}
                onChange={(e) => setSettings({ ...settings, startingNation: e.target.value })}
                className="w-full bg-gray-800 px-4 py-3 rounded-lg border border-gray-600 text-white"
              >
                <option value="nauru">🇳🇷 ナウル (最安)</option>
                <option value="tuvalu">🇹🇻 ツバル</option>
                <option value="sealand">⚓ シーランド公国</option>
                <option value="vatican">🇻🇦 バチカン</option>
                <option value="monaco">🇲🇨 モナコ</option>
                <option value="malta">🇲🇹 マルタ</option>
                <option value="iceland">🇮🇸 アイスランド</option>
                <option value="singapore">🇸🇬 シンガポール</option>
                <option value="japan">🇯🇵 日本</option>
                <option value="usa">🇺🇸 アメリカ</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={handleStart}
            className="px-12 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl font-bold text-2xl shadow-2xl transition-all transform hover:scale-110 animate-pulse w-full"
          >
            🎮 ゲーム開始
          </button>
          <button
            onClick={() => {
              // TODO: セーブデータロード画面を表示
              alert('セーブデータ選択機能は準備中です');
            }}
            className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-bold text-xl shadow-xl transition-all transform hover:scale-105 w-full"
          >
            📂 セーブデータから開始
          </button>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <div className="mb-2">🎮 操作方法</div>
          <div className="text-sm space-y-1">
            <div>• キャンバスをクリックしてタワーを配置</div>
            <div>• Wave開始ボタンで敵の侵攻開始</div>
            <div>• ショップで新しい国家やパワーアップを購入</div>
          </div>
        </div>
      </div>
    </div>
  );
};