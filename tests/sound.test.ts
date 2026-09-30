import { describe, it, expect, beforeEach } from 'vitest';
import { soundEffects } from '../src/audio/SoundEffects';
import { clientSettings } from '../src/store/settingsStore';

describe('SoundEffects Procedural Web Audio Engine', () => {
  beforeEach(() => {
    // Reset sound settings
    clientSettings.updateSettings({
      sound: {
        enabled: true,
        volume: 0.8,
        wallImpactSounds: true,
      },
    });
  });

  it('should safely invoke grab, release, and tap sounds without throwing', () => {
    expect(() => soundEffects.playGrabSound()).not.toThrow();
    expect(() => soundEffects.playReleaseSound(1.5)).not.toThrow();
    expect(() => soundEffects.playTapSound()).not.toThrow();
  });

  it('should safely invoke delight chime', () => {
    expect(() => soundEffects.playDelightChime()).not.toThrow();
  });

  it('should safely invoke wall bump impact thud', () => {
    expect(() => soundEffects.playWallBumpSound(0.8)).not.toThrow();
  });

  it('should safely invoke chain clink metallic effect', () => {
    expect(() => soundEffects.playChainClinkSound()).not.toThrow();
  });

  it('should respect muted settings', () => {
    clientSettings.updateSettings({
      sound: {
        enabled: false,
        volume: 0,
        wallImpactSounds: false,
      },
    });
    expect(() => soundEffects.playDelightChime()).not.toThrow();
    expect(() => soundEffects.playWallBumpSound()).not.toThrow();
  });
});
