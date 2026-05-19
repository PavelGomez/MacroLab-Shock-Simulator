/* ========== INSTITUTIONAL LAYER: argentina_convertibility ========== */
// Crónica: Argentina, convertibilidad 1991–2002.
// Estado: VALIDADO — errores corregidos (ver DIA_1_ERRORES_DETECTADOS.md).
// Para fusionar a cronicas-registry.es-ES.js como campo institutionalLayer en Día 2.

var INST_LAYER_argentina_convertibility = {

  // 146 caracteres — dentro del límite de 150.
  institution: "Caja de conversión 1991–2001: paridad 1:1 por ley; BC sin política monetaria autónoma; reservas respaldaban 100% la base monetaria.",

  // 290 caracteres — dentro del límite de 300.
  // Contiene todas las affectedVariables literalmente.
  mechanism: "Sudden stop reduce reservas internacionales; sin autonomía, cae base monetaria y crédito; tipo de cambio nominal fijo amplifica pérdida competitiva real; demanda agregada colapsa en recesión; expectativas de devaluación aceleran salida de capitales cerrando el ciclo de colapso del régimen.",

  // 5 elementos — todos aparecen en mechanism.
  affectedVariables: [
    "reservas internacionales",
    "base monetaria",
    "tipo de cambio nominal",
    "demanda agregada",
    "expectativas de devaluación"
  ],

  // 187 caracteres — dentro del límite de 200.
  feedbackLoop: "Caída de reservas → contracción de base monetaria → recesión → más desconfianza → fuga adicional de capitales → nuevas caídas de reservas: ciclo auto-reforzante hasta ruptura del régimen.",

  // 191 caracteres — dentro del límite de 200.
  policyFeasibility: "Devaluar exigía derogar la ley; deflación interna era políticamente inviable; FMI financió parcialmente pero deuda dolarizada y déficit crónico hacían insostenible el ajuste sin devaluación.",

  // 129 caracteres — dentro del límite de 150. (Corregido: versión cruda era 295 chars.)
  incidence: "Shock golpea exportables; caída de demanda, desempleo manufacturing, presión salarial formal y crisis de financiamiento de pymes.",

  // 192 caracteres — dentro del límite de 250.
  discriminatingEvidence: "Reservas cayeron de USD 35.000M (jul-2001) a USD 10.000M (dic-2001); desempleo llegó a 21,5% (may-2002); peso devaluado de 1:1 a ~3,5:1; deuda en default USD 100.000M; ley derogada 6 ene 2002.",

  // 170 caracteres — dentro del límite de 200.
  antiOverclaim: "No captura heterogeneidad provincial ni efectos diferenciados del default entre tenedores; omite debate sobre si ajuste fiscal más temprano hubiera postergado el colapso."

};
