import React, { useRef, useEffect, useState } from 'react';
import { SimpleGacha } from './simple-gacha';
import { useQuickSave } from './quick-save';
import { PathSystem, PathPatterns } from './improved-path';
import { FlagRenderer } from './flag-renderer';
import { GDPEnemySystem, GDPEnemy, NATION_DATABASE } from './gdp-enemy-system';

interface Tower {
  id: number;
  x: number;
  y: number;
  range: number;
  damage: number;
  lastShot: number;
  nationId: string;
}

export const IntegratedGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enemies, setEnemies] = useState<GDPEnemy[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [coins, setCoins] = useState(100);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [showGacha, setShowGacha] = useState(false);
  const [ownedNations, setOwnedNations] = useState<string[]>(['japan']); // 初期国家
  const [selectedNation, setSelectedNation] = useState<string>('japan');
  const [isWaveActive, setIsWaveActive] = useState(false);
  const animationRef = useRef<number>(0);
  const enemiesRef = useRef<GDPEnemy[]>([]);
  const towersRef = useRef<Tower[]>([]);
  const pathRef = useRef<PathSystem | null>(null);
  const waveStartTime = useRef<number>(0);
  const { save, load, hasSave } = useQuickSave() as any;

  // パスシステムの初期化
  useEffect(() => {
    pathRef.current = new PathSystem(PathPatterns.zigzag(800, 400, 4));
  }, []);

  // 敵とタワーの参照を更新
  useEffect(() => {
    enemiesRef.current = enemies;
    towersRef.current = towers;
  }, [enemies, towers]);

  // ゲームループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || !pathRef.current) return;

    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // クリア
      ctx.clearRect(0, 0, 800, 400);

      // 背景
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 800, 400);

      // パスを描画
      pathRef.current.draw(ctx);

      // 基地を描画
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(750, 170, 40, 60);
      ctx.fillStyle = '#000';
      ctx.font = '30px Arial';
      ctx.fillText('🏰', 755, 210);

      // 敵を描画と移動
      const updatedEnemies = enemiesRef.current.filter(enemy => {
        // パスに沿って移動
        enemy.pathProgress += enemy.speed * deltaTime * 0.001;
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
          setLives(prev => prev - 1);
          return false;
        }

        // HPが0以下なら削除
        if (enemy.hp <= 0) {
          setCoins(prev => prev + enemy.reward);
          return false;
        }

        return true;
      });

      // タワーを描画と攻撃
      towersRef.current.forEach(tower => {
        // 国旗を描画
        FlagRenderer.drawFlag(ctx, tower.nationId, tower.x, tower.y, 40, 30);

        // 射程範囲（デバッグ用）
        ctx.strokeStyle = 'rgba(0, 100, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
        ctx.stroke();

        // 攻撃（1秒に1回）
        if (timestamp - tower.lastShot > 1000) {
          const target = updatedEnemies.find(enemy => {
            const dist = Math.sqrt(
              Math.pow(enemy.x - tower.x, 2) + 
              Math.pow(enemy.y - tower.y, 2)
            );
            return dist <= tower.range;
          });

          if (target) {
            // 攻撃エフェクト
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tower.x, tower.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();

            target.takeDamage(tower.damage);
            tower.lastShot = timestamp;
          }
        }
      });

      enemiesRef.current = updatedEnemies;
      setEnemies(updatedEnemies);

      // Wave時間チェック（25秒）
      if (isWaveActive && timestamp - waveStartTime.current > 25000) {
        setIsWaveActive(false);
        if (updatedEnemies.length === 0) {
          setShowGacha(true);
        }
      }

      // Wave完了チェック
      if (!isWaveActive && updatedEnemies.length === 0 && enemiesRef.current.length === 0) {
        if (wave > 0) {
          setShowGacha(true);
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
  }, [isWaveActive, wave]);

  // キャンバスクリックでタワー配置
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !pathRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // パス上には配置できない
    if (pathRef.current.isOnPath(x, y)) {
      console.log('パス上には配置できません');
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
      range: 100 + Math.log10(nationData.gdp + 1) * 10, // GDPベースで射程調整
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

  // ゲームオーバーチェック
  if (lives <= 0) {
    return (
      <div className="p-4 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Game Over</h1>
          <p className="text-xl mb-4">Wave {wave - 1} まで到達</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-lg"
          >
            もう一度プレイ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Flag Defence - GDP System</h1>
      
      {/* ゲーム情報 */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <div className="bg-gray-800 p-3 rounded">
          💰 コイン: {coins}
        </div>
        <div className="bg-gray-800 p-3 rounded">
          🌊 Wave: {wave}
        </div>
        <div className="bg-gray-800 p-3 rounded">
          ❤️ 残機: {lives}
        </div>
        <div className="bg-gray-800 p-3 rounded">
          🏳️ 所有国家: {ownedNations.length}
        </div>
      </div>

      {/* 国家選択 */}
      <div className="mb-4">
        <label className="block text-sm mb-2">配置する国家:</label>
        <select
          value={selectedNation}
          onChange={(e) => setSelectedNation(e.target.value)}
          className="bg-gray-800 p-2 rounded border border-gray-600"
        >
          {ownedNations.map(nationId => {
            const nation = NATION_DATABASE.find(n => n.id === nationId);
            if (!nation) return null;
            const rarity = GDPEnemySystem.getRarity(nation.gdp);
            return (
              <option key={nationId} value={nationId}>
                {nation.flag} {nation.name} (★{rarity.stars})
              </option>
            );
          })}
        </select>
      </div>

      {/* ゲームキャンバス */}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onClick={handleCanvasClick}
        className="border border-gray-600 bg-gray-800 cursor-crosshair"
      />

      {/* Wave進行状況 */}
      {isWaveActive && (
        <div className="mt-2 bg-gray-800 p-2 rounded">
          <div className="text-sm">Wave {wave - 1} 進行中...</div>
          <div className="w-full bg-gray-700 h-2 rounded mt-1">
            <div 
              className="bg-blue-500 h-2 rounded transition-all duration-1000"
              style={{ width: '100%', animation: 'shrink 25s linear' }}
            />
          </div>
        </div>
      )}

      {/* コントロール */}
      <div className="mt-4 flex gap-4 flex-wrap">
        <button
          onClick={startWave}
          disabled={isWaveActive}
          className={`px-4 py-2 rounded ${
            isWaveActive ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Wave {wave} 開始
        </button>
        <button
          onClick={() => {
            save({
              wave,
              coins,
              towers: towers.map(t => ({ x: t.x, y: t.y })),
              ownedNations
            });
            alert('セーブしました！');
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          💾 セーブ
        </button>
        {hasSave() && (
          <button
            onClick={() => {
              const data = load();
              if (data) {
                setWave(data.wave);
                setCoins(data.coins);
                setOwnedNations(data.ownedNations);
                alert('ロードしました！');
              }
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            📂 ロード
          </button>
        )}
      </div>

      {/* 操作説明 */}
      <div className="mt-4 text-sm text-gray-400">
        <p>• 所有している国家を選択してキャンバスをクリックで配置（50コイン）</p>
        <p>• GDPが高い国ほど強力だが、敵としても手強い</p>
        <p>• 25秒間のWaveを生き延びてガチャを引こう！</p>
      </div>

      {/* ガチャモーダル */}
      {showGacha && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Wave {wave - 1} クリア！</h2>
            <SimpleGacha 
              onNationPulled={(nation) => {
                if (!ownedNations.includes(nation.id)) {
                  setOwnedNations([...ownedNations, nation.id]);
                }
              }}
            />
            <button
              onClick={() => setShowGacha(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};