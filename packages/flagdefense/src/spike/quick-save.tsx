// Tidy First: 最小限のセーブ機能

export interface QuickSaveData {
  wave: number;
  coins: number;
  towers: Array<{ x: number; y: number }>;
  ownedNations: string[];
  timestamp: number;
}

export class QuickSave {
  private static readonly KEY = 'flagdefence_quicksave';

  // セーブ
  static save(data: Omit<QuickSaveData, 'timestamp'>): void {
    const saveData: QuickSaveData = {
      ...data,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(this.KEY, JSON.stringify(saveData));
      console.log('セーブ完了:', saveData);
    } catch (e) {
      console.error('セーブ失敗:', e);
    }
  }

  // ロード
  static load(): QuickSaveData | null {
    try {
      const data = localStorage.getItem(this.KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      console.log('ロード完了:', parsed);
      return parsed;
    } catch (e) {
      console.error('ロード失敗:', e);
      return null;
    }
  }

  // 削除
  static delete(): void {
    localStorage.removeItem(this.KEY);
    console.log('セーブデータ削除');
  }

  // 存在確認
  static exists(): boolean {
    return localStorage.getItem(this.KEY) !== null;
  }
}

// React Hook として使いやすくする
export const useQuickSave = () => {
  const save = (data: Omit<QuickSaveData, 'timestamp'>) => {
    QuickSave.save(data);
  };

  const load = () => {
    return QuickSave.load();
  };

  const deleteSave = () => {
    QuickSave.delete();
  };

  const hasSave = () => {
    return QuickSave.exists();
  };

  return { save, load, deleteSave, hasSave };
};