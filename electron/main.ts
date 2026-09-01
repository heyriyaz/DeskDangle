import { app, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron';
import { WindowManager } from './windowManager';
import { SettingsStore } from './store';
import { TrayManager } from './trayManager';
import { DisplayManager } from './displayManager';
import { ImageValidator } from './imageValidator';

// Set Windows AppUserModelId for taskbar grouping, shortcuts, and notifications
app.setAppUserModelId('com.deskdangle.desktop');

// Prevent multiple instances
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (windowManager) {
      const overlay = windowManager.getOverlayWindow();
      if (overlay && !overlay.isDestroyed()) {
        overlay.show();
      }
      windowManager.openSettingsWindow();
    }
  });
}

// Prevent background throttling & occlusion lag for silky smooth desktop physics
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

const store = new SettingsStore();
const displayManager = new DisplayManager();
let windowManager: WindowManager | null = null;
let trayManager: TrayManager | null = null;

function broadcastSettings(settings: unknown) {
  const windows = BrowserWindow.getAllWindows();
  for (const win of windows) {
    if (!win.isDestroyed()) {
      win.webContents.send('settings-updated', settings);
    }
  }
}

function registerConfiguredShortcuts(wm: WindowManager) {
  globalShortcut.unregisterAll();
  const settings = store.getSettings();

  // If shortcuts are not enabled, do not register system hotkeys
  if (!settings.shortcuts?.enabled) {
    return;
  }

  // 1. Show/Hide Shortcut
  if (settings.shortcuts.toggleVisibility) {
    try {
      globalShortcut.register(settings.shortcuts.toggleVisibility, () => {
        const isVisible = wm.toggleVisibility();
        const win = wm.getOverlayWindow();
        if (win && !win.isDestroyed()) {
          win.webContents.send('toggle-visibility', isVisible);
        }
        trayManager?.updateContextMenu(isVisible, false);
      });
    } catch (err) {
      console.warn('[DeskDangle] Failed to register toggleVisibility shortcut:', err);
    }
  }

  // 2. Pause Physics Shortcut
  if (settings.shortcuts.togglePhysics) {
    try {
      globalShortcut.register(settings.shortcuts.togglePhysics, () => {
        const win = wm.getOverlayWindow();
        if (win && !win.isDestroyed()) {
          win.webContents.send('toggle-physics');
        }
      });
    } catch (err) {
      console.warn('[DeskDangle] Failed to register togglePhysics shortcut:', err);
    }
  }

  // 3. Random Charm Shortcut
  if (settings.shortcuts.randomCharm) {
    try {
      globalShortcut.register(settings.shortcuts.randomCharm, () => {
        const win = wm.getOverlayWindow();
        if (win && !win.isDestroyed()) {
          win.webContents.send('random-charm');
        }
      });
    } catch (err) {
      console.warn('[DeskDangle] Failed to register randomCharm shortcut:', err);
    }
  }

  // 4. Open Settings Shortcut
  if (settings.shortcuts.openSettings) {
    try {
      globalShortcut.register(settings.shortcuts.openSettings, () => {
        wm.openSettingsWindow();
      });
    } catch (err) {
      console.warn('[DeskDangle] Failed to register openSettings shortcut:', err);
    }
  }
}

function setupIPC(wm: WindowManager) {
  ipcMain.handle('get-settings', () => {
    return store.getSettings();
  });

  ipcMain.handle('save-settings', (_event, newSettings) => {
    if (!newSettings || typeof newSettings !== 'object') {
      return store.getSettings();
    }

    const saved = store.saveSettings(newSettings);
    broadcastSettings(saved);

    // If display or shortcut settings changed, update window and shortcuts
    if (newSettings.general?.displayMode || newSettings.general?.selectedDisplayId) {
      wm.repositionOverlay();
    }
    if (newSettings.shortcuts) {
      registerConfiguredShortcuts(wm);
    }
    if (newSettings.general?.launchAtStartup !== undefined) {
      try {
        app.setLoginItemSettings({
          openAtLogin: Boolean(newSettings.general.launchAtStartup),
        });
      } catch (err) {
        console.warn('[DeskDangle] Failed to set login item settings:', err);
      }
    }

    return saved;
  });

  ipcMain.handle('reset-settings', () => {
    const reset = store.resetSettings();
    broadcastSettings(reset);
    wm.repositionOverlay();
    registerConfiguredShortcuts(wm);
    return reset;
  });

  ipcMain.handle('delete-custom-charms', () => {
    ImageValidator.deleteAllCustomCharmImages();
    const updated = store.deleteCustomCharms();
    broadcastSettings(updated);
    return updated;
  });

  ipcMain.handle('upload-custom-image', (_event, rawImageDataUrl: string, charmId: string) => {
    return ImageValidator.validateAndSaveImage(rawImageDataUrl, charmId);
  });

  ipcMain.handle('get-displays', () => {
    return displayManager.getAllDisplays();
  });

  ipcMain.on('open-settings', () => {
    wm.openSettingsWindow();
  });

  ipcMain.on('set-ignore-mouse-events', (_event, ignore: boolean, forward = true) => {
    wm.setIgnoreMouseEvents(ignore, forward);
  });

  ipcMain.on('update-interactive-bounds', (_event, bounds) => {
    if (Array.isArray(bounds)) {
      wm.setInteractiveBounds(bounds);
    }
  });

  ipcMain.on('set-drag-state', (_event, isDragging: boolean) => {
    wm.setDragState(Boolean(isDragging));
  });

  ipcMain.on('set-active-ui', (_event, hasActiveUI: boolean) => {
    wm.setActiveUI(Boolean(hasActiveUI));
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });
}

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
  console.error('[DeskDangle Main] Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[DeskDangle Main] Unhandled rejection:', reason);
});

app.whenReady().then(() => {
  windowManager = new WindowManager(store, displayManager);
  windowManager.createOverlayWindow();

  setupIPC(windowManager);

  // Always open settings window on app launch so user has instant visual interface
  windowManager.openSettingsWindow();


  // Initialize System Tray
  trayManager = new TrayManager(store, {
    onToggleVisibility: () => {
      const isVisible = windowManager!.toggleVisibility();
      const win = windowManager!.getOverlayWindow();
      if (win && !win.isDestroyed()) {
        win.webContents.send('toggle-visibility', isVisible);
      }
      trayManager?.updateContextMenu(isVisible, false);
    },
    onTogglePhysics: () => {
      const win = windowManager!.getOverlayWindow();
      if (win && !win.isDestroyed()) {
        win.webContents.send('toggle-physics');
      }
    },
    onRandomCharm: () => {
      const win = windowManager!.getOverlayWindow();
      if (win && !win.isDestroyed()) {
        win.webContents.send('random-charm');
      }
    },
    onOpenSettings: () => {
      windowManager!.openSettingsWindow();
    },
  });

  registerConfiguredShortcuts(windowManager);

  // Monitor Display changes (plugging / unplugging monitors)
  screen.on('display-metrics-changed', () => {
    windowManager?.repositionOverlay();
  });
  screen.on('display-added', () => {
    windowManager?.repositionOverlay();
  });
  screen.on('display-removed', () => {
    windowManager?.repositionOverlay();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && windowManager) {
      windowManager.createOverlayWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  trayManager?.destroy();
});

app.on('window-all-closed', () => {
  // On Windows, keep alive in tray if overlay is open, otherwise quit
  if (BrowserWindow.getAllWindows().length === 0) {
    app.quit();
  }
});


