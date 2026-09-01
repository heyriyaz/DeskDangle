import React from 'react';
import { useDangleSettings, DEFAULT_APP_SETTINGS } from '../../store/settingsStore';
import { SettingsGroup } from './ui/SettingsGroup';
import { SettingsRow } from './ui/SettingsRow';
import { SettingsSlider } from './ui/SettingsSlider';
import { SettingsToggle } from './ui/SettingsToggle';

export const PhysicsTab: React.FC = () => {
  const [settings, updateSettings] = useDangleSettings();

  const handleResetPhysics = () => {
    updateSettings({ physics: { ...DEFAULT_APP_SETTINGS.physics } });
  };

  return (
    <div className="apple-settings-page">
      <div className="apple-page-header">
        <h1 className="apple-page-title">Physics</h1>
        <p className="apple-page-subtitle">Control gravity, momentum, and simulated desktop motion.</p>
      </div>

      {/* MOTION GROUP */}
      <SettingsGroup title="Motion">
        {/* Gravity */}
        <SettingsRow label="Gravity" subtitle="Downward gravitational pull">
          <SettingsSlider
            min={0.2}
            max={2.5}
            step={0.05}
            value={settings.physics.gravity}
            formatValue={(v) => `${v.toFixed(2)}x`}
            leftLabel="Floaty"
            rightLabel="Heavy"
            onChange={(gravity) => updateSettings({ physics: { ...settings.physics, gravity } })}
          />
        </SettingsRow>

        {/* Damping */}
        <SettingsRow label="Damping" subtitle="Air resistance and motion deceleration">
          <SettingsSlider
            min={0.001}
            max={0.025}
            step={0.001}
            value={settings.physics.damping}
            formatValue={(v) => `${Math.round((v / 0.025) * 100)}%`}
            leftLabel="Perpetual"
            rightLabel="Quick Settle"
            onChange={(damping) => updateSettings({ physics: { ...settings.physics, damping } })}
          />
        </SettingsRow>

        {/* Swing Intensity */}
        <SettingsRow label="Swing" subtitle="Release momentum multiplier">
          <SettingsSlider
            min={0.2}
            max={2.5}
            step={0.05}
            value={settings.physics.swingIntensity}
            formatValue={(v) => `${Math.round(v * 100)}%`}
            leftLabel="Gentle"
            rightLabel="High"
            onChange={(swingIntensity) =>
              updateSettings({ physics: { ...settings.physics, swingIntensity } })
            }
          />
        </SettingsRow>

        {/* Wind */}
        <SettingsRow label="Wind" subtitle="Ambient idle draft strength">
          <SettingsSlider
            min={0.0}
            max={2.0}
            step={0.1}
            value={settings.physics.windStrength}
            formatValue={(v) => `${Math.round(v * 50)}%`}
            leftLabel="Calm"
            rightLabel="Breezy"
            onChange={(windStrength) =>
              updateSettings({ physics: { ...settings.physics, windStrength } })
            }
          />
        </SettingsRow>

        {/* Idle Movement Toggle */}
        <SettingsRow
          label="Idle Movement"
          subtitle="Gently sway charm when cursor is away"
        >
          <SettingsToggle
            checked={settings.physics.idleEnabled}
            onChange={(idleEnabled) =>
              updateSettings({ physics: { ...settings.physics, idleEnabled } })
            }
          />
        </SettingsRow>
      </SettingsGroup>

      {/* RESET ACTION */}
      <div className="apple-actions-footer">
        <button
          type="button"
          className="apple-btn-text"
          onClick={handleResetPhysics}
        >
          Reset Motion to Defaults
        </button>
      </div>
    </div>
  );
};
