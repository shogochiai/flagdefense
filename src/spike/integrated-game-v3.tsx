import React, { useRef, useEffect, useState } from 'react';
import { SimpleGacha } from './simple-gacha';
import { PathSystem, PathPatterns } from './improved-path';
import { FlagRenderer } from './flag-renderer';
import { GDPEnemySystem, GDPEnemy, NATION_DATABASE } from './gdp-enemy-system';
import { AbilityProcessor } from './nation-abilities';
import { ShopSystem, ShopItem } from './shop-system';
import { SaveSlotsModal, useSaveSlots, SaveData } from './save-slots';

interface Tower {
  id: number;
  x: number;
  y: number;
  range: number;
  damage: number;
  lastShot: number;
  nationId: string;
}

interface GameModifiers {
  damageBoost: number;
  rangeBoost: number;
  speedBoost: number;
  coinMultiplier: number;
}

interface SpecialEffects {
  slowField: boolean;
  doubleCoins: boolean;
  shield: number;
  gachaTickets: number;
}

export const IntegratedGameV3: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enemies, setEnemies] = useState<GDPEnemy[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [coins, setCoins] = useState(100);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [showGacha, setShowGacha] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [ownedNations, setOwnedNations] = useState<string[]>(['nauru']); // 弱い国からスタート
  const [selectedNation, setSelectedNation] = useState<string>('nauru');
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [waveCleared, setWaveCleared] = useState(false); // Wave成功フラグ追加
  const [gameModifiers, setGameModifiers] = useState<GameModifiers>({
    damageBoost: 1.0,
    rangeBoost: 1.0,
    speedBoost: 1.0,
    coinMultiplier: 1.0
  });
  const [specialEffects, setSpecialEffects] = useState<SpecialEffects>({
    slowField: false,
    doubleCoins: false,
    shield: 0,
    gachaTickets: 0
  });
  const [powerupsPurchased, setPowerupsPurchased] = useState<Record<string, number>>({});
  const animationRef = useRef<number>(0);
  const enemiesRef = useRef<GDPEnemy[]>([]);
  const towersRef = useRef<Tower[]>([]);
  const pathRef = useRef<PathSystem | null>(null);
  const waveStartTime = useRef<number>(0);
  const enemiesDefeatedInWave = useRef<number>(0);
  const totalEnemiesInWave = useRef<number>(0);
  const { showModal, modalMode, openSaveModal, openLoadModal, closeModal } = useSaveSlots();

  // パスシステムの初期化
  useEffect(() => {
    pathRef.current = new PathSystem(PathPatterns.zigzag(800, 400, 4));
  }, []);

  // 敵とタワーの参照を更新
  useEffect(() => {
    enemiesRef.current = enemies;
    towersRef.current = towers;
  }, [enemies, towers]);

  // 攻撃エフェクトの描画
  const drawAttackEffect = (
    ctx: CanvasRenderingContext2D,
    from: { x: number, y: number },
    to: { x: number, y: number },
    effects: string[]
  ) => {
    ctx.save();
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // エフェクトテキスト
    if (effects.length > 0) {
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(effects.join(' '), to.x, to.y - 30);
    }
    ctx.restore();
  };

  // ゲームループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || !pathRef.current) return;

    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      if (!ctx) return;
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // クリア
      ctx.clearRect(0, 0, 800, 400);

      // 背景
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      if (gradient) {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 400);
      }

      // パスを描画
      pathRef.current.draw(ctx);

      // 基地を描画
      const baseGradient = ctx.createLinearGradient(750, 170, 790, 230);
      if (baseGradient) {
        baseGradient.addColorStop(0, '#00ff00');
        baseGradient.addColorStop(1, '#008800');
      }
      ctx.fillStyle = baseGradient;
      ctx.fillRect(750, 170, 40, 60);
      ctx.fillStyle = '#000';
      ctx.font = '30px Arial';
      ctx.fillText('🏰', 755, 210);

      // シールド表示
      if (specialEffects.shield > 0) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(745, 165, 50, 70);
        ctx.fillStyle = '#00ffff';
        ctx.font = '12px Arial';
        ctx.fillText(`🛡️ ${specialEffects.shield}`, 760, 250);
      }

      // 敵を描画と移動
      const updatedEnemies = enemiesRef.current.filter(enemy => {
        // パスに沿って移動
        let speed = enemy.speed;
        
        // スローフィールド効果
        if (specialEffects.slowField) {
          speed *= 0.7;
        }
        
        // 個別のスロー効果
        if ((enemy as any).speedModifier && (enemy as any).speedModifierUntil > Date.now()) {
          speed *= (enemy as any).speedModifier;
        }
        
        enemy.pathProgress += speed * deltaTime * 0.001;
        const position = pathRef.current!.getPositionAtDistance(enemy.pathProgress);
        enemy.x = position.x;
        enemy.y = position.y;

        // 国旗を描画
        const size = enemy.getSize();
        FlagRenderer.drawFlag(
          ctx,
          enemy.nation.id,
          enemy.x,
          enemy.y,
          size * 1.5,
          size,
          enemy.nation.colors
        );
        
        // HPバー
        const hpPercent = enemy.hp / enemy.maxHp;
        ctx.fillStyle = '#000';
        ctx.fillRect(enemy.x - size, enemy.y - size - 10, size * 2, 4);
        ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.2 ? '#ffff00' : '#ff0000';
        ctx.fillRect(enemy.x - size, enemy.y - size - 10, size * 2 * hpPercent, 4);

        // 基地に到達したら削除
        if (enemy.pathProgress >= pathRef.current!.getTotalLength()) {
          // シールド効果
          if (specialEffects.shield > 0) {
            setSpecialEffects(prev => ({ ...prev, shield: prev.shield - 1 }));
          } else {
            setLives(prev => Math.max(0, prev - 1)); // 0未満にならないように
          }
          return false;
        }

        // HPが0以下なら削除
        if (enemy.hp <= 0) {
          let reward = enemy.reward;
          if (specialEffects.doubleCoins) {
            reward *= 2;
          }
          reward = Math.floor(reward * gameModifiers.coinMultiplier);
          setCoins(prev => prev + reward);
          enemiesDefeatedInWave.current += 1;
          return false;
        }

        return true;
      });

      // タワーを描画と攻撃
      towersRef.current.forEach(tower => {
        const modifiers = AbilityProcessor.getTowerModifiers(tower.nationId);
        const effectiveRange = tower.range * modifiers.range * gameModifiers.rangeBoost;
        const attackInterval = 1000 * modifiers.attackSpeed / gameModifiers.speedBoost;

        // 国旗を描画
        FlagRenderer.drawFlag(ctx, tower.nationId, tower.x, tower.y, 40, 30);

        // 射程範囲（デバッグ用）
        ctx.strokeStyle = 'rgba(0, 100, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, effectiveRange, 0, Math.PI * 2);
        ctx.stroke();

        // 攻撃
        if (timestamp - tower.lastShot > attackInterval) {
          const targetsInRange = updatedEnemies.filter(enemy => {
            const dist = Math.sqrt(
              Math.pow(enemy.x - tower.x, 2) + 
              Math.pow(enemy.y - tower.y, 2)
            );
            return dist <= effectiveRange;
          });

          if (targetsInRange.length > 0) {
            const target = targetsInRange[0];
            const baseDamage = tower.damage * gameModifiers.damageBoost;
            
            // 特殊能力を適用した攻撃
            const result = AbilityProcessor.processAttack(
              tower.nationId,
              baseDamage,
              target,
              updatedEnemies,
              (bonusCoins) => setCoins(prev => prev + Math.floor(bonusCoins * gameModifiers.coinMultiplier))
            );

            // ダメージを適用
            result.affectedEnemies.forEach(enemy => {
              if (updatedEnemies.includes(enemy)) {
                enemy.takeDamage(result.totalDamage);
              }
            });

            // エフェクトを描画
            drawAttackEffect(ctx, tower, target, result.effects);
            
            tower.lastShot = timestamp;
          }
        }
      });

      enemiesRef.current = updatedEnemies;
      setEnemies(updatedEnemies);

      // Wave時間チェック（25秒）
      if (isWaveActive && timestamp - waveStartTime.current > 25000) {
        setIsWaveActive(false);
        
        // 特殊効果をリセット
        setSpecialEffects(prev => ({
          ...prev,
          slowField: false,
          doubleCoins: false
        }));
        
        // 全ての敵を倒した場合のみガチャ
        if (enemiesDefeatedInWave.current >= totalEnemiesInWave.current && updatedEnemies.length === 0) {
          setWaveCleared(true);
          setShowGacha(true);
        }
      }

      // Wave完了チェック（全敵撃破）
      if (!isWaveActive && enemiesDefeatedInWave.current >= totalEnemiesInWave.current && updatedEnemies.length === 0 && waveCleared) {
        setShowGacha(true);
        setWaveCleared(false); // リセット
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isWaveActive, wave, gameModifiers, specialEffects, waveCleared]);

  // キャンバスクリックでタワー配置
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !pathRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // パス上には配置できない
    if (pathRef.current.isOnPath(x, y)) {
      return;
    }

    // コインチェック
    if (coins < 50) return;

    // 所有している国家のみ配置可能
    if (!ownedNations.includes(selectedNation)) return;

    const nationData = NATION_DATABASE.find(n => n.id === selectedNation);
    if (!nationData) return;

    setCoins(prev => prev - 50);
    setTowers(prev => [...prev, {
      id: Date.now(),
      x,
      y,
      range: 100 + Math.log10(nationData.gdp + 1) * 10,
      damage: 3 + Math.floor(Math.log10(nationData.gdp + 1)),
      lastShot: 0,
      nationId: selectedNation
    }]);
  };

  // Wave開始
  const startWave = () => {
    if (isWaveActive) return;

    const waveNations = GDPEnemySystem.generateWaveNations(wave);
    setIsWaveActive(true);
    waveStartTime.current = performance.now();
    enemiesDefeatedInWave.current = 0;
    totalEnemiesInWave.current = waveNations.length;

    // 25秒間で全ての敵を出現させる
    const spawnInterval = 25000 / waveNations.length;

    waveNations.forEach((nation, i) => {
      setTimeout(() => {
        const enemyType = i === waveNations.length - 1 ? 'boss' : 
                         i % 10 === 0 ? 'tank' : 'normal';
        
        setEnemies(prev => [...prev, new GDPEnemy(nation, wave, enemyType)]);
      }, i * spawnInterval);
    });

    setWave(prev => prev + 1);
  };

  // ショップでの購入処理
  const handleShopPurchase = (item: ShopItem, newCoins: number) => {
    setCoins(newCoins);
    
    // パワーアップの適用
    switch (item.id) {
      case 'damage_boost':
        setGameModifiers(prev => ({ ...prev, damageBoost: prev.damageBoost + 0.1 }));
        break;
      case 'range_boost':
        setGameModifiers(prev => ({ ...prev, rangeBoost: prev.rangeBoost + 0.1 }));
        break;
      case 'speed_boost':
        setGameModifiers(prev => ({ ...prev, speedBoost: prev.speedBoost + 0.1 }));
        break;
      case 'coin_multiplier':
        setGameModifiers(prev => ({ ...prev, coinMultiplier: prev.coinMultiplier + 0.2 }));
        break;
      case 'slow_field':
        setSpecialEffects(prev => ({ ...prev, slowField: true }));
        break;
      case 'double_coins':
        setSpecialEffects(prev => ({ ...prev, doubleCoins: true }));
        break;
      case 'shield':
        setSpecialEffects(prev => ({ ...prev, shield: 3 }));
        break;
      case 'gacha_ticket':
        setSpecialEffects(prev => ({ ...prev, gachaTickets: prev.gachaTickets + 1 }));
        break;
    }
    
    // 購入数を記録
    setPowerupsPurchased(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  // セーブデータの準備
  const getCurrentSaveData = (): Omit<SaveData, 'timestamp' | 'playTime'> => ({
    wave,
    coins,
    lives,
    towers: towers.map(t => ({ x: t.x, y: t.y, nationId: t.nationId })),
    ownedNations,
    powerups: powerupsPurchased
  });

  // ロード処理
  const handleLoad = (data: SaveData) => {
    setWave(data.wave);
    setCoins(data.coins);
    setLives(data.lives);
    setOwnedNations(data.ownedNations);
    setPowerupsPurchased(data.powerups || {});
    setTowers(data.towers.map((t, i) => ({
      id: Date.now() + i,
      x: t.x,
      y: t.y,
      range: 100,
      damage: 3,
      lastShot: 0,
      nationId: t.nationId
    })));
    
    // パワーアップを再適用
    const mods = { ...gameModifiers };
    if (data.powerups) {
      mods.damageBoost = 1 + (data.powerups.damage_boost || 0) * 0.1;
      mods.rangeBoost = 1 + (data.powerups.range_boost || 0) * 0.1;
      mods.speedBoost = 1 + (data.powerups.speed_boost || 0) * 0.1;
      mods.coinMultiplier = 1 + (data.powerups.coin_multiplier || 0) * 0.2;
    }
    setGameModifiers(mods);
  };

  // ゲームオーバーチェック
  if (lives <= 0) {
    return (
      <div className="p-4 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-2xl">
          <h1 className="text-5xl font-bold mb-6 text-red-500">Game Over</h1>
          <p className="text-2xl mb-8">Wave {wave - 1} まで到達</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold transition-colors"
            >
              もう一度プレイ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          Flag Defence
        </h1>
        
        {/* ゲーム情報 */}
        <div className="mb-4 flex gap-3 flex-wrap justify-center">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-3 rounded-lg shadow-lg">
            💰 {coins} コイン
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg shadow-lg">
            🌊 Wave: {wave}
          </div>
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-lg shadow-lg">
            ❤️ 残機: {lives}
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-lg shadow-lg">
            🏳️ 所有国家: {ownedNations.length}
          </div>
          {specialEffects.gachaTickets > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-lg shadow-lg animate-pulse">
              🎫 ガチャチケット: {specialEffects.gachaTickets}
            </div>
          )}
        </div>

        {/* 国家選択とショップ */}
        <div className="mb-4 flex gap-4 items-center justify-center">
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
            <label className="block text-sm mb-2">配置する国家:</label>
            <select
              value={selectedNation}
              onChange={(e) => setSelectedNation(e.target.value)}
              className="bg-gray-700 p-2 rounded border border-gray-600 text-white"
            >
              {ownedNations.map(nationId => {
                const nation = NATION_DATABASE.find(n => n.id === nationId);
                if (!nation) return null;
                const rarity = GDPEnemySystem.getRarity(nation.gdp);
                const ability = AbilityProcessor.getAbilityDescription(nationId);
                return (
                  <option key={nationId} value={nationId}>
                    {nation.flag} {nation.name} (★{rarity.stars}) - {ability}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={() => setShowShop(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            🛒 ショップ
          </button>
        </div>

        {/* ゲームキャンバス */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            onClick={handleCanvasClick}
            className="border-2 border-gray-600 bg-gray-800 cursor-crosshair rounded-lg shadow-2xl mx-auto block"
          />
          
          {/* Wave進行状況 */}
          {isWaveActive && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded-lg shadow-lg">
              <div className="text-sm font-semibold">Wave {wave - 1} 進行中...</div>
              <div className="w-64 bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: '100%', animation: 'shrink 25s linear' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* コントロール */}
        <div className="mt-6 flex gap-4 flex-wrap justify-center">
          <button
            onClick={startWave}
            disabled={isWaveActive}
            className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all transform ${
              isWaveActive 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105'
            }`}
          >
            Wave {wave} 開始
          </button>
          <button
            onClick={openSaveModal}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            💾 セーブ
          </button>
          <button
            onClick={openLoadModal}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            📂 ロード
          </button>
        </div>

        {/* 操作説明 */}
        <div className="mt-6 text-sm text-gray-400 bg-gray-800 p-4 rounded-lg">
          <p className="mb-1">• 所有している国家を選択してキャンバスをクリックで配置（50コイン）</p>
          <p className="mb-1">• 国家ごとに特殊能力があります！</p>
          <p className="mb-1">• ショップでパワーアップや残機を購入できます</p>
          <p>• 25秒間のWaveで全ての敵を倒してガチャを引こう！</p>
        </div>

        {/* ガチャモーダル */}
        {showGacha && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl max-w-md shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
                Wave {wave - 1} クリア！
              </h2>
              <p className="text-center mb-6 text-lg">
                ガチャ回数: <span className="text-2xl font-bold text-yellow-400">{1 + specialEffects.gachaTickets}</span>
              </p>
              <SimpleGacha 
                onNationPulled={(nation) => {
                  if (!ownedNations.includes(nation.id)) {
                    setOwnedNations([...ownedNations, nation.id]);
                    if (selectedNation === 'nauru' && nation.id !== 'nauru') {
                      setSelectedNation(nation.id); // より良い国に自動切り替え
                    }
                  }
                }}
              />
              {specialEffects.gachaTickets > 0 && (
                <button
                  onClick={() => {
                    setSpecialEffects(prev => ({ 
                      ...prev, 
                      gachaTickets: prev.gachaTickets - 1 
                    }));
                  }}
                  className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                >
                  🎫 チケットでもう1回引く
                </button>
              )}
              <button
                onClick={() => {
                  setShowGacha(false);
                  if (specialEffects.gachaTickets > 0) {
                    setSpecialEffects(prev => ({ ...prev, gachaTickets: 0 }));
                  }
                }}
                className="mt-4 w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold shadow-lg transition-all"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* ショップモーダル */}
        {showShop && (
          <ShopSystem
            coins={coins}
            lives={lives}
            onPurchase={handleShopPurchase}
            onLivesPurchase={setLives}
            onClose={() => setShowShop(false)}
          />
        )}

        {/* セーブ/ロードモーダル */}
        {showModal && (
          <SaveSlotsModal
            currentData={getCurrentSaveData()}
            onLoad={handleLoad}
            onClose={closeModal}
            mode={modalMode}
          />
        )}
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};