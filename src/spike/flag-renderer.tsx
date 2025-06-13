// 国旗レンダリングシステム（画像対応＋フォールバック）

interface FlagCache {
  [nationId: string]: HTMLImageElement | 'loading' | 'failed';
}

const flagCache: FlagCache = {};

export class FlagRenderer {
  // 画像のプリロード
  static preloadFlag(nationId: string): Promise<void> {
    return new Promise((resolve) => {
      if (flagCache[nationId] && flagCache[nationId] !== 'failed') {
        resolve();
        return;
      }

      const img = new Image();
      flagCache[nationId] = 'loading';
      
      img.onload = () => {
        flagCache[nationId] = img;
        resolve();
      };
      
      img.onerror = () => {
        flagCache[nationId] = 'failed';
        console.warn(`Failed to load flag: ${nationId}`);
        resolve(); // エラーでも続行
      };
      
      img.src = `${import.meta.env.BASE_URL}img/${nationId}.png`;
    });
  }

  // 複数の国旗を一括プリロード
  static async preloadFlags(nationIds: string[]): Promise<void> {
    await Promise.all(nationIds.map(id => this.preloadFlag(id)));
  }

  // Canvas上に国旗を描画
  static drawFlag(
    ctx: CanvasRenderingContext2D,
    nationId: string,
    x: number,
    y: number,
    width: number = 40,
    height: number = 30,
    fallbackColors: string[] = ['#999', '#666']
  ) {
    const cached = flagCache[nationId];
    
    // 画像が利用可能な場合
    if (cached && cached !== 'loading' && cached !== 'failed') {
      ctx.save();
      
      // 影を追加
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // 画像を描画
      ctx.drawImage(cached, x - width/2, y - height/2, width, height);
      
      // 枠線
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - width/2, y - height/2, width, height);
      
      ctx.restore();
    } else {
      // フォールバック: 色パターンで描画
      this.drawFallbackFlag(ctx, x, y, width, height, fallbackColors);
      
      // まだロード中でなければロード開始
      if (!cached) {
        this.preloadFlag(nationId);
      }
    }
  }

  // フォールバック用の国旗描画
  private static drawFallbackFlag(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    colors: string[]
  ) {
    ctx.save();
    
    const flagX = x - width/2;
    const flagY = y - height/2;
    
    // 背景色
    ctx.fillStyle = colors[0];
    ctx.fillRect(flagX, flagY, width, height);
    
    // 複数色のパターン
    if (colors.length === 2) {
      // 2色: 横2分割
      ctx.fillStyle = colors[1];
      ctx.fillRect(flagX, flagY + height/2, width, height/2);
    } else if (colors.length === 3) {
      // 3色: 横3分割
      const stripeHeight = height / 3;
      ctx.fillStyle = colors[1];
      ctx.fillRect(flagX, flagY + stripeHeight, width, stripeHeight);
      ctx.fillStyle = colors[2];
      ctx.fillRect(flagX, flagY + stripeHeight * 2, width, stripeHeight);
    } else if (colors.length >= 4) {
      // 4色以上: 横縞
      const stripeHeight = height / colors.length;
      colors.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(flagX, flagY + stripeHeight * index, width, stripeHeight);
      });
    }
    
    // 枠線
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(flagX, flagY, width, height);
    
    ctx.restore();
  }

  // 国旗カラーマップ（フォールバック用）
  static readonly flagColors: { [nationId: string]: string[] } = {
    japan: ['#FFFFFF', '#BC002D'],
    usa: ['#B22234', '#FFFFFF', '#3C3B6E'],
    china: ['#EE1C25', '#FFFF00'],
    germany: ['#000000', '#FF0000', '#FFD700'],
    uk: ['#012169', '#FFFFFF', '#C8102E'],
    france: ['#002654', '#FFFFFF', '#ED2939'],
    italy: ['#00A550', '#FFFFFF', '#FF0000'],
    brazil: ['#00A550', '#FFD700', '#002776'],
    canada: ['#FF0000', '#FFFFFF'],
    india: ['#FF9933', '#FFFFFF', '#00A550', '#000080'],
    russia: ['#FFFFFF', '#0039A6', '#DA291C'],
    spain: ['#FF0000', '#FFD700'],
    mexico: ['#00A550', '#FFFFFF', '#FF0000'],
    australia: ['#00008B', '#FFFFFF', '#FF0000'],
    south_korea: ['#FFFFFF', '#FF0000', '#0033A0', '#000000'],
    netherlands: ['#FF0000', '#FFFFFF', '#21468B'],
    sweden: ['#0066CC', '#FFD700'],
    switzerland: ['#FF0000', '#FFFFFF'],
    poland: ['#FFFFFF', '#DC143C'],
    belgium: ['#000000', '#FFD700', '#FF0000'],
    austria: ['#FF0000', '#FFFFFF'],
    denmark: ['#FF0000', '#FFFFFF'],
    norway: ['#FF0000', '#FFFFFF', '#002868'],
    finland: ['#FFFFFF', '#003580'],
    greece: ['#0066CC', '#FFFFFF'],
    portugal: ['#00A550', '#FF0000', '#FFD700'],
    ireland: ['#00A550', '#FFFFFF', '#FF8200'],
    singapore: ['#FF0000', '#FFFFFF'],
    thailand: ['#FF0000', '#FFFFFF', '#002664'],
    vietnam: ['#FF0000', '#FFD700'],
    philippines: ['#0066CC', '#FF0000', '#FFD700', '#FFFFFF'],
    indonesia: ['#FF0000', '#FFFFFF'],
    malaysia: ['#FF0000', '#FFFFFF', '#0033A0', '#FFD700'],
    // 極小国
    nauru: ['#002B7F', '#FFD700', '#FFFFFF'],
    tuvalu: ['#00BFFF', '#FFD700', '#FFFFFF'],
    vatican: ['#FFE000', '#FFFFFF'],
    monaco: ['#FF0000', '#FFFFFF'],
    liechtenstein: ['#002B7F', '#CE1126'],
    san_marino: ['#FFFFFF', '#5BCEFA'],
    // デフォルト
    default: ['#999999', '#666666']
  };

  // 国旗の色を取得
  static getFlagColors(nationId: string): string[] {
    return this.flagColors[nationId] || this.flagColors.default;
  }
}