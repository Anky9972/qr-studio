import React, { useState, useEffect } from 'react';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListIcon from '@mui/icons-material/FilterList';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SmsIcon from '@mui/icons-material/Sms';
import WifiIcon from '@mui/icons-material/Wifi';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { parseQRContent } from '../utils/qrParsers';

function HistoryTab({ theme }) {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayLimit, setDisplayLimit] = useState(10);
  const [editingNote, setEditingNote] = useState(null);
  const [editingTags, setEditingTags] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [tagText, setTagText] = useState('');

  const isDark = theme === 'dark';
  const surfaceClass = isDark ? 'bg-md-dark-surface-container-high' : 'bg-md-light-surface-container-high';
  const cardClass = isDark ? 'bg-md-dark-surface-container-highest' : 'bg-md-light-surface-container-highest';
  const primaryClass = isDark ? 'bg-md-dark-primary text-md-dark-on-primary' : 'bg-md-light-primary text-md-light-on-primary';
  const secondaryClass = isDark ? 'bg-md-dark-secondary-container text-md-dark-on-secondary-container' : 'bg-md-light-secondary-container text-md-light-on-secondary-container';
  const tertiaryClass = isDark ? 'bg-md-dark-tertiary-container text-md-dark-on-tertiary-container' : 'bg-md-light-tertiary-container text-md-light-on-tertiary-container';
  const textClass = isDark ? 'text-md-dark-on-surface' : 'text-md-light-on-surface';
  const textSecondaryClass = isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant';
  const outlineClass = isDark ? 'border-md-dark-outline' : 'border-md-light-outline';
  const errorClass = isDark ? 'bg-md-dark-error-container text-md-dark-on-error-container' : 'bg-md-light-error-container text-md-light-on-error-container';
  const inputBgClass = isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container';

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    chrome.storage.local.get(['history'], (result) => {
      let history = result.history || [];
      
      // Clean up any invalid data and migrate to new format
      history = history
        .filter(item => item && (item.data || item.text)) // Remove invalid entries
        .map(item => {
          // Extract actual string value, handle [object Object] cases
          let dataValue = item.data || item.text || '';
          
          // If it's an object, try to extract meaningful text
          if (typeof dataValue === 'object') {
            dataValue = dataValue.text || dataValue.data || JSON.stringify(dataValue);
          }
          
          // Convert to string
          dataValue = String(dataValue);
          
          // Normalize type: convert 'qr' and 'barcode' to 'scan'
          let typeValue = String(item.type || 'unknown');
          if (typeValue === 'qr' || typeValue === 'barcode') {
            typeValue = 'scan';
          }
          
          return {
            ...item,
            data: dataValue,
            type: typeValue,
            format: String(item.format || 'unknown'),
            source: String(item.source || 'unknown'),
            favorite: Boolean(item.favorite),
            tags: Array.isArray(item.tags) ? item.tags : [],
            note: String(item.note || ''),
            count: Number(item.count) || 1,
            firstSeen: item.firstSeen || item.timestamp || Date.now(),
            lastSeen: item.lastSeen || item.timestamp || Date.now(),
            timestamp: item.timestamp || Date.now(),
          };
        });
      
      // Save cleaned data back to storage
      chrome.storage.local.set({ history }, () => {
        setHistory(history);
      });
    });
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      chrome.storage.local.set({ history: [] }, () => {
        setHistory([]);
      });
    }
  };

  const deleteItem = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    chrome.storage.local.set({ history: newHistory }, () => {
      setHistory(newHistory);
    });
  };

  const toggleFavorite = (index) => {
    const newHistory = [...history];
    newHistory[index].favorite = !newHistory[index].favorite;
    chrome.storage.local.set({ history: newHistory }, () => {
      setHistory(newHistory);
    });
  };

  const startEditingNote = (index) => {
    setEditingNote(index);
    setNoteText(history[index].note || '');
  };

  const saveNote = (index) => {
    const newHistory = [...history];
    newHistory[index].note = noteText.trim();
    chrome.storage.local.set({ history: newHistory }, () => {
      setHistory(newHistory);
      setEditingNote(null);
      setNoteText('');
    });
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setNoteText('');
  };

  const startEditingTags = (index) => {
    setEditingTags(index);
    setTagText(history[index].tags.join(', '));
  };

  const saveTags = (index) => {
    const newHistory = [...history];
    newHistory[index].tags = tagText.split(',').map(tag => tag.trim()).filter(tag => tag);
    chrome.storage.local.set({ history: newHistory }, () => {
      setHistory(newHistory);
      setEditingTags(null);
      setTagText('');
    });
  };

  const cancelEditingTags = () => {
    setEditingTags(null);
    setTagText('');
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qr-history-${Date.now()}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Type', 'Data', 'Timestamp', 'Favorite', 'Tags', 'Note', 'Count', 'First Seen', 'Last Seen'].join(','),
      ...history.map(item => [
        String(item.type || 'unknown'),
        `"${String(item.data || '').replace(/"/g, '""')}"`,
        item.timestamp ? new Date(item.timestamp).toISOString() : 'Unknown',
        item.favorite ? 'Yes' : 'No',
        `"${(item.tags || []).join('; ').replace(/"/g, '""')}"`,
        `"${String(item.note || '').replace(/"/g, '""')}"`,
        item.count || 1,
        item.firstSeen ? new Date(item.firstSeen).toISOString() : 'Unknown',
        item.lastSeen ? new Date(item.lastSeen).toISOString() : 'Unknown',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qr-history-${Date.now()}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleItemClick = (item) => {
    // This is now just for clicking the data text
    const dataText = String(item.data || item.text || '');
    navigator.clipboard.writeText(dataText).then(() => {
      const msg = dataText.length > 30 ? dataText.substring(0, 30) + '...' : dataText;
      alert(`Copied: ${msg}`);
    });
  };

  const openLink = (url) => {
    chrome.tabs.create({ url });
  };

  const downloadQRImage = (item) => {
    if (item.imageURL) {
      const link = document.createElement('a');
      link.download = `qr-code-${item.timestamp}.png`;
      link.href = item.imageURL;
      link.click();
    }
  };

  const filteredHistory = history.filter(item => {
    const itemType = String(item.type || 'unknown');
    const matchesFilter = filter === 'all' || itemType === filter;
    const itemData = String(item.data || item.text || '');
    const itemTags = (item.tags || []).join(' ');
    const itemNote = item.note || '';
    const searchContent = `${itemData} ${itemTags} ${itemNote}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-4">
      {/* Search Bar */}
      <div className={`${cardClass} p-4 rounded-md-xl shadow-md-2`}>
        <div className="relative">
          <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondaryClass}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history..."
            className={`w-full ${inputBgClass} ${textClass} pl-12 pr-4 py-3 rounded-md-full text-body-medium focus:outline-none border-2 ${outlineClass} focus:border-4 transition-all`}
            style={{ transition: 'border-width 200ms cubic-bezier(0.2, 0, 0, 1)' }}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className={`${cardClass} p-4 rounded-md-lg shadow-md-1`}>
        <div className="flex items-center gap-2 mb-3">
          <FilterListIcon className={textSecondaryClass} fontSize="small" />
          <span className={`text-title-small font-medium ${textClass}`}>Filter</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`py-2 px-4 rounded-md-full text-label-large font-medium transition-all state-layer ${
              filter === 'all' ? primaryClass : secondaryClass
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('scan')}
            className={`py-2 px-4 rounded-md-full text-label-large font-medium transition-all state-layer flex items-center gap-1 ${
              filter === 'scan' ? primaryClass : secondaryClass
            }`}
          >
            <QrCodeScannerIcon fontSize="small" />
            Scanned
          </button>
          <button
            onClick={() => setFilter('generate')}
            className={`py-2 px-4 rounded-md-full text-label-large font-medium transition-all state-layer flex items-center gap-1 ${
              filter === 'generate' ? primaryClass : secondaryClass
            }`}
          >
            <QrCodeIcon fontSize="small" />
            Generated
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {history.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={exportToJSON}
            className={`${secondaryClass} py-3 px-4 rounded-md-lg font-medium state-layer flex items-center justify-center gap-2 shadow-md-1`}
          >
            <FileDownloadIcon fontSize="small" />
            <span className="text-label-large">JSON</span>
          </button>
          <button
            onClick={exportToCSV}
            className={`${secondaryClass} py-3 px-4 rounded-md-lg font-medium state-layer flex items-center justify-center gap-2 shadow-md-1`}
          >
            <FileDownloadIcon fontSize="small" />
            <span className="text-label-large">CSV</span>
          </button>
          <button
            onClick={clearHistory}
            className={`${errorClass} py-3 px-4 rounded-md-lg font-medium state-layer flex items-center justify-center gap-2 shadow-md-1`}
          >
            <DeleteSweepIcon fontSize="small" />
            <span className="text-label-large">Clear</span>
          </button>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className={`${cardClass} p-12 rounded-md-xl text-center shadow-md-1`}>
            <HistoryIcon className={textSecondaryClass} sx={{ fontSize: 64 }} />
            <p className={`text-title-medium ${textSecondaryClass} mt-4`}>
              {history.length === 0 ? 'No history yet' : 'No results found'}
            </p>
            <p className={`text-body-medium ${textSecondaryClass} mt-2`}>
              {history.length === 0 
                ? 'Scan or generate QR codes to see them here'
                : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          <>
            {filteredHistory.slice(0, displayLimit).map((item, index) => (
              <div
                key={index}
                className={`${cardClass} rounded-md-xl p-4 shadow-md-2 transition-all hover:shadow-md-3 group animate-fade-in`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 ${secondaryClass} rounded-md-full flex items-center justify-center`}>
                    {item.type === 'scan' ? (
                      <QrCodeScannerIcon />
                    ) : (
                      <QrCodeIcon />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className={`font-mono text-body-medium break-all line-clamp-2 ${textClass}`}>
                          {String(item.data || item.text || '')}
                        </p>
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className={`text-label-small px-2 py-1 rounded-md-full ${tertiaryClass}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Note */}
                        {item.note && (
                          <p className={`text-body-small ${textSecondaryClass} mt-1 italic`}>
                            {item.note}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(index)}
                          className={`p-2 rounded-md-full state-layer transition-all ${
                            item.favorite ? 'text-yellow-500' : textSecondaryClass
                          }`}
                          title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {item.favorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                        </button>
                        <button
                          onClick={() => startEditingTags(index)}
                          className={`p-2 rounded-md-full state-layer transition-all ${textSecondaryClass}`}
                          title="Edit tags"
                        >
                          <LocalOfferIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => startEditingNote(index)}
                          className={`p-2 rounded-md-full state-layer transition-all ${textSecondaryClass}`}
                          title="Edit note"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => deleteItem(index)}
                          className={`flex-shrink-0 opacity-0 group-hover:opacity-100 ${errorClass} p-2 rounded-md-full state-layer transition-all`}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Inline Editors */}
                    {editingTags === index && (
                      <div className="mb-2 flex gap-2">
                        <input
                          type="text"
                          value={tagText}
                          onChange={(e) => setTagText(e.target.value)}
                          placeholder="Enter tags separated by commas"
                          className={`flex-1 ${inputBgClass} ${textClass} px-3 py-2 rounded-md-full text-body-medium focus:outline-none border-2 ${outlineClass} focus:border-4 transition-all`}
                          autoFocus
                        />
                        <button
                          onClick={() => saveTags(index)}
                          className={`${primaryClass} p-2 rounded-md-full state-layer`}
                          title="Save tags"
                        >
                          <CheckIcon fontSize="small" />
                        </button>
                        <button
                          onClick={cancelEditingTags}
                          className={`${errorClass} p-2 rounded-md-full state-layer`}
                          title="Cancel"
                        >
                          <CloseIcon fontSize="small" />
                        </button>
                      </div>
                    )}
                    
                    {editingNote === index && (
                      <div className="mb-2 flex gap-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Enter a note..."
                          rows={2}
                          className={`flex-1 ${inputBgClass} ${textClass} px-3 py-2 rounded-md-lg text-body-medium focus:outline-none border-2 ${outlineClass} focus:border-4 transition-all resize-none`}
                          autoFocus
                        />
                        <button
                          onClick={() => saveNote(index)}
                          className={`${primaryClass} p-2 rounded-md-full state-layer`}
                          title="Save note"
                        >
                          <CheckIcon fontSize="small" />
                        </button>
                        <button
                          onClick={cancelEditingNote}
                          className={`${errorClass} p-2 rounded-md-full state-layer`}
                          title="Cancel"
                        >
                          <CloseIcon fontSize="small" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-label-small ${textSecondaryClass}`}>
                        {formatTimestamp(item.lastSeen || item.timestamp)}
                      </span>
                      {item.count > 1 && (
                        <span className={`text-label-small px-2 py-1 rounded-md-full ${secondaryClass}`}>
                          {item.count} times
                        </span>
                      )}
                      <span className={`text-label-small px-3 py-1 rounded-md-full ${
                        item.type === 'scan' ? tertiaryClass : secondaryClass
                      }`}>
                        {String(item.type || 'unknown')}
                      </span>
                      {item.favorite && (
                        <StarIcon className="text-yellow-500" fontSize="small" />
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {(() => {
                        const parsed = parseQRContent(item.data);
                        return parsed.actions.map((action, actionIndex) => {
                          const getIcon = () => {
                            switch (action.icon) {
                              case 'open': return <OpenInNewIcon fontSize="small" />;
                              case 'copy': return <ContentCopyIcon fontSize="small" />;
                              case 'email': return <EmailIcon fontSize="small" />;
                              case 'phone': return <PhoneIcon fontSize="small" />;
                              case 'sms': return <SmsIcon fontSize="small" />;
                              case 'wifi': return <WifiIcon fontSize="small" />;
                              case 'location': return <LocationOnIcon fontSize="small" />;
                              case 'contact': return <PersonIcon fontSize="small" />;
                              case 'calendar': return <EventIcon fontSize="small" />;
                              case 'crypto': return <CurrencyBitcoinIcon fontSize="small" />;
                              default: return <ContentCopyIcon fontSize="small" />;
                            }
                          };
                          
                          const buttonClass = action.type === 'open' || action.type === 'compose' || action.type === 'call' || action.type === 'send' 
                            ? primaryClass 
                            : action.type === 'connect' || action.type === 'save' || action.type === 'add'
                            ? tertiaryClass
                            : secondaryClass;
                            
                          return (
                            <button
                              key={actionIndex}
                              onClick={() => {
                                try {
                                  action.handler();
                                } catch (err) {
                                  console.error('Action failed:', err);
                                  alert('Action failed: ' + err.message);
                                }
                              }}
                              className={`${buttonClass} py-2 px-4 rounded-md-full font-medium state-layer flex items-center gap-1 text-label-medium shadow-md-1`}
                            >
                              {getIcon()}
                              {action.label}
                            </button>
                          );
                        });
                      })()}
                      {item.type === 'generate' && item.imageURL && (
                        <button
                          onClick={() => downloadQRImage(item)}
                          className={`${secondaryClass} py-2 px-4 rounded-md-full font-medium state-layer flex items-center gap-1 text-label-medium`}
                        >
                          <FileDownloadIcon fontSize="small" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {filteredHistory.length > displayLimit && (
              <button
                onClick={() => setDisplayLimit(prev => prev + 10)}
                className={`w-full ${secondaryClass} py-4 px-4 rounded-md-full font-medium state-layer text-label-large shadow-md-1`}
              >
                Load More ({filteredHistory.length - displayLimit} remaining)
              </button>
            )}
          </>
        )}
      </div>

      {/* Info */}
      {history.length > 0 && (
        <p className={`text-label-medium ${textSecondaryClass} text-center`}>
          Showing {Math.min(displayLimit, filteredHistory.length)} of {filteredHistory.length} items
          {filteredHistory.length !== history.length && ` (${history.length} total)`}
        </p>
      )}
    </div>
  );
}

export default HistoryTab;
