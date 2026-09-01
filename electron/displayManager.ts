import { screen, Display } from 'electron';

export interface DisplayInfo {
  id: number;
  label: string;
  bounds: { x: number; y: number; width: number; height: number };
  isPrimary: boolean;
  scaleFactor: number;
}

export class DisplayManager {
  public getAllDisplays(): DisplayInfo[] {
    const primary = screen.getPrimaryDisplay();
    return screen.getAllDisplays().map((d, index) => ({
      id: d.id,
      label: `Display ${index + 1} (${d.bounds.width}×${d.bounds.height})${d.id === primary.id ? ' - Primary' : ''}`,
      bounds: d.bounds,
      isPrimary: d.id === primary.id,
      scaleFactor: d.scaleFactor,
    }));
  }

  public getTargetDisplay(mode: 'primary' | 'selected' | 'all' = 'primary', selectedId?: number): Display {
    const displays = screen.getAllDisplays();
    if (mode === 'selected' && selectedId) {
      const found = displays.find((d) => d.id === selectedId);
      if (found) return found;
    }
    return screen.getPrimaryDisplay();
  }

  public getOverlayBounds(display: Display): { x: number; y: number; width: number; height: number } {
    return {
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height,
    };
  }
}
