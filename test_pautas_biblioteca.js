#!/usr/bin/env node
/**
 * test_pautas_biblioteca.js — Capa de auditoría biblioteca ↔ simulador
 *
 * Corre cada pauta sellada de la biblioteca de bloques MAC-GRAPH-MVP contra los
 * solvers REALES de script.js. Si alguna vez vuelven a divergir, este test falla.
 *
 * Origen: el 2026-08-15 se detectó que ISLM-EX-03 v0.1 tenía la IS mal despejada
 * (1.200 en vez de 1.600). El error sobrevivió a una revisión humana y sólo apareció
 * al confrontar la pauta con una segunda implementación. Esta capa automatiza esa
 * confrontación.
 *
 * Uso:  node test_pautas_biblioteca.js
 * Salida: código 0 si todo cuadra; 1 si hay divergencias.
 */

const fs = require('fs');
const path = require('path');

/* ---- carga de los solvers desde script.js, sin DOM ---- */
const src = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
function extract(name) {
  const re = new RegExp(`function ${name}\\([\\s\\S]*?\\n(?=function |const |let |\\/\\*)`, 'm');
  const m = src.match(new RegExp(`function ${name}\\(.*?\\n`, 's'));
  const start = src.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`No se encontró ${name} en script.js`);
  // las funciones del repo están minificadas en una línea
  const end = src.indexOf('\n', start);
  return src.slice(start, end);
}
const sandbox = { safeDiv: (a, b) => (b === 0 ? NaN : a / b) };
['calcISLM', 'isCurve', 'calcISLMBP'].forEach(fn => {
  // eslint-disable-next-line no-new-func
  sandbox[fn] = new Function('safeDiv', `${extract(fn)}; return ${fn};`)(sandbox.safeDiv);
});
const { calcISLM, calcISLMBP } = sandbox;

/* ---- utilidades ---- */
let fails = 0, checks = 0;
const r = (x, n = 2) => Number(Number(x).toFixed(n));
function eq(label, got, want, tol = 0.005) {
  checks++;
  const ok = Math.abs(got - want) <= tol;
  if (!ok) { fails++; console.log(`  ✘ ${label}: simulador ${r(got, 4)} vs pauta ${want}`); }
  else console.log(`  ✔ ${label} = ${r(got, 2)}`);
}
const head = t => console.log(`\n── ${t}`);

/* =========================================================================
   BLOQUE ISLM — economía cerrada
   ========================================================================= */
head('ISLM-EX-01 · T fija (Ayudantía 8)');
{
  const p = { c0:220, c1:0.65, T:90, b0:280, b1:0.25, b2:55, G:320, MP:500, d1:0.12, d2:45 };
  const s = calcISLM(p, 'upward', 'fixed');
  eq('Y*', s.Y, 5564.64, 0.01);
  eq('i*', s.i, 3.7279, 0.001);
  // guardia explícita contra el valor erróneo de v0.1
  if (r(s.Y, 1) === 5563.5) { fails++; console.log('  ✘ REGRESIÓN: reapareció el 5.563,5 de v0.1'); }
}

head('ISLM-EX-02 · T = t·Y proporcional (NATIVO desde v0.6)');
{
  const p = { c0:100, c1:0.75, t:0.20, T:0, b0:300, b1:0, b2:40, G:400, MP:350, d1:0.25, d2:50 };
  const s = calcISLM(p, 'upward', 'proportional');
  eq('pendiente c1(1−t)', s.mpc, 0.60);
  eq('multiplicador', s.mult, 2.5);
  eq('Y*', s.Y, 1800);
  eq('i*', s.i, 2);
  const s2 = calcISLM({ ...p, G:460 }, 'upward', 'proportional');
  eq('Y* con G=460', s2.Y, 1900);
  eq('i* con G=460', s2.i, 2.5);
  // estabilizador automático: subir t reduce el multiplicador
  const alta = calcISLM({ ...p, t:0.40 }, 'upward', 'proportional');
  checks++;
  if (!(alta.mult < s.mult)) { fails++; console.log('  ✘ subir t NO redujo el multiplicador'); }
  else console.log(`  ✔ estabilizador: t 0,20→0,40 baja el multiplicador de ${r(s.mult)} a ${r(alta.mult)}`);
  // y amortigua el mismo shock fiscal
  const dBaja = calcISLM({ ...p, G:460 }, 'upward', 'proportional').Y - s.Y;
  const dAlta = calcISLM({ ...p, t:0.40, G:460 }, 'upward', 'proportional').Y - alta.Y;
  checks++;
  if (!(Math.abs(dAlta) < Math.abs(dBaja))) { fails++; console.log('  ✘ t mayor NO amortiguó el shock'); }
  else console.log(`  ✔ mismo ΔG=+60: ΔY cae de ${r(dBaja)} (t=0,20) a ${r(dAlta)} (t=0,40)`);
}

head('ISLM-EX-03 · acelerador vs crowding-out  [origen del hallazgo]');
{
  const p = { c0:50, c1:0.8, T:0, b0:10, b1:0.1, b2:5, G:100, MP:100, d1:0.25, d2:10 };
  const a = calcISLM(p, 'upward', 'fixed');
  eq('Y inicial', a.Y, 933.33, 0.01);
  eq('i inicial', a.i, 13.3333, 0.001);
  eq('I inicial', a.investment, 36.6667, 0.001);
  const b = calcISLM({ ...p, G:120 }, 'upward', 'fixed');
  eq('Y final', b.Y, 1022.22, 0.01);
  eq('i final', b.i, 15.5556, 0.001);
  eq('ΔI', b.investment - a.investment, -2.2222, 0.001);
  eq('acelerador b1·ΔY', 0.1 * (b.Y - a.Y), 8.8889, 0.001);
  eq('desplazamiento b2·Δi', 5 * (b.i - a.i), 11.1111, 0.001);
  if (r(a.Y) === 755.56) { fails++; console.log('  ✘ REGRESIÓN: reapareció el 755,56 de v0.1'); }
}

head('ISLM-EX-04 · cuadrante de desequilibrio');
{
  const p = { c0:50, c1:0.8, T:0, b0:10, b1:0.1, b2:5, G:100, MP:100, d1:0.25, d2:10 };
  const s = calcISLM(p, 'upward', 'fixed');
  const iIS = (1600 - 600) / 50, iLM = (600 - 400) / 40;
  eq('i que pide la IS en Y=600', iIS, 20);
  eq('i que pide la LM en Y=600', iLM, 5);
  checks++;
  if (!(6 < iIS && 6 > iLM)) { fails++; console.log('  ✘ el punto (600, 6 %) ya no cae en el cuadrante C'); }
  else console.log('  ✔ punto (600; 6 %) en cuadrante C: exceso de demanda de bienes y de oferta de dinero');
  eq('converge a Y*', s.Y, 933.33, 0.01);
}

head('ISLM-EX-05 · LM horizontal (régimen de tasa objetivo)');
{
  const p = { c0:50, c1:0.8, T:0, b0:10, b1:0.1, b2:5, G:100, MP:100, d1:0.25, d2:10, iFixed:8 };
  const a = calcISLM(p, 'horizontal', 'fixed');
  const b = calcISLM({ ...p, G:120 }, 'horizontal', 'fixed');
  eq('Y inicial', a.Y, 1200);
  eq('Y final', b.Y, 1400);
  eq('ΔY (multiplicador completo)', b.Y - a.Y, 200);
  eq('ΔI (acelerador puro)', b.investment - a.investment, 20);
  checks++;
  if (b.i !== a.i) { fails++; console.log('  ✘ la tasa se movió bajo LM horizontal'); }
  else console.log('  ✔ Δi = 0: sin crowding-out, como exige la pauta');
}

/* =========================================================================
   BLOQUE ABR — economía abierta
   NOTA: la Ayudantía 11 v2 usa Md = 0,50Y − 0,20i (sin constante) y M/P = 840,
   consistente con la notación sellada Md = d1·Y − d2·i.
   ========================================================================= */
head('ABR-EX-01 a EX-03 · flotación con movilidad perfecta');
{
  const q = { c0:30, c1:0.75, T:80, b0:60, b1:0.15, b2:0.25, G:120,
              x0:50, x1:0.10, x2:0.30, MP:840, d1:0.50, d2:0.20, iStar:6 };
  const a = calcISLMBP(q);
  eq('EX-01 · Y*', a.Y, 1682.4, 0.01);
  eq('EX-01 · i*', a.i, 6);
  eq('EX-01 · E*', a.eRaw, 459.9333, 0.01);
  const b = calcISLMBP({ ...q, G:160 });
  eq('EX-02 · Y (invariante)', b.Y, 1682.4, 0.01);
  eq('EX-02 · E (apreciación)', b.eRaw, 326.6, 0.01);
  checks++;
  if (!(b.eRaw < a.eRaw)) { fails++; console.log('  ✘ el shock fiscal NO apreció: revisar convención de E'); }
  else console.log('  ✔ E baja: apreciación, coherente con E = CLP/USD (GOB-CONV-TC)');
  const c = calcISLMBP({ ...q, MP:1040 });
  eq('EX-03 · Y', c.Y, 2082.4, 0.01);
  eq('EX-03 · E (depreciación)', c.eRaw, 726.6, 0.01);
}

/* =========================================================================
   Resumen
   ========================================================================= */
console.log(`\n${'─'.repeat(64)}`);
if (fails === 0) {
  console.log(`✔ ${checks} comprobaciones OK · biblioteca y simulador coinciden.`);
  process.exit(0);
} else {
  console.log(`✘ ${fails} de ${checks} comprobaciones fallaron.`);
  console.log('  Una divergencia significa que la pauta sellada o el solver cambió.');
  console.log('  NO corregir el test: corregir la fuente y declarar el cambio.');
  process.exit(1);
}
