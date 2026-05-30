const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const galleryRoot = path.join(__dirname, '..', 'public', 'our-works-gallery');
const thumbsDir = path.join(galleryRoot, 'thumbs');

function safeName(filePath) {
  // relative path from gallery root, replace separators and unsafe chars
  const rel = path.relative(galleryRoot, filePath);
  return rel.replace(/\\|\//g, '_').replace(/\s+/g, '_').replace(/&/g, 'and').replace(/[^a-zA-Z0-9_\-\.]/g, '');
}

async function makeThumb(src) {
  try {
    if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });
    const base = path.basename(src);
    // skip macOS resource files that start with ._
    if (base.startsWith('._')) return;
    const ext = path.extname(src).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) return;
    const safe = safeName(src).replace(/\.[^.]+$/, '');
    const outWebp = path.join(thumbsDir, `${safe}.webp`);
    const outAvif = path.join(thumbsDir, `${safe}.avif`);

    if (!fs.existsSync(outWebp)) {
      await sharp(src).resize({ width: 640 }).webp({ quality: 75 }).toFile(outWebp);
      console.log('Created thumb:', path.basename(outWebp));
    } else {
      // console.log('Thumb exists:', path.basename(outWebp));
    }

    if (!fs.existsSync(outAvif)) {
      await sharp(src).resize({ width: 640 }).avif({ quality: 50 }).toFile(outAvif);
      console.log('Created AVIF thumb:', path.basename(outAvif));
    }
  } catch (err) {
    console.error('Thumb failed for', src, err && err.message);
  }
}

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'thumbs') continue;
      collectFiles(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

(async () => {
  const files = collectFiles(galleryRoot).filter(Boolean);
  console.log('Thumbnail generation started. Found', files.length, 'files');
  await Promise.allSettled(files.map((f) => makeThumb(f)));
  console.log('Thumbnail generation finished.');
})();
