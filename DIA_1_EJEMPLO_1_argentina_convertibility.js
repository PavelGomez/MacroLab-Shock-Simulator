/**
 * EJEMPLO 1: Argentina Convertibilidad (1991–2002)
 *
 * Crónica COMPLETA con nuevo campo institutionalLayer.
 * Fuente base: cronicas-registry.es-ES.js
 *
 * Este archivo ilustra cómo se rellena institutionalLayer para un episodio
 * de rigidez cambiaria bajo inconsistencia fiscal.
 *
 * Validación: Todos los campos respetan límites del schema v1.1;
 * mechanism menciona semánticamente las variables en affectedVariables;
 * antiOverclaim está en negativo.
 */

window.MacroLabCronicasRegistryES_EJEMPLO_1 = Object.freeze({

  "argentina_convertibility": {
    // ===== CAMPOS EXISTENTES (sin modificación) =====
    titulo: "Argentina, convertibilidad 1991–2002",
    sub: "Rigidez cambiaria bajo inconsistencia fiscal",
    preguntaGuia: "¿Qué señales anticipan que un régimen rígido ha dejado de ser consistente con su entorno fiscal y de productividad?",
    cronica: [
      "La Ley 23.928, sancionada en marzo de 1991 y vigente desde el 1 de abril de ese año, fijó la paridad un peso por un dólar y rompió un ciclo hiperinflacionario previo. Por casi una década, la inflación se mantuvo en niveles bajos y la economía recibió capitales.",
      "Las tensiones se acumularon: déficit fiscal sostenido a nivel nacional y provincial, deuda pública creciente y dolarizada, salarios reales rígidos a la baja, productividad insuficiente para sostener la paridad real. La crisis del Tequila (1994–1995) fue un primer aviso; la economía sobrevivió.",
      "Pero la crisis rusa de 1998 y la devaluación del real brasileño en enero de 1999 abrieron una recesión persistente. La salida de capitales emergentes, sumada a la rigidez del régimen, hizo el ajuste real traumático. El \"corralito\" de diciembre de 2001 y la renuncia de De la Rúa precipitaron el final. La Ley fue derogada el 6 de enero de 2002, con default y devaluación posterior."
    ],
    caveat: "Ilustra cómo un ancla rígida acumula tensión cuando no es consistente con el resto del marco fiscal y de productividad. No que toda rigidez fracase, ni que la convertibilidad fuera inútil siempre. Distintos autores han ofrecido explicaciones complementarias del colapso.",
    fuentes: [
      { texto: "Ley 23.928 (1991). Régimen de convertibilidad.", url: "https://www.argentina.gob.ar/normativa/nacional/ley-23928-328" },
      { texto: "Ley 25.561 (2002). Emergencia pública y reforma del régimen cambiario.", url: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/71477/norma.htm" },
      { texto: "Mussa (2002). Argentina and the Fund: From Triumph to Tragedy. PIIE Policy Analysis 67.", url: "https://www.piie.com/bookstore/argentina-and-fund-triumph-tragedy" },
      { texto: "Calvo, Izquierdo & Mejía (2008). Systemic Sudden Stops. NBER WP 14026.", url: "https://www.nber.org/papers/w14026" },
      { texto: "De la Torre, Levy Yeyati & Schmukler (2003). Living and Dying with Hard Pegs. Economía 3(2).", url: "https://muse.jhu.edu/article/41432" }
    ],

    // ===== NUEVO CAMPO: institutionalLayer =====
    institutionalLayer: {

      // 186 caracteres — dentro del límite de 200 (schema v1.1).
      institution: "Ley de Convertibilidad (1991–2002): régimen de paridad fija 1 ARS/USD sin discretion en Banco Central; dependencia de entradas de capital externo; estructura de deuda pública dolarizada.",

      // 366 caracteres — dentro del límite de 500 (schema v1.1).
      // Menciona semánticamente todas las affectedVariables.
      mechanism: "Shock externo (crisis rusa 1998, devaluación Brasil 1999) → caída de salida de capital → presión sobre reservas internacionales → bajo Convertibilidad, BC no puede expandir monetariamente sin dólares → base monetaria se contrae mecánicamente → demanda agregada cae → desempleo sube. Sin devaluación posible, ajuste real traumático y expectativas de ruptura aumentan.",

      // 5 elementos. Validación semántica: ver comentarios de campo.
      affectedVariables: [
        "reservas internacionales",        // → "presión sobre reservas internacionales"
        "base monetaria",                  // → "base monetaria se contrae mecánicamente"
        "tipo de cambio nominal (fijo por ley)", // → "Sin devaluación posible" (semántico)
        "demanda agregada",                // → "demanda agregada cae"
        "expectativas de devaluación"      // → "expectativas de ruptura aumentan" (semántico)
      ],

      // 271 caracteres — dentro del límite de 350 (schema v1.1).
      feedbackLoop: "Expectativas de ruptura del régimen → corridas de depósitos (conversión a dólares) → aún más caída de reservas → espiral contraccionista de base monetaria → depresión de actividad → mayor presión fiscal → inconsistencia se hace evidente → colapso final en diciembre 2001.",

      // 259 caracteres — dentro del límite de 300 (schema v1.1).
      policyFeasibility: "Ley de Convertibilidad rigidiza política monetaria; BC sin discreción para responder contracíclicamente; presión política creciente por expansión fiscal provincial que erosiona consistencia macro; dependencia crítica de capital externo para mantener reservas.",

      // 207 caracteres — dentro del límite de 250 (schema v1.1).
      // Corregido de versión cruda (295 chars): eliminado enumeración detallada de sectores
      // y referencia al TC real apreciado (que aparece en mechanism).
      incidence: "Shock golpea primero exportables (agricultura, manufactura) cuya competitividad se erosiona; luego caída agregada, desempleo manufacturing urbana, presión salarial formal y crisis de financiamiento de pymes.",

      // 346 caracteres — dentro del límite de 400 (schema v1.1).
      discriminatingEvidence: "Reservas internacionales caen de US$ 26 mil millones (1992, pico) a US$ 10 mil millones (2001); desempleo abierto sube de 7% (1995) a 18% (2002); deuda externa representa 52% del PIB en 2001; default de deuda soberana declarado diciembre 2001 bajo Ley 25.561; devaluación de 200%+ en enero-febrero 2002 vs USD. Fuentes: BCRA, INDEC, Mussa (2002).",

      // 437 caracteres — dentro del límite de 500 (schema v1.1).
      antiOverclaim: "MacroLab NO captura: (i) dinámicas de corridas y contagio financiero que rompen regímenes rígidamente creíbles (Calvo 1998); (ii) costos políticos de desempleo masivo que pueden presionar por salida del régimen (Alesina & Drazen 1991); (iii) interacción entre rigidez cambiaria e inconsistencia fiscal como juego temporal. La ficha ilustra por qué la rigidez sin coherencia fiscal acumula tensión; no predice el timing exacto de colapso."

    }
    // FIN institutionalLayer
  }
  // FIN argentina_convertibility

});
// FIN Object.freeze

/**
 * VALIDACIÓN DE ESTE EJEMPLO (schema v1.1):
 *
 * ✓ institution: 186/200 chars
 * ✓ mechanism: 366/500 chars — cadena shock→variable→institución→expectativa
 * ✓ affectedVariables: 5/5 elementos — presencia semántica en mechanism
 *   - "reservas internacionales"         → literal en mechanism ✓
 *   - "base monetaria"                   → literal en mechanism ✓
 *   - "tipo de cambio nominal (fijo...)" → semántico: "Sin devaluación posible" ✓
 *   - "demanda agregada"                 → literal en mechanism ✓
 *   - "expectativas de devaluación"      → semántico: "expectativas de ruptura" ✓
 * ✓ feedbackLoop: 271/350 chars — describe espiral contraccionista
 * ✓ policyFeasibility: 259/300 chars — restricciones específicas del episodio
 * ✓ incidence: 207/250 chars — CORREGIDO (versión cruda: 295 chars)
 * ✓ discriminatingEvidence: 346/400 chars — números y fechas específicas
 * ✓ antiOverclaim: 437/500 chars — 3 límites en negativo + aclaración
 * ✓ Sintaxis JavaScript: node -c (sin errores)
 *
 * NOTA EDITORIAL: Las dos variables con presencia semántica (no literal) en
 * mechanism — "tipo de cambio nominal (fijo por ley)" y "expectativas de
 * devaluación" — deberían añadirse literalmente en mechanism si se quiere
 * validación automática estricta. Pendiente para revisión editorial (Día 4-5).
 */
