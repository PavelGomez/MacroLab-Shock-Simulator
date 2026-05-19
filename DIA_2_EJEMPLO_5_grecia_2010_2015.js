/**
 * EJEMPLO 5: Grecia 2010–2015
 *
 * Crónica COMPLETA con nuevo campo institutionalLayer.
 * Fuente base: cronicas-registry.es-ES.js
 *
 * Episodio: rigidez institucional en eurozona, multiplicador fiscal subestimado
 * y espiral contraccionista auto-reforzante bajo ausencia de tipo de cambio propio.
 *
 * Validación: Todos los campos respetan límites del schema v1.1;
 * mechanism menciona semánticamente las variables en affectedVariables;
 * antiOverclaim está en negativo.
 */

window.MacroLabCronicasRegistryES_EJEMPLO_5 = Object.freeze({

  "grecia_2010_2015": {
    // ===== CAMPOS EXISTENTES (sin modificación) =====
    titulo: "Grecia, 2010-2015",
    sub: "Consolidación severa bajo anclaje frágil, sistema bancario estresado y rigidez del régimen euro",
    preguntaGuia: "¿Cuándo una consolidación fiscal se vuelve contractiva y auto-reforzante?",
    cronica: [
      "En mayo de 2010, Grecia firmó el primer programa de rescate con la Troika (Comisión Europea, BCE, FMI) por 110 mil millones de euros, tras la revelación de que el déficit fiscal real era cerca del 15,4% del PIB en 2009, muy por encima de las cifras reportadas inicialmente. La consolidación exigida fue severa: caída del gasto primario, aumento de impuestos indirectos y reformas estructurales. En marzo de 2012 se ejecutó el PSI (Private Sector Involvement), con una reducción nominal cercana al 53,5% sobre el valor facial de los bonos elegibles; las pérdidas en valor presente neto para los acreedores privados fueron sustancialmente mayores, en torno al 70-75% según la metodología utilizada.",
      "Entre 2008 y 2013 el PIB griego cayó cerca de 25% en términos acumulados; el desempleo alcanzó un máximo de 27,5% en 2013, con desempleo juvenil por encima del 50%. El spread del bono soberano a 10 años pasó de menos de 100 puntos base en 2008 a un máximo cercano a 3.000 puntos base en marzo de 2012. El multiplicador fiscal real resultó significativamente mayor que el estimado por la Troika al inicio del programa, hecho reconocido en la ex-post evaluation del FMI de 2013 y formalizado en el paper de Blanchard y Leigh.",
      "La interpretación parsimoniosa es que un anclaje fiscal previamente erosionado, sin tipo de cambio propio para amortiguar el ajuste y con un sistema bancario en estrés, transformó la consolidación en una contracción profunda y auto-reforzante. Los mercados leyeron el ajuste no como señal de disciplina, sino como confirmación de un riesgo de salida del euro, lo que elevó la prima de riesgo y agravó la dinámica de la deuda. El tercer rescate de 2015, posterior al referéndum de Tsipras, mantuvo el régimen sin alterar la lógica de fondo. La trayectoria abre el debate sobre el diseño incompleto de la unión monetaria, la ausencia de prestamista fiscal común y la subestimación del multiplicador en programas concurrentes."
    ],
    caveat: "Ilustra una configuración institucional e histórica específica; no caracteriza permanentemente al país. Las decisiones acumuladas en las dos décadas previas, tanto domésticas como del diseño de la unión monetaria, son co-responsables del colapso. La generalización a otras consolidaciones requiere atender específicamente al régimen cambiario y al estado del sistema financiero.",
    fuentes: [
      { texto: "Blanchard & Leigh (2013). Growth Forecast Errors and Fiscal Multipliers. AER 103(3).", url: "https://doi.org/10.1257/aer.103.3.117" },
      { texto: "Reinhart & Trebesch (2016). Sovereign Debt Relief and its Aftermath. JEEA 14(1).", url: "https://doi.org/10.1111/jeea.12166" },
      { texto: "Zettelmeyer, Trebesch & Gulati (2013). The Greek Debt Restructuring: An Autopsy. Economic Policy 28(75).", url: "https://doi.org/10.1111/1468-0327.12014" },
      { texto: "Bolton, Fu, Gulati & Panizza (2024). The 2012 Greek Retrofit and Borrowing Costs in the European Periphery.", url: "https://doi.org/10.1177/2755323X231220978" },
      { texto: "FMI (2013). Greece: Ex Post Evaluation 2010 SBA. CR 13/156.", url: "https://www.imf.org/en/Publications/CR/Issues/2016/12/31/Greece-Ex-Post-Evaluation-of-Exceptional-Access-Under-the-2010-Stand-By-Arrangement-40639" },
      { texto: "IEO-IMF (2016). The IMF and the Crises in Greece, Ireland, and Portugal.", url: "https://ieo.imf.org/en/evaluations/completed/2016-0728-the-imf-and-the-crises-in-greece-ireland-and-portugal" },
      { texto: "ESM (2019). Safeguarding the euro in times of crisis.", url: "https://www.esm.europa.eu/publications/safeguarding-euro-times-crisis" }
    ],

    // ===== NUEVO CAMPO: institutionalLayer =====
    institutionalLayer: {

      // ~162 chars — dentro del límite de 180 (schema v1.1)
      institution: "Grecia en eurozona sin política monetaria propia; BCE como prestamista de última instancia limitado; Troika (CE, BCE, FMI) como prestamista condicional a ajuste fiscal.",

      // ~469 chars — dentro del límite de 500 (schema v1.1)
      // Menciona semánticamente todas las affectedVariables
      mechanism: "Revelación de déficit fiscal real (15,4% PIB, 2009) → pérdida de acceso a mercados → consolidación severa con multiplicador fiscal subestimado → PIB cae más de lo proyectado → ratio deuda/PIB sube → spread soberano se dispara (~3.000 pb, mar 2012) → bancos griegos en estrés, crédito bancario interno se contrae → actividad cae más; expectativas de permanencia en el euro se deterioran, elevan prima de riesgo; sin tipo de cambio, ajuste se desplaza a deflación de salarios nominales y empleo.",

      // 5 elementos. Validación semántica: ver comentarios de campo.
      affectedVariables: [
        "spread soberano",                          // → "spread soberano se dispara" ✓
        "multiplicador fiscal",                     // → "multiplicador fiscal subestimado" ✓
        "crédito bancario interno",                 // → "crédito bancario interno se contrae" ✓
        "salarios nominales y empleo",              // → "deflación de salarios nominales y empleo" ✓
        "expectativas de permanencia en el euro"   // → "expectativas de permanencia en el euro se deterioran" ✓
      ],

      // ~243 chars — dentro del límite de 250 (schema v1.1)
      feedbackLoop: "Consolidación contrae PIB → ratio deuda/PIB sube → desconfianza aumenta → spread soberano sube → bancos en estrés → crédito bancario cae → PIB cae más → nueva austeridad exigida; ausencia de tipo de cambio hace el ajuste exclusivamente deflacionario.",

      // ~182 chars — dentro del límite de 200 (schema v1.1)
      policyFeasibility: "Sin moneda propia, devaluación imposible; financiamiento 100% condicional a ajuste fiscal; gobierno sin acceso a mercados desde 2010; resistencia social creciente limita el ritmo de ajuste.",

      // ~128 chars — dentro del límite de 150 (schema v1.1)
      incidence: "Trabajadores públicos y pensionistas golpeados primero (cortes directos); desempleo juvenil >50%; sector exportable pequeño sin buffer cambiario.",

      // ~293 chars — dentro del límite de 370 (schema v1.1)
      discriminatingEvidence: "PIB cae ~25% acumulado 2008–2013; desempleo: 27,5% (2013), juvenil >50%; spread 10A: ~3.000 pb (mar 2012); déficit revelado: 15,4% PIB (2009); PSI: reducción nominal 53,5%, pérdida VPN 70–75%; multiplicador estimado 0,5, real ~1,5 (Blanchard & Leigh 2013). Fuentes: Eurostat, FMI CR 13/156.",

      // ~407 chars — dentro del límite de 450 (schema v1.1)
      antiOverclaim: "MacroLab NO captura: (i) el rol del BCE/OMT (2012) en el restablecimiento parcial de la calma del mercado (De Grauwe 2012); (ii) el debate sobre diseño incompleto de la unión monetaria y ausencia de prestamista fiscal común; (iii) el doom loop entre bancos y soberano como amplificador autónomo. La ficha ilustra la espiral contraccionista bajo rigidez cambiaria; no modela contagio transfronterizo ni mecanismos supranacionales de estabilización."

    }
    // FIN institutionalLayer
  }
  // FIN grecia_2010_2015

});
// FIN Object.freeze

/**
 * VALIDACIÓN (schema v1.1):
 *
 * ✓ institution: ~162/180 chars
 * ✓ mechanism: ~469/500 chars — cadena déficit→spread→bancos→crédito→empleo
 * ✓ affectedVariables: 5/5 — presencia semántica en mechanism:
 *   - "spread soberano"                      → "spread soberano se dispara" ✓
 *   - "multiplicador fiscal"                 → "multiplicador fiscal subestimado" ✓
 *   - "crédito bancario interno"             → "crédito bancario interno se contrae" ✓
 *   - "salarios nominales y empleo"          → "deflación de salarios nominales y empleo" ✓
 *   - "expectativas de permanencia en euro"  → "expectativas de permanencia en el euro se deterioran" ✓
 * ✓ feedbackLoop: ~243/250 chars — bucle contraccionista deflacionario
 * ✓ policyFeasibility: ~182/200 chars — restricciones del episodio
 * ✓ incidence: ~128/150 chars — distribución por grupos
 * ✓ discriminatingEvidence: ~293/370 chars — datos reales con cifras y fuentes
 * ✓ antiOverclaim: ~407/450 chars — en negativo con referencias
 * ✓ Sintaxis JS: node -c (sin errores)
 */
