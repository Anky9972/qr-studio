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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import BrushIcon from '@mui/icons-material/Brush';
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
  
  // NEW: Eye/Finder Pattern Customization
  const [eyePattern, setEyePattern] = useState('square'); // square, circle, rounded, leaf
  const [eyeColor, setEyeColor] = useState(''); // empty = use foreground color
  const [eyeInnerColor, setEyeInnerColor] = useState(''); // inner square color
  const [customizeEyes, setCustomizeEyes] = useState(false);
  
  // NEW: Advanced Gradients
  const [gradientType, setGradientType] = useState('linear'); // linear, radial
  const [gradientAngle, setGradientAngle] = useState(45); // 0-360 degrees
  const [gradientColor3, setGradientColor3] = useState('#FF5722');
  const [multiColorGradient, setMultiColorGradient] = useState(false);
  
  // NEW: Logo Options
  const [logoPosition, setLogoPosition] = useState('center'); // center, topLeft, topRight, bottomLeft, bottomRight
  const [logoShape, setLogoShape] = useState('square'); // square, circle, rounded
  const [logoBorder, setLogoBorder] = useState(false);
  const [logoBorderColor, setLogoBorderColor] = useState('#ffffff');
  
  // NEW: Background Options
  const [backgroundPattern, setBackgroundPattern] = useState('none'); // none, dots, grid, lines
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  
  // NEW: Effects
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(10);
  const [cornerRadius, setCornerRadius] = useState(0); // overall QR corner rounding
  
  // NEW: Margin/Quiet Zone
  const [quietZone, setQuietZone] = useState(2); // margin around QR code
  
  // NEW: Contrast Checker
  const [contrastScore, setContrastScore] = useState(null);
  const [scannabilityWarning, setScannabilityWarning] = useState('');
  
  // NEW: Frame Options
  const [frameBorderWidth, setFrameBorderWidth] = useState(4);
  const [frameCornerStyle, setFrameCornerStyle] = useState('none'); // none, dots, rounded
  
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
          // Handle both string and object formats
          if (typeof result.pendingGenerate === 'string') {
            setInputText(result.pendingGenerate);
          } else if (result.pendingGenerate.data) {
            setInputText(result.pendingGenerate.data);
          }
        });
      }
    });
  }, []);

  // Auto-generate QR code when customization changes (live preview)
  useEffect(() => {
    // Only auto-generate if we have text and we're not in bulk mode
    if (!bulkMode && inputText.trim() && !generating) {
      // Debounce the generation to avoid too many updates
      const timeoutId = setTimeout(() => {
        generateQRCode();
      }, 500); // Wait 500ms after last change

      return () => clearTimeout(timeoutId);
    }
  }, [inputText, qrSize, errorCorrection, foregroundColor, backgroundColor, logoImage, logoSize, 
      qrPattern, frameStyle, frameText, gradientEnabled, gradientColor2, gradientColor3, 
      gradientType, gradientAngle, multiColorGradient, eyePattern, eyeColor, eyeInnerColor, 
      customizeEyes, logoPosition, logoShape, logoBorder, logoBorderColor, backgroundPattern, 
      backgroundOpacity, shadowEnabled, shadowColor, shadowBlur, cornerRadius, quietZone, 
      frameBorderWidth, frameCornerStyle, bulkMode]);

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
      return; // Silently return if no input (for auto-generation)
    }

    if (generating) return; // Prevent concurrent generations

    setGenerating(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Calculate frame size if needed
      const frameSize = frameStyle !== 'none' ? 60 : 0;
      const qrCodeSize = qrSize;
      const totalSize = qrCodeSize + (frameSize * 2);
      
      // Set canvas size
      canvas.width = totalSize;
      canvas.height = totalSize;
      
      // Apply shadow effect if enabled
      if (shadowEnabled) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
      }
      
      // Fill background with pattern or solid color
      if (backgroundPattern !== 'none') {
        drawBackgroundPattern(ctx, totalSize, totalSize, backgroundColor, backgroundPattern, backgroundOpacity);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.globalAlpha = backgroundOpacity;
        ctx.fillRect(0, 0, totalSize, totalSize);
        ctx.globalAlpha = 1;
      }
      
      // Reset shadow for QR code
      if (shadowEnabled) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      
      // Create temporary canvas for QR code
      const tempCanvas = document.createElement('canvas');
      await QRCode.toCanvas(tempCanvas, inputText, {
        width: qrCodeSize,
        errorCorrectionLevel: errorCorrection,
        margin: quietZone,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      });
      
      // Apply custom eye patterns if enabled
      if (customizeEyes) {
        await applyCustomEyes(tempCanvas, eyePattern, eyeColor || foregroundColor, eyeInnerColor || foregroundColor, backgroundColor);
      }
      
      // Apply QR pattern style (dots/rounded for data modules)
      if (qrPattern !== 'square') {
        applyQRPattern(tempCanvas, qrPattern, customizeEyes);
      }
      
      // Apply gradient if enabled
      if (gradientEnabled) {
        if (multiColorGradient) {
          applyMultiColorGradient(tempCanvas, foregroundColor, gradientColor2, gradientColor3, gradientType, gradientAngle);
        } else {
          applyGradient(tempCanvas, foregroundColor, gradientColor2, gradientType, gradientAngle);
        }
      }
      
      // Apply corner radius to entire QR if set
      if (cornerRadius > 0) {
        applyCornerRadius(tempCanvas, cornerRadius);
      }
      
      // Draw QR code on main canvas
      ctx.drawImage(tempCanvas, frameSize, frameSize, qrCodeSize, qrCodeSize);
      
      // Add logo if available
      if (logoImage) {
        await drawLogo(ctx, logoImage, qrCodeSize, frameSize, logoPosition, logoShape, logoBorder, logoBorderColor);
      }
      
      // Add frame if enabled
      if (frameStyle !== 'none') {
        drawFrame(ctx, totalSize, frameStyle, frameText, foregroundColor, frameBorderWidth, frameCornerStyle);
      }

      const dataURL = canvas.toDataURL('image/png');
      setQrDataURL(dataURL);
      
      // Check contrast and scannability
      checkContrast(foregroundColor, backgroundColor);
      
      saveToHistory('generate', inputText, dataURL);

      // Track analytics
      trackAnalytics('generation');
    } catch (err) {
      console.error('QR Generation Error:', err);
      alert('Error generating QR code: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };
  
  // Helper function to apply QR pattern styles
  const applyQRPattern = (canvas, pattern) => {
    if (pattern === 'square') return; // No changes needed
    
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Detect module size (QR code pixel size)
    let moduleSize = 1;
    for (let y = 0; y < height; y++) {
      const idx = (y * width) * 4;
      const isDark = data[idx] < 128;
      let count = 0;
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const pixelDark = data[i] < 128;
        if (pixelDark === isDark) count++;
        else break;
      }
      if (count > 1 && count < width / 4) {
        moduleSize = count;
        break;
      }
    }
    
    if (moduleSize < 2) moduleSize = Math.floor(width / 50); // Fallback
    
    // Create new canvas for pattern
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;
    const newCtx = newCanvas.getContext('2d');
    
    // Copy background
    newCtx.fillStyle = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    newCtx.fillRect(0, 0, width, height);
    
    // Redraw with pattern
    for (let y = 0; y < height; y += moduleSize) {
      for (let x = 0; x < width; x += moduleSize) {
        const idx = (y * width + x) * 4;
        const isDark = data[idx] < 128;
        
        if (isDark) {
          newCtx.fillStyle = `rgb(${data[idx]}, ${data[idx + 1]}, ${data[idx + 2]})`;
          
          if (pattern === 'dots') {
            // Draw circles
            const centerX = x + moduleSize / 2;
            const centerY = y + moduleSize / 2;
            const radius = moduleSize * 0.4;
            newCtx.beginPath();
            newCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            newCtx.fill();
          } else if (pattern === 'rounded') {
            // Draw rounded rectangles using arcs
            const radius = moduleSize * 0.25;
            const rectX = x + 1;
            const rectY = y + 1;
            const rectW = moduleSize - 2;
            const rectH = moduleSize - 2;
            
            newCtx.beginPath();
            newCtx.moveTo(rectX + radius, rectY);
            newCtx.lineTo(rectX + rectW - radius, rectY);
            newCtx.arcTo(rectX + rectW, rectY, rectX + rectW, rectY + radius, radius);
            newCtx.lineTo(rectX + rectW, rectY + rectH - radius);
            newCtx.arcTo(rectX + rectW, rectY + rectH, rectX + rectW - radius, rectY + rectH, radius);
            newCtx.lineTo(rectX + radius, rectY + rectH);
            newCtx.arcTo(rectX, rectY + rectH, rectX, rectY + rectH - radius, radius);
            newCtx.lineTo(rectX, rectY + radius);
            newCtx.arcTo(rectX, rectY, rectX + radius, rectY, radius);
            newCtx.closePath();
            newCtx.fill();
          }
        }
      }
    }
    
    // Copy back to original canvas
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(newCanvas, 0, 0);
  };
  
  // Helper function to apply gradient
  const applyGradient = (canvas, color1, color2, type = 'linear', angle = 45) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let gradient;
    if (type === 'radial') {
      // Radial gradient from center
      gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    } else {
      // Linear gradient with angle
      const angleRad = (angle * Math.PI) / 180;
      const x1 = width / 2 - Math.cos(angleRad) * width / 2;
      const y1 = height / 2 - Math.sin(angleRad) * height / 2;
      const x2 = width / 2 + Math.cos(angleRad) * width / 2;
      const y2 = height / 2 + Math.sin(angleRad) * height / 2;
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    }
    
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    // Apply gradient to dark pixels
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  };
  
  // Helper function for multi-color gradient
  const applyMultiColorGradient = (canvas, color1, color2, color3, type = 'linear', angle = 45) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let gradient;
    if (type === 'radial') {
      gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    } else {
      const angleRad = (angle * Math.PI) / 180;
      const x1 = width / 2 - Math.cos(angleRad) * width / 2;
      const y1 = height / 2 - Math.sin(angleRad) * height / 2;
      const x2 = width / 2 + Math.cos(angleRad) * width / 2;
      const y2 = height / 2 + Math.sin(angleRad) * height / 2;
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    }
    
    gradient.addColorStop(0, color1);
    gradient.addColorStop(0.5, color2);
    gradient.addColorStop(1, color3);
    
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  };
  
  // Helper function to apply custom eye patterns
  const applyCustomEyes = async (canvas, pattern, eyeColor, innerColor, bgColor) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Detect module size
    let moduleSize = Math.floor(width / 50);
    
    // QR codes have 3 finder patterns (eyes) at: top-left, top-right, bottom-left
    // Each eye is 7x7 modules
    const eyeSize = 7 * moduleSize;
    const eyePositions = [
      { x: 0, y: 0 }, // top-left
      { x: width - eyeSize, y: 0 }, // top-right
      { x: 0, y: height - eyeSize } // bottom-left
    ];
    
    eyePositions.forEach(pos => {
      // Clear the eye area
      ctx.fillStyle = bgColor;
      ctx.fillRect(pos.x, pos.y, eyeSize, eyeSize);
      
      // Draw custom eye pattern
      ctx.fillStyle = eyeColor;
      
      if (pattern === 'circle') {
        // Outer circle
        ctx.beginPath();
        ctx.arc(pos.x + eyeSize / 2, pos.y + eyeSize / 2, eyeSize * 0.45, 0, Math.PI * 2);
        ctx.fill();
        // Inner circle (background)
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(pos.x + eyeSize / 2, pos.y + eyeSize / 2, eyeSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Center dot
        ctx.fillStyle = innerColor;
        ctx.beginPath();
        ctx.arc(pos.x + eyeSize / 2, pos.y + eyeSize / 2, eyeSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else if (pattern === 'rounded') {
        // Rounded outer square
        drawRoundedRect(ctx, pos.x + moduleSize * 0.5, pos.y + moduleSize * 0.5, eyeSize - moduleSize, eyeSize - moduleSize, moduleSize);
        ctx.fill();
        // Inner square (background)
        ctx.fillStyle = bgColor;
        drawRoundedRect(ctx, pos.x + moduleSize * 2, pos.y + moduleSize * 2, eyeSize - moduleSize * 4, eyeSize - moduleSize * 4, moduleSize * 0.5);
        ctx.fill();
        // Center rounded square
        ctx.fillStyle = innerColor;
        drawRoundedRect(ctx, pos.x + moduleSize * 3, pos.y + moduleSize * 3, moduleSize, moduleSize, moduleSize * 0.3);
        ctx.fill();
      } else if (pattern === 'leaf') {
        // Leaf-shaped eye (rounded corners with emphasis)
        ctx.beginPath();
        ctx.moveTo(pos.x + eyeSize / 2, pos.y);
        ctx.bezierCurveTo(pos.x + eyeSize, pos.y, pos.x + eyeSize, pos.y + eyeSize / 2, pos.x + eyeSize / 2, pos.y + eyeSize / 2);
        ctx.bezierCurveTo(pos.x + eyeSize / 2, pos.y + eyeSize, pos.x, pos.y + eyeSize, pos.x, pos.y + eyeSize / 2);
        ctx.bezierCurveTo(pos.x, pos.y, pos.x + eyeSize / 2, pos.y, pos.x + eyeSize / 2, pos.y);
        ctx.fill();
        // Inner
        ctx.fillStyle = innerColor;
        ctx.beginPath();
        ctx.arc(pos.x + eyeSize / 2, pos.y + eyeSize / 2, eyeSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Default square
        ctx.fillRect(pos.x + moduleSize, pos.y + moduleSize, eyeSize - moduleSize * 2, eyeSize - moduleSize * 2);
        ctx.fillStyle = bgColor;
        ctx.fillRect(pos.x + moduleSize * 2, pos.y + moduleSize * 2, eyeSize - moduleSize * 4, eyeSize - moduleSize * 4);
        ctx.fillStyle = innerColor;
        ctx.fillRect(pos.x + moduleSize * 3, pos.y + moduleSize * 3, moduleSize, moduleSize);
      }
    });
  };
  
  // Helper to draw rounded rectangle
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  };
  
  // Helper to draw logo with positioning and shapes
  const drawLogo = async (ctx, logoImage, qrCodeSize, frameSize, position, shape, border, borderColor) => {
    const logoImg = await loadImage(logoImage);
    const logoSizePixels = qrCodeSize * logoSize;
    
    // Calculate position
    let x, y;
    switch (position) {
      case 'topLeft':
        x = frameSize + qrCodeSize * 0.1;
        y = frameSize + qrCodeSize * 0.1;
        break;
      case 'topRight':
        x = frameSize + qrCodeSize * 0.9 - logoSizePixels;
        y = frameSize + qrCodeSize * 0.1;
        break;
      case 'bottomLeft':
        x = frameSize + qrCodeSize * 0.1;
        y = frameSize + qrCodeSize * 0.9 - logoSizePixels;
        break;
      case 'bottomRight':
        x = frameSize + qrCodeSize * 0.9 - logoSizePixels;
        y = frameSize + qrCodeSize * 0.9 - logoSizePixels;
        break;
      default: // center
        x = frameSize + (qrCodeSize - logoSizePixels) / 2;
        y = frameSize + (qrCodeSize - logoSizePixels) / 2;
    }
    
    // Save context
    ctx.save();
    
    // Create clipping path based on shape
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x + logoSizePixels / 2, y + logoSizePixels / 2, logoSizePixels / 2, 0, Math.PI * 2);
      ctx.clip();
    } else if (shape === 'rounded') {
      drawRoundedRect(ctx, x, y, logoSizePixels, logoSizePixels, logoSizePixels * 0.2);
      ctx.clip();
    }
    
    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 5, y - 5, logoSizePixels + 10, logoSizePixels + 10);
    
    // Draw border if enabled
    if (border) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(x + logoSizePixels / 2, y + logoSizePixels / 2, logoSizePixels / 2, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape === 'rounded') {
        drawRoundedRect(ctx, x, y, logoSizePixels, logoSizePixels, logoSizePixels * 0.2);
        ctx.stroke();
      } else {
        ctx.strokeRect(x, y, logoSizePixels, logoSizePixels);
      }
    }
    
    // Draw logo
    ctx.drawImage(logoImg, x, y, logoSizePixels, logoSizePixels);
    
    // Restore context
    ctx.restore();
  };
  
  // Helper to draw background pattern
  const drawBackgroundPattern = (ctx, width, height, bgColor, pattern, opacity) => {
    ctx.fillStyle = bgColor;
    ctx.globalAlpha = opacity;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
    
    ctx.strokeStyle = bgColor === '#ffffff' ? '#e0e0e0' : '#404040';
    ctx.lineWidth = 1;
    
    if (pattern === 'dots') {
      for (let x = 0; x < width; x += 20) {
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (pattern === 'grid') {
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (pattern === 'lines') {
      for (let x = 0; x < width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }
  };
  
  // Helper to apply corner radius to entire QR
  const applyCornerRadius = (canvas, radius) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a new canvas with rounded corners
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw rounded rectangle as clipping path
    tempCtx.beginPath();
    drawRoundedRect(tempCtx, 0, 0, width, height, radius);
    tempCtx.clip();
    
    // Draw original canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Copy back
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(tempCanvas, 0, 0);
  };
  
  // Helper to check contrast
  const checkContrast = (fgColor, bgColor) => {
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = ((rgb >> 0) & 0xff) / 255;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(fgColor);
    const l2 = getLuminance(bgColor);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    setContrastScore(ratio.toFixed(2));
    
    if (ratio < 3) {
      setScannabilityWarning('⚠️ Poor contrast! QR may be hard to scan.');
    } else if (ratio < 5) {
      setScannabilityWarning('⚡ Moderate contrast. Should scan in good lighting.');
    } else {
      setScannabilityWarning('✅ Great contrast! Highly scannable.');
    }
  };
  
  // Helper function to draw frame
  const drawFrame = (ctx, size, style, text, color, borderWidth = 4, cornerStyle = 'none') => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    
    if (style === 'text' && text) {
      // Draw text below QR code
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(text, size / 2, size - 10);
    } else if (style === 'decorative') {
      // Draw decorative border
      ctx.strokeRect(10, 10, size - 20, size - 20);
      
      // Draw corner decorations based on style
      const cornerSize = 20;
      const corners = [
        [15, 15], [size - 15, 15], [15, size - 15], [size - 15, size - 15]
      ];
      
      corners.forEach(([x, y]) => {
        if (cornerStyle === 'dots') {
          ctx.beginPath();
          ctx.arc(x, y, cornerSize / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (cornerStyle === 'rounded') {
          ctx.fillRect(x - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, cornerSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Draw text if provided
      if (text) {
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(text, size / 2, size - 15);
      }
    } else if (style === 'modern') {
      // Modern minimal frame
      ctx.lineWidth = 2;
      ctx.strokeRect(5, 5, size - 10, size - 10);
      if (text) {
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, size / 2, size - 8);
      }
    } else if (style === 'vintage') {
      // Vintage double-border frame
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, size - 16, size - 16);
      ctx.lineWidth = 1;
      ctx.strokeRect(12, 12, size - 24, size - 24);
      if (text) {
        ctx.font = 'italic 20px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText(text, size / 2, size - 12);
      }
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

  const openGenerateInTab = () => {
    // Open dedicated single QR generator page
    const url = chrome.runtime.getURL('generate.html');
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
    <div className={fullWidth ? "max-w-[1400px] mx-auto space-y-6" : "p-6 h-full overflow-y-auto space-y-4"}>
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

      {/* Open Full Page Button - Show only in popup (not in dedicated page) */}
      {!fullWidth && !hideToggle && window.innerWidth <= 480 && !bulkMode && (
        <div className={`${tertiaryClass} p-4 rounded-md-xl shadow-md-2`}>
          <div className="flex items-center gap-3">
            <OpenInNewIcon style={{ fontSize: 32 }} className={textClass} />
            <div className="flex-1">
              <h3 className="text-title-small font-medium mb-1">
                Want More Space?
              </h3>
              <p className="text-body-small mb-2">
                Open QR Generator in a full page for better experience with all customization options.
              </p>
            </div>
          </div>
          <button
            onClick={openGenerateInTab}
            className={`${primaryClass} w-full py-2.5 px-4 rounded-md-lg font-medium text-label-large shadow-md-1 state-layer transition-all hover:shadow-md-2 flex items-center justify-center gap-2 mt-2`}
          >
            <OpenInNewIcon fontSize="small" />
            Open in Full Page
          </button>
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
        <>
        {/* Main Content Container */}
        <div className={fullWidth ? "grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8" : "space-y-4 animate-fade-in"}>
          {/* Left Column - Controls */}
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
              <ExpandMoreIcon className={`transform transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} fontSize="small" />
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
                  <div className="flex items-center gap-1 mt-2">
                    <AutoAwesomeIcon fontSize="inherit" className={`${textSecondaryClass} text-xs`} />
                    <p className={`text-body-small ${textSecondaryClass}`}>Updates automatically with live preview</p>
                  </div>
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
                    <div className="space-y-3 mt-2">
                      {/* Gradient Type */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setGradientType('linear')}
                          className={`py-2 px-3 rounded-md-md font-medium text-label-small transition-all ${
                            gradientType === 'linear' ? primaryClass : secondaryClass
                          }`}
                        >
                          Linear
                        </button>
                        <button
                          onClick={() => setGradientType('radial')}
                          className={`py-2 px-3 rounded-md-md font-medium text-label-small transition-all ${
                            gradientType === 'radial' ? primaryClass : secondaryClass
                          }`}
                        >
                          Radial
                        </button>
                      </div>
                      
                      {/* Gradient Angle (Linear only) */}
                      {gradientType === 'linear' && (
                        <div>
                          <label className={`block text-label-small ${textSecondaryClass} mb-1`}>
                            Angle: {gradientAngle}°
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="15"
                            value={gradientAngle}
                            onChange={(e) => setGradientAngle(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      )}
                      
                      {/* Gradient Color 2 */}
                      <div className="flex gap-2">
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
                      
                      {/* Multi-Color Gradient */}
                      <label className={`flex items-center gap-2 text-label-small ${textSecondaryClass}`}>
                        <input
                          type="checkbox"
                          checked={multiColorGradient}
                          onChange={(e) => setMultiColorGradient(e.target.checked)}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        3-Color Gradient
                      </label>
                      
                      {multiColorGradient && (
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={gradientColor3}
                            onChange={(e) => setGradientColor3(e.target.value)}
                            className={`w-12 h-10 rounded-md-md border ${outlineClass} cursor-pointer`}
                          />
                          <input
                            type="text"
                            value={gradientColor3}
                            onChange={(e) => setGradientColor3(e.target.value)}
                            placeholder="Gradient color 3"
                            className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-md px-3 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Eye/Finder Pattern Customization */}
                <div className={`p-3 ${isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'} rounded-md-lg`}>
                  <label className={`flex items-center gap-2 text-label-medium ${textSecondaryClass} mb-2`}>
                    <input
                      type="checkbox"
                      checked={customizeEyes}
                      onChange={(e) => setCustomizeEyes(e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    ⭐ Customize Eye Patterns (Corner Squares)
                  </label>
                  {customizeEyes && (
                    <div className="space-y-3 mt-3">
                      {/* Eye Pattern Style */}
                      <div>
                        <label className={`block text-label-small ${textSecondaryClass} mb-2`}>
                          Eye Shape
                        </label>
                        <select
                          value={eyePattern}
                          onChange={(e) => setEyePattern(e.target.value)}
                          className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary text-sm`}
                        >
                          <option value="square">Square</option>
                          <option value="circle">Circle</option>
                          <option value="rounded">Rounded</option>
                          <option value="leaf">Leaf</option>
                        </select>
                      </div>
                      
                      {/* Eye Color */}
                      <div>
                        <label className={`block text-label-small ${textSecondaryClass} mb-2`}>
                          Eye Color (leave empty for foreground color)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={eyeColor || foregroundColor}
                            onChange={(e) => setEyeColor(e.target.value)}
                            className={`w-12 h-10 rounded-md-md border ${outlineClass} cursor-pointer`}
                          />
                          <input
                            type="text"
                            value={eyeColor}
                            onChange={(e) => setEyeColor(e.target.value)}
                            placeholder="Use foreground color"
                            className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-md px-3 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary text-sm`}
                          />
                        </div>
                      </div>
                      
                      {/* Eye Inner Color */}
                      <div>
                        <label className={`block text-label-small ${textSecondaryClass} mb-2`}>
                          Inner Eye Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={eyeInnerColor || foregroundColor}
                            onChange={(e) => setEyeInnerColor(e.target.value)}
                            className={`w-12 h-10 rounded-md-md border ${outlineClass} cursor-pointer`}
                          />
                          <input
                            type="text"
                            value={eyeInnerColor}
                            onChange={(e) => setEyeInnerColor(e.target.value)}
                            placeholder="Use foreground color"
                            className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-md px-3 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary text-sm`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logo Options */}
                {logoImage && (
                  <div className={`p-3 ${isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'} rounded-md-lg`}>
                    <label className={`block text-label-medium ${textSecondaryClass} mb-3`}>
                      🎯 Logo Positioning & Style
                    </label>
                    
                    {/* Logo Position */}
                    <div className="mb-3">
                      <label className={`block text-label-small ${textSecondaryClass} mb-2`}>Position</label>
                      <select
                        value={logoPosition}
                        onChange={(e) => setLogoPosition(e.target.value)}
                        className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary text-sm`}
                      >
                        <option value="center">Center</option>
                        <option value="topLeft">Top Left</option>
                        <option value="topRight">Top Right</option>
                        <option value="bottomLeft">Bottom Left</option>
                        <option value="bottomRight">Bottom Right</option>
                      </select>
                    </div>
                    
                    {/* Logo Shape */}
                    <div className="mb-3">
                      <label className={`block text-label-small ${textSecondaryClass} mb-2`}>Shape</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setLogoShape('square')}
                          className={`py-2 px-3 rounded-md-md font-medium text-label-small transition-all ${
                            logoShape === 'square' ? primaryClass : secondaryClass
                          }`}
                        >
                          Square
                        </button>
                        <button
                          onClick={() => setLogoShape('circle')}
                          className={`py-2 px-3 rounded-md-md font-medium text-label-small transition-all ${
                            logoShape === 'circle' ? primaryClass : secondaryClass
                          }`}
                        >
                          Circle
                        </button>
                        <button
                          onClick={() => setLogoShape('rounded')}
                          className={`py-2 px-3 rounded-md-md font-medium text-label-small transition-all ${
                            logoShape === 'rounded' ? primaryClass : secondaryClass
                          }`}
                        >
                          Rounded
                        </button>
                      </div>
                    </div>
                    
                    {/* Logo Border */}
                    <div>
                      <label className={`flex items-center gap-2 text-label-small ${textSecondaryClass} mb-2`}>
                        <input
                          type="checkbox"
                          checked={logoBorder}
                          onChange={(e) => setLogoBorder(e.target.checked)}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        Add Border
                      </label>
                      {logoBorder && (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="color"
                            value={logoBorderColor}
                            onChange={(e) => setLogoBorderColor(e.target.value)}
                            className={`w-12 h-10 rounded-md-md border ${outlineClass} cursor-pointer`}
                          />
                          <input
                            type="text"
                            value={logoBorderColor}
                            onChange={(e) => setLogoBorderColor(e.target.value)}
                            placeholder="Border color"
                            className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-md px-3 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary text-sm`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Background & Effects */}
                <div className={`p-3 ${isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'} rounded-md-lg`}>
                  <div className="flex items-center gap-2 mb-3">
                    <BrushIcon fontSize="small" className={textSecondaryClass} />
                    <label className={`text-label-medium font-medium ${textClass}`}>
                      Background & Effects
                    </label>
                  </div>
                  
                  {/* Background Pattern */}
                  <div className="mb-3">
                    <label className={`block text-label-small ${textSecondaryClass} mb-2`}>Background Pattern</label>
                    <select
                      value={backgroundPattern}
                      onChange={(e) => setBackgroundPattern(e.target.value)}
                      className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary text-sm`}
                    >
                      <option value="none">None</option>
                      <option value="dots">Dots</option>
                      <option value="grid">Grid</option>
                      <option value="lines">Lines</option>
                    </select>
                  </div>
                  
                  {/* Background Opacity */}
                  <div className="mb-3">
                    <label className={`block text-label-small ${textSecondaryClass} mb-1`}>
                      Background Opacity: {Math.round(backgroundOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={backgroundOpacity}
                      onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Shadow Effect */}
                  <label className={`flex items-center gap-2 text-label-small ${textSecondaryClass} mb-2`}>
                    <input
                      type="checkbox"
                      checked={shadowEnabled}
                      onChange={(e) => setShadowEnabled(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    Drop Shadow
                  </label>
                  {shadowEnabled && (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={shadowColor}
                          onChange={(e) => setShadowColor(e.target.value)}
                          className={`w-12 h-10 rounded-md-md border ${outlineClass} cursor-pointer`}
                        />
                        <input
                          type="text"
                          value={shadowColor}
                          onChange={(e) => setShadowColor(e.target.value)}
                          placeholder="Shadow color"
                          className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-md px-3 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`block text-label-small ${textSecondaryClass} mb-1`}>
                          Shadow Blur: {shadowBlur}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="2"
                          value={shadowBlur}
                          onChange={(e) => setShadowBlur(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Corner Radius */}
                  <div className="mt-3">
                    <label className={`block text-label-small ${textSecondaryClass} mb-1`}>
                      Corner Radius: {cornerRadius}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={cornerRadius}
                      onChange={(e) => setCornerRadius(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Quiet Zone */}
                  <div className="mt-3">
                    <label className={`block text-label-small ${textSecondaryClass} mb-1`}>
                      Quiet Zone (Margin): {quietZone}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={quietZone}
                      onChange={(e) => setQuietZone(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Frame Advanced Options */}
                {frameStyle !== 'none' && (
                  <div className={`p-3 ${isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'} rounded-md-lg`}>
                    <label className={`block text-label-medium ${textSecondaryClass} mb-3`}>
                      📝 Frame Options
                    </label>
                    
                    {/* Add Modern & Vintage to frame style */}
                    <div className="mb-3">
                      <label className={`block text-label-small ${textSecondaryClass} mb-2`}>Frame Style</label>
                      <select
                        value={frameStyle}
                        onChange={(e) => setFrameStyle(e.target.value)}
                        className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-md p-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary text-sm`}
                      >
                        <option value="none">No Frame</option>
                        <option value="text">Text Label</option>
                        <option value="decorative">Decorative Border</option>
                        <option value="modern">Modern Minimal</option>
                        <option value="vintage">Vintage Double-Border</option>
                      </select>
                    </div>
                    
                    {/* Border Width */}
                    <div className="mb-3">
                      <label className={`block text-label-small ${textSecondaryClass} mb-1`}>
                        Border Width: {frameBorderWidth}px
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={frameBorderWidth}
                        onChange={(e) => setFrameBorderWidth(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Corner Style */}
                    {frameStyle === 'decorative' && (
                      <div>
                        <label className={`block text-label-small ${textSecondaryClass} mb-2`}>Corner Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setFrameCornerStyle('none')}
                            className={`py-2 px-3 rounded-md-md font-medium text-label-small transition-all ${
                              frameCornerStyle === 'none' ? primaryClass : secondaryClass
                            }`}
                          >
                            Circle
                          </button>
                          <button
                            onClick={() => setFrameCornerStyle('dots')}
                            className={`py-2 px-3 rounded-md-md font-medium text-label-small transition-all ${
                              frameCornerStyle === 'dots' ? primaryClass : secondaryClass
                            }`}
                          >
                            Dots
                          </button>
                          <button
                            onClick={() => setFrameCornerStyle('rounded')}
                            className={`py-2 px-3 rounded-md-md font-medium text-label-small transition-all ${
                              frameCornerStyle === 'rounded' ? primaryClass : secondaryClass
                            }`}
                          >
                            Square
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contrast Checker */}
                {contrastScore && (
                  <div className={`p-3 rounded-md-lg ${
                    parseFloat(contrastScore) < 3 ? errorClass : 
                    parseFloat(contrastScore) < 5 ? tertiaryClass : secondaryClass
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-label-medium font-medium`}>
                          Contrast Ratio: {contrastScore}:1
                        </p>
                        <p className={`text-body-small mt-1`}>
                          {scannabilityWarning}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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

                {/* Quick Theme Presets Section */}
                <div className={`p-4 ${isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container'} rounded-md-lg`}>
                  <div className="flex items-center gap-2 mb-3">
                    <ColorLensIcon fontSize="small" className={textClass} />
                    <label className={`text-title-medium font-bold ${textClass}`}>
                      Quick Theme Presets
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Sunset Theme */}
                    <button
                      onClick={() => {
                        setForegroundColor('#FF6B35');
                        setBackgroundColor('#FFE5D9');
                        setGradientEnabled(true);
                        setGradientColor2('#FF8C42');
                        setGradientType('linear');
                        setGradientAngle(135);
                        setCustomizeEyes(true);
                        setEyePattern('rounded');
                        setEyeColor('#D64933');
                        setCornerRadius(15);
                        setBackgroundPattern('dots');
                        setBackgroundOpacity(0.3);
                        setFrameStyle('modern');
                      }}
                      className={`p-3 rounded-md-md text-left transition-all ${secondaryClass} hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full" style={{background: 'linear-gradient(135deg, #FF6B35, #FF8C42)'}}></div>
                        <span className={`text-label-large font-medium ${textClass}`}>Sunset</span>
                      </div>
                      <p className={`text-body-small ${textSecondaryClass}`}>Warm & inviting</p>
                    </button>
                    
                    {/* Ocean Theme */}
                    <button
                      onClick={() => {
                        setForegroundColor('#0077B6');
                        setBackgroundColor('#CAF0F8');
                        setGradientEnabled(true);
                        setGradientColor2('#00B4D8');
                        setGradientType('radial');
                        setCustomizeEyes(true);
                        setEyePattern('circle');
                        setEyeColor('#023E8A');
                        setCornerRadius(20);
                        setBackgroundPattern('none');
                        setFrameStyle('modern');
                        setShadowEnabled(true);
                        setShadowColor('#0077B633');
                      }}
                      className={`p-3 rounded-md-md text-left transition-all ${secondaryClass} hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full" style={{background: 'radial-gradient(circle, #00B4D8, #0077B6)'}}></div>
                        <span className={`text-label-large font-medium ${textClass}`}>Ocean</span>
                      </div>
                      <p className={`text-body-small ${textSecondaryClass}`}>Cool & clean</p>
                    </button>
                    
                    {/* Forest Theme */}
                    <button
                      onClick={() => {
                        setForegroundColor('#2D6A4F');
                        setBackgroundColor('#D8F3DC');
                        setGradientEnabled(true);
                        setGradientColor2('#40916C');
                        setMultiColorGradient(true);
                        setGradientColor3('#52B788');
                        setGradientType('linear');
                        setGradientAngle(45);
                        setCustomizeEyes(true);
                        setEyePattern('leaf');
                        setEyeColor('#1B4332');
                        setBackgroundPattern('lines');
                        setBackgroundOpacity(0.2);
                        setCornerRadius(10);
                      }}
                      className={`p-3 rounded-md-md text-left transition-all ${secondaryClass} hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full" style={{background: 'linear-gradient(45deg, #2D6A4F, #40916C, #52B788)'}}></div>
                        <span className={`text-label-large font-medium ${textClass}`}>Forest</span>
                      </div>
                      <p className={`text-body-small ${textSecondaryClass}`}>Natural & fresh</p>
                    </button>
                    
                    {/* Neon Theme */}
                    <button
                      onClick={() => {
                        setForegroundColor('#FF006E');
                        setBackgroundColor('#000000');
                        setGradientEnabled(true);
                        setGradientColor2('#8338EC');
                        setGradientType('linear');
                        setGradientAngle(90);
                        setCustomizeEyes(true);
                        setEyePattern('rounded');
                        setEyeColor('#3A86FF');
                        setCornerRadius(0);
                        setShadowEnabled(true);
                        setShadowColor('#FF006E88');
                        setShadowBlur(20);
                        setFrameStyle('modern');
                      }}
                      className={`p-3 rounded-md-md text-left transition-all ${secondaryClass} hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full" style={{background: 'linear-gradient(90deg, #FF006E, #8338EC)'}}></div>
                        <span className={`text-label-large font-medium ${textClass}`}>Neon</span>
                      </div>
                      <p className={`text-body-small ${textSecondaryClass}`}>Bold & electric</p>
                    </button>
                    
                    {/* Vintage Theme */}
                    <button
                      onClick={() => {
                        setForegroundColor('#6C584C');
                        setBackgroundColor('#F0EAD2');
                        setGradientEnabled(false);
                        setCustomizeEyes(true);
                        setEyePattern('square');
                        setEyeColor('#432818');
                        setCornerRadius(0);
                        setBackgroundPattern('grid');
                        setBackgroundOpacity(0.15);
                        setFrameStyle('vintage');
                        setFrameBorderWidth(6);
                      }}
                      className={`p-3 rounded-md-md text-left transition-all ${secondaryClass} hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-[#6C584C]"></div>
                        <span className={`text-label-large font-medium ${textClass}`}>Vintage</span>
                      </div>
                      <p className={`text-body-small ${textSecondaryClass}`}>Classic & elegant</p>
                    </button>
                    
                    {/* Modern Theme */}
                    <button
                      onClick={() => {
                        setForegroundColor('#000000');
                        setBackgroundColor('#FFFFFF');
                        setGradientEnabled(false);
                        setCustomizeEyes(true);
                        setEyePattern('rounded');
                        setEyeColor('#000000');
                        setCornerRadius(25);
                        setBackgroundPattern('none');
                        setShadowEnabled(true);
                        setShadowColor('#00000022');
                        setShadowBlur(10);
                        setFrameStyle('modern');
                      }}
                      className={`p-3 rounded-md-md text-left transition-all ${secondaryClass} hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <span className={`text-label-large font-medium ${textClass}`}>Modern</span>
                      </div>
                      <p className={`text-body-small ${textSecondaryClass}`}>Minimal & clean</p>
                    </button>
                    
                    {/* Pastel Theme */}
                    <button
                      onClick={() => {
                        setForegroundColor('#BF94E4');
                        setBackgroundColor('#FFF8F3');
                        setGradientEnabled(true);
                        setGradientColor2('#C490D1');
                        setMultiColorGradient(true);
                        setGradientColor3('#96CEB4');
                        setGradientType('radial');
                        setCustomizeEyes(true);
                        setEyePattern('circle');
                        setEyeColor('#AA96DA');
                        setCornerRadius(30);
                        setBackgroundPattern('dots');
                        setBackgroundOpacity(0.25);
                      }}
                      className={`p-3 rounded-md-md text-left transition-all ${secondaryClass} hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full" style={{background: 'radial-gradient(circle, #BF94E4, #C490D1, #96CEB4)'}}></div>
                        <span className={`text-label-large font-medium ${textClass}`}>Pastel</span>
                      </div>
                      <p className={`text-body-small ${textSecondaryClass}`}>Soft & dreamy</p>
                    </button>
                    
                    {/* Fire Theme */}
                    <button
                      onClick={() => {
                        setForegroundColor('#DC2F02');
                        setBackgroundColor('#FFBA08');
                        setGradientEnabled(true);
                        setGradientColor2('#F48C06');
                        setMultiColorGradient(true);
                        setGradientColor3('#E85D04');
                        setGradientType('linear');
                        setGradientAngle(180);
                        setCustomizeEyes(true);
                        setEyePattern('rounded');
                        setEyeColor('#9D0208');
                        setCornerRadius(15);
                        setShadowEnabled(true);
                        setShadowColor('#DC2F0266');
                        setShadowBlur(15);
                      }}
                      className={`p-3 rounded-md-md text-left transition-all ${secondaryClass} hover:scale-105`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full" style={{background: 'linear-gradient(180deg, #DC2F02, #F48C06, #E85D04)'}}></div>
                        <span className={`text-label-large font-medium ${textClass}`}>Fire</span>
                      </div>
                      <p className={`text-body-small ${textSecondaryClass}`}>Hot & energetic</p>
                    </button>
                  </div>
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

          {/* Generate Button - Now with Auto Preview */}
          <button
            onClick={generateQRCode}
            disabled={generating || !inputText.trim()}
            className={`${primaryClass} w-full py-3 px-6 rounded-md-lg font-medium text-label-large shadow-md-2 state-layer transition-all hover:shadow-md-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            <QrCode2Icon />
            {generating ? 'Generating...' : qrDataURL ? 'Regenerate QR Code' : 'Generate QR Code'}
          </button>

          {/* Live Preview Indicator */}
          {inputText.trim() && (
            <div className={`${secondaryClass} px-3 py-2 rounded-md-md flex items-center justify-center gap-2`}>
              <AutoAwesomeIcon fontSize="small" />
              <p className="text-label-small">
                Live Preview Active - QR updates automatically as you customize
              </p>
            </div>
          )}

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
        
        {/* Right Column - Preview (in full width mode, show as sticky sidebar) */}
        {fullWidth && (
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4 h-fit">
            {qrDataURL ? (
              <>
                {/* QR Code Preview - Large */}
                <div className={`${cardClass} p-6 rounded-md-xl shadow-md-2`}>
                  <h3 className={`text-title-large font-bold ${textClass} mb-4`}>Preview</h3>
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-8 rounded-md-xl shadow-md-3 w-full flex justify-center">
                      <img src={qrDataURL} alt="Generated QR Code" className="w-full max-w-[400px] h-auto" />
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={downloadQRCode}
                        className={`${primaryClass} flex-1 py-4 px-6 rounded-md-lg font-medium text-label-large shadow-md-2 state-layer transition-all hover:shadow-md-3 flex items-center justify-center gap-2`}
                      >
                        <DownloadIcon />
                        Download
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className={`${secondaryClass} flex-1 py-4 px-6 rounded-md-lg font-medium text-label-large shadow-md-1 state-layer transition-all hover:shadow-md-2 flex items-center justify-center gap-2`}
                      >
                        <ContentCopyIcon />
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Export Options */}
                <div className={`${cardClass} p-5 rounded-md-xl shadow-md-2`}>
                  <p className={`text-title-small font-medium mb-3 ${textClass}`}>Export & Share</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={downloadAsSVG}
                      className={`${secondaryClass} py-3 px-4 rounded-md-md font-medium text-label-medium state-layer transition-all hover:shadow-md-1 flex items-center justify-center gap-2`}
                    >
                      <CodeIcon fontSize="small" />
                      SVG
                    </button>
                    <button
                      onClick={downloadAsWebP}
                      className={`${secondaryClass} py-3 px-4 rounded-md-md font-medium text-label-medium state-layer transition-all hover:shadow-md-1 flex items-center justify-center gap-2`}
                    >
                      <ImageIcon fontSize="small" />
                      WebP
                    </button>
                    <button
                      onClick={printQRCode}
                      className={`${secondaryClass} py-3 px-4 rounded-md-md font-medium text-label-medium state-layer transition-all hover:shadow-md-1 flex items-center justify-center gap-2`}
                    >
                      <PrintIcon fontSize="small" />
                      Print
                    </button>
                    <button
                      onClick={shareQRCode}
                      className={`${secondaryClass} py-3 px-4 rounded-md-md font-medium text-label-medium state-layer transition-all hover:shadow-md-1 flex items-center justify-center gap-2`}
                    >
                      <ShareIcon fontSize="small" />
                      Share
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Placeholder when no QR code */
              <div className={`${cardClass} p-8 rounded-md-xl shadow-md-2`}>
                <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
                  <QrCode2Icon sx={{ fontSize: 80 }} className={`${textSecondaryClass} opacity-30`} />
                  <div>
                    <h3 className={`text-title-medium font-medium ${textClass} mb-2`}>No QR Code Yet</h3>
                    <p className={`text-body-medium ${textSecondaryClass}`}>
                      Enter text or use Quick Actions to generate your QR code
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
        </>
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
