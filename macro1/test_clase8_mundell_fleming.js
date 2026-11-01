#!/usr/bin/env node
'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{JSDOM,VirtualConsole}=require('jsdom'),M=require('./mf-model');
let n=0;const ok=(c,l)=>{n++;assert.ok(c,l)},near=(a,b,l)=>ok(Number.isFinite(a)&&Math.abs(a-b)<1e-8,`${l}: ${a} ≠ ${b}`);
// Valores derivados de los enunciados finales, sin usar el resultado como su propia referencia.
const fixtures={float:{none:[3300,4,900,1450,-10],fiscal:[3300,4,800,1450,-30],repair:[3300,4,750,1450,-40],money:[3500,4,1100,1550,10],foreign:[3400,5,1075,1450,15],risk:[3400,5,1075,1450,15],demand:[3300,4,1000,1450,-10]},fixed:{none:[3300,4,900,1450,-10],fiscal:[3400,4,900,1500,-20],repair:[3450,4,900,1525,-25],money:[3300,4,900,1450,-10],foreign:[3225,5,900,1362.5,-2.5],risk:[3225,5,900,1362.5,-2.5],demand:[3200,4,900,1400,-20]}};
// Segundo método: eliminación gaussiana del sistema original de tres ecuaciones.
function gaussian(a){a=a.map(r=>r.slice());for(let k=0;k<3;k++){let t=k;for(let j=k+1;j<3;j++)if(Math.abs(a[j][k])>Math.abs(a[t][k]))t=j;[a[k],a[t]]=[a[t],a[k]];const d=a[k][k];for(let j=k;j<4;j++)a[k][j]/=d;for(let i=0;i<3;i++)if(i!==k){const q=a[i][k];for(let j=k;j<4;j++)a[i][j]-=q*a[k][j];}}return a.map(r=>r[3]);}
function independent(p,reg){const A=1-p.c1-p.b1+p.x1,K=p.c0-p.c1*p.T+p.b0+p.G+p.x0;
return reg==='float'?gaussian([[A,p.b2,-p.x2,K],[p.d1,-p.d2,0,p.MP],[0,1,0,p.iStar+p.risk]]):gaussian([[A,p.b2,0,K+p.x2*p.E],[p.d1,-p.d2,-1,0],[0,1,0,p.iStar+p.risk]]);}
for(const reg of ['float','fixed'])for(const shock of Object.keys(M.SHOCKS)){
 const r=M.scenario(reg,shock),e=fixtures[reg][shock];['Y','i','E','MP','XN'].forEach((k,j)=>near(r.s1[k],e[j],`${reg}/${shock}/${k}`));
 for(const [s,p]of[[r.s0,r.p0],[r.s1,r.p1]]){
  near(s.Y,p.c0+p.c1*(s.Y-p.T)+p.b0+p.b1*s.Y-p.b2*s.i+p.G+p.x0-p.x1*s.Y+p.x2*s.E,'sustituir bienes');
  near(s.MP,p.d1*s.Y-p.d2*s.i,'sustituir dinero');near(s.i,p.iStar+p.risk,'sustituir paridad');
  const v=independent(p,reg);near(s.Y,v[0],'Gauss Y');near(s.i,v[1],'Gauss i');near(reg==='float'?s.E:s.MP,v[2],'Gauss variable de ajuste');
 }
 const chart=M.chart(r);ok(!/NaN|Infinity/.test(chart),'gráfico finito');ok(chart.includes('CLP/USD')&&chart.includes('unidades docentes'),'gráfico declara unidades');
}
// Descomposición X/IM y dominio local en todos los casos asignados.
for(const [reg,shock]of[['float','none'],['float','fiscal'],['float','money'],['fixed','fiscal'],['float','foreign'],['float','demand'],['fixed','demand']]){
 const r=M.scenario(reg,shock),s=r.s1;const X=210+(shock==='demand'?-20:0)+.1*s.E,IM=70+.1*s.Y-.1*s.E;near(X-IM,s.XN,'X menos IM coincide con XN');ok(X>0&&IM>0,'cantidades valoradas no negativas');
}
for(const change of [{d1:0},{d2:0},{x2:0},{MP:-1},{E:-1},{c1:1},{b2:0},{iStar:NaN},{G:5000}])assert.throws(()=>M.solve({...M.BASE,...change}),undefined,'rechaza entradas fuera de dominio');
const customFixed=M.scenario('fixed','money',{...M.BASE,G:240});near(customFixed.attemptedMP-customFixed.s0.MP,100,'intento monetario parte de dinero efectivo inicial');near(customFixed.s1.MP,customFixed.s0.MP,'reversión con base fija editada');near(customFixed.reversed,100,'revierte exactamente la expansión intentada');
// Variación de parámetros: sustituir fuera del caso memorizado en ambos regímenes.
for(let j=0;j<25;j++)for(const reg of ['float','fixed']){
 const p={...M.BASE,G:190+j,c1:.68+j*.002,d1:.47+j*.002,risk:j*.02},s=M.solve(p,reg),v=independent(p,reg);
 near(s.Y,v[0],'barrido Gauss Y');near(s.i,v[1],'barrido Gauss i');near(reg==='float'?s.E:s.MP,v[2],'barrido cierre');
 Object.values(s.residuals).forEach(x=>near(x,0,'residuo del barrido'));
}
// Auditoría del motor histórico: no cambiarlo ni ocultar la discrepancia del ajuste posterior.
const original=fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');
const line=original.split('\n').find(l=>l.startsWith('function calcISLMBP('));const old=new Function('safeDiv',line+';return calcISLMBP;')((a,b)=>a/b);
const hp={c0:30,c1:.75,T:80,b0:60,b1:.15,b2:.25,G:120,x0:50,x1:.1,x2:.3,MP:840,d1:.5,d2:.2,iStar:6};
const hs=old(hp);near(hs.Y,1682.4,'histórico v2 Y');near(hs.eRaw,459.9333333333333,'histórico v2 E crudo');near(hs.eIndex-hs.eRaw,100,'índice histórico suma 100');near(60+.5*hs.Y-.2*6,900,'equivalencia histórica con constante');
const hf={...hp,G:160};const fixedHist=M.solve({...M.BASE,...hf,risk:0,E:hs.eRaw},'fixed');near(fixedHist.MP,940,'dinero histórico v2 fijo');near(fixedHist.MP+60,1000,'equivalencia histórico v1 fijo');
const drift=old({...hp,G:160},-10);const balance=drift.Y-(hp.c0+hp.c1*(drift.Y-hp.T))-(hp.b0+hp.b1*drift.Y-hp.b2*drift.i)-160-drift.NX;near(balance,3,'fxShock posterior rompe bienes en x₂ por 10');
// Ejercicios empresariales, porcentaje y ficha histórica.
near(10000*990-10000*900,900000,'pago importadora');near((10000-6000)*(990-900),360000,'flujo neto exportadora');near((990/900-1)*100,10,'porcentaje empresarial');near((759.27/792.22-1)*100,-4.159198202519502,'promedios históricos');
// Ruta: recorrer controles reales en JSDOM; no habilitar pasos invocando unlock.
const vc=new VirtualConsole(),errs=[];vc.on('jsdomError',e=>errs.push(e.message));
const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),{url:'http://localhost/macro1/index.html?clase=8#route',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true});w.Element.prototype.scrollIntoView=()=>{};w.URL.createObjectURL=()=> 'blob:qa';w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=()=>{};}});
const w=dom.window,d=w.document,L=w.MacroLabLoop,R=w.MFRoute,st=()=>L.classState()['8'];
ok(L.activeClass()==='8','enlace abre Clase 8');ok(errs.length===0,'carga sin errores');
const click=a=>d.querySelector(`[data-mf-action="${a}"]`).click(),fill=(key,value)=>{const el=d.querySelector(`[data-mf-field="${key}"]`);assert.ok(el,'existe campo '+key);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));};
ok(!d.querySelector('#classWorkbench').textContent.includes('E final = 800'),'no pauta antes del intento');click('reading');ok(st().step===0,'lectura requiere casilla');d.querySelector('#c8-read').checked=true;click('reading');ok(st().step===1,'indicadores habilitados');click('indicator');ok(st().step===1,'ficha incompleta bloquea avance');
for(const [k,v]of Object.entries({consultedAt:'2026-11-01',indicatorName:'Dólar observado · BCCh',indicatorValue:'759,27 CLP/USD',indicatorMeta:'2021 · anual · promedio',indicatorSource:'https://si3.bcentral.cl',evidenceType:'observed',indicatorInterpretation:'El promedio de pesos por dólar fue menor que en 2020.',indicatorLimit:'No mide el cambio entre inicio y cierre de 2021.'}))fill(k,v);click('indicator');ok(st().step===2,'desafío habilitado');click('commit');ok(st().step===2,'no revela con respuesta vacía');
for(const [k,v]of Object.entries({answerA:'3.300',answerB:'900',answerC:'1.000',answerD:'10',mechanism:'Creo que E mayor es apreciación; no he separado el régimen de los canales. <script>malicioso</script>'}))fill(k,v);
R.decisions.forEach(x=>fill(x.id,x.id==='convention'?'appreciation':x.answer));click('commit');ok(st().step===3,'intento completo revela pauta');ok(R.assessment(st().initial).filter(x=>!x.ok).length===3,'discrepancias concretas, no inferidas por omisión');const initial=JSON.stringify(st().initial);ok(Object.isFrozen(st().initial),'intento inmutable');
d.querySelector('[data-class-step="2"]').click();ok(!d.querySelector('[data-mf-field="answerC"]'),'volver no permite sobrescribir intento');click('compare');ok(JSON.stringify(st().initial)===initial,'intento conservado al navegar');
fill('comparison','Mi E final era 1.000; debo revisar la apreciación que compensa el gasto.');click('comparison');fill('orientation','convention');fill('orientationEvidence','Escribí que E mayor es apreciación en el mecanismo.');click('orientation');ok(st().step===5,'seis pasos alcanzados con evidencia');click('check');ok(!R.practiceResult(st()).passed,'práctica vacía no cumple');
for(const [k,v]of Object.entries({repairChoice:'costup',practiceE:'750',practiceXN:'−40',reviewE:'800',reviewXN:'−30',revisedMechanism:'Bajo flotación LM y BP mantienen Y e i. G mayor induce apreciación y menor XN; la neutralización exige movilidad perfecta y dinero real dado.',ticket:'La apertura agrega comercio y activos; BP no exige XN cero. Flotación ajusta E y fijo M/P. Para Rosa pediría moneda y plazo del crédito.'}))fill(k,v);
R.decisions.forEach(x=>fill('review_'+x.id,x.answer));click('check');ok(R.practiceResult(st()).passed,'variante y revisión cumplen criterios objetivos');click('export');ok(st().completed,'cierre exige práctica comprobada');ok(JSON.stringify(st().initial)===initial,'revisión no borra primer intento');const report=R.report(st());ok(report.includes('&lt;script&gt;malicioso&lt;/script&gt;')&&!report.includes('<script>malicioso'),'reporte escapa evidencia textual');ok(report.includes('Respuesta revisada')&&report.includes('1.000'),'reporte compara intento y revisión');fill('practiceE','900');ok(!st().completed&&!R.practiceResult(st()).passed,'editar invalida cierre previo');
// Recursos: los PDF y gráficos realmente existen, y la pauta no se enlaza en PDF antes del intento.
const base=path.resolve(__dirname,'..'),docs=JSON.parse(fs.readFileSync(path.join(base,'docs/clase8/documentos.json')));
for(const item of docs){ok(fs.existsSync(path.join(base,item.file)),'HTML presente '+item.source);ok(fs.existsSync(path.join(base,item.pdf)),'PDF presente '+item.source);const html=fs.readFileSync(path.join(base,item.file),'utf8');if(item.source==='pauta')ok(/id="solutions" hidden/.test(html),'pauta inicialmente oculta');}
for(const reg of ['float','fixed'])for(const sh of ['none','fiscal','money']){const r=M.scenario(reg,sh);ok(Math.abs(r.s1.residuals.IS)<1e-8,'gráfico compatible con bienes');}
const appSource=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
for(const source of ['mf-model.js','clase8.js'])ok(appSource.includes(fs.readFileSync(path.join(__dirname,source),'utf8').trim()),'fuente embebida sincronizada '+source);
for(const item of docs){const page=new JSDOM(fs.readFileSync(path.join(base,item.file),'utf8'));const text=page.window.document.body.textContent;ok(!text.includes('**'),'sin delimitadores Markdown visibles '+item.source);for(const el of page.window.document.querySelectorAll('a[href],img[src],link[href]')){const ref=el.getAttribute(el.tagName==='IMG'?'src':'href');if(!ref||/^(https?:|data:|mailto:|#)/.test(ref))continue;const rel=ref.split(/[?#]/)[0];ok(fs.existsSync(path.resolve(path.dirname(path.join(base,item.file)),rel)),'recurso local existe '+item.source+' '+rel);}page.window.close();}
const noteDoc=new JSDOM(fs.readFileSync(path.join(base,'macro1/notas/nota-b5-mundell-fleming-alumno.html'),'utf8'));
const noteText=noteDoc.window.document.body.textContent;ok(noteText.includes('i ≈ i* + 100'),'UIP conserva signo positivo y estrella');ok(noteText.includes('I = b₀ + b₁Y − b₂i:'),'función de inversión conserva i doméstica');ok(!noteDoc.window.document.querySelector('sup em'),'asterisco matemático no se interpreta como énfasis');noteDoc.window.close();
console.log(`Clase 8 · ${n} comprobaciones · ecuaciones, variantes, histórico, ruta, revisión, reporte y recursos: OK`);dom.window.close();
