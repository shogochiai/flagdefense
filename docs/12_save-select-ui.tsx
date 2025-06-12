import React, { useState, useEffect } from 'react';
import { Save, Trash2, Upload, Download, Plus, Clock, Trophy, Flag } from 'lucide-react';
import { SaveManager, SaveData } from './save-system';

// セーブデータ選択画面
export const SaveSelectScreen: React.FC<{
  onSelectSave: (saveId: string) => void;
  onNewGame: () => void;
}> = ({ onSelectSave, onNewGame }) => {
  const [saves, setSaves] = useState<SaveData[]>([]);
  const [selectedSave, setSelectedSave] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showNewSaveDialog, setShowNewSaveDialog] = useState(false);
  const [newSaveName, setNewSaveName] = useState('');
  
  useEffect(() => {
    loadSaves();
  }, []);
  
  const loadSaves = () => {
    setSaves(SaveManager.getAllSaves());
  };
  
  const handleDelete = (saveId: string) => {
    if (SaveManager.deleteSave(saveId)) {
      loadSaves();
      setShowDeleteConfirm(null);
    }
  };
  
  const handleNewSave = () => {
    if (saves.length >= 10) {
      alert('セーブスロットが満杯です。既存のセーブを削除してください。');
      return;
    }
    setShowNewSaveDialog(true);
  };
  
  const createNewSave = () => {
    const name = newSaveName.trim() || `セーブ ${saves.length + 1}`;
    const newSave = SaveManager.createSave(name, {
      wave: 0,
      coins: 80,
      lives: 3,
      ownedNations: [],
      nationUpgrades: {},
      stats: {
        totalWavesCleared: 0,
        totalCoinsEarned: 0,
        totalEnemiesDefeated: 0,
        playTime: 0,
        highestWave: 0
      },
      achievements: [],
      unlockedFeatures: [],
      settings: {
        difficulty: 'normal',
        soundEnabled: true,
        musicEnabled: true
      }
    });
    
    if (newSave) {
      onSelectSave(newSave.id);
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}時間${minutes}分`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Flag Defence - セーブデータ選択</h1>
        
        {/* セーブスロット */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {saves.map(save => (
            <div
              key={save.id}
              className={`relative bg-gray-800 rounded-lg p-6 cursor-pointer transition-all hover:bg-gray-700 ${
                selectedSave === save.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedSave(save.id)}
            >
              {/* 削除確認 */}
              {showDeleteConfirm === save.id && (
                <div className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <p className="mb-4">このセーブデータを削除しますか？</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(save.id);
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                      >
                        削除
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(null);
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* セーブ情報 */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{save.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(save.id);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Wave {save.gameData.wave}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-blue-400" />
                  <span>{save.gameData.ownedNations.length}カ国</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span>{formatPlayTime(save.gameData.stats.playTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4 text-gray-400" />
                  <span className="text-xs">{formatDate(save.updatedAt)}</span>
                </div>
              </div>
              
              {/* 進捗バー */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>収集率</span>
                  <span>{Math.floor((save.gameData.ownedNations.length / 250) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${(save.gameData.ownedNations.length / 250) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {/* 新規作成スロット */}
          {saves.length < 10 && (
            <div
              className="bg-gray-800/50 rounded-lg p-6 border-2 border-dashed border-gray-600 
                cursor-pointer hover:border-gray-500 transition-all flex items-center justify-center"
              onClick={handleNewSave}
            >
              <div className="text-center">
                <Plus className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-500">新規ゲーム</p>
              </div>
            </div>
          )}
        </div>
        
        {/* アクションボタン */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => selectedSave && onSelectSave(selectedSave)}
            disabled={!selectedSave}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedSave
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 opacity-50 cursor-not-allowed'
            }`}
          >
            ゲーム開始
          </button>
        </div>
        
        {/* ストレージ情報 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>セーブスロット: {saves.length} / 10</p>
        </div>
      </div>
      
      {/* 新規セーブダイアログ */}
      {showNewSaveDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">新規ゲーム</h3>
            <input
              type="text"
              placeholder="セーブ名を入力"
              value={newSaveName}
              onChange={(e) => setNewSaveName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={createNewSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                作成
              </button>
              <button
                onClick={() => {
                  setShowNewSaveDialog(false);
                  setNewSaveName('');
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};