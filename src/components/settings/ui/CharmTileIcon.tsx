import React, { useEffect, useRef } from 'react';
import { Charm } from '../../../charms/charmTypes';
import { CharmRegistry } from '../../../charms/charmRegistry';

interface CharmTileIconProps {
  charm: Charm;
}

export const CharmTileIcon: React.FC<CharmTileIconProps> = ({ charm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Direct Image Element rendering for 100% instant reliable preview
  if (charm.renderType === 'image' && charm.imageDataUrl) {
    return (
      <img
        src={charm.imageDataUrl}
        alt={charm.name}
        className="apple-charm-img"
        style={{
          width: '34px',
          height: '34px',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 1.5px 3px rgba(0, 0, 0, 0.2))',
        }}
      />
    );
  }

  // 2. Emoji rendering with framing
  if (charm.renderType === 'emoji' && charm.emojiData) {
    if (charm.framing === 'badge') {
      return (
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #1e293b 0%, #0f172a 70%, #020617 100%)',
            border: '1.5px solid #eab308',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          {charm.emojiData.emoji}
        </div>
      );
    }
    if (charm.framing === 'acrylic') {
      return (
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          {charm.emojiData.emoji}
        </div>
      );
    }
    return <span className="apple-charm-emoji" style={{ fontSize: '24px' }}>{charm.emojiData.emoji}</span>;
  }


  // 3. Dynamic Vector Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 36;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, size, size);

    CharmRegistry.renderCharm(
      ctx,
      charm,
      size / 2,
      size / 2 + 2,
      0,
      false,
      false,
      0.45
    );
  }, [charm]);

  return <canvas ref={canvasRef} className="apple-tile-canvas" />;
};
