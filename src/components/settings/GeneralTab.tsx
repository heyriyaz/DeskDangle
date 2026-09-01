import React, { useState, useEffect } from 'react';
import { useDangleSettings } from '../../store/settingsStore';
import { DisplayInfo } from '../../../electron/displayManager';
import { SettingsGroup } from './ui/SettingsGroup';
import { SettingsRow } from './ui/SettingsRow';
import { SettingsToggle } from './ui/SettingsToggle';
import { SettingsSlider } from './ui/SettingsSlider';
import { SettingsSegmented } from './ui/SettingsSegmented';

export const GeneralTab: React.FC = () => {
  const [settings, updateSettings] = useDangleSettings();
  const [displays, setDisplays] = useState<DisplayInfo[]>([]);

  useEffect(() => {
    if (window.electronAPI?.getDisplays) {
      window.electronAPI.getDisplays().then((d) => setDisplays(d));
    }
  }, []);

  const anchorPercent = Math.round((settings.general.anchorXPercent ?? 0.5) * 100);

  // Preset mapping for segmented control
  const currentPreset =
    anchorPercent <= 25 ? 'left' : anchorPercent >= 75 ? 'right' : 'center';

  const handlePresetChange = (preset: string) => {
    const val = preset === 'left' ? 0.15 : preset === 'right' ? 0.85 : 0.5;
    updateSettings({
      general: {
        ...settings.general,
        anchorXPercent: val,
      },
    });
  };

  return (
    <div className="apple-settings-page">
      <div className="apple-page-header">
        <h1 className="apple-page-title">General</h1>
        <p className="apple-page-subtitle">Screen position, startup options, and monitor settings.</p>
      </div>

      {/* TOP SCREEN POSITION GROUP */}
      <SettingsGroup
        title="Top Screen Position"
        footer="You can also click and drag the top of the rope horizontally across the top edge of your monitor anytime."
      >
        <SettingsRow
          label="Preset Alignment"
          subtitle="Quickly snap to left, center, or right edge"
        >
          <SettingsSegmented
            options={[
              { id: 'left', label: 'Left (15%)' },
              { id: 'center', label: 'Center (50%)' },
              { id: 'right', label: 'Right (85%)' },
            ]}
            value={currentPreset}
            onChange={handlePresetChange}
            size="sm"
          />
        </SettingsRow>

        <SettingsRow label="Exact Position" subtitle="Horizontal placement percentage">
          <SettingsSlider
            min={5}
            max={95}
            step={1}
            value={anchorPercent}
            formatValue={(v) => `${v}%`}
            leftLabel="Left"
            rightLabel="Right"
            onChange={(val) =>
              updateSettings({
                general: {
                  ...settings.general,
                  anchorXPercent: val / 100,
                },
              })
            }
          />
        </SettingsRow>
      </SettingsGroup>

      {/* STARTUP & LAUNCH GROUP */}
      <SettingsGroup title="Launch">
        <SettingsRow
          label="Start with Windows"
          subtitle="Automatically start DeskDangle when logging in to Windows"
        >
          <SettingsToggle
            checked={settings.general.launchAtStartup}
            onChange={(launchAtStartup) =>
              updateSettings({
                general: { ...settings.general, launchAtStartup },
              })
            }
          />
        </SettingsRow>
      </SettingsGroup>

      {/* DISPLAY & CLICK-THROUGH GROUP */}
      <SettingsGroup title="Desktop & Display">
        <SettingsRow
          label="Target Display"
          subtitle="Choose which monitor DeskDangle hangs from"
        >

          <SettingsSegmented
            options={[
              { id: 'primary', label: 'Primary Display' },
              ...(displays.length > 1
                ? [{ id: 'selected', label: 'Selected' }]
                : []),
            ]}
            value={settings.general.displayMode}
            onChange={(mode) =>
              updateSettings({
                general: {
                  ...settings.general,
                  displayMode: mode as 'primary' | 'selected' | 'all',
                },
              })
            }
            size="sm"
          />
        </SettingsRow>

        <SettingsRow
          label="Seamless Click-Through"
          subtitle="Clicks outside the charm pass through to underlying applications"
        >
          <SettingsToggle
            checked={settings.general.clickThroughEnabled}
            onChange={(clickThroughEnabled) =>
              updateSettings({
                general: { ...settings.general, clickThroughEnabled },
              })
            }
          />
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
};
