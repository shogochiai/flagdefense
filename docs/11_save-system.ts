// セーブデータシステム

export interface SaveData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  gameData: {
    // プレイヤー進行状況
    wave: number;
    coins: number;
    lives: number;
    
    // 獲得済み国家
    ownedNations: string[];
    
    // 国家のレベル・アップグレード
    nationUpgrades: {
      [nationId: string]: {
        level: number;
        upgrades: string[];
      };
    };
    
    // ゲーム統計
    stats: {
      totalWavesCleared: number;
      totalCoinsEarned: number;
      totalEnemiesDefeated: number;
      playTime: number; // 秒
      highestWave: number;
    };
    
    // 実績・アンロック
    achievements: string[];
    unlockedFeatures: string[];
    
    // 設定
    settings: {
      difficulty: 'easy' | 'normal' | 'hard';
      soundEnabled: boolean;
      musicEnabled: boolean;
    };
  };
}

export class SaveManager {
  private static readonly STORAGE_KEY = 'flagdefence_saves';
  private static readonly MAX_SAVES = 10;
  
  // セーブデータ一覧を取得
  static getAllSaves(): SaveData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      
      const saves = JSON.parse(data);
      return Array.isArray(saves) ? saves : [];
    } catch (error) {
      console.error('Failed to load saves:', error);
      return [];
    }
  }
  
  // セーブデータを作成
  static createSave(name: string, gameData: SaveData['gameData']): SaveData | null {
    const saves = this.getAllSaves();
    
    if (saves.length >= this.MAX_SAVES) {
      console.error('Maximum save slots reached');
      return null;
    }
    
    const newSave: SaveData = {
      id: `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      gameData
    };
    
    saves.push(newSave);
    this.saveToDisk(saves);
    
    return newSave;
  }
  
  // セーブデータを更新
  static updateSave(saveId: string, gameData: SaveData['gameData']): boolean {
    const saves = this.getAllSaves();
    const index = saves.findIndex(s => s.id === saveId);
    
    if (index === -1) {
      console.error('Save not found:', saveId);
      return false;
    }
    
    saves[index] = {
      ...saves[index],
      updatedAt: Date.now(),
      gameData
    };
    
    this.saveToDisk(saves);
    return true;
  }
  
  // セーブデータを削除
  static deleteSave(saveId: string): boolean {
    const saves = this.getAllSaves();
    const filtered = saves.filter(s => s.id !== saveId);
    
    if (filtered.length === saves.length) {
      console.error('Save not found:', saveId);
      return false;
    }
    
    this.saveToDisk(filtered);
    return true;
  }
  
  // セーブデータを読み込み
  static loadSave(saveId: string): SaveData | null {
    const saves = this.getAllSaves();
    return saves.find(s => s.id === saveId) || null;
  }
  
  // ディスクに保存
  private static saveToDisk(saves: SaveData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saves));
    } catch (error) {
      console.error('Failed to save to disk:', error);
      // ストレージ容量超過時の処理
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('セーブデータの保存に失敗しました。ストレージ容量が不足しています。');
      }
    }
  }
  
  // オートセーブ
  static autoSave(saveId: string, gameData: SaveData['gameData']): void {
    // デバウンスして頻繁な保存を防ぐ
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setTimeout(() => {
      this.updateSave(saveId, gameData);
    }, 5000); // 5秒後に保存
  }
  
  private static autoSaveTimer: NodeJS.Timeout | null = null;
  
  // セーブデータのエクスポート（バックアップ用）
  static exportSave(saveId: string): string | null {
    const save = this.loadSave(saveId);
    if (!save) return null;
    
    return btoa(JSON.stringify(save));
  }
  
  // セーブデータのインポート
  static importSave(data: string): SaveData | null {
    try {
      const decoded = atob(data);
      const save = JSON.parse(decoded) as SaveData;
      
      // バリデーション
      if (!save.id || !save.gameData) {
        throw new Error('Invalid save data');
      }
      
      // 新しいIDを割り当て（重複防止）
      save.id = `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      save.updatedAt = Date.now();
      
      const saves = this.getAllSaves();
      if (saves.length >= this.MAX_SAVES) {
        throw new Error('Maximum save slots reached');
      }
      
      saves.push(save);
      this.saveToDisk(saves);
      
      return save;
    } catch (error) {
      console.error('Failed to import save:', error);
      return null;
    }
  }
  
  // ストレージ使用量を取得
  static getStorageInfo(): { used: number; percentage: number } {
    const data = localStorage.getItem(this.STORAGE_KEY) || '';
    const used = new Blob([data]).size;
    const total = 10 * 1024 * 1024; // 10MB (LocalStorage制限の目安)
    
    return {
      used,
      percentage: (used / total) * 100
    };
  }
}