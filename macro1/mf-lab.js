(function(){
'use strict';
const M=window.MFModel,$=id=>document.getElementById(id),f=M.fmt;
const labels={c0:'c₀ · consumo autónomo (u.)',c1:'c₁ · fracción consumida',T:'T · impuestos fijos (u.)',b0:'b₀ · inversión autónoma (u.)',b1:'b₁ · respuesta de I a Y',b2:'b₂ · respuesta de I a i (u./pp)',G:'G · gasto público (u.)',x0:'x₀ · autónomo neto (u.)',x1:'x₁ · respuesta de IM a Y',x2:'x₂ · respuesta de XN a E',MP:'M/P · dato solo en flotación (u.)',d1:'d₁ · respuesta de Md a Y',d2:'d₂ · respuesta de Md a i (u./pp)',iStar:'i* · tasa externa (% anual)',risk:'ρ · prima constante (pp)',E:'E · paridad si fijo (CLP/USD)'};
let current=null;
function number(raw){let s=String(raw).trim();if(!s)return NaN;if(!/^[+−-]?[0-9]+(?:[.,][0-9]+)*$/.test(s))return NaN;s=s.replace('−','-');if(s.includes(','))s=s.replaceAll('.','').replace(',','.');else if(/^[+-]?\d{1,3}(\.\d{3})+$/.test(s))s=s.replaceAll('.','');return Number(s)}
$('mf-shock').innerHTML=Object.entries(M.SHOCKS).map(([k,s])=>`<option value="${k}">${s.label}</option>`).join('');
$('mf-parameters').innerHTML=Object.entries(labels).map(([k,label])=>`<label for="param-${k}">${label}<input id="param-${k}" inputmode="decimal" value="${f(M.BASE[k])}" autocomplete="off"></label>`).join('');
function render(){
 try{
  $('param-E').disabled=$('mf-regime').value==='float';
  $('param-MP').disabled=$('mf-regime').value==='fixed';
  const base={...M.BASE};for(const k of Object.keys(labels)){base[k]=number($('param-'+k).value);$('param-'+k).removeAttribute('aria-invalid');if(!Number.isFinite(base[k])){$('param-'+k).setAttribute('aria-invalid','true');throw Error('Escribe un número válido para '+labels[k]);}}
  current=M.scenario($('mf-regime').value,$('mf-shock').value,base);
  const {s0,s1,p1,regime,shock}=current;
  const names={Y:'Producción Y (u. reales)',i:'Tasa i (% anual)',E:'E (CLP/USD)',MP:'Dinero M/P (u. reales)',XN:'Exportaciones netas XN (u. reales)',C:'Consumo C (u. reales)',I:'Inversión I (u. reales)'};
  const same=Math.abs(s0.Y-s1.Y)<1e-8&&Math.abs(s0.i-s1.i)<1e-8;
  let mechanism=regime==='float'?'Orden: BP determina i; LM determina Y; IS determina E.':'Orden: BP determina i; IS determina Y con E fijo; LM determina el dinero que sostiene la paridad.';
  if(shock==='fiscal'||shock==='repair')mechanism+=regime==='float'?' G mayor desplaza inicialmente la IS; la apreciación reduce XN. Con estas condiciones, la IS final vuelve a la inicial.':' G mayor desplaza la IS; comprar divisas expande el dinero para defender E, y la LM final se acomoda.';
  if(shock==='money')mechanism+=regime==='float'?' Más dinero desplaza LM; la presión de depreciación eleva XN y desplaza IS hasta el nuevo cruce con BP.':` Se intentó M/P = ${f(p1.MP)}, pero defender E requiere ${f(s1.MP)}. La venta de divisas retira ${f(p1.MP-s1.MP)} y revierte el intento monetario.`;
  if(shock==='demand')mechanism+=regime==='float'?' x₀ menor desplaza IS inicialmente a la izquierda; E sube para compensar el menor gasto autónomo externo.':' x₀ menor reduce Y; el banco vende divisas y retira dinero para evitar la depreciación.';
  if(shock==='foreign'||shock==='risk')mechanism+=' La BP se desplaza hacia arriba y sigue horizontal. El resultado depende del cierre y no predice el efecto de una noticia financiera en Chile.';
  $('mf-results').innerHTML=`<p class="notice">${mechanism}</p><div class="results"><div class="table-wrap"><table><caption>Dos equilibrios; cambios desde la misma base</caption><thead><tr><th>Variable</th><th>Inicial A</th><th>Final B</th><th>Cambio</th></tr></thead><tbody>${Object.entries(names).map(([k,label])=>`<tr data-result="${k}"><th scope="row">${label}</th><td>${f(s0[k])}</td><td>${f(s1[k])}</td><td>${f(s1[k]-s0[k])}</td></tr>`).join('')}</tbody></table></div><figure><p class="mobile-figure-hint">Desliza el gráfico horizontalmente para leer sus ejes y etiquetas.</p><div class="mf-chart-scroll">${M.chart(current)}</div><figcaption>${same?'Los marcadores A y B coinciden en Y e i. Lee E y XN para saber qué cambió. ':''}Líneas continuas: estado inicial; trazos largos: estado final o IS de impacto identificada directamente. La BP usa puntos. No representan tiempo ni velocidades. Los demás parámetros permanecen dados.</figcaption></figure></div><h2>Comprobar las ecuaciones originales</h2><p>Un residuo es la diferencia entre los dos lados de una condición de equilibrio. Cero significa que se cumple. C e I se calculan con las funciones de la nota; no se corrigen después.</p><div class="table-wrap"><table><thead><tr><th>Residuo</th><th>Inicial</th><th>Final</th><th>Unidad</th></tr></thead><tbody>${[['IS','Y − C − I − G − XN','u. reales'],['LM','M/P − (d₁Y − d₂i)','u. reales'],['BP','i − i* − ρ','puntos porcentuales']].map(([k,label,u])=>`<tr><th>${label}</th><td>${f(s0.residuals[k],8)}</td><td>${f(s1.residuals[k],8)}</td><td>${u}</td></tr>`).join('')}</tbody></table></div><p>Las tres condiciones se comprueban con precisión completa, antes de redondear la tabla. La extensión de prima constante mantiene expectativas planas.</p>`;
  const max=Math.max(...Object.values(s0.residuals).map(Math.abs),...Object.values(s1.residuals).map(Math.abs));
  if(max>1e-7)throw Error('Las ecuaciones no cierran: revisa la calibración.');
  $('lab-status').textContent='IS, LM y BP verificadas simultáneamente. Los shocks no se acumulan.';
  $('mf-download').disabled=false;
 }catch(e){current=null;$('mf-results').innerHTML='';$('lab-status').textContent=e.message;$('mf-download').disabled=true;}
}
$('mf-regime').addEventListener('change',render);$('mf-shock').addEventListener('change',render);
Object.keys(labels).forEach(k=>$('param-'+k).addEventListener('change',render));
$('mf-reset').addEventListener('click',()=>{for(const k of Object.keys(labels))$('param-'+k).value=f(M.BASE[k]);$('mf-shock').value='none';$('mf-regime').value='float';render()});
$('mf-print').addEventListener('click',()=>window.print());
$('mf-download').addEventListener('click',()=>{if(!current)return;const payload={schema:'macrolab-mundell-fleming/1.0',generated_at:new Date().toISOString(),units:{real:'unidades reales docentes',E:'CLP/USD',i:'porcentaje anual',risk:'puntos porcentuales'},status:'calibracion_didactica_no_pronostico',...current};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='MacroLab_Clase8_escenario.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
const query=new URLSearchParams(location.search);if(M.SHOCKS[query.get('shock')])$('mf-shock').value=query.get('shock');if(['float','fixed'].includes(query.get('regime')))$('mf-regime').value=query.get('regime');
window.MFLab={number,current:()=>current,render};render();
})();
