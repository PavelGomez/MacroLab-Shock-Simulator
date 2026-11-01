/* Integración de alojamiento; el ZIP descargable conserva su versión autónoma. */
(function(){
 'use strict';
 const embedded=window.parent!==window,nav=document.querySelector('.topbar nav');
 if(nav){
  const back=document.createElement(embedded?'button':'a');
  back.textContent='← Volver a Clase 8';back.setAttribute('data-pause','');
  if(embedded){back.type='button';back.addEventListener('click',()=>{window.MFPlayer?.pause();window.parent.postMessage({type:'macrolab-narration:close'},location.origin==='null'?'*':location.origin);});}
  else back.href='../../index.html?clase=8#route';
  nav.prepend(back);
 }
 window.addEventListener('message',event=>{
  if(embedded&&event.source===window.parent&&event.origin===location.origin&&event.data?.type==='macrolab-narration:pause')window.MFPlayer?.pause();
 });
 if(embedded)document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!document.getElementById('consultation')?.open){event.preventDefault();window.MFPlayer?.pause();window.parent.postMessage({type:'macrolab-narration:close'},location.origin==='null'?'*':location.origin);}
 });
})();
