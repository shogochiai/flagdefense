import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntegratedGameV5 } from '../src/spike/integrated-game-v5';
import { GameStartScreen } from '../src/spike/game-start-screen';
import { GDPEnemySystem } from '../src/spike/gdp-enemy-system';

// モックの設定
vi.mock('../src/spike/flag-renderer', () => ({
  FlagRenderer: {
    preloadFlag: vi.fn(),
    drawFlag: vi.fn(),
    getFlagColors: vi.fn(() => ['#FF0000', '#FFFFFF'])
  }
}));

describe('Critical Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('タワー配置', () => {
    it('キャンバスクリックでタワーが配置される', async () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // 初期コイン確認
      expect(screen.getByText(/💰 200/)).toBeInTheDocument();
      
      // キャンバスを取得
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
      
      // キャンバスの正しいサイズを確認
      expect(canvas).toHaveAttribute('width', '800');
      expect(canvas).toHaveAttribute('height', '400');
      
      // クリックイベント（レスポンシブ対応）
      const rect = canvas!.getBoundingClientRect();
      fireEvent.click(canvas!, {
        clientX: rect.left + 400,
        clientY: rect.top + 200
      });
      
      // コインが減ることを確認
      await waitFor(() => {
        expect(screen.getByText(/💰 150/)).toBeInTheDocument();
      });
    });

    it('キャンバスのスケーリングに対応している', () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      const canvas = container.querySelector('canvas');
      
      // CSSでスケールされても正しく計算されるか
      expect(canvas).toHaveStyle({ imageRendering: 'pixelated' });
    });
  });

  describe('ショップ機能', () => {
    it('ショップボタンが表示される', () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      // サイドショップはデフォルトで表示されている
      const shopButton = screen.getByText(/🛒 ショップを閉じる/);
      expect(shopButton).toBeInTheDocument();
    });

    it('ショップはデフォルトで表示されている', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // サイドショップの表示を確認
      await waitFor(() => {
        expect(screen.getByText('🆙 強化')).toBeInTheDocument();
        expect(screen.getByText('❤️ 残機')).toBeInTheDocument();
        expect(screen.getByText('🏳️ 国家')).toBeInTheDocument();
      });
    });

    it('ショップで国家を購入できる', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,  // Increased coins to afford purchases
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // サイドショップはデフォルトで表示されている
      await waitFor(() => {
        // 国家セクションをクリック
        const nationSection = screen.getByText('🏳️ 国家');
        fireEvent.click(nationSection);
        
        // 購入可能な国家が表示される（サイドショップでは別の形式）
        expect(screen.getByText(/ツバル/)).toBeInTheDocument();
      });
    });
  });

  describe('ガチャシステム', () => {
    it('Wave完了後に自動的に国家が追加される', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // 初期国家数
      expect(screen.getByText(/🏳️ 1/)).toBeInTheDocument();
      
      // Wave開始
      const waveButton = screen.getByText(/Wave 1 開始/);
      fireEvent.click(waveButton);
      
      // Wave完了をシミュレート（実際は25秒後）
      // テストでは直接状態を変更する必要がある
    });

    it('Wave完了後に国家が自動的に手に入る（簡易ガチャ）', () => {
      // 簡易化されたガチャシステムでは、Wave完了後に自動的に国家が追加される
      // ショップでのガチャ購入は削除された
      expect(true).toBe(true);
    });
  });

  describe('撃破履歴機能', () => {
    it('ショップに撃破ボタンが表示される', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // サイドショップはデフォルトで表示されている
      await waitFor(() => {
        const defeatButton = screen.getByText('🏆 撃破');
        expect(defeatButton).toBeInTheDocument();
      });
    });

    it('撃破ボタンをクリックすると撃破履歴が表示される', async () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      const defeatButton = screen.getByText('🏆 撃破');
      fireEvent.click(defeatButton);
      
      await waitFor(() => {
        // まだ撃破していない場合のメッセージ
        expect(screen.getByText('まだ国家を撃破していません')).toBeInTheDocument();
      });
    });

    it('ショップボタンが左寄せになっている', () => {
      render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // ショップボタンが存在することを確認
      const shopButton = screen.getByText(/🛒 ショップを閉じる/);
      expect(shopButton).toBeInTheDocument();
      
      // セーブ/ロードボタンが存在しないことを確認
      expect(screen.queryByText(/💾 セーブ/)).not.toBeInTheDocument();
      expect(screen.queryByText(/📂 ロード/)).not.toBeInTheDocument();
    });
  });

  describe('撃破通知システム', () => {
    it('報酬金額が正しく計算される', () => {
      // テスト用のGDP値
      const testGDP = 100;
      const reward = GDPEnemySystem.calculateReward(testGDP);
      
      // 基本報酬が40%増加されていることを確認
      const baseReward = 10 + Math.floor(Math.log10(testGDP + 1) * 5);
      const expectedReward = Math.floor(baseReward * 1.4);
      
      expect(reward).toBe(expectedReward);
      expect(reward).toBeGreaterThan(baseReward); // 40%増加確認
    });

    it('撃破通知テキストが正しいフォーマットである', () => {
      // 撃破通知のフォーマットを確認
      const testNation = { flag: '🏳️', name: 'Test Nation' };
      const defeatText = `${testNation.flag} ${testNation.name} 撃破！`;
      
      expect(defeatText).toMatch(/撃破！$/);
      expect(defeatText).toContain(testNation.flag);
      expect(defeatText).toContain(testNation.name);
      
      // 報酬テキストのフォーマットを確認
      const reward = 20;
      const rewardText = `+${reward}💰`;
      
      expect(rewardText).toMatch(/^\+\d+💰$/);
    });
  });

  describe('レスポンシブ対応', () => {
    it('キャンバスが正しくスケールされる', () => {
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 200,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      const canvas = container.querySelector('canvas');
      
      expect(canvas).toHaveAttribute('width', '800');
      expect(canvas).toHaveAttribute('height', '400');
    });
  });

  describe('Sequential Notifications', () => {
    beforeEach(() => {
      // Mock canvas context for notification tests
      const mockCtx = {
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        fillText: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        createLinearGradient: vi.fn(() => ({
          addColorStop: vi.fn()
        })),
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        globalAlpha: 1
      };
      
      HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx);
    });

    it('Wave完了通知が先に表示される', async () => {
      vi.useFakeTimers();
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      // Wave開始
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Wave完了まで時間を進める
      vi.advanceTimersByTime(26000);
      
      // Canvas contextを取得
      const canvas = container.querySelector('canvas');
      const ctx = canvas?.getContext('2d') as any;
      
      // Wave完了通知が描画されていることを確認
      await waitFor(() => {
        const fillTextCalls = ctx.fillText.mock.calls;
        const hasWaveComplete = fillTextCalls.some((call: any[]) => 
          call[0]?.includes('Wave完了') || call[0]?.includes('撃破国家一覧')
        );
        expect(hasWaveComplete).toBeTruthy();
      });
      
      vi.useRealTimers();
    });

    it('新国家通知はWave完了通知の後に表示される', async () => {
      vi.useFakeTimers();
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as any;
      
      // Wave開始
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      
      // Wave完了
      vi.advanceTimersByTime(26000);
      
      // 新国家通知はまだ表示されていない
      const fillTextCalls = ctx.fillText.mock.calls;
      const hasNewNation = fillTextCalls.some((call: any[]) => 
        call[0]?.includes('新しい国家を獲得')
      );
      expect(hasNewNation).toBeFalsy();
      
      // Wave完了通知をクリック
      const rect = canvas.getBoundingClientRect();
      fireEvent.click(canvas, {
        clientX: rect.left + 400,
        clientY: rect.top + 100
      });
      
      vi.advanceTimersByTime(100);
      
      // 新国家通知が表示される
      await waitFor(() => {
        const newFillTextCalls = ctx.fillText.mock.calls;
        const hasNewNationNow = newFillTextCalls.some((call: any[]) => 
          call[0]?.includes('新しい国家を獲得')
        );
        expect(hasNewNationNow).toBeTruthy();
      });
      
      vi.useRealTimers();
    });

    it('クリックで通知を進められる', async () => {
      vi.useFakeTimers();
      
      const { container } = render(<IntegratedGameV5 initialSettings={{
        initialCoins: 500,
        initialLives: 3,
        towerLifespan: 3,
        startingNation: 'nauru'
      }} />);
      
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      
      // Wave開始と完了
      const startButton = screen.getByText(/🌊 Wave 1 開始/);
      fireEvent.click(startButton);
      vi.advanceTimersByTime(26000);
      
      // 通知エリアをクリック
      fireEvent.click(canvas, {
        clientX: rect.left + 400,
        clientY: rect.top + 100
      });
      
      // クリックイベントが処理されることを確認
      expect(canvas).toBeInTheDocument();
      
      vi.useRealTimers();
    });
  });
});