(function(){
 'use strict';
 const D=window.Lesson,V=window.Visuals,$=id=>document.getElementById(id),audio=$('audio'),dialog=$('consultation'),KEY='macro1-mundell-fleming-v1';
 const clock=t=>{t=Math.max(0,Math.floor(Number.isFinite(t)?t:0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
 const norm=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 let chapterIndex=0,slideId=1,pendingTime=0,rate=1,stop=true,showSpeech=false,storage=true,loading=false,version=0,finished=false,manualReveal=false,phase=-2,lastEvent='',snapshot=null,trigger=null,saveAt=0,dragWasPlaying=false;
 let practice={},navigationAnchor=null,studyMode='follow',manualBlock=null,savedBookmark=null;
 try{const p=JSON.parse(localStorage.getItem(KEY)||'{}');savedBookmark=p;chapterIndex=Number.isInteger(p.chapter)&&p.chapter>=0&&p.chapter<D.chapters.length?p.chapter:0;pendingTime=Number.isFinite(p.time)?p.time:0;rate=[.75,1,1.15,1.25,1.5,1.75,2].includes(p.rate)?p.rate:1;stop=p.stop!==false;showSpeech=p.showSpeech===true;practice=p.practice||{};localStorage.setItem(KEY+'-check','1');localStorage.removeItem(KEY+'-check');}catch{storage=false;}
 if(savedBookmark&&Number.isFinite(savedBookmark.time)&&savedBookmark.revision!==D.revision&&D.previousTimeline){
  const old=[...D.previousTimeline].reverse().find(s=>s.chapter===chapterIndex&&s.start<=pendingTime);
  const updated=old&&D.slides.find(s=>s.id===old.id);
  if(updated)pendingTime=updated.start+Math.max(0,Math.min(pendingTime-old.start,updated.end-updated.start-.02));
 }
 const chapter=()=>D.chapters[chapterIndex],slides=()=>D.slides.filter(s=>s.chapter===chapterIndex),scene=()=>D.slides.find(s=>s.id===slideId);
 const time=()=>{const real=loading?pendingTime:audio.currentTime;return navigationAnchor&&Math.abs(real-navigationAnchor.time)<=.125?navigationAnchor.time:real;};
 function slideAt(t){return [...slides()].reverse().find(s=>t+1e-7>=s.start)||slides()[0];}
 function save(){try{localStorage.setItem(KEY,JSON.stringify({revision:D.revision,chapter:chapterIndex,slide:slideId,offset:Math.max(0,time()-scene().start),time:time(),rate,stop,showSpeech,practice}));}catch{storage=false;$('storageStatus').textContent='Este navegador no permite guardar aquí. La presentación sigue disponible; anota capítulo e instante para retomar.';}}
 function announce(t){$('announcement').textContent=t;}
 function sidebar(){
  const active=document.activeElement,focusChapter=active?.dataset?.chapter,focusSlide=active?.dataset?.slide;
  $('chapters').innerHTML=D.chapters.map(c=>`<button data-chapter="${c.index}" ${c.index===chapterIndex?'aria-current="true"':''}><span>${String(c.index+1).padStart(2,'0')}</span><span>${V.esc(c.title)}<small>${clock(c.duration)} · ${D.slides.filter(s=>s.chapter===c.index).length} diapositivas</small></span></button>`).join('');
  $('slides').innerHTML=slides().map(s=>`<button data-slide="${s.id}" ${s.id===slideId?'aria-current="true"':''}><span>${String(s.id).padStart(2,'0')}</span><span>${V.esc(s.title)}</span></button>`).join('');
  if(focusChapter!==undefined)$('chapters').querySelector(`[data-chapter="${focusChapter}"]`)?.focus();
  if(focusSlide!==undefined)$('slides').querySelector(`[data-slide="${focusSlide}"]`)?.focus();
 }
 function isRevealed(s){return s.revealTime===null||manualReveal||time()>=s.revealTime;}
 function currentBlock(){const previous=[...scene().events].reverse().find(e=>e.start<=time());return previous&&previous.block>=0?previous.block:0;}
 function renderVisual(){
  const s=scene(),active=document.activeElement,inside=$('visual').contains(active),step=inside?active.dataset.stepBlock:undefined,action=inside?active.dataset.action:undefined;
  $('visual').innerHTML=V.visual(s,innerWidth<600?480:900,isRevealed(s),currentBlock(),{mode:studyMode,manualBlock});
  if(step!==undefined)$('visual').querySelector(`[data-step-block="${step}"]`)?.focus();
  else if(action)$('visual').querySelector(`[data-action="${action}"]`)?.focus();
 }
 function renderSlide(id){
  slideId=id;manualReveal=false;phase=-2;lastEvent='';studyMode='follow';manualBlock=null;const s=scene();
  $('chapterLabel').textContent=`Capítulo ${chapterIndex+1} · ${chapter().title}`;
  $('slideCount').textContent=`Diapositiva ${s.id} de ${D.slides.length}`;
  $('kicker').textContent=s.kicker;$('slideTitle').textContent=s.title;renderVisual();
  $('sourceLine').textContent=s.visual==='chile'?'Contexto institucional · Banco Central de Chile · consulta 01-11-2026':'Fuente de contenido: Nota de estudio 9 del curso · calibración didáctica, no datos de Chile';
  $('previous').disabled=id===1;$('next').disabled=id===D.slides.length;
  $('deep').disabled=!s.deep;$('deep').textContent=s.deep?'Profundizar: '+D.deep[s.deep].title:'Profundización opcional';
  $('terms').innerHTML=s.terms.map(k=>{const t=D.glossary.find(t=>t.key===k);return `<button data-term="${k}" aria-haspopup="dialog">${V.esc(t.label)}</button>`}).join('');
  sidebar();announce(`Diapositiva ${s.id}. ${s.title}`);
 }
 function sync(){
  const t=time();
  // Algunos navegadores redondean currentTime por debajo del inicio solicitado.
  // Conserva el destino explícito dentro de esa tolerancia, sin alterar el audio.
  const anchored=navigationAnchor&&Math.abs(t-navigationAnchor.time)<=.125;
  const s=anchored?D.slides.find(s=>s.id===navigationAnchor.slide):slideAt(t);
  if(!anchored)navigationAnchor=null;
  if(s.id!==slideId)renderSlide(s.id);
  const e=s.events.find(e=>t>=e.start&&t<e.end),block=currentBlock();
  if(block!==phase)renderVisual();
  phase=block;
  for(const el of $('visual').querySelectorAll('[data-phase]'))el.classList.toggle('active-step',+el.dataset.phase===block);
  if(document.activeElement!==$('timeline'))$('timeline').value=t;
  $('timeline').setAttribute('aria-valuetext',`${clock(t)} de ${clock(chapter().duration)} en el capítulo ${chapterIndex+1}`);
  $('clock').textContent=`${clock(t)} / ${clock(chapter().duration)}`;
  $('play').textContent=audio.paused?'▶ Escuchar':'Ⅱ Pausar';$('play').setAttribute('aria-label',audio.paused?'Escuchar narración':'Pausar narración');
  $('play').disabled=loading;$('back10').disabled=loading;$('forward10').disabled=loading;$('timeline').disabled=loading;
  $('study').hidden=!(e&&e.kind==='study');
  if(e&&e.kind==='study')$('studyText').textContent=`${e.text} · ${Math.max(0,Math.ceil(e.end-t))} s de silencio de estudio`;
  $('speech').hidden=!showSpeech;
  const eventKey=e?`${s.id}-${e.start}`:'';
  if(eventKey!==lastEvent){$('speech').textContent=e?e.text:'Pausa para mirar la figura o cerrar la idea.';lastEvent=eventKey;}
  $('status').textContent=loading?'Preparando audio…':audio.paused?'Audio en pausa · conservas este instante.':'Escuchando · puedes pausar para mirar o calcular.';
  $('chapterEnd').hidden=!finished;$('nextChapter').hidden=chapterIndex===D.chapters.length-1;
  if(Date.now()-saveAt>1300){save();saveAt=Date.now();}
 }
 function waitMetadata(token){return new Promise((resolve,reject)=>{
  if(audio.readyState>=1){resolve();return}
  const done=()=>{clearTimeout(timer);audio.removeEventListener('loadedmetadata',ready);audio.removeEventListener('error',fail);};
  const ready=()=>{done();resolve();},fail=()=>{done();reject(Error('No se pudo cargar el capítulo'));};
  const timer=setTimeout(()=>{done();reject(Error('La carga del audio no respondió.'));},15000);
  audio.addEventListener('loadedmetadata',ready);audio.addEventListener('error',fail);
 });}
 async function select(ci,t=0,playing=false){
  const token=++version;audio.pause();finished=false;chapterIndex=Math.max(0,Math.min(D.chapters.length-1,ci));pendingTime=Math.max(0,Math.min(chapter().duration-.02,t));loading=true;manualReveal=false;$('audioError').hidden=true;
  const target=chapter().audio;
  if(audio.getAttribute('src')!==target){audio.src=target;audio.load();}
  $('timeline').max=chapter().duration;
  const s=slideAt(pendingTime);navigationAnchor={slide:s.id,time:pendingTime};renderSlide(s.id);sync();
  try{await waitMetadata(token);if(token!==version)return;audio.currentTime=Math.min(pendingTime,Number.isFinite(audio.duration)?audio.duration-.02:pendingTime);audio.playbackRate=rate;loading=false;sync();save();if(playing)await play();}
  catch(err){if(token!==version)return;loading=false;$('audioError').hidden=false;$('audioError').textContent='No se pudo cargar el audio. Conserva assets/audio junto a index.html. Puedes estudiar con las diapositivas y el guion; pulsa un capítulo para volver a intentar.';sync();}
 }
 function pause(){audio.pause();sync();save();}
 async function play(){
  if(dialog.open||loading)return;
  studyMode='follow';manualBlock=null;renderVisual();
  if(finished){await select(chapterIndex,slides()[0].start,true);return;}
  try{await audio.play();$('audioError').hidden=true;}catch{$('audioError').hidden=false;$('audioError').textContent='El navegador no inició el audio. Pulsa Escuchar para autorizarlo. El guion sigue disponible sin sonido.';}
  sync();
 }
 function toggle(){if(audio.paused)play();else pause();}
 function seek(t,playing=!audio.paused){
  finished=false;t=Math.max(0,Math.min(chapter().duration-.02,t));
  if(loading){pendingTime=t;return;}
  navigationAnchor={slide:slideAt(t).id,time:t};audio.currentTime=t;manualReveal=false;studyMode='follow';manualBlock=null;phase=-2;sync();save();if(playing&&audio.paused)play();
 }
 function goSlide(id){const s=D.slides.find(s=>s.id===id);if(s)select(s.chapter,s.start,false);}
 function openConsult(title,html,type='text'){
  if(!dialog.open){trigger=document.activeElement;pause();snapshot={chapter:chapterIndex,time:time(),slide:slideId};}
  $('dialogTitle').textContent=title;$('dialogBody').innerHTML=html;$('dialogBody').dataset.type=type;
  $('returnPoint').textContent=`Punto conservado: capítulo ${snapshot.chapter+1}, diapositiva ${snapshot.slide}, ${clock(snapshot.time)} del capítulo.`;
  if(!dialog.open)dialog.showModal();$('closeDialog').focus();
 }
 function closeConsult(continuePlay=false){
  if(!dialog.open)return;
  const snap=snapshot;dialog.close();snapshot=null;
  if(chapterIndex===snap.chapter&&!loading){audio.currentTime=snap.time;sync();save();if(continuePlay)play();}
  else select(snap.chapter,snap.time,continuePlay);
  if(trigger&&trigger.isConnected)trigger.focus();else $('play').focus();
 }
 function glossary(key=''){
  const entries=()=>`<dl class="glossary">${D.glossary.map(t=>`<div data-glossary="${t.key}" class="${t.key===key?'selected-term':''}"><dt>${V.esc(t.label)}</dt><dd>${V.esc(t.definition)}</dd></div>`).join('')}</dl>`;
  openConsult('Glosario de la clase',`<label class="search-label" for="glossarySearch">Buscar concepto, símbolo o sigla (con o sin tildes)</label><input class="glossary-search" id="glossarySearch" type="search" placeholder="Por ejemplo: E, paridad, exportaciones"><p id="glossaryCount" class="small">${D.glossary.length} conceptos</p>${entries()}`,'glossary');
  $('glossarySearch').addEventListener('input',()=>{
   const q=norm($('glossarySearch').value.trim());let n=0;
   for(const el of $('dialogBody').querySelectorAll('[data-glossary]')){const t=D.glossary.find(t=>t.key===el.dataset.glossary),match=norm(t.label+' '+t.definition).includes(q);el.hidden=!match;if(match)n++;}
   $('glossaryCount').textContent=`${n} concepto${n===1?'':'s'} encontrado${n===1?'':'s'}`;
  });
  if(key){const el=$('dialogBody').querySelector(`[data-glossary="${key}"]`);if(el)el.scrollIntoView({block:'center'});}else $('glossarySearch').focus();
 }
 function deep(){const d=D.deep[scene().deep];if(!d)return;openConsult(d.title,d.html);if($('resultsTable'))$('resultsTable').innerHTML=V.results();}
 function transcript(){
  const list=slides();openConsult('Transcripción del capítulo',`<p>Las marcas indican tiempo dentro de este capítulo. «Ir al pasaje» mueve intencionalmente el punto de escucha y vuelve en pausa.</p>${list.map(s=>`<section class="transcript-entry"><h3>${s.id}. ${V.esc(s.title)}</h3>${s.events.map(e=>`<p class="${e.kind==='study'?'pause-label':''}"><button class="time-link" data-time="${e.start}" aria-label="Ir al pasaje en ${clock(e.start)}, en pausa">${clock(e.start)} ↗</button>${V.esc(e.text)}${e.kind==='study'?` [${Math.round(e.end-e.start)} s de silencio]`:''}</p>`).join('')}</section>`).join('')}`,'transcript');
 }
 function sources(){openConsult('Fuentes y capas de estudio',`<h3>Recorrido principal</h3><p>Guion original basado en la Nota de estudio 9 del curso, edición del 1 de noviembre de 2026: comercio, IS abierta, cierre financiero, equilibrio y cuatro políticas. Todas las cifras del modelo son calibraciones docentes.</p><h3>Profundización opcional</h3><p>Tipo de cambio real, paridad descubierta, prima constante, respuesta comercial y límites. No se requieren para resolver el recorrido principal.</p><h3>Fuentes y antecedentes</h3><p>Se conservaron copias exactas de la nota, el bloque IS–LM–BP v0.2 y la convención cambiaria. Sus decisiones históricas se trataron como antecedentes. Se usa la nota reciente para notación y calibración.</p><p>Contexto institucional verificado: <a href="https://www.bcentral.cl/es/web/banco-central/areas/politica-monetaria" target="_blank" rel="noopener">Banco Central de Chile, Política Monetaria</a>, consulta 01-11-2026. Enlace externo opcional, requiere conexión.</p><p><a href="docs/nota_docente.html">Abrir nota docente y trazabilidad</a> · <a href="docs/storyboard.html">Storyboard completo</a> · <a href="docs/guion.html">Guion íntegro con tiempos</a></p><p class="small">Voz sintética: Kokoro-82M ONNX, em_alex, español. Audio propio generado localmente; modelos no incluidos ni necesarios para escuchar.</p>`);}
 const exercises=[{key:'A',title:'A · Flotación: M/P aumenta en 50',text:'Parte de la base con G = 200. Calcula Y y E finales; i sigue en 4 %. M/P final es 1.500.',fields:[['Y','Producción Y',3400],['E','E · CLP/USD',1000]],solution:D.deep.practica.html},
  {key:'B',title:'B · Cambio fijo: G aumenta en 10',text:'Parte de la base con E = 900 e i = 4 %. Calcula Y y el M/P requerido.',fields:[['Y','Producción Y',3350],['m','M/P requerido',1475]],solution:D.deep.practica.html},
  {key:'C',title:'C · Detecta una inconsistencia',text:'Una propuesta fija E = 900, i = 4 %, Y = 3.300 y M/P = 1.550. Calcula oferta menos demanda de dinero.',fields:[['res','Residuo de dinero',100]],solution:'<p>1.550 − (0,50 × 3.300 − 50 × 4) = 100. La oferta excede a la demanda en 100. La defensa de la paridad revierte la expansión autónoma.</p>'}];
 function practiceView(){openConsult('Práctica de recuperación',`<p>Intenta cada ejercicio antes de revelar el desarrollo. Acepta coma decimal y punto de miles chilenos. Tus intentos se guardan localmente cuando es posible.</p>${exercises.map(x=>`<section class="practice-item" data-exercise="${x.key}"><h3>${x.title}</h3><p>${x.text}</p><div class="practice-fields">${x.fields.map(([k,l])=>`<label for="${x.key}-${k}">${l}<input id="${x.key}-${k}" data-practice="${x.key}-${k}" inputmode="decimal" type="text" value="${V.esc(practice[x.key+'-'+k]||'')}" autocomplete="off"></label>`).join('')}</div><button data-check="${x.key}">Comprobar mi intento</button> <button data-solution="${x.key}">Revelar desarrollo</button><p id="feedback-${x.key}" class="practice-feedback" role="status"></p><div id="solution-${x.key}" class="practice-solution" hidden>${x.solution}</div></section>`).join('')}`,'practice');}
 function number(s){const t=s.trim();if(!/^[+-]?[\d.]+(?:,\d+)?$/.test(t))return NaN;return Number(t.replace(/\./g,'').replace(',','.'));}
 document.addEventListener('click',e=>{
  const b=e.target.closest('button,a');if(!b)return;
  if(b.matches('[data-pause]'))pause();
  if(b.dataset.chapter!==undefined)select(+b.dataset.chapter,0,false);
  if(b.dataset.slide)goSlide(+b.dataset.slide);
  if(b.dataset.term)glossary(b.dataset.term);
  if(b.dataset.stepBlock!==undefined){pause();studyMode='manual';manualBlock=+b.dataset.stepBlock;renderVisual();if(dialog.open&&$('dialogBody').dataset.type==='figure')$('dialogBody').innerHTML=V.visual(scene(),1000,isRevealed(scene()),currentBlock(),{mode:studyMode,manualBlock,intercepts:false});}
  if(b.dataset.time){snapshot={chapter:chapterIndex,time:+b.dataset.time,slide:slides().find(s=>+b.dataset.time>=s.start&&+b.dataset.time<s.end).id};closeConsult(false);}
  const action=b.dataset.action;
  if(action==='glossary')glossary();if(action==='practice')practiceView();if(action==='transcript')transcript();if(action==='sources')sources();
  if(action==='allsteps'||action==='followsteps'){
   pause();studyMode=action==='allsteps'?'all':'follow';manualBlock=null;if(action==='allsteps')manualReveal=true;renderVisual();
   if(dialog.open&&$('dialogBody').dataset.type==='figure')$('dialogBody').innerHTML=V.visual(scene(),1000,isRevealed(scene()),currentBlock(),{mode:studyMode,manualBlock,intercepts:false});
  }
  if(action==='reveal'){pause();manualReveal=true;renderVisual();if(dialog.open&&$('dialogBody').dataset.type==='figure')$('dialogBody').innerHTML=V.visual(scene(),1000,true,null,{intercepts:false});announce('Respuesta revelada. La narración permanece en pausa.');}
  if(action==='answer')openConsult('Respuesta para comparar tu predicción',`<p class="equation">${V.esc(scene().answer)}</p><p>La siguiente diapositiva desarrolla el mecanismo y comprueba el resultado.</p>`);
  if(action==='intercepts'){
   const c=V.interceptCases[b.dataset.case],s=scene();
   if(c&&c.slide===s.id&&(s.revealAfter===null||isRevealed(s)))openConsult('Interceptos de IS y LM',V.interceptContent(b.dataset.case,window.innerWidth<600?480:1000),'intercepts');
  }
  if(action==='figure'||action==='slide'){
   const s=scene(),revealed=isRevealed(s);
   openConsult(action==='slide'?s.title:'Figura / ecuación · '+s.title,`<div class="${action==='slide'?'zoom-slide':''}">${action==='slide'?`<p class="eyebrow">${V.esc(s.kicker)}</p><h3>${V.esc(s.title)}</h3>`:''}<div class="visual">${V.visual(s,1000,revealed,null,{intercepts:false})}</div><p class="figure-note">${V.esc($('sourceLine').textContent)}</p></div>`,'figure');
  }
  if(b.dataset.check){const x=exercises.find(x=>x.key===b.dataset.check),empty=x.fields.some(([k])=>!$(x.key+'-'+k).value.trim());if(empty){$('feedback-'+x.key).textContent='Completa tu intento en todos los campos antes de comprobar.';return;}const good=x.fields.every(([k,l,v])=>Math.abs(number($(x.key+'-'+k).value)-v)<.011);$('feedback-'+x.key).textContent=good?'Tus cifras cierran. Explica también el orden de solución y comprueba bienes.':'Revisa el orden según el régimen y sustituye en las ecuaciones. Puedes revelar el desarrollo para comparar.';}
  if(b.dataset.solution){const x=exercises.find(x=>x.key===b.dataset.solution);if(!x.fields.some(([k])=>$(x.key+'-'+k).value.trim())){$('feedback-'+x.key).textContent='Anota primero al menos una cifra de tu intento. Luego podrás comparar el desarrollo.';return;}$('solution-'+x.key).hidden=false;}
 });
 document.addEventListener('input',e=>{if(e.target.dataset.practice){practice[e.target.dataset.practice]=e.target.value;save();}});
 $('deep').onclick=deep;$('play').onclick=toggle;$('back10').onclick=()=>seek(time()-10);$('forward10').onclick=()=>seek(time()+10);$('previous').onclick=()=>goSlide(slideId-1);$('next').onclick=()=>goSlide(slideId+1);
 $('speed').value=String(rate);$('speed').onchange=e=>{rate=+e.target.value;audio.playbackRate=rate;save();};$('stopChapter').checked=stop;$('stopChapter').onchange=e=>{stop=e.target.checked;save();};$('showSpeech').checked=showSpeech;$('showSpeech').onchange=e=>{showSpeech=e.target.checked;sync();save();};
 $('timeline').addEventListener('pointerdown',()=>{dragWasPlaying=!audio.paused;audio.pause();});
 $('timeline').addEventListener('input',e=>seek(+e.target.value,false));
 $('timeline').addEventListener('change',()=>{if(dragWasPlaying){dragWasPlaying=false;play();}});
 $('skipStudy').onclick=()=>{const e=scene().events.find(e=>e.kind==='study'&&time()>=e.start&&time()<e.end);if(e)seek(e.end,!audio.paused);};$('pauseStudy').onclick=pause;
 $('replay').onclick=()=>select(chapterIndex,0,true);$('nextChapter').onclick=()=>select(chapterIndex+1,0,true);
 $('returnPaused').onclick=()=>closeConsult(false);$('closeDialog').onclick=()=>closeConsult(false);$('returnPlay').onclick=()=>closeConsult(true);dialog.addEventListener('cancel',e=>{e.preventDefault();closeConsult(false);});
 $('stage').addEventListener('keydown',e=>{if(e.target!==$('stage')||dialog.open)return;if([' ','ArrowLeft','ArrowRight','PageDown','PageUp'].includes(e.key))e.preventDefault();if(e.key===' ')toggle();if(e.key==='ArrowLeft')seek(time()-10);if(e.key==='ArrowRight')seek(time()+10);if(e.key==='PageDown')goSlide(slideId+1);if(e.key==='PageUp')goSlide(slideId-1);});
 audio.addEventListener('timeupdate',sync);audio.addEventListener('seeked',sync);audio.addEventListener('play',sync);audio.addEventListener('pause',sync);audio.addEventListener('ratechange',sync);
 audio.addEventListener('ended',()=>{if(!stop&&chapterIndex<D.chapters.length-1){select(chapterIndex+1,0,true);return;}finished=true;sync();save();announce(chapterIndex===D.chapters.length-1?'Presentación terminada.':'Capítulo terminado. Continúa cuando estés preparado.');});
 let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderVisual,100);});window.addEventListener('pagehide',()=>{audio.pause();save();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
 $('lessonMeta').textContent=`${D.chapters.length} capítulos · ${D.slides.length} diapositivas · ${clock(D.duration)} de narración, incluidos ${Math.round(D.slides.flatMap(s=>s.blocks).reduce((n,b)=>n+(b.seconds||0),0))} s de estudio. Profundización opcional y fuentes separadas.`;
 $('storageStatus').textContent=storage?'Posición y preferencias: guardado local disponible. Al recargar se vuelve en pausa.':'Este navegador no permite guardar aquí. Anota capítulo e instante para retomar.';
 window.MFPlayer={state:()=>({chapter:chapterIndex,slide:slideId,time:time(),paused:audio.paused,rate,stop,showSpeech,loading,finished,guideMode:studyMode,guideBlock:manualBlock??currentBlock(),consultation:dialog.open,snapshot}),select,seek,pause,play,goSlide,openConsult,closeConsult};
 select(chapterIndex,pendingTime,false);
})();
