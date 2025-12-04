import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TuneIcon from '@mui/icons-material/Tune';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import TableChartIcon from '@mui/icons-material/TableChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import TimerIcon from '@mui/icons-material/Timer';
import MemoryIcon from '@mui/icons-material/Memory';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CloudIcon from '@mui/icons-material/Cloud';
import WebhookIcon from '@mui/icons-material/Webhook';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HistoryIcon from '@mui/icons-material/History';
import FolderIcon from '@mui/icons-material/Folder';
import { trackAnalytics } from '../utils/analytics';
import { fetchGoogleSheetData, isValidGoogleSheetsUrl, getShareInstructions } from '../utils/googleSheets';
import { notifyBatchComplete, testWebhook, isValidWebhookUrl, saveWebhookConfig, getWebhookConfig } from '../utils/webhooks';

function AdvancedBulkTab({ theme }) {
  // State Management
  const [bulkData, setBulkData] = useState([]);
  const [bulkResults, setBulkResults] = useState([]);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkPaused, setBulkPaused] = useState(false);
  const [bulkCancelled, setBulkCancelled] = useState(false);
  const cancelledRef = useRef(false);
  const pausedRef = useRef(false);
  
  // QR Settings
  const [qrSize, setQrSize] = useState(512);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [logoImage, setLogoImage] = useState(null);
  const [logoSize, setLogoSize] = useState(0.2);
  
  // Advanced Features State
  const [selectedColumn, setSelectedColumn] = useState('text');
  const [availableColumns, setAvailableColumns] = useState([]);
  const [customNamingPattern, setCustomNamingPattern] = useState('{index}-qr');
  const [batchSize, setBatchSize] = useState(500);
  const [exportFormat, setExportFormat] = useState('zip'); // 'zip', 'pdf', 'individual'
  const [pdfLayout, setPdfLayout] = useState({ rows: 4, cols: 3 });
  const [pdfMargin, setPdfMargin] = useState(10);
  const [labelColumn, setLabelColumn] = useState('');
  const [labelPosition, setLabelPosition] = useState('bottom'); // 'top', 'bottom', 'none'
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [dataValidation, setDataValidation] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [memoryWarning, setMemoryWarning] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'settings', 'preview', 'results'
  const [printTemplate, setPrintTemplate] = useState('standard'); // 'standard', 'business-card', 'label', 'badge'
  const [qrType, setQrType] = useState('auto'); // 'auto', 'url', 'vcard', 'wifi', 'email'
  const [vCardMapping, setVCardMapping] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    title: ''
  });
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [loadingGoogleSheet, setLoadingGoogleSheet] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [generationSpeed, setGenerationSpeed] = useState(0);
  const [statsData, setStatsData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [configName, setConfigName] = useState('');
  const [batchHistory, setBatchHistory] = useState([]);
  
  // Refs
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const dragCounterRef = useRef(0);
  
  // Theme Classes
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
  const inputBgClass = isDark ? 'bg-md-dark-surface-container' : 'bg-md-light-surface-container';
  const successClass = isDark ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-900';
  const warningClass = isDark ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-900';

  // Load webhook config on mount
  useEffect(() => {
    getWebhookConfig().then(url => {
      if (url) {
        setWebhookUrl(url);
        setWebhookEnabled(true);
      }
    });
  }, []);

  // Utility Functions
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimateGenerationTime = (count) => {
    // Estimate ~50-100ms per QR code
    const avgTimePerQR = 0.075; // seconds
    return Math.ceil(count * avgTimePerQR);
  };

  const checkMemoryUsage = () => {
    if (performance.memory) {
      const usedMemory = performance.memory.usedJSHeapSize;
      const totalMemory = performance.memory.jsHeapSizeLimit;
      const percentUsed = (usedMemory / totalMemory) * 100;
      
      if (percentUsed > 80) {
        setMemoryWarning(true);
        showNotification('warning', 'High memory usage detected. Consider reducing batch size.');
      }
    }
  };

  // Drag and Drop Handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      
      if (file.size > maxSizeInBytes) {
        showNotification('error', `File too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }

      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'csv') {
        parseCSV(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        parseExcel(file);
      } else {
        showNotification('error', 'Please drop a CSV or Excel file');
      }
    }
  };

  // Calculate Statistics
  const calculateStats = (data) => {
    if (!data || data.length === 0) return null;

    const total = data.length;
    const validRows = data.filter(row => row[selectedColumn] && row[selectedColumn].trim()).length;
    const invalidRows = total - validRows;
    
    // Check for duplicates
    const values = data.map(row => row[selectedColumn]).filter(Boolean);
    const uniqueValues = new Set(values);
    const duplicateCount = values.length - uniqueValues.size;
    
    // Estimate file size (rough calculation)
    const avgQRSize = qrSize * qrSize * 4; // bytes per QR (rough estimate)
    const estimatedSizeMB = (avgQRSize * validRows / (1024 * 1024)).toFixed(2);

    return {
      total,
      valid: validRows,
      invalid: invalidRows,
      duplicates: duplicateCount,
      unique: uniqueValues.size,
      estimatedSizeMB,
      columns: Object.keys(data[0] || {}).length
    };
  };

  // Table Sorting and Filtering
  const getFilteredAndSortedData = () => {
    if (!bulkData || bulkData.length === 0) return [];
    
    let filtered = bulkData;
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(row => {
        return Object.values(row).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = String(a[sortColumn] || '');
        const bVal = String(b[sortColumn] || '');
        
        if (sortDirection === 'asc') {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      });
    }
    
    return filtered;
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Config Management
  const saveConfiguration = () => {
    if (!configName.trim()) {
      showNotification('error', 'Please enter a configuration name');
      return;
    }

    const config = {
      name: configName,
      timestamp: Date.now(),
      qrSize,
      errorCorrection,
      foregroundColor,
      backgroundColor,
      logoSize,
      selectedColumn,
      customNamingPattern,
      batchSize,
      exportFormat,
      pdfLayout,
      labelPosition
    };

    chrome.storage.local.get(['bulkConfigs'], (result) => {
      const configs = result.bulkConfigs || [];
      configs.unshift(config);
      chrome.storage.local.set({ bulkConfigs: configs.slice(0, 20) }, () => {
        setSavedConfigs(configs.slice(0, 20));
        setConfigName('');
        showNotification('success', `Configuration "${config.name}" saved`);
      });
    });
  };

  const loadConfiguration = (config) => {
    setQrSize(config.qrSize);
    setErrorCorrection(config.errorCorrection);
    setForegroundColor(config.foregroundColor);
    setBackgroundColor(config.backgroundColor);
    setLogoSize(config.logoSize);
    setSelectedColumn(config.selectedColumn);
    setCustomNamingPattern(config.customNamingPattern);
    setBatchSize(config.batchSize);
    setExportFormat(config.exportFormat);
    setPdfLayout(config.pdfLayout);
    setLabelPosition(config.labelPosition);
    showNotification('success', `Configuration "${config.name}" loaded`);
  };

  const deleteConfiguration = (configName) => {
    chrome.storage.local.get(['bulkConfigs'], (result) => {
      const configs = (result.bulkConfigs || []).filter(c => c.name !== configName);
      chrome.storage.local.set({ bulkConfigs: configs }, () => {
        setSavedConfigs(configs);
        showNotification('success', 'Configuration deleted');
      });
    });
  };

  // Batch History
  const saveBatchToHistory = (batchInfo) => {
    chrome.storage.local.get(['batchHistory'], (result) => {
      const history = result.batchHistory || [];
      history.unshift({
        ...batchInfo,
        timestamp: Date.now(),
        id: Date.now().toString()
      });
      chrome.storage.local.set({ batchHistory: history.slice(0, 50) }, () => {
        setBatchHistory(history.slice(0, 50));
      });
    });
  };

  // Load saved configs and history on mount
  useEffect(() => {
    chrome.storage.local.get(['bulkConfigs', 'batchHistory'], (result) => {
      if (result.bulkConfigs) setSavedConfigs(result.bulkConfigs);
      if (result.batchHistory) setBatchHistory(result.batchHistory);
    });
  }, []);

  // File Upload and Parsing
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      showNotification('error', `File too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      parseCSV(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcel(file);
    } else {
      showNotification('error', 'Please select a CSV or Excel file');
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processUploadedData(results.data, results.meta.fields);
      },
      error: (error) => {
        showNotification('error', 'Error parsing CSV: ' + error.message);
      }
    });
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        const headers = Object.keys(jsonData[0] || {});
        processUploadedData(jsonData, headers);
      } catch (error) {
        showNotification('error', 'Error parsing Excel: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processUploadedData = (data, columns) => {
    if (data.length === 0) {
      showNotification('error', 'No valid data found in file');
      return;
    }

    const maxItems = 2000;
    if (data.length > maxItems) {
      showNotification('error', `Too many items (${data.length}). Maximum is ${maxItems} items per batch.`);
      return;
    }

    setAvailableColumns(columns);
    
    // Auto-detect QR data column
    const possibleColumns = ['text', 'data', 'content', 'url', 'qr', 'code'];
    const detectedColumn = columns.find(col => 
      possibleColumns.includes(col.toLowerCase())
    ) || columns[0];
    
    setSelectedColumn(detectedColumn);
    setBulkData(data);
    
    // Calculate and set statistics
    const stats = calculateStats(data);
    setStatsData(stats);
    
    // Validate data
    validateData(data, detectedColumn);
    
    // Estimate generation time
    const estTime = estimateGenerationTime(data.length);
    setEstimatedTime(estTime);
    
    // Check memory
    checkMemoryUsage();
    
    showNotification('success', `Loaded ${data.length} items from file`);
    setActiveTab('preview');
  };

  // Google Sheets Import
  const handleGoogleSheetsImport = async () => {
    if (!googleSheetUrl.trim()) {
      showNotification('error', 'Please enter a Google Sheets URL');
      return;
    }

    if (!isValidGoogleSheetsUrl(googleSheetUrl)) {
      showNotification('error', 'Invalid Google Sheets URL');
      return;
    }

    setLoadingGoogleSheet(true);
    try {
      const data = await fetchGoogleSheetData(googleSheetUrl);
      
      if (data.length === 0) {
        showNotification('error', 'No data found in Google Sheet');
        return;
      }

      const columns = Object.keys(data[0]);
      processUploadedData(data, columns);
      showNotification('success', `Loaded ${data.length} rows from Google Sheets`);
      trackAnalytics('google_sheets_import', { count: data.length });
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoadingGoogleSheet(false);
    }
  };

  // Webhook Functions
  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      showNotification('error', 'Please enter a webhook URL');
      return;
    }

    if (!isValidWebhookUrl(webhookUrl)) {
      showNotification('error', 'Invalid webhook URL');
      return;
    }

    setTestingWebhook(true);
    try {
      const result = await testWebhook(webhookUrl);
      if (result.success) {
        showNotification('success', result.message);
      } else {
        showNotification('error', result.message);
      }
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleSaveWebhook = () => {
    if (webhookUrl.trim() && isValidWebhookUrl(webhookUrl)) {
      saveWebhookConfig(webhookUrl);
      setWebhookEnabled(true);
      showNotification('success', 'Webhook configuration saved');
    }
  };

  const validateData = (data, column) => {
    const duplicateMap = new Map();
    const invalid = [];
    const valid = [];

    data.forEach((row, index) => {
      const value = String(row[column] || '').trim();
      
      if (!value) {
        invalid.push({ index: index + 1, reason: 'Empty value', row });
      } else {
        valid.push(row);
        
        // Check for duplicates
        if (duplicateMap.has(value)) {
          duplicateMap.get(value).push(index + 1);
        } else {
          duplicateMap.set(value, [index + 1]);
        }
      }
    });

    const duplicateEntries = Array.from(duplicateMap.entries())
      .filter(([_, indices]) => indices.length > 1)
      .map(([value, indices]) => ({ value, indices }));

    setDuplicates(duplicateEntries);
    setInvalidRows(invalid);
    setDataValidation({
      total: data.length,
      valid: valid.length,
      invalid: invalid.length,
      duplicates: duplicateEntries.length
    });
  };

  // Preview Mode
  const generatePreview = async () => {
    if (bulkData.length === 0) return;
    
    setShowPreview(true);
    const previewCount = Math.min(5, bulkData.length);
    const previews = [];

    for (let i = 0; i < previewCount; i++) {
      const row = bulkData[i];
      const text = String(row[selectedColumn] || '');
      
      try {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, text, {
          width: 256,
          errorCorrectionLevel: errorCorrection,
          margin: 2,
          color: { dark: foregroundColor, light: backgroundColor }
        });

        if (logoImage) {
          const ctx = canvas.getContext('2d');
          const logoImg = await loadImage(logoImage);
          const logoSizePixels = canvas.width * logoSize;
          const x = (canvas.width - logoSizePixels) / 2;
          const y = (canvas.height - logoSizePixels) / 2;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x - 5, y - 5, logoSizePixels + 10, logoSizePixels + 10);
          ctx.drawImage(logoImg, x, y, logoSizePixels, logoSizePixels);
        }

        previews.push({
          text,
          dataURL: canvas.toDataURL('image/png'),
          label: labelColumn ? row[labelColumn] : null,
          row
        });
      } catch (error) {
        previews.push({ text, error: error.message });
      }
    }

    setPreviewData(previews);
  };

  // Bulk Generation with Pause/Resume
  const generateBulkQRCodes = async () => {
    if (bulkData.length === 0) {
      showNotification('error', 'Please upload a file first');
      return;
    }

    setBulkGenerating(true);
    setBulkResults([]);
    setBulkProgress(0);
    setBulkCancelled(false);
    setBulkPaused(false);
    cancelledRef.current = false;
    pausedRef.current = false;
    setElapsedTime(0);
    startTimeRef.current = Date.now();

    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    const results = [];
    const canvas = document.createElement('canvas');
    const chunkSize = 50; // Process in chunks to avoid memory issues

    for (let i = 0; i < bulkData.length; i++) {
      // Check for pause
      while (pausedRef.current && !cancelledRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Check for cancellation
      if (cancelledRef.current) {
        setBulkCancelled(true);
        showNotification('error', `Generation cancelled. Generated ${results.length} of ${bulkData.length} QR codes.`);
        break;
      }

      const row = bulkData[i];
      const text = String(row[selectedColumn] || '');

      if (!text.trim()) continue;

      try {
        await QRCode.toCanvas(canvas, text, {
          width: qrSize,
          errorCorrectionLevel: errorCorrection,
          margin: 2,
          color: { dark: foregroundColor, light: backgroundColor }
        });

        if (logoImage) {
          const ctx = canvas.getContext('2d');
          const logoImg = await loadImage(logoImage);
          const logoSizePixels = canvas.width * logoSize;
          const x = (canvas.width - logoSizePixels) / 2;
          const y = (canvas.height - logoSizePixels) / 2;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x - 5, y - 5, logoSizePixels + 10, logoSizePixels + 10);
          ctx.drawImage(logoImg, x, y, logoSizePixels, logoSizePixels);
        }

        const dataURL = canvas.toDataURL('image/png');
        results.push({
          text,
          dataURL,
          index: i + 1,
          filename: generateFilename(row, i),
          label: labelColumn ? row[labelColumn] : null,
          ...row
        });

        trackAnalytics('generation');
      } catch (err) {
        console.error('Error generating QR for row', i + 1, err);
        results.push({ text, error: err.message, index: i + 1, ...row });
      }

      const progress = Math.round(((i + 1) / bulkData.length) * 100);
      setBulkProgress(progress);

      // Check memory periodically
      if (i % 100 === 0) {
        checkMemoryUsage();
      }

      // Yield to UI every chunk
      if ((i + 1) % chunkSize === 0 || i === bulkData.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    clearInterval(timerRef.current);
    setBulkGenerating(false);
    setBulkResults(results);
    
    if (!cancelledRef.current) {
      const successCount = results.filter(r => r.dataURL).length;
      showNotification('success', `Successfully generated ${successCount} QR codes!`);
      setActiveTab('results');
      
      // Save to batch history
      saveBatchToHistory({
        count: successCount,
        duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
        format: exportFormat,
        size: qrSize
      });
      
      // Send webhook notification if enabled
      if (webhookEnabled && webhookUrl) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        notifyBatchComplete(webhookUrl, {
          total: bulkData.length,
          success: successCount,
          failed: results.filter(r => !r.dataURL).length,
          duration
        }).then(success => {
          if (success) {
            showNotification('success', 'Webhook notification sent');
          }
        });
      }
    }
  };

  const pauseGeneration = () => {
    pausedRef.current = true;
    setBulkPaused(true);
  };

  const resumeGeneration = () => {
    pausedRef.current = false;
    setBulkPaused(false);
  };

  const cancelGeneration = () => {
    cancelledRef.current = true;
    setBulkCancelled(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Filename Generation
  const generateFilename = (row, index) => {
    let filename = customNamingPattern;
    
    filename = filename.replace('{index}', index + 1);
    
    // Replace column placeholders
    availableColumns.forEach(col => {
      const regex = new RegExp(`\\{${col}\\}`, 'g');
      filename = filename.replace(regex, row[col] || '');
    });
    
    // Clean filename
    filename = filename.replace(/[^a-z0-9_\-]/gi, '_');
    
    return filename + '.png';
  };

  // Export Functions
  const exportAsZip = async () => {
    if (bulkResults.length === 0) return;

    const zip = new JSZip();
    const successfulResults = bulkResults.filter(r => r.dataURL);

    // Split into batches if needed
    const batches = [];
    for (let i = 0; i < successfulResults.length; i += batchSize) {
      batches.push(successfulResults.slice(i, i + batchSize));
    }

    if (batches.length === 1) {
      // Single ZIP
      batches[0].forEach(result => {
        const base64Data = result.dataURL.split(',')[1];
        zip.file(result.filename, base64Data, { base64: true });
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `qr-codes-${Date.now()}.zip`);
      showNotification('success', 'ZIP file downloaded successfully!');
    } else {
      // Multiple ZIPs
      for (let i = 0; i < batches.length; i++) {
        const batchZip = new JSZip();
        batches[i].forEach(result => {
          const base64Data = result.dataURL.split(',')[1];
          batchZip.file(result.filename, base64Data, { base64: true });
        });

        const blob = await batchZip.generateAsync({ type: 'blob' });
        saveAs(blob, `qr-codes-batch-${i + 1}-${Date.now()}.zip`);
      }
      showNotification('success', `Downloaded ${batches.length} ZIP files!`);
    }

    trackAnalytics('bulk_export', { format: 'zip', count: successfulResults.length });
  };

  const exportAsPDF = async () => {
    if (bulkResults.length === 0) return;

    const successfulResults = bulkResults.filter(r => r.dataURL);
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const { rows, cols } = pdfLayout;
    const qrWidth = (pageWidth - (pdfMargin * (cols + 1))) / cols;
    const qrHeight = qrWidth + (labelColumn ? 10 : 0);
    const itemsPerPage = rows * cols;

    for (let i = 0; i < successfulResults.length; i++) {
      const result = successfulResults[i];
      const pageIndex = Math.floor(i / itemsPerPage);
      const itemIndex = i % itemsPerPage;
      
      if (itemIndex === 0 && i > 0) {
        pdf.addPage();
      }

      const row = Math.floor(itemIndex / cols);
      const col = itemIndex % cols;
      
      const x = pdfMargin + (col * (qrWidth + pdfMargin));
      const y = pdfMargin + (row * (qrHeight + pdfMargin));

      // Add QR code image
      pdf.addImage(result.dataURL, 'PNG', x, y, qrWidth, qrWidth);

      // Add label if specified
      if (labelColumn && result.label) {
        pdf.setFontSize(8);
        pdf.text(String(result.label), x + qrWidth / 2, y + qrWidth + 5, { align: 'center' });
      }
    }

    pdf.save(`qr-codes-${Date.now()}.pdf`);
    showNotification('success', 'PDF downloaded successfully!');
    trackAnalytics('bulk_export', { format: 'pdf', count: successfulResults.length });
  };

  const exportIndividual = () => {
    bulkResults.forEach((result, index) => {
      if (result.dataURL) {
        const link = document.createElement('a');
        link.download = result.filename;
        link.href = result.dataURL;
        link.click();
      }
    });
    showNotification('success', 'Individual files downloaded!');
    trackAnalytics('bulk_export', { format: 'individual', count: bulkResults.length });
  };

  // CSV Template Downloads
  const downloadCSVTemplate = (type) => {
    let csvContent = '';
    
    switch(type) {
      case 'simple':
        csvContent = 'text\nhttps://example.com\nhttps://example.org';
        break;
      case 'url':
        csvContent = 'url,name,description\nhttps://example.com,Example,Example Website';
        break;
      case 'vcard':
        csvContent = 'name,phone,email,company,title\nJohn Doe,+1234567890,john@example.com,ACME Corp,Developer';
        break;
      case 'wifi':
        csvContent = 'ssid,password,security\nMyNetwork,mypassword,WPA';
        break;
      default:
        csvContent = 'text\nYour data here';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, `qr-template-${type}.csv`);
    showNotification('success', 'Template downloaded!');
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      showNotification('error', 'Please select an image file');
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

  return (
    <div className={`min-h-screen ${surfaceClass} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${cardClass} p-6 rounded-md-xl shadow-md-3`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-headline-large font-bold ${textClass} mb-2`}>
                Advanced Bulk QR Generator
              </h1>
              <p className={`text-body-large ${textSecondaryClass}`}>
                Generate thousands of QR codes with advanced features
              </p>
            </div>
            <QrCode2Icon className={textClass} style={{ fontSize: 64 }} />
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`p-4 rounded-md-xl shadow-md-2 animate-slide-down flex items-center gap-3 ${
            notification.type === 'error' ? errorClass : 
            notification.type === 'warning' ? warningClass : 
            notification.type === 'success' ? successClass : primaryClass
          }`}>
            {notification.type === 'error' && <ErrorIcon />}
            {notification.type === 'warning' && <WarningIcon />}
            {notification.type === 'success' && <CheckCircleIcon />}
            <span className="text-body-large font-medium">{notification.message}</span>
          </div>
        )}

        {/* Memory Warning */}
        {memoryWarning && (
          <div className={`${warningClass} p-4 rounded-md-xl shadow-md-2 flex items-center gap-3`}>
            <MemoryIcon />
            <div>
              <div className="font-semibold text-body-large">High Memory Usage</div>
              <div className="text-body-medium">Consider reducing batch size or generating in smaller chunks</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className={`${cardClass} rounded-md-xl shadow-md-2 overflow-hidden`}>
          <div className="flex border-b border-opacity-20">
            {[
              { id: 'upload', label: 'Upload', icon: <UploadFileIcon /> },
              { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
              { id: 'preview', label: 'Preview', icon: <VisibilityIcon /> },
              { id: 'results', label: 'Results', icon: <GridOnIcon /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-all ${
                  activeTab === tab.id 
                    ? `${primaryClass} border-b-4 border-md-dark-primary` 
                    : `${textSecondaryClass} hover:${secondaryClass}`
                }`}
              >
                {tab.icon}
                <span className="text-label-large">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6 animate-fade-in">
                {/* Quick Stats Dashboard */}
                {statsData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`${secondaryClass} p-4 rounded-md-xl`}>
                      <div className="flex items-center gap-2 mb-2">
                        <InsertDriveFileIcon fontSize="small" />
                        <span className={`text-label-medium ${textSecondaryClass}`}>Total Rows</span>
                      </div>
                      <div className={`text-headline-small font-bold`}>{statsData.total}</div>
                    </div>
                    <div className={`${successClass} p-4 rounded-md-xl`}>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircleIcon fontSize="small" />
                        <span className={`text-label-medium ${textSecondaryClass}`}>Valid</span>
                      </div>
                      <div className={`text-headline-small font-bold`}>{statsData.valid}</div>
                    </div>
                    {statsData.duplicates > 0 && (
                      <div className={`${warningClass} p-4 rounded-md-xl`}>
                        <div className="flex items-center gap-2 mb-2">
                          <WarningIcon fontSize="small" />
                          <span className={`text-label-medium ${textSecondaryClass}`}>Duplicates</span>
                        </div>
                        <div className={`text-headline-small font-bold`}>{statsData.duplicates}</div>
                      </div>
                    )}
                    <div className={`${tertiaryClass} p-4 rounded-md-xl`}>
                      <div className="flex items-center gap-2 mb-2">
                        <DataUsageIcon fontSize="small" />
                        <span className={`text-label-medium ${textSecondaryClass}`}>Est. Size</span>
                      </div>
                      <div className={`text-headline-small font-bold`}>{statsData.estimatedSizeMB} MB</div>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className={`text-title-large font-semibold ${textClass} mb-4`}>
                    Upload Data File
                  </h2>
                  
                  <div 
                    className={`border-2 border-dashed ${isDragging ? 'border-md-dark-primary bg-md-dark-primary bg-opacity-10' : outlineClass} rounded-md-xl p-8 text-center transition-all ${isDragging ? 'scale-105' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <UploadFileIcon 
                      className={isDragging ? `${isDark ? 'text-md-dark-primary' : 'text-md-light-primary'}` : textSecondaryClass} 
                      style={{ fontSize: 64 }} 
                    />
                    <p className={`text-title-medium ${textClass} mt-4 mb-2`}>
                      {isDragging ? 'Drop your file here' : 'Drag & drop CSV or Excel file here'}
                    </p>
                    <p className={`text-body-medium ${textSecondaryClass} mb-4`}>
                      or click to browse (max 10MB, up to 2000 items)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`${primaryClass} px-6 py-3 rounded-md-lg font-medium cursor-pointer inline-flex items-center gap-2 state-layer hover:shadow-md-2 transition-all`}
                    >
                      <CloudDownloadIcon />
                      Choose File
                    </label>
                  </div>

                  <div className="mt-6">
                    <h3 className={`text-title-medium ${textClass} mb-3 flex items-center gap-2`}>
                      <TableChartIcon fontSize="small" />
                      Download CSV Templates
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { type: 'simple', label: 'Simple' },
                        { type: 'url', label: 'URL with Labels' },
                        { type: 'vcard', label: 'vCard' },
                        { type: 'wifi', label: 'WiFi' }
                      ].map(template => (
                        <button
                          key={template.type}
                          onClick={() => downloadCSVTemplate(template.type)}
                          className={`${secondaryClass} px-4 py-3 rounded-md-lg font-medium state-layer hover:shadow-md-1 flex items-center gap-2`}
                        >
                          <TableChartIcon fontSize="small" />
                          {template.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Google Sheets Import */}
                <div className={`${tertiaryClass} p-6 rounded-md-xl`}>
                  <h3 className={`text-title-medium font-semibold mb-3 flex items-center gap-2`}>
                    <CloudIcon />
                    Import from Google Sheets
                  </h3>
                  <p className={`text-body-small mb-4`}>
                    Import data directly from a public Google Sheets document
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={googleSheetUrl}
                      onChange={(e) => setGoogleSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass}`}
                    />
                    <button
                      onClick={handleGoogleSheetsImport}
                      disabled={loadingGoogleSheet || !googleSheetUrl.trim()}
                      className={`${primaryClass} px-6 py-3 rounded-md-lg font-medium flex items-center gap-2 state-layer hover:shadow-md-2 disabled:opacity-50`}
                    >
                      {loadingGoogleSheet ? (
                        <>
                          <RefreshIcon className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <CloudIcon />
                          Import
                        </>
                      )}
                    </button>
                  </div>
                  <details className="mt-3">
                    <summary className={`text-label-small ${textSecondaryClass} cursor-pointer hover:underline`}>
                      How to share your Google Sheet
                    </summary>
                    <pre className={`text-body-small ${textSecondaryClass} mt-2 whitespace-pre-wrap`}>
                      {getShareInstructions()}
                    </pre>
                  </details>
                </div>

                {/* Webhook Configuration */}
                <div className={`${secondaryClass} p-6 rounded-md-xl`}>
                  <h3 className={`text-title-medium font-semibold mb-3 flex items-center gap-2`}>
                    <WebhookIcon />
                    Webhook Notifications
                  </h3>
                  <p className={`text-body-small mb-4`}>
                    Get notified when batch generation completes
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://your-webhook-url.com/endpoint"
                        className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass}`}
                      />
                      <button
                        onClick={handleTestWebhook}
                        disabled={testingWebhook || !webhookUrl.trim()}
                        className={`${tertiaryClass} px-4 py-3 rounded-md-lg font-medium flex items-center gap-2 state-layer disabled:opacity-50`}
                      >
                        {testingWebhook ? (
                          <>
                            <RefreshIcon className="animate-spin" fontSize="small" />
                            Testing
                          </>
                        ) : (
                          <>
                            <CheckIcon fontSize="small" />
                            Test
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleSaveWebhook}
                        disabled={!webhookUrl.trim()}
                        className={`${primaryClass} px-4 py-3 rounded-md-lg font-medium flex items-center gap-2 state-layer disabled:opacity-50`}
                      >
                        <SaveIcon fontSize="small" />
                        Save
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="webhook-enabled"
                        checked={webhookEnabled}
                        onChange={(e) => setWebhookEnabled(e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                      <label htmlFor="webhook-enabled" className={`text-body-medium cursor-pointer`}>
                        Enable webhook notifications
                      </label>
                    </div>
                    <p className={`text-body-small ${textSecondaryClass}`}>
                      Supports Slack, Discord, Microsoft Teams, and custom webhooks
                    </p>
                  </div>
                </div>

                {bulkData.length > 0 && dataValidation && (
                  <div className={`${secondaryClass} p-6 rounded-md-xl`}>
                    <h3 className={`text-title-medium font-semibold mb-4`}>
                      Data Validation Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-headline-small font-bold">{dataValidation.total}</div>
                        <div className="text-body-medium">Total Rows</div>
                      </div>
                      <div className="text-center">
                        <div className="text-headline-small font-bold text-green-600">{dataValidation.valid}</div>
                        <div className="text-body-medium">Valid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-headline-small font-bold text-red-600">{dataValidation.invalid}</div>
                        <div className="text-body-medium">Invalid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-headline-small font-bold text-yellow-600">{dataValidation.duplicates}</div>
                        <div className="text-body-medium">Duplicates</div>
                      </div>
                    </div>

                    {invalidRows.length > 0 && (
                      <div className="mt-4">
                        <h4 className={`text-title-small font-semibold mb-2`}>Invalid Rows:</h4>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {invalidRows.slice(0, 5).map((inv, i) => (
                            <div key={i} className={`text-body-small ${errorClass} p-2 rounded-md-md`}>
                              Row {inv.index}: {inv.reason}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {duplicates.length > 0 && (
                      <div className="mt-4">
                        <h4 className={`text-title-small font-semibold mb-2`}>Duplicate Values:</h4>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {duplicates.slice(0, 5).map((dup, i) => (
                            <div key={i} className={`text-body-small ${warningClass} p-2 rounded-md-md`}>
                              "{dup.value}" appears in rows: {dup.indices.join(', ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                {/* Column Mapping */}
                <div className={`${tertiaryClass} p-6 rounded-md-xl`}>
                  <h3 className={`text-title-large font-semibold mb-4 flex items-center gap-2`}>
                    <CompareArrowsIcon />
                    Column Mapping
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-label-large font-medium mb-2`}>
                        QR Data Column
                      </label>
                      <select
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                        className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass}`}
                      >
                        {availableColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-label-large font-medium mb-2`}>
                        Label Column (Optional)
                      </label>
                      <select
                        value={labelColumn}
                        onChange={(e) => setLabelColumn(e.target.value)}
                        className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass}`}
                      >
                        <option value="">None</option>
                        {availableColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className={`block text-label-large font-medium mb-2`}>
                      Filename Pattern
                    </label>
                    <input
                      type="text"
                      value={customNamingPattern}
                      onChange={(e) => setCustomNamingPattern(e.target.value)}
                      placeholder="{index}-qr or {name}-{id}"
                      className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass}`}
                    />
                    <p className={`text-body-small ${textSecondaryClass} mt-1`}>
                      Use {'{index}'} or any column name in {'{}'} brackets
                    </p>
                  </div>
                </div>

                {/* QR Customization */}
                <div className={`${cardClass} p-6 rounded-md-xl border ${outlineClass}`}>
                  <h3 className={`text-title-large font-semibold mb-4 flex items-center gap-2`}>
                    <TuneIcon />
                    QR Code Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                        Size: {qrSize}px
                      </label>
                      <input
                        type="range"
                        min="256"
                        max="2048"
                        step="128"
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                        Error Correction
                      </label>
                      <select
                        value={errorCorrection}
                        onChange={(e) => setErrorCorrection(e.target.value)}
                        className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-2 ${textClass}`}
                      >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                        Foreground Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="w-16 h-10 rounded-md-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-lg px-3 ${textClass}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-label-medium ${textSecondaryClass} mb-2`}>
                        Background Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-16 h-10 rounded-md-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-lg px-3 ${textClass}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className={`text-label-large font-medium`}>
                        Logo (Optional)
                      </label>
                      {logoImage && (
                        <button
                          onClick={removeLogo}
                          className={`${errorClass} px-3 py-1 rounded-md-md text-label-small flex items-center gap-1`}
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
                      className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 file:mr-3 file:py-2 file:px-4 file:rounded-md-md file:border-0 file:${secondaryClass} file:cursor-pointer`}
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
                      </div>
                    )}
                  </div>
                </div>

                {/* Export Settings */}
                <div className={`${secondaryClass} p-6 rounded-md-xl`}>
                  <h3 className={`text-title-large font-semibold mb-4 flex items-center gap-2`}>
                    <DownloadIcon />
                    Export Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-label-medium mb-2`}>
                        Export Format
                      </label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass}`}
                      >
                        <option value="zip">ZIP Archive</option>
                        <option value="pdf">PDF Document</option>
                        <option value="individual">Individual Files</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-label-medium mb-2`}>
                        Batch Size (for ZIP)
                      </label>
                      <input
                        type="number"
                        value={batchSize}
                        onChange={(e) => setBatchSize(Number(e.target.value))}
                        min="100"
                        max="2000"
                        step="100"
                        className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass}`}
                      />
                    </div>
                  </div>

                  {/* PDF Layout Settings */}
                  {exportFormat === 'pdf' && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className={`block text-label-medium mb-2`}>
                            Rows per Page
                          </label>
                          <input
                            type="number"
                            value={pdfLayout.rows}
                            onChange={(e) => setPdfLayout({...pdfLayout, rows: Number(e.target.value)})}
                            min="1"
                            max="10"
                            className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-2 ${textClass}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-label-medium mb-2`}>
                            Columns per Page
                          </label>
                          <input
                            type="number"
                            value={pdfLayout.cols}
                            onChange={(e) => setPdfLayout({...pdfLayout, cols: Number(e.target.value)})}
                            min="1"
                            max="10"
                            className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-2 ${textClass}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-label-medium mb-2`}>
                            Margin (mm)
                          </label>
                          <input
                            type="number"
                            value={pdfMargin}
                            onChange={(e) => setPdfMargin(Number(e.target.value))}
                            min="5"
                            max="30"
                            className={`w-full ${inputBgClass} border ${outlineClass} rounded-md-lg p-2 ${textClass}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-label-medium mb-2`}>
                          Print Template
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {['standard', 'business-card', 'label', 'badge'].map(template => (
                            <button
                              key={template}
                              onClick={() => {
                                setPrintTemplate(template);
                                // Auto-set layout based on template
                                switch(template) {
                                  case 'business-card':
                                    setPdfLayout({ rows: 2, cols: 2 });
                                    break;
                                  case 'label':
                                    setPdfLayout({ rows: 5, cols: 4 });
                                    break;
                                  case 'badge':
                                    setPdfLayout({ rows: 3, cols: 2 });
                                    break;
                                  default:
                                    setPdfLayout({ rows: 4, cols: 3 });
                                }
                              }}
                              className={`px-3 py-2 rounded-md-md text-label-small ${
                                printTemplate === template ? primaryClass : tertiaryClass
                              }`}
                            >
                              {template}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Configuration Management */}
                <div className={`${secondaryClass} p-6 rounded-md-xl`}>
                  <h3 className={`text-title-large font-semibold mb-4 flex items-center gap-2`}>
                    <SaveIcon />
                    Save & Load Configurations
                  </h3>
                  
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={configName}
                      onChange={(e) => setConfigName(e.target.value)}
                      placeholder="Configuration name..."
                      className={`flex-1 ${inputBgClass} border ${outlineClass} rounded-md-lg p-3 ${textClass}`}
                    />
                    <button
                      onClick={saveConfiguration}
                      disabled={!configName.trim()}
                      className={`${primaryClass} px-6 py-3 rounded-md-lg font-medium flex items-center gap-2 state-layer hover:shadow-md-2 disabled:opacity-50`}
                    >
                      <SaveIcon />
                      Save
                    </button>
                  </div>

                  {savedConfigs.length > 0 && (
                    <div className="space-y-2">
                      <p className={`text-label-medium ${textSecondaryClass} mb-2`}>Saved Configurations:</p>
                      {savedConfigs.map((config, index) => (
                        <div key={index} className={`${cardClass} p-3 rounded-md-lg flex items-center justify-between`}>
                          <div className="flex-1">
                            <p className={`text-body-medium font-medium ${textClass}`}>{config.name}</p>
                            <p className={`text-body-small ${textSecondaryClass}`}>
                              {new Date(config.timestamp).toLocaleDateString()} - Size: {config.qrSize}px
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => loadConfiguration(config)}
                              className={`${tertiaryClass} px-3 py-2 rounded-md-md text-label-small state-layer`}
                            >
                              Load
                            </button>
                            <button
                              onClick={() => deleteConfiguration(config.name)}
                              className={`${errorClass} px-3 py-2 rounded-md-md text-label-small state-layer`}
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Batch History */}
                {batchHistory.length > 0 && (
                  <div className={`${tertiaryClass} p-6 rounded-md-xl`}>
                    <h3 className={`text-title-large font-semibold mb-4 flex items-center gap-2`}>
                      <HistoryIcon />
                      Recent Batches
                    </h3>
                    <div className="space-y-2">
                      {batchHistory.slice(0, 10).map((batch, index) => (
                        <div key={batch.id} className={`${cardClass} p-3 rounded-md-lg`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-body-medium font-medium ${textClass}`}>
                                {batch.count} QR Codes Generated
                              </p>
                              <p className={`text-body-small ${textSecondaryClass}`}>
                                {new Date(batch.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className={`${successClass} px-3 py-1 rounded-md-full text-label-small`}>
                              Completed
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Data Table with Search and Sort */}
                {bulkData.length > 0 && (
                  <div className={`${cardClass} rounded-md-xl overflow-hidden`}>
                    <div className="p-4 border-b border-opacity-20 flex items-center justify-between">
                      <h3 className={`text-title-medium font-semibold ${textClass}`}>
                        Data Preview ({getFilteredAndSortedData().length} rows)
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} fontSize="small" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search data..."
                            className={`${inputBgClass} border ${outlineClass} rounded-md-lg pl-10 pr-4 py-2 ${textClass} focus:outline-none focus:ring-2 focus:ring-md-dark-primary`}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full">
                        <thead className={`${surfaceClass} sticky top-0 z-10`}>
                          <tr>
                            <th className={`px-4 py-3 text-left text-label-small font-medium ${textSecondaryClass} uppercase tracking-wider`}>
                              #
                            </th>
                            {availableColumns.map(column => (
                              <th
                                key={column}
                                onClick={() => handleSort(column)}
                                className={`px-4 py-3 text-left text-label-small font-medium ${textSecondaryClass} uppercase tracking-wider cursor-pointer hover:${textClass} transition-colors`}
                              >
                                <div className="flex items-center gap-1">
                                  {column}
                                  {sortColumn === column && (
                                    sortDirection === 'asc' ? 
                                      <ArrowUpwardIcon fontSize="inherit" /> : 
                                      <ArrowDownwardIcon fontSize="inherit" />
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-opacity-10">
                          {getFilteredAndSortedData().slice(0, 100).map((row, index) => (
                            <tr key={index} className={`hover:${secondaryClass} transition-colors`}>
                              <td className={`px-4 py-3 text-body-small ${textSecondaryClass}`}>
                                {index + 1}
                              </td>
                              {availableColumns.map(column => (
                                <td key={column} className={`px-4 py-3 text-body-small ${textClass}`}>
                                  <div className="max-w-xs truncate" title={row[column]}>
                                    {row[column]}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {getFilteredAndSortedData().length > 100 && (
                      <div className={`p-3 text-center text-body-small ${textSecondaryClass} border-t border-opacity-20`}>
                        Showing first 100 of {getFilteredAndSortedData().length} rows
                      </div>
                    )}
                  </div>
                )}

                {/* QR Preview Section */}
                <div className="flex justify-between items-center">
                  <h2 className={`text-title-large font-semibold ${textClass}`}>
                    Preview First 5 QR Codes
                  </h2>
                  <button
                    onClick={generatePreview}
                    disabled={bulkData.length === 0}
                    className={`${primaryClass} px-6 py-3 rounded-md-lg font-medium flex items-center gap-2 state-layer hover:shadow-md-2 disabled:opacity-50`}
                  >
                    <VisibilityIcon />
                    Generate Preview
                  </button>
                </div>

                {previewData.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {previewData.map((preview, index) => (
                      <div key={index} className={`${cardClass} p-4 rounded-md-xl border ${outlineClass}`}>
                        {preview.dataURL ? (
                          <>
                            <img 
                              src={preview.dataURL} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-auto rounded-md-lg mb-3" 
                            />
                            {preview.label && (
                              <div className={`text-center text-body-medium ${textClass} mb-2`}>
                                {preview.label}
                              </div>
                            )}
                            <div className={`text-body-small ${textSecondaryClass} truncate text-center`}>
                              {preview.text}
                            </div>
                          </>
                        ) : (
                          <div className={`${errorClass} p-4 rounded-md-lg text-center`}>
                            Error: {preview.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {previewData.length === 0 && bulkData.length > 0 && (
                  <div className={`${secondaryClass} p-12 rounded-md-xl text-center`}>
                    <VisibilityIcon className={textSecondaryClass} style={{ fontSize: 64 }} />
                    <p className={`text-title-medium ${textClass} mt-4`}>
                      No previews generated yet
                    </p>
                    <p className={`text-body-medium ${textSecondaryClass}`}>
                      Click "Generate Preview" to see sample QR codes
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-6 animate-fade-in">
                {bulkResults.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <h2 className={`text-title-large font-semibold ${textClass}`}>
                        Generated QR Codes ({bulkResults.length})
                      </h2>
                      <div className="flex gap-3">
                        <button
                          onClick={exportAsZip}
                          className={`${primaryClass} px-4 py-3 rounded-md-lg font-medium flex items-center gap-2 state-layer hover:shadow-md-2`}
                        >
                          <FolderZipIcon />
                          Export as ZIP
                        </button>
                        <button
                          onClick={exportAsPDF}
                          className={`${secondaryClass} px-4 py-3 rounded-md-lg font-medium flex items-center gap-2 state-layer hover:shadow-md-1`}
                        >
                          <PictureAsPdfIcon />
                          Export as PDF
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto">
                      {bulkResults.map((result, index) => (
                        <div key={index} className={`${cardClass} p-3 rounded-md-lg border ${outlineClass} hover:shadow-md-2 transition-all`}>
                          {result.dataURL ? (
                            <>
                              <img 
                                src={result.dataURL} 
                                alt={`QR ${index + 1}`} 
                                className="w-full h-auto rounded-md-md mb-2" 
                              />
                              {result.label && (
                                <div className={`text-center text-label-medium ${textClass} mb-1`}>
                                  {result.label}
                                </div>
                              )}
                              <div className={`text-body-small ${textSecondaryClass} truncate text-center`}>
                                {result.text}
                              </div>
                            </>
                          ) : (
                            <div className={`${errorClass} p-3 rounded-md-md text-center`}>
                              <ErrorIcon fontSize="small" />
                              <div className="text-label-small mt-1">Error</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={`${secondaryClass} p-12 rounded-md-xl text-center`}>
                    <GridOnIcon className={textSecondaryClass} style={{ fontSize: 64 }} />
                    <p className={`text-title-medium ${textClass} mt-4`}>
                      No results yet
                    </p>
                    <p className={`text-body-medium ${textSecondaryClass}`}>
                      Generate QR codes to see results here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Generation Controls */}
        {bulkData.length > 0 && activeTab !== 'upload' && (
          <div className={`${cardClass} p-6 rounded-md-xl shadow-md-3`}>
            {bulkGenerating ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`text-title-medium font-semibold ${textClass}`}>
                      {bulkPaused ? 'Generation Paused' : 'Generating QR Codes...'}
                    </div>
                    <div className={`text-body-medium ${textSecondaryClass} flex items-center gap-2 mt-1`}>
                      <TimerIcon fontSize="small" />
                      {formatTime(elapsedTime)} elapsed {estimatedTime > 0 && `/ ~${formatTime(estimatedTime)} estimated`}
                    </div>
                  </div>
                  <div className={`text-headline-small font-bold ${textClass}`}>
                    {bulkProgress}%
                  </div>
                </div>

                <div className={`w-full h-3 ${inputBgClass} rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full ${primaryClass} transition-all duration-300`}
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>

                <div className={`text-body-small ${textSecondaryClass}`}>
                  {Math.round((bulkProgress / 100) * bulkData.length)} of {bulkData.length} completed
                </div>

                <div className="flex gap-3">
                  {!bulkPaused ? (
                    <button
                      onClick={pauseGeneration}
                      className={`${secondaryClass} flex-1 py-3 px-4 rounded-md-lg font-medium flex items-center justify-center gap-2 state-layer`}
                    >
                      <PauseIcon />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeGeneration}
                      className={`${primaryClass} flex-1 py-3 px-4 rounded-md-lg font-medium flex items-center justify-center gap-2 state-layer`}
                    >
                      <PlayArrowIcon />
                      Resume
                    </button>
                  )}
                  <button
                    onClick={cancelGeneration}
                    className={`${errorClass} flex-1 py-3 px-4 rounded-md-lg font-medium flex items-center justify-center gap-2 state-layer`}
                  >
                    <CancelIcon />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={generateBulkQRCodes}
                  className={`${primaryClass} flex-1 py-4 px-6 rounded-md-lg font-semibold text-label-large shadow-md-2 state-layer hover:shadow-md-3 flex items-center justify-center gap-2`}
                >
                  <QrCode2Icon />
                  Generate {bulkData.length} QR Codes
                </button>
                <div className={`${tertiaryClass} px-6 py-4 rounded-md-lg`}>
                  <div className={`text-label-small ${textSecondaryClass}`}>Estimated Time</div>
                  <div className={`text-title-medium font-semibold`}>
                    {formatTime(estimatedTime)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvancedBulkTab;
