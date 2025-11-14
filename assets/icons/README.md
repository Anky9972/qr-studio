# Icon Placeholder Files

The extension requires icons in the following sizes:
- icon16.png (16x16 pixels)
- icon32.png (32x32 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

## How to Create Icons

### Option 1: Use an Online Tool
1. Go to https://www.favicon-generator.org/
2. Upload your logo/image
3. Download all sizes
4. Rename and place in this folder

### Option 2: Use Figma/Canva
1. Create a 512x512px canvas
2. Design your QR-themed icon
3. Export in different sizes
4. Place in this folder

### Option 3: Use a Placeholder Generator
Run this command to create placeholder icons:

```bash
node ../scripts/generate-icons.js
```

## Temporary Workaround

For development, you can create simple colored squares:
1. Open any image editor
2. Create solid color squares in required sizes
3. Save as PNG files with correct names
