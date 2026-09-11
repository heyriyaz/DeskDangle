import { describe, it, expect } from 'vitest';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { BUILTIN_CHARMS } from '../src/charms/charmRegistry';
import { DEFAULT_APP_SETTINGS } from '../src/store/settingsStore';

describe('DeskDangle Matter.js Physics Engine', () => {
  it('should initialize physics world with rope segments and charm body', () => {
    const charm = BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      charm,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    expect(physics.engine).toBeDefined();
    expect(physics.world).toBeDefined();
    expect(physics.rope).toBeDefined();
    expect(physics.charm).toBeDefined();

    // Verify rope segments
    expect(physics.rope.segments.length).toBe(DEFAULT_APP_SETTINGS.rope.lengthSegments);

    // Initial position
    const pos = physics.charm.getPosition();
    expect(pos.x).toBeGreaterThan(0);
    expect(pos.y).toBeGreaterThan(0);

    physics.destroy();
  });

  it('should toggle pause and resume physics step execution', () => {
    const charm = BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      charm,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    expect(physics.getIsPaused()).toBe(false);

    // Pause
    physics.togglePause();
    expect(physics.getIsPaused()).toBe(true);

    // Step while paused (should not update physics bodies)
    const initialPos = physics.charm.getPosition();
    physics.step(performance.now() + 100);
    const afterPausedStep = physics.charm.getPosition();
    expect(afterPausedStep.x).toBe(initialPos.x);
    expect(afterPausedStep.y).toBe(initialPos.y);

    // Resume
    physics.togglePause();
    expect(physics.getIsPaused()).toBe(false);

    physics.destroy();
  });

  it('should reposition the top anchor cleanly across the screen width', () => {
    const charm = BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      charm,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    physics.setAnchorPosition(500, 0);
    expect(physics.rope.anchorX).toBe(500);

    physics.setAnchorPosition(1200, 0);
    expect(physics.rope.anchorX).toBe(1200);

    physics.destroy();
  });

  it('should clean up all Matter.js bodies and constraints on destroy', () => {
    const charm = BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      charm,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    expect(physics.world.bodies.length).toBeGreaterThan(0);
    physics.destroy();

    // After destroy, world bodies and constraints are cleared
    expect(physics.world.bodies.length).toBe(0);
    expect(physics.world.constraints.length).toBe(0);
  });

  it('should apply physics presets dynamically', () => {
    const charm = BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      charm,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    physics.applyPreset('bouncy');
    expect(physics.physicsSettings.gravity).toBe(1.1);
    expect(physics.physicsSettings.restitution).toBe(0.75);

    physics.applyPreset('heavy');
    expect(physics.physicsSettings.gravity).toBe(1.6);
    expect(physics.physicsSettings.damping).toBe(0.018);

    physics.applyPreset('space');
    expect(physics.physicsSettings.gravity).toBe(0.15);

    physics.destroy();
  });

  it('should apply aerodynamic air displacement breeze when cursor moves rapidly near charm', () => {
    const charm = BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      charm,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    const pos = physics.charm.getPosition();
    const beforeSpeed = physics.charm.body.speed;

    // Simulate mouse swiping past charm within 100px with high velocity
    physics.applyAirDisplacement(pos.x + 30, pos.y + 10, 8.0, -4.0);

    // Speed should increase due to air impulse
    expect(physics.charm.body.speed).toBeGreaterThanOrEqual(beforeSpeed);

    physics.destroy();
  });

  it('should trigger delight squash impulse on interaction', () => {
    const charm = BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      charm,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    physics.triggerDelightImpulse();
    expect(Math.abs(physics.charm.body.force.x) + Math.abs(physics.charm.body.force.y)).toBeGreaterThan(0);

    physics.destroy();
  });
});
