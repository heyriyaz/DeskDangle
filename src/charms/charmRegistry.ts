import { Charm } from './charmTypes';
import { drawEyelet, drawCustomCharmFixture } from './vectorCharms';
import { clientSettings } from '../store/settingsStore';

import evilEyeImg from '../assets/charms/evil-eye.png';
import hamsaHandImg from '../assets/charms/hamsa-hand.png';
import nimbuMirchiImg from '../assets/charms/nimbu-mirchi.png';
import cherryImg from '../assets/charms/cherry.png';
import glassHeartImg from '../assets/charms/glass-heart.png';
import fluffyKittenImg from '../assets/charms/fluffy-kitten.png';
import pinkCassetteImg from '../assets/charms/pink-cassette.png';
import bananaCatImg from '../assets/charms/banana-cat.png';
import chonkyCatImg from '../assets/charms/chonky-cat.png';
import orangeCatImg from '../assets/charms/orange-cat.png';

// New Cute & Hero Charms
import babyGrootImg from '../assets/charms/baby-groot.png';
import babyPandaImg from '../assets/charms/baby-panda.png';
import batmanImg from '../assets/charms/batman.png';
import captainAmericaImg from '../assets/charms/captain-america.png';
import capybaraImg from '../assets/charms/capybara.png';
import deadpoolImg from '../assets/charms/deadpool.png';
import ironHeroImg from '../assets/charms/iron-hero.png';
import jokerImg from '../assets/charms/joker.png';
import shibaInuImg from '../assets/charms/shiba-inu.png';
import spidermanImg from '../assets/charms/spiderman.png';
import wolverineImg from '../assets/charms/wolverine.png';

export const BUILTIN_CHARMS: Charm[] = [
  {
    id: 'evil-eye',
    name: 'Evil Eye',
    category: 'objects',
    description: 'Photorealistic Turkish Nazar Boncuk cobalt blue glass talisman with stacked ceramic beads.',
    scale: 1.25,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: evilEyeImg,
  },
  {
    id: 'hamsa-hand',
    name: 'Hamsa Hand',
    category: 'objects',
    description: 'Photorealistic ornate gold filigree Hamsa Hand with royal blue enamel and sapphire beads.',
    scale: 1.25,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: hamsaHandImg,
  },
  {
    id: 'nimbu-mirchi',
    name: 'Nimbu Mirchi',
    category: 'objects',
    description: 'Authentic Indian Nazar Battu talisman with fresh green chilies, glossy lemon, and charcoal bead.',
    scale: 1.35,
    anchorOffset: 54,
    renderType: 'image',
    imageDataUrl: nimbuMirchiImg,
  },
  {
    id: 'cherry',
    name: 'Ruby Cherries',
    category: 'nature',
    description: 'Ultra-glossy twin cherries with crystal dew drops, fresh green leaf, and golden hanging ring.',
    scale: 1.25,
    anchorOffset: 48,
    renderType: 'image',
    imageDataUrl: cherryImg,
  },
  {
    id: 'glass-heart',
    name: 'Pink Glass Heart',
    category: 'objects',
    description: 'Luminous translucent ruby-pink blown glass heart with specular light refractions and glass eyelet.',
    scale: 1.25,
    anchorOffset: 48,
    renderType: 'image',
    imageDataUrl: glassHeartImg,
  },
  {
    id: 'fluffy-kitten',
    name: 'Fluffy Kitten',
    category: 'cute',
    description: 'Ultra-adorable fluffy silver tabby kitten with glassy emerald eyes, heart collar, and golden eyelet.',
    scale: 1.35,
    anchorOffset: 56,
    renderType: 'image',
    imageDataUrl: fluffyKittenImg,
  },
  {
    id: 'pink-cassette',
    name: 'Retro Pink Cassette',
    category: 'objects',
    description: 'Nostalgic transparent pink acrylic cassette tape with metallic spool details and gold eyelet.',
    scale: 1.3,
    anchorOffset: 46,
    renderType: 'image',
    imageDataUrl: pinkCassetteImg,
  },
  {
    id: 'banana-cat',
    name: 'Banana Cat',
    category: 'cute',
    description: 'The iconic sad crying kitten in a yellow banana suit with gold eyelet ring.',
    scale: 1.3,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: bananaCatImg,
  },
  {
    id: 'chonky-cat',
    name: 'Chonky Loaf Cat',
    category: 'cute',
    description: 'The famously round spherical grey tabby loaf cat with golden hanging ring.',
    scale: 1.25,
    anchorOffset: 46,
    renderType: 'image',
    imageDataUrl: chonkyCatImg,
  },
  {
    id: 'orange-cat',
    name: 'Orange Cat',
    category: 'cute',
    description: 'The legendary skeptical orange tabby cat face with golden hanging eyelet.',
    scale: 1.25,
    anchorOffset: 46,
    renderType: 'image',
    imageDataUrl: orangeCatImg,
  },
  // --- Cute Pack ---
  {
    id: 'capybara',
    name: 'Capybara',
    category: 'cute',
    description: 'Peaceful chubby capybara floating with a tiny ripe yuzu orange on its head.',
    scale: 1.30,
    anchorOffset: 50,
    renderType: 'image',
    imageDataUrl: capybaraImg,
  },
  {
    id: 'shiba-inu',
    name: 'Shiba Inu',
    category: 'cute',
    description: 'Joyful smiling Shiba Inu doge puppy with red bandana and tiny golden bell.',
    scale: 1.30,
    anchorOffset: 50,
    renderType: 'image',
    imageDataUrl: shibaInuImg,
  },
  {
    id: 'baby-panda',
    name: 'Baby Panda',
    category: 'cute',
    description: 'Chubby baby giant panda holding a fresh green bamboo stalk with tiny paws.',
    scale: 1.30,
    anchorOffset: 48,
    renderType: 'image',
    imageDataUrl: babyPandaImg,
  },
  {
    id: 'baby-groot',
    name: 'Baby Groot',
    category: 'cute',
    description: 'Cute little tree sapling guardian raising hands cheerfully with sprouting green leaves.',
    scale: 1.30,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: babyGrootImg,
  },
  // --- Heroes Pack (Marvel & DC) ---
  {
    id: 'spiderman',
    name: 'Spider-Man',
    category: 'heroes',
    description: 'Iconic web-slinger in an upside-down hanging pose with classic red & blue suit.',
    scale: 1.30,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: spidermanImg,
  },
  {
    id: 'batman',
    name: 'Batman',
    category: 'heroes',
    description: 'The Dark Knight floating in black cowl with bat ears, bat symbol, and utility belt.',
    scale: 1.35,
    anchorOffset: 54,
    renderType: 'image',
    imageDataUrl: batmanImg,
  },
  {
    id: 'joker',
    name: 'The Joker',
    category: 'heroes',
    description: 'Mischievous Clown Prince of Crime in purple suit with green hair holding a playing card.',
    scale: 1.30,
    anchorOffset: 54,
    renderType: 'image',
    imageDataUrl: jokerImg,
  },
  {
    id: 'iron-hero',
    name: 'Iron Hero',
    category: 'heroes',
    description: 'Chibi crimson and gold armored superhero with glowing cyan arc reactor and eyes.',
    scale: 1.30,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: ironHeroImg,
  },
  {
    id: 'deadpool',
    name: 'Deadpool',
    category: 'heroes',
    description: 'Playful masked mercenary with crossed swords giving his signature peace sign.',
    scale: 1.30,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: deadpoolImg,
  },
  {
    id: 'captain-america',
    name: 'Captain America',
    category: 'heroes',
    description: 'Patriotic superhero in metallic blue suit with winged cowl and vibranium star shield.',
    scale: 1.30,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: captainAmericaImg,
  },
  {
    id: 'wolverine',
    name: 'Wolverine',
    category: 'heroes',
    description: 'Fierce mutant hero in yellow and blue suit with extended shiny adamantium claws.',
    scale: 1.35,
    anchorOffset: 54,
    renderType: 'image',
    imageDataUrl: wolverineImg,
  },
];





export interface BuiltinCharmLayout {
  topFrac: number;
  xOffsetFrac: number;
  aspect: number;
  anchorOffset: number;
  scaleMul?: number;
}

export const BUILTIN_CHARM_CONFIG: Record<string, BuiltinCharmLayout> = {
  // Built-in Talisman & Object Charms
  'cherry':          { topFrac: 0.0449, xOffsetFrac: -0.0297, aspect: 0.9365, anchorOffset: 48, scaleMul: 1.0 },
  'glass-heart':     { topFrac: 0.0553, xOffsetFrac:  0.0000, aspect: 1.0678, anchorOffset: 48, scaleMul: 1.0 },
  'hamsa-hand':      { topFrac: 0.0820, xOffsetFrac: -0.0254, aspect: 1.0000, anchorOffset: 52, scaleMul: 1.0 },
  'pink-cassette':   { topFrac: 0.0733, xOffsetFrac: -0.0166, aspect: 1.5015, anchorOffset: 46, scaleMul: 1.05 },
  'evil-eye':        { topFrac: 0.0811, xOffsetFrac:  0.0000, aspect: 1.0000, anchorOffset: 52, scaleMul: 1.0 },
  'nimbu-mirchi':    { topFrac: 0.0195, xOffsetFrac: -0.0083, aspect: 1.0000, anchorOffset: 52, scaleMul: 1.10 },
  'fluffy-kitten':   { topFrac: 0.0500, xOffsetFrac:  0.0000, aspect: 0.9650, anchorOffset: 56, scaleMul: 1.0 },
  'banana-cat':      { topFrac: 0.0021, xOffsetFrac:  0.0000, aspect: 0.7557, anchorOffset: 52, scaleMul: 1.0 },
  'chonky-cat':      { topFrac: 0.0750, xOffsetFrac:  0.0000, aspect: 1.1644, anchorOffset: 46, scaleMul: 1.0 },
  'orange-cat':      { topFrac: 0.1794, xOffsetFrac:  0.0000, aspect: 0.9606, anchorOffset: 46, scaleMul: 1.0 },

  // Cute Pack
  'baby-groot':      { topFrac: 0.0605, xOffsetFrac:  0.0000, aspect: 1.0000, anchorOffset: 52, scaleMul: 1.0 },
  'baby-panda':      { topFrac: 0.1400, xOffsetFrac:  0.0000, aspect: 1.0000, anchorOffset: 48, scaleMul: 1.0 },
  'capybara':        { topFrac: 0.0996, xOffsetFrac: -0.0205, aspect: 1.0000, anchorOffset: 50, scaleMul: 1.0 },
  'shiba-inu':       { topFrac: 0.1348, xOffsetFrac:  0.0000, aspect: 1.0000, anchorOffset: 50, scaleMul: 1.0 },

  // Heroes Pack
  'batman':          { topFrac: 0.1465, xOffsetFrac: -0.0146, aspect: 1.0000, anchorOffset: 54, scaleMul: 1.05 },
  'captain-america': { topFrac: 0.0762, xOffsetFrac: -0.0088, aspect: 1.0000, anchorOffset: 52, scaleMul: 1.0 },
  'deadpool':        { topFrac: 0.0771, xOffsetFrac: -0.0098, aspect: 1.0000, anchorOffset: 52, scaleMul: 1.0 },
  'iron-hero':       { topFrac: 0.0889, xOffsetFrac: -0.0078, aspect: 1.0000, anchorOffset: 52, scaleMul: 1.0 },
  'joker':           { topFrac: 0.0625, xOffsetFrac: -0.0078, aspect: 1.0000, anchorOffset: 54, scaleMul: 1.0 },
  'spiderman':       { topFrac: 0.1035, xOffsetFrac:  0.0000, aspect: 1.0000, anchorOffset: 52, scaleMul: 1.0 },
  'wolverine':       { topFrac: 0.0898, xOffsetFrac: -0.0059, aspect: 1.0000, anchorOffset: 54, scaleMul: 1.05 },
};

// Image cache for high-resolution charm assets
const imageElementCache = new Map<string, HTMLImageElement>();

export class CharmRegistry {
  public static getAllCharms(): Charm[] {
    const settings = clientSettings.getSettings();
    return [
      ...BUILTIN_CHARMS,
      ...(settings.customCharms || []),
      ...(settings.customEmojis || []),
    ];
  }

  public static getCharmById(id: string): Charm {
    const all = this.getAllCharms();
    return all.find((c) => c.id === id) || BUILTIN_CHARMS[0];
  }

  public static getRandomCharm(currentId?: string): Charm {
    const all = this.getAllCharms();
    const available = all.filter((c) => c.id !== currentId);
    if (available.length === 0) return all[0];
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  public static preloadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      let img = imageElementCache.get(src);
      if (img && img.complete && img.naturalWidth > 0) {
        resolve(img);
        return;
      }
      img = new Image();
      img.onload = () => resolve(img!);
      img.onerror = () => resolve(img!);
      img.src = src;
      imageElementCache.set(src, img);
    });
  }

  public static getCharmTopOffset(charm: Charm, globalScale = 1.0): number {
    const scale = (charm.scale || 1.0) * globalScale;
    const info = BUILTIN_CHARM_CONFIG[charm.id];
    if (info) {
      return (charm.anchorOffset ?? info.anchorOffset) * scale * 0.9;
    }
    const baseOffset = charm.anchorOffset ?? 42;
    return baseOffset * scale * 0.9;
  }

  public static renderCharm(
    ctx: CanvasRenderingContext2D,
    charm: Charm,
    x: number,
    y: number,
    angle: number,
    isHovered: boolean,
    isDragging: boolean,
    globalScale = 1.0
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const baseRadius = 34;
    const finalScale = (charm.scale || 1.0) * globalScale;
    ctx.scale(finalScale, finalScale);

    // Realistic Soft Drop Shadow
    ctx.save();
    ctx.shadowColor = isDragging
      ? 'rgba(0, 0, 0, 0.45)'
      : isHovered
      ? 'rgba(0, 0, 0, 0.35)'
      : 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = isDragging ? 16 : 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;

    // Render Type
    if (charm.renderType === 'vector' && charm.drawVector) {
      charm.drawVector(ctx, baseRadius, isHovered, isDragging);
    } else if (charm.renderType === 'emoji' && charm.emojiData) {
      this.renderEmojiCharm(ctx, charm, baseRadius, isHovered);
    } else if (charm.renderType === 'image' && charm.imageDataUrl) {
      this.renderImageCharm(ctx, charm, baseRadius);
    }

    ctx.restore();
    ctx.restore();
  }

  private static renderEmojiCharm(
    ctx: CanvasRenderingContext2D,
    charm: Charm,
    radius: number,
    isHovered: boolean
  ): void {
    const emojiData = charm.emojiData!;
    const framing = charm.framing || 'badge';
    const fontSize = emojiData.fontSize || 36;

    if (framing === 'badge') {
      // 1. Sleek Glass Medallion with Gold Rim & Metallic Eyelet
      drawEyelet(ctx, radius);

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      const bgGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 3, 0, 0, radius);
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(0.7, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Gold metal rim
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = isHovered ? '#fef08a' : 'rgba(234, 179, 8, 0.85)';
      ctx.stroke();

      // Inner subtle glow ring
      ctx.beginPath();
      ctx.arc(0, 0, radius - 3, 0, Math.PI * 2);
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();
    } else if (framing === 'acrylic') {
      // 2. Modern Transparent Acrylic Keychain Capsule
      const pad = 4;
      const capsuleW = radius * 2 + pad * 2;
      const capsuleH = radius * 2 + pad * 2;
      drawEyelet(ctx, radius + pad);

      ctx.beginPath();
      ctx.roundRect(-capsuleW / 2, -capsuleH / 2, capsuleW, capsuleH, 16);
      ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.12)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();
    } else {
      // 3. Pure Floating Emoji with Top Hanging Loop
      drawEyelet(ctx, Math.max(16, fontSize * 0.48));
    }

    ctx.save();
    if (emojiData.rotation) {
      ctx.rotate((emojiData.rotation * Math.PI) / 180);
    }

    ctx.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emojiData.emoji, 0, framing === 'contour' ? 2 : 2);
    ctx.restore();
  }


  private static renderImageCharm(
    ctx: CanvasRenderingContext2D,
    charm: Charm,
    radius: number
  ): void {
    const src = charm.imageDataUrl!;
    let img = imageElementCache.get(src);

    if (!img) {
      img = new Image();
      img.src = src;
      imageElementCache.set(src, img);
    }


    if (!img.complete || img.naturalWidth === 0) {
      return;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Built-in Photorealistic & Character Charms (Unified Pixel-Perfect Layout)
    const charmInfo = BUILTIN_CHARM_CONFIG[charm.id];
    if (charmInfo) {
      const scaleMul = charmInfo.scaleMul || 1.0;
      const drawH = radius * 3.4 * scaleMul;
      const drawW = drawH * charmInfo.aspect;
      const topOffset = (charm.anchorOffset || charmInfo.anchorOffset) * 0.9;

      const xOffset = (charmInfo.xOffsetFrac || 0) * drawW;
      const drawX = -drawW / 2 - xOffset;
      const drawY = -topOffset - (charmInfo.topFrac * drawH);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
      return;
    }






    // 2. Custom Uploaded Image Charms (Aspect-Preserving & Perfectly Balanced)
    const naturalW = img.naturalWidth || 100;
    const naturalH = img.naturalHeight || 100;
    const aspect = naturalW / naturalH;

    const topOffset = (charm.anchorOffset || 42) * 0.9;
    const framing = charm.framing || 'contour';

    // Standard baseline dimension matching built-in charms
    let drawH = radius * 2.5;
    let drawW = drawH * aspect;

    if (drawW > radius * 3.2) {
      drawW = radius * 3.2;
      drawH = drawW / aspect;
    }

    if (framing === 'badge') {
      const badgeR = Math.max(radius * 1.3, Math.max(drawW, drawH) * 0.52);
      // Golden eyelet ring centered at top connection point (0, -topOffset)
      drawEyelet(ctx, topOffset - 3);

      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#eab308';
      ctx.stroke();

      ctx.clip();
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
      ctx.restore();
      return;
    }

    if (framing === 'sticker') {
      const pad = 8;
      const cardW = drawW + pad * 2;
      const cardH = drawH + pad * 2;
      const cardX = -cardW / 2;
      const cardY = -topOffset + 3; // Top edge meets clasp clamp

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();
      ctx.restore();

      // Top metallic clasp and jump ring clamping to the sticker top
      drawCustomCharmFixture(ctx, cardY);

      ctx.drawImage(img, cardX + pad, cardY + pad, drawW, drawH);
      ctx.restore();
      return;
    }

    if (framing === 'acrylic') {
      const pad = 6;
      const cardW = drawW + pad * 2;
      const cardH = drawH + pad * 2;
      const cardX = -cardW / 2;
      const cardY = -topOffset + 3;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.stroke();
      ctx.restore();

      // Top metallic clasp and jump ring clamping to acrylic keychain
      drawCustomCharmFixture(ctx, cardY);

      ctx.drawImage(img, cardX + pad, cardY + pad, drawW, drawH);
      ctx.restore();
      return;
    }

    // Default 'contour': Cutout photo with polished top jump ring clasp
    const drawX = -drawW / 2;
    const drawY = -topOffset + 3;

    // Polished metallic gold jump ring & clasp clamping onto top edge of photo
    drawCustomCharmFixture(ctx, drawY);

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}
