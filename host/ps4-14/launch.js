/* Omar Center integration, 2026-11-03. The upstream jb.js referrer guard is retained. */
(function () {
  'use strict';
  var state = document.getElementById('state'), cache = document.getElementById('cache'), button = document.getElementById('start');
  var match = /PlayStation\s+4[\/ ](\d+)\.(\d{1,2})(?!\d)/i.exec(navigator.userAgent || '');
  var fw = match ? parseInt(match[1],10) + '.' + ('0' + match[2]).slice(-2) : null;
  if (fw !== '14.00') { state.textContent = 'هذا المسار مخصص لجهاز PS4 بإصدار 14.00 فقط.'; return; }
  var started = false;
  function start() {
    if (started) return;
    started = true; button.disabled = true;
    state.textContent = 'جارٍ بدء GoldHEN — انتظر نتيجة الأداة';
    location.href = 'jb.html?log=1&afterglow=run&mode=goldhen';
  }
  function ready() {
    cache.textContent = 'ملفات المسار محفوظة. نجاح الحفظ لا يعني نجاح التفعيل.';
    state.textContent = 'جاهز لتشغيل GoldHEN · 14.00';
    button.hidden = false; button.focus();
    // Auto-run only in the portal after its explicit launch click.
    try { if (parent !== window && parent.location.origin === location.origin && parent.document.getElementById('run-frame').contentWindow === window) start(); } catch (e) {}
  }
  function failed() {
    state.textContent = 'لم يكتمل الحفظ دون إنترنت';
    cache.textContent = 'أبقِ الإنترنت متصلاً واضغط تشغيل، أو أعد فتح الموقع لإعادة الحفظ.';
    button.hidden = false; button.focus();
  }
  button.addEventListener('click', start);
  var ac = window.applicationCache;
  if (!ac) { failed(); return; }
  state.textContent = 'جارٍ فحص وحفظ ملفات إصدار 14.00…';
  ac.addEventListener('progress',function(e){if(e.total)cache.textContent='حفظ الملفات: '+Math.round(e.loaded/e.total*100)+'%';});
  ac.addEventListener('cached',ready);
  ac.addEventListener('noupdate',ready);
  ac.addEventListener('updateready',function(){try{ac.swapCache();}catch(e){} location.reload();});
  ac.addEventListener('error',failed);
  ac.addEventListener('obsolete',failed);
  if (ac.status === 1) ready();
  else if (ac.status === 4) { try{ac.swapCache();}catch(e){} location.reload(); }
})();
