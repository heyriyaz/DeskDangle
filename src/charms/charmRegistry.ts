import { Charm } from './charmTypes';
import { drawEyelet } from './vectorCharms';
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
    category: 'companions',
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
    category: 'companions',
    description: 'The iconic sad crying kitten in a yellow banana suit with gold eyelet ring.',
    scale: 1.3,
    anchorOffset: 52,
    renderType: 'image',
    imageDataUrl: bananaCatImg,
  },
  {
    id: 'chonky-cat',
    name: 'Chonky Loaf Cat',
    category: 'companions',
    description: 'The famously round spherical grey tabby loaf cat with golden hanging ring.',
    scale: 1.25,
    anchorOffset: 46,
    renderType: 'image',
    imageDataUrl: chonkyCatImg,
  },
  {
    id: 'orange-cat',
    name: 'Orange Cat',
    category: 'companions',
    description: 'The legendary skeptical orange tabby cat face with golden hanging eyelet.',
    scale: 1.25,
    anchorOffset: 46,
    renderType: 'image',
    imageDataUrl: orangeCatImg,
  },
];





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
    const finalScale = (charm.scale || 1.0) * globalScale * (isDragging ? 1.05 : isHovered ? 1.02 : 1.0);
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

    // 1. Built-in Photorealistic Charms
    if (charm.id === 'evil-eye' || charm.id === 'hamsa-hand' || charm.id === 'nimbu-mirchi') {
      const drawSize = radius * (charm.id === 'nimbu-mirchi' ? 3.6 : 3.4);
      const drawX = -drawSize / 2;
      const drawY = -drawSize * (charm.id === 'nimbu-mirchi' ? 0.52 : 0.505);
      ctx.drawImage(img, drawX, drawY, drawSize, drawSize);
      ctx.restore();
      return;
    }

    if (charm.id === 'cherry') {
      const drawH = radius * 3.3;
      const drawW = drawH * (959 / 1024);
      const topOffset = (charm.anchorOffset || 48) * 0.9;
      ctx.drawImage(img, -drawW / 2, -topOffset - drawH * (4 / 1024), drawW, drawH);
      ctx.restore();
      return;
    }

    if (charm.id === 'glass-heart') {
      const drawW = radius * 3.2;
      const drawH = drawW * (959 / 1024);
      const topOffset = (charm.anchorOffset || 48) * 0.9;
      ctx.drawImage(img, -drawW / 2, -topOffset - drawH * (4 / 959), drawW, drawH);
      ctx.restore();
      return;
    }

    if (charm.id === 'fluffy-kitten') {
      const drawH = radius * 3.4;
      const drawW = drawH * (881 / 913);
      const topOffset = (charm.anchorOffset || 56) * 0.9;
      ctx.drawImage(img, -drawW / 2, -topOffset - drawH * (30 / 913), drawW, drawH);
      ctx.restore();
      return;
    }

    if (charm.id === 'pink-cassette') {
      const drawW = radius * 3.5;
      const drawH = drawW * (682 / 1024);
      const topOffset = (charm.anchorOffset || 46) * 0.9;
      ctx.drawImage(img, -drawW / 2, -topOffset - drawH * (4 / 682), drawW, drawH);
      ctx.restore();
      return;
    }

    if (charm.id === 'banana-cat') {
      const drawH = radius * 3.5;
      const drawW = drawH * (724 / 958);
      const topOffset = (charm.anchorOffset || 52) * 0.9;
      ctx.drawImage(img, -drawW / 2, -topOffset - drawH * (24 / 958), drawW, drawH);
      ctx.restore();
      return;
    }

    if (charm.id === 'chonky-cat') {
      const drawW = radius * 3.3;
      const drawH = drawW * (675 / 786);
      const topOffset = (charm.anchorOffset || 46) * 0.9;
      ctx.drawImage(img, -drawW / 2, -topOffset - drawH * (84 / 675), drawW, drawH);
      ctx.restore();
      return;
    }

    if (charm.id === 'orange-cat') {
      const drawW = radius * 3.3;
      const drawH = drawW * (786 / 755);
      const topOffset = (charm.anchorOffset || 46) * 0.9;
      ctx.drawImage(img, -drawW / 2, -topOffset - drawH * (163 / 786), drawW, drawH);
      ctx.restore();
      return;
    }






    // 2. Custom Uploaded Image Charms (High-Resolution Aspect-Preserving)
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const aspect = naturalW / naturalH;

    const maxDim = radius * 2.8;
    let drawW = maxDim;
    let drawH = maxDim;

    if (aspect >= 1) {
      drawW = maxDim;
      drawH = maxDim / aspect;
    } else {
      drawH = maxDim;
      drawW = maxDim * aspect;
    }

    const drawX = -drawW / 2;
    const drawY = -drawH / 2 + 4;

    const framing = charm.framing || 'contour';

    if (framing === 'badge') {
      const badgeR = Math.max(drawW, drawH) * 0.62 + 4;
      drawEyelet(ctx, badgeR);

      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 4, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#eab308';
      ctx.stroke();

      ctx.clip();
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
      ctx.restore();
      return;
    }

    if (framing === 'acrylic') {
      const pad = 6;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(drawX - pad, drawY - pad, drawW + pad * 2, drawH + pad * 2, 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();
      ctx.restore();
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}
