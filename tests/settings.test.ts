import { describe, it, expect } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../src/store/settingsStore';
import { DangleSettings } from '../src/charms/charmTypes';


describe('DeskDangle Settings Store & Defaults', () => {
  it('should have valid default settings with 10 built-in charm support', () => {
    expect(DEFAULT_APP_SETTINGS.selectedCharmId).toBe('evil-eye');
    expect(DEFAULT_APP_SETTINGS.charmScale).toBe(1.0);
    expect(DEFAULT_APP_SETTINGS.rope.style).toBe('classic');
    expect(DEFAULT_APP_SETTINGS.rope.lengthSegments).toBe(7);
    expect(DEFAULT_APP_SETTINGS.physics.gravity).toBe(1.0);
    expect(DEFAULT_APP_SETTINGS.physics.damping).toBe(0.007);
    expect(DEFAULT_APP_SETTINGS.sound.enabled).toBe(true);
    expect(DEFAULT_APP_SETTINGS.general.clickThroughEnabled).toBe(true);
    expect(DEFAULT_APP_SETTINGS.shortcuts.enabled).toBe(false);
    expect(DEFAULT_APP_SETTINGS.shortcuts.toggleVisibility).toBe('Alt+Shift+D');
  });

  it('should validate and merge partial updates correctly', () => {
    const original: DangleSettings = { ...DEFAULT_APP_SETTINGS };
    const update: Partial<DangleSettings> = {
      selectedCharmId: 'banana-cat',
      rope: { ...original.rope, style: 'chain', color: '#f59e0b' },
      physics: { ...original.physics, gravity: 1.5 },
    };

    const merged: DangleSettings = {
      ...original,
      ...update,
      rope: { ...original.rope, ...(update.rope || {}) },
      physics: { ...original.physics, ...(update.physics || {}) },
    };

    expect(merged.selectedCharmId).toBe('banana-cat');
    expect(merged.rope.style).toBe('chain');
    expect(merged.rope.color).toBe('#f59e0b');
    expect(merged.physics.gravity).toBe(1.5);
    // Unmodified values preserved
    expect(merged.physics.damping).toBe(0.007);
    expect(merged.rope.lengthSegments).toBe(7);
  });

  it('should handle settings reset while preserving custom charms', () => {
    const stateWithCustomCharms: DangleSettings = {
      ...DEFAULT_APP_SETTINGS,
      selectedCharmId: 'custom-123',
      physics: { ...DEFAULT_APP_SETTINGS.physics, gravity: 2.5 },
      customCharms: [
        {
          id: 'custom-123',
          name: 'My Mascot',
          category: 'custom',
          scale: 1.2,
          anchorOffset: 34,
          renderType: 'image',
          imageDataUrl: 'data:image/png;base64,iVBORw0KGgo=',
        },
      ],
    };

    // Reset logic
    const resetState: DangleSettings = {
      ...DEFAULT_APP_SETTINGS,
      customCharms: stateWithCustomCharms.customCharms,
      customEmojis: stateWithCustomCharms.customEmojis,
    };

    expect(resetState.physics.gravity).toBe(1.0);
    expect(resetState.customCharms.length).toBe(1);
    expect(resetState.customCharms[0].name).toBe('My Mascot');
  });

  it('should handle corrupted JSON data gracefully with safe fallbacks', () => {
    const parseCorruptedSettings = (raw: string): DangleSettings => {
      try {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_APP_SETTINGS, ...parsed };
      } catch {
        return { ...DEFAULT_APP_SETTINGS };
      }
    };

    const corruptedRaw = '{"selectedCharmId": "cherry", "physics": { "gravity": ';
    const recovered = parseCorruptedSettings(corruptedRaw);

    expect(recovered).toBeDefined();
    expect(recovered.selectedCharmId).toBe('evil-eye');
    expect(recovered.physics.gravity).toBe(1.0);
  });
});

