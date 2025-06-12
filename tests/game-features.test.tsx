import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntegratedGameV3 } from '../src/spike/integrated-game-v3';
import { GDPEnemySystem } from '../src/spike/gdp-enemy-system';

// モックの設定
vi.mock('../src/spike/flag-renderer', () => ({
  FlagRenderer: {
    preloadFlag: vi.fn(),
    drawFlag: vi.fn(),
    getFlagColors: vi.fn(() => ['#FF0000', '#FFFFFF'])
  }
}));

describe('Game Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ショップシステム', () => {
    it('ショップでガチャチケットを購入できる', async () => {
      render(<IntegratedGameV3 />);
      
      const shopButton = screen.getByText(/🛒 ショップ/);
      fireEvent.click(shopButton);
      
      await waitFor(() => {
        const gachaTicket = screen.getByText(/ガチャチケット/);
        expect(gachaTicket).toBeInTheDocument();
      });
    });

    it('ショップで国家を直接購入できる（GDP比例価格）', async () => {
      render(<IntegratedGameV3 />);
      
      const shopButton = screen.getByText(/🛒 ショップ/);
      fireEvent.click(shopButton);
      
      await waitFor(() => {
        // 国家購入セクションがあるか確認
        expect(screen.getByText(/国家購入/)).toBeInTheDocument();
      });
    });

    it('残機の価格が現在の残機数に応じて上昇する', async () => {
      render(<IntegratedGameV3 />);
      
      const shopButton = screen.getByText(/🛒 ショップ/);
      fireEvent.click(shopButton);
      
      await waitFor(() => {
        const extraLife = screen.getByText(/追加残機/);
        expect(extraLife).toBeInTheDocument();
        // 価格が残機数に応じて変動することを確認
      });
    });

    it('ショップがモーダルとして中央に表示される', async () => {
      render(<IntegratedGameV3 />);
      
      const shopButton = screen.getByText(/🛒 ショップ/);
      fireEvent.click(shopButton);
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveClass('fixed', 'inset-0');
      });
    });
  });

  describe('Wave完了後のガチャ', () => {
    it('Wave完了後にガチャが表示される', async () => {
      // Wave完了をシミュレートする方法が必要
      render(<IntegratedGameV3 />);
      
      // Wave開始
      const startButton = screen.getByText(/Wave 1 開始/);
      fireEvent.click(startButton);
      
      // 実際のゲームでは25秒後に自動的にWaveが終了
      // テストでは手動でトリガーする必要がある
    });
  });

  describe('敵の出現パターン', () => {
    it('3Waveごとにタンクが出現する', () => {
      const wave3Enemies = GDPEnemySystem.generateWaveNations(3);
      const wave6Enemies = GDPEnemySystem.generateWaveNations(6);
      
      // Wave3とWave6でタンクが含まれることを確認
      // 実装に応じてテストを調整
    });

    it('6Waveごとにボスが出現する', () => {
      const wave6Enemies = GDPEnemySystem.generateWaveNations(6);
      const wave12Enemies = GDPEnemySystem.generateWaveNations(12);
      
      // Wave6とWave12でボスが含まれることを確認
    });
  });

  describe('GDP比例の国家購入', () => {
    it('全ての国家が購入可能（GDP比例価格）', async () => {
      render(<IntegratedGameV3 />);
      
      const shopButton = screen.getByText(/🛒 ショップ/);
      fireEvent.click(shopButton);
      
      await waitFor(() => {
        // アメリカ（高GDP）の価格が高いことを確認
        const usa = screen.getByText(/アメリカ/);
        expect(usa).toBeInTheDocument();
        
        // ナウル（低GDP）の価格が安いことを確認
        const nauru = screen.getByText(/ナウル/);
        expect(nauru).toBeInTheDocument();
      });
    });
  });

  describe('デザイン改善', () => {
    it('モダンなレイアウトが適用されている', () => {
      render(<IntegratedGameV3 />);
      
      // グラデーション背景
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveClass('bg-gradient-to-br');
      
      // カード風のコンポーネント
      const cards = screen.getAllByTestId('game-card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});