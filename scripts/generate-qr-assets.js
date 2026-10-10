const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const targetUrl = process.env.QR_URL || 'https://jablab.mkq.one/checkin';
const outputDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const svgPath = path.join(outputDir, 'jablab-checkin-qr.svg');
const pngPath = path.join(outputDir, 'jablab-checkin-qr.png');

async function generateQRCodes() {
  console.log(`Generating QR Codes for target URL: ${targetUrl}`);

  // 1. Generate High Quality Vector SVG
  const svgString = await QRCode.toString(targetUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#E51937', // Crimson boxing red for brand style
      light: '#FFFFFF'
    }
  });

  fs.writeFileSync(svgPath, svgString, 'utf8');
  console.log(`SVG generated at: ${svgPath}`);

  // Also standard high-contrast Black/White SVG for sharp printing
  const standardSvgString = await QRCode.toString(targetUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  const standardSvgPath = path.join(outputDir, 'jablab-checkin-qr-bw.svg');
  fs.writeFileSync(standardSvgPath, standardSvgString, 'utf8');
  console.log(`Black/White SVG generated at: ${standardSvgPath}`);

  // 2. Generate High Resolution PNG (1200x1200px for print)
  await QRCode.toFile(pngPath, targetUrl, {
    type: 'png',
    width: 1200,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  console.log(`High-res PNG generated at: ${pngPath}`);

  // Also copy to root directory for easy access
  const rootPngPath = path.join(__dirname, '..', 'jablab-checkin-qr.png');
  fs.copyFileSync(pngPath, rootPngPath);
  console.log(`Copied PNG to root: ${rootPngPath}`);
}

generateQRCodes().catch(err => {
  console.error("Error generating QR:", err);
  process.exit(1);
});
