/* Language-aware behavior that cannot be handled by DOM text replacement alone. */
(function(){
  const locale=()=>({he:'he-IL',ar:'ar',en:'en-US'}[window.CQ_I18N?.getLanguage?.()||localStorage.getItem('carpentry_quotes_language')||'he']||'he-IL');
  const lang=()=>window.CQ_I18N?.getLanguage?.()||localStorage.getItem('carpentry_quotes_language')||'he';

  // Locale-aware number formatting everywhere the app uses fmt().
  window.fmt=function(n){return (Math.round((Number(n)||0)*100)/100).toLocaleString(locale())};

  // Customer-facing WhatsApp quote message must match the selected UI language.
  window.quoteWhatsAppText=function(q){
    if(lang()==='ar') return `مرحباً ${q.clientName}،\nمرفق عرض السعر ${q.quoteNumber ? 'رقم '+q.quoteNumber+' ' : ''}لمشروع ${q.projectName}.\nالإجمالي للدفع: ₪${window.fmt(q.total)}${q.validUntil ? `\nالعرض صالح حتى ${new Date(q.validUntil).toLocaleDateString('ar')}` : ''}.\n${settings.bizName || 'ورشة نجارة'}${settings.bizPhone ? ` | ${settings.bizPhone}` : ''}`;
    if(lang()==='en') return `Hi ${q.clientName},\nAttached is ${q.quoteNumber ? 'quote '+q.quoteNumber+' ' : 'a quote '}for ${q.projectName}.\nTotal due: ₪${window.fmt(q.total)}${q.validUntil ? `\nValid until ${new Date(q.validUntil).toLocaleDateString('en-US')}` : ''}.\n${settings.bizName || 'Carpentry workshop'}${settings.bizPhone ? ` | ${settings.bizPhone}` : ''}`;
    return `שלום ${q.clientName},\nמצורפת הצעת מחיר ${q.quoteNumber ? 'מספר '+q.quoteNumber+' ' : ''}עבור ${q.projectName}.\nסה״כ לתשלום: ₪${window.fmt(q.total)}${q.validUntil ? `\nההצעה בתוקף עד ${new Date(q.validUntil).toLocaleDateString('he-IL')}` : ''}.\n${settings.bizName || 'נגרות'}${settings.bizPhone ? ` | ${settings.bizPhone}` : ''}`;
  };

  window.fallbackReminder=function(q,remaining){
    if(lang()==='ar'){const business=settings?.bizName?` من ${settings.bizName}`:'';return `مرحباً ${q.clientName}، كيف حالك؟ تذكير بسيط${business} بخصوص المبلغ المتبقي لمشروع ${q.projectName}، وقدره ₪${window.fmt(remaining)}. يسعدنا ترتيب الدفع في الوقت المناسب لك. شكراً جزيلاً 🙏`;}
    if(lang()==='en'){const business=settings?.bizName?` from ${settings.bizName}`:'';return `Hi ${q.clientName}, just a quick reminder${business} about the outstanding balance of ₪${window.fmt(remaining)} for ${q.projectName}. Please let us know a convenient time to arrange payment. Thank you 🙏`;}
    const business=settings?.bizName?` מ${settings.bizName}`:'';return `שלום ${q.clientName}, מה שלומך? תזכורת קצרה${business} לגבי יתרת התשלום עבור ${q.projectName}, בסך ₪${window.fmt(remaining)}. נשמח להסדיר את התשלום בזמן שנוח לך. תודה רבה 🙏`;
  };

  // Add language instruction to all AI calls (quote image, cut-list image and payment reminders).
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    try{
      const url=typeof input==='string'?input:(input?.url||'');
      if(url.includes('/api/claude')&&init?.body&&typeof init.body==='string'){
        const body=JSON.parse(init.body);const l=lang();
        if(l!=='he'&&Array.isArray(body.messages)){
          const instruction=l==='ar'
            ? '\n\nتعليمات اللغة: أعد جميع النصوص الموجهة للمستخدم باللغة العربية فقط. لا تُرجع أي كلمات أو أسماء أجزاء بالعبرية.'
            : '\n\nLanguage instruction: Return every user-facing text field in English only. Do not return Hebrew or Arabic labels, notes, descriptions, or part names.';
          body.messages=body.messages.map(m=>{
            if(typeof m.content==='string')return {...m,content:m.content+instruction};
            if(Array.isArray(m.content))return {...m,content:m.content.map((x,i)=>i===0&&x?.type==='text'?{...x,text:(x.text||'')+instruction}:x)};
            return m;
          });
          init={...init,body:JSON.stringify(body)};
        }
      }
    }catch(e){}
    return nativeFetch(input,init);
  };

  // Refresh dynamic sections when language changes so dates/numbers/status content are regenerated in the right locale.
  document.addEventListener('cq:languagechange',()=>{
    try{renderPreview?.()}catch(e){}
    try{renderOrders?.()}catch(e){}
    try{renderCutlistSummary?.()}catch(e){}
  });
})();
