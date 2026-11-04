/* Omar Center PS4 portal AppCache, 2026-11-04. */
(function () {
  'use strict';
  var ac = window.applicationCache;
  var status = document.getElementById('offline-status');
  var reload = document.getElementById('offline-reload');
  var pending = !!ac, running = false;
  function busy() { return !!ac && (ac.status === 2 || ac.status === 3); }
  function changed(message) {
    status.textContent = message;
    var event = document.createEvent('Event'); event.initEvent('omar-cache-change', false, false); window.dispatchEvent(event);
  }
  window.OmarOffline = {
    blocked: function () { return pending || busy() || (!!ac && ac.status === 4); },
    begin: function () { running = true; reload.hidden = true; }
  };
  reload.addEventListener('click',function(){if(!running)location.reload();});
  function ready() { pending = false; changed('تم حفظ واجهة الموقع وملفات تشغيل PS4 — جاهز للأوفلاين.'); }
  function updated() {
    pending = false;
    // Reload before running: swapCache alone cannot replace modules already loaded.
    changed('تم حفظ تحديث جديد. اضغط تحميل النسخة المحفوظة الجديدة قبل التشغيل.');
    reload.hidden = running;
  }
  function failed() {
    pending = false;
    if (ac && (ac.status === 1 || ac.status === 4)) {
      if (ac.status === 4) { updated(); return; }
      changed('النسخة المحفوظة جاهزة للأوفلاين؛ تعذّر فحص تحديث جديد.');
    } else changed('لم يكتمل الحفظ للأوفلاين. أبقِ الإنترنت متصلاً وأعد فتح الموقع حتى تظهر رسالة اكتمال الحفظ.');
  }
  if (!ac) { pending = false; changed('هذا المتصفح لا يدعم حفظ PS4 للأوفلاين. افتح الموقع من متصفح جهاز PS4.'); return; }
  ac.addEventListener('checking',function(){pending=true;changed('جارٍ فحص ملفات الموقع المحفوظة…');});
  ac.addEventListener('downloading',function(){pending=true;changed('جارٍ حفظ الواجهة وملفات التشغيل؛ لا تقطع الإنترنت…');});
  ac.addEventListener('progress',function(e){if(e.total)changed('حفظ الموقع للأوفلاين: '+Math.round(e.loaded/e.total*100)+'% — انتظر الاكتمال');});
  ac.addEventListener('cached',ready);
  ac.addEventListener('noupdate',ready);
  ac.addEventListener('updateready',updated);
  ac.addEventListener('error',failed);
  ac.addEventListener('obsolete',failed);
  if (ac.status === 1) ready();
  else if (ac.status === 4) updated();
})();
