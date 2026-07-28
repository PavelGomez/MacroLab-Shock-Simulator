#!/usr/bin/env node
"use strict";
/*
 * test_formulas_selladas.js — recálculo EN VIVO de las cifras selladas.
 *
 * Uso:  node test_formulas_selladas.js   (desde publicar/macro1/)
 * Requiere jsdom:  npm install jsdom
 *
 * No compara contra constantes copiadas en la prueba: carga el laboratorio real en
 * jsdom, escribe en sus controles, dispara sus propias funciones de cálculo y lee
 * los resultados que el artefacto produce. Si una fórmula, un preset o una canasta
 * cambiara, esta prueba falla.
 *
 * Cubre:
 *   1. medición sellada · PIB nominal 140/214/404 y PIB real 140/180/260;
 *   2. deflactor 100/118,89/155,38 e IPC 100/119,29/151,43;
 *   3. Ayudantía 2 (cuatro bienes) · IPC 118,57 y 155,71;
 *   4. BIE-EX-02 · multiplicador 5, Y* 5.050, C 3.450, S privado 700 y cierre;
 *   5. Solemne 1 · Y* 950 → 1.050 con multiplicador 2; impuesto proporcional 1,6 → 880;
 *   6. Ayudantía 5 · 2,5 / 1.150 / ΔY 187,5 y 1,923 / ΔY 144,23;
 *   7. dinero · i = 2%, i = 2,4% con Y = 1.010 y M/P = 768 para sostener i = 2%;
 *   8. bonos · Pᴮ 95,238 → 5% y Pᴮ 96,154 → 4%;
 *   9. mercado laboral · participación 62,46, ocupación 57,14, desempleo 8,52;
 *  10. WS–PS · uₙ = 9,09% con m = 0,1;
 *  11. variante isomorfa · multiplicador 2,5, Y* 1.100 y 1.200;
 *  12. los seis ejercicios dirigidos, en positivo y en negativo.
 *
 * Imprime el número real de aserciones y sale con código 1 si algo falla.
 */

const fs = require("fs");
const path = require("path");

let JSDOM, VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = require("jsdom"));
} catch (_) {
  console.error("Falta la dependencia jsdom. Instálala con:  npm install jsdom");
  console.error("O ejecuta:  NODE_PATH=/ruta/a/node_modules node test_formulas_selladas.js");
  process.exit(1);
}

const LAB = path.join(__dirname, "index.html");

let assertions = 0;
const failures = [];
function ok(condition, label) {
  assertions += 1;
  if (!condition) failures.push(`${assertions}. ${label}`);
  return Boolean(condition);
}
function eq(actual, expected, label) {
  return ok(actual === expected, `${label} — esperado ${JSON.stringify(expected)}, obtenido ${JSON.stringify(actual)}`);
}
function near(actual, expected, tol, label) {
  const good = Number.isFinite(Number(actual)) && Math.abs(Number(actual) - expected) <= tol;
  return ok(good, `${label} — esperado ${expected} ±${tol}, obtenido ${actual}`);
}

/* ---------- arranque del laboratorio real en jsdom ---------- */
function bootLab() {
  const consoleErrors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => consoleErrors.push("jsdomError: " + e.message));
  vc.on("error", m => consoleErrors.push("console.error: " + m));
  vc.on("warn", m => consoleErrors.push("console.warn: " + m));
  const ctxStub = () => {
    const noop = () => {};
    return new Proxy({}, {
      get: (_t, k) => {
        if (k === "canvas") return { width: 640, height: 420 };
        if (k === "measureText") return () => ({ width: 10 });
        if (k === "createLinearGradient") return () => ({ addColorStop: noop });
        return noop;
      },
      set: () => true
    });
  };
  const dom = new JSDOM(fs.readFileSync(LAB, "utf8"), {
    runScripts: "dangerously",
    url: "http://localhost/macro1/index.html",
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(win) {
      win.HTMLCanvasElement.prototype.getContext = () => ctxStub();
      win.Element.prototype.scrollIntoView = () => {};
      win.URL.createObjectURL = () => "blob:test";
      win.URL.revokeObjectURL = () => {};
      win.HTMLAnchorElement.prototype.click = function () {};
    }
  });
  return { window: dom.window, consoleErrors };
}

function main() {
  const { window: w, consoleErrors } = bootLab();
  const L = w.MacroLabLoop;
  const lab = L.lab;
  const doc = w.document;
  const click = sel => doc.querySelector(sel).dispatchEvent(new w.MouseEvent("click", { bubbles: true }));

  eq(consoleErrors.length, 0, "el laboratorio carga sin errores de consola");
  ok(typeof lab === "object", "la superficie de recálculo en vivo está disponible");

  /* ===== 1 y 2 · Medición sellada ========================================== */
  lab.setMeasurementPreset("sealed");
  lab.calcMeasurement();
  const med = lab.measurement();
  eq(med.length, 3, "la medición sellada produce tres años");
  eq(med.map(r => r.year).join("/"), "2019/2020/2021", "los años de la serie sellada son 2019, 2020 y 2021");

  near(med[0].n, 140, 0.005, "PIB nominal 2019 = 140 (recalculado en vivo)");
  near(med[1].n, 214, 0.005, "PIB nominal 2020 = 214 (recalculado en vivo)");
  near(med[2].n, 404, 0.005, "PIB nominal 2021 = 404 (recalculado en vivo)");
  near(med[0].r, 140, 0.005, "PIB real 2019 = 140 (recalculado en vivo)");
  near(med[1].r, 180, 0.005, "PIB real 2020 = 180 (recalculado en vivo)");
  near(med[2].r, 260, 0.005, "PIB real 2021 = 260 (recalculado en vivo)");

  near(med[0].ipc, 100, 0.005, "IPC 2019 = 100 (canasta base)");
  near(med[1].ipc, 119.29, 0.005, "IPC 2020 = 119,29");
  near(med[2].ipc, 151.43, 0.005, "IPC 2021 = 151,43");

  near(med[0].def, 100, 0.005, "deflactor 2019 = 100");
  near(med[1].def, 118.89, 0.005, "deflactor 2020 = 118,89");
  near(med[2].def, 155.38, 0.005, "deflactor 2021 = 155,38");
  near(med[1].growth, 28.57, 0.005, "crecimiento real 2020 = 28,57%");
  near(med[2].growth, 44.44, 0.005, "crecimiento real 2021 = 44,44%");
  near(med[1].infl, 19.29, 0.005, "inflación IPC 2020 = 19,29%");
  near(med[2].infl, 26.95, 0.005, "inflación IPC 2021 = 26,95%");
  ok(Math.abs(med[1].def - med[1].ipc) > 0.3, "deflactor e IPC divergen sin que ninguno esté mal");

  /* ===== 3 · Ayudantía 2 · cuatro bienes ==================================== */
  lab.setMeasurementPreset("class");
  lab.calcMeasurement();
  const ayu = lab.measurement();
  near(ayu[1].ipc, 118.57, 0.005, "Ayudantía 2 · IPC 2020 = 118,57");
  near(ayu[2].ipc, 155.71, 0.005, "Ayudantía 2 · IPC 2021 = 155,71");
  near(ayu[0].n, 140, 0.005, "Ayudantía 2 · PIB nominal 2019 = 140");
  near(ayu[1].n, 214, 0.005, "Ayudantía 2 · PIB nominal 2020 = 214");
  near(ayu[2].n, 404, 0.005, "Ayudantía 2 · PIB nominal 2021 = 404");
  near(ayu[1].r, 180, 0.005, "Ayudantía 2 · PIB real 2020 = 180");
  near(ayu[2].r, 260, 0.005, "Ayudantía 2 · PIB real 2021 = 260");
  near(ayu[1].infl, 18.57, 0.005, "Ayudantía 2 · inflación IPC 2020 = 18,57%");
  near(ayu[2].infl, 31.33, 0.005, "Ayudantía 2 · inflación IPC 2021 = 31,33%");
  // Vuelve al preset sellado para no dejar el laboratorio en otro estado.
  lab.setMeasurementPreset("sealed");
  lab.calcMeasurement();

  /* ===== 4 · BIE-EX-02 ===================================================== */
  const setCross = ({ c0, c1, I, G, T, t, proportional }) => {
    doc.getElementById("propTax").checked = Boolean(proportional);
    doc.getElementById("propTax").dispatchEvent(new w.Event("change", { bubbles: true }));
    lab.setValue("c0", c0); lab.setValue("c1", c1); lab.setValue("inv", I); lab.setValue("gov", G);
    if (T !== undefined) lab.setValue("tax", T);
    if (t !== undefined) lab.setValue("taxRate", t);
    lab.calcCross();
    return lab.cross();
  };

  const bie02 = setCross({ c0: 130, c1: 0.8, I: 700, G: 900, T: 900, proportional: false });
  near(bie02.multiplier, 5, 0.0005, "BIE-EX-02 · multiplicador = 5");
  near(bie02.autonomous, 1010, 0.005, "BIE-EX-02 · gasto autónomo = 1.010");
  near(bie02.Yeq, 5050, 0.005, "BIE-EX-02 · Y* = 5.050");
  near(bie02.disposable, 4150, 0.005, "BIE-EX-02 · ingreso disponible = 4.150");
  near(bie02.consumption, 3450, 0.005, "BIE-EX-02 · consumo C = 3.450");
  near(bie02.privateSaving, 700, 0.005, "BIE-EX-02 · ahorro privado S = 700");
  near(bie02.governmentSaving, 0, 0.005, "BIE-EX-02 · T − G = 0 con presupuesto equilibrado");
  near(bie02.closure, 700, 0.005, "BIE-EX-02 · cierre S privado + (T − G) = 700");
  near(bie02.closure, 700, 0.005, "BIE-EX-02 · el cierre iguala a I = 700");
  ok(Math.abs(bie02.closure - 700) <= 0.005, "BIE-EX-02 · se verifica I = S privado + (T − G)");

  /* ===== 5 · Solemne 1 y régimen proporcional ============================== */
  const sol0 = setCross({ c0: 100, c1: 0.5, I: 250, G: 200, T: 150, proportional: false });
  near(sol0.multiplier, 2, 0.0005, "Solemne 1 · multiplicador = 2 con T fijo");
  near(sol0.Yeq, 950, 0.005, "Solemne 1 · Y* inicial = 950");
  const sol1 = setCross({ c0: 100, c1: 0.5, I: 250, G: 250, T: 150, proportional: false });
  near(sol1.Yeq, 1050, 0.005, "Solemne 1 · Y* = 1.050 tras subir G un 25%");
  near(sol1.Yeq - sol0.Yeq, 100, 0.005, "Solemne 1 · ΔY = 100 con ΔG = 50 y multiplicador 2");

  const prop = setCross({ c0: 100, c1: 0.5, I: 250, G: 200, t: 0.25, proportional: true });
  near(prop.multiplier, 1.6, 0.0005, "Impuesto proporcional · multiplicador = 1,6 con t = 0,25");
  near(prop.autonomous, 550, 0.005, "Impuesto proporcional · gasto autónomo = 550");
  near(prop.Yeq, 880, 0.005, "Impuesto proporcional · Y* = 880");

  /* ===== 6 · Ayudantía 5 · comparación de multiplicadores ================== */
  const ayu5 = setCross({ c0: 180, c1: 0.6, I: 120, G: 250, T: 150, proportional: false });
  near(ayu5.multiplier, 2.5, 0.0005, "Ayudantía 5 · multiplicador = 2,5 con T fijo");
  near(ayu5.Yeq, 1150, 0.005, "Ayudantía 5 · Y* = 1.150");
  const ayu5b = setCross({ c0: 180, c1: 0.6, I: 120, G: 325, T: 150, proportional: false });
  near(ayu5b.Yeq - ayu5.Yeq, 187.5, 0.005, "Ayudantía 5 · ΔY = 187,5 con ΔG = 75 y T fijo");
  const ayu5p = setCross({ c0: 180, c1: 0.6, I: 120, G: 250, t: 0.2, proportional: true });
  near(ayu5p.multiplier, 1.923, 0.001, "Ayudantía 5 · multiplicador ≈ 1,923 con t = 0,2");
  const ayu5p2 = setCross({ c0: 180, c1: 0.6, I: 120, G: 325, t: 0.2, proportional: true });
  near(ayu5p2.Yeq - ayu5p.Yeq, 144.23, 0.01, "Ayudantía 5 · ΔY ≈ 144,23 con el mismo ΔG y t = 0,2");

  /* ===== 11 · Variante isomorfa · shock de inversión ======================= */
  const v0 = setCross({ c0: 120, c1: 0.6, I: 200, G: 180, T: 100, proportional: false });
  near(v0.multiplier, 2.5, 0.0005, "Variante · multiplicador = 2,5");
  near(v0.autonomous, 440, 0.005, "Variante · gasto autónomo = 440");
  near(v0.Yeq, 1100, 0.005, "Variante · Y* = 1.100");
  const v1 = setCross({ c0: 120, c1: 0.6, I: 240, G: 180, T: 100, proportional: false });
  near(v1.Yeq, 1200, 0.005, "Variante · Y* = 1.200 tras subir I un 20%");
  near(v1.Yeq - v0.Yeq, 100, 0.005, "Variante · ΔY = 2,5 × 40 = 100: la estructura no depende del componente");

  /* ===== 7 · Mercado de dinero ============================================= */
  lab.setValue("moneyY", 1000); lab.setValue("moneyMs", 760);
  lab.setValue("moneyD1", 0.8); lab.setValue("moneyD2", 20);
  lab.drawMoney();
  near(lab.moneyInterest(), 2, 0.0005, "Dinero · i = 2% con Y = 1.000 y M/P = 760");
  ok(/i = <strong>2,00%/.test(doc.getElementById("moneyFeedback").innerHTML),
    "Dinero · el laboratorio escribe i = 2,00% en pantalla");
  lab.setValue("moneyY", 1010);
  lab.drawMoney();
  near(lab.moneyInterest(), 2.4, 0.0005, "Dinero · i = 2,4% con Y = 1.010 y M/P fijo en 760");
  lab.setValue("moneyMs", 768);
  lab.drawMoney();
  near(lab.moneyInterest(), 2, 0.0005, "Dinero · M/P = 768 sostiene i = 2% con Y = 1.010");
  const din = lab.results("din");
  near(din.interestRate, 2, 0.0005, "Dinero · la ficha devuelve i = 2%");
  near(din.bondPrice, 98.0392, 0.001, "Dinero · precio del bono que paga 100 con i = 2%");

  /* ===== 8 · Bono y tasa ================================================== */
  //   Se comprueba con el propio verificador del laboratorio, no con una copia.
  const bondRate = pb => (100 / pb - 1) * 100;
  near(bondRate(95.238), 5, 0.005, "Bono · Pᴮ = 95,238 implica i ≈ 5%");
  near(bondRate(96.154), 4, 0.005, "Bono · Pᴮ = 96,154 implica i ≈ 4%");
  lab.setValue("bondRateA", 5); lab.setValue("bondRateB", 4);
  click("#checkBondRates");
  ok(/Correcto/.test(doc.getElementById("bondRateFeedback").textContent),
    "Bono · el laboratorio acepta 5% y 4% como respuestas correctas");
  lab.setValue("bondRateA", 4); lab.setValue("bondRateB", 5);
  click("#checkBondRates");
  ok(!/Correcto/.test(doc.getElementById("bondRateFeedback").textContent),
    "Bono · el laboratorio rechaza las tasas invertidas");
  ok(bondRate(96.154) < bondRate(95.238), "Bono · precio y tasa se mueven en sentido opuesto");

  /* ===== 9 · Mercado laboral ============================================== */
  lab.setValue("employed", 9339296);
  lab.setValue("unemployed", 870239);
  lab.setValue("inactive", 6135006);
  lab.calcLabor();
  const labour = lab.results("lab");
  eq(labour.PA, 10209535, "Laboral · PA calculada = 10.209.535");
  eq(labour.PET, 16344541, "Laboral · PET = 16.344.541");
  near(labour.participation, 62.46, 0.005, "Laboral · tasa de participación = 62,46%");
  near(labour.occupation, 57.14, 0.005, "Laboral · tasa de ocupación = 57,14%");
  near(labour.unemployment, 8.52, 0.005, "Laboral · tasa de desempleo = 8,52%");

  /* ===== 10 · WS–PS · tasa natural ======================================== */
  lab.setValue("markup", 0.1);
  lab.calcWsPs();
  near(lab.results("lab").naturalRate, 9.09, 0.005, "WS–PS · uₙ = 9,09% con m = 0,1");
  near(1 / (1 + 0.1), 0.909, 0.001, "WS–PS · salario real W/P = 1/1,1 ≈ 0,909");
  lab.setValue("markup", 0.2);
  lab.calcWsPs();
  near(lab.results("lab").naturalRate, 16.67, 0.005, "WS–PS · un margen mayor eleva uₙ a 16,67%");
  lab.setValue("markup", 0.1);
  lab.calcWsPs();

  /* ===== Desafío inverso y tabla multianual (verificadores del laboratorio) = */
  lab.setValue("inverseEmployed", 7149840);
  lab.setValue("inverseUnemployment", 4.67);
  click("#checkInverse");
  ok(/Correcto/.test(doc.getElementById("inverseFeedback").textContent),
    "Desafío inverso · ocupadas 7.149.840 y desempleo 4,67% se aceptan");
  lab.setValue("uyGrowth", 0.37);
  lab.setValue("uyInfl", 8.67);
  click("#checkUy");
  ok(/Correcto/.test(doc.getElementById("uyFeedback").textContent),
    "Tabla multianual · crecimiento 0,37% e inflación 8,67% se aceptan");

  /* ===== 12 · Los seis ejercicios dirigidos =============================== */
  const drills = Object.keys(L.BIE_DRILLS);
  eq(drills.length, 6, "el catálogo tiene exactamente seis ejercicios dirigidos");
  const codes = ["BIE-ERR-01", "BIE-ERR-02", "BIE-ERR-03", "BIE-ERR-04", "BIE-ERR-05", "BIE-ERR-06"];
  codes.forEach(code => {
    const id = L.CODE_DRILL[code];
    ok(Boolean(id) && Boolean(L.BIE_DRILLS[id]), `${code} tiene un ejercicio dirigido asignado`);
    const drill = L.BIE_DRILLS[id];
    eq(drill.error, code, `${id} declara ${code} como error que corrige`);
    ok(drill.fields.length >= 2, `${id} pide al menos dos respuestas observables`);
    ok(typeof drill.criterion === "string" && drill.criterion.length > 10, `${id} declara un criterio de éxito observable`);

    // En positivo: las respuestas del propio catálogo cumplen el criterio.
    const good = {};
    drill.fields.forEach(f => { good[f.id] = f.answer; });
    eq(L.drillCheck(id, good).passed, true, `${id} · las respuestas correctas cumplen el criterio`);
    eq(L.drillCheck(id, good).results.every(r => r.ok), true, `${id} · todos los campos se marcan correctos`);

    // En negativo: una respuesta alterada NO puede cumplirlo.
    const bad = {};
    drill.fields.forEach(f => { bad[f.id] = f.kind === "number" ? Number(f.answer) + 1000 : "respuesta que no está en la lista"; });
    eq(L.drillCheck(id, bad).passed, false, `${id} · una respuesta equivocada no cumple el criterio`);
    eq(L.drillCheck(id, {}).passed, false, `${id} · dejarlo en blanco no cumple el criterio`);
  });

  // Cifras concretas de los drills numéricos, que reproducen ejercicios de clase.
  eq(L.drillCheck("BIE-DRILL-TRANSF-01", { g: 1000, tr: 800 }).passed, true,
    "BIE-DRILL-TRANSF-01 · ΔY = 1.000 con gasto público y 800 con transferencia");
  eq(L.drillCheck("BIE-DRILL-TRANSF-01", { g: 1000, tr: 1000 }).passed, false,
    "BIE-DRILL-TRANSF-01 · igualar gasto y transferencia no pasa");
  eq(L.drillCheck("BIE-DRILL-MULT-01", { fixed: 2, prop: 1.6 }).passed, true,
    "BIE-DRILL-MULT-01 · multiplicador 2 con T fijo y 1,6 con t = 0,25");
  eq(L.drillCheck("BIE-DRILL-YD-01", { c: 580, why: "el resultado de usar Y en vez de Yd" }).passed, true,
    "BIE-DRILL-YD-01 · C = 580 y 700 es el resultado de usar Y en lugar de Yd");
  eq(L.drillCheck("BIE-DRILL-YD-01", { c: 700, why: "el consumo correcto" }).passed, false,
    "BIE-DRILL-YD-01 · C = 700 con la justificación equivocada no pasa");
  eq(L.drillCheck("BIE-DRILL-SI-01", { inv: 700, sav: 700 }).passed, true,
    "BIE-DRILL-SI-01 · el cierre 700 = 700 de BIE-EX-02 se verifica");
  eq(L.drillCheck("BIE-DRILL-LABEL-01", { eq1: "identidad", eq2: "conducta", eq3: "condición de equilibrio" }).passed, true,
    "BIE-DRILL-LABEL-01 · identidad, conducta y condición de equilibrio");
  eq(L.drillCheck("BIE-DRILL-INV-01", { link1: "caen los inventarios no planeados", link2: "las empresas elevan la producción" }).passed, true,
    "BIE-DRILL-INV-01 · inventarios no planeados y luego producción");
  eq(L.drillCheck("BIE-DRILL-INV-01", { link1: "las empresas elevan la producción", link2: "caen los inventarios no planeados" }).passed, false,
    "BIE-DRILL-INV-01 · el orden de los eslabones importa");

  /* ===== El contrato de escenario sellado sigue intacto ==================== */
  const source = fs.readFileSync(LAB, "utf8");
  ["MED-EX-02", "MED-MAT-AYU2", "BIE-EX-02", "BIE-EX-Solemne1", "BIE-EX-prop", "BIE-EX-Solemne1-v2",
   "BIE-MAT-AYU5", "DIN-EX-01", "DIN-EX-02", "DIN-MAT-AYU6-C1", "LAB-EX-01", "LAB-EX-02",
   "MED-EX-01", "MED-EX-PNB"].forEach(id =>
    ok(source.includes(`id:"${id}"`), `el id de actividad ${id} sigue en el catálogo, sin renombrar`));
  ok(/schema_version:"macrolab-macro1-scenario\/1\.1"/.test(source), "el contrato de escenario conserva su schema_version");

  /* ---------- resumen ---------- */
  const line = "─".repeat(72);
  console.log(line);
  console.log("test_formulas_selladas.js — recálculo en vivo de las cifras selladas");
  console.log(line);
  if (failures.length) {
    console.log(`\nFallos (${failures.length}):`);
    failures.forEach(f => console.log("  x " + f));
  }
  console.log(`\nAserciones: ${assertions} · fallos: ${failures.length}`);
  console.log(failures.length ? "RESULTADO: FALLA" : "RESULTADO: OK");
  process.exit(failures.length ? 1 : 0);
}

try {
  main();
} catch (err) {
  console.error("Error inesperado durante la prueba:", err && err.stack ? err.stack : err);
  console.log(`\nAserciones ejecutadas antes del error: ${assertions}`);
  process.exit(1);
}
