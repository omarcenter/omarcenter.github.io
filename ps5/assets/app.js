(function(){'use strict';
var supported=["9.00", "9.05", "9.20", "9.40", "9.60", "10.00", "10.01", "10.20", "10.40", "10.60", "11.00", "11.20", "11.40", "11.60", "12.00"], ua=navigator.userAgent||'', match=/PlayStation 5\/(\d+\.\d{2})(?!\d)/.exec(ua), firmware=match?match[1]:null;
var relapse=["12.02", "12.20", "12.40", "12.60", "12.70", "13.00", "13.20", "13.40", "13.42", "13.60"]; supported=supported.concat(relapse);
var select=document.getElementById('preview-firmware'), button=document.getElementById('launch');
function show(v){var ok=supported.indexOf(v)!==-1;
document.getElementById('route-title').textContent='تعديل PS5 · '+(v||'إصدار غير معروف');
document.getElementById('route-status').textContent=ok?'الملفات موجودة · التشغيل غير مؤكّد على الجهاز':'غير متاح حالياً';
document.getElementById('route-detail').textContent=ok?(relapse.indexOf(v)!==-1?'Relapse — ملفات محلية. بعد نجاح التشغيل اتبع تعليمات R2 الظاهرة لتحميل الأدوات.':'تشغيل ملفات PS5 المحلية. اتبع التعليمات التي تظهر بعد بدء التشغيل.'):'هذا الإصدار غير مدعوم بالملفات الحالية. لا يبدأ التشغيل.';
button.disabled=!(firmware&&ok);
document.getElementById('launch-label').textContent=firmware?(ok?'ابدأ تعديل PS5':'غير متاح لهذا الإصدار'):'افتح من متصفح PS5 للتشغيل';}
if(!firmware){document.getElementById('desktop-preview').hidden=false;show(select.value);select.onchange=function(){show(select.value);};}else{show(firmware);}
document.getElementById('close-tool').onclick=function(){
  var frame=document.getElementById('tool-frame');
  frame.onload=null;
  frame.removeAttribute('src');
  document.getElementById('tool-panel').hidden=true;
  document.getElementById('action-message').textContent='';
  show(firmware);
  button.focus();
};
button.onclick=function(){if(window.omarOfflineBusy){document.getElementById("action-message").textContent="انتظر اكتمال حفظ الملفات قبل التشغيل.";return;}if(firmware&&supported.indexOf(firmware)!==-1){var frame=document.getElementById('tool-frame');
var message=document.getElementById('action-message');
button.disabled=true;
message.textContent='جارٍ فتح أداة التشغيل داخل الصفحة…';
frame.onload=function(){
  message.textContent='تابع نتيجة التشغيل والتعليمات داخل الأداة أدناه.';
  frame.focus();
};
frame.src=relapse.indexOf(firmware)!==-1?'relapse/index.html':'host/index.html';
document.getElementById('tool-panel').hidden=false;
document.getElementById('tool-panel').scrollIntoView();}};
})();