const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDirs = [
  path.join(__dirname, '..', 'public', 'gallery'),
  path.join(__dirname, '..', 'public', 'portfolio'),
  path.join(__dirname, '..', 'public', 'our-works-gallery'),
];

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ext);
  const webpOut = path.join(dir, `${base}.webp`);
  const avifOut = path.join(dir, `${base}.avif`);

  try {
    if (!fs.existsSync(webpOut)) {
      await sharp(filePath).webp({ quality: 80 }).toFile(webpOut);
      console.log('Created', webpOut);
    } else {
      console.log('Exists', webpOut);
    }

    if (!fs.existsSync(avifOut)) {
      await sharp(filePath).avif({ quality: 60 }).toFile(avifOut);
      console.log('Created', avifOut);
    } else {
      console.log('Exists', avifOut);
    }
  } catch (err) {
    console.error('Failed to convert', filePath, err.message);
  }
}

async function walkAndConvert(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAndConvert(full);
    } else {
      await convertFile(full);
    }
  }
}

(async () => {
  for (const d of srcDirs) {
    await walkAndConvert(d);
  }
  console.log('Conversion complete.');
})();
