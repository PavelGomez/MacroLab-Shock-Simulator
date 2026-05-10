/* ========== ROUTE REGISTRY ES-ES ========== */
// Registro editorial de rutas: cápsula de aterrizaje + cierre narrativo.
// Clave: "tab|modelShockKey|configKey"
// Sprint 1: cinco rutas de alta prioridad.
// Lote 1: esquema homogéneo en 9 rutas (5 legacy migradas + 4 nuevas).
window.MacroLabRouteRegistryES = Object.freeze({

  "oada|oilUp|CHL": {
    arrivalTitle: "OA-DA · shock energético con anclaje relativamente creíble",
    what: "Analizas un alza del petróleo (shock de costos) bajo la configuración Chile 2026: banco central autónomo con meta creíble, tipo de cambio flexible y regla fiscal de cumplimiento relevante.",
    shock: "Alza del petróleo: OA se desplaza hacia arriba e izquierda. P sube, Y cae transitoriamente. El grado de persistencia depende de si las expectativas se mantienen ancladas.",
    graph: "OA sube: el equilibrio se mueve hacia mayor P y menor Y. Observa la brecha respecto a Yₙ y si el nuevo equilibrio queda por encima o debajo del producto natural.",
    next: "Lee la trayectoria de mediano plazo (convergencia de Pᵉ) y contrasta con la tarjeta institucional CHL. Luego vuelve a Lentes para ver cómo cambia la trayectoria con otras configuraciones.",
    hypothesis: "Con banco central creíble y tipo de cambio flexible, el shock energético genera inflación transitoria. El TC absorbe parte del ajuste y el BC ancla las expectativas, limitando la segunda vuelta salarial.",
    filter: "Chile 2026: TC flexible como amortiguador, pass-through moderado, BC autónomo con meta de inflación creíble, regla fiscal de cumplimiento imperfecto pero relevante.",
    limits: "OA-DA muestra el equilibrio estático de corto plazo. No formaliza la dinámica de expectativas ni el pass-through cambiario. La convergencia de Pᵉ es un proceso que el modelo supone, no simula.",
    evidenceNow: {
      macro: [
        "IPC general y SAE energía",
        "Salarios reales y nominales",
        "PIB y empleo"
      ],
      financial: [
        "CLP/USD ante el shock energético",
        "Spread soberano y CDS Chile",
        "WTI o referencia energética"
      ],
      institutional: [
        "Expectativas de inflación a 12 y 24 meses (EEE BCCh)",
        "Comunicación de la TPM y tono de los IPoM",
        "Reajustes salariales en sectores indexados a UF"
      ]
    },
    evidenceLater: [
      "Convergencia del IPC al rango meta (3%±1)",
      "Breakeven implícito en BTP/BTPU",
      "Salarios reales en sectores indexados a UF"
    ],
    antiOverclaim: "Este análisis muestra la dirección probable del ajuste, no su magnitud ni timing exacto. La credibilidad del BC es una variable continua acumulada en episodios anteriores; no se transfiere automáticamente a shocks futuros.",
    returnText: "← Volver a Lentes · petróleo · Chile 2026",
    cronicaKey: "chile_2021_2024",
    omittedVariables: "La crónica no captura la composición sectorial de la transmisión (transables vs no transables), la política de subsidios energéticos del período ni el grado de indexación salarial a UF. En OA-DA aplicado, la apertura externa y el pass-through cambiario aparecen sólo implícitamente.",
    causalAttributionLimit: "La trayectoria observada admite lectura alternativa por shock global de cadenas de suministro post-pandemia y por demanda interna asociada a retiros previsionales. La hipótesis institucional es parsimoniosa, pero coexiste con esos canales sin excluirlos.",
    falsificationCheck: "Si economías con instituciones macro comparables hubieran tenido trayectorias dramáticamente peores frente al mismo shock energético, la explicación basada en credibilidad acumulada perdería peso y debería compartir espacio con factores estructurales no institucionales.",
    deepDive: [
      "Pass-through cambiario, IPC SAE energético, indexación a UF y dispersión de precios sectoriales",
      "Trade-off credibilidad-flexibilidad en regímenes de meta de inflación con economía abierta",
      "OA-DA no formaliza el pass-through cambiario ni la heterogeneidad sectorial",
      "Brasil 2021-2024 (otra meta de inflación con régimen flotante) y Perú 2021-2024 (meta de inflación con dolarización parcial)"
    ]
  },

  "oada|oilUp|FRG": {
    arrivalTitle: "OA-DA · shock energético con anclaje frágil",
    what: "Analizas un alza del petróleo bajo la configuración Anclaje frágil: autonomía efectiva del banco central limitada, expectativas poco ancladas, dominancia fiscal latente y alta sensibilidad de la prima de riesgo.",
    shock: "Alza del petróleo: OA se desplaza hacia arriba. Con expectativas frágiles, el shock de costos puede activar una segunda vuelta: Pᵉ sube, OA vuelve a desplazarse y amplifica el ajuste inicial.",
    graph: "OA sube en el impacto inicial. Si Pᵉ se desancla hay un segundo desplazamiento de OA. El equilibrio final puede quedar mucho más lejos de Yₙ que lo que el modelo de un período sugiere.",
    next: "Razona sobre la dinámica de Pᵉ: ¿cuánto sube si las expectativas se desanclan? Prueba editar Pᵉ en el simulador para simular el efecto de segunda vuelta. Contrasta con CHL para ver la diferencia que hace la credibilidad.",
    hypothesis: "Con anclaje frágil, la inflación inicial activa expectativas que generan segunda vuelta. El banco central enfrenta presión política para acomodar y la prima de riesgo sube con independencia del shock original.",
    filter: "Anclaje frágil: expectativas poco ancladas, pass-through alto, dominancia fiscal latente, prima de riesgo sensible a noticias de política monetaria.",
    limits: "OA-DA muestra el equilibrio tras el primer shock. La segunda vuelta requiere razonar sobre cómo Pᵉ se ajusta endógenamente, lo que el modelo no simula en un solo período.",
    evidenceNow: {
      macro: [
        "IPC y subyacente",
        "Salarios reales y empleo",
        "Crecimiento sectorial transables vs no transables"
      ],
      financial: [
        "Spread EMBI o CDS soberano",
        "Tipo de cambio oficial y demanda de divisas",
        "Premium en cambio paralelo si existe"
      ],
      institutional: [
        "Expectativas de inflación de corto y mediano plazo",
        "Rotación o presión sobre la autoridad monetaria",
        "Indexación salarial y de contratos"
      ]
    },
    evidenceLater: [
      "Desanclaje persistente de expectativas a 24 meses",
      "Prima de riesgo soberana sostenida",
      "Salarios indexados acelerando ante inflación pasada"
    ],
    antiOverclaim: "La fragilidad institucional no es un destino inevitable: es el resultado de decisiones acumuladas. La trayectoria descrita ilustra un mecanismo, no una predicción para ningún país específico.",
    returnText: "← Volver a Lentes · petróleo · Anclaje frágil",
    cronicaKey: "turkey_2018_2023",
    omittedVariables: "La crónica no captura la composición de la deuda pública en moneda extranjera, el grado de desarrollo del mercado de capitales doméstico ni los canales informales de demanda de dólares. En OA-DA aplicado, la dinámica de spreads soberanos y la presión política sobre el banco central no aparecen como variables.",
    causalAttributionLimit: "La aceleración inflacionaria turca admite lectura por experimento de política heterodoxa específica del periodo —recortes de tasa con inflación alta— separable del rasgo institucional general. Ambas dimensiones son complementarias, no excluyentes.",
    falsificationCheck: "Si la trayectoria turca se explicara principalmente por la decisión política puntual de recortar tasas con inflación alta, y no por una fragilidad institucional acumulada, la lectura del filtro debería moderarse y enfatizar la naturaleza idiosincrática del episodio.",
    deepDive: [
      "Series de inflación, expectativas, tasa real esperada y rotación de presidentes del banco central",
      "Independencia de jure vs de facto del banco central; dominancia política y reputación",
      "OA-DA no formaliza la presión política sobre la autoridad monetaria ni la heterodoxia explícita",
      "Argentina 2018-2023 (otro caso emergente de fragilidad) y Brasil 2010-2016 (caso intermedio con ajuste exitoso)"
    ]
  },

  "islmbp|copperDown|CHL": {
    arrivalTitle: "IS-LM-BP · caída del cobre con ajuste ordenado",
    what: "Analizas una caída del precio del cobre bajo la configuración Chile 2026. IS-LM-BP captura lo que IS-LM no puede: la interacción entre ingreso, tasa de interés, tipo de cambio y balanza de pagos.",
    shock: "Caída del cobre: reducción de ingresos de exportación (x₀ cae), IS se desplaza a la izquierda, presión depreciatoria sobre el peso. La regla de balance estructural implica que el fisco ya contabilizó el precio de largo plazo.",
    graph: "IS se desplaza a la izquierda: Y cae. El tipo de cambio E sube (depreciación). La curva BP se ajusta. Observa si la depreciación recupera algo de competitividad vía exportaciones no cupreras.",
    next: "Contrasta este ajuste con IS-LM para ver qué agrega el canal externo. La diferencia entre IS-LM e IS-LM-BP en este caso es la depreciación cambiaria como amortiguador parcial.",
    hypothesis: "Con tipo de cambio flexible y regla fiscal creíble, la caída del cobre se absorbe parcialmente vía depreciación, que mejora la competitividad de exportaciones no cupreras y modera la caída de actividad.",
    filter: "Chile 2026: TC flexible, regla de balance estructural (precio de referencia del cobre), BC autónomo, acceso a mercados internacionales de deuda.",
    limits: "IS-LM-BP asume perfecta movilidad de capitales y tipo de cambio flotante limpio. No modela la dinámica de reservas ni el efecto sobre las expectativas inflacionarias vía pass-through.",
    evidenceNow: {
      macro: [
        "Balance de la cuenta corriente y exportaciones",
        "PIB minero vs no minero",
        "Empleo en sectores expuestos al cobre"
      ],
      financial: [
        "Precio del cobre (Cochilco, LME)",
        "CLP/USD",
        "Spread soberano CDS Chile"
      ],
      institutional: [
        "Balance fiscal efectivo vs estructural (Dipres)",
        "Saldo del FEES y reglas de uso",
        "Comunicación de la regla de balance estructural"
      ]
    },
    evidenceLater: [
      "Balance fiscal efectivo vs. estructural (Dipres)",
      "Prima soberana chilena (CDS a 5 años)",
      "IMACEC sectorial: exportaciones no mineras"
    ],
    antiOverclaim: "IS-LM-BP simplifica la dinámica externa. El ajuste real depende del nivel de reservas, la credibilidad de la regla fiscal y el contexto global de liquidez en mercados emergentes.",
    returnText: "← Volver a Lentes · cobre · Chile 2026",
    cronicaKey: "chile_2008_2009",
    omittedVariables: "La crónica no captura la composición de las exportaciones no cupreras, la política de subsidios al sector minero ni la dinámica del fondo soberano específica del período. En IS-LM-BP aplicado, la heterogeneidad regional del impacto y los efectos de derrame financiero internacional no aparecen.",
    causalAttributionLimit: "La amortiguación parcial del shock admite lectura alternativa por entorno de bajas tasas globales y por demanda china diferida en lugar de colapsada. La hipótesis institucional explica una parte, pero comparte peso con los canales globales del momento.",
    falsificationCheck: "Si una economía con regla fiscal estructural pero sin acceso fluido a mercados internacionales hubiera amortiguado un shock análogo de manera comparable, la explicación basada en flotación y credibilidad fiscal perdería peso explicativo.",
    deepDive: [
      "Composición de exportaciones, balance estructural ex-post y trayectoria del FEES",
      "Reglas fiscales basadas en commodities y diseño contracíclico",
      "IS-LM-BP no formaliza la dinámica intertemporal del fondo ni el efecto sobre productividad sectorial",
      "Australia 2014-2016 (mining downturn con buffers parciales) y Perú 2014-2016 (otro exportador metálico)"
    ]
  },

  "islm|fiscalContract|CHL": {
    arrivalTitle: "IS-LM · contracción fiscal con marco creíble",
    what: "Analizas una contracción fiscal bajo la configuración Chile 2026. IS-LM muestra el efecto sobre actividad y tasa de interés. La capa institucional agrega cómo la credibilidad de la regla modula la trayectoria.",
    shock: "Contracción fiscal: reducción del gasto o aumento de impuestos. IS se desplaza a la izquierda: Y cae. Si el banco central acompaña bajando la tasa, parte de la contracción se compensa vía inversión.",
    graph: "IS se desplaza a la izquierda. El nuevo equilibrio tiene menor Y y puede tener menor i. La distancia al equilibrio inicial mide la magnitud del multiplicador fiscal en el modelo.",
    next: "Observa si la contracción es leída como señal de disciplina o de crisis. En marcos creíbles la prima de riesgo no sube y el ajuste es ordenado. Contrasta con FRG para ver la diferencia.",
    hypothesis: "Con regla fiscal creíble y banco central autónomo, la contracción ordenada puede aliviar presiones externas, acompañar la política monetaria y no generar espiral de expectativas negativas.",
    filter: "Chile 2026: regla de balance estructural, BC autónomo con espacio para acompañar, acceso a mercados de deuda soberana.",
    limits: "IS-LM no captura el canal externo ni la respuesta del tipo de cambio. Para economías abiertas pequeñas, IS-LM-BP es el complemento necesario para ver la fuga cambiaria y la balanza de pagos.",
    evidenceNow: {
      macro: [
        "IMACEC mensual (Banco Central)",
        "Inversión privada y FBCF",
        "Empleo y desocupación"
      ],
      financial: [
        "TPM y tasa de política (BCCh)",
        "Prima soberana CDS Chile",
        "Tasas largas BTP/BTPU"
      ],
      institutional: [
        "Expectativas de crecimiento a 12 meses",
        "Cumplimiento de la regla de balance estructural",
        "Posición del FEES y comunicación fiscal"
      ]
    },
    evidenceLater: [
      "Balance fiscal efectivo vs. estructural (Dipres)",
      "Expectativas de crecimiento a 12 meses",
      "Inversión privada bruta (cuentas nacionales)"
    ],
    antiOverclaim: "IS-LM supone economía cerrada o con canal externo simplificado. La lectura institucional agrega la dimensión de credibilidad que el modelo no formaliza. La magnitud del multiplicador real depende de factores no modelados.",
    returnText: "← Volver a Lentes · contracción fiscal · Chile 2026",
    cronicaKey: "chile_2008_2009",
    omittedVariables: "La crónica no captura el canal externo del tipo de cambio (cuyo movimiento puede reforzar o atenuar el ajuste interno), la composición sectorial del recorte ni la respuesta de las expectativas empresariales. En IS-LM aplicado, la apertura externa no aparece en el equilibrio cerrado.",
    causalAttributionLimit: "El éxito de un ajuste fiscal chileno admite atribución parcial al ciclo cuprífero del momento y a la posición externa relativamente sólida. La hipótesis del filtro institucional es plausible pero comparte explicación con esos factores.",
    falsificationCheck: "Si la consolidación se hubiera ejecutado en un contexto de ciclo cuprífero negativo y aún así produjera un ajuste ordenado, la tesis institucional saldría reforzada. En el caso Chile 2008-2009, el ciclo externo fue parcialmente favorable, lo que limita la fuerza del falsificador.",
    deepDive: [
      "Balance estructural, multiplicador fiscal estimado ex-post y composición del ajuste",
      "Reglas fiscales y multiplicadores; literatura post-2008 sobre fiscal multipliers en small open economies",
      "IS-LM no formaliza el canal externo ni el efecto sobre la posición externa neta",
      "Suecia 1994-1998 (consolidación creíble) y Argentina 2001 (consolidación sin credibilidad)"
    ]
  },

  "oada|pandemic|CHL": {
    arrivalTitle: "OA-DA · pandemia con espacio fiscal disponible",
    what: "Analizas el shock de pandemia bajo la configuración Chile 2026. OA-DA captura el doble desplazamiento: DA cae por incertidumbre y restricciones; OA puede subir por disrupciones de oferta. El espacio fiscal acumulado (FEES) modula la profundidad y duración.",
    shock: "Pandemia: DA se desplaza a la izquierda (menor consumo e inversión). Simultáneamente, OA puede desplazarse hacia arriba (disrupciones de cadenas de suministro). El resultado neto es caída de Y; el movimiento de P depende de cuál domina.",
    graph: "DA se desplaza a la izquierda. Si también hay disrupciones de oferta, OA sube. El equilibrio final tiene menor Y. El signo de P es ambiguo según la magnitud relativa de cada desplazamiento.",
    next: "Contrasta la profundidad de la caída de Y con la configuración FRG: la diferencia ilustra el valor del espacio fiscal acumulado. Observa también el rol de la credibilidad del BC en contener expectativas.",
    hypothesis: "Con espacio fiscal previo (FEES operativo), Chile pudo responder con estímulo contracíclico creíble sin comprometer la sostenibilidad. La credibilidad del BC redujo el pass-through adicional al IPC.",
    filter: "Chile 2026: FEES operativo, regla fiscal con espacio, BC autónomo con credibilidad acumulada, acceso a mercados internacionales.",
    limits: "OA-DA no modela la dinámica de expectativas pandémicas ni los efectos de histéresis sobre la oferta. La recuperación puede ser asimétrica según el tejido productivo afectado y los efectos de largo plazo sobre productividad.",
    evidenceNow: {
      macro: [
        "IMACEC mensual (Banco Central)",
        "Empleo y desocupación",
        "PIB y crecimiento sectorial"
      ],
      financial: [
        "TPM y tasa de política",
        "CLP/USD y reservas internacionales",
        "Spread soberano CDS Chile"
      ],
      institutional: [
        "Gasto de gobierno efectivo vs presupuestado (Dipres)",
        "Balance del FEES (Dirección de Presupuestos)",
        "Expectativas de inflación a 12 y 24 meses"
      ]
    },
    evidenceLater: [
      "Cicatrización del mercado laboral (tasa de desempleo, NAIRU estimada)",
      "Recuperación de la inversión privada (FBCF)",
      "Balance fiscal estructural post-pandemia (CFA)"
    ],
    antiOverclaim: "La respuesta chilena a la pandemia fue posible en parte por condiciones institucionales previas únicas: espacio fiscal acumulado y credibilidad del BC. No es un modelo exportable sin ajustar por las condiciones de cada economía.",
    returnText: "← Volver a Lentes · pandemia · Chile 2026",
    cronicaKey: "chile_2021_2024",
    omittedVariables: "La crónica no captura los efectos de los retiros previsionales sobre la demanda agregada, la heterogeneidad regional de la respuesta sanitaria ni la composición sectorial del estímulo. En OA-DA aplicado, la dinámica de transferencias directas y su efecto-riqueza no aparecen.",
    causalAttributionLimit: "La recuperación post-pandemia admite atribución parcial a los retiros previsionales (que estimularon demanda y luego presionaron precios) y al ciclo global expansivo. La hipótesis del filtro institucional explica la sostenibilidad nominal, pero comparte explicación de la recuperación con esos canales.",
    falsificationCheck: "Si la inflación 2021-2022 se explicara casi exclusivamente por los retiros previsionales y la liquidez global, sin contribución diferencial del marco institucional respecto a economías comparables, la tesis del filtro debería acotarse.",
    deepDive: [
      "Retiros previsionales, transferencias directas, ahorro precautorio y efectos sobre IPC",
      "Política contracíclica creíble en pandemia; fronteras del espacio fiscal",
      "OA-DA no formaliza retiros previsionales, transferencias directas ni heterogeneidad regional",
      "Perú 2020-2021 (retiros similares) y Brasil 2020-2021 (transferencias amplias bajo marco distinto)"
    ]
  },

  "oada|pandemic|CRD": {
    arrivalTitle: "OA-DA · pandemia con buffer soberano y banco central creíble",
    what: "Analizas la pandemia bajo Alta credibilidad con buffer. El espacio fiscal acumulado y la credibilidad monetaria modulan profundidad y duración del ajuste; el caso de referencia incluye un shock dual: pandemia y caída del precio del petróleo.",
    shock: "Pandemia: DA cae por incertidumbre y restricciones; OA puede subir por disrupciones de oferta. En el caso noruego, la caída simultánea del petróleo agrega un canal externo de deterioro de términos de intercambio y depreciación cambiaria.",
    graph: "DA se desplaza a la izquierda. OA puede subir transitoriamente. El equilibrio queda con menor Y. El movimiento de P depende de la magnitud relativa; con expectativas ancladas y buffer activo, suele ser contenido.",
    next: "Contrasta con FRG (Argentina 2020) para ver el rol de la credibilidad acumulada. Lee la crónica de Noruega 2020 para anclar la lectura en evidencia y comprender el shock dual.",
    hypothesis: "Con buffer fiscal previo, banco central creíble y legitimidad política para usar el buffer, la respuesta contracíclica es factible sin transferir el shock a inflación persistente ni a prima soberana, incluso bajo shocks duales.",
    filter: "Alta credibilidad con buffer: regla fiscal con consenso político transversal, fondo soberano operativo, banco central con meta de inflación creíble, expectativas firmemente ancladas.",
    limits: "OA-DA captura la fotografía estática del corto plazo. La sostenibilidad intergeneracional del buffer, la dinámica del precio del petróleo y la diferencia entre tener buffer y tener legitimidad política para usarlo no se modelan en este equilibrio.",
    evidenceNow: {
      macro: [
        "PIB continental y total",
        "Desempleo registrado",
        "Inflación general"
      ],
      financial: [
        "Tasa de política monetaria de Norges Bank",
        "Tipo de cambio EUR/NOK",
        "Precio Brent o referencia energética"
      ],
      institutional: [
        "Expectativas de inflación a 12-24 meses",
        "Transferencias del fondo al presupuesto",
        "Comunicación oficial del marco fiscal"
      ]
    },
    evidenceLater: [
      "Recuperación del PIB hacia tendencia",
      "Trayectoria del fondo y sostenibilidad de retornos reales",
      "Inflación de mediano plazo y política monetaria post-pandemia"
    ],
    antiOverclaim: "Un caso de buffer activo no es prescripción universal: la acumulación previa requirió rentas petroleras y consenso político específicos.",
    cronicaKey: "noruega_2020",
    returnText: "← Volver a Lentes · pandemia · Alta credibilidad con buffer",
    omittedVariables: "La apertura externa, la composición sectorial de la economía, el efecto patrimonial agregado del fondo y la dinámica del precio del petróleo no aparecen explícitamente en OA-DA aplicado.",
    causalAttributionLimit: "La trayectoria observada admite lectura alternativa por baja exposición sectorial al turismo y al comercio físico, dos canales que castigaron a economías con marcos institucionales similares (Suiza, Dinamarca). La hipótesis institucional es parsimoniosa, no única.",
    falsificationCheck: "Si economías con igual buffer y credibilidad hubieran tenido trayectorias significativamente peores solo por composición sectorial distinta, la explicación institucional perdería fuerza.",
    deepDive: [
      "Precio del petróleo, composición sectorial del PIB y evolución del valor del fondo soberano",
      "Diseño de fondos soberanos, reglas fiscales y sostenibilidad intergeneracional",
      "OA-DA no formaliza el canal externo del petróleo ni el efecto patrimonial agregado del fondo",
      "Australia 2020 (mining-economy con buffers parciales) y Suiza 2020 (alta credibilidad sin buffer petrolero)"
    ]
  },

  "oada|pandemic|FRG": {
    arrivalTitle: "OA-DA · pandemia bajo anclaje frágil",
    what: "Analizas la pandemia bajo Anclaje frágil. Sin regla fiscal vinculante, con autonomía operativa limitada del banco central y con historia reciente de default, el shock global común se transforma en un episodio de aceleración inflacionaria persistente.",
    shock: "Pandemia: DA cae; OA puede subir transitoriamente. Sin regla fiscal y con autonomía limitada, la respuesta vía financiamiento monetario amplifica el componente inflacionario; el resultado no se reduce a 'emisión genera inflación', sino que combina dominancia fiscal, baja demanda de dinero, brecha cambiaria, controles e indexación parcial.",
    graph: "DA se desplaza a la izquierda; OA puede acompañar. Si Pᵉ se desancla, OA continúa moviéndose en períodos posteriores. El equilibrio se aleja sostenidamente de Yₙ con presión persistente sobre P.",
    next: "Contrasta con CRD (Noruega 2020) para ver el rol del buffer y la credibilidad. Lee la crónica de Argentina 2020 para anclar en evidencia y comprender el mecanismo institucional completo.",
    hypothesis: "Con anclaje frágil, un shock global común se transforma en episodio inflacionario persistente; la respuesta fiscal-monetaria sin reglas creíbles activa expectativas que se autorefuerzan vía dominancia fiscal, brecha cambiaria y restricción externa.",
    filter: "Anclaje frágil: BC con autonomía formal pero limitada operativamente, sin regla fiscal vinculante, historia reciente de default, expectativas poco ancladas, demanda de dinero deteriorada.",
    limits: "OA-DA muestra el equilibrio estático. La dinámica de aceleración inflacionaria, la brecha cambiaria oficial-paralela y la fuga hacia activos en moneda extranjera no se modelan.",
    evidenceNow: {
      macro: [
        "PIB",
        "Inflación diciembre-contra-diciembre y promedio anual",
        "Empleo y salarios reales"
      ],
      financial: [
        "Brecha entre tipo de cambio oficial y tipos paralelos/financieros (blue, MEP, CCL)",
        "Spread soberano y CDS",
        "Reservas internacionales netas"
      ],
      institutional: [
        "Expectativas de inflación a 12 meses (REM o equivalente)",
        "Crecimiento de la base monetaria",
        "Financiamiento monetario del déficit fiscal"
      ]
    },
    evidenceLater: [
      "Persistencia de la inflación interanual",
      "Capacidad de acceso a mercados internacionales de deuda",
      "Trayectoria del salario real y del empleo registrado"
    ],
    antiOverclaim: "La fragilidad institucional se construye y se desarma con decisiones acumuladas; no es destino atribuible al país.",
    cronicaKey: "argentina_2020",
    returnText: "← Volver a Lentes · pandemia · Anclaje frágil",
    omittedVariables: "La heterogeneidad provincial del impacto pandémico, la composición del mercado paralelo de divisas y la fragmentación entre depósitos en pesos y en dólares no aparecen en el equilibrio agregado.",
    causalAttributionLimit: "La aceleración inflacionaria 2020-2022 admite lectura por shock global de commodities y energía. La hipótesis institucional explica la persistencia diferencial respecto a emergentes comparables, pero no excluye los canales globales.",
    falsificationCheck: "Si la inflación 2021-2022 se explicara casi totalmente por commodities y energía, la tesis institucional debería moderarse y compartir peso explicativo con factores externos.",
    deepDive: [
      "Dominancia fiscal, demanda de dinero, brecha cambiaria, expectativas REM y pass-through",
      "Coordinación fiscal-monetaria, dominancia fiscal y reglas vinculantes",
      "OA-DA no formaliza dominancia fiscal ni dinámica de brecha cambiaria oficial-paralela",
      "Trayectorias contemporáneas de Chile, Perú y Uruguay frente al mismo shock pandémico"
    ]
  },

  "islm|fiscalContract|CRD": {
    arrivalTitle: "IS-LM · contracción fiscal bajo credibilidad acumulada",
    what: "Analizas una contracción fiscal bajo Alta credibilidad con buffer. La credibilidad acumulada permite que el ajuste sea ordenado, sin desanclaje de expectativas ni recesión adicional; el caso de referencia debe leerse en contexto, no como demostración de 'austeridad expansiva'.",
    shock: "Contracción fiscal: IS se desplaza a la izquierda. Si el banco central acompaña y las expectativas no se desanclan, parte de la caída de Y se compensa vía menores tasas e inversión privada.",
    graph: "IS se desplaza a la izquierda. El equilibrio se mueve a menor Y y puede tener menor i. La distancia al equilibrio inicial es contenida si la credibilidad reduce la prima de riesgo y el costo del financiamiento.",
    next: "Contrasta con FRG (Grecia 2010-2015) para ver cómo la fragilidad amplifica el costo. Lee la crónica de Suecia 1994-1998 para anclar en evidencia y comprender los factores complementarios.",
    hypothesis: "Con credibilidad institucional acumulada, sistema financiero saneado y régimen cambiario flexible que actúa como amortiguador, la contracción fiscal puede ejecutarse sin recesión adicional: el mercado lee el ajuste como señal de disciplina, no de crisis.",
    filter: "Alta credibilidad con buffer: meta de inflación creíble, consenso político transversal sobre la consolidación, sistema financiero saneado, espacio fiscal pre-existente, régimen cambiario flexible.",
    limits: "IS-LM permite mostrar la contracción inicial de demanda agregada, pero el caso sueco requiere lectura complementaria de economía abierta: depreciación previa, recuperación de competitividad, saneamiento bancario y expectativas fiscales interactuaron para limitar el costo del ajuste.",
    evidenceNow: {
      macro: [
        "PIB y crecimiento durante el ajuste",
        "Tasa de desempleo",
        "Balance fiscal estructural"
      ],
      financial: [
        "Spread soberano respecto al benchmark",
        "Tasas largas y convergencia hacia el mercado de referencia",
        "Tipo de cambio efectivo real"
      ],
      institutional: [
        "Expectativas de inflación",
        "Estado del sistema bancario y supervisión",
        "Comunicación del marco fiscal y autonomía del banco central"
      ]
    },
    evidenceLater: [
      "Deuda pública/PIB",
      "Crecimiento del PIB en años posteriores al ajuste",
      "Estabilidad de las expectativas y convergencia del spread"
    ],
    antiOverclaim: "Una consolidación sin recesión adicional resulta de una combinación específica de credibilidad acumulada, sistema financiero saneado, régimen cambiario flexible y ciclo externo favorable; no se exporta automáticamente a otros contextos.",
    cronicaKey: "suecia_1994_1998",
    returnText: "← Volver a Lentes · contracción fiscal · Alta credibilidad con buffer",
    omittedVariables: "El ciclo expansivo global de mediados de los 1990, la depreciación cambiaria post-MTC y la reforma laboral concomitante no se formalizan en IS-LM. La apertura externa no aparece en el equilibrio cerrado.",
    causalAttributionLimit: "La combinación virtuosa de ajuste con crecimiento admite atribución parcial al ciclo internacional favorable y a la depreciación cambiaria previa. La hipótesis institucional es plausible y complementaria, no excluyente.",
    falsificationCheck: "Si el crecimiento sueco se explicara principalmente por depreciación y ciclo externo, la tesis de credibilidad fiscal debería acotarse y compartir peso explicativo con esos canales.",
    deepDive: [
      "Composición gasto/impuestos del ajuste, evolución del balance estructural y desempleo desagregado",
      "Consolidaciones fiscales exitosas versus 'austeridad expansiva' (Alesina-Ardagna, Blanchard-Leigh)",
      "IS-LM no captura el canal externo (depreciación, competitividad, saneamiento bancario)",
      "Canadá 1994-1997 (consolidación con tipo de cambio flexible) y Finlandia 1993-1998 (consolidación post-crisis bancaria)"
    ]
  },

  "islm|fiscalContract|FRG": {
    arrivalTitle: "IS-LM · contracción fiscal bajo anclaje frágil y rigidez cambiaria",
    what: "Analizas una contracción fiscal bajo Anclaje frágil con régimen cambiario rígido. La ausencia de credibilidad fiscal previa, el sistema bancario en estrés y la imposibilidad de amortiguar el ajuste vía tipo de cambio amplifican el costo real del ajuste.",
    shock: "Contracción fiscal: IS se desplaza a la izquierda. Sin credibilidad acumulada y sin TC propio, el mercado lee el ajuste como señal de crisis y la prima de riesgo sube; la inversión privada cae adicionalmente por el aumento del costo de financiamiento.",
    graph: "IS se desplaza marcadamente a la izquierda. Si la prima de riesgo soberano y el estrés bancario elevan la tasa efectiva de financiamiento, la inversión privada cae adicionalmente. No es crowding-out convencional por expansión fiscal: es contracción amplificada por riesgo soberano y canal bancario.",
    next: "Contrasta con CRD (Suecia 1994-1998) para ver el rol de la credibilidad acumulada. Lee la crónica de Grecia 2010-2015 para anclar en evidencia y comprender el rol del régimen euro y del PSI.",
    hypothesis: "Con anclaje frágil y rigidez cambiaria, la contracción fiscal genera caída acumulada de Y mayor que la sugerida por el multiplicador estándar; la lectura de mercado amplifica el ajuste vía prima de riesgo y canal bancario.",
    filter: "Anclaje frágil: ausencia de credibilidad fiscal acumulada, sistema financiero en estrés, régimen cambiario que impide absorción nominal, expectativas de salida del régimen latentes.",
    limits: "IS-LM no captura la rigidez cambiaria del régimen euro, la fuga de depósitos hacia bancos del norte, ni el canal financiero externo. Para casos de unión monetaria sin transferencias fiscales, el equilibrio relevante exige extender el modelo.",
    evidenceNow: {
      macro: [
        "PIB acumulado y trimestral",
        "Desempleo total y juvenil",
        "Inversión bruta y formación bruta de capital fijo"
      ],
      financial: [
        "Spread soberano a 10 años y CDS",
        "Depósitos del sistema bancario",
        "Tasa efectiva de financiamiento privado"
      ],
      institutional: [
        "Confianza en el régimen cambiario y prima de salida del euro",
        "Estado del programa con la Troika y revisiones del FMI",
        "Recapitalización del sistema bancario"
      ]
    },
    evidenceLater: [
      "Deuda pública/PIB y trayectoria de sostenibilidad",
      "Multiplicador fiscal ex-post estimado",
      "Trauma político y consecuencias de mediano plazo (referéndum 2015)"
    ],
    antiOverclaim: "El colapso griego no es atribución permanente al país: las decisiones acumuladas y el diseño de la unión monetaria son co-responsables. La generalización requiere atender al régimen cambiario y al estado del sistema financiero.",
    cronicaKey: "grecia_2010_2015",
    returnText: "← Volver a Lentes · contracción fiscal · Anclaje frágil",
    omittedVariables: "La heterogeneidad sectorial del ajuste, la fuga de depósitos hacia bancos del norte de la eurozona y la dinámica política interna no se modelan en IS-LM. La rigidez cambiaria del euro no aparece como variable.",
    causalAttributionLimit: "La profundidad del colapso admite lectura por subestimación del multiplicador fiscal en el diseño del programa, separada de la fragilidad institucional. Ambas son complementarias; el FMI reconoce explícitamente la primera en su ex-post evaluation 2013.",
    falsificationCheck: "Si la caída se explicara principalmente por error de multiplicador y no por fragilidad institucional ni régimen euro, habría que cambiar el peso causal hacia el diseño del programa más que hacia la configuración institucional.",
    deepDive: [
      "Multiplicadores fiscales ex-post, fuga de depósitos por país y trayectoria de la deuda",
      "Diseño incompleto de la unión monetaria y ausencia de prestamista fiscal común (Mundell, áreas monetarias óptimas)",
      "IS-LM no formaliza la rigidez cambiaria del euro ni el canal financiero externo",
      "Portugal 2011, Irlanda 2010 y España 2012 (otros programas concurrentes en la eurozona)"
    ]
  },

  "islmbp|globalRecession|RIG": {
    arrivalTitle: "IS-LM-BP · recesión global bajo régimen rígido",
    what: "Analizas un sudden stop / recesión global bajo Rigidez cambiaria. Sin tipo de cambio propio para amortiguar y con deuda dolarizada, el ajuste real se vuelve traumático y la sostenibilidad del régimen entra en cuestión.",
    shock: "Sudden stop: BP se desplaza, salidas de capital reducen base monetaria 1:1 por la regla de la caja de conversión. IS cae por contracción de demanda; la depreciación cambiaria está bloqueada por el peg.",
    graph: "BP se desplaza. Sin TC propio, el ajuste pasa por contracción de Y y deflación nominal. Observa que el modelo no puede cerrar con depreciación cambiaria: el peso de la corrección recae sobre cantidades.",
    next: "Contrasta con CHL en el mismo lente para ver cómo la flotación amortigua. Lee la crónica argentina_convertibility para ver el desenlace 1998-2002 y la salida de enero 2002.",
    hypothesis: "Bajo régimen rígido sin disciplina fiscal acoplada, un sudden stop activa una espiral de contracción real, deflación y stress de deuda que el régimen monetario no puede absorber. El ajuste recae enteramente sobre cantidades; la salida del régimen se vuelve endógena.",
    filter: "Rigidez cambiaria: caja de conversión sin regla fiscal vinculante, deuda pública dolarizada, pass-through perfecto a precios, restricción externa estructural, federalismo fiscal con incentivos al common pool.",
    limits: "IS-LM-BP captura el equilibrio estático del impacto. La dinámica de la espiral —deflación, stress bancario, fugas, corralito— exige iterar el modelo. La crisis política y la decisión de salida del régimen son endógenas y no se modelan.",
    evidenceNow: {
      macro: [
        "PIB y desempleo trimestral (INDEC)",
        "Salarios reales y nominales",
        "Deflación o caída del IPC en Y2001"
      ],
      financial: [
        "Spread soberano EMBI+ Argentina",
        "Reservas internacionales y base monetaria",
        "Depósitos bancarios por moneda"
      ],
      institutional: [
        "Compromiso público con la convertibilidad y comunicación oficial",
        "Negociación con FMI: Blindaje 2000 y Megacanje 2001",
        "Riesgo de salida del régimen y prima política implícita"
      ]
    },
    evidenceLater: [
      "Probabilidad implícita de devaluación en bonos largos",
      "Composición de la deuda pública en moneda extranjera",
      "Tasa de desempleo estructural post-2002"
    ],
    antiOverclaim: "El colapso de la convertibilidad refleja inconsistencia entre régimen monetario rígido y marco fiscal frágil; no demuestra que toda caja de conversión fracase. Bulgaria post-1997 y Hong Kong 1997-1998 sostuvieron cajas con disciplina fiscal acoplada bajo shocks externos comparables.",
    cronicaKey: "argentina_convertibility",
    returnText: "← Volver a Lentes · recesión global · Rigidez cambiaria",
    omittedVariables: "Federalismo fiscal y endeudamiento provincial, dolarización de depósitos del sistema bancario, productividad sectorial diferencial, política de privatizaciones del periodo 1991-1999, y los efectos balance hoja de los pasivos en dólares de empresas no financieras.",
    causalAttributionLimit: "El colapso admite lectura por TC real apreciado tras la devaluación brasileña de 1999, por shock externo (crisis asiática y rusa 1997-1998), y por inconsistencia fiscal estructural (Mussa 2002). Las tres lecturas son complementarias, no excluyentes.",
    falsificationCheck: "Si una caja de conversión con disciplina fiscal acoplada hubiera sufrido el mismo desenlace, la tesis institucional perdería peso. El caso Bulgaria post-1997 (caja sostenida bajo shocks externos múltiples) y Hong Kong 1997-1998 (peg defendido con superávit fiscal) operan como falsificadores parciales: muestran que el régimen no falla por sí solo.",
    deepDive: [
      "EMBI+ Argentina 1998-2002, base monetaria, depósitos por moneda y series fiscales por nivel de gobierno (nación, provincias, obra social)",
      "Sudden stops y crisis de balanza de pagos bajo regímenes rígidos: Calvo, Izquierdo & Mejía (2008, NBER WP 14026); De la Torre, Levy Yeyati & Schmukler (2003)",
      "IS-LM-BP no formaliza la deflación nominal endógena ni el canal de balance hoja por currency mismatch",
      "Bulgaria post-1997 (caja sostenida con disciplina fiscal) y Hong Kong 1997-1998 (peg defendido con superávit fiscal en plena crisis asiática)"
    ]
  },

  "oada|oilUp|RIG": {
    arrivalTitle: "OA-DA · alza del petróleo bajo régimen rígido",
    what: "Analizas un alza del petróleo (shock de costos) bajo Rigidez cambiaria. La caja de conversión bloquea el canal cambiario como amortiguador; el shock se transmite directamente a OA y el ajuste real es más profundo que en regímenes flexibles.",
    shock: "Alza del petróleo: OA se desplaza hacia arriba e izquierda. P sube, Y cae. En régimen flexible, el TC absorbería parte del shock; bajo caja de conversión esa válvula no existe, y la corrección recae sobre cantidades y precios internos.",
    graph: "OA sube. El nuevo equilibrio tiene mayor P y menor Y. La distancia al equilibrio inicial es mayor que bajo flotación porque el TC no puede absorber el shock; el peso del ajuste pasa íntegro al ingreso real y a salarios reales.",
    next: "Contrasta con CHL en el mismo lente para ver cómo la flotación amortigua. Razona sobre la dinámica de Pᵉ: con la caja de conversión, ¿cómo se forman las expectativas si la regla cambiaria es la única ancla?",
    hypothesis: "Bajo caja de conversión, un shock externo de costos no se amortigua vía depreciación; recae sobre Y, salarios reales y márgenes. Si la disciplina fiscal acompaña, el régimen sobrevive el shock; si no, la inconsistencia se acumula y la prima de salida del régimen empieza a moverse.",
    filter: "Rigidez cambiaria: caja de conversión 1:1, política monetaria delegada al respaldo de reservas, sin política cambiaria autónoma, pass-through inmediato a precios, salarios nominales rígidos a la baja.",
    limits: "OA-DA muestra el equilibrio estático del primer shock. La dinámica multiperíodo bajo caja de conversión —en particular el ajuste de salarios reales y el efecto sobre solvencia de empresas con deuda dolarizada— requiere iterar el modelo o usar un marco más completo.",
    evidenceNow: {
      macro: [
        "IPC general y subyacente",
        "Salarios reales (INDEC)",
        "PIB y empleo en sectores transables vs. no transables"
      ],
      financial: [
        "Precio del petróleo (WTI, Brent)",
        "Reservas internacionales del BCRA",
        "Spread soberano y CDS Argentina"
      ],
      institutional: [
        "Comunicación oficial sobre la convertibilidad",
        "Margen fiscal y servicios de deuda en dólares",
        "Convenios colectivos y rigidez nominal"
      ]
    },
    evidenceLater: [
      "Salarios reales sectoriales (INDEC)",
      "Quiebras corporativas con pasivos en dólares",
      "Trayectoria del producto industrial post-shock"
    ],
    antiOverclaim: "Un alza del petróleo bajo caja de conversión es ejercicio pedagógico: el shock energético no fue el detonante histórico del colapso argentino. Sirve para mostrar el mecanismo de pass-through inmediato sin amortiguador cambiario, no para asignar causalidad al desenlace 2001.",
    cronicaKey: "argentina_convertibility",
    returnText: "← Volver a Lentes · petróleo · Rigidez cambiaria",
    omittedVariables: "El grado de indexación salarial sectorial, la composición energética de la canasta IPC, los subsidios cruzados al sector energético, y los efectos balance hoja sobre empresas con pasivos en dólares.",
    causalAttributionLimit: "El caso argentino combina shocks múltiples (Tequila, Asia/Rusia, real, sudden stop 2001); aislar el efecto petróleo es un ejercicio analítico, no histórico. La hipótesis institucional sobre rigidez cambiaria es independiente del shock específico.",
    falsificationCheck: "Si una economía con caja de conversión hubiera absorbido un alza energética sin tensión institucional ni stress de deuda, la tesis sobre rigidez como amplificador del shock perdería peso. La evidencia comparada (Hong Kong 1990s, Estonia pre-euro) sugiere que la caja sobrevive shocks reales si la disciplina fiscal y la flexibilidad de precios y salarios la acompañan.",
    deepDive: [
      "Pass-through energético en economías con peg, salarios reales sectoriales y composición IPC",
      "Caja de conversión y shocks de oferta: literatura sobre Argentina, Estonia y Hong Kong",
      "OA-DA no formaliza el canal de balance hoja por currency mismatch ni la rigidez salarial nominal a la baja",
      "Hong Kong 1991 (alza energética bajo HKD-USD peg) y Estonia 2008 (peg al euro durante crisis externa)"
    ]
  },

  "islm|fiscalContract|RIG": {
    arrivalTitle: "IS-LM · contracción fiscal bajo régimen rígido",
    what: "Analizas una contracción fiscal bajo Rigidez cambiaria. Sin tipo de cambio propio para amortiguar y con prima de riesgo soberano alta y persistente, el ajuste se interpreta como señal de stress y la inversión privada cae adicionalmente vía aumento del costo de financiamiento.",
    shock: "Contracción fiscal: IS se desplaza a la izquierda. Bajo caja de conversión, el banco central no puede acompañar bajando la tasa autónomamente; la tasa interna queda atada a la externa más prima de riesgo. Si esta última sube por la lectura de stress, el ajuste se amplifica.",
    graph: "IS se desplaza marcadamente a la izquierda. Sin política monetaria que pueda compensar, el equilibrio tiene menor Y sin alivio en i; si la prima de riesgo sube, i efectivo aumenta y la inversión privada cae. No es crowding-out convencional: es contracción amplificada por riesgo soberano.",
    next: "Contrasta con CHL (consolidación con flotación) y con CRD (Suecia 1994-1998, consolidación con depreciación previa y consenso transversal). Lee la crónica argentina_convertibility para ver el contexto de Blindaje 2000, Megacanje 2001 y Ley de Déficit Cero.",
    hypothesis: "Bajo caja de conversión y sin disciplina fiscal acumulada, una contracción fiscal de emergencia no se interpreta como restauración de solvencia sino como confirmación de stress. La prima de riesgo sube, el costo de financiamiento aumenta y el ajuste se amplifica vía contracción de la inversión privada y deflación nominal.",
    filter: "Rigidez cambiaria: caja de conversión sin política monetaria autónoma, sin regla fiscal vinculante, deuda pública dolarizada, federalismo fiscal con incentivos al common pool, sistema bancario con balance expuesto a riesgo soberano.",
    limits: "IS-LM no captura el régimen cambiario rígido ni el canal de balance hoja por currency mismatch. La interacción con el sistema bancario y la fuga de depósitos hacia el exterior son canales de amplificación que el modelo no formaliza.",
    evidenceNow: {
      macro: [
        "Saldo primario y financiero, nivel nacional y provincial",
        "PIB y desempleo (INDEC)",
        "Inversión privada y FBCF"
      ],
      financial: [
        "Spread EMBI+ Argentina",
        "Tasa interbancaria y tasas de préstamos privados",
        "Depósitos por moneda y fuga de capitales"
      ],
      institutional: [
        "Compromiso fiscal de la nación y de las provincias",
        "Programas con FMI: Blindaje 2000, ampliaciones 2001",
        "Comunicación oficial sobre la sostenibilidad de la convertibilidad"
      ]
    },
    evidenceLater: [
      "Trayectoria de la deuda pública/PIB",
      "Multiplicador fiscal ex-post estimado",
      "Recuperación post-2002 y rol del régimen poscolapso"
    ],
    antiOverclaim: "El colapso argentino no implica que toda contracción fiscal bajo régimen rígido fracase. La evidencia comparada (Estonia 2008-2010 bajo currency board EEK-EUR) muestra que bajo disciplina fiscal acumulada, sistema bancario sólido y consenso político, la consolidación bajo peg es viable aunque costosa. La especificidad argentina es la combinación de inconsistencia fiscal previa, federalismo descoordinado y sistema bancario con balance expuesto.",
    cronicaKey: "argentina_convertibility",
    returnText: "← Volver a Lentes · contracción fiscal · Rigidez cambiaria",
    omittedVariables: "Federalismo fiscal, cuasimonedas provinciales, exposición del sistema bancario a riesgo soberano, condiciones de los acuerdos con FMI, y la dinámica política interna que precipitó la salida del régimen.",
    causalAttributionLimit: "La profundidad del colapso admite lectura por error de diseño de los acuerdos FMI 2000-2001 (Blindaje insuficiente, Megacanje con condiciones onerosas), por la inconsistencia fiscal estructural acumulada (Mussa 2002), o por el shock externo (real brasileño 1999, fuga de capitales emergentes). Las tres lecturas son complementarias.",
    falsificationCheck: "Si una caja de conversión con disciplina fiscal acumulada y sistema bancario solvente hubiera ejecutado una contracción fiscal de magnitud equivalente sin desencadenar colapso, la tesis institucional sobre la inconsistencia previa quedaría falsificada. Estonia 2008-2010 (currency board EEK-EUR durante la Gran Recesión, con consolidación severa y sin colapso del régimen) opera como falsificador parcial.",
    deepDive: [
      "Saldo fiscal nacional y provincial 1991-2002, EMBI+, multiplicador fiscal estimado ex-post",
      "Consolidaciones fiscales bajo regímenes rígidos: Mussa (2002, PIIE); Estonia y Letonia 2008-2010",
      "IS-LM no formaliza el canal de balance hoja, la fuga de depósitos ni la dinámica del riesgo soberano",
      "Estonia 2008-2010 (currency board con consolidación exitosa) y Suecia 1994-1998 (consolidación con flotación; CRD)"
    ]
  }

});
