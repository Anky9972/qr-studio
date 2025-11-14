import React, { useState, useEffect } from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import HistoryIcon from '@mui/icons-material/History';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

function AnalyticsTab({ theme }) {
  const [stats, setStats] = useState({
    totalScans: 0,
    totalGenerations: 0,
    totalHistoryItems: 0,
    firstUse: null,
    lastUse: null,
    mostUsedFeature: '',
    averageSessionTime: 0,
  });

  const isDark = theme === 'dark';
  const surfaceClass = isDark ? 'bg-md-dark-surface-container-high' : 'bg-md-light-surface-container-high';
  const cardClass = isDark ? 'bg-md-dark-surface-container-highest' : 'bg-md-light-surface-container-highest';
  const primaryClass = isDark ? 'bg-md-dark-primary text-md-dark-on-primary' : 'bg-md-light-primary text-md-light-on-primary';
  const secondaryClass = isDark ? 'bg-md-dark-secondary-container text-md-dark-on-secondary-container' : 'bg-md-light-secondary-container text-md-light-on-secondary-container';
  const errorClass = isDark ? 'bg-md-dark-error-container text-md-dark-on-error-container' : 'bg-md-light-error-container text-md-light-on-error-container';
  const textClass = isDark ? 'text-md-dark-on-surface' : 'text-md-light-on-surface';
  const textSecondaryClass = isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant';
  const outlineClass = isDark ? 'border-md-dark-outline' : 'border-md-light-outline';

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    chrome.storage.local.get(['history', 'analytics'], (result) => {
      const history = result.history || [];
      const analytics = result.analytics || {
        scans: 0,
        generations: 0,
        sessions: [],
        firstUse: Date.now(),
        lastUse: Date.now(),
      };

      // Calculate stats from history
      const scans = history.filter(item => item.type === 'scan').length;
      const generations = history.filter(item => item.type === 'generate').length;

      // Update analytics
      const updatedAnalytics = {
        ...analytics,
        scans: Math.max(analytics.scans, scans),
        generations: Math.max(analytics.generations, generations),
        lastUse: Date.now(),
      };

      // Save updated analytics
      chrome.storage.local.set({ analytics: updatedAnalytics });

      setStats({
        totalScans: updatedAnalytics.scans,
        totalGenerations: updatedAnalytics.generations,
        totalHistoryItems: history.length,
        firstUse: updatedAnalytics.firstUse,
        lastUse: updatedAnalytics.lastUse,
        mostUsedFeature: updatedAnalytics.scans > updatedAnalytics.generations ? 'Scanning' : 'Generation',
        averageSessionTime: 0, // Could be calculated from session data
      });
    });
  };

  const resetAnalytics = () => {
    if (confirm('Are you sure you want to reset all analytics data?')) {
      chrome.storage.local.set({
        analytics: {
          scans: 0,
          generations: 0,
          sessions: [],
          firstUse: Date.now(),
          lastUse: Date.now(),
        }
      }, () => {
        loadAnalytics();
      });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleDateString();
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className={`${surfaceClass} p-6 h-full overflow-y-auto space-y-4`}>
      {/* Header */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 animate-fade-in`}>
        <div className="flex items-center gap-3 mb-2">
          <BarChartIcon className={textClass} />
          <h2 className={`text-title-large font-medium ${textClass}`}>Usage Analytics</h2>
        </div>
        <p className={`text-body-medium ${textSecondaryClass}`}>
          Track your QR code scanning and generation activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className={`${cardClass} p-4 rounded-md-lg shadow-md-1 state-layer`}>
          <div className="flex items-center gap-2 mb-2">
            <QrCodeScannerIcon className="text-md-dark-primary" fontSize="small" />
            <div className={`text-display-small font-medium ${textClass}`}>
              {formatNumber(stats.totalScans)}
            </div>
          </div>
          <div className={`text-label-medium ${textSecondaryClass}`}>Total Scans</div>
        </div>

        <div className={`${cardClass} p-4 rounded-md-lg shadow-md-1 state-layer`}>
          <div className="flex items-center gap-2 mb-2">
            <QrCode2Icon className="text-md-dark-tertiary" fontSize="small" />
            <div className={`text-display-small font-medium ${textClass}`}>
              {formatNumber(stats.totalGenerations)}
            </div>
          </div>
          <div className={`text-label-medium ${textSecondaryClass}`}>Generations</div>
        </div>

        <div className={`${cardClass} p-4 rounded-md-lg shadow-md-1 state-layer`}>
          <div className="flex items-center gap-2 mb-2">
            <HistoryIcon className="text-md-dark-secondary" fontSize="small" />
            <div className={`text-display-small font-medium ${textClass}`}>
              {formatNumber(stats.totalHistoryItems)}
            </div>
          </div>
          <div className={`text-label-medium ${textSecondaryClass}`}>History Items</div>
        </div>

        <div className={`${cardClass} p-4 rounded-md-lg shadow-md-1 state-layer`}>
          <div className="flex items-center gap-2 mb-2">
            <WhatshotIcon className="text-orange-500" fontSize="small" />
            <div className={`text-title-medium font-medium ${textClass}`}>
              {String(stats.mostUsedFeature || 'N/A')}
            </div>
          </div>
          <div className={`text-label-medium ${textSecondaryClass}`}>Most Used</div>
        </div>
      </div>

      {/* Usage Timeline */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 animate-slide-up`} style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <CalendarTodayIcon fontSize="small" className={textClass} />
          <h3 className={`text-title-medium font-medium ${textClass}`}>Usage Timeline</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-body-medium ${textSecondaryClass}`}>First Use</span>
            <span className={`text-body-medium font-medium ${textClass}`}>{formatDate(stats.firstUse)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-body-medium ${textSecondaryClass}`}>Last Use</span>
            <span className={`text-body-medium font-medium ${textClass}`}>{formatDate(stats.lastUse)}</span>
          </div>
        </div>
      </div>

      {/* Feature Usage Breakdown */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 animate-slide-up`} style={{ animationDelay: '300ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <WhatshotIcon fontSize="small" className={textClass} />
          <h3 className={`text-title-medium font-medium ${textClass}`}>Feature Usage</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className={`flex justify-between text-body-medium mb-2 ${textClass}`}>
              <div className="flex items-center gap-2">
                <QrCodeScannerIcon fontSize="small" className="text-md-dark-primary" />
                <span>QR Scanning</span>
              </div>
              <span className="font-medium">{stats.totalScans} times</span>
            </div>
            <div className={`w-full ${isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'} rounded-md-full h-2 overflow-hidden`}>
              <div
                className="bg-md-dark-primary h-2 rounded-md-full transition-all duration-300 ease-spring"
                style={{
                  width: `${stats.totalScans + stats.totalGenerations > 0 ? (stats.totalScans / (stats.totalScans + stats.totalGenerations)) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className={`flex justify-between text-body-medium mb-2 ${textClass}`}>
              <div className="flex items-center gap-2">
                <QrCode2Icon fontSize="small" className="text-md-dark-tertiary" />
                <span>QR Generation</span>
              </div>
              <span className="font-medium">{stats.totalGenerations} times</span>
            </div>
            <div className={`w-full ${isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'} rounded-md-full h-2 overflow-hidden`}>
              <div
                className="bg-md-dark-tertiary h-2 rounded-md-full transition-all duration-300 ease-spring"
                style={{
                  width: `${stats.totalScans + stats.totalGenerations > 0 ? (stats.totalGenerations / (stats.totalScans + stats.totalGenerations)) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 animate-slide-up`} style={{ animationDelay: '400ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon fontSize="small" className={textClass} />
          <h3 className={`text-title-medium font-medium ${textClass}`}>Settings</h3>
        </div>
        <div className="space-y-3">
          <button
            onClick={resetAnalytics}
            className={`w-full ${errorClass} py-3 px-4 rounded-md-lg font-medium text-label-large state-layer flex items-center justify-center gap-2 transition-all hover:shadow-md-1`}
          >
            <RestartAltIcon fontSize="small" />
            Reset Analytics
          </button>
          <p className={`text-body-small ${textSecondaryClass}`}>
            This will reset all usage statistics but keep your history intact.
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 animate-slide-up`} style={{ animationDelay: '500ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <TipsAndUpdatesIcon fontSize="small" className={textClass} />
          <h3 className={`text-title-medium font-medium ${textClass}`}>Tips</h3>
        </div>
        <ul className={`text-body-medium ${textSecondaryClass} space-y-2`}>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Use the extension regularly to build up your statistics</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Export your history to keep backups of your QR codes</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Try different QR types to explore all features</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Analytics help you understand your usage patterns</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AnalyticsTab;