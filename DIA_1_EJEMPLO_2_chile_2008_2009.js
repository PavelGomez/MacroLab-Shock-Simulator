/* ========== INSTITUTIONAL LAYER: chile_2008_2009 ========== */
// Crónica: Chile, 2008–2009.
// Estado: VALIDADO — errores corregidos (ver DIA_1_ERRORES_DETECTADOS.md).
// Para fusionar a cronicas-registry.es-ES.js como campo institutionalLayer en Día 2.

var INST_LAYER_chile_2008_2009 = {

  // 125 caracteres — dentro del límite de 150. (Corregido: versión cruda era 235 chars.)
  institution: "BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible.",

  // 285 caracteres — dentro del límite de 300.
  // Contiene todas las affectedVariables literalmente.
  mechanism: "Caída del cobre estrecha exportaciones; BCCh baja tasa de política monetaria (TPM) 775 pb anclando expectativas de inflación 12-24 meses; tipo de cambio nominal se deprecia; gobierno activa FEES elevando gasto fiscal/demanda agregada, moderando caída de actividad económica y empleo.",

  // 5 elementos — todos aparecen en mechanism.
  affectedVariables: [
    "tasa de política monetaria (TPM)",
    "expectativas de inflación 12-24 meses",
    "tipo de cambio nominal",
    "gasto fiscal/demanda agregada",
    "actividad económica y empleo"
  ],

  // 178 caracteres — dentro del límite de 200.
  feedbackLoop: "Credibilidad del BC permite corte agresivo de TPM sin desanclar expectativas; TC flexible absorbe shock externo; estímulo fiscal opera sin costo de credibilidad por regla previa.",

  // 177 caracteres — dentro del límite de 200.
  policyFeasibility: "TPM: independencia permitió cortes rápidos. Fiscal: FEES (USD 20.211M) financió estímulo 2,8% PIB sin deuda relevante nueva. TC: flotación desde 1999 sin intervención forzada.",

  // 143 caracteres — dentro del límite de 150. (Corregido: versión cruda era 280 chars.)
  incidence: "Shock golpea cuprífero; estímulo fiscal (transferencias, subsidios empleo) amortigua caída de empleo; distribución del ajuste menos asimétrica.",

  // 239 caracteres — dentro del límite de 250.
  discriminatingEvidence: "PIB cayó 1,6% en 2009 vs mediana OCDE ~-4%; TPM bajó a 0,5% (mínimo histórico); estímulo 2,8% PIB financiado con FEES; desempleo pico 11,1% jun-2009; economía rebotó +5,8% en 2010. FMI calificó la respuesta de 'vigorosa y bien equilibrada'.",

  // 188 caracteres — dentro del límite de 200.
  antiOverclaim: "No captura exposición heterogénea al cobre por región ni estima contrafactual sin FEES; el desempleo relativamente contenido pudo reflejar rigideces laborales, no solo el estímulo fiscal."

};
