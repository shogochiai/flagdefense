import React, { useState, useEffect, useRef } from 'react';

// 国旗画像の管理システム
export const FlagImageSystem = {
  // 画像キャッシュ
  imageCache: new Map<string, HTMLImageElement>(),
  
  // 画像のプリロード
  preloadFlags: (nationIds: string[]) => {
    nationIds.forEach(nationId => {
      if (!FlagImageSystem.imageCache.has(nationId)) {
        const img = new Image();
        img.src = `/img/${nationId}.png`;
        img.onload = () => {
          FlagImageSystem.imageCache.set(nationId, img);
        };
        img.onerror = () => {
          console.warn(`Failed to load flag image for ${nationId}`);
        };
      }
    });
  },
  
  // 画像の取得
  getFlag: (nationId: string): HTMLImageElement | null => {
    return FlagImageSystem.imageCache.get(nationId) || null;
  }
};

// 国旗表示コンポーネント
export const FlagImage: React.FC<{
  nationId: string;
  width?: number;
  height?: number;
  fallback?: React.ReactNode;
  className?: string;
}> = ({ nationId, width = 30, height = 20, fallback, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleError = () => {
    setImageError(true);
  };
  
  const handleLoad = () => {
    setImageLoaded(true);
  };
  
  if (imageError && fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <div className={`relative inline-block ${className}`} style={{ width, height }}>
      <img
        src={`/img/${nationId}.png`}
        alt={`${nationId} flag`}
        width={width}
        height={height}
        onError={handleError}
        onLoad={handleLoad}
        className={`${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
        style={{ objectFit: 'cover' }}
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded" />
      )}
    </div>
  );
};

// Canvas用の国旗描画関数
export const drawFlagOnCanvas = (
  ctx: CanvasRenderingContext2D,
  nationId: string,
  x: number,
  y: number,
  width: number = 40,
  height: number = 30,
  fallbackColors?: string[]
) => {
  const cachedImage = FlagImageSystem.getFlag(nationId);
  
  if (cachedImage && cachedImage.complete) {
    // 画像が利用可能な場合
    ctx.save();
    
    // 影を追加（オプション）
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // 画像を描画
    ctx.drawImage(cachedImage, x - width/2, y - height/2, width, height);
    
    // 枠線を追加
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width/2, y - height/2, width, height);
    
    ctx.restore();
  } else {
    // フォールバック: 色パターンで描画
    if (fallbackColors && fallbackColors.length > 0) {
      drawFallbackFlag(ctx, x, y, width, height, fallbackColors);
    } else {
      // デフォルトの灰色フラグ
      ctx.fillStyle = '#999';
      ctx.fillRect(x - width/2, y - height/2, width, height);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - width/2, y - height/2, width, height);
    }
    
    // 画像をバックグラウンドでロード
    if (!cachedImage) {
      const img = new Image();
      img.src = `/img/${nationId}.png`;
      img.onload = () => {
        FlagImageSystem.imageCache.set(nationId, img);
      };
    }
  }
};

// フォールバック用の旗描画
const drawFallbackFlag = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colors: string[]
) => {
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
};

// 国旗画像の一括プリロード用フック
export const useFlagPreloader = (nationIds: string[]) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let loadedCount = 0;
    const totalCount = nationIds.length;
    
    nationIds.forEach(nationId => {
      const img = new Image();
      img.src = `/img/${nationId}.png`;
      
      const handleComplete = () => {
        loadedCount++;
        setLoadingProgress((loadedCount / totalCount) * 100);
        
        if (loadedCount === totalCount) {
          setIsLoading(false);
        }
      };
      
      img.onload = () => {
        FlagImageSystem.imageCache.set(nationId, img);
        handleComplete();
      };
      
      img.onerror = () => {
        console.warn(`Failed to preload flag for ${nationId}`);
        handleComplete();
      };
    });
  }, [nationIds]);
  
  return { loadingProgress, isLoading };
};

// タワーや敵の描画時の使用例
export const drawTowerWithFlag = (
  ctx: CanvasRenderingContext2D,
  tower: { x: number; y: number; nationId: string },
  nation: { colors: string[]; flag: string }
) => {
  // 国旗画像を描画（フォールバック付き）
  drawFlagOnCanvas(ctx, tower.nationId, tower.x, tower.y, 40, 30, nation.colors);
  
  // 国旗の上にエモジフラグを表示（オプション）
  if (nation.flag) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(nation.flag, tower.x, tower.y);
    ctx.fillText(nation.flag, tower.x, tower.y);
  }
};

// 敵の描画時の使用例
export const drawEnemyWithFlag = (
  ctx: CanvasRenderingContext2D,
  enemy: { x: number; y: number; nationId: string; hp: number; maxHp: number },
  nation: { colors: string[] }
) => {
  // 国旗画像を描画（少し小さめ）
  drawFlagOnCanvas(ctx, enemy.nationId, enemy.x, enemy.y, 30, 20, nation.colors);
  
  // HP バー
  const barWidth = 30;
  const barHeight = 4;
  const hpRatio = enemy.hp / enemy.maxHp;
  
  // HP バー背景
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(enemy.x - barWidth/2, enemy.y - 15, barWidth, barHeight);
  
  // HP バー（現在値）
  ctx.fillStyle = '#00FF00';
  ctx.fillRect(enemy.x - barWidth/2, enemy.y - 15, barWidth * hpRatio, barHeight);
  
  // HP バー枠線
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(enemy.x - barWidth/2, enemy.y - 15, barWidth, barHeight);
};