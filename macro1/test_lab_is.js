#!/usr/bin/env node
"use strict";
/*
 * test_lab_is.js — Lab · Curva IS (v0.9.0).
 *   1. El solver reproduce las cifras de la Nota 6 (y la IS de la Nota 7).
 *   2. Las pautas de IS-EX-01 a IS-EX-06 coinciden con el laboratorio.
 *   3. La descomposición de la inversión suma el cambio total.
 *   4. Avisos: coincidencia c₁·t = b₁ y multiplicador no definido (c₁ + b₁ ≥ 1).
 *   5. Gráficos: paneles alineados en Y, marcas redondas, sin solapes.
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
const LAB = path.join(__dirname, "index.html");
let n = 0; const failures = [];
const ok = (c, l) => { n++; if (!c) failures.push(`${n}. ${l}`); return !!c; };
const near = (a, b, tol, l) => ok(Number.isFinite(a) && Math.abs(a - b) <= tol, `${l} — esperado ${b}, obtenido ${a}`);
const errors = []; const vc = new VirtualConsole(); vc.on("jsdomError", e => errors.push(e.message)); vc.on("error", m => errors.push(m));
const dom = new JSDOM(fs.readFileSync(LAB, "utf8"), { runScripts: "dangerously", url: "http://localhost/macro1/index.html", pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(w) { w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => k === "measureText" ? () => ({ width: 10 }) : () => {}, set: () => true }); w.Element.prototype.scrollIntoView = () => {}; } });
const w = dom.window, doc = w.document, L = w.MacroLabLoop.lab;
ok(errors.length === 0, "el laboratorio carga sin errores: " + errors.join(" | "));

/* ===== 1 · Nota 6 ===== */
const CURSO = { c0: 100, c1: .75, b0: 160, b1: .15, b2: 15, G: 200, taxMode: "fixed", T: 80, t: .2, i0: 4, kind: "i", val: 8 };
const S = o => L.isSolve(Object.assign({}, CURSO, o));
let r = S({});
near(r.s0.m, 10, 1e-9, "Nota 6 · multiplicador 10"); near(r.Y0, 3400, 1e-9, "Nota 6 · i = 4 % → 3.400"); near(r.Y1, 2800, 1e-9, "Nota 6 · i = 8 % → 2.800");
near(r.s0.Y(0), 4000, 1e-9, "Nota 6 · IS: Y = 4.000 − 150·i (intercepto)"); near(r.s0.Y(1) - r.s0.Y(0), -150, 1e-9, "Nota 6 · 150 por punto de tasa");
near(r.gap, -60, 1e-9, "Nota 6 · entre las dos rectas de gasto hay 60"); near(r.s0.Y(6), 3100, 1e-9, "Nota 6 · comprobación con i = 6 %: 3.100");
near(r.I0, 610, 1e-9, "Nota 6 · I con (3.400; 4 %) = 610"); near(r.acc + r.rate, r.dI, 1e-9, "la descomposición suma el cambio de la inversión");
r = S({ kind: "G", val: 220 }); near(r.shift, 200, 1e-9, "Nota 6 · G + 20 corre la IS 200"); near(r.Y1, 3600, 1e-9, "Nota 6 · con i = 4 %, 3.600");
r = S({ kind: "T", val: 60 }); near(r.shift, 150, 1e-9, "Nota 6 · transferencia de 20 corre la IS 150");
r = S({ taxMode: "proportional" }); near(r.s0.m, 4, 1e-9, "Nota 6 · con t = 0,2 el multiplicador es 4"); near(r.s0.Y(0), 1840, 1e-9, "Nota 6 · IS: Y = 1.840 − 60·i"); near(r.Y0, 1600, 1e-9, "Nota 6 · (1.600; 4 %)"); near(r.Y1, 1360, 1e-9, "Nota 6 · (1.360; 8 %)");
ok(r.coinc, "Nota 6 · con t = 0,2, c₁·t = b₁: el laboratorio declara la coincidencia");
r = S({ taxMode: "proportional", kind: "t", val: .4 }); near(r.s1.m, 2.5, 1e-9, "Nota 6 · con t = 0,4 el multiplicador es 2,5"); near(r.s1.Y(0), 1150, 1e-9, "Nota 6 · IS: Y = 1.150 − 37,5·i");
r = S({ taxMode: "proportional", kind: "G", val: 220 }); near(r.shift, 80, 1e-9, "Nota 6 · con t = 0,2, G + 20 corre la IS 80");
r = S({ taxMode: "proportional", kind: "T", val: 60 }); ok(r.p0.taxMode === "fixed" && r.p1.taxMode === "fixed", "un cambio de T se estudia con impuestos fijos en los dos estados");
r = L.isSolve({ c0: 60, c1: .8, b0: 100, b1: .15, b2: 10, G: 260, taxMode: "proportional", T: 0, t: .25, i0: 2, kind: "G", val: 280 });
near(r.s0.Y(0), 1680, 1e-9, "Nota 6 B3.1 · Y = 1.680 − 40·i"); near(r.Y0, 1600, 1e-9, "Nota 6 B3.1 · 1.600 con 2 %"); near(r.shift, 80, 1e-9, "Nota 6 B3.1 · G + 20 corre la IS 80"); ok(!r.coinc, "Nota 6 B3.1 · aquí no hay coincidencia");
r = L.isSolve({ c0: 70, c1: .8, b0: 110, b1: .1, b2: 20, G: 140, taxMode: "fixed", T: 100, t: .2, i0: 3, kind: "i", val: 6 });
near(r.Y0, 1800, 1e-9, "Nota 6 A3.2 · 1.800"); near(r.Y1, 1200, 1e-9, "Nota 6 A3.2 · 1.200");

/* ===== 2 · Actividades ===== */
const ACT = w.eval("ACTIVITIES").is;
ok(ACT.length === 6 && ACT.every(a => a.enunciado), "seis actividades IS, todas con el protocolo");
const load = id => { const h = doc.querySelector('.activity[data-window="is"]'), s = h.querySelector("select"); s.value = String(ACT.findIndex(a => a.id === id)); s.dispatchEvent(new w.Event("change")); return L.isSolve(L.isRead()); };
r = load("IS-EX-01"); near(r.Y0, 2400, 1e-9, "IS-EX-01 · 2.400"); near(r.Y1, 2000, 1e-9, "IS-EX-01 · 2.000"); near(r.s0.Y(0), 2600, 1e-9, "IS-EX-01 · Y = 2.600 − 100·i"); near(r.s0.Y(4), 2200, 1e-9, "IS-EX-01 · comprobación con 4 %");
r = load("IS-EX-02"); near(r.I0, 320, 1e-9, "IS-EX-02 · I en A = 320"); near(r.I1, 240, 1e-9, "IS-EX-02 · I en B = 240"); near(r.acc, -40, 1e-9, "IS-EX-02 · efecto acelerador −40"); near(r.rate, -40, 1e-9, "IS-EX-02 · efecto de la tasa −40");
r = load("IS-EX-03"); near(r.s0.Y(0), 2600, 1e-9, "IS-EX-03 · intercepto 2.600"); near(r.s0.m * 20, 200, 1e-9, "IS-EX-03 · 200 por punto con b₂ = 20"); near(r.s0.A / 20, 13, 1e-9, "IS-EX-03 · eje i en 13 %");
r = load("IS-EX-04"); near(r.shift, 200, 1e-9, "IS-EX-04 · G + 20 corre la IS 200"); near(r.Y1, 2400, 1e-9, "IS-EX-04 · 2.400 con 4 %");
near(L.isSolve({ ...L.isRead(), kind: "T", val: 30 }).shift, 160, 1e-9, "IS-EX-04 · transferencia de 20: 160");
r = load("IS-EX-05"); near(r.s0.m, 5, 1e-9, "IS-EX-05 · m = 5 con t = 0,125"); near(r.s1.m, 2.5, 1e-9, "IS-EX-05 · m = 2,5 con t = 0,375"); near(r.s0.Y(0), 1500, 1e-9, "IS-EX-05 · Y = 1.500 − 50·i"); near(r.s1.Y(0), 750, 1e-9, "IS-EX-05 · Y = 750 − 25·i"); near(r.Y1, 650, 1e-9, "IS-EX-05 · 650 con 4 %");
ok(r.coinc && !doc.getElementById("isCoinc").hidden, "IS-EX-05 · el laboratorio declara la coincidencia c₁·t = b₁");
r = load("IS-EX-06"); near(r.shift, -200, 1e-9, "IS-EX-06 · la IS se corre 200 a la izquierda"); near(r.Y0, 2200, 1e-9, "IS-EX-06 · 2.200"); near(r.Y1, 2000, 1e-9, "IS-EX-06 · 2.000");
near(r.auto, -20, 1e-9, "IS-EX-06 · cambio autónomo −20"); near(r.acc, -20, 1e-9, "IS-EX-06 · efecto acelerador −20"); near(r.rate, 0, 1e-12, "IS-EX-06 · efecto de la tasa 0"); near(r.dI, -40, 1e-9, "IS-EX-06 · ΔI = −40");
ok(/Cambio autónomo/.test(doc.getElementById("isInv").textContent), "IS-EX-06 · la tabla muestra el cambio autónomo");
const rub = Object.fromEntries(ACT.map(a => [a.id, a.rubric]));
[["IS-EX-01", ["2.400", "2.000", "2.600 − 100·i"]], ["IS-EX-02", ["320", "240", "−40"]], ["IS-EX-03", ["2.600 − 200·i", "13 %", "−1/200"]], ["IS-EX-04", ["200", "160", "2.800 − 100·i"]], ["IS-EX-05", ["1.500 − 50·i", "750 − 25·i", "2,5"]], ["IS-EX-06", ["2.400 − 100·i", "2.000", "−40"]]]
  .forEach(([id, ts]) => ts.forEach(t => ok(rub[id].includes(t), `${id} · la pauta dice «${t}»`)));

/* ===== 4 · Avisos ===== */
L.isApply({ ...CURSO, c1: .9, b1: .15 });
ok(/multiplicador no está definido/.test(doc.getElementById("isFeedback").textContent), "c₁ + b₁ ≥ 1: el laboratorio avisa que el multiplicador no está definido");
L.isApply(CURSO); ok(/Multiplicador/.test(doc.getElementById("isFeedback").textContent), "con datos válidos el aviso desaparece");

/* ===== 5 · Gráficos ===== */
const labels = id => (L.plotLayouts[id] || []).filter(b => !b.line);
const noOverlap = (id, ctx) => { const B = labels(id); let bad = 0;
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], b = B[j]; if (a.x < b.x + b.w - .5 && b.x < a.x + a.w - .5 && a.y < b.y + b.h - .5 && b.y < a.y + a.h - .5) bad++; }
  return ok(B.length > 3 && bad === 0, `${ctx} · ${id}: ningún rótulo encima de otro (${bad} solapes)`); };
// valor escrito sobre el eje horizontal (text-anchor middle); en la cruz el mismo número aparece también en el eje vertical
const xOf = (id, t) => { const el = [...doc.getElementById(id).querySelectorAll('text.g-proj[text-anchor="middle"]')].find(x => x.textContent === t); return el && +el.getAttribute("x"); };
ACT.forEach(a => { load(a.id); L.drawIs(); ["isCross", "isChart"].forEach(id => { noOverlap(id, a.id);
  const html = doc.getElementById(id).innerHTML; ok(!/NaN|undefined|Infinity/.test(html), `${a.id} · ${id} sin valores inválidos`);
  const ticks = [...doc.getElementById(id).querySelectorAll("text.g-tick")].map(t => t.textContent);
  ok(ticks.every(t => /^−?\d{1,3}(\.\d{3})*(,\d+)?$/.test(t)), `${a.id} · ${id} marcas con formato chileno (${ticks.join(" ")})`); });
  const r0 = L.isSolve(L.isRead()), t0 = w.eval("fmtT")(r0.Y0, 1);
  ok(xOf("isCross", t0) !== undefined && xOf("isCross", t0) === xOf("isChart", t0), `${a.id} · los dos paneles quedan alineados en la producción`); });
Object.keys(w.eval("IS_PRESETS")).forEach(k => { L.isApply(w.eval("IS_PRESETS")[k]); noOverlap("isCross", "punto de partida " + k); noOverlap("isChart", "punto de partida " + k); });
load("IS-EX-04"); L.drawIs(); ok(/la IS se corre 200 a la derecha/.test(doc.getElementById("isChart").textContent), "la flecha escribe cuánto se corre la IS");
load("IS-EX-01"); L.drawIs(); ok(/la tasa quita 40 de gasto/.test(doc.getElementById("isCross").textContent), "la cruz muestra cuánto gasto quita la tasa");
ok(/movimiento a lo largo de la IS/.test(doc.getElementById("isChart").textContent), "si cambia la tasa: movimiento a lo largo de la IS");
ok(doc.getElementById("isAlt").textContent.length > 200, "la descripción accesible se actualiza");
const tabs = [...doc.querySelectorAll('#tabs [role="tab"]')].map(t => t.textContent.trim());
ok(tabs.indexOf("Lab · Curva IS") === tabs.indexOf("Lab · Relación LM") + 1, "la pestaña Curva IS va después de Relación LM");
const panel = doc.getElementById("is").textContent;
ok(!/cierre docente|cierre [AB]\b|tres piezas|crowding-out|domina el desplazamiento/i.test(panel), "la ventana no usa terminología antigua");
ok(/efecto desplazamiento» no es otro nombre de b₂/i.test(panel), "la ventana avisa que el efecto desplazamiento no es b₂");

console.log(`test_lab_is.js — ${n} aserciones · RESULTADO: ${failures.length ? "FALLA" : "OK"}`);
failures.forEach(f => console.log("  ✘ " + f));
process.exit(failures.length ? 1 : 0);
