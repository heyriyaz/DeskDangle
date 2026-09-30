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
        footer="You can click and drag the top anchor horizontally across the top of your screen anytime."
      >
        <SettingsRow
          label="Preset Alignment"
          subtitle="Snap anchor directly to screen center or edges"
        >
          <SettingsSegmented
            options={[
              { id: 'left', label: 'Left (15%)' },
              { id: 'center', label: typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent) ? '💻 Notch (50%)' : '💻 Center (50%)' },
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

      {/* THEME & APPEARANCE GROUP */}
      <SettingsGroup title="Interface Theme">
        <SettingsRow label="Appearance" subtitle="Match system dark/light appearance or lock a specific theme">
          <SettingsSegmented
            options={[
              { id: 'system', label: 'Auto (System)' },
              { id: 'dark', label: 'Dark' },
              { id: 'light', label: 'Light' },
            ]}
            value={settings.general.theme || 'system'}
            onChange={(theme) =>
              updateSettings({
                general: {
                  ...settings.general,
                  theme: theme as 'system' | 'dark' | 'light',
                },
              })
            }
            size="sm"
          />
        </SettingsRow>
      </SettingsGroup>

      {/* STARTUP & LAUNCH GROUP */}
      <SettingsGroup title="Launch">
        <SettingsRow
          label="Start at Login"
          subtitle="Automatically start DeskDangle when logging in to your computer"
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
