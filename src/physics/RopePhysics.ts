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
      thickness: ropeSettings?.thickness ?? 1.6,
      color: ropeSettings?.color ?? '#785338',
      opacity: ropeSettings?.opacity ?? 0.95,
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
    const count = Math.max(3, Math.min(12, this.settings.lengthSegments));
    const segLen = this.settings.segmentLength;

    for (let i = 0; i < count; i++) {
      const segY = startY + (i + 1) * segLen;
      const segment = Matter.Bodies.circle(this.anchorX, segY, 2.5, {
        label: `rope-segment-${i}`,
        mass: 0.08,
        frictionAir: 0.005,
        restitution: 0.2,
        collisionFilter: { group: -1 },
      });

      this.segments.push(segment);
      Matter.World.add(world, segment);

      const constraint = Matter.Constraint.create({
        bodyA: prevBody,
        bodyB: segment,
        pointA: prevBody === this.anchorBody ? { x: 0, y: 0 } : { x: 0, y: 2.5 },
        pointB: { x: 0, y: -2.5 },
        length: segLen,
        stiffness: 0.95,
        damping: 0.04,
      });

      this.constraints.push(constraint);
      Matter.World.add(world, constraint);

      prevBody = segment;
    }

    // Connect last segment to charm top attachment point
    const lastSegment = this.segments[this.segments.length - 1];
    const topOffset = (charmPhysics.charm.anchorOffset || charmPhysics.radius) * 0.9;

    charmPhysics.setPosition({
      x: this.anchorX,
      y: lastSegment.position.y + segLen + topOffset,
    });

    this.charmConstraint = Matter.Constraint.create({
      bodyA: lastSegment,
      bodyB: charmPhysics.body,
      pointA: { x: 0, y: 2.5 },
      pointB: { x: 0, y: -topOffset },
      length: segLen * 0.5,
      stiffness: 0.95,
      damping: 0.04,
    });

    Matter.World.add(world, this.charmConstraint);
  }

  public updateSettings(world: Matter.World, charmPhysics: CharmPhysics, newSettings: Partial<RopeSettings>): void {
    const needRebuild =
      newSettings.lengthSegments !== undefined && newSettings.lengthSegments !== this.settings.lengthSegments ||
      newSettings.segmentLength !== undefined && newSettings.segmentLength !== this.settings.segmentLength;

    this.settings = { ...this.settings, ...newSettings };

    if (needRebuild) {
      this.rebuildSegments(world, charmPhysics);
    }
  }

  public getNodePoints(charmPhysics: CharmPhysics): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [
      { x: this.anchorBody.position.x, y: this.anchorBody.position.y },
    ];

    for (const segment of this.segments) {
      points.push({ x: segment.position.x, y: segment.position.y });
    }

    const charmPos = charmPhysics.getPosition();
    const charmAngle = charmPhysics.getAngle();
    const topOffset = (charmPhysics.charm.anchorOffset || charmPhysics.radius) * 0.9;

    const eyeletX = charmPos.x + topOffset * Math.sin(charmAngle);
    const eyeletY = charmPos.y - topOffset * Math.cos(charmAngle);

    points.push({ x: eyeletX, y: eyeletY });

    return points;
  }

  public setAnchorPosition(x: number, y: number): void {
    this.anchorX = x;
    this.anchorY = y;
    Matter.Body.setPosition(this.anchorBody, { x, y });
  }

  public draw(ctx: CanvasRenderingContext2D, nodes: Array<{ x: number; y: number }>): void {
    if (nodes.length < 2) return;

    ctx.save();
    ctx.globalAlpha = this.settings.opacity;

    switch (this.settings.style) {
      case 'chain':
        this.drawChainStyle(ctx, nodes);
        break;
      case 'neon':
        this.drawNeonStyle(ctx, nodes);
        break;
      case 'thread':
        this.drawThreadStyle(ctx, nodes);
        break;
      case 'rope':
        this.drawBraidedRopeStyle(ctx, nodes);
        break;
      case 'classic':
      default:
        this.drawClassicStyle(ctx, nodes);
        break;
    }

    ctx.restore();
  }

  private drawClassicStyle(ctx: CanvasRenderingContext2D, nodes: Array<{ x: number; y: number }>): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const thick = Math.max(2.2, this.settings.thickness || 3.2);

    // 1. Soft natural depth shadow
    ctx.save();
    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.lineWidth = thick + 2.2;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.stroke();
    ctx.restore();

    // 2. Base cord line
    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.strokeStyle = this.settings.color || '#785338';
    ctx.lineWidth = thick;
    ctx.stroke();

    // 3. Subtle internal fiber strand highlight
    ctx.save();
    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = Math.max(0.8, thick * 0.35);
    ctx.stroke();
    ctx.restore();
  }

  private drawBraidedRopeStyle(ctx: CanvasRenderingContext2D, nodes: Array<{ x: number; y: number }>): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const thick = Math.max(3.0, (this.settings.thickness || 1.6) * 1.5);

    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = thick + 1.5;
    ctx.stroke();

    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.strokeStyle = this.settings.color || '#92400e';
    ctx.lineWidth = thick;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
    ctx.lineWidth = thick * 0.4;
    ctx.stroke();
    ctx.restore();
  }

  private drawChainStyle(ctx: CanvasRenderingContext2D, nodes: Array<{ x: number; y: number }>): void {
    for (let i = 0; i < nodes.length - 1; i++) {
      const p1 = nodes[i];
      const p2 = nodes[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);

      const links = Math.max(2, Math.round(dist / 9));
      for (let j = 0; j < links; j++) {
        const t = (j + 0.5) / links;
        const x = p1.x + dx * t;
        const y = p1.y + dy * t;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.ellipse(0, 0, 5, j % 2 === 0 ? 3 : 1.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = j % 2 === 0 ? this.settings.color : '#fef08a';
        ctx.fill();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = '#78350f';
        ctx.stroke();

        ctx.restore();
      }
    }
  }

  private drawThreadStyle(ctx: CanvasRenderingContext2D, nodes: Array<{ x: number; y: number }>): void {
    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.strokeStyle = this.settings.color || '#a8a29e';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  private drawNeonStyle(ctx: CanvasRenderingContext2D, nodes: Array<{ x: number; y: number }>): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const neonColor = this.settings.color || '#00f0ff';

    ctx.save();
    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = (this.settings.thickness || 2) + 3;
    ctx.shadowColor = neonColor;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    traceSpline(ctx, nodes);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1.0, (this.settings.thickness || 2) * 0.4);
    ctx.stroke();
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

function traceSpline(ctx: CanvasRenderingContext2D, points: Array<{ x: number; y: number }>) {
  ctx.moveTo(points[0].x, points[0].y);
  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y);
    return;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}
