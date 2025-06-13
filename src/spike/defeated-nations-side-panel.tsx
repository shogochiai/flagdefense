import React, { useState } from 'react';
import { NATION_DICT } from './nations-full-database';
import { GDPEnemySystem } from './gdp-enemy-system';

interface DefeatedNationsSidePanelProps {
  defeatedNations: Record<string, any>;
  isOpen: boolean;
  onToggle: () => void;
}

export const DefeatedNationsSidePanel: React.FC<DefeatedNationsSidePanelProps> = ({ 
  defeatedNations, 
  isOpen, 
  onToggle 
}) => {
  const [expandedDetails, setExpandedDetails] = useState(false);
  const sortedNations = Object.values(defeatedNations).sort((a, b) => b.gdp - a.gdp);

  const generateMarkdown = () => {
    const markdown = `# 撃破した国家一覧 (${sortedNations.length}カ国)

| 国旗 | 国名 | GDP (10億USD) | レアリティ |
|------|------|---------------|------------|
${sortedNations.map(nation => {
  const rarity = GDPEnemySystem.getRarity(nation.gdp);
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
    <div className={`fixed left-0 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-r-xl shadow-2xl overflow-hidden transition-all duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`} style={{ maxWidth: '280px' }}>
      <div className="flex flex-col h-full" style={{ maxHeight: '80vh' }}>
        {/* ヘッダー */}
        <div className="bg-gray-800 p-3 flex items-center justify-between">
          <h3 className="font-bold text-orange-400 flex items-center gap-2">
            <span>🏆 撃破記録</span>
            <span className="text-sm bg-orange-600 px-2 py-0.5 rounded">{sortedNations.length}</span>
          </h3>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white"
          >
            ◀
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-3">
          {sortedNations.length === 0 ? (
            <p className="text-center text-gray-400 py-4 text-sm">
              まだ国家を撃破していません
            </p>
          ) : (
            <div className="space-y-2">
              {/* コピーボタン */}
              <button
                onClick={generateMarkdown}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-bold mb-3"
              >
                📋 Markdownコピー
              </button>

              {/* 統計情報 */}
              <div className="bg-gray-800 p-2 rounded text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">総撃破数:</span>
                  <span className="text-white font-bold">{sortedNations.length}カ国</span>
                </div>
                {sortedNations.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">最大GDP:</span>
                      <span className="text-white">{sortedNations[0].flag} ${sortedNations[0].gdp.toLocaleString()}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">最小GDP:</span>
                      <span className="text-white">{sortedNations[sortedNations.length - 1].flag} ${sortedNations[sortedNations.length - 1].gdp.toLocaleString()}B</span>
                    </div>
                  </>
                )}
              </div>

              {/* 詳細表示切り替え */}
              <button
                onClick={() => setExpandedDetails(!expandedDetails)}
                className="w-full px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
              >
                {expandedDetails ? '簡易表示' : '詳細表示'} {expandedDetails ? '▲' : '▼'}
              </button>

              {/* 国家リスト */}
              <div className="space-y-1">
                {sortedNations.map(nation => {
                  const rarity = GDPEnemySystem.getRarity(nation.gdp);
                  return (
                    <div
                      key={nation.id}
                      className="bg-gray-800 p-2 rounded border-l-4"
                      style={{ borderColor: rarity.color }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{nation.flag}</span>
                          <span className="text-sm text-white font-bold">{nation.name}</span>
                        </div>
                        <span className="text-yellow-300 text-xs">{'★'.repeat(rarity.stars)}</span>
                      </div>
                      {expandedDetails && (
                        <div className="mt-1 text-xs text-gray-400">
                          <div>GDP: ${nation.gdp.toLocaleString()}B</div>
                          <div className="flex gap-1 mt-1">
                            {nation.colors.slice(0, 3).map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-3 rounded"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* トグルボタン（閉じているとき） */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-2 py-4 rounded-r-lg shadow-lg"
          style={{ writingMode: 'vertical-rl' }}
        >
          🏆 撃破記録 ({sortedNations.length})
        </button>
      )}
    </div>
  );
};