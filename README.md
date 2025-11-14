# 🎯 QR Studio - Professional QR Code Generator & Scanner

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Chrome](https://img.shields.io/badge/Chrome-88%2B-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Manifest](https://img.shields.io/badge/Manifest-V3-yellow.svg)

A powerful, feature-rich Chrome extension for scanning and generating QR codes with advanced bulk generation capabilities, Material Design 3 UI, and comprehensive customization options.

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 📱 **Scanning Capabilities**
- 📷 **Real-time Camera Scanning** - Live QR/barcode detection with adaptive scan cadence
- 🖼️ **Image Scanning** - Drag & drop, paste, or browse image files
- 🌐 **On-Page Scanning** - Detect QR codes embedded in web pages
- ⚡ **Context Menu Integration** - Right-click any image to scan
- ⏸️ **Pause/Resume** - Control scanning to save battery
- 📊 **Scan History Tray** - Quick access to last 5 scans with timestamps

### 🎨 **QR Code Generation**
- 🔤 **25+ QR Types** - URL, WiFi, vCard, Email, SMS, Phone, Location, and more
- 🎯 **Quick Actions** - One-click templates for common QR types
- 🖌️ **Full Customization** - Colors, size (256px-1024px), error correction, logos
- 💾 **Download Formats** - PNG, copy to clipboard, or print
- 📋 **Preset Management** - Save and reuse favorite configurations
- 🎨 **Theme Support** - Beautiful dark/light mode with MD3 design

### 📦 **Advanced Bulk Generation**
- 📄 **CSV/Excel Import** - Generate thousands of QR codes from spreadsheets
- 📊 **Google Sheets Integration** - Direct import from shared sheets
- 🎯 **Smart Column Mapping** - Automatic data field detection
- 📁 **Multiple Export Formats** - ZIP archives, PDF documents, individual files
- 📑 **PDF Templates** - Business cards, labels, badges, standard layouts
- ✅ **Data Validation** - Duplicate detection, URL verification
- 🔔 **Webhook Notifications** - Get notified when large batches complete
- ⏯️ **Pause/Resume** - Full control over long-running generations
- 👀 **Preview Mode** - Test settings before generating full batch
- 🎯 **Custom Filenames** - Use CSV columns in filename patterns

### 📊 **History & Analytics**
- 💾 **Comprehensive History** - Track all scans and generations
- 🔍 **Search & Filter** - Find codes by content, type, or date
- ⭐ **Favorites** - Mark important codes for quick access
- 📈 **Analytics Dashboard** - Usage patterns, statistics, trends
- 📤 **Export** - Save history as CSV or JSON
- 🧹 **Auto-cleanup** - Configurable history limit (5-50 entries)

### ⚙️ **Settings & Configuration**
- 🎛️ **Scanning Settings** - Auto-copy, auto-open URLs, auto-connect WiFi, default scan mode
- 🔊 **Feedback Options** - Sound effects, vibration, notifications, test feedback button
- ⌨️ **Keyboard Shortcuts** - ESC to close, Enter for actions, Tab navigation
- ♿ **Accessibility** - Full ARIA labels, screen reader support
- 🔒 **Privacy First** - All processing happens locally, no cloud sync

---

## 🚀 Installation

### For Users (Recommended)

1. **Download the latest release** from [Chrome Web Store](https://chromewebstore.google.com/detail/pjiipoibmdohooinoolciaamcoeclkln?utm_source=item-share-cb) or [Releases](../../releases)
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"** and select the `dist` folder
5. The QR Studio icon will appear in your toolbar 🎉

### For Developers

```bash
# Clone the repository
git clone https://github.com/yourusername/qr-studio.git
cd qr-studio

# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build
```

The built extension will be in the `dist` folder, ready to load in Chrome.

---

## 🎯 Quick Start

### 🔍 Scan a QR Code

**Method 1: Camera Scanning**
1. Click the QR Studio extension icon
2. Go to the **"Scan"** tab
3. Allow camera permission when prompted
4. Point camera at QR code
5. View decoded data and take action (copy, open URL, etc.)

**Method 2: Image Scanning**
1. Open the **"Scan"** tab
2. Drag & drop an image, paste from clipboard, or click **"Browse Files"**
3. QR code will be detected automatically

**Method 3: On-Page Scanning**
- Right-click any image → **"Scan QR Code"**

### ✨ Generate a Single QR Code

1. Click the extension icon and go to **"Generate"** tab
2. Choose a **Quick Action** (URL, WiFi, vCard) or enter custom text
3. Customize appearance:
   - Adjust size slider (256px - 1024px)
   - Select error correction level (L/M/Q/H)
   - Pick foreground & background colors
   - Optionally add a logo
4. Click **"Generate QR Code"**
5. Download as PNG or copy to clipboard

### 📦 Bulk Generate QR Codes

1. Click **"Bulk"** mode or **"Advanced Bulk Mode"** button
2. **Upload data:**
   - Upload CSV/Excel file, or
   - Import from Google Sheets
3. **Map columns** to QR content
4. **Configure settings:**
   - Choose size, colors, error correction
   - Select export format (ZIP, PDF, or individual files)
   - Customize filename pattern
5. **Optional:** Preview first 5 codes
6. Click **"Generate [N] QR Codes"**
7. Export when complete

**CSV Template Example:**
```csv
name,url,email
John Doe,https://example.com,john@example.com
Jane Smith,https://example.org,jane@example.org
```

---

## 📚 Documentation

- **[User Guide](./USER_GUIDE.md)** - Comprehensive feature documentation
- **[In-App Help](#)** - Click the **Help** button in Settings tab
- **[API Reference](#)** - For developers extending functionality
- **[Troubleshooting](#troubleshooting)** - Common issues and solutions

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework with hooks
- **Material UI 7.3.5** - MD3 components and icons
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Vite 5.4.21** - Lightning-fast build tool

### QR Libraries
- **qrcode 1.5.4** - QR code generation
- **jsQR** - QR code scanning
- **ZXing** - Barcode detection

### Data Processing
- **PapaParse 5.4.1** - CSV parsing
- **XLSX 0.18.5** - Excel file support
- **JSZip 3.10.1** - ZIP archive creation
- **jsPDF 2.5.2** - PDF generation
- **html2canvas 1.4.1** - QR to image conversion

### Utilities
- **DOMPurify 3.2.2** - XSS protection
- **date-fns 4.1.0** - Date formatting

---

## 📁 Project Structure

```
qr-studio/
├── src/
│   ├── components/
│   │   ├── ScanTab.jsx           # Scanning functionality
│   │   ├── GenerateTab.jsx       # Single QR generation
│   │   ├── AdvancedBulkTab.jsx   # Bulk QR generation
│   │   ├── HistoryTab.jsx        # History management
│   │   ├── AnalyticsTab.jsx      # Usage analytics
│   │   └── SettingsTab.jsx       # User preferences
│   ├── utils/
│   │   ├── analytics.js          # Analytics tracking
│   │   ├── googleSheets.js       # Sheets integration
│   │   ├── qrParsers.js          # QR data parsing
│   │   ├── urlSafety.js          # URL validation
│   │   └── webhooks.js           # Webhook notifications
│   ├── workers/
│   │   ├── decoderWorker.js      # QR decoding worker
│   │   └── qrGeneratorWorker.js  # Bulk generation worker
│   ├── App.jsx                   # Main popup app
│   ├── BulkApp.jsx               # Bulk generation app
│   └── main.jsx                  # Entry point
├── background/
│   └── background.js             # Service worker (Manifest V3)
├── content/
│   └── content.js                # Content script for on-page scanning
├── assets/
│   └── icons/                    # Extension icons (16, 32, 48, 128px)
├── dist/                         # Build output
├── manifest.json                 # Extension manifest
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── README.md                     # This file
└── USER_GUIDE.md                 # User documentation
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+1` to `Ctrl+5` | Switch between tabs (Scan/Generate/History/Analytics/Settings) |
| `Escape` | Close dialogs, overlays, or camera |
| `Enter` | Confirm primary action in dialogs |
| `Tab` | Navigate between focusable elements |
| `Space` | Toggle pause/resume scanning |

---

## 🔒 Privacy & Security

- ✅ **Local Processing** - All QR generation and scanning happens in your browser
- ✅ **No Cloud Sync** - Data stored locally using Chrome Storage API
- ✅ **No Tracking** - Zero analytics or telemetry sent to external servers
- ✅ **Secure URLs** - XSS protection and unsafe URL warnings
- ✅ **Optional Webhooks** - User-configured HTTPS-only endpoints
- ✅ **Camera Privacy** - Camera access only when explicitly requested

### Required Permissions
- `activeTab` - Access current tab for scanning
- `contextMenus` - Right-click menu integration
- `storage` - Save history and settings locally
- `downloads` - Download generated QR codes
- `tabs` - Open URLs from scanned codes
- `<all_urls>` - Scan images on any website

---

## 🐛 Troubleshooting

### Camera Not Working
- Check camera permissions in `chrome://settings/content/camera`
- Ensure no other app is using the camera
- Try refreshing the extension popup

### Bulk Generation Slow
- Reduce batch size or enable pause/resume
- Lower QR code size (use 512px instead of 1024px)
- Disable logo overlay for faster generation

### CSV Import Failed
- Ensure CSV has headers in first row
- Check for special characters in data
- Use UTF-8 encoding

### Extension Not Loading
- Check Chrome version (88+ required)
- Rebuild extension: `npm run build`
- Reload extension in `chrome://extensions/`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style (ESLint + Prettier)
- Test thoroughly in Chrome (latest version)
- Update documentation for new features
- Add comments for complex logic

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details.

---

## 🎉 Acknowledgments

Built with ❤️ using:
- [jsQR](https://github.com/cozmo/jsQR) by cozmo
- [qrcode](https://github.com/soldair/node-qrcode) by soldair
- [Material UI](https://mui.com/) for MD3 components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Windows 11 Fluent Design inspiration

---

## 🚀 Roadmap

### Version 2.1 (Coming Soon)
- [ ] Export history to PDF reports
- [ ] Barcode scanning (UPC, EAN, Code128)
- [ ] QR code animation effects
- [ ] Browser sync (optional)

### Version 2.2
- [ ] Custom QR shapes (rounded, dots)
- [ ] Gradient color support
- [ ] SVG export format
- [ ] API for third-party integrations

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the QR Studio Team

[Report Bug](../../issues) • [Request Feature](../../issues) • [Documentation](./USER_GUIDE.md)

</div>



## ✨ Features## Features



### 🎯 Core Features- 🔍 **Multi-Method Scanning**

- **Single QR Generation**: Create individual QR codes with full customization  - Scan QR codes on any webpage

- **Advanced Bulk Generation**: Generate thousands of QR codes from CSV/Excel files  - Real-time camera scanning

- **QR Code Scanner**: Use your camera to scan and decode QR codes  - Context menu integration (right-click images)

- **History Tracking**: Automatic history with search and favorites  - Keyboard shortcuts

- **Analytics Dashboard**: Track usage patterns and statistics

- ✨ **QR Code Generation**

### 🚀 Advanced Bulk Features  - Create custom QR codes from text/URLs

- **Multiple Export Formats**: ZIP archives, PDF documents, or individual files  - Multiple sizes (256px - 1024px)

- **Google Sheets Integration**: Import data directly from Google Sheets  - Adjustable error correction levels

- **Webhook Notifications**: Get notified when large batches complete  - Download or copy to clipboard

- **Column Mapping**: Intelligent data column detection and mapping  - WiFi QR code helper

- **Data Validation**: Comprehensive validation with duplicate detection

- **Preview Mode**: Test settings before generating full batch- 📋 **Smart History**

- **Pause/Resume**: Full control over long-running generations  - Track scanned and generated codes

- **Memory Monitoring**: Real-time performance optimization  - Search and filter entries

- **Custom Filename Patterns**: Use CSV columns in filenames  - Export to CSV/JSON

- **PDF Templates**: Business cards, labels, badges, and standard layouts  - Automatic cleanup (max 100 entries)



### 🎨 Customization- 🎨 **Beautiful Design**

- QR code size (256px - 2048px)  - Windows 11 Fluent Design

- Error correction levels (L, M, Q, H)  - Dark/Light themes

- Custom colors (foreground & background)  - Smooth animations

- Logo overlay with size control  - Responsive UI

- Multiple QR code types (URL, WiFi, vCard, Email, SMS, etc.)

## Installation

## 📦 Installation

### For Development

### For Users

1. Download the latest release1. **Install dependencies:**

2. Open Chrome and go to `chrome://extensions/`   ```bash

3. Enable "Developer mode"   npm install

4. Click "Load unpacked"   ```

5. Select the `dist` folder

2. **Build the extension:**

### For Developers   ```bash

```bash   npm run build

# Clone the repository   ```

git clone <repository-url>

cd qr-studio3. **Load in Chrome:**

   - Open Chrome and go to `chrome://extensions/`

# Install dependencies   - Enable "Developer mode" (top right)

npm install   - Click "Load unpacked"

   - Select the `dist` folder from this project

# Development mode

npm run dev### For Production Build



# Build for production```bash

npm run buildnpm run build

``````



## 🎯 Quick StartThe built extension will be in the `dist` folder, ready for distribution.



### Generate a Single QR Code## Development

1. Click the extension icon

2. Enter text or URL### Start development mode:

3. Customize colors and size```bash

4. Click "Generate QR Code"npm run dev

5. Download or copy to clipboard```



### Generate Bulk QR Codes### Project Structure

1. Click "Bulk" mode or "Open in New Tab"

2. Upload CSV/Excel file or import from Google Sheets```

3. Configure settings (size, colors, export format)extension/

4. Preview first 5 codes (optional)├── src/

5. Click "Generate" and wait for completion│   ├── components/

6. Export as ZIP or PDF│   │   ├── ScanTab.jsx       # QR scanning functionality

│   │   ├── GenerateTab.jsx   # QR generation functionality

### Scan a QR Code│   │   └── HistoryTab.jsx    # History management

1. Click the "Scan" tab│   ├── App.jsx               # Main app component

2. Allow camera permission│   ├── main.jsx              # Entry point

3. Point camera at QR code│   └── index.css             # Global styles

4. View decoded data and take action├── background/

│   └── background.js         # Service worker

**For detailed instructions, see [USER_GUIDE.md](./USER_GUIDE.md)**├── content/

│   └── content.js           # Content script

## 🛠️ Tech Stack├── assets/

│   └── icons/               # Extension icons

- **React 18** - UI framework├── manifest.json            # Extension manifest

- **Vite 5** - Build tool├── popup.html              # Popup HTML

- **Tailwind CSS 3** - Styling with Material Design 3├── package.json

- **Material UI Icons** - Icon system├── vite.config.js

- **QRCode.js** - QR generation└── tailwind.config.js

- **jsQR** - QR scanning```

- **JSZip** - ZIP creation

- **jsPDF** - PDF generation## Keyboard Shortcuts

- **PapaParse** - CSV parsing

- **XLSX** - Excel support- `Ctrl+Shift+Q` - Scan current page

- `Ctrl+Shift+C` - Open camera scanner

## 📁 Project Structure- `Ctrl+Shift+G` - Focus generate tab

- `Escape` - Close camera/popup

```

qr-studio/## Creating Icons

├── src/

│   ├── components/          # React componentsYou need to create icons in the following sizes:

│   ├── utils/               # Utilities (analytics, webhooks, sheets)- 16x16px (icon16.png)

│   ├── workers/             # Web workers- 32x32px (icon32.png)

│   ├── App.jsx              # Main popup- 48x48px (icon48.png)

│   └── BulkApp.jsx          # Bulk generator- 128x128px (icon128.png)

├── background/              # Background script

├── content/                 # Content scriptsPlace them in the `assets/icons/` folder.

├── dist/                    # Build output

├── manifest.json            # Extension manifestYou can use online tools like:

├── package.json             # Dependencies- [Favicon Generator](https://www.favicon-generator.org/)

├── README.md                # This file- [Icon Converter](https://converticon.com/)

└── USER_GUIDE.md            # User documentation

```Or create them manually with design tools like Figma, Canva, or Photoshop.



## 🚀 Development### Quick Icon Generation (Placeholder)



```bashFor quick testing, you can create simple placeholder icons:

# Development with hot reload

npm run dev```bash

# Install sharp for image processing

# Production buildnpm install sharp --save-dev

npm run build

# Run the icon generation script (create this script separately)

# Preview buildnode scripts/generate-icons.js

npm run preview```

```

## Technologies Used

## 🔒 Privacy & Security

- **React 18** - UI framework

- All processing happens locally in your browser- **Vite** - Build tool

- No data sent to external servers (except user-configured webhooks)- **Tailwind CSS** - Styling

- Chrome storage used only for preferences- **jsQR** - QR code decoding

- Secure HTTPS-only webhooks- **qrcode** - QR code generation

- **Chrome Extension Manifest V3**

## 📚 Documentation

## Browser Compatibility

See [USER_GUIDE.md](./USER_GUIDE.md) for comprehensive documentation including:

- Feature guides- Chrome 88+

- Bulk generation tutorials- Edge 88+

- CSV template examples- Opera 74+

- Troubleshooting tips- Brave (Chromium-based)

- FAQ

## Privacy

## 🤝 Contributing

- All QR code processing happens locally

1. Fork the repository- No external API calls

2. Create a feature branch- No tracking or analytics

3. Test thoroughly- Camera access only when explicitly requested

4. Submit a pull request- History stored locally only (no cloud sync)



## 📝 License## Permissions



MIT LicenseThe extension requires the following permissions:



## 🎉 Version- `activeTab` - Access current tab for scanning

- `contextMenus` - Right-click menu integration

**Version**: 2.0.0  - `storage` - Save history and settings

**Release**: November 10, 2025  - `downloads` - Download generated QR codes

**Manifest**: V3  - `tabs` - Tab management for opening URLs

**Min Chrome**: 88+- `<all_urls>` - Scan images on any website



---## Contributing



**Made with ❤️ using React, Vite, and Material Design 3**Contributions are welcome! Please feel free to submit a Pull Request.


## License

MIT License - See LICENSE file for details

## Roadmap

### V1.1
- Batch QR generation from CSV
- Custom QR code colors/logos
- Barcode support (UPC, EAN, Code128)

### V1.2
- vCard QR code support
- SMS/Email QR codes
- Calendar event QR codes

### V1.3
- Cloud sync (optional)
- Analytics dashboard
- API for developers

## Support

For issues and feature requests, please use the GitHub Issues page.

## Credits

Built with ❤️ using:
- [jsQR](https://github.com/cozmo/jsQR) by cozmo
- [qrcode](https://github.com/soldair/node-qrcode) by soldair
- Windows 11 Fluent Design inspiration

---

**Happy QR coding! 🚀**
