import React from 'react';
import { NATION_DICT } from './nations-full-database';
import { GDPEnemySystem } from './gdp-enemy-system';

interface DefeatNationsListProps {
  defeatedNations: Record<string, any>;
  onClose: () => void;
}

export const DefeatedNationsList: React.FC<DefeatNationsListProps> = ({ defeatedNations, onClose }) => {
  const sortedNations = Object.values(defeatedNations).sort((a, b) => b.gdp - a.gdp);

  const generateMarkdown = () => {
    const markdown = `# 撃破した国家一覧 (${sortedNations.length}カ国)

| 国旗 | 国名 | GDP (10億USD) | レアリティ |
|------|------|---------------|------------|
${sortedNations.map(nation => {
  const rarity = GDPEnemySystem.getRarity(nation.gdp);
  const fullData = NATION_DICT[nation.id];
  return `| ${nation.flag} | ${nation.name} | ${nation.gdp.toLocaleString()} | ${'★'.repeat(rarity.stars)} |`;
}).join('\n')}

## 統計情報

- **総撃破数**: ${sortedNations.length}カ国
- **最大GDP国**: ${sortedNations.length > 0 ? `${sortedNations[0].flag} ${sortedNations[0].name} (${sortedNations[0].gdp.toLocaleString()}億USD)` : 'なし'}
- **最小GDP国**: ${sortedNations.length > 0 ? `${sortedNations[sortedNations.length - 1].flag} ${sortedNations[sortedNations.length - 1].name} (${sortedNations[sortedNations.length - 1].gdp.toLocaleString()}億USD)` : 'なし'}

---
*Flag Defence - 撃破記録*`;

    navigator.clipboard.writeText(markdown);
    alert('撃破記録をクリップボードにコピーしました！');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            🏆 <ruby>撃破<rt>げきは</rt></ruby>した<ruby>国家<rt>こっか</rt></ruby><ruby>一覧<rt>いちらん</rt></ruby> ({sortedNations.length}カ国)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={generateMarkdown}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold"
            >
              📋 Markdownコピー
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-bold"
            >
              ✕ <ruby>閉<rt>と</rt></ruby>じる
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
          {sortedNations.length === 0 ? (
            <p className="text-center text-gray-400 py-8">まだ<ruby>国家<rt>こっか</rt></ruby>を<ruby>撃破<rt>げきは</rt></ruby>していません</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedNations.map(nation => {
                const rarity = GDPEnemySystem.getRarity(nation.gdp);
                const fullData = NATION_DICT[nation.id];
                return (
                  <div
                    key={nation.id}
                    className="bg-gray-800 p-3 rounded-lg border-2"
                    style={{ borderColor: rarity.color }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{nation.flag}</span>
                      <span className="text-yellow-300">{'★'.repeat(rarity.stars)}</span>
                    </div>
                    <h3 className="font-bold text-white">{nation.name}</h3>
                    <div className="text-sm text-gray-400 mt-1">
                      <div>GDP: ${nation.gdp.toLocaleString()}B</div>
                      {fullData?.tier && <div>ティア: {fullData.tier}</div>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {nation.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-4 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};