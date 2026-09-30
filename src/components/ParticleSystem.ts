export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'sparkle' | 'heart' | 'star' | 'circle';
  rotation: number;
  rotSpeed: number;
}

export class ParticleSystem {
  private pool: Particle[] = [];
  private maxParticles = 60;

  constructor() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.pool.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 8,
        color: '#ffdd57',
        alpha: 1,
        decay: 0.02,
        shape: 'sparkle',
        rotation: 0,
        rotSpeed: 0,
      });
    }
  }

  public burst(x: number, y: number, count = 16, type: 'sparkle' | 'heart' | 'star' | 'mixed' = 'mixed'): void {
    const colors = ['#FF6584', '#FFD166', '#06D6A0', '#118AB2', '#9D4EDD', '#FFFFFF', '#FFB703'];
    let spawned = 0;

    for (const p of this.pool) {
      if (!p.active && spawned < count) {
        p.active = true;
        p.x = x + (Math.random() - 0.5) * 16;
        p.y = y + (Math.random() - 0.5) * 16;
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed - 1.5; // Upward bias
        p.size = 6 + Math.random() * 8;
        p.color = colors[Math.floor(Math.random() * colors.length)];
        p.alpha = 1.0;
        p.decay = 0.018 + Math.random() * 0.022;
        p.shape = type === 'mixed' ? (Math.random() > 0.5 ? 'heart' : 'sparkle') : type;
        p.rotation = Math.random() * Math.PI * 2;
        p.rotSpeed = (Math.random() - 0.5) * 0.2;
        spawned++;
      }
    }
  }

  public update(dt = 1): void {
    for (const p of this.pool) {
      if (p.active) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.08 * dt; // Soft gravity
        p.vx *= 0.98; // Air resistance
        p.rotation += p.rotSpeed * dt;
        p.alpha -= p.decay * dt;

        if (p.alpha <= 0) {
          p.active = false;
        }
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.pool) {
      if (p.active && p.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.shape === 'heart') {
          this.drawHeart(ctx, p.size);
        } else if (p.shape === 'star') {
          this.drawStar(ctx, p.size);
        } else {
          this.drawSparkle(ctx, p.size);
        }

        ctx.restore();
      }
    }
  }

  public getBounds(): { minX: number; minY: number; maxX: number; maxY: number } | null {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let hasActive = false;

    for (const p of this.pool) {
      if (p.active && p.alpha > 0) {
        hasActive = true;
        const pad = p.size + 4;
        if (p.x - pad < minX) minX = p.x - pad;
        if (p.x + pad > maxX) maxX = p.x + pad;
        if (p.y - pad < minY) minY = p.y - pad;
        if (p.y + pad > maxY) maxY = p.y + pad;
      }
    }

    if (!hasActive) return null;
    return { minX, minY, maxX, maxY };
  }

  public get activeCount(): number {
    return this.pool.filter((p) => p.active).length;
  }

  public clear(): void {
    for (const p of this.pool) {
      p.active = false;
    }
  }

  public hasActiveParticles(): boolean {
    return this.pool.some((p) => p.active);
  }

  private drawSparkle(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.fill();
  }

  private drawStar(ctx: CanvasRenderingContext2D, size: number): void {
    const points = 5;
    const innerRadius = size * 0.4;
    const outerRadius = size;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  private drawHeart(ctx: CanvasRenderingContext2D, size: number): void {
    const s = size * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.6);
    ctx.bezierCurveTo(-s, -s * 0.4, -s * 1.2, s * 0.4, 0, s * 1.2);
    ctx.bezierCurveTo(s * 1.2, s * 0.4, s, -s * 0.4, 0, s * 0.6);
    ctx.fill();
  }
}
