// Content script for scanning QR codes on web pages
// This script runs on all web pages and can access the DOM

(function() {
  'use strict';

  // Global variables for overlay
  let overlayContainer = null;
  let isOverlayActive = false;

  console.log('QR Studio content script initialized');
  console.log('jsQR available:', typeof jsQR);

  // Helper function to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

// Listen for messages from background script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanPage') {
    scanPageForQRCodes().then(results => {
      sendResponse({ results });
    }).catch(err => {
      console.error('Scan error:', err);
      sendResponse({ results: [] });
    });
    return true; // Keep message channel open for async response
  } else if (request.action === 'scanImage') {
    scanSingleImage(request.imageUrl).then(result => {
      if (result) {
        // Show result in overlay instead of notification
        showImageScanOverlay(result, request.imageUrl);
        sendResponse({ result });
      } else {
        // Show "no QR code found" overlay
        showImageScanOverlay(null, request.imageUrl);
        sendResponse({ result: null });
      }
    }).catch(err => {
      console.error('Image scan error:', err);
      showImageScanOverlay(null, request.imageUrl);
      sendResponse({ result: null });
    });
    return true;
  } else if (request.action === 'showOverlay') {
    showPageOverlay().then(() => {
      sendResponse({ success: true });
    }).catch(err => {
      console.error('Overlay error:', err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  } else if (request.action === 'hideOverlay') {
    hidePageOverlay();
    sendResponse({ success: true });
    return true;
  }
  return false;
});

// Scan all images on the current page for QR codes
async function scanPageForQRCodes() {
  const results = [];
  
  // Get all images on the page (limit to first 50 to avoid performance issues)
  const images = Array.from(document.querySelectorAll('img')).slice(0, 50);
  
  for (const img of images) {
    try {
      // Skip images that are too small (likely icons)
      if (img.width < 50 || img.height < 50) continue;
      
      const qrData = await scanImageElement(img);
      if (qrData) {
        results.push({
          data: qrData,
          source: 'page',
          imageUrl: img.src,
        });
      }
    } catch (err) {
      // Silently skip problematic images
      console.debug('Skipping image:', err);
    }
  }
  
  return results;
}

// Scan a single image element
async function scanImageElement(imgElement) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Wait for image to load if needed
    if (!imgElement.complete) {
      imgElement.onload = () => processImage();
      imgElement.onerror = () => resolve(null);
    } else {
      processImage();
    }
    
    function processImage() {
      try {
        canvas.width = imgElement.naturalWidth || imgElement.width;
        canvas.height = imgElement.naturalHeight || imgElement.height;
        
        if (canvas.width === 0 || canvas.height === 0) {
          resolve(null);
          return;
        }
        
        ctx.drawImage(imgElement, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Use jsQR to scan the image
        try {
          const code = jsQR(imageData.data, canvas.width, canvas.height, {
            inversionAttempts: "attemptBoth",
          });
          resolve(code ? code.data : null);
        } catch (err) {
          console.error('jsQR scan error:', err);
          resolve(null);
        }
      } catch (err) {
        console.debug('Error processing image:', err);
        resolve(null);
      }
    }
  });
}

// Scan an image from URL
async function scanSingleImage(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      const qrData = await scanImageElement(img);
      resolve(qrData ? { data: qrData, source: 'context-menu' } : null);
    };
    
    img.onerror = () => {
      resolve(null);
    };
    
    img.src = imageUrl;
  });
}

// Scan image from URL
async function scanImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      const qrData = await scanImageElement(img);
      resolve(qrData);
    };
    
    img.onerror = () => {
      resolve(null);
    };
    
    img.src = url;
  });
}

// Create and show page overlay with QR code detection
async function showPageOverlay() {
  if (isOverlayActive) {
    return; // Already active
  }
  
  isOverlayActive = true;
  
  // Create overlay container
  overlayContainer = document.createElement('div');
  overlayContainer.id = 'qr-studio-overlay';
  overlayContainer.innerHTML = `
    <div class="qr-overlay-header">
      <div class="qr-overlay-title">QR Studio</div>
      <button class="qr-overlay-close" title="Close">✕</button>
    </div>
    <div class="qr-overlay-content">
      <div class="qr-overlay-status">Scanning page for QR codes...</div>
      <div class="qr-overlay-results"></div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #qr-studio-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: calc(100vh - 40px);
      background: #1E2022;
      border: 1px solid #41484D;
      border-radius: 28px;
      box-shadow: 
        0 8px 12px rgba(0, 0, 0, 0.4),
        0 0 1px rgba(255, 255, 255, 0.05);
      z-index: 2147483647;
      font-family: 'Roboto', 'Segoe UI', system-ui, -apple-system, sans-serif;
      overflow: hidden;
      animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .qr-overlay-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: #282A2C;
      color: #E2E2E6;
      border-bottom: 1px solid #41484D;
    }
    
    .qr-overlay-title {
      font-weight: 500;
      font-size: 22px;
      line-height: 28px;
      letter-spacing: 0;
      color: #E2E2E6;
    }
    
    .qr-overlay-close {
      background: transparent;
      border: none;
      color: #C1C7CE;
      font-size: 24px;
      cursor: pointer;
      padding: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .qr-overlay-close:hover {
      background: #323437;
      color: #E2E2E6;
    }
    
    .qr-overlay-close:active {
      background: #41484D;
    }
    
    .qr-overlay-content {
      padding: 24px;
      background: #1E2022;
    }
    
    .qr-overlay-status {
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      color: #C1C7CE;
      margin-bottom: 16px;
      padding: 16px;
      background: #282A2C;
      border-radius: 16px;
      border-left: 4px solid #A8C7FA;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .qr-overlay-status::before {
      content: '🔍';
      font-size: 20px;
    }
    
    .qr-overlay-results {
      max-height: calc(100vh - 280px);
      overflow-y: auto;
      padding-right: 8px;
    }
    
    .qr-overlay-results::-webkit-scrollbar {
      width: 8px;
    }
    
    .qr-overlay-results::-webkit-scrollbar-track {
      background: #1E2022;
      border-radius: 4px;
    }
    
    .qr-overlay-results::-webkit-scrollbar-thumb {
      background: #41484D;
      border-radius: 4px;
    }
    
    .qr-overlay-results::-webkit-scrollbar-thumb:hover {
      background: #8B9297;
    }
    
    .qr-code-box {
      position: absolute;
      border: 3px solid #A8C7FA;
      background: rgba(168, 199, 250, 0.08);
      pointer-events: none;
      z-index: 2147483646;
      border-radius: 16px;
      animation: qrPulse 2.5s ease-in-out infinite;
      box-shadow: 
        0 0 32px rgba(168, 199, 250, 0.5),
        inset 0 0 16px rgba(168, 199, 250, 0.15);
    }
    
    @keyframes qrPulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
        border-color: #A8C7FA;
        box-shadow: 
          0 0 32px rgba(168, 199, 250, 0.5),
          inset 0 0 16px rgba(168, 199, 250, 0.15);
      }
      50% {
        opacity: 0.9;
        transform: scale(1.015);
        border-color: #D3E4FF;
        box-shadow: 
          0 0 48px rgba(168, 199, 250, 0.7),
          inset 0 0 24px rgba(168, 199, 250, 0.25);
      }
    }
    
    /* Animated corner markers */
    .qr-code-box::after,
    .qr-code-box::before {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      border: 3px solid #4A4FE5;
      animation: cornerPulse 1.5s ease-in-out infinite;
    }
    
    .qr-code-box::after {
      top: -3px;
      left: -3px;
      border-right: none;
      border-bottom: none;
      border-top-left-radius: 16px;
    }
    
    .qr-code-box::before {
      bottom: -3px;
      right: -3px;
      border-left: none;
      border-top: none;
      border-bottom-right-radius: 16px;
    }
    
    @keyframes cornerPulse {
      0%, 100% {
        opacity: 1;
        border-color: #4A4FE5;
      }
      50% {
        opacity: 0.6;
        border-color: #7C7FFF;
      }
    }
    
    /* Success badge */
    .qr-code-badge {
      position: absolute;
      top: -16px;
      right: -16px;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #1E2022;
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(76, 175, 80, 0.6);
      animation: badgePop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      z-index: 1;
    }
    
    @keyframes badgePop {
      0% {
        transform: scale(0) rotate(-180deg);
        opacity: 0;
      }
      100% {
        transform: scale(1) rotate(0);
        opacity: 1;
      }
    }
    
    .qr-code-badge::after {
      content: '✓';
      color: #FFFFFF;
      font-size: 18px;
      font-weight: bold;
    }
    
    .qr-result-item {
      padding: 20px;
      margin-bottom: 16px;
      background: #282A2C;
      border: 1px solid #41484D;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .qr-result-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #A8C7FA, #D3E4FF);
      transform: scaleX(0);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 20px 20px 0 0;
    }
    
    .qr-result-item:hover {
      background: #323437;
      border-color: #A8C7FA;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    
    .qr-result-item:hover::before {
      transform: scaleX(1);
    }
    
    .qr-result-text {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #E2E2E6;
      word-break: break-all;
      margin-bottom: 12px;
      font-family: 'Roboto Mono', 'Courier New', monospace;
    }
    
    .qr-result-type {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: #C1C7CE;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
      padding: 6px 16px;
      background: #1E2022;
      border-radius: 100px;
      border: 1px solid #41484D;
    }
    
    .qr-result-actions {
      margin-top: 16px;
      display: flex;
      gap: 12px;
    }
    
    .qr-action-btn {
      flex: 1;
      padding: 12px 20px;
      background: #A8C7FA;
      color: #003258;
      border: none;
      border-radius: 100px;
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    
    .qr-action-btn:hover {
      background: #D3E4FF;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(168, 199, 250, 0.3);
    }
    
    .qr-action-btn:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    .qr-action-btn.success {
      background: #B8C8DA;
      color: #23323F;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(overlayContainer);
  
  // Add close button handler
  overlayContainer.querySelector('.qr-overlay-close').addEventListener('click', hidePageOverlay);
  
  // Add keyboard navigation - ESC to close overlay
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isOverlayActive) {
      hidePageOverlay();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  overlayContainer._keydownHandler = handleKeyDown; // Store for cleanup
  
  // Start scanning
  await scanPageWithOverlay();
}

// Hide page overlay
function hidePageOverlay() {
  if (!isOverlayActive) return;
  
  isOverlayActive = false;
  
  // Remove keyboard listener
  if (overlayContainer && overlayContainer._keydownHandler) {
    document.removeEventListener('keydown', overlayContainer._keydownHandler);
  }
  
  // Remove overlay boxes
  document.querySelectorAll('.qr-code-box').forEach(box => box.remove());
  
  // Remove overlay container
  if (overlayContainer) {
    overlayContainer.remove();
    overlayContainer = null;
  }
}

// Show overlay with image scan result
function showImageScanOverlay(result, imageUrl) {
  // Remove any existing overlay
  hidePageOverlay();
  
  isOverlayActive = true;
  
  // Create overlay container
  overlayContainer = document.createElement('div');
  overlayContainer.id = 'qr-studio-overlay';
  
  const hasResult = result && result.data;
  const resultHtml = hasResult ? `
    <div class="qr-overlay-result-card">
      <div class="qr-overlay-result-label">QR Code Content:</div>
      <div class="qr-overlay-result-data">${escapeHtml(result.data)}</div>
      <div class="qr-overlay-actions">
        <button class="qr-overlay-btn qr-overlay-btn-primary" data-action="copy">
          Copy
        </button>
        <button class="qr-overlay-btn qr-overlay-btn-secondary" data-action="open">
          Open
        </button>
      </div>
    </div>
  ` : `
    <div class="qr-overlay-no-result">
      <div class="qr-overlay-no-result-icon">❌</div>
      <div class="qr-overlay-no-result-text">No QR code found in this image</div>
    </div>
  `;
  
  overlayContainer.innerHTML = `
    <div class="qr-overlay-header">
      <div class="qr-overlay-title">QR Code Scan Result</div>
      <button class="qr-overlay-close" title="Close">✕</button>
    </div>
    <div class="qr-overlay-content">
      ${resultHtml}
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #qr-studio-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 420px;
      max-height: calc(100vh - 40px);
      background: #1E2022;
      border: 1px solid #41484D;
      border-radius: 28px;
      box-shadow: 
        0 8px 12px rgba(0, 0, 0, 0.4),
        0 0 1px rgba(255, 255, 255, 0.05);
      z-index: 2147483647;
      font-family: 'Roboto', 'Segoe UI', system-ui, -apple-system, sans-serif;
      overflow: hidden;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .qr-overlay-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: #282A2C;
      color: #E2E2E6;
      border-bottom: 1px solid #41484D;
    }
    
    .qr-overlay-title {
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
    }
    
    .qr-overlay-close {
      background: transparent;
      border: none;
      color: #B3B9BF;
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s;
    }
    
    .qr-overlay-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #E2E2E6;
    }
    
    .qr-overlay-content {
      padding: 24px;
      overflow-y: auto;
      max-height: calc(100vh - 140px);
    }
    
    .qr-overlay-result-card {
      background: #282A2C;
      border: 1px solid #41484D;
      border-radius: 16px;
      padding: 20px;
    }
    
    .qr-overlay-result-label {
      color: #B3B9BF;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    
    .qr-overlay-result-data {
      color: #E2E2E6;
      font-size: 14px;
      line-height: 1.6;
      word-wrap: break-word;
      margin-bottom: 16px;
      padding: 12px;
      background: #1E2022;
      border-radius: 8px;
      border: 1px solid #41484D;
    }
    
    .qr-overlay-actions {
      display: flex;
      gap: 8px;
    }
    
    .qr-overlay-btn {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .qr-overlay-btn-primary {
      background: #4A4FE5;
      color: white;
    }
    
    .qr-overlay-btn-primary:hover {
      background: #5A5FFF;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(74, 79, 229, 0.3);
    }
    
    .qr-overlay-btn-secondary {
      background: #282A2C;
      color: #E2E2E6;
      border: 1px solid #41484D;
    }
    
    .qr-overlay-btn-secondary:hover {
      background: #41484D;
    }
    
    .qr-overlay-no-result {
      text-align: center;
      padding: 40px 20px;
    }
    
    .qr-overlay-no-result-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .qr-overlay-no-result-text {
      color: #B3B9BF;
      font-size: 16px;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(overlayContainer);
  
  // Add event listeners
  const closeBtn = overlayContainer.querySelector('.qr-overlay-close');
  closeBtn.addEventListener('click', hidePageOverlay);
  
  // Add keyboard navigation for image scan overlay
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isOverlayActive) {
      hidePageOverlay();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  overlayContainer._keydownHandler = handleKeyDown;
  
  if (hasResult) {
    const copyBtn = overlayContainer.querySelector('[data-action="copy"]');
    const openBtn = overlayContainer.querySelector('[data-action="open"]');
    
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(result.data).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      });
    });
    
    openBtn.addEventListener('click', () => {
      if (result.data.startsWith('http://') || result.data.startsWith('https://')) {
        window.open(result.data, '_blank');
      } else {
        // Try to open as URL anyway
        window.open('https://' + result.data, '_blank');
      }
    });
  }
  
  // Auto-hide after 10 seconds if no result
  if (!hasResult) {
    setTimeout(() => {
      if (isOverlayActive && overlayContainer) {
        hidePageOverlay();
      }
    }, 10000);
  }
}

// Scan the entire page and show overlay boxes
async function scanPageWithOverlay() {
  const statusEl = overlayContainer.querySelector('.qr-overlay-status');
  const resultsEl = overlayContainer.querySelector('.qr-overlay-results');
  
  // Set initial status with icon
  statusEl.innerHTML = '';
  statusEl.style.borderColor = '#A8C7FA';
  const scanIcon = document.createElement('span');
  scanIcon.textContent = '🔍';
  scanIcon.style.cssText = 'font-size: 20px;';
  statusEl.appendChild(scanIcon);
  const scanText = document.createElement('span');
  scanText.textContent = 'Scanning page for QR codes...';
  statusEl.appendChild(scanText);
  resultsEl.innerHTML = '';
  
  try {
    // Take screenshot of visible area
    const screenshot = await chrome.runtime.sendMessage({ action: 'captureVisibleTab' });
    
    if (!screenshot) {
      statusEl.innerHTML = '';
      statusEl.style.borderColor = '#FFB4AB';
      const errorIcon = document.createElement('span');
      errorIcon.textContent = '❌';
      errorIcon.style.cssText = 'font-size: 20px; color: #FFB4AB;';
      statusEl.appendChild(errorIcon);
      const errorText = document.createElement('span');
      errorText.textContent = 'Failed to capture page screenshot';
      statusEl.appendChild(errorText);
      return;
    }
    
    // Create image from screenshot
    const img = new Image();
    img.src = screenshot;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Scan the screenshot
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const code = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: "attemptBoth",
    });
    
    if (code) {
      // Calculate position relative to viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scaleX = viewportWidth / canvas.width;
      const scaleY = viewportHeight / canvas.height;
      
      // Create overlay box
      const box = document.createElement('div');
      box.className = 'qr-code-box';
      box.style.left = (code.location.topLeftCorner.x * scaleX) + 'px';
      box.style.top = (code.location.topLeftCorner.y * scaleY) + 'px';
      box.style.width = ((code.location.bottomRightCorner.x - code.location.topLeftCorner.x) * scaleX) + 'px';
      box.style.height = ((code.location.bottomRightCorner.y - code.location.topLeftCorner.y) * scaleY) + 'px';
      
      // Add success badge
      const badge = document.createElement('div');
      badge.className = 'qr-code-badge';
      box.appendChild(badge);
      
      document.body.appendChild(box);
      
      // Determine if it's a URL
      const isUrl = code.data.startsWith('http://') || code.data.startsWith('https://');
      
      // Add result to overlay
      const resultItem = document.createElement('div');
      resultItem.className = 'qr-result-item';
      resultItem.innerHTML = `
        <div class="qr-result-text">${escapeHtml(code.data)}</div>
        <div class="qr-result-type">QR Code</div>
        <div class="qr-result-actions">
          ${isUrl ? '<button class="qr-action-btn qr-open-btn">🔗 Open Link</button>' : ''}
          <button class="qr-action-btn qr-copy-btn">📋 Copy</button>
        </div>
      `;
      
      // Add event listeners for buttons
      const copyBtn = resultItem.querySelector('.qr-copy-btn');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code.data).then(() => {
          copyBtn.textContent = '✓ Copied';
          copyBtn.classList.add('success');
          setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
            copyBtn.classList.remove('success');
          }, 2000);
        });
      });
      
      if (isUrl) {
        const openBtn = resultItem.querySelector('.qr-open-btn');
        openBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.open(code.data, '_blank');
        });
      }
      
      resultsEl.appendChild(resultItem);
      
      // Update status with icon
      statusEl.innerHTML = '';
      statusEl.style.borderColor = '#A8C7FA';
      const statusIcon = document.createElement('span');
      statusIcon.textContent = '✓';
      statusIcon.style.cssText = 'font-size: 20px; color: #A8C7FA;';
      statusEl.appendChild(statusIcon);
      const statusText = document.createElement('span');
      statusText.textContent = 'QR code detected on page';
      statusEl.appendChild(statusText);
    } else {
      // Update status with icon
      statusEl.innerHTML = '';
      statusEl.style.borderColor = '#FFB4AB';
      const statusIcon = document.createElement('span');
      statusIcon.textContent = '⚠';
      statusIcon.style.cssText = 'font-size: 20px; color: #FFB4AB;';
      statusEl.appendChild(statusIcon);
      const statusText = document.createElement('span');
      statusText.textContent = 'No QR codes found on this page';
      statusEl.appendChild(statusText);
    }
    
  } catch (error) {
    console.error('Page scan error:', error);
    statusEl.innerHTML = '';
    statusEl.style.borderColor = '#FFB4AB';
    const errorIcon = document.createElement('span');
    errorIcon.textContent = '❌';
    errorIcon.style.cssText = 'font-size: 20px; color: #FFB4AB;';
    statusEl.appendChild(errorIcon);
    const errorText = document.createElement('span');
    errorText.textContent = 'Error scanning page: ' + error.message;
    statusEl.appendChild(errorText);
  }
}

})();
