import React, { useEffect, useRef } from 'react';
import {
  GeneralIcon,
  AppearanceIcon,
  PhysicsIcon,
  SparklesIcon,
  DangleLogoIcon,
} from './settings/ui/Icons';

interface QuickContextMenuProps {
  x: number;
  y: number;
  isPaused: boolean;
  onSelectChangeCharm: () => void;
  onRandomCharm: () => void;
  onTogglePause: () => void;
  onOpenSettings: () => void;
  onHide: () => void;
  onClose: () => void;
}

export const QuickContextMenu: React.FC<QuickContextMenuProps> = ({
  x,
  y,
  isPaused,
  onSelectChangeCharm,
  onRandomCharm,
  onTogglePause,
  onOpenSettings,
  onHide,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('pointerdown', handleOutsideClick);
    return () => window.removeEventListener('pointerdown', handleOutsideClick);
  }, [onClose]);

  // Constrain menu inside overlay container dynamically
  const maxX = Math.max(100, (window.innerWidth || 1920) - 220);
  const maxY = Math.max(100, (window.innerHeight || 1080) - 260);
  const posX = Math.max(10, Math.min(x, maxX));
  const posY = Math.max(10, Math.min(y, maxY));

  return (
    <div
      ref={menuRef}
      className="quick-context-menu"
      style={{ left: `${posX}px`, top: `${posY}px`, pointerEvents: 'auto' }}
    >
      <div className="quick-menu-header">
        <DangleLogoIcon size={16} />
        <span>DeskDangle</span>
      </div>


      <button
        className="quick-menu-item"
        onClick={() => {
          onSelectChangeCharm();
          onClose();
        }}
      >
        <span className="quick-menu-icon">
          <AppearanceIcon size={14} color="var(--accent-text)" />
        </span>
        <span>Change Charm...</span>
      </button>

      <button
        className="quick-menu-item"
        onClick={() => {
          onRandomCharm();
          onClose();
        }}
      >
        <span className="quick-menu-icon">
          <SparklesIcon size={14} color="var(--accent-text)" />
        </span>
        <span>Random Charm</span>
      </button>

      <button
        className="quick-menu-item"
        onClick={() => {
          onTogglePause();
          onClose();
        }}
      >
        <span className="quick-menu-icon">
          <PhysicsIcon size={14} color="var(--text-secondary)" />
        </span>
        <span>{isPaused ? 'Resume Physics' : 'Pause Physics'}</span>
      </button>

      <div className="quick-menu-divider" />

      <button
        className="quick-menu-item"
        onClick={() => {
          onOpenSettings();
          onClose();
        }}
      >
        <span className="quick-menu-icon">
          <GeneralIcon size={14} color="var(--text-secondary)" />
        </span>
        <span>Settings...</span>
      </button>

      <button
        className="quick-menu-item"
        onClick={() => {
          onHide();
          onClose();
        }}
      >
        <span className="quick-menu-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </span>
        <span>Hide Charm</span>
      </button>

      <button
        className="quick-menu-item danger"
        onClick={() => {
          window.electronAPI?.quitApp?.();
          onClose();
        }}
      >
        <span className="quick-menu-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff453a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </span>
        <span>Quit DeskDangle</span>
      </button>
    </div>
  );
};




