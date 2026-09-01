import { useState, useEffect } from 'react';
import { DangleSettings } from '../charms/charmTypes';

export const DEFAULT_APP_SETTINGS: DangleSettings = {
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
    clickThroughEnabled: true,
    reduceMotion: false,
    onboardingCompleted: false,
    doubleClickAction: 'quick-drawer',
    anchorXPercent: 0.5,
  },
  customCharms: [],
  customEmojis: [],
};

type Listener = (settings: DangleSettings) => void;

class ClientSettingsManager {
  private currentSettings: DangleSettings = { ...DEFAULT_APP_SETTINGS };
  private listeners = new Set<Listener>();
  private isLoaded = false;

  constructor() {
    this.init();
  }

  private async init() {
    // 1. Try loading from Electron store
    if (typeof window !== 'undefined' && window.electronAPI?.getSettings) {
      try {
        const saved = await window.electronAPI.getSettings();
        if (saved) {
          this.currentSettings = { ...DEFAULT_APP_SETTINGS, ...saved };
        }
      } catch (err) {
        console.warn('Failed to load settings from Electron, checking localStorage', err);
      }
    } else if (typeof window !== 'undefined') {
      // 2. Fallback to localStorage
      try {
        const local = localStorage.getItem('deskdangle_settings');
        if (local) {
          this.currentSettings = { ...DEFAULT_APP_SETTINGS, ...JSON.parse(local) };
        }
      } catch {
        // use defaults
      }
    }

    this.isLoaded = true;
    this.notify();

    // Listen for broadcasted updates from main process or other windows
    if (typeof window !== 'undefined' && window.electronAPI?.onSettingsUpdated) {
      window.electronAPI.onSettingsUpdated((updated) => {
        this.currentSettings = { ...DEFAULT_APP_SETTINGS, ...updated };
        this.notify();
      });
    }

  }

  public getSettings(): DangleSettings {
    return this.currentSettings;
  }

  public updateSettings(partial: Partial<DangleSettings>) {
    this.currentSettings = {
      ...this.currentSettings,
      ...partial,
      rope: { ...this.currentSettings.rope, ...(partial.rope || {}) },
      physics: { ...this.currentSettings.physics, ...(partial.physics || {}) },
      sound: { ...this.currentSettings.sound, ...(partial.sound || {}) },
      shortcuts: { ...this.currentSettings.shortcuts, ...(partial.shortcuts || {}) },
      general: { ...this.currentSettings.general, ...(partial.general || {}) },
    };

    // Save to Electron
    if (window.electronAPI?.saveSettings) {
      window.electronAPI.saveSettings(this.currentSettings);
    } else {
      localStorage.setItem('deskdangle_settings', JSON.stringify(this.currentSettings));
    }

    this.notify();
  }

  public async resetSettings(): Promise<DangleSettings> {
    if (window.electronAPI?.resetSettings) {
      const res = await window.electronAPI.resetSettings();
      this.currentSettings = { ...DEFAULT_APP_SETTINGS, ...res };
    } else {
      const savedCharms = this.currentSettings.customCharms;
      const savedEmojis = this.currentSettings.customEmojis;
      this.currentSettings = {
        ...DEFAULT_APP_SETTINGS,
        customCharms: savedCharms,
        customEmojis: savedEmojis,
      };
      localStorage.setItem('deskdangle_settings', JSON.stringify(this.currentSettings));
    }
    this.notify();
    return this.currentSettings;
  }

  public async deleteCustomCharms(): Promise<DangleSettings> {
    if (window.electronAPI?.deleteCustomCharms) {
      const res = await window.electronAPI.deleteCustomCharms();
      this.currentSettings = { ...DEFAULT_APP_SETTINGS, ...res };
    } else {
      this.currentSettings = {
        ...this.currentSettings,
        selectedCharmId: 'evil-eye',
        customCharms: [],
        customEmojis: [],
      };
      localStorage.setItem('deskdangle_settings', JSON.stringify(this.currentSettings));
    }
    this.notify();
    return this.currentSettings;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.isLoaded) {
      listener(this.currentSettings);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentSettings));
  }
}

export const clientSettings = new ClientSettingsManager();

export function useDangleSettings(): [
  DangleSettings,
  (partial: Partial<DangleSettings>) => void,
  () => Promise<DangleSettings>,
  () => Promise<DangleSettings>
] {
  const [settings, setSettings] = useState<DangleSettings>(clientSettings.getSettings());

  useEffect(() => {
    return clientSettings.subscribe((newSettings) => {
      setSettings(newSettings);
    });
  }, []);

  const update = (partial: Partial<DangleSettings>) => {
    clientSettings.updateSettings(partial);
  };

  const reset = () => clientSettings.resetSettings();
  const deleteCharms = () => clientSettings.deleteCustomCharms();

  return [settings, update, reset, deleteCharms];
}

