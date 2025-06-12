import { describe, it, expect } from 'vitest';
import { PathSystem, PathPatterns } from '../src/spike/improved-path';

describe('PathSystem', () => {
  describe('基本機能', () => {
    it('パスの全長を正しく計算', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 }
      ];
      const path = new PathSystem(points);
      expect(path.getTotalLength()).toBe(200);
    });

    it('単一セグメントの長さ計算', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 3, y: 4 } // 3-4-5の直角三角形
      ];
      const path = new PathSystem(points);
      expect(path.getTotalLength()).toBe(5);
    });

    it('距離0での位置が開始点', () => {
      const points = [
        { x: 10, y: 20 },
        { x: 100, y: 200 }
      ];
      const path = new PathSystem(points);
      const pos = path.getPositionAtDistance(0);
      
      expect(pos.x).toBe(10);
      expect(pos.y).toBe(20);
    });

    it('全長以上の距離で最終点を返す', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ];
      const path = new PathSystem(points);
      const totalLength = path.getTotalLength();
      const pos = path.getPositionAtDistance(totalLength + 100);
      
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(100);
    });

    it('中間地点の位置を正確に計算', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 0 }
      ];
      const path = new PathSystem(points);
      const pos = path.getPositionAtDistance(50);
      
      expect(pos.x).toBe(50);
      expect(pos.y).toBe(0);
      expect(pos.angle).toBe(0); // 右向き
    });

    it('複数セグメントでの位置計算', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 }
      ];
      const path = new PathSystem(points);
      
      // 第1セグメント上
      const pos1 = path.getPositionAtDistance(50);
      expect(pos1.x).toBe(50);
      expect(pos1.y).toBe(0);
      
      // 第2セグメント上
      const pos2 = path.getPositionAtDistance(150);
      expect(pos2.x).toBe(100);
      expect(pos2.y).toBe(50);
    });

    it('角度が正しく計算される', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 }
      ];
      const path = new PathSystem(points);
      
      // 水平セグメント
      const pos1 = path.getPositionAtDistance(50);
      expect(pos1.angle).toBe(0); // 右向き
      
      // 垂直セグメント
      const pos2 = path.getPositionAtDistance(150);
      expect(pos2.angle).toBeCloseTo(Math.PI / 2); // 下向き
    });
  });

  describe('isOnPath', () => {
    it('パス上の点を正しく判定', () => {
      const points = [
        { x: 0, y: 100 },
        { x: 200, y: 100 }
      ];
      const path = new PathSystem(points);
      
      expect(path.isOnPath(100, 100)).toBe(true);
      expect(path.isOnPath(0, 100)).toBe(true);
      expect(path.isOnPath(200, 100)).toBe(true);
    });

    it('パス外の点を正しく判定', () => {
      const points = [
        { x: 0, y: 100 },
        { x: 200, y: 100 }
      ];
      const path = new PathSystem(points);
      
      expect(path.isOnPath(100, 50)).toBe(false);
      expect(path.isOnPath(100, 150)).toBe(false);
      expect(path.isOnPath(250, 100)).toBe(false);
    });

    it('許容範囲内の点を判定', () => {
      const points = [
        { x: 0, y: 100 },
        { x: 200, y: 100 }
      ];
      const path = new PathSystem(points);
      
      expect(path.isOnPath(100, 120, 25)).toBe(true); // 20ピクセル離れ
      expect(path.isOnPath(100, 130, 25)).toBe(false); // 30ピクセル離れ
    });

    it('コーナー付近の判定', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 }
      ];
      const path = new PathSystem(points);
      
      // コーナーの点
      expect(path.isOnPath(100, 0)).toBe(true);
      // コーナー付近だが外側（許容範囲を小さくして確実に外側になるようにする）
      expect(path.isOnPath(130, 30, 10)).toBe(false);
    });
  });

  describe('getPoints', () => {
    it('元のポイント配列のコピーを返す', () => {
      const originalPoints = [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ];
      const path = new PathSystem(originalPoints);
      const points = path.getPoints();
      
      expect(points).toEqual(originalPoints);
      expect(points).not.toBe(originalPoints); // 別の配列インスタンス
    });
  });
});

describe('PathPatterns', () => {
  describe('zigzag', () => {
    it('指定されたセグメント数でジグザグパスを生成', () => {
      const points = PathPatterns.zigzag(800, 400, 4);
      
      expect(points.length).toBe(5); // segments + 1
      expect(points[0].x).toBe(0);
      expect(points[4].x).toBe(800);
      
      // ジグザグの確認
      expect(points[0].y).toBeCloseTo(400 * 0.3);
      expect(points[1].y).toBeCloseTo(400 * 0.7);
      expect(points[2].y).toBeCloseTo(400 * 0.3);
    });
  });

  describe('sCurve', () => {
    it('S字カーブを生成', () => {
      const points = PathPatterns.sCurve(800, 400);
      
      expect(points.length).toBe(21); // steps + 1
      expect(points[0].x).toBe(0);
      expect(points[20].x).toBe(800);
      
      // 中央付近で高さの中心
      const middlePoint = points[10];
      expect(middlePoint.y).toBeCloseTo(400 * 0.5, 1);
    });
  });

  describe('spiral', () => {
    it('渦巻きパスを生成', () => {
      const points = PathPatterns.spiral(400, 200, 100, 2);
      
      expect(points.length).toBe(41); // turns * 20 + 1
      
      // 最初は最大半径
      const firstPoint = points[0];
      const firstRadius = Math.sqrt(
        Math.pow(firstPoint.x - 400, 2) + 
        Math.pow(firstPoint.y - 200, 2)
      );
      expect(firstRadius).toBeCloseTo(100);
      
      // 最後は小さい半径
      const lastPoint = points[40];
      const lastRadius = Math.sqrt(
        Math.pow(lastPoint.x - 400, 2) + 
        Math.pow(lastPoint.y - 200, 2)
      );
      expect(lastRadius).toBeLessThan(30);
    });

    it('回転数に応じてポイント数が増える', () => {
      const points1 = PathPatterns.spiral(400, 200, 100, 1);
      const points3 = PathPatterns.spiral(400, 200, 100, 3);
      
      expect(points1.length).toBe(21);
      expect(points3.length).toBe(61);
    });
  });
});