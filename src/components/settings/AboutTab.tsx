import React, { useState } from 'react';
import { BUILTIN_CHARMS } from '../../charms/charmRegistry';
import { DangleLogoIcon, TrashIcon, HeartIcon } from './ui/Icons';
import { SettingsGroup } from './ui/SettingsGroup';
import { SettingsRow } from './ui/SettingsRow';
import { useDangleSettings } from '../../store/settingsStore';

export const AboutTab: React.FC = () => {
  const [, , resetSettings, deleteCustomCharms] = useDangleSettings();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteCharmsModal, setShowDeleteCharmsModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleReset = async () => {
    await resetSettings();
    setShowResetModal(false);
    setStatusMessage('Settings successfully reset to defaults.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDeleteCharms = async () => {
    await deleteCustomCharms();
    setShowDeleteCharmsModal(false);
    setStatusMessage('Custom charms cleared.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="apple-settings-page">
      <div className="apple-page-header">
        <h1 className="apple-page-title">About</h1>
        <p className="apple-page-subtitle">Application details, privacy, and maintenance.</p>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(52, 199, 89, 0.15)',
            border: '1px solid rgba(52, 199, 89, 0.3)',
            borderRadius: '8px',
            color: '#30d158',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* App Identity Card */}
      <div className="apple-about-hero">
        <div className="apple-about-icon">
          <DangleLogoIcon size={56} />
        </div>
        <h2 className="apple-about-name">DeskDangle</h2>
        <p className="apple-about-tagline">Tiny charms. A little life on your Windows desktop.</p>
        <span className="apple-about-version">Version 1.0.1 (Windows 10 / 11)</span>
      </div>

      {/* Product Details */}
      <SettingsGroup title="Product Information">
        <SettingsRow label="Developer" subtitle="Created & Designed by">
          <span style={{ fontSize: '13px', color: 'var(--accent-text)', fontWeight: 550 }}>@heyriyaz</span>
        </SettingsRow>
        <SettingsRow label="GitHub Profile" subtitle="Source code and releases">
          <span style={{ fontSize: '13px', color: 'var(--accent-text)' }}>github.com/heyriyaz</span>
        </SettingsRow>
        <SettingsRow label="Platform" subtitle="Engineered exclusively for Microsoft Windows">
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Windows 10 / Windows 11 (x64)</span>
        </SettingsRow>
        <SettingsRow label="App ID" subtitle="System package identifier">
          <code style={{ fontSize: '12px', opacity: 0.8 }}>com.deskdangle.desktop</code>
        </SettingsRow>
      </SettingsGroup>

      {/* Privacy Guarantee */}
      <SettingsGroup
        title="Privacy & Local Storage"
        footer="DeskDangle operates 100% locally on your computer. Zero telemetry, zero analytics, and zero external network requests. Your custom charms and settings stay strictly on your device."
      >
        <SettingsRow label="Local-Only Architecture" subtitle="All physics and data are processed entirely offline">
          <span style={{ fontSize: '13px', color: '#30d158', fontWeight: 600 }}>100% Private</span>
        </SettingsRow>
      </SettingsGroup>

      {/* Shortcuts Quick Reference */}
      <SettingsGroup
        title="Shortcuts Quick Reference"
        footer="Global shortcuts can be toggled on/off in the Behavior tab to avoid key conflicts with other software."
      >
        <SettingsRow label="Toggle Visibility">
          <kbd className="apple-kbd">Alt + Shift + D</kbd>
        </SettingsRow>
        <SettingsRow label="Pause / Resume Physics">
          <kbd className="apple-kbd">Alt + Shift + P</kbd>
        </SettingsRow>
        <SettingsRow label="Switch to Random Charm">
          <kbd className="apple-kbd">Alt + Shift + R</kbd>
        </SettingsRow>
        <SettingsRow label="Open Settings">
          <kbd className="apple-kbd">Alt + Shift + S</kbd>
        </SettingsRow>
      </SettingsGroup>

      {/* Maintenance & Reset */}
      <SettingsGroup
        title="Maintenance"
        footer="Resetting settings restores default rope and physics settings without deleting your uploaded charms."
      >
        <SettingsRow
          label="Reset All Settings"
          subtitle="Restore factory rope, physics, and general settings"
          onClick={() => setShowResetModal(true)}
          isAction
        >
          <button
            type="button"
            className="apple-btn-secondary"
            onClick={() => setShowResetModal(true)}
          >
            Reset Settings
          </button>
        </SettingsRow>

        <SettingsRow
          label="Delete Custom Charms"
          subtitle="Permanently remove all user-uploaded images and custom charms"
          onClick={() => setShowDeleteCharmsModal(true)}
          isAction
        >
          <button
            type="button"
            className="apple-btn-secondary"
            style={{ color: '#ff453a', borderColor: 'rgba(255, 69, 58, 0.3)' }}
            onClick={() => setShowDeleteCharmsModal(true)}
          >
            <TrashIcon size={12} color="#ff453a" style={{ marginRight: '6px' }} />
            Delete Custom Charms
          </button>
        </SettingsRow>
      </SettingsGroup>

      {/* Built-in Charms Library */}
      <SettingsGroup
        title={`Built-in Library (${BUILTIN_CHARMS.length} Photorealistic Charms)`}
        footer="DeskDangle is powered by Electron, React, TypeScript, and Matter.js physics."
      >
        <div className="apple-group-inner-padding">
          <div className="apple-about-tags">
            {BUILTIN_CHARMS.map((c) => (
              <span key={c.id} className="apple-about-tag">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </SettingsGroup>

      {/* Creator Credits */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 0 8px 0',
          textAlign: 'center',
          gap: '5px',
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.005em',
        }}
      >
        <span>Built with</span>
        <HeartIcon size={12} color="#ff3b30" />
        <span>by Riyaz</span>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog">
            <h3 className="apple-modal-title">Reset all DeskDangle settings?</h3>
            <p className="apple-modal-desc">
              This will restore all rope, physics, shortcut, and general options to their original defaults.
              Your custom uploaded charms will NOT be deleted.
            </p>
            <div className="apple-modal-actions">
              <button
                type="button"
                className="apple-btn-secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="apple-btn-primary"
                onClick={handleReset}
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Custom Charms Modal */}
      {showDeleteCharmsModal && (
        <div className="apple-modal-backdrop">
          <div className="apple-modal-dialog">
            <h3 className="apple-modal-title">Delete all custom charms?</h3>
            <p className="apple-modal-desc">
              This will permanently delete all uploaded images and custom charms from your computer. This action cannot be undone.
            </p>
            <div className="apple-modal-actions">
              <button
                type="button"
                className="apple-btn-secondary"
                onClick={() => setShowDeleteCharmsModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="apple-btn-primary"
                style={{ backgroundColor: '#ff453a' }}
                onClick={handleDeleteCharms}
              >
                Delete Charms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

