import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveSlotManager } from '../src/spike/save-slots';

// localStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SaveSlotManager', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getAllSlots', () => {
    it('10個の空スロットを返す', () => {
      const slots = SaveSlotManager.getAllSlots();
      
      expect(slots).toHaveLength(10);
      expect(slots.every(slot => slot.isEmpty)).toBe(true);
      expect(slots[0].id).toBe(1);
      expect(slots[9].id).toBe(10);
    });

    it('保存済みスロットを正しく識別', () => {
      const saveData = {
        wave: 5,
        coins: 300,
        lives: 2,
        towers: [],
        ownedNations: ['japan', 'usa'],
        powerups: {},
        timestamp: Date.now(),
        playTime: 3600,
        slotName: 'テストセーブ'
      };
      
      SaveSlotManager.saveToSlot(1, saveData);
      SaveSlotManager.saveToSlot(5, saveData);
      
      const slots = SaveSlotManager.getAllSlots();
      
      expect(slots[0].isEmpty).toBe(false);
      expect(slots[0].data).toMatchObject(saveData);
      expect(slots[4].isEmpty).toBe(false);
      expect(slots[1].isEmpty).toBe(true);
    });
  });

  describe('saveToSlot', () => {
    it('指定スロットにデータを保存', () => {
      const saveData = {
        wave: 10,
        coins: 500,
        lives: 3,
        towers: [{ x: 100, y: 200, nationId: 'japan' }],
        ownedNations: ['japan', 'usa', 'germany'],
        powerups: { damage_boost: 2 },
        timestamp: Date.now(),
        playTime: 7200
      };
      
      const result = SaveSlotManager.saveToSlot(3, saveData);
      
      expect(result).toBe(true);
      
      const saved = localStorageMock.getItem('flagdefence_save_slot_3');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toMatchObject(saveData);
    });

    it('無効なスロット番号では保存失敗', () => {
      const saveData = {
        wave: 1,
        coins: 100,
        lives: 3,
        towers: [],
        ownedNations: ['japan'],
        powerups: {},
        timestamp: Date.now(),
        playTime: 0
      };
      
      expect(SaveSlotManager.saveToSlot(0, saveData)).toBe(false);
      expect(SaveSlotManager.saveToSlot(11, saveData)).toBe(false);
      expect(SaveSlotManager.saveToSlot(-1, saveData)).toBe(false);
    });

    it('既存データを上書き', () => {
      const saveData1 = {
        wave: 5,
        coins: 200,
        lives: 3,
        towers: [],
        ownedNations: ['japan'],
        powerups: {},
        timestamp: Date.now(),
        playTime: 1000
      };
      
      const saveData2 = {
        wave: 10,
        coins: 500,
        lives: 2,
        towers: [],
        ownedNations: ['japan', 'usa'],
        powerups: {},
        timestamp: Date.now(),
        playTime: 2000
      };
      
      SaveSlotManager.saveToSlot(1, saveData1);
      SaveSlotManager.saveToSlot(1, saveData2);
      
      const loaded = SaveSlotManager.loadSlot(1);
      expect(loaded?.wave).toBe(10);
      expect(loaded?.coins).toBe(500);
    });
  });

  describe('loadSlot', () => {
    it('保存されたデータを正しく読み込む', () => {
      const saveData = {
        wave: 15,
        coins: 750,
        lives: 1,
        towers: [
          { x: 100, y: 100, nationId: 'japan' },
          { x: 200, y: 200, nationId: 'usa' }
        ],
        ownedNations: ['japan', 'usa', 'germany', 'france'],
        powerups: { 
          damage_boost: 3,
          range_boost: 2 
        },
        timestamp: Date.now(),
        playTime: 10800,
        slotName: 'Wave 15 クリア直前'
      };
      
      SaveSlotManager.saveToSlot(7, saveData);
      const loaded = SaveSlotManager.loadSlot(7);
      
      expect(loaded).toMatchObject(saveData);
      expect(loaded?.towers).toHaveLength(2);
      expect(loaded?.ownedNations).toHaveLength(4);
    });

    it('空スロットからのロードはnull', () => {
      const loaded = SaveSlotManager.loadSlot(1);
      expect(loaded).toBeNull();
    });

    it('無効なスロット番号でnull', () => {
      expect(SaveSlotManager.loadSlot(0)).toBeNull();
      expect(SaveSlotManager.loadSlot(11)).toBeNull();
    });

    it('破損データの場合はnull', () => {
      localStorageMock.setItem('flagdefence_save_slot_1', 'invalid json data');
      const loaded = SaveSlotManager.loadSlot(1);
      expect(loaded).toBeNull();
    });
  });

  describe('deleteSlot', () => {
    it('指定スロットのデータを削除', () => {
      const saveData = {
        wave: 5,
        coins: 300,
        lives: 3,
        towers: [],
        ownedNations: ['japan'],
        powerups: {},
        timestamp: Date.now(),
        playTime: 1000
      };
      
      SaveSlotManager.saveToSlot(2, saveData);
      expect(SaveSlotManager.loadSlot(2)).not.toBeNull();
      
      const result = SaveSlotManager.deleteSlot(2);
      expect(result).toBe(true);
      expect(SaveSlotManager.loadSlot(2)).toBeNull();
    });

    it('無効なスロット番号では削除失敗', () => {
      expect(SaveSlotManager.deleteSlot(0)).toBe(false);
      expect(SaveSlotManager.deleteSlot(11)).toBe(false);
    });
  });

  describe('clearAllSlots', () => {
    it('全スロットをクリア', () => {
      // 複数スロットにデータを保存
      for (let i = 1; i <= 5; i++) {
        SaveSlotManager.saveToSlot(i, {
          wave: i,
          coins: i * 100,
          lives: 3,
          towers: [],
          ownedNations: ['japan'],
          powerups: {},
          timestamp: Date.now(),
          playTime: i * 1000
        });
      }
      
      // 保存確認
      expect(SaveSlotManager.loadSlot(1)).not.toBeNull();
      expect(SaveSlotManager.loadSlot(5)).not.toBeNull();
      
      // 全削除
      SaveSlotManager.clearAllSlots();
      
      // 削除確認
      for (let i = 1; i <= 10; i++) {
        expect(SaveSlotManager.loadSlot(i)).toBeNull();
      }
    });
  });

  describe('複雑なデータの保存/読み込み', () => {
    it('全ての機能を使用したセーブデータ', () => {
      const complexData = {
        wave: 25,
        coins: 1250,
        lives: 2,
        towers: [
          { x: 100, y: 100, nationId: 'japan' },
          { x: 200, y: 150, nationId: 'usa' },
          { x: 300, y: 200, nationId: 'germany' },
          { x: 400, y: 250, nationId: 'france' },
          { x: 500, y: 300, nationId: 'uk' }
        ],
        ownedNations: [
          'japan', 'usa', 'germany', 'france', 'uk',
          'italy', 'spain', 'canada', 'brazil', 'india',
          'russia', 'china', 'south_korea', 'australia', 'mexico'
        ],
        powerups: {
          damage_boost: 5,
          range_boost: 4,
          speed_boost: 3,
          coin_multiplier: 2,
          gacha_ticket: 1
        },
        timestamp: Date.now(),
        playTime: 36000, // 10時間
        slotName: 'エンドゲーム進行中'
      };
      
      SaveSlotManager.saveToSlot(10, complexData);
      const loaded = SaveSlotManager.loadSlot(10);
      
      expect(loaded).toMatchObject(complexData);
      expect(loaded?.towers).toHaveLength(5);
      expect(loaded?.ownedNations).toHaveLength(15);
      expect(loaded?.powerups.damage_boost).toBe(5);
    });
  });
});