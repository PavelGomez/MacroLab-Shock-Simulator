#!/usr/bin/env node
"use strict";
/*
 * test_loop_clase3.js — recorrido completo del loop cerrado de la Clase 3 en jsdom.
 *
 * Uso:  node test_loop_clase3.js        (desde publicar/macro1/)
 * Requiere jsdom:  npm install jsdom     (o NODE_PATH apuntando a una instalación)
 *
 * Cubre, en este orden:
 *   1. rechazo del lanzamiento sin predicción;
 *   2. P0.2 · puerta de lanzamiento accesible: atributo, foco, anuncio único, teclado;
 *   3. predicción visible y fija en la tarjeta de contexto del laboratorio;
 *   4. retorno automático de params, results, intentos y cierre;
 *   5. P1.4 · el intento de cierre se conserva con las cifras del alumno;
 *   6. los cinco tipos de discrepancia;
 *   7. P1.1 · error numérico antes que cobertura verbal, sin color de acierto;
 *   8. P2 · prellenado de «qué pensaba al principio» con decisión obligatoria;
 *   9. diagnóstico con evidencia por código, «ninguno» y P1.5 · justificación externa;
 *  10. P1.6 · error estructural con prioridad sobre errores de resultado;
 *  11. campos generados prellenados y editables;
 *  12. asignación del drill según el error confirmado;
 *  13. P1.2 · variante, comparación inicial/revisada y los cuatro campos nuevos;
 *  14. P1.3 · dos cierres con dos rótulos;
 *  15. P1.8 · campos por attempt_id y contexto limpio;
 *  16. P1.7 · importación de la ficha al comenzar y pregunta de recuperación;
 *  17. exportar–importar sin identidad y rechazo de schema_version incorrecto;
 *  18. P2 · borrado del registro, consolidación sin discrepancia, todas las discrepancias.
 *
 * Imprime el número real de aserciones y sale con código 1 si algo falla.
 */

const fs = require("fs");
const path = require("path");

/* ---------- carga de jsdom, con mensaje claro si falta ---------- */
let JSDOM, VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = require("jsdom"));
} catch (_) {
  console.error("Falta la dependencia jsdom. Instálala con:  npm install jsdom");
  console.error("O ejecuta:  NODE_PATH=/ruta/a/node_modules node test_loop_clase3.js");
  process.exit(1);
}

const LAB = path.join(__dirname, "index.html");

/* ---------- contador de aserciones ---------- */
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

/* ---------- arranque del laboratorio en jsdom ----------------------------------
   Dos capacidades que jsdom no implementa y que nada tienen que ver con el
   artefacto se sustituyen por stubs: el contexto 2D de <canvas> y scrollIntoView.
   Cualquier otro error de consola hace fallar la prueba.                          */
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
      win.confirm = () => true;
      win.HTMLAnchorElement.prototype.click = function () {};
    }
  });
  return { dom, window: dom.window, consoleErrors };
}

/* ---------- utilidades de manejo de la interfaz ---------- */
const tick = (ms = 0) => new Promise(r => setTimeout(r, ms));
function q(w, sel) { return w.document.querySelector(sel); }
function field(w, name) { return q(w, `[data-class-field="${name}"]`); }
function setField(w, name, value) {
  let el = field(w, name);
  if (!el) el = [...w.document.querySelectorAll(`[data-class-radio-field="${name}"]`)].find(node => node.value === String(value));
  if (!el) throw new Error(`campo ausente en el DOM: ${name}`);
  if (el.type === "radio") el.checked = true;
  else el.value = String(value);
  el.dispatchEvent(new w.Event("input", { bubbles: true }));
  el.dispatchEvent(new w.Event("change", { bubbles: true }));
  return el;
}
function clickLoop(w, action) {
  const btn = q(w, `[data-loop-action="${action}"]`);
  if (!btn) throw new Error(`botón de loop ausente: ${action}`);
  btn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  return btn;
}
function clickClass(w, action) {
  const btn = q(w, `[data-class-action="${action}"]`);
  if (!btn) throw new Error(`botón de clase ausente: ${action}`);
  btn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  return btn;
}
function stepText(w) { return (q(w, "#classWorkbench .step-number") || {}).textContent || ""; }

// Avanza los dos primeros pasos comunes a las tres clases.
function passReadingAndIndicator(w) {
  q(w, "#classReadCheck").checked = true;
  clickClass(w, "reading");
  setField(w, "consultedAt", "2026-07-28");
  setField(w, "indicatorName", "PIB trimestral, serie desestacionalizada");
  setField(w, "indicatorMeta", "miles de millones de pesos encadenados · trimestral · base 2018");
  setField(w, "evidenceType", "observada");
  setField(w, "indicatorInterpretation", "La serie permite comparar volumen entre trimestres a precios de referencia.");
  clickClass(w, "indicator");
}

// Resuelve el laboratorio de mercado de bienes con un shock de G y vuelve a la ruta.
function solveCrossAndReturn(w, { G, closureI, closureS, skipClosure = false }) {
  const lab = w.MacroLabLoop.lab;
  lab.setValue("gov", G);
  lab.calcCross();
  if (!skipClosure) {
    q(w, "#loopClosureI").value = String(closureI);
    q(w, "#loopClosureS").value = String(closureS);
    q(w, "#loopClosureBtn").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  }
  q(w, "#loopReturnBtn").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
}

/* ============================================================================ */
async function main() {
  const { window: w, consoleErrors } = bootLab();
  const L = w.MacroLabLoop;

  /* --- 0 · carga limpia y estructura invariante ---------------------------- */
  eq(consoleErrors.length, 0, "la carga en jsdom no produce errores de consola");
  ok(typeof L === "object", "la superficie de inspección MacroLabLoop está expuesta");
  eq(w.document.querySelectorAll('#tabs [role="tab"]').length, 6, "siguen siendo seis pestañas");
  L.selectClass("3");
  eq(w.document.querySelectorAll("#classSteps [data-class-step]").length, 6, "siguen siendo seis pasos visibles");
  eq(L.LOOP_ARTIFACT, "macro1/index.html", "el artefacto declarado es la URL estable");
  eq(L.LEARNING_LAB_VERSION, "0.6.5", "la versión del contexto de aprendizaje es 0.6.5");
  eq(L.LEARNING_CONTENT_VERSION, "macro1-notas-2026-08-editorial-map", "la versión de contenido exportada coincide con el manifiesto");

  /* --- 0.1 · UX transversal: guía, umbrales visibles y autocompletado ------- */
  const { window: wUx, consoleErrors: uxConsoleErrors } = bootLab();
  const UX = wUx.MacroLabLoop;
  eq(uxConsoleErrors.length, 0, "la instancia de prueba UX carga sin errores");
  ok(q(wUx, "#routeGuide"), "la ruta ofrece «¿Cómo utilizar MacroLab?» sin abrir una ventana modal");
  ok(/seis|paso a paso/i.test(q(wUx, "#routeGuide").textContent), "la guía explica el recorrido completo");
  UX.selectClass("1");
  q(wUx, "#classReadCheck").checked = true;
  clickClass(wUx, "reading");
  // Simula autocompletado silencioso: el valor visible cambia sin input/change.
  field(wUx, "consultedAt").value = "2026-08-05";
  setField(wUx, "indicatorName", "IMACEC");
  setField(wUx, "indicatorMeta", "variación anual · mensual");
  setField(wUx, "evidenceType", "observada");
  setField(wUx, "indicatorInterpretation", "corta");
  clickClass(wUx, "indicator");
  ok(/Interpretación en una frase/.test(q(wUx, "#classActionStatus").textContent), "el error identifica el campo exacto");
  ok(/15 caracteres; llevas 5/.test(q(wUx, "#classActionStatus").textContent), "el error informa mínimo y avance actual");
  eq(field(wUx, "indicatorInterpretation").getAttribute("aria-invalid"), "true", "el primer campo pendiente queda marcado");
  ok(wUx.document.activeElement === field(wUx, "indicatorInterpretation"), "el foco va al primer campo pendiente");
  setField(wUx, "indicatorInterpretation", "El IMACEC permite describir la evolución mensual de la actividad.");
  clickClass(wUx, "indicator");
  ok(/Paso 3 de 6/.test(stepText(wUx)), "una fecha autocompletada sin eventos se sincroniza al continuar");

  const { window: wNum } = bootLab();
  const NUM = wNum.MacroLabLoop;
  NUM.selectClass("2");
  passReadingAndIndicator(wNum);
  setField(wNum, "bridgeFlow", "flow");setField(wNum, "bridgePib", "territory");setField(wNum, "bridgePnb", "residence");
  clickClass(wNum, "test");
  ok(/Respuesta \(a\)/.test(q(wNum, "#classActionStatus").textContent), "un número vacío ya no se interpreta como cero");
  eq(field(wNum, "answerA").getAttribute("aria-invalid"), "true", "la primera cifra vacía queda marcada");

  /* --- 1 · puerta de entrada de la ruta (P1.7) ----------------------------- */
  ok(q(w, "#routeEntry #entryFresh"), "P1.7 · existe «Comenzar sin registro» en la entrada de la ruta");
  ok(q(w, "#routeEntry #entryFile"), "P1.7 · existe «Continuar con mi ficha» en la entrada de la ruta");
  q(w, "#entryFresh").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ok(q(w, "#routeEntry").hidden, "P1.7 · elegir «comenzar sin registro» retira la puerta de entrada");

  /* --- 2 · pasos 1 y 2 de la rutina ---------------------------------------- */
  L.selectClass("3");
  passReadingAndIndicator(w);
  ok(/Paso 3 de 6/.test(stepText(w)), "la rutina llega al paso 3 (predicción) de la clase 3");
  ok(/La lectura presentó/.test(q(w, ".journey-map").textContent)&&/La ficha te hizo observar/.test(q(w, ".journey-map").textContent)&&/Ahora vas a hacer/.test(q(w, ".journey-map").textContent),
    "v0.6.2 · la Clase 3 explicita lectura, evidencia y tarea siguiente sin atribuir dominio");

  /* --- 3 · rechazo del lanzamiento sin predicción --------------------------- */
  const launch = q(w, '[data-loop-action="launch"]');
  ok(launch, "el paso 3 ofrece el botón de lanzamiento del laboratorio");
  eq(launch.getAttribute("aria-disabled"), "true", "P0.2 · con predicción incompleta el botón declara aria-disabled=true");
  eq(launch.hasAttribute("disabled"), false, "P0.2 · el botón NUNCA lleva el atributo disabled: el teclado siempre lo alcanza");
  eq(L.session(), null, "no hay sesión de laboratorio antes de predecir");
  clickLoop(w, "launch");
  eq(L.session(), null, "el lanzamiento se rechaza si falta la predicción");
  ok(/registra la dirección esperada/i.test(q(w, "#classActionStatus").textContent), "el rechazo explica qué falta");

  /* --- 4 · P0.2 · sincronización del árbol accesible ------------------------ */
  const marker = Symbol("nodo");
  launch[marker] = true;
  setField(w, "predDir", "up");
  eq(q(w, '[data-loop-action="launch"]').getAttribute("aria-disabled"), "true",
    "P0.2 · con dirección pero sin mecanismo el atributo sigue puesto");

  // El foco vive en el campo de mecanismo mientras se escribe: no debe perderse.
  const mech = field(w, "predMech");
  mech.focus();
  q(w, "#classStepAnnounce").textContent = "";
  mech.value = "Al subir G el gasto planeado supera la producción, caen los inventarios no planeados y las empresas elevan producción e ingreso.";
  mech.dispatchEvent(new w.Event("input", { bubbles: true }));

  const afterSync = q(w, '[data-loop-action="launch"]');
  eq(afterSync.hasAttribute("aria-disabled"), false, "P0.2 · al completar dirección y mecanismo el atributo desaparece del DOM");
  ok(afterSync[marker] === true, "P0.2 · es el MISMO nodo: el panel no se volvió a renderizar");
  ok(w.document.activeElement === mech, "P0.2 · el foco permanece en el campo que se estaba escribiendo");
  ok(field(w, "predMech").value.length > 8, "P0.2 · el texto en curso se conserva íntegro");
  const announced = q(w, "#classStepAnnounce").textContent;
  ok(/ya está disponible/i.test(announced), "P0.2 · el cambio se anuncia en la región viva ya existente");

  // Un segundo cambio que mantiene la condición no debe volver a anunciar.
  q(w, "#classStepAnnounce").textContent = "CENTINELA";
  mech.value = mech.value + " Y el consumo vuelve a subir.";
  mech.dispatchEvent(new w.Event("input", { bubbles: true }));
  eq(q(w, "#classStepAnnounce").textContent, "CENTINELA", "P0.2 · el anuncio ocurre una sola vez, no en cada tecla");

  // Y si la predicción se rompe, el atributo vuelve y el anuncio se rearma.
  setField(w, "predDir", "");
  eq(q(w, '[data-loop-action="launch"]').getAttribute("aria-disabled"), "true",
    "P0.2 · si la predicción vuelve a quedar incompleta el atributo se repone");
  setField(w, "predDir", "up");
  eq(q(w, '[data-loop-action="launch"]').hasAttribute("aria-disabled"), false,
    "P0.2 · y se retira otra vez al recomponerla");

  // Magnitud deliberadamente equivocada (300 frente a los 100 que da el modelo) y
  // confianza declarada: el recorrido debe producir una discrepancia de magnitud.
  setField(w, "predMag", "300");
  setField(w, "predConf", "2");

  // Activación por teclado: el botón es un <button> alcanzable y sin bloqueo alguno.
  const gate = q(w, '[data-loop-action="launch"]');
  eq(gate.tagName, "BUTTON", "P0.2 · la puerta es un <button> nativo: Enter y Espacio lo activan");
  eq(gate.disabled, false, "P0.2 · el botón no está deshabilitado para el teclado");
  ok(gate.tabIndex >= 0, "P0.2 · el botón permanece en el orden de tabulación");
  let keyboardActivations = 0;
  gate.addEventListener("click", () => { keyboardActivations += 1; }, { once: true });
  gate.click(); // lo que producen Enter y Espacio sobre un <button> no deshabilitado
  eq(keyboardActivations, 1, "P0.2 · la activación produce el mismo click que el teclado dispara");

  /* --- 5 · predicción fija en la tarjeta de contexto ------------------------ */
  ok(L.session() !== null, "el lanzamiento abre una sesión de laboratorio");
  eq(L.session().activityId, "BIE-EX-Solemne1", "la actividad abierta es la del loop");
  const card = q(w, "#cruzContextCard");
  ok(card && !card.hidden, "la tarjeta de contexto del laboratorio está visible");
  ok(/no editable aquí/.test(card.textContent), "la predicción queda fija, no editable en el laboratorio");
  ok(card.textContent.includes("sube"), "la dirección predicha aparece en la tarjeta de contexto");
  ok(card.textContent.includes("inventarios"), "la frase de mecanismo aparece en la tarjeta de contexto");
  ok(/media/.test(card.textContent), "la confianza declarada aparece en la tarjeta de contexto");
  eq(q(w, "#loopAttemptCount").textContent, "1", "el contador de intentos parte en 1");
  eq(q(w, "#loopVerificationCount").textContent, "0", "los intentos de verificación parten en cero");
  ok(/Escenarios calculados/.test(card.textContent), "el recálculo se rotula como escenario, no como intento humano");

  /* --- 6 · retorno automático: params, results, intentos y cierre ----------- */
  solveCrossAndReturn(w, { G: 250, closureI: 250, closureS: 250 });
  const entry = L.Learning.latest("BIE-EX-Solemne1");
  ok(entry.application.returned_automatically, "el retorno marca returned_automatically");
  near(entry.application.params.G, 250, 0.001, "vuelven los parámetros reales del laboratorio (G)");
  near(entry.application.results.Yeq, 1050, 0.001, "vuelven los resultados reales (Y* = 1.050)");
  near(entry.application.baseline.Yeq, 950, 0.001, "vuelve el equilibrio de referencia (Y* inicial = 950)");
  ok(entry.application.attempts >= 1, "vuelve el número de intentos del laboratorio");
  eq(entry.application.verification_attempts.length, 1, "un clic en verificar produce un intento de verificación");
  eq(entry.application.closure_checked, true, "vuelve el hecho de haber verificado el cierre");
  eq(entry.application.closure_ok, true, "vuelve el resultado de la verificación del cierre");
  eq(field(w, "narInitial") !== null, true, "el retorno deja la ruta en el paso de revisión");

  /* --- 7 · P1.4 · el intento de cierre se conserva -------------------------- */
  const attemptClosure = entry.application.closure_attempt;
  ok(attemptClosure !== null, "P1.4 · closure_attempt existe en la entrada");
  near(attemptClosure.learner_I, 250, 0.001, "P1.4 · se conserva learner_I tal como lo escribió el alumno");
  near(attemptClosure.learner_S_balance, 250, 0.001, "P1.4 · se conserva learner_S_balance");
  eq(attemptClosure.ok, true, "P1.4 · se conserva el resultado de la verificación");
  ok(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(attemptClosure.at), "P1.4 · la marca temporal es local, no UTC");

  /* --- 8 · P2 · prellenado de la respuesta inicial -------------------------- */
  const seeded = field(w, "narInitial").value;
  ok(seeded.length > 0, "P2 · «qué pensaba al principio» viene prellenado");
  ok(seeded.includes("inventarios"), "P2 · el prellenado usa la predicción REAL del alumno");
  ok(field(w, "narInitialCheck") !== null, "P2 · se exige decidir entre confirmar o revisar el prellenado");

  /* --- 9 · P1.1 · error numérico antes que cobertura verbal ----------------- */
  //   El retorno automático deja los cálculos correctos, así que aquí se comprueba
  //   el caso limpio; el caso con cifra incorrecta se prueba abajo con la clase 2.
  ok(q(w, "#classWorkbench .coverage"), "P1.1 · la clase 3 muestra el bloque de cobertura");
  ok(/Cobertura de elementos mencionados/.test(q(w, "#classWorkbench .coverage").textContent),
    "P1.1 · el encabezado dice «Cobertura de elementos mencionados · N de M»");
  ok(!/correctas/i.test(q(w, "#classWorkbench .coverage").textContent), "P1.1 · el conteo no usa la palabra «correctas»");
  ok(field(w, "contradiction") !== null, "P1.1 · la clase 3 pide «¿qué afirmación contradice la pauta?»");

  /* --- 10 · P2 · todas las discrepancias detectadas ------------------------- */
  const factBlock = q(w, "#classWorkbench .loop-fact").textContent;
  ok(/Todas las discrepancias detectadas|No se detectó ninguna discrepancia/.test(factBlock),
    "P2 · se listan todas las discrepancias detectadas, no sólo la dominante");

  /* --- 11 · campos generados prellenados y editables ------------------------ */
  ok(field(w, "narDiscrepancy").value.length > 10, "el enunciado de discrepancia viene generado");
  ok(field(w, "narChain").value.length > 10, "la cadena causal viene generada desde la pauta");
  eq(field(w, "narDiscrepancy").tagName, "TEXTAREA", "el campo generado es editable (textarea)");
  eq(field(w, "narDiscrepancy").hasAttribute("readonly"), false, "el campo generado no está bloqueado");
  setField(w, "narDiscrepancy", field(w, "narDiscrepancy").value + " (editado por el alumno)");
  ok(/editado por el alumno/.test(L.classState()["3"].fields.narDiscrepancy), "la edición del campo generado se conserva");

  /* --- 12 · validaciones de la narrativa ----------------------------------- */
  clickLoop(w, "narrative");
  ok(/Señal para la próxima vez|qué pensabas al principio|prellenado|contradice/i.test(q(w, "#classActionStatus").textContent),
    "la narrativa incompleta se rechaza con un mensaje concreto");
  setField(w, "narCue", "Antes de calcular, comprobaré qué componente autónomo se mueve y cuál es el multiplicador.");
  setField(w, "narInitialCheck", "confirmo");
  clickLoop(w, "narrative");
  ok(/contradice/i.test(q(w, "#classActionStatus").textContent || ""), "P1.1 · sin la pregunta de contradicción no se avanza");
  setField(w, "contradiction", "Dije que el ajuste era inmediato y la pauta exige pasar por inventarios.");
  clickLoop(w, "narrative");
  ok(/Paso 5 de 6/.test(stepText(w)), "con la narrativa completa se avanza al diagnóstico");
  eq(L.Learning.latest("BIE-EX-Solemne1").narrative.contradiction.length > 8, true, "la contradicción queda registrada en la entrada");

  /* --- 13 · P1.5 · evidencia por código ------------------------------------ */
  const entry2 = L.Learning.latest("BIE-EX-Solemne1");
  const proposed = entry2.diagnosis.proposed || [];
  ok(proposed.length >= 1, "el sistema propone al menos un código como hipótesis");
  ok(proposed.every(p => typeof p.evidence === "string" && p.evidence.length > 10),
    "P1.5 · cada código propuesto trae su propia evidencia");
  ok(q(w, "#diagEvidence"), "P1.5 · existe el panel de evidencia del código elegido");
  if (proposed.length) {
    setField(w, "diagChoice", proposed[0].code);
    ok(q(w, "#diagEvidence").textContent.includes(proposed[0].evidence), "P1.5 · el panel carga la evidencia de la orientación elegida sin exponer el código");
  }
  // Un código elegido fuera de la propuesta exige justificación breve.
  const outside = ["BIE-ERR-01", "BIE-ERR-02", "BIE-ERR-03", "BIE-ERR-04", "BIE-ERR-05", "BIE-ERR-06"]
    .find(c => !proposed.some(p => p.code === c));
  setField(w, "diagChoice", outside);
  ok(/no propuso|fuera de la propuesta/i.test(q(w, "#diagEvidence").textContent),
    "P1.5 · un código fuera de la propuesta no hereda evidencia de otro");
  clickLoop(w, "diagnosis");
  ok(/[Jj]ustifica/.test(q(w, "#classActionStatus").textContent), "P1.5 · sin justificación el código externo no se registra");
  setField(w, "diagJustify", "Lo elijo porque confundí la condición de equilibrio con la identidad contable.");
  clickLoop(w, "diagnosis");
  const entry3 = L.Learning.latest("BIE-EX-Solemne1");
  eq(entry3.diagnosis.learner_confirmed_code, outside, "el código elegido fuera de la propuesta se registra tal cual");
  eq(entry3.diagnosis.chosen_outside_proposal, true, "queda marcado que el código salió de la propuesta");
  ok(entry3.diagnosis.evidence_used.includes("confundí"), "P1.5 · la evidencia registrada es la del código elegido, no la del primero");

  /* --- 14 · asignación del drill según el error confirmado ------------------ */
  eq(entry3.training.drill_id, L.CODE_DRILL[outside], "el drill asignado corresponde al código confirmado");
  ok(L.BIE_DRILLS[entry3.training.drill_id], "el drill asignado existe en el catálogo");
  ok(/Paso 6 de 6/.test(stepText(w)), "el diagnóstico desbloquea el paso 6");

  /* --- 15 · P1.3 · dos cierres con dos rótulos ------------------------------ */
  ok(q(w, '[data-loop-action="closePending"]'), "P1.3 · existe «Cerrar sesión con práctica pendiente»");
  eq(q(w, '[data-loop-action="close"]'), null, "P1.3 · «Completar rutina» NO existe antes de lograr la práctica");
  const drill = L.BIE_DRILLS[entry3.training.drill_id];
  drill.fields.forEach(f2 => setField(w, "drillf_" + f2.id, f2.kind === "number" ? (f2.answer + 1000) : "sube el nivel de precios"));
  clickLoop(w, "drill");
  eq(L.Learning.latest("BIE-EX-Solemne1").training.passed, false, "una práctica comprobada puede fallar");
  eq(q(w, '[data-loop-action="close"]'), null, "P1.3 · tras fallar la práctica sigue sin ofrecerse «Completar rutina»");
  clickLoop(w, "closePending");
  eq(L.classState()["3"].completed, false, "P1.3 · cerrar con práctica pendiente NO marca la rutina como completada");
  ok(/pendiente/i.test(q(w, "#classActionStatus").textContent), "P1.3 · el rótulo del cierre dice «práctica pendiente»");
  // Ahora sí, con la práctica lograda.
  drill.fields.forEach(f2 => setField(w, "drillf_" + f2.id, f2.kind === "number" ? f2.answer : f2.answer));
  clickLoop(w, "drill");
  eq(L.Learning.latest("BIE-EX-Solemne1").training.passed, true, "la práctica corregida cumple su criterio");
  ok(q(w, '[data-loop-action="close"]'), "P1.3 · «Completar rutina» aparece sólo con la práctica lograda");
  const loopReport = L.loopStudentReport(L.Learning.latest("BIE-EX-Solemne1"), "rutina_completada");
  ok(/Mi predicción y razonamiento inicial/.test(loopReport) && /Qué ocurrió en el laboratorio/.test(loopReport), "v0.6 · el reporte de clase 3 conserva predicción y discrepancia");
  ok(/Cómo usar este reporte/.test(loopReport) && !/BIE-ERR-|BIE-DRILL/.test(loopReport), "v0.6 · el reporte de clase 3 es accionable y no expone códigos internos");

  /* --- 16 · P1.2 · variante y comparación inicial/revisada ------------------ */
  const detailsOpen = q(w, "#classWorkbench details.alt");
  if (detailsOpen) detailsOpen.open = true;
  setField(w, "v2PredDir", "up");
  setField(w, "v2PredMag", "100");
  setField(w, "v2PredMech", "Sube I, el gasto planeado supera la producción, caen inventarios y sube el ingreso y el consumo.");
  eq(q(w, '[data-loop-action="launchVariant"]').hasAttribute("aria-disabled"), false,
    "P0.2 · la puerta de la variante también sincroniza su atributo");
  clickLoop(w, "launchVariant");
  eq(L.session().activityId, "BIE-EX-Solemne1-v2", "la variante isomorfa abre en el laboratorio");
  const labApi = w.MacroLabLoop.lab;
  labApi.setValue("inv", 240);
  labApi.calcCross();
  q(w, "#loopClosureI").value = "240";
  q(w, "#loopClosureS").value = "240";
  q(w, "#loopClosureBtn").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  q(w, "#loopReturnBtn").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  const parent = L.Learning.latest("BIE-EX-Solemne1");
  const variant = L.Learning.byId(parent.transfer.variant_id);
  ok(variant !== null, "la variante queda enlazada al intento base");
  near(variant.application.baseline.Yeq, 1100, 0.001, "la variante parte de Y* = 1.100");
  near(variant.application.results.Yeq, 1200, 0.001, "la variante llega a Y* = 1.200");
  eq(parent.transfer.completed, true, "la transferencia queda marcada como completada");
  eq("improved" in parent.transfer, false, "P1.2 · el booleano único «improved» ya no existe");
  ok(["mejoro", "sostuvo", "empeoro"].includes(parent.transfer.performance_change), "P1.2 · performance_change toma uno de los tres valores");
  ok([true, false, null].includes(parent.transfer.target_error_resolved), "P1.2 · target_error_resolved es booleano o nulo");
  eq(typeof parent.transfer.optional_dimension_observed, "boolean", "P1.2 · optional_dimension_observed es booleano");
  ok(["no_intentada", "lograda", "incompleta"].includes(parent.transfer.transfer_status), "P1.2 · transfer_status toma uno de los tres valores");
  ok(/Desempeño|Transferencia/.test(q(w, "#classWorkbench").textContent), "P1.2 · la comparación inicial/revisada se muestra al alumno");

  /* --- 17 · P1.2 · 4/4 → 4/4 es «sostuvo», no falta de mejora --------------- */
  const clean = () => ({
    prediction: { direction: "up", magnitude: 100, mechanism: "inventarios", confidence: 2 },
    discrepancy: { kind: "none", detected: [] },
    training: { passed: true }, transfer: {}, diagnosis: {}
  });
  const before4 = clean(), after4 = clean();
  after4.attempt_id = "local-variante";
  eq(L.attemptDimensions(before4).clean, 4, "P1.2 · un intento sin discrepancias puntúa 4 de 4 dimensiones observadas");
  eq(L.attemptDimensions(before4).total, 4, "P1.2 · con magnitud registrada se observan las cuatro dimensiones");
  const t44 = L.evaluateTransfer(before4, after4);
  eq(t44.performance_change, "sostuvo", "P1.2 · 4/4 → 4/4 se clasifica «sostuvo», no «todavía no mejora»");
  eq(t44.optional_dimension_observed, true, "P1.2 · la magnitud registrada se marca como dimensión observada");

  // Una magnitud omitida NO cuenta como dimensión sin discrepancia.
  const noMag = clean();
  noMag.prediction.magnitude = null;
  eq(L.attemptDimensions(noMag).total, 3, "P1.2 · una magnitud omitida sale del recuento de dimensiones");
  eq(L.evaluateTransfer(before4, noMag).optional_dimension_observed, false,
    "P1.2 · la magnitud omitida se marca en optional_dimension_observed:false");

  // «Provisionalmente resuelto» exige práctica lograda Y error objetivo ausente.
  const st = (passed, completed, resolved) => L.loopStatus({
    training: { passed }, transfer: { completed, target_error_resolved: resolved }, diagnosis: {}
  });
  eq(st(true, true, true), "provisionally_resolved", "P1.2 · práctica lograda + error objetivo ausente ⇒ provisionalmente resuelto");
  eq(st(true, true, false), "practicing", "P1.2 · si el error objetivo reaparece NO se declara resuelto");
  eq(st(false, true, true), "practicing", "P1.2 · sin práctica lograda tampoco se declara resuelto");
  eq(st(null, false, null), "open", "P1.2 · sin práctica ni transferencia el error queda abierto");
  ok(!["dominado", "mastered"].includes(st(true, true, true)), "nunca se declara «dominado»");

  /* --- 18 · los cinco tipos de discrepancia -------------------------------- */
  const baseApp = (params, results, closureChecked, closureOk) => ({
    activity_id: "BIE-EX-Solemne1",
    prediction: { direction: "up", magnitude: 100, mechanism: "caen los inventarios no planeados", confidence: 2 },
    application: {
      params, results, closure_checked: closureChecked, closure_ok: closureOk,
      baseline: { Yeq: 950, params: { c0: 100, c1: 0.5, I: 250, G: 200, T: 150, t: 0.25, taxMode: "fixed" } }
    }
  });
  const okParams = { c0: 100, c1: 0.5, I: 250, G: 250, T: 150, t: 0.25, taxMode: "fixed" };
  const okRes = { Yeq: 1050, multiplier: 2, autonomous: 525, consumption: 550, disposable: 900, privateSaving: 350, governmentSaving: -100, closure: 250 };

  const dNone = L.computeDiscrepancy(baseApp(okParams, okRes, true, true));
  eq(dNone.kind, "none", "discrepancia 1/5 · «none» cuando todo concuerda");
  const eDir = baseApp(okParams, okRes, true, true); eDir.prediction.direction = "down";
  eq(L.computeDiscrepancy(eDir).kind, "direction", "discrepancia 2/5 · «direction» con el signo invertido");
  const eMag = baseApp(okParams, okRes, true, true); eMag.prediction.magnitude = 300;
  eq(L.computeDiscrepancy(eMag).kind, "magnitude", "discrepancia 3/5 · «magnitude» con desviación mayor al 10%");
  const eClo = baseApp(okParams, okRes, false, false);
  eq(L.computeDiscrepancy(eClo).kind, "closure", "discrepancia 4/5 · «closure» sin verificación válida del cierre");
  const eMec = baseApp(okParams, okRes, true, true); eMec.prediction.mechanism = "sube y ya";
  eq(L.computeDiscrepancy(eMec).kind, "mechanism", "discrepancia 5/5 · «mechanism» sin señales de mecanismo");
  ok(dNone.statement.length > 20, "la discrepancia se acompaña de un enunciado con cifras");
  ok(Array.isArray(dNone.detected), "la discrepancia lista todas las dimensiones detectadas");

  /* --- 19 · P1.6 · error estructural con prioridad -------------------------- */
  //   El shock esperado (G) no se mueve y en cambio se mueve T: evidencia directa de
  //   clasificación fiscal incorrecta. Debe ocupar uno de los dos lugares, el primero.
  const misuseParams = { c0: 100, c1: 0.5, I: 250, G: 200, T: 50, t: 0.25, taxMode: "fixed" };
  const misuseEntry = baseApp(misuseParams, { ...okRes, Yeq: 1000 }, true, true);
  misuseEntry.prediction.magnitude = 300;                       // fuerza discrepancia de magnitud
  misuseEntry.discrepancy = L.computeDiscrepancy(misuseEntry);
  const props = L.proposeDiagnosis(misuseEntry);
  ok(props.length <= 2, "P1.6 · las propuestas siguen limitadas a dos");
  eq(props[0].code, "BIE-ERR-02", "P1.6 · el error estructural BIE-ERR-02 ocupa el PRIMER lugar");
  eq(props[0].layer, "structural", "P1.6 · el código estructural se marca como tal");
  ok(props.slice(1).every(p => p.layer === "result"), "P1.6 · los códigos de resultado quedan detrás");
  ok(props[0].evidence.includes("estructural"), "P1.6 · la evidencia nombra el carácter estructural del error");

  /* --- 20 · P1.8 · campos por attempt_id ----------------------------------- */
  const idPrimero = L.Learning.latest("BIE-EX-Solemne1").attempt_id;
  const narrativaPrimera = L.classState()["3"].fields.narInitial;
  ok(narrativaPrimera && narrativaPrimera.length > 10, "el primer intento tiene narrativa registrada");
  L.selectClass("3");
  L.unlockClassStep(2);
  setField(w, "predDir", "up");
  setField(w, "predMech", "Segundo intento: caen los inventarios no planeados y sube la producción.");
  clickLoop(w, "launch");
  const idSegundo = L.Learning.latest("BIE-EX-Solemne1").attempt_id;
  ok(idSegundo !== idPrimero, "P1.8 · un intento nuevo genera un attempt_id nuevo");
  ok(L.fieldsFor(idPrimero) !== null, "P1.8 · los campos del intento anterior quedan archivados bajo su attempt_id");
  eq(L.fieldsFor(idPrimero).narInitial, narrativaPrimera, "P1.8 · el archivo conserva la narrativa del intento anterior");
  eq(L.classState()["3"].fields.narInitial, undefined, "P1.8 · el intento nuevo abre con contexto limpio, sin heredar narrativa");
  eq(L.classState()["3"].fields.diagChoice, undefined, "P1.8 · tampoco hereda el diagnóstico anterior");
  solveCrossAndReturn(w, { G: 250, closureI: 250, closureS: 250 });
  ok(q(w, '[data-loop-action="useReference"]'), "P1.8 · se ofrece explícitamente «usar como referencia la regla anterior»");
  const cadenaAntes = field(w, "narChain").value;
  clickLoop(w, "useReference");
  ok(field(w, "narChain").value.length > cadenaAntes.length, "P1.8 · la regla anterior sólo se copia cuando el alumno la pide");
  ok(/Referencia del intento anterior/.test(field(w, "narChain").value), "P1.8 · la referencia se marca como tal, no se disfraza de propia");
  // Se cierra la narrativa del segundo intento: deja un error abierto con señal futura,
  // que es lo que la memoria importada tendrá que recuperar más abajo (P1.7).
  setField(w, "narCue", "Antes de calcular, comprobaré qué componente autónomo se mueve y cuál es el multiplicador que corresponde.");
  setField(w, "narInitialCheck", "reviso");
  setField(w, "narInitial", "Revisión: creí que el multiplicador era mayor y por eso predije una magnitud de 300.");
  setField(w, "contradiction", "Afirmé una magnitud de 300 cuando el multiplicador de la pauta la fija en 100.");
  clickLoop(w, "narrative");
  eq(L.Learning.latest("BIE-EX-Solemne1").narrative.future_cue.length > 20, true, "P1.8 · la señal futura del segundo intento queda en SU entrada");
  eq(L.Learning.latest("BIE-EX-Solemne1").status, "open", "P1.8 · el segundo intento arranca con su propio estado, no hereda el del primero");

  /* --- 21 · exportar e importar sin identidad ------------------------------ */
  const payload = L.Learning.toObject();
  eq(payload.schema_version, L.LEARNING_SCHEMA, "la ficha exportada declara el schema_version del contrato");
  eq(payload.artifact, "macro1/index.html", "la ficha exportada apunta a la URL estable");
  ok(Array.isArray(payload.entries) && payload.entries.length >= 2, "la ficha exportada contiene las entradas de la sesión");
  const flat = JSON.stringify(payload).toLowerCase();
  const identityKeys = ["nombre", '"name"', "rut", "email", "correo", "student_id", "alumno_id", "matricula", "apellido", "user_id"];
  identityKeys.forEach(k => ok(!flat.includes(k), `la ficha exportada no contiene el campo de identidad ${k}`));
  const roundtrip = L.importLearningRecordText(JSON.stringify(payload));
  eq(roundtrip.ok, true, "la ficha exportada se vuelve a importar sin pérdida");
  eq(roundtrip.count, payload.entries.length, "la importación recupera todas las entradas");
  const legacy = JSON.parse(JSON.stringify(payload));
  legacy.lab_version = "0.5.1";
  legacy.entries.forEach(e => { if (e.application) delete e.application.verification_attempts; });
  eq(L.importLearningRecordText(JSON.stringify(legacy)).ok, true, "una ficha v0.5.1 sin historial de verificaciones sigue siendo legible");
  ok(L.Learning.all().every(e => !e.application || Array.isArray(e.application.verification_attempts)), "la importación normaliza el historial faltante");

  /* --- 22 · rechazo de schema_version incorrecto --------------------------- */
  const bad = JSON.parse(JSON.stringify(payload));
  bad.schema_version = "macrolab-learning-context/0.1";
  const badResult = L.importLearningRecordText(JSON.stringify(bad));
  eq(badResult.ok, false, "una ficha con schema_version distinto se rechaza");
  ok(/schema_version/.test(badResult.error), "el rechazo nombra el schema_version que no coincide");
  ok(/No se importó nada/.test(badResult.error), "el rechazo declara que no se importó nada");
  const badEntry = JSON.parse(JSON.stringify(payload));
  badEntry.entries[0].schema_version = "otro/9.9";
  eq(L.importLearningRecordText(JSON.stringify(badEntry)).ok, false, "una entrada con schema_version distinto también se rechaza");
  eq(L.importLearningRecordText("{no es json").ok, false, "un archivo que no es JSON se rechaza con mensaje propio");
  eq(L.importLearningRecordText(JSON.stringify({ schema_version: L.LEARNING_SCHEMA })).ok, false,
    "una ficha sin lista «entries» se rechaza");

  /* --- 23 · P1.7 · importar la ficha ANTES de comenzar ---------------------- */
  const { window: w2 } = bootLab();
  const L2 = w2.MacroLabLoop;
  const ficha = JSON.stringify(payload);
  const input = q(w2, "#entryFile");
  ok(input !== null, "P1.7 · la carga de la ficha está disponible en la entrada, no sólo en el paso 6");
  const file = new w2.File([ficha], "MacroLab_Clase3_registro.json", { type: "application/json" });
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  input.dispatchEvent(new w2.Event("change", { bubbles: true }));
  await tick(60);
  eq(L2.Learning.all().length, payload.entries.length, "P1.7 · la importación al entrar carga la memoria completa");
  const gateHtml = q(w2, "#routeEntry").innerHTML;
  ok(/memoria de aprendizaje, recuperada/i.test(gateHtml), "P1.7 · la importación reconstruye una VISTA de memoria");
  ok(/Actividad sugerida|Empieza por la actividad/i.test(gateHtml), "P1.7 · la vista de memoria sugiere la actividad siguiente");
  ok(/No se restauró ningún control/i.test(gateHtml), "P1.7 · se declara que los controles NO se restauran");
  eq(L2.classState()["3"].step, 0, "P1.7 · la importación no restaura el paso de una sesión caducada");
  eq(L2.classState()["3"].unlocked, 0, "P1.7 · la importación no restaura los desbloqueos");
  eq(Object.keys(L2.classState()["3"].fields).length, 0, "P1.7 · la importación no restaura los campos");
  // Pregunta de recuperación con el texto real del alumno.
  q(w2, "#entryContinue").dispatchEvent(new w2.MouseEvent("click", { bubbles: true }));
  const recall = q(w2, "#classWorkbench .memory-recall");
  ok(recall !== null, "P1.7 · al entrar a la clase aparece la pregunta de recuperación");
  ok(/La última vez registraste/.test(recall.textContent), "P1.7 · la pregunta cita literalmente lo que el alumno escribió");
  ok(/¿Qué buscarás antes de calcular hoy\?/.test(recall.textContent), "P1.7 · la pregunta de recuperación es la del encargo");
  ok(recall.textContent.includes("comprobaré qué componente autónomo"), "P1.7 · el texto citado es la señal futura real del alumno");

  /* --- 24 · diagnóstico guiado y reporte legible en clases 1 y 2 ------------ */
  const { window: w3 } = bootLab();
  const L3 = w3.MacroLabLoop;
  q(w3, "#entryFresh").dispatchEvent(new w3.MouseEvent("click", { bubbles: true }));
  // La portada separa funciones editoriales y ubica al alumno en el horizonte.
  ok(q(w3, ".course-horizon")&&q(w3, ".horizon-stop.current"), "v0.6.4 · cada clase muestra la ubicación del alumno");
  ok(q(w3, ".prep-sequence").querySelectorAll(".prep-group").length===4, "v0.6.4 · la preparación se divide en enganche, teoría, operación y consulta");
  ok(/Crónica de apertura/.test(q(w3, ".prep-sequence").textContent)&&/Notas de Estudio clave/.test(q(w3, ".prep-sequence").textContent)&&/Guías y actividades/.test(q(w3, ".prep-sequence").textContent), "v0.6.4 · las naturalezas de las lecturas no aparecen mezcladas");
  ok(q(w3, "#globalEditorialMap")&&q(w3, "#globalEditorialMap").querySelectorAll(".editorial-map-cell").length===20, "v0.6.5 · la ruta muestra una matriz global de tres clases y cuatro estaciones");
  ok(/Mapa global de Macro 1/.test(q(w3, "#globalEditorialMap").textContent)&&/Enganche/.test(q(w3, "#globalEditorialMap").textContent)&&/Desafío/.test(q(w3, "#globalEditorialMap").textContent), "v0.6.5 · la arquitectura común es visible antes de elegir una clase");
  eq(q(w3, ".editorial-map-grid").getAttribute("role"), "table", "v0.6.5 · el mapa global expone semántica de tabla");
  eq(q(w3, ".horizon-stop.current").getAttribute("aria-current"), "step", "v0.6.5 · la ubicación actual también se comunica sin depender del CSS");
  const chronicle3=fs.readFileSync(path.join(__dirname,"notas","cronica-clase3-chile-2026.html"),"utf8");
  ok(/inventario final cayó de diez a dos/.test(chronicle3)&&/reducción no planeada de ocho/.test(chronicle3), "v0.6.5 · la crónica mantiene consistente producción, ventas e inventario");
  ok(!/Ahorro e importaciones, entre otras fugas/.test(chronicle3), "v0.6.5 · la crónica no mezcla economía abierta con el desafío cerrado inmediato");
  L3.selectClass("2");
  passReadingAndIndicator(w3);
  ok(/Nota 3 introdujo PIB, PNB y PNF/.test(q(w3, ".journey-map").textContent)&&/La ficha precisó/.test(q(w3, ".journey-map").textContent),
    "v0.6.4 · la transición de Clase 2 identifica teoría y ficha como antecedentes distintos");
  const tankFigure=q(w3, ".tank-figure");
  ok(tankFigure&&tankFigure.querySelector('svg[role="img"] title')&&tankFigure.querySelector('svg[role="img"] desc'), "v0.6.4 · el tanque vive en Clase 2 y mantiene accesibilidad");
  setField(w3, "bridgeFlow", "flow");setField(w3, "bridgePib", "territory");setField(w3, "bridgePnb", "residence");
  // 5,06 es el crecimiento NOMINAL; el real es 2,00. La respuesta menciona los
  // elementos correctos (canasta, consumo, deflactor) pero la cifra está mal.
  setField(w3, "answerA", "5.06");
  setField(w3, "answerB", "103");
  setField(w3, "answerC", "192");
  setField(w3, "testMechanism", "El deflactor es un índice de la producción interna y el IPC sigue una canasta de consumo. El PNF es un flujo de ingresos, no el stock acumulado de inversión. El PIB usa territorio y el PNB residencia.");
  clickClass(w3, "test");
  const numericBlock = q(w3, "#numericError");
  ok(numericBlock !== null, "P1.1 · una respuesta con cálculo incorrecto muestra un bloque de error numérico");
  ok(numericBlock.classList.contains("notice") && numericBlock.classList.contains("error"),
    "P1.1 · el bloque destacado usa la clase .notice.error");
  ok(/5,06/.test(numericBlock.textContent) && /2,00/.test(numericBlock.textContent),
    "P1.1 · el bloque muestra las cifras: la escrita y la de la pauta");
  const comparison = q(w3, "#classWorkbench .answer-compare");
  ok(comparison !== null && comparison.querySelectorAll(".answer-box").length === 2,
    "v0.6 · la respuesta del alumno y la pauta aparecen en dos cajas comparables");
  ok(numericBlock.compareDocumentPosition(comparison) & w3.Node.DOCUMENT_POSITION_FOLLOWING,
    "v0.6 · el error numérico aparece antes de la comparación textual");
  ok(/Lo que el sistema puede observar/.test(q(w3, ".diagnostic-observations").textContent),
    "v0.6 · las señales se presentan como observaciones y no como puntaje de palabras");
  const report2 = L3.scoreClassTest();
  eq(L3.splitChecks(report2).numeric.length, 3, "v0.6.4 · crecimiento, deflactor y PNB se clasifican como verificables");
  ok(L3.splitChecks(report2).verbal.length >= 4, "v0.6.4 · las señales verbales cubren precios y PIB–PNB–PNF");
  // El paso 4 pide un foco comprensible y el 5 una pregunta discriminante.
  clickClass(w3, "feedback");
  ok(/Primer foco de revisión/i.test(q(w3, "#classActionStatus").textContent), "v0.6 · sin foco de revisión no se avanza");
  setField(w3, "revisionFocus", "calculation");
  clickClass(w3, "feedback");
  ok(/Paso 5 de 6/.test(stepText(w3)), "v0.6 · el foco permite llegar a la comprobación diagnóstica");
  ok(/hipótesis, no veredictos/i.test(q(w3, "#classWorkbench").textContent), "v0.6 · la interfaz declara incertidumbre diagnóstica");
  ok(!/C2-Q-|MED-ERR/.test(q(w3, "#classWorkbench").textContent), "v0.6 · los códigos internos no son visibles");
  setField(w3, "diagnosticProbe", "C2-Q-INDEX-RATE");
  clickClass(w3, "error");
  ok(/Paso 6 de 6/.test(stepText(w3)), "v0.6 · la respuesta diagnóstica asigna una práctica coherente");
  setField(w3, "guided_a", "above");setField(w3, "guided_b", "previous");
  setField(w3, "revisedA", "2");setField(w3, "revisedB", "103");setField(w3, "revisedC", "192");
  setField(w3, "revisedAnswer", "El deflactor es un índice de la producción interna; el IPC usa una canasta y la inflación es una tasa entre períodos. El PIB usa territorio y el PNB residencia. El PNF es un flujo de ingresos del período, no el stock acumulado de inversión extranjera.");
  clickClass(w3, "guidedCheck");
  ok(/Criterio cumplido/.test(q(w3, "#guidedPracticeStatus").textContent), "v0.6 · la práctica se decide por evidencia observable");
  ok(q(w3, '[data-class-action="export"]')&&/reporte/.test(q(w3, '[data-class-action="export"]').textContent), "v0.6 · la salida principal es un reporte legible");
  ok(/Respaldo técnico opcional/.test(q(w3, "#classWorkbench").textContent), "v0.6 · el JSON queda explícitamente como respaldo opcional");

  // La Clase 1 se concentra ahora en lectura de evidencia y causalidad.
  L3.selectClass("1");
  passReadingAndIndicator(w3);
  ok(/pasaporte del dato/i.test(q(w3, "#classWorkbench").textContent)&&q(w3, ".data-passport").children.length===5, "v0.6.4 · Clase 1 usa un objeto memorable con cinco casillas");
  ok(!/PNB|PNF|territorio económico/.test(q(w3, "#classWorkbench").textContent), "v0.6.4 · el desafío PIB–PNB–PNF ya no se anticipa en Clase 1");
  setField(w3, "bridgeEvidence", "projection");setField(w3, "bridgeClaim", "scenario");
  setField(w3, "testProse", "La afirmación no se sostiene. El 2% es una proyección del IPoM para 2026 y todavía no es un resultado observado. La fuente describe un escenario; no demuestra una causa. Para atribuirla a una política se necesita un mecanismo y evidencia adicional.");
  clickClass(w3, "test");
  ok(q(w3, ".numeric-first") !== null, "v0.6.4 · la clase 1 muestra las dos decisiones conceptuales verificables");
  ok(q(w3, ".answer-box.student") && q(w3, ".answer-box.reference"), "v0.6 · la clase 1 también compara respuesta y pauta");
  ok(/Reconociste que el 2% pertenece a una proyección/.test(q(w3, ".diagnostic-observations").textContent), "v0.6.4 · se reconoce la lectura correcta del estado de la cifra");
  setField(w3, "revisionFocus", "scope");clickClass(w3, "feedback");
  setField(w3, "diagnosticProbe", "__none__");clickClass(w3, "error");
  ok(/Sin diagnóstico forzado/.test(q(w3, "#classWorkbench").textContent), "v0.6 · «ninguna» no obliga a elegir una categoría falsa");
  ok(/Vuelve a responder la afirmación sobre el 2% proyectado/.test(q(w3, "#classWorkbench").textContent), "v0.6.4 · la reescritura identifica la pregunta original");
  eq(L3.classState()["1"].fields.errorCode, "", "v0.6 · el respaldo registra diagnóstico nulo cuando ninguna opción corresponde");
  setField(w3, "guided_a", "projection");setField(w3, "guided_b", "passport");setField(w3, "guided_c", "scenario");setField(w3, "guided_d", "mechanism");
  setField(w3, "revisedAnswer", "El 2% es una proyección del IPoM para el período 2026 y todavía no es un resultado observado. La fuente presenta un escenario. No demuestra qué política causó el crecimiento: para sostener una causa se necesita un mecanismo y evidencia adicional que contraste otras explicaciones.");
  clickClass(w3, "guidedCheck");
  ok(/Comprobaciones guiadas cumplidas/.test(q(w3, "#guidedPracticeStatus").textContent), "v0.6.1 · el cierre distingue comprobación guiada de revisión docente");
  const studentReport = L3.guidedStudentReport(L3.classState()["1"], "rutina_completada");
  ok(/Mi respuesta inicial/.test(studentReport) && /Pauta de contraste/.test(studentReport), "v0.6 · el reporte contiene respuesta inicial y pauta");
  ok(/Orientación/.test(studentReport) && /Práctica y criterio/.test(studentReport), "v0.6 · el reporte traduce el diagnóstico en práctica");
  ok(/Cómo usar este reporte/.test(studentReport) && /window\.print/.test(studentReport), "v0.6 · el reporte explica su uso y permite imprimir o guardar PDF");
  ok(!/C1-Q-|C1-DRILL/.test(studentReport), "v0.6 · el reporte estudiantil no expone códigos internos");

  /* --- 25 · P2 · consolidación sin discrepancia ----------------------------- */
  const { window: w4 } = bootLab();
  const L4 = w4.MacroLabLoop;
  q(w4, "#entryFresh").dispatchEvent(new w4.MouseEvent("click", { bubbles: true }));
  L4.selectClass("3");
  passReadingAndIndicator(w4);
  setField(w4, "predDir", "up");
  setField(w4, "predMag", "100");
  setField(w4, "predMech", "Al subir G caen los inventarios no planeados, sube la producción, sube el ingreso y con él el consumo.");
  clickLoop(w4, "launch");
  solveCrossAndReturn(w4, { G: 250, closureI: 250, closureS: 250 });
  const perfecto = L4.Learning.latest("BIE-EX-Solemne1");
  eq(perfecto.discrepancy.kind, "none", "P2 · el recorrido sin errores no produce discrepancia");
  setField(w4, "narCue", "Comprobaré siempre qué componente autónomo se mueve antes de aplicar el multiplicador.");
  setField(w4, "narInitialCheck", "confirmo");
  setField(w4, "contradiction", "Ninguna: la respuesta coincide con la pauta en todas las dimensiones.");
  clickLoop(w4, "narrative");
  eq(q(w4, '[data-class-field="diagChoice"]'), null, "P2 · sin discrepancia no se obliga a elegir un código");
  ok(q(w4, '[data-class-field="consolidation"]'), "P2 · sin discrepancia se abre una reflexión de consolidación");
  clickLoop(w4, "diagnosis");
  ok(/Reflexión de consolidación/i.test(q(w4, "#classActionStatus").textContent), "P2 · la consolidación identifica la reflexión pendiente");
  setField(w4, "consolidation", "Escribí el mecanismo completo antes de mirar el resultado y eso me obligó a revisar el multiplicador.");
  clickLoop(w4, "diagnosis");
  eq(L4.Learning.latest("BIE-EX-Solemne1").narrative.consolidation.length > 20, true, "P2 · la consolidación queda registrada");
  eq(L4.Learning.latest("BIE-EX-Solemne1").training.drill_id, null, "P2 · sin discrepancia no se asigna práctica correctiva");

  /* --- 26 · P2 · borrar el registro restablece la clase -------------------- */
  L4.selectClass("3");
  ok(L4.classState()["3"].unlocked > 0, "antes de borrar hay pasos desbloqueados");
  w4.MacroLabLoop.handleLoopAction("record");
  q(w4, "#recordClear").dispatchEvent(new w4.MouseEvent("click", { bubbles: true }));
  eq(L4.Learning.all().length, 0, "P2 · el borrado vacía el registro");
  eq(L4.classState()["3"].step, 0, "P2 · el borrado restablece el paso a 1 de 6");
  eq(L4.classState()["3"].unlocked, 0, "P2 · el borrado restablece los desbloqueos");
  eq(L4.classState()["3"].completed, false, "P2 · el borrado restablece el estado de clase");
  eq(Object.keys(L4.classState()["3"].fields).length, 0, "P2 · el borrado vacía los campos de la clase");
  eq(L4.session(), null, "P2 · el borrado cierra cualquier sesión de laboratorio abierta");

  /* --- 27 · privacidad y contratos sellados intactos ------------------------ */
  const source = fs.readFileSync(LAB, "utf8");
  // Se busca uso real (acceso a miembro), no la palabra dentro de un comentario.
  ok(!/\b(localStorage|sessionStorage|indexedDB)\s*[.[]/.test(source), "no se usa almacenamiento del navegador");
  ok(!/[^.\w]fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|WebSocket/.test(source), "no hay backend ni telemetría");
  ok(/macrolab-macro1-scenario\/1\.1/.test(source), "el contrato de escenario sellado conserva su schema_version");
  ok(/library_version:a\.library/.test(source), "library_version sigue viniendo del catálogo de actividades");
  ["modelKey", "shockKey", "regime", "circuit_id"].forEach(k =>
    ok(source.includes(k + ":"), `el contrato de escenario conserva ${k}`));
  eq(L.LEARNING_SCHEMA, "macrolab-learning-context/0.2", "el contrato del contexto de aprendizaje conserva su versión");

  /* ---------- resumen ---------- */
  const line = "─".repeat(72);
  console.log(line);
  console.log("test_loop_clase3.js — recorrido del loop cerrado de la Clase 3 (jsdom)");
  console.log(line);
  if (failures.length) {
    console.log(`\nFallos (${failures.length}):`);
    failures.forEach(f => console.log("  x " + f));
  }
  console.log(`\nAserciones: ${assertions} · fallos: ${failures.length}`);
  console.log(failures.length ? "RESULTADO: FALLA" : "RESULTADO: OK");
  process.exit(failures.length ? 1 : 0);
}

main().catch(err => {
  console.error("Error inesperado durante la prueba:", err && err.stack ? err.stack : err);
  console.log(`\nAserciones ejecutadas antes del error: ${assertions}`);
  process.exit(1);
});
