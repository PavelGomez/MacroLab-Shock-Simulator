/* Ventana de estudio de Clase 8: conserva la ruta y el reproductor cargados. */
(function(){
 'use strict';
 const url='presentaciones/mundell-fleming/index.html';
 const dialog=document.createElement('dialog');
 dialog.id='class8-narration';dialog.setAttribute('aria-labelledby','class8-narration-title');
 dialog.innerHTML='<header class="narration-header"><div><span>MACRO 1 · CLASE 8</span><h2 id="class8-narration-title">Presentación narrada · Mundell–Fleming</h2></div><nav aria-label="Ventana de estudio"><a class="btn" href="'+url+'" target="_blank" rel="noopener" data-narration-tab>Abrir en pestaña completa</a><button class="btn" type="button" data-narration-close>Cerrar y volver a Clase 8</button></nav></header><iframe title="Presentación narrada de Mundell–Fleming" allow="fullscreen"></iframe>';
 document.body.appendChild(dialog);
 const frame=dialog.querySelector('iframe'),closeButton=dialog.querySelector('[data-narration-close]');
 let trigger=null;
 function pause(){
  if(!frame.hasAttribute('src'))return;
  // La llamada síncrona detiene la voz antes de ocultar la ventana (mismo origen).
  try{frame.contentWindow.MFPlayer?.pause();}catch{}
  frame.contentWindow?.postMessage({type:'macrolab-narration:pause'},location.origin==='null'?'*':location.origin);
 }
 function close(){if(!dialog.open)return;pause();dialog.close();}
 closeButton.addEventListener('click',close);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 dialog.addEventListener('close',()=>{pause();document.body.classList.remove('narration-open');if(trigger?.isConnected)trigger.focus();});
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('[data-presentation="class8"]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||typeof dialog.showModal!=='function')return;
  event.preventDefault();trigger=link;
  if(!frame.hasAttribute('src'))frame.src=url;
  dialog.showModal();document.body.classList.add('narration-open');closeButton.focus();
 });
 dialog.querySelector('[data-narration-tab]').addEventListener('click',pause);
 window.addEventListener('message',event=>{
  if(event.source===frame.contentWindow&&event.origin===location.origin&&event.data?.type==='macrolab-narration:close')close();
 });
})();
