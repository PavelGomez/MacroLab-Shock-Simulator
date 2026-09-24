#!/usr/bin/env node
"use strict";
/*
 * test_enunciados_glosario.js — Protocolo de enunciados v1 y glosario canónico.
 *
 * Comprueba, en el laboratorio real (jsdom):
 *   1. el glosario embebido coincide con macro1/glosario-alumno.json;
 *   2. cada actividad con `enunciado` tiene las partes del protocolo y sus pistas existen;
 *   3. el texto que ve el alumno no trae códigos internos ni terminología antigua;
 *   4. las cifras de la pauta de Dinero / tasa coinciden con lo que calcula el laboratorio;
 *   5. la revisión de las tasas del bono diagnostica el error probable.
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
const { bloque, START, END } = require("../scripts/embed-glosario.js");

const LAB = path.join(__dirname, "index.html");
let assertions = 0;
const failures = [];
function ok(c, label) { assertions += 1; if (!c) failures.push(`${assertions}. ${label}`); return Boolean(c); }
function near(a, b, tol, label) { return ok(Number.isFinite(a) && Math.abs(a - b) <= tol, `${label} — esperado ${b} ±${tol}, obtenido ${a}`); }

function bootLab() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => errors.push("jsdomError: " + e.message));
  vc.on("error", m => errors.push("console.error: " + m));
  const noop = () => {};
  const ctx = () => new Proxy({}, { get: (_t, k) => k === "canvas" ? { width: 640, height: 420 } : k === "measureText" ? () => ({ width: 10 }) : k === "createLinearGradient" ? () => ({ addColorStop: noop }) : noop, set: () => true });
  const dom = new JSDOM(fs.readFileSync(LAB, "utf8"), {
    runScripts: "dangerously", url: "http://localhost/macro1/index.html", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(win) {
      win.HTMLCanvasElement.prototype.getContext = () => ctx();
      win.Element.prototype.scrollIntoView = () => {};
      win.URL.createObjectURL = () => "blob:test"; win.URL.revokeObjectURL = () => {};
    }
  });
  return { w: dom.window, errors };
}

const INTERNO = /\b[A-Z]{2,5}-(EX|ERR|CIR|MAT|DRILL)-[\w-]*|bloque sellado|biblioteca|VERIFICAR|por confirmar/;
const ANTIGUO = /cierre docente|cierre [AB]\b|dos cierres|declare el cierre|tres piezas|crowding-out/i;

function main() {
  const { w, errors } = bootLab();
  const doc = w.document;
  ok(errors.length === 0, "el laboratorio carga sin errores de consola: " + errors.join(" | "));

  /* ===== 1 · Glosario embebido al día ===== */
  const html = fs.readFileSync(LAB, "utf8");
  const embebido = html.slice(html.indexOf(START), html.indexOf(END) + END.length);
  ok(embebido === bloque(), "el glosario embebido coincide con glosario-alumno.json (corre node scripts/embed-glosario.js)");
  const G = w.eval("GLOSARIO_ALUMNO");
  ok(Object.keys(G.terminos).length >= 60, "el glosario embebido trae los términos del glosario canónico");
  Object.entries(G.terminos).forEach(([id, t]) => {
    ok(!INTERNO.test(JSON.stringify(t)), `glosario · ${id} sin códigos internos ni marcas de verificación`);
  });

  const USTED = /\b(usted|confunda|escriba|calcule|explique|ordene|mire|piense|revise|verá|compruebe)\b/i;
  Object.entries(G.terminos).forEach(([id, t]) => {
    ok(!USTED.test(JSON.stringify(t)), `glosario · ${id} en forma impersonal (lo leen notas y MacroLab)`);
  });

  /* ===== 2 y 3 · Actividades con enunciado ===== */
  const ACT = w.eval("ACTIVITIES");
  const conEnunciado = Object.values(ACT).flat().filter(a => a.enunciado);
  ok(conEnunciado.length >= 3, "hay al menos tres actividades reescritas con el protocolo");
  ok(ACT.din.every(a => a.enunciado), "todas las actividades de Dinero / tasa siguen el protocolo");
  conEnunciado.forEach(a => {
    const e = a.enunciado;
    ok(e.situacion && e.situacion.length > 40, `${a.id} · tiene situación`);
    ok(e.datos.length >= 1 && e.pide.length >= 1, `${a.id} · tiene datos y partes pedidas`);
    ok(e.primerPaso && e.comprobacion && e.proposito, `${a.id} · tiene primer paso, comprobación y propósito`);
    ok((e.errores || []).length >= 1, `${a.id} · trae al menos un error como síntoma y corrección`);
    e.pistas.forEach(p => ok(G.terminos[p], `${a.id} · la pista «${p}» existe en el glosario`));
    const visible = [a.title, e.situacion, ...e.datos, ...e.pide, e.primerPaso, e.comprobacion, e.proposito, e.enLab || "",
      ...(e.errores || []).flatMap(x => [x.sintoma, x.correccion])].join(" ");
    ok(!INTERNO.test(visible), `${a.id} · el texto para el alumno no trae códigos internos`);
    ok(!ANTIGUO.test(visible + a.rubric), `${a.id} · sin terminología antigua`);
    ok(!USTED.test(visible), `${a.id} · trata de tú, como el resto de MacroLab`);
    ok(!/\d%/.test(visible + a.rubric), `${a.id} · espacio antes de % (formato chileno)`);
  });

  /* ===== Render: DIN-EX-01 muestra las partes y sus pistas ===== */
  const host = doc.querySelector('.activity[data-window="din"]');
  const sel = host.querySelector("select");
  const load = id => { sel.value = String(ACT.din.findIndex(a => a.id === id)); sel.dispatchEvent(new w.Event("change")); };
  load("DIN-EX-01");
  const prompt = host.querySelector(".prompt");
  ["Situación", "Datos", "Se pide", "Cómo saber si está bien", "valor nominal"].forEach(txt =>
    ok(prompt.textContent.includes(txt), `DIN-EX-01 · el enunciado muestra «${txt}»`));
  ok(prompt.querySelectorAll("details.pistas dt").length === 4, "DIN-EX-01 · muestra cuatro pistas del glosario");
  ok(prompt.querySelector(".code-tag").textContent === "DIN-EX-01", "DIN-EX-01 · el código va como etiqueta secundaria");
  ok(!/^DIN-EX/.test(sel.options[sel.selectedIndex].textContent), "el selector muestra primero el título, no el código");
  ok(prompt.innerHTML.includes("P<sub>B</sub>") && !prompt.textContent.includes("P_B"), "DIN-EX-01 · P_B se muestra con subíndice");

  /* ===== 4 · Pautas de Dinero / tasa contra el laboratorio ===== */
  const L = w.MacroLabLoop.lab;
  const set = (id, v) => { L.setValue(id, v); L.drawMoney(); };
  load("DIN-EX-02");
  near(L.moneyInterest(), 2.0, 1e-9, "DIN-EX-02 (a) · tasa inicial 2,0 %");
  set("moneyY", 1010);
  near(L.moneyInterest(), 2.4, 1e-9, "DIN-EX-02 (b) · dinero fijo: 2,4 %");
  set("moneyMs", 768);
  near(L.moneyInterest(), 2.0, 1e-9, "DIN-EX-02 (c) · tasa fija: M/P = 768 devuelve 2,0 %");
  set("moneyMs", 760); doc.getElementById("omoBuy").click();
  near(L.num("moneyMs"), 768, 1e-9, "DIN-EX-02 · «BC compra bonos» suma 8, como dice el enunciado");
  const r2 = ACT.din.find(a => a.id === "DIN-EX-02").rubric;
  ["2,0 %", "2,4 %", "768"].forEach(t => ok(r2.includes(t), `DIN-EX-02 · la pauta dice ${t}`));

  const r1 = ACT.din.find(a => a.id === "DIN-EX-01").rubric;
  near((100 - 95.238) / 95.238 * 100, 5, 0.005, "DIN-EX-01 · 95,238 → 5,0 %");
  near((100 / 96.154 - 1) * 100, 4, 0.005, "DIN-EX-01 · 96,154 → 4,0 % (misma fórmula, escritura de MacroLab)");
  ["5,0 %", "4,0 %"].forEach(t => ok(r1.includes(t), `DIN-EX-01 · la pauta dice ${t}`));

  load("DIN-MAT-AYU6-C1");
  near(L.moneyInterest(), 10, 1e-9, "DIN-MAT-AYU6-C1 (b) · 10 %");
  doc.getElementById("omoSell").click();
  near(L.num("moneyMs"), 12000, 1e-9, "DIN-MAT-AYU6-C1 · «BC vende bonos» lleva M/P a 12.000");
  near(L.moneyInterest(), 15, 1e-9, "DIN-MAT-AYU6-C1 (c) · 15 %");
  ok(ACT.din.find(a => a.id === "DIN-MAT-AYU6-C1").rubric.includes("12.000"), "DIN-MAT-AYU6-C1 · la pauta dice 12.000");

  /* ===== 5 · Revisión de las tasas del bono ===== */
  const check = (a, b) => { L.setValue("bondRateA", a); L.setValue("bondRateB", b); doc.getElementById("checkBondRates").click(); return doc.getElementById("bondRateFeedback").textContent; };
  ok(/^Correcto: 5,0 % y 4,0 %/.test(check(5, 4)), "bono · 5 y 4 se aceptan");
  ok(/ganancia en pesos/.test(check(4.762, 3.846)), "bono · detecta «100 menos el precio»");
  ok(doc.getElementById("bondRateFeedback").innerHTML.includes("P<sub>B</sub>"), "bono · el mensaje muestra P con subíndice B");
  ok(/fracción/.test(check(0.05, 0.04)), "bono · detecta la tasa escrita como fracción");
  ok(/revisa el signo/.test(check(4, 5)), "bono · detecta la tasa que sube con el precio");

  /* ===== 6 · Pautas de los otros labs contra el laboratorio ===== */
  const loadIn = (win, id) => { const h = doc.querySelector(`.activity[data-window="${win}"]`), sl = h.querySelector("select");
    sl.value = String(ACT[win].findIndex(a => a.id === id)); sl.dispatchEvent(new w.Event("change")); return h; };
  ok(Object.keys(ACT).every(win => ACT[win].every(a => a.enunciado)), "todas las actividades de todos los labs siguen el protocolo");
  loadIn("med", "MED-EX-02"); L.calcMeasurement();
  let m = L.measurement();
  near(m[1].def, 118.89, 0.005, "MED-EX-02 · deflactor 2020"); near(m[1].ipc, 119.29, 0.005, "MED-EX-02 · IPC 2020");
  near(m[1].growth, 28.57, 0.005, "MED-EX-02 · crecimiento real 2020"); near(m[2].infl, 26.95, 0.005, "MED-EX-02 · inflación 2021");
  near((214 / 140 - 1) * 100, 52.86, 0.005, "MED-EX-02 · el síntoma del error nominal es 52,86 %");
  loadIn("med", "MED-MAT-AYU2"); L.calcMeasurement(); m = L.measurement();
  near(m[1].ipc, 118.57, 0.005, "MED-MAT-AYU2 · IPC 2020"); near(m[1].def, 118.89, 0.005, "MED-MAT-AYU2 · deflactor 2020");
  near(m[2].infl, 31.33, 0.005, "MED-MAT-AYU2 · inflación IPC 2021");
  const cross = (id, Y, mult) => { loadIn("cruz", id); const c = L.cross(); near(c.Yeq, Y, 0.01, `${id} · Y* = ${Y}`); near(c.multiplier, mult, 0.001, `${id} · multiplicador ${mult}`); return c; };
  const c2 = cross("BIE-EX-02", 5050, 5); near(c2.consumption, 3450, 0.01, "BIE-EX-02 · C = 3.450"); near(c2.privateSaving, 700, 0.01, "BIE-EX-02 · S = 700");
  cross("BIE-EX-Solemne1", 950, 2); const cp = cross("BIE-EX-prop", 880, 1.6); near(cp.consumption, 430, 0.01, "BIE-EX-prop · comprobación C = 430");
  cross("BIE-EX-Solemne1-v2", 1100, 2.5); cross("BIE-MAT-AYU5", 1150, 2.5);
  loadIn("lab", "LAB-EX-01"); const r1l = L.results("lab");
  near(r1l.unemployment, 8.52, 0.005, "LAB-EX-01 · desempleo"); near(r1l.participation, 62.46, 0.005, "LAB-EX-01 · participación"); near(r1l.occupation, 57.14, 0.005, "LAB-EX-01 · ocupación");
  loadIn("lab", "LAB-MAT-TABLA"); const r2l = L.results("lab");
  near(r2l.unemployment, 4.67, 0.005, "LAB-MAT-TABLA · desempleo"); near(r2l.participation, 60.48, 0.005, "LAB-MAT-TABLA · participación");
  loadIn("lab", "LAB-EX-02"); near(L.results("lab").naturalRate, 9.09, 0.005, "LAB-EX-02 · uₙ = 9,09 %");

  /* ===== 7 · Ruta por clases ===== */
  const ROUTES = w.eval("CLASS_ROUTES");
  [1, 2, 3, 4, 5, 6, 7].forEach(c => {
    const t = ROUTES[c].test, e = t.enunciado;
    ok(e && e.situacion && e.datos.length && e.pide.length && e.comprobacion && e.proposito, `Clase ${c} · la pregunta tipo prueba sigue el protocolo`);
    (e?.pistas || []).forEach(p => ok(G.terminos[p], `Clase ${c} · la pista «${p}» existe en el glosario`));
    ok(t.prompt.startsWith(e.situacion), `Clase ${c} · el texto plano se deriva del enunciado`);
    const vis = [e.situacion, ...e.datos, ...e.pide, e.primerPaso, e.comprobacion, e.proposito].join(" ");
    ok(!INTERNO.test(vis) && !ANTIGUO.test(vis) && !USTED.test(vis), `Clase ${c} · sin códigos, sin terminología antigua y de tú`);
    const nPide = e.pide.length, nNum = Object.keys(t.expected || {}).length;
    ok(nPide >= nNum, `Clase ${c} · hay una parte pedida por cada respuesta numérica`);
  });
  // Fase 6: cada clase del tramo 4-7 enlaza a sus términos del glosario
  [4, 5, 6, 7].forEach(c => {
    const terms = ROUTES[c].terms || [];
    ok(terms.length >= 8, `Clase ${c} · la ruta lista los términos de la clase (${terms.length})`);
    terms.forEach(id => ok(G.terminos[id], `Clase ${c} · el término «${id}» existe en el glosario del alumno`));
  });
  ok(["efecto_desplazamiento", "efecto_acelerador", "dos_velocidades", "desequilibrio"].every(id => ROUTES[7].terms.includes(id)), "Clase 7 · incluye desequilibrios, efecto desplazamiento y efecto acelerador");
  ok(ROUTES[4].terms.includes("curva_lm") && ROUTES[5].terms.includes("curva_is") && ROUTES[6].terms.includes("equilibrio_islm"), "Clases 4-6 · LM, IS e IS-LM, según el calendario del tramo");
  ok(!/domina el desplazamiento/i.test(html), "ya no se dice «domina el desplazamiento»: pesa más el efecto de la tasa y hay efecto desplazamiento");
  ok(!/crecerá 2% durante 2026/.test(html), "Clase 1 · la cifra del titular ya no se atribuye al IPoM sin fuente");
  ok(/Pesa más el efecto de la tasa \(11,11\)/.test(ROUTES[7].test.model), "Clase 7 · la pauta usa la convención de las Notas 6 y 8");

  /* ===== Texto visible de las ventanas ===== */
  ["med", "cta", "cruz", "lab"].forEach(id => {
    const t = doc.getElementById(id).textContent.replace(/\s+/g, " ");
    ok(!/\d%/.test(t), `${id} · espacio antes de % en la ventana`);
    ok(!/(Material_clases|bloque sellado|no sellada|unidades docentes)/.test(t), `${id} · sin rótulos internos en la ventana`);
  });

  /* ===== Texto visible de la ventana ===== */
  const panel = doc.getElementById("din").textContent;
  ok(!ANTIGUO.test(panel), "Dinero / tasa · sin terminología antigua en la ventana");
  ok(!/\d%/.test(panel.replace(/\s+/g, " ")), "Dinero / tasa · espacio antes de % en la ventana");
  ok(/valor nominal/.test(panel), "Dinero / tasa · nombra el valor nominal");

  console.log(`test_enunciados_glosario.js — ${assertions} aserciones · RESULTADO: ${failures.length ? "FALLA" : "OK"}`);
  failures.forEach(f => console.log("  ✘ " + f));
  process.exit(failures.length ? 1 : 0);
}
main();
