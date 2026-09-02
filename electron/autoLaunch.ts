import { app } from 'electron';
import { exec } from 'child_process';

/**
 * Configure Windows startup behavior.
 * In development mode (unpacked), this is disabled to prevent registering
 * the raw `node_modules/electron/dist/electron.exe` into Windows Startup.
 *
 * In packaged mode, this registers DeskDangle to launch automatically
 * with the `--autostart` flag so it opens quietly to the desktop/tray.
 */
export function setAutoLaunch(enabled: boolean): void {
  if (!app.isPackaged) {
    console.log('[DeskDangle] Auto-launch ignored in development mode.');
    return;
  }

  try {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: process.execPath,
      args: ['--autostart'],
    });
  } catch (err) {
    console.warn('[DeskDangle] Failed to configure login item settings:', err);
  }
}

/**
 * Cleans up any leftover development Electron startup registry entries
 * (e.g. from previously testing auto-launch in unpacked dev mode).
 */
export function cleanupDevStartupRegistry(): void {
  if (process.platform !== 'win32') return;

  // Silently remove the development electron.app.Electron registry key if it exists
  const cmd = 'reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "electron.app.Electron" /f';
  exec(cmd, () => {
    // Silently ignore if the key is already absent
  });
}
