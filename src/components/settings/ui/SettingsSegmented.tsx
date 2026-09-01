import React from 'react';

export interface SegmentOption<T extends string | number> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

interface SettingsSegmentedProps<T extends string | number> {
  options: Array<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SettingsSegmented<T extends string | number>({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}: SettingsSegmentedProps<T>) {
  return (
    <div className={`apple-segmented-control size-${size} ${className}`} role="tablist">
      {options.map((opt) => {
        const isSelected = opt.id === value;
        return (
          <button
            key={String(opt.id)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={`apple-segment-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onChange(opt.id)}
          >
            {opt.icon && <span className="apple-segment-icon">{opt.icon}</span>}
            <span className="apple-segment-label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
