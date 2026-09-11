import { describe, it, expect } from 'vitest';
import { ParticleSystem } from '../src/components/ParticleSystem';

describe('ParticleSystem Engine', () => {
  it('should initialize with particle pool', () => {
    const ps = new ParticleSystem();
    expect(ps.activeCount).toBe(0);
    expect(ps.getBounds()).toBeNull();
  });

  it('should emit burst particles from point', () => {
    const ps = new ParticleSystem();
    ps.burst(100, 200, 15, 'star');

    expect(ps.activeCount).toBe(15);
    const box = ps.getBounds();
    expect(box).not.toBeNull();
    expect(box!.minX).toBeLessThanOrEqual(100);
    expect(box!.maxX).toBeGreaterThanOrEqual(100);
    expect(box!.minY).toBeLessThanOrEqual(200);
    expect(box!.maxY).toBeGreaterThanOrEqual(200);
  });

  it('should advance particles and clean up expired particles', () => {
    const ps = new ParticleSystem();
    ps.burst(50, 50, 10, 'heart');
    expect(ps.activeCount).toBe(10);

    // Advance by many frames
    for (let i = 0; i < 80; i++) {
      ps.update(1.0);
    }

    // After decay, particles should naturally return to pool
    expect(ps.activeCount).toBe(0);
    expect(ps.getBounds()).toBeNull();
  });

  it('should clear all active particles immediately on reset', () => {
    const ps = new ParticleSystem();
    ps.burst(150, 150, 10, 'sparkle');
    expect(ps.activeCount).toBe(10);

    ps.clear();
    expect(ps.activeCount).toBe(0);
    expect(ps.getBounds()).toBeNull();
  });
});
