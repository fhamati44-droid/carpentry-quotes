const fs = require('fs');
const path = require('path');
const src='index.html',outDir='dist';let html=fs.readFileSync(src,'utf8');
const tags={
 css:'<link rel="stylesheet" href="/stitch-hybrid.css?v=10">',wizardCss:'<link rel="stylesheet" href="/wizard-v2.css?v=3">',
 js:'<script src="/stitch-hybrid.js?v=10" defer></script>',wizardJs:'<script src="/wizard-v2.js?v=4" defer></script>',materialsJs:'<script src="/materials-v2.js?v=1" defer></script>',jobsJs:'<script src="/jobs-v2.js?v=1" defer></script>',
 pwa:'<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#1e2229"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="apple-touch-icon" href="/pwa-icon.svg">',pwaJs:'<script src="/pwa.js?v=3" defer></script>'};
for(const t of [tags.css,tags.wizardCss,tags.pwa]){const href=t.match(/href="([^"]+)/)?.[1];if(href&&!html.includes(href))html=html.replace('</head>',`  ${t}\n</head>`)}
for(const t of [tags.js,tags.wizardJs,tags.materialsJs,tags.jobsJs,tags.pwaJs]){const src=t.match(/src="([^"]+)/)?.[1];if(src&&!html.includes(src))html=html.replace('</body>',`  ${t}\n</body>`)}
html=html
 .replace('חומר, פרזול ועבודה','לקוח, פריטים ומחיר')
 .replace('פירוק שעות עבודה לפי שלב','עבודה / התקנה (אופציונלי)')
 .replace('עלות פרזול (ידיות, צירים וכו׳)','תוספות / פרזול (אופציונלי)')
 .replace('{id: "m1", name: "MDF לבן", price: 90}','{id: "m1", name: "MDF לבן (שלייף לק)", price: 2500}')
 .replace('{id: "m2", name: "פורניר אלון", price: 180}','{id: "m2", name: "פורניר אלון", price: 1800}')
 .replace('{id: "m3", name: "עץ מלא", price: 260}','{id: "m3", name: "עץ מלא", price: 3000}')
 .replace("const STATUS_LABELS = {quote:'הצעת מחיר', production:'בייצור', delivered:'נמסר'};\nconst STATUS_ORDER = ['quote','production','delivered'];","const STATUS_LABELS = {quote:'הצעה', approved:'אושרה', deposit:'מקדמה', production:'בייצור', install:'להתקנה', delivered:'הושלם'};\nconst STATUS_ORDER = ['quote','approved','deposit','production','install','delivered'];")
 .replace("const q = quotes.find(x=>x.id===id);\n  if(!q) return;\n  q.payments = q.payments || [];\n  q.payments.push({id: uid(), amount, date: new Date().toISOString(), note: noteEl.value.trim()});","const q = quotes.find(x=>x.id===id);\n  if(!q) return;\n  const remainingBefore = Math.max(0, q.total - paidSum(q));\n  if(amount > remainingBefore){ showToast('הסכום גבוה מהיתרה לתשלום'); return; }\n  q.payments = q.payments || [];\n  q.payments.push({id: uid(), amount, date: new Date().toISOString(), note: noteEl.value.trim()});")
 .replace("document.querySelector('nav.tabs button[data-tab=\"quote\"]').click();\n  window.scrollTo({top:0,behavior:'smooth'});","document.querySelector('nav.tabs button[data-tab=\"quote\"]').click();\n  setTimeout(()=>window.hySetQuoteStep?.(1),80);\n  window.scrollTo({top:0,behavior:'smooth'});");
fs.rmSync(outDir,{recursive:true,force:true});fs.mkdirSync(outDir,{recursive:true});fs.writeFileSync(path.join(outDir,'index.html'),html);
for(const file of ['admin.html','stitch-hybrid.css','stitch-hybrid.js','wizard-v2.css','wizard-v2.js','materials-v2.js','jobs-v2.js','manifest.webmanifest','pwa-icon.svg','sw.js','pwa.js'])fs.copyFileSync(file,path.join(outDir,file));
fs.cpSync('vendor',path.join(outDir,'vendor'),{recursive:true});
console.log('Product Architecture V2 + wizard + jobs lifecycle + materials + PWA built to /dist');