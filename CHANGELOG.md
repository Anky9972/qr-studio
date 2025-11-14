# Changelog

All notable changes to QR Studio will be documented in this file.

## [2.0.0] - 2025-11-10

### 🎉 Major Release - Complete Redesign

#### ✨ New Features

**Scanning Enhancements:**
- 📷 Real-time camera scanning with adaptive cadence (battery optimization)
- 🖼️ Multiple input methods: Drag & drop, paste, file browser
- ⏸️ Pause/Resume camera functionality
- 📊 Scan history tray (last 5 scans with quick access)
- 🎯 Context menu integration (right-click images to scan)

**Generation Improvements:**
- 🎨 25+ QR types with Quick Actions templates
- 🖌️ Enhanced color picker with visible borders and hex preview
- 💾 Logo overlay support with size control
- 📱 Collapsible Quick Generate section (shows 1 row by default)
- 🎯 Preset management for favorite configurations

**Bulk Generation:**
- 📦 Advanced bulk generation mode
- 📊 Google Sheets integration
- 📑 Multiple export formats (ZIP, PDF, individual files)
- ✅ Data validation and duplicate detection
- 🔔 Webhook notifications for large batches
- ⏯️ Pause/Resume for long operations
- 👀 Preview mode before full generation

**UI/UX:**
- 🎨 Material Design 3 (MD3) implementation
- 🌓 Beautiful dark/light theme support
- 📱 Fully responsive design (mobile-friendly)
- ⌨️ Complete keyboard navigation support
- ♿ Full accessibility with ARIA labels
- ✨ Smooth animations and transitions

**History & Analytics:**
- 📈 Analytics dashboard with usage statistics
- ⭐ Favorites system
- 🔍 Advanced search and filtering
- 📤 Export history (CSV/JSON)
- 🧹 Configurable auto-cleanup

**Settings:**
- ⚙️ Comprehensive settings panel
- 🔊 Feedback options (sound, vibration, notifications)
- 🎛️ Auto-copy and auto-open URL options
- 📊 Configurable history limits
- 🔄 Reset to defaults option

**Documentation:**
- 📚 Complete README with features, installation, tech stack
- 📖 Comprehensive USER_GUIDE with step-by-step instructions
- 🆘 In-app Help button with beautiful guide viewer
- ⌨️ Keyboard shortcuts documentation

#### 🛠️ Technical Improvements

- ⚡ Vite 5.4.21 build system
- ⚛️ React 18.3.1 with hooks
- 🎨 Material UI 7.3.5
- 🎨 Tailwind CSS 3.4.1
- 🔒 Enhanced security with DOMPurify
- 📦 Optimized bundle sizes
- 🔧 Chrome Extension Manifest V3

#### 🐛 Bug Fixes

- Fixed camera UI responsiveness in extension popup
- Fixed color input overflow issues
- Improved memory management in bulk generation
- Enhanced error handling throughout

#### 🔒 Security

- All processing happens locally
- No external API calls (except user-configured webhooks)
- XSS protection with DOMPurify
- Unsafe URL warnings

---

## [1.0.1] - 2025-11-01

### Fixed
- Initial release bug fixes
- Camera permission handling
- Icon loading issues

## [1.0.0] - 2025-10-15

### Added
- Initial release
- Basic QR scanning and generation
- Simple history tracking
- Dark/light theme

---

## Future Roadmap

### Version 2.1 (Planned)
- [ ] Barcode scanning (UPC, EAN, Code128)
- [ ] Export history to PDF reports
- [ ] QR code animation effects
- [ ] Browser sync (optional)

### Version 2.2 (Planned)
- [ ] Custom QR shapes (rounded corners, dots pattern)
- [ ] Gradient color support
- [ ] SVG export format
- [ ] API for third-party integrations

### Version 3.0 (Future)
- [ ] Cloud sync with encryption
- [ ] Team collaboration features
- [ ] Advanced analytics with charts
- [ ] Custom branding options
