// Webhook Notification System for QR Studio

/**
 * Sends a webhook notification
 * @param {string} webhookUrl - The webhook endpoint URL
 * @param {Object} data - Data to send
 * @returns {Promise<boolean>} - Success status
 */
export async function sendWebhookNotification(webhookUrl, data) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Webhook error:', error);
    return false;
  }
}

/**
 * Sends batch completion notification
 * @param {string} webhookUrl - The webhook endpoint
 * @param {Object} batchInfo - Batch information
 */
export async function notifyBatchComplete(webhookUrl, batchInfo) {
  if (!webhookUrl) return false;
  
  const payload = {
    event: 'batch_complete',
    timestamp: new Date().toISOString(),
    data: {
      totalItems: batchInfo.total,
      successCount: batchInfo.success,
      failureCount: batchInfo.failed,
      duration: batchInfo.duration,
      filename: batchInfo.filename || 'bulk-qr-codes'
    }
  };
  
  return await sendWebhookNotification(webhookUrl, payload);
}

/**
 * Sends progress update notification
 * @param {string} webhookUrl - The webhook endpoint
 * @param {Object} progressInfo - Progress information
 */
export async function notifyProgress(webhookUrl, progressInfo) {
  if (!webhookUrl) return false;
  
  const payload = {
    event: 'progress_update',
    timestamp: new Date().toISOString(),
    data: {
      current: progressInfo.current,
      total: progressInfo.total,
      percentage: progressInfo.percentage,
      estimatedTimeRemaining: progressInfo.estimatedTime
    }
  };
  
  return await sendWebhookNotification(webhookUrl, payload);
}

/**
 * Sends error notification
 * @param {string} webhookUrl - The webhook endpoint
 * @param {Object} errorInfo - Error information
 */
export async function notifyError(webhookUrl, errorInfo) {
  if (!webhookUrl) return false;
  
  const payload = {
    event: 'generation_error',
    timestamp: new Date().toISOString(),
    data: {
      message: errorInfo.message,
      errorCount: errorInfo.count,
      context: errorInfo.context
    }
  };
  
  return await sendWebhookNotification(webhookUrl, payload);
}

/**
 * Validates webhook URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export function isValidWebhookUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Tests webhook connectivity
 * @param {string} webhookUrl - The webhook endpoint
 * @returns {Promise<Object>} - Test result
 */
export async function testWebhook(webhookUrl) {
  const testPayload = {
    event: 'webhook_test',
    timestamp: new Date().toISOString(),
    message: 'QR Studio webhook test'
  };
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    return {
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Webhook is working!' : `Failed with status ${response.status}`
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: error.message || 'Connection failed'
    };
  }
}

/**
 * Stores webhook configuration
 * @param {string} webhookUrl - The webhook endpoint
 */
export function saveWebhookConfig(webhookUrl) {
  chrome.storage.local.set({ webhookUrl });
}

/**
 * Retrieves webhook configuration
 * @returns {Promise<string>} - Webhook URL
 */
export function getWebhookConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['webhookUrl'], (result) => {
      resolve(result.webhookUrl || '');
    });
  });
}

/**
 * Popular webhook service templates
 */
export const WEBHOOK_TEMPLATES = {
  slack: {
    name: 'Slack',
    format: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL',
    transform: (data) => ({
      text: `QR Batch Complete: ${data.data.successCount}/${data.data.totalItems} codes generated in ${data.data.duration}s`
    })
  },
  discord: {
    name: 'Discord',
    format: 'https://discord.com/api/webhooks/YOUR/WEBHOOK',
    transform: (data) => ({
      content: `QR Batch Complete: ${data.data.successCount}/${data.data.totalItems} codes generated`
    })
  },
  teams: {
    name: 'Microsoft Teams',
    format: 'https://outlook.office.com/webhook/YOUR/WEBHOOK',
    transform: (data) => ({
      "@type": "MessageCard",
      "summary": "QR Batch Complete",
      "text": `Generated ${data.data.successCount}/${data.data.totalItems} QR codes`
    })
  }
};
