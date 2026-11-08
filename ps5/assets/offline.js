(function(){'use strict';
var box=document.getElementById('offline-status'),reload=document.getElementById('offline-reload'),ac;
function say(s){box.textContent=s;}
try{ac=window.applicationCache;}catch(e){}
if(!ac){
  if(!navigator.serviceWorker){
    say('هذا المتصفح لا يدعم حفظ ملفات الموقع للأوفلاين.');
    return;
  }
  function workerReady(){
    window.omarOfflineBusy=false;
    say('اكتمل حفظ ملفات الموقع. اختبر التشغيل بعد فصل الإنترنت وإعادة تشغيل الجهاز.');
  }
  function workerFailed(){
    window.omarOfflineBusy=false;
    say('تعذّر حفظ ملفات الموقع. أعد فتح الصفحة والإنترنت متصل.');
  }
  if(navigator.serviceWorker.controller)workerReady();
  if(!navigator.serviceWorker.controller){
    window.omarOfflineBusy=true;
    say('جارٍ حفظ ملفات التشغيل؛ أبقِ الإنترنت متصلاً.');
  }
  navigator.serviceWorker.addEventListener('controllerchange',workerReady);
  navigator.serviceWorker.register('sw.js').then(function(registration){
    var worker=registration.installing || registration.waiting;
    if(!worker)return;
    function check(){if(worker.state==='redundant' && !navigator.serviceWorker.controller)workerFailed();}
    worker.addEventListener('statechange',check);
    check();
  }).catch(workerFailed);
  return;
}
window.omarOfflineBusy=false;
function ready(){window.omarOfflineBusy=false;say('اكتمل حفظ ملفات الموقع في هذا المتصفح. جرّب إعادة فتح نفس الرابط بدون إنترنت للتأكد على جهازك.');}
function updateReady(){window.omarOfflineBusy=true;say('اكتمل تنزيل نسخة جديدة. اضغط الزر لتفعيلها قبل التشغيل.');reload.hidden=false;}
reload.onclick=function(){try{if(ac.status===ac.UPDATEREADY)ac.swapCache();location.reload();}catch(e){say('تعذّر تفعيل النسخة. أعد فتح الموقع والإنترنت متصل.');}};
ac.addEventListener('checking',function(){say('جارٍ فحص النسخة المحفوظة والتحديثات…');});
ac.addEventListener('downloading',function(){window.omarOfflineBusy=true;say('جارٍ حفظ ملفات التشغيل؛ أبقِ الصفحة مفتوحة والإنترنت متصل.');});
ac.addEventListener('progress',function(e){window.omarOfflineBusy=true;say(e.total?'جارٍ الحفظ: '+Math.floor(e.loaded/e.total*100)+'٪ ('+e.loaded+'/'+e.total+')':'جارٍ حفظ الملفات…');});
ac.addEventListener('cached',ready);
ac.addEventListener('noupdate',ready);
ac.addEventListener('updateready',updateReady);
ac.addEventListener('obsolete',function(){window.omarOfflineBusy=false;say('النسخة المحفوظة لم تعد متاحة. افتح الموقع مع الإنترنت لحفظها مجدداً.');});
ac.addEventListener('error',function(){window.omarOfflineBusy=false;if(ac.status===ac.IDLE){say('توجد نسخة محفوظة، لكن تعذّر فحص التحديث. جرّب تشغيلها؛ قد تكون أقدم من الموقع.');}else{say('لم يكتمل الحفظ. لا تفصل الإنترنت؛ قد يكون المتصفح لا يدعم الحفظ أو المساحة غير كافية.');}});
if(ac.status===ac.IDLE)ready();else if(ac.status===ac.UPDATEREADY)updateReady();else if(ac.status===ac.DOWNLOADING){window.omarOfflineBusy=true;say('جارٍ حفظ الملفات…');}else say('جارٍ تجهيز الحفظ. انتظر رسالة اكتمال حفظ الملفات.');
})();