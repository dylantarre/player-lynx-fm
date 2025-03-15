import svg2img from 'svg2img';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputSvg = path.join(__dirname, '../src/assets/cat-icon.svg');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
try {
  await fs.access(publicDir);
} catch {
  await fs.mkdir(publicDir);
}

// Read the SVG file
const svgBuffer = await fs.readFile(inputSvg, 'utf8');

// Generate favicons
const sizes = [16, 32, 64, 192, 512];

for (const size of sizes) {
  svg2img(svgBuffer, { width: size, height: size }, async (error, buffer) => {
    if (error) {
      console.error(`Error generating ${size}x${size} favicon:`, error);
      return;
    }
    await fs.writeFile(path.join(publicDir, `favicon-${size}x${size}.png`), buffer);
    
    // Generate special files for certain sizes
    if (size === 192) {
      await fs.writeFile(path.join(publicDir, 'android-chrome-192x192.png'), buffer);
    } else if (size === 512) {
      await fs.writeFile(path.join(publicDir, 'android-chrome-512x512.png'), buffer);
    } else if (size === 32) {
      await fs.writeFile(path.join(publicDir, 'favicon.ico'), buffer);
    }
  });
}

// Generate apple touch icon (180x180)
svg2img(svgBuffer, { width: 180, height: 180 }, async (error, buffer) => {
  if (error) {
    console.error('Error generating apple touch icon:', error);
    return;
  }
  await fs.writeFile(path.join(publicDir, 'apple-touch-icon.png'), buffer);
});

console.log('Favicon generation started...');
