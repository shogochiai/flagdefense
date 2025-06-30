import { useState } from 'react';
import { VeggieDefenseGame } from './components/VeggieDefenseGame';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
          <h1 className="text-5xl font-bold mb-4 text-green-700">
            🥗 Veggie Defense 🥗
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            野菜たちの力で害虫から畑を守ろう！
          </p>
          
          <div className="mb-6 text-left bg-green-50 p-4 rounded">
            <h2 className="font-semibold mb-2 text-green-800">遊び方：</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>野菜を選んで配置しよう</li>
              <li>害虫が畑に到達する前に倒そう</li>
              <li>コインを集めて強い野菜を配置</li>
              <li>全10ウェーブをクリアして勝利！</li>
            </ul>
          </div>

          <button
            onClick={() => setGameStarted(true)}
            className="bg-green-500 text-white text-xl px-8 py-4 rounded-lg hover:bg-green-600 transform transition hover:scale-105"
          >
            ゲームスタート！
          </button>
        </div>
      </div>
    );
  }

  return <VeggieDefenseGame />;
}

export default App
