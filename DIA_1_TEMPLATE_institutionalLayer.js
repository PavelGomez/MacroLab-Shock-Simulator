/* ========== TEMPLATE: institutionalLayer ========== */
// Template anotado para construir la capa institucional de una crónica.
// Para fusionar a cronicas-registry.es-ES.js como campo institutionalLayer.
// Límites de caracteres: obligatorios. Ver DIA_1_institutionalLayer_schema.json.

var INST_LAYER_template = {

  // ── institution ──────────────────────────────────────────────────────────
  // Límite: 150 caracteres.
  // Qué incluir: régimen específico, organismo, regla operativa o contexto
  //   institucional VIGENTE durante el episodio. NO descripción genérica del país.
  // Ejemplo bueno: "Caja de conversión 1991–2001: paridad 1:1 por ley; BC sin
  //   política monetaria autónoma; reservas respaldaban 100% la base monetaria."
  // Ejemplo malo: "Argentina es un país de América del Sur con banco central."
  institution: "[ ESCRIBIR AQUÍ — máx 150 caracteres ]",

  // ── mechanism ────────────────────────────────────────────────────────────
  // Límite: 300 caracteres.
  // Qué incluir: cadena causal completa en formato implícito:
  //   shock → variable → institución → credibilidad → expectativas.
  // REGLA CRÍTICA: TODOS los strings de affectedVariables deben aparecer
  //   literalmente (copia exacta) dentro de este campo.
  mechanism: "[ ESCRIBIR AQUÍ — máx 300 caracteres. Incluir literalmente cada variable de affectedVariables ]",

  // ── affectedVariables ────────────────────────────────────────────────────
  // Exactamente 5 elementos. Cada string DEBE aparecer literalmente en mechanism.
  // Verificar manualmente antes de entregar.
  affectedVariables: [
    "[ variable 1 ]",
    "[ variable 2 ]",
    "[ variable 3 ]",
    "[ variable 4 ]",
    "[ variable 5 ]"
  ],

  // ── feedbackLoop ─────────────────────────────────────────────────────────
  // Límite: 200 caracteres.
  // Qué incluir: cómo el mecanismo se retroalimenta (refuerzo o amortiguación).
  //   Debe conectar con mechanism usando causa → efecto → causa.
  feedbackLoop: "[ ESCRIBIR AQUÍ — máx 200 caracteres ]",

  // ── policyFeasibility ────────────────────────────────────────────────────
  // Límite: 200 caracteres.
  // Qué incluir: qué políticas eran/no eran viables dado el marco institucional.
  //   Restricciones ESPECÍFICAS al episodio; no generalizaciones.
  policyFeasibility: "[ ESCRIBIR AQUÍ — máx 200 caracteres ]",

  // ── incidence ────────────────────────────────────────────────────────────
  // Límite: 150 caracteres.
  // Qué incluir: sobre quiénes recae el ajuste. Lenguaje de dirección e
  //   intensidad RELATIVA. PROHIBIDAS las cifras duras (van en discriminatingEvidence).
  incidence: "[ ESCRIBIR AQUÍ — máx 150 caracteres. Sin cifras duras ]",

  // ── discriminatingEvidence ───────────────────────────────────────────────
  // Límite: 250 caracteres.
  // Qué incluir: evidencia que distingue este episodio: números verificables,
  //   fechas precisas, fuentes citables. Mínimo 2 cifras y 1 fecha.
  discriminatingEvidence: "[ ESCRIBIR AQUÍ — máx 250 caracteres. Con números y fechas reales ]",

  // ── antiOverclaim ────────────────────────────────────────────────────────
  // Límite: 200 caracteres.
  // Qué incluir: qué NO captura el análisis. Redactar en NEGATIVO.
  //   Omisiones, no-generalizaciones, debates abiertos.
  antiOverclaim: "[ ESCRIBIR AQUÍ — máx 200 caracteres. En negativo: qué omite, qué no generaliza ]"

};
