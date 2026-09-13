const fs = require('fs');
const path = require('path');

const src = 'index.html';
const outDir = 'dist';
let html = fs.readFileSync(src, 'utf8');

const cssTag = '<link rel="stylesheet" href="/stitch-hybrid.css?v=5">';
const jsTag = '<script src="/stitch-hybrid.js?v=5" defer></script>';

if (!html.includes('/stitch-hybrid.css')) html = html.replace('</head>', `  ${cssTag}\n</head>`);
if (!html.includes('/stitch-hybrid.js')) html = html.replace('</body>', `  ${jsTag}\n</body>`);

html = html
  .replace('חומר, פרזול ועבודה', 'לקוח, פריטים ומחיר')
  .replace('פירוק שעות עבודה לפי שלב', 'עבודה / התקנה (אופציונלי)')
  .replace('עלות פרזול (ידיות, צירים וכו׳)', 'תוספות / פרזול (אופציונלי)');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
fs.copyFileSync('admin.html', path.join(outDir, 'admin.html'));
fs.copyFileSync('stitch-hybrid.css', path.join(outDir, 'stitch-hybrid.css'));
fs.copyFileSync('stitch-hybrid.js', path.join(outDir, 'stitch-hybrid.js'));

// Keep the local html2pdf dependency available to the generated page.
fs.cpSync('vendor', path.join(outDir, 'vendor'), { recursive: true });

console.log('Stitch Hybrid UI built to /dist');
