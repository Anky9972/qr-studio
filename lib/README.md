# Library Files

## jsQR.min.js
This is the actual jsQR library copied from `node_modules/jsqr/dist/jsQR.js`.

**Source**: https://www.npmjs.com/package/jsqr
**Version**: From npm package dependency

This library is used for:
- Content script page scanning (injected into web pages)
- Popup camera scanning (imported as module)

**Note**: If you need to update this library:
```bash
npm install jsqr@latest
Copy-Item "node_modules\jsqr\dist\jsQR.js" -Destination "lib\jsQR.min.js" -Force
npm run build
```

## qrcode.min.js
QR code generation library for creating QR codes in the Generate tab.

**Source**: https://www.npmjs.com/package/qrcode
