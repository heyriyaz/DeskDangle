import React, { useState } from 'react';
import { GeneralTab } from './GeneralTab';
import { AppearanceTab } from './AppearanceTab';
import { PhysicsTab } from './PhysicsTab';
import { BehaviorTab } from './BehaviorTab';
import { SoundTab } from './SoundTab';
import { AboutTab } from './AboutTab';
import {
  GeneralIcon,
  AppearanceIcon,
  PhysicsIcon,
  BehaviorIcon,
  SoundIcon,
  AboutIcon,
  DangleLogoIcon,
} from './ui/Icons';

type SettingsTab = 'general' | 'appearance' | 'physics' | 'behavior' | 'sound' | 'about';

interface NavItem {
  id: SettingsTab;
  label: string;
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
}

export const SettingsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  const navItems: NavItem[] = [
    { id: 'general', label: 'General', icon: GeneralIcon },
    { id: 'appearance', label: 'Appearance', icon: AppearanceIcon },
    { id: 'physics', label: 'Physics', icon: PhysicsIcon },
    { id: 'behavior', label: 'Behavior', icon: BehaviorIcon },
    { id: 'sound', label: 'Sound', icon: SoundIcon },
    { id: 'about', label: 'About', icon: AboutIcon },
  ];

  return (
    <div className="apple-settings-window">
      {/* macOS-style Minimal Sidebar */}
      <aside className="apple-settings-sidebar">
        <div className="apple-sidebar-header">
          <div className="apple-sidebar-brand">
            <div className="apple-brand-icon">
              <DangleLogoIcon size={26} />
            </div>
            <span className="apple-brand-name">DeskDangle</span>

          </div>
        </div>

        <nav className="apple-sidebar-nav" aria-label="Settings navigation">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`apple-nav-item ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="apple-nav-icon">
                  <IconComponent size={15} />
                </span>
                <span className="apple-nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Viewport */}
      <main className="apple-settings-content">
        <div className="apple-content-scroll">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'physics' && <PhysicsTab />}
          {activeTab === 'behavior' && <BehaviorTab />}
          {activeTab === 'sound' && <SoundTab />}
          {activeTab === 'about' && <AboutTab />}
        </div>
      </main>
    </div>
  );
};
