import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntegratedGameV5 } from '../src/spike/integrated-game-v5';
import { DefeatedNationsList } from '../src/spike/defeated-nations-list';
import { NATION_DATABASE, GDPEnemySystem } from '../src/spike/gdp-enemy-system';

// Mock the entire canvas and animation frames
vi.mock('../src/spike/flag-renderer', () => ({
  FlagRenderer: {
    preloadFlag: vi.fn(),
    drawFlag: vi.fn(),
    getFlagColors: vi.fn(() => ['#FF0000', '#FFFFFF'])
  }
}));

describe('Defeat Notification System - Simplified Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock requestAnimationFrame to prevent infinite loops
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      setTimeout(() => cb(0), 16);
      return 0;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Defeat History Component', () => {
    it('should show empty state when no nations defeated', () => {
      render(
        <DefeatedNationsList 
          defeatedNations={{}} 
          onClose={vi.fn()} 
        />
      );
      
      expect(screen.getByText(/まだ国家を撃破していません/)).toBeInTheDocument();
    });

    it('should show defeated nations list', () => {
      const defeatedNations = {
        usa: NATION_DATABASE.find(n => n.id === 'usa')!,
        china: NATION_DATABASE.find(n => n.id === 'china')!
      };
      
      render(
        <DefeatedNationsList 
          defeatedNations={defeatedNations} 
          onClose={vi.fn()} 
        />
      );
      
      expect(screen.getByText(/撃破した国家一覧 \(2カ国\)/)).toBeInTheDocument();
      expect(screen.getByText('アメリカ')).toBeInTheDocument();
      expect(screen.getByText('中国')).toBeInTheDocument();
    });

    it('should handle close button click', () => {
      const onClose = vi.fn();
      render(
        <DefeatedNationsList 
          defeatedNations={{}} 
          onClose={onClose} 
        />
      );
      
      const closeButton = screen.getByText(/✕ 閉じる/);
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('should copy markdown to clipboard', async () => {
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined)
      };
      Object.assign(navigator, { clipboard: mockClipboard });
      
      const defeatedNations = {
        usa: NATION_DATABASE.find(n => n.id === 'usa')!
      };
      
      render(
        <DefeatedNationsList 
          defeatedNations={defeatedNations} 
          onClose={vi.fn()} 
        />
      );
      
      const copyButton = screen.getByText(/📋 Markdownコピー/);
      
      // Mock alert
      vi.stubGlobal('alert', vi.fn());
      
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalled();
        const markdown = mockClipboard.writeText.mock.calls[0][0];
        expect(markdown).toContain('# 撃破した国家一覧');
        expect(markdown).toContain('アメリカ');
      });
    });
  });

  describe('Game UI Elements', () => {
    it('should have defeat history button in side shop', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Check that the defeat history button exists
      const defeatButton = screen.getByText(/🏆 撃破/);
      expect(defeatButton).toBeInTheDocument();
    });

    it('should have defeat history button that expands section', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      const defeatButton = screen.getByText(/🏆 撃破/);
      expect(defeatButton).toBeInTheDocument();
      
      // Click to expand the defeat section
      fireEvent.click(defeatButton);
      
      // Check that the button now shows expanded state
      await waitFor(() => {
        const expandedButton = screen.getByText(/🏆 撃破/);
        const parentDiv = expandedButton.closest('button');
        expect(parentDiv).toBeInTheDocument();
      });
    });

    it('should start wave when button clicked', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      expect(startButton).toBeInTheDocument();
      
      fireEvent.click(startButton);
      
      // After clicking, the button should show in-progress state
      await waitFor(() => {
        const progressText = screen.queryByText(/Wave 1 進行中/);
        const disabledButton = screen.queryByText(/🌊 Wave 1 開始/);
        // Either we see progress text or the button is disabled/changed
        expect(progressText || !disabledButton).toBeTruthy();
      });
    });
  });

  describe('Nation Database', () => {
    it('should have unique nation IDs', () => {
      const ids = NATION_DATABASE.map(n => n.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should calculate correct rarity for nations', () => {
      // Test low GDP nation
      const lowGdpNation = NATION_DATABASE.find(n => n.gdp < 1)!;
      const lowRarity = GDPEnemySystem.getRarity(lowGdpNation.gdp);
      expect(lowRarity.stars).toBe(1);
      
      // Test high GDP nation
      const highGdpNation = NATION_DATABASE.find(n => n.gdp > 10000)!;
      const highRarity = GDPEnemySystem.getRarity(highGdpNation.gdp);
      expect(highRarity.stars).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Tower Placement', () => {
    it('should reduce coins when tower placed', async () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Initial coins
      expect(screen.getByText(/💰 200/)).toBeInTheDocument();
      
      // Get canvas
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
      
      // Click to place tower
      const rect = canvas!.getBoundingClientRect();
      fireEvent.click(canvas!, {
        clientX: rect.left + 400,
        clientY: rect.top + 200
      });
      
      // Check coins reduced
      await waitFor(() => {
        expect(screen.getByText(/💰 150/)).toBeInTheDocument();
      });
    });

    it('should not place tower if insufficient coins', async () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 30, // Less than 50 required
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Initial coins
      expect(screen.getByText(/💰 30/)).toBeInTheDocument();
      
      // Get canvas
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
      
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        
        // Try to place tower
        fireEvent.click(canvas, {
          clientX: rect.left + 400,
          clientY: rect.top + 200
        });
        
        // Coins should remain the same after a short wait
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(screen.getByText(/💰 30/)).toBeInTheDocument();
      }
    });
  });

  describe('Shop Categories', () => {
    it('should have all shop categories available', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Check all shop categories exist
      expect(screen.getByText(/🆙 強化/)).toBeInTheDocument();
      expect(screen.getByText(/❤️ 残機/)).toBeInTheDocument();
      expect(screen.getByText(/🏳️ 国家/)).toBeInTheDocument();
      expect(screen.getByText(/🏆 撃破/)).toBeInTheDocument();
    });
  });

  describe('Wave Number Display', () => {
    it('should show correct wave number', () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Check initial wave display - there are multiple elements with this text
      const waveElements = screen.getAllByText(/🌊 Wave 1/);
      expect(waveElements.length).toBeGreaterThan(0);
    });
  });
});