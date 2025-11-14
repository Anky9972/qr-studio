// Web Worker for barcode/QR code decoding
// Uses ZXing for multi-format support and jsQR as fallback

importScripts('../../lib/zxing.min.js');
importScripts('../../lib/jsQR.min.js');

console.log('ZXing loaded:', typeof ZXing);
console.log('ZXing object:', ZXing);
console.log('Available ZXing properties:', Object.keys(ZXing || {}));
console.log('jsQR loaded:', typeof jsQR);

// Try different ways to access ZXing
let BrowserMultiFormatReader = null;
let BarcodeFormat = null;

if (ZXing) {
  BrowserMultiFormatReader = ZXing.BrowserMultiFormatReader;
  BarcodeFormat = ZXing.BarcodeFormat;
}

console.log('BrowserMultiFormatReader:', BrowserMultiFormatReader);
console.log('BarcodeFormat:', BarcodeFormat);

// Initialize the reader if available
const reader = BrowserMultiFormatReader ? new BrowserMultiFormatReader() : null;

// Supported formats
const formats = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.CODE_128,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.ITF,
  BarcodeFormat.PDF_417,
  BarcodeFormat.AZTEC,
  BarcodeFormat.DATA_MATRIX
];

self.onmessage = async function(e) {
  const { imageData, width, height, scanMode } = e.data;

  try {
    let result = null;

    if (scanMode === 'barcode' || scanMode === 'auto') {
      // ZXing temporarily disabled - API issues
      console.log('ZXing disabled, skipping barcode detection');
    }    if (scanMode === 'qr' || scanMode === 'auto') {
      // Fallback to jsQR for QR codes
      try {
        const code = jsQR(imageData, width, height, {
          inversionAttempts: "attemptBoth",
        });

        if (code) {
          result = {
            text: code.data,
            format: 'QR_CODE',
            type: 'scan',
            source: 'jsqr'
          };

          self.postMessage({
            success: true,
            data: result
          });
          return;
        }
      } catch (jsQRError) {
        console.warn('jsQR decode failed:', jsQRError);
      }
    }

    // No result found
    self.postMessage({
      success: false,
      error: 'No barcode or QR code found'
    });

  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message
    });
  }
};

// Clean up on worker termination
self.onbeforeunload = function() {
  if (reader && reader.reset) {
    reader.reset();
  }
};