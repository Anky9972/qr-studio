# 🎯 QR Studio - Complete User Guide

Welcome to **QR Studio**! This comprehensive guide will help you master all features of your professional QR code scanning and generation tool.

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [QR Code Scanning](#qr-code-scanning)
3. [QR Code Generation](#qr-code-generation)
4. [Bulk Generation](#bulk-generation)
5. [History Management](#history-management)
6. [Analytics Dashboard](#analytics-dashboard)
7. [Settings & Customization](#settings--customization)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Troubleshooting](#troubleshooting)
10. [Tips & Best Practices](#tips--best-practices)
11. [FAQ](#faq)

---

## Getting Started

### Installation

1. **Download & Install**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top-right corner)
   - Click **"Load unpacked"** and select the extension's `dist` folder
   - The QR Studio icon will appear in your Chrome toolbar

2. **Grant Permissions**
   - **Camera Access**: Required for live QR scanning
   - **Storage**: Saves your scan history and preferences locally
   - **Downloads**: Enables QR code downloads
   - All processing happens locally - your data never leaves your device!

3. **First Launch**
   - Click the QR Studio icon in your toolbar
   - You'll see 5 tabs: **Scan**, **Generate**, **History**, **Analytics**, **Settings**
   - Start by exploring the **Scan** tab for your first QR code scan

### Interface Overview

```
┌─────────────────────────────────┐
│  [Scan] [Generate] [History]    │  ← Navigation Tabs
│  [Analytics] [Settings]          │
├─────────────────────────────────┤
│                                  │
│     Main Content Area            │  ← Tab-specific content
│     (Camera, Generator, etc.)    │
│                                  │
└─────────────────────────────────┘
```

---

## QR Code Scanning

### Method 1: Real-Time Camera Scanning

1. **Start Scanning**
   - Click the **Scan** tab
   - Click **"Start Camera"** button
   - Allow camera permission when prompted
   - Point your camera at a QR code

2. **Features**
   - ⚡ **Auto-Detection**: Automatically detects and decodes QR codes
   - ⏸️ **Pause/Resume**: Click pause button to save battery
   - 📊 **Scan History Tray**: Shows last 5 scans at bottom-right
   - 🎯 **Adaptive Scan Cadence**: Automatically adjusts scan speed to save battery

3. **After Scanning**
   - View decoded content in the result area
   - **Copy** to clipboard (or auto-copy if enabled in Settings)
   - **Open URL** if it's a link
   - **Save to History** automatically

### Method 2: Image File Scanning

**Drag & Drop:**
1. Open **Scan** tab
2. Drag an image file from your computer
3. Drop it into the designated drop zone
4. QR code will be detected instantly

**Paste from Clipboard:**
1. Copy an image to clipboard (right-click → Copy Image)
2. Click into the drop zone
3. Press `Ctrl+V` (Windows) or `Cmd+V` (Mac)
4. QR code will be detected automatically

**Browse Files:**
1. Click the **"Browse Files"** button
2. Select an image file (PNG, JPG, GIF, WebP)
3. QR code will be detected instantly

### Method 3: On-Page Scanning

**Context Menu:**
1. Right-click any image on a webpage
2. Select **"Scan QR Code"** from context menu
3. Results appear in a notification

**Automatic Page Scan:**
- Press `Ctrl+Shift+Q` to scan all QR codes on current page
- Results show in overlay with bounding boxes

### Scan Modes

- **Auto** (Default): Detects both QR codes and barcodes
- **QR Only**: Faster, focuses on QR codes only
- **Barcode Only**: Detects UPC, EAN, Code128, etc.

**Change Mode:** Settings → Scanning → Default scan mode

---

## QR Code Generation

### Single QR Generation

#### Quick Actions (One-Click Templates)

Click any Quick Action button for instant QR generation:

1. **URL** - Website links
2. **WiFi** - Network credentials
3. **vCard** - Digital business card
4. **Email** - Pre-filled email
5. **SMS** - Text message
6. **Phone** - Dial number
7. **Location** - GPS coordinates
8. **WhatsApp** - Chat link
9. **Calendar** - Event details
10. **Instagram** - Profile link
11. **Facebook** - Page link
12. **Twitter** - Profile link
13. **YouTube** - Video link
14. **LinkedIn** - Profile link

**Toggle Visibility:** Click "Show All" / "Show Less" to expand/collapse

#### Custom QR Generation

1. **Enter Content**
   - Type or paste text, URL, or data into the text field
   - Supports up to several thousand characters
   - Special characters are automatically encoded

2. **Customize Appearance**

   **Size:**
   - Drag slider from 256px to 1024px
   - 256px: Small, for web thumbnails
   - 512px: Standard, good for web display
   - 768px: Large, good for printing
   - 1024px: Extra large, high-quality prints

   **Error Correction:**
   - **Low (7%)**: Smallest QR, minimal damage recovery
   - **Medium (15%)**: Balanced size and reliability (recommended)
   - **Quartile (25%)**: Good reliability, slightly larger
   - **High (30%)**: Maximum reliability, largest size

   **Colors:**
   - **Foreground**: QR code pattern color (default: black)
   - **Background**: Canvas color (default: white)
   - Click color swatch or enter hex code manually
   - Ensure good contrast for reliable scanning

   **Logo Overlay (Optional):**
   - Click "Choose File" to upload logo (PNG, JPG, SVG)
   - Adjust logo size with slider (10% - 30% of QR size)
   - Positioned at center of QR code
   - **Note**: Higher error correction recommended with logos

3. **Generate & Download**
   - Click **"Generate QR Code"**
   - QR code appears with live preview
   - Click **"Download PNG"** to save
   - Or **"Copy to Clipboard"** for quick sharing

#### QR Code Types

**URL / Link:**
```
https://example.com
```

**WiFi Network:**
```
WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
```

**vCard (Contact):**
```
BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+1234567890
EMAIL:john@example.com
END:VCARD
```

**Email:**
```
mailto:john@example.com?subject=Hello&body=Message
```

**SMS:**
```
smsto:+1234567890:Hello World
```

**Phone:**
```
tel:+1234567890
```

**Location:**
```
geo:37.7749,-122.4194
```

---

## Bulk Generation

### Overview

Generate thousands of QR codes at once from CSV/Excel files or Google Sheets.

### Step 1: Prepare Data

**CSV Format:**
```csv
name,url,email,phone
John Doe,https://example.com/john,john@example.com,+1234567890
Jane Smith,https://example.com/jane,jane@example.com,+0987654321
```

**Requirements:**
- First row must contain column headers
- Use UTF-8 encoding
- Commas separate columns
- Quotes for values containing commas

**Excel Format:**
- XLSX or XLS files supported
- First sheet is used
- First row must contain headers

### Step 2: Import Data

**Method A: Upload File**
1. Click **"Advanced Bulk Mode"** button
2. Click **"Choose File"** or drag & drop CSV/Excel file
3. File is parsed automatically

**Method B: Google Sheets**
1. Click **"Import from Google Sheets"**
2. Paste your Google Sheets URL
3. Ensure sheet is set to "Anyone with link can view"
4. Click **"Import"**

### Step 3: Column Mapping

1. **Primary Content Column**
   - Select which column contains QR data
   - Auto-detected for common patterns (URL, Email, etc.)

2. **Optional: Filename Column**
   - Select column for custom filenames
   - If blank, uses row numbers

3. **Preview**
   - First 5 rows shown for verification
   - Check data is mapped correctly

### Step 4: Configure Settings
   - **Error Correction**: Choose from dropdown
     - L (7%): Fastest, smallest files
     - M (15%): Standard, recommended
     - Q (25%): Good with minor damage
     - H (30%): Best for logos or printing
   
   - **Colors**: Click color pickers
     - Foreground: The QR code pattern
     - Background: Behind the pattern
     - Ensure good contrast for scanning

3. **Add a Logo (Optional)**
   - Click "Choose File" under Logo section
   - Upload PNG, JPG, or SVG (under 2MB)
   - Adjust logo size slider (10-30% recommended)
   - Logo will have white background for scannability

4. **Generate & Download**
   - Click "Generate QR Code"
   - Preview appears below
   - Click "Download" to save as PNG
   - Or click "Copy" to copy to clipboard

### Quick Generate Options

Use preset buttons for common QR types:

- **URL**: Enter web address (auto-validates)
- **WiFi**: Network name, password, security type
- **vCard**: Contact information (name, phone, email, company)
- **SMS**: Phone number and message
- **Email**: Address, subject, body
- **Location**: GPS coordinates (latitude/longitude)

---

## Bulk QR Generation

Perfect for generating hundreds or thousands of QR codes at once.

### Opening Bulk Generator

**Option 1**: Click "Bulk" toggle in the popup  
**Option 2**: Click "Open Bulk Generator in New Tab" for better experience

### Step 1: Upload Data

#### CSV/Excel Upload

1. Click "Upload" tab
2. Click "Choose File" or drag & drop
3. Supported formats: CSV (.csv), Excel (.xlsx, .xls)
4. Max file size: 10MB
5. Max items: 2,000 per batch

**CSV Format Requirements:**
```csv
text,name,description
https://example.com,Example Site,My website
https://google.com,Google,Search engine
tel:+1234567890,Support Line,Call us
```

Your CSV must have at least one of these columns:
- `text`, `data`, or `content` (main QR data)
- Any other columns can be used for labels/filenames

#### Download CSV Templates

Click template buttons to download pre-formatted examples:
- **Simple**: Just URLs or text
- **URL with Labels**: URLs with names and descriptions
- **vCard**: Contact information template
- **WiFi**: Network credentials template

#### Import from Google Sheets

1. Make your Google Sheet publicly accessible:
   - Open your sheet
   - Click "Share" → "Change to anyone with the link"
   - Set permission to "Viewer"
   - Copy the link

2. In QR Studio:
   - Paste the Google Sheets URL
   - Click "Import"
   - Data loads directly (no download needed)

### Step 2: Review & Validate

After uploading, you'll see a validation summary:

- **Total Rows**: Number of entries
- **Valid**: Entries that can generate QR codes
- **Invalid**: Empty or problematic entries
- **Duplicates**: Repeated values

**Invalid Rows** are listed with reasons (e.g., "Row 23: Empty value")  
**Duplicate Values** show which rows contain the same data

**Action**: Fix issues in your source file and re-upload, or proceed anyway (invalid rows will be skipped)

### Step 3: Configure Settings

#### Column Mapping

**QR Data Column**: Select which column contains QR code data
- Auto-detects common names (text, data, url)
- Can manually select any column

**Label Column**: Optional text to display with QR codes
- Useful for PDF exports
- Shows under QR code in results

**Filename Pattern**: Customize how files are named
- Use `{index}` for numbering: `qr-{index}` → `qr-1.png`, `qr-2.png`
- Use column names: `{name}-qr` → `john-qr.png`, `jane-qr.png`
- Combine multiple: `{company}_{department}_{id}` → `acme_sales_123.png`

#### QR Appearance

Same options as single generation:
- Size (256px - 2048px)
- Error correction (L/M/Q/H)
- Colors (foreground/background)
- Logo upload (applies to all codes)

#### Export Settings

**Export Format**:
1. **ZIP Archive** (Recommended for 50+ codes)
   - All QR codes packaged in one file
   - Batch size: Split into multiple ZIPs if needed (100-2000 per file)
   - Easy to extract and organize

2. **PDF Document** (Best for printing)
   - Multiple QR codes per page
   - Print-ready layout
   - See PDF Layout settings below

3. **Individual Files** (For small batches)
   - Downloads each QR code separately
   - Good for 1-50 codes only

**PDF Layout Settings** (when PDF selected):

- **Template**: Quick presets
  - Standard: 4×3 grid (12 per page)
  - Business Card: 2×2 grid (4 per page, large codes)
  - Label: 5×4 grid (20 per page, dense)
  - Badge: 3×2 grid (6 per page, medium)

- **Custom Grid**: 
  - Rows: 1-10
  - Columns: 1-10
  - Automatic sizing to fit page

- **Margins**: 5-30mm spacing around page edges

### Step 4: Preview (Optional but Recommended)

1. Click "Preview" tab
2. Click "Generate Preview"
3. See first 5 QR codes with your settings
4. Verify:
   - Size looks good
   - Colors have contrast
   - Logo is clear
   - Labels display correctly

If something looks wrong, go back to Settings and adjust.

### Step 5: Generate QR Codes

1. Click "Generate [N] QR Codes" button at bottom
2. Progress bar shows:
   - Percentage complete
   - Time elapsed
   - Estimated time remaining
   - Items completed (e.g., "200 of 500")

**During Generation**:
- **Pause**: Click to temporarily stop (resume anytime)
- **Cancel**: Click to abort (keeps codes generated so far)

**Performance Tips**:
- Browser tab must stay open
- Don't switch tabs during generation
- Close other heavy websites
- If memory warning appears, reduce batch size

### Step 6: Export Results

When generation completes:

1. **View Results**: Click "Results" tab to see gallery
2. **Export Options**:
   - **Export as ZIP**: Downloads .zip file with all codes
   - **Export as PDF**: Downloads .pdf with grid layout
   - Both preserve your filename patterns

Results gallery shows:
- All generated QR codes (scrollable)
- Labels (if configured)
- Error indicators (if any failed)

---

## QR Code Scanner

### Using Your Camera

1. Click "Scan" tab
2. Click "Start Camera"
3. Allow camera permission (first time only)
4. Point camera at QR code
5. Code decodes automatically

**Tips for Better Scanning**:
- Ensure good lighting
- Hold camera steady
- Keep QR code centered in frame
- Try different distances if not scanning
- Clean camera lens if blurry

### After Scanning

When a code is decoded:
1. Content displays in the result area
2. **Action Buttons**:
   - **Open URL**: Visit the link (if URL)
   - **Copy**: Copy decoded text to clipboard
   - **Search**: Google the content
   - **Generate**: Create QR code of this content

3. Automatically saved to History

### Scanning from Webpage

**Right-click any image** → "Scan QR/Barcode"
- Analyzes image for QR codes
- Works on any website
- Results appear in popup

### Special QR Code Types

**WiFi QR Codes**
When you scan a WiFi QR code (format: `WIFI:T:WPA;S:NetworkName;P:password;;`):
1. A dialog automatically appears (if auto-connect WiFi is enabled in Settings)
2. Shows network name (SSID), password, and security type
3. Click copy button next to password to copy credentials
4. Manually connect via your device's WiFi settings
5. Note: Chrome extensions cannot directly connect to WiFi due to security restrictions

**URL QR Codes**
- Automatically opens in new tab if auto-open URLs enabled
- Safe URLs open immediately
- Suspicious URLs show security confirmation dialog
- Always check URLs before opening from unknown sources

**vCard/Contact QR Codes**
- Displays contact information in formatted view
- Option to save to contacts (system dependent)
- Shows name, phone, email, organization, etc.

---

## History & Analytics

### History Tab

View all your past generations and scans:

**Features**:
- Search bar (filters by content)
- Sort by date
- Filter by type (generated/scanned)
- Clear all history
- Export to CSV/JSON

**Entry Details**:
- Timestamp
- Content/data
- Type (generate/scan)
- Thumbnail (if available)
- Quick actions (regenerate, copy, delete)

**Favorites**:
- Star icon to mark favorites
- Filter to show only favorites
- Useful for frequently used codes

### Analytics Tab

Track your usage:
- Total generations
- Total scans
- Popular QR types
- Usage over time (chart)
- Top domains/content

---

## 7. Settings & Customization

Access settings by clicking the **Settings** tab (gear icon).

### Scanning Settings

**Auto-copy to clipboard**
- Automatically copies scanned QR codes to your clipboard
- Useful for quick data entry workflows
- Toggle: ON/OFF (default: OFF)

**Auto-open URLs**
- Automatically opens URLs in new tab when scanned
- Safe URLs open immediately, suspicious ones show confirmation
- Toggle: ON/OFF (default: OFF)

**Auto-connect WiFi**
- Automatically shows connection dialog for WiFi QR codes
- Displays network name, password with copy button, and security type
- Note: Chrome extensions can't directly connect to WiFi - credentials must be manually entered
- Toggle: ON/OFF (default: OFF)

**Default scan mode**
- Choose default scanning behavior:
  - **Auto**: Detects both QR codes and barcodes
  - **QR Only**: Faster, QR codes only
  - **Barcode**: 1D barcodes only (UPC, EAN, etc.)
- Change anytime while scanning

### Feedback Settings

**Sound effects**
- Play audio beep when QR code detected
- 800Hz tone for 200ms
- Toggle: ON/OFF (default: ON)

**Vibration**
- Vibrate device when code successfully scanned
- 200ms vibration pulse
- Toggle: ON/OFF (default: ON)

**Notifications**
- Show browser notifications for scan events
- "QR code detected!" message
- Toggle: ON/OFF (default: ON)

**Test Feedback**
- Click "Test Feedback" button to verify all feedback settings
- Tests sound, vibration, and displays confirmation
- Use this to check if feedback is working properly

### History Settings

**History limit**
- Number of recent scans to keep in history
- Range: 5-50 entries (default: 5)
- Adjust slider to change limit
- Older entries automatically removed when limit reached

**Clear All History**
- Removes all saved scan history
- Confirmation required
- Cannot be undone

### About & Actions

**Extension version**: 2.0.0
- View current version information
- Check last update date

**Reset All Settings**
- Restores all settings to default values
- Does not affect scan history
- Confirmation required
- Defaults:
  - Auto-copy: OFF
  - Auto-open URLs: OFF
  - Auto-connect WiFi: OFF
  - Sound: ON
  - Vibration: ON
  - Notifications: ON
  - History limit: 5
  - Default scan mode: Auto

**User Guide**
- Click "Help" button to open this comprehensive guide
- Opens in new tab
- Always accessible from settings

---

## Advanced Features

### Webhook Notifications

Get notified when bulk generation completes:

1. **Setup**:
   - Go to Bulk Generator → Upload tab
   - Scroll to "Webhook Notifications"
   - Enter your webhook URL
   - Click "Test" to verify connection
   - Click "Save"
   - Check "Enable webhook notifications"

2. **Supported Services**:
   - Slack: Paste Incoming Webhook URL
   - Discord: Paste Webhook URL
   - Microsoft Teams: Paste Webhook URL
   - Custom: Any HTTPS endpoint

3. **Notification Contains**:
   - Total items processed
   - Success count
   - Failure count (if any)
   - Duration (time taken)
   - Timestamp

### Multi-Column QR Codes (vCard)

Generate contact cards from spreadsheet:

1. Your CSV should have columns: `name`, `phone`, `email`, `company`, `title`
2. Select "vCard" as QR type in settings
3. Map each column appropriately
4. Generated QR codes will be proper vCard format

When scanned, recipient can save contact directly to phone.

### Memory Management

For large batches (500+ codes):

**If you see memory warning**:
1. Reduce batch size (split your CSV)
2. Lower QR code size (use 512px instead of 1024px)
3. Remove logo temporarily
4. Close other browser tabs
5. Generate in multiple sessions

**Memory is monitored in real-time** and warnings appear at 80% usage.

---

## Troubleshooting

### Generation Issues

**Problem**: "No valid data found"  
**Solution**: Ensure CSV has column named `text`, `data`, or `content`

**Problem**: "File too large"  
**Solution**: File must be under 10MB. Split into smaller files.

**Problem**: "Too many items"  
**Solution**: Maximum 2,000 items per batch. Split your data.

**Problem**: Some QR codes failed  
**Solution**: Check data validation tab for invalid entries. Fix and regenerate.

### Google Sheets Issues

**Problem**: "Failed to fetch sheet data"  
**Solutions**:
- Make sheet publicly accessible (Share → Anyone with link)
- Check you copied full URL from address bar
- Ensure sheet has data in first tab

**Problem**: "Invalid Google Sheets URL"  
**Solution**: URL must start with `https://docs.google.com/spreadsheets/d/`

### Scanning Issues

**Problem**: Camera not working  
**Solutions**:
- Allow camera permission in Chrome settings
- Check camera is not used by another app
- Try refreshing the extension
- Restart Chrome

**Problem**: QR code not scanning  
**Solutions**:
- Improve lighting
- Hold camera steady
- Try different distance
- Ensure QR code is not damaged
- Clean QR code surface
- Clean camera lens

### Export Issues

**Problem**: ZIP file too large  
**Solution**: Reduce batch size in settings (split into multiple ZIPs)

**Problem**: PDF generation slow/stuck  
**Solution**: 
- Reduce grid size (fewer items per page)
- Lower QR code size
- Remove logo temporarily

**Problem**: Webhook not working  
**Solutions**:
- Test webhook URL (click Test button)
- Ensure URL uses HTTPS (not HTTP)
- Verify webhook endpoint is active
- Check webhook service status

---

## FAQ

### General

**Q: Is my data sent anywhere?**  
A: No. All QR generation and scanning happens locally in your browser. Nothing is sent to external servers except webhooks you configure.

**Q: How many QR codes can I generate?**  
A: Single mode: Unlimited. Bulk mode: Up to 2,000 per batch.

**Q: What file formats are supported?**  
A: Input: CSV (.csv), Excel (.xlsx, .xls), Google Sheets. Output: PNG (images), ZIP (archives), PDF (documents).

**Q: Can I use custom logos?**  
A: Yes! Upload PNG, JPG, or SVG images. Recommended: 10-30% logo size with High (H) error correction.

### Bulk Generation

**Q: How long does bulk generation take?**  
A: Approximately 75ms per code. Examples:
- 100 codes: ~7-10 seconds
- 500 codes: ~35-45 seconds  
- 1000 codes: ~70-90 seconds
- 2000 codes: ~2-3 minutes

**Q: Can I pause and resume?**  
A: Yes! Click "Pause" during generation, then "Resume" when ready. Your progress is saved.

**Q: What if generation fails midway?**  
A: Click "Cancel" to stop. All successfully generated codes are saved and can be exported.

**Q: Can I use my own column names?**  
A: Yes! Select any column in Column Mapping. Use column names in filename patterns with `{column_name}`.

**Q: How do PDF templates work?**  
A: Templates auto-configure grid layout:
- Business Card: 2×2 (4 large codes per page)
- Label: 5×4 (20 small codes per page)
- Badge: 3×2 (6 medium codes per page)
- Standard: 4×3 (12 codes per page)

### Scanning

**Q: What QR code types are supported?**  
A: URLs, text, WiFi credentials, vCards, emails, phone numbers, SMS, locations, and more. Supports QR codes and most 1D barcodes.

**Q: Can I scan from an image file?**  
A: Yes! Right-click any image on a webpage and select "Scan QR/Barcode".

**Q: Does it work offline?**  
A: Generation works offline. Scanning requires camera access. Opening URLs requires internet.

**Q: Can the extension automatically connect to WiFi networks?**  
A: No. Chrome extensions cannot directly control WiFi connections due to browser security restrictions. However, when you scan a WiFi QR code with auto-connect enabled in Settings, the extension will display a dialog with the network credentials (SSID, password, security type) and a copy button for easy manual connection.

**Q: How do I connect to a WiFi network from a scanned QR code?**  
A: 
1. Scan the WiFi QR code (or enable auto-connect in Settings)
2. View the network credentials in the dialog
3. Click the copy button next to the password
4. Go to your device's WiFi settings
5. Select the network and paste the password
6. Connect manually

### Advanced

**Q: How do I import from Google Sheets?**  
A: Make your sheet public (Share → Anyone with link → Viewer), copy the URL, paste in Bulk Generator → Upload tab → Google Sheets section, click Import.

**Q: What are webhooks for?**  
A: Webhooks send notifications when large batches complete. Useful for very large jobs or automated workflows.

**Q: Can I schedule bulk generation?**  
A: Not currently. You must manually start generation. Consider using webhooks for completion notifications.

**Q: How is memory managed?**  
A: QR Studio processes in chunks (50 items), monitors memory usage, and warns at 80% capacity. Large batches may need to be split.

**Q: Can I generate SVG QR codes?**  
A: Currently only PNG format is supported. SVG support is planned for future release.

### Customization

**Q: What's the best size for printing?**  
A: Use 1024px or 2048px with High (H) error correction for best print quality.

**Q: What's the best size for web use?**  
A: Use 512px with Medium (M) error correction for good quality and smaller file sizes.

**Q: Can I change the QR pattern style?**  
A: Currently only standard square patterns. Custom patterns (dots, rounded) planned for future.

**Q: Do colors affect scanning?**  
A: Yes! Ensure high contrast (dark on light or vice versa). Avoid low contrast combinations like yellow on white.

---

## Keyboard Shortcuts

- **Generate Tab**: `Ctrl+Shift+G` or `Cmd+Shift+G`
- **Scan Tab**: `Ctrl+Shift+S` or `Cmd+Shift+S`
- **Copy Last QR**: `Ctrl+Shift+C` or `Cmd+Shift+C`

---

## Tips & Best Practices

### For Best Quality QR Codes
1. Use 1024px+ size for printing
2. Use High (H) error correction with logos
3. Ensure good color contrast (test scan after generating)
4. Keep logos small (10-20% of QR size)
5. Test scan before mass printing

### For Efficient Bulk Generation
1. Preview settings with first 5 codes
2. Use descriptive filename patterns
3. Split very large datasets into batches
4. Enable webhooks for large jobs
5. Close unnecessary browser tabs
6. Keep browser tab active during generation

### For Better Scanning
1. Ensure good lighting
2. Hold camera steady
3. Keep QR code in center of frame
4. Clean camera lens regularly
5. For damaged codes, try different angles

### For Organized Workflow
1. Use meaningful column names in CSV
2. Add description/label columns
3. Use consistent naming patterns
4. Star favorites in History
5. Export history regularly as backup

---

## Getting Help

If you encounter issues:

1. **Check this guide** - Most questions are answered above
2. **Check browser console** - Press F12 to see error messages
3. **Check validation** - Review data validation warnings
4. **Test with small batch** - Try 10-20 items first
5. **Check permissions** - Ensure camera/storage permissions granted
6. **Restart extension** - Disable and re-enable in `chrome://extensions/`
7. **Clear data** - Clear history if experiencing slowdowns
8. **Update Chrome** - Ensure Chrome is up to date

### Common Error Messages

- "Empty value": Row has no data in selected column
- "File too large": Reduce file size or split data
- "Camera not found": Check camera permissions
- "Network error": Check Google Sheets URL is public
- "Memory limit": Reduce batch size or QR dimensions

---

## Version Information

**Current Version**: 2.0.0  
**Last Updated**: November 10, 2025  
**Compatibility**: Chrome 88+, Edge 88+  
**Manifest Version**: 3

---

## Quick Reference

### File Size Recommendations
- Web display: 512px QR, Low-Medium error correction
- Print (small): 512-1024px QR, Medium error correction
- Print (large): 1024-2048px QR, High error correction
- With logo: Always use High error correction

### CSV Format
```csv
text,name,category
https://example.com,Example,Website
mailto:test@example.com,Email,Contact
tel:+1234567890,Phone,Contact
```

### Error Correction Guide
- **L (7%)**: Fast, small, clean environments only
- **M (15%)**: Standard, most common use
- **Q (25%)**: With minor wear/damage expected
- **H (30%)**: With logos, printing, or outdoor use

---

**Need more help?** Check the browser console (F12) for detailed error messages, or review your input data format.

**Happy QR generating! 🎉**
