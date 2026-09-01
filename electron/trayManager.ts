import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { SettingsStore } from './store';

export class TrayManager {
  private tray: Tray | null = null;
  private store: SettingsStore;
  private onToggleVisibility: () => void;
  private onTogglePhysics: () => void;
  private onRandomCharm: () => void;
  private onOpenSettings: () => void;

  constructor(
    store: SettingsStore,
    callbacks: {
      onToggleVisibility: () => void;
      onTogglePhysics: () => void;
      onRandomCharm: () => void;
      onOpenSettings: () => void;
    }
  ) {
    this.store = store;
    this.onToggleVisibility = callbacks.onToggleVisibility;
    this.onTogglePhysics = callbacks.onTogglePhysics;
    this.onRandomCharm = callbacks.onRandomCharm;
    this.onOpenSettings = callbacks.onOpenSettings;
    this.createTray();
  }

  private createTrayIcon(): Electron.NativeImage {
    const potentialPaths = [
      path.join(__dirname, '../build/icon.ico'),
      path.join(app.getAppPath(), 'build/icon.ico'),
      path.join(process.resourcesPath, 'build/icon.ico'),
      path.join(__dirname, '../public/tray-icon.png'),
      path.join(__dirname, '../dist/tray-icon.png'),
      path.join(app.getAppPath(), 'public/tray-icon.png'),
      path.join(process.resourcesPath, 'tray-icon.png'),
    ];

    for (const p of potentialPaths) {
      if (fs.existsSync(p)) {
        try {
          const img = nativeImage.createFromPath(p);
          if (!img.isEmpty()) {
            return img.resize({ width: 16, height: 16 });
          }
        } catch (err) {
          console.warn('[TrayManager] Failed to load tray icon from path:', p, err);
        }
      }
    }

    return nativeImage.createEmpty();
  }

  public createTray(): void {
    if (this.tray) return;

    try {
      const icon = this.createTrayIcon();
      if (icon.isEmpty()) {
        console.warn('[TrayManager] Tray icon is empty, skipping tray creation');
        return;
      }

      this.tray = new Tray(icon);
      this.tray.setToolTip('DeskDangle — Desktop Physics Charm');

      this.tray.on('click', () => {
        this.onOpenSettings();
      });

      this.tray.on('double-click', () => {
        this.onOpenSettings();
      });

      this.updateContextMenu(true, false);
    } catch (err) {
      console.error('[TrayManager] Failed to create tray:', err);
    }
  }


  public updateContextMenu(isVisible: boolean, isPaused: boolean): void {
    if (!this.tray) return;

    const settings = this.store.getSettings();

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'DeskDangle v1.0.0',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: isVisible ? 'Hide DeskDangle' : 'Show DeskDangle',
        click: () => this.onToggleVisibility(),
      },
      {
        label: isPaused ? 'Resume Physics' : 'Pause Physics',
        click: () => this.onTogglePhysics(),
      },
      {
        label: 'Random Charm',
        click: () => this.onRandomCharm(),
      },
      { type: 'separator' },
      {
        label: 'Settings...',
        click: () => this.onOpenSettings(),
      },
      { type: 'separator' },
      {
        label: 'Start with Windows',
        type: 'checkbox',
        checked: settings.general.launchAtStartup,
        click: (menuItem) => {
          this.store.saveSettings({
            general: {
              ...settings.general,
              launchAtStartup: menuItem.checked,
            },
          });
          try {
            app.setLoginItemSettings({
              openAtLogin: menuItem.checked,
            });
          } catch (err) {
            console.warn('[TrayManager] Failed to update login item settings:', err);
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Quit DeskDangle',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  public destroy(): void {
    if (this.tray) {
      try {
        this.tray.destroy();
      } catch (err) {
        console.warn('[TrayManager] Error destroying tray:', err);
      }
      this.tray = null;
    }
  }
}

