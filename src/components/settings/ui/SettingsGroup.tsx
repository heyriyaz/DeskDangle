import React from 'react';

interface SettingsGroupProps {
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  footer,
  children,
  className = '',
}) => {
  return (
    <div className={`settings-group-wrapper ${className}`}>
      {title && <div className="settings-group-header">{title}</div>}
      <div className="settings-group-card">{children}</div>
      {footer && <div className="settings-group-footer">{footer}</div>}
    </div>
  );
};
