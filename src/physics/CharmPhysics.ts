import Matter from 'matter-js';
import { Charm } from '../charms/charmTypes';

export class CharmPhysics {
  public body: Matter.Body;
  public charm: Charm;
  public radius: number;

  constructor(x: number, y: number, charm: Charm, globalScale = 1.0) {
    this.charm = charm;
    this.radius = 34 * (charm.scale || 1.0) * globalScale;

    this.body = Matter.Bodies.circle(x, y, this.radius, {
      label: 'charm',
      mass: 2.8,
      frictionAir: 0.007,
      restitution: 0.35,
      friction: 0.1,
      frictionStatic: 0.1,
    });
  }

  public updateCharm(charm: Charm, globalScale = 1.0): void {
    this.charm = charm;
    const newRadius = 34 * (charm.scale || 1.0) * globalScale;
    if (Math.abs(newRadius - this.radius) > 1.0) {
      const scaleFactor = newRadius / this.radius;
      Matter.Body.scale(this.body, scaleFactor, scaleFactor);
      this.radius = newRadius;
    }
  }

  public updatePhysicsProperties(damping?: number, restitution?: number): void {
    if (damping !== undefined) {
      this.body.frictionAir = damping;
    }
    if (restitution !== undefined) {
      this.body.restitution = restitution;
    }
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.body.position.x, y: this.body.position.y };
  }

  public getVelocity(): { x: number; y: number } {
    return { x: this.body.velocity.x, y: this.body.velocity.y };
  }

  public getAngle(): number {
    return this.body.angle;
  }

  public getAngularVelocity(): number {
    return this.body.angularVelocity;
  }

  public getSpeed(): number {
    return this.body.speed;
  }

  public applyForce(force: { x: number; y: number }, point?: { x: number; y: number }): void {
    const targetPoint = point || this.body.position;
    Matter.Body.applyForce(this.body, targetPoint, force);
  }

  public setVelocity(velocity: { x: number; y: number }): void {
    Matter.Body.setVelocity(this.body, velocity);
  }

  public setPosition(position: { x: number; y: number }): void {
    Matter.Body.setPosition(this.body, position);
  }

  public applyImpulse(impulse: { x: number; y: number }): void {
    Matter.Body.setVelocity(this.body, {
      x: this.body.velocity.x + impulse.x / this.body.mass,
      y: this.body.velocity.y + impulse.y / this.body.mass,
    });
  }
}
