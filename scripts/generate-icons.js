/**
 * Simple icon generator for development
 * Creates placeholder icons in required sizes
 * 
 * Usage: node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This creates very basic placeholder icons using Canvas API
// For production, use proper design tools

const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, '..', 'assets', 'icons');

console.log('Generating placeholder icons...');
console.log('Note: These are basic placeholders. Create proper icons for production!');

// Create a simple SVG template
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#60cdff"/>
  <rect x="${size * 0.2}" y="${size * 0.2}" width="${size * 0.6}" height="${size * 0.6}" fill="#202020" rx="${size * 0.1}"/>
  <rect x="${size * 0.3}" y="${size * 0.3}" width="${size * 0.4}" height="${size * 0.4}" fill="#60cdff" rx="${size * 0.05}"/>
</svg>
`;

// For now, create SVG files (modern browsers support SVG icons)
sizes.forEach(size => {
  const svgContent = createSVG(size);
  const filename = path.join(iconsDir, `icon${size}.svg`);
  
  fs.writeFileSync(filename, svgContent.trim());
  console.log(`✓ Created icon${size}.svg`);
});

console.log('\n⚠️  Note: SVG icons created. For PNG icons, use an online converter or image editor.');
console.log('   Recommended: Convert SVGs to PNGs using https://svgtopng.com/');
console.log('\n✓ Done! Icons are in assets/icons/');
