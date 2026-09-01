import React, { useEffect, useRef } from 'react';
import { CharmRegistry } from '../charms/charmRegistry';
import { soundEffects } from '../audio/SoundEffects';
import { useDangleSettings } from '../store/settingsStore';
import { Charm } from '../charms/charmTypes';

interface QuickCharmDrawerProps {
  onClose: () => void;
  onOpenSettings: () => void;
}

export const QuickCharmDrawer: React.FC<QuickCharmDrawerProps> = ({
  onClose,
  onOpenSettings,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [settings, updateSettings] = useDangleSettings();
  const charms = CharmRegistry.getAllCharms();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('pointerdown', handleOutsideClick);
    return () => window.removeEventListener('pointerdown', handleOutsideClick);
  }, [onClose]);

  const handleSelectCharm = (charmId: string) => {
    if (charmId !== settings.selectedCharmId) {
      soundEffects.playCharmSwitchSound();
      updateSettings({ selectedCharmId: charmId });
    }
  };

  const handleRandom = () => {
    const random = CharmRegistry.getRandomCharm(settings.selectedCharmId);
    soundEffects.playCharmSwitchSound();
    updateSettings({ selectedCharmId: random.id });
  };

  return (
    <div className="quick-drawer-backdrop">
      <div ref={drawerRef} className="quick-charm-drawer" style={{ pointerEvents: 'auto' }}>
        <div className="quick-drawer-header">
          <div className="quick-drawer-title">
            <span>Select Charm</span>
          </div>
          <div className="quick-drawer-actions">
            <button className="quick-drawer-btn" onClick={handleRandom} title="Pick Random Charm">
              Random
            </button>
            <button
              className="quick-drawer-btn"
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
            >
              Settings...
            </button>
            <button className="quick-drawer-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>


        <div className="quick-charms-grid">
          {charms.map((charm) => (
            <button
              key={charm.id}
              className={`quick-charm-card ${settings.selectedCharmId === charm.id ? 'active' : ''}`}
              onClick={() => handleSelectCharm(charm.id)}
            >
              <div className="quick-charm-preview-box">
                <CharmCanvasPreview charm={charm} />
              </div>
              <span className="quick-charm-name">{charm.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CharmCanvasPreview: React.FC<{ charm: Charm; size?: number }> = ({ charm, size = 44 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);
    const center = size / 2;
    const scale = (size / 78) * 0.9;

    CharmRegistry.renderCharm(ctx, charm, center, center + 2, 0, false, false, scale);
  }, [charm, size]);

  return <canvas ref={canvasRef} className="charm-preview-canvas" />;
};
