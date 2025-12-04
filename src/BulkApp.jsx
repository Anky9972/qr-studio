import React, { useState, useEffect } from 'react';
import AdvancedBulkTab from './components/AdvancedBulkTab';
import BuyMeCoffeeWidget from './components/BuyMeCoffeeWidget';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import QrCode2Icon from '@mui/icons-material/QrCode2';

function BulkApp() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Load theme from storage
    chrome.storage.local.get(['theme'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-md-dark-surface' : 'bg-md-light-surface';
  const surfaceClass = isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container';
  const textClass = isDark ? 'text-md-dark-on-surface' : 'text-md-light-on-surface';
  const primaryClass = isDark ? 'bg-md-dark-primary text-md-dark-on-primary' : 'bg-md-light-primary text-md-light-on-primary';
  const primaryContainerClass = isDark ? 'bg-md-dark-primary-container text-md-dark-on-primary-container' : 'bg-md-light-primary-container text-md-light-on-primary-container';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass}`}>
      {/* Header */}
      <header className={`${surfaceClass} shadow-md-2 sticky top-0 z-50 border-b ${isDark ? 'border-md-dark-outline' : 'border-md-light-outline'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className={`${primaryClass} p-2.5 rounded-xl shadow-md-2`}>
                <QrCode2Icon sx={{ fontSize: 32 }} />
              </div>
              <div>
                <h1 className="text-title-large font-bold">QR Studio - Bulk Generator</h1>
                <p className="text-body-small opacity-70">Generate multiple QR codes at once</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full ${surfaceClass} hover:opacity-80 transition-all state-layer shadow-md-1`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="max-w-[1600px] mx-auto">
        {/* Generate Component - Full Width, No Container */}
        <AdvancedBulkTab theme={theme} />
      </main>

      {/* Footer */}
      <footer className={`${surfaceClass} mt-12 py-8 border-t ${isDark ? 'border-md-dark-outline' : 'border-md-light-outline'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-body-medium opacity-70">
              QR Studio Extension - Fast, Private, and Beautiful QR Code Generation
            </p>
            <div className="flex items-center gap-4 text-body-small opacity-70">
              <span>Max file size: 10MB</span>
              <span>•</span>
              <span>Max items: 2000 per batch</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Buy Me Coffee Widget - Always visible floating button */}
      <BuyMeCoffeeWidget variant="floating" />
    </div>
  );
}

export default BulkApp;
