/* Jobs V2 — lightweight UX over existing saved quotes */
(function(){
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 function ensureTools(){
  const tab=$('#tab-orders'),list=$('#ordersList'); if(!tab||!list)return;
  if(!$('#hy-jobs-tools',tab)){
   const box=document.createElement('div');box.id='hy-jobs-tools';box.className='hy-jobs-tools';
   box.innerHTML='<div class="hy-jobs-title"><div><span>ניהול עבודה</span><h2>עבודות ולקוחות</h2></div><button type="button" class="primary" data-new-job>＋ הצעה חדשה</button></div><div class="hy-jobs-filters"><input type="search" placeholder="חפש לקוח, פרויקט או מספר הצעה" data-job-search><select data-job-filter><option value="all">כל הסטטוסים</option><option value="quote">הצעה</option><option value="approved">אושרה</option><option value="deposit">מקדמה</option><option value="production">בייצור</option><option value="install">להתקנה</option><option value="delivered">הושלם</option></select></div>';
   list.parentNode.insertBefore(box,list);
   $('[data-new-job]',box).onclick=()=>document.querySelector('nav.tabs button[data-tab="quote"]')?.click();
   $('[data-job-search]',box).addEventListener('input',filter);
   $('[data-job-filter]',box).addEventListener('change',filter);
  }
  filter();
 }
 function filter(){
  const tab=$('#tab-orders');if(!tab)return;const term=($('[data-job-search]',tab)?.value||'').trim().toLowerCase(),status=$('[data-job-filter]',tab)?.value||'all';
  $$('.order-card-wrap',tab).forEach(card=>{const text=(card.textContent||'').toLowerCase();const badge=$('.status-badge',card);const cls=badge?.className||'';const okText=!term||text.includes(term);const okStatus=status==='all'||cls.includes('status-'+status);card.style.display=okText&&okStatus?'':'none'});
 }
 const obs=new MutationObserver(()=>{if($('#tab-orders')?.style.display!=='none')ensureTools()});obs.observe(document.documentElement,{childList:true,subtree:true});
 document.addEventListener('click',e=>{if(e.target.closest('nav.tabs button[data-tab="orders"]'))setTimeout(ensureTools,80)});
 setTimeout(ensureTools,500);
})();