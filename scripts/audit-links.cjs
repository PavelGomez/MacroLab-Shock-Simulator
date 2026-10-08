/* Inventory of every static occurrence plus generated class/activity contexts.
 * Does not assert browser verification: that evidence is recorded separately. */
const fs=require('fs'),path=require('path'),{JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..'),base='https://pavelgomez.github.io/MacroLab-Shock-Simulator/';
const out=path.join(root,'docs/auditoria-enlaces-2026-10-08');
const rows=[],pages=[];
function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){if(['.git','node_modules','sources','docs'].includes(e.name))continue;const f=path.join(p,e.name);if(e.isDirectory())walk(f);else if(e.name.endsWith('.html'))pages.push(path.relative(root,f));}}
walk(root);
function collect(doc,page,context,selector='a[href],button,[role="tab"]'){
 [...doc.querySelectorAll(selector)].forEach((el,i)=>{
 const href=el.getAttribute('href'),action=el.dataset.tab||el.dataset.go||el.dataset.openLab||el.getAttribute('onclick')||el.dataset.classAction||el.dataset.loopAction||el.id;
 if(!href&&!action)return;
 const text=(el.textContent||el.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim();
 if(!text)return;
 let final=href?new URL(href,new URL(page,base)).href:'control:'+action;
 let result='control: requiere comprobación de interacción',problem='';
 if(href&&final.startsWith(base)){
 const u=new URL(final),rel=decodeURIComponent(u.pathname.slice(new URL(base).pathname.length)),f=path.join(root,rel.endsWith('/')?rel+'index.html':rel);
 if(!fs.existsSync(f)){result='destino local ausente';problem='archivo inexistente';}
 else {result='archivo local disponible';if(u.hash&&f.endsWith('.html')){const d=f===path.join(root,page)?doc:new JSDOM(fs.readFileSync(f,'utf8')).window.document;const target=d.getElementById(decodeURIComponent(u.hash.slice(1)));if(!target){result='ancla ausente';problem='fragmento inexistente';}else result='archivo y ancla disponibles; visibilidad por comprobar';}}
 }else if(href)result='externo: pendiente';
 rows.push({page,context,location:el.id||`${el.tagName.toLowerCase()}[${i+1}]`,text,declared:href||action,final,promise:el.hasAttribute('download')?'descarga':href?'navegación':'acción',result,problem,correction:'',evidence:'inspección DOM/código; no equivale a clic en navegador'});
 });
}
for(const page of pages){const dom=new JSDOM(fs.readFileSync(path.join(root,page),'utf8'));collect(dom.window.document,page,'estático');dom.window.close();}
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(fs.readFileSync(path.join(root,'macro1/index.html'),'utf8'),{runScripts:'dangerously',url:base+'macro1/index.html',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true});w.Element.prototype.scrollIntoView=()=>{};}});
const w=dom.window,d=w.document;
for(let cls=1;cls<=7;cls++){
 d.querySelector('#class-tab-'+cls).click();collect(d,'macro1/index.html','Clase '+cls+' preparación','#classOverview a');
 for(let step=0;step<6;step++){
  try { w.eval(`classState[activeClass].guidedDrillId=GUIDED_DIAGNOSTICS[activeClass]?.defaultDrill||(activeClass==="1"?"C1-DRILL-EVIDENCE":"C2-DRILL-COVERAGE");classState[activeClass].step=${step};classState[activeClass].unlocked=5;renderClassWorkbench()`); } catch(e) {errors.push(`Cobertura sintética Clase ${cls} paso ${step+1}: ${e.message}`);continue;}
  collect(d,'macro1/index.html',`Clase ${cls} paso ${step+1}`,'#classWorkbench a,#classWorkbench button');
 }
}
for(const sel of d.querySelectorAll('.activity select'))for(let i=1;i<sel.options.length;i++){sel.selectedIndex=i;sel.dispatchEvent(new w.Event('change'));collect(sel.closest('.activity'), 'macro1/index.html','Actividad '+sel.options[i].text,'.activity a, a, button');}
dom.window.close();
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'inventory-raw.json'),JSON.stringify({pages,rows,errors},null,2));
console.log(JSON.stringify({pages:pages.length,occurrences:rows.length,unique:new Set(rows.map(r=>r.final)).size,errors,problems:rows.filter(r=>r.problem)},null,2));
