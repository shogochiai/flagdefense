import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Coins, Flag, Swords, Trophy, Lock, Users, Heart, Play, FastForward, AlertCircle, Zap, ShoppingCart, DollarSign, Trash2 } from 'lucide-react';

// 国家データ（記事の国連非加盟国をほぼ全て収録）
const nations = [
  // Tier 1: 承認国が少ない小国
  { id: 'liberland', name: 'リベルランド', cost: 20, damage: 3, range: 80, colors: ['#FFD700', '#000000'], flag: '🏴', tier: 1 },
  { id: 'transnistria', name: '沿ドニエストル', cost: 30, damage: 4, range: 90, colors: ['#FF0000', '#00FF00'], flag: '🔨', tier: 1 },
  { id: 'somaliland', name: 'ソマリランド', cost: 40, damage: 5, range: 100, colors: ['#00A550', '#FFFFFF', '#FF0000'], flag: '⭐', tier: 1 },
  { id: 'northcyprus', name: '北キプロス', cost: 50, damage: 6, range: 100, colors: ['#FF0000', '#FFFFFF'], flag: '☪️', tier: 1 },
  
  // Tier 2: 地域的承認を持つ国
  { id: 'southossetia', name: '南オセチア', cost: 80, damage: 10, range: 110, colors: ['#FFFFFF', '#FF0000', '#FFD700'], flag: '🦅', tier: 2 },
  { id: 'abkhazia', name: 'アブハジア', cost: 100, damage: 12, range: 120, colors: ['#00A550', '#FFFFFF', '#FF0000'], flag: '🌟', tier: 2 },
  { id: 'chechnya', name: 'チェチェン', cost: 120, damage: 15, range: 120, colors: ['#00A550', '#FFFFFF', '#FF0000', '#FFD700'], flag: '🐺', tier: 2 },
  { id: 'sahrawi', name: 'サハラ・アラブ', cost: 150, damage: 18, range: 130, colors: ['#000000', '#FFFFFF', '#00A550', '#FF0000'], flag: '🌙', tier: 2 },
  
  // Tier 3: 国際的認知がある国
  { id: 'cook', name: 'クック諸島', cost: 200, damage: 22, range: 140, colors: ['#002B7F', '#FFFFFF'], flag: '🌴', tier: 3 },
  { id: 'niue', name: 'ニウエ', cost: 250, damage: 25, range: 140, colors: ['#FED100', '#002B7F'], flag: '🌺', tier: 3 },
  { id: 'kosovo', name: 'コソボ', cost: 300, damage: 30, range: 150, colors: ['#244AA5', '#D4AF37', '#FFFFFF'], flag: '🦅', tier: 3 },
  { id: 'palestine', name: 'パレスチナ', cost: 400, damage: 35, range: 160, colors: ['#000000', '#FFFFFF', '#00A550', '#FF0000'], flag: '🇵🇸', tier: 3 },
  
  // Tier 4: 特殊地位・広く認知
  { id: 'vatican', name: 'バチカン', cost: 500, damage: 45, range: 170, colors: ['#FFE000', '#FFFFFF'], flag: '✝️', tier: 4 },
  { id: 'taiwan', name: '台湾', cost: 700, damage: 55, range: 180, colors: ['#FE0000', '#000095', '#FFFFFF'], flag: '🇹🇼', tier: 4 },
  { id: 'hongkong', name: '香港', cost: 900, damage: 65, range: 190, colors: ['#FF0000', '#FFFFFF'], flag: '🌸', tier: 4 },
  { id: 'macau', name: 'マカオ', cost: 1100, damage: 75, range: 190, colors: ['#00A550', '#FFFFFF'], flag: '🎰', tier: 4 },
  
  // Tier 5: 大国（ボーナス）
  { id: 'japan', name: '日本', cost: 1500, damage: 85, range: 200, colors: ['#FFFFFF', '#BC002D'], flag: '🇯🇵', tier: 5 },
  { id: 'germany', name: 'ドイツ', cost: 2000, damage: 95, range: 210, colors: ['#000000', '#FF0000', '#FFD700'], flag: '🇩🇪', tier: 5 },
  { id: 'usa', name: 'アメリカ', cost: 3000, damage: 110, range: 220, colors: ['#B22234', '#FFFFFF', '#3C3B6E'], flag: '🇺🇸', tier: 5 },
  { id: 'china', name: '中国', cost: 4000, damage: 130, range: 240, colors: ['#EE1C25', '#FFFF00'], flag: '🇨🇳', tier: 5 }
];

// 敵データ（バランス調整）
const enemyTypes = [
  { type: 'soldier', hp: 8, speed: 40, reward: 8, size: 15, colors: ['#8B4513', '#4B0000'] },
  { type: 'tank', hp: 20, speed: 20, reward: 20, size: 20, colors: ['#2F4F4F', '#708090'] },
  { type: 'jet', hp: 12, speed: 80, reward: 15, size: 18, colors: ['#4169E1', '#87CEEB'] },
  { type: 'elite', hp: 40, speed: 30, reward: 40, size: 22, colors: ['#800080', '#FFD700', '#000000'] },
  { type: 'boss', hp: 60, speed: 15, reward: 100, size: 30, colors: ['#8B0000', '#FF4500', '#800080'] }
];

const NationTowerDefense = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, victory, defeat
  const [coins, setCoins] = useState(80); // 初期コインを調整
  const [wave, setWave] = useState(0);
  const [unlockedNations, setUnlockedNations] = useState(['liberland']);
  const [placedTowers, setPlacedTowers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [selectedNation, setSelectedNation] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);
  const [baseHealth, setBaseHealth] = useState(100);
  const [waveCountdown, setWaveCountdown] = useState(30);
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [passiveIncome, setPassiveIncome] = useState(1); // パッシブインカム
  const [hardMode, setHardMode] = useState(false); // ハードモードフラグ
  const [debugInfo, setDebugInfo] = useState([]); // デバッグ情報
  const [showDebugButton, setShowDebugButton] = useState(true); // デバッグボタン表示
  const [difficulty, setDifficulty] = useState('normal'); // 難易度設定
  const [lives, setLives] = useState(3); // 残機システム
  const [maxLives] = useState(9); // 最大残機数
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const enemiesRef = useRef([]);
  const towersRef = useRef([]);
  const baseHealthRef = useRef(100);

  // パス定義
  const path = [
    { x: 0, y: 200 },
    { x: 150, y: 200 },
    { x: 150, y: 100 },
    { x: 300, y: 100 },
    { x: 300, y: 300 },
    { x: 500, y: 300 },
    { x: 500, y: 200 },
    { x: 700, y: 200 }
  ];

  // パスの総距離を計算
  const calculatePathLength = () => {
    let totalLength = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const dx = path[i + 1].x - path[i].x;
      const dy = path[i + 1].y - path[i].y;
      totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    return totalLength;
  };

  const pathLength = calculatePathLength();

  // 難易度設定
  const difficultySettings = {
    easy: {
      coinMultiplier: 1.5,
      hpMultiplier: 0.8,
      passiveIncomeMultiplier: 2
    },
    normal: {
      coinMultiplier: 1.0,
      hpMultiplier: 1.0,
      passiveIncomeMultiplier: 1
    },
    hard: {
      coinMultiplier: 0.8,
      hpMultiplier: 1.2,
      passiveIncomeMultiplier: 0.5
    }
  };

  // キーボードイベント
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedTower) {
        // タワーを削除
        setPlacedTowers(prev => prev.filter(t => t.id !== selectedTower));
        towersRef.current = towersRef.current.filter(t => t.id !== selectedTower);
        setSelectedTower(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTower]);

  // 仕様テスト
  useEffect(() => {
    const errors = [];
    
    // テスト1: 国家データの検証
    if (nations.length !== 20) {
      errors.push("ERROR: 国家の数が20ではありません（現在: " + nations.length + "）");
    }

    // テスト2: 初期コインで最初の国が買えるか
    if (coins < nations[0].cost) {
      errors.push("ERROR: 初期コインで最初の国が購入できません");
    }

    // テスト3: パスの検証
    if (path.length < 2) {
      errors.push("ERROR: パスが正しく定義されていません");
    }

    // テスト4: 敵タイプの検証
    const requiredEnemyTypes = ['soldier', 'tank', 'jet', 'elite', 'boss'];
    requiredEnemyTypes.forEach(type => {
      if (!enemyTypes.find(e => e.type === type)) {
        errors.push(`ERROR: 敵タイプ '${type}' が定義されていません`);
      }
    });

    // テスト5: Waveアンロックの検証
    const tier1Nations = nations.filter(n => n.tier === 1).length;
    if (tier1Nations === 0) {
      errors.push("ERROR: Tier 1の国家が存在しません");
    }

    // テスト6: ショップ機能の検証
    const shopElement = document.querySelector('[data-testid="shop-catalog"]');
    if (!shopElement && gameState === 'playing') {
      errors.push("WARNING: ショップ機能が見つかりません");
    }

    // テスト7: 価格設定の検証
    const cheapestNation = nations.reduce((min, n) => n.cost < min.cost ? n : min);
    if (cheapestNation.cost > coins) {
      errors.push("WARNING: 最も安い国家でも初期コインでは購入できません");
    }

    // テスト8: 価格のバランスチェック
    const avgWaveReward = 10; // 平均的な敵1体の報酬
    const waveEnemyCount = 8; // Wave1の敵数の想定
    const waveReward = avgWaveReward * waveEnemyCount;
    if (nations[0].cost > waveReward * 0.3) {
      errors.push("WARNING: 最初の国家の価格が高すぎる可能性があります（1Wave報酬の30%を超過）");
    }

    // テスト9: デバッグボタンの検証
    if (!showDebugButton && gameState === 'playing') {
      errors.push("INFO: デバッグボタンが非表示になっています");
    }

    setDebugInfo(errors);
  }, [gameState, coins, showDebugButton]);

  // 累積コイン計算
  const calculateCumulativeCoins = (waveNumber) => {
    let total = 80; // 初期コイン
    
    // 各Waveの基本報酬（簡易計算）
    for (let w = 1; w < waveNumber; w++) {
      const enemyCount = Math.min(25, w + 4);
      const baseReward = 10; // 平均報酬
      const waveReward = enemyCount * baseReward;
      total += waveReward;
      
      // パッシブインカム（30秒/Wave）
      const passiveLevel = Math.floor(w / 3) + 1;
      total += passiveLevel * 30;
    }
    
    return total;
  };
  
  // 理論火力計算
  const calculateTheoreticalDPS = (cumulativeCoins, waveNumber) => {
    // 利用可能なTierを計算
    const availableTier = Math.min(5, Math.ceil(waveNumber / 3));
    const availableNations = nations.filter(n => n.tier <= availableTier);
    
    // コスト効率でソート（DPS/コスト）
    const sortedByEfficiency = availableNations.sort((a, b) => {
      const effA = a.damage / a.cost;
      const effB = b.damage / b.cost;
      return effB - effA;
    });
    
    let remainingCoins = cumulativeCoins;
    let totalDPS = 0;
    
    // 最適配置をシミュレート
    for (const nation of sortedByEfficiency) {
      const count = Math.floor(remainingCoins / nation.cost);
      if (count > 0) {
        const maxCount = Math.min(count, 3); // 同一国家は最大3つまで
        totalDPS += nation.damage * maxCount;
        remainingCoins -= nation.cost * maxCount;
      }
      if (remainingCoins < 20) break; // 最安値未満
    }
    
    return totalDPS;
  };
  
  // Wave別の敵HP計算
  const getEnemyHPForWave = (waveNumber, enemyType) => {
    const cumulativeCoins = calculateCumulativeCoins(waveNumber);
    const theoreticalDPS = calculateTheoreticalDPS(cumulativeCoins, waveNumber);
    
    // パス通過時間（概算）
    const avgSpeed = 40;
    const transitTime = pathLength / avgSpeed / 60; // 秒に変換
    
    // 難易度係数（Waveが進むにつれて上昇）
    const difficultyFactor = Math.min(0.8, 0.6 + (waveNumber - 1) * 0.01);
    
    // 基本HP = 理論火力 × 通過時間 × 難易度係数
    const baseHP = Math.max(5, Math.floor(theoreticalDPS * transitTime * difficultyFactor));
    
    // 敵タイプ別の倍率
    const typeMultipliers = {
      soldier: 1.0,
      jet: 0.8,
      tank: 2.0,
      elite: 3.0,
      boss: 5.0
    };
    
    return Math.floor(baseHP * typeMultipliers[enemyType]);
  };

  // パッシブインカム
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setCoins(c => c + passiveIncome);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, passiveIncome]);

  // 初期タワー配置
  useEffect(() => {
    if (gameState === 'playing' && placedTowers.length === 0) {
      // 初期タワーを配置
      const initialTower = {
        id: Date.now(),
        nationId: 'liberland',
        x: 225,
        y: 150,
        lastShot: 0
      };
      setPlacedTowers([initialTower]);
      towersRef.current = [initialTower];
    }
  }, [gameState, placedTowers.length]);

  // baseHealthの同期
  useEffect(() => {
    baseHealthRef.current = baseHealth;
  }, [baseHealth]);

  // 国旗を描画（改善版）
  const renderFlag = (colors, x, y, size = 30, isEnemy = false) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.save();
    
    // 背景
    ctx.fillStyle = colors[0];
    ctx.fillRect(x - size/2, y - size/2, size, size);
    
    // 複数色の国旗パターン
    if (colors.length >= 2) {
      if (colors.length === 2) {
        // 2色：横分割
        ctx.fillStyle = colors[1];
        ctx.fillRect(x - size/2, y, size, size/2);
      } else if (colors.length === 3) {
        // 3色：横3分割
        const h = size / 3;
        ctx.fillStyle = colors[1];
        ctx.fillRect(x - size/2, y - size/2 + h, size, h);
        ctx.fillStyle = colors[2];
        ctx.fillRect(x - size/2, y - size/2 + h*2, size, h);
      } else if (colors.length === 4) {
        // 4色：パレスチナ風（横縞）
        const h = size / 3;
        ctx.fillStyle = colors[1];
        ctx.fillRect(x - size/2, y - size/2 + h, size, h);
        ctx.fillStyle = colors[2];
        ctx.fillRect(x - size/2, y - size/2 + h*2, size, h);
        
        // 左側に三角形
        ctx.beginPath();
        ctx.moveTo(x - size/2, y - size/2);
        ctx.lineTo(x - size/2 + size/3, y);
        ctx.lineTo(x - size/2, y + size/2);
        ctx.closePath();
        ctx.fillStyle = colors[3];
        ctx.fill();
      }
    }
    
    // 枠線
    ctx.strokeStyle = isEnemy ? '#8B0000' : '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size/2, y - size/2, size, size);
    
    ctx.restore();
  };

  // ゲームループ
  const gameLoop = useCallback((timestamp) => {
    if (gameState !== 'playing') return;

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // キャンバスクリア
    ctx.clearRect(0, 0, 800, 400);

    // パス描画
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    path.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // タワー描画と攻撃
    towersRef.current = placedTowers;
    placedTowers.forEach(tower => {
      const nation = nations.find(n => n.id === tower.nationId);
      if (!nation) return;
      
      // 選択されているタワーをハイライト
      if (selectedTower === tower.id) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(tower.x - 20, tower.y - 20, 40, 40);
      }
      
      renderFlag(nation.colors, tower.x, tower.y);
      
      // 国旗の上にシンボル
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nation.flag, tower.x, tower.y);

      // 射程範囲表示（選択時のみ）
      if (selectedNation === tower.nationId || selectedTower === tower.id) {
        ctx.strokeStyle = `${nation.colors[0]}33`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, nation.range, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 最も近い敵を攻撃
      if (timestamp - tower.lastShot > 1000) {
        const target = enemiesRef.current.find(enemy => {
          const dist = Math.sqrt(Math.pow(enemy.x - tower.x, 2) + Math.pow(enemy.y - tower.y, 2));
          return dist <= nation.range && enemy.hp > 0;
        });

        if (target) {
          tower.lastShot = timestamp;
          // 攻撃エフェクト
          ctx.strokeStyle = nation.colors[0];
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(tower.x, tower.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
          
          target.hp -= nation.damage;
          if (target.hp <= 0) {
            const rewardWithDifficulty = Math.floor(target.reward * difficultySettings[difficulty].coinMultiplier);
            setCoins(c => c + rewardWithDifficulty);
          }
        }
      }
    });

    // 敵の更新と描画
    const updatedEnemies = enemiesRef.current.filter(enemy => {
      if (enemy.hp <= 0) return false;

      // パスに沿って移動
      const distance = enemy.speed * deltaTime / 1000;
      enemy.pathProgress += distance;
      
      // パス上の位置を計算
      let totalDistance = 0;
      let currentSegment = 0;
      
      for (let i = 0; i < path.length - 1; i++) {
        const segmentLength = Math.sqrt(
          Math.pow(path[i + 1].x - path[i].x, 2) + 
          Math.pow(path[i + 1].y - path[i].y, 2)
        );
        
        if (totalDistance + segmentLength >= enemy.pathProgress) {
          currentSegment = i;
          break;
        }
        totalDistance += segmentLength;
      }
      
      if (currentSegment >= path.length - 1 || enemy.pathProgress >= pathLength) {
        // 基地に到達
        setBaseHealth(h => {
          const newHealth = Math.max(0, h - 10);
          baseHealthRef.current = newHealth;
          return newHealth;
        });
        return false;
      }

      // 位置計算
      const from = path[currentSegment];
      const to = path[currentSegment + 1];
      const segmentProgress = (enemy.pathProgress - totalDistance) / 
        Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
      
      enemy.x = from.x + (to.x - from.x) * segmentProgress;
      enemy.y = from.y + (to.y - from.y) * segmentProgress;

      // 敵を国旗風に描画
      renderFlag(enemy.colors, enemy.x, enemy.y, enemy.size, true);
      
      // HP表示
      const hpRatio = enemy.hp / enemy.maxHp;
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(enemy.x - 15, enemy.y - enemy.size/2 - 8, 30, 4);
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(enemy.x - 15, enemy.y - enemy.size/2 - 8, 30 * hpRatio, 4);

      return true;
    });

    enemiesRef.current = updatedEnemies;
    setEnemies(updatedEnemies);

    // 基地描画
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(680, 180, 40, 40);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(680, 180, 40, 40);
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏰', 700, 205);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, placedTowers, selectedNation, selectedTower, difficulty]);

  // ウェーブ生成
  const startWave = useCallback((isHardSkip = false) => {
    setIsWaveActive(true);
    const newWave = wave + 1;
    setWave(newWave);
    setWaveCountdown(30);

    // ハードスキップの処理
    if (isHardSkip) {
      setCoins(c => c * 2);
      setHardMode(true);
    } else {
      setHardMode(false);
    }

    // パッシブインカム増加
    if (newWave % 3 === 0) {
      const baseIncrease = 1;
      const adjustedIncrease = Math.floor(baseIncrease * difficultySettings[difficulty].passiveIncomeMultiplier);
      setPassiveIncome(prev => prev + adjustedIncrease);
    }

    // 敵生成（25秒完了を目指す）
    const enemyCount = Math.min(50, Math.floor(newWave * 0.8) + 5); // 最大50体
    const isBossWave = newWave % 15 === 0;
    const isMidBossWave = newWave % 5 === 0;

    // ハードスキップの倍率
    const hardModeMultiplier = isHardSkip ? 1.3 : 1.0;

    let spawnDelay = 0;
    
    for (let i = 0; i < enemyCount; i++) {
      setTimeout(() => {
        let enemyType;
        if (isBossWave && i === enemyCount - 1) {
          enemyType = { ...enemyTypes[4] }; // boss
        } else if (isMidBossWave && i % 5 === 0) {
          enemyType = { ...enemyTypes[1] }; // tank
        } else if (newWave >= 10 && Math.random() < 0.2) {
          enemyType = { ...enemyTypes[3] }; // elite (Wave10以降で20%の確率)
        } else {
          enemyType = { ...enemyTypes[Math.floor(Math.random() * 3)] };
        }

        // 数学的レベルデザインに基づくHP設定
        const baseHP = getEnemyHPForWave(newWave, enemyType.type);
        const adjustedHp = Math.floor(baseHP * hardModeMultiplier * difficultySettings[difficulty].hpMultiplier);

        const newEnemy = {
          id: Date.now() + Math.random(),
          ...enemyType,
          hp: adjustedHp,
          maxHp: adjustedHp,
          reward: isHardSkip ? enemyType.reward * 2 : enemyType.reward,
          x: 0,
          y: 200,
          pathProgress: 0
        };

        enemiesRef.current = [...enemiesRef.current, newEnemy];
        setEnemies(prev => [...prev, newEnemy]);
      }, spawnDelay);
      spawnDelay += 500; // 0.5秒間隔で出現（25秒で終了）
    }

    // ウェーブ終了チェック
    const checkWaveEnd = setInterval(() => {
      if (enemiesRef.current.length === 0 && isWaveActive) {
        setIsWaveActive(false);
        clearInterval(checkWaveEnd);
        
        // Wave完了時に新しい国をアンロック
        const currentMaxTier = Math.min(5, Math.ceil(newWave / 3));
        const nationsToUnlock = nations.filter(n => n.tier <= currentMaxTier).map(n => n.id);
        setUnlockedNations(prev => [...new Set([...prev, ...nationsToUnlock])]);
      }
    }, 500);
    
    setTimeout(() => {
      clearInterval(checkWaveEnd);
    }, 60000); // 60秒でタイムアウト
  }, [wave, isWaveActive, difficulty]);

  // カウントダウン
  useEffect(() => {
    if (!isWaveActive && gameState === 'playing' && waveCountdown > 0) {
      const timer = setTimeout(() => {
        setWaveCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (waveCountdown === 0 && !isWaveActive && gameState === 'playing') {
      // カウントダウンが0になったら自動的にWaveを開始
      startWave(false);
    }
  }, [waveCountdown, isWaveActive, gameState, startWave]);

  // ゲームループ開始
  useEffect(() => {
    if (gameState === 'playing') {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // 敗北チェック（残機システム対応）
  useEffect(() => {
    if (baseHealthRef.current <= 0 && gameState === 'playing') {
      if (lives > 0) {
        // 残機がある場合
        setLives(prev => prev - 1);
        setBaseHealth(100);
        baseHealthRef.current = 100;
        // 画面上の敵を全て消去
        setEnemies([]);
        enemiesRef.current = [];
        // Wave継続
        setIsWaveActive(false);
        setWaveCountdown(10); // 復活後は10秒待機
      } else {
        // 残機がない場合はゲームオーバー
        setGameState('defeat');
      }
    }
  }, [gameState, lives]);

  // 勝利チェック
  useEffect(() => {
    if (unlockedNations.length === nations.length && enemies.length === 0 && !isWaveActive && gameState === 'playing') {
      setGameState('victory');
    }
  }, [unlockedNations, enemies, isWaveActive, gameState]);

  // タワー配置
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 既存のタワーをクリックしたか確認
    const clickedTower = placedTowers.find(tower => {
      const dist = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
      return dist < 20;
    });

    if (clickedTower) {
      setSelectedTower(clickedTower.id);
      setSelectedNation(null);
      return;
    }

    // 新しいタワーを配置
    if (selectedNation && gameState === 'playing') {
      // パス上には配置できない
      let onPath = false;
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const dist = Math.abs((to.y - from.y) * x - (to.x - from.x) * y + to.x * from.y - to.y * from.x) / 
          Math.sqrt(Math.pow(to.y - from.y, 2) + Math.pow(to.x - from.x, 2));
        
        // パスとの距離をチェック（パスの幅を考慮）
        if (dist < 30) {
          // 線分の範囲内かチェック
          const dotProduct = ((x - from.x) * (to.x - from.x) + (y - from.y) * (to.y - from.y)) / 
            (Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
          
          if (dotProduct >= 0 && dotProduct <= 1) {
            onPath = true;
            break;
          }
        }
      }

      if (!onPath) {
        const nation = nations.find(n => n.id === selectedNation);
        if (coins >= nation.cost) {
          setCoins(prev => prev - nation.cost);
          const newTower = {
            id: Date.now(),
            nationId: selectedNation,
            x,
            y,
            lastShot: 0
          };
          setPlacedTowers(prev => [...prev, newTower]);
          towersRef.current = [...towersRef.current, newTower];
          setSelectedNation(null);
        }
      }
    } else {
      // 何もない場所をクリックしたら選択解除
      setSelectedTower(null);
      setSelectedNation(null);
    }
  };

  // メニュー画面
  if (gameState === 'menu') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center text-white p-8 bg-black/30 rounded-lg backdrop-blur max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-2">
            <Flag className="w-12 h-12" />
            Nation Unity Defense
          </h1>
          <p className="text-xl mb-8">小国から始めて、世界統一を目指せ！</p>
          
          {debugInfo.length > 0 && (
            <div className="mb-6 p-4 bg-red-900/50 rounded-lg text-left">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                デバッグ情報（開発者向け）
              </h3>
              <textarea
                readOnly
                value={debugInfo.join('\n')}
                className="w-full h-32 p-2 bg-black/50 rounded text-sm font-mono"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  difficulty === 'easy' 
                    ? 'bg-green-600 scale-105' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Easy
                <div className="text-xs mt-1">
                  コイン1.5x 敵HP0.8x
                </div>
              </button>
              <button
                onClick={() => setDifficulty('normal')}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  difficulty === 'normal' 
                    ? 'bg-blue-600 scale-105' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Normal
                <div className="text-xs mt-1">
                  標準設定
                </div>
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  difficulty === 'hard' 
                    ? 'bg-red-600 scale-105' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Hard
                <div className="text-xs mt-1">
                  コイン0.8x 敵HP1.2x
                </div>
              </button>
            </div>
            <button
              onClick={() => setGameState('playing')}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-xl font-bold hover:scale-105 transition-transform"
            >
              ゲーム開始
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4 bg-black/50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold">{coins}</span>
            <span className="text-sm text-gray-400">(+{passiveIncome}/秒)</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold">Wave {wave}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-400" />
              <span className="text-xl font-bold">{baseHealth}/100</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(maxLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          {hardMode && (
            <div className="flex items-center gap-2 text-orange-400">
              <Zap className="w-6 h-6" />
              <span className="font-bold">HARD MODE</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!isWaveActive && (
            <>
              <div className="text-xl">
                次のウェーブまで: {waveCountdown}秒
              </div>
              <button
                onClick={() => startWave(false)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FastForward className="w-5 h-5" />
                Wave開始
              </button>
              <button
                onClick={() => startWave(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-2 transition-colors"
                title="コイン2倍、敵の強さ1.3倍"
              >
                <Zap className="w-5 h-5" />
                Hard Skip
              </button>
            </>
          )}
          {isWaveActive && (
            <div className="text-xl text-orange-400">
              Wave {wave} 進行中！
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {/* ゲーム画面 */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            onClick={handleCanvasClick}
            className="bg-gray-700 rounded-lg cursor-crosshair border-2 border-gray-600"
          />
          <div className="mt-2 text-center">
            {selectedNation && (
              <div className="text-yellow-400">
                クリックして{nations.find(n => n.id === selectedNation)?.name}を配置
              </div>
            )}
            {selectedTower && (
              <div className="text-orange-400">
                <Trash2 className="inline w-4 h-4 mr-1" />
                Deleteキーでタワーを削除
              </div>
            )}
          </div>
        </div>

        {/* 国家ショップ */}
        <div className="w-80 bg-black/50 p-4 rounded-lg" data-testid="shop-catalog">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              国家ショップ
            </h2>
            {showDebugButton && (
              <button
                onClick={() => setCoins(c => c * 2)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-1 text-sm transition-colors"
                title="デバッグ：コインを2倍にする"
              >
                <DollarSign className="w-4 h-4" />
                x2
              </button>
            )}
          </div>
          
          {/* 残機購入 */}
          {lives < maxLives && (
            <div className="mb-4 p-3 bg-red-900/30 rounded-lg border border-red-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-bold">残機購入</span>
                </div>
                <button
                  onClick={() => {
                    const price = Math.floor(500 * Math.pow(1.5, lives - 3));
                    if (coins >= price) {
                      setCoins(prev => prev - price);
                      setLives(prev => prev + 1);
                    }
                  }}
                  disabled={coins < Math.floor(500 * Math.pow(1.5, lives - 3))}
                  className={`px-3 py-1 rounded flex items-center gap-1 transition-colors ${
                    coins >= Math.floor(500 * Math.pow(1.5, lives - 3))
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  {Math.floor(500 * Math.pow(1.5, lives - 3))}
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                現在: {lives}/{maxLives} 機
              </div>
            </div>
          )}
          <div className="text-sm text-gray-400 mb-2">
            Wave {Math.ceil(unlockedNations.length / 4) * 3} クリアで新国家解放！
          </div>
          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {nations.map(nation => {
              const isUnlocked = unlockedNations.includes(nation.id);
              const canAfford = coins >= nation.cost;
              
              return (
                <button
                  key={nation.id}
                  onClick={() => isUnlocked && canAfford && setSelectedNation(nation.id)}
                  disabled={!isUnlocked || !canAfford}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                    selectedNation === nation.id
                      ? 'bg-blue-600 scale-105'
                      : isUnlocked
                      ? canAfford
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-800 opacity-50'
                      : 'bg-gray-900'
                  }`}
                >
                  <div className="text-2xl">
                    {isUnlocked ? nation.flag : <Lock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold">
                      {isUnlocked ? nation.name : '???'}
                    </div>
                    {isUnlocked && (
                      <div className="text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          {nation.cost}
                        </div>
                        <div>攻撃力: {nation.damage} | 射程: {nation.range}</div>
                      </div>
                    )}
                  </div>
                  {isUnlocked && canAfford && (
                    <div className="text-green-400 text-sm">購入可</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 勝利/敗北画面 */}
      {(gameState === 'victory' || gameState === 'defeat') && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            {gameState === 'victory' ? (
              <>
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold mb-4">世界統一達成！</h2>
                <p className="text-xl mb-4">全ての国家を味方につけました！</p>
              </>
            ) : (
              <>
                <Swords className="w-20 h-20 text-red-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold mb-4">敗北...</h2>
                <p className="text-xl mb-4">基地が破壊されました</p>
                <p className="text-lg mb-4">到達Wave: {wave}</p>
              </>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 rounded-lg text-xl font-bold hover:bg-blue-700"
            >
              もう一度プレイ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NationTowerDefense;
