#!/usr/bin/env node
"use strict";
const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM,VirtualConsole}=require('jsdom');
let n=0;const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),{runScripts:'dangerously',url:'http://localhost/macro1/#din',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.Element.prototype.scrollIntoView=()=>{};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,k)=>k==='measureText'?()=>({width:10}):()=>{},set:()=>true})}});
const w=dom.window,d=w.document,L=w.MacroLabLoop.lab;
function ok(c,label){n++;assert.ok(c,label)}
function near(a,b,label,tol=1e-7){ok(Number.isFinite(a)&&Math.abs(a-b)<=tol,`${label}: ${a} ≈ ${b}`)}
const el=id=>d.getElementById(id),set=(id,v)=>{L.setValue(id,v);el(id).dispatchEvent(new w.Event('input',{bubbles:true}))},click=id=>el(id).click();
const initial={Y:1000,Ms:760,d1:.8,d2:20,regime:'quantity',target:2};
ok(!errors.length,'sin errores al iniciar');ok(!el('din').hidden,'#din conserva acceso a mercado de dinero');
near(L.bondYield(100,95),5.263157894736842,'rendimiento 95');near(L.bondPrice(100,5),95.23809523809524,'precio 5 %');near(L.bondYield(100,100),0,'precio igual a VF');near(L.bondYield(100,105),-4.761904761904762,'precio superior a VF válido');
for(const [VF,P] of [[100,95],[250,262.5],[80,80],[1000,600]])near(L.bondPrice(VF,L.bondYield(VF,P)),P,'ida y vuelta');
for(const v of [0,-1,NaN,Infinity,1e13]){ok(L.bondYield(v,95)===null,'VF inválido');ok(L.bondYield(100,v)===null,'precio inválido')}
for(const v of [-100,-101,NaN,Infinity,1e13])ok(L.bondPrice(100,v)===null,'tasa inválida');
set('bond-price',105);ok(el('bond-rate-result').textContent.includes('−4,7619048'),'rendimiento negativo en pantalla');
const bText=el('bond-price-result').textContent;set('bond-vf-rate',200);ok(el('bond-price-result').textContent===bText,'paneles independientes');
set('bond-price','');ok(el('bond-rate-result').classList.contains('error'),'vacío validado');ok(!el('bond-rate-result').textContent.includes('ganas'),'no queda resultado anterior');
set('bond-interest',-100);ok(el('bond-price-result').classList.contains('error'),'−100 % inválido');click('bond-reset');near(L.num('bond-price'),95,'reset bonos');
click('bond-case-a');near(L.num('bond-price'),95.238,'actividad bonos A explícita');click('bond-case-b');near(L.num('bond-price'),96.154,'actividad bonos B explícita');click('bond-reset');
let r=L.moneySolve(initial);near(r.interest,2,'equilibrio inicial');near(r.horizontal,800,'intercepto horizontal');near(r.vertical,40,'intercepto vertical');near(r.slope,-.05,'pendiente en (dinero,i)');
near(L.moneySolve({...initial,Y:1010}).interest,2.4,'sube Y con cantidad fija');near(L.moneySolve({...initial,Y:1010,regime:'target'}).quantity,768,'sube Y con tasa fija');near(L.moneySolve({...initial,Ms:800}).interest,0,'compra a 800');
for(const bad of [{Y:-1},{Y:NaN},{Y:Infinity},{d1:-1},{d2:0},{d2:-1},{Ms:-1},{Ms:NaN},{Ms:Infinity},{Y:1e13},{d2:1e-20}])ok(!L.moneySolve({...initial,...bad}).ok,'rechaza '+JSON.stringify(bad));
ok(L.moneySolve({...initial,Y:0,d1:0,Ms:0}).ok,'cero en Y,d1,oferta válido');
ok(L.moneySolve({...initial,Ms:900}).interest<0,'negativo algebraico conservado');ok(!L.moneySolve({...initial,regime:'target',target:41}).ok,'objetivo no factible');
click('moneyReset');set('moneyY',1010);near(L.moneyInterest(),2.4,'input modifica cálculo');
// Cambio de régimen conserva la tasa vigente y después conserva la cantidad requerida.
el('money-regime').value='target';el('money-regime').dispatchEvent(new w.Event('change'));near(L.num('money-target'),2.4,'transición conserva tasa');ok(el('moneyMs').disabled,'oferta deja de ser entrada');set('money-target',2);near(L.num('moneyMs'),768,'cantidad requerida');set('moneyY',1020);near(L.num('moneyMs'),776,'Y modifica cantidad sin mover tasa');near(L.moneyInterest(),2,'tasa objetivo constante');
el('money-regime').value='quantity';el('money-regime').dispatchEvent(new w.Event('change'));near(L.num('moneyMs'),776,'transición conserva cantidad');ok(!el('moneyMs').disabled,'oferta editable de nuevo');
click('moneyReset');const before=JSON.stringify(L.params('din')),result=JSON.stringify(L.results('din'));click('money-zoom');ok(JSON.stringify(L.params('din'))===before,'zoom conserva parámetros');ok(JSON.stringify(L.results('din'))===result,'zoom conserva resultados');ok(el('money-intercepts').textContent.includes('fuera del encuadre'),'zoom avisa interceptos ocultos');ok(el('moneyChart').textContent.includes('i = 2 %'),'equilibrio rotulado en zoom');click('money-scale-reset');ok(el('money-full').getAttribute('aria-pressed')==='true','restauración de escala');
click('omoBuy');near(L.num('moneyMs'),800,'compra suma monto real');near(L.moneyInterest(),0,'compra baja tasa a cero');click('omoSell');near(L.num('moneyMs'),760,'venta resta');set('money-step',761);click('omoSell');near(L.num('moneyMs'),760,'venta excesiva no trunca');ok(el('moneyFeedback').textContent.includes('máximo es 760'),'límite explicado');set('money-step','');click('omoBuy');near(L.num('moneyMs'),760,'intervención vacía no cambia oferta');
set('moneyD2',0);ok(!el('moneyChart').innerHTML,'entrada inválida elimina gráfico anterior');ok(L.results('din').valid===false,'exportación no usa resultado anterior');set('moneyD2',20);set('moneyMs',900);near(L.moneyInterest(),-5,'tasa negativa visible');ok(el('moneyChart').textContent.includes('−5'),'gráfico incluye tasa negativa');
for(const id of ['moneyY','moneyD1','moneyD2','moneyMs']){click('moneyReset');set(id,'');ok(el('moneyFeedback').classList.contains('error'),'vacío en '+id);ok(!el('moneyChart').innerHTML,'sin gráfico obsoleto '+id)}
click('moneyReset');el('money-regime').value='target';el('money-regime').dispatchEvent(new w.Event('change'));set('money-target',41);ok(el('moneyFeedback').textContent.includes('no factible'),'inviabilidad comunicada');ok(el('moneyMs').value==='','no muestra cantidad negativa como resultado válido');
click('moneyReset');const host=d.querySelector('.activity[data-window="din"]'),sel=host.querySelector('select');sel.value='0';sel.dispatchEvent(new w.Event('change'));set('moneyY',1050);near(L.moneyInterest(),4,'seleccionar actividad no la carga');host.querySelector('.load-activity').click();near(L.num('moneyY'),1000,'carga explícita');ok(host.querySelector('.activity-loaded').textContent.includes('DIN-EX-02'),'identifica actividad');near(L.num('money-step'),8,'carga tamaño intervención');set('moneyY',1010);L.drawMoney();near(L.num('moneyY'),1010,'recálculo no restaura preset');host.querySelector('.reset-activity').click();near(L.num('moneyY'),1000,'volver a valores de actividad');set('moneyY',1050);click('moneyReset');near(L.num('money-step'),40,'reset inicial distinto de actividad');ok(sel.value==='','reset borra selección activa');ok(w.eval('currentActivity.din')===undefined,'reset borra actividad activa');
for(const win of ['med','cta','cruz','din','lm','is','islm','lab']){const panel=el(win),practice=panel.querySelector('details.practice');ok(practice===panel.lastElementChild,win+' práctica al final');ok(panel.querySelectorAll('.activity').length===1,win+' selector único');ok(!panel.querySelector('details.guide').open,win+' explicación opcional');ok(panel.querySelector(win==='cta'?'#ctaCats':'.grid')?.compareDocumentPosition(practice)&w.Node.DOCUMENT_POSITION_FOLLOWING,win+' operación antes de práctica')}
ok(el('bonos').lastElementChild.matches('details.practice'),'bonos práctica final');
set('med-base',20);el('med-base').dispatchEvent(new w.Event('change'));L.calcMeasurement();const rows=L.measurement();near(rows[1].def,100,'deflactor base 2020');near(rows[1].ipc,100,'IPC base 2020');ok(L.params('med').baseYear===2020,'exporta base elegida');ok(el('medExplain').textContent.includes('Coinciden en 100'),'interpretación respeta índices coincidentes en la base');
const mi=d.querySelector('#medInputs input');mi.value='';L.calcMeasurement();ok(!el('medResults').innerHTML,'índices inválidos no mantienen tabla');
for(const input of ['moneyY','moneyD1','moneyD2','moneyMs']){click('moneyReset');set(input,'1e100');ok(el('moneyFeedback').classList.contains('error'),'extremo '+input)}
click('moneyReset');ok(!/NaN|Infinity|infinito/.test(el('moneyFeedback').textContent+el('moneyChart').textContent),'sin resultados no finitos');
// El diseño real usa el ancho del SVG: los rótulos también se comprueban en móvil.
for(const width of [320,390,520,620]){
  el('moneyChart').getBoundingClientRect=()=>({width});
  for(const quantity of [0,760,800,900])for(const zoom of [false,true]){
    click('moneyReset');set('moneyMs',quantity);click(zoom?'money-zoom':'money-full');
    const boxes=(L.plotLayouts.moneyChart||[]).filter(b=>!b.line);let overlaps=0;
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(a.x<b.x+b.w-.5&&b.x<a.x+a.w-.5&&a.y<b.y+b.h-.5&&b.y<a.y+a.h-.5)overlaps++}
    ok(boxes.length>3&&overlaps===0,'rótulos sin solapamiento '+width+' '+quantity+' '+zoom);
    ok(!/NaN|Infinity|undefined/.test(el('moneyChart').innerHTML),'SVG finito en escalas responsive');
  }
}
// Vacíos y extremos dejan de mostrar una representación previa en los mercados relacionados.
for(const [win,id,chart,draw] of [['lm','lmD2','lmChart',L.drawLm],['is','isB2','isChart',L.drawIs],['islm','islmD2','islmChart',L.drawIslm]]){
  set(id,'');draw();ok(!el(chart).innerHTML,win+' vacío limpia el gráfico');
}
set('employed',0);set('unemployed',0);set('inactive',0);L.calcLabor();ok(el('laborStatus').textContent.includes('no está definida'),'denominador cero no se transforma en desempleo 0 %');

ok(!errors.length,'sin errores de ejecución en todos los casos');
console.log(`test_experimentacion.js — ${n} aserciones · RESULTADO: OK`);dom.window.close();
