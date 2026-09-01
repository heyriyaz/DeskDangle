import React from 'react';

export interface DebugMetrics {
  fps: number;
  isPaused: boolean;
  isDragging: boolean;
  charmPos: { x: number; y: number };
  charmVel: { x: number; y: number };
  charmSpeed: number;
  charmAngle: number;
  segmentCount: number;
}

interface DebugOverlayProps {
  metrics: DebugMetrics;
  showWireframes: boolean;
  onToggleWireframes: () => void;
  onTogglePause: () => void;
  onResetPosition: () => void;
  onClose: () => void;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  metrics,
  showWireframes,
  onToggleWireframes,
  onTogglePause,
  onResetPosition,
  onClose,
}) => {
  return (
    <div className="debug-hud-container" style={{ pointerEvents: 'auto' }}>
      <div className="debug-hud-header">
        <div className="debug-hud-title">
          <span className="debug-status-dot" style={{ backgroundColor: metrics.isPaused ? '#ef4444' : '#22c55e' }} />
          <span>Dangle Dev Inspector</span>
        </div>
        <button className="debug-close-btn" onClick={onClose} title="Close HUD (Ctrl+Shift+X)">
          ✕
        </button>
      </div>

      <div className="debug-metrics-grid">
        <div className="debug-metric-card">
          <div className="debug-metric-label">FPS</div>
          <div className="debug-metric-value" style={{ color: metrics.fps >= 55 ? '#4ade80' : '#f87171' }}>
            {metrics.fps}
          </div>
        </div>

        <div className="debug-metric-card">
          <div className="debug-metric-label">STATE</div>
          <div className="debug-metric-value" style={{ color: metrics.isDragging ? '#fbbf24' : metrics.isPaused ? '#f87171' : '#60a5fa' }}>
            {metrics.isDragging ? 'DRAGGING' : metrics.isPaused ? 'PAUSED' : 'ACTIVE'}
          </div>
        </div>

        <div className="debug-metric-card">
          <div className="debug-metric-label">SPEED</div>
          <div className="debug-metric-value">
            {metrics.charmSpeed.toFixed(1)} px/f
          </div>
        </div>

        <div className="debug-metric-card">
          <div className="debug-metric-label">ROTATION</div>
          <div className="debug-metric-value">
            {((metrics.charmAngle * 180) / Math.PI).toFixed(1)}°
          </div>
        </div>
      </div>

      <div className="debug-details-list">
        <div className="debug-detail-row">
          <span>Position (X, Y)</span>
          <code>{metrics.charmPos.x.toFixed(0)}, {metrics.charmPos.y.toFixed(0)}</code>
        </div>
        <div className="debug-detail-row">
          <span>Velocity (Vx, Vy)</span>
          <code>{metrics.charmVel.x.toFixed(2)}, {metrics.charmVel.y.toFixed(2)}</code>
        </div>
        <div className="debug-detail-row">
          <span>Rope Segments</span>
          <code>{metrics.segmentCount} segments</code>
        </div>
      </div>

      <div className="debug-actions-row">
        <button
          className={`debug-btn ${showWireframes ? 'active' : ''}`}
          onClick={onToggleWireframes}
        >
          {showWireframes ? 'Hide Wireframes' : 'Show Wireframes'}
        </button>
        <button className="debug-btn" onClick={onTogglePause}>
          {metrics.isPaused ? 'Resume (Ctrl+Shift+P)' : 'Pause (Ctrl+Shift+P)'}
        </button>
        <button className="debug-btn" onClick={onResetPosition}>
          Reset
        </button>
      </div>

      <div className="debug-shortcuts-guide">
        <div><code>Ctrl+Shift+D</code> Toggle Show/Hide</div>
        <div><code>Ctrl+Shift+P</code> Pause / Resume</div>
        <div><code>Ctrl+Shift+X</code> Toggle Debug HUD</div>
      </div>
    </div>
  );
};
