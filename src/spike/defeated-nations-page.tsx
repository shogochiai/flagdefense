import React from 'react';
import { GDPEnemySystem } from './gdp-enemy-system';

interface DefeatedNationsPageProps {
  defeatedNations: Record<string, any>;
}

export const DefeatedNationsPage: React.FC<DefeatedNationsPageProps> = ({ defeatedNations }) => {
  const sortedNations = Object.values(defeatedNations).sort((a, b) => b.gdp - a.gdp);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text">
          🏆 撃破した国家一覧 ({sortedNations.length}カ国)
        </h1>

        {sortedNations.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-2xl">まだ国家を撃破していません</p>
          </div>
        ) : (
          <>
            {/* 統計情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm">総撃破数</h3>
                <p className="text-2xl font-bold text-orange-400">{sortedNations.length}カ国</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm">最大GDP国</h3>
                <p className="text-lg font-bold">
                  {sortedNations[0].flag} {sortedNations[0].name}
                </p>
                <p className="text-sm text-gray-400">${sortedNations[0].gdp.toLocaleString()}B</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm">最小GDP国</h3>
                <p className="text-lg font-bold">
                  {sortedNations[sortedNations.length - 1].flag} {sortedNations[sortedNations.length - 1].name}
                </p>
                <p className="text-sm text-gray-400">${sortedNations[sortedNations.length - 1].gdp.toLocaleString()}B</p>
              </div>
            </div>

            {/* 国家リスト */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNations.map(nation => {
                const rarity = GDPEnemySystem.getRarity(nation.gdp);
                return (
                  <div
                    key={nation.id}
                    className="bg-gray-800 p-4 rounded-lg border-2 hover:scale-105 transition-transform"
                    style={{ borderColor: rarity.color }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{nation.flag}</span>
                        <div>
                          <h3 className="font-bold text-lg">{nation.name}</h3>
                          <p className="text-sm text-gray-400">GDP: ${nation.gdp.toLocaleString()}B</p>
                        </div>
                      </div>
                      <div className="text-yellow-300">
                        {'★'.repeat(rarity.stars)}
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {nation.colors.slice(0, 4).map((color: string, i: number) => (
                        <div
                          key={i}
                          className="h-2 flex-1 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// URLパラメータから撃破データを読み込んで表示する独立したページ
export const DefeatedNationsStandalone: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const data = params.get('data');
  
  let defeatedNations: Record<string, any> = {};
  if (data) {
    try {
      defeatedNations = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      console.error('Failed to parse defeated nations data:', e);
    }
  }

  return <DefeatedNationsPage defeatedNations={defeatedNations} />;
};