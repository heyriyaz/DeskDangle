import React from 'react';
import { useDangleSettings, DEFAULT_APP_SETTINGS } from '../../store/settingsStore';
import { SettingsGroup } from './ui/SettingsGroup';
import { SettingsRow } from './ui/SettingsRow';
import { SettingsSlider } from './ui/SettingsSlider';
import { SettingsToggle } from './ui/SettingsToggle';
import { SettingsSegmented, SegmentOption } from './ui/SettingsSegmented';
import { PhysicsPreset } from '../../charms/charmTypes';
import { PHYSICS_PRESETS } from '../../physics/PhysicsWorld';

const PRESET_OPTIONS: SegmentOption<PhysicsPreset>[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'bouncy', label: 'Bouncy' },
  { id: 'heavy', label: 'Heavy' },
  { id: 'space', label: 'Zero-G' },
];

export const PhysicsTab: React.FC = () => {
  const [settings, updateSettings] = useDangleSettings();

  const handleSelectPreset = (preset: PhysicsPreset) => {
    if (preset !== 'custom' && PHYSICS_PRESETS[preset]) {
      updateSettings({
        physics: {
          ...settings.physics,
          ...PHYSICS_PRESETS[preset],
          preset,
        },
      });
    } else {
      updateSettings({
        physics: {
          ...settings.physics,
          preset: 'custom',
        },
      });
    }
  };

  const handleResetPhysics = () => {
    updateSettings({
      physics: { ...DEFAULT_APP_SETTINGS.physics },
      sound: {
        ...settings.sound,
        wallImpactSounds: true,
      },
    });
  };

  return (
    <div className="apple-settings-page">
      <div className="apple-page-header">
        <h1 className="apple-page-title">Physics</h1>
        <p className="apple-page-subtitle">Control gravity, momentum, aerodynamic breeze, and motion styles.</p>
      </div>

      {/* PRESETS GROUP */}
      <SettingsGroup title="Physics Preset">
        <SettingsRow label="Profile" subtitle="Pre-tuned physical dynamic behaviors">
          <SettingsSegmented
            options={PRESET_OPTIONS}
            value={settings.physics.preset || 'classic'}
            onChange={handleSelectPreset}
          />
        </SettingsRow>
      </SettingsGroup>

      {/* MOTION GROUP */}
      <SettingsGroup title="Motion Parameters">
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
            onChange={(gravity) =>
              updateSettings({
                physics: { ...settings.physics, gravity, preset: 'custom' },
              })
            }
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
            onChange={(damping) =>
              updateSettings({
                physics: { ...settings.physics, damping, preset: 'custom' },
              })
            }
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
              updateSettings({
                physics: { ...settings.physics, swingIntensity, preset: 'custom' },
              })
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
              updateSettings({
                physics: { ...settings.physics, windStrength, preset: 'custom' },
              })
            }
          />
        </SettingsRow>

        {/* Air Displacement Breeze */}
        <SettingsRow
          label="Air Displacement"
          subtitle="Swish charm when cursor passes rapidly nearby"
        >
          <SettingsToggle
            checked={settings.physics.airDisplacement !== false}
            onChange={(airDisplacement) =>
              updateSettings({
                physics: { ...settings.physics, airDisplacement },
              })
            }
          />
        </SettingsRow>

        {/* Idle Movement Toggle */}
        <SettingsRow
          label="Idle Sway"
          subtitle="Gently sway charm when cursor is away"
        >
          <SettingsToggle
            checked={settings.physics.idleEnabled}
            onChange={(idleEnabled) =>
              updateSettings({ physics: { ...settings.physics, idleEnabled } })
            }
          />
        </SettingsRow>

        {/* Wall Impact Audio */}
        <SettingsRow
          label="Wall Impact Feedback"
          subtitle="Play soft acoustic thud when charm bumps screen edge"
        >
          <SettingsToggle
            checked={settings.sound.wallImpactSounds !== false}
            onChange={(wallImpactSounds) =>
              updateSettings({
                sound: { ...settings.sound, wallImpactSounds },
              })
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
