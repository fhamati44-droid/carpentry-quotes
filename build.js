const fs = require('fs');
const path = require('path');

const src = 'index.html';
const outDir = 'dist';
let html = fs.readFileSync(src, 'utf8');

const cssTag = '<link rel="stylesheet" href="/stitch-hybrid.css?v=6">';
const jsTag = '<script src="/stitch-hybrid.js?v=6" defer></script>';
const pwaTag = '<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#1e2229"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="apple-touch-icon" href="/pwa-icon.svg">';
const pwaJsTag = '<script src="/pwa.js?v=1" defer></script>';

if (!html.includes('/stitch-hybrid.css')) html = html.replace('</head>', `  ${cssTag}\n</head>`);
if (!html.includes('/manifest.webmanifest')) html = html.replace('</head>', `  ${pwaTag}\n</head>`);
if (!html.includes('/stitch-hybrid.js')) html = html.replace('</body>', `  ${jsTag}\n</body>`);
if (!html.includes('/pwa.js')) html = html.replace('</body>', `  ${pwaJsTag}\n</body>`);

html = html
  .replace('חומר, פרזול ועבודה', 'לקוח, פריטים ומחיר')
  .replace('פירוק שעות עבודה לפי שלב', 'עבודה / התקנה (אופציונלי)')
  .replace('עלות פרזול (ידיות, צירים וכו׳)', 'תוספות / פרזול (אופציונלי)');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
for (const file of ['admin.html','stitch-hybrid.css','stitch-hybrid.js','manifest.webmanifest','pwa-icon.svg','sw.js','pwa.js']) {
  fs.copyFileSync(file, path.join(outDir, file));
}
fs.cpSync('vendor', path.join(outDir, 'vendor'), { recursive: true });

console.log('Stitch Hybrid UI + PWA built to /dist');
