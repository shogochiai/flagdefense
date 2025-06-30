import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveSlotManager, SaveData } from '../save-slots';

describe('SaveSlotManager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    global.localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getAllSlots', () => {
    it('should return 10 empty slots initially', () => {
      const slots = SaveSlotManager.getAllSlots();
      expect(slots).toHaveLength(10);
      
      slots.forEach((slot, index) => {
        expect(slot.id).toBe(index + 1);
        expect(slot.isEmpty).toBe(true);
        expect(slot.data).toBeNull();
        expect(slot.name).toBe(`スロット ${index + 1}`);
      });
    });

    it('should return slots with saved data', () => {
      const testData: SaveData = {
        wave: 5,
        coins: 1000,
        lives: 3,
        towers: [{ x: 100, y: 100, nationId: 'japan' }],
        ownedNations: ['japan', 'usa'],
        powerups: { damage_boost: 2 },
        timestamp: Date.now(),
        playTime: 3600,
        slotName: 'Test Save'
      };

      SaveSlotManager.saveToSlot(1, testData);
      
      const slots = SaveSlotManager.getAllSlots();
      expect(slots[0].isEmpty).toBe(false);
      expect(slots[0].data).toEqual(testData);
      expect(slots[0].name).toBe('Test Save');
    });
  });

  describe('saveToSlot', () => {
    it('should save data to localStorage', () => {
      const testData: SaveData = {
        wave: 10,
        coins: 2000,
        lives: 5,
        towers: [],
        ownedNations: ['japan'],
        powerups: {},
        timestamp: Date.now(),
        playTime: 0
      };

      const result = SaveSlotManager.saveToSlot(3, testData);
      expect(result).toBe(true);

      const saved = localStorage.getItem('flagdefence_save_slot_3');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual(testData);
    });

    it('should overwrite existing save', () => {
      const oldData: SaveData = {
        wave: 1,
        coins: 100,
        lives: 3,
        towers: [],
        ownedNations: ['nauru'],
        powerups: {},
        timestamp: Date.now() - 10000,
        playTime: 0
      };

      const newData: SaveData = {
        wave: 5,
        coins: 500,
        lives: 2,
        towers: [{ x: 200, y: 200, nationId: 'usa' }],
        ownedNations: ['nauru', 'usa'],
        powerups: { speed_boost: 1 },
        timestamp: Date.now(),
        playTime: 1000
      };

      SaveSlotManager.saveToSlot(1, oldData);
      SaveSlotManager.saveToSlot(1, newData);

      const loaded = SaveSlotManager.loadSlot(1);
      expect(loaded).toEqual(newData);
    });

    it('should handle save errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      const testData: SaveData = {
        wave: 1,
        coins: 100,
        lives: 3,
        towers: [],
        ownedNations: ['nauru'],
        powerups: {},
        timestamp: Date.now(),
        playTime: 0
      };

      const result = SaveSlotManager.saveToSlot(1, testData);
      expect(result).toBe(false);

      localStorage.setItem = originalSetItem;
    });
  });

  describe('loadSlot', () => {
    it('should return null for empty slot', () => {
      const data = SaveSlotManager.loadSlot(5);
      expect(data).toBeNull();
    });

    it('should load saved data correctly', () => {
      const testData: SaveData = {
        wave: 15,
        coins: 3000,
        lives: 4,
        towers: [
          { x: 100, y: 100, nationId: 'japan' },
          { x: 200, y: 200, nationId: 'usa' }
        ],
        ownedNations: ['japan', 'usa', 'germany'],
        powerups: {
          damage_boost: 3,
          range_boost: 2
        },
        timestamp: Date.now(),
        playTime: 7200,
        slotName: 'Mid Game Save'
      };

      SaveSlotManager.saveToSlot(7, testData);
      const loaded = SaveSlotManager.loadSlot(7);
      
      expect(loaded).toEqual(testData);
    });
  });

  describe('deleteSlot', () => {
    it('should delete saved data', () => {
      const testData: SaveData = {
        wave: 1,
        coins: 100,
        lives: 3,
        towers: [],
        ownedNations: ['nauru'],
        powerups: {},
        timestamp: Date.now(),
        playTime: 0
      };

      SaveSlotManager.saveToSlot(2, testData);
      expect(SaveSlotManager.loadSlot(2)).toBeTruthy();

      SaveSlotManager.deleteSlot(2);
      expect(SaveSlotManager.loadSlot(2)).toBeNull();
    });

    it('should handle deleting non-existent slot', () => {
      // Should not throw
      expect(() => SaveSlotManager.deleteSlot(10)).not.toThrow();
    });
  });

  describe('getSlotInfo', () => {
    it('should return correct info for saved slot', () => {
      const testData: SaveData = {
        wave: 20,
        coins: 5000,
        lives: 6,
        towers: [],
        ownedNations: ['japan', 'usa', 'china', 'germany'],
        powerups: {},
        timestamp: Date.now() - 3600000, // 1 hour ago
        playTime: 10800, // 3 hours
        slotName: 'Late Game'
      };

      SaveSlotManager.saveToSlot(4, testData);
      const info = SaveSlotManager.getSlotInfo(4);

      expect(info).toBeTruthy();
      expect(info!.id).toBe(4);
      expect(info!.data).toBeTruthy();
      expect(info!.data!.wave).toBe(20);
      expect(info!.data!.timestamp).toBe(testData.timestamp);
      expect(info!.name).toBe('Late Game');
      expect(info!.isEmpty).toBe(false);
    });

    it('should return null for empty slot', () => {
      // 範囲外のスロットIDの場合はnullを返す
      const info = SaveSlotManager.getSlotInfo(11); // MAX_SLOTS = 10
      expect(info).toBeNull();
      
      // 範囲内の空のスロットの場合は空の情報を返す
      const emptyInfo = SaveSlotManager.getSlotInfo(9);
      expect(emptyInfo).toBeTruthy();
      expect(emptyInfo!.isEmpty).toBe(true);
      expect(emptyInfo!.data).toBeNull();
    });
  });
});