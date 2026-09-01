import React, { useState, useMemo } from 'react';
import { useDangleSettings } from '../../store/settingsStore';
import { CharmRegistry, BUILTIN_CHARMS } from '../../charms/charmRegistry';
import { RopeStyle, Charm } from '../../charms/charmTypes';
import { soundEffects } from '../../audio/SoundEffects';
import { SettingsGroup } from './ui/SettingsGroup';
import { SettingsRow } from './ui/SettingsRow';
import { SettingsSlider } from './ui/SettingsSlider';
import { SettingsSegmented } from './ui/SettingsSegmented';
import { LiveCharmMiniPreview } from './ui/LiveCharmMiniPreview';
import { CharmTileIcon } from './ui/CharmTileIcon';
import {
  CheckIcon,
  ImageIcon,
  UploadCloudIcon,
  TrashIcon,
  SparklesIcon,
} from './ui/Icons';

export const AppearanceTab: React.FC = () => {
  const [settings, updateSettings] = useDangleSettings();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Creator state
  const [customImageName, setCustomImageName] = useState('');
  const [customImageFraming, setCustomImageFraming] = useState<'contour' | 'acrylic' | 'badge'>('contour');

  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [customImageScale, setCustomImageScale] = useState(1.0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const allCharms = CharmRegistry.getAllCharms();
  const activeCharm = CharmRegistry.getCharmById(settings.selectedCharmId);

  const filteredCharms = allCharms.filter((c) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'builtin') return BUILTIN_CHARMS.some((b) => b.id === c.id);
    if (categoryFilter === 'custom') return c.category === 'custom' || c.category === 'emoji';
    return true;
  });


  const handleSelectCharm = (charmId: string) => {
    soundEffects.playCharmSwitchSound();
    updateSettings({ selectedCharmId: charmId });
  };

  const processImageFile = (file: File) => {
    const defaultName = file.name.replace(/\.[^/.]+$/, '');
    setCustomImageName(defaultName);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomImagePreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSaveCustomImageCharm = async () => {
    if (!customImagePreview) return;
    setUploadError(null);

    const charmId = `custom-${Date.now()}`;
    let finalDataUrl = customImagePreview;

    if (window.electronAPI?.uploadCustomImage) {
      try {
        const validation = await window.electronAPI.uploadCustomImage(customImagePreview, charmId);
        if (!validation.valid) {
          setUploadError(validation.error || 'Failed to validate uploaded image.');
          return;
        }
        if (validation.sanitizedDataUrl) {
          finalDataUrl = validation.sanitizedDataUrl;
        }
      } catch (err: unknown) {
        console.error('Validation error:', err);
        setUploadError('Failed to process image file.');
        return;
      }
    }

    const newCharm: Charm = {
      id: charmId,
      name: customImageName.trim() || 'Custom Charm',
      category: 'custom',
      scale: customImageScale,
      anchorOffset: 34,
      renderType: 'image',
      framing: customImageFraming,
      imageDataUrl: finalDataUrl,
    };

    const updatedCustoms = [...(settings.customCharms || []), newCharm];
    soundEffects.playCharmSwitchSound();
    updateSettings({
      customCharms: updatedCustoms,
      selectedCharmId: newCharm.id,
    });
    setCustomImagePreview(null);
    setCustomImageName('');
    setUploadError(null);
  };


  const handleDeleteCustomCharm = (charmId: string) => {
    const updatedCustoms = (settings.customCharms || []).filter((c) => c.id !== charmId);
    const updatedEmojis = (settings.customEmojis || []).filter((c) => c.id !== charmId);
    const fallbackId = settings.selectedCharmId === charmId ? BUILTIN_CHARMS[0].id : settings.selectedCharmId;

    updateSettings({
      customCharms: updatedCustoms,
      customEmojis: updatedEmojis,
      selectedCharmId: fallbackId,
    });
  };

  // Live preview charm generated dynamically for the creator
  const livePreviewCharm: Charm = useMemo(() => {
    if (customImagePreview) {
      return {
        id: 'preview-image',
        name: customImageName || 'Custom Photo',
        category: 'custom',
        scale: customImageScale,
        anchorOffset: 34,
        renderType: 'image',
        framing: customImageFraming,
        imageDataUrl: customImagePreview,
      };
    }
    return activeCharm;
  }, [
    customImagePreview,
    customImageName,
    customImageScale,
    customImageFraming,
    activeCharm,
  ]);

  const ropeColors = [
    { label: 'Natural Jute', value: '#785338' },
    { label: 'Charcoal', value: '#334155' },
    { label: 'Gold', value: '#eab308' },
    { label: 'Crimson', value: '#e11d48' },
    { label: 'Cobalt', value: '#2563eb' },
    { label: 'Emerald', value: '#16a34a' },
    { label: 'Neon Cyan', value: '#00f0ff' },
  ];

  return (
    <div className="apple-settings-page">
      <div className="apple-page-header">
        <h1 className="apple-page-title">Appearance</h1>
        <p className="apple-page-subtitle">Customize your desktop hanging charms, upload transparent PNGs, and tune cord styles.</p>
      </div>

      {/* Mini Live Charm Preview Card */}
      <div className="apple-preview-card">
        <LiveCharmMiniPreview
          charm={activeCharm}
          charmScale={settings.charmScale}
          ropeSettings={settings.rope}
        />
        <div className="apple-preview-info">
          <span className="apple-preview-name">{activeCharm.name}</span>
          <span className="apple-preview-type">
            {activeCharm.renderType === 'image'
              ? 'Realistic 3D Charm'
              : activeCharm.renderType === 'emoji'
              ? 'Custom Charm'
              : 'Vector Graphic'}
          </span>
        </div>
      </div>

      {/* 1. CHARMS COLLECTION GROUP */}
      <SettingsGroup title="Charms Collection">
        {/* Category Filter */}
        <div className="apple-group-inner-padding">
          {allCharms.length > 1 && (
            <SettingsSegmented
              options={[
                { id: 'all', label: `All (${allCharms.length})` },
                { id: 'builtin', label: `Built-in (${BUILTIN_CHARMS.length})` },
                { id: 'custom', label: `Uploaded (${(settings.customCharms?.length || 0) + (settings.customEmojis?.length || 0)})` },
              ]}

              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
              size="sm"
            />
          )}

          {/* Compact Charm Picker Grid */}
          <div className="apple-charm-grid">
            {filteredCharms.map((c) => {
              const isSelected = c.id === settings.selectedCharmId;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`apple-charm-tile ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectCharm(c.id)}
                  title={c.name}
                >
                  <div className="apple-charm-tile-preview">
                    <CharmTileIcon charm={c} />
                  </div>
                  <span className="apple-charm-tile-label">{c.name}</span>
                  {isSelected && (
                    <div className="apple-charm-check">
                      <CheckIcon size={10} color="#ffffff" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Charm Size Slider */}
        <SettingsRow label="Charm Size" subtitle="Scale factor for desktop presentation">
          <SettingsSlider
            min={0.7}
            max={1.4}
            step={0.05}
            value={settings.charmScale}
            formatValue={(v) => `${Math.round(v * 100)}%`}
            onChange={(scale) => updateSettings({ charmScale: scale })}
          />
        </SettingsRow>
      </SettingsGroup>

      {/* 2. UPLOAD CUSTOM PNG / IMAGE CHARM */}
      <SettingsGroup
        title="Upload Image Charm"
        footer="Transparent PNG images are best for hanging. You can also upload JPG, WebP, or SVG graphics."
      >
        <div className="apple-creator-studio">
          <div className="apple-studio-pane">

              {uploadError && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 69, 58, 0.15)',
                    border: '1px solid rgba(255, 69, 58, 0.3)',
                    borderRadius: '6px',
                    color: '#ff453a',
                    fontSize: '12px',
                  }}
                >
                  {uploadError}
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div className="apple-upload-area">

                <label
                  className={`apple-upload-dropzone ${isDraggingOver ? 'drag-over' : ''} ${customImagePreview ? 'has-preview' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <div className="apple-dropzone-content">
                    <div className="apple-dropzone-icon">
                      <UploadCloudIcon size={32} color="var(--accent-text)" />
                    </div>
                    <div className="apple-dropzone-text">
                      <strong>Choose an Image or Drag & Drop Here</strong>
                      <span className="apple-dropzone-hint">
                        Transparent <code>PNG</code> format recommended for best hanging appearance
                      </span>
                    </div>
                    <span className="apple-btn-secondary apple-btn-sm">
                      <ImageIcon size={13} style={{ marginRight: '6px' }} />
                      Browse Files...
                    </span>
                  </div>
                </label>
              </div>

              {/* Options when an image is selected */}
              {customImagePreview && (
                <div className="apple-upload-configured-box">
                  <div className="apple-form-grid">
                    <div className="apple-form-col">
                      <label className="apple-field-label">Charm Name</label>
                      <input
                        type="text"
                        placeholder="e.g. My Favorite Charm"
                        className="apple-input apple-input-full"
                        value={customImageName}
                        onChange={(e) => setCustomImageName(e.target.value)}
                      />
                    </div>

                    <div className="apple-form-col">
                      <label className="apple-field-label">Framing Style</label>
                      <SettingsSegmented<'contour' | 'acrylic' | 'badge'>
                        options={[
                          { id: 'contour', label: 'Transparent Cutout' },
                          { id: 'acrylic', label: 'Acrylic Keychain' },
                          { id: 'badge', label: 'Medallion Badge' },
                        ]}
                        value={customImageFraming}
                        onChange={(f) => setCustomImageFraming(f)}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="apple-studio-bottom-bar">
                    <div className="apple-studio-slider-wrap">
                      <label className="apple-field-label">Image Scale</label>
                      <SettingsSlider
                        min={0.7}
                        max={1.4}
                        step={0.05}
                        value={customImageScale}
                        formatValue={(v) => `${Math.round(v * 100)}%`}
                        onChange={(s) => setCustomImageScale(s)}
                      />
                    </div>

                    <div className="apple-studio-live-box">
                      <LiveCharmMiniPreview
                        charm={livePreviewCharm}
                        charmScale={1.0}
                        ropeSettings={settings.rope}
                      />
                    </div>

                    <button
                      type="button"
                      className="apple-btn-primary apple-btn-large"
                      onClick={handleSaveCustomImageCharm}
                    >
                      <SparklesIcon size={14} style={{ marginRight: '6px' }} />
                      Create & Hang Charm
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Uploaded Charms List */}
            {((settings.customCharms?.length || 0) > 0 || (settings.customEmojis?.length || 0) > 0) && (
              <div className="apple-custom-list-section">
                <div className="apple-creator-title">
                  <span>Your Uploaded Charms</span>
                  <span className="apple-badge-count">{(settings.customCharms?.length || 0) + (settings.customEmojis?.length || 0)}</span>
                </div>
                <div className="apple-custom-charms-grid">
                  {[...(settings.customCharms || []), ...(settings.customEmojis || [])].map((c) => (
                    <div key={c.id} className="apple-custom-card">
                      <div className="apple-custom-card-left" onClick={() => handleSelectCharm(c.id)}>
                        <CharmTileIcon charm={c} />
                        <div className="apple-custom-card-info">
                          <span className="apple-custom-card-name">{c.name}</span>
                          <span className="apple-custom-card-type">
                            {c.framing === 'acrylic' ? 'Acrylic' : c.framing === 'badge' ? 'Medallion' : 'Cutout'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="apple-btn-icon-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomCharm(c.id);
                        }}
                        title="Delete Charm"
                      >
                        <TrashIcon size={13} color="#ff453a" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
      </SettingsGroup>


      {/* 3. ROPE GROUP */}
      <SettingsGroup title="Rope">
        {/* Rope Style */}
        <SettingsRow label="Style" subtitle="Visual appearance of the hanging cord">
          <SettingsSegmented<RopeStyle>
            options={[
              { id: 'classic', label: 'Classic' },
              { id: 'rope', label: 'Braided' },
              { id: 'thread', label: 'Thread' },
              { id: 'chain', label: 'Chain' },
              { id: 'neon', label: 'Neon' },
            ]}
            value={settings.rope.style}
            onChange={(style) => updateSettings({ rope: { ...settings.rope, style } })}
            size="sm"
          />
        </SettingsRow>

        {/* Rope Color */}
        <SettingsRow label="Color" subtitle="Cord color palette">
          <div className="apple-color-swatches">
            {ropeColors.map((col) => (
              <button
                key={col.value}
                type="button"
                className={`apple-color-swatch ${settings.rope.color === col.value ? 'selected' : ''}`}
                style={{ backgroundColor: col.value }}
                title={col.label}
                onClick={() => updateSettings({ rope: { ...settings.rope, color: col.value } })}
              />
            ))}
          </div>
        </SettingsRow>

        {/* Rope Length */}
        <SettingsRow label="Length" subtitle="Total hanging distance from top of screen">
          <SettingsSlider
            min={4}
            max={12}
            step={1}
            value={settings.rope.lengthSegments}
            formatValue={(v) => `${v * 20} px`}
            onChange={(lengthSegments) => updateSettings({ rope: { ...settings.rope, lengthSegments } })}
          />
        </SettingsRow>

        {/* Rope Thickness */}
        <SettingsRow label="Thickness" subtitle="Cord diameter in pixels">
          <SettingsSlider
            min={1.2}
            max={7.0}
            step={0.2}
            value={settings.rope.thickness || 3.2}
            formatValue={(v) => `${v.toFixed(1)} px`}
            onChange={(thickness) => updateSettings({ rope: { ...settings.rope, thickness } })}
          />
        </SettingsRow>
      </SettingsGroup>
    </div>
  );
};


