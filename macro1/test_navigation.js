/* Regression: dynamic preparation links, hidden panels and browser history. */
const fs=require('fs'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');
let assertions=0;const check=(v,label)=>{assert.ok(v,label);assertions++};
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(fs.readFileSync(__dirname+'/index.html','utf8'),{runScripts:'dangerously',url:'https://example.test/MacroLab-Shock-Simulator/macro1/#route',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true});w.Element.prototype.scrollIntoView=()=>{};}});
const w=dom.window,d=w.document;
const active=id=>!d.getElementById(id).hidden&&d.getElementById('tab-'+id).getAttribute('aria-selected')==='true';
const wait=()=>new Promise(resolve=>setTimeout(resolve,30));
(async()=>{
 d.getElementById('class-tab-4').click();d.getElementById('classReadCheck').click();
 for(const id of ['din','lm']){
  d.querySelector(`#classOverview a[href="#${id}"]`).click();
  check(active(id),`Clase 4 ${id} visible and selected`);check(w.location.hash==='#'+id,'URL follows click');
  check(d.activeElement.id===id,'keyboard focus leaves hidden route');
  w.history.back();await wait();check(active('route'),'back restores route');
  check(d.getElementById('class-tab-4').getAttribute('aria-selected')==='true','class preserved');check(d.getElementById('classReadCheck').checked,'progress preserved');
  w.history.forward();await wait();check(active(id),'forward restores lab');
  d.getElementById('tab-route').click();
 }
 for(let c=1;c<=7;c++){
  d.getElementById('class-tab-'+c).click();
  for(const a of [...d.querySelectorAll('#classOverview a[href^="#"]')]){
   const id=a.hash.slice(1);a.click();check(active(id),`dynamic Class ${c} ${id}`);d.getElementById('tab-route').click();
  }
 }
 w.location.hash='din';await wait();check(active('din'),'native fragment change activates panel');
 w.location.hash='moneyFeedback';await wait();check(active('din'),'nested anchor preserves visible panel');
 w.location.hash='main';await wait();check(active('din'),'skip link does not hide all panels');
 const current=w.location.hash;
 d.getElementById('tab-lm').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));check(active('is'),'arrow-key navigation');
 check(errors.length===0,errors.join('\n'));
 console.log(`${assertions} navigation assertions passed`);w.close();
})().catch(e=>{console.error(e);w.close();process.exitCode=1});
