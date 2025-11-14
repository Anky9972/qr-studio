import React, { useState, useEffect } from 'react';
import ScanTab from './components/ScanTab';
import GenerateTab from './components/GenerateTab';
import HistoryTab from './components/HistoryTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CreateIcon from '@mui/icons-material/Create';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [theme, setTheme] = useState('dark');
  const [initialBulk, setInitialBulk] = useState(false);

  // Read URL params to optionally force a tab and enable bulk mode when opened in a full tab
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const bulkParam = params.get('bulk');

      if (tabParam && ['scan', 'generate', 'history', 'analytics', 'settings'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
      if (bulkParam === '1' || bulkParam === 'true') {
        setInitialBulk(true);
        // Ensure we land on Generate if bulk requested
        setActiveTab('generate');
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    // Load theme from storage
    chrome.storage.local.get(['theme'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
      }
    });

    // Check for pending actions
    chrome.storage.local.get(['pendingGenerate'], (result) => {
      if (result.pendingGenerate) {
        setActiveTab('generate');
      }
    });

    // Listen for keyboard shortcuts
    chrome.commands.onCommand.addListener((command) => {
      if (command === 'focus-generate') {
        setActiveTab('generate');
      }
    });

    // Add keyboard navigation for tabs
    const handleKeyDown = (event) => {
      const tabs = ['scan', 'generate', 'history', 'analytics', 'settings'];
      const currentIndex = tabs.indexOf(activeTab);

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveTab('scan');
            break;
          case '2':
            event.preventDefault();
            setActiveTab('generate');
            break;
          case '3':
            event.preventDefault();
            setActiveTab('history');
            break;
          case '4':
            event.preventDefault();
            setActiveTab('analytics');
            break;
          case '5':
            event.preventDefault();
            setActiveTab('settings');
            break;
          case 'ArrowLeft':
            event.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            setActiveTab(tabs[prevIndex]);
            break;
          case 'ArrowRight':
            event.preventDefault();
            const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            setActiveTab(tabs[nextIndex]);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-md-dark-background' : 'bg-md-light-background';
  const surfaceClass = isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container';
  const textClass = isDark ? 'text-md-dark-on-background' : 'text-md-light-on-background';
  const primaryClass = isDark ? 'text-md-dark-primary' : 'text-md-light-primary';

  return (
    <div className={`${bgClass} ${textClass} min-h-[550px] flex flex-col`} role="application" aria-label="QR Studio Extension">
      {/* Material 3 App Bar */}
      <div className={`${isDark ? 'bg-md-dark-surface-container-low' : 'bg-md-light-surface-container-low'} px-4 py-4 flex items-center justify-between shadow-md-2`} role="banner">
        <div className="flex items-center gap-3">
          <QrCodeScannerIcon className={primaryClass} sx={{ fontSize: 28 }} />
          <h1 className="text-title-large font-medium" id="app-title">QR Studio</h1>
        </div>
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className={`p-2 rounded-md-full state-layer ${primaryClass} transition-all`}
          title="Toggle theme"
        >
          {isDark ? <LightModeIcon sx={{ fontSize: 24 }} /> : <DarkModeIcon sx={{ fontSize: 24 }} />}
        </button>
      </div>

      {/* Material 3 Navigation Bar */}
      <div className={`${isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'} flex justify-around items-center py-2 shadow-md-1`} role="tablist" aria-label="Main navigation">
        <NavButton
          active={activeTab === 'scan'}
          onClick={() => setActiveTab('scan')}
          icon={<QrCodeScannerIcon sx={{ fontSize: 24 }} />}
          label="Scan"
          theme={theme}
        />
        <NavButton
          active={activeTab === 'generate'}
          onClick={() => setActiveTab('generate')}
          icon={<CreateIcon sx={{ fontSize: 24 }} />}
          label="Generate"
          theme={theme}
        />
        <NavButton
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          icon={<HistoryIcon sx={{ fontSize: 24 }} />}
          label="History"
          theme={theme}
        />
        <NavButton
          active={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
          icon={<BarChartIcon sx={{ fontSize: 24 }} />}
          label="Analytics"
          theme={theme}
        />
        <NavButton
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
          icon={<SettingsIcon sx={{ fontSize: 24 }} />}
          label="Settings"
          theme={theme}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'scan' && <ScanTab theme={theme} />}
        {activeTab === 'generate' && <GenerateTab theme={theme} initialBulk={initialBulk} />}
        {activeTab === 'history' && <HistoryTab theme={theme} />}
        {activeTab === 'analytics' && <AnalyticsTab theme={theme} />}
        {activeTab === 'settings' && <SettingsTab isDark={isDark} />}
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, theme }) {
  const isDark = theme === 'dark';
  const activeClass = active 
    ? isDark 
      ? 'bg-md-dark-secondary-container text-md-dark-on-secondary-container' 
      : 'bg-md-light-secondary-container text-md-light-on-secondary-container'
    : isDark
      ? 'text-md-dark-on-surface-variant'
      : 'text-md-light-on-surface-variant';

  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      aria-label={label}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md-md state-layer transition-all min-w-[64px] ${activeClass}`}
    >
      <div className={active ? 'scale-110' : 'scale-100'}>
        {icon}
      </div>
      <span className="text-label-medium">{label}</span>
    </button>
  );
}

export default App;
