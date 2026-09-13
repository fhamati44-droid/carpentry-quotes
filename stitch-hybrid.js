/* Stitch Hybrid behavior layer — intentionally small and non-destructive. */
(function(){
  function normalizeNavigation(){
    const labels={quote:['✦','הצעה'],cutlist:['▦','חיתוך'],orders:['◎','לקוחות'],settings:['⚙','העסק']};
    document.querySelectorAll('nav.tabs button[data-tab]').forEach(btn=>{
      const cfg=labels[btn.dataset.tab]; if(!cfg) return;
      const icon=btn.querySelector('.tab-icon'); if(icon) icon.textContent=cfg[0];
      const spans=btn.querySelectorAll('span'); if(spans.length>1) spans[spans.length-1].textContent=cfg[1];
    });
  }

  function hideLegacyInternalCosting(){
    // Product decision: planning / production / overhead are not part of the customer quote flow.
    const terms=['תכנון','ייצור','תקורה'];
    document.querySelectorAll('label,.field,.row2,.cost-row,.setting-row').forEach(el=>{
      const txt=(el.textContent||'').trim();
      if(terms.some(term=>txt.includes(term))){
        const target=el.matches('label') ? (el.closest('.row2') || el.parentElement) : el;
        if(target) target.classList.add('hybrid-hide-cost');
      }
    });
  }

  function polishAiCopy(){
    document.querySelectorAll('.ai-box .hint,.ai-box .warn,.ai-status').forEach(el=>{
      if((el.textContent||'').includes('דיוק')) el.textContent='ה-AI מציע נתונים ראשוניים. יש לאמת מידות לפני שליחת הצעה.';
    });
  }

  function run(){normalizeNavigation();hideLegacyInternalCosting();polishAiCopy();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  // Existing app renders parts dynamically; re-apply visual product rules after UI changes.
  new MutationObserver(()=>{clearTimeout(window.__hybridTimer);window.__hybridTimer=setTimeout(run,80)}).observe(document.documentElement,{childList:true,subtree:true});
})();
