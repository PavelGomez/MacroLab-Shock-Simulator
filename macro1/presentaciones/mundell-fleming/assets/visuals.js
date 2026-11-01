(function(root){
 'use strict';
 const B=root.MF,fmt=(v,d=2)=>new Intl.NumberFormat('es-CL',{maximumFractionDigits:d}).format(Math.abs(v)<1e-9?0:v),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const typeset=t=>String(t).replace(/[₀₁₂]/g,c=>`<sub>${'₀₁₂'.indexOf(c)}</sub>`);
 const eq=(h,n='')=>`<div class="equation">${typeset(h)}</div>${n?`<p class="figure-note">${n}</p>`:''}`;
 const table=(heads,rows,cap)=>`<div class="table-scroll" tabindex="0" aria-label="Tabla desplazable"><table><caption>${cap}</caption><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i===0?`<th scope="row">${c}</th>`:`<td>${typeof c==='number'?fmt(c):c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 const math=t=>typeset(esc(t));
 const flow=items=>`<div class="mechanism-flow" aria-label="Cadena del mecanismo">${items.map((t,i)=>`${i?'<span class="flow-arrow" aria-hidden="true"></span>':''}<span class="flow-node">${esc(t)}</span>`).join('')}</div>`;
 const linearEquation=r=>`Y = ${fmt(r.yIntercept)} ${r.slope<0?'−':'+'} ${fmt(Math.abs(r.slope))}i`;
 const rounded=v=>(Math.abs(v-Math.round(v*100)/100)>1e-8?'≈ ':'')+fmt(v);
 function curveSpecs(kind){
  const is=(label,G=200,E=900)=>({type:'IS',label,G,E,relation:B.relations({G,E}).IS});
  const lm=(label,m=1450)=>({type:'LM',label,m,relation:B.relations({m}).LM});
  if(kind==='solveLM')return [lm('LM · M/P = 1.450')];
  if(kind==='floatFiscal')return [is('IS inicial = final'),is('IS parcial · G = 220; E = 900',220,900),lm('LM sin cambios')];
  if(kind==='floatMoney')return [is('IS inicial'),is('IS final · E = 1.100',200,1100),lm('LM inicial · M/P = 1.450'),lm('LM final · M/P = 1.550',1550)];
  if(kind==='fixedFiscal')return [is('IS inicial'),is('IS final · G = 220',220,900),lm('LM inicial · M/P = 1.450'),lm('LM requerida · M/P = 1.500',1500)];
  if(kind==='fixedMoney')return [is('IS sin cambios'),lm('LM inicial = final · M/P = 1.450'),lm('LM del intento · M/P = 1.550',1550)];
  return [is('IS · E = 900'),lm('LM · M/P = 1.450')];
 }
 function curveSheet(specs){return `<section class="curve-sheet" aria-label="Ecuaciones de las rectas"><h4>Rectas como Y = F(i)</h4>${specs.map(s=>`<div class="curve-row" data-curve-type="${s.type}"><p>${esc(s.label)}</p><div class="curve-formula">${math(linearEquation(s.relation))}</div></div>`).join('')}</section>`;}
 // Un único acceso por ejercicio; las diapositivas de preparación no lo repiten.
 const interceptCases={
  base:{slide:11,scenario:0,title:'Equilibrio inicial'},
  floatFiscal:{slide:13,scenario:1,title:'Expansión fiscal con flotación'},
  floatMoney:{slide:15,scenario:2,title:'Expansión monetaria con flotación'},
  fixedFiscal:{slide:17,scenario:3,title:'Expansión fiscal con cambio fijo'},
  fixedMoney:{slide:18,scenario:4,title:'Intento monetario con cambio fijo'},
  practiceA:{slide:20,scenario:5,title:'Caso A · Flotación'},
  practiceB:{slide:20,scenario:6,title:'Caso B · Cambio fijo'}
 };
 function interceptContent(key,width=900){
  const c=interceptCases[key];if(!c)return '';
  const r=B.scenarios[c.scenario].result,relations=B.relations({G:r.G,E:r.E,m:r.m});
  return `<p class="intercepts-case"><strong>${esc(c.title)}</strong></p><p>Rectas del equilibrio final de este ejercicio. Para hallar el corte en Y, fija i = 0; para hallar el corte en i, fija Y = 0.</p>${curveSheet([{type:'IS',label:`IS · G = ${fmt(r.G)}; E = ${fmt(r.E)} CLP/USD`,relation:relations.IS},{type:'LM',label:`LM · M/P = ${fmt(r.m)}`,relation:relations.LM}])}<div class="intercepts-scroll" tabindex="0" aria-label="Gráfico de interceptos; desplazable horizontalmente en pantallas angostas">${fullIntercepts(key,r,width)}</div><p class="intercepts-hint">En una pantalla angosta, desplaza la figura horizontalmente para ver ambos ejes con rótulos legibles.</p>`;
 }
 function interceptAccess(s,width,revealed,options){
  if(options.intercepts===false||(s.revealAfter!==null&&!revealed))return '';
  const cases=Object.entries(interceptCases).filter(([,c])=>c.slide===s.id);
  if(options.intercepts==='static')return cases.map(([key,c])=>`<details class="intercepts-optional"><summary>Ver interceptos${cases.length>1?' · '+esc(c.title):''}</summary>${interceptContent(key,width)}</details>`).join('');
  return cases.length?`<div class="intercepts-access">${cases.map(([key,c])=>`<button data-action="intercepts" data-case="${key}" aria-haspopup="dialog" aria-label="Ver interceptos: ${esc(c.title)}">Ver interceptos${cases.length>1?' · caso '+(key==='practiceA'?'A':'B'):''}</button>`).join('')}</div>`:'';
 }
 function fullIntercepts(kind,result,width){
  const small=width<600,w=small?480:820,h=small?350:310,x0=76,x1=w-35,y0=50,y1=h-65;
  const X=x=>x0+x/4200*(x1-x0),Y=i=>y1-(i+35)/90*(y1-y0),R=B.relations({G:result.G,E:result.E,m:result.m});
  const curves=kind==='solveLM'?[{key:'LM',r:R.LM,color:'#205f8b'}]:[{key:'IS',r:R.IS,color:'#205f8b'},{key:'LM',r:R.LM,color:'#b95220'}];
  let b=`<text x="${x0}" y="19" font-size="19">i · % anual</text>`;
  for(const i of [-30,0,50])b+=`<line class="grid" x1="${x0}" x2="${x1}" y1="${Y(i)}" y2="${Y(i)}"/><text class="tick" text-anchor="end" x="${x0-12}" y="${Y(i)+6}">${i}</text>`;
  b+=`<path class="axis" fill="none" d="M${x0},${y0}V${y1}M${x0},${Y(0)}H${x1}"/><text class="tick" x="${x0-4}" y="${Y(0)+25}">0</text><text x="${x1+10}" y="${Y(0)+6}" font-size="20">Y</text>`;
  for(const c of curves){
   const iAt=x=>(x-c.r.yIntercept)/c.r.slope;
   b+=`<path d="M${X(0)},${Y(iAt(0))}L${X(4200)},${Y(iAt(4200))}" stroke="${c.color}" stroke-width="3" fill="none" ${c.key==='LM'?'stroke-dasharray="9 4"':''}/>`;
   b+=`<circle data-intercept="${c.key}-Y" cx="${X(c.r.yIntercept)}" cy="${Y(0)}" r="5" fill="${c.color}"/><circle data-intercept="${c.key}-i" cx="${X(0)}" cy="${Y(c.r.iIntercept)}" r="5" fill="${c.color}"/>`;
   b+=`<text class="tick" text-anchor="middle" x="${X(c.r.yIntercept)}" y="${Y(0)+25}">${fmt(c.r.yIntercept)}</text><text class="tick" x="${x0+11}" y="${Y(c.r.iIntercept)+(c.r.iIntercept<0?26:-9)}">${c.key}: ${rounded(c.r.iIntercept)} %</text>`;
  }
  const title=kind==='solveLM'?'Interceptos de LM':'Interceptos de IS y LM del equilibrio final';
  return `<figure class="intercepts-chart"><h4>${title}</h4>${svgFrame(w,h,title+'. Eje de producción desde cero. Los cortes son algebraicos.',b)}<figcaption>Vista completa: Y entre 0 y 4.200; i entre −35 y 55 %. Cortes algebraicos de las rectas; los valores alejados del equilibrio no son nuevos equilibrios del modelo. La diapositiva conserva la escala cercana al equilibrio.</figcaption></figure>`;
 }
 function lmReferences(s,revealed){
  const lm=(label,m)=>({type:'LM',label,relation:B.relations({m}).LM});
  const general=()=>`<section class="curve-sheet"><h4>LM como Y = F(i)</h4><div class="curve-formula">Y = (M/P)/d₁ + (d₂/d₁)i</div></section>`;
  if(s.id===8)return general();
  if([9,12].includes(s.id))return curveSheet([lm('LM de la base · M/P = 1.450',1450)]);
  if(s.id===14)return curveSheet([lm('LM inicial',1450),lm('LM nueva · M/P = 1.550',1550)]);
  if(s.id===16)return curveSheet([lm('LM de partida',1450)])+eq('LM si M/P acomoda: Y = 2(M/P) + 100i');
  if(s.id===17&&!revealed)return eq('LM con dinero por determinar:<br>Y = 2(M/P) + 100i');
  if(s.id===18&&!revealed)return curveSheet([lm('LM inicial',1450),lm('LM del intento',1550)]);
  if(s.id===19)return curveSheet([lm('Base, fiscal flotante y monetaria fija',1450),lm('Monetaria flotante · M/P = 1.550',1550),lm('Fiscal fija · M/P = 1.500',1500)]);
  if(s.id===20)return curveSheet([lm('Caso A · M/P = 1.500',1500),...(revealed?[lm('Caso B · M/P = 1.475',1475)]:[])])+(revealed?'':eq('Caso B: Y = 2(M/P) + 100i'));
  if(s.id===21)return curveSheet([lm('LM compatible con la paridad',1450),lm('LM del intento inconsistente',1550)]);
  return '';
 }
 function arrow(xa,ya,xb,yb,label,color='#b95220',dy=25){
  const a=Math.atan2(yb-ya,xb-xa),head=8,point=(angle)=>`${xb-head*Math.cos(angle)},${yb-head*Math.sin(angle)}`;
  return `<g data-adjustment="${esc(label)}"><path d="M${xa},${ya}L${xb},${yb}" stroke="${color}" stroke-width="3" fill="none"/><polygon points="${xb},${yb} ${point(a-.5)} ${point(a+.5)}" fill="${color}"/><text text-anchor="middle" x="${(xa+xb)/2}" y="${(ya+yb)/2+dy}" font-size="17">${esc(label)}</text></g>`;
 }
 function svgFrame(w,h,title,body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><style>text{font-family:Arial,sans-serif;fill:#193b4b} .grid{stroke:#dde5e4;stroke-width:1} .axis{stroke:#526774;stroke-width:1.5} .projection{stroke:#b95220;stroke-width:1.5;stroke-dasharray:3 5} .tick{font-size:18px} .direct{font-size:20px;font-weight:bold} .base{stroke:#7c8e95;stroke-width:2;fill:none;stroke-dasharray:8 5} .final{stroke:#205f8b;stroke-width:3.5;fill:none} .impulse{stroke:#b95220;stroke-width:3;fill:none;stroke-dasharray:4 5}</style>${body}</svg>`;}
 function graph(kind,width=900){
  const small=width<600,w=small?480:820,h=small?470:470,x0=72,x1=w-38,y0=44,y1=365,xmin=2800,xmax=3800,ymin=0,ymax=8;
  const X=x=>x0+(x-xmin)/(xmax-xmin)*(x1-x0),Y=y=>y1-(y-ymin)/(ymax-ymin)*(y1-y0);
  let b='';
  for(const x of (small?[2800,3300,3800]:[2800,3000,3300,3500,3800]))b+=`<line class="grid" x1="${X(x)}" x2="${X(x)}" y1="${y0}" y2="${y1}"/><text class="tick" text-anchor="middle" x="${X(x)}" y="${y1+27}">${fmt(x)}</text>`;
  for(const y of [0,2,4,6,8])b+=`<line class="grid" x1="${x0}" x2="${x1}" y1="${Y(y)}" y2="${Y(y)}"/><text class="tick" text-anchor="end" x="${x0-12}" y="${Y(y)+6}">${y}</text>`;
  b+=`<path class="axis" fill="none" d="M${x0},${y0}V${y1}H${x1}"/><text x="${x0}" y="23" font-size="20">i · % anual</text><text text-anchor="end" x="${x1}" y="${h-10}" font-size="20">Y · flujo real / trimestre</text>`;
  // Recorte analítico: ninguna curva sale del área de trazado.
  const line=(fn,css,color='')=>{
   let points=[];for(let x=xmin;x<=xmax;x+=2){const y=fn(x);if(y>=ymin-1e-9&&y<=ymax+1e-9)points.push(`${X(x).toFixed(2)},${Y(Math.max(ymin,Math.min(ymax,y))).toFixed(2)}`)}
   return `<polyline class="${css}" ${color?`style="stroke:${color}"`:''} points="${points.join(' ')}"/>`;
  };
  const IS=(G=200,E=900)=>{const r=B.relations({G,E}).IS;return x=>(x-r.yIntercept)/r.slope;},LM=(m=1450)=>{const r=B.relations({m}).LM;return x=>(x-r.yIntercept)/r.slope;};
  b+=`<line x1="${x0}" x2="${x1}" y1="${Y(4)}" y2="${Y(4)}" stroke="#193b4b" stroke-width="2" stroke-dasharray="12 5 3 5"/><text class="direct" x="${x1-6}" y="${Y(4)-12}" text-anchor="end">BP · i* = 4</text>`;
  let result=B.scenarios[0].result,legend=[];
  if(kind==='solveLM'){
   b+=line(LM(),'final');legend=['LM · M/P = 1.450','BP horizontal · tasa externa 4 %'];
   b+=`<text class="direct" x="${X(3580)}" y="${Y(6.8)-12}">LM</text>`;
  }else if(kind==='floatFiscal'){
   b+=line(IS(),'final')+line(LM(),'base')+line(IS(220,900),'impulse');
   legend=['IS inicial = IS final: G ↑ y E ↓ se compensan','IS con G = 220 y E = 900: comparación parcial','LM: M/P = 1.450'];result=B.scenarios[1].result;
  }else if(kind==='floatMoney'){
   b+=line(IS(),'base')+line(LM(),'base')+line(IS(200,1100),'final')+line(LM(1550),'final','#b95220');
   legend=['Discontinuas: IS y LM de la base','Azul continua: IS con E = 1.100','Naranja continua: LM con M/P = 1.550'];result=B.scenarios[2].result;
  }else if(kind==='fixedFiscal'){
   b+=line(IS(),'base')+line(LM(),'base')+line(IS(220,900),'final')+line(LM(1500),'final','#b95220');
   legend=['Discontinuas: IS y LM de la base','Azul continua: IS con G = 220 y E = 900','Naranja continua: LM requerida, M/P = 1.500'];result=B.scenarios[3].result;
  }else if(kind==='fixedMoney'){
   b+=line(IS(),'final')+line(LM(),'base')+line(LM(1550),'impulse');
   legend=['Azul: IS con E = 900 y G = 200','Gris discontinua: LM inicial = LM final, M/P = 1.450','Naranja punteada: intento con M/P = 1.550'];
  }else{
   b+=line(IS(),'final')+line(LM(),'final','#b95220');legend=['Azul continua: IS con E = 900','Naranja continua: LM con M/P = 1.450'];
   b+=`<text class="direct" x="${X(2990)}" y="${Y(7.1)-12}">IS</text><text class="direct" x="${X(3590)}" y="${Y(6.9)-12}">LM</text>`;
  }
  if(kind==='floatFiscal'){
   b+=arrow(X(3412.5),Y(2.5),X(3512.5),Y(2.5),'G + 20','#b95220',-10);
   b+=arrow(X(3587.5),Y(1.5),X(3487.5),Y(1.5),'E: 900 → 800','#205f8b',26);
   legend.push('Flecha naranja →: impulso con E fija. Flecha azul ←: apreciación que devuelve IS.');
  }
  if(kind==='floatMoney'){
   b+=arrow(X(3000),Y(1),X(3200),Y(1),'LM →','#b95220',-10);
   b+=arrow(X(3450),Y(2),X(3650),Y(2),'IS → por E ↑','#205f8b',26);
  }
  if(kind==='fixedFiscal'){
   b+=arrow(X(3000),Y(1),X(3100),Y(1),'LM →','#b95220',-10);
   b+=arrow(X(3450),Y(2),X(3550),Y(2),'IS → por G ↑','#205f8b',26);
  }
  if(kind==='fixedMoney'){
   b+=arrow(X(3000),Y(1),X(3200),Y(1),'intento →','#b95220',-10);
   b+=arrow(X(3300),Y(2),X(3100),Y(2),'← defensa','#205f8b',-10);
   legend.push('Las flechas muestran el intento y su reversión al sostener E = 900.');
  }
  b+=`<path class="projection" fill="none" d="M${X(result.Y)},${Y(4)}V${y1}"/><circle cx="${X(result.Y)}" cy="${Y(4)}" r="7" fill="#b95220" stroke="white" stroke-width="2"/>`;
  const label=`Y = ${fmt(result.Y)}`;
  b+=`<text class="direct" text-anchor="middle" x="${X(result.Y)}" y="${y1+57}">${label}</text>`;
  if(['floatFiscal','floatMoney','fixedFiscal','fixedMoney'].includes(kind)){
   const labelX=kind==='floatMoney'?3220:kind==='fixedFiscal'?3120:3020;
   const mm=kind==='floatMoney'?1550:kind==='fixedFiscal'?1500:1450,mx=X(3580),my=Y(LM(mm)(3580)),ix=X(labelX),iy=Y(6.5);
   const ig=kind==='fixedFiscal'?220:kind==='floatFiscal'?220:200,ie=kind==='floatMoney'?1100:kind==='floatFiscal'?800:900;
   b+=`<path d="M${ix+25},${iy-22}L${X(labelX+50)},${Y(IS(ig,ie)(labelX+50))}" stroke="#526774" fill="none"/><rect x="${ix-4}" y="${iy-22}" width="94" height="27" fill="white" fill-opacity=".94"/><text class="direct" x="${ix}" y="${iy}">IS final</text>`;
   b+=`<path d="M${mx},${my}l8,-28" stroke="#526774" fill="none"/><rect x="${mx+6}" y="${my-55}" width="95" height="27" fill="white" fill-opacity=".94"/><text class="direct" x="${mx+10}" y="${my-33}">LM${kind==='floatFiscal'?'':' final'}</text>`;
  }
  if(result.Y!==3300)b+=`<circle cx="${X(3300)}" cy="${Y(4)}" r="5" fill="white" stroke="#7c8e95" stroke-width="2"/>`;
  return `<figure class="chart">${svgFrame(w,h,'IS–LM–BP: '+({solveLM:'LM y condición externa',base:'equilibrio inicial',floatFiscal:'expansión fiscal con flotación',floatMoney:'expansión monetaria con flotación',fixedFiscal:'expansión fiscal con cambio fijo',fixedMoney:'intento monetario con cambio fijo'}[kind]||kind)+'. Ejes: producción real entre 2.800 y 3.800; tasa anual entre 0 y 8 %. '+label+'; i = 4 %.',b)}<figcaption>${legend.map((t,i)=>`<span>${i+1}. ${t}</span>`).join('')}<span>Escalas comunes en todas las comparaciones. Curvas: estados, no trayectorias temporales.</span></figcaption></figure>`+curveSheet(curveSpecs(kind));
 }
 function xn(width){
  const small=width<600,w=small?480:820,h=460,x0=76,x1=w-30,y0=40,y1=340,X=x=>x0+(x-2800)/1000*(x1-x0),Y=y=>y1-(y+80)/160*(y1-y0);let b='';
  for(const x of [2800,3300,3800])b+=`<line class="grid" x1="${X(x)}" x2="${X(x)}" y1="${y0}" y2="${y1}"/><text class="tick" text-anchor="middle" x="${X(x)}" y="${y1+26}">${fmt(x)}</text>`;
  for(const y of [-80,-40,0,40,80])b+=`<line class="grid" x1="${x0}" x2="${x1}" y1="${Y(y)}" y2="${Y(y)}"/><text class="tick" text-anchor="end" x="${x0-10}" y="${Y(y)+6}">${y}</text>`;
  b+=`<text x="${x0}" y="22" font-size="20">XN · flujo real / trimestre</text><text text-anchor="end" x="${x1}" y="410" font-size="20">Y · flujo real / trimestre</text><path class="axis" fill="none" d="M${x0},${y0}V${y1}H${x1}"/>`;
  for(const [E,cls] of [[900,'final'],[1000,'impulse']])b+=`<line class="${cls}" x1="${X(2800)}" x2="${X(3800)}" y1="${Y(140-.1*2800+.2*E)}" y2="${Y(140-.1*3800+.2*E)}"/>`;
  b+=`<circle cx="${X(3300)}" cy="${Y(-10)}" r="6" fill="#205f8b"/><text class="direct" x="${X(3300)-10}" text-anchor="end" y="${Y(-10)+30}">XN = −10</text><text class="direct" x="${X(3300)+10}" y="${Y(10)-20}">XN = 10</text><circle cx="${X(3300)}" cy="${Y(10)}" r="6" fill="#b95220"/>`;
  b+=arrow(X(3300),Y(-10),X(3500),Y(-30),'','#205f8b',0)+`<circle cx="${X(3500)}" cy="${Y(-30)}" r="6" fill="#205f8b"/><text x="${X(3500)+9}" y="${Y(-30)+24}" font-size="19">−30</text>`;
  return `<figure class="chart">${svgFrame(w,h,'Exportaciones netas: a Y = 3.300, XN = −10 con E = 900 y XN = 10 con E = 1.000.',b)}<figcaption><span>Continua azul: E = 900. Punteada naranja: E = 1.000.</span><span>A E fija, Y + 200 reduce XN en 20. A Y fija, E + 100 eleva XN en 20.</span></figcaption></figure>`;
 }
 function results(){return table(['Experimento','Y','E · CLP/USD','M/P','XN'],B.scenarios.slice(0,5).map(x=>[x.label,x.result.Y,x.result.E,x.result.m,x.result.XN]),'Niveles finales · gastos y Y: unidades reales por trimestre; dinero: stock real. i = 4 % en todos.');}
 function mainVisual(s,width=900,revealed=false){
  const small=width<600;
  const stacked=(rows)=>`<div class="stacked-comparison">${rows.map(([title,body])=>`<section><h3>${title}</h3><p>${body}</p></section>`).join('')}</div>`;
  const guarded=(html)=>s.revealAfter!==null&&!revealed?`<div class="prediction"><p class="eyebrow">PAUSA PARA CALCULAR</p><h3>${esc(s.prompt)}</h3>${s.screen.map(t=>`<p>${esc(t)}</p>`).join('')}${s.visual==='fixedFiscal'?eq('Y = 2.800 − 75 × 4 + 900<br>M/P = 0,50Y − 50 × 4'):s.visual==='fixedMoney'?eq('Y = 2.700 − 75 × 4 + 900<br>Md = 0,50Y − 50 × 4'):''}<p>Escribe un intento antes de mostrar la respuesta. La narración también la explicará después del silencio.</p><button data-action="reveal">Revelar respuesta y mantener el audio en pausa</button></div>`:html;
  switch(s.visual){
   case 'opening':return `<div class="opening-question"><span>¿Quién absorbe<br>el impulso?</span><div class="duo"><p><b>Dólar flexible</b><br>El precio de la divisa puede cambiar.</p><p><b>Dólar fijo</b><br>La autoridad defiende una paridad.</p></div></div>`;
   case 'trade':return `<div class="trade-flow"><div><p class="eyebrow">RESIDENTES → NO RESIDENTES</p><h3>Exportaciones · X</h3><p>Vino, alojamiento, servicios</p></div><div><p class="eyebrow">NO RESIDENTES → RESIDENTES</p><h3>Importaciones · IM</h3><p>Maquinaria, insumos, servicios</p></div></div>${eq('XN = X − IM = 300 − 310 = −10')}<p class="figure-note">Comprar un bono externo corresponde al canal financiero.</p>`;
   case 'exchange':return `<div class="price-compare"><div><span>E inicial</span><strong>900</strong><small>CLP/USD</small></div><span class="arrow">→</span><div><span>E final</span><strong>990</strong><small>CLP/USD</small></div></div>${eq('USD 1.000 × 990 = $990.000','Aumento de costo: $90.000 / $900.000 = 10 %. Caso ficticio, antes de fletes e impuestos.')}`;
   case 'xn':return eq('XN = x₀ − x₁Y + x₂E<br>XN = 140 − 0,10Y + 0,20E','Calibración usada en esta diapositiva: Y₀ = 3.300; E₀ = 900; XN₀ = −10.')+xn(width);
   case 'goods':return `<div class="formula-parts"><span>C + I + G</span><span class="orange">+ X − IM</span></div>${eq('Z = C + I + G + XN','Z define demanda planeada por producción nacional.')}${eq('Y = Z','Equilibrio: sin inventarios involuntarios.')}<p class="figure-note">C: consumo; I: inversión; G: compras públicas. IM se resta porque parte del gasto ya incluye producción importada.</p>`;
   case 'derive':return eq('A = c₀ − c₁T + b₀ + G + x₀','A mayúscula: gasto autónomo, como en las clases previas.')+eq('a = 1 − c₁ − b₁ + x₁; α = 1/a','a minúscula: coeficiente de Y. α: multiplicador parcial de bienes.')+eq('aY = A − b₂i + x₂E');
   case 'bp':return eq('i = i* = 4 %')+`<div class="bp-line"><span>BP horizontal</span><i></i><span>XN puede ser negativo</span></div><p class="figure-note">Sin prima ni depreciación esperada. No es la identidad de toda la balanza de pagos.</p>`;
   case 'regimes':return eq('M/P = Md = d₁Y − d₂i')+(small?stacked([['Flotación','M/P dado; E ajusta.<br><strong>BP → LM → IS</strong>'],['Cambio fijo','E dado; M/P ajusta.<br><strong>BP → IS → LM</strong>']]):table(['Régimen','Dado','Ajusta','Orden para resolver'],[['Flotación','M/P','E','BP → LM → IS'],['Fijo','E','M/P','BP → IS → LM']],'Precios, parámetros y tasa externa dados en ambos regímenes.'));
   case 'calibration':return `<div class="calibration-equations">${s.screen.map(x=>eq(esc(x))).join('')}${eq('Md = 0,50Y − 50i')}</div><p class="figure-note">Gastos: flujos trimestrales reales. Dinero: stock real. Tasas: % anual. E: CLP/USD.</p>`;
   case 'solveLM':return eq('i = i* = 4 %<br>1.450 = 0,50Y − 50 × 4','Sustituir, sumar 200 y dividir por 0,50. Todas las operaciones aparecen en el panel de pasos.')+graph('solveLM',width);
   case 'base':return eq('0,20Y = 540 − 15i + 0,20E','El panel muestra la división término a término, el despeje de E y las tres comprobaciones.')+graph('base',width);
   case 'questionFiscal':return `<div class="prediction"><p class="eyebrow">PREDICE Y JUSTIFICA</p><h3>G aumenta 20.<br>¿Se moverá el cruce de LM y BP?</h3>${eq('M/P = 1.450; i* = 4 %')}<p>Calcula por separado el impulso con E fija y el resultado final con E endógeno.</p><button data-action="answer">Revelar la respuesta</button></div>`;
   case 'questionMoney':return `<div class="prediction"><p class="eyebrow">PARTE NUEVAMENTE DE LA BASE</p><h3>¿Qué Y y E permiten mantener i = 4 %?</h3>${eq('1.550 = 0,50Y − 200<br>Y = 2.400 + E')}<p>Separa el efecto de E y el efecto de Y sobre XN.</p><button data-action="answer">Revelar la respuesta</button></div>`;
   case 'floatFiscal':return graph('floatFiscal',width)+flow(['G ↑ 20','IS → a E fija','presión de apreciación','E ↓ 100','XN ↓ 20','IS vuelve'])+eq('ΔY = 0; ΔE = −100; ΔXN = −20');
   case 'floatMoney':return graph('floatMoney',width)+flow(['M/P ↑ 100','LM →','presión i ↓','E ↑ 200','IS →','Y ↑ 200'])+eq('ΔY = 200; ΔE = 200; ΔI = 30');
   case 'intervention':return `<div class="intervention"><section><p class="eyebrow">PRESIÓN DE APRECIACIÓN</p><h3>Comprar divisas</h3><p>Dólares → autoridad<br>Pesos → mercado</p><strong>M/P aumenta</strong></section><section><p class="eyebrow">PRESIÓN DE DEPRECIACIÓN</p><h3>Vender divisas</h3><p>Dólares → mercado<br>Pesos → autoridad</p><strong>M/P disminuye</strong></section></div><p class="figure-note">Con P fijo, reservas suficientes y sin esterilización incompatible con la defensa permanente.</p>`;
   case 'fixedFiscal':return guarded(graph('fixedFiscal',width)+flow(['G ↑','presión de apreciación','compra de divisas','M/P ↑ 50','LM →'])+eq('Y = 3.400; M/P requerido = 1.500'));
   case 'fixedMoney':return guarded(graph('fixedMoney',width)+flow(['M/P intenta ↑','presión de depreciación','venta de divisas','retiro de pesos','LM vuelve'])+eq('M/P final = 1.450; ΔY final = 0'));
   case 'matrix':return (small?`<p class="figure-note">Niveles finales. Y y XN: flujo real/trimestre; M/P: stock real; E: CLP/USD. i = 4 % en todos.</p>`+stacked(B.scenarios.slice(1,5).map(x=>[x.label,`Y = ${fmt(x.result.Y)}; E = ${fmt(x.result.E)}<br>M/P = ${fmt(x.result.m)}; XN = ${fmt(x.result.XN)}`])):results())+`<p class="mechanism">Flotación ajusta E.<br>La paridad fija exige acomodar M/P.</p>`;
   case 'retrieval':return guarded(small?stacked([['A · Flotación','Y = 3.400; i = 4 %<br>E = 1.000; M/P = 1.500'],['B · Fijo','Y = 3.350; i = 4 %<br>E = 900; M/P = 1.475']]):table(['Caso','Y','i · %','E','M/P'],[['A · Flotación',3400,4,1000,1500],['B · Fijo',3350,4,900,1475]],'Soluciones · cada caso parte de la base.'));
   case 'trilemma':return `<div class="trilemma"><div>Tipo de cambio<br><strong>fijo</strong></div><span>↔</span><div>Movilidad de capitales<br><strong>libre</strong></div><span>↔</span><div>Política monetaria<br><strong>independiente</strong></div></div>${eq('Las tres opciones no son compatibles simultáneamente.','En el caso fijo con movilidad perfecta, el dinero acomoda la defensa de E.')}`;
   case 'limits':return small?stacked([['Precios dados','Permite: Y responde a demanda.<br>Fuera: inflación y capacidad limitada.'],['Prima y depreciación esperada nulas','Permite: i = i*.<br>Fuera: riesgo y expectativas.'],['x₂ > 0','Permite: mejora comercial neta.<br>Fuera: rezagos y curva J.'],['Paridad creíble','Permite: M/P acomoda.<br>Fuera: crisis de reservas.']]):table(['Supuesto','Qué permite','Qué deja fuera'],[['Precios dados','Y responde a demanda','Inflación y capacidad limitada'],['Prima y depreciación esperada nulas','i = i*','Riesgo y expectativas'],['x₂ > 0','Mejora comercial neta','Rezagos y curva J'],['Paridad creíble','M/P acomoda','Crisis de reservas']],'Los resultados cambian si se modifica el cierre.');
   case 'chile':return `<div class="institution"><p>Metas de inflación</p><span>+</span><p>Tipo de cambio flexible</p></div>${eq('TPM → objetivo para la tasa interbancaria','La liquidez se administra para sostener el objetivo de tasa.')}<p class="figure-note">Fuente: Banco Central de Chile, «Política Monetaria», consulta 01-11-2026. Contexto institucional; sin series coyunturales.</p>`;
   case 'business':return eq('USD 10.000 − USD 6.000 = USD 4.000')+`<div class="business-compare"><p><span>E = 900</span><strong>$3.600.000</strong></p><p><span>E = 990</span><strong>$3.960.000</strong></p></div>${eq('Diferencia: $360.000','Flujo neto expuesto del caso ficticio. No equivale a utilidad neta.')}`;
   default:return '';
  }
 }
 function guide(s,block=null,revealed=true,options={}){
  const steps=s.steps||[],all=options.mode==='all'||block===null;
  const eligible=steps.filter(x=>s.revealAfter===null||revealed||x.block<s.revealAfter);
  const chosen=options.mode==='manual'?eligible.find(x=>x.block===options.manualBlock):[...eligible].reverse().find(x=>x.block<=(block??99));
  const selected=chosen||eligible[0];if(!selected)return '';
  const shown=all?eligible:[selected];
  return `<section class="calculation-guide" aria-label="Pasos visibles de ${esc(s.title)}"><div class="guide-heading"><div><p class="eyebrow">VER EL RAZONAMIENTO</p><h3>Paso a paso</h3></div><span class="guide-state">${all?'Desarrollo completo':options.mode==='manual'?'Consulta en pausa':'Sigue la locución'}</span></div>${block!==null?`<div class="guide-controls">${steps.map((x,i)=>`<button data-step-block="${x.block}" aria-pressed="${!all&&selected.block===x.block}" ${!eligible.includes(x)?'disabled':''} aria-label="Consultar paso ${i+1}: ${esc(x.title)}">${i+1}</button>`).join('')}<button data-action="allsteps">${s.revealAfter!==null&&!revealed?'Ver todos los pasos y la respuesta':'Ver todos los pasos'}</button>${options.mode&&options.mode!=='follow'?'<button data-action="followsteps">Volver al paso de la locución</button>':''}</div>`:''}${shown.map(x=>`<section class="guide-step" data-visible-step="${x.block}" tabindex="0" aria-label="${esc(x.title)}"><h4>${esc(x.title)}</h4><ol>${x.lines.map(line=>`<li><div class="step-equation">${math(line)}</div></li>`).join('')}</ol>${x.flow?.length&&![13,15,17,18].includes(s.id)?flow(x.flow):''}${x.note?`<p class="step-note">${esc(x.note)}</p>`:''}</section>`).join('')}<p class="guide-help">${block===null?'Desarrollo para consulta sin audio.':'Consultar un paso pausa la voz y conserva el instante. Al pulsar Escuchar, el panel vuelve a seguir la locución.'}</p></section>`;
 }
 function visual(s,width=900,revealed=false,block=null,options={}){return `<div class="main-piece">${mainVisual(s,width,revealed)}${lmReferences(s,revealed)}${interceptAccess(s,width,revealed,options)}</div>`+guide(s,block,revealed,options);}
 root.Visuals={visual,guide,graph,xn,results,table,eq,fmt,esc,linearEquation,curveSpecs,fullIntercepts,interceptCases,interceptContent};
})(typeof window!=='undefined'?window:globalThis);
