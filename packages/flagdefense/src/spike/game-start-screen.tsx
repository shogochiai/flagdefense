import React, { useState } from 'react';
import { SaveSlotManager } from './save-slots';

export interface GameSettings {
  initialCoins: number;
  initialLives: number;
  towerLifespan: number;
  startingNation: string;
  loadedData?: any;
}

interface GameStartScreenProps {
  onStartGame: (settings: GameSettings) => void;
  onLoadGame?: (slot: number) => void;
}

export const GameStartScreen: React.FC<GameStartScreenProps> = ({ onStartGame, onLoadGame }) => {
  const [settings, setSettings] = useState<GameSettings>({
    initialCoins: 200,
    initialLives: 3,
    towerLifespan: 3,
    startingNation: 'nauru'
  });
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveSlots, setSaveSlots] = useState<any[]>([]);

  const handleStart = () => {
    onStartGame(settings);
  };

  const handleShowLoadModal = () => {
    // セーブスロット情報を取得
    const slots = [];
    for (let i = 1; i <= 5; i++) {
      const info = SaveSlotManager.getSlotInfo(i);
      if (info) {
        slots.push({
          slot: i,
          isEmpty: info.isEmpty,
          wave: info.data?.wave,
          coins: info.data?.coins,
          timestamp: info.data?.timestamp
        });
      }
    }
    setSaveSlots(slots);
    setShowLoadModal(true);
  };

  const handleLoadSlot = (slot: number) => {
    if (onLoadGame) {
      onLoadGame(slot);
    } else {
      // onLoadGameが提供されていない場合、内部で処理
      const data = SaveSlotManager.loadSlot(slot);
      if (data) {
        onStartGame({
          initialCoins: data.coins,
          initialLives: data.lives,
          towerLifespan: settings.towerLifespan,
          startingNation: data.ownedNations[0] || 'nauru',
          loadedData: data
        });
      }
    }
    setShowLoadModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full p-8">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
            Flag Defence
          </h1>
          <p className="text-xl text-gray-400">世界の<ruby>国旗<rt>こっき</rt></ruby>で<ruby>基地<rt>きち</rt></ruby>を<ruby>守<rt>まも</rt></ruby>れ！</p>
        </div>

        <div className="bg-black bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">ゲーム<ruby>設定<rt>せってい</rt></ruby></h2>
          
          <div className="space-y-6">
            {/* 初期コイン */}
            <div>
              <label className="block text-lg mb-2">
                <ruby>初期<rt>しょき</rt></ruby>コイン: 💰 {settings.initialCoins}
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
                <ruby>初期<rt>しょき</rt></ruby>ライフ: ❤️ {settings.initialLives}
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
                タワー<ruby>寿命<rt>じゅみょう</rt></ruby>: 🏰 {settings.towerLifespan} Wave
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
                <ruby>配置<rt>はいち</rt></ruby>したタワーが<ruby>消<rt>き</rt></ruby>えるまでのWave<ruby>数<rt>すう</rt></ruby>
              </p>
            </div>

            {/* 開始国家 */}
            <div>
              <label className="block text-lg mb-2">
                <ruby>開始<rt>かいし</rt></ruby><ruby>国家<rt>こっか</rt></ruby>: 🏳️
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
            🎮 ゲーム<ruby>開始<rt>かいし</rt></ruby>
          </button>
          <button
            onClick={handleShowLoadModal}
            className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-bold text-xl shadow-xl transition-all transform hover:scale-105 w-full"
          >
            📂 セーブデータから<ruby>開始<rt>かいし</rt></ruby>
          </button>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <div className="mb-2">🎮 <ruby>操作<rt>そうさ</rt></ruby><ruby>方法<rt>ほうほう</rt></ruby></div>
          <div className="text-sm space-y-1">
            <div>• キャンバスをクリックしてタワーを<ruby>配置<rt>はいち</rt></ruby></div>
            <div>• Wave<ruby>開始<rt>かいし</rt></ruby>ボタンで<ruby>敵<rt>てき</rt></ruby>の<ruby>侵攻<rt>しんこう</rt></ruby><ruby>開始<rt>かいし</rt></ruby></div>
            <div>• ショップで<ruby>新<rt>あたら</rt></ruby>しい<ruby>国家<rt>こっか</rt></ruby>やパワーアップを<ruby>購入<rt>こうにゅう</rt></ruby></div>
          </div>
        </div>
      </div>

      {/* セーブデータ選択モーダル */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">セーブデータ<ruby>選択<rt>せんたく</rt></ruby></h2>
            
            <div className="space-y-4">
              {saveSlots.map((slot) => (
                <div
                  key={slot.slot}
                  data-testid={`save-slot-${slot.slot}`}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    slot.isEmpty
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                      : 'border-blue-600 hover:border-blue-500 bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => !slot.isEmpty && handleLoadSlot(slot.slot)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        スロット {slot.slot}
                      </h3>
                      {slot.isEmpty ? (
                        <p className="text-gray-500">空</p>
                      ) : (
                        <div className="text-sm space-y-1">
                          <p>Wave: {slot.wave}</p>
                          <p>💰 {slot.coins}</p>
                          <p className="text-gray-400">
                            {new Date(slot.timestamp).toLocaleString('ja-JP')}
                          </p>
                        </div>
                      )}
                    </div>
                    {!slot.isEmpty && (
                      <div className="text-4xl">📁</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowLoadModal(false)}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};