import React, { useRef, useEffect, useState } from 'react';
import { SimpleGacha } from './simple-gacha';
import { useQuickSave } from './quick-save';

interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
}

interface Tower {
  id: number;
  x: number;
  y: number;
  range: number;
  lastShot: number;
}

// Tidy First: まず動くものを作る
export const MinimalGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [coins, setCoins] = useState(100);
  const [wave, setWave] = useState(1);
  const [showGacha, setShowGacha] = useState(false);
  const [ownedNations, setOwnedNations] = useState<any[]>([]);
  const animationRef = useRef<number>(0);
  const enemiesRef = useRef<Enemy[]>([]);
  const towersRef = useRef<Tower[]>([]);
  const { save, load, hasSave } = useQuickSave() as any;

  // 敵とタワーの参照を更新
  useEffect(() => {
    enemiesRef.current = enemies;
    towersRef.current = towers;
  }, [enemies, towers]);

  // シンプルなゲームループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // クリア
      ctx.clearRect(0, 0, 800, 400);

      // 背景（パス）を描画
      ctx.fillStyle = '#666';
      ctx.fillRect(0, 180, 800, 40);

      // 基地を描画
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(750, 170, 40, 60);
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('🏰', 760, 205);

      // 敵を描画と移動
      const updatedEnemies = enemiesRef.current.filter(enemy => {
        // 移動
        enemy.x += deltaTime * 0.05; // 速度

        // 描画
        ctx.fillStyle = enemy.hp > 5 ? '#ff0000' : '#ff8888';
        ctx.fillRect(enemy.x - 10, enemy.y - 10, 20, 20);
        
        // HPバー
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(enemy.x - 10, enemy.y - 20, (enemy.hp / 10) * 20, 3);

        // 基地に到達したら削除
        if (enemy.x > 750) {
          return false;
        }

        // HPが0以下なら削除
        if (enemy.hp <= 0) {
          setCoins(prev => prev + 10); // 報酬
          return false;
        }

        return true;
      });

      // タワーを描画と攻撃
      towersRef.current.forEach(tower => {
        // 描画
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(tower.x - 15, tower.y - 15, 30, 30);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('🏳️', tower.x - 10, tower.y + 5);

        // 射程範囲（デバッグ用）
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
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
            // 攻撃エフェクト（線）
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(tower.x, tower.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();

            target.hp -= 3;
            tower.lastShot = timestamp;
          }
        }
      });

      enemiesRef.current = updatedEnemies;
      setEnemies(updatedEnemies);

      // Wave完了チェック
      if (updatedEnemies.length === 0 && enemiesRef.current.length === 0) {
        // 簡易的なWave完了判定
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
  }, []);

  // キャンバスクリックでタワー配置
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // パス上には配置できない
    if (y >= 180 && y <= 220) return;

    // コインチェック
    if (coins < 50) return;

    setCoins(prev => prev - 50);
    setTowers(prev => [...prev, {
      id: Date.now(),
      x,
      y,
      range: 100,
      lastShot: 0
    }]);
  };

  // Wave開始
  const startWave = () => {
    const enemyCount = wave * 3;
    // const newEnemies: Enemy[] = [];

    for (let i = 0; i < enemyCount; i++) {
      setTimeout(() => {
        setEnemies(prev => [...prev, {
          id: Date.now() + i,
          x: -20,
          y: 200,
          hp: 10
        }]);
      }, i * 1000);
    }

    setWave(prev => prev + 1);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Flag Defence - Tidy First Prototype</h1>
      
      {/* ゲーム情報 */}
      <div className="mb-4 flex gap-4">
        <div className="bg-gray-800 p-3 rounded">
          💰 コイン: {coins}
        </div>
        <div className="bg-gray-800 p-3 rounded">
          🌊 Wave: {wave}
        </div>
        <div className="bg-gray-800 p-3 rounded">
          🗼 タワーコスト: 50
        </div>
      </div>

      {/* ゲームキャンバス */}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onClick={handleCanvasClick}
        className="border border-gray-600 bg-gray-800 cursor-crosshair"
      />

      {/* コントロール */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={startWave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Wave {wave} 開始
        </button>
        <button
          onClick={() => setEnemies(prev => [...prev, {
            id: Date.now(),
            x: 0,
            y: 200,
            hp: 10
          }])}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          敵を1体追加（デバッグ）
        </button>
        <button
          onClick={() => setCoins(prev => prev + 100)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          +100コイン（デバッグ）
        </button>
        <button
          onClick={() => {
            save({
              wave,
              coins,
              towers: towers.map(t => ({ x: t.x, y: t.y })),
              ownedNations: ownedNations.map(n => n.id)
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
                setTowers(data.towers.map((t: any, i: number) => ({
                  id: Date.now() + i,
                  x: t.x,
                  y: t.y,
                  range: 100,
                  lastShot: 0
                })));
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
        <p>• キャンバスをクリックしてタワーを配置（50コイン）</p>
        <p>• タワーは自動的に範囲内の敵を攻撃</p>
        <p>• 敵を倒すと10コイン獲得</p>
        <p>• Wave完了でガチャが引ける！</p>
      </div>

      {/* ガチャモーダル */}
      {showGacha && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Wave {wave - 1} クリア！</h2>
            <SimpleGacha 
              onNationPulled={(nation) => {
                setOwnedNations([...ownedNations, nation]);
                console.log('獲得した国:', nation);
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
    </div>
  );
};