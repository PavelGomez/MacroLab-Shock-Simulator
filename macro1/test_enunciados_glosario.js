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
