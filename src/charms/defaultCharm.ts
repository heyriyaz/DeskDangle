export interface CharmDefinition {
  id: string;
  name: string;
  radius: number;
  mass: number;
  frictionAir: number;
  restitution: number;
  angularDamping: number;
  draw: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    isHovered: boolean,
    isDragging: boolean
  ) => void;
}

/**
 * Default Charm: Celestial Prism
 * An original, elegant circular charm featuring a multi-layered metallic bezel,
 * deep cosmic sapphire/amethyst gradient core, golden star emblem, and high-DPI specular highlights.
 */
export const defaultCharm: CharmDefinition = {
  id: 'celestial-prism',
  name: 'Celestial Prism',
  radius: 34, // ~68px diameter, perfectly in 60-80px target range
  mass: 2.8,
  frictionAir: 0.007,
  restitution: 0.35,
  angularDamping: 0.05,

  draw: (ctx, x, y, angle, isHovered, isDragging) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const radius = defaultCharm.radius;
    const scale = isDragging ? 1.05 : isHovered ? 1.02 : 1.0;
    ctx.scale(scale, scale);

    // --- 1. Soft Ambient Drop Shadow ---
    ctx.save();
    ctx.shadowColor = isDragging
      ? 'rgba(0, 0, 0, 0.45)'
      : isHovered
      ? 'rgba(99, 102, 241, 0.4)'
      : 'rgba(0, 0, 0, 0.28)';
    ctx.shadowBlur = isDragging ? 16 : isHovered ? 14 : 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;

    // Shadow caster base circle
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 20, 28, 0.9)';
    ctx.fill();
    ctx.restore();

    // --- 2. Top Eyelet (Attachment Ring) ---
    ctx.save();
    const eyeletY = -radius - 3;
    ctx.beginPath();
    ctx.arc(0, eyeletY, 6, 0, Math.PI * 2);
    const eyeletGrad = ctx.createLinearGradient(-4, eyeletY - 6, 4, eyeletY + 6);
    eyeletGrad.addColorStop(0, '#fef08a');
    eyeletGrad.addColorStop(0.5, '#eab308');
    eyeletGrad.addColorStop(1, '#854d0e');
    ctx.fillStyle = eyeletGrad;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#fef9c3';
    ctx.stroke();

    // Eyelet hole
    ctx.beginPath();
    ctx.arc(0, eyeletY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fill();
    ctx.restore();

    // --- 3. Outer Metallic Bezel Ring ---
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    const bezelGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    if (isHovered || isDragging) {
      bezelGrad.addColorStop(0, '#fef08a'); // luminous gold
      bezelGrad.addColorStop(0.3, '#f59e0b');
      bezelGrad.addColorStop(0.7, '#d97706');
      bezelGrad.addColorStop(1, '#78350f');
    } else {
      bezelGrad.addColorStop(0, '#fef9c3'); // champagne gold
      bezelGrad.addColorStop(0.3, '#eab308');
      bezelGrad.addColorStop(0.7, '#b45309');
      bezelGrad.addColorStop(1, '#78350f');
    }
    ctx.fillStyle = bezelGrad;
    ctx.fill();

    // Bezel inner rim stroke
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.stroke();

    // --- 4. Inner Jewel Face (Cosmic Gradient) ---
    const innerRadius = radius - 4.5;
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
    const coreGrad = ctx.createRadialGradient(-innerRadius * 0.3, -innerRadius * 0.3, 2, 0, 0, innerRadius);
    coreGrad.addColorStop(0, '#4338ca'); // rich indigo
    coreGrad.addColorStop(0.45, '#312e81'); // deep royal violet
    coreGrad.addColorStop(0.85, '#0f172a'); // midnight slate
    coreGrad.addColorStop(1, '#020617'); // obsidian
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // Inner subtle concentric groove
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius - 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(165, 180, 252, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- 5. Celestial Star / Prism Emblem ---
    ctx.save();
    // Subtle glow behind emblem
    const starGlow = ctx.createRadialGradient(0, 0, 1, 0, 0, 18);
    starGlow.addColorStop(0, isHovered ? 'rgba(238, 242, 255, 0.45)' : 'rgba(224, 231, 255, 0.25)');
    starGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = starGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    // 4-pointed curved celestial star
    const starSize = 14;
    ctx.beginPath();
    ctx.moveTo(0, -starSize);
    ctx.quadraticCurveTo(0, 0, starSize, 0);
    ctx.quadraticCurveTo(0, 0, 0, starSize);
    ctx.quadraticCurveTo(0, 0, -starSize, 0);
    ctx.quadraticCurveTo(0, 0, 0, -starSize);
    ctx.closePath();

    const starGrad = ctx.createLinearGradient(-starSize, -starSize, starSize, starSize);
    starGrad.addColorStop(0, '#ffffff');
    starGrad.addColorStop(0.5, '#fef08a');
    starGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = starGrad;
    ctx.fill();

    // Secondary smaller 4-pointed diagonal sparkle
    const smallStar = starSize * 0.45;
    ctx.beginPath();
    ctx.moveTo(smallStar * 0.7, -smallStar * 0.7);
    ctx.quadraticCurveTo(0, 0, smallStar * 0.7, smallStar * 0.7);
    ctx.quadraticCurveTo(0, 0, -smallStar * 0.7, smallStar * 0.7);
    ctx.quadraticCurveTo(0, 0, -smallStar * 0.7, -smallStar * 0.7);
    ctx.quadraticCurveTo(0, 0, smallStar * 0.7, -smallStar * 0.7);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();

    // Center core point
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    // --- 6. Glassmorphic Surface Arc Highlight ---
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-innerRadius * 0.25, -innerRadius * 0.35, innerRadius * 0.6, innerRadius * 0.3, -Math.PI / 5, 0, Math.PI * 2);
    const glassGrad = ctx.createLinearGradient(
      -innerRadius * 0.5,
      -innerRadius * 0.6,
      0,
      0
    );
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
    glassGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.08)');
    glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glassGrad;
    ctx.fill();
    ctx.restore();

    // --- 7. Hover / Drag Energy Glow Ring ---
    if (isHovered || isDragging) {
      ctx.beginPath();
      ctx.arc(0, 0, radius + 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = isDragging
        ? 'rgba(253, 224, 71, 0.6)'
        : 'rgba(165, 180, 252, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  },
};
