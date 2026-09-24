#!/usr/bin/env node
"use strict";
/*
 * test_lab_islm.js — Lab · IS-LM (v0.10.0).
 *   1. Mismos números que la pestaña IS-LM del MacroLab público (calcISLM de ../script.js).
 *   2. Nota 7: equilibrio, política fiscal, monetaria y LM horizontal.
 *   3. Nota 8 Parte A: puntos A, B, C y D; camino de ajuste; escalera; día del anuncio.
 *   4. Nota 8 Parte B: descomposición de ΔI, regla de dominancia, curva de ΔI según b₂,
 *      coincidencia, ejercicio histórico y LM horizontal.
 *   5. Actividades ISLM-EX-11 a 16 y gráficos sin solapes.
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

/* ===== 1 · MacroLab público ===== */
const src = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
const start = src.indexOf("function calcISLM("), line = src.slice(start, src.indexOf("\n", start));
const calcISLM = new Function("safeDiv", `${line}; return calcISLM;`)((a, b) => (b === 0 ? NaN : a / b));
const CURSO = Object.assign({}, w.eval("ISLM_PRESETS").curso);
const pub = (p, reg, tax) => calcISLM({ c0: p.c0, c1: p.c1, T: p.T, t: p.t, b0: p.b0, b1: p.b1, b2: p.b2, G: p.G, MP: p.MP, d1: p.d1, d2: p.d2, iFixed: p.iFix }, reg, tax);
[["curso", CURSO], ["curso con t", w.eval("ISLM_PRESETS").cursoT], ["histórico", w.eval("ISLM_PRESETS").historico]].forEach(([name, P]) =>
  ["upward", "horizontal"].forEach(reg => ["fixed", "proportional"].forEach(tax => [0, 20, -30].forEach(dG => {
    const p = Object.assign({}, P, { regime: reg, taxMode: tax, G: P.G + dG }), a = L.islmState(p), b = pub(p, reg, tax);
    near(a.Y, b.Y, 1e-9, `${name} · ${reg} · ${tax} · G ${P.G + dG}: Y igual al MacroLab público`);
    near(a.i, b.i, 1e-9, `${name} · ${reg} · ${tax} · G ${P.G + dG}: i igual al MacroLab público`);
    near(a.I0, b.investment, 1e-9, `${name} · ${reg} · ${tax} · G ${P.G + dG}: inversión igual al MacroLab público`); }))));

/* ===== 2 · Nota 7 ===== */
const S = o => L.islmSolve(Object.assign({}, CURSO, { dG: 0, dT: 0, dMP: 0, db0: 0, diFix: 0 }, o));
let r = S({});
near(r.s0.Y, 3400, 1e-9, "Nota 7 · Y* = 3.400"); near(r.s0.i, 4, 1e-9, "Nota 7 · i* = 4 %");
r = S({ dG: 20 }); near(r.shiftIS, 200, 1e-9, "Nota 7 · G + 20 corre la IS 200"); near(r.s1.Y, 3480, 1e-9, "Nota 7 · Y sube a 3.480 (80)"); near(r.s1.i, 4.8, 1e-9, "Nota 7 · i sube a 4,8 %"); near(r.multISLM, 4, 1e-9, "Nota 7 · multiplicador en IS-LM = 4");
r = S({ dMP: 100 }); near(r.shiftLM, 200, 1e-9, "Nota 7 · M/P + 100 corre la LM 200"); near(r.s1.Y, 3520, 1e-9, "Nota 7 · Y = 3.520"); near(r.s1.i, 3.2, 1e-9, "Nota 7 · i = 3,2 %");
r = S({ dG: 20, regime: "horizontal" }); near(r.s1.Y, 3600, 1e-9, "Nota 7 · LM horizontal: Y = 3.600"); near(r.s0.MPreq, 1500, 1e-9, "Nota 7 · M/P inicial 1.500"); near(r.s1.MPreq, 1600, 1e-9, "Nota 7 · el Banco Central lleva M/P a 1.600");
r = L.islmSolve(Object.assign({}, w.eval("ISLM_PRESETS").cursoT, { dG: 20 })); near(r.s0.Y, 1600, 1e-9, "Nota 7 · con t = 0,2: Y* = 1.600"); near(r.s0.i, 4, 1e-9, "Nota 7 · con t = 0,2: i* = 4 %"); near(r.dY, 50, 1e-9, "Nota 7 · con t = 0,2, G + 20 sube Y en 50");

/* ===== 3 · Nota 8, Parte A ===== */
const base = S({}), pt = (Y, i, rr = base) => L.islmPoint(rr, Y, i);
const A = pt(3600, 7), B = pt(3600, 5), C = pt(3200, 3), D = pt(3200, 1);
near(A.iIS, 2.6667, 1e-3, "Nota 8 · A: la IS pide 2,67 %"); near(A.iLM, 6, 1e-9, "Nota 8 · A: la LM pide 6 %");
[[A, -65, 50, true, true], [B, -35, -50, true, false], [C, 35, 50, false, true], [D, 65, -50, false, false]].forEach(([P, zy, mm, aIS, aLM], k) => {
  const nm = "ABCD"[k];
  near(P.ZY, zy, 1e-9, `Nota 8 · ${nm}: Z − Y = ${zy}`); near(P.MM, mm, 1e-9, `Nota 8 · ${nm}: M/P − Mᵈ = ${mm}`);
  ok(P.aboveIS === aIS && P.belowIS === !aIS && P.aboveLM === aLM && P.belowLM === !aLM, `Nota 8 · ${nm}: posición respecto de cada curva`); });
near(C.stage1[1][1], 2, 1e-9, "Nota 8 · desde C la tasa baja de 3 % a 2 % (tramo vertical)"); near(C.eq[0], 3400, 1e-9, "Nota 8 · y la producción llega a 3.400 por la LM");
const st = L.islmSolve ? w.eval("islmStairs")(base, 3200, 4) : [];
ok(st.length === 9 && st.every(q => Number.isFinite(q[0]) && Number.isFinite(q[1])), "la escalera tiene 4 escalones (9 vértices)");
ok(st.filter((q, k) => k % 2 === 0).every(q => Math.abs(q[1] - base.s1.iLM(q[0])) < 1e-9), "cada escalón termina sobre la LM");
near(st[st.length - 1][0], 3400, 1e-9, "la escalera llega al equilibrio");
const fine = w.eval("islmStairs")(base, 3200, 20), gap = Math.max(...fine.map(q => Math.abs(q[1] - base.s1.iLM(q[0]))));
const coarse = Math.max(...st.map(q => Math.abs(q[1] - base.s1.iLM(q[0]))));
ok(gap < coarse, "con escalones más pequeños la escalera queda más pegada a la LM");
const ann = L.islmSolve(Object.assign({}, CURSO, { dG: 20, dT: 0, dMP: 0, db0: 0, diFix: 0 })), P0 = L.islmPoint(ann, 3400, 4);
near(P0.ZY, 20, 1e-9, "Nota 8 · día del anuncio: faltan 20 de bienes"); ok(P0.onLM, "Nota 8 · día del anuncio: el dinero está en equilibrio, no hay tramo vertical");
near(P0.eq[0], 3480, 1e-9, "Nota 8 · el camino llega a 3.480"); near(P0.eq[1], 4.8, 1e-9, "Nota 8 · y a 4,8 %");

/* ===== 4 · Nota 8, Parte B ===== */
r = S({ dG: 20 }); near(r.acc, 12, 1e-9, "Nota 8 · efecto acelerador 12"); near(r.rate, -12, 1e-9, "Nota 8 · efecto de la tasa −12"); near(r.dI, 0, 1e-9, "Nota 8 · ΔI = 0"); ok(!r.crowd, "Nota 8 · sin efecto desplazamiento");
near(S({ dG: 20, b2: 25 }).dI, -5.7143, 1e-3, "Nota 8 · con b₂ = 25, ΔI = −5,71"); ok(S({ dG: 20, b2: 25 }).crowd, "con b₂ = 25 hay efecto desplazamiento");
near(S({ dG: 20, b2: 5 }).dI, 13.3333, 1e-3, "Nota 8 · con b₂ = 5, ΔI = +13,33");
near(S({ dG: 20, regime: "horizontal" }).dI, 30, 1e-9, "Nota 8 · con tasa fija, ΔI = +30 con cualquier b₂"); near(S({ dG: 20, regime: "horizontal", b2: 40 }).dI, 30, 1e-9, "… también con b₂ = 40");
near(S({ dG: 30, regime: "horizontal" }).dI, 45, 1e-9, "Nota 8 · actividad (G + 30, tasa fija): ΔI = +45, efecto acelerador 45");
near(S({ dG: 30, regime: "horizontal" }).rate, 0, 1e-12, "… y efecto de la tasa 0");
const H = L.islmSolve(Object.assign({}, w.eval("ISLM_PRESETS").historico));
near(H.s0.Y, 933.333, 1e-3, "Nota 8 · histórico: Y = 933,33"); near(H.s0.i, 13.333, 1e-3, "histórico: i = 13,33 %"); near(H.s1.Y, 1022.222, 1e-3, "histórico: Y = 1.022,22"); near(H.s1.i, 15.556, 1e-3, "histórico: i = 15,56 %");
near(H.dI, -2.2222, 1e-3, "Nota 8 · histórico: ΔI = −2,22"); near(H.rateWeight, .125, 1e-12, "Nota 8 · b₂·d₁/d₂ = 0,125 > b₁ = 0,1"); ok(H.crowd, "Nota 8 · histórico: hay efecto desplazamiento");
const HT = L.islmSolve(Object.assign({}, w.eval("ISLM_PRESETS").historicoTasa)); near(HT.dY, 200, 1e-9, "Nota 8 · histórico con tasa fija: ΔY = 200"); near(HT.dI, 20, 1e-9, "Nota 8 · histórico con tasa fija: ΔI = +20");
// en pantalla
L.islmApply(Object.assign({}, CURSO, { mode: "efectos" }));
ok(!doc.getElementById("islmCoinc").hidden && /coincidencia/i.test(doc.getElementById("islmCoinc").textContent), "ΔI = 0: el laboratorio avisa que es una coincidencia");
ok(/No hay efecto desplazamiento/.test(doc.getElementById("islmVerdict").textContent), "el veredicto dice que no hay efecto desplazamiento");
ok(doc.getElementById("islmWaterfall").querySelectorAll("rect").length >= 5, "la cascada dibuja inversión inicial, efectos e inversión final");
ok(/15/.test(doc.getElementById("islmB2Note").textContent), "la curva de ΔI según b₂ marca b₂ = 15, donde ΔI = 0");
L.islmApply(Object.assign({}, CURSO, { mode: "efectos", b2: 25 }));
ok(/Hay efecto desplazamiento/.test(doc.getElementById("islmVerdict").textContent) && doc.getElementById("islmCoinc").hidden, "con b₂ = 25: hay efecto desplazamiento y no hay aviso de coincidencia");
L.islmApply(Object.assign({}, CURSO, { mode: "efectos", regime: "horizontal" }));
ok(/no hay efecto desplazamiento/.test(doc.getElementById("islmVerdict").textContent), "con tasa fija: no hay efecto desplazamiento");

/* ===== 5 · Actividades y gráficos ===== */
const ACT = w.eval("ACTIVITIES").islm;
ok(ACT.length === 6 && ACT.every(a => a.enunciado) && ACT.every(a => !/ISLM-EX-0[1-5]/.test(a.id)), "seis actividades IS-LM con el protocolo, sin chocar con los códigos sellados ISLM-EX-01 a 05");
const load = id => { const h = doc.querySelector('.activity[data-window="islm"]'), s = h.querySelector("select"); s.value = String(ACT.findIndex(a => a.id === id)); s.dispatchEvent(new w.Event("change")); return L.islmSolve(L.islmRead()); };
r = load("ISLM-EX-11"); near(r.s0.Y, 2400, 1e-9, "ISLM-EX-11 · Y* = 2.400"); near(r.s0.i, 2, 1e-9, "ISLM-EX-11 · i* = 2 %");
r = load("ISLM-EX-12"); near(r.shiftIS, 300, 1e-9, "ISLM-EX-12 · la IS se corre 300"); near(r.s1.Y, 2500, 1e-9, "ISLM-EX-12 · Y = 2.500"); near(r.s1.i, 4, 1e-9, "ISLM-EX-12 · i = 4 %"); near(r.multISLM, 10 / 3, 1e-9, "ISLM-EX-12 · multiplicador 3,33");
r = load("ISLM-EX-13"); near(r.s1.Y, 2700, 1e-9, "ISLM-EX-13 · Y = 2.700"); near(r.s1.MPreq, 1300, 1e-9, "ISLM-EX-13 · M/P = 1.300");
r = load("ISLM-EX-14"); near(r.shiftLM, 150, 1e-9, "ISLM-EX-14 · la LM se corre 150"); near(r.s1.Y, 2600, 1e-9, "ISLM-EX-14 · Y = 2.600"); near(r.s1.i, 3, 1e-9, "ISLM-EX-14 · i = 3 %");
near(L.islmSolve({ ...L.islmRead(), dMP: 150 }).s1.i, 2, 1e-9, "ISLM-EX-14 · con Δ(M/P) = 150 la tasa queda en 2 %");
r = load("ISLM-EX-15"); const Q = L.islmPoint(r, 2500, 3);
near(Q.iIS, 1, 1e-9, "ISLM-EX-15 · la IS pide 1 %"); near(Q.iLM, 4, 1e-9, "ISLM-EX-15 · la LM pide 4 %"); near(Q.ZY, -20, 1e-9, "ISLM-EX-15 · Z − Y = −20"); near(Q.MM, -25, 1e-9, "ISLM-EX-15 · M/P − Mᵈ = −25");
const QA = L.islmPoint(L.islmSolve({ ...L.islmRead(), dG: 30 }), 2400, 2); near(QA.ZY, 30, 1e-9, "ISLM-EX-15 · anuncio: faltan 30 de bienes"); ok(QA.onLM, "ISLM-EX-15 · anuncio: no hay tramo vertical"); near(QA.eq[1], 4, 1e-9, "ISLM-EX-15 · anuncio: llega a 4 %");
ok(/1 %/.test(doc.getElementById("islmPoint").textContent) && /4 %/.test(doc.getElementById("islmPoint").textContent), "ISLM-EX-15 · la ventana escribe la tasa que pide cada curva");
r = load("ISLM-EX-16"); near(r.acc, 10, 1e-9, "ISLM-EX-16 · efecto acelerador 10"); near(r.rate, -20, 1e-9, "ISLM-EX-16 · efecto de la tasa −20"); near(r.dI, -10, 1e-9, "ISLM-EX-16 · ΔI = −10"); ok(r.crowd, "ISLM-EX-16 · hay efecto desplazamiento");
near(L.islmSolve({ ...L.islmRead(), regime: "horizontal" }).dI, 30, 1e-9, "ISLM-EX-16 · con tasa fija ΔI = +30");
const rub = Object.fromEntries(ACT.map(a => [a.id, a.rubric]));
[["ISLM-EX-11", ["2.400", "2 %"]], ["ISLM-EX-12", ["300", "2.500", "4 %", "3,33"]], ["ISLM-EX-13", ["2.700", "1.300"]], ["ISLM-EX-14", ["150", "2.600", "3 %", "1.300"]], ["ISLM-EX-15", ["1 %", "4 %", "−20", "−25", "5 %"]], ["ISLM-EX-16", ["10", "−10", "0,2", "b₂ = b₁·d₂/d₁ = 0,1 × 25/0,5 = 5", "+30"]]]
  .forEach(([id, ts]) => ts.forEach(t => ok(rub[id].includes(t), `${id} · la pauta dice «${t}»`)));
const noOverlap = (id, ctx) => { const Bx = (L.plotLayouts[id] || []).filter(b => !b.line); let bad = 0;
  for (let i = 0; i < Bx.length; i++) for (let j = i + 1; j < Bx.length; j++) { const a = Bx[i], b = Bx[j]; if (a.x < b.x + b.w - .5 && b.x < a.x + a.w - .5 && a.y < b.y + b.h - .5 && b.y < a.y + a.h - .5) bad++; }
  return ok(Bx.length > 3 && bad === 0, `${ctx} · ${id}: ningún rótulo encima de otro (${bad} solapes)`); };
ACT.forEach(a => { load(a.id); L.drawIslm(); noOverlap("islmChart", a.id); ok(!/NaN|undefined|Infinity/.test(doc.getElementById("islmChart").innerHTML), `${a.id} · gráfico sin valores inválidos`); });
Object.keys(w.eval("ISLM_PRESETS")).forEach(k => ["equilibrio", "deseq", "efectos"].forEach(m => { L.islmApply(Object.assign({}, w.eval("ISLM_PRESETS")[k], { mode: m })); noOverlap("islmChart", `${k} · ${m}`); }));
load("ISLM-EX-12"); L.drawIslm(); ok(/la IS se corre 300/.test(doc.getElementById("islmChart").textContent), "la flecha dice cuánto se corre la IS");
load("ISLM-EX-15"); L.drawIslm(); ok(/en horas/.test(doc.getElementById("islmChart").textContent) && /en semanas/.test(doc.getElementById("islmChart").textContent), "el camino de ajuste rotula las dos velocidades");
const tabs = [...doc.querySelectorAll('#tabs [role="tab"]')].map(t => t.textContent.trim());
ok(tabs.join("|") === "Ruta por clases|Lab · Índices|Lab · PIB por gasto|Lab · Mercado de bienes|Lab · Dinero / tasa|Lab · Relación LM|Lab · Curva IS|Lab · IS-LM|Lab · Mercado laboral", "las nueve pestañas en el orden de las notas");
const panel = doc.getElementById("islm").textContent;
ok(!/cierre docente|cierre [AB]\b|tres piezas|crowding-out|domina el desplazamiento/i.test(panel), "la ventana no usa terminología antigua");
ok(/efecto desplazamiento/.test(panel) && /no es efecto desplazamiento/.test(panel), "la ventana separa el efecto de la tasa por decisión monetaria del efecto desplazamiento");

// Ejemplo real verificado por el profesor (24-09-2026): RPM de julio de 2023, las dos velocidades.
const dv = [...doc.querySelectorAll("#islm .data-card")].find(c => /dos velocidades/.test(c.textContent));
ok(dv, "hay una tarjeta de las dos velocidades con la RPM de julio de 2023");
["10,50 %", "10,25 %", "6,20 % → 6,11 %", "6,11 % → 5,91 %", "0,4 · 0,9 · 2,4 · 2,3 · 0,5 · 3,7 %", "−2,7 · −3,3 · −4,7 · −4,1 %", "unanimidad", "Lo que no permite decir"]
  .forEach(t => ok(dv && dv.textContent.includes(t), `tarjeta de julio de 2023 · dice «${t}»`));
ok(dv && !/50 o 75/.test(dv.textContent), "la tarjeta cita el recorte esperado por la EOF (75 pb), no «50 o 75»");
// Ejemplos verificados por el profesor (24-09-2026): expansión fiscal 2020 y acelerador 2024.
const card = t => [...doc.querySelectorAll("#islm .data-card")].find(c => c.querySelector("h3").textContent.includes(t));
const fis = card("tasa en su piso"), acc = card("acelerador llega con rezago");
["0,50 %", "11,0 % real", "14,6 %", "24,1 %", "8,9 %"].forEach(t => ok(fis && fis.textContent.includes(t), `tarjeta fiscal 2020 · dice «${t}»`));
ok(fis && /Que el 11,0 % sea el ΔG del modelo/.test(fis.textContent), "tarjeta fiscal 2020 · advierte que el 11,0 % no es ΔG");
["−1,7", "−7,8", "0,8", "−13,6", "0,3", "−9,5", "1,1", "0,5", "2,1", "8,5", "con rezago"].forEach(t => ok(acc && acc.textContent.includes(t), `tarjeta acelerador 2024 · dice «${t}»`));
ok(acc && /no permite decir.*consumo causó/.test(acc.textContent.replace(/\s+/g, " ")), "tarjeta acelerador · no atribuye causalidad");
const din = doc.getElementById("din").textContent, lm = doc.getElementById("lm").textContent;
ok(/8 de septiembre de 2026/.test(din) && /N° 324/.test(din), "Dinero / tasa · cita la RPM del 8 de septiembre de 2026 (Minuta N° 324)");
ok(/8 de septiembre de 2026/.test(lm) && /sep\. 2026 · 4,50 %/.test(doc.getElementById("tpmStory").textContent), "Relación LM · tarjeta y minigráfico con la RPM de septiembre");
console.log(`test_lab_islm.js — ${n} aserciones · RESULTADO: ${failures.length ? "FALLA" : "OK"}`);
failures.forEach(f => console.log("  ✘ " + f));
process.exit(failures.length ? 1 : 0);
