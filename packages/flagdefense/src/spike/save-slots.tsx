// 10個のセーブスロットシステム

import React, { useState, useEffect } from 'react';

export interface SaveData {
  wave: number;
  coins: number;
  lives: number;
  towers: Array<{ x: number; y: number; nationId: string }>;
  ownedNations: string[];
  powerups: Record<string, number>;
  timestamp: number;
  playTime: number;
  slotName?: string;
}

interface SaveSlot {
  id: number;
  data: SaveData | null;
  isEmpty: boolean;
  name: string;
}

interface SaveSlotsModalProps {
  currentData?: Omit<SaveData, 'timestamp' | 'playTime'>;
  onLoad: (data: SaveData) => void;
  onClose: () => void;
  mode: 'save' | 'load';
  onSaveSuccess?: () => void;
}

export class SaveSlotManager {
  private static readonly KEY_PREFIX = 'flagdefence_save_slot_';
  private static readonly MAX_SLOTS = 10;

  // スロット一覧を取得
  static getAllSlots(): SaveSlot[] {
    const slots: SaveSlot[] = [];
    
    for (let i = 1; i <= this.MAX_SLOTS; i++) {
      const data = this.loadSlot(i);
      slots.push({
        id: i,
        data,
        isEmpty: !data,
        name: data?.slotName || `スロット ${i}`
      });
    }
    
    return slots;
  }

  // 特定のスロットにセーブ
  static saveToSlot(slotId: number, data: SaveData): boolean {
    if (slotId < 1 || slotId > this.MAX_SLOTS) return false;
    
    try {
      const key = `${this.KEY_PREFIX}${slotId}`;
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('セーブ失敗:', e);
      return false;
    }
  }

  // 特定のスロットからロード
  static loadSlot(slotId: number): SaveData | null {
    if (slotId < 1 || slotId > this.MAX_SLOTS) return null;
    
    try {
      const key = `${this.KEY_PREFIX}${slotId}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      
      // 必須フィールドの検証
      if (typeof parsed.wave !== 'number' || 
          typeof parsed.coins !== 'number' || 
          typeof parsed.lives !== 'number' || 
          !Array.isArray(parsed.towers) || 
          !Array.isArray(parsed.ownedNations) || 
          typeof parsed.powerups !== 'object') {
        console.error('必須フィールドが欠けているデータ:', parsed);
        return null;
      }
      
      return parsed;
    } catch (e) {
      console.error('ロード失敗:', e);
      return null;
    }
  }

  // スロットを削除
  static deleteSlot(slotId: number): boolean {
    if (slotId < 1 || slotId > this.MAX_SLOTS) return false;
    
    try {
      const key = `${this.KEY_PREFIX}${slotId}`;
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('削除失敗:', e);
      return false;
    }
  }

  // 全スロットをクリア
  static clearAllSlots(): void {
    for (let i = 1; i <= this.MAX_SLOTS; i++) {
      this.deleteSlot(i);
    }
  }

  // スロット情報を取得
  static getSlotInfo(slotId: number): SaveSlot | null {
    if (slotId < 1 || slotId > this.MAX_SLOTS) return null;
    
    const data = this.loadSlot(slotId);
    return {
      id: slotId,
      data,
      isEmpty: !data,
      name: data?.slotName || `スロット ${slotId}`
    };
  }
}

export const SaveSlotsModal: React.FC<SaveSlotsModalProps> = ({
  currentData,
  onLoad,
  onClose,
  mode,
  onSaveSuccess
}) => {
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [slotName, setSlotName] = useState('');

  useEffect(() => {
    refreshSlots();
  }, []);

  const refreshSlots = () => {
    setSlots(SaveSlotManager.getAllSlots());
  };

  const handleSave = (slotId: number) => {
    if (!currentData) return;
    
    const name = slotName || `Wave ${currentData.wave}`;
    const saveData: SaveData = {
      ...currentData,
      timestamp: Date.now(),
      playTime: 0, // TODO: 実際のプレイ時間を記録
      slotName: name
    };
    
    if (SaveSlotManager.saveToSlot(slotId, saveData)) {
      onSaveSuccess?.();
      onClose();
    } else {
      alert('セーブに失敗しました');
    }
  };

  const handleLoad = (slotId: number) => {
    const data = SaveSlotManager.loadSlot(slotId);
    if (data) {
      onLoad(data);
      alert(`スロット ${slotId} からロードしました！`);
      onClose();
    }
  };

  const handleDelete = (slotId: number) => {
    if (confirm(`スロット ${slotId} のデータを削除しますか？`)) {
      SaveSlotManager.deleteSlot(slotId);
      refreshSlots();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP');
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}時間${minutes}分`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-4xl max-h-screen overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">
          {mode === 'save' ? 'セーブ' : 'ロード'}
        </h2>

        {mode === 'save' && selectedSlot && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="セーブ名を入力（省略可）"
              value={slotName}
              onChange={(e) => setSlotName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
        )}

        <div className="grid gap-3">
          {slots.map(slot => (
            <div
              key={slot.id}
              data-testid={`save-slot-${slot.id}`}
              className={`bg-gray-800 p-4 rounded-lg border-2 ${
                slot.isEmpty 
                  ? 'border-gray-700' 
                  : 'border-gray-600'
              } ${
                mode === 'load' && slot.isEmpty 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-blue-500 cursor-pointer'
              }`}
              onClick={() => {
                if (mode === 'save') {
                  setSelectedSlot(slot.id);
                } else if (!slot.isEmpty) {
                  handleLoad(slot.id);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {slot.data?.slotName || slot.name}
                  </h3>
                  {slot.isEmpty ? (
                    <p className="text-gray-500">空のスロット</p>
                  ) : slot.data && (
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Wave: {slot.data.wave} | コイン: {slot.data.coins} | 残機: {slot.data.lives}</p>
                      <p>所有国家: {slot.data.ownedNations.length}カ国</p>
                      <p>保存日時: {formatDate(slot.data.timestamp)}</p>
                      {slot.data.playTime > 0 && (
                        <p>プレイ時間: {formatPlayTime(slot.data.playTime)}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {mode === 'save' && selectedSlot === slot.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(slot.id);
                      }}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      確定
                    </button>
                  )}
                  {!slot.isEmpty && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(slot.id);
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded text-lg"
          >
            キャンセル
          </button>
          {mode === 'save' && (
            <button
              onClick={() => {
                if (confirm('全てのセーブデータを削除しますか？')) {
                  SaveSlotManager.clearAllSlots();
                  refreshSlots();
                }
              }}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded text-lg"
            >
              全削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// React Hook
export const useSaveSlots = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'save' | 'load'>('save');

  const openSaveModal = () => {
    setModalMode('save');
    setShowModal(true);
  };

  const openLoadModal = () => {
    setModalMode('load');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    modalMode,
    openSaveModal,
    openLoadModal,
    closeModal
  };
};