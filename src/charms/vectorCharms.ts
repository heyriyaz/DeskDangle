// Original & Realistic Talisman Vector Charms for Dangle

/**
 * Utility: Draws a realistic stacked beads attachment above the charm
 */
export function drawTalismanBeads(
  ctx: CanvasRenderingContext2D,
  radius: number,
  beadTypes: Array<{ color: string; size: number; hasEye?: boolean }>
): void {
  ctx.save();
  let currentY = -radius - 2;

  for (let i = 0; i < beadTypes.length; i++) {
    const bead = beadTypes[i];
    currentY -= bead.size + 2;

    ctx.beginPath();
    ctx.arc(0, currentY, bead.size, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(
      -bead.size * 0.3,
      currentY - bead.size * 0.3,
      1,
      0,
      currentY,
      bead.size
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, bead.color);
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.stroke();

    if (bead.hasEye) {
      // Mini Evil Eye dot on bead
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, currentY, bead.size * 0.55, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, currentY, bead.size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, currentY, bead.size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Top eyelet hole
  const topEyeletY = currentY - 4;
  ctx.beginPath();
  ctx.arc(0, topEyeletY, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Utility: Draws a standard golden eyelet ring at top of charm
 */
export function drawEyelet(ctx: CanvasRenderingContext2D, radius: number): void {
  ctx.save();
  const eyeletY = -radius - 3;
  ctx.beginPath();
  ctx.arc(0, eyeletY, 5.5, 0, Math.PI * 2);
  const eyeletGrad = ctx.createLinearGradient(-4, eyeletY - 5, 4, eyeletY + 5);
  eyeletGrad.addColorStop(0, '#fef08a');
  eyeletGrad.addColorStop(0.5, '#eab308');
  eyeletGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = eyeletGrad;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = '#fef9c3';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, eyeletY, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fill();
  ctx.restore();
}

/**
 * Utility: Draws a polished metallic charm eyelet & jump ring for custom images / stickers
 */
export function drawCustomCharmFixture(ctx: CanvasRenderingContext2D, topY: number): void {
  ctx.save();
  const ringY = topY - 3;

  // 1. Clasp / Clamp onto charm top border
  ctx.beginPath();
  ctx.roundRect(-4.5, topY - 1, 9, 5, 1.5);
  const clampGrad = ctx.createLinearGradient(-4, topY, 4, topY + 4);
  clampGrad.addColorStop(0, '#fef08a');
  clampGrad.addColorStop(0.5, '#eab308');
  clampGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = clampGrad;
  ctx.fill();
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.stroke();

  // 2. Metallic Jump Ring
  ctx.beginPath();
  ctx.arc(0, ringY, 5, 0, Math.PI * 2);
  const ringGrad = ctx.createLinearGradient(-4, ringY - 5, 4, ringY + 5);
  ringGrad.addColorStop(0, '#fef9c3');
  ringGrad.addColorStop(0.4, '#eab308');
  ringGrad.addColorStop(0.8, '#a16207');
  ringGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = ringGrad;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // 3. Ring center hole
  ctx.beginPath();
  ctx.arc(0, ringY, 2.4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fill();

  ctx.restore();
}

/**
 * 1. Realistic Turkish Nazar Evil Eye Glass Amulet
 */
export function drawEvilEyeTalisman(
  ctx: CanvasRenderingContext2D,
  radius: number,
  isHovered: boolean,
  isDragging: boolean
): void {
  // Stacked glass beads on thread above the disc
  drawTalismanBeads(ctx, radius, [
    { color: '#1d4ed8', size: 4 },
    { color: '#ffffff', size: 3.5 },
    { color: '#0284c7', size: 5, hasEye: true },
    { color: '#ffffff', size: 3.5 },
    { color: '#1d4ed8', size: 4 },
  ]);

  // Main Cobalt Blue Glass Disc
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);

  const glassGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.35, 4, 0, 0, radius);
  glassGrad.addColorStop(0, '#3b82f6');
  glassGrad.addColorStop(0.3, '#1d4ed8');
  glassGrad.addColorStop(0.7, '#1e3a8a');
  glassGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = glassGrad;
  ctx.fill();

  // Glass rim bevel highlight
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = isHovered || isDragging ? '#93c5fd' : 'rgba(255, 255, 255, 0.45)';
  ctx.stroke();

  // White Teardrop / Eye Circle
  const whiteR = radius * 0.62;
  ctx.beginPath();
  ctx.arc(0, 0, whiteR, 0, Math.PI * 2);
  const whiteGrad = ctx.createRadialGradient(-whiteR * 0.2, -whiteR * 0.2, 2, 0, 0, whiteR);
  whiteGrad.addColorStop(0, '#ffffff');
  whiteGrad.addColorStop(0.85, '#f8fafc');
  whiteGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = whiteGrad;
  ctx.fill();

  // Sky Blue / Turquoise Iris
  const irisR = radius * 0.42;
  ctx.beginPath();
  ctx.arc(0, 0, irisR, 0, Math.PI * 2);
  const irisGrad = ctx.createRadialGradient(-irisR * 0.2, -irisR * 0.2, 2, 0, 0, irisR);
  irisGrad.addColorStop(0, '#7dd3fc');
  irisGrad.addColorStop(0.6, '#0284c7');
  irisGrad.addColorStop(1, '#0369a1');
  ctx.fillStyle = irisGrad;
  ctx.fill();

  // Deep Black Pupil
  const pupilR = radius * 0.22;
  ctx.beginPath();
  ctx.arc(0, 0, pupilR, 0, Math.PI * 2);
  ctx.fillStyle = '#020617';
  ctx.fill();

  // Specular Glossy Arc Reflection
  ctx.beginPath();
  ctx.ellipse(-radius * 0.3, -radius * 0.38, radius * 0.55, radius * 0.22, -Math.PI / 4, 0, Math.PI * 2);
  const glossGrad = ctx.createLinearGradient(
    -radius * 0.5,
    -radius * 0.6,
    0,
    0
  );
  glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  glossGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glossGrad;
  ctx.fill();

  // Pupil pinpoint sparkle
  ctx.beginPath();
  ctx.arc(-pupilR * 0.35, -pupilR * 0.35, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.restore();
}

/**
 * 2. Realistic Ornate Golden Hamsa Hand Talisman
 */
export function drawHamsaHandTalisman(
  ctx: CanvasRenderingContext2D,
  radius: number,
  isHovered: boolean,
  isDragging: boolean
): void {
  // Faceted lapis & gold beads above hand
  drawTalismanBeads(ctx, radius, [
    { color: '#eab308', size: 3.5 },
    { color: '#1e3a8a', size: 5 },
    { color: '#eab308', size: 3.5 },
  ]);

  ctx.save();
  const scale = (radius / 34) * 0.95;
  ctx.scale(scale, scale);

  // Outer Gold Hamsa Silhouette
  ctx.beginPath();
  // Central Finger
  ctx.moveTo(0, -38);
  ctx.quadraticCurveTo(7, -38, 7, -26);
  // Index Finger
  ctx.lineTo(16, -24);
  ctx.quadraticCurveTo(22, -24, 21, -12);
  // Thumb
  ctx.lineTo(28, -6);
  ctx.quadraticCurveTo(34, 4, 25, 12);
  // Right Palm Base
  ctx.lineTo(18, 28);
  ctx.quadraticCurveTo(12, 34, 0, 34);
  // Left Palm Base
  ctx.quadraticCurveTo(-12, 34, -18, 28);
  // Left Thumb
  ctx.lineTo(-25, 12);
  ctx.quadraticCurveTo(-34, 4, -28, -6);
  // Ring Finger
  ctx.lineTo(-21, -12);
  ctx.quadraticCurveTo(-22, -24, -16, -24);
  // Central Finger Left
  ctx.lineTo(-7, -26);
  ctx.quadraticCurveTo(-7, -38, 0, -38);
  ctx.closePath();

  // Gold Metal Gradient
  const goldGrad = ctx.createLinearGradient(-30, -38, 30, 34);
  goldGrad.addColorStop(0, '#fef08a');
  goldGrad.addColorStop(0.35, '#eab308');
  goldGrad.addColorStop(0.7, '#ca8a04');
  goldGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = goldGrad;
  ctx.fill();

  ctx.lineWidth = 1.6;
  ctx.strokeStyle = isHovered || isDragging ? '#fef9c3' : '#a16207';
  ctx.stroke();

  // Royal Blue Enamel Inlay
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, -2, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#1e3a8a';
  ctx.fill();

  // Central Protective Eye (Almond Shape)
  ctx.beginPath();
  ctx.moveTo(-12, -2);
  ctx.quadraticCurveTo(0, -11, 12, -2);
  ctx.quadraticCurveTo(0, 7, -12, -2);
  ctx.closePath();
  ctx.fillStyle = '#fef3c7';
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = '#eab308';
  ctx.stroke();

  // Amber / Topaz Iris
  ctx.beginPath();
  ctx.arc(0, -2, 5.5, 0, Math.PI * 2);
  const amberGrad = ctx.createRadialGradient(-1, -3, 1, 0, -2, 5.5);
  amberGrad.addColorStop(0, '#fde047');
  amberGrad.addColorStop(0.6, '#d97706');
  amberGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = amberGrad;
  ctx.fill();

  // Pupil
  ctx.beginPath();
  ctx.arc(0, -2, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#020617';
  ctx.fill();

  // Filigree Details in Fingers
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  // Center finger vertical lotus
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(0, -34);
  ctx.moveTo(-3, -28);
  ctx.quadraticCurveTo(0, -32, 3, -28);
  ctx.stroke();

  // Lower palm filigree dots
  ctx.fillStyle = '#1e3a8a';
  [-10, 0, 10].forEach((px) => {
    ctx.beginPath();
    ctx.arc(px, 18, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
  ctx.restore();
}

/**
 * 3. Realistic Nimbu Mirchi (Lemon & Green Chilies Nazar Battu)
 */
export function drawNimbuMirchiTalisman(
  ctx: CanvasRenderingContext2D,
  radius: number,
  isHovered: boolean,
  isDragging: boolean
): void {
  ctx.save();
  const scale = (radius / 34) * 0.92;
  ctx.scale(scale, scale);

  // 1. Stacked Green Chilies
  const chilies = [
    { y: -30, width: 56, curve: -3 },
    { y: -24, width: 62, curve: 2 },
    { y: -18, width: 66, curve: -2 },
    { y: -12, width: 68, curve: 3 },
    { y: -6, width: 64, curve: -2 },
    { y: 0, width: 58, curve: 1 },
    { y: 5, width: 50, curve: -2 },
  ];

  for (const c of chilies) {
    ctx.save();
    ctx.beginPath();
    const halfW = c.width / 2;
    ctx.moveTo(-halfW, c.y + c.curve);
    // Top contour
    ctx.quadraticCurveTo(0, c.y - 4, halfW, c.y - c.curve);
    // Tip
    ctx.quadraticCurveTo(halfW + 4, c.y, halfW, c.y + 2);
    // Bottom contour
    ctx.quadraticCurveTo(0, c.y + 4, -halfW, c.y + c.curve);
    ctx.closePath();

    const chiliGrad = ctx.createLinearGradient(0, c.y - 4, 0, c.y + 4);
    chiliGrad.addColorStop(0, '#86efac');
    chiliGrad.addColorStop(0.3, '#22c55e');
    chiliGrad.addColorStop(0.7, '#16a34a');
    chiliGrad.addColorStop(1, '#14532d');
    ctx.fillStyle = chiliGrad;
    ctx.fill();

    // Gloss highlight line along chili spine
    ctx.beginPath();
    ctx.moveTo(-halfW * 0.7, c.y - 1);
    ctx.quadraticCurveTo(0, c.y - 2, halfW * 0.7, c.y - 1);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // 2. Ripe Yellow Textured Lemon
  const lemonY = 22;
  const lemonR = 18;
  ctx.beginPath();
  // Realistic lemon oval with small pointy ends
  ctx.ellipse(0, lemonY, lemonR * 1.08, lemonR * 0.95, 0, 0, Math.PI * 2);

  const lemonGrad = ctx.createRadialGradient(-lemonR * 0.3, lemonY - lemonR * 0.3, 2, 0, lemonY, lemonR * 1.1);
  lemonGrad.addColorStop(0, '#fef08a');
  lemonGrad.addColorStop(0.4, '#facc15');
  lemonGrad.addColorStop(0.85, '#eab308');
  lemonGrad.addColorStop(1, '#ca8a04');
  ctx.fillStyle = lemonGrad;
  ctx.fill();

  ctx.lineWidth = 1.2;
  ctx.strokeStyle = isHovered || isDragging ? '#fef9c3' : '#a16207';
  ctx.stroke();

  // Subtle peel texture & specular highlight
  ctx.beginPath();
  ctx.ellipse(-lemonR * 0.25, lemonY - lemonR * 0.25, lemonR * 0.45, lemonR * 0.25, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fill();

  // 3. Black Charcoal / Stone Bead at Bottom
  const beadY = lemonY + lemonR + 9;
  ctx.beginPath();
  ctx.arc(0, beadY, 6, 0, Math.PI * 2);
  const beadGrad = ctx.createRadialGradient(-1.5, beadY - 1.5, 1, 0, beadY, 6);
  beadGrad.addColorStop(0, '#64748b');
  beadGrad.addColorStop(0.4, '#1e293b');
  beadGrad.addColorStop(1, '#020617');
  ctx.fillStyle = beadGrad;
  ctx.fill();

  // Jute string tassel tail at the very bottom
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, beadY + 6);
  ctx.lineTo(-2, beadY + 14);
  ctx.moveTo(0, beadY + 6);
  ctx.lineTo(2, beadY + 13);
  ctx.stroke();

  ctx.restore();
}

/**
 * 4. Celestial Prism (Original)
 */
export function drawCelestialPrism(
  ctx: CanvasRenderingContext2D,
  radius: number,
  isHovered: boolean,
  isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  const bezelGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  bezelGrad.addColorStop(0, isHovered || isDragging ? '#fef08a' : '#fef9c3');
  bezelGrad.addColorStop(0.5, '#eab308');
  bezelGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = bezelGrad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.stroke();

  const innerR = radius - 4.5;
  ctx.beginPath();
  ctx.arc(0, 0, innerR, 0, Math.PI * 2);
  const coreGrad = ctx.createRadialGradient(-innerR * 0.3, -innerR * 0.3, 2, 0, 0, innerR);
  coreGrad.addColorStop(0, '#4338ca');
  coreGrad.addColorStop(0.5, '#312e81');
  coreGrad.addColorStop(1, '#020617');
  ctx.fillStyle = coreGrad;
  ctx.fill();

  ctx.save();
  const starSize = 13;
  ctx.beginPath();
  ctx.moveTo(0, -starSize);
  ctx.quadraticCurveTo(0, 0, starSize, 0);
  ctx.quadraticCurveTo(0, 0, 0, starSize);
  ctx.quadraticCurveTo(0, 0, -starSize, 0);
  ctx.quadraticCurveTo(0, 0, 0, -starSize);
  ctx.closePath();
  ctx.fillStyle = '#fef08a';
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(-innerR * 0.25, -innerR * 0.35, innerR * 0.6, innerR * 0.3, -Math.PI / 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.fill();
  ctx.restore();
}

/**
 * 5. Lucky Cat (Maneki-Neko)
 */
export function drawLuckyCat(
  ctx: CanvasRenderingContext2D,
  radius: number,
  isHovered: boolean,
  _isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  ctx.beginPath();
  ctx.arc(0, 2, radius, 0, Math.PI * 2);
  const catGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 3, 0, 0, radius);
  catGrad.addColorStop(0, '#ffffff');
  catGrad.addColorStop(0.85, '#f8fafc');
  catGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = catGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#94a3b8';
  ctx.stroke();

  const drawEar = (x: number, angle: number) => {
    ctx.save();
    ctx.translate(x, -radius + 4);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-9, 4);
    ctx.lineTo(0, -14);
    ctx.lineTo(9, 4);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-5, 3);
    ctx.lineTo(0, -9);
    ctx.lineTo(5, 3);
    ctx.closePath();
    ctx.fillStyle = '#f472b6';
    ctx.fill();
    ctx.restore();
  };
  drawEar(-radius * 0.6, -0.3);
  drawEar(radius * 0.6, 0.3);

  ctx.beginPath();
  ctx.arc(0, radius - 4, radius * 0.55, 0.2, Math.PI - 0.2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ef4444';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, radius - 2, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#eab308';
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#1e293b';
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(-11, -2, 6, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(11, -2, 6, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();

  ctx.fillStyle = isHovered ? 'rgba(251, 113, 133, 0.6)' : 'rgba(251, 113, 133, 0.35)';
  ctx.beginPath();
  ctx.arc(-16, 5, 5, 0, Math.PI * 2);
  ctx.arc(16, 5, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(0, 3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.lineTo(0, 8);
  ctx.moveTo(-4, 10);
  ctx.quadraticCurveTo(0, 8, 4, 10);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.6;
  ctx.stroke();
}

/**
 * 6. Star (Celestial Starlight)
 */
export function drawStarCharm(
  ctx: CanvasRenderingContext2D,
  radius: number,
  _isHovered: boolean,
  _isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  const points = 5;
  const outerR = radius;
  const innerR = radius * 0.5;

  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  const starGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.3, 4, 0, 0, radius);
  starGrad.addColorStop(0, '#ffffff');
  starGrad.addColorStop(0.3, '#fef08a');
  starGrad.addColorStop(0.7, '#f59e0b');
  starGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = starGrad;
  ctx.fill();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

/**
 * 7. Moon (Crescent Moon)
 */
export function drawMoonCharm(
  ctx: CanvasRenderingContext2D,
  radius: number,
  _isHovered: boolean,
  _isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius, -Math.PI * 0.65, Math.PI * 0.65, false);
  ctx.arc(radius * 0.45, 0, radius * 0.8, Math.PI * 0.6, -Math.PI * 0.6, true);
  ctx.closePath();

  const moonGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  moonGrad.addColorStop(0, '#fef9c3');
  moonGrad.addColorStop(0.4, '#fde047');
  moonGrad.addColorStop(0.8, '#eab308');
  moonGrad.addColorStop(1, '#ca8a04');
  ctx.fillStyle = moonGrad;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  ctx.fillStyle = 'rgba(161, 98, 7, 0.25)';
  ctx.beginPath();
  ctx.arc(-radius * 0.4, -radius * 0.2, 3.5, 0, Math.PI * 2);
  ctx.arc(-radius * 0.5, radius * 0.25, 4.5, 0, Math.PI * 2);
  ctx.arc(-radius * 0.2, radius * 0.5, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * 8. Heart (Rose Quartz Gem Heart)
 */
export function drawHeartCharm(
  ctx: CanvasRenderingContext2D,
  radius: number,
  _isHovered: boolean,
  _isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  const topCurveHeight = radius * 0.6;
  ctx.save();
  ctx.translate(0, -radius * 0.2);

  ctx.beginPath();
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(-radius * 0.8, -topCurveHeight, -radius * 1.1, topCurveHeight * 0.5, 0, radius * 1.2);
  ctx.bezierCurveTo(radius * 1.1, topCurveHeight * 0.5, radius * 0.8, -topCurveHeight, 0, topCurveHeight);
  ctx.closePath();

  const heartGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, 4, 0, 0, radius * 1.2);
  heartGrad.addColorStop(0, '#fda4af');
  heartGrad.addColorStop(0.4, '#f43f5e');
  heartGrad.addColorStop(0.85, '#e11d48');
  heartGrad.addColorStop(1, '#881337');
  ctx.fillStyle = heartGrad;
  ctx.fill();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(-radius * 0.35, 0, radius * 0.4, radius * 0.2, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fill();

  ctx.restore();
}

/**
 * 9. Planet (Saturn Ring Planet)
 */
export function drawPlanetCharm(
  ctx: CanvasRenderingContext2D,
  radius: number,
  _isHovered: boolean,
  _isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  const bodyR = radius * 0.75;

  ctx.save();
  ctx.rotate(-Math.PI / 8);
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.35, radius * 0.38, 0, Math.PI, Math.PI * 2);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fcd34d';
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(0, 0, bodyR, 0, Math.PI * 2);
  const planetGrad = ctx.createLinearGradient(-bodyR, -bodyR, bodyR, bodyR);
  planetGrad.addColorStop(0, '#818cf8');
  planetGrad.addColorStop(0.4, '#6366f1');
  planetGrad.addColorStop(0.7, '#4338ca');
  planetGrad.addColorStop(1, '#312e81');
  ctx.fillStyle = planetGrad;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.stroke();

  ctx.save();
  ctx.rotate(-Math.PI / 8);
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.35, radius * 0.38, 0, 0, Math.PI);
  ctx.lineWidth = 6;
  const ringGrad = ctx.createLinearGradient(-radius, 0, radius, 0);
  ringGrad.addColorStop(0, '#fef08a');
  ringGrad.addColorStop(0.5, '#f59e0b');
  ringGrad.addColorStop(1, '#d97706');
  ctx.strokeStyle = ringGrad;
  ctx.stroke();
  ctx.restore();
}

/**
 * 10. Crystal (Amethyst Cluster)
 */
export function drawCrystalCharm(
  ctx: CanvasRenderingContext2D,
  radius: number,
  _isHovered: boolean,
  _isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  const h = radius * 1.1;
  const w = radius * 0.85;

  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(w, -h * 0.3);
  ctx.lineTo(w * 0.7, h);
  ctx.lineTo(-w * 0.7, h);
  ctx.lineTo(-w, -h * 0.3);
  ctx.closePath();

  const crystalGrad = ctx.createLinearGradient(-w, -h, w, h);
  crystalGrad.addColorStop(0, '#c084fc');
  crystalGrad.addColorStop(0.4, '#a855f7');
  crystalGrad.addColorStop(0.8, '#7e22ce');
  crystalGrad.addColorStop(1, '#581c87');
  ctx.fillStyle = crystalGrad;
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(0, h);
  ctx.moveTo(0, -h * 0.3);
  ctx.lineTo(w, -h * 0.3);
  ctx.moveTo(0, -h * 0.3);
  ctx.lineTo(-w, -h * 0.3);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * 11. Dice (Golden D6)
 */
export function drawDiceCharm(
  ctx: CanvasRenderingContext2D,
  radius: number,
  _isHovered: boolean,
  _isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  const size = radius * 1.5;
  const half = size / 2;

  ctx.beginPath();
  ctx.roundRect(-half, -half, size, size, 8);
  const diceGrad = ctx.createLinearGradient(-half, -half, half, half);
  diceGrad.addColorStop(0, '#fef08a');
  diceGrad.addColorStop(0.5, '#eab308');
  diceGrad.addColorStop(1, '#a16207');
  ctx.fillStyle = diceGrad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#fef9c3';
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  const dotR = 3.2;
  const offset = half * 0.55;

  const dots = [
    { x: 0, y: 0 },
    { x: -offset, y: -offset },
    { x: offset, y: -offset },
    { x: -offset, y: offset },
    { x: offset, y: offset },
  ];

  for (const d of dots) {
    ctx.beginPath();
    ctx.arc(d.x, d.y, dotR, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 12. Smiley (Retro Sunshine Smile)
 */
export function drawSmileyCharm(
  ctx: CanvasRenderingContext2D,
  radius: number,
  _isHovered: boolean,
  _isDragging: boolean
): void {
  drawEyelet(ctx, radius);

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  const smileGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 4, 0, 0, radius);
  smileGrad.addColorStop(0, '#fef08a');
  smileGrad.addColorStop(0.7, '#facc15');
  smileGrad.addColorStop(1, '#eab308');
  ctx.fillStyle = smileGrad;
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#ca8a04';
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(-10, -5, 3.5, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(10, -5, 3.5, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-11, -7, 1.8, 0, Math.PI * 2);
  ctx.arc(9, -7, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 1, 14, 0.2, Math.PI - 0.2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1e293b';
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  ctx.beginPath();
  ctx.arc(-16, 6, 4.5, 0, Math.PI * 2);
  ctx.arc(16, 6, 4.5, 0, Math.PI * 2);
  ctx.fill();
}
