#!/usr/bin/env node
"use strict";
/*
 * test_formulas_clases4_7.js — cifras del tramo 4-7 recalculadas con las funciones reales.
 *
 * Uso:  node test_formulas_clases4_7.js        (desde macro1/)
 * También corre dentro de test_formulas_selladas.js: el MANIFEST declara exactamente
 * cinco suites y esta se integra en la de fórmulas, sin agregar una sexta.
 *
 * No compara contra una segunda implementación escrita aquí. Carga:
 *   · el laboratorio macro1/index.html en jsdom (moneyInterest, crossSolve, CLASS_ROUTES,
 *     GUIDED_DIAGNOSTICS, GUIDED_DRILLS, scoreClassTest);
 *   · la capa superior (index.html + script.js) en jsdom, con Chart.js simulado, para usar
 *     calcISLM, isCurve, lmCurve e ISLM_SHOCKS y leer la línea «Efecto acelerador / Efecto de la tasa»
 *     que pinta renderISLM.
 *
 * Cubre:
 *   1. los expected de CLASS_ROUTES 4-7 (Especificación de la ruta, §2) y sus pautas;
 *   2. las aplicaciones isomorfas de los diseños integrales de las Clases 4 a 7;
 *   3. los valores de control de las guías del simulador de las Clases 5 a 7
 *      (verificación docente V1/V2 del 21-09-2026), leídos en la pantalla real;
 *   4. las cifras de los doce ejercicios guiados y la coherencia de los diagnósticos.
 *
 * Una cifra que no cuadra se reporta; no se corrige el valor esperado sin verificar con V1.
 */

const fs = require("fs");
const path = require("path");

function run() {
  const { JSDOM, VirtualConsole } = require("jsdom");
  let assertions = 0;
  const failures = [];
  const ok = (cond, label) => { assertions++; if (!cond) failures.push(label); };
  const near = (got, want, label, tol = 0.005) => ok(Number.isFinite(got) && Math.abs(got - want) <= tol, `${label}: se obtuvo ${got}, se esperaba ${want}`);

  /* ---------- laboratorio macro1 ---------- */
  const labErrors = [];
  const labConsole = new VirtualConsole(); labConsole.on("jsdomError", e => labErrors.push(e.message));
  const lab = new JSDOM(fs.readFileSync(path.join(__dirname, "index.html"), "utf8"), {
    runScripts: "dangerously", url: "http://localhost/macro1/index.html", pretendToBeVisual: true, virtualConsole: labConsole,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => ({ width: 10 }), set: () => true });
      w.Element.prototype.scrollIntoView = () => {}; w.URL.createObjectURL = () => "blob:test"; w.URL.revokeObjectURL = () => {};
      w.HTMLAnchorElement.prototype.click = function () {};
    }
  }).window;
  ok(labErrors.length === 0, `el laboratorio carga sin errores (${labErrors.join(" | ")})`);
  const ROUTES = lab.eval("CLASS_ROUTES"), DIAG = lab.eval("GUIDED_DIAGNOSTICS"), DRILLS = lab.eval("GUIDED_DRILLS");
  const crossSolve = lab.eval("crossSolve");
  const moneyRate = (Y, Ms, d1, d2) => {
    [["moneyY", Y], ["moneyMs", Ms], ["moneyD1", d1], ["moneyD2", d2]].forEach(([id, v]) => { lab.document.getElementById(id).value = String(v); });
    return lab.eval("moneyInterest()");
  };

  /* ---------- capa superior: script.js real ---------- */
  const topErrors = [];
  const topConsole = new VirtualConsole(); topConsole.on("jsdomError", e => topErrors.push(e.message));
  const topHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8").replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, "");
  const top = new JSDOM(topHtml, { runScripts: "dangerously", url: "http://localhost/index.html", pretendToBeVisual: true, virtualConsole: topConsole,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => ({});
      w.Chart = function () { return { destroy() {}, update() {} }; };
      w.Chart.register = () => {};
      w.Chart.defaults = { font: {}, plugins: { legend: { labels: {} }, tooltip: {} }, scale: { grid: {} } };
    }
  }).window;
  // script.js entra como <script> real para compartir el alcance global, como en el navegador.
  const tag = top.document.createElement("script");
  tag.textContent = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  top.document.body.appendChild(tag);
  top.eval("init()");
  ok(topErrors.length === 0, `la capa superior carga sin errores (${topErrors.join(" | ")})`);
  const calcISLM = top.eval("calcISLM"), isCurve = top.eval("isCurve"), lmCurve = top.eval("lmCurve");
  const SHOCKS = top.eval("ISLM_SHOCKS"), applyDelta = top.eval("applyDelta");
  // Pantalla real de la pestaña IS-LM: fija parámetros, régimen, impuesto y shock, y lee lo que se muestra.
  const screen = (params, { regime = "upward", taxMode = "fixed", shock = "none" } = {}) => {
    Object.entries(params).forEach(([k, v]) => { const el = top.document.getElementById(`islm-${k}`); if (el) el.value = String(v); });
    top.document.getElementById("islm-regime").value = regime;
    top.document.getElementById("islm-taxmode").value = taxMode;
    top.document.getElementById("islm-shock").value = shock;
    top.eval("renderISLM()");
    const text = id => top.document.getElementById(id).textContent;
    return { y0: text("islm-y0"), y1: text("islm-y1"), i0: text("islm-i0"), i1: text("islm-i1"), inv0: text("islm-inv0"), inv1: text("islm-inv1"), crowd: text("islm-crowd") };
  };

  const cl = v => Number(v).toLocaleString("es-CL", { maximumFractionDigits: 2 }).replace(/^-/, "−");
  // Economía del curso (Notas 6 a 8): T fijo = 80, M/P = 1.500, Md = 0,5Y − 50i.
  const COURSE = { c0: 100, c1: 0.75, T: 80, t: 0.2, b0: 160, b1: 0.15, b2: 15, G: 200, MP: 1500, d1: 0.5, d2: 50, iFixed: 4 };
  // ISLM-EX-03 (T = 0): IS Y = 1.600 − 50i; LM Y = 400 + 40i.
  const EX03 = { c0: 50, c1: 0.8, T: 0, b0: 10, b1: 0.1, b2: 5, G: 100, MP: 100, d1: 0.25, d2: 10 };
  const atRate = (p, i, taxMode = "fixed") => calcISLM({ ...p, iFixed: i }, "horizontal", taxMode);

  /* ===== 1 · Especificación §2: expected de CLASS_ROUTES 4-7 ============== */
  const solved = {
    4: { answerA: moneyRate(1000, 760, 0.8, 20), answerB: moneyRate(1010, 760, 0.8, 20), answerC: 0.8 * 1010 - 20 * moneyRate(1000, 760, 0.8, 20) },
    5: { answerA: atRate(COURSE, 4).Y, answerB: atRate(COURSE, 8).Y, answerC: atRate(COURSE, 0).Y, answerD: atRate({ ...COURSE, G: 220 }, 4).Y - atRate(COURSE, 4).Y },
    6: { answerA: calcISLM(COURSE, "upward").Y, answerB: calcISLM(COURSE, "upward").i, answerC: calcISLM({ ...COURSE, G: 220 }, "upward").Y, answerD: calcISLM({ ...COURSE, G: 220 }, "upward").i },
    7: (() => { const a = calcISLM(EX03, "upward"), b = calcISLM({ ...EX03, G: 120 }, "upward"); return { answerA: b.Y, answerB: b.i, answerC: b.investment - a.investment }; })()
  };
  near(moneyRate(1010, 768, 0.8, 20), 2, "Clase 4 · (c) con M/P = 768 e Y = 1.010 el laboratorio devuelve i = 2 %");
  near(isCurve(COURSE)(3400), 4, "Clase 5 · la IS de la pestaña pasa por (3.400; 4 %)");
  near(isCurve(COURSE)(2800), 8, "Clase 5 · la IS de la pestaña pasa por (2.800; 8 %)");
  near(solved[5].answerC / atRate(COURSE, 0).mult, 400, "Clase 5 · el intercepto es gasto autónomo 400 por multiplicador 10");
  near(atRate(COURSE, 4).mult, 10, "Clase 5 · multiplicador del mercado de bienes = 10");
  near(atRate(EX03, 0).mult, 10, "Clase 7 · el enunciado declara multiplicador 10 y el solver lo confirma");
  near(isCurve(EX03)(1600), 0, "Clase 7 · la IS del enunciado corta en Y = 1.600");
  near(lmCurve(EX03, "upward")(400), 0, "Clase 7 · la LM del enunciado corta en Y = 400");

  ["4", "5", "6", "7"].forEach(c => {
    const route = ROUTES[c], test = route.test;
    ok(route && test && test.type === "numeric", `Clase ${c} · la ruta existe y su pregunta es numérica`);
    Object.entries(test.expected).forEach(([key, want]) => {
      const tol = (test.answerSpecs && test.answerSpecs[key] && test.answerSpecs[key].tolerance) || 0.03;
      near(solved[c][key], want, `Clase ${c} · ${key} (${test.answerLabels[key]}) coincide con el solver`, Math.min(tol, 0.01));
      ok(test.model.includes(cl(want)), `Clase ${c} · la pauta de la ruta muestra ${cl(want)}`);
    });
    // La evaluación base de la página acepta las cifras del solver escritas con coma decimal.
    lab.MacroLabLoop.selectClass(c);
    const state = lab.MacroLabLoop.classState()[c];
    state.fields = Object.fromEntries(Object.entries(solved[c]).map(([k, v]) => [k, Number(v).toFixed(2).replace(".", ",")]));
    const base = lab.MacroLabLoop.scoreClassTest();
    ok(base.checks.filter(x => x.numeric).length === Object.keys(test.expected).length && base.checks.filter(x => x.numeric).every(x => x.ok),
      `Clase ${c} · scoreClassTest acepta las cifras del solver`);
    const wrong = Object.fromEntries(Object.keys(test.expected).map(k => [k, "0"]));
    state.fields = { ...wrong };
    ok(lab.MacroLabLoop.scoreClassTest().checks.filter(x => x.numeric).every(x => !x.ok), `Clase ${c} · scoreClassTest rechaza respuestas equivocadas`);
  });
  // Vocabulario de la Nota 8 (GATE R, 23-09-2026): nombrar «el efecto de la tasa» también cuenta como nombrar el efecto que domina.
  const c7effect = ROUTES["7"].test.verbalChecks.find(v => v.id === "c7-effect").pattern;
  ["Domina el efecto de la tasa: b₂·Δi = 11,11 supera a b₁·ΔY = 8,89.", "Domina el acelerador.", "Hay efecto desplazamiento."].forEach(t =>
    ok(c7effect.test(t), `Clase 7 · c7-effect reconoce «${t}»`));
  ok(!c7effect.test("La inversión baja 2,22."), "Clase 7 · c7-effect no se cumple si no se nombra ningún efecto");
  const labSrc = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  ok((labSrc.match(/\(acelerador\|desplazamiento\|crowding\|efecto de la tasa\)/g) || []).length === 3 && !/\(acelerador\|desplazamiento\|crowding\)\//.test(labSrc),
    "Lab · los tres patrones de C7 (ruta, diagnóstico y criterio) aceptan «efecto de la tasa»");
  ok(ROUTES["4"].lab === "din" && ROUTES["5"].lab === "cruz", "Clases 4 y 5 · abren los laboratorios de dinero y de bienes");
  ["5", "6", "7"].forEach(c => ok(ROUTES[c].externalLab && ROUTES[c].externalLab.url === "../?tab=islm", `Clase ${c} · externalLab apunta a ../?tab=islm`));
  const scriptSrc = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  ok(/searchParams\.get\('tab'\)/.test(scriptSrc) && /TAB_TITLES\[tab\]\)activateTab\(tab\)/.test(scriptSrc) && /islm\s*:/.test(scriptSrc.slice(scriptSrc.indexOf("const TAB_TITLES"), scriptSrc.indexOf("const TAB_TITLES") + 600)),
    "la capa superior abre la pestaña con ?tab=islm (el ancla #islm no la activa)");

  /* ===== 2 · Aplicaciones isomorfas de los diseños integrales ============== */
  near(moneyRate(2000, 900, 0.5, 25), 4, "Clase 4 isomorfa · i = 4 %");
  near(moneyRate(2050, 900, 0.5, 25), 5, "Clase 4 isomorfa · con Y = 2.050 e M/P fija, i = 5 %");
  near(moneyRate(2050, 925, 0.5, 25), 4, "Clase 4 isomorfa · M/P = 925 sostiene i = 4 %");
  near(atRate(COURSE, 4, "proportional").Y, 1600, "Clase 5 isomorfa (T = 0,2·Y) · Y = 1.600 con i = 4 %");
  near(atRate(COURSE, 8, "proportional").Y, 1360, "Clase 5 isomorfa · Y = 1.360 con i = 8 %");
  near(atRate(COURSE, 0, "proportional").Y, 1840, "Clase 5 isomorfa · la IS es Y = 1.840 − 60i (intercepto)");
  near(atRate(COURSE, 0, "proportional").Y - atRate(COURSE, 1, "proportional").Y, 60, "Clase 5 isomorfa · cada punto de tasa quita 60");
  near(atRate({ ...COURSE, G: 220 }, 4, "proportional").Y - atRate(COURSE, 4, "proportional").Y, 80, "Clase 5 isomorfa · ΔG = 20 desplaza la IS 80");
  const iso6 = { ...COURSE, MP: 600 }, iso6b = calcISLM({ ...iso6, G: 220 }, "upward", "proportional");
  near(calcISLM(iso6, "upward", "proportional").Y, 1600, "Clase 6 isomorfa (t = 0,2; M/P = 600) · Y* = 1.600");
  near(calcISLM(iso6, "upward", "proportional").i, 4, "Clase 6 isomorfa · i* = 4 %");
  near(iso6b.Y, 1650, "Clase 6 isomorfa · Y* = 1.650 si G sube 20");
  near(iso6b.i, 4.5, "Clase 6 isomorfa · i* = 4,5 % si G sube 20");
  const ex05a = calcISLM({ ...EX03, iFixed: 8 }, "horizontal"), ex05b = calcISLM({ ...EX03, G: 120, iFixed: 8 }, "horizontal");
  near(ex05b.Y - ex05a.Y, 200, "Clase 7 isomorfa (ISLM-EX-05) · ΔY = 200");
  near(ex05b.investment - ex05a.investment, 20, "Clase 7 isomorfa · ΔI = +20");

  /* ===== 3 · Controles de las guías del simulador, Clases 5 a 7 ============ */
  const p1 = i => crossSolve({ c0: 100, c1: 0.75, I: 220 - 10 * i, G: 200, T: 0, t: 0.2, proportional: true });
  near(p1(2).multiplier, 2.5, "Guía 5 · Parte 1 · multiplicador 2,5 con t = 0,2");
  near(p1(2).Yeq, 1250, "Guía 5 · Parte 1 · Y* = 1.250 con i = 2 (I = 200)");
  near(p1(6).Yeq, 1150, "Guía 5 · Parte 1 · Y* = 1.150 con i = 6 (I = 160)");
  near(p1(0).Yeq, 1300, "Guía 5 · Parte 1 · la IS de la actividad corta en 1.300");
  near((p1(2).Yeq - p1(6).Yeq) / 4, 25, "Guía 5 · Parte 1 · la IS de la actividad es Y = 1.300 − 25·i");
  near(isCurve(COURSE, "proportional")(1600), 4, "Guía 5 · Parte 2 · la IS con T = t·Y pasa por (1.600; 4)");
  near(isCurve(COURSE, "proportional")(1360), 8, "Guía 5 · Parte 2 · la IS con T = t·Y pasa por (1.360; 8)");
  const ev5 = crossSolve({ c0: 100, c1: 0.75, I: 100, G: 400, T: 0, t: 0.2, proportional: true });
  near(ev5.multiplier, 2.5, "Guía 5 · evidencia · multiplicador 2,5");
  near(ev5.Yeq, 1500, "Guía 5 · evidencia · Y* = 1.500");
  near(ev5.closure, 100, "Guía 5 · evidencia · cierre S + (T − G) = I = 100");

  const expectScreen = (label, got, want) => {
    ["y0", "i0", "inv0", "y1", "i1", "inv1"].forEach(k => { if (want[k] !== undefined) ok(got[k] === want[k], `${label} · ${k}: la pantalla muestra «${got[k]}», se esperaba «${want[k]}»`); });
    ok(got.crowd.startsWith(`Efecto acelerador: b₁·ΔY = ${want.acc}. Efecto de la tasa: b₂·Δi = ${want.crowd}.`), `${label} · línea del acelerador: «${got.crowd}»`);
  };
  ok(SHOCKS.fiscalExpand.delta.G === 30 && SHOCKS.monetaryExpand.delta.MP === 55, "ISLM_SHOCKS · expansión fiscal +30 y monetaria +55");
  const run6 = calcISLM(COURSE, "upward");
  near(run6.Y, 3400, "Guía 6 · corrida 1 · Y = 3.400"); near(run6.i, 4, "Guía 6 · corrida 1 · i = 4 %"); near(run6.investment, 610, "Guía 6 · corrida 1 · I = 610");
  expectScreen("Guía 6 · corrida 2 (expansión fiscal)", screen(COURSE, { shock: "fiscalExpand" }), { y0: "3.400,00", i0: "4,00", inv0: "610,00", y1: "3.520,00", i1: "5,20", inv1: "610,00", acc: "18,00", crowd: "18,00" });
  near((calcISLM(applyDelta(COURSE, SHOCKS.fiscalExpand.delta), "upward").Y - run6.Y) / 30, 4, "Guía 6 · la predicción ΔY = 4 × 30 usa el multiplicador IS-LM 4");
  expectScreen("Guía 6 · corrida 3 (LM horizontal)", screen(COURSE, { regime: "horizontal", shock: "fiscalExpand" }), { y1: "3.700,00", i1: "4,00", inv1: "655,00", acc: "45,00", crowd: "0,00" });
  near(moneyRate(3700, 1650, 0.5, 50), 4, "Guía 6 · corrida 3 · M/P = 1.650 sostiene i = 4 % con Y = 3.700");
  expectScreen("Guía 6 · corrida 4 (T = t·Y, M/P = 600)", screen({ ...COURSE, MP: 600 }, { taxMode: "proportional", shock: "fiscalExpand" }), { y0: "1.600,00", i0: "4,00", inv0: "340,00", y1: "1.675,00", i1: "4,75", inv1: "340,00", acc: "11,25", crowd: "11,25" });
  expectScreen("Guía 6 · opcional (expansión monetaria)", screen(COURSE, { shock: "monetaryExpand" }), { y1: "3.466,00", i1: "3,56", inv1: "626,50", acc: "9,90", crowd: "−6,60" });
  // H-R1 (23-09-2026): los dos términos llevan signo; un shock contractivo ya no muestra 0,00 y 0,00.
  expectScreen("H-R1 · contracción monetaria", screen(COURSE, { shock: "monetaryContract" }), { inv1: "593,50", acc: "−9,90", crowd: "6,60" });
  expectScreen("H-R1 · contracción fiscal", screen(COURSE, { shock: "fiscalContract" }), { inv1: "610,00", acc: "−18,00", crowd: "−18,00" });
  ok(/b₀ baja 25,00/.test(screen(COURSE, { shock: "worseExpectations" }).crowd), "H-R1 · con expectativas peores la línea nombra el cambio de b₀");
  ok(!/desplazamiento/.test(screen({ ...COURSE, b2: 5 }, { shock: "fiscalExpand" }).crowd), "GATE R · si la inversión sube, la línea no habla de efecto desplazamiento");
  ok(/efecto desplazamiento/.test(screen({ ...COURSE, b2: 25 }, { shock: "fiscalExpand" }).crowd), "GATE R · si sube G y la inversión baja, la línea nombra el efecto desplazamiento");

  const runs7 = [
    { b2: 25, regime: "upward", y0: "3.285,71", i0: "2,86", inv0: "581,43", y1: "3.371,43", i1: "3,71", inv1: "572,86", acc: "12,86", crowd: "21,43", dI: -8.57 },
    { b2: 5, regime: "upward", y0: "3.666,67", i0: "6,67", inv0: "676,67", y1: "3.866,67", i1: "8,67", inv1: "696,67", acc: "30,00", crowd: "10,00", dI: 20 },
    { b2: 25, regime: "horizontal", y0: "3.000,00", i0: "4,00", inv0: "510,00", y1: "3.300,00", i1: "4,00", inv1: "555,00", acc: "45,00", crowd: "0,00", dI: 45 },
    { b2: 15, regime: "upward", y0: "3.400,00", i0: "4,00", inv0: "610,00", y1: "3.520,00", i1: "5,20", inv1: "610,00", acc: "18,00", crowd: "18,00", dI: 0 }
  ];
  runs7.forEach((r, n) => {
    const p = { ...COURSE, b2: r.b2 };
    expectScreen(`Guía 7 · corrida ${n + 1} (b₂ = ${r.b2}, LM ${r.regime === "horizontal" ? "horizontal" : "con pendiente"})`, screen(p, { regime: r.regime, shock: "fiscalExpand" }), r);
    near(calcISLM(applyDelta(p, SHOCKS.fiscalExpand.delta), r.regime).investment - calcISLM(p, r.regime).investment, r.dI, `Guía 7 · corrida ${n + 1} · ΔI = ${cl(r.dI)}`, 0.01);
  });
  [[25, 0.25], [5, 0.05], [15, 0.15]].forEach(([b2, v]) => near(b2 * COURSE.d1 / COURSE.d2, v, `Guía 7 · condición b₂·d₁/d₂ = ${cl(v)} frente a b₁ = 0,15 (b₂ = ${b2})`));

  /* ===== 4 · Ejercicios guiados y diagnósticos de las Clases 4 a 7 ========= */
  const answer = (id, field) => DRILLS[id].fields.find(f => f.id === field).answer;
  near((100 / 96.154 - 1) * 100, Number(answer("DIN-DRILL-BONO-01", "a")), "DIN-DRILL-BONO-01 · PB = 96,154 da 4 %", 0.01);
  near((100 / 95.238 - 1) * 100, 5, "DIN-DRILL-BONO-01 · PB = 95,238 da 5 %", 0.01);
  near(moneyRate(2050, 900, 0.5, 25), Number(answer("DIN-DRILL-CIERRE-01", "a")), "DIN-DRILL-CIERRE-01 · con M/P fija la tasa sube a 5 %");
  near(moneyRate(2050, Number(answer("DIN-DRILL-CIERRE-01", "b")), 0.5, 25), 4, "DIN-DRILL-CIERRE-01 · M/P = 925 sostiene 4 %");
  near(atRate(COURSE, 6).Y, Number(answer("ISLM-DRILL-CRUZ-01", "a")), "ISLM-DRILL-CRUZ-01 · Y = 3.100 con i = 6 %");
  near(atRate({ ...COURSE, G: 220 }, 4).Y - atRate(COURSE, 4).Y, Number(answer("ISLM-DRILL-GT-01", "a")), "ISLM-DRILL-GT-01 · ΔG = 20 desplaza la IS 200");
  near(atRate({ ...COURSE, T: 60 }, 4).Y - atRate(COURSE, 4).Y, Number(answer("ISLM-DRILL-GT-01", "b")), "ISLM-DRILL-GT-01 · una transferencia de 20 desplaza la IS 150");
  near(atRate(COURSE, 4, "proportional").mult, Number(answer("ISLM-DRILL-t-01", "a")), "ISLM-DRILL-t-01 · multiplicador 4 con T = 0,2·Y");
  near(lmCurve(COURSE, "upward")(3500) - lmCurve(COURSE, "upward")(3400), 1, "ISLM-DRILL-LM-01 · la tasa sube 1 punto por cada 100 de producción");
  near(COURSE.d1 / COURSE.d2, Number(answer("ISLM-DRILL-LM-01", "a")), "ISLM-DRILL-LM-01 · pendiente d₁/d₂ = 0,01");
  near((1600 + COURSE.d2 * 4) / COURSE.d1 - (1500 + COURSE.d2 * 4) / COURSE.d1, 200, "ISLM-DRILL-LM-01 · M/P + 100 desplaza la LM 200 a la derecha");
  near(calcISLM({ ...COURSE, G: 220 }, "upward").Y - run6.Y, Number(answer("ISLM-DRILL-REG-01", "a")), "ISLM-DRILL-REG-01 · ΔY = 80 con LM de pendiente positiva");
  near(calcISLM({ ...COURSE, G: 220 }, "horizontal").Y - calcISLM(COURSE, "horizontal").Y, Number(answer("ISLM-DRILL-REG-01", "b")), "ISLM-DRILL-REG-01 · ΔY = 200 con LM horizontal");
  near(isCurve(EX03)(600), 20, "ISLM-DRILL-CUAD-01 · a Y = 600 la IS pide i = 20 %");
  near(lmCurve(EX03, "upward")(600), 5, "ISLM-DRILL-CUAD-01 · a Y = 600 la LM pide i = 5 %");
  ok(answer("ISLM-DRILL-CUAD-01", "a") === "below" && answer("ISLM-DRILL-CUAD-01", "b") === "above", "ISLM-DRILL-CUAD-01 · 6 % < 20 %: bajo la IS; 6 % > 5 %: sobre la LM");
  const d0 = calcISLM(EX03, "upward"), d1 = calcISLM({ ...EX03, G: 120 }, "upward");
  near(EX03.b1 * (d1.Y - d0.Y), Number(answer("ISLM-DRILL-DESC-01", "a")), "ISLM-DRILL-DESC-01 · acelerador b₁·ΔY = 8,89", 0.01);
  near(EX03.b2 * (d1.i - d0.i), 11.11, "ISLM-DRILL-DESC-01 · desplazamiento b₂·Δi = 11,11", 0.01);
  ok(d1.investment < d0.investment && answer("ISLM-DRILL-DESC-01", "b") === "crowd", "ISLM-DRILL-DESC-01 · domina el desplazamiento");

  ["4", "5", "6", "7"].forEach(c => {
    const config = DIAG[c];
    ok(Boolean(config), `Clase ${c} · tiene diagnóstico guiado`);
    Object.entries(config.orientations).forEach(([code, o]) => ok(Boolean(DRILLS[o.drill]), `Clase ${c} · ${code} apunta a un ejercicio existente (${o.drill})`));
    ok(Boolean(DRILLS[config.defaultDrill]), `Clase ${c} · el ejercicio por defecto existe`);
    const codes = [...Object.values(config.numericSignals || {}).map(s => s.code), ...(config.verbalSignals || []).map(s => s.code)].filter(Boolean);
    codes.forEach(code => ok(Boolean(config.orientations[code]), `Clase ${c} · la señal ${code} tiene una orientación que mostrar`));
    config.probe.options.forEach(([code]) => ok(code.startsWith("__") || Boolean(config.orientations[code]), `Clase ${c} · la alternativa ${code} tiene orientación`));
  });
  Object.entries(DRILLS).forEach(([id, drill]) => drill.fields.forEach(f => ok(f.options.some(([v]) => v === f.answer), `${id} · la respuesta de «${f.label}» está entre las alternativas`)));

  return { assertions, failures };
}

module.exports = { run };

if (require.main === module) {
  let result;
  try { result = run(); } catch (err) { console.error("Error inesperado:", err && err.stack ? err.stack : err); process.exit(1); }
  console.log("test_formulas_clases4_7.js — cifras del tramo 4-7 con las funciones reales");
  if (result.failures.length) { console.log(`\nFallos (${result.failures.length}):`); result.failures.forEach(f => console.log("  x " + f)); }
  console.log(`\nAserciones: ${result.assertions} · fallos: ${result.failures.length}`);
  console.log(result.failures.length ? "RESULTADO: FALLA" : "RESULTADO: OK");
  process.exit(result.failures.length ? 1 : 0);
}
