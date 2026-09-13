const CACHE='carpentry-quotes-v3';
const APP_SHELL=['/','/index.html','/stitch-hybrid.css','/stitch-hybrid.js','/wizard-v2.css','/wizard-v2.js','/manifest.webmanifest','/pwa-icon.svg','/vendor/html2pdf.bundle.min.js'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin || url.pathname.startsWith('/api/')) return;

  // Always prefer the latest app code after a deployment, with cache as offline fallback.
  if(req.mode==='navigate' || /\.(js|css)$/.test(url.pathname)){
    event.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(req,copy));
        return res;
      }).catch(()=>caches.match(req).then(r=>r||caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
    const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res;
  })));
});
