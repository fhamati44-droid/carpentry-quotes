const fs = require('fs');
const path = require('path');

const src = 'index.html';
const outDir = 'dist';
let html = fs.readFileSync(src, 'utf8');

const cssTag = '<link rel="stylesheet" href="/stitch-hybrid.css?v=9">';
const wizardCssTag = '<link rel="stylesheet" href="/wizard-v2.css?v=3">';
const jsTag = '<script src="/stitch-hybrid.js?v=9" defer></script>';
const wizardJsTag = '<script src="/wizard-v2.js?v=3" defer></script>';
const materialsJsTag = '<script src="/materials-v2.js?v=1" defer></script>';
const pwaTag = '<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#1e2229"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="apple-touch-icon" href="/pwa-icon.svg">';
const pwaJsTag = '<script src="/pwa.js?v=3" defer></script>';

if (!html.includes('/stitch-hybrid.css')) html = html.replace('</head>', `  ${cssTag}\n</head>`);
if (!html.includes('/wizard-v2.css')) html = html.replace('</head>', `  ${wizardCssTag}\n</head>`);
if (!html.includes('/manifest.webmanifest')) html = html.replace('</head>', `  ${pwaTag}\n</head>`);
if (!html.includes('/stitch-hybrid.js')) html = html.replace('</body>', `  ${jsTag}\n</body>`);
if (!html.includes('/wizard-v2.js')) html = html.replace('</body>', `  ${wizardJsTag}\n</body>`);
if (!html.includes('/materials-v2.js')) html = html.replace('</body>', `  ${materialsJsTag}\n</body>`);
if (!html.includes('/pwa.js')) html = html.replace('</body>', `  ${pwaJsTag}\n</body>`);

html = html
  .replace('חומר, פרזול ועבודה', 'לקוח, פריטים ומחיר')
  .replace('פירוק שעות עבודה לפי שלב', 'עבודה / התקנה (אופציונלי)')
  .replace('עלות פרזול (ידיות, צירים וכו׳)', 'תוספות / פרזול (אופציונלי)')
  .replace('{id: "m1", name: "MDF לבן", price: 90}', '{id: "m1", name: "MDF לבן (שלייף לק)", price: 2500}')
  .replace('{id: "m2", name: "פורניר אלון", price: 180}', '{id: "m2", name: "פורניר אלון", price: 1800}')
  .replace('{id: "m3", name: "עץ מלא", price: 260}', '{id: "m3", name: "עץ מלא", price: 3000}');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
for (const file of ['admin.html','stitch-hybrid.css','stitch-hybrid.js','wizard-v2.css','wizard-v2.js','materials-v2.js','manifest.webmanifest','pwa-icon.svg','sw.js','pwa.js']) {
  fs.copyFileSync(file, path.join(outDir, file));
}
fs.cpSync('vendor', path.join(outDir, 'vendor'), { recursive: true });

console.log('Product Architecture V2 + AI quote access + materials manager + PWA built to /dist');
