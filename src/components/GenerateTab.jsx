import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import Papa from 'papaparse';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WifiIcon from '@mui/icons-material/Wifi';
import LinkIcon from '@mui/icons-material/Link';
import ContactsIcon from '@mui/icons-material/Contacts';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PaletteIcon from '@mui/icons-material/Palette';
import TuneIcon from '@mui/icons-material/Tune';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import PaymentIcon from '@mui/icons-material/Payment';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ShopIcon from '@mui/icons-material/Shop';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CodeIcon from '@mui/icons-material/Code';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import GradientIcon from '@mui/icons-material/Gradient';
import PatternIcon from '@mui/icons-material/Pattern';
import { trackAnalytics } from '../utils/analytics';

function GenerateTab({ theme, initialBulk = false, hideToggle = false, fullWidth = false }) {
  const [inputText, setInputText] = useState('');
  const [qrSize, setQrSize] = useState(512);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [qrDataURL, setQrDataURL] = useState('');
  const [generating, setGenerating] = useState(false);
  const [bulkMode, setBulkMode] = useState(initialBulk);
  const [bulkData, setBulkData] = useState([]);
  const [bulkResults, setBulkResults] = useState([]);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0); // Track progress percentage
  const [bulkCancelled, setBulkCancelled] = useState(false); // Track if user cancelled
  const cancelledRef = useRef(false); // Use ref for immediate cancellation check
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [logoImage, setLogoImage] = useState(null);
  const [logoSize, setLogoSize] = useState(0.2); // 20% of QR code size
  const [notification, setNotification] = useState(null); // {type: 'error'|'success', message: string}
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  
  // Advanced styling options
  const [qrPattern, setQrPattern] = useState('square'); // square, dots, rounded
  const [frameStyle, setFrameStyle] = useState('none'); // none, text, decorative
  const [frameText, setFrameText] = useState('Scan Me');
  const [exportFormat, setExportFormat] = useState('png'); // png, svg, pdf, webp
  const [savedPresets, setSavedPresets] = useState([]);
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientColor2, setGradientColor2] = useState('#4CAF50');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const canvasRef = useRef(null);
  const bulkCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const fileDialogTimeoutRef = useRef(null);

  const isDark = theme === 'dark';
  const surfaceClass = isDark ? 'bg-md-dark-surface-container-high' : 'bg-md-light-surface-container-high';
  const cardClass = isDark ? 'bg-md-dark-surface-container-highest' : 'bg-md-light-surface-container-highest';
  const primaryClass = isDark ? 'bg-md-dark-primary text-md-dark-on-primary' : 'bg-md-light-primary text-md-light-on-primary';
  const secondaryClass = isDark ? 'bg-md-dark-secondary-container text-md-dark-on-secondary-container' : 'bg-md-light-secondary-container text-md-light-on-secondary-container';
  const tertiaryClass = isDark ? 'bg-md-dark-tertiary-container text-md-dark-on-tertiary-container' : 'bg-md-light-tertiary-container text-md-light-on-tertiary-container';
  const errorClass = isDark ? 'bg-md-dark-error-container text-md-dark-on-error-container' : 'bg-md-light-error-container text-md-light-on-error-container';
  const textClass = isDark ? 'text-md-dark-on-surface' : 'text-md-light-on-surface';
  const textSecondaryClass = isDark ? 'text-md-dark-on-surface-variant' : 'text-md-light-on-surface-variant';
  const outlineClass = isDark ? 'border-md-dark-outline' : 'border-md-light-outline';
  const borderClass = outlineClass;
  const inputBgClass = isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container';
  const accentClass = primaryClass;

  useEffect(() => {
    // Check for pending generate from context menu
    chrome.storage.local.get(['pendingGenerate'], (result) => {
      if (result.pendingGenerate) {
        // Clear the pending generate
        chrome.storage.local.remove(['pendingGenerate'], () => {
          setInputText(result.pendingGenerate);
        });
      }
    });
  }, []);

  // Handle file dialog focus to prevent popup from closing
  useEffect(() => {
    let blurTimeout;

    const handleWindowBlur = () => {
      if (fileDialogOpen) {
        // Clear any existing timeout
        if (blurTimeout) clearTimeout(blurTimeout);

        // Use Chrome API to refocus the popup window
        blurTimeout = setTimeout(() => {
          chrome.windows.getCurrent((window) => {
            if (window && window.focused === false) {
              chrome.windows.update(window.id, { focused: true });
            }
          });
        }, 50); // Small delay to ensure file dialog has opened
      }
    };

    const handleWindowFocus = () => {
      if (fileDialogOpen) {
        // Clear the timeout if window regains focus quickly (file dialog closed)
        if (blurTimeout) {
          clearTimeout(blurTimeout);
          blurTimeout = null;
        }
        setFileDialogOpen(false);
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      if (blurTimeout) clearTimeout(blurTimeout);
      if (fileDialogTimeoutRef.current) clearTimeout(fileDialogTimeoutRef.current);
    };
  }, [fileDialogOpen]);

  const saveToHistory = (type, data, imageURL) => {
    const entry = {
      type: type || 'generate',
      data: String(data),
      imageURL: imageURL || null,
      timestamp: Date.now(),
    };

    chrome.storage.local.get(['history'], (result) => {
      const history = result.history || [];
      
      // Check for existing entry with same data and type
      const existingIndex = history.findIndex(item => 
        item.data === entry.data && item.type === entry.type
      );
      
      if (existingIndex >= 0) {
        // Update existing entry
        history[existingIndex].count = (history[existingIndex].count || 1) + 1;
        history[existingIndex].lastSeen = entry.timestamp;
        // Move to front
        const [existingEntry] = history.splice(existingIndex, 1);
        history.unshift(existingEntry);
      } else {
        // Add new entry with default fields
        entry.count = 1;
        entry.firstSeen = entry.timestamp;
        entry.lastSeen = entry.timestamp;
        entry.favorite = false;
        entry.tags = [];
        entry.note = '';
        history.unshift(entry);
      }
      
      // Keep only last 100 entries
      const limitedHistory = history.slice(0, 100);
      chrome.storage.local.set({ history: limitedHistory });

      // Track analytics with details
      trackAnalytics('generate', {
        type: entry.type,
        hasImage: !!entry.imageURL
      });
    });
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoImage(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const generateQRCode = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text or URL');
      return;
    }

    setGenerating(true);

    try {
      const canvas = canvasRef.current;
      await QRCode.toCanvas(canvas, inputText, {
        width: qrSize,
        errorCorrectionLevel: errorCorrection,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      });

      // Add logo if available
      if (logoImage) {
        const ctx = canvas.getContext('2d');
        const logoImg = await loadImage(logoImage);
        const logoSizePixels = canvas.width * logoSize;
        const x = (canvas.width - logoSizePixels) / 2;
        const y = (canvas.height - logoSizePixels) / 2;
        
        // Draw white background for logo
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 5, y - 5, logoSizePixels + 10, logoSizePixels + 10);
        
        // Draw logo
        ctx.drawImage(logoImg, x, y, logoSizePixels, logoSizePixels);
      }

      const dataURL = canvas.toDataURL('image/png');
      setQrDataURL(dataURL);
      saveToHistory('generate', inputText, dataURL);

      // Track analytics
      trackAnalytics('generation');
    } catch (err) {
      alert('Error generating QR code: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const generateURLQR = () => {
    const url = prompt('Enter URL:', 'https://');
    if (!url) return;
    setInputText(url);
  };

  const generateWiFiQR = () => {
    const ssid = prompt('Enter WiFi network name (SSID):');
    if (!ssid) return;

    const password = prompt('Enter WiFi password:');
    const security = prompt('Enter security type (WPA, WEP, or leave empty for none):', 'WPA');

    const wifiString = `WIFI:T:${security || 'nopass'};S:${ssid};P:${password || ''};;`;
    setInputText(wifiString);
  };

  const generateVCardQR = () => {
    const name = prompt('Enter full name:');
    if (!name) return;

    const phone = prompt('Enter phone number:');
    const email = prompt('Enter email address:');
    const company = prompt('Enter company/organization:');
    const title = prompt('Enter job title:');

    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    vcard += `FN:${name}\n`;
    if (phone) vcard += `TEL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (company) vcard += `ORG:${company}\n`;
    if (title) vcard += `TITLE:${title}\n`;
    vcard += 'END:VCARD';

    setInputText(vcard);
  };

  const generateSMSQR = () => {
    const phone = prompt('Enter phone number:');
    if (!phone) return;

    const message = prompt('Enter SMS message:');
    const smsString = `SMSTO:${phone}:${message || ''}`;
    setInputText(smsString);
  };

  const generateEmailQR = () => {
    const email = prompt('Enter email address:');
    if (!email) return;

    const subject = prompt('Enter email subject:');
    const body = prompt('Enter email body:');

    let mailto = `mailto:${email}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    if (params.length > 0) mailto += `?${params.join('&')}`;

    setInputText(mailto);
  };

  const generateCalendarQR = () => {
    const title = prompt('Enter event title:');
    if (!title) return;

    const startDate = prompt('Enter start date/time (YYYYMMDDTHHMMSS):');
    const endDate = prompt('Enter end date/time (YYYYMMDDTHHMMSS):');
    const location = prompt('Enter event location:');
    const description = prompt('Enter event description:');

    let calendar = 'BEGIN:VEVENT\n';
    calendar += `SUMMARY:${title}\n`;
    if (startDate) calendar += `DTSTART:${startDate}\n`;
    if (endDate) calendar += `DTEND:${endDate}\n`;
    if (location) calendar += `LOCATION:${location}\n`;
    if (description) calendar += `DESCRIPTION:${description}\n`;
    calendar += 'END:VEVENT';

    setInputText(calendar);
  };

  const generateLocationQR = () => {
    const latitude = prompt('Enter latitude:');
    if (!latitude) return;

    const longitude = prompt('Enter longitude:');
    if (!longitude) return;

    const locationString = `geo:${latitude},${longitude}`;
    setInputText(locationString);
  };

  const generateWhatsAppQR = () => {
    const phone = prompt('Enter phone number (with country code, e.g., +1234567890):');
    if (!phone) return;

    const message = prompt('Enter pre-filled message (optional):');
    const whatsappString = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    setInputText(whatsappString);
  };

  const generateTelegramQR = () => {
    const username = prompt('Enter Telegram username (without @):');
    if (!username) return;

    const telegramString = `https://t.me/${username}`;
    setInputText(telegramString);
  };

  const generateCryptoQR = () => {
    const type = prompt('Enter crypto type (bitcoin, ethereum, etc.):', 'bitcoin');
    if (!type) return;

    const address = prompt('Enter wallet address:');
    if (!address) return;

    const amount = prompt('Enter amount (optional):');
    const label = prompt('Enter label (optional):');

    let cryptoString = `${type}:${address}`;
    const params = [];
    if (amount) params.push(`amount=${amount}`);
    if (label) params.push(`label=${encodeURIComponent(label)}`);
    if (params.length > 0) cryptoString += `?${params.join('&')}`;

    setInputText(cryptoString);
  };

  const generatePayPalQR = () => {
    const email = prompt('Enter PayPal email or username:');
    if (!email) return;

    const amount = prompt('Enter amount (optional):');
    const currency = prompt('Enter currency code (e.g., USD, EUR):', 'USD');
    const item = prompt('Enter item name (optional):');

    let paypalString = `https://www.paypal.com/paypalme/${email}`;
    if (amount) paypalString += `/${amount}${currency}`;
    if (item) paypalString += `?item_name=${encodeURIComponent(item)}`;

    setInputText(paypalString);
  };

  const generateSocialMediaQR = () => {
    const platform = prompt('Enter platform (instagram, twitter, linkedin, facebook):', 'instagram');
    if (!platform) return;

    const username = prompt('Enter username (without @):');
    if (!username) return;

    const platformURLs = {
      instagram: `https://instagram.com/${username}`,
      twitter: `https://twitter.com/${username}`,
      linkedin: `https://linkedin.com/in/${username}`,
      facebook: `https://facebook.com/${username}`
    };

    const socialString = platformURLs[platform.toLowerCase()] || `https://${platform}.com/${username}`;
    setInputText(socialString);
  };

  const generateZoomQR = () => {
    const meetingId = prompt('Enter Zoom meeting ID:');
    if (!meetingId) return;

    const password = prompt('Enter meeting password (optional):');
    
    let zoomString = `https://zoom.us/j/${meetingId.replace(/[^0-9]/g, '')}`;
    if (password) zoomString += `?pwd=${password}`;

    setInputText(zoomString);
  };

  const generateAppStoreQR = () => {
    const store = prompt('Enter store (appstore or playstore):', 'playstore');
    if (!store) return;

    const appId = prompt('Enter app ID or package name:');
    if (!appId) return;

    const storeURLs = {
      appstore: `https://apps.apple.com/app/${appId}`,
      playstore: `https://play.google.com/store/apps/details?id=${appId}`
    };

    const appString = storeURLs[store.toLowerCase()] || storeURLs.playstore;
    setInputText(appString);
  };

  const downloadQRCode = () => {
    if (!qrDataURL) return;

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrDataURL;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!qrDataURL) return;

    try {
      // Try modern clipboard API first
      const blob = await (await fetch(qrDataURL)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      alert('QR code copied to clipboard!');
    } catch (err) {
      console.error('Clipboard error:', err);
      // Fallback: try copying the data URL as text
      try {
        await navigator.clipboard.writeText(qrDataURL);
        showNotification('success', 'QR code data URL copied to clipboard!');
      } catch (err2) {
        showNotification('error', 'Failed to copy to clipboard. Please try downloading instead.');
      }
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000); // Auto-hide after 4 seconds
  };

  // Export format functions
  const downloadAsSVG = async () => {
    if (!inputText) {
      showNotification('error', 'Please enter text to generate QR code');
      return;
    }

    try {
      const svgString = await QRCode.toString(inputText, {
        type: 'svg',
        width: qrSize,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        }
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      showNotification('success', 'QR code downloaded as SVG');
    } catch (err) {
      showNotification('error', 'Error exporting as SVG: ' + err.message);
    }
  };

  const downloadAsWebP = async () => {
    if (!qrDataURL) {
      showNotification('error', 'Please generate a QR code first');
      return;
    }

    try {
      const img = new Image();
      img.src = qrDataURL;
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.webp`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showNotification('success', 'QR code downloaded as WebP');
      }, 'image/webp', 0.95);
    } catch (err) {
      showNotification('error', 'Error exporting as WebP: ' + err.message);
    }
  };

  const printQRCode = () => {
    if (!qrDataURL) {
      showNotification('error', 'Please generate a QR code first');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              margin: 0; 
            }
            img { 
              max-width: 100%; 
              height: auto; 
            }
            @media print {
              body { margin: 0; }
              img { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <img src="${qrDataURL}" alt="QR Code" />
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const shareQRCode = async () => {
    if (!qrDataURL) {
      showNotification('error', 'Please generate a QR code first');
      return;
    }

    try {
      const blob = await (await fetch(qrDataURL)).blob();
      const file = new File([blob], `qr-code-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'QR Code',
          text: 'Check out this QR code'
        });
        showNotification('success', 'QR code shared successfully');
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        showNotification('error', 'Error sharing QR code');
      }
    }
  };

  // Presets management
  const savePreset = () => {
    const presetName = prompt('Enter preset name:');
    if (!presetName) return;

    const preset = {
      name: presetName,
      foregroundColor,
      backgroundColor,
      qrSize,
      errorCorrection,
      logoSize,
      qrPattern,
      frameStyle,
      frameText,
      gradientEnabled,
      gradientColor2,
      timestamp: Date.now()
    };

    chrome.storage.local.get(['qrPresets'], (result) => {
      const presets = result.qrPresets || [];
      presets.push(preset);
      chrome.storage.local.set({ qrPresets: presets }, () => {
        setSavedPresets(presets);
        showNotification('success', `Preset "${presetName}" saved successfully`);
      });
    });
  };

  const loadPreset = (preset) => {
    setForegroundColor(preset.foregroundColor);
    setBackgroundColor(preset.backgroundColor);
    setQrSize(preset.qrSize);
    setErrorCorrection(preset.errorCorrection);
    setLogoSize(preset.logoSize);
    setQrPattern(preset.qrPattern || 'square');
    setFrameStyle(preset.frameStyle || 'none');
    setFrameText(preset.frameText || 'Scan Me');
    setGradientEnabled(preset.gradientEnabled || false);
    setGradientColor2(preset.gradientColor2 || '#4CAF50');
    showNotification('success', `Preset "${preset.name}" loaded`);
  };

  const deletePreset = (index) => {
    if (!confirm('Delete this preset?')) return;

    chrome.storage.local.get(['qrPresets'], (result) => {
      const presets = result.qrPresets || [];
      const deletedName = presets[index].name;
      presets.splice(index, 1);
      chrome.storage.local.set({ qrPresets: presets }, () => {
        setSavedPresets(presets);
        showNotification('success', `Preset "${deletedName}" deleted`);
      });
    });
  };

  // Load presets on mount
  useEffect(() => {
    chrome.storage.local.get(['qrPresets'], (result) => {
      if (result.qrPresets) {
        setSavedPresets(result.qrPresets);
      }
    });
  }, []);

  const handleFileUpload = (event) => {
    // Clear the timeout since file selection is complete
    if (fileDialogTimeoutRef.current) {
      clearTimeout(fileDialogTimeoutRef.current);
      fileDialogTimeoutRef.current = null;
    }
    setFileDialogOpen(false); // Reset flag when file selection completes
    const file = event.target.files[0];
    if (!file) {
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Check file size (limit to 10MB for CSV to handle browser memory)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      showNotification('error', `File too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      showNotification('error', 'Please select a CSV or Excel file');
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true, // parse in a worker to avoid blocking popup and accidental close
      complete: (results) => {
        // Reset file input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        if (results.errors.length > 0) {
          showNotification('error', 'Error parsing file: ' + results.errors[0].message);
          return;
        }

        const data = results.data.filter(row => row.text || row.data || row.content);
        if (data.length === 0) {
          showNotification('error', 'No valid data found. Please ensure your CSV has a column named "text", "data", or "content"');
          return;
        }

        // Warn if too many items (browser can handle ~1000-2000 QR codes)
        const maxItems = 2000;
        if (data.length > maxItems) {
          showNotification('error', `Too many items (${data.length}). Maximum is ${maxItems} items per batch. Please split your CSV.`);
          return;
        }

        if (data.length > 500) {
          showNotification('success', `Loaded ${data.length} items. Large batch detected - generation may take a while.`);
        } else {
          showNotification('success', `Successfully loaded ${data.length} items from CSV`);
        }

        setBulkData(data);
        setBulkResults([]);
        setBulkProgress(0);
      },
      error: (error) => {
        showNotification('error', 'Error reading file: ' + error.message);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  const generateBulkQRCodes = async () => {
    if (bulkData.length === 0) {
      alert('Please upload a CSV file first');
      return;
    }

    setBulkGenerating(true);
    setBulkResults([]);
    setBulkProgress(0);
    setBulkCancelled(false);
    cancelledRef.current = false;

    const results = [];
    // Create a temporary canvas for bulk generation
    const canvas = document.createElement('canvas');

    for (let i = 0; i < bulkData.length; i++) {
      // Check if user cancelled
      if (cancelledRef.current) {
        setBulkCancelled(true);
        showNotification('error', `Generation cancelled. Generated ${results.length} of ${bulkData.length} QR codes.`);
        break;
      }

      const row = bulkData[i];
      const text = row.text || row.data || row.content || '';

      if (!text.trim()) continue;

      try {
        await QRCode.toCanvas(canvas, text, {
          width: qrSize,
          errorCorrectionLevel: errorCorrection,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
        });

        // Add logo if available
        if (logoImage) {
          const ctx = canvas.getContext('2d');
          const logoImg = await loadImage(logoImage);
          const logoSizePixels = canvas.width * logoSize;
          const x = (canvas.width - logoSizePixels) / 2;
          const y = (canvas.height - logoSizePixels) / 2;
          
          // Draw white background for logo
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x - 5, y - 5, logoSizePixels + 10, logoSizePixels + 10);
          
          // Draw logo
          ctx.drawImage(logoImg, x, y, logoSizePixels, logoSizePixels);
        }

        const dataURL = canvas.toDataURL('image/png');
        results.push({
          text,
          dataURL,
          index: i + 1,
          ...row
        });

        // Save to history
        saveToHistory('generate', text, dataURL);

        // Track analytics
        trackAnalytics('generation');
      } catch (err) {
        console.error('Error generating QR for row', i + 1, err);
        results.push({
          text,
          error: err.message,
          index: i + 1,
          ...row
        });
      }

      // Update progress
      const progress = Math.round(((i + 1) / bulkData.length) * 100);
      setBulkProgress(progress);

      // Allow UI to update every 10 items or at the end
      if ((i + 1) % 10 === 0 || i === bulkData.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    setBulkGenerating(false);
    setBulkResults(results);
    
    if (!cancelledRef.current) {
      showNotification('success', `Successfully generated ${results.length} QR codes!`);
    }
  };

  const cancelBulkGeneration = () => {
    cancelledRef.current = true;
    setBulkCancelled(true);
  };

  const openBulkInTab = () => {
    // Open dedicated bulk-only page
    const url = chrome.runtime.getURL('bulk.html');
    chrome.tabs.create({ url });
  };

  const downloadBulkResults = () => {
    if (bulkResults.length === 0) return;

    // Create individual downloads
    bulkResults.forEach((result, index) => {
      if (result.dataURL) {
        const link = document.createElement('a');
        link.download = `qr-code-${index + 1}.png`;
        link.href = result.dataURL;
        link.click();
      }
    });
  };

  return (
    <div className={fullWidth ? "space-y-6" : "p-6 h-full overflow-y-auto space-y-4"}>
      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-md-lg shadow-md-2 animate-slide-down ${
          notification.type === 'error' ? errorClass : primaryClass
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'error' ? (
              <ErrorIcon fontSize="small" />
            ) : (
              <CheckCircleIcon fontSize="small" />
            )}
            <span className="text-body-medium font-medium">
              {notification.message}
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions - Hide in full width bulk mode */}
      {!fullWidth && (
        <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-title-medium font-medium ${textClass}`}>Quick Generate</h3>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className={`${tertiaryClass} py-1 px-3 rounded-md-full text-label-small font-medium state-layer`}
              aria-label={showQuickActions ? 'Show less' : 'Show all'}
            >
              {showQuickActions ? 'Show Less' : 'Show All'}
            </button>
          </div>
          <div className={`grid grid-cols-3 gap-3 ${!showQuickActions ? 'max-h-[4.5rem] overflow-hidden' : ''}`}>
            <button
              onClick={generateURLQR}
              className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
            >
              <LinkIcon fontSize="small" />
            <span className="text-label-large">URL</span>
          </button>
          <button
            onClick={generateWiFiQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <WifiIcon fontSize="small" />
            <span className="text-label-large">WiFi</span>
          </button>
          <button
            onClick={generateVCardQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <ContactsIcon fontSize="small" />
            <span className="text-label-large">vCard</span>
          </button>
          <button
            onClick={generateSMSQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <SmsIcon fontSize="small" />
            <span className="text-label-large">SMS</span>
          </button>
          <button
            onClick={generateEmailQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <EmailIcon fontSize="small" />
            <span className="text-label-large">Email</span>
          </button>
          <button
            onClick={generateLocationQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <LocationOnIcon fontSize="small" />
            <span className="text-label-large">Location</span>
          </button>
          <button
            onClick={generateWhatsAppQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <WhatsAppIcon fontSize="small" />
            <span className="text-label-large">WhatsApp</span>
          </button>
          <button
            onClick={generateTelegramQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <TelegramIcon fontSize="small" />
            <span className="text-label-large">Telegram</span>
          </button>
          <button
            onClick={generateCryptoQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <CurrencyBitcoinIcon fontSize="small" />
            <span className="text-label-large">Crypto</span>
          </button>
          <button
            onClick={generatePayPalQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <PaymentIcon fontSize="small" />
            <span className="text-label-large">Payment</span>
          </button>
          <button
            onClick={generateSocialMediaQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <InstagramIcon fontSize="small" />
            <span className="text-label-large">Social</span>
          </button>
          <button
            onClick={generateZoomQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <VideoCallIcon fontSize="small" />
            <span className="text-label-large">Zoom</span>
          </button>
          <button
            onClick={generateAppStoreQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <ShopIcon fontSize="small" />
            <span className="text-label-large">App Store</span>
          </button>
          <button
            onClick={generateCalendarQR}
            className={`${secondaryClass} p-3 rounded-md-lg state-layer flex items-center gap-2 justify-center transition-all hover:shadow-md-1`}
          >
            <EventIcon fontSize="small" />
            <span className="text-label-large">Calendar</span>
          </button>
        </div>
      </div>
      )}

      {/* Mode Toggle - Hide in dedicated bulk page */}
      {!hideToggle && (
        <div className={`${cardClass} p-4 rounded-md-lg shadow-md-1`}>
          <label className={`block text-title-small font-medium mb-3 ${textClass}`}>
            Generation Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBulkMode(false)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md-md font-medium transition-all state-layer ${
                !bulkMode ? primaryClass : secondaryClass
              }`}
            >
              <QrCode2Icon />
              <span className="text-label-large">Single</span>
            </button>
            <button
              onClick={() => {
                // When clicking bulk in popup, redirect to tab immediately
                const isPopup = window.innerWidth <= 480;
                if (isPopup && !bulkMode) {
                  openBulkInTab();
                } else {
                  setBulkMode(true);
                }
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md-md font-medium transition-all state-layer ${
                bulkMode ? primaryClass : secondaryClass
              }`}
            >
              <UploadFileIcon />
              <span className="text-label-large">Bulk</span>
            </button>
          </div>
        </div>
      )}

      {/* Bulk Mode - Open in Tab Banner (always show when in popup) */}
      {bulkMode && window.innerWidth <= 480 && !hideToggle && (
        <div className={`${tertiaryClass} p-4 rounded-md-xl shadow-md-2 animate-fade-in`}>
          <div className="flex items-start gap-3">
            <RocketLaunchIcon style={{ fontSize: 48 }} className={textClass} />
            <div className="flex-1">
              <h3 className="text-title-medium font-medium mb-2">
                Bulk Generation Works Best in a Tab
              </h3>
              <p className="text-body-small mb-3">
                For the best experience with progress tracking, file uploads, and no interruptions, open the bulk generator in a dedicated tab.
              </p>
              <button
                onClick={openBulkInTab}
                className={`${primaryClass} w-full py-3 px-4 rounded-md-lg font-medium text-label-large shadow-md-2 state-layer transition-all hover:shadow-md-3 flex items-center justify-center gap-2`}
              >
                <OpenInNewIcon />
                Open Bulk Generator in New Tab
              </button>
            </div>
          </div>
        </div>
      )}

      {!bulkMode ? (
        /* Single Generation Mode */
        <div className="space-y-4 animate-fade-in">
          {/* Input Section */}
          <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2`}>
            <label className={`block text-label-large font-medium ${textClass} mb-3`}>
              Enter Text or URL
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text, URL, or use Quick Actions above..."
              className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-4 text-body-large ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary transition-all resize-none`}
              rows="4"
            />
          </div>

          {/* Customization Options */}
          <div className={`${cardClass} p-4 sm:p-5 rounded-md-xl shadow-md-2`}>
            <div className="flex items-center gap-2 mb-4">
              <TuneIcon fontSize="small" className={textClass} />
              <h3 className={`text-title-medium font-medium ${textClass}`}>Customization</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Size */}
              <div>
                <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                  Size: {qrSize}px
                </label>
                <input
                  type="range"
                  min="256"
                  max="1024"
                  step="128"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Error Correction */}
              <div>
                <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                  Error Correction
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value)}
                  className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                  Foreground Color
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-shrink-0">
                    <input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-12 h-10 rounded-md-md border-2 border-gray-300 cursor-pointer"
                      style={{ padding: '2px' }}
                      aria-label="Select foreground color"
                    />
                  </div>
                  <input
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    placeholder="#000000"
                    className={`flex-1 min-w-0 ${inputBgClass} border ${outlineClass} rounded-md-md px-2 sm:px-3 py-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary font-mono text-xs sm:text-sm`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                  Background Color
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-shrink-0">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded-md-md border-2 border-gray-300 cursor-pointer"
                      style={{ padding: '2px' }}
                      aria-label="Select background color"
                    />
                  </div>
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className={`flex-1 min-w-0 ${inputBgClass} border ${outlineClass} rounded-md-md px-2 sm:px-3 py-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary font-mono text-xs sm:text-sm`}
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-label-medium ${textSecondaryClass}`}>
                  Add Logo/Image (Optional)
                </label>
                {logoImage && (
                  <button
                    onClick={removeLogo}
                    className={`${errorClass} px-3 py-1 rounded-md-md text-label-small flex items-center gap-1 state-layer transition-all`}
                  >
                    <DeleteIcon fontSize="small" />
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} text-body-small file:mr-3 file:py-1 file:px-3 file:rounded-md-md file:border-0 file:${secondaryClass} file:cursor-pointer`}
              />
              {logoImage && (
                <div className="mt-3">
                  <label className={`block text-label-small ${textSecondaryClass} mb-2`}>
                    Logo Size: {Math.round(logoSize * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.3"
                    step="0.05"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <img src={logoImage} alt="Logo preview" className="w-16 h-16 object-contain border rounded-md-md p-1" />
                    <p className={`text-body-small ${textSecondaryClass}`}>
                      Logo will be centered on QR code with white background
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Options - Collapsible */}
          <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2`}>
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className={`w-full flex items-center justify-between text-title-medium font-medium ${textClass} mb-4`}
            >
              <div className="flex items-center gap-2">
                <SettingsIcon fontSize="small" />
                <span>Advanced Options</span>
              </div>
              <span className={`transform transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {showAdvancedOptions && (
              <div className="space-y-4 animate-slide-up">
                {/* QR Pattern Style */}
                <div>
                  <label className={`block text-label-medium ${textSecondaryClass} mb-2 flex items-center gap-2`}>
                    <PatternIcon fontSize="small" />
                    QR Pattern Style
                  </label>
                  <select
                    value={qrPattern}
                    onChange={(e) => setQrPattern(e.target.value)}
                    className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                  >
                    <option value="square">Square (Default)</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                  </select>
                  <p className={`text-body-small ${textSecondaryClass} mt-1`}>Note: Pattern styles require regenerating the QR code</p>
                </div>

                {/* Frame Style */}
                <div>
                  <label className={`block text-label-medium ${textSecondaryClass} mb-2 flex items-center gap-2`}>
                    <BorderStyleIcon fontSize="small" />
                    Frame Style
                  </label>
                  <select
                    value={frameStyle}
                    onChange={(e) => setFrameStyle(e.target.value)}
                    className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                  >
                    <option value="none">No Frame</option>
                    <option value="text">Text Label</option>
                    <option value="decorative">Decorative Border</option>
                  </select>
                  {frameStyle !== 'none' && (
                    <input
                      type="text"
                      value={frameText}
                      onChange={(e) => setFrameText(e.target.value)}
                      placeholder="Frame text..."
                      className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} mt-2 focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                    />
                  )}
                </div>

                {/* Gradient Colors */}
                <div>
                  <label className={`flex items-center gap-2 text-label-medium ${textSecondaryClass} mb-2`}>
                    <input
                      type="checkbox"
                      checked={gradientEnabled}
                      onChange={(e) => setGradientEnabled(e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <GradientIcon fontSize="small" />
                    Enable Gradient Colors
                  </label>
                  {gradientEnabled && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={gradientColor2}
                        onChange={(e) => setGradientColor2(e.target.value)}
                        className={`w-12 h-10 rounded-md-md border ${outlineClass} cursor-pointer`}
                      />
                      <input
                        type="text"
                        value={gradientColor2}
                        onChange={(e) => setGradientColor2(e.target.value)}
                        placeholder="Gradient color 2"
                        className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-md px-3 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                      />
                    </div>
                  )}
                </div>

                {/* Export Format */}
                <div>
                  <label className={`block text-label-medium ${textSecondaryClass} mb-2 flex items-center gap-2`}>
                    <ImageSearchIcon fontSize="small" />
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                  >
                    <option value="png">PNG (Default)</option>
                    <option value="svg">SVG (Vector)</option>
                    <option value="webp">WebP (Compressed)</option>
                    <option value="pdf">PDF (Print-ready)</option>
                  </select>
                </div>

                {/* Presets */}
                {savedPresets.length > 0 && (
                  <div>
                    <label className={`block text-label-medium ${textSecondaryClass} mb-2 flex items-center gap-2`}>
                      <SaveIcon fontSize="small" />
                      Saved Presets
                    </label>
                    <div className="space-y-2">
                      {savedPresets.map((preset, index) => (
                        <div key={index} className={`flex items-center gap-2 p-2 ${inputBgClass} rounded-md-md`}>
                          <button
                            onClick={() => loadPreset(preset)}
                            className={`flex-1 text-left ${textClass} text-body-medium hover:underline`}
                          >
                            {preset.name}
                          </button>
                          <button
                            onClick={() => deletePreset(index)}
                            className={`${errorClass} p-2 rounded-md-full state-layer`}
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={savePreset}
                  className={`w-full ${secondaryClass} py-3 px-4 rounded-md-lg font-medium text-label-medium state-layer flex items-center justify-center gap-2`}
                >
                  <SaveIcon fontSize="small" />
                  Save Current Settings as Preset
                </button>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={generateQRCode}
            disabled={generating || !inputText.trim()}
            className={`${primaryClass} w-full py-3 px-6 rounded-md-lg font-medium text-label-large shadow-md-2 state-layer transition-all hover:shadow-md-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            <QrCode2Icon />
            {generating ? 'Generating...' : 'Generate QR Code'}
          </button>

          {/* QR Code Preview */}
          {qrDataURL && (
            <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 animate-slide-up`}>
              <h3 className={`text-title-medium font-medium ${textClass} mb-4`}>Your QR Code</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-md-lg shadow-md-1">
                  <img src={qrDataURL} alt="Generated QR Code" className="w-64 h-64" />
                </div>
                
                {/* Primary Actions */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={downloadQRCode}
                    className={`${secondaryClass} flex-1 py-3 px-4 rounded-md-lg font-medium text-label-large state-layer transition-all hover:shadow-md-1 flex items-center justify-center gap-2`}
                  >
                    <DownloadIcon fontSize="small" />
                    Download
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className={`${tertiaryClass} flex-1 py-3 px-4 rounded-md-lg font-medium text-label-large state-layer transition-all hover:shadow-md-1 flex items-center justify-center gap-2`}
                  >
                    <ContentCopyIcon fontSize="small" />
                    Copy
                  </button>
                </div>

                {/* Additional Export Options */}
                <div className={`w-full ${secondaryClass} p-4 rounded-md-lg`}>
                  <p className={`text-label-medium font-medium mb-3 ${textClass}`}>Export & Share Options</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={downloadAsSVG}
                      className={`${tertiaryClass} py-2 px-3 rounded-md-md font-medium text-label-small state-layer transition-all flex items-center justify-center gap-1`}
                    >
                      <CodeIcon fontSize="small" />
                      SVG
                    </button>
                    <button
                      onClick={downloadAsWebP}
                      className={`${tertiaryClass} py-2 px-3 rounded-md-md font-medium text-label-small state-layer transition-all flex items-center justify-center gap-1`}
                    >
                      <ImageIcon fontSize="small" />
                      WebP
                    </button>
                    <button
                      onClick={printQRCode}
                      className={`${tertiaryClass} py-2 px-3 rounded-md-md font-medium text-label-small state-layer transition-all flex items-center justify-center gap-1`}
                    >
                      <PrintIcon fontSize="small" />
                      Print
                    </button>
                    <button
                      onClick={shareQRCode}
                      className={`${tertiaryClass} py-2 px-3 rounded-md-md font-medium text-label-small state-layer transition-all flex items-center justify-center gap-1`}
                    >
                      <ShareIcon fontSize="small" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        /* Bulk Generation Mode */
        <div className="space-y-4 animate-fade-in">
          {/* Bulk Customization Options */}
          <div className={`${cardClass} p-4 sm:p-5 rounded-md-xl shadow-md-2`}>
            <div className="flex items-center gap-2 mb-4">
              <TuneIcon fontSize="small" className={textClass} />
              <h3 className={`text-title-medium font-medium ${textClass}`}>Bulk Customization</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Size */}
              <div>
                <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                  Size: {qrSize}px
                </label>
                <input
                  type="range"
                  min="256"
                  max="1024"
                  step="128"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Error Correction */}
              <div>
                <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                  Error Correction
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value)}
                  className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                  Foreground Color
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-shrink-0">
                    <input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-12 h-10 rounded-md-md border-2 border-gray-300 cursor-pointer"
                      style={{ padding: '2px' }}
                      aria-label="Select foreground color"
                    />
                  </div>
                  <input
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    placeholder="#000000"
                    className={`flex-1 min-w-0 ${inputBgClass} border ${outlineClass} rounded-md-md px-2 sm:px-3 py-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary font-mono text-xs sm:text-sm`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                  Background Color
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-shrink-0">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded-md-md border-2 border-gray-300 cursor-pointer"
                      style={{ padding: '2px' }}
                      aria-label="Select background color"
                    />
                  </div>
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className={`flex-1 min-w-0 ${inputBgClass} border ${outlineClass} rounded-md-md px-2 sm:px-3 py-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary font-mono text-xs sm:text-sm`}
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-label-medium ${textSecondaryClass}`}>
                  Add Logo/Image (Optional)
                </label>
                {logoImage && (
                  <button
                    onClick={removeLogo}
                    className={`${errorClass} px-3 py-1 rounded-md-md text-label-small flex items-center gap-1 state-layer transition-all`}
                  >
                    <DeleteIcon fontSize="small" />
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} text-body-small file:mr-3 file:py-1 file:px-3 file:rounded-md-md file:border-0 file:${secondaryClass} file:cursor-pointer`}
              />
              {logoImage && (
                <div className="mt-3">
                  <label className={`block text-label-small ${textSecondaryClass} mb-2`}>
                    Logo Size: {Math.round(logoSize * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.3"
                    step="0.05"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <img src={logoImage} alt="Logo preview" className="w-16 h-16 object-contain border rounded-md-md p-1" />
                    <p className={`text-body-small ${textSecondaryClass}`}>
                      Logo will be added to all generated QR codes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2`}>
            <div className="flex items-center gap-2 mb-3">
              <UploadFileIcon fontSize="small" className={textClass} />
              <h3 className={`text-title-medium font-medium ${textClass}`}>Upload CSV File</h3>
            </div>
            {/* Guidance when inside action popup */}
            {window.innerWidth <= 480 && (
              <div className={`${secondaryClass} p-3 rounded-md-md mb-3`}>
                <div className={`text-label-large font-medium mb-1`}>
                  Bulk CSV Upload
                </div>
                <div className={`text-body-small`}>
                  Clicking "Choose File" will open the bulk generator in a new tab to prevent the popup from closing during file operations.
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onClick={(e) => {
                // Check if we're in popup mode (small width indicates popup)
                const isPopup = window.innerWidth <= 480;
                if (isPopup) {
                  // Prevent file dialog from opening in popup
                  e.preventDefault();
                  // Open in tab instead
                  openBulkInTab();
                  return;
                }
                
                setFileDialogOpen(true);
                // Keep the flag set for a longer period to handle file dialog
                fileDialogTimeoutRef.current = setTimeout(() => setFileDialogOpen(false), 10000); // Reset after 10 seconds as fallback
              }}
              onChange={handleFileUpload}
              className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass} text-body-medium file:mr-3 file:py-2 file:px-4 file:rounded-md-md file:border-0 file:${secondaryClass} file:cursor-pointer hover:file:opacity-90 focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
            />
            <p className={`text-body-small ${textSecondaryClass} mt-2`}>
              CSV should have a column named "text", "data", or "content"
            </p>
            {/* <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openBulkInTab}
                className={`${secondaryClass} px-3 py-2 rounded-md-md text-label-medium state-layer hover:opacity-90`}
                title="Open bulk generator in a dedicated tab"
              >Open Bulk Generator in Tab</button>
              <button
                type="button"
                onClick={() => setBulkMode(!bulkMode)}
                className={`${primaryClass} px-3 py-2 rounded-md-md text-label-medium state-layer hover:opacity-90`}
              >{bulkMode ? 'Disable Bulk Mode' : 'Enable Bulk Mode'}</button>
            </div> */}
          </div>

          {/* Bulk Data Preview */}
          {bulkData.length > 0 && (
            <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 animate-slide-up`}>
              <h3 className={`text-title-medium font-medium ${textClass} mb-3`}>
                Data Preview ({bulkData.length} items)
              </h3>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {bulkData.slice(0, 5).map((row, index) => (
                  <div key={index} className={`${inputBgClass} p-3 rounded-md-lg border ${outlineClass}`}>
                    <span className={`text-body-medium ${textClass}`}>
                      {String(row.text || row.data || row.content || 'No content')}
                    </span>
                  </div>
                ))}
                {bulkData.length > 5 && (
                  <div className={`text-body-medium ${textSecondaryClass} p-2 text-center`}>
                    ... and {bulkData.length - 5} more items
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bulk Results */}
          {bulkResults.length > 0 && (
            <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 animate-slide-up`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-title-medium font-medium ${textClass}`}>
                  Generated QR Codes ({bulkResults.length})
                </h3>
                <button
                  onClick={downloadBulkResults}
                  className={`${primaryClass} px-4 py-2 rounded-md-lg font-medium text-label-large flex items-center gap-2 state-layer transition-all hover:shadow-md-2`}
                >
                  <DownloadIcon fontSize="small" />
                  Download All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {bulkResults.map((result, index) => (
                  <div key={index} className={`${inputBgClass} p-3 rounded-md-lg border ${outlineClass}`}>
                    {result.dataURL ? (
                      <img src={result.dataURL} alt={`QR ${index + 1}`} className="w-full h-auto rounded-md-md" />
                    ) : (
                      <div className={`${errorClass} p-3 rounded-md-md text-body-small`}>
                        Error: {String(result.error || 'Unknown error')}
                      </div>
                    )}
                    <div className={`text-body-small ${textSecondaryClass} mt-2 truncate`}>
                      {String(result.text || '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button and Progress */}
          {bulkGenerating && (
            <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2 mb-4`}>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-label-large font-medium ${textClass}`}>
                    Generating QR Codes...
                  </span>
                  <span className={`text-label-large font-medium ${textClass}`}>
                    {bulkProgress}%
                  </span>
                </div>
                <div className={`w-full h-2 ${inputBgClass} rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full ${primaryClass} transition-all duration-300`}
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>
                <div className={`text-body-small ${textSecondaryClass} mt-2`}>
                  {Math.round((bulkProgress / 100) * bulkData.length)} of {bulkData.length} completed
                </div>
              </div>
              <button
                onClick={cancelBulkGeneration}
                className={`${errorClass} w-full py-2 px-4 rounded-md-lg font-medium text-label-medium state-layer`}
              >
                Cancel Generation
              </button>
            </div>
          )}

          <button
            onClick={generateBulkQRCodes}
            disabled={bulkGenerating || bulkData.length === 0}
            className={`${primaryClass} w-full py-3 px-6 rounded-md-lg font-medium text-label-large shadow-md-2 state-layer transition-all hover:shadow-md-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            <QrCode2Icon />
            {bulkGenerating ? `Generating... ${bulkProgress}%` : `Generate ${bulkData.length} QR Codes`}
          </button>
        </div>
      )}
    </div>
  );
}

export default GenerateTab;
