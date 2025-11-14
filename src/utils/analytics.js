// Analytics tracking utility

export const trackAnalytics = (event, data = {}) => {
  console.log('Analytics event:', event, data);

  // Update analytics in storage
  chrome.storage.local.get(['analytics'], (result) => {
    const analytics = result.analytics || {
      scans: 0,
      generations: 0,
      sessions: [],
      firstUse: Date.now(),
      lastUse: Date.now(),
      events: []
    };

    // Update counters based on event type
    if (event === 'scan' || event === 'qr_scanned' || event === 'barcode_scanned') {
      analytics.scans = (analytics.scans || 0) + 1;
    } else if (event === 'generate' || event === 'qr_generated') {
      analytics.generations = (analytics.generations || 0) + 1;
    }

    // Update last use time
    analytics.lastUse = Date.now();

    // Store event (keep last 100 events)
    if (!analytics.events) {
      analytics.events = [];
    }
    analytics.events.unshift({
      type: event,
      data: data,
      timestamp: Date.now()
    });
    analytics.events = analytics.events.slice(0, 100);

    // Save updated analytics
    chrome.storage.local.set({ analytics }, () => {
      console.log('Analytics updated:', analytics);
    });
  });
};