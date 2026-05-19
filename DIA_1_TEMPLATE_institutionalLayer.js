/**
 * TEMPLATE: institutionalLayer para crónicas de MacroLab
 *
 * Estructura genérica para rellenar con datos específicos de cada episodio.
 * Cada crónica (argentina_convertibility, chile_2008_2009, etc.) tendrá un objeto
 * institutionalLayer con estos 8 campos obligatorios.
 *
 * IMPORTANTE:
 * - No inventar nuevos campos
 * - Respetar límites de caracteres (ver schema v1.1)
 * - Verificar que affectedVariables está mencionado semánticamente en mechanism
 * - Verificar que mechanism incluye la cadena shock→institución→credibilidad→expectativas
 *
 */

window.MacroLabCronicasRegistryES = Object.freeze({

  "NOMBRE_CRONICA": {
    // Campos existentes (NO modificar)
    titulo: "Título del episodio histórico (Año–Año)",
    sub: "Subtítulo que enuncia la tensión institucional clave",
    preguntaGuia: "Pregunta pedagógica que unifica la crónica",
    cronica: [
      "Párrafo 1: contexto inicial y shock",
      "Párrafo 2: respuesta institucional y dinámicas iniciales",
      "Párrafo 3: desenlace y lecciones"
    ],
    caveat: "Aclaración sobre alcance de la crónica y no-prescripción",
    fuentes: [
      { texto: "Referencia académica 1", url: "https://doi.org/..." },
      { texto: "Referencia académica 2", url: "https://www...." }
    ],

    // Campo NUEVO: institutionalLayer
    institutionalLayer: {

      // 1. INSTITUTION (≤200 caracteres)
      // ─────────────────────────────────────
      // QUÉ: Institución(es) focal(es) del episodio + su configuración clave
      // NO: Genéricos como "el banco central" o "los mercados"
      // SÍ: Específicos como "BC con autonomía por ley, régimen de IT 2-4%, comunicación hacia mercados"
      // EJEMPLOS:
      //   ✓ "BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible."
      //   ✓ "Ley de Convertibilidad (1991–2002): régimen de paridad fija 1 ARS/USD sin discretion en BC; dependencia de capital externo; deuda pública dolarizada."
      //   ✗ "Gobierno regulaba la economía" (vago, sin mecanismo)
      institution: "RELLENAR: Institución(es) focal(es) y su configuración clave en el episodio (≤200 caracteres)",

      // 2. MECHANISM (≤500 caracteres)
      // ────────────────────────────────
      // QUÉ: El mecanismo causal explícito de la cadena shock→institución→credibilidad→expectativas
      // ESTRUCTURA OBLIGATORIA:
      //   a) ¿Cuál es el shock?
      //   b) ¿Qué variable(s) afecta?
      //   c) ¿Qué hace la institución en respuesta?
      //   d) ¿Cómo la credibilidad altera la formación de expectativas?
      //   e) ¿Cuál es el resultado?
      // IMPORTANTE: Cada variable en affectedVariables debe estar mencionada semánticamente aquí
      // NOTA: Debe ser narrativo pero causal, no solo descriptivo
      mechanism: "RELLENAR: shock → variable(s) → institución responde cómo → credibilidad altera expectativas de qué forma → resultado (≤500 caracteres)",

      // 3. AFFECTED_VARIABLES (Array, max 5 elementos)
      // ──────────────────────────────────────────────
      // QUÉ: Variables macroeconómicas sobre las cuales la institución tiene control directo
      //      o que responden a credibilidad institucional
      // LIMITE: Máximo 5 elementos (para evitar exhaustividad innecesaria)
      // VALIDACIÓN: Cada variable DEBE estar mencionada semánticamente en el campo mechanism
      // EJEMPLOS:
      //   - ["tasa de política monetaria (TPM)", "expectativas de inflación 12-24 meses", "tipo de cambio nominal"]
      //   - ["base monetaria", "reservas internacionales", "demanda agregada"]
      affectedVariables: [
        "VARIABLE 1 (p.ej. 'tasa de política monetaria (TPM)')",
        "VARIABLE 2 (p.ej. 'expectativas de inflación 12-24 meses')",
        "VARIABLE 3 (máximo 5 totales)"
      ],

      // 4. FEEDBACK_LOOP (≤350 caracteres)
      // ──────────────────────────────────
      // QUÉ: Dinámica de retroalimentación no lineal: cómo la reacción inicial amplifica o amortigua el shock
      // DIFERENCIA con mechanism: mechanism es la cadena inicial; feedbackLoop es cómo evoluciona
      // EJEMPLOS:
      //   Amplificador: "Expectativas de ruptura → corridas → caída de reservas → espiral contraccionista → colapso"
      //   Amortiguador: "Buffer fiscal gastado → demanda cae menos → empleo sostenido → credibilidad se refuerza → recuperación"
      feedbackLoop: "RELLENAR: Cómo la reacción inicial amplifica o amortigua el shock mediante dinámica de expectativas (≤350 caracteres)",

      // 5. POLICY_FEASIBILITY (≤300 caracteres)
      // ───────────────────────────────────────
      // QUÉ: Restricciones políticas, técnicas o institucionales que condicionan la respuesta
      // IMPORTANTE: Específicas al episodio, no genéricas
      // EJEMPLOS:
      //   - "BC autónomo por ley desde 1989; regla fiscal flexible pero creíble; TC flexible; FEES acumulado reduce restricción de caja."
      //   - "Ley de Convertibilidad rigidiza política monetaria sin discretion; dependencia crítica de flujos de capital."
      policyFeasibility: "RELLENAR: Restricciones políticas/técnicas/institucionales específicas al episodio (≤300 caracteres)",

      // 6. INCIDENCE (≤250 caracteres)
      // ──────────────────────────────
      // QUÉ: A quién golpea el shock en primer lugar y cómo se distribuye el ajuste entre sectores/grupos
      // FOCO: Economía política distribucional del episodio
      // IMPORTANTE: Dirección e intensidad relativa; cifras duras van en discriminatingEvidence
      // EJEMPLOS:
      //   - "Shock golpea primero exportables (agricultura, manufactura) cuya competitividad se erosiona; luego caída agregada, desempleo manufacturing urbana, presión salarial formal."
      //   - "Shock golpea cuprífero; estímulo fiscal amortigua caída de empleo; distribución más equitativa que sin buffer."
      incidence: "RELLENAR: Quién sufre el shock inicialmente y cómo se distribuye el ajuste (≤250 caracteres, sin cifras duras)",

      // 7. DISCRIMINATING_EVIDENCE (≤400 caracteres)
      // ───────────────────────────────────────────
      // QUÉ: Qué datos/números/hechos del episodio REAL confirman o refutan que el mecanismo operó
      // IMPORTANTE: Incluir números, fechas, fuentes
      // NO: Interpretaciones genéricas ("la inflación subió")
      // SÍ: Números específicos ("TPM baja de 3,25% a 0,5% entre ene-jun 2009; inflación 1,4% en 2009; sin desanclaje de expectativas a 12-24m")
      discriminatingEvidence: "RELLENAR: Números/hechos específicos del episodio que confirman el mecanismo (≤400 caracteres, incluir fechas y fuentes)",

      // 8. ANTI_OVERCLAIM (≤500 caracteres)
      // ──────────────────────────────────
      // QUÉ: Qué NO captura MacroLab; qué es inferencia pedagógica pura; límites explícitos
      // ESTRUCTURA: "MacroLab NO captura: (i) ..., (ii) ..., (iii) ..."
      // EJEMPLOS:
      //   - "MacroLab NO captura: (i) dinámicas de reputación (Calvo 1998); (ii) costos políticos de desempleo (Alesina-Drazen 1991); (iii) cambios de régimen mid-episodio. Ilustra mecanismo de credibilidad; no predice cuándo colapsa un régimen."
      //   - "MacroLab NO captura: (i) construcción de credibilidad previa (De Gregorio & Valev); (ii) ciclos políticos (Alesina-Passalacqua); (iii) dependencia de rentas de recursos. Ilustra amortiguación; no es modelo general."
      antiOverclaim: "RELLENAR: Qué NO captura MacroLab (en negativo) para evitar overclaims (≤500 caracteres)"

    }
    // FIN institutionalLayer
  }
  // FIN NOMBRE_CRONICA

});
// FIN Object.freeze

/**
 * CHECKLIST DE VALIDACIÓN ANTES DE MERGEAR (schema v1.1):
 *
 * ✓ institution: ≤200 caracteres, específico a episodio, NO genérico
 * ✓ mechanism: ≤500 caracteres, incluye shock→variable→institución→credibilidad→expectativas
 * ✓ affectedVariables: máx 5 elementos, TODOS mencionados semánticamente en mechanism
 * ✓ feedbackLoop: ≤350 caracteres, conecta con mechanism, describe amplificación/amortiguación
 * ✓ policyFeasibility: ≤300 caracteres, restricciones ESPECÍFICAS al episodio
 * ✓ incidence: ≤250 caracteres, distribución del ajuste (sin cifras duras)
 * ✓ discriminatingEvidence: ≤400 caracteres, números/fechas/hechos del episodio REAL
 * ✓ antiOverclaim: ≤500 caracteres, límites del modelo (en negativo, qué NO captura)
 * ✓ Sintaxis JavaScript: node -c archivo.js (sin errores)
 * ✓ institutionalLayer es un objeto (no array, no string)
 * ✓ Los 8 campos están presentes (no faltan)
 * ✓ Las comillas, corchetes y llaves están balanceadas
 */
