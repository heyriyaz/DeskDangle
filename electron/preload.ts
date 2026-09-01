import { contextBridge, ipcRenderer } from 'electron';
import { DangleSettings } from '../src/charms/charmTypes';
import { DisplayInfo } from './displayManager';

export interface InteractiveRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElectronAPI {
  getSettings: () => Promise<DangleSettings>;
  saveSettings: (settings: Partial<DangleSettings>) => Promise<DangleSettings>;
  resetSettings: () => Promise<DangleSettings>;
  deleteCustomCharms: () => Promise<DangleSettings>;
  uploadCustomImage: (
    dataUrl: string,
    charmId: string
  ) => Promise<{ valid: boolean; error?: string; sanitizedDataUrl?: string }>;
  onSettingsUpdated: (callback: (settings: DangleSettings) => void) => () => void;
  openSettings: () => void;
  getDisplays: () => Promise<DisplayInfo[]>;
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) => void;
  updateInteractiveBounds: (bounds: InteractiveRect[]) => void;
  setDragState: (isDragging: boolean) => void;
  setActiveUI: (hasActiveUI: boolean) => void;
  onTogglePhysics: (callback: () => void) => () => void;
  onToggleVisibility: (callback: (visible: boolean) => void) => () => void;
  onToggleDebug: (callback: () => void) => () => void;
  onRandomCharm: (callback: () => void) => () => void;
  quitApp: () => void;
  isElectron: boolean;
}

const electronAPI: ElectronAPI = {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Partial<DangleSettings>) => ipcRenderer.invoke('save-settings', settings),
  resetSettings: () => ipcRenderer.invoke('reset-settings'),
  deleteCustomCharms: () => ipcRenderer.invoke('delete-custom-charms'),
  uploadCustomImage: (dataUrl: string, charmId: string) =>
    ipcRenderer.invoke('upload-custom-image', dataUrl, charmId),
  onSettingsUpdated: (callback: (settings: DangleSettings) => void) => {
    const subscription = (_event: unknown, settings: DangleSettings) => callback(settings);
    ipcRenderer.on('settings-updated', subscription);
    return () => {
      ipcRenderer.removeListener('settings-updated', subscription);
    };
  },
  openSettings: () => {
    ipcRenderer.send('open-settings');
  },
  getDisplays: () => ipcRenderer.invoke('get-displays'),
  setIgnoreMouseEvents: (ignore: boolean, forward = true) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, forward);
  },
  updateInteractiveBounds: (bounds: InteractiveRect[]) => {
    ipcRenderer.send('update-interactive-bounds', bounds);
  },
  setDragState: (isDragging: boolean) => {
    ipcRenderer.send('set-drag-state', isDragging);
  },
  setActiveUI: (hasActiveUI: boolean) => {
    ipcRenderer.send('set-active-ui', hasActiveUI);
  },
  onTogglePhysics: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('toggle-physics', subscription);
    return () => {
      ipcRenderer.removeListener('toggle-physics', subscription);
    };
  },
  onToggleVisibility: (callback: (visible: boolean) => void) => {
    const subscription = (_event: unknown, visible: boolean) => callback(visible);
    ipcRenderer.on('toggle-visibility', subscription);
    return () => {
      ipcRenderer.removeListener('toggle-visibility', subscription);
    };
  },
  onToggleDebug: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('toggle-debug', subscription);
    return () => {
      ipcRenderer.removeListener('toggle-debug', subscription);
    };
  },
  onRandomCharm: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('random-charm', subscription);
    return () => {
      ipcRenderer.removeListener('random-charm', subscription);
    };
  },
  quitApp: () => {
    ipcRenderer.send('quit-app');
  },
  isElectron: true,
};


contextBridge.exposeInMainWorld('electronAPI', electronAPI);

