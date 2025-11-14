// Camera scanner page script
// Note: jsQR is loaded from lib/jsQR.min.js via script tag in HTML

let stream = null;
let animationFrameId = null;
let lastResult = null;
let isScanning = false;
let lastScanTime = 0;
const SCAN_INTERVAL = 100; // Scan every 100ms instead of every frame

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const status = document.getElementById('status');
const resultDiv = document.getElementById('result');
const closeBtn = document.getElementById('close-btn');

// Close button handler
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    window.close();
  });
}

// Function to scan image from URL (for context menu)
async function scanImageFromUrl(imageUrl) {
  try {
    console.log('Scanning image from URL:', imageUrl);

    // Show loading
    loading.style.display = 'block';
    video.style.display = 'none';
    canvas.style.display = 'none';
    errorContainer.style.display = 'none';
    status.textContent = 'Loading image...';

    // Check if jsQR is available
    if (typeof jsQR === 'undefined') {
      throw new Error('QR scanner library not loaded. Please reload the page.');
    }

    // Fetch the image
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.status}`);
    }

    const blob = await response.blob();

    if (!blob.type.startsWith('image/')) {
      throw new Error('URL does not point to a valid image');
    }

    // Create image element
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = objectUrl;
    });

    // Setup canvas for scanning
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Hide loading, show canvas
    loading.style.display = 'none';
    canvas.style.display = 'block';

    status.textContent = 'Scanning for QR codes...';

    // Scan the image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: "attemptBoth",
    });

    if (code) {
      console.log('QR code found:', code.data);
      status.textContent = '✓ QR Code Found!';
      status.style.color = '#10b981';
      resultDiv.textContent = code.data;
      resultDiv.style.display = 'block';
      resultDiv.style.background = 'rgba(16, 185, 129, 0.1)';
      resultDiv.style.border = '2px solid #10b981';
      resultDiv.style.padding = '12px';
      resultDiv.style.borderRadius = '8px';
      resultDiv.style.marginTop = '12px';
      resultDiv.style.wordBreak = 'break-all';

      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(code.data);
        const copyNotice = document.createElement('div');
        copyNotice.textContent = '✓ Copied to clipboard';
        copyNotice.style.cssText = 'margin-top: 8px; color: #10b981; font-size: 14px;';
        resultDiv.appendChild(copyNotice);
      } catch (clipboardError) {
        console.warn('Could not copy to clipboard:', clipboardError);
      }

      // Try to open URL if it's a valid URL
      if (code.data.match(/^https?:\/\//)) {
        const openNotice = document.createElement('div');
        openNotice.textContent = '🔗 Opening link in 2 seconds...';
        openNotice.style.cssText = 'margin-top: 8px; color: #3b82f6; font-size: 14px;';
        resultDiv.appendChild(openNotice);
        
        setTimeout(() => {
          window.open(code.data, '_blank');
        }, 2000);
      }
    } else {
      status.textContent = '✗ No QR code found in this image';
      status.style.color = '#ef4444';
      resultDiv.style.display = 'none';
      
      // Show helpful message
      const helpDiv = document.createElement('div');
      helpDiv.textContent = 'Try scanning an image that contains a clear QR code.';
      helpDiv.style.cssText = 'margin-top: 12px; padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; color: #ef4444; font-size: 14px;';
      errorContainer.style.display = 'block';
      errorContainer.innerHTML = '';
      errorContainer.appendChild(helpDiv);
    }

    // Clean up
    URL.revokeObjectURL(objectUrl);

  } catch (error) {
    console.error('Error scanning image:', error);
    loading.style.display = 'none';
    canvas.style.display = 'none';
    status.textContent = '✗ Error scanning image';
    status.style.color = '#ef4444';
    resultDiv.style.display = 'none';
    
    // Show error details
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="margin-top: 12px; padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px;">
        <div style="color: #ef4444; font-weight: 600; margin-bottom: 8px;">Error Details:</div>
        <div style="color: #ef4444; font-size: 14px;">${error.message}</div>
        <div style="color: #9ca3af; font-size: 12px; margin-top: 8px;">Please try again or use a different image.</div>
      </div>
    `;
    errorContainer.style.display = 'block';
    errorContainer.innerHTML = '';
    errorContainer.appendChild(errorDiv);
  }
}

// Start camera on page load
window.addEventListener('load', async () => {
  // Check if we have a scan parameter (from context menu)
  const urlParams = new URLSearchParams(window.location.search);
  const scanUrl = urlParams.get('scan');

  if (scanUrl) {
    console.log('Scan URL provided:', scanUrl);
    // Switch to image scanning mode instead of camera
    await scanImageFromUrl(scanUrl);
    return;
  }

  try {
    console.log('Initializing camera...');
    // Request camera permission
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        aspectRatio: { ideal: 16/9 },
        frameRate: { ideal: 30, max: 30 }
      }
    });

    console.log('Camera stream obtained');
    // Setup video
    video.srcObject = stream;
    
    // Wait for video to be ready
    video.onloadedmetadata = () => {
      video.play().then(() => {
        console.log('Video playing');
        // Hide loading, show video
        loading.style.display = 'none';
        video.style.display = 'block';
        status.style.display = 'block';

        // Start scanning after a short delay to ensure video is rendering
        setTimeout(() => {
          console.log('Starting QR scan');
          scanQRCode();
        }, 500);
      }).catch(err => {
        console.error('Play error:', err);
        showError(err);
      });
    };
  } catch (err) {
    console.error('Camera error:', err);
    showError(err);
  }
});

// Cleanup on page close
window.addEventListener('beforeunload', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  isScanning = false;
});

function showError(err) {
  loading.style.display = 'none';
  errorContainer.style.display = 'block';

  let errorMessage = 'Camera access failed. ';
  
  if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
    errorMessage += 'Please allow camera access when prompted. Click the camera icon in the address bar to grant permission.';
  } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
    errorMessage += 'No camera found on your device.';
  } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
    errorMessage += 'Camera is already in use by another application.';
  } else if (err.name === 'OverconstrainedError') {
    errorMessage += 'Camera does not support the requested settings.';
  } else {
    errorMessage += err.message || 'Unknown error occurred.';
  }

  errorContainer.innerHTML = `<div class="error">${errorMessage}</div>`;
}

function scanQRCode() {
  if (!window.jsQR) {
    console.error('jsQR not loaded');
    showError(new Error('QR scanner library not loaded. Please refresh the page.'));
    return;
  }

  isScanning = true;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let lastDetectedCode = null;

  function tick() {
    if (!isScanning) {
      return; // Stop scanning if flag is false
    }

    const currentTime = Date.now();
    
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
              
              // Get image data for QR scanning
              const imageData = ctx.getImageData(0, 0, width, height);
              
              // Scan for QR code with improved options
              const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "attemptBoth",
                greyScaleWeights: {
                  red: 0.2126,
                  green: 0.7152,
                  blue: 0.0722,
                  useIntegerApproximation: true
                }
              });

              if (code && code.data) {
                console.log('🎯 QR Code found:', code.data);
                
                // Only update if it's different from last
                if (code.data !== lastDetectedCode) {
                  lastDetectedCode = code.data;
                  lastResult = code.data;
                  handleQRCode(code.data);
                  
                  // Update status
                  status.textContent = '✅ QR Code detected!';
                  status.className = 'status success';
                  
                  console.log('✅ QR Code processed');
                }
              } else {
                // Reset status periodically if no code found
                if (Math.floor(currentTime / 2000) % 2 === 0) {
                  status.textContent = 'Point camera at QR code';
                  status.className = 'status';
                  lastDetectedCode = null;
                }
              }
            } catch (scanError) {
              console.error('QR scan error:', scanError);
            }
          }
        }
      }
    } catch (err) {
      console.error('Video processing error:', err);
    }

    // Continue scanning using requestAnimationFrame for smoother performance
    animationFrameId = requestAnimationFrame(tick);
  }

  console.log('🎥 Starting camera scanner...');
  tick();
}

function handleQRCode(data) {
  // Save to history
  chrome.storage.local.get(['history'], (result) => {
    const history = result.history || [];
    const entry = {
      type: 'scan',
      data: data,
      timestamp: Date.now(),
      source: 'camera'
    };
    history.unshift(entry);
    const limitedHistory = history.slice(0, 100);
    chrome.storage.local.set({ history: limitedHistory });
  });

  // Show result
  displayResult(data);

  // Play success sound (optional)
  const audio = new Audio();
  audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=';
  audio.play().catch(() => {});
}

function displayResult(data) {
  const isURL = data.startsWith('http://') || data.startsWith('https://');
  const isWiFi = data.startsWith('WIFI:');

  resultDiv.innerHTML = `
    <div class="result-data">${escapeHtml(data)}</div>
    <div class="result-actions">
      ${isURL ? '<button data-action="openURL">🔗 Open Link</button>' : ''}
      ${isWiFi ? '<button data-action="showWiFi">📡 View WiFi</button>' : ''}
      <button data-action="copyText">📋 Copy</button>
      <button data-action="closeResult">✕ Close</button>
    </div>
  `;
  resultDiv.style.display = 'block';

  // Store current result for actions
  window.currentResult = data;
  
  // Add event listeners to buttons
  const buttons = resultDiv.querySelectorAll('button[data-action]');
  buttons.forEach(button => {
    button.addEventListener('click', handleResultAction);
  });
}

function handleResultAction(event) {
  const action = event.currentTarget.getAttribute('data-action');
  
  switch(action) {
    case 'openURL':
      chrome.tabs.create({ url: window.currentResult });
      window.close();
      break;
      
    case 'showWiFi':
      const data = window.currentResult;
      const ssid = data.match(/S:([^;]+)/)?.[1];
      const password = data.match(/P:([^;]+)/)?.[1];
      const security = data.match(/T:([^;]+)/)?.[1];
      alert(`WiFi Network:\nSSID: ${ssid}\nPassword: ${password}\nSecurity: ${security}`);
      break;
      
    case 'copyText':
      navigator.clipboard.writeText(window.currentResult)
        .then(() => {
          const btn = event.currentTarget;
          const originalText = btn.textContent;
          btn.textContent = '✓ Copied!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        })
        .catch(() => {
          alert('Failed to copy to clipboard');
        });
      break;
      
    case 'closeResult':
      resultDiv.style.display = 'none';
      lastResult = null; // Allow scanning the same code again
      break;
  }
}

// Legacy functions (keeping for backward compatibility, but not used with new approach)
window.openURL = () => {
  chrome.tabs.create({ url: window.currentResult });
  window.close();
};

window.showWiFi = () => {
  const data = window.currentResult;
  const ssid = data.match(/S:([^;]+)/)?.[1];
  const password = data.match(/P:([^;]+)/)?.[1];
  const security = data.match(/T:([^;]+)/)?.[1];
  
  alert(`WiFi Network:\nSSID: ${ssid}\nPassword: ${password}\nSecurity: ${security}`);
};

window.copyText = async () => {
  try {
    await navigator.clipboard.writeText(window.currentResult);
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  } catch (err) {
    alert('Failed to copy to clipboard');
  }
};

window.closeResult = () => {
  resultDiv.style.display = 'none';
  lastResult = null; // Allow scanning the same code again
};

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
