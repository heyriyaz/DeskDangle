import React from 'react';
import { useDangleSettings } from '../../store/settingsStore';
import { soundEffects } from '../../audio/SoundEffects';
import { SettingsGroup } from './ui/SettingsGroup';
import { SettingsRow } from './ui/SettingsRow';
import { SettingsSlider } from './ui/SettingsSlider';
import { SettingsToggle } from './ui/SettingsToggle';

export const SoundTab: React.FC = () => {
  const [settings, updateSettings] = useDangleSettings();

  return (
    <div className="apple-settings-page">
      <div className="apple-page-header">
        <h1 className="apple-page-title">Sound</h1>
        <p className="apple-page-subtitle">Subtle acoustic feedback for charm interactions.</p>
      </div>

      {/* AUDIO FEEDBACK GROUP */}
      <SettingsGroup title="Feedback">
        {/* Interaction Sounds Toggle */}
        <SettingsRow
          label="Interaction Sounds"
          subtitle="Play soft audio feedback on grab, throw, and tap"
        >
          <SettingsToggle
            checked={settings.sound.enabled}
            onChange={(enabled) =>
              updateSettings({ sound: { ...settings.sound, enabled } })
            }
          />
        </SettingsRow>

        {settings.sound.enabled && (
          <>
            {/* Volume Slider */}
            <SettingsRow label="Volume" subtitle="Master sound effects volume">
              <SettingsSlider
                min={0.0}
                max={1.0}
                step={0.05}
                value={settings.sound.volume}
                formatValue={(v) => `${Math.round(v * 100)}%`}
                onChange={(volume) =>
                  updateSettings({ sound: { ...settings.sound, volume } })
                }
              />
            </SettingsRow>

            {/* Sound Previews */}
            <SettingsRow
              label="Preview Effects"
              subtitle="Test generated audio waveforms"
            >
              <div className="apple-sound-preview-buttons">
                <button
                  type="button"
                  className="apple-btn-secondary apple-btn-sm"
                  onClick={() => soundEffects.playGrabSound()}
                >
                  Grab
                </button>
                <button
                  type="button"
                  className="apple-btn-secondary apple-btn-sm"
                  onClick={() => soundEffects.playReleaseSound(1.2)}
                >
                  Release
                </button>
                <button
                  type="button"
                  className="apple-btn-secondary apple-btn-sm"
                  onClick={() => soundEffects.playTapSound()}
                >
                  Tap
                </button>
                <button
                  type="button"
                  className="apple-btn-secondary apple-btn-sm"
                  onClick={() => soundEffects.playCharmSwitchSound()}
                >
                  Switch
                </button>
              </div>
            </SettingsRow>
          </>
        )}
      </SettingsGroup>
    </div>
  );
};
