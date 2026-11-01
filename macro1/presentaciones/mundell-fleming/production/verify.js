/* Pruebas del modelo y del controlador con DOM simulado. No es un navegador. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const crypto=require('crypto'),digest=t=>crypto.createHash('sha256').update(t).digest('hex');
const {parseHTML}=require(process.env.MF_DOM_MODULE||'/private/tmp/mf-qa-dom/node_modules/linkedom');
const root=path.resolve(__dirname,'..'),out=path.join(root,'verification');
const report={method:'DOM simulado con linkedom; audio simulado. MP3 verificados por separado. No prueba de navegador.',checks:[],assertions:0};
function ok(v,msg){assert.ok(v,msg);report.assertions++;report.checks.push(msg);}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(w){for(let i=0;i<150;i++){if(!w.MFPlayer.state().loading)return;await wait(10)}throw Error('No termina carga simulada');}
function load(store={},blocked=false,quantum=0){
 const {window:dom}=parseHTML(fs.readFileSync(path.join(root,'index.html'),'utf8'));const doc=dom.document;
 // Linkedom usa un proxy con propiedades globales compartidas: el sandbox debe ser explícito.
 const w={document:doc,HTMLElement:dom.HTMLElement,Event:dom.Event,addEventListener(){}};w.window=w;
 doc._activeElement=doc.body;Object.defineProperty(doc,'activeElement',{get:()=>doc._activeElement});w.HTMLElement.prototype.focus=function(){this.ownerDocument._activeElement=this};w.HTMLElement.prototype.scrollIntoView=function(){};
 const localStorage={getItem:k=>{if(blocked)throw Error('blocked');return store[k]||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');store[k]=String(v)},removeItem:k=>{delete store[k]}};
 Object.assign(w,{console,setTimeout,clearTimeout,innerWidth:1440,localStorage});
 const dialog=doc.getElementById('consultation');dialog.open=false;dialog.showModal=()=>{dialog.open=true};dialog.close=()=>{dialog.open=false};
 for(const el of doc.querySelectorAll('select'))Object.defineProperty(el,'value',{writable:true,value:el.querySelector('[selected]')?.value||el.querySelector('option')?.value});
 const a=doc.getElementById('audio');let paused=true,t=0,duration=1,readyState=0;
 Object.defineProperties(a,{paused:{get:()=>paused},currentTime:{get:()=>t,set:v=>{t=quantum?Math.floor(v/quantum)*quantum:v;queueMicrotask(()=>a.dispatchEvent(new w.Event('timeupdate')))}},duration:{get:()=>duration},readyState:{get:()=>readyState},src:{get:()=>a.getAttribute('src'),set:v=>{a.setAttribute('src',v);readyState=0}}});
 a.load=()=>{readyState=0;const src=a.src;setTimeout(()=>{if(src!==a.src)return;duration=w.Lesson.chapters.find(c=>c.audio===src).duration;readyState=1;a.dispatchEvent(new w.Event('loadedmetadata'));},0)};
 a.pause=()=>{if(!paused){paused=true;a.dispatchEvent(new w.Event('pause'))}};a.play=async()=>{paused=false;a.dispatchEvent(new w.Event('play'))};
 a.advance=sec=>{if(paused)return;t=Math.min(duration,t+sec);a.dispatchEvent(new w.Event('timeupdate'));if(t>=duration){paused=true;a.dispatchEvent(new w.Event('ended'))}};
 const context=vm.createContext(w);
 for(const f of ['model.js','visuals.js','lesson.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',f),'utf8'),context,{filename:f});
 return {w,doc,a,store,click:q=>{const el=doc.querySelector(q);assert.ok(el,'Existe '+q);el.focus();el.click();},input:(q,v)=>{const el=doc.querySelector(q);el.value=v;el.dispatchEvent(new w.Event('input',{bubbles:true}));}};
}
(async()=>{
 const x=load(),{w,doc,a}=x;await ready(w);
 ok(w.MFPlayer.state().paused,'La apertura no reproduce automáticamente');
 ok(w.MFPlayer.state().stop,'La detención al final de capítulo comienza activada');
 ok(doc.querySelectorAll('[data-chapter]').length===7,'Siete capítulos en el índice');
 const expected=[[3300,900,1450,-10],[3300,800,1450,-30],[3500,1100,1550,10],[3400,900,1500,-20],[3300,900,1450,-10],[3400,1000,1500,0],[3350,900,1475,-15]];
 for(let i=0;i<expected.length;i++){
  const r=w.MF.scenarios[i].result;['Y','E','m','XN'].forEach((k,j)=>ok(Math.abs(r[k]-expected[i][j])<1e-9,`${w.MF.scenarios[i].label}: ${k} correcto`));
  ok(r.residuals.every(v=>Math.abs(v)<1e-9),'Los tres cierres: '+w.MF.scenarios[i].label);
  ok(Math.abs(r.X-r.IM-r.XN)<1e-9,'X − IM coincide con XN: '+w.MF.scenarios[i].label);
 }
 ok(Math.abs(w.MF.scenarios[0].result.A-540)<1e-9,'A conserva el gasto autónomo de las clases previas');
 ok(Math.abs(w.MF.scenarios[0].result.a-.2)<1e-9&&Math.abs(w.MF.scenarios[0].result.alpha-5)<1e-9,'a es el inverso del multiplicador α');
 for(const scenario of w.MF.scenarios){
  const state=scenario.result,relations=w.MF.relations({G:state.G,E:state.E,m:state.m});
  for(const i of [0,4,8]){
   const yMoney=relations.LM.yIntercept+relations.LM.slope*i;
   ok(Math.abs(.5*yMoney-50*i-state.m)<1e-8,`${scenario.label}: LM despejada satisface el equilibrio de dinero en i=${i}`);
   const yGoods=relations.IS.yIntercept+relations.IS.slope*i,p=state.p;
   const spending=p.c0+p.c1*(yGoods-p.T)+p.b0+p.b1*yGoods-p.b2*i+p.G+p.x0-p.x1*yGoods+p.x2*state.E;
   ok(Math.abs(yGoods-spending)<1e-8,`${scenario.label}: IS despejada satisface bienes en i=${i}`);
  }
  for(const type of ['IS','LM']){const line=relations[type];ok(Math.abs(line.yIntercept+line.slope*line.iIntercept)<1e-8,`${scenario.label}: ambos cortes algebraicos de ${type} coherentes`);}
 }
 for(const [id,m] of [[9,1450],[12,1450],[14,1550],[16,1450],[19,1500],[20,1500],[21,1550]]){
  const s=w.Lesson.slides[id-1],fragment=w.Visuals.visual(s,900,false,0),expected=w.Visuals.linearEquation(w.MF.relations({m}).LM);
  ok(fragment.includes(expected),`Diapositiva ${id}: muestra LM como Y = F(i) con M/P = ${m}`);
 }
 for(const kind of ['solveLM','base','floatFiscal','floatMoney','fixedFiscal','fixedMoney']){
  const fragment=w.Visuals.graph(kind,480);
  ok(!fragment.includes('data-intercept=')&&!fragment.includes('intercepts-chart')&&!fragment.includes('curve-cuts'),`${kind}: el recorrido principal conserva solo el detalle del equilibrio y las ecuaciones`);
  const spec=w.Visuals.curveSpecs(kind);ok(spec.filter(x=>x.type==='LM').every(x=>fragment.includes(w.Visuals.linearEquation(x.relation))),`${kind}: ecuaciones de todas las LM dibujadas`);
 }
 for(const [key,c] of Object.entries(w.Visuals.interceptCases)){
  const content=w.Visuals.interceptContent(key,480),r=w.MF.scenarios[c.scenario].result,rel=w.MF.relations({G:r.G,E:r.E,m:r.m});
  for(const cut of ['IS-Y','IS-i','LM-Y','LM-i'])ok(content.includes(`data-intercept="${cut}"`),`${key}: corte ${cut} en la ventana opcional`);
  ok((content.match(/class="intercepts-chart"/g)||[]).length===1,`${key}: una sola vista completa por ejercicio`);
  ok(content.includes(w.Visuals.linearEquation(rel.IS))&&content.includes(w.Visuals.linearEquation(rel.LM)),`${key}: rectas finales de la calibración correcta`);
 }
 for(const s of w.Lesson.slides){
  const html=w.Visuals.visual(s,900,true,0),buttons=[...html.matchAll(/data-action="intercepts" data-case="([^"]+)"/g)].map(m=>m[1]);
  const expected=Object.entries(w.Visuals.interceptCases).filter(([,c])=>c.slide===s.id).map(([k])=>k);
  ok(JSON.stringify(buttons)===JSON.stringify(expected),`Diapositiva ${s.id}: acceso único solo en el ejercicio correspondiente`);
  ok(!html.includes('data-intercept='),`Diapositiva ${s.id}: sin vista de interceptos incrustada`);
  if(s.revealAfter!==null)ok(!w.Visuals.visual(s,900,false,0).includes('data-action="intercepts"'),`Diapositiva ${s.id}: interceptos no anticipan la respuesta`);
 }
 for(const s of w.Lesson.slides){
  const blocks=s.blocks.map((b,i)=>b.kind==='speech'?i:null).filter(i=>i!==null);
  ok(JSON.stringify(s.steps.map(x=>x.block))===JSON.stringify(blocks),`Cada párrafo de la diapositiva ${s.id} tiene pasos visibles propios`);
  ok(s.steps.every(x=>x.lines.length>=2&&x.start!==undefined&&x.end>x.start),`Pasos ${s.id} con contenido y tiempos derivados de voz`);
 }
 const contract=JSON.parse(fs.readFileSync(path.join(root,'production/editorial-contract.json'),'utf8'));
 for(const row of contract.paragraphs){
  const s=w.Lesson.slides[row.slide-1],step=s.steps.find(x=>x.block===row.block),visible={block:step.block,title:step.title,lines:step.lines,note:step.note,flow:step.flow};
  ok(digest(s.blocks[row.block].text)===row.voice_sha256&&digest(JSON.stringify(visible))===row.visible_sha256,`Contrato voz/pantalla vigente: diapositiva ${s.id}, párrafo ${row.block}`);
  const event=s.events.find(e=>e.kind==='speech'&&e.block===step.block);
  ok(Math.abs(step.start-event.start)<1e-7&&Math.abs(step.end-event.end)<1e-7,`Paso ${s.id}/${row.block} sigue el evento medido del audio`);
 }
 async function showBlock(id,block){const s=w.Lesson.slides[id-1],e=s.events.find(e=>e.kind==='speech'&&e.block===block);await w.MFPlayer.select(s.chapter,e.start+.05,false);await ready(w);return doc.querySelector('.calculation-guide').textContent;}
 let visible=await showBlock(4,1);ok(visible.includes('140 − 0,10Y + 0,20E')&&visible.includes('140 − 330 + 180 = −10')&&visible.includes('140 − 350 + 180 = −30'),'Diapositiva 4: calibración y operaciones coinciden con la voz');
 visible=await showBlock(6,1);ok(visible.includes('A = c')&&visible.includes('a = 1 −'),'Diapositiva 6: gasto autónomo y coeficiente con letras diferentes');
 visible=await showBlock(10,1);ok(visible.includes('1.450 + 200 = 0,50Y − 200 + 200')&&visible.includes('1.650 / 0,50'),'Diapositiva 10: suma en ambos lados y división visibles');
 visible=await showBlock(11,0);ok(visible.includes('540/0,20')&&visible.includes('15/0,20'),'Diapositiva 11: división de cada término visible');
 visible=await showBlock(11,1);ok(visible.includes('3.300 − 2.400 = 2.400 + E − 2.400'),'Diapositiva 11: resta en ambos lados visible');
 visible=await showBlock(13,1);ok(doc.querySelectorAll('[data-adjustment]').length===2&&doc.querySelectorAll('.mechanism-flow .flow-arrow').length>3,'Diapositiva 13: flechas gráficas y mecanismo realmente presentes');
 const interceptPoint=a.currentTime;x.click('#play');x.click('[data-case="floatFiscal"]');
 ok(a.paused&&doc.getElementById('dialogBody').dataset.type==='intercepts','Ver interceptos pausa la narración y abre su ventana');
 ok(w.MFPlayer.state().snapshot.slide===13&&w.MFPlayer.state().snapshot.time===interceptPoint,'La ventana conserva diapositiva e instante');
 ok(doc.querySelectorAll('#dialogBody .intercepts-chart').length===1&&doc.querySelectorAll('#visual .intercepts-chart').length===0,'Vista completa solo en la ventana, una vez');
 a.advance(10);ok(a.currentTime===interceptPoint,'La consulta no adelanta el reloj del audio');
 x.click('#returnPaused');ok(a.paused&&a.currentTime===interceptPoint&&doc.activeElement.dataset.case==='floatFiscal','Volver en pausa conserva el instante y devuelve el foco a Ver interceptos');
 x.click('[data-case="floatFiscal"]');x.click('#returnPlay');ok(!a.paused&&a.currentTime===interceptPoint,'Continuación explícita desde la ventana de interceptos');w.MFPlayer.pause();
 x.click('[data-action="figure"]');ok(!doc.querySelector('#dialogBody [data-action="intercepts"]')&&!doc.querySelector('#dialogBody .intercepts-chart'),'La ampliación ordinaria no repite la consulta de interceptos');x.click('#returnPaused');
 const retained=a.currentTime;x.click('[data-step-block="0"]');ok(a.paused&&a.currentTime===retained&&w.MFPlayer.state().guideMode==='manual','Consultar otro paso pausa sin cambiar el audio');
 ok(doc.querySelector('.calculation-guide').textContent.includes('3.300 − 2.500'),'Consulta manual mantiene las operaciones completas');x.click('#play');ok(w.MFPlayer.state().guideMode==='follow','Al continuar, los pasos vuelven al párrafo que se escucha');w.MFPlayer.pause();
 x.click('[data-action="allsteps"]');ok(a.paused&&doc.querySelectorAll('#visual [data-visible-step]').length===3,'Desarrollo completo consultable en pausa');
 await w.MFPlayer.select(0,0,false);
 x.click('#play');a.advance(3);ok(!a.paused&&a.currentTime===3,'Reproducción y avance usan el reloj del audio simulado');
 x.click('#forward10');ok(a.currentTime===13,'Salto de +10 segundos');x.click('#back10');ok(a.currentTime===3,'Salto de −10 segundos');
 doc.getElementById('speed').value='1.5';doc.getElementById('speed').dispatchEvent(new w.Event('change'));ok(a.playbackRate===1.5,'Velocidad aplicada al objeto de audio');
 x.click('[data-action="glossary"]');const point=a.currentTime;ok(a.paused&&doc.getElementById('consultation').open,'Glosario pausa narración');
 x.input('#glossarySearch','depreciacion');ok([...doc.querySelectorAll('[data-glossary]')].some(e=>!e.hidden),'Búsqueda sin tildes');
 x.click('#returnPaused');ok(a.paused&&a.currentTime===point,'Regreso del glosario conserva el instante y la pausa');
 x.click('[data-action="glossary"]');doc.getElementById('consultation').dispatchEvent(new w.Event('cancel',{cancelable:true}));ok(!doc.getElementById('consultation').open&&a.paused&&doc.activeElement.dataset.action==='glossary','Escape (evento cancel) cierra y devuelve el foco al control de consulta');
 x.click('#play');x.click('[data-action="figure"]');ok(a.paused,'Ampliar figura pausa');x.click('#returnPlay');ok(!a.paused&&a.currentTime===point,'Continuación explícita desde la figura');
 w.MFPlayer.pause();w.MFPlayer.goSlide(17);await ready(w);const s17=w.Lesson.slides[16];
 ok(doc.getElementById('visual').textContent.includes('PAUSA PARA CALCULAR'),'Resultado fiscal fijo oculto antes del intento');
 w.MFPlayer.seek(s17.revealTime+.1,false);ok(doc.getElementById('visual').textContent.includes('3.400'),'Resultado se revela según tiempo real del audio');
 w.MFPlayer.seek(s17.start+1,false);ok(doc.getElementById('visual').textContent.includes('PAUSA PARA CALCULAR'),'Buscar hacia atrás restaura la predicción');
 x.click('[data-action="reveal"]');ok(a.paused&&doc.getElementById('visual').textContent.includes('3.400'),'Revelación manual mantiene la pausa');
 x.click('[data-action="practice"]');const practicePoint=a.currentTime;ok(a.paused,'Práctica pausa y conserva el punto');
 x.click('[data-solution="A"]');ok(doc.getElementById('solution-A').hidden,'Solución requiere un intento');
 x.input('#A-Y','3.400');x.input('#A-E','1.000');x.click('[data-check="A"]');ok(doc.getElementById('feedback-A').textContent.includes('cierran'),'Ejercicio A acepta formato chileno y comprueba cifras');
 x.click('[data-solution="A"]');ok(!doc.getElementById('solution-A').hidden,'Revelar solución después del intento');
 x.click('#returnPaused');ok(a.paused&&a.currentTime===practicePoint&&w.MFPlayer.state().slide===17,'Regreso desde práctica conserva diapositiva e instante');
 x.click('[data-action="transcript"]');ok(doc.querySelectorAll('[data-time]').length>5,'Transcripción con marcas por párrafo y pausas');x.click('#returnPaused');ok(a.currentTime===practicePoint,'Consultar transcripción conserva el punto');
 x.click('[data-action="transcript"]');const link=doc.querySelector('[data-time]'),newTime=+link.dataset.time;x.click('[data-time]');ok(a.paused&&Math.abs(a.currentTime-newTime)<.001,'Ir al pasaje mueve el punto por acción explícita y queda pausado');
 await w.MFPlayer.select(0,0,false);a.currentTime=w.Lesson.slides[1].start+.2;await wait(0);ok(w.MFPlayer.state().slide===2,'Diapositiva sigue el reloj de capítulo al buscar');
 x.click('#next');await ready(w);ok(w.MFPlayer.state().slide===3&&a.paused,'Navegación manual queda en pausa');
 x.click('#previous');await ready(w);ok(w.MFPlayer.state().slide===2,'Diapositiva anterior');
 const key=k=>{const e=new w.Event('keydown',{bubbles:true,cancelable:true});Object.defineProperty(e,'key',{value:k});doc.getElementById('stage').focus();doc.getElementById('stage').dispatchEvent(e);};
 key(' ');ok(!a.paused,'Espacio desde la diapositiva reproduce');key(' ');ok(a.paused,'Espacio desde la diapositiva pausa');const keyTime=a.currentTime;key('ArrowRight');ok(a.currentTime===keyTime+10,'Flecha derecha salta diez segundos');key('ArrowLeft');ok(a.currentTime===keyTime,'Flecha izquierda regresa diez segundos');key('PageDown');await ready(w);ok(w.MFPlayer.state().slide===3&&a.paused,'Page Down cambia diapositiva en pausa');
 await w.MFPlayer.select(0,0,true);a.advance(a.duration);ok(w.MFPlayer.state().finished&&a.paused&&w.MFPlayer.state().chapter===0,'Detención al final del capítulo');
 x.click('#nextChapter');await ready(w);ok(w.MFPlayer.state().chapter===1&&!a.paused,'Continuación al capítulo siguiente requiere acción');
 doc.getElementById('stopChapter').checked=false;doc.getElementById('stopChapter').dispatchEvent(new w.Event('change'));a.advance(a.duration);await ready(w);ok(w.MFPlayer.state().chapter===2&&!a.paused,'Escucha continua cruza capítulos cuando se elige');
 w.MFPlayer.pause();w.MFPlayer.seek(21,false);doc.getElementById('showSpeech').checked=true;doc.getElementById('showSpeech').dispatchEvent(new w.Event('change'));
 const reloaded=load(x.store);await ready(reloaded.w);ok(reloaded.a.paused&&reloaded.w.MFPlayer.state().chapter===2&&reloaded.a.currentTime===21,'Recargar conserva punto y vuelve en pausa');ok(reloaded.w.MFPlayer.state().rate===1.5&&!reloaded.w.MFPlayer.state().stop&&reloaded.w.MFPlayer.state().showSpeech,'Recargar conserva preferencias');
 const blocked=load({},true);await ready(blocked.w);ok(blocked.doc.getElementById('storageStatus').textContent.includes('no permite'),'Sin almacenamiento: informa y permite estudiar');
 const old=w.Lesson.previousTimeline.find(s=>s.id===7),migrated=load({'macro1-mundell-fleming-v1':JSON.stringify({chapter:old.chapter,time:old.start+9,rate:1.5})});await ready(migrated.w);
 ok(migrated.w.MFPlayer.state().slide===7&&Math.abs(migrated.a.currentTime-(w.Lesson.slides[6].start+9))<.001,'La revisión conserva diapositiva y avance relativo del marcador previo');
 for(const precision of [.001,.1]){
  const q=load({},false,precision);await ready(q.w);q.w.MFPlayer.goSlide(13);await ready(q.w);await wait(0);
  ok(q.w.MFPlayer.state().slide===13,`Carga manual de diapositiva 13 con reloj de ${precision}s`);
  q.click('#next');await ready(q.w);await wait(0);
  ok(q.w.MFPlayer.state().slide===14,`Regresión: 13 → 14 con reloj de ${precision}s`);
  for(let id=15;id<=24;id++){q.click('#next');await ready(q.w);await wait(0);ok(q.w.MFPlayer.state().slide===id,`Avance a ${id} con reloj de ${precision}s`);}
  for(let id=23;id>=1;id--){q.click('#previous');await ready(q.w);await wait(0);ok(q.w.MFPlayer.state().slide===id,`Retroceso a ${id} con reloj de ${precision}s`);}
  for(const s of q.w.Lesson.slides)for(const step of s.steps){await q.w.MFPlayer.select(s.chapter,step.start,false);await ready(q.w);await wait(0);ok(q.w.MFPlayer.state().slide===s.id&&q.w.MFPlayer.state().guideBlock===step.block,`Párrafo ${s.id}/${step.block} y pasos alineados con reloj de ${precision}s`);}
 }
 const snapshots=path.join(out,'static-html');fs.mkdirSync(snapshots,{recursive:true});
 for(const width of [1440,390])for(const [key,c] of Object.entries(w.Visuals.interceptCases)){
  const html=w.Visuals.interceptContent(key,width<600?480:1000);
  fs.writeFileSync(path.join(snapshots,`intercepts-${width}-${key}.html`),`<!doctype html><html lang="es-CL"><meta charset="utf-8"><body><dialog id="consultation" open><div class="dialog-top"><div><p class="eyebrow">CONSULTA · NARRACIÓN EN PAUSA</p><h2>Interceptos de IS y LM</h2></div><button aria-label="Cerrar consulta">×</button></div><p class="small">Revisión estática · punto de escucha conservado en diapositiva ${c.slide}</p><div id="dialogBody" data-type="intercepts">${html}</div><div class="dialog-bottom"><button>Volver en pausa</button><button>Volver y continuar escuchando</button></div></dialog></body></html>`);
  fs.writeFileSync(path.join(out,`interceptos-${key}-${width}.svg`),html.match(/<svg[\s\S]*?<\/svg>/)[0]);
 }
 for(const width of [1440,820,390,360]){
  w.innerWidth=width;
  for(const s of w.Lesson.slides){await w.MFPlayer.select(s.chapter,s.start+.1,false);const selectedBlock=({4:1,6:1,9:2,10:1,11:1,13:1,15:1,17:2,18:2,19:2,20:3})[s.id]??0;const html=w.Visuals.visual(s,width<600?480:900,true,selectedBlock);ok(html.length>50,`Diapositiva ${s.id}: figura generada a ${width}px`);ok(doc.getElementById('slideTitle').textContent===s.title,`Título correcto a ${width}px: ${s.id}`);
   if([1440,820,390].includes(width))fs.writeFileSync(path.join(snapshots,`${width}-${String(s.id).padStart(2,'0')}.html`),`<!doctype html><html lang="es-CL"><meta charset="utf-8"><body><article class="stage"><div class="stage-meta"><span>Capítulo ${s.chapter+1}</span><span>Diapositiva ${s.id} / 24</span></div><p class="eyebrow orange">${s.kicker}</p><h2>${s.title}</h2><div class="visual">${html}</div><p class="source-line">Calibración didáctica · no son datos de Chile</p></article></body></html>`);
   for(const [i,match] of [...html.matchAll(/<svg[\s\S]*?<\/svg>/g)].entries())if([1440,390].includes(width))fs.writeFileSync(path.join(out,`figura-${s.id}-${width}-${i}.svg`),match[0]);
  }
 }
 for(const [width,id] of [[1440,1],[1440,13],[390,1],[390,13]]){
  w.innerWidth=width;await w.MFPlayer.select(w.Lesson.slides[id-1].chapter,w.Lesson.slides[id-1].start,false);
  const html=doc.toString().replace(/<script[\s\S]*?<\/script>/g,'').replace('<head>','<head><base href="file://'+root+'/">');
  fs.writeFileSync(path.join(snapshots,`ui-${width}-${id}.html`),html);
 }
 for(const m of JSON.parse(fs.readFileSync(path.join(root,'production/source-manifest.json')))){
  const crypto=require('crypto'),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');ok(hash(m.original)===m.sha256&&hash(path.join(root,m.copy))===m.sha256,'Original y copia conservados: '+path.basename(m.original));
 }
 report.status='PASS';fs.writeFileSync(path.join(out,'controller-model.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,assertions:report.assertions,method:report.method},null,2));
})().catch(e=>{report.status='FAIL';report.error=e.stack;fs.writeFileSync(path.join(out,'controller-model.json'),JSON.stringify(report,null,2));console.error(e.stack);process.exitCode=1});
