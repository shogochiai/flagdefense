import React, { useRef, useEffect, useState } from 'react';
import { PathSystem, PathPatterns } from './improved-path';
import { FlagRenderer } from './flag-renderer';
import { GDPEnemySystem, GDPEnemy, NATION_DATABASE } from './gdp-enemy-system';
import { AbilityProcessor } from './nation-abilities';
import { ShopSystemV2, ShopItem } from './shop-system-v2';
import { SideShop } from './side-shop';
import { SaveSlotsModal, useSaveSlots, SaveData } from './save-slots';
import { ALL_NATION_ABILITIES } from './nation-abilities-v2';
import { DefeatedNationsList } from './defeated-nations-list';
import { getCountryFact } from '../../docs/21_nations-fact-list';

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

interface AttackEffect {
  id: number;
  x: number;
  y: number;
  text: string;
  timestamp: number;
}

interface DefeatNotification {
  nation: typeof NATION_DATABASE[0];
  timestamp: number;
}

import { GameSettings } from './game-start-screen';

interface IntegratedGameV5Props {
  initialSettings: GameSettings;
}

export const IntegratedGameV5: React.FC<IntegratedGameV5Props> = ({ initialSettings }) => {
  // テキストを複数行に折り返す関数
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split('');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const char of words) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  // Helper function to get ability description with money bonus
  const getAbilityDescriptionWithBonus = (nationId: string): string => {
    const ability = ALL_NATION_ABILITIES[nationId];
    if (!ability) return '通常攻撃';
    
    // Check for money effect
    const moneyEffect = ability.effects.find(e => e.type === 'money');
    if (moneyEffect && moneyEffect.value >= 1.05) {
      const bonusPercent = Math.round((moneyEffect.value - 1) * 100);
      return `コイン獲得+${bonusPercent}%`;
    }
    
    // Return first effect description for others
    const mainEffect = ability.effects[0];
    if (!mainEffect) return ability.description;
    
    switch (mainEffect.type) {
      case 'damage': return `ダメージ+${Math.round((mainEffect.value - 1) * 100)}%`;
      case 'splash': return '範囲攻撃';
      case 'multi': return `${mainEffect.value}体同時攻撃`;
      case 'freeze': return '凍結効果';
      case 'slow': return 'スロー効果';
      case 'pierce': return '貫通攻撃';
      case 'chain': return '連鎖攻撃';
      case 'laser': return 'レーザー攻撃';
      case 'buff': return 'バフ効果';
      default: return ability.description;
    }
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enemies, setEnemies] = useState<GDPEnemy[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [coins, setCoins] = useState(initialSettings.initialCoins);
  const [wave, setWave] = useState(1);
  const [displayWave, setDisplayWave] = useState(1); // 表示用のWave番号
  const [lives, setLives] = useState(initialSettings.initialLives);
  const [showShop, setShowShop] = useState(false);
  const [showSideShop, setShowSideShop] = useState(true);
  const [ownedNations, setOwnedNations] = useState<string[]>([initialSettings.startingNation]);
  const [selectedNation, setSelectedNation] = useState<string>(initialSettings.startingNation);
  const [towerLifespan] = useState(initialSettings.towerLifespan);
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [newNationNotification, setNewNationNotification] = useState<{nation: any, show: boolean} | null>(null);
  const [waveCompleteNotification, setWaveCompleteNotification] = useState<{nations: typeof NATION_DATABASE[0][], show: boolean} | null>(null);
  const waveCompleteNotificationRef = useRef<{x: number, y: number, width: number, height: number} | null>(null);
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
  const [attackEffects, setAttackEffects] = useState<AttackEffect[]>([]);
  const [defeatNotifications, setDefeatNotifications] = useState<DefeatNotification[]>([]);
  const [defeatedNations, setDefeatedNations] = useState<Record<string, typeof NATION_DATABASE[0]>>({});
  const [saveNotification, setSaveNotification] = useState<{ show: boolean; timestamp: number } | null>(null);
  const [nationFactDisplay, setNationFactDisplay] = useState<{
    nationId: string;
    nationName: string;
    flag: string;
    fact: string;
    source: string;
    timestamp: number;
  } | null>(null);
  const animationRef = useRef<number>(0);
  const enemiesRef = useRef<GDPEnemy[]>([]);
  const towersRef = useRef<Tower[]>([]);
  const pathRef = useRef<PathSystem | null>(null);
  const waveStartTime = useRef<number>(0);
  const enemiesDefeatedInWave = useRef<number>(0);
  const totalEnemiesInWave = useRef<number>(0);
  const spawnedEnemiesInWave = useRef<number>(0);
  const defeatedInCurrentWave = useRef<typeof NATION_DATABASE[0][]>([]);
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

  // 攻撃エフェクトの追加
  const addAttackEffect = (x: number, y: number, effects: string[]) => {
    if (effects.length > 0) {
      setAttackEffects(prev => [...prev, {
        id: Date.now() + Math.random(),
        x,
        y,
        text: effects.join(' '),
        timestamp: performance.now()
      }]);
    }
  };

  // 攻撃エフェクトの描画
  const drawAttackLine = (
    ctx: CanvasRenderingContext2D,
    from: { x: number, y: number },
    to: { x: number, y: number }
  ) => {
    ctx.save();
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  };

  // 攻撃エフェクトテキストの描画
  const drawEffectTexts = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    const effectDuration = 2000; // 2秒間表示
    setAttackEffects(prev => prev.filter(effect => {
      const age = timestamp - effect.timestamp;
      if (age > effectDuration) return false;
      
      ctx.save();
      const opacity = Math.max(0, 1 - age / effectDuration);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 14px Arial';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      const yOffset = -30 - (age / effectDuration) * 20; // 上に移動
      ctx.fillText(effect.text, effect.x, effect.y + yOffset);
      ctx.restore();
      
      return true;
    }));
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

      // お城を描画
      ctx.save();
      
      // 城の本体（石のグラデーション）
      const castleGradient = ctx.createLinearGradient(750, 170, 790, 230);
      castleGradient.addColorStop(0, '#d4d4d4');
      castleGradient.addColorStop(0.5, '#a8a8a8');
      castleGradient.addColorStop(1, '#808080');
      ctx.fillStyle = castleGradient;
      ctx.fillRect(755, 190, 30, 40);
      
      // 城壁（胸壁）
      ctx.fillStyle = '#a8a8a8';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(753 + i * 8, 185, 6, 8);
      }
      
      // 中央の塔
      ctx.fillStyle = castleGradient;
      ctx.fillRect(765, 175, 10, 20);
      
      // 塔の先端（三角形）
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.moveTo(770, 165);
      ctx.lineTo(760, 175);
      ctx.lineTo(780, 175);
      ctx.closePath();
      ctx.fill();
      
      // 旗
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(770, 165);
      ctx.lineTo(770, 155);
      ctx.stroke();
      
      // 旗布
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.moveTo(770, 155);
      ctx.lineTo(780, 158);
      ctx.lineTo(780, 162);
      ctx.lineTo(770, 160);
      ctx.closePath();
      ctx.fill();
      
      // 門
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(765, 210, 10, 20);
      
      // 影
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      ctx.restore();

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

          // 撃破通知を追加
          setDefeatNotifications(prev => [...prev, {
            nation: enemy.nation,
            timestamp: performance.now()
          }]);

          // 撃破した国家を記録（重複チェック改善）
          if (!defeatedNations[enemy.nation.id]) {
            // まだ撃破していない場合のみ追加
            setDefeatedNations(prev => ({ ...prev, [enemy.nation.id]: enemy.nation }));
            
            // 現在のWaveで撃破した国家リストにも追加（重複チェック）
            const alreadyInList = defeatedInCurrentWave.current.some(n => n.id === enemy.nation.id);
            if (!alreadyInList) {
              defeatedInCurrentWave.current.push(enemy.nation);
            }
          }

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

      // 指定Wave経過した古いタワーを削除
      const activeTowers = towersRef.current.filter(tower => {
        return displayWave - tower.placedAtWave < towerLifespan;
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
        
        // 古いタワーは半透明に（最後の1Waveになったら）
        if (displayWave - tower.placedAtWave === towerLifespan - 1) {
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

            drawAttackLine(ctx, tower, target);
            addAttackEffect(target.x, target.y, result.effects);
            tower.lastShot = timestamp;
          }
        }
      });

      enemiesRef.current = updatedEnemies;
      setEnemies(updatedEnemies);

      // Wave時間チェック（25秒）AND全ての敵が倒されているかチェック
      if (isWaveActive && timestamp - waveStartTime.current > 25000 && enemiesRef.current.length === 0) {
        setIsWaveActive(false);
        
        setSpecialEffects(prev => ({
          ...prev,
          slowField: false,
          doubleCoins: false
        }));

        // Wave完了通知を表示
        if (defeatedInCurrentWave.current.length > 0) {
          setWaveCompleteNotification({
            nations: [...defeatedInCurrentWave.current],
            show: true
          });
          
          // 10秒後に消す
          setTimeout(() => {
            setWaveCompleteNotification(null);
          }, 10000);
        }
        
        // Wave完了時に次のWave番号に更新
        setWave(prev => prev + 1);
        
        // レア度制限付きのガチャ（Wave完了通知の後に処理）
        setTimeout(() => {
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
              setNewNationNotification({ nation: randomNation, show: false }); // Initially hidden
              
              // 最初の国（nauru）しか持っていない場合は自動的に選択を切り替える
              if (selectedNation === 'nauru' && randomNation.id !== 'nauru') {
                setSelectedNation(randomNation.id);
              }
            }
          }
        }, 100); // Small delay to ensure proper state update
      }

      // 攻撃エフェクトテキストの描画
      drawEffectTexts(ctx, timestamp);

      // 撃破通知の表示（右下）
      const notificationDuration = 2000; // 2秒間表示
      setDefeatNotifications(prev => {
        // 古い通知をフィルタリング
        const activeNotifications = prev.filter(notification => {
          const age = timestamp - notification.timestamp;
          return age <= notificationDuration;
        });
        
        // 最新2件までに制限（FIFO）
        const displayNotifications = activeNotifications.slice(-2);
        
        // 表示
        displayNotifications.forEach((notification, index) => {
          const age = timestamp - notification.timestamp;
          const opacity = Math.max(0, 1 - age / notificationDuration);
          
          ctx.save();
          ctx.globalAlpha = opacity;
          
          // 右下に表示
          const x = 800 - 240; // 右端から240px左
          const y = 400 - 70 - index * 40; // 下端から上に積み重ね
          
          // 背景
          const gradient = ctx.createLinearGradient(x, y - 30, x + 220, y - 30);
          if (gradient) {
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
            ctx.fillStyle = gradient;
          } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
          }
          ctx.fillRect(x, y - 30, 220, 35);
          
          // 枠線
          ctx.strokeStyle = '#ff6b6b';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y - 30, 220, 35);
          
          // テキスト
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(`${notification.nation.flag} ${notification.nation.name} 撃破！`, x + 10, y - 10);
          
          // スコア表示
          ctx.font = '12px Arial';
          ctx.fillStyle = '#ffd700';
          const reward = GDPEnemySystem.calculateReward(notification.nation.gdp);
          const rewardText = `+${reward}💰`;
          ctx.fillText(rewardText, x + 170, y - 10);
          
          ctx.restore();
        });
        
        return displayNotifications;
      });

      // 国家ファクトの表示
      if (nationFactDisplay) {
        const age = timestamp - nationFactDisplay.timestamp;
        const duration = 10000; // 10秒間表示
        
        if (age <= duration) {
          const opacity = Math.max(0, 1 - age / duration);
          
          ctx.save();
          ctx.globalAlpha = opacity;
          
          // 中央やや下に表示
          const maxWidth = 600;
          const x = (800 - maxWidth) / 2;
          const y = 250;
          
          // テキストの高さを計算
          ctx.font = '14px Arial';
          const lines = wrapText(ctx, nationFactDisplay.fact, maxWidth - 40);
          const textHeight = lines.length * 20 + 80; // 行数 * 行高 + パディング
          
          // 背景
          const gradient = ctx.createLinearGradient(x, y, x + maxWidth, y);
          gradient.addColorStop(0, 'rgba(20, 20, 30, 0.95)');
          gradient.addColorStop(0.5, 'rgba(30, 30, 40, 0.95)');
          gradient.addColorStop(1, 'rgba(20, 20, 30, 0.95)');
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, maxWidth, textHeight);
          
          // 枠線（赤）
          ctx.strokeStyle = '#ff4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, maxWidth, textHeight);
          
          // ヘッダー
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px Arial';
          ctx.fillText(`${nationFactDisplay.flag} ${nationFactDisplay.nationName}`, x + 20, y + 30);
          
          // ファクトテキスト（複数行対応）
          ctx.font = '14px Arial';
          ctx.fillStyle = '#e0e0e0';
          lines.forEach((line, index) => {
            ctx.fillText(line, x + 20, y + 60 + index * 20);
          });
          
          // クリックで詳細を見るテキスト
          ctx.font = '12px Arial';
          ctx.fillStyle = '#66ccff';
          ctx.fillText('クリックして詳細を見る →', x + 20, y + textHeight - 15);
          
          // クリック可能エリアを保存
          if (canvasRef.current) {
            (canvasRef.current as any).factClickArea = {
              x, y, width: maxWidth, height: textHeight,
              source: nationFactDisplay.source
            };
          }
          
          ctx.restore();
        } else {
          // 表示時間が過ぎたらクリア
          setNationFactDisplay(null);
          if (canvasRef.current) {
            (canvasRef.current as any).factClickArea = null;
          }
        }
      }

      // Wave完了通知の表示（撃破国家一覧）
      if (waveCompleteNotification && waveCompleteNotification.show) {
        const notification = waveCompleteNotification;
        const nations = notification.nations;
        const width = 600;
        const height = Math.min(300, 100 + nations.length * 30);
        const x = (800 - width) / 2;
        const y = 50;
        
        // Store notification bounds for click detection
        waveCompleteNotificationRef.current = { x, y, width, height };
        
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
        ctx.fillRect(x, y, width, height);
        
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Hover effect hint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x + 3, y + 3, width - 6, height - 6);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('🏆 Wave完了！撃破国家一覧(げきは こっか いちらん)', x + 20, y + 35);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText('(クリックして新国家通知を表示)', x + 350, y + 35);
        
        ctx.font = '16px Arial';
        let yOffset = y + 70;
        nations.slice(0, 8).forEach((nation, index) => {
          // Draw actual flag instead of emoji
          FlagRenderer.drawFlag(
            ctx,
            nation.id,
            x + 20,
            yOffset - 15,
            30,
            20,
            nation.colors
          );
          
          ctx.fillStyle = '#ffffff';
          ctx.fillText(nation.name, x + 60, yOffset);
          
          const rarity = GDPEnemySystem.getRarity(nation.gdp);
          ctx.fillStyle = rarity.color;
          ctx.fillText(`★${rarity.stars} GDP: ${nation.gdp.toLocaleString()}`, x + 300, yOffset);
          
          yOffset += 30;
        });
        
        if (nations.length > 8) {
          ctx.fillStyle = '#999999';
          ctx.fillText(`他 ${nations.length - 8} カ国...`, x + 20, yOffset);
        }
        
        ctx.restore();
      } else {
        // Clear the reference when not showing
        waveCompleteNotificationRef.current = null;
      }

      // 新国家獲得通知の表示（Wave完了通知が非表示の時のみ表示）
      if (newNationNotification && newNationNotification.show && !waveCompleteNotification?.show) {
        const notification = newNationNotification;
        const ability = getAbilityDescriptionWithBonus(notification.nation.id);
        const rarity = GDPEnemySystem.getRarity(notification.nation.gdp);
        
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(200, 20, 400, 80);
        
        ctx.strokeStyle = rarity.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(200, 20, 400, 80);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('🎉 新(あたら)しい国家(こっか)を獲得(かくとく)！', 220, 50);
        
        ctx.font = '16px Arial';
        ctx.fillText(`${notification.nation.flag} ${notification.nation.name} (★${rarity.stars})`, 220, 75);
        ctx.fillText(ability, 220, 95);
        ctx.restore();
      }

      // セーブ通知の表示
      if (saveNotification && saveNotification.show) {
        const age = timestamp - saveNotification.timestamp;
        if (age < 3000) {
          ctx.save();
          const opacity = Math.max(0, 1 - age / 3000);
          ctx.globalAlpha = opacity;
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.fillRect(300, 180, 200, 60);
          
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 3;
          ctx.strokeRect(300, 180, 200, 60);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px Arial';
          ctx.fillText('✓ セーブ完了！', 330, 215);
          ctx.restore();
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isWaveActive, wave, displayWave, gameModifiers, specialEffects, newNationNotification, waveCompleteNotification, ownedNations, selectedNation, towerLifespan, defeatedNations, attackEffects, defeatNotifications, saveNotification]);

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

    // Check if clicking on nation fact display
    if ((canvas as any).factClickArea) {
      const area = (canvas as any).factClickArea;
      if (x >= area.x && x <= area.x + area.width && 
          y >= area.y && y <= area.y + area.height) {
        window.open(area.source, '_blank');
        setNationFactDisplay(null);
        (canvas as any).factClickArea = null;
        return;
      }
    }

    // Check if clicking on wave complete notification
    if (waveCompleteNotificationRef.current && waveCompleteNotification?.show) {
      const notif = waveCompleteNotificationRef.current;
      if (x >= notif.x && x <= notif.x + notif.width && 
          y >= notif.y && y <= notif.y + notif.height) {
        // Hide wave complete notification and show new nation notification if available
        setWaveCompleteNotification(null);
        if (newNationNotification && !newNationNotification.show) {
          setNewNationNotification({ ...newNationNotification, show: true });
          // Auto-hide after 5 seconds
          setTimeout(() => {
            setNewNationNotification(null);
          }, 5000);
        }
        return;
      }
    }

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
      placedAtWave: isWaveActive ? displayWave : wave // Wave間に配置した場合は次のWaveとして記録
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
    defeatedInCurrentWave.current = []; // Reset defeated nations for new wave

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
          <p className="text-gray-400">世界の<ruby>国旗<rt>こっき</rt></ruby>で<ruby>基地<rt>きち</rt></ruby>を<ruby>守<rt>まも</rt></ruby>れ！</p>
        </header>
        
        {/* ステータスバー */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-testid="game-card">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-xl shadow-lg">
            <div className="text-3xl font-bold">💰 {coins.toLocaleString()}</div>
            <div className="text-sm opacity-80">コイン</div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-xl shadow-lg">
            <div className="text-3xl font-bold">🌊 Wave {displayWave}</div>
            <div className="text-sm opacity-80"><ruby>現在<rt>げんざい</rt></ruby>のWave</div>
          </div>
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-xl shadow-lg">
            <div className="text-3xl font-bold">❤️ {lives}</div>
            <div className="text-sm opacity-80"><ruby>残機<rt>ざんき</rt></ruby></div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl shadow-lg">
            <div className="text-3xl font-bold">🏳️ {ownedNations.length}</div>
            <div className="text-sm opacity-80"><ruby>所有<rt>しょゆう</rt></ruby><ruby>国家<rt>こっか</rt></ruby></div>
          </div>
        </div>

        {/* コントロールパネル */}
        <div className="bg-black bg-opacity-50 p-4 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setShowSideShop(!showSideShop)}
              className={`px-6 py-3 rounded-xl font-bold text-lg shadow-xl transition-all ${
                showSideShop 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {showSideShop ? "🛒 ショップを閉(と)じる" : "🛒 ショップを開(ひら)く"}
            </button>
            
            <select
              value={selectedNation}
              onChange={(e) => setSelectedNation(e.target.value)}
              className="bg-gray-800 px-4 py-3 rounded-lg border border-gray-600 text-white"
            >
              {ownedNations.map(nationId => {
                const nation = NATION_DATABASE.find(n => n.id === nationId);
                if (!nation) return null;
                const rarity = GDPEnemySystem.getRarity(nation.gdp);
                const ability = getAbilityDescriptionWithBonus(nationId);
                return (
                  <option key={nationId} value={nationId}>
                    {nation.flag} {nation.name} (★{rarity.stars}) - {ability}
                  </option>
                );
              })}
            </select>
            <div className="text-sm text-gray-400">
              <ruby>配置<rt>はいち</rt></ruby>コスト: 💰 50 ({towerLifespan}Wave<ruby>後<rt>ご</rt></ruby>に<ruby>消滅<rt>しょうめつ</rt></ruby>)
            </div>
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
            role="img"
            aria-label="ゲームキャンバス"
          />
          
        </div>

        {/* アクションボタン */}
        <div className="flex flex-wrap gap-4 justify-center mb-6 relative z-10">
          <button
            onClick={startWave}
            disabled={isWaveActive}
            className={`px-8 py-4 rounded-xl font-bold text-xl shadow-2xl transition-all transform ${
              isWaveActive 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:scale-105'
            }`}
          >
            <span className="relative z-10">
              {isWaveActive ? '⏳ Wave進行中(しんこうちゅう)...' : `🌊 Wave ${wave} 開始(かいし)`}
            </span>
          </button>
        </div>

        {/* 操作説明 */}
        <div className="bg-black bg-opacity-50 p-6 rounded-xl backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-3">🎮 <ruby>操作<rt>そうさ</rt></ruby><ruby>方法<rt>ほうほう</rt></ruby></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>💡 キャンバスをクリックしてタワーを<ruby>配置<rt>はいち</rt></ruby>（<ruby>規定<rt>きてい</rt></ruby>のWave<ruby>後<rt>ご</rt></ruby>に<ruby>消滅<rt>しょうめつ</rt></ruby>）</div>
            <div>🏪 ショップで<ruby>国家<rt>こっか</rt></ruby><ruby>購入<rt>こうにゅう</rt></ruby>やパワーアップ</div>
            <div>⚔️ <ruby>各国<rt>かくこく</rt></ruby>の<ruby>特殊<rt>とくしゅ</rt></ruby><ruby>能力<rt>のうりょく</rt></ruby>を<ruby>活用<rt>かつよう</rt></ruby>して<ruby>戦略<rt>せんりゃく</rt></ruby>を<ruby>立<rt>た</rt></ruby>てよう</div>
            <div>🎰 Wave<ruby>完了<rt>かんりょう</rt></ruby>で<ruby>新<rt>あたら</rt></ruby>しい<ruby>国家<rt>こっか</rt></ruby>を<ruby>自動<rt>じどう</rt></ruby><ruby>獲得<rt>かくとく</rt></ruby>！</div>
          </div>
        </div>



        {/* サイドショップ */}
        {showSideShop && (
          <SideShop
            coins={coins}
            lives={lives}
            ownedNations={ownedNations}
            powerupsPurchased={powerupsPurchased}
            defeatedNations={defeatedNations}
            onPurchase={(itemId, cost) => {
              if (coins >= cost) {
                setCoins(coins - cost);
                handleShopPurchase({ 
                  id: itemId, 
                  name: '', 
                  description: '', 
                  cost, 
                  type: 'powerup', 
                  icon: '' 
                }, coins - cost);
              }
            }}
            onLivesPurchase={() => {
              const lifePrice = 300 + (lives - 1) * 200;
              if (coins >= lifePrice) {
                setCoins(coins - lifePrice);
                setLives(lives + 1);
              }
            }}
            onNationPurchase={(nationId, cost) => {
              if (coins >= cost) {
                setCoins(coins - cost);
                handleNationPurchase(nationId);
              }
            }}
            onShowNationFact={(nationId, nationName, flag) => {
              const fact = getCountryFact(nationId.toLowerCase().replace(/-/g, '_'));
              if (!fact) {
                // Special cases mapping
                const idMap: Record<string, string> = {
                  'united-kingdom': 'united_kingdom',
                  'uk': 'united_kingdom',
                  'south-korea': 'south_korea',
                  'north-korea': 'north_korea',
                  'saudi-arabia': 'saudi_arabia',
                  'south-africa': 'south_africa',
                  'new-zealand': 'new_zealand',
                  'hong-kong': 'hong_kong',
                  'czech-republic': 'czech',
                  'dominican-republic': 'dominican',
                  'bosnia-herzegovina': 'bosnia',
                  'united-states': 'usa',
                  'us': 'usa',
                  'vatican-city': 'vatican',
                  'antigua-and-barbuda': 'antigua_barbuda',
                  'trinidad-and-tobago': 'trinidad_tobago'
                };
                const mappedId = idMap[nationId.toLowerCase()] || nationId.toLowerCase();
                const mappedFact = getCountryFact(mappedId);
                if (mappedFact) {
                  setNationFactDisplay({
                    nationId,
                    nationName,
                    flag,
                    fact: mappedFact.fact,
                    source: mappedFact.source,
                    timestamp: performance.now()
                  });
                }
              } else {
                setNationFactDisplay({
                  nationId,
                  nationName,
                  flag,
                  fact: fact.fact,
                  source: fact.source,
                  timestamp: performance.now()
                });
              }
            }}
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