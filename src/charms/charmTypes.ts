// Dangle Type Definitions

export type CharmCategory = 'original' | 'cute' | 'celestial' | 'objects' | 'nature' | 'companions' | 'emoji' | 'custom';

export type CharmRenderType = 'vector' | 'emoji' | 'image';

export interface EmojiCharmData {
  emoji: string;
  fontSize?: number;
  rotation?: number;
  bgGlowColor?: string;
}

export interface Charm {
  id: string;
  name: string;
  category: CharmCategory;
  description?: string;
  scale: number; // 0.6 to 1.6 (default: 1.0)
  anchorOffset: number; // distance from center to top eyelet
  renderType: CharmRenderType;
  framing?: 'contour' | 'acrylic' | 'badge' | 'sticker';
  emojiData?: EmojiCharmData;
  imageDataUrl?: string;
  drawVector?: (
    ctx: CanvasRenderingContext2D,
    radius: number,
    isHovered: boolean,
    isDragging: boolean
  ) => void;
}

export type RopeStyle = 'classic' | 'rope' | 'chain' | 'thread' | 'neon';

export interface RopeSettings {
  style: RopeStyle;
  lengthSegments: number; // 4 to 12
  segmentLength: number; // 12 to 24
  thickness: number; // 1 to 6
  color: string; // Hex or CSS color
  opacity: number; // 0.2 to 1.0
}

export type PhysicsPreset = 'classic' | 'bouncy' | 'heavy' | 'space' | 'custom';

export interface PhysicsSettings {
  gravity: number; // 0.2 to 2.5 (default 1.0)
  damping: number; // 0.001 to 0.025 (default 0.007)
  swingIntensity: number; // 0.2 to 2.5 (multiplier for release impulse)
  windStrength: number; // 0.0 to 2.0 (idle micro-motion scale)
  idleEnabled: boolean;
  interactionStiffness: number; // 0.1 to 0.8
  restitution: number; // 0.0 to 0.8
  airDisplacement: boolean; // Reacts to fast mouse movement breeze
  preset?: PhysicsPreset;
}

export interface ShortcutSettings {
  enabled: boolean;
  toggleVisibility: string; // e.g. 'Alt+Shift+D'
  togglePhysics: string; // e.g. 'Alt+Shift+P'
  randomCharm: string; // e.g. 'Alt+Shift+R'
  openSettings: string; // e.g. 'Alt+Shift+S'
}

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
  wallImpactSounds?: boolean;
}

export interface GeneralSettings {
  launchAtStartup: boolean;
  startHidden: boolean;
  displayMode: 'primary' | 'selected' | 'all';
  selectedDisplayId?: number;
  clickThroughEnabled: boolean;
  reduceMotion: boolean;
  onboardingCompleted: boolean;
  doubleClickAction: 'delight-burst' | 'quick-drawer' | 'settings' | 'random';
  anchorXPercent?: number; // 0.05 to 0.95 (default 0.5 for center)
  ecoMode: boolean; // Low-power battery optimization mode
  particlesEnabled: boolean; // Interactive delight particles on double-tap/flick
  theme?: 'system' | 'dark' | 'light';
}

export interface DangleCharmPack {
  formatVersion: number;
  exportedAt: string;
  appName: string;
  charms: Charm[];
  rope?: Partial<RopeSettings>;
  physics?: Partial<PhysicsSettings>;
}

export interface DangleSettings {
  selectedCharmId: string;
  charmScale: number;
  rope: RopeSettings;
  physics: PhysicsSettings;
  sound: SoundSettings;
  shortcuts: ShortcutSettings;
  general: GeneralSettings;
  customCharms: Charm[];
  customEmojis: Charm[];
}
