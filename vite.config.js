import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      closeBundle() {
        // Copy manifest.json
        copyFileSync(
          resolve(__dirname, 'manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        );

        // Copy USER_GUIDE.md
        copyFileSync(
          resolve(__dirname, 'USER_GUIDE.md'),
          resolve(__dirname, 'dist/USER_GUIDE.md')
        );

        // Copy camera.js
        copyFileSync(
          resolve(__dirname, 'camera.js'),
          resolve(__dirname, 'dist/camera.js')
        );

        // Create lib directory if it doesn't exist
        const libDir = resolve(__dirname, 'dist/lib');
        if (!existsSync(libDir)) {
          mkdirSync(libDir, { recursive: true });
        }

        // Copy lib files
        const libFiles = ['jsQR.min.js', 'qrcode.min.js', 'zxing.min.js'];
        libFiles.forEach(file => {
          const srcPath = resolve(__dirname, `lib/${file}`);
          const destPath = resolve(libDir, file);
          try {
            if (existsSync(srcPath)) {
              copyFileSync(srcPath, destPath);
            }
          } catch (err) {
            console.warn(`Warning: Could not copy ${file}`);
          }
        });

        // Create src directory if it doesn't exist
        const srcDir = resolve(__dirname, 'dist/src');
        if (!existsSync(srcDir)) {
          mkdirSync(srcDir, { recursive: true });
        }

        // Create workers directory if it doesn't exist
        const workersDir = resolve(__dirname, 'dist/src/workers');
        if (!existsSync(workersDir)) {
          mkdirSync(workersDir, { recursive: true });
        }

        // Copy worker files
        const workerFiles = readdirSync(resolve(__dirname, 'src/workers'));
        workerFiles.forEach(file => {
          const srcPath = resolve(__dirname, `src/workers/${file}`);
          const destPath = resolve(workersDir, file);
          try {
            copyFileSync(srcPath, destPath);
          } catch (err) {
            console.warn(`Warning: Could not copy worker ${file}`);
          }
        });

        // Create assets/icons directory if it doesn't exist
        const iconsDir = resolve(__dirname, 'dist/assets/icons');
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true });
        }

        // Copy icons if they exist
        const iconSizes = [16, 32, 48, 128];
        iconSizes.forEach(size => {
          const pngPath = resolve(__dirname, `assets/icons/icon${size}.png`);
          const svgPath = resolve(__dirname, `assets/icons/icon${size}.svg`);
          
          try {
            if (existsSync(pngPath)) {
              copyFileSync(pngPath, resolve(iconsDir, `icon${size}.png`));
            } else if (existsSync(svgPath)) {
              copyFileSync(svgPath, resolve(iconsDir, `icon${size}.svg`));
            }
          } catch (err) {
            console.warn(`Warning: Could not copy icon${size}`);
          }
        });
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        camera: resolve(__dirname, 'camera.html'),
        bulk: resolve(__dirname, 'bulk.html'),
        guide: resolve(__dirname, 'guide.html'),
        background: resolve(__dirname, 'background/background.js'),
        content: resolve(__dirname, 'content/content.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background/background.js';
          }
          if (chunkInfo.name === 'content') {
            return 'content/content.js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
