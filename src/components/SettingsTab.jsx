import React, { useState, useEffect } from 'react';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VibrationIcon from '@mui/icons-material/Vibration';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HistoryIcon from '@mui/icons-material/History';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

function SettingsTab({ isDark }) {
  // Settings state
  const [autoCopy, setAutoCopy] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoOpenUrl, setAutoOpenUrl] = useState(false);
  const [autoConnectWifi, setAutoConnectWifi] = useState(false);
  const [historyLimit, setHistoryLimit] = useState(5);
  const [defaultScanMode, setDefaultScanMode] = useState('auto');
  const [showNotifications, setShowNotifications] = useState(true);
  
  // Theme classes
  const cardClass = isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container';
  const primaryClass = isDark ? 'bg-md-dark-primary text-md-dark-on-primary' : 'bg-md-light-primary text-md-light-on-primary';
  const secondaryClass = isDark ? 'bg-md-dark-secondary-container text-md-dark-on-secondary-container' : 'bg-md-light-secondary-container text-md-light-on-secondary-container';
  const tertiaryClass = isDark ? 'bg-md-dark-tertiary-container text-md-dark-on-tertiary-container' : 'bg-md-light-tertiary-container text-md-light-on-tertiary-container';
  const textClass = isDark ? 'text-md-dark-on-surface' : 'text-md-light-on-surface';
  const textSecondaryClass = isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant';
  const outlineClass = isDark ? 'border-md-dark-outline' : 'border-md-light-outline';

  // Load settings on mount
  useEffect(() => {
    chrome.storage.local.get([
      'autoCopy',
      'soundEnabled',
      'vibrationEnabled',
      'autoOpenUrl',
      'autoConnectWifi',
      'historyLimit',
      'defaultScanMode',
      'showNotifications'
    ], (result) => {
      if (result.autoCopy !== undefined) setAutoCopy(result.autoCopy);
      if (result.soundEnabled !== undefined) setSoundEnabled(result.soundEnabled);
      if (result.vibrationEnabled !== undefined) setVibrationEnabled(result.vibrationEnabled);
      if (result.autoOpenUrl !== undefined) setAutoOpenUrl(result.autoOpenUrl);
      if (result.autoConnectWifi !== undefined) setAutoConnectWifi(result.autoConnectWifi);
      if (result.historyLimit !== undefined) setHistoryLimit(result.historyLimit);
      if (result.defaultScanMode !== undefined) setDefaultScanMode(result.defaultScanMode);
      if (result.showNotifications !== undefined) setShowNotifications(result.showNotifications);
    });
  }, []);

  // Save setting helper
  const saveSetting = (key, value) => {
    chrome.storage.local.set({ [key]: value });
  };

  // Toggle handlers
  const toggleAutoCopy = () => {
    const newValue = !autoCopy;
    setAutoCopy(newValue);
    saveSetting('autoCopy', newValue);
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    saveSetting('soundEnabled', newValue);
  };

  const toggleVibration = () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    saveSetting('vibrationEnabled', newValue);
  };

  const toggleAutoOpenUrl = () => {
    const newValue = !autoOpenUrl;
    setAutoOpenUrl(newValue);
    saveSetting('autoOpenUrl', newValue);
  };

  const toggleAutoConnectWifi = () => {
    const newValue = !autoConnectWifi;
    setAutoConnectWifi(newValue);
    saveSetting('autoConnectWifi', newValue);
  };

  const toggleNotifications = () => {
    const newValue = !showNotifications;
    setShowNotifications(newValue);
    saveSetting('showNotifications', newValue);
  };

  const testFeedback = () => {
    // Test sound
    if (soundEnabled) {
      playTestSound();
    }
    
    // Test vibration
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    // Test notification
    if (showNotifications) {
      alert('✓ Feedback test: Sound ' + (soundEnabled ? '✓' : '✗') + ', Vibration ' + (vibrationEnabled ? '✓' : '✗'));
    } else {
      alert('✓ Feedback test complete (notifications disabled)');
    }
  };

  const playTestSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing test sound:', error);
    }
  };

  const updateHistoryLimit = (value) => {
    const limit = parseInt(value, 10);
    setHistoryLimit(limit);
    saveSetting('historyLimit', limit);
  };

  const updateDefaultScanMode = (mode) => {
    setDefaultScanMode(mode);
    saveSetting('defaultScanMode', mode);
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all scan history?')) {
      chrome.storage.local.get(['scanHistory'], (result) => {
        if (result.scanHistory) {
          chrome.storage.local.set({ scanHistory: [] }, () => {
            alert('Scan history cleared!');
          });
        }
      });
    }
  };

  const resetAllSettings = () => {
    if (confirm('Reset all settings to default values?')) {
      setAutoCopy(false);
      setSoundEnabled(true);
      setVibrationEnabled(true);
      setAutoOpenUrl(false);
      setAutoConnectWifi(false);
      setHistoryLimit(5);
      setDefaultScanMode('auto');
      setShowNotifications(true);
      
      chrome.storage.local.set({
        autoCopy: false,
        soundEnabled: true,
        vibrationEnabled: true,
        autoOpenUrl: false,
        autoConnectWifi: false,
        historyLimit: 5,
        defaultScanMode: 'auto',
        showNotifications: true
      }, () => {
        alert('Settings reset to defaults!');
      });
    }
  };

  const openUserGuide = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('guide.html') });
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className={`text-headline-medium font-medium ${textClass} mb-2`}>Settings</h2>
          <p className={`text-body-medium ${textSecondaryClass}`}>
            Customize your QR Studio experience
          </p>
        </div>
        <button
          onClick={openUserGuide}
          className={`${primaryClass} px-4 py-2 rounded-md-full flex items-center gap-2 state-layer transition-all hover:shadow-md-2`}
          aria-label="Open user guide"
        >
          <HelpIcon />
          <span className="text-label-large font-medium">Help</span>
          <OpenInNewIcon fontSize="small" />
        </button>
      </div>

      {/* Scanning Settings */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-1`}>
        <h3 className={`text-title-large font-medium ${textClass} mb-4 flex items-center gap-2`}>
          <QrCodeIcon />
          Scanning
        </h3>

        {/* Auto Copy */}
        <div className="flex items-center justify-between py-3 border-b border-opacity-10 border-current">
          <div className="flex-1">
            <h4 className={`text-body-large font-medium ${textClass}`}>Auto-copy to clipboard</h4>
            <p className={`text-body-small ${textSecondaryClass} mt-1`}>
              Automatically copy scanned codes
            </p>
          </div>
          <button
            onClick={toggleAutoCopy}
            className={`${autoCopy ? primaryClass : secondaryClass} p-2 rounded-md-full state-layer transition-all`}
            aria-label="Toggle auto-copy"
          >
            {autoCopy ? <ToggleOnIcon sx={{ fontSize: 32 }} /> : <ToggleOffIcon sx={{ fontSize: 32 }} />}
          </button>
        </div>

        {/* Auto Open URLs */}
        <div className="flex items-center justify-between py-3 border-b border-opacity-10 border-current">
          <div className="flex-1">
            <h4 className={`text-body-large font-medium ${textClass}`}>Auto-open URLs</h4>
            <p className={`text-body-small ${textSecondaryClass} mt-1`}>
              Automatically open links when scanned
            </p>
          </div>
          <button
            onClick={toggleAutoOpenUrl}
            className={`${autoOpenUrl ? primaryClass : secondaryClass} p-2 rounded-md-full state-layer transition-all`}
            aria-label="Toggle auto-open URLs"
          >
            {autoOpenUrl ? <ToggleOnIcon sx={{ fontSize: 32 }} /> : <ToggleOffIcon sx={{ fontSize: 32 }} />}
          </button>
        </div>

        {/* Auto Connect WiFi */}
        <div className="flex items-center justify-between py-3 border-b border-opacity-10 border-current">
          <div className="flex-1">
            <h4 className={`text-body-large font-medium ${textClass}`}>Auto-connect WiFi</h4>
            <p className={`text-body-small ${textSecondaryClass} mt-1`}>
              Automatically show connection prompt for WiFi QR codes
            </p>
          </div>
          <button
            onClick={toggleAutoConnectWifi}
            className={`${autoConnectWifi ? primaryClass : secondaryClass} p-2 rounded-md-full state-layer transition-all`}
            aria-label="Toggle auto-connect WiFi"
          >
            {autoConnectWifi ? <ToggleOnIcon sx={{ fontSize: 32 }} /> : <ToggleOffIcon sx={{ fontSize: 32 }} />}
          </button>
        </div>

        {/* Default Scan Mode */}
        <div className="py-3">
          <h4 className={`text-body-large font-medium ${textClass} mb-3`}>Default scan mode</h4>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Default scan mode">
            {['auto', 'qr', 'barcode'].map((mode) => (
              <button
                key={mode}
                onClick={() => updateDefaultScanMode(mode)}
                role="radio"
                aria-checked={defaultScanMode === mode}
                className={`py-2 px-3 rounded-md-md text-label-large font-medium state-layer transition-all ${
                  defaultScanMode === mode ? primaryClass : secondaryClass
                }`}
              >
                {mode === 'auto' ? 'Auto' : mode === 'qr' ? 'QR Only' : 'Barcode'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Settings */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-1`}>
        <h3 className={`text-title-large font-medium ${textClass} mb-4 flex items-center gap-2`}>
          <VolumeUpIcon />
          Feedback
        </h3>

        {/* Sound Effects */}
        <div className="flex items-center justify-between py-3 border-b border-opacity-10 border-current">
          <div className="flex-1">
            <h4 className={`text-body-large font-medium ${textClass}`}>Sound effects</h4>
            <p className={`text-body-small ${textSecondaryClass} mt-1`}>
              Play sound when code is detected
            </p>
          </div>
          <button
            onClick={toggleSound}
            className={`${soundEnabled ? primaryClass : secondaryClass} p-2 rounded-md-full state-layer transition-all`}
            aria-label="Toggle sound effects"
          >
            {soundEnabled ? <VolumeUpIcon sx={{ fontSize: 28 }} /> : <VolumeOffIcon sx={{ fontSize: 28 }} />}
          </button>
        </div>

        {/* Vibration */}
        <div className="flex items-center justify-between py-3 border-b border-opacity-10 border-current">
          <div className="flex-1">
            <h4 className={`text-body-large font-medium ${textClass}`}>Vibration</h4>
            <p className={`text-body-small ${textSecondaryClass} mt-1`}>
              Vibrate on successful scan
            </p>
          </div>
          <button
            onClick={toggleVibration}
            className={`${vibrationEnabled ? primaryClass : secondaryClass} p-2 rounded-md-full state-layer transition-all`}
            aria-label="Toggle vibration"
          >
            {vibrationEnabled ? <VibrationIcon sx={{ fontSize: 28 }} /> : <ToggleOffIcon sx={{ fontSize: 28 }} />}
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between py-3">
          <div className="flex-1">
            <h4 className={`text-body-large font-medium ${textClass}`}>Notifications</h4>
            <p className={`text-body-small ${textSecondaryClass} mt-1`}>
              Show browser notifications
            </p>
          </div>
          <button
            onClick={toggleNotifications}
            className={`${showNotifications ? primaryClass : secondaryClass} p-2 rounded-md-full state-layer transition-all`}
            aria-label="Toggle notifications"
          >
            {showNotifications ? <ToggleOnIcon sx={{ fontSize: 32 }} /> : <ToggleOffIcon sx={{ fontSize: 32 }} />}
          </button>
        </div>

        {/* Test Feedback Button */}
        <div className="pt-3 mt-3 border-t border-opacity-10 border-current">
          <button
            onClick={testFeedback}
            className={`${tertiaryClass} py-3 px-4 rounded-md-full text-label-large font-medium state-layer w-full flex items-center justify-center gap-2`}
            aria-label="Test feedback settings"
          >
            <TipsAndUpdatesIcon />
            Test Feedback
          </button>
        </div>
      </div>

      {/* History Settings */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-1`}>
        <h3 className={`text-title-large font-medium ${textClass} mb-4 flex items-center gap-2`}>
          <HistoryIcon />
          History
        </h3>

        {/* History Limit */}
        <div className="py-3 border-b border-opacity-10 border-current">
          <h4 className={`text-body-large font-medium ${textClass} mb-3`}>History limit</h4>
          <p className={`text-body-small ${textSecondaryClass} mb-3`}>
            Number of recent scans to keep
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={historyLimit}
              onChange={(e) => updateHistoryLimit(e.target.value)}
              className="flex-1"
              aria-label="History limit slider"
            />
            <span className={`${primaryClass} py-2 px-4 rounded-md-full text-label-large font-medium min-w-[3rem] text-center`}>
              {historyLimit}
            </span>
          </div>
        </div>

        {/* Clear History */}
        <div className="pt-3">
          <button
            onClick={clearAllHistory}
            className={`${tertiaryClass} py-3 px-4 rounded-md-full text-label-large font-medium state-layer w-full flex items-center justify-center gap-2`}
            aria-label="Clear all scan history"
          >
            <DeleteIcon />
            Clear All History
          </button>
        </div>
      </div>

      {/* About & Actions */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-1`}>
        <h3 className={`text-title-large font-medium ${textClass} mb-4 flex items-center gap-2`}>
          <InfoIcon />
          About
        </h3>

        <div className="space-y-3">
          <div className={`p-4 rounded-md-lg ${isDark ? 'bg-md-dark-surface-variant' : 'bg-md-light-surface-variant'}`}>
            <p className={`text-body-medium ${textClass} mb-2`}>
              <strong>QR Studio</strong> v2.1.0
            </p>
            <p className={`text-body-small ${textSecondaryClass}`}>
              A modern QR code scanner and generator with advanced features and accessibility support.
            </p>
          </div>

          <button
            onClick={resetAllSettings}
            className={`${secondaryClass} py-3 px-4 rounded-md-full text-label-large font-medium state-layer w-full flex items-center justify-center gap-2`}
            aria-label="Reset all settings to defaults"
          >
            <RestartAltIcon />
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsTab;
