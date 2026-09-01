import React from 'react';
import { ChevronRightIcon } from './Icons';

interface SettingsRowProps {
  label: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  isAction?: boolean;
  className?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  subtitle,
  icon,
  children,
  onClick,
  isAction = false,
  className = '',
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      className={`settings-row-item ${isClickable ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div className="settings-row-leading">
        {icon && <div className="settings-row-icon">{icon}</div>}
        <div className="settings-row-text">
          <div className="settings-row-title">{label}</div>
          {subtitle && <div className="settings-row-subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="settings-row-trailing">
        {children}
        {isAction && <ChevronRightIcon size={14} className="settings-row-chevron" />}
      </div>
    </div>
  );
};
