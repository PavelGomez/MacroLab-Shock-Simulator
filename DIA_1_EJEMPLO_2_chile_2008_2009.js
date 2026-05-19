/**
 * EJEMPLO 2: Chile 2008–2009
 *
 * Crónica COMPLETA con nuevo campo institutionalLayer.
 * Fuente base: cronicas-registry.es-ES.js
 *
 * Este archivo ilustra cómo se rellena institutionalLayer para un episodio
 * de buffer fiscal creíble usado de forma contracíclica con éxito.
 *
 * Validación: Todos los campos respetan límites del schema v1.1;
 * mechanism menciona semánticamente las variables en affectedVariables;
 * antiOverclaim está en negativo.
 */

window.MacroLabCronicasRegistryES_EJEMPLO_2 = Object.freeze({

  "chile_2008_2009": {
    // ===== CAMPOS EXISTENTES (sin modificación) =====
    titulo: "Chile, 2008–2009",
    sub: "Buffers en versión emergente",
    preguntaGuia: "¿Qué condiciones permiten que un buffer fiscal acumulado en bonanza se use con credibilidad en una crisis externa?",
    cronica: [
      "Cuando la crisis financiera global se transmitió a Chile a fines de 2008, el FEES había acumulado US$ 20.211 millones gracias al superávit cuprífero del periodo 2005–2008. Junto al Fondo de Reserva de Pensiones y otros activos del Tesoro, los ahorros soberanos representaban cerca del 15% del PIB.",
      "Frente al shock, el Banco Central recortó la TPM en 775 puntos base entre comienzos de 2009 y mediados de ese año, llevándola a un mínimo histórico de 0,5%. El gobierno anunció un Plan de Estímulo Fiscal de 2,8% del PIB, financiado con recursos del FEES y emisión de deuda pública, dirigido a inversión, transferencias a hogares de bajos ingresos y subsidios al empleo.",
      "La actividad cayó en 2009 pero la economía volvió a expandirse hacia fines de ese año. La regla de balance estructural y los ahorros soberanos hicieron viable la respuesta sin comprometer la credibilidad ni la sostenibilidad. El FMI calificó la respuesta de \"vigorosa, bien equilibrada y coordinada\" en su Article IV de 2009."
    ],
    caveat: "Ilustra el uso de buffers fiscales y monetarios construidos en periodos buenos. No un blindaje absoluto; las condiciones —regla creíble, ahorro previo, supervisión funcional— hicieron viable la respuesta en ese momento.",
    fuentes: [
      { texto: "DIPRES (2009). Informe FEES diciembre 2009.", url: "https://www.dipres.gob.cl/598/articles-61210_doc_pdf.pdf" },
      { texto: "FMI (2009). Chile: 2009 Article IV Consultation. CR 09/271.", url: "https://www.imf.org/external/pubs/ft/scr/2009/cr09271.pdf" },
      { texto: "DIPRES (2022). Cumplimiento de las metas de regla fiscal en Chile: Revisión histórica.", url: "https://www.dipres.gob.cl/598/articles-299473_doc_pdf.pdf" },
      { texto: "De Gregorio (2014). How Latin America Weathered the Global Financial Crisis. PIIE.", url: "https://www.piie.com/bookstore/how-latin-america-weathered-global-financial-crisis" },
      { texto: "Vegh & Vuletin (2014). Overcoming the Fear of Free Falling. AER 104(5).", url: "https://doi.org/10.1257/aer.104.5.131" },
      { texto: "Frankel, Vegh & Vuletin (2013). On graduation from fiscal procyclicality. JIE 100(1).", url: "https://doi.org/10.1016/j.jinteco.2012.12.008" }
    ],

    // ===== NUEVO CAMPO: institutionalLayer =====
    institutionalLayer: {

      // 125 caracteres — dentro del límite de 200 (schema v1.1).
      // Corregido de versión cruda (235 chars): abreviado nombre del BC y del FEES.
      institution: "BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible.",

      // 454 caracteres — dentro del límite de 500 (schema v1.1).
      // Menciona semánticamente todas las affectedVariables.
      mechanism: "Shock externo (crisis financiera global → caída de precios de cobre) → ingresos por divisas bajan → presión inicial en TC pero flexible → BC reduce TPM (775 pb entre ene-jun 2009) con credibilidad en meta de IT → Gobierno usa buffer FEES para gasto anticíclico (2,8% PIB) sin quebrantar regla fiscal → Si credibilidad en BC y regla fiscal es alta, mercados no anticipan inflación ni insostenibilidad → demanda se amortigua sin desanclaje de expectativas.",

      // 5 elementos. Validación semántica: ver comentarios de campo.
      affectedVariables: [
        "tasa de política monetaria (TPM)",      // → "BC reduce TPM" (semántico)
        "expectativas de inflación 12-24 meses", // → "mercados no anticipan inflación" (semántico)
        "tipo de cambio nominal",                // → "presión inicial en TC" (semántico)
        "gasto fiscal/demanda agregada",         // → "gasto anticíclico" (semántico)
        "actividad económica y empleo"           // → "demanda se amortigua" (semántico)
      ],

      // 301 caracteres — dentro del límite de 350 (schema v1.1).
      feedbackLoop: "Buffer fiscal gastado contracíclicamente → demanda cae menos que en otro escenario → empleo se sostiene → credibilidad en regla fiscal se refuerza (deuda no explota) → expectativas de inflación no se desanclan → BC mantiene tasa baja sin riesgo → recuperación hacia fines 2009 sin inflación posterior.",

      // 261 caracteres — dentro del límite de 300 (schema v1.1).
      policyFeasibility: "BC autónomo con meta de inflación consolidada desde 2000; regla fiscal flexible pero creíble (balance estructural) permite reacción contracíclica; TC flexible absorbe volatilidad externa; FEES acumulado predeterminadamente en bonanza reduce restricción de caja.",

      // 182 caracteres — dentro del límite de 250 (schema v1.1).
      // Corregido de versión cruda (280 chars): unificada distribución secundaria
      // en efecto sobre empleo; eliminada referencia comparativa implícita en el módulo.
      incidence: "Shock golpea sector cuprífero y exportables; estímulo fiscal (transferencias, subsidios empleo) amortigua caída de empleo formal/informal; distribución más equitativa que sin buffer.",

      // 370 caracteres — dentro del límite de 400 (schema v1.1).
      discriminatingEvidence: "TPM baja de 3,25% a 0,5% entre enero y junio 2009; inflación anual alcanza 1,4% en 2009 (bajo rango meta 2-4%); desempleo sube de 7% a 10,1% pero sin espiral; expectativas de inflación a 12-24m se mantienen en rango 2,5-3,5%, sin desanclaje. PIB cae 1,6% en 2009 pero rebota a 5,1% en 2010. FMI califica respuesta como 'vigorosa, coordinada'. Fuentes: INE, DIPRES, BCCh.",

      // 450 caracteres — dentro del límite de 500 (schema v1.1).
      antiOverclaim: "MacroLab NO captura: (i) dinámicas de reputación y construcción de credibilidad que permitieron el uso del buffer (De Gregorio & Valev 2003); (ii) ciclos políticos y costos electorales de políticas contracíclicas (Alesina & Passalacqua 2016); (iii) dependencia de la acumulación previa del buffer en rentas de recursos naturales. La ficha ilustra cómo credibilidad + buffer + regla fiscal amortiguan transmisión; no es modelo general ni prescriptivo."

    }
    // FIN institutionalLayer
  }
  // FIN chile_2008_2009

});
// FIN Object.freeze

/**
 * VALIDACIÓN DE ESTE EJEMPLO (schema v1.1):
 *
 * ✓ institution: 125/200 chars — CORREGIDO (versión cruda: 235 chars)
 * ✓ mechanism: 454/500 chars — cadena shock→variable→institución→expectativa
 * ✓ affectedVariables: 5/5 elementos — presencia semántica en mechanism
 *   - "tasa de política monetaria (TPM)"      → semántico: "BC reduce TPM" ✓
 *   - "expectativas de inflación 12-24 meses" → semántico: "no anticipan inflación" ✓
 *   - "tipo de cambio nominal"                → semántico: "presión inicial en TC" ✓
 *   - "gasto fiscal/demanda agregada"         → semántico: "gasto anticíclico" ✓
 *   - "actividad económica y empleo"          → semántico: "demanda se amortigua" ✓
 * ✓ feedbackLoop: 301/350 chars — dinámica de refuerzo positivo (opuesto a argentina)
 * ✓ policyFeasibility: 261/300 chars — fortalezas institucionales del episodio
 * ✓ incidence: 182/250 chars — CORREGIDO (versión cruda: 280 chars)
 * ✓ discriminatingEvidence: 370/400 chars — números y fechas; ausencia de desanclaje
 * ✓ antiOverclaim: 450/500 chars — 3 límites en negativo + aclaración
 * ✓ Sintaxis JavaScript: node -c (sin errores)
 *
 * NOTA EDITORIAL: Todas las affectedVariables aparecen semánticamente en
 * mechanism pero ninguna literalmente. Pendiente para revisión editorial (Día 4-5):
 * evaluar si conviene añadir las frases exactas en mechanism para validación automática.
 */
