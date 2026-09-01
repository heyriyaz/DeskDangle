import React from 'react';
import { useDangleSettings } from '../../store/settingsStore';
import { SettingsGroup } from './ui/SettingsGroup';
import { SettingsRow } from './ui/SettingsRow';
import { SettingsToggle } from './ui/SettingsToggle';
import { SettingsSegmented } from './ui/SettingsSegmented';

export const BehaviorTab: React.FC = () => {
  const [settings, updateSettings] = useDangleSettings();

  return (
    <div className="apple-settings-page">
      <div className="apple-page-header">
        <h1 className="apple-page-title">Behavior</h1>
        <p className="apple-page-subtitle">Configure gestures, shortcuts, and accessibility preferences.</p>
      </div>

      {/* SHORTCUTS GROUP */}
      <SettingsGroup
        title="Global Shortcuts"
        footer="When enabled, shortcuts work globally from any software. Keep disabled if you prefer shortcuts not to interfere with other applications."
      >
        <SettingsRow
          label="Enable Global Shortcuts"
          subtitle="Intercept keyboard shortcuts system-wide across all applications"
        >
          <SettingsToggle
            checked={Boolean(settings.shortcuts.enabled)}
            onChange={(enabled) =>
              updateSettings({
                shortcuts: { ...settings.shortcuts, enabled },
              })
            }
          />
        </SettingsRow>

        {settings.shortcuts.enabled ? (
          <>
            <SettingsRow label="Show / Hide Overlay" subtitle="Toggle charm visibility on desktop">
              <kbd className="apple-kbd">Alt + Shift + D</kbd>
            </SettingsRow>

            <SettingsRow label="Pause / Resume" subtitle="Freeze physics simulation in place">
              <kbd className="apple-kbd">Alt + Shift + P</kbd>
            </SettingsRow>

            <SettingsRow label="Random Charm" subtitle="Instantly switch to a random charm">
              <kbd className="apple-kbd">Alt + Shift + R</kbd>
            </SettingsRow>

            <SettingsRow label="Open Settings" subtitle="Bring up this configuration panel">
              <kbd className="apple-kbd">Alt + Shift + S</kbd>
            </SettingsRow>
          </>
        ) : (
          <SettingsRow
            label="Shortcut Interception"
            subtitle="Global keys are currently off to avoid hijacking keys in other software"
          >
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Disabled (Safe Mode)
            </span>
          </SettingsRow>
        )}
      </SettingsGroup>

      {/* INTERACTION GROUP */}
      <SettingsGroup title="Interaction">
        <SettingsRow
          label="Double-Click Charm"
          subtitle="Action triggered when double-clicking the hanging charm"
        >
          <SettingsSegmented
            options={[
              { id: 'quick-drawer', label: 'Quick Drawer' },
              { id: 'settings', label: 'Settings' },
              { id: 'random', label: 'Random' },
            ]}
            value={settings.general.doubleClickAction}
            onChange={(action) =>
              updateSettings({
                general: {
                  ...settings.general,
                  doubleClickAction: action as 'quick-drawer' | 'settings' | 'random',
                },
              })
            }
            size="sm"
          />
        </SettingsRow>

        <SettingsRow
          label="Reduce Motion"
          subtitle="Minimize animations and disable ambient wind sway"
        >
          <SettingsToggle
            checked={settings.general.reduceMotion}
            onChange={(reduceMotion) =>
              updateSettings({
                general: { ...settings.general, reduceMotion },
              })
            }
          />
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
};
