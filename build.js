const fs = require('fs');

const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf8');

const cssTag = '<link rel="stylesheet" href="/stitch-hybrid.css?v=4">';
const jsTag = '<script src="/stitch-hybrid.js?v=4" defer></script>';

if (!html.includes('/stitch-hybrid.css')) html = html.replace('</head>', `  ${cssTag}\n</head>`);
if (!html.includes('/stitch-hybrid.js')) html = html.replace('</body>', `  ${jsTag}\n</body>`);

html = html
  .replace('חומר, פרזול ועבודה', 'לקוח, פריטים ומחיר')
  .replace('פירוק שעות עבודה לפי שלב', 'עבודה / התקנה (אופציונלי)')
  .replace('עלות פרזול (ידיות, צירים וכו׳)', 'תוספות / פרזול (אופציונלי)');

fs.writeFileSync(indexPath, html);
console.log('Stitch Hybrid UI injected into index.html');
