#!/usr/bin/env node
"use strict";
/*
 * test_lab_lm.js — Motor gráfico común y Lab · Relación LM (v0.8.0).
 *
 *   1. El solver de la LM reproduce las cifras de la Nota 5 y de la Nota 7.
 *   2. Las pautas de LM-EX-01 a LM-EX-06 coinciden con el laboratorio.
 *   3. El motor: marcas redondas, eje de la tasa desde 0, recorte y ningún rótulo
 *      encima de otro, en todas las actividades y puntos de partida.
 *   4. Dinero / tasa usa el mismo motor: ejes redondos y nada bajo i = 0.
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const LAB = path.join(__dirname, "index.html");
let n = 0; const failures = [];
const ok = (c, l) => { n++; if (!c) failures.push(`${n}. ${l}`); return !!c; };
const near = (a, b, tol, l) => ok(Number.isFinite(a) && Math.abs(a - b) <= tol, `${l} — esperado ${b}, obtenido ${a}`);

const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", e => errors.push(e.message)); vc.on("error", m => errors.push(m));
const dom = new JSDOM(fs.readFileSync(LAB, "utf8"), { runScripts: "dangerously", url: "http://localhost/macro1/index.html", pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(w) { w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => k === "measureText" ? () => ({ width: 10 }) : () => {}, set: () => true }); w.Element.prototype.scrollIntoView = () => {}; } });
const w = dom.window, doc = w.document, L = w.MacroLabLoop.lab;
ok(errors.length === 0, "el laboratorio carga sin errores: " + errors.join(" | "));

/* ===== 1 · Solver contra las notas ===== */
const S = o => L.lmSolve(Object.assign({ Y0: 3400, M: 3000, P: 2, d1: .5, d2: 50, shock: "Y", val: 3500, modo: "dinero", iFix: 4 }, o));
let r = S({});
near(r.i0, 4, 1e-9, "Nota 5 · Y = 3.400, M/P = 1.500 → 4 %"); near(r.i1, 5, 1e-9, "Nota 5 · Y = 3.500 → 5 %");
near(r.slope, .01, 1e-12, "Nota 5 · pendiente d₁/d₂ = 0,01"); near(r.interceptY0, 3000, 1e-9, "Nota 7 · LM: Y = 3.000 + 100·i");
near(r.interceptI0, -30, 1e-9, "Nota 5 · i = 0,01·Y − 30"); near(r.shiftY, 0, 1e-12, "subir Y no desplaza la LM");
r = S({ shock: "M", val: 3100 }); near(r.shiftY, 100, 1e-9, "Nota 5 · M/P a 1.550: la LM se corre 100 a la derecha"); near(r.i1, 3, 1e-9, "… y con Y = 3.400 la tasa baja a 3 %");
r = S({ shock: "P", val: 2.4 }); near(r.mp1, 1250, 1e-9, "Nota 5 · P = 2,4 → M/P = 1.250"); near(r.i1, 9, 1e-9, "Nota 5 · la tasa sube a 9 %");
r = S({ modo: "tasa" }); near(r.mpReq1, 1550, 1e-9, "Nota 5 · tasa fija en 4 %: M/P pasa a 1.550"); near(r.i1, 4, 1e-12, "con tasa fija la tasa no cambia");
r = S({ Y0: 3600, val: 3600, modo: "tasa" }); near(r.mpReq0, 1600, 1e-9, "Nota 7 · LM horizontal con Y = 3.600 exige M/P = 1.600");
r = S({ Y0: 5000, M: 1900, P: 1, d1: .4, d2: 25, val: 5100 }); near(r.slope, .016, 1e-12, "Nota 5 B3.3 · pendiente 0,016"); near(r.interceptY0, 4750, 1e-9, "Nota 5 B3.3 · Y = 4.750 + 62,5·i"); near(r.i1, 5.6, 1e-9, "Nota 5 B3.3 · Y = 5.100 → 5,6 %");
r = S({ Y0: 1000, M: 760, P: 1, d1: .8, d2: 20, val: 1010 }); near(r.i0, 2, 1e-9, "continuidad con Dinero / tasa · 2 %"); near(r.i1, 2.4, 1e-9, "continuidad · 2,4 %");
r = S({ shock: "a", val: 50 }); near(r.shiftY, -100, 1e-9, "más demanda de dinero por otra razón: la LM se corre 100 a la izquierda");

/* ===== 2 · Actividades ===== */
const ACT = w.eval("ACTIVITIES").lm;
ok(ACT.length === 6 && ACT.every(a => a.enunciado), "seis actividades LM, todas con el protocolo");
const load = id => { const h = doc.querySelector('.activity[data-window="lm"]'), s = h.querySelector("select"); s.value = String(ACT.findIndex(a => a.id === id)); s.dispatchEvent(new w.Event("change")); return L.lmSolve(L.lmRead()); };
r = load("LM-EX-01"); near(r.i0, 2, 1e-9, "LM-EX-01 · Y = 2.100 → 2 %"); near(r.i1, 4, 1e-9, "LM-EX-01 · Y = 2.200 → 4 %");
near(L.lmSolve({ ...L.lmRead(), val: 2300 }).i1, 6, 1e-9, "LM-EX-01 · Y = 2.300 → 6 %"); near(r.interceptI0, -40, 1e-9, "LM-EX-01 · i = 0,02·Y − 40"); near(r.interceptY0, 2000, 1e-9, "LM-EX-01 · Y = 2.000 + 50·i");
r = load("LM-EX-02"); near(r.slope, .01, 1e-12, "LM-EX-02 · d₂ = 60 → pendiente 0,01"); near(r.interceptI0, -20, 1e-9, "LM-EX-02 · eje i en −20 %");
near(L.lmSolve({ ...L.lmRead(), d2: 30 }).slope, .02, 1e-12, "LM-EX-02 · d₂ = 30 → 0,02"); near(r.interceptY0, 2000, 1e-9, "LM-EX-02 · el eje Y no depende de d₂");
r = load("LM-EX-03"); near(r.i0, 4, 1e-9, "LM-EX-03 · antes 4 %"); near(r.i1, 2, 1e-9, "LM-EX-03 · después 2 %"); near(r.shiftY, 100, 1e-9, "LM-EX-03 · la LM se corre 100 a la derecha");
r = load("LM-EX-04"); near(r.mp1, 1000, 1e-9, "LM-EX-04 · M/P = 1.000"); near(r.i1, 10.667, .001, "LM-EX-04 · 10,67 %"); near(r.shiftY, -333.333, .001, "LM-EX-04 · 333,33 a la izquierda");
r = load("LM-EX-05"); near(r.mpReq1, 1260, 1e-9, "LM-EX-05 · M/P = 1.260 mantiene 4 %"); near(r.mpReq0, 1200, 1e-9, "LM-EX-05 · coherente con el M/P inicial");
near(L.lmSolve({ ...L.lmRead(), modo: "dinero" }).i1, 6, 1e-9, "LM-EX-05 · con dinero fijo la tasa subiría a 6 %");
r = load("LM-EX-06"); near(r.i0, 2, 1e-9, "LM-EX-06 · A = (1.000; 2 %)"); near(r.i1, 2.4, 1e-9, "LM-EX-06 · B = (1.010; 2,4 %)"); near(r.interceptY0, 950, 1e-9, "LM-EX-06 · Y = 950 + 25·i");
const rub = Object.fromEntries(ACT.map(a => [a.id, a.rubric]));
[["LM-EX-01", ["2 %", "4 %", "6 %", "0,02·Y − 40", "2.000 + 50·i"]], ["LM-EX-02", ["0,02", "0,01", "−40 %", "−20 %", "2.000"]], ["LM-EX-03", ["4 %", "2 %", "100 a la derecha"]],
 ["LM-EX-04", ["1.000", "10,67 %", "333,33 a la izquierda"]], ["LM-EX-05", ["1.260", "6 %"]], ["LM-EX-06", ["2,4 %", "0,04·Y − 38", "950 + 25·i"]]]
  .forEach(([id, ts]) => ts.forEach(t => ok(rub[id].includes(t), `${id} · la pauta dice «${t}»`)));

/* ===== 3 · Motor gráfico ===== */
const round = v => { const e = Math.pow(10, Math.floor(Math.log10(Math.abs(v) || 1))); return [1, 2, 2.5, 5, 10].some(k => Math.abs(Math.abs(v) / e - k) < 1e-9 || Math.abs(v) < 1e-12) || Number.isInteger(v / (e / 2)); };
[[0, 42], [0, 1026], [2800, 3600], [0, 7.3], [0, 0.35]].forEach(([a, b]) => {
  const s = L.niceScale(a, b, 5, a === 0);
  ok(s.ticks.every(t => Math.abs(t / s.step - Math.round(t / s.step)) < 1e-9) && [1, 2, 2.5, 5].includes(+(s.step / Math.pow(10, Math.floor(Math.log10(s.step)))).toFixed(6)), `niceScale(${a}, ${b}) da un paso redondo (${s.step})`);
  ok(s.min <= a && s.max >= b, `niceScale(${a}, ${b}) contiene el rango`);
});
ok(L.niceScale(0, 12.8, 6, true).digits === 1 && L.niceScale(0, .6, 5, true).digits >= 1 && L.niceScale(0, 2000, 4, true).digits === 0, "niceScale · los decimales salen del paso (2,5 no se escribe «3»)");
const fT = w.eval("fmtT");
[[3000, 0, "3.000"], [250, 0, "250"], [2.5, 1, "2,5"], [4, 2, "4"], [10.6667, 2, "10,67"], [-30, 2, "−30"], [1500, 1, "1.500"], [0.01, 4, "0,01"]]
  .forEach(([v, d, t]) => ok(fT(v, d) === t, `fmtT(${v}, ${d}) = «${t}» (obtenido «${fT(v, d)}»)`));
const labels = id => (L.plotLayouts[id] || []).filter(b => !b.line);
const noOverlap = (id, ctx) => { const B = labels(id); let bad = 0;
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], b = B[j]; if (a.x < b.x + b.w - .5 && b.x < a.x + a.w - .5 && a.y < b.y + b.h - .5 && b.y < a.y + a.h - .5) bad++; }
  return ok(B.length > 3 && bad === 0, `${ctx} · ${id}: ningún rótulo encima de otro (${bad} solapes en ${B.length} rótulos)`); };
const svgCheck = (id, ctx) => { const el = doc.getElementById(id), txt = el.innerHTML;
  ok(!/NaN|undefined|Infinity/.test(txt), `${ctx} · ${id}: sin valores inválidos`);
  const ticks = [...el.querySelectorAll("text.g-tick")].map(t => t.textContent);
  ok(ticks.every(t => /^−?\d{1,3}(\.\d{3})*(,\d+)?$/.test(t)), `${ctx} · ${id}: marcas con formato chileno (${ticks.join(" ")})`);
  ok(!ticks.some(t => /,\d{3,}/.test(t)), `${ctx} · ${id}: marcas sin decimales largos`); };
ACT.forEach(a => { load(a.id); L.drawLm(); ["lmMoneyChart", "lmChart"].forEach(id => { noOverlap(id, a.id); svgCheck(id, a.id); });
  ok(doc.getElementById("lmMoneyChart").querySelector(".g-leg") && doc.getElementById("lmChart").querySelector(".g-leg"), `${a.id} · leyenda inicial/final en los dos paneles`);
  ok(doc.getElementById("lmChart").querySelectorAll("text.g-proj").length >= 2, `${a.id} · valores de las proyecciones escritos sobre los ejes`); });
Object.keys(w.eval("LM_PRESETS")).forEach(k => { L.lmApply(w.eval("LM_PRESETS")[k]); noOverlap("lmChart", "punto de partida " + k); noOverlap("lmMoneyChart", "punto de partida " + k); });
// alineación: los dos paneles usan la misma escala de la tasa
load("LM-EX-03"); L.drawLm();
const yOf = (id, t) => { const el = [...doc.getElementById(id).querySelectorAll("text.g-proj")].find(x => x.textContent === t); return el && +el.getAttribute("y"); };
ok(yOf("lmMoneyChart", "4 %") === yOf("lmChart", "4 %") && yOf("lmMoneyChart", "2 %") === yOf("lmChart", "2 %"), "los dos paneles quedan alineados en la tasa");
ok(/la LM se corre 100 a la derecha/.test(doc.getElementById("lmChart").textContent), "la flecha escribe el tamaño del desplazamiento");
ok(/movimiento a lo largo/.test((load("LM-EX-01"), L.drawLm(), doc.getElementById("lmChart").textContent)), "si solo sube Y, la flecha dice «movimiento a lo largo de la LM»");
// recorte bajo i = 0
L.lmApply({ Y0: 3400, M: 3000, P: 1, d1: .5, d2: 50, shock: "Y", val: 3500, modo: "dinero", iFix: 4 });
ok(/bajo cero/.test(doc.getElementById("lmFeedback").textContent), "si la tasa queda bajo cero, el laboratorio lo explica");
ok(doc.getElementById("lmAlt").textContent.length > 200, "la descripción accesible se actualiza con los valores");

/* ===== 4 · Dinero / tasa con el motor ===== */
const D = w.eval("ACTIVITIES").din, loadD = id => { const h = doc.querySelector('.activity[data-window="din"]'), s = h.querySelector("select"); s.value = String(D.findIndex(a => a.id === id)); s.dispatchEvent(new w.Event("change")); };
D.forEach(a => { loadD(a.id); L.drawMoney(); noOverlap("moneyChart", a.id); svgCheck("moneyChart", a.id);
  ok(!doc.getElementById("moneyCanvas") && doc.getElementById("moneyChart").tagName.toLowerCase() === "svg", `${a.id} · Dinero / tasa dibuja con el motor común`); });
loadD("DIN-EX-01"); doc.getElementById("omoBuy").click();
const yt = [...doc.getElementById("moneyChart").querySelectorAll("text.g-tick")].map(t => t.textContent);
ok(yt.includes("0") && !yt.some(t => t.startsWith("−")), "Dinero / tasa · el eje de la tasa parte en 0 y no muestra tasas negativas");
ok(!/9,8|20,5|31,3|42,0|257|513|770|1\.026/.test(yt.join(" ")), "Dinero / tasa · ya no aparecen las marcas 9,8 / 20,5 / 31,3 / 257 / 513");
ok(doc.getElementById("moneyChart").querySelectorAll(".g-leg").length === 2, "Dinero / tasa · compara el estado de partida con el actual");

L.lmApply(w.eval("LM_PRESETS").curso);
const tk = id => [...doc.getElementById(id).querySelectorAll("text.g-tick")].map(t => t.textContent);
ok(["0", "500", "1.000", "2.000"].every(t => tk("lmMoneyChart").includes(t)), "marcas de M/P con sus valores reales (" + tk("lmMoneyChart").join(" ") + ")");
ok(["3.000", "4.000"].every(t => tk("lmChart").includes(t)) && tk("lmChart").includes("2"), "marcas de Y y de i con sus valores reales (" + tk("lmChart").join(" ") + ")");
/* ===== pestañas ===== */
const tabs = [...doc.querySelectorAll('#tabs [role="tab"]')].map(t => t.textContent.trim());
ok(tabs.indexOf("Lab · Relación LM") === tabs.indexOf("Lab · Dinero / tasa") + 1, "la pestaña Relación LM va después de Dinero / tasa");

console.log(`test_lab_lm.js — ${n} aserciones · RESULTADO: ${failures.length ? "FALLA" : "OK"}`);
failures.forEach(f => console.log("  ✘ " + f));
process.exit(failures.length ? 1 : 0);
