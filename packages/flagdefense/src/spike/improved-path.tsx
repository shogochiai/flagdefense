// 改善されたパスシステム

export interface PathPoint {
  x: number;
  y: number;
}

export class PathSystem {
  private points: PathPoint[];
  private segments: { length: number; direction: { x: number; y: number } }[] = [];
  private totalLength: number = 0;

  constructor(points: PathPoint[]) {
    this.points = points;
    this.calculateSegments();
  }

  // セグメント情報を事前計算
  private calculateSegments() {
    this.segments = [];
    this.totalLength = 0;

    for (let i = 0; i < this.points.length - 1; i++) {
      const from = this.points[i];
      const to = this.points[i + 1];
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      this.segments.push({
        length,
        direction: { x: dx / length, y: dy / length }
      });
      
      this.totalLength += length;
    }
  }

  // パス上の位置を取得
  getPositionAtDistance(distance: number): PathPoint & { angle: number } {
    if (distance <= 0) {
      return { ...this.points[0], angle: 0 };
    }
    
    if (distance >= this.totalLength) {
      const lastPoint = this.points[this.points.length - 1];
      return { ...lastPoint, angle: 0 };
    }

    let accumulatedDistance = 0;
    
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      
      if (accumulatedDistance + segment.length >= distance) {
        const segmentProgress = distance - accumulatedDistance;
        const from = this.points[i];
        
        return {
          x: from.x + segment.direction.x * segmentProgress,
          y: from.y + segment.direction.y * segmentProgress,
          angle: Math.atan2(segment.direction.y, segment.direction.x)
        };
      }
      
      accumulatedDistance += segment.length;
    }
    
    // フォールバック
    const lastPoint = this.points[this.points.length - 1];
    return { ...lastPoint, angle: 0 };
  }

  // パスを描画
  draw(ctx: CanvasRenderingContext2D, width: number = 40, color: string = '#666') {
    ctx.save();
    
    // パスの背景
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    this.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    
    // パスの縁取り
    ctx.strokeStyle = '#333';
    ctx.lineWidth = width + 4;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.stroke();
    
    ctx.restore();
  }

  // パス上に配置可能かチェック
  isOnPath(x: number, y: number, tolerance: number = 25): boolean {
    for (let i = 0; i < this.points.length - 1; i++) {
      const from = this.points[i];
      const to = this.points[i + 1];
      
      // 点と線分の距離を計算
      const A = x - from.x;
      const B = y - from.y;
      const C = to.x - from.x;
      const D = to.y - from.y;
      
      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      
      if (lenSq !== 0) {
        param = dot / lenSq;
      }
      
      let xx, yy;
      
      if (param < 0) {
        xx = from.x;
        yy = from.y;
      } else if (param > 1) {
        xx = to.x;
        yy = to.y;
      } else {
        xx = from.x + param * C;
        yy = from.y + param * D;
      }
      
      const dx = x - xx;
      const dy = y - yy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= tolerance) {
        return true;
      }
    }
    
    return false;
  }

  getTotalLength(): number {
    return this.totalLength;
  }

  getPoints(): PathPoint[] {
    return [...this.points];
  }
}

// よく使うパスパターン
export class PathPatterns {
  // ジグザグパス
  static zigzag(width: number, height: number, segments: number): PathPoint[] {
    const points: PathPoint[] = [];
    const segmentWidth = width / segments;
    
    for (let i = 0; i <= segments; i++) {
      points.push({
        x: i * segmentWidth,
        y: i % 2 === 0 ? height * 0.3 : height * 0.7
      });
    }
    
    return points;
  }

  // S字カーブ
  static sCurve(width: number, height: number): PathPoint[] {
    const points: PathPoint[] = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * width;
      const y = height * 0.5 + Math.sin(t * Math.PI * 2) * height * 0.3;
      points.push({ x, y });
    }
    
    return points;
  }

  // スパイラル（渦巻き）
  static spiral(centerX: number, centerY: number, radius: number, turns: number): PathPoint[] {
    const points: PathPoint[] = [];
    const steps = turns * 20;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * turns * Math.PI * 2;
      const r = radius * (1 - t * 0.8); // 徐々に半径を小さく
      
      points.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r
      });
    }
    
    return points;
  }
}