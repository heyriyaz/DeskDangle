import Matter from 'matter-js';
import { CharmPhysics } from './CharmPhysics';
import { RopeSettings } from '../charms/charmTypes';

export class RopePhysics {
  public anchorBody: Matter.Body;
  public segments: Matter.Body[] = [];
  public constraints: Matter.Constraint[] = [];
  public charmConstraint: Matter.Constraint | null = null;
  public settings: RopeSettings;
  public anchorX: number;
  public anchorY: number;

  constructor(
    world: Matter.World,
    charmPhysics: CharmPhysics,
    anchorX = 420,
    anchorY = 0,
    ropeSettings?: Partial<RopeSettings>
  ) {
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.settings = {
      style: ropeSettings?.style ?? 'classic',
      lengthSegments: ropeSettings?.lengthSegments ?? 7,
      segmentLength: ropeSettings?.segmentLength ?? 18,
      thickness: ropeSettings?.thickness ?? 2.4,
      color: ropeSettings?.color ?? '#785338',
      opacity: ropeSettings?.opacity ?? 0.98,
    };

    // 1. Create Static Anchor at Top Edge (y = 0)
    this.anchorBody = Matter.Bodies.circle(this.anchorX, this.anchorY, 3, {
      isStatic: true,
      label: 'rope-anchor',
      collisionFilter: { group: -1 },
    });
    Matter.World.add(world, this.anchorBody);

    // 2. Build segments
    this.rebuildSegments(world, charmPhysics);
  }

  public rebuildSegments(world: Matter.World, charmPhysics: CharmPhysics): void {
    for (const seg of this.segments) Matter.World.remove(world, seg);
    for (const c of this.constraints) Matter.World.remove(world, c);
    if (this.charmConstraint) Matter.World.remove(world, this.charmConstraint);

    this.segments = [];
    this.constraints = [];
    this.charmConstraint = null;

    let prevBody = this.anchorBody;
    const startY = this.anchorY;
    const count = Math.max(3, Math.min(14, this.settings.lengthSegments));
    const segLen = this.settings.segmentLength;

    for (let i = 0; i < count; i++) {
      const segY = startY + (i + 1) * segLen;
      // The segments near the charm (last 2) get slightly higher mass and damping
      // to prevent violent sideways kinking when heavy charms swing
      const isNearEnd = i >= count - 2;
      const segment = Matter.Bodies.circle(this.anchorX, segY, 2.0, {
        label: `rope-segment-${i}`,
        mass: isNearEnd ? 0.35 : 0.12,
        frictionAir: isNearEnd ? 0.025 : 0.008,
        restitution: 0.1,
        collisionFilter: { group: -1 },
      });

      this.segments.push(segment);
      Matter.World.add(world, segment);

      const constraint = Matter.Constraint.create({
        bodyA: prevBody,
        bodyB: segment,
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: 0 },
        length: segLen,
        stiffness: 0.99,
        damping: 0.04,
      });

      this.constraints.push(constraint);
      Matter.World.add(world, constraint);

      prevBody = segment;
    }

    // Connect last segment to charm top attachment point
    const lastSegment = this.segments[this.segments.length - 1];
    const topOffset = charmPhysics.getTopOffset();

    charmPhysics.setPosition({
      x: this.anchorX,
      y: lastSegment.position.y + topOffset,
    });

    this.charmConstraint = Matter.Constraint.create({
      bodyA: lastSegment,
      bodyB: charmPhysics.body,
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: -topOffset },
      length: 0, // Direct connection with zero slack
      stiffness: 0.88,
      damping: 0.12,
    });

    Matter.World.add(world, this.charmConstraint);
  }

  public updateSettings(world: Matter.World, charmPhysics: CharmPhysics, newSettings: Partial<RopeSettings>): void {
    const needRebuild =
      (newSettings.lengthSegments !== undefined && newSettings.lengthSegments !== this.settings.lengthSegments) ||
      (newSettings.segmentLength !== undefined && newSettings.segmentLength !== this.settings.segmentLength);

    this.settings = { ...this.settings, ...newSettings };

    if (needRebuild) {
      this.rebuildSegments(world, charmPhysics);
    }
  }

  public getNodePoints(charmPhysics: CharmPhysics): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [
      { x: this.anchorBody.position.x, y: this.anchorBody.position.y },
    ];

    for (let i = 0; i < this.segments.length; i++) {
      points.push({ x: this.segments[i].position.x, y: this.segments[i].position.y });
    }

    const charmPos = charmPhysics.getPosition();
    const charmAngle = charmPhysics.getAngle();
    const topOffset = charmPhysics.getTopOffset();

    const eyeletX = charmPos.x + topOffset * Math.sin(charmAngle);
    const eyeletY = charmPos.y - topOffset * Math.cos(charmAngle);

    // Terminal point precisely locked to charm attachment
    if (points.length > 1) {
      points[points.length - 1] = { x: eyeletX, y: eyeletY };
    } else {
      points.push({ x: eyeletX, y: eyeletY });
    }

    return points;
  }

  public setAnchorPosition(x: number, y: number): void {
    this.anchorX = x;
    this.anchorY = y;
    Matter.Body.setPosition(this.anchorBody, { x, y });
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    nodes: Array<{ x: number; y: number }>,
    charmAngle = 0
  ): void {
    if (nodes.length < 2) return;

    ctx.save();
    ctx.globalAlpha = this.settings.opacity;

    // Draw top anchor mount at screen bezel
    this.drawTopAnchor(ctx, nodes[0].x);

    const endNode = nodes[nodes.length - 1];

    switch (this.settings.style) {
      case 'chain':
        this.drawChainStyle(ctx, nodes, charmAngle);
        this.drawChainEndConnector(ctx, endNode.x, endNode.y, charmAngle);
        break;
      case 'neon':
        this.drawNeonStyle(ctx, nodes, charmAngle);
        this.drawEndConnector(ctx, endNode.x, endNode.y, charmAngle);
        break;
      case 'thread':
        this.drawThreadStyle(ctx, nodes, charmAngle);
        this.drawEndConnector(ctx, endNode.x, endNode.y, charmAngle);
        break;
      case 'rope':
        this.drawBraidedRopeStyle(ctx, nodes, charmAngle);
        this.drawEndConnector(ctx, endNode.x, endNode.y, charmAngle);
        break;
      case 'classic':
      default:
        this.drawClassicStyle(ctx, nodes, charmAngle);
        this.drawEndConnector(ctx, endNode.x, endNode.y, charmAngle);
        break;
    }

    ctx.restore();
  }

  /**
   * Classic Satin Cord / Braided Paracord with 3D cylindrical lighting & herringbone micro-weave
   */
  private drawClassicStyle(
    ctx: CanvasRenderingContext2D,
    nodes: Array<{ x: number; y: number }>,
    charmAngle: number
  ): void {
    const thick = Math.max(2.4, this.settings.thickness || 3.0);
    const baseColor = this.settings.color || '#785338';

    // 1. Soft progressive ambient occlusion drop shadow
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.lineWidth = thick + 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.42)';
    ctx.shadowBlur = 9;
    ctx.shadowOffsetY = 4.5;
    ctx.shadowOffsetX = 1;
    ctx.stroke();
    ctx.restore();

    // 2. Dark edge silhouette (adds crisp cylindrical edge contrast)
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = adjustColorBrightness(baseColor, -45);
    ctx.lineWidth = thick + 1.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // 3. Main core cord body
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = thick;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // 4. Photorealistic diagonal herringbone woven paracord texture
    const weaveSamples = sampleSplinePoints(nodes, 2.6, charmAngle);
    if (weaveSamples.length > 2) {
      ctx.save();
      const halfW = thick * 0.46;
      for (let i = 0; i < weaveSamples.length - 1; i++) {
        const pt = weaveSamples[i];
        const next = weaveSamples[i + 1];
        const dx = next.x - pt.x;
        const dy = next.y - pt.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const isLeft = i % 2 === 0;

        // Diagonal weave stitch across the cord
        const sx1 = pt.x + (nx * (isLeft ? halfW : -halfW * 0.35));
        const sy1 = pt.y + (ny * (isLeft ? halfW : -halfW * 0.35));
        const sx2 = pt.x - (nx * (isLeft ? halfW * 0.35 : -halfW)) + (dx / len * 1.2);
        const sy2 = pt.y - (ny * (isLeft ? halfW * 0.35 : -halfW)) + (dy / len * 1.2);

        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.strokeStyle = isLeft ? 'rgba(255, 255, 255, 0.40)' : 'rgba(0, 0, 0, 0.22)';
        ctx.lineWidth = Math.max(0.7, thick * 0.28);
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Rounded 3D specular highlight along crest
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.lineWidth = Math.max(0.8, thick * 0.28);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Photorealistic 3-Ply Twisted Braided Rope with helical strand geometry
   */
  private drawBraidedRopeStyle(
    ctx: CanvasRenderingContext2D,
    nodes: Array<{ x: number; y: number }>,
    charmAngle: number
  ): void {
    const thick = Math.max(3.2, (this.settings.thickness || 2.2) * 1.5);
    const baseColor = this.settings.color || '#92400e';

    // 1. Ambient drop shadow
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.lineWidth = thick + 3.6;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 9;
    ctx.shadowOffsetY = 4.5;
    ctx.stroke();
    ctx.restore();

    // 2. Base cord body silhouette
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = adjustColorBrightness(baseColor, -40);
    ctx.lineWidth = thick + 1.2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // 3. Base core fill
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = thick;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // 4. Photorealistic 3-ply helical overlapping twisted strand lobes
    const samples = sampleSplinePoints(nodes, 3.2, charmAngle);
    if (samples.length > 1) {
      ctx.save();
      for (let i = 0; i < samples.length - 1; i++) {
        const pt = samples[i];
        const next = samples[i + 1];
        const dx = next.x - pt.x;
        const dy = next.y - pt.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        // Diagonal twisted strand angle
        const ribTilt = 0.58;
        const halfW = thick * 0.52;

        const x1 = pt.x + (nx * halfW) - (dx / len * ribTilt * halfW);
        const y1 = pt.y + (ny * halfW) - (dy / len * ribTilt * halfW);
        const x2 = pt.x - (nx * halfW) + (dx / len * ribTilt * halfW);
        const y2 = pt.y - (ny * halfW) + (dy / len * ribTilt * halfW);

        // Dark spiraling crevice groove between the twisted plies
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(20, 10, 0, 0.65)';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // 3D strand crest highlight
        const hx1 = x1 + (dx / len * 1.5);
        const hy1 = y1 + (dy / len * 1.5);
        const hx2 = x2 + (dx / len * 1.5);
        const hy2 = y2 + (dy / len * 1.5);
        ctx.beginPath();
        ctx.moveTo(hx1, hy1);
        ctx.lineTo(hx2, hy2);
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.48)';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Organic micro-fiber whiskers along edge
        if (i % 4 === 0) {
          const whiskerLen = 1.6 + ((i * 3) % 2);
          ctx.beginPath();
          ctx.moveTo(pt.x + nx * halfW, pt.y + ny * halfW);
          ctx.lineTo(pt.x + nx * (halfW + whiskerLen), pt.y + ny * (halfW + whiskerLen));
          ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  /**
   * Photorealistic 3D Interlocking Jewelry Chain with dynamic metallic shading
   */
  private drawChainStyle(
    ctx: CanvasRenderingContext2D,
    nodes: Array<{ x: number; y: number }>,
    charmAngle = 0
  ): void {
    const samples = sampleSplinePoints(nodes, 8.2, charmAngle);
    if (samples.length < 2) return;

    const baseColor = this.settings.color || '#eab308';
    const isGoldish = !this.settings.color || this.settings.color === '#eab308' || this.settings.color === '#f59e0b';

    for (let i = 0; i < samples.length - 1; i++) {
      const p1 = samples[i];
      const p2 = samples[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = Math.atan2(dy, dx);
      const isFaceOn = i % 2 === 0;

      ctx.save();
      ctx.translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      ctx.rotate(angle);

      // Link drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      if (isFaceOn) {
        // Face-on oval link with beveled metallic torus gradient
        ctx.beginPath();
        ctx.ellipse(0, 0, 5.2, 3.2, 0, 0, Math.PI * 2);
        const grad = ctx.createLinearGradient(-5, -3, 5, 3);
        if (isGoldish) {
          grad.addColorStop(0, '#fef9c3');
          grad.addColorStop(0.3, '#facc15');
          grad.addColorStop(0.7, '#ca8a04');
          grad.addColorStop(1, '#854d0e');
        } else {
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, baseColor);
          grad.addColorStop(0.7, adjustColorBrightness(baseColor, -35));
          grad.addColorStop(1, adjustColorBrightness(baseColor, -60));
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Hollow inner link opening with inner shadow
        ctx.beginPath();
        ctx.ellipse(0, 0, 2.7, 1.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        ctx.lineWidth = 0.8;
        ctx.strokeStyle = isGoldish ? '#fef08a' : 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
      } else {
        // Side-profile interlocking link passing through previous link
        ctx.beginPath();
        ctx.roundRect(-4.5, -1.6, 9.0, 3.2, 1.5);
        const grad = ctx.createLinearGradient(0, -1.6, 0, 1.6);
        if (isGoldish) {
          grad.addColorStop(0, '#fef08a');
          grad.addColorStop(0.45, '#eab308');
          grad.addColorStop(1, '#713f12');
        } else {
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, baseColor);
          grad.addColorStop(1, adjustColorBrightness(baseColor, -50));
        }
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = isGoldish ? '#fef9c3' : 'rgba(255, 255, 255, 0.6)';
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /**
   * Delicate Luxury Silk Thread
   */
  private drawThreadStyle(
    ctx: CanvasRenderingContext2D,
    nodes: Array<{ x: number; y: number }>,
    charmAngle: number
  ): void {
    const threadColor = this.settings.color || '#a8a29e';

    ctx.save();
    // Ambient soft line
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Main thread core
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = threadColor;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Pearlescent fine sheen
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Cyberpunk Luminescent Glowing Cable
   */
  private drawNeonStyle(
    ctx: CanvasRenderingContext2D,
    nodes: Array<{ x: number; y: number }>,
    charmAngle: number
  ): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const neonColor = this.settings.color || '#00f0ff';
    const thick = Math.max(2.0, this.settings.thickness || 2.4);

    // Outer bloom
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = thick + 4.5;
    ctx.shadowColor = neonColor;
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.restore();

    // Core halo
    ctx.save();
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = thick;
    ctx.shadowColor = neonColor;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();

    // Intense center beam
    ctx.beginPath();
    traceCentripetalSpline(ctx, nodes, charmAngle);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1.2, thick * 0.35);
    ctx.stroke();
  }

  /**
   * Sleek minimalist ceiling bezel anchor collar
   */
  private drawTopAnchor(ctx: CanvasRenderingContext2D, x: number): void {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x - 7, -2, 14, 6, [0, 0, 3, 3]);
    const grad = ctx.createLinearGradient(x - 7, 0, x + 7, 0);
    grad.addColorStop(0, '#64748b');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1, '#475569');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Tiny center grommet eye
    ctx.beginPath();
    ctx.arc(x, 2, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.restore();
  }

  /**
   * Jewelry-grade metallic crimp ferrule connecting cleanly to the charm top edge
   */
  private drawEndConnector(
    ctx: CanvasRenderingContext2D,
    endX: number,
    endY: number,
    charmAngle: number
  ): void {
    ctx.save();
    ctx.translate(endX, endY);
    ctx.rotate(charmAngle); // Always flush with charm's vertical orientation!

    const thick = Math.max(2.4, this.settings.thickness || 2.4);
    const ferruleW = thick + 2.4;
    const ferruleH = 4.2;

    // Small polished metallic clamp wrapping the cord at the attachment edge
    ctx.beginPath();
    ctx.roundRect(-ferruleW / 2, -ferruleH + 1.5, ferruleW, ferruleH, 1.2);
    const grad = ctx.createLinearGradient(-ferruleW / 2, 0, ferruleW / 2, 0);
    grad.addColorStop(0, '#cbd5e1');
    grad.addColorStop(0.35, '#f8fafc');
    grad.addColorStop(0.7, '#94a3b8');
    grad.addColorStop(1, '#64748b');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    ctx.fill();

    ctx.lineWidth = 0.6;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    // Center crimp groove
    ctx.beginPath();
    ctx.moveTo(-ferruleW / 2 + 0.8, -ferruleH / 2 + 0.7);
    ctx.lineTo(ferruleW / 2 - 0.8, -ferruleH / 2 + 0.7);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Terminal jewelry ring bridging chain links directly into the charm top edge
   */
  private drawChainEndConnector(
    ctx: CanvasRenderingContext2D,
    endX: number,
    endY: number,
    charmAngle = 0
  ): void {
    ctx.save();
    ctx.translate(endX, endY);
    ctx.rotate(charmAngle); // Flush with charm angle

    const baseColor = this.settings.color || '#eab308';
    const isGoldish = !this.settings.color || this.settings.color === '#eab308' || this.settings.color === '#f59e0b';

    // Oval jump ring anchoring the chain seamlessly into the top of the charm
    ctx.beginPath();
    ctx.ellipse(0, -1.2, 4.2, 3.2, 0, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(-4, -3, 4, 3);
    if (isGoldish) {
      grad.addColorStop(0, '#fef9c3');
      grad.addColorStop(0.35, '#eab308');
      grad.addColorStop(0.7, '#ca8a04');
      grad.addColorStop(1, '#854d0e');
    } else {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, baseColor);
      grad.addColorStop(0.7, adjustColorBrightness(baseColor, -35));
      grad.addColorStop(1, adjustColorBrightness(baseColor, -60));
    }
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, -1.2, 2.2, 1.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.lineWidth = 0.8;
    ctx.strokeStyle = isGoldish ? '#fef9c3' : 'rgba(255, 255, 255, 0.7)';
    ctx.stroke();

    ctx.restore();
  }

  public destroy(world: Matter.World): void {
    Matter.World.remove(world, this.anchorBody);
    for (const seg of this.segments) Matter.World.remove(world, seg);
    for (const c of this.constraints) Matter.World.remove(world, c);
    if (this.charmConstraint) Matter.World.remove(world, this.charmConstraint);
    this.segments = [];
    this.constraints = [];
    this.charmConstraint = null;
  }
}

/**
 * Centripetal Catmull-Rom Spline (alpha = 0.5) converted to cubic Béziers.
 * Completely eliminates cusps, loops, and kinks across uneven node spacings.
 * At the charm connection, smoothly aligns the arrival tangent with the charm orientation.
 */
function traceCentripetalSpline(
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>,
  charmAngle?: number
): void {
  if (points.length < 2) return;
  if (points.length === 2) {
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    return;
  }

  ctx.moveTo(points[0].x, points[0].y);

  const n = points.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : { x: points[0].x, y: points[0].y - 20 };
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < n - 2 ? points[i + 2] : null;

    const d01 = Math.max(0.1, Math.hypot(p1.x - p0.x, p1.y - p0.y));
    const d12 = Math.max(0.1, Math.hypot(p2.x - p1.x, p2.y - p1.y));

    // Tangent at p1
    let t1x: number;
    let t1y: number;
    if (i === 0) {
      // Natural downward emergence from the ceiling bezel mount
      t1x = (p2.x - p1.x) * 0.15;
      t1y = Math.max(10, (p2.y - p1.y) * 0.75);
    } else {
      t1x = ((p2.x - p0.x) / (d01 + d12)) * d12;
      t1y = ((p2.y - p0.y) / (d01 + d12)) * d12;
    }

    // Tangent at p2 (smooth natural descent into charm attachment point)
    let t2x: number;
    let t2y: number;
    if (i === n - 2) {
      if (charmAngle !== undefined) {
        const mag = Math.min(d12 * 0.85, 20);
        t2x = Math.sin(charmAngle) * mag;
        t2y = Math.cos(charmAngle) * mag;
      } else {
        t2x = p2.x - p1.x;
        t2y = p2.y - p1.y;
      }
    } else {
      const d23 = Math.max(0.1, Math.hypot(p3!.x - p2.x, p3!.y - p2.y));
      t2x = ((p3!.x - p1.x) / (d12 + d23)) * d12;
      t2y = ((p3!.y - p1.y) / (d12 + d23)) * d12;
    }

    const cp1x = p1.x + t1x / 3;
    const cp1y = p1.y + t1y / 3;
    const cp2x = p2.x - t2x / 3;
    const cp2y = p2.y - t2y / 3;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

/**
 * Samples points along the Centripetal Catmull-Rom spline at fixed step lengths.
 */
function sampleSplinePoints(
  points: Array<{ x: number; y: number }>,
  stepSize = 4.0,
  charmAngle?: number
): Array<{ x: number; y: number }> {
  if (points.length < 2) return [];

  const sampled: Array<{ x: number; y: number }> = [{ ...points[0] }];
  const n = points.length;

  for (let i = 0; i < n - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : { x: points[0].x, y: points[0].y - 20 };
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < n - 2 ? points[i + 2] : null;

    const d01 = Math.max(0.1, Math.hypot(p1.x - p0.x, p1.y - p0.y));
    const d12 = Math.max(0.1, Math.hypot(p2.x - p1.x, p2.y - p1.y));

    let t1x: number;
    let t1y: number;
    if (i === 0) {
      t1x = (p2.x - p1.x) * 0.15;
      t1y = Math.max(10, (p2.y - p1.y) * 0.75);
    } else {
      t1x = ((p2.x - p0.x) / (d01 + d12)) * d12;
      t1y = ((p2.y - p0.y) / (d01 + d12)) * d12;
    }

    let t2x: number;
    let t2y: number;
    if (i === n - 2) {
      if (charmAngle !== undefined) {
        const mag = Math.min(d12 * 0.85, 20);
        t2x = Math.sin(charmAngle) * mag;
        t2y = Math.cos(charmAngle) * mag;
      } else {
        t2x = p2.x - p1.x;
        t2y = p2.y - p1.y;
      }
    } else {
      const d23 = Math.max(0.1, Math.hypot(p3!.x - p2.x, p3!.y - p2.y));
      t2x = ((p3!.x - p1.x) / (d12 + d23)) * d12;
      t2y = ((p3!.y - p1.y) / (d12 + d23)) * d12;
    }

    const cp1x = p1.x + t1x / 3;
    const cp1y = p1.y + t1y / 3;
    const cp2x = p2.x - t2x / 3;
    const cp2y = p2.y - t2y / 3;

    // Approximate arc length
    const chordLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const subSteps = Math.max(2, Math.round(chordLen / stepSize));

    for (let s = 1; s <= subSteps; s++) {
      const t = s / subSteps;
      const mt = 1 - t;
      const bx = mt * mt * mt * p1.x + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * p2.x;
      const by = mt * mt * mt * p1.y + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * p2.y;
      sampled.push({ x: bx, y: by });
    }
  }

  return sampled;
}

/**
 * Adjusts HEX color brightness by percent (-100 to 100)
 */
function adjustColorBrightness(hexColor: string, percent: number): string {
  let hex = hexColor.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return hexColor;

  let r = (num >> 16) + Math.round((percent / 100) * 255);
  let g = ((num >> 8) & 0x00ff) + Math.round((percent / 100) * 255);
  let b = (num & 0x0000ff) + Math.round((percent / 100) * 255);

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
