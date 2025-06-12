import React, { useRef, useEffect, useState } from 'react';
import { PathSystem, PathPatterns } from './improved-path';
import { FlagRenderer } from './flag-renderer';
import { GDPEnemySystem, GDPEnemy, NATION_DATABASE } from './gdp-enemy-system';
import { AbilityProcessor } from './nation-abilities';
import { ShopSystemV2, ShopItem } from './shop-system-v2';
import { SaveSlotsModal, useSaveSlots, SaveData } from './save-slots';

interface Tower {
  id: number;
  x: number;
  y: number;
  range: number;
  damage: number;
  lastShot: number;
  nationId: string;
  placedAtWave: number; // タワーが配置されたWave番号
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
}

export const IntegratedGameV5: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enemies, setEnemies] = useState<GDPEnemy[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [coins, setCoins] = useState(200);
  const [wave, setWave] = useState(1);
  const [displayWave, setDisplayWave] = useState(1); // 表示用のWave番号
  const [lives, setLives] = useState(3);
  const [showShop, setShowShop] = useState(false);
  const [ownedNations, setOwnedNations] = useState<string[]>(['nauru']);
  const [selectedNation, setSelectedNation] = useState<string>('nauru');
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [newNationNotification, setNewNationNotification] = useState<{nation: any, show: boolean} | null>(null);
  const [gameModifiers, setGameModifiers] = useState<GameModifiers>({
    damageBoost: 1.0,
    rangeBoost: 1.0,
    speedBoost: 1.0,
    coinMultiplier: 1.0
  });
  const [specialEffects, setSpecialEffects] = useState<SpecialEffects>({
    slowField: false,
    doubleCoins: false,
    shield: 0
  });
  const [powerupsPurchased, setPowerupsPurchased] = useState<Record<string, number>>({});
  const animationRef = useRef<number>(0);
  const enemiesRef = useRef<GDPEnemy[]>([]);
  const towersRef = useRef<Tower[]>([]);
  const pathRef = useRef<PathSystem | null>(null);
  const waveStartTime = useRef<number>(0);
  const enemiesDefeatedInWave = useRef<number>(0);
  const totalEnemiesInWave = useRef<number>(0);
  const spawnedEnemiesInWave = useRef<number>(0);
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
      let deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Cap deltaTime to prevent large jumps (max 100ms)
      deltaTime = Math.min(deltaTime, 100);

      // クリア
      ctx.clearRect(0, 0, 800, 400);

      // 背景（宇宙風）
      const gradient = ctx.createLinearGradient(0, 0, 800, 400);
      gradient.addColorStop(0, '#000428');
      gradient.addColorStop(1, '#004e92');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 400);

      // 星を描画
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 50; i++) {
        const x = (i * 73 + timestamp * 0.01) % 800;
        const y = (i * 37) % 400;
        ctx.fillRect(x, y, 1, 1);
      }

      // パスを描画（ネオン風）
      ctx.save();
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      pathRef.current.draw(ctx, 40, '#0080ff');
      ctx.restore();

      // 基地を描画（未来的）
      const baseGradient = ctx.createRadialGradient(770, 200, 10, 770, 200, 30);
      baseGradient.addColorStop(0, '#00ff00');
      baseGradient.addColorStop(0.5, '#00cc00');
      baseGradient.addColorStop(1, '#008800');
      ctx.fillStyle = baseGradient;
      ctx.fillRect(750, 170, 40, 60);
      
      // 基地のコア
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 20;
      ctx.fillRect(765, 195, 10, 10);
      ctx.shadowBlur = 0;

      // シールド表示
      if (specialEffects.shield > 0) {
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + Math.sin(timestamp * 0.01) * 0.2})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(745, 165, 50, 70);
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`🛡️ ${specialEffects.shield}`, 760, 250);
      }

      // 敵を描画と移動
      const updatedEnemies = enemiesRef.current.filter(enemy => {
        // パスが初期化されていない場合はスキップ
        if (!pathRef.current) return true;
        
        let speed = enemy.speed;
        
        if (specialEffects.slowField) {
          speed *= 0.7;
        }
        
        if ((enemy as any).speedModifier && (enemy as any).speedModifierUntil > Date.now()) {
          speed *= (enemy as any).speedModifier;
        }
        
        enemy.pathProgress += speed * deltaTime * 0.001;
        const position = pathRef.current!.getPositionAtDistance(enemy.pathProgress);
        enemy.x = position.x;
        enemy.y = position.y;

        // 敵のグロー効果
        const size = enemy.getSize();
        ctx.save();
        if (enemy.type === 'boss') {
          ctx.shadowColor = '#ff0000';
          ctx.shadowBlur = 20;
        } else if (enemy.type === 'tank') {
          ctx.shadowColor = '#ffaa00';
          ctx.shadowBlur = 15;
        }
        
        FlagRenderer.drawFlag(
          ctx,
          enemy.nation.id,
          enemy.x,
          enemy.y,
          size * 1.5,
          size,
          enemy.nation.colors
        );
        ctx.restore();
        
        // HPバー
        const hpPercent = enemy.hp / enemy.maxHp;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(enemy.x - size, enemy.y - size - 12, size * 2, 6);
        
        const hpGradient = ctx.createLinearGradient(
          enemy.x - size, 0, 
          enemy.x - size + size * 2 * hpPercent, 0
        );
        hpGradient.addColorStop(0, hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.2 ? '#ffff00' : '#ff0000');
        hpGradient.addColorStop(1, hpPercent > 0.5 ? '#00aa00' : hpPercent > 0.2 ? '#aaaa00' : '#aa0000');
        ctx.fillStyle = hpGradient;
        ctx.fillRect(enemy.x - size, enemy.y - size - 12, size * 2 * hpPercent, 6);

        // 基地に到達したら削除
        if (enemy.pathProgress >= pathRef.current!.getTotalLength()) {
          if (specialEffects.shield > 0) {
            setSpecialEffects(prev => ({ ...prev, shield: prev.shield - 1 }));
          } else {
            setLives(prev => Math.max(0, prev - 1));
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

          // パーティクルエフェクト
          ctx.fillStyle = '#ffff00';
          for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            const dist = 20;
            ctx.fillRect(
              enemy.x + Math.cos(angle) * dist,
              enemy.y + Math.sin(angle) * dist,
              3, 3
            );
          }
          
          return false;
        }

        return true;
      });

      // 2Wave経過した古いタワーを削除
      const activeTowers = towersRef.current.filter(tower => {
        return displayWave - tower.placedAtWave < 2;
      });
      
      if (activeTowers.length !== towersRef.current.length) {
        setTowers(activeTowers);
      }

      // タワーを描画と攻撃
      activeTowers.forEach(tower => {
        const modifiers = AbilityProcessor.getTowerModifiers(tower.nationId);
        const effectiveRange = tower.range * modifiers.range * gameModifiers.rangeBoost;
        const attackInterval = 1000 * modifiers.attackSpeed / gameModifiers.speedBoost;

        // タワーのグロー効果
        ctx.save();
        ctx.shadowColor = '#0080ff';
        ctx.shadowBlur = 10;
        
        // 古いタワーは半透明に
        if (displayWave - tower.placedAtWave === 1) {
          ctx.globalAlpha = 0.5;
        }
        
        FlagRenderer.drawFlag(ctx, tower.nationId, tower.x, tower.y, 40, 30);
        ctx.restore();

        // 射程範囲
        ctx.strokeStyle = `rgba(0, 128, 255, ${0.1 + Math.sin(timestamp * 0.003) * 0.05})`;
        ctx.lineWidth = 1;
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
            
            const result = AbilityProcessor.processAttack(
              tower.nationId,
              baseDamage,
              target,
              updatedEnemies,
              (bonusCoins) => setCoins(prev => prev + Math.floor(bonusCoins * gameModifiers.coinMultiplier))
            );

            result.affectedEnemies.forEach(enemy => {
              if (updatedEnemies.includes(enemy)) {
                enemy.takeDamage(result.totalDamage);
              }
            });

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
        
        setSpecialEffects(prev => ({
          ...prev,
          slowField: false,
          doubleCoins: false
        }));
        
        // Wave完了時に次のWave番号に更新
        setWave(prev => prev + 1);
        
        // レア度制限付きのガチャ
        const unownedNations = NATION_DATABASE.filter(n => !ownedNations.includes(n.id));
        if (unownedNations.length > 0) {
          // 現在所有している最高レア度を取得
          let maxOwnedRarity = 1;
          ownedNations.forEach(nationId => {
            const nation = NATION_DATABASE.find(n => n.id === nationId);
            if (nation) {
              const rarity = GDPEnemySystem.getRarity(nation.gdp);
              if (rarity.stars > maxOwnedRarity) {
                maxOwnedRarity = rarity.stars;
              }
            }
          });
          
          // 最高レア度+1までの国をフィルタリング
          const eligibleNations = unownedNations.filter(nation => {
            const rarity = GDPEnemySystem.getRarity(nation.gdp);
            return rarity.stars <= maxOwnedRarity + 1;
          });
          
          if (eligibleNations.length > 0) {
            const randomNation = eligibleNations[Math.floor(Math.random() * eligibleNations.length)];
            setOwnedNations(prev => [...prev, randomNation.id]);
            setNewNationNotification({ nation: randomNation, show: true });
            
            // 最初の国（nauru）しか持っていない場合は自動的に選択を切り替える
            if (selectedNation === 'nauru' && randomNation.id !== 'nauru') {
              setSelectedNation(randomNation.id);
            }
            
            // 5秒後に通知を非表示にする
            setTimeout(() => {
              setNewNationNotification(null);
            }, 5000);
          }
        }
      }

      // 新国家獲得通知の表示
      if (newNationNotification && newNationNotification.show) {
        const notification = newNationNotification;
        const ability = AbilityProcessor.getAbilityDescription(notification.nation.id);
        const rarity = GDPEnemySystem.getRarity(notification.nation.gdp);
        
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(200, 20, 400, 80);
        
        ctx.strokeStyle = rarity.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(200, 20, 400, 80);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('🎉 新しい国家を獲得！', 220, 50);
        
        ctx.font = '16px Arial';
        ctx.fillText(`${notification.nation.flag} ${notification.nation.name} (★${rarity.stars})`, 220, 75);
        ctx.fillText(ability, 220, 95);
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isWaveActive, wave, displayWave, gameModifiers, specialEffects, newNationNotification, ownedNations, selectedNation]);

  // キャンバスクリックでタワー配置（修正版：スケーリング対応）
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !pathRef.current) return;

    const rect = canvas.getBoundingClientRect();
    // キャンバスの実際のサイズと表示サイズの比率を計算
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    // クリック座標をキャンバス座標系に変換
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (pathRef.current.isOnPath(x, y)) {
      return;
    }

    if (coins < 50) return;

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
      nationId: selectedNation,
      placedAtWave: displayWave // 現在の表示Wave番号を記録
    }]);
  };

  // Wave開始（修正版：Wave番号の表示を正しく管理）
  const startWave = () => {
    if (isWaveActive) return;

    setDisplayWave(wave); // 実行中のWaveを表示
    const waveNations = GDPEnemySystem.generateWaveNations(wave);
    setIsWaveActive(true);
    waveStartTime.current = performance.now();
    enemiesDefeatedInWave.current = 0;
    spawnedEnemiesInWave.current = 0;
    totalEnemiesInWave.current = waveNations.length;

    const spawnInterval = 25000 / waveNations.length;

    waveNations.forEach((nation, i) => {
      setTimeout(() => {
        let enemyType: 'normal' | 'tank' | 'boss' = 'normal';
        
        // Wave 6の倍数でボス
        if (wave % 6 === 0 && i === waveNations.length - 1) {
          enemyType = 'boss';
        }
        // Wave 3の倍数でタンク（複数）
        else if (wave % 3 === 0 && i % Math.floor(waveNations.length / 3) === 0) {
          enemyType = 'tank';
        }
        
        const newEnemy = new GDPEnemy(nation, wave, enemyType);
        setEnemies(prev => [...prev, newEnemy]);
        spawnedEnemiesInWave.current += 1;
      }, i * spawnInterval);
    });
  };

  // ショップでの購入処理
  const handleShopPurchase = (item: ShopItem, newCoins: number) => {
    setCoins(newCoins);
    
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
    }
    
    setPowerupsPurchased(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  // 国家購入処理
  const handleNationPurchase = (nationId: string) => {
    if (!ownedNations.includes(nationId)) {
      setOwnedNations(prev => [...prev, nationId]);
      if (selectedNation === 'nauru' && nationId !== 'nauru') {
        setSelectedNation(nationId);
      }
    }
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
    setDisplayWave(data.wave);
    setCoins(data.coins);
    setLives(data.lives);
    setOwnedNations(data.ownedNations);
    setSelectedNation(data.ownedNations[0] || 'nauru');
    setPowerupsPurchased(data.powerups || {});
    setIsWaveActive(false);
    setEnemies([]);
    setTowers(data.towers.map((t, i) => ({
      id: Date.now() + i,
      x: t.x,
      y: t.y,
      range: 100,
      damage: 3,
      lastShot: 0,
      nationId: t.nationId,
      placedAtWave: data.wave // 現在のWaveで配置されたと仮定
    })));
    
    const mods = { ...gameModifiers };
    if (data.powerups) {
      mods.damageBoost = 1 + (data.powerups.damage_boost || 0) * 0.1;
      mods.rangeBoost = 1 + (data.powerups.range_boost || 0) * 0.1;
      mods.speedBoost = 1 + (data.powerups.speed_boost || 0) * 0.1;
      mods.coinMultiplier = 1 + (data.powerups.coin_multiplier || 0) * 0.2;
    }
    setGameModifiers(mods);
    closeModal();
  };

  // ゲームオーバーチェック
  if (lives <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center" role="main">
        <div className="text-center bg-black bg-opacity-80 p-12 rounded-2xl shadow-2xl border border-red-600">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
            Game Over
          </h1>
          <p className="text-3xl mb-8 text-gray-300">Wave {displayWave} まで到達</p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-2xl font-bold shadow-2xl transition-all transform hover:scale-105"
          >
            もう一度プレイ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white" role="main">
      <div className="max-w-7xl mx-auto p-6">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
            Flag Defence
          </h1>
          <p className="text-gray-400">世界の国旗で基地を守れ！</p>
        </header>
        
        {/* ステータスバー */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-testid="game-card">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-xl shadow-lg">
            <div className="text-3xl font-bold">💰 {coins.toLocaleString()}</div>
            <div className="text-sm opacity-80">コイン</div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-xl shadow-lg">
            <div className="text-3xl font-bold">🌊 Wave {displayWave}</div>
            <div className="text-sm opacity-80">現在のWave</div>
          </div>
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-xl shadow-lg">
            <div className="text-3xl font-bold">❤️ {lives}</div>
            <div className="text-sm opacity-80">残機</div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl shadow-lg">
            <div className="text-3xl font-bold">🏳️ {ownedNations.length}</div>
            <div className="text-sm opacity-80">所有国家</div>
          </div>
        </div>

        {/* コントロールパネル */}
        <div className="bg-black bg-opacity-50 p-4 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={selectedNation}
                onChange={(e) => setSelectedNation(e.target.value)}
                className="bg-gray-800 px-4 py-3 rounded-lg border border-gray-600 text-white"
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
              <div className="text-sm text-gray-400">
                配置コスト: 💰 50 (2Wave後に消滅)
              </div>
            </div>
            
            <button
              onClick={() => setShowShop(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-xl shadow-2xl transition-all transform hover:scale-110 animate-pulse"
            >
              🛒 ショップ
            </button>
          </div>
        </div>

        {/* ゲームキャンバス */}
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            onClick={handleCanvasClick}
            className="w-full max-w-4xl mx-auto block border-2 border-cyan-600 rounded-xl shadow-2xl cursor-crosshair"
            style={{ imageRendering: 'pixelated' }}
          />
          
          {/* Wave進行状況 */}
          {isWaveActive && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 p-4 rounded-xl backdrop-blur-sm">
              <div className="text-lg font-bold mb-2">Wave {displayWave} 進行中...</div>
              <div className="w-80 bg-gray-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full"
                  style={{ width: '100%', animation: 'shrink 25s linear' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button
            onClick={startWave}
            disabled={isWaveActive}
            className={`px-8 py-4 rounded-xl font-bold text-xl shadow-2xl transition-all transform ${
              isWaveActive 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:scale-105'
            }`}
          >
            {isWaveActive ? '⏳ Wave進行中...' : `🌊 Wave ${wave} 開始`}
          </button>
          <button
            onClick={openSaveModal}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-bold text-xl shadow-2xl transition-all transform hover:scale-105"
          >
            💾 セーブ
          </button>
          <button
            onClick={openLoadModal}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-bold text-xl shadow-2xl transition-all transform hover:scale-105"
          >
            📂 ロード
          </button>
        </div>

        {/* 操作説明 */}
        <div className="bg-black bg-opacity-50 p-6 rounded-xl backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-3">🎮 操作方法</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>💡 キャンバスをクリックしてタワーを配置（2Wave後に消滅）</div>
            <div>🏪 ショップで国家購入やパワーアップ</div>
            <div>⚔️ 各国の特殊能力を活用して戦略を立てよう</div>
            <div>🎰 Wave完了で新しい国家を自動獲得！</div>
          </div>
        </div>

        {/* ショップモーダル */}
        {showShop && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] p-4">
            <ShopSystemV2
              coins={coins}
              lives={lives}
              ownedNations={ownedNations}
              onPurchase={handleShopPurchase}
              onLivesPurchase={setLives}
              onNationPurchase={handleNationPurchase}
              onGachaPurchase={() => {}}
              onClose={() => setShowShop(false)}
            />
          </div>
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