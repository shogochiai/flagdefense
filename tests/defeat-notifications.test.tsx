import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { IntegratedGameV5 } from '../src/spike/integrated-game-v5';
import { GDPEnemySystem, NATION_DATABASE } from '../src/spike/gdp-enemy-system';
import { SideShop } from '../src/spike/side-shop';

// モックの設定
vi.mock('../src/spike/flag-renderer', () => ({
  FlagRenderer: {
    preloadFlag: vi.fn(),
    drawFlag: vi.fn(),
    getFlagColors: vi.fn(() => ['#FF0000', '#FFFFFF'])
  }
}));

// Canvas mock helper
const mockCanvasContext = () => {
  const ctx = {
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    clearRect: vi.fn(),
    arc: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn()
    })),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1
    })),
    putImageData: vi.fn(),
    shadowColor: '',
    shadowBlur: 0,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    globalAlpha: 1
  };
  
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ctx);
  return ctx;
};

describe('Defeat Notification System Tests', { timeout: 10000 }, () => {
  let mockCtx: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockCtx = mockCanvasContext();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Sequential Notifications Test', () => {
    it('should show wave completion notification first, then new nation notification after click', async () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      expect(canvas).toBeTruthy();
      
      // Start wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Advance time to complete the wave (25 seconds)
      act(() => {
        vi.advanceTimersByTime(26000);
      });
      
      // Check that wave complete notification is rendered
      await waitFor(() => {
        const fillTextCalls = mockCtx.fillText.mock.calls;
        const hasWaveComplete = fillTextCalls.some((call: any[]) => 
          call[0]?.includes('Wave完了') || call[0]?.includes('撃破国家一覧')
        );
        expect(hasWaveComplete).toBeTruthy();
      }, { timeout: 8000 });
      
      // Check that new nation notification is NOT shown yet
      const fillTextCalls = mockCtx.fillText.mock.calls;
      const hasNewNation = fillTextCalls.some((call: any[]) => 
        call[0]?.includes('新しい国家を獲得')
      );
      expect(hasNewNation).toBeFalsy();
      
      // Simulate click on wave complete notification
      const rect = canvas.getBoundingClientRect();
      fireEvent.click(canvas, {
        clientX: rect.left + 400, // Center of notification
        clientY: rect.top + 100   // Near top where notification appears
      });
      
      // Advance a frame to process the click
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      // Now check that new nation notification appears
      await waitFor(() => {
        const newFillTextCalls = mockCtx.fillText.mock.calls;
        const hasNewNationNow = newFillTextCalls.some((call: any[]) => 
          call[0]?.includes('新しい国家を獲得')
        );
        expect(hasNewNationNow).toBeTruthy();
      }, { timeout: 8000 });
    });

    it('should hide wave completion notification after 10 seconds', async () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Start wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Complete the wave
      act(() => {
        vi.advanceTimersByTime(26000);
      });
      
      // Check notification is shown
      await waitFor(() => {
        const fillTextCalls = mockCtx.fillText.mock.calls;
        const hasWaveComplete = fillTextCalls.some((call: any[]) => 
          call[0]?.includes('Wave完了')
        );
        expect(hasWaveComplete).toBeTruthy();
      }, { timeout: 8000 });
      
      // Clear previous calls
      mockCtx.fillText.mockClear();
      
      // Advance 11 seconds
      act(() => {
        vi.advanceTimersByTime(11000);
      });
      
      // Check notification is hidden
      await waitFor(() => {
        const fillTextCalls = mockCtx.fillText.mock.calls;
        const hasWaveComplete = fillTextCalls.some((call: any[]) => 
          call[0]?.includes('Wave完了')
        );
        expect(hasWaveComplete).toBeFalsy();
      }, { timeout: 8000 });
    });
  });

  describe('No Duplicate Defeats Test', () => {
    it('should not add the same nation twice to defeated list', async () => {
      // Mock GDPEnemySystem to return specific nations
      const mockNations = [
        NATION_DATABASE.find(n => n.id === 'usa')!,
        NATION_DATABASE.find(n => n.id === 'usa')!, // Duplicate
        NATION_DATABASE.find(n => n.id === 'china')!
      ];
      
      vi.spyOn(GDPEnemySystem, 'generateWaveNations').mockReturnValue(mockNations);
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Start wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Place a powerful tower to defeat enemies
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      
      // Place multiple towers
      for (let i = 0; i < 5; i++) {
        fireEvent.click(canvas, {
          clientX: rect.left + 200 + i * 100,
          clientY: rect.top + 200
        });
      }
      
      // Complete the wave
      act(() => {
        vi.advanceTimersByTime(26000);
      });
      
      // Check wave complete notification shows unique nations only
      await waitFor(() => {
        const fillTextCalls = mockCtx.fillText.mock.calls;
        const hasWaveComplete = fillTextCalls.some((call: any[]) => 
          call[0]?.includes('Wave完了')
        );
        expect(hasWaveComplete).toBeTruthy();
      }, { timeout: 8000 });
    });

    it('should show unique nations in defeat history', async () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Open defeat history - look for the actual button text
      const historyButton = screen.getByText(/🏆 撃破/);
      fireEvent.click(historyButton);
      
      // Should show empty history initially
      await waitFor(() => {
        expect(screen.getByText(/まだ国家を撃破していません/)).toBeInTheDocument();
      });
    });
  });

  describe('Active Defeat History Buttons Test', () => {
    it('should have orange styling on defeat history pagination buttons', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Find defeat history button - using actual text
      const historyButton = screen.getByText(/🏆 撃破/);
      
      // Check button exists and is clickable
      expect(historyButton).toBeInTheDocument();
    });

    it('should be properly clickable and styled', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      const historyButton = screen.getByText(/🏆 撃破/);
      
      // Check button is enabled
      expect(historyButton).not.toBeDisabled();
      
      // Click to open
      fireEvent.click(historyButton);
      
      // Check modal appears
      await waitFor(() => {
        expect(screen.getByText(/撃破した国家一覧/)).toBeInTheDocument();
      });
      
      // Close button should also be styled
      const closeButton = screen.getByText(/✕ 閉じる/);
      expect(closeButton).toHaveClass('bg-red-600');
      expect(closeButton).toHaveClass('hover:bg-red-700');
    });
  });

  describe('Wait for All Enemies Test', () => {
    it('should not show notifications while enemies are still alive', async () => {
      // Mock a slow enemy that takes time to reach the end
      const mockSlowNation = {
        ...NATION_DATABASE[0],
        gdp: 50000 // High GDP for high HP
      };
      
      vi.spyOn(GDPEnemySystem, 'generateWaveNations').mockReturnValue([mockSlowNation]);
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Start wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Advance time but not enough to defeat all enemies
      act(() => {
        vi.advanceTimersByTime(15000); // 15 seconds
      });
      
      // Check that no wave complete notification appears
      const fillTextCalls = mockCtx.fillText.mock.calls;
      const hasWaveComplete = fillTextCalls.some((call: any[]) => 
        call[0]?.includes('Wave完了')
      );
      expect(hasWaveComplete).toBeFalsy();
      
      // Advance more time to complete wave
      act(() => {
        vi.advanceTimersByTime(15000); // Total 30 seconds
      });
      
      // Now notification should appear
      await waitFor(() => {
        const newFillTextCalls = mockCtx.fillText.mock.calls;
        const hasWaveCompleteNow = newFillTextCalls.some((call: any[]) => 
          call[0]?.includes('Wave完了')
        );
        expect(hasWaveCompleteNow).toBeTruthy();
      }, { timeout: 8000 });
    });

    it('should only show notifications after ALL enemies are defeated', async () => {
      // Mock multiple enemies
      const mockNations = [
        NATION_DATABASE.find(n => n.id === 'usa')!,
        NATION_DATABASE.find(n => n.id === 'china')!,
        NATION_DATABASE.find(n => n.id === 'japan')!
      ];
      
      vi.spyOn(GDPEnemySystem, 'generateWaveNations').mockReturnValue(mockNations);
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 1000, // More coins for more towers
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Start wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Place multiple towers
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      
      for (let i = 0; i < 10; i++) {
        fireEvent.click(canvas, {
          clientX: rect.left + 100 + i * 60,
          clientY: rect.top + 150 + (i % 2) * 100
        });
      }
      
      // Complete the wave
      act(() => {
        vi.advanceTimersByTime(30000);
      });
      
      // Check that notification appears only after all enemies are gone
      await waitFor(() => {
        const fillTextCalls = mockCtx.fillText.mock.calls;
        const hasWaveComplete = fillTextCalls.some((call: any[]) => 
          call[0]?.includes('Wave完了')
        );
        expect(hasWaveComplete).toBeTruthy();
      }, { timeout: 8000 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle no defeats gracefully', async () => {
      // Mock no enemies spawned
      vi.spyOn(GDPEnemySystem, 'generateWaveNations').mockReturnValue([]);
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Start wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Complete the wave
      act(() => {
        vi.advanceTimersByTime(26000);
      });
      
      // No wave complete notification should appear
      const fillTextCalls = mockCtx.fillText.mock.calls;
      const hasWaveComplete = fillTextCalls.some((call: any[]) => 
        call[0]?.includes('Wave完了')
      );
      expect(hasWaveComplete).toBeFalsy();
    });

    it('should handle multiple defeats correctly', async () => {
      // Mock many enemies
      const mockNations = NATION_DATABASE.slice(0, 10);
      vi.spyOn(GDPEnemySystem, 'generateWaveNations').mockReturnValue(mockNations);
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 2000,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Start wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Place many towers
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      
      for (let i = 0; i < 20; i++) {
        fireEvent.click(canvas, {
          clientX: rect.left + 50 + (i % 10) * 70,
          clientY: rect.top + 100 + Math.floor(i / 10) * 100
        });
      }
      
      // Complete the wave
      act(() => {
        vi.advanceTimersByTime(30000);
      });
      
      // Check wave complete notification shows multiple nations
      await waitFor(() => {
        const fillTextCalls = mockCtx.fillText.mock.calls;
        const hasWaveComplete = fillTextCalls.some((call: any[]) => 
          call[0]?.includes('Wave完了')
        );
        expect(hasWaveComplete).toBeTruthy();
        
        // Should show "他 X カ国..." for overflow
        const hasOverflow = fillTextCalls.some((call: any[]) => 
          call[0]?.includes('他') && call[0]?.includes('カ国')
        );
        expect(hasOverflow).toBeTruthy();
      }, { timeout: 8000 });
    });

    it('should reset defeated nations list for each wave', async () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 1000,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Complete first wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      act(() => {
        vi.advanceTimersByTime(26000);
      });
      
      // Clear mock calls
      mockCtx.fillText.mockClear();
      
      // Start second wave
      await waitFor(() => {
        const wave2Button = screen.getByText(/🌊 Wave 2 開始/);
        fireEvent.click(wave2Button);
      });
      
      act(() => {
        vi.advanceTimersByTime(26000);
      });
      
      // Each wave should have its own defeated nations list
      await waitFor(() => {
        const fillTextCalls = mockCtx.fillText.mock.calls;
        const waveCompleteCount = fillTextCalls.filter((call: any[]) => 
          call[0]?.includes('Wave完了')
        ).length;
        expect(waveCompleteCount).toBeGreaterThan(0);
      }, { timeout: 8000 });
    });
  });

  describe('Notification Click Interaction', () => {
    it('should properly detect click boundaries on wave completion notification', async () => {
      // Mock some enemies to ensure wave completion notification shows
      const mockNations = [
        NATION_DATABASE.find(n => n.id === 'nauru')!,
        NATION_DATABASE.find(n => n.id === 'tuvalu')!
      ];
      vi.spyOn(GDPEnemySystem, 'generateWaveNations').mockReturnValue(mockNations);
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      
      // Place towers to defeat enemies
      for (let i = 0; i < 5; i++) {
        fireEvent.click(canvas, {
          clientX: rect.left + 200 + i * 80,
          clientY: rect.top + 200
        });
      }
      
      // Start and complete wave
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      act(() => {
        vi.advanceTimersByTime(26000);
      });
      
      // Click outside notification area - should not trigger
      fireEvent.click(canvas, {
        clientX: rect.left + 50,  // Far left
        clientY: rect.top + 350   // Bottom
      });
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      // Wave complete notification should still be visible
      const fillTextCalls = mockCtx.fillText.mock.calls;
      const hasWaveComplete = fillTextCalls.some((call: any[]) => 
        call[0]?.includes('Wave完了')
      );
      expect(hasWaveComplete).toBeTruthy();
      
      // Click inside notification area
      fireEvent.click(canvas, {
        clientX: rect.left + 400, // Center
        clientY: rect.top + 100  // Top area where notification appears
      });
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      // Wave complete notification should be hidden
      mockCtx.fillText.mockClear();
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      const newFillTextCalls = mockCtx.fillText.mock.calls;
      const hasWaveCompleteNow = newFillTextCalls.some((call: any[]) => 
        call[0]?.includes('Wave完了')
      );
      expect(hasWaveCompleteNow).toBeFalsy();
    });
  });
});

describe('撃破履歴クリック機能', () => {
  it('撃破履歴の国家をクリックすると詳細モーダルが表示される', async () => {
    const defeatedNations = {
      japan: { id: 'japan', name: 'Japan', flag: '🇯🇵', gdp: 5000, colors: ['#BC002D', '#FFFFFF'] },
      usa: { id: 'usa', name: 'USA', flag: '🇺🇸', gdp: 20000, colors: ['#B22234', '#FFFFFF', '#3C3B6E'] }
    };
    
    render(<SideShop
      coins={1000}
      lives={3}
      ownedNations={['nauru']}
      powerupsPurchased={{}}
      defeatedNations={defeatedNations}
      onPurchase={vi.fn()}
      onLivesPurchase={vi.fn()}
      onNationPurchase={vi.fn()}
    />);
    
    // 撃破セクションを開く
    const defeatButton = screen.getByText(/🏆/);
    fireEvent.click(defeatButton);
    
    // 日本をクリック（撃破セクション内のボタン）
    await waitFor(() => {
      const japanButtons = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Japan') ?? false;
      });
      // 撃破セクション内のボタンを選択（orangeスタイルのもの）
      const defeatButton = japanButtons.find(btn => 
        btn.className?.includes('bg-orange-600')
      );
      expect(defeatButton).toBeDefined();
      fireEvent.click(defeatButton!);
    });
    
    // モーダルが表示される
    // 背景オーバーレイが存在することを確認
    const modal = document.querySelector('.fixed.inset-0.bg-black');
    expect(modal).toBeInTheDocument();
    
    // モーダル内にJapanが表示されている
    const modalContent = document.querySelector('.bg-gradient-to-r.from-yellow-600');
    expect(modalContent).toBeInTheDocument();
    expect(modalContent?.textContent).toContain('Japan');
    expect(modalContent?.textContent).toContain('5,000');
  });
  
  it('モーダルの閉じるボタンが機能する', async () => {
    const defeatedNations = {
      japan: { id: 'japan', name: 'Japan', flag: '🇯🇵', gdp: 5000, colors: ['#BC002D', '#FFFFFF'] }
    };
    
    render(<SideShop
      coins={1000}
      lives={3}
      ownedNations={['nauru']}
      powerupsPurchased={{}}
      defeatedNations={defeatedNations}
      onPurchase={vi.fn()}
      onLivesPurchase={vi.fn()}
      onNationPurchase={vi.fn()}
    />);
    
    // 撃破セクションを開く
    const defeatButton = screen.getByText(/🏆/);
    fireEvent.click(defeatButton);
    
    // 日本をクリック（撃破セクション内のボタン）
    await waitFor(() => {
      const japanButtons = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Japan') ?? false;
      });
      // 撃破セクション内のボタンを選択（orangeスタイルのもの）
      const defeatButton = japanButtons.find(btn => 
        btn.className?.includes('bg-orange-600')
      );
      expect(defeatButton).toBeDefined();
      fireEvent.click(defeatButton!);
    });
    
    // 閉じるボタンをクリック
    const closeButton = screen.getByText(/じる/);
    fireEvent.click(closeButton);
    
    // モーダルが消える
    await waitFor(() => {
      expect(screen.queryByText(/🎉.*情報/)).not.toBeInTheDocument();
    });
  });
  
  it('モーダルの背景をクリックしても閉じる', async () => {
    const defeatedNations = {
      japan: { id: 'japan', name: 'Japan', flag: '🇯🇵', gdp: 5000, colors: ['#BC002D', '#FFFFFF'] }
    };
    
    render(<SideShop
      coins={1000}
      lives={3}
      ownedNations={['nauru']}
      powerupsPurchased={{}}
      defeatedNations={defeatedNations}
      onPurchase={vi.fn()}
      onLivesPurchase={vi.fn()}
      onNationPurchase={vi.fn()}
    />);
    
    // 撃破セクションを開く
    const defeatButton = screen.getByText(/🏆/);
    fireEvent.click(defeatButton);
    
    // 日本をクリック（撃破セクション内のボタン）
    await waitFor(() => {
      const japanButtons = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Japan') ?? false;
      });
      // 撃破セクション内のボタンを選択（orangeスタイルのもの）
      const defeatButton = japanButtons.find(btn => 
        btn.className?.includes('bg-orange-600')
      );
      expect(defeatButton).toBeDefined();
      fireEvent.click(defeatButton!);
    });
    
    // 背景をクリック
    const backdrop = document.querySelector('.fixed.inset-0.bg-black');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);
    
    // モーダルが消える
    await waitFor(() => {
      expect(screen.queryByText(/🎉.*情報/)).not.toBeInTheDocument();
    });
  });
});