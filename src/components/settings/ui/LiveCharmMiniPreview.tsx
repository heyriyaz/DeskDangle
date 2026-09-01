import React, { useEffect, useRef } from 'react';
import { Charm, RopeSettings } from '../../../charms/charmTypes';
import { CharmRegistry } from '../../../charms/charmRegistry';

interface LiveCharmMiniPreviewProps {
  charm: Charm;
  charmScale: number;
  ropeSettings: RopeSettings;
}

export const LiveCharmMiniPreview: React.FC<LiveCharmMiniPreviewProps> = ({
  charm,
  charmScale,
  ropeSettings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDestroyed = false;
    const dpr = window.devicePixelRatio || 1;
    const width = 160;
    const height = 120;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const loop = (time: number) => {
      if (isDestroyed) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Subtle physical pendulum swing formula
      const t = time * 0.0018;
      const swingAngle = Math.sin(t * 1.5) * 0.12 + Math.sin(t * 0.7) * 0.05;
      const ropeLength = 52;
      const anchorX = width / 2;
      const anchorY = 0;

      const charmX = anchorX + Math.sin(swingAngle) * ropeLength;
      const charmY = anchorY + Math.cos(swingAngle) * ropeLength;

      // 1. Draw Rope Cord
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(anchorX, anchorY);
      const midX = anchorX + Math.sin(swingAngle * 0.6) * (ropeLength * 0.5);
      const midY = anchorY + Math.cos(swingAngle * 0.6) * (ropeLength * 0.5);
      ctx.quadraticCurveTo(midX, midY, charmX, charmY - 6);
      ctx.strokeStyle = ropeSettings.color || '#785338';
      ctx.lineWidth = Math.max(1.2, (ropeSettings.thickness || 1.6) * 0.9);
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      // 2. Draw Charm
      CharmRegistry.renderCharm(
        ctx,
        charm,
        charmX,
        charmY + 18,
        swingAngle * 1.2,
        false,
        false,
        charmScale * 0.75
      );

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animRef.current);
    };
  }, [charm, charmScale, ropeSettings]);

  return (
    <div className="charm-mini-preview-wrap">
      <canvas ref={canvasRef} className="charm-mini-preview-canvas" />
    </div>
  );
};
