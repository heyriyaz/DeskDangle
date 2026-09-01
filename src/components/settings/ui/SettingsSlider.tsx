import React from 'react';

interface SettingsSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const SettingsSlider: React.FC<SettingsSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  leftLabel,
  rightLabel,
  disabled = false,
  className = '',
}) => {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className={`apple-slider-container ${className}`}>
      <div className="apple-slider-track-wrap">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          className="apple-slider-input"
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        <span className="apple-slider-badge">{displayValue}</span>
      </div>

      {(leftLabel || rightLabel) && (
        <div className="apple-slider-labels">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
};
