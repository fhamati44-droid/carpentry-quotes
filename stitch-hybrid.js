/* Carpentry Quotes — product architecture v2 */
(function(){
  let busy=false;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  function showHome(){
    const dash=$('#hy-dashboard'); if(dash) dash.classList.remove('hy-dashboard-hidden');
    $$('main > section[id^="tab-"]').forEach(s=>s.classList.add('hy-tab-hidden'));
    $$('nav.tabs button').forEach(b=>b.classList.remove('active'));
    $('nav.tabs button[data-hy-home]')?.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function clickTab(tab){
    const dash=$('#hy-dashboard'); if(dash) dash.classList.add('hy-dashboard-hidden');
    $$('main > section[id^="tab-"]').forEach(s=>s.classList.remove('hy-tab-hidden'));
    $('nav.tabs button[data-tab="'+tab+'"]')?.click();
    $('nav.tabs button[data-hy-home]')?.classList.remove('active');
    window.scrollTo({top:0,behavior:'smooth'});
    if(tab==='settings') setTimeout(()=>$('#hy-price-manager')?.scrollIntoView({behavior:'smooth',block:'start'}),120);
  }
  function normalizeNavigation(){
    const nav=$('nav.tabs');
    if(nav&&!$('button[data-hy-home]',nav)){
      const home=document.createElement('button');home.type='button';home.dataset.hyHome='1';home.innerHTML='<span class="tab-icon">⌂</span><span>בית</span>';home.addEventListener('click',showHome);nav.insertBefore(home,nav.firstElementChild);
    }
    const labels={quote:['＋','הצעה'],cutlist:['▦','חיתוך'],orders:['◎','עבודות'],settings:['₪','מחירון']};
    $$('nav.tabs button[data-tab]').forEach(btn=>{const cfg=labels[btn.dataset.tab];if(!cfg)return;const icon=$('.tab-icon',btn);if(icon)icon.textContent=cfg[0];const spans=$$('span',btn);if(spans.length>1)spans[spans.length-1].textContent=cfg[1]});
  }
  function addDashboard(){const main=$('main');if(!main||$('#hy-dashboard'))return;const dash=document.createElement('section');dash.id='hy-dashboard';dash.className='hy-dashboard';dash.innerHTML=`<div class="hy-dash-head"><div><span class="hy-eyebrow">סדנת העבודה שלי</span><h2>מה עושים עכשיו?</h2><p>כל פעולה מרכזית במקום אחד.</p></div><button class="primary hy-new-quote" type="button">＋ הצעת מחיר חדשה</button></div><div class="hy-dash-actions"><button type="button" data-go="quote"><b>＋</b><strong>הצעה חדשה</strong><small>לקוח → עבודה → מחיר → שליחה</small></button><button type="button" data-go="orders"><b>◎</b><strong>עבודות ולקוחות</strong><small>הצעות, סטטוס ותשלומים</small></button><button type="button" data-go="settings"><b>₪</b><strong>המחירון שלי</strong><small>עדכון חומרים ומחיר למ״ר</small></button><button type="button" data-go="cutlist"><b>▦</b><strong>חיתוך</strong><small>מידות ורשימת חלקים לייצור</small></button></div>`;main.insertBefore(dash,main.firstElementChild);$$('[data-go]',dash).forEach(b=>b.addEventListener('click',()=>clickTab(b.dataset.go)));$('.hy-new-quote',dash)?.addEventListener('click',()=>clickTab('quote'));showHome();}
  function hideLegacyInternalCosting(){const terms=['תכנון','ייצור','תקורה'];$$('label,.field,.row2,.cost-row,.setting-row').forEach(el=>{const txt=(el.textContent||'').trim();if(terms.some(t=>txt.includes(t))){const target=el.matches('label')?(el.closest('.row2')||el.parentElement):el;if(target)target.classList.add('hybrid-hide-cost')}})}
  function polishAiCopy(){$$('.ai-box .hint,.ai-box .warn,.ai-status').forEach(el=>{if((el.textContent||'').includes('דיוק'))el.textContent='ה-AI מציע נתונים ראשוניים. יש לאמת מידות לפני שליחת הצעה.'})}
  function addWorkspaceIntro(){const quote=$('#tab-quote');if(!quote||$('.hy-workspace',quote))return;const hero=document.createElement('section');hero.className='hy-workspace';hero.innerHTML=`<div><span class="hy-eyebrow">יצירת הצעה</span><h2>הצעה מקצועית בחמישה צעדים</h2><p>ממלאים רק מה שצריך. אפשר לחזור ולערוך בכל שלב.</p></div><div class="hy-flow"><span class="active">1 <b>לקוח</b></span><span>2 <b>עבודה</b></span><span>3 <b>פריטים</b></span><span>4 <b>מחיר</b></span><span>5 <b>שליחה</b></span></div>`;quote.insertBefore(hero,quote.firstElementChild)}
  function promoteMaterialPriceEditor(){
    const tab=$('#tab-settings'), list=$('#materialsSettingsList');
    if(!tab||!list||$('#hy-price-manager'))return;
    const body=list.closest('.panel-body'); if(!body)return;
    const label=$$('label',body).find(l=>/סוגי חומרים.*מחיר למ״ר/.test(l.textContent||''));
    const addBtn=list.nextElementSibling?.matches('button')?list.nextElementSibling:null;
    const card=document.createElement('section');card.id='hy-price-manager';card.className='hy-price-manager';
    card.innerHTML='<div class="hy-price-head"><div><span class="hy-eyebrow">המחירון שלי</span><h3>חומרים ומחיר למ״ר</h3><p>עדכן כאן את סוג החומר והמחיר שלך. כל הצעה חדשה משתמשת במחיר הזה אוטומטית.</p></div><div class="hy-price-cols"><span>חומר</span><span>₪ למ״ר</span></div></div>';
    body.insertBefore(card,body.firstChild);
    if(label) label.remove();
    card.appendChild(list);
    if(addBtn) card.appendChild(addBtn);
    const save=document.createElement('button');save.type='button';save.className='primary hy-save-prices';save.textContent='שמור מחירון';save.addEventListener('click',()=>{if(typeof saveSettings==='function')saveSettings()});card.appendChild(save);
  }
  function emphasizeMaterialPricing(){const settingsTab=$('#tab-settings');if(!settingsTab)return;const label=$$('label',settingsTab).find(l=>/סוגי חומרים.*מחיר למ״ר/.test(l.textContent||''));if(label&&!label.dataset.hyPriceReady){label.dataset.hyPriceReady='1';label.id='materialPricingSettings'}}
  async function showAiConfigState(){
    if(document.body.dataset.hyAiChecked)return;document.body.dataset.hyAiChecked='1';
    try{
      const r=await fetch('/api/config',{cache:'no-store'}); if(!r.ok)return; const cfg=await r.json();
      if(cfg.aiConfigured!==false)return;
      $$('.ai-box').forEach(box=>{
        if($('.hy-ai-config-warning',box))return;
        const w=document.createElement('div');w.className='hy-ai-config-warning';w.innerHTML='<b>AI עדיין לא מחובר</b><span>צריך להוסיף ב־Vercel את המשתנה GROQ_API_KEY ואז לבצע Redeploy.</span>';
        box.insertBefore(w,box.firstChild);
        $('button[id^="aiAnalyzeBtn"]',box)?.setAttribute('disabled','disabled');
      });
    }catch(e){}
  }
  function simplifyChrome(){const journey=$('.journey');if(journey)journey.classList.add('hy-legacy-journey');const trust=$('.trust-row');if(trust)trust.classList.add('hy-trust');$$('body *').forEach(el=>{const t=(el.textContent||'').trim();if(el.children.length<4&&/מצב מקומי.*Supabase/.test(t))el.classList.add('hy-hide-dev')})}
  function moveCustomerFirst(){const quote=$('#tab-quote');if(!quote||quote.dataset.hyOrdered)return;const customerLabel=$$('label',quote).find(l=>/שם לקוח/.test(l.textContent||''));if(!customerLabel)return;const customerPanel=customerLabel.closest('.panel');const grid=$('.grid2',quote);if(customerPanel&&grid&&customerPanel.parentElement===grid){grid.insertBefore(customerPanel,grid.firstElementChild);customerPanel.classList.add('hy-customer-first');quote.dataset.hyOrdered='1'}}
  function collapseAiOnMobile(){if(innerWidth>860)return;$$('.ai-box').forEach(box=>{if(box.dataset.hyCollapsed)return;box.dataset.hyCollapsed='1';box.classList.add('hy-ai-collapsed');const trigger=document.createElement('button');trigger.type='button';trigger.className='hy-ai-trigger';trigger.innerHTML='<span>📷</span><b>עזרה מ-AI מתמונה</b><small>אופציונלי — אפשר גם למלא ידנית</small>';trigger.addEventListener('click',()=>{box.classList.toggle('hy-ai-open');trigger.classList.toggle('open')});box.parentNode.insertBefore(trigger,box)})}
  function enhanceActions(){$$('button').forEach(btn=>{const t=(btn.textContent||'').trim();if(/וואטסאפ|WhatsApp/i.test(t))btn.classList.add('hy-send-main');if(/PDF/i.test(t))btn.classList.add('hy-pdf-action')})}
  function mobileFocus(){if(innerWidth>860)return;$$('input,select,textarea').forEach(el=>{if(!el.dataset.hyFocus){el.dataset.hyFocus='1';el.addEventListener('focus',()=>setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'center'}),180))}})}
  function run(){if(busy)return;busy=true;try{normalizeNavigation();addDashboard();hideLegacyInternalCosting();polishAiCopy();addWorkspaceIntro();emphasizeMaterialPricing();promoteMaterialPriceEditor();simplifyChrome();moveCustomerFirst();collapseAiOnMobile();enhanceActions();mobileFocus();showAiConfigState()}finally{busy=false}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,150)}).observe(document.documentElement,{childList:true,subtree:true});
})();