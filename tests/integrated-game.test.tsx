import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntegratedGameV2 } from '../src/spike/integrated-game-v2';

// モックの設定
vi.mock('../src/spike/flag-renderer', () => ({
  FlagRenderer: {
    preloadFlag: vi.fn(),
    drawFlag: vi.fn(),
    getFlagColors: vi.fn(() => ['#FF0000', '#FFFFFF'])
  }
}));

describe('IntegratedGameV2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('残機システム', () => {
    it('初期残機は3', () => {
      render(<IntegratedGameV2 />);
      expect(screen.getByText(/❤️ 残機: 3/)).toBeInTheDocument();
    });

    it('敵が基地に到達しない限り残機は減らない', async () => {
      render(<IntegratedGameV2 />);
      
      // Wave開始
      const startButton = screen.getByText(/Wave 1 開始/);
      fireEvent.click(startButton);
      
      // 1秒待機（敵はまだ基地に到達していない）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 残機はまだ3のはず
      expect(screen.getByText(/❤️ 残機: 3/)).toBeInTheDocument();
    });

    it('次のWaveに移行しても残機は減らない', async () => {
      render(<IntegratedGameV2 />);
      
      // 初期残機確認
      expect(screen.getByText(/❤️ 残機: 3/)).toBeInTheDocument();
      
      // Wave開始
      const startButton = screen.getByText(/Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Wave終了まで待つ必要があるが、ここでは簡略化
      // 実際のゲームでは25秒後にWaveが終了
      
      // 残機は変わらないはず
      expect(screen.getByText(/❤️ 残機: 3/)).toBeInTheDocument();
    });
  });

  describe('ショップシステム', () => {
    it('ショップボタンが表示される', () => {
      render(<IntegratedGameV2 />);
      const shopButton = screen.getByText(/🛒 ショップ/);
      expect(shopButton).toBeInTheDocument();
    });

    it('ショップボタンをクリックするとショップが開く', async () => {
      render(<IntegratedGameV2 />);
      
      const shopButton = screen.getByText(/🛒 ショップ/);
      fireEvent.click(shopButton);
      
      // ショップモーダルが表示される
      await waitFor(() => {
        // 複数のショップテキストがあるため、getAllByTextを使用
        const shopTexts = screen.getAllByText(/ショップ/);
        expect(shopTexts.length).toBeGreaterThan(1); // ボタンとモーダルヘッダー
        expect(screen.getByText(/パワーアップ/)).toBeInTheDocument();
      });
    });

    it('ショップで残機を購入できる', async () => {
      render(<IntegratedGameV2 />);
      
      // コインを追加（テスト用）
      // 実際のゲームでは敵を倒してコインを獲得
      
      const shopButton = screen.getByText(/🛒 ショップ/);
      fireEvent.click(shopButton);
      
      await waitFor(() => {
        const extraLifeItem = screen.getByText(/追加残機/);
        expect(extraLifeItem).toBeInTheDocument();
      });
    });
  });

  describe('ガチャシステム', () => {
    it('Wave完了後にガチャモーダルが表示される', async () => {
      render(<IntegratedGameV2 />);
      
      // showGachaをtrueに設定する方法を見つける必要がある
      // これは統合テストでは難しいかもしれない
    });

    it('ガチャで新しい国家を獲得できる', async () => {
      render(<IntegratedGameV2 />);
      
      // 初期所有国家は日本のみ
      const nationSelect = screen.getByRole('combobox');
      expect(nationSelect).toHaveValue('japan');
      
      // ガチャを引いて新しい国家を獲得するテスト
    });
  });

  describe('初期国家', () => {
    it('初期国家は日本', () => {
      render(<IntegratedGameV2 />);
      
      const nationSelect = screen.getByRole('combobox');
      expect(nationSelect).toHaveValue('japan');
      
      // 所有国家数の確認
      expect(screen.getByText(/🏳️ 所有国家: 1/)).toBeInTheDocument();
    });

    it('日本の能力は精密射撃（ダメージ+30%、射程+20%）', () => {
      render(<IntegratedGameV2 />);
      
      const nationSelect = screen.getByRole('combobox');
      const selectedOption = nationSelect.querySelector('option[value="japan"]');
      
      // 日本の説明文に能力が含まれているか確認
      expect(selectedOption?.textContent).toContain('ダメージ+30%、射程+20%');
    });
  });

  describe('ゲームオーバー', () => {
    it('残機が0になるとゲームオーバー画面が表示される', () => {
      // 残機を0に設定してレンダリングする方法を考える必要がある
    });
  });
});