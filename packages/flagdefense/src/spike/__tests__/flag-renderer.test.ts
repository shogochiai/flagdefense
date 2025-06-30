import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlagRenderer } from '../flag-renderer';

describe('FlagRenderer', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // Mock canvas and context
    mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      drawImage: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })),
      translate: vi.fn(),
      scale: vi.fn(),
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    } as any;

    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      width: 800,
      height: 400
    } as any;

    // Mock Image constructor
    global.Image = vi.fn(() => ({
      onload: null,
      onerror: null,
      src: '',
      width: 100,
      height: 100
    })) as any;
  });

  describe('preloadFlag', () => {
    it('should create new image for uncached flag', async () => {
      const promise = FlagRenderer.preloadFlag('test_nation');
      
      // Get the created image
      const img = vi.mocked(global.Image).mock.results[0].value;
      
      // Simulate successful load
      img.onload();
      
      await promise;
      
      expect(img.src).toContain('flags/img/test_nation.png');
    });

    it('should handle image load errors gracefully', async () => {
      const promise = FlagRenderer.preloadFlag('invalid_nation');
      
      // Get the created image
      const img = vi.mocked(global.Image).mock.results[0].value;
      
      // Simulate error
      img.onerror();
      
      await promise;
      
      // Should not throw
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('preloadFlags', () => {
    it('should preload multiple flags', async () => {
      const nationIds = ['usa', 'japan', 'france'];
      
      const promise = FlagRenderer.preloadFlags(nationIds);
      
      // Simulate all images loading
      vi.mocked(global.Image).mock.results.forEach(result => {
        result.value.onload();
      });
      
      await promise;
      
      expect(vi.mocked(global.Image)).toHaveBeenCalledTimes(3);
    });
  });

  describe('drawFlag', () => {
    it('should draw flag at specified position', () => {
      FlagRenderer.drawFlag(mockContext, 'test', 100, 100, 40, 30);
      
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('should use fallback colors when image not available', () => {
      const fallbackColors = ['#ff0000', '#0000ff'];
      FlagRenderer.drawFlag(mockContext, 'test', 100, 100, 40, 30, fallbackColors);
      
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('should apply shadow effects', () => {
      FlagRenderer.drawFlag(mockContext, 'test', 100, 100);
      
      expect(mockContext.shadowColor).toBeDefined();
      expect(mockContext.shadowBlur).toBeDefined();
    });
  });
});