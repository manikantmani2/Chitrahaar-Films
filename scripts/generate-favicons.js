const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const svgPath = path.join(__dirname, '..', 'public', 'chitrahaar-logo.svg');
  const outDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(svgPath)) {
    console.error('SVG source not found:', svgPath);
    process.exit(1);
  }

  const sizes = [16, 32, 48, 64, 96, 128, 180];

  for (const size of sizes) {
    const out = path.join(outDir, `favicon-${size}.png`);
    await sharp(svgPath)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toFile(out);
    console.log('Written', out);
  }

  // create a generic favicon-32.png as main
  const mainFavicon = path.join(outDir, 'favicon-32.png');
  const fallback = path.join(outDir, 'favicon.png');
  if (fs.existsSync(mainFavicon)) {
    fs.copyFileSync(mainFavicon, fallback);
    console.log('Copied favicon.png');
  }

  console.log('Favicons generated.');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
