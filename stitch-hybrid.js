/* Carpentry Quotes — carpenter-first UX layer */
(function(){
  let busy=false;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function normalizeNavigation(){
    const labels={quote:['✦','הצעה'],cutlist:['▦','חיתוך'],orders:['◎','לקוחות'],settings:['⚙','העסק']};
    $$('nav.tabs button[data-tab]').forEach(btn=>{
      const cfg=labels[btn.dataset.tab]; if(!cfg)return;
      const icon=$('.tab-icon',btn); if(icon)icon.textContent=cfg[0];
      const spans=$$('span',btn); if(spans.length>1)spans[spans.length-1].textContent=cfg[1];
    });
  }

  function hideLegacyInternalCosting(){
    const terms=['תכנון','ייצור','תקורה'];
    $$('label,.field,.row2,.cost-row,.setting-row').forEach(el=>{
      const txt=(el.textContent||'').trim();
      if(terms.some(t=>txt.includes(t))){const target=el.matches('label')?(el.closest('.row2')||el.parentElement):el;if(target)target.classList.add('hybrid-hide-cost');}
    });
  }

  function polishAiCopy(){
    $$('.ai-box .hint,.ai-box .warn,.ai-status').forEach(el=>{if((el.textContent||'').includes('דיוק'))el.textContent='ה-AI מציע נתונים ראשוניים. יש לאמת מידות לפני שליחת הצעה.'});
  }

  function addWorkspaceIntro(){
    const quote=$('#tab-quote'); if(!quote||$('.hy-workspace',quote))return;
    const first=quote.firstElementChild;
    const hero=document.createElement('section'); hero.className='hy-workspace';
    hero.innerHTML=`<div><span class="hy-eyebrow">הצעת מחיר חדשה</span><h2>בוא נסגור הצעה בכמה דקות</h2><p>מוסיפים לקוח, עבודה ופריטים — ומכאן ישר ל-PDF או לוואטסאפ.</p></div><div class="hy-flow" aria-label="שלבי יצירת הצעה"><span class="active">1 <b>לקוח</b></span><span>2 <b>עבודה</b></span><span>3 <b>פריטים</b></span><span>4 <b>מחיר</b></span><span>5 <b>שליחה</b></span></div>`;
    quote.insertBefore(hero,first);
  }

  function simplifyChrome(){
    const journey=$('.journey'); if(journey)journey.classList.add('hy-legacy-journey');
    const trust=$('.trust-row'); if(trust)trust.classList.add('hy-trust');
    const banner=$('.local-banner,.dev-banner,[class*=local-mode]'); if(banner)banner.classList.add('hy-dev-banner');
  }

  function enhanceActions(){
    $$('button').forEach(btn=>{
      const t=(btn.textContent||'').trim();
      if(/וואטסאפ|WhatsApp/i.test(t))btn.classList.add('hy-send-main');
      if(/PDF/i.test(t))btn.classList.add('hy-pdf-action');
      if(/הוסף.*פריט|פריט חדש/.test(t))btn.classList.add('hy-add-item');
    });
  }

  function mobileFocus(){
    if(innerWidth>860)return;
    $$('input,select,textarea').forEach(el=>{if(!el.dataset.hyFocus){el.dataset.hyFocus='1';el.addEventListener('focus',()=>setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'center'}),180));}});
  }

  function run(){if(busy)return;busy=true;try{normalizeNavigation();hideLegacyInternalCosting();polishAiCopy();addWorkspaceIntro();simplifyChrome();enhanceActions();mobileFocus();}finally{busy=false;}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,100)}).observe(document.documentElement,{childList:true,subtree:true});
})();
