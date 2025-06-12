// 国旗別攻撃エフェクトシステム

export interface AttackEffect {
  type: string;
  draw: (ctx: CanvasRenderingContext2D, params: any) => void;
  update?: (params: any) => void;
  sound?: string;
}

// アクティブなエフェクトを管理
export class EffectManager {
  private effects: Map<string, any[]> = new Map();
  
  addEffect(type: string, params: any) {
    if (!this.effects.has(type)) {
      this.effects.set(type, []);
    }
    this.effects.get(type)!.push({
      ...params,
      startTime: Date.now(),
      id: Math.random()
    });
  }
  
  update(deltaTime: number) {
    this.effects.forEach((effectList, type) => {
      const effect = attackEffects[type];
      if (effect.update) {
        effectList.forEach(params => effect.update!(params));
      }
      
      // 古いエフェクトを削除
      this.effects.set(type, effectList.filter(e => 
        Date.now() - e.startTime < (e.duration || 1000)
      ));
    });
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    this.effects.forEach((effectList, type) => {
      const effect = attackEffects[type];
      effectList.forEach(params => effect.draw(ctx, params));
    });
  }
}

// 攻撃エフェクト定義
export const attackEffects: Record<string, AttackEffect> = {
  // === 基本攻撃 ===
  standard: {
    type: 'standard',
    draw: (ctx, { from, to, color = '#FFD700' }) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.restore();
    }
  },
  
  // === アメリカ: スターミサイル ===
  star_missile: {
    type: 'star_missile',
    draw: (ctx, { from, to, progress = 0 }) => {
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      
      ctx.save();
      // ミサイル本体
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(x - 8, y - 3, 16, 6);
      
      // 星条旗模様
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - 8, y - 3 + i * 2, 16, 1);
      }
      
      // 星
      drawStar(ctx, x + 6, y, 3, '#FFFFFF');
      
      // 煙跡
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 5; i++) {
        const trailX = x - (i + 1) * 10;
        ctx.fillStyle = `rgba(128, 128, 128, ${0.5 - i * 0.1})`;
        ctx.beginPath();
        ctx.arc(trailX, y, 3 + i, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
    update: (params) => {
      params.progress = Math.min(1, (params.progress || 0) + 0.05);
    }
  },
  
  // === 日本: 桜吹雪 ===
  sakura_blast: {
    type: 'sakura_blast',
    draw: (ctx, { from, to, petals = [] }) => {
      ctx.save();
      // レーザー光線
      const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      gradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 105, 180, 0.3)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      
      // 桜の花びら
      petals.forEach((petal: any) => {
        ctx.fillStyle = `rgba(255, 182, 193, ${petal.alpha})`;
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();
    },
    update: (params) => {
      if (!params.petals) params.petals = [];
      
      // 新しい花びらを追加
      if (Math.random() < 0.3) {
        params.petals.push({
          x: params.to.x + (Math.random() - 0.5) * 20,
          y: params.to.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          alpha: 1
        });
      }
      
      // 花びらを更新
      params.petals = params.petals.filter((petal: any) => {
        petal.x += petal.vx;
        petal.y += petal.vy;
        petal.rotation += petal.rotationSpeed;
        petal.alpha -= 0.02;
        return petal.alpha > 0;
      });
    }
  },
  
  // === ロシア: 冬将軍 ===
  winter_blast: {
    type: 'winter_blast',
    draw: (ctx, { target, radius = 50, snowflakes = [] }) => {
      ctx.save();
      
      // 凍結エリア
      const gradient = ctx.createRadialGradient(
        target.x, target.y, 0,
        target.x, target.y, radius
      );
      gradient.addColorStop(0, 'rgba(173, 216, 230, 0.6)');
      gradient.addColorStop(0.5, 'rgba(135, 206, 235, 0.4)');
      gradient.addColorStop(1, 'rgba(100, 149, 237, 0.1)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(target.x, target.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // 雪の結晶
      snowflakes.forEach((flake: any) => {
        drawSnowflake(ctx, flake.x, flake.y, flake.size, `rgba(255, 255, 255, ${flake.alpha})`);
      });
      
      ctx.restore();
    },
    update: (params) => {
      if (!params.snowflakes) params.snowflakes = [];
      
      // 新しい雪を追加
      if (params.snowflakes.length < 20) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * params.radius;
        params.snowflakes.push({
          x: params.target.x + Math.cos(angle) * distance,
          y: params.target.y + Math.sin(angle) * distance,
          size: Math.random() * 5 + 3,
          alpha: 1,
          vy: Math.random() * 0.5 + 0.5
        });
      }
      
      // 雪を更新
      params.snowflakes = params.snowflakes.filter((flake: any) => {
        flake.y += flake.vy;
        flake.alpha -= 0.01;
        return flake.alpha > 0;
      });
    }
  },
  
  // === ドイツ: プレシジョンレーザー ===
  precision_laser: {
    type: 'precision_laser',
    draw: (ctx, { from, to, pulsePhase = 0 }) => {
      ctx.save();
      
      // メインレーザー
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2 + Math.sin(pulsePhase) * 1;
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      
      // サブレーザー（精密照準）
      ctx.strokeStyle = '#FFFF00';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.lineDashOffset = -pulsePhase * 10;
      
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      
      // 照準マーク
      ctx.setLineDash([]);
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 1;
      drawCrosshair(ctx, to.x, to.y, 10 + Math.sin(pulsePhase) * 2);
      
      ctx.restore();
    },
    update: (params) => {
      params.pulsePhase = (params.pulsePhase || 0) + 0.2;
    }
  },
  
  // === ブラジル: カーニバルボム ===
  carnival_bomb: {
    type: 'carnival_bomb',
    draw: (ctx, { position, radius = 40, particles = [] }) => {
      ctx.save();
      
      // カラフルな爆発
      const colors = ['#00FF00', '#FFD700', '#0000FF', '#FF00FF', '#00FFFF'];
      
      particles.forEach((particle: any) => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.restore();
    },
    update: (params) => {
      if (!params.particles) params.particles = [];
      
      // 初期爆発
      if (params.particles.length === 0) {
        const colors = ['#00FF00', '#FFD700', '#0000FF', '#FF00FF', '#00FFFF'];
        for (let i = 0; i < 30; i++) {
          const angle = (Math.PI * 2 * i) / 30;
          const speed = Math.random() * 3 + 2;
          params.particles.push({
            x: params.position.x,
            y: params.position.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1
          });
        }
      }
      
      // パーティクル更新
      params.particles = params.particles.filter((particle: any) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // 重力
        particle.alpha -= 0.02;
        return particle.alpha > 0;
      });
    }
  },
  
  // === バチカン: 聖なる光 ===
  holy_light: {
    type: 'holy_light',
    draw: (ctx, { from, to, beamWidth = 30, glowIntensity = 0 }) => {
      ctx.save();
      
      // 光の柱
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const perpAngle = angle + Math.PI / 2;
      
      const gradient = ctx.createLinearGradient(
        from.x + Math.cos(perpAngle) * beamWidth,
        from.y + Math.sin(perpAngle) * beamWidth,
        from.x - Math.cos(perpAngle) * beamWidth,
        from.y - Math.sin(perpAngle) * beamWidth
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, `rgba(255, 255, 200, ${0.8 + glowIntensity * 0.2})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(from.x + Math.cos(perpAngle) * beamWidth, from.y + Math.sin(perpAngle) * beamWidth);
      ctx.lineTo(to.x + Math.cos(perpAngle) * beamWidth, to.y + Math.sin(perpAngle) * beamWidth);
      ctx.lineTo(to.x - Math.cos(perpAngle) * beamWidth, to.y - Math.sin(perpAngle) * beamWidth);
      ctx.lineTo(from.x - Math.cos(perpAngle) * beamWidth, from.y - Math.sin(perpAngle) * beamWidth);
      ctx.closePath();
      ctx.fill();
      
      // 十字架
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      drawCross(ctx, to.x, to.y, 15);
      
      ctx.restore();
    },
    update: (params) => {
      params.glowIntensity = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
    }
  }
};

// ヘルパー関数
function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const outerX = x + Math.cos(angle) * size;
    const outerY = y + Math.sin(angle) * size;
    
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    
    const innerAngle = angle + Math.PI / 5;
    const innerX = x + Math.cos(innerAngle) * size * 0.5;
    const innerY = y + Math.sin(innerAngle) * size * 0.5;
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fill();
}

function drawSnowflake(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
    ctx.stroke();
  }
}

function drawCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x - size * 1.5, y);
  ctx.lineTo(x - size * 0.5, y);
  ctx.moveTo(x + size * 0.5, y);
  ctx.lineTo(x + size * 1.5, y);
  ctx.moveTo(x, y - size * 1.5);
  ctx.lineTo(x, y - size * 0.5);
  ctx.moveTo(x, y + size * 0.5);
  ctx.lineTo(x, y + size * 1.5);
  ctx.stroke();
}

function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.moveTo(x - size * 0.6, y - size * 0.3);
  ctx.lineTo(x + size * 0.6, y - size * 0.3);
  ctx.stroke();
}