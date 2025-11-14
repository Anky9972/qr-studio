// Background service worker for Chrome Extension

// Create context menus on startup
function createContextMenus() {
  try {
    // Remove existing menus first to avoid duplicates
    chrome.contextMenus.removeAll(() => {
      // Create context menus
      chrome.contextMenus.create({
        id: 'scan-qr-image',
        title: 'Scan QR Code',
        contexts: ['image'],
      });

      chrome.contextMenus.create({
        id: 'generate-qr-text',
        title: 'Generate QR Code',
        contexts: ['selection'],
      });

      console.log('Context menus created');
    });
  } catch (error) {
    console.error('Error creating context menus:', error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('QR Studio extension installed');
  createContextMenus();
});

// Also create menus on startup (Manifest V3 service workers may not persist)
chrome.runtime.onStartup.addListener(() => {
  console.log('QR Studio extension started');
  createContextMenus();
});

// Create menus immediately when script loads
createContextMenus();

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('Context menu clicked:', info.menuItemId, 'srcUrl:', info.srcUrl, 'tab:', tab?.id);

  if (info.menuItemId === 'scan-qr-image') {
    try {
      // Validate the image URL
      if (!info.srcUrl) {
        console.error('No srcUrl provided for image scan');
        return;
      }

      console.log('Scanning image with overlay:', info.srcUrl);

      // Send message to content script to scan the image and show result in overlay
      chrome.tabs.sendMessage(tab.id, {
        action: 'scanImage',
        imageUrl: info.srcUrl
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending scan message:', chrome.runtime.lastError);
          // Fallback: Open in new tab if content script not available
          const cameraUrl = chrome.runtime.getURL('camera.html') + '?scan=' + encodeURIComponent(info.srcUrl);
          chrome.tabs.create({ url: cameraUrl });
        } else if (response && response.result) {
          console.log('QR Code scanned successfully via overlay');
        } else {
          console.log('No QR code found in image');
        }
      });

    } catch (err) {
      console.error('Error initiating image scan:', err);
      // Show notification as fallback
      try {
        await chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('assets/icons/icon128.png'),
          title: 'QR Code Scanner',
          message: 'Failed to scan image: ' + err.message
        });
      } catch (notifError) {
        console.error('Failed to show notification:', notifError);
      }
    }
  } else if (info.menuItemId === 'generate-qr-text') {
    try {
      // Store selected text and open popup
      console.log('Storing pending generate:', info.selectionText);
      await chrome.storage.local.set({ pendingGenerate: info.selectionText });

      try {
        await chrome.action.openPopup();
        console.log('Popup opened for generation');
      } catch (popupError) {
        console.error('Failed to open popup for generation:', popupError);
      }
    } catch (err) {
      console.error('Error initiating text generation:', err);
    }
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'scan-page') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      try {
        // Ensure content script is injected
        await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content/content.js']
        }).catch(() => {}); // Ignore if already injected

        chrome.tabs.sendMessage(tabs[0].id, { action: 'scanPage' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Could not scan page:', chrome.runtime.lastError.message);
          }
        });
      } catch (err) {
        console.error('Error scanning page:', err);
      }
    }
  } else if (command === 'open-camera' || command === 'focus-generate') {
    chrome.action.openPopup();
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl') {
    chrome.tabs.create({ url: request.url })
      .then(() => sendResponse({ success: true }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep message channel open for async response
  } else if (request.action === 'notify') {
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('assets/icons/icon128.svg'),
      title: request.title || 'QR Studio',
      message: request.message,
    }).then(() => {
      sendResponse({ success: true });
    }).catch(err => {
      console.log('Notification error:', err);
      sendResponse({ success: false });
    });
    return true; // Keep message channel open for async response
  } else if (request.action === 'captureVisibleTab') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' })
      .then(screenshot => sendResponse(screenshot))
      .catch(err => {
        console.error('Screenshot error:', err);
        sendResponse(null);
      });
    return true; // Keep message channel open for async response
  }

  return false;
});

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    // Content script should be auto-injected via manifest
    // This is just a fallback
  }
});
