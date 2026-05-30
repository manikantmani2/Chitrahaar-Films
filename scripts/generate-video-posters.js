const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public', 'our-works-gallery');
const OUT_DIR = path.join(ROOT, 'thumbs');
const TMP_DIR = path.join(__dirname, '..', 'tmp-posters');

if (!fs.existsSync(ROOT)) {
  console.error('Gallery folder not found at', ROOT);
  process.exit(1);
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(walk(full));
    else results.push(full);
  });
  return results;
}

function isVideo(f) {
  const ext = path.extname(f).toLowerCase();
  return ['.mp4', '.m4v', '.mov', '.webm', '.mkv'].includes(ext);
}

function safeName(fullPath) {
  const rel = path.relative(ROOT, fullPath);
  return rel.replace(/\\/g, '_').replace(/\//g, '_').replace(/\s+/g, '_').replace(/&/g, 'and').replace(/\.[^.]+$/, '');
}

// ensure ffmpeg is available
const ff = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
if (ff.error) {
  console.error('ffmpeg not found in PATH. Install ffmpeg and re-run this script.');
  process.exit(2);
}

const files = walk(ROOT).filter(isVideo).filter(f => !path.basename(f).startsWith('._'));
if (files.length === 0) {
  console.log('No video files found in', ROOT);
  process.exit(0);
}

async function run() {
  for (const f of files) {
    try {
      const name = safeName(f);
      const outLargeWebp = path.join(OUT_DIR, `${name}.webp`);
      const outSmallWebp = path.join(OUT_DIR, `${name}@640.webp`);
      const outLargeAvif = path.join(OUT_DIR, `${name}.avif`);
      const outSmallAvif = path.join(OUT_DIR, `${name}@640.avif`);

      if (fs.existsSync(outLargeWebp) && fs.existsSync(outSmallWebp) && fs.existsSync(outLargeAvif) && fs.existsSync(outSmallAvif)) {
        console.log('Skipping existing posters for:', path.basename(outLargeWebp));
        continue;
      }

      const tmpPng = path.join(TMP_DIR, `${name}.png`);
      // extract frame at 2 seconds
      const args = ['-ss', '00:00:02', '-i', f, '-frames:v', '1', '-q:v', '2', tmpPng];
      const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
      if (r.status !== 0) {
        console.error('ffmpeg failed for', f);
        if (fs.existsSync(tmpPng)) fs.unlinkSync(tmpPng);
        continue;
      }

      // convert/resize to webp (large + small)
      if (!fs.existsSync(outLargeWebp)) {
        await sharp(tmpPng).resize({ width: 1280 }).webp({ quality: 80 }).toFile(outLargeWebp);
      }
      if (!fs.existsSync(outSmallWebp)) {
        await sharp(tmpPng).resize({ width: 640 }).webp({ quality: 72 }).toFile(outSmallWebp);
      }

      // also write AVIF variants
      if (!fs.existsSync(outLargeAvif)) {
        await sharp(tmpPng).resize({ width: 1280 }).avif({ quality: 50 }).toFile(outLargeAvif);
      }
      if (!fs.existsSync(outSmallAvif)) {
        await sharp(tmpPng).resize({ width: 640 }).avif({ quality: 45 }).toFile(outSmallAvif);
      }

      if (fs.existsSync(tmpPng)) fs.unlinkSync(tmpPng);
      console.log('Created posters:', path.basename(outLargeWebp), path.basename(outSmallWebp));
    } catch (err) {
      console.error('Poster failed for', f, err && err.message);
    }
  }
}

run().catch((e) => {
  console.error('Error generating posters', e && e.message);
  process.exit(3);
});
