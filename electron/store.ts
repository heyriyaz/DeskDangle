import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { DangleSettings } from '../src/charms/charmTypes';

export const SETTINGS_SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS: DangleSettings = {
  selectedCharmId: 'evil-eye',
  charmScale: 1.0,
  rope: {
    style: 'classic',
    lengthSegments: 7,
    segmentLength: 18,
    thickness: 3.2,
    color: '#785338',
    opacity: 0.95,
  },
  physics: {
    gravity: 1.0,
    damping: 0.007,
    swingIntensity: 1.0,
    windStrength: 1.0,
    idleEnabled: true,
    interactionStiffness: 0.35,
    restitution: 0.35,
  },
  sound: {
    enabled: true,
    volume: 0.7,
  },
  shortcuts: {
    enabled: false,
    toggleVisibility: 'Alt+Shift+D',
    togglePhysics: 'Alt+Shift+P',
    randomCharm: 'Alt+Shift+R',
    openSettings: 'Alt+Shift+S',
  },
  general: {
    launchAtStartup: false,
    startHidden: false,
    displayMode: 'primary',
    selectedDisplayId: undefined,
    clickThroughEnabled: true,
    reduceMotion: false,
    onboardingCompleted: false,
    doubleClickAction: 'quick-drawer',
    anchorXPercent: 0.5,
  },
  customCharms: [],
  customEmojis: [],
};

export class SettingsStore {
  private filePath: string;
  private oldFilePath: string;
  private data: DangleSettings;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.filePath = path.join(userDataPath, 'deskdangle-settings.json');
    this.oldFilePath = path.join(userDataPath, 'dangle-settings.json');
    this.migrateOldSettings();
    this.data = this.load();
  }

  private migrateOldSettings(): void {
    try {
      if (!fs.existsSync(this.filePath) && fs.existsSync(this.oldFilePath)) {
        fs.copyFileSync(this.oldFilePath, this.filePath);
        console.log('[SettingsStore] Migrated old settings to deskdangle-settings.json');
      }
    } catch (err) {
      console.warn('[SettingsStore] Migration check failed:', err);
    }
  }

  private load(): DangleSettings {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);

        // Sanitize numbers to prevent NaN or negative physics values
        const gravity = typeof parsed.physics?.gravity === 'number' && !isNaN(parsed.physics.gravity) ? Math.max(0.1, Math.min(3.0, parsed.physics.gravity)) : DEFAULT_SETTINGS.physics.gravity;
        const damping = typeof parsed.physics?.damping === 'number' && !isNaN(parsed.physics.damping) ? Math.max(0.001, Math.min(0.05, parsed.physics.damping)) : DEFAULT_SETTINGS.physics.damping;

        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          rope: { ...DEFAULT_SETTINGS.rope, ...(parsed.rope || {}) },
          physics: {
            ...DEFAULT_SETTINGS.physics,
            ...(parsed.physics || {}),
            gravity,
            damping,
          },
          sound: { ...DEFAULT_SETTINGS.sound, ...(parsed.sound || {}) },
          shortcuts: { ...DEFAULT_SETTINGS.shortcuts, ...(parsed.shortcuts || {}) },
          general: { ...DEFAULT_SETTINGS.general, ...(parsed.general || {}) },
          customCharms: Array.isArray(parsed.customCharms) ? parsed.customCharms : [],
          customEmojis: Array.isArray(parsed.customEmojis) ? parsed.customEmojis : [],
        };
      }
    } catch (error) {
      console.error('[SettingsStore] Failed to load settings, backing up corrupted file:', error);
      try {
        const backupPath = `${this.filePath}.corrupted.${Date.now()}.bak`;
        if (fs.existsSync(this.filePath)) {
          fs.copyFileSync(this.filePath, backupPath);
        }
      } catch (backupErr) {
        console.error('[SettingsStore] Failed to backup corrupted settings:', backupErr);
      }
    }
    return { ...DEFAULT_SETTINGS };
  }

  public getSettings(): DangleSettings {
    return this.data;
  }

  public saveSettings(newSettings: Partial<DangleSettings>): DangleSettings {
    this.data = {
      ...this.data,
      ...newSettings,
      rope: { ...this.data.rope, ...(newSettings.rope || {}) },
      physics: { ...this.data.physics, ...(newSettings.physics || {}) },
      sound: { ...this.data.sound, ...(newSettings.sound || {}) },
      shortcuts: { ...this.data.shortcuts, ...(newSettings.shortcuts || {}) },
      general: { ...this.data.general, ...(newSettings.general || {}) },
      customCharms: newSettings.customCharms !== undefined ? newSettings.customCharms : this.data.customCharms,
      customEmojis: newSettings.customEmojis !== undefined ? newSettings.customEmojis : this.data.customEmojis,
    };

    this.persistToDisk();
    return this.data;
  }

  public resetSettings(): DangleSettings {
    // Preserve user custom charms on settings reset
    const savedCustomCharms = this.data.customCharms;
    const savedCustomEmojis = this.data.customEmojis;

    this.data = {
      ...DEFAULT_SETTINGS,
      customCharms: savedCustomCharms,
      customEmojis: savedCustomEmojis,
    };

    this.persistToDisk();
    return this.data;
  }

  public deleteCustomCharms(): DangleSettings {
    this.data = {
      ...this.data,
      selectedCharmId: 'evil-eye',
      customCharms: [],
      customEmojis: [],
    };

    this.persistToDisk();
    return this.data;
  }

  private persistToDisk(): void {
    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (error) {
      console.error('[SettingsStore] Failed to atomically save settings to disk:', error);
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
      } catch (fallbackErr) {
        console.error('[SettingsStore] Fallback write failed:', fallbackErr);
      }
    }
  }
}

