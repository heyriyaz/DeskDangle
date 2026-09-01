import React, { useEffect, useState } from 'react';
import { DangleCanvas } from './components/DangleCanvas';
import { SettingsApp } from './components/settings/SettingsApp';

export const App: React.FC = () => {
  const [route, setRoute] = useState<string>(() => window.location.hash || '');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#settings') {
    return <SettingsApp />;
  }

  return (
    <div className="dangle-app">
      <DangleCanvas />
    </div>
  );
};
