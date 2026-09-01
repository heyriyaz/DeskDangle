import { BrowserWindow, screen, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { DisplayManager } from './displayManager';
import { SettingsStore } from './store';

export interface InteractiveRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getAppIconPath(): string | undefined {
  const candidates = [
    path.join(__dirname, '../build/icon.ico'),
    path.join(app.getAppPath(), 'build/icon.ico'),
    path.join(process.resourcesPath, 'build/icon.ico'),
    path.join(__dirname, '../dist/tray-icon.png'),
    path.join(app.getAppPath(), 'dist/tray-icon.png'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

export class WindowManager {
  private overlayWindow: BrowserWindow | null = null;
  private settingsWindow: BrowserWindow | null = null;
  private isMouseIgnored = true;
  private displayManager: DisplayManager;
  private store: SettingsStore;

  private interactiveBounds: InteractiveRect[] = [];
  private isDragging = false;
  private hasActiveUI = false;
  private hitTestTimer: NodeJS.Timeout | null = null;

  constructor(store: SettingsStore, displayManager: DisplayManager) {
    this.store = store;
    this.displayManager = displayManager;
  }

  /**
   * Creates the independent, transparent, frameless desktop overlay window.
   */
  public createOverlayWindow(): BrowserWindow {
    const settings = this.store.getSettings();
    const display = this.displayManager.getTargetDisplay(
      settings.general.displayMode,
      settings.general.selectedDisplayId
    );

    const bounds = this.displayManager.getOverlayBounds(display);
    const iconPath = getAppIconPath();


    this.overlayWindow = new BrowserWindow({
      title: 'DeskDangle',
      ...(iconPath ? { icon: iconPath } : {}),

      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      show: false,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      focusable: false, // Never steals focus from active Windows applications
      hasShadow: false,
      resizable: false,
      maximizable: false,
      minimizable: false,
      skipTaskbar: true, // Independent overlay does not clutter taskbar
      backgroundColor: '#00000000',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
        backgroundThrottling: false,
      },
    });

    this.overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    // Use 'screen-saver' level so it stays permanently on top of all Windows applications & browsers
    this.overlayWindow.setAlwaysOnTop(true, 'screen-saver');

    // Immediately start in click-through mode so the desktop is never blocked!
    this.isMouseIgnored = true;
    this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });


    this.overlayWindow.once('ready-to-show', () => {
      if (!settings.general.startHidden && this.overlayWindow && !this.overlayWindow.isDestroyed()) {
        this.overlayWindow.showInactive();
      }
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      this.overlayWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      this.overlayWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }


    this.startCursorHitTesting();

    this.overlayWindow.on('closed', () => {
      this.stopCursorHitTesting();
      this.overlayWindow = null;
    });

    return this.overlayWindow;
  }

  /**
   * Continuous cursor hit testing loop for flawless click-through on Windows & macOS.
   */
  private startCursorHitTesting(): void {
    this.stopCursorHitTesting();

    this.hitTestTimer = setInterval(() => {
      if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
      if (!this.overlayWindow.isVisible()) return;

      // If user is actively dragging charm or interacting with open menu/drawer, keep mouse enabled
      if (this.isDragging || this.hasActiveUI) {
        this.setIgnoreMouseEvents(false);
        return;
      }

      const settings = this.store.getSettings();
      // If click-through is explicitly disabled in user settings, keep mouse events enabled
      if (!settings.general.clickThroughEnabled) {
        this.setIgnoreMouseEvents(false);
        return;
      }

      const cursor = screen.getCursorScreenPoint();
      const bounds = this.overlayWindow.getBounds();

      // Check if cursor is on this display
      if (
        cursor.x < bounds.x ||
        cursor.x > bounds.x + bounds.width ||
        cursor.y < bounds.y ||
        cursor.y > bounds.y + bounds.height
      ) {
        this.setIgnoreMouseEvents(true);
        return;
      }

      const relX = cursor.x - bounds.x;
      const relY = cursor.y - bounds.y;

      let isInsideInteractive = false;
      for (const rect of this.interactiveBounds) {
        if (
          relX >= rect.x &&
          relX <= rect.x + rect.width &&
          relY >= rect.y &&
          relY <= rect.y + rect.height
        ) {
          isInsideInteractive = true;
          break;
        }
      }

      // If mouse is inside any interactive zone (charm, rope, anchor, popup), enable mouse events.
      // Otherwise, pass through seamlessly to the OS!
      this.setIgnoreMouseEvents(!isInsideInteractive);
    }, 25); // 40 Hz check with negligible CPU usage
  }

  private stopCursorHitTesting(): void {
    if (this.hitTestTimer) {
      clearInterval(this.hitTestTimer);
      this.hitTestTimer = null;
    }
  }

  public setInteractiveBounds(bounds: InteractiveRect[]): void {
    this.interactiveBounds = bounds;
  }

  public setDragState(isDragging: boolean): void {
    this.isDragging = isDragging;
    if (isDragging) {
      this.setIgnoreMouseEvents(false);
    }
  }

  public setActiveUI(hasActiveUI: boolean): void {
    this.hasActiveUI = hasActiveUI;
    if (hasActiveUI) {
      this.setIgnoreMouseEvents(false);
    }
  }

  /**
   * Opens the standalone Settings window.
   */
  public openSettingsWindow(): BrowserWindow {
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
      this.settingsWindow.show();
      this.settingsWindow.focus();
      return this.settingsWindow;
    }

    const iconPath = getAppIconPath();

    this.settingsWindow = new BrowserWindow({
      width: 920,
      height: 660,
      minWidth: 760,
      minHeight: 520,
      title: 'DeskDangle Settings',
      ...(iconPath ? { icon: iconPath } : {}),
      show: false,
      frame: true,
      transparent: false,
      backgroundColor: '#1e1e1e',
      resizable: true,
      minimizable: true,
      maximizable: true,
      skipTaskbar: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
        backgroundThrottling: false,
      },
    });

    this.settingsWindow.once('ready-to-show', () => {
      if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
        this.settingsWindow.show();
        this.settingsWindow.focus();
      }
    });

    // Load with #settings route
    if (process.env.VITE_DEV_SERVER_URL) {
      this.settingsWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#settings`);
    } else {
      this.settingsWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
        hash: 'settings',
      });
    }


    this.settingsWindow.setMenu(null);

    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null;
    });

    return this.settingsWindow;
  }

  public getOverlayWindow(): BrowserWindow | null {
    return this.overlayWindow;
  }

  public getSettingsWindow(): BrowserWindow | null {
    return this.settingsWindow;
  }

  public repositionOverlay(): void {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;

    const settings = this.store.getSettings();
    const display = this.displayManager.getTargetDisplay(
      settings.general.displayMode,
      settings.general.selectedDisplayId
    );

    const bounds = this.displayManager.getOverlayBounds(display);
    this.overlayWindow.setBounds(bounds);
  }

  public setIgnoreMouseEvents(ignore: boolean, forward = true): void {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
    if (this.isMouseIgnored === ignore) return;

    this.isMouseIgnored = ignore;
    try {
      if (ignore) {
        this.overlayWindow.setIgnoreMouseEvents(true, { forward });
      } else {
        this.overlayWindow.setIgnoreMouseEvents(false);
      }
    } catch {
      // Ignored if window closing
    }
  }

  public toggleVisibility(): boolean {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return false;
    if (this.overlayWindow.isVisible()) {
      this.overlayWindow.hide();
      return false;
    } else {
      this.overlayWindow.show();
      return true;
    }
  }
}

