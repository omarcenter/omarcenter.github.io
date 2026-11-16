const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function env(fw,status=1,online=true){
 const els={},events={},ace={},storage={};let reloads=0,swaps=0;
 const el=id=>els[id]||(els[id]={hidden:false,disabled:false,textContent:'',events:{},addEventListener(k,f){this.events[k]=f},focus(){},contentWindow:{focus(){}},contentDocument:{createElement(){return{}},head:{appendChild(){}}}});
 const ac={status,addEventListener(k,f){ace[k]=f},swapCache(){swaps++}};
 const win={applicationCache:ac,addEventListener(k,f){events[k]=f},dispatchEvent(e){if(events[e.type])events[e.type]()}};
 const ctx={window:win,parent:win,navigator:{userAgent:fw===null?'Desktop':`Mozilla PlayStation 4/${fw}`,onLine:online},document:{getElementById:el,addEventListener(){},createEvent(){return{initEvent(t){this.type=t}}}},sessionStorage:{getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v},location:{reload(){reloads++}},console};
 vm.createContext(ctx);return{ctx,el,ac,ace,win,events,reloads:()=>reloads,swaps:()=>swaps};
}
const run=(e,p)=>vm.runInContext(read(p),e.ctx);
const after=['12.00','12.02','12.50','12.52','13.00','13.02','13.04','13.50','13.52','14.00','14.02'];
const older=['9.00','9.03','9.04','9.50','9.51','9.60','10.00','10.01','10.50','10.70','10.71','11.00','11.02','11.50','11.52',...after.slice(0,-2)];
for(const fw of [...older,'14.00','14.02']){const e=env(fw);run(e,'assets/offline.js');run(e,'assets/app.js');assert(!e.el('launch').disabled,fw);e.el('launch').events.click();assert.equal(e.el('run-frame').src,fw.startsWith('14.')?'host/ps4-14/index.html':'host/index.html');assert.equal(e.ctx.location.href,undefined);}
for(const fw of after){const e=env(fw);run(e,'assets/app.js');e.el('launch-method').events.change.call({value:'afterglow'});e.el('launch').events.click();assert.equal(e.el('run-frame').src,'host/ps4-14/index.html');run(e,'host/ps4-14/launch.js');e.el('start').events.click();assert.equal(e.ctx.location.href,'jb.html?log=1&afterglow=run&mode=goldhen');}
for(const fw of ['14.01','14.03','14.20','14.020','13.51','12.01','15.00',null]){const e=env(fw);run(e,'assets/app.js');assert(e.el('launch').disabled,fw);e.el('launch').events.click();assert.equal(e.el('run-frame').src,undefined);if(fw!==null){run(e,'host/ps4-14/launch.js');assert.equal(e.el('start').events.click,undefined);}}
for(const online of [true,false])for(const status of [0,1,2,3,4,5]){const e=env('14.02',status,online);run(e,'assets/offline.js');run(e,'assets/app.js');if(!online)assert.equal(e.win.OmarOffline.blocked(),status!==1);if([2,3,4].includes(status))assert(e.win.OmarOffline.blocked());e.el('launch').events.click();if(e.win.OmarOffline.blocked())assert.equal(e.el('run-frame').src,undefined);}
for(const status of [2,3]){const e=env('14.02',status);run(e,'host/ps4-14/launch.js');e.el('start').events.click();assert.equal(e.ctx.location.href,undefined);e.ac.status=1;e.ace.cached();assert.equal(e.ctx.location.href,'jb.html?log=1&afterglow=run&mode=goldhen');}
for(const status of [0,2,3,5]){const e=env('14.02',status,false);run(e,'host/ps4-14/launch.js');e.el('start').events.click();assert.equal(e.ctx.location.href,undefined);}
{const e=env('14.02',4);run(e,'host/ps4-14/launch.js');assert.equal(e.reloads(),1);assert.equal(e.swaps(),1);e.el('start').events.click();assert.equal(e.reloads(),1);assert.equal(e.ctx.location.href,undefined);}
{const e=env('14.02',2);run(e,'assets/offline.js');e.ac.status=1;e.ace.error();assert(!e.win.OmarOffline.blocked());e.ac.status=4;e.ace.updateready();assert(e.win.OmarOffline.blocked());}
console.log('PASS: 26 default routes, 11 Afterglow routes, 8 rejected/desktop gates; 12 portal cache states, launcher pending/download/offline/update and reload-loop handling. No exploit executed.');
