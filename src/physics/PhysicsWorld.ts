import Matter from 'matter-js';
import { CharmPhysics } from './CharmPhysics';
import { RopePhysics } from './RopePhysics';
import { Charm, PhysicsSettings, RopeSettings } from '../charms/charmTypes';
import { soundEffects } from '../audio/SoundEffects';
import { clientSettings } from '../store/settingsStore';

export interface DragSample {
  x: number;
  y: number;
  time: number;
}

export class PhysicsWorld {
  public engine: Matter.Engine;
  public world: Matter.World;
  public charm: CharmPhysics;
  public rope: RopePhysics;

  private dragBody: Matter.Body | null = null;
  private dragConstraint: Matter.Constraint | null = null;
  private dragTargetBody: Matter.Body | null = null;
  private isDragging = false;
  private isDraggingAnchor = false;
  private dragHistory: DragSample[] = [];
  private isPaused = false;
  private dragStartTime = 0;
  private dragStartPos = { x: 0, y: 0 };
  private targetDragPos = { x: 0, y: 0 };
  private currentDragPos = { x: 0, y: 0 };
  private physicsSettings: PhysicsSettings;

  private leftWall: Matter.Body;
  private rightWall: Matter.Body;
  private bottomWall: Matter.Body;
  public screenWidth: number;
  public screenHeight: number;

  private lastStepTime = performance.now();
  private accumulator = 0;

  constructor(
    width: number,
    height: number,
    charm: Charm,
    globalScale = 1.0,
    ropeSettings?: Partial<RopeSettings>,
    physicsSettings?: Partial<PhysicsSettings>
  ) {
    this.screenWidth = width;
    this.screenHeight = height;
    const currentSettings = clientSettings.getSettings();
    this.physicsSettings = { ...currentSettings.physics, ...(physicsSettings || {}) };

    // 1. Initialize Matter.js Engine & World with high solver iterations for silky smooth stability
    this.engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 1.0,
        scale: 0.0018 * this.physicsSettings.gravity,
      },
      positionIterations: 10,
      velocityIterations: 10,
      constraintIterations: 4,
    });
    this.world = this.engine.world;

    const anchorRatio = currentSettings.general.anchorXPercent ?? 0.5;
    const anchorX = Math.round(width * anchorRatio);
    const anchorY = 0;

    // 2. Screen Boundary Walls
    const wallThick = 120;
    this.leftWall = Matter.Bodies.rectangle(-wallThick / 2, height / 2, wallThick, height * 3, {
      isStatic: true,
      restitution: 0.5,
      friction: 0.1,
      label: 'wall-left',
    });
    this.rightWall = Matter.Bodies.rectangle(width + wallThick / 2, height / 2, wallThick, height * 3, {
      isStatic: true,
      restitution: 0.5,
      friction: 0.1,
      label: 'wall-right',
    });
    this.bottomWall = Matter.Bodies.rectangle(width / 2, height + wallThick / 2, width * 3, wallThick, {
      isStatic: true,
      restitution: 0.5,
      friction: 0.1,
      label: 'wall-bottom',
    });
    Matter.World.add(this.world, [this.leftWall, this.rightWall, this.bottomWall]);

    // 3. Initialize Charm and Rope
    this.charm = new CharmPhysics(anchorX, 220, charm, globalScale);
    Matter.World.add(this.world, this.charm.body);

    this.rope = new RopePhysics(
      this.world,
      this.charm,
      anchorX,
      anchorY,
      ropeSettings || currentSettings.rope
    );

    this.updatePhysicsSettings(this.physicsSettings);
  }

  public updatePhysicsSettings(settings: Partial<PhysicsSettings>): void {
    this.physicsSettings = { ...this.physicsSettings, ...settings };
    this.engine.gravity.scale = 0.0018 * (this.physicsSettings.gravity ?? 1.0);
    this.charm.updatePhysicsProperties(
      this.physicsSettings.damping,
      this.physicsSettings.restitution
    );
  }

  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
    const anchorRatio = clientSettings.getSettings().general.anchorXPercent ?? 0.5;
    const newAnchorX = Math.round(width * anchorRatio);
    this.rope.setAnchorPosition(newAnchorX, this.rope.anchorY);

    const wallThick = 120;
    Matter.Body.setPosition(this.leftWall, { x: -wallThick / 2, y: height / 2 });
    Matter.Body.setPosition(this.rightWall, { x: width + wallThick / 2, y: height / 2 });
    Matter.Body.setPosition(this.bottomWall, { x: width / 2, y: height + wallThick / 2 });
  }

  /**
   * Ultra-smooth physics step with 120Hz substepping accumulator
   */
  public step(currentTime?: number): void {
    if (this.isPaused) return;

    const now = currentTime ?? performance.now();
    const dt = Math.min(now - this.lastStepTime, 48); // Clamp to max 48ms
    this.lastStepTime = now;

    if (dt <= 0) return;

    // 120 Hz fixed sub-step (8.33ms) for buttery smooth chain physics
    const subStep = 1000 / 120;
    this.accumulator += dt;

    while (this.accumulator >= subStep) {
      this.subStepUpdate(subStep, now);
      this.accumulator -= subStep;
    }
  }

  private subStepUpdate(deltaMs: number, now: number): void {
    const generalSettings = clientSettings.getSettings().general;

    // 1. Smooth mouse drag tracking
    if (this.isDragging && this.dragBody && !this.isDraggingAnchor) {
      this.currentDragPos.x += (this.targetDragPos.x - this.currentDragPos.x) * 0.45;
      this.currentDragPos.y += (this.targetDragPos.y - this.currentDragPos.y) * 0.45;
      Matter.Body.setPosition(this.dragBody, this.currentDragPos);
    }

    // 2. Continuous Organic Idle Wind
    if (
      !this.isDragging &&
      this.physicsSettings.idleEnabled &&
      !generalSettings.reduceMotion &&
      this.physicsSettings.windStrength > 0
    ) {
      const t = now * 0.001;
      const windMul = this.physicsSettings.windStrength;
      const windX =
        (Math.sin(t * 0.5) * 0.00015 +
          Math.sin(t * 1.1) * 0.00007 +
          Math.cos(t * 0.25) * 0.00004) *
        windMul;
      const windY = Math.sin(t * 0.75) * 0.000025 * windMul;

      this.charm.applyForce({ x: windX, y: windY });

      if (this.rope.segments.length > 3) {
        const midSeg = this.rope.segments[Math.floor(this.rope.segments.length / 2)];
        Matter.Body.applyForce(midSeg, midSeg.position, {
          x: windX * 0.35,
          y: windY * 0.2,
        });
      }
    }

    Matter.Engine.update(this.engine, deltaMs);
  }

  public isPointOnCharm(x: number, y: number): boolean {
    const charmPos = this.charm.getPosition();
    const radius = this.charm.radius + 14;
    const dx = x - charmPos.x;
    const dy = y - charmPos.y;
    return dx * dx + dy * dy <= radius * radius;
  }

  public isPointNearAnchor(x: number, y: number): boolean {
    const dx = Math.abs(x - this.rope.anchorX);
    const dy = y;
    return dx < 36 && dy >= 0 && dy < 32;
  }

  public isPointOnRope(x: number, y: number): boolean {
    const nodes = this.rope.getNodePoints(this.charm);
    for (let i = 0; i < nodes.length - 1; i++) {
      const p1 = nodes[i];
      const p2 = nodes[i + 1];
      const dist = distanceToSegment({ x, y }, p1, p2);
      if (dist < 14) return true;
    }
    return false;
  }

  public isPointNearInteractiveZone(x: number, y: number): boolean {
    return this.isPointOnCharm(x, y) || this.isPointOnRope(x, y) || this.isPointNearAnchor(x, y);
  }

  public findTargetBodyAt(x: number, y: number): Matter.Body | null {
    if (this.isPointOnCharm(x, y)) {
      return this.charm.body;
    }

    const segments = this.rope.segments;
    let closestBody: Matter.Body | null = null;
    let closestDist = 20;

    for (const seg of segments) {
      const dist = Math.hypot(x - seg.position.x, y - seg.position.y);
      if (dist < closestDist) {
        closestDist = dist;
        closestBody = seg;
      }
    }

    return closestBody;
  }

  public startDrag(x: number, y: number): void {
    if (this.isPaused) return;

    this.isDragging = true;
    this.dragStartTime = performance.now();
    this.dragStartPos = { x, y };
    this.targetDragPos = { x, y };
    this.currentDragPos = { x, y };
    this.dragHistory = [{ x, y, time: this.dragStartTime }];

    soundEffects.playGrabSound();

    if (this.isPointNearAnchor(x, y)) {
      this.isDraggingAnchor = true;
      this.setAnchorPosition(x, 0);
      return;
    }

    this.isDraggingAnchor = false;
    this.dragTargetBody = this.findTargetBodyAt(x, y) || this.charm.body;

    this.dragBody = Matter.Bodies.circle(x, y, 2, {
      isStatic: true,
      collisionFilter: { group: -1 },
    });
    Matter.World.add(this.world, this.dragBody);

    const stiffness = this.physicsSettings.interactionStiffness ?? 0.38;

    this.dragConstraint = Matter.Constraint.create({
      bodyA: this.dragBody,
      bodyB: this.dragTargetBody,
      pointA: { x: 0, y: 0 },
      pointB: {
        x: x - this.dragTargetBody.position.x,
        y: y - this.dragTargetBody.position.y,
      },
      stiffness,
      damping: 0.08,
      length: 0,
    });
    Matter.World.add(this.world, this.dragConstraint);
  }

  public updateDrag(x: number, y: number): void {
    if (!this.isDragging) return;

    if (this.isDraggingAnchor) {
      this.setAnchorPosition(x, 0);
      return;
    }

    this.targetDragPos = { x, y };

    const now = performance.now();
    this.dragHistory.push({ x, y, time: now });

    while (this.dragHistory.length > 1 && now - this.dragHistory[0].time > 120) {
      this.dragHistory.shift();
    }
  }

  public endDrag(): { isTap: boolean; isThrow: boolean; newAnchorXPercent?: number } {
    if (!this.isDragging) return { isTap: false, isThrow: false };

    if (this.isDraggingAnchor) {
      this.isDragging = false;
      this.isDraggingAnchor = false;
      const newRatio = Math.max(0.05, Math.min(0.95, this.rope.anchorX / this.screenWidth));
      return { isTap: false, isThrow: false, newAnchorXPercent: newRatio };
    }

    const now = performance.now();
    const dragDuration = now - this.dragStartTime;

    let throwVelocity = { x: 0, y: 0 };
    if (this.dragHistory.length >= 2) {
      const oldest = this.dragHistory[0];
      const newest = this.dragHistory[this.dragHistory.length - 1];
      const dt = (newest.time - oldest.time) / 1000;

      if (dt > 0.01) {
        const vx = (newest.x - oldest.x) / dt;
        const vy = (newest.y - oldest.y) / dt;

        const maxSpeed = 3200;
        const speed = Math.hypot(vx, vy);
        const scale = speed > maxSpeed ? maxSpeed / speed : 1.0;

        const swingMult = this.physicsSettings.swingIntensity ?? 1.0;
        throwVelocity = {
          x: vx * 0.0032 * swingMult * scale,
          y: vy * 0.0032 * swingMult * scale,
        };
      }
    }

    if (this.dragConstraint) {
      Matter.World.remove(this.world, this.dragConstraint);
      this.dragConstraint = null;
    }

    if (this.dragBody) {
      Matter.World.remove(this.world, this.dragBody);
      this.dragBody = null;
    }

    const target = this.dragTargetBody || this.charm.body;
    if (Math.hypot(throwVelocity.x, throwVelocity.y) > 0.4) {
      Matter.Body.setVelocity(target, throwVelocity);
      soundEffects.playReleaseSound(Math.hypot(throwVelocity.x, throwVelocity.y));
    }

    const totalDist = Math.hypot(
      (this.dragHistory[this.dragHistory.length - 1]?.x ?? 0) - this.dragStartPos.x,
      (this.dragHistory[this.dragHistory.length - 1]?.y ?? 0) - this.dragStartPos.y
    );

    const isTap = dragDuration < 250 && totalDist < 8;
    const isThrow = Math.hypot(throwVelocity.x, throwVelocity.y) > 1.2;

    this.isDragging = false;
    this.dragTargetBody = null;
    this.dragHistory = [];

    return { isTap, isThrow };
  }

  public poke(x: number, y: number, strength = 1.0): void {
    const charmPos = this.charm.getPosition();
    const dx = charmPos.x - x;
    const dy = charmPos.y - y;
    const dist = Math.hypot(dx, dy) || 1;

    const forceMagnitude = 0.0055 * strength * (this.physicsSettings.swingIntensity ?? 1.0);
    this.charm.applyForce({
      x: (dx / dist) * forceMagnitude,
      y: (dy / dist) * forceMagnitude - 0.002,
    });
    soundEffects.playTapSound();
  }

  public setAnchorPosition(x: number, y: number): void {
    this.rope.setAnchorPosition(x, y);
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  public togglePaused(): boolean {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getIsDragging(): boolean {
    return this.isDragging;
  }

  public updateCharm(charm: Charm, scale = 1.0): void {
    this.charm.updateCharm(charm, scale);
    this.rope.updateSettings(this.world, this.charm, {});
  }

  public changeCharm(charm: Charm, scale = 1.0): void {
    this.updateCharm(charm, scale);
  }

  public updateRopeSettings(settings: Partial<RopeSettings>): void {
    this.rope.updateSettings(this.world, this.charm, settings);
  }

  public updateRope(settings: Partial<RopeSettings>): void {
    this.updateRopeSettings(settings);
  }

  public destroy(): void {
    this.rope.destroy(this.world);
    Matter.World.remove(this.world, this.charm.body);
    Matter.World.remove(this.world, [this.leftWall, this.rightWall, this.bottomWall]);
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
  }
}

function distanceToSegment(
  p: { x: number; y: number },
  v: { x: number; y: number },
  w: { x: number; y: number }
): number {
  const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}
