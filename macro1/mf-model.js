/* Mundell-Fleming: magnitudes reales en unidades docentes; E en CLP/USD; i en %. */
(function(root){
  'use strict';
  const BASE=Object.freeze({c0:100,c1:.75,T:80,b0:160,b1:.15,b2:15,G:200,x0:140,x1:.1,x2:.2,MP:1450,d1:.5,d2:50,iStar:4,risk:0,E:900});
  const SHOCKS=Object.freeze({none:{label:'Equilibrio inicial',delta:{}},fiscal:{label:'G aumenta 20',delta:{G:20}},repair:{label:'Práctica nueva: G aumenta 30',delta:{G:30}},money:{label:'Intento de aumentar M/P en 100',delta:{MP:100}},foreign:{label:'i* aumenta 1 punto porcentual',delta:{iStar:1}},demand:{label:'Demanda externa: x₀ cae 20',delta:{x0:-20}},risk:{label:'Prima constante aumenta 1 punto porcentual',delta:{risk:1}}});
  const fmt=(n,d=2)=>new Intl.NumberFormat('es-CL',{maximumFractionDigits:d,minimumFractionDigits:0}).format(Math.abs(n)<1e-10?0:n).replace(/^-/,"−");
  function solve(p,regime='float'){
    for(const k of Object.keys(BASE))if(!Number.isFinite(p[k]))throw Error('Falta un número finito: '+k);
    const A=1-p.c1-p.b1+p.x1,K=p.c0-p.c1*p.T+p.b0+p.G+p.x0;
    if(!['float','fixed'].includes(regime)||p.c1<0||p.c1>=1||p.b1<0||p.x1<0||A<=0||p.d1<=0||p.d2<=0||p.b2<=0||p.x2<=0||p.MP<=0||p.E<=0)throw Error('Revisa el régimen y los parámetros: se requiere multiplicador positivo y coeficientes de respuesta positivos.');
    const i=p.iStar+p.risk;
    const Y=regime==='float'?(p.MP+p.d2*i)/p.d1:(K+p.x2*p.E-p.b2*i)/A;
    const E=regime==='fixed'?p.E:(A*Y-K+p.b2*i)/p.x2;
    const MP=regime==='fixed'?p.d1*Y-p.d2*i:p.MP;
    const C=p.c0+p.c1*(Y-p.T),I=p.b0+p.b1*Y-p.b2*i,XN=p.x0-p.x1*Y+p.x2*E;
    if(Y<=0||E<=0||MP<=0||C<0||I<0||i<0)throw Error('El resultado sale del dominio económico de este laboratorio.');
    const residuals={IS:Y-C-I-p.G-XN,LM:MP-p.d1*Y+p.d2*i,BP:i-p.iStar-p.risk};
    return {Y,i,E,MP,C,I,XN,A,K,residuals};
  }
  function scenario(regime='float',shock='none',base=BASE){
    if(!SHOCKS[shock])throw Error('Shock desconocido');
    const p0={...base},s0=solve(p0,regime);
    // Bajo fijo, el dinero de partida también es endógeno. Un intento de +100
    // parte del saldo efectivo inicial, incluso al editar otros parámetros.
    if(regime==='fixed')p0.MP=s0.MP;
    const p1={...p0};Object.entries(SHOCKS[shock].delta).forEach(([k,v])=>p1[k]+=v);
    const s1=solve(p1,regime);
    return {p0,p1,s0,s1,regime,shock,attemptedMP:p1.MP,reversed:regime==='fixed'?p1.MP-s1.MP:0};
  }
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function chart(r,id='mf-plot'){
    const {p0,p1,s0,s1,regime,shock}=r;
    const lo=Math.min(3100,s0.Y-140,s1.Y-140),hi=Math.max(3600,s0.Y+140,s1.Y+140),imin=0,imax=Math.max(9,s0.i+3,s1.i+3);
    const X=y=>225+(y-lo)/(hi-lo)*625,Z=i=>365-(i-imin)/(imax-imin)*290;
    const text=(x,y,t,more='')=>`<text x="${x}" y="${y}" ${more}>${esc(t)}</text>`;
    const line=(fn,color,dash='')=>`<path d="${Array.from({length:81},(_,k)=>{const y=lo+(hi-lo)*k/80;return `${k?'L':'M'}${X(y).toFixed(2)},${Z(fn(y)).toFixed(2)}`}).join(' ')}" fill="none" stroke="${color}" stroke-width="3" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
    const is=(p,E)=>y=>(p.c0-p.c1*p.T+p.b0+p.G+p.x0+p.x2*E-(1-p.c1-p.b1+p.x1)*y)/p.b2;
    const lm=(p,MP)=>y=>(p.d1*y-MP)/p.d2;
    let out=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">Equilibrio IS-LM-BP: ${esc(SHOCKS[shock].label)}</title><desc id="${id}-desc">Ejes: producción real Y en unidades docentes y tasa anual i en porcentaje. Inicial Y ${fmt(s0.Y)}, i ${fmt(s0.i)}; final Y ${fmt(s1.Y)}, i ${fmt(s1.i)}. E pasa de ${fmt(s0.E)} a ${fmt(s1.E)} CLP/USD.</desc><style>text{font-family:Arial, sans-serif;font-size:18px;fill:#18334b}.caption{font-size:16px}</style><rect width="1000" height="500" fill="white"/>${text(30,28,regime==='float'?'Flotación: E ajusta para cerrar bienes':'Cambio fijo: el dinero ajusta para defender E','font-weight="bold" font-size="20"')}<defs><clipPath id="${id}-clip"><rect x="225" y="75" width="625" height="290"/></clipPath></defs>`;
    for(let i=0;i<=imax;i+=2){out+=`<line x1="225" y1="${Z(i)}" x2="850" y2="${Z(i)}" stroke="#e0e7ed"/>`+text(209,Z(i)+5,fmt(i),'text-anchor="end"');}
    for(let y=Math.ceil(lo/100)*100;y<=hi;y+=100)out+=`<line x1="${X(y)}" y1="365" x2="${X(y)}" y2="371" stroke="#18334b"/>`+text(X(y),391,fmt(y),'text-anchor="middle"');
    out+=`<path d="M225 75V365H850" fill="none" stroke="#18334b" stroke-width="2"/>${text(150,56,'i (% anual)')}${text(535,421,'Producción real Y (unidades docentes)','text-anchor="middle"')}<g clip-path="url(#${id}-clip)">`;
    out+=line(is(p0,s0.E),'#245b89')+line(lm(p0,s0.MP),'#5d6471')+line(()=>s0.i,'#724f87','3 5');
    const fiscal=shock==='fiscal'||shock==='repair';
    if(fiscal)out+=line(is(p1,s0.E),'#a05220','9 5');
    const sameIS=Math.abs((s1.K+p1.x2*s1.E)-(s0.K+p0.x2*s0.E))<1e-7&&s0.A===s1.A;
    if(!sameIS&&!fiscal)out+=line(is(p1,s1.E),'#a05220','10 4');
    if(Math.abs(s1.MP-s0.MP)>1e-7)out+=line(lm(p1,s1.MP),'#202833','10 4');
    if(Math.abs(s1.i-s0.i)>1e-7)out+=line(()=>s1.i,'#724f87','12 5');
    if(regime==='fixed'&&shock==='money')out+=line(lm(p1,p1.MP),'#9a6029','2 5');
    out+=`</g>`;
    const yL=lo+30,yR=hi-40;
    out+=text(185,Z(is(p0,s0.E)(lo))+5,sameIS?'IS inicial = final':'IS inicial','text-anchor="end" font-weight="bold"');
    out+=text(860,Z(lm(p0,s0.MP)(hi))+5,Math.abs(s1.MP-s0.MP)<1e-7?'LM A = B':'LM inicial');
    out+=text(185,Z(s0.i)+5,Math.abs(s1.i-s0.i)<1e-7?'BP inicial = final':'BP inicial','text-anchor="end"');
    if(fiscal)out+=text(185,Z(is(p1,s0.E)(lo))+5,regime==='float'?'IS de impacto':'IS final (E fijo)','text-anchor="end"');
    if(!sameIS&&!fiscal)out+=text(860,Z(is(p1,s1.E)(hi))+5,'IS final');
    if(Math.abs(s1.MP-s0.MP)>1e-7)out+=text(860,Z(lm(p1,s1.MP)(hi))+5,'LM final');
    if(Math.abs(s1.i-s0.i)>1e-7)out+=text(185,Z(s1.i)+5,'BP final','text-anchor="end"');
    if(regime==='fixed'&&shock==='money')out+=text(860,Z(lm(p1,p1.MP)(hi))+5,'LM intento');
    out+=`<circle cx="${X(s0.Y)}" cy="${Z(s0.i)}" r="5" fill="#18334b"/><circle cx="${X(s1.Y)}" cy="${Z(s1.i)}" r="10" fill="none" stroke="#a05220" stroke-width="3"/>`;
    out+=text(X(s0.Y)-12,Z(s0.i)+26,'A','font-weight="bold"')+text(X(s1.Y)+15,Z(s1.i)-14,'B','font-weight="bold"');
    out+=text(30,453,`A → B: E ${fmt(s0.E)} → ${fmt(s1.E)} CLP/USD · XN ${fmt(s0.XN)} → ${fmt(s1.XN)} u. reales`,'class="caption"');
    out+=text(30,480,'Calibración didáctica, no datos de Chile. Se comparan equilibrios; no es una trayectoria temporal.','class="caption"');
    return out+'</svg>';
  }
  const api={BASE,SHOCKS,fmt,solve,scenario,chart};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.MFModel=api;
})(typeof window==='object'?window:globalThis);
