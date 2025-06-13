import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { GameStartScreen } from '../src/spike/game-start-screen';
import { SaveSlotManager } from '../src/spike/save-slots';
import { IntegratedGameV5 } from '../src/spike/integrated-game-v5';

describe('セーブ/ロード統合機能', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('ゲーム開始画面でのロード', () => {
    test('セーブデータから開始ボタンが表示される', () => {
      render(<GameStartScreen onStartGame={vi.fn()} />);
      
      const loadButton = screen.getByText(/📂 セーブデータから開始/);
      expect(loadButton).toBeInTheDocument();
    });

    test('セーブデータが存在する場合、選択画面が表示される', async () => {
      // セーブデータを作成
      const saveData = {
        wave: 10,
        coins: 500,
        lives: 2,
        towers: [{ nationId: 'japan', x: 300, y: 200, placedAt: 8 }],
        ownedNations: ['nauru', 'japan', 'usa'],
        powerups: { damageBoost: 2, rangeBoost: 1 },
        timestamp: Date.now()
      };
      
      localStorage.setItem('flagdefence_save_slot_1', JSON.stringify(saveData));
      localStorage.setItem('flagdefence_save_slot_1_info', JSON.stringify({
        wave: 10,
        coins: 500,
        timestamp: Date.now()
      }));

      const mockOnStartGame = vi.fn();
      render(<GameStartScreen onStartGame={mockOnStartGame} onLoadGame={(slot: number) => {
        const data = SaveSlotManager.loadSlot(slot);
        if (data) {
          mockOnStartGame({
            initialCoins: data.coins,
            initialLives: data.lives,
            towerLifespan: 3,
            startingNation: data.ownedNations[0] || 'nauru',
            loadedData: data
          } as any);
        }
      }} />);
      
      const loadButton = screen.getByText(/📂 セーブデータから開始/);
      fireEvent.click(loadButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Wave: 10/)).toBeInTheDocument();
        expect(screen.getByText(/💰 500/)).toBeInTheDocument();
      });
    });

    test('空のスロットは「空」と表示される', async () => {
      const mockOnStartGame = vi.fn();
      render(<GameStartScreen onStartGame={mockOnStartGame} onLoadGame={vi.fn()} />);
      
      const loadButton = screen.getByText(/📂 セーブデータから開始/);
      fireEvent.click(loadButton);
      
      await waitFor(() => {
        const emptySlots = screen.getAllByText(/空/);
        expect(emptySlots.length).toBeGreaterThan(0);
      });
    });

    test('セーブデータを選択するとゲームが開始される', async () => {
      // セーブデータを作成
      const saveData = {
        wave: 15,
        coins: 1000,
        lives: 5,
        towers: [],
        ownedNations: ['nauru', 'japan', 'usa', 'germany'],
        powerups: { damageBoost: 3, rangeBoost: 2, speedBoost: 1 },
        timestamp: Date.now()
      };
      
      SaveSlotManager.saveToSlot(1, saveData);

      const mockOnStartGame = vi.fn();
      const mockOnLoadGame = vi.fn();
      
      render(<GameStartScreen onStartGame={mockOnStartGame} onLoadGame={mockOnLoadGame} />);
      
      const loadButton = screen.getByText(/📂 セーブデータから開始/);
      fireEvent.click(loadButton);
      
      await waitFor(() => {
        const slot1 = screen.getByTestId('save-slot-1');
        expect(slot1).toBeInTheDocument();
      });
      
      const slot1 = screen.getByTestId('save-slot-1');
      fireEvent.click(slot1);
      
      expect(mockOnLoadGame).toHaveBeenCalledWith(1);
    });
  });

  describe('ゲーム内セーブ/ロード', () => {
    test('ゲーム中にセーブしたデータを正しくロードできる', async () => {
      const { rerender } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // ゲームを進行させる
      const waveButton = screen.getByText(/Wave 1 開始/);
      fireEvent.click(waveButton);
      
      // セーブボタンをクリック
      await waitFor(() => {
        const saveButton = screen.getByText(/💾 セーブ/);
        fireEvent.click(saveButton);
      });
      
      // スロット1にセーブ
      await waitFor(() => {
        const slot1 = screen.getByTestId('save-slot-1');
        fireEvent.click(slot1);
      });
      
      // ゲームをリロード（新しいゲームを開始）
      rerender(<IntegratedGameV5 initialSettings={{
        initialCoins: 100,
        initialLives: 1,
        towerLifespan: 1,
        startingNation: 'tuvalu'
      }} />);
      
      // ロードボタンをクリック
      const loadButton = screen.getByText(/📂 ロード/);
      fireEvent.click(loadButton);
      
      // スロット1を選択
      await waitFor(() => {
        const slot1 = screen.getByTestId('save-slot-1');
        fireEvent.click(slot1);
      });
      
      // データが復元されたことを確認
      await waitFor(() => {
        expect(screen.getByText(/Wave: 1/)).toBeInTheDocument();
        expect(screen.getByText(/200/)).toBeInTheDocument(); // 初期コイン
      });
    });

    test('タワー配置状態も正しく保存・復元される', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 300,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // タワーを配置
      const canvas = screen.getByRole('img'); // Canvasのrole
      fireEvent.click(canvas, { clientX: 300, clientY: 200 });
      
      // セーブ
      const saveButton = screen.getByText(/💾 セーブ/);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        const slot1 = screen.getByTestId('save-slot-1');
        fireEvent.click(slot1);
      });
      
      // ロード
      const loadButton = screen.getByText(/📂 ロード/);
      fireEvent.click(loadButton);
      
      await waitFor(() => {
        const slot1 = screen.getByTestId('save-slot-1');
        fireEvent.click(slot1);
      });
      
      // タワーが復元されたことを確認（コインが減っている）
      await waitFor(() => {
        expect(screen.getByText(/250/)).toBeInTheDocument(); // 300 - 50 (nauru cost)
      });
    });
  });

  describe('セーブデータの整合性', () => {
    test('破損したセーブデータは読み込まれない', async () => {
      // 破損したデータを作成
      localStorage.setItem('flagdefence_save_slot_1', 'invalid json data');
      
      const mockOnLoadGame = vi.fn();
      render(<GameStartScreen onStartGame={vi.fn()} onLoadGame={mockOnLoadGame} />);
      
      const loadButton = screen.getByText(/📂 セーブデータから開始/);
      fireEvent.click(loadButton);
      
      await waitFor(() => {
        const slot1 = screen.getByTestId('save-slot-1');
        expect(slot1).toHaveTextContent('空');
      });
    });

    test('必須フィールドが欠けているデータは無効とする', () => {
      const invalidData = {
        wave: 5,
        // coins missing
        lives: 3
      };
      
      localStorage.setItem('flagdefence_save_slot_2', JSON.stringify(invalidData));
      
      const loaded = SaveSlotManager.loadSlot(2);
      expect(loaded).toBeNull();
    });
  });

  describe('複数スロット管理', () => {
    test('5つのセーブスロットが利用可能', async () => {
      render(<GameStartScreen onStartGame={vi.fn()} onLoadGame={vi.fn()} />);
      
      const loadButton = screen.getByText(/📂 セーブデータから開始/);
      fireEvent.click(loadButton);
      
      await waitFor(() => {
        for (let i = 1; i <= 5; i++) {
          expect(screen.getByTestId(`save-slot-${i}`)).toBeInTheDocument();
        }
      });
    });

    test('異なるスロットに独立してセーブできる', () => {
      const data1 = {
        wave: 5,
        coins: 500,
        lives: 3,
        towers: [],
        ownedNations: ['nauru'],
        powerups: {},
        timestamp: Date.now()
      };
      
      const data2 = {
        wave: 20,
        coins: 2000,
        lives: 10,
        towers: [],
        ownedNations: ['nauru', 'japan', 'usa'],
        powerups: { damageBoost: 5 },
        timestamp: Date.now()
      };
      
      SaveSlotManager.saveToSlot(1, data1);
      SaveSlotManager.saveToSlot(2, data2);
      
      const loaded1 = SaveSlotManager.loadSlot(1);
      const loaded2 = SaveSlotManager.loadSlot(2);
      
      expect(loaded1?.wave).toBe(5);
      expect(loaded2?.wave).toBe(20);
    });
  });
});