const fs = require('fs');
const path = require('path');
const pngToIcoPkg = require('png-to-ico');
const pngToIco = pngToIcoPkg.default || pngToIcoPkg;

async function makeIco() {
  const publicDir = path.join(__dirname, '..', 'public');
  const files = [16, 32, 48, 64].map((s) => path.join(publicDir, `favicon-${s}.png`)).filter(fs.existsSync);
  if (files.length === 0) {
    console.error('No favicon PNGs found in public/. Run generate-favicons.js first.');
    process.exit(1);
  }

  try {
    const buf = await pngToIco(files);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buf);
    console.log('Generated public/favicon.ico');
  } catch (err) {
    console.error('Failed to generate ICO:', err);
    process.exit(1);
  }
}

makeIco();
