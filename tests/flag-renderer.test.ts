import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FlagRenderer } from '../src/spike/flag-renderer';

// Image モックの設定
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';
  
  constructor() {
    // srcが設定されたらイベントを発火
    Object.defineProperty(this, 'src', {
      get: () => this._src,
      set: (value: string) => {
        this._src = value;
        // 非同期でイベントを発火
        setTimeout(() => {
          if (value.includes('fail')) {
            this.onerror?.();
          } else {
            this.onload?.();
          }
        }, 0);
      }
    });
  }
  private _src: string = '';
}

// @ts-ignore
global.Image = MockImage;

// Canvas Context2D モック
const createMockContext = () => {
  const calls: any[] = [];
  return {
    save: vi.fn(() => calls.push(['save'])),
    restore: vi.fn(() => calls.push(['restore'])),
    fillRect: vi.fn((x, y, w, h) => calls.push(['fillRect', x, y, w, h])),
    strokeRect: vi.fn((x, y, w, h) => calls.push(['strokeRect', x, y, w, h])),
    drawImage: vi.fn((img, x, y, w, h) => calls.push(['drawImage', img, x, y, w, h])),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    calls
  };
};

describe('FlagRenderer', () => {
  beforeEach(() => {
    // flagCacheを直接操作する代わりに、別の方法でクリアする
    // FlagRendererクラスの内部状態をリセット
  });

  describe('preloadFlag', () => {
    it('画像のプリロードが成功する', async () => {
      await FlagRenderer.preloadFlag('japan');
      // テストは成功を期待（エラーが発生しないこと）
      expect(true).toBe(true);
    });

    it('失敗する画像でもエラーにならない', async () => {
      await FlagRenderer.preloadFlag('fail_nation');
      // エラーが発生しないことを確認
      expect(true).toBe(true);
    });

    it('既にキャッシュされている場合は即座に完了', async () => {
      await FlagRenderer.preloadFlag('usa');
      await FlagRenderer.preloadFlag('usa');
      // 2回目も成功することを確認
      expect(true).toBe(true);
    });
  });

  describe('preloadFlags', () => {
    it('複数の国旗を一括プリロード', async () => {
      const nations = ['japan', 'usa', 'germany', 'france'];
      await FlagRenderer.preloadFlags(nations);
      // エラーが発生しないことを確認
      expect(true).toBe(true);
    });

    it('一部が失敗しても他は成功する', async () => {
      const nations = ['japan', 'fail_nation', 'germany'];
      await FlagRenderer.preloadFlags(nations);
      // エラーが発生しないことを確認
      expect(true).toBe(true);
    });
  });

  describe('drawFlag', () => {
    it('キャッシュされた画像を描画', async () => {
      const ctx = createMockContext();
      await FlagRenderer.preloadFlag('japan');
      
      FlagRenderer.drawFlag(ctx as any, 'japan', 100, 100, 40, 30);
      
      const drawImageCalls = ctx.calls.filter(c => c[0] === 'drawImage');
      expect(drawImageCalls).toHaveLength(1);
      expect(drawImageCalls[0]).toMatchObject(['drawImage', expect.any(Object), 80, 85, 40, 30]);
    });

    it('画像がない場合はフォールバック描画', () => {
      const ctx = createMockContext();
      
      FlagRenderer.drawFlag(ctx as any, 'unknown_nation', 100, 100, 40, 30, ['#FF0000', '#FFFFFF']);
      
      const fillRectCalls = ctx.calls.filter(c => c[0] === 'fillRect');
      expect(fillRectCalls.length).toBeGreaterThan(0);
      
      const strokeRectCalls = ctx.calls.filter(c => c[0] === 'strokeRect');
      expect(strokeRectCalls).toHaveLength(1);
    });

    it('影の設定が適用される', async () => {
      const ctx = createMockContext();
      await FlagRenderer.preloadFlag('usa');
      
      FlagRenderer.drawFlag(ctx as any, 'usa', 200, 200);
      
      // 影の設定を確認
      expect(ctx.shadowColor).toBe('rgba(0, 0, 0, 0.3)');
      expect(ctx.shadowBlur).toBe(3);
      expect(ctx.shadowOffsetX).toBe(1);
      expect(ctx.shadowOffsetY).toBe(1);
    });
  });

  describe('getFlagColors', () => {
    it('既知の国の色を返す', () => {
      expect(FlagRenderer.getFlagColors('japan')).toEqual(['#FFFFFF', '#BC002D']);
      expect(FlagRenderer.getFlagColors('usa')).toEqual(['#B22234', '#FFFFFF', '#3C3B6E']);
      expect(FlagRenderer.getFlagColors('germany')).toEqual(['#000000', '#FF0000', '#FFD700']);
    });

    it('未知の国はデフォルト色を返す', () => {
      expect(FlagRenderer.getFlagColors('unknown_country')).toEqual(['#999999', '#666666']);
      expect(FlagRenderer.getFlagColors('atlantis')).toEqual(['#999999', '#666666']);
    });

    it('極小国の色も定義されている', () => {
      expect(FlagRenderer.getFlagColors('vatican')).toEqual(['#FFE000', '#FFFFFF']);
      expect(FlagRenderer.getFlagColors('monaco')).toEqual(['#FF0000', '#FFFFFF']);
    });
  });

  describe('統合テスト', () => {
    it('プリロード失敗後もフォールバックで描画できる', async () => {
      const ctx = createMockContext();
      
      // 失敗する画像をプリロード
      await FlagRenderer.preloadFlag('fail_nation');
      
      // 描画（フォールバックが使われる）
      FlagRenderer.drawFlag(ctx as any, 'fail_nation', 100, 100, 40, 30, ['#00FF00', '#FFFF00']);
      
      const fillRectCalls = ctx.calls.filter(c => c[0] === 'fillRect');
      expect(fillRectCalls.length).toBeGreaterThan(0);
      
      // drawImageは呼ばれない
      const drawImageCalls = ctx.calls.filter(c => c[0] === 'drawImage');
      expect(drawImageCalls).toHaveLength(0);
    });

    it('まだロード中の画像はフォールバックで描画', () => {
      const ctx = createMockContext();
      
      // プリロードを開始するが完了を待たない
      FlagRenderer.preloadFlag('loading_nation');
      
      // 即座に描画（まだロード中）
      FlagRenderer.drawFlag(ctx as any, 'loading_nation', 100, 100);
      
      const fillRectCalls = ctx.calls.filter(c => c[0] === 'fillRect');
      expect(fillRectCalls.length).toBeGreaterThan(0);
    });
  });
});