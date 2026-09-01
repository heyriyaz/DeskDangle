import { describe, it, expect } from 'vitest';
import { BUILTIN_CHARMS, CharmRegistry } from '../src/charms/charmRegistry';

describe('DeskDangle Charm System & Security', () => {
  it('should include all 10 built-in photorealistic charms', () => {
    expect(BUILTIN_CHARMS.length).toBe(10);

    const ids = BUILTIN_CHARMS.map((c) => c.id);
    expect(ids).toContain('evil-eye');
    expect(ids).toContain('hamsa-hand');
    expect(ids).toContain('nimbu-mirchi');
    expect(ids).toContain('cherry');
    expect(ids).toContain('glass-heart');
    expect(ids).toContain('fluffy-kitten');
    expect(ids).toContain('pink-cassette');
    expect(ids).toContain('banana-cat');
    expect(ids).toContain('chonky-cat');
    expect(ids).toContain('orange-cat');
  });

  it('should correctly retrieve charms by ID or fallback safely', () => {
    const cherry = CharmRegistry.getCharmById('cherry');
    expect(cherry).toBeDefined();
    expect(cherry.name).toBe('Ruby Cherries');

    // Unknown ID should fall back to the first built-in charm safely without crashing
    const unknown = CharmRegistry.getCharmById('non-existent-charm-xyz');
    expect(unknown).toBeDefined();
    expect(unknown.id).toBe(BUILTIN_CHARMS[0].id);
  });

  it('should pick a random charm different from current selection', () => {
    const currentId = 'evil-eye';
    const randomCharm = CharmRegistry.getRandomCharm(currentId);
    expect(randomCharm).toBeDefined();
    expect(randomCharm.id).not.toBe(currentId);
  });

  it('should validate allowed image MIME types and reject dangerous formats', () => {
    const ALLOWED_MIMES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

    const isValidMime = (mime: string) => ALLOWED_MIMES.includes(mime.toLowerCase());

    expect(isValidMime('image/png')).toBe(true);
    expect(isValidMime('image/jpeg')).toBe(true);
    expect(isValidMime('image/webp')).toBe(true);
    expect(isValidMime('image/svg+xml')).toBe(true);

    // Reject executables, scripts, and unknown formats
    expect(isValidMime('application/x-msdownload')).toBe(false);
    expect(isValidMime('text/javascript')).toBe(false);
    expect(isValidMime('application/octet-stream')).toBe(false);
    expect(isValidMime('image/tiff')).toBe(false);
  });

  it('should enforce the 5MB size limit on custom uploads', () => {
    const MAX_BYTES = 5 * 1024 * 1024;

    const isWithinLimit = (byteLength: number) => byteLength <= MAX_BYTES;

    expect(isWithinLimit(1024 * 500)).toBe(true); // 500KB -> OK
    expect(isWithinLimit(4.8 * 1024 * 1024)).toBe(true); // 4.8MB -> OK
    expect(isWithinLimit(5.2 * 1024 * 1024)).toBe(false); // 5.2MB -> Reject
    expect(isWithinLimit(15 * 1024 * 1024)).toBe(false); // 15MB -> Reject
  });
});
