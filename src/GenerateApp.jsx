import React, { useState, useEffect } from 'react';
import GenerateTab from './components/GenerateTab';
import BuyMeCoffeeWidget from './components/BuyMeCoffeeWidget';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

function GenerateApp() {
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
  const bgClass = isDark ? 'bg-md-dark-background' : 'bg-md-light-background';
  const textClass = isDark ? 'text-md-dark-on-background' : 'text-md-light-on-background';
  const primaryClass = isDark ? 'text-md-dark-primary' : 'text-md-light-primary';

  return (
    <div className={`${bgClass} ${textClass} min-h-screen`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-md-dark-surface-container-low' : 'bg-md-light-surface-container-low'} px-8 py-5 flex items-center justify-between shadow-md-2 sticky top-0 z-50 backdrop-blur-md bg-opacity-95`}>
        <div className="flex items-center gap-4">
          <QrCodeScannerIcon className={primaryClass} sx={{ fontSize: 36 }} />
          <div>
            <h1 className="text-headline-small font-bold">QR Studio</h1>
            <p className="text-body-small opacity-70">Professional QR Code Generator</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className={`p-3 rounded-full state-layer ${primaryClass} transition-all hover:scale-110`}
          title="Toggle theme"
        >
          {isDark ? <LightModeIcon sx={{ fontSize: 24 }} /> : <DarkModeIcon sx={{ fontSize: 24 }} />}
        </button>
      </div>

      {/* Main Content with Web Page Layout */}
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <GenerateTab theme={theme} fullWidth={true} hideToggle={true} />
      </div>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-md-dark-surface-container-low' : 'bg-md-light-surface-container-low'} mt-16 py-6 px-8 border-t ${isDark ? 'border-md-dark-outline' : 'border-md-light-outline'}`}>
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <p className="text-body-medium font-medium">QR Studio Extension</p>
            <p className="text-body-small opacity-60">Create beautiful, customizable QR codes instantly</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className={`text-body-small ${primaryClass} hover:underline`}>Help</a>
            <a href="#" className={`text-body-small ${primaryClass} hover:underline`}>Privacy</a>
            <a href="#" className={`text-body-small ${primaryClass} hover:underline`}>About</a>
          </div>
        </div>
      </footer>

      {/* Buy Me Coffee Widget */}
      <BuyMeCoffeeWidget variant="floating" />
    </div>
  );
}

export default GenerateApp;
