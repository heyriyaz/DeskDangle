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


declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}


