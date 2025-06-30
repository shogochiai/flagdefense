import React, { useRef, useEffect, useState } from 'react';
import { vegetables, enemies as enemyData } from '../data/vegetables';
import { GameState, createInitialGameState } from '../core/GameState';
import { GameRenderer } from '../core/GameRenderer';
import { GAME_CONFIG, PATH_POINTS, WAVE_CONFIG } from '../core/GameConfig';
import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Vegetable } from '../data/vegetables';
import { AssetManager } from '../core/AssetManager';

export const VeggieDefenseGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>(createInitialGameState());
  const animationIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const rendererRef = useRef<GameRenderer | null>(null);

  const [selectedVegetable, setSelectedVegetable] = useState<Vegetable | null>(null);
  const [gameStats, setGameStats] = useState({
    coins: GAME_CONFIG.STARTING_COINS,
    lives: GAME_CONFIG.STARTING_LIVES,
    wave: 0,
    isPaused: false,
  });
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [partyMode, setPartyMode] = useState(false);
  const [showVeggieCategories, setShowVeggieCategories] = useState(false);

  useEffect(() => {
    // Load all assets on mount
    const loadAssets = async () => {
      const assetManager = AssetManager.getInstance();
      try {
        await assetManager.loadAllVegetableImages(vegetables);
        setAssetsLoaded(true);
      } catch (error) {
        console.error('Failed to load some assets:', error);
        // Continue anyway, will fall back to emojis
        setAssetsLoaded(true);
      }
    };
    
    loadAssets();
  }, []);

  useEffect(() => {
    if (!assetsLoaded) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    rendererRef.current = new GameRenderer(ctx);
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const gameState = gameStateRef.current;
      
      if (!gameState.isPaused && !gameState.isGameOver && !gameState.isVictory) {
        updateGame(deltaTime, gameState);
      }

      rendererRef.current?.render(gameState);
      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [assetsLoaded]);

  const updateGame = (deltaTime: number, gameState: GameState) => {
    // Spawn enemies
    spawnEnemies(gameState);

    // Update enemies
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
      const enemy = gameState.enemies[i];
      const reachedEnd = enemy.update(deltaTime);

      if (reachedEnd) {
        gameState.lives -= enemy.data.damage;
        gameState.enemies.splice(i, 1);
        
        if (gameState.lives <= 0) {
          gameState.isGameOver = true;
        }
      } else if (!enemy.isAlive()) {
        gameState.coins += enemy.data.reward;
        gameState.enemies.splice(i, 1);
        
        // Party mode celebration for defeated enemies!
        if (partyMode) {
          createDefeatParticles(enemy.position, enemy.data.color);
          if (Math.random() < 0.3) {
            showCelebration(['🎉', '💥', '⭐', '✨'][Math.floor(Math.random() * 4)]);
          }
        }
      }
    }

    // Update towers
    gameState.towers.forEach(tower => {
      const target = findNearestEnemy(tower, gameState.enemies);
      if (target && tower.canAttack(Date.now())) {
        tower.performAttack(Date.now());
        
        const projectile = new Projectile(
          tower.position,
          target,
          tower.attack,
          300,
          tower.vegetable.color
        );

        // Apply special abilities
        if (tower.vegetable.id === 'carrot') {
          projectile.piercing = true;
        }

        gameState.projectiles.push(projectile);
      }
    });

    // Update projectiles
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
      const projectile = gameState.projectiles[i];
      const shouldRemove = projectile.update(deltaTime);
      
      if (shouldRemove) {
        gameState.projectiles.splice(i, 1);
      }
    }

    // Check wave completion
    if (gameState.waveInProgress && 
        gameState.enemies.length === 0 && 
        gameState.enemiesSpawned >= WAVE_CONFIG[gameState.wave]?.count) {
      gameState.waveInProgress = false;
      
      if (gameState.wave >= WAVE_CONFIG.length - 1) {
        gameState.isVictory = true;
      }
    }

    // Update UI
    setGameStats({
      coins: gameState.coins,
      lives: gameState.lives,
      wave: gameState.wave,
      isPaused: gameState.isPaused,
    });
  };

  const spawnEnemies = (gameState: GameState) => {
    if (!gameState.waveInProgress || gameState.wave >= WAVE_CONFIG.length) return;

    const waveConfig = WAVE_CONFIG[gameState.wave];
    const currentTime = Date.now();

    if (gameState.enemiesSpawned < waveConfig.count &&
        currentTime - gameState.lastSpawnTime >= waveConfig.interval) {
      
      const enemyTypes = waveConfig.enemies;
      const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const enemyTemplate = enemyData.find(e => e.id === enemyType);
      
      if (enemyTemplate) {
        const enemy = new Enemy(enemyTemplate, PATH_POINTS);
        gameState.enemies.push(enemy);
        gameState.enemiesSpawned++;
        gameState.lastSpawnTime = currentTime;
      }
    }
  };

  const findNearestEnemy = (tower: Tower, enemies: Enemy[]): Enemy | null => {
    let nearest: Enemy | null = null;
    let minDistance = Infinity;

    enemies.forEach(enemy => {
      if (enemy.isAlive() && tower.isInRange(enemy.position)) {
        const distance = tower.distanceTo(enemy.position);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = enemy;
        }
      }
    });

    return nearest;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const gridX = Math.floor(x / GAME_CONFIG.GRID_SIZE) * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2;
    const gridY = Math.floor(y / GAME_CONFIG.GRID_SIZE) * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2;

    const gameState = gameStateRef.current;

    if (selectedVegetable && gameState.coins >= selectedVegetable.cost) {
      // Check if position is valid (not on path or existing tower)
      const isOnPath = isPositionOnPath(gridX, gridY);
      const hasExistingTower = gameState.towers.some(t => 
        Math.abs(t.position.x - gridX) < GAME_CONFIG.GRID_SIZE &&
        Math.abs(t.position.y - gridY) < GAME_CONFIG.GRID_SIZE
      );

      if (!isOnPath && !hasExistingTower) {
        const tower = new Tower({ x: gridX, y: gridY }, selectedVegetable);
        gameState.towers.push(tower);
        gameState.coins -= selectedVegetable.cost;
        setSelectedVegetable(null);
      }
    }
  };

  const isPositionOnPath = (x: number, y: number): boolean => {
    for (let i = 0; i < PATH_POINTS.length - 1; i++) {
      const p1 = PATH_POINTS[i];
      const p2 = PATH_POINTS[i + 1];
      
      const distToLine = distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y);
      if (distToLine < 30) return true;
    }
    return false;
  };

  const distanceToLineSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const startWave = () => {
    const gameState = gameStateRef.current;
    if (!gameState.waveInProgress && gameState.wave < WAVE_CONFIG.length) {
      gameState.wave++;
      gameState.waveInProgress = true;
      gameState.enemiesSpawned = 0;
      gameState.lastSpawnTime = Date.now();
    }
  };

  const togglePause = () => {
    gameStateRef.current.isPaused = !gameStateRef.current.isPaused;
  };

  const togglePartyMode = () => {
    setPartyMode(!partyMode);
    if (!partyMode) {
      showCelebration('🎆 VEGGIE PARTY MODE! 🎆');
    }
  };

  const showCelebration = (message: string) => {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = message;
    document.body.appendChild(celebration);
    
    // Add confetti
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
    
    setTimeout(() => celebration.remove(), 2000);
  };

  const createDefeatParticles = (position: Position, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'defeat-particle';
      particle.style.left = rect.left + position.x + 'px';
      particle.style.top = rect.top + position.y + 'px';
      particle.style.backgroundColor = color;
      
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
      particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 500);
    }
  };

  // Categorize vegetables by cost tier
  const veggieTiers = {
    basic: vegetables.filter(v => v.cost <= 80),
    speed: vegetables.filter(v => v.cost > 80 && v.cost <= 100),
    range: vegetables.filter(v => v.cost > 100 && v.cost <= 120),
    special: vegetables.filter(v => v.cost > 120 && v.cost <= 150 && v.ability),
    power: vegetables.filter(v => v.cost > 150)
  };

  const resetGame = () => {
    gameStateRef.current = createInitialGameState();
    setSelectedVegetable(null);
  };

  if (!assetsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700 mb-2">Loading assets...</div>
          <div className="text-gray-600">野菜の画像を読み込んでいます...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 ${partyMode ? 'party-mode' : 'bg-gray-100'}`}>
      <h1 className="text-4xl font-bold mb-4 text-green-700 veggie-bounce">🥗 Veggie Defense 🥗</h1>
      
      <div className="flex gap-4 mb-4">
        <div className="bg-white rounded-lg shadow p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">野菜を選択</h2>
            <button
              onClick={() => setShowVeggieCategories(!showVeggieCategories)}
              className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              {showVeggieCategories ? '全表示' : 'カテゴリ'}
            </button>
          </div>
          {!showVeggieCategories ? (
            <div className="grid grid-cols-4 gap-2">
              {vegetables.map((veg, index) => (
              <button
                key={veg.id}
                onClick={() => setSelectedVegetable(veg)}
                disabled={gameStats.coins < veg.cost}
                className={`p-2 rounded border-2 transition-all veggie-tower ${
                  selectedVegetable?.id === veg.id 
                    ? 'border-green-500 bg-green-100 selected-tower' 
                    : 'border-gray-300 hover:border-gray-400'
                } ${gameStats.coins < veg.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{'--tower-index': index} as React.CSSProperties}
              >
                <img 
                  src={veg.imagePath} 
                  alt={veg.name}
                  className="w-8 h-8 mx-auto"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="text-2xl hidden">{veg.emoji}</div>
                <div className="text-xs">{veg.name}</div>
                <div className="text-xs font-bold">💰{veg.cost}</div>
              </button>
            ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-600">🌱 Basic (50-80 coins)</h3>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {veggieTiers.basic.map((veg, index) => (
                    <button
                      key={veg.id}
                      onClick={() => setSelectedVegetable(veg)}
                      disabled={gameStats.coins < veg.cost}
                      className={`p-1 rounded border transition-all veggie-tower text-xs ${
                        selectedVegetable?.id === veg.id 
                          ? 'border-green-500 bg-green-100' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${gameStats.coins < veg.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{'--tower-index': index} as React.CSSProperties}
                    >
                      <div className="text-lg">{veg.emoji}</div>
                      <div className="text-xs">💰{veg.cost}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600">⚡ Speed (75-100 coins)</h3>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {veggieTiers.speed.map((veg, index) => (
                    <button
                      key={veg.id}
                      onClick={() => setSelectedVegetable(veg)}
                      disabled={gameStats.coins < veg.cost}
                      className={`p-1 rounded border transition-all veggie-tower text-xs ${
                        selectedVegetable?.id === veg.id 
                          ? 'border-green-500 bg-green-100' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${gameStats.coins < veg.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{'--tower-index': index} as React.CSSProperties}
                    >
                      <div className="text-lg">{veg.emoji}</div>
                      <div className="text-xs">💰{veg.cost}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-purple-600">🎯 Range (100-120 coins)</h3>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {veggieTiers.range.map((veg, index) => (
                    <button
                      key={veg.id}
                      onClick={() => setSelectedVegetable(veg)}
                      disabled={gameStats.coins < veg.cost}
                      className={`p-1 rounded border transition-all veggie-tower text-xs ${
                        selectedVegetable?.id === veg.id 
                          ? 'border-green-500 bg-green-100' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${gameStats.coins < veg.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{'--tower-index': index} as React.CSSProperties}
                    >
                      <div className="text-lg">{veg.emoji}</div>
                      <div className="text-xs">💰{veg.cost}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-orange-600">✨ Special (120-150 coins)</h3>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {veggieTiers.special.map((veg, index) => (
                    <button
                      key={veg.id}
                      onClick={() => setSelectedVegetable(veg)}
                      disabled={gameStats.coins < veg.cost}
                      className={`p-1 rounded border transition-all veggie-tower text-xs ${
                        selectedVegetable?.id === veg.id 
                          ? 'border-green-500 bg-green-100' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${gameStats.coins < veg.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{'--tower-index': index} as React.CSSProperties}
                    >
                      <div className="text-lg">{veg.emoji}</div>
                      <div className="text-xs">💰{veg.cost}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-red-600">💥 Power (150+ coins)</h3>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {veggieTiers.power.map((veg, index) => (
                    <button
                      key={veg.id}
                      onClick={() => setSelectedVegetable(veg)}
                      disabled={gameStats.coins < veg.cost}
                      className={`p-1 rounded border transition-all veggie-tower text-xs ${
                        selectedVegetable?.id === veg.id 
                          ? 'border-green-500 bg-green-100' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${gameStats.coins < veg.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{'--tower-index': index} as React.CSSProperties}
                    >
                      <div className="text-lg">{veg.emoji}</div>
                      <div className="text-xs">💰{veg.cost}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">ゲーム情報</h2>
          <div className="space-y-2">
            <div>💰 コイン: {gameStats.coins}</div>
            <div>❤️ ライフ: {gameStats.lives}</div>
            <div>🌊 ウェーブ: {gameStats.wave}</div>
          </div>
          
          <div className="mt-4 space-y-2">
            <button
              onClick={startWave}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={gameStateRef.current.waveInProgress}
            >
              次のウェーブ開始
            </button>
            <button
              onClick={togglePause}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              {gameStats.isPaused ? '再開' : '一時停止'}
            </button>
            <button
              onClick={resetGame}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              リセット
            </button>
            <button
              onClick={togglePartyMode}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              {partyMode ? '🎉 パーティーモード ON' : '🎆 パーティーモード'}
            </button>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        className="border-4 border-green-500 rounded-lg shadow-lg cursor-crosshair"
      />
      
      {selectedVegetable && (
        <div className="mt-4 bg-yellow-100 p-4 rounded-lg">
          <p className="text-center flex items-center justify-center gap-2">
            <img 
              src={selectedVegetable.imagePath} 
              alt={selectedVegetable.name}
              className="w-8 h-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="text-2xl hidden">{selectedVegetable.emoji}</span>
            {selectedVegetable.name}を配置する場所をクリックしてください
          </p>
        </div>
      )}
    </div>
  );
};