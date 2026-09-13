/* Materials V2 — price migration + clearer price-list UX */
(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const TARGETS={
    'MDF לבן':{name:'MDF לבן (שלייף לק)',price:2500},
    'פורניר אלון':{name:'פורניר אלון',price:1800},
    'עץ מלא':{name:'עץ מלא',price:3000}
  };
  const MIGRATION_KEY='materials_price_migration_2026_09_13_v1';
  async function migrate(){
    if(typeof settings==='undefined'||!settings||!Array.isArray(settings.materials))return false;
    if(localStorage.getItem(MIGRATION_KEY)==='1')return true;
    let changed=false;
    settings.materials=settings.materials.map(m=>{
      const hit=TARGETS[m.name];
      if(!hit)return m;
      changed=true;
      return {...m,name:hit.name,price:hit.price};
    });
    if(changed&&typeof persistSettings==='function'){
      const ok=await persistSettings();
      if(ok){
        if(typeof renderMaterialSelect==='function')renderMaterialSelect();
        if(typeof renderSettingsForm==='function')renderSettingsForm();
        if(typeof renderPreview==='function')renderPreview();
      }
    }
    localStorage.setItem(MIGRATION_KEY,'1');
    return true;
  }
  function enhancePriceList(){
    const tab=$('#tab-settings');if(!tab||$('.hy-material-manager',tab))return;
    const list=$('#materialsSettingsList',tab);if(!list)return;
    const manager=document.createElement('section');
    manager.className='hy-material-manager';
    manager.innerHTML='<div><span class="hy-eyebrow">מחירון חומרים</span><h3>החומרים והמחירים שלך</h3><p>אפשר לשנות שם ומחיר לכל חומר, ולהוסיף כמה חומרים שרוצים.</p></div><button type="button" class="primary" data-add-material>＋ הוסף חומר</button>';
    list.parentNode.insertBefore(manager,list);
    $('[data-add-material]',manager).addEventListener('click',()=>{
      if(typeof addMaterialRow==='function')addMaterialRow();
      setTimeout(()=>{
        const rows=$$('.mat-row',list), last=rows[rows.length-1];
        last?.querySelector('input')?.focus();
        last?.scrollIntoView({behavior:'smooth',block:'center'});
      },50);
    });
    const oldAdd=$$('button.link',tab).find(b=>/הוספת סוג חומר|הוסף חומר/.test(b.textContent||''));
    if(oldAdd)oldAdd.textContent='＋ הוסף חומר נוסף';
  }
  async function init(){
    let tries=0;
    while((typeof settings==='undefined'||!settings)&&tries<30){await new Promise(r=>setTimeout(r,150));tries++;}
    await migrate();
    enhancePriceList();
    const nav=document.querySelector('nav.tabs button[data-tab="settings"]');
    nav?.addEventListener('click',()=>setTimeout(enhancePriceList,50));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();