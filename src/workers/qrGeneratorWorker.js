// QR Code Generation Web Worker
// This worker handles QR code generation in a separate thread to avoid blocking the UI

import QRCode from 'qrcode';

self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'generate':
      await generateQRCode(data);
      break;
    case 'generateBatch':
      await generateBatchQRCodes(data);
      break;
    default:
      self.postMessage({ type: 'error', error: 'Unknown command' });
  }
});

async function generateQRCode(config) {
  try {
    const { text, options, index } = config;

    // Generate QR code to data URL
    const dataURL = await QRCode.toDataURL(text, options);

    self.postMessage({
      type: 'complete',
      data: {
        index,
        text,
        dataURL,
        success: true
      }
    });
  } catch (error) {
    self.postMessage({
      type: 'error',
      data: {
        index: config.index,
        text: config.text,
        error: error.message,
        success: false
      }
    });
  }
}

async function generateBatchQRCodes(config) {
  const { items, options, chunkSize = 10 } = config;
  let processed = 0;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    const results = await Promise.all(
      chunk.map(async (item, chunkIndex) => {
        try {
          const dataURL = await QRCode.toDataURL(item.text, options);
          return {
            index: i + chunkIndex,
            text: item.text,
            dataURL,
            success: true,
            ...item
          };
        } catch (error) {
          return {
            index: i + chunkIndex,
            text: item.text,
            error: error.message,
            success: false,
            ...item
          };
        }
      })
    );

    processed += chunk.length;

    // Send progress update
    self.postMessage({
      type: 'progress',
      data: {
        results,
        processed,
        total: items.length,
        percentage: Math.round((processed / items.length) * 100)
      }
    });

    // Small delay to prevent blocking
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  self.postMessage({
    type: 'batchComplete',
    data: {
      total: items.length,
      processed
    }
  });
}
