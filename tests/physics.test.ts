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

  it('should maintain continuous rope attachment across all charm scale levels (0.7 to 1.4)', () => {
    const deadpool = BUILTIN_CHARMS.find((c) => c.id === 'deadpool') || BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      deadpool,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    // Test multiple scales from min 0.70 to max 1.40
    for (const scale of [0.7, 0.85, 1.0, 1.25, 1.4]) {
      physics.updateCharm(deadpool, scale);
      const nodes = physics.rope.getNodePoints(physics.charm);
      const endNode = nodes[nodes.length - 1];
      const charmPos = physics.charm.getPosition();
      const topOffset = physics.charm.getTopOffset();

      // End of rope node Y must equal charm center Y minus topOffset
      expect(endNode.y).toBeCloseTo(charmPos.y - topOffset, 2);
      expect(endNode.x).toBeCloseTo(charmPos.x, 2);
    }

    physics.destroy();
  });

  it('should detect clicks near anchor and support dragging anchor horizontally along screen top', () => {
    const charm = BUILTIN_CHARMS[0];
    const physics = new PhysicsWorld(
      1920,
      1080,
      charm,
      1.0,
      DEFAULT_APP_SETTINGS.rope,
      DEFAULT_APP_SETTINGS.physics
    );

    const anchorX = physics.rope.anchorX;

    // Hit detection near anchor
    expect(physics.isPointNearAnchor(anchorX, 5)).toBe(true);
    expect(physics.isPointNearAnchor(anchorX + 15, 8)).toBe(true);
    expect(physics.isPointNearAnchor(anchorX + 50, 5)).toBe(false);
    expect(physics.isPointNearAnchor(anchorX, 35)).toBe(false);

    // Interactive zone includes anchor
    expect(physics.isPointNearInteractiveZone(anchorX, 5)).toBe(true);

    // Empty space along middle of rope is NOT interactive (ensures click-through)
    const midY = (physics.charm.getPosition().y) / 2;
    expect(physics.isPointNearInteractiveZone(anchorX, midY)).toBe(false);

    // Drag anchor horizontally
    physics.startDrag(anchorX, 4);
    expect(physics.getIsDragging()).toBe(true);
    expect(physics.getIsDraggingAnchor()).toBe(true);

    // Slide to a new X position
    physics.updateDrag(700, 4);
    expect(physics.rope.anchorX).toBe(700);

    // End drag returns newAnchorXPercent
    const dragResult = physics.endDrag();
    expect(physics.getIsDragging()).toBe(false);
    expect(physics.getIsDraggingAnchor()).toBe(false);
    expect(dragResult.newAnchorXPercent).toBeCloseTo(700 / 1920, 2);

    physics.destroy();
  });
});
