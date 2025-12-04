import React, { useState, useRef, useEffect } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ImageIcon from '@mui/icons-material/Image';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WifiIcon from '@mui/icons-material/Wifi';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import WarningIcon from '@mui/icons-material/Warning';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SmsIcon from '@mui/icons-material/Sms';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { parseQRContent } from '../utils/qrParsers';
import { checkURLSafety, shouldShowConfirmation } from '../utils/urlSafety';
import { trackAnalytics } from '../utils/analytics';
import AddIcon from '@mui/icons-material/Add';

function ScanTab({ theme, onTabChange }) {
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [scanMode, setScanMode] = useState('auto'); // 'auto', 'qr', or 'barcode'
  const [autoOpenUrl, setAutoOpenUrl] = useState(false);
  const [autoConnectWifi, setAutoConnectWifi] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [decoderWorker, setDecoderWorker] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Adaptive scan cadence tracking
  const [consecutiveEmptyScans, setConsecutiveEmptyScans] = useState(0);
  const [scanInterval, setScanInterval] = useState(0); // milliseconds delay between scans
  
  // Dialog and Snackbar states
  const [confirmDialog, setConfirmDialog] = useState({ open: false, url: '', warnings: [], resolve: null });
  const [infoDialog, setInfoDialog] = useState({ open: false, title: '', content: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    // Load settings
    chrome.storage.local.get(['autoOpenUrl', 'autoConnectWifi', 'soundEnabled', 'vibrationEnabled', 'showNotifications', 'cameraSettings'], (result) => {
      if (result.autoOpenUrl !== undefined) {
        setAutoOpenUrl(result.autoOpenUrl);
      }
      if (result.autoConnectWifi !== undefined) {
        setAutoConnectWifi(result.autoConnectWifi);
      }
      if (result.soundEnabled !== undefined) {
        setSoundEnabled(result.soundEnabled);
      }
      if (result.vibrationEnabled !== undefined) {
        setVibrationEnabled(result.vibrationEnabled);
      }
      if (result.showNotifications !== undefined) {
        setShowNotifications(result.showNotifications);
      }
      if (result.cameraSettings) {
        setFacingMode(result.cameraSettings.facingMode || 'environment');
        setSelectedCameraId(result.cameraSettings.selectedCameraId);
        setZoomLevel(result.cameraSettings.zoomLevel || 1);
        setTorchEnabled(result.cameraSettings.torchEnabled || false);
      }
    });

    // Get available cameras
    getAvailableCameras();

    // Initialize decoder worker
    const worker = new Worker(chrome.runtime.getURL('src/workers/decoderWorker.js'));
    worker.onmessage = (e) => {
      const { success, data, error } = e.data;
      if (success && data) {
        // Check if this is a new detection
        setResults(prev => {
          const isDuplicate = prev.some(r => r.data === data.text);
          if (!isDuplicate) {
            const result = {
              data: data.text,
              text: data.text,
              format: data.format,
              type: data.type,
              source: 'camera',
              timestamp: Date.now()
            };
            addToHistory(result.text, result.format);
            saveToHistory(result);
            handleScanResult(result);
            return [result, ...prev];
          }
          return prev;
        });
      }
    };
    setDecoderWorker(worker);

    // Check for pending scans from context menu
    chrome.storage.local.get(['pendingScan'], (result) => {
      console.log('Checking for pending scan:', result);
      if (result.pendingScan) {
        console.log('Found pending scan, processing:', result.pendingScan);
        // Clear the pending scan
        chrome.storage.local.remove(['pendingScan'], () => {
          // Scan the pending image using current scan mode
          scanImageFromUrl(result.pendingScan);
        });
      }
    });

    return () => {
      stopCamera();
    };
  }, [scanMode]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key - Close dialogs, history tray, or stop camera
      if (e.key === 'Escape') {
        if (confirmDialog.open) {
          handleConfirmDialogClose(false);
        } else if (infoDialog.open) {
          setInfoDialog({ ...infoDialog, open: false });
        } else if (showHistory) {
          setShowHistory(false);
        } else if (cameraActive) {
          stopCamera();
        }
      }
      
      // Enter key - Confirm primary action in dialogs
      if (e.key === 'Enter' && confirmDialog.open) {
        handleConfirmDialogClose(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog, infoDialog, showHistory, cameraActive]);

  // Handle paste events for image scanning
  useEffect(() => {
    const handlePaste = async (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleImageFile(file);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [scanMode]);

  const toggleAutoOpenUrl = () => {
    const newValue = !autoOpenUrl;
    setAutoOpenUrl(newValue);
    chrome.storage.local.set({ autoOpenUrl: newValue });
  };

  const handleScanResult = async (resultData) => {
    const data = resultData.data || resultData.text || '';
    
    // Play success feedback
    if (soundEnabled) {
      playSuccessSound();
    }
    
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(200); // Vibrate for 200ms
    }
    
    if (showNotifications) {
      showSnackbar('QR code detected!', 'success');
    }
    
    // Check if it's a WiFi QR code
    if (data && data.startsWith('WIFI:')) {
      const wifiData = parseWifiQRCode(data);
      if (autoConnectWifi && wifiData) {
        // Auto-show WiFi connection dialog
        handleWifiConnect(wifiData);
      }
    }
    // Check if result is a URL
    else if (data && (data.startsWith('http://') || data.startsWith('https://'))) {
      const safety = checkURLSafety(data);
      
      if (autoOpenUrl && safety.safe && !shouldShowConfirmation(data, autoOpenUrl)) {
        // Safe URL with auto-open enabled - open directly
        console.log('Auto-opening safe URL:', data);
        chrome.tabs.create({ url: data });
      } else if (autoOpenUrl && !safety.safe) {
        // Suspicious URL with auto-open - show confirmation
        const confirmed = await showURLConfirmation(data, safety.warnings);
        if (confirmed) {
          chrome.tabs.create({ url: data });
        }
      }
      // If auto-open is disabled, don't open automatically
    }
  };

  const parseWifiQRCode = (wifiString) => {
    const ssid = wifiString.match(/S:([^;]+)/)?.[1];
    const password = wifiString.match(/P:([^;]+)/)?.[1];
    const security = wifiString.match(/T:([^;]+)/)?.[1] || 'nopass';
    
    if (ssid) {
      return { ssid, password, security };
    }
    return null;
  };

  const handleWifiConnect = (wifiData) => {
    setInfoDialog({
      open: true,
      title: '📶 WiFi Network Detected',
      content: (
        <div className="space-y-3">
          <div>
            <p className={`text-body-small ${textSecondaryClass} mb-1`}>Network Name (SSID)</p>
            <p className={`text-body-large font-medium ${textClass}`}>{wifiData.ssid}</p>
          </div>
          {wifiData.password && (
            <div>
              <p className={`text-body-small ${textSecondaryClass} mb-1`}>Password</p>
              <div className="flex items-center gap-2">
                <p className={`text-body-large font-mono ${textClass}`}>{wifiData.password}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(wifiData.password);
                    showSnackbar('Password copied!', 'success');
                  }}
                  className={`${secondaryClass} p-1 rounded-md state-layer`}
                  aria-label="Copy password"
                >
                  <ContentCopyIcon fontSize="small" />
                </button>
              </div>
            </div>
          )}
          <div>
            <p className={`text-body-small ${textSecondaryClass} mb-1`}>Security Type</p>
            <p className={`text-body-large ${textClass}`}>{wifiData.security.toUpperCase()}</p>
          </div>
          <div className={`${isDark ? 'bg-md-dark-surface-variant' : 'bg-md-light-surface-variant'} p-3 rounded-md-lg mt-3`}>
            <p className={`text-body-small ${textSecondaryClass}`}>
              ℹ️ Chrome extensions cannot directly connect to WiFi networks. Please use your device's WiFi settings to connect manually with the credentials above.
            </p>
          </div>
        </div>
      )
    });
  };

  const playSuccessSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const showURLConfirmation = (url, warnings) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        open: true,
        url,
        warnings,
        resolve
      });
    });
  };

  const handleConfirmDialogClose = (confirmed) => {
    if (confirmDialog.resolve) {
      confirmDialog.resolve(confirmed);
    }
    setConfirmDialog({ open: false, url: '', warnings: [], resolve: null });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // History management functions
  const addToHistory = (text, format) => {
    const newEntry = {
      id: Date.now(),
      text,
      format,
      timestamp: new Date().toLocaleString()
    };
    setScanHistory(prev => [newEntry, ...prev].slice(0, 5)); // Keep last 5
  };

  const copyFromHistory = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard!', 'success');
  };

  const openFromHistory = async (text) => {
    const confirmed = await showURLConfirmation(text);
    if (confirmed) {
      window.open(text, '_blank');
    }
  };

  const clearHistory = () => {
    setScanHistory([]);
    showSnackbar('History cleared', 'info');
  };

  const scanImageFromUrl = async (imageUrl) => {
    console.log('Starting scanImageFromUrl with URL:', imageUrl);
    setScanning(true);
    setError('');
    setResults([]);

    try {
      // Validate URL
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('Invalid image URL provided');
      }

      // Fetch the image as a blob to avoid CORS issues
      console.log('Fetching image...');
      const response = await fetch(imageUrl, {
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Image fetched as blob, size:', blob.size, 'type:', blob.type);

      // Validate blob
      if (blob.size === 0) {
        throw new Error('Image blob is empty');
      }

      if (!blob.type.startsWith('image/')) {
        throw new Error('URL does not point to a valid image');
      }
      
      // Create an object URL from the blob
      const objectUrl = URL.createObjectURL(blob);
      
      // Create an image element and scan it
      const img = new Image();
      
      img.onload = async () => {
        console.log('Image loaded successfully, dimensions:', img.naturalWidth, 'x', img.naturalHeight);
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Scale down large images for better performance
          const maxSize = 1024;
          let { naturalWidth: width, naturalHeight: height } = img;
          
          if (width === 0 || height === 0) {
            setError('Image appears to be empty or corrupted.');
            setScanning(false);
            return;
          }
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, width, height);
          
          // Validate image data
          if (imageData.data.length !== width * height * 4) {
            setError('Invalid image data format.');
            setScanning(false);
            return;
          }
          
          // Use worker for decoding
          const result = await scanWithWorker(imageData.data, width, height, scanMode);
          
          if (result) {
            const qrResult = {
              data: result.text,
              text: result.text,
              type: result.type,
              format: result.format,
              source: 'context-menu',
              imageUrl: imageUrl,
              timestamp: Date.now(),
            };
            setResults([qrResult]);
            addToHistory(qrResult.text, qrResult.format);
            saveToHistory(qrResult);
            handleScanResult(qrResult);
          } else {
            setError('No QR code or barcode found in this image.');
          }
        } catch (scanErr) {
          console.error('Image scan error:', scanErr);
          setError('Error scanning image: ' + scanErr.message);
        } finally {
          setScanning(false);
          URL.revokeObjectURL(objectUrl); // Clean up
        }
      };
      
      img.onerror = (err) => {
        console.error('Failed to load image:', err, 'URL:', imageUrl);
        URL.revokeObjectURL(objectUrl); // Clean up
        setError('Failed to load image for scanning.');
        setScanning(false);
      };
      
      img.src = objectUrl;
    } catch (err) {
      console.error('Error fetching image:', err);
      setError('Error fetching image: ' + err.message);
      setScanning(false);
    }
  };

  const generateQRForCurrentTab = async () => {
    try {
      // Query for the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.url) {
        // Check if this is a chrome:// or extension URL
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
          setSnackbar({
            open: true,
            message: 'Cannot generate QR for Chrome internal pages',
            severity: 'error'
          });
          return;
        }

        // Store the URL to be generated in storage
        chrome.storage.local.set({ 
          pendingGenerate: {
            data: tab.url,
            type: 'url',
            title: tab.title || 'Current Tab'
          }
        }, () => {
          // Switch to generate tab
          if (onTabChange) {
            onTabChange('generate');
          }
          
          // Show success notification
          setSnackbar({
            open: true,
            message: 'Switched to Generate tab with current URL',
            severity: 'success'
          });
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Unable to get current tab URL',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error getting current tab:', err);
      setSnackbar({
        open: true,
        message: 'Failed to get current tab URL',
        severity: 'error'
      });
    }
  };

  const scanCurrentPage = async () => {
    setScanning(true);
    setError('');
    setResults([]);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we can access this tab
      if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        setError('Cannot scan Chrome internal pages. Please try on a regular webpage.');
        setScanning(false);
        return;
      }

      // Show overlay on the current tab
      chrome.tabs.sendMessage(tab.id, { action: 'showOverlay' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Overlay error:', chrome.runtime.lastError.message || chrome.runtime.lastError);
          setError(`Failed to show page overlay: ${chrome.runtime.lastError.message || 'Unknown error'}. Please refresh the page and try again.`);
          setScanning(false);
        } else if (response && response.success) {
          // Overlay shown successfully
          console.log('Page overlay activated');
          // Close the popup so overlay is visible
          window.close();
        } else {
          setError('Failed to activate page overlay.');
          setScanning(false);
        }
      });

    } catch (err) {
      setError('Error activating page overlay: ' + err.message);
      setScanning(false);
    }
  };

  const startCamera = async () => {
    setError('');
    setResults([]);
    
    // Check if we're in the extension popup (limited camera access)
    // Chrome extensions popups have issues with camera permissions
    // Better to open camera in a dedicated page
    try {
      // First check if camera permission is already granted
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      
      if (permissionStatus.state === 'prompt' || permissionStatus.state === 'denied') {
        // Permission not granted yet - open camera in new tab for proper permission flow
        console.log('Camera permission not granted, opening dedicated camera page');
        chrome.tabs.create({ url: chrome.runtime.getURL('camera.html') });
        return;
      }
    } catch (permError) {
      // Permissions API might not support camera in some contexts
      // Try to access camera directly, fallback to dedicated page if it fails
      console.log('Permissions API check failed, will try direct access:', permError);
    }
    
    setCameraActive(true); // Set active first to render video element
    
    try {
      console.log('Requesting camera access...');
      const constraints = {
        video: { 
          ...(selectedCameraId ? { deviceId: { exact: selectedCameraId } } : { facingMode }),
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          aspectRatio: { ideal: 16/9 },
          frameRate: { ideal: 30, max: 30 },
          zoom: zoomLevel,
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;
      
      // Apply torch if enabled
      if (torchEnabled) {
        try {
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities();
          if (capabilities.torch) {
            await track.applyConstraints({
              advanced: [{ torch: true }]
            });
          }
        } catch (torchErr) {
          console.warn('Could not enable torch:', torchErr);
          setTorchEnabled(false);
        }
      }
      
      // Wait a bit for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (videoRef.current) {
        console.log('Setting video source...');
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current.play();
            console.log('Video playing successfully');
            
            // Give video a moment to render, then start scanning
            setTimeout(() => {
              console.log('Starting QR scan...');
              scanFromCamera();
            }, 500);
          } catch (playError) {
            console.error('Play failed:', playError);
            setError('Failed to play video: ' + playError.message);
            setCameraActive(false);
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
              streamRef.current = null;
            }
          }
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      let errorMessage = '';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        // Permission denied - open dedicated camera page
        console.log('Camera permission denied, opening dedicated camera page');
        chrome.tabs.create({ url: chrome.runtime.getURL('camera.html') });
        setCameraActive(false);
        return;
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Camera failed: No camera found.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera failed: Camera in use by another app.';
      } else {
        errorMessage = 'Camera failed: ' + err.message;
      }
      
      setError(errorMessage);
      setCameraActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const stopCamera = () => {
    // Stop the scanning loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Stop the video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    
    setCameraActive(false);
    setResults([]); // Clear any previous results
  };

  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    // Show feedback
    showSnackbar(newPausedState ? 'Scanning paused' : 'Scanning resumed', 'info');
    
    // If resuming, restart the scan loop
    if (!newPausedState) {
      scanFromCamera();
    }
  };

  const scanFromCamera = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error('Video or canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let lastDetectedCode = null;
    let lastScanTime = 0;
    const SCAN_INTERVAL = 100; // Scan every 100ms for good balance
    
    const scan = async () => {
      // Stop if camera is turned off - check streamRef only
      if (!streamRef.current) {
        console.log('Stopping scan - camera inactive');
        return;
      }
      
      const currentTime = Date.now();
      let codeDetected = false;
      
      try {
        // Make sure video has data and is playing
        if (video.readyState === video.HAVE_ENOUGH_DATA && !video.paused) {
          const width = video.videoWidth;
          const height = video.videoHeight;
          
          if (width > 0 && height > 0) {
            // Set canvas size only once
            if (canvas.width !== width || canvas.height !== height) {
              canvas.width = width;
              canvas.height = height;
              console.log(`Canvas size set to ${width}x${height}`);
            }
            
            // Only scan every SCAN_INTERVAL milliseconds to reduce CPU load
            if (currentTime - lastScanTime >= SCAN_INTERVAL) {
              lastScanTime = currentTime;
              
              try {
                // Clear canvas and draw current frame
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(video, 0, 0, width, height);
                
                // Get image data
                const imageData = ctx.getImageData(0, 0, width, height);
                
                // Try jsQR first for fast QR detection
                let detected = false;
                
                if (scanMode === 'qr' || scanMode === 'auto') {
                  try {
                    const code = jsQR(imageData.data, width, height, {
                      inversionAttempts: "attemptBoth",
                    });
                    
                    if (code) {
                      const qrResult = {
                        data: code.data,
                        text: code.data,
                        type: 'scan',
                        format: 'QR_CODE',
                        source: 'camera',
                        timestamp: Date.now()
                      };
                      addToHistory(qrResult.text, qrResult.format);
                      saveToHistory(qrResult);
                      handleScanResult(qrResult);
                      setResults(prev => {
                        const isDuplicate = prev.some(r => r.data === qrResult.data);
                        if (!isDuplicate) {
                          return [qrResult, ...prev];
                        }
                        return prev;
                      });
                      detected = true;
                      codeDetected = true;
                    }
                  } catch (scanError) {
                    console.error('jsQR scan error:', scanError);
                  }
                }
                
                // Try ZXing for barcode detection if jsQR didn't find anything
                if (!detected && (scanMode === 'barcode' || scanMode === 'auto')) {
                  try {
                    // Use ZXing with canvas - it's loaded globally
                    if (typeof ZXing !== 'undefined' && ZXing.BrowserMultiFormatReader) {
                      const codeReader = new ZXing.BrowserMultiFormatReader();
                      const result = await codeReader.decodeFromCanvas(canvas);
                      
                      if (result) {
                        const barcodeResult = {
                          data: result.text,
                          text: result.text,
                          type: 'scan',
                          format: result.barcodeFormat,
                          source: 'camera',
                          timestamp: Date.now()
                        };
                        addToHistory(barcodeResult.text, barcodeResult.format);
                        saveToHistory(barcodeResult);
                        handleScanResult(barcodeResult);
                        setResults(prev => {
                          const isDuplicate = prev.some(r => r.data === barcodeResult.data);
                          if (!isDuplicate) {
                            return [barcodeResult, ...prev];
                          }
                          return prev;
                        });
                        codeDetected = true;
                      }
                    }
                  } catch (barcodeError) {
                    // Silently fail - barcode not found
                    if (barcodeError.message && !barcodeError.message.includes('No MultiFormat Readers')) {
                      console.debug('Barcode scan:', barcodeError.message);
                    }
                  }
                }
              } catch (scanError) {
                console.error('Scan error:', scanError);
              }
            }
          }
        }
      } catch (err) {
        console.error('Video processing error:', err);
      }
      
      // Adaptive scan cadence: adjust timing based on detection success
      if (codeDetected) {
        // Code found - reset to fast scanning
        setConsecutiveEmptyScans(0);
        setScanInterval(0);
      } else {
        // No code found - gradually slow down
        setConsecutiveEmptyScans(prev => {
          const newCount = prev + 1;
          // Calculate new interval: 0ms → 50ms → 100ms → 150ms → 200ms (max)
          const newInterval = Math.min(newCount * 50, 200);
          setScanInterval(newInterval);
          return newCount;
        });
      }
      
      // Continue scanning using requestAnimationFrame for smoother performance
      // Only continue if not paused
      if (!isPaused) {
        // Apply adaptive delay before next scan
        if (scanInterval > 0) {
          setTimeout(() => {
            animationFrameRef.current = requestAnimationFrame(scan);
          }, scanInterval);
        } else {
          animationFrameRef.current = requestAnimationFrame(scan);
        }
      }
    };
    
    console.log('Starting camera scanner...');
    scan();
  };

  const saveToHistory = (data) => {
    let entry;

    // Handle new format (object with text, format, type, etc.)
    if (typeof data === 'object' && data.text) {
      entry = {
        type: String(data.type || 'scan'),
        data: String(data.text || data.data || ''),
        format: String(data.format || 'unknown'),
        source: String(data.source || 'unknown'),
        imageURL: data.imageUrl || null,
        timestamp: data.timestamp || Date.now(),
      };
    } else if (typeof data === 'object' && data.data) {
      // Handle case where 'data' property is used instead of 'text'
      entry = {
        type: String(data.type || 'scan'),
        data: String(data.data),
        format: String(data.format || 'unknown'),
        source: String(data.source || 'unknown'),
        imageURL: data.imageUrl || null,
        timestamp: data.timestamp || Date.now(),
      };
    } else {
      // Handle old format (type, data, imageURL)
      const [type, scanData, imageURL] = arguments;
      entry = {
        type: String(type || 'scan'),
        data: String(scanData || data || ''),
        format: 'unknown',
        source: 'unknown',
        imageURL: imageURL || null,
        timestamp: Date.now(),
      };
    }

    // Ensure all fields are proper types
    entry.data = String(entry.data);
    entry.type = String(entry.type);
    entry.format = String(entry.format);
    entry.source = String(entry.source);

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

      // Track analytics with more details
      trackAnalytics('scan', {
        type: entry.type,
        format: entry.format,
        source: entry.source
      });
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please drop image files only');
      return;
    }
    
    // Process the first image file
    const file = imageFiles[0];
    await scanImageFromFile(file);
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await scanImageFromFile(file);
        }
        break;
      }
    }
  };

  const scanWithWorker = (imageData, width, height, scanMode = 'auto') => {
    return new Promise((resolve, reject) => {
      // Quick check if worker is ready
      if (!decoderWorker) {
        // Fall back to direct jsQR scan
        try {
          const code = jsQR(imageData, width, height, {
            inversionAttempts: "attemptBoth",
          });
          if (code) {
            resolve({
              text: code.data,
              format: 'QR_CODE',
              type: 'qr',
              source: 'jsqr-direct'
            });
          } else {
            resolve(null);
          }
        } catch (err) {
          resolve(null);
        }
        return;
      }

      const timeout = setTimeout(() => {
        resolve(null); // Don't reject, just return null on timeout
      }, 2000); // Reduced to 2 second timeout

      const messageHandler = (e) => {
        clearTimeout(timeout);
        decoderWorker.removeEventListener('message', messageHandler);
        
        const { success, data, error } = e.data;
        if (success && data) {
          resolve(data);
        } else {
          resolve(null); // No code found
        }
      };

      decoderWorker.addEventListener('message', messageHandler);
      decoderWorker.postMessage({ imageData, width, height, scanMode });
    });
  };

  const scanImageFromFile = async (file) => {
    setScanning(true);
    setError('');
    setResults([]);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
      
      // Scale down large images for better performance
      const maxSize = 1024;
      let { naturalWidth: width, naturalHeight: height } = img;
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      
      // Use worker for decoding
      const result = await scanWithWorker(imageData.data, width, height, scanMode);
      
      if (result) {
        const qrResult = {
          data: result.text,
          text: result.text,
          type: result.type,
          format: result.format,
          source: 'drag-drop',
          timestamp: Date.now(),
        };
        setResults([qrResult]);
        addToHistory(qrResult.text, qrResult.format);
        saveToHistory(qrResult);
        handleScanResult(qrResult);
      } else {
        setError('No QR code or barcode found in this image.');
      }
      
      URL.revokeObjectURL(img.src);
    } catch (err) {
      console.error('Image scan error:', err);
      setError('Error scanning image: ' + err.message);
    } finally {
      setScanning(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        await scanImageFile(file);
      } else {
        setError('Please select a valid image file (PNG, JPG, GIF, WebP)');
      }
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleResultClick = (data) => {
    // Check if it's a URL
    if (data && (data.startsWith('http://') || data.startsWith('https://'))) {
      chrome.tabs.create({ url: data });
    } else if (data && data.startsWith('WIFI:')) {
      // Parse WiFi QR code
      const wifiData = parseWifiQRCode(data);
      if (wifiData) {
        handleWifiConnect(wifiData);
      }
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(data).then(() => {
        showSnackbar('Copied to clipboard!', 'success');
      }).catch((err) => {
        console.error('Clipboard error:', err);
        showSnackbar('Failed to copy to clipboard', 'error');
      });
    }
  };

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
    } catch (err) {
      console.error('Error getting cameras:', err);
    }
  };

  const saveCameraSettings = () => {
    const settings = {
      facingMode,
      selectedCameraId,
      zoomLevel,
      torchEnabled,
    };
    chrome.storage.local.set({ cameraSettings: settings });
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    
    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !torchEnabled }]
        });
        setTorchEnabled(!torchEnabled);
        saveCameraSettings();
      }
    } catch (err) {
      console.error('Error toggling torch:', err);
    }
  };

  const setZoom = async (newZoom) => {
    if (!streamRef.current) return;
    
    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.zoom) {
        const clampedZoom = Math.max(capabilities.zoom.min, Math.min(capabilities.zoom.max, newZoom));
        await track.applyConstraints({
          advanced: [{ zoom: clampedZoom }]
        });
        setZoomLevel(clampedZoom);
        saveCameraSettings();
      }
    } catch (err) {
      console.error('Error setting zoom:', err);
    }
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    saveCameraSettings();
    
    if (cameraActive) {
      await stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  const selectCamera = async (deviceId) => {
    setSelectedCameraId(deviceId);
    saveCameraSettings();
    
    if (cameraActive) {
      await stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-4">
      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {error ? `Error: ${error}` : results.length > 0 ? `Detected ${results.length} QR code${results.length > 1 ? 's' : ''}` : scanning ? 'Scanning...' : ''}
      </div>

      {/* Auto-Open URL Toggle */}
      <div className={`${cardClass} p-4 rounded-md-lg shadow-md-1`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-title-medium font-medium mb-1">Auto-open URLs</h3>
            <p className={`text-body-small ${textSecondaryClass}`}>
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
      </div>

      {/* Scan Mode Toggle */}
      <div className={`${cardClass} p-4 rounded-md-lg shadow-md-1`}>
        <label className={`block text-title-small font-medium mb-2 ${textClass}`}>
          Scan Mode
        </label>
        <div className={`text-body-small ${textSecondaryClass} mb-3`}>
          Supports QR codes and multiple barcode formats (UPC, EAN, Code 128, etc.)
        </div>
        <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Scan mode selection">
          <button
            onClick={() => setScanMode('auto')}
            role="radio"
            aria-checked={scanMode === 'auto'}
            aria-label="Auto detect QR and barcode"
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md-md font-medium transition-all state-layer ${
              scanMode === 'auto'
                ? primaryClass
                : secondaryClass
            }`}
          >
            <QrCodeScannerIcon />
            <span className="text-label-large">Auto</span>
          </button>
          <button
            onClick={() => setScanMode('qr')}
            role="radio"
            aria-checked={scanMode === 'qr'}
            aria-label="QR code only"
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md-md font-medium transition-all state-layer ${
              scanMode === 'qr'
                ? primaryClass
                : secondaryClass
            }`}
          >
            <QrCodeIcon />
            <span className="text-label-large">QR</span>
          </button>
          <button
            onClick={() => setScanMode('barcode')}
            role="radio"
            aria-checked={scanMode === 'barcode'}
            aria-label="Barcode only"
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md-md font-medium transition-all state-layer ${
              scanMode === 'barcode'
                ? primaryClass
                : secondaryClass
            }`}
          >
            <QrCodeScannerIcon />
            <span className="text-label-large">Barcode</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        className={`relative ${cardClass} p-8 rounded-md-xl shadow-md-2 transition-all border-2 border-dashed ${
          isDragOver 
            ? `border-md-light-primary ${isDark ? 'bg-md-dark-primary-container' : 'bg-md-light-primary-container'}` 
            : outlineClass
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Select image file"
        />
        <div className="text-center space-y-3">
          <ImageIcon className={`${textSecondaryClass}`} sx={{ fontSize: 48 }} />
          <div>
            <p className={`text-title-medium font-medium ${textClass}`}>
              {isDragOver ? 'Drop image here' : 'Drag & drop or paste image'}
            </p>
            <p className={`text-body-medium ${textSecondaryClass} mt-1`}>
              {isDragOver ? 'Release to scan QR code' : 'Supports PNG, JPG, GIF, WebP'}
            </p>
          </div>
          <button
            onClick={handleBrowseClick}
            className={`${secondaryClass} py-2 px-6 rounded-md-full text-label-large font-medium state-layer shadow-md-1 hover:shadow-md-2 transition-all`}
            aria-label="Browse files"
          >
            Browse Files
          </button>
        </div>
        {isDragOver && (
          <div className="absolute inset-0 bg-md-light-primary opacity-10 rounded-md-xl pointer-events-none" />
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={scanCurrentPage}
          disabled={scanning}
          aria-label="Scan current page for QR codes"
          className={`${primaryClass} py-4 px-4 rounded-md-full font-medium shadow-md-2 state-layer disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transition-all`}
        >
          <PhotoCameraIcon />
          <span className="text-label-large">
            {scanning ? 'Activating...' : 'Show Overlay'}
          </span>
        </button>
        <button
          onClick={cameraActive ? stopCamera : startCamera}
          disabled={scanning}
          aria-label={cameraActive ? 'Stop camera' : 'Start camera'}
          className={`${cameraActive ? errorClass : primaryClass} py-4 px-4 rounded-md-full font-medium shadow-md-2 state-layer disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transition-all`}
        >
          {cameraActive ? <StopCircleIcon /> : <CameraAltIcon />}
          <span className="text-label-large">
            {cameraActive ? 'Stop' : 'Camera'}
          </span>
        </button>
      </div>

      {/* Generate QR for Current Tab */}
      <div className="mt-3">
        <button
          onClick={generateQRForCurrentTab}
          aria-label="Generate QR code for current tab URL"
          className={`${tertiaryClass} py-3 px-4 rounded-md-full font-medium shadow-md-1 state-layer w-full flex items-center justify-center gap-2 transition-all hover:shadow-md-2`}
        >
          <AddIcon />
          <QrCodeIcon />
          <span className="text-label-large">
            Generate QR for Current Tab
          </span>
        </button>
      </div>

      {/* Camera View */}
      {cameraActive && (
        <div className={`${cardClass} p-4 rounded-md-xl shadow-md-3 animate-fade-in`}>
          <div className="relative bg-black rounded-md-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover bg-black"
              style={{ maxHeight: '400px' }}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanning overlay */}
            {results.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-40 h-40 sm:w-52 sm:h-52 border-4 rounded-md-lg animate-pulse ${isDark ? 'border-md-dark-primary' : 'border-md-light-primary'}`}>
                  <div className={`absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-l-4 ${isDark ? 'border-md-dark-primary' : 'border-md-light-primary'}`}></div>
                  <div className={`absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-r-4 ${isDark ? 'border-md-dark-primary' : 'border-md-light-primary'}`}></div>
                  <div className={`absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-l-4 ${isDark ? 'border-md-dark-primary' : 'border-md-light-primary'}`}></div>
                  <div className={`absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-r-4 ${isDark ? 'border-md-dark-primary' : 'border-md-light-primary'}`}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Camera Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-3 p-2 sm:p-3 bg-black bg-opacity-50 rounded-md-lg overflow-x-auto">
            {/* Pause/Resume Toggle */}
            <button
              onClick={togglePause}
              className={`p-2 sm:p-3 rounded-md-full state-layer transition-all flex-shrink-0 ${
                isPaused ? `${secondaryClass} opacity-70` : primaryClass
              }`}
              title={isPaused ? 'Resume scanning' : 'Pause scanning'}
            >
              {isPaused ? <PlayCircleIcon /> : <PauseCircleIcon />}
            </button>
            
            {/* Torch Toggle */}
            <button
              onClick={toggleTorch}
              className={`p-2 sm:p-3 rounded-md-full state-layer transition-all flex-shrink-0 ${
                torchEnabled ? primaryClass : `${secondaryClass} opacity-70`
              }`}
              title={torchEnabled ? 'Turn off torch' : 'Turn on torch'}
            >
              {torchEnabled ? <FlashlightOnIcon fontSize="small" /> : <FlashlightOffIcon fontSize="small" />}
            </button>
            
            {/* Zoom Slider */}
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink">
              <ZoomOutIcon className={textSecondaryClass} fontSize="small" />
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-12 sm:w-20"
                aria-label="Zoom level"
              />
              <ZoomInIcon className={textSecondaryClass} fontSize="small" />
              <span className={`text-label-small ${textClass} min-w-[2.5rem] text-center hidden sm:inline`}>
                {zoomLevel.toFixed(1)}x
              </span>
            </div>
            
            {/* Camera Switch */}
            <button
              onClick={switchCamera}
              className={`${secondaryClass} p-2 sm:p-3 rounded-md-full state-layer transition-all opacity-70 hover:opacity-100 flex-shrink-0`}
              title={`Switch to ${facingMode === 'environment' ? 'front' : 'back'} camera`}
            >
              <CameraswitchIcon fontSize="small" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className={`text-body-medium ${textSecondaryClass} font-medium`}>
              {results.length > 0 ? 'Code detected!' : 'Point camera at code...'}
            </p>
            {results.length > 0 && (
              <button
                onClick={() => setResults([])}
                className={`${tertiaryClass} py-2 px-3 sm:px-4 rounded-md-full text-label-small sm:text-label-medium font-medium state-layer`}
              >
                Scan Another
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`${errorClass} p-4 rounded-md-lg text-body-medium animate-fade-in shadow-md-1`}>
          {error}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`${errorClass} p-4 rounded-md-lg text-body-medium animate-fade-in shadow-md-1`}>
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-title-medium font-medium ${textClass}`}>Scan Results</h3>
          {results.map((result, index) => {
            const rawData = result.data || result.text || '';
            const resultData = String(rawData);
            
            return (
              <div
                key={index}
                className={`${cardClass} p-4 rounded-md-lg shadow-md-2 animate-slide-up`}
              >
                <p className={`font-mono text-body-medium break-all mb-4 ${textClass}`}>
                  {resultData}
                </p>
                
                {/* Safety Warnings */}
                {(() => {
                  const safety = checkURLSafety(resultData);
                  if (!safety.safe && safety.warnings.length > 0) {
                    return (
                      <div className={`${errorClass} p-3 rounded-md-md mb-4`}>
                        <div className="flex items-start gap-2">
                          <WarningIcon className="text-lg" />
                          <div>
                            <p className="text-body-small font-medium mb-1">Security Warning</p>
                            <ul className="text-body-small space-y-1">
                              {safety.warnings.map((warning, wIndex) => (
                                <li key={wIndex}>• {warning.message}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const parsed = parseQRContent(resultData);
                    return parsed.actions.map((action, actionIndex) => {
                      const getIcon = () => {
                        switch (action.icon) {
                          case 'open': return <OpenInNewIcon fontSize="small" />;
                          case 'copy': return <ContentCopyIcon fontSize="small" />;
                          case 'compose': return <EmailIcon fontSize="small" />;
                          case 'call': return <PhoneIcon fontSize="small" />;
                          case 'send': return <SmsIcon fontSize="small" />;
                          case 'connect': return <WifiIcon fontSize="small" />;
                          case 'location': return <LocationOnIcon fontSize="small" />;
                          case 'save': return <PersonIcon fontSize="small" />;
                          case 'add': return <EventIcon fontSize="small" />;
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
                              showSnackbar('Action failed: ' + err.message, 'error');
                            }
                          }}
                          className={`${buttonClass} py-3 px-4 rounded-md-full font-medium state-layer flex items-center gap-2 flex-1 min-w-[120px] justify-center shadow-md-1`}
                        >
                          {getIcon()}
                          <span className="text-label-large">{action.label}</span>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      {!cameraActive && results.length === 0 && !error && !scanning && (
        <div className={`${cardClass} p-5 rounded-md-xl shadow-md-1`}>
          <h3 className={`text-title-medium font-medium mb-3 flex items-center gap-2 ${textClass}`}>
            <ImageIcon />
            How to scan
          </h3>
          <ul className={`text-body-medium ${textSecondaryClass} space-y-2`}>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Click "Show Overlay" to scan the current webpage with visual indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Click "Camera" to scan with your device camera (opens in new tab for permission)</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Right-click any image → "Scan QR Code"</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Use keyboard shortcut: Ctrl+Shift+Q</span>
            </li>
          </ul>
        </div>
      )}

      {/* URL Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => handleConfirmDialogClose(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: isDark ? '#282A2C' : '#FFFFFF',
            color: isDark ? '#E2E2E6' : '#1C1B1F',
            borderRadius: '28px',
            padding: '8px',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle id="confirm-dialog-title" style={{ 
          fontWeight: 500, 
          fontSize: '24px',
          color: isDark ? '#E2E2E6' : '#1C1B1F'
        }}>
          ⚠️ Open this URL?
        </DialogTitle>
        <DialogContent id="confirm-dialog-description">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: isDark ? '#B3B9BF' : '#49454F',
              marginBottom: '8px',
              fontWeight: 500
            }}>
              URL:
            </div>
            <div style={{ 
              padding: '12px', 
              background: isDark ? '#1E2022' : '#F5F5F5',
              borderRadius: '12px',
              fontSize: '13px',
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              color: isDark ? '#E2E2E6' : '#1C1B1F'
            }}>
              {confirmDialog.url}
            </div>
          </div>
          
          {confirmDialog.warnings.length > 0 && (
            <div style={{ 
              background: isDark ? '#3A1F1F' : '#FFEAEA',
              border: `1px solid ${isDark ? '#5F2626' : '#FFCDD2'}`,
              borderRadius: '12px',
              padding: '12px',
              marginTop: '12px'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 500,
                color: isDark ? '#FFB4AB' : '#C62828',
                marginBottom: '8px'
              }}>
                ⚠️ Security Warnings:
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                fontSize: '13px',
                color: isDark ? '#FFB4AB' : '#C62828'
              }}>
                {confirmDialog.warnings.map((warning, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    • {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div style={{ 
            marginTop: '16px', 
            fontSize: '13px',
            color: isDark ? '#B3B9BF' : '#49454F'
          }}>
            Do you want to open this URL in a new tab?
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button
            onClick={() => handleConfirmDialogClose(false)}
            aria-label="Cancel and don't open URL"
            style={{
              color: isDark ? '#B3B9BF' : '#49454F',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '20px',
              padding: '8px 24px'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmDialogClose(true)}
            variant="contained"
            aria-label="Confirm and open URL in new tab"
            style={{
              backgroundColor: isDark ? '#4A4FE5' : '#6750A4',
              color: '#FFFFFF',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '20px',
              padding: '8px 24px'
            }}
          >
            Open URL
          </Button>
        </DialogActions>
      </Dialog>

      {/* Info Dialog (for WiFi, etc.) */}
      <Dialog
        open={infoDialog.open}
        onClose={() => setInfoDialog({ ...infoDialog, open: false })}
        aria-labelledby="info-dialog-title"
        aria-describedby="info-dialog-content"
        PaperProps={{
          style: {
            backgroundColor: isDark ? '#282A2C' : '#FFFFFF',
            color: isDark ? '#E2E2E6' : '#1C1B1F',
            borderRadius: '28px',
            padding: '8px',
            minWidth: '360px'
          }
        }}
      >
        <DialogTitle id="info-dialog-title" style={{ 
          fontWeight: 500, 
          fontSize: '22px',
          color: isDark ? '#E2E2E6' : '#1C1B1F'
        }}>
          {infoDialog.title}
        </DialogTitle>
        <DialogContent id="info-dialog-content">
          {typeof infoDialog.content === 'string' ? (
            <pre style={{ 
              fontFamily: 'monospace',
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
              padding: '16px',
              background: isDark ? '#1E2022' : '#F5F5F5',
              borderRadius: '12px',
              color: isDark ? '#E2E2E6' : '#1C1B1F'
            }}>
              {infoDialog.content}
            </pre>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {infoDialog.content}
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button
            onClick={() => setInfoDialog({ ...infoDialog, open: false })}
            variant="contained"
            aria-label="Close information dialog"
            style={{
              backgroundColor: isDark ? '#4A4FE5' : '#6750A4',
              color: '#FFFFFF',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '20px',
              padding: '8px 24px'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            fontSize: '14px',
            '& .MuiAlert-icon': {
              fontSize: '22px'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Scan History Tray */}
      {scanHistory.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`${primaryClass} p-3 rounded-full state-layer shadow-md-3 flex items-center gap-2 transition-all`}
          >
            <HistoryIcon />
            <span className="text-label-medium font-medium">
              {scanHistory.length} {scanHistory.length === 1 ? 'Scan' : 'Scans'}
            </span>
          </button>
          
          {showHistory && (
            <div 
              role="region"
              aria-label="Scan history"
              className={`mt-3 rounded-md-xl shadow-md-4 overflow-hidden animate-fade-in ${
                isDark ? 'bg-md-dark-surface' : 'bg-md-light-surface'
              }`}
              style={{ 
                width: '320px',
                maxHeight: '400px',
                border: `1px solid ${isDark ? '#3A3D3F' : '#E0E0E0'}`
              }}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-3 ${
                isDark ? 'bg-md-dark-surface-variant' : 'bg-md-light-surface-variant'
              }`}>
                <div className="flex items-center gap-2">
                  <HistoryIcon className={textClass} fontSize="small" />
                  <span className={`text-title-medium font-medium ${textClass}`}>
                    Recent Scans
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearHistory}
                    className={`p-2 rounded-md-full state-layer transition-all ${textSecondaryClass}`}
                    title="Clear history"
                    aria-label="Clear scan history"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className={`p-2 rounded-md-full state-layer transition-all ${textSecondaryClass}`}
                    title="Close"
                    aria-label="Close history tray"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              </div>
              
              {/* History List */}
              <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
                {scanHistory.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`p-3 border-b ${
                      isDark ? 'border-md-dark-outline' : 'border-md-light-outline'
                    } hover:bg-opacity-5 transition-all ${
                      isDark ? 'hover:bg-white' : 'hover:bg-black'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <QrCodeIcon className={textSecondaryClass} fontSize="small" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-body-small ${textClass} truncate font-medium mb-1`}>
                          {entry.text}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-label-small ${textSecondaryClass}`}>
                            {entry.format}
                          </span>
                          <span className={`text-label-small ${textSecondaryClass}`}>
                            •
                          </span>
                          <span className={`text-label-small ${textSecondaryClass}`}>
                            {entry.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => copyFromHistory(entry.text)}
                        className={`${tertiaryClass} py-1 px-3 rounded-md-full text-label-small font-medium state-layer flex items-center gap-1`}
                      >
                        <ContentCopyIcon fontSize="small" />
                        Copy
                      </button>
                      {(entry.text.startsWith('http://') || entry.text.startsWith('https://')) && (
                        <button
                          onClick={() => openFromHistory(entry.text)}
                          className={`${tertiaryClass} py-1 px-3 rounded-md-full text-label-small font-medium state-layer flex items-center gap-1`}
                        >
                          <OpenInNewIcon fontSize="small" />
                          Open
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScanTab;
