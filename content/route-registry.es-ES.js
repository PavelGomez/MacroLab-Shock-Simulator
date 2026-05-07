/* ========== ROUTE REGISTRY ES-ES ========== */
// Registro editorial de rutas: cápsula de aterrizaje + cierre narrativo.
// Clave: "tab|modelShockKey|configKey"
// Sprint 1: cinco rutas de alta prioridad. El resto queda pendiente para Sprint 2.
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
    evidenceNow: [
      "IPC energía y transables (INE)",
      "Expectativas de inflación a 12 y 24 meses (EEE, Banco Central)",
      "CLP/USD ante el shock energético"
    ],
    evidenceLater: [
      "Convergencia del IPC al rango meta (3%±1)",
      "Breakeven implícito en BTP/BTPU",
      "Salarios reales en sectores indexados a UF"
    ],
    antiOverclaim: "Este análisis muestra la dirección probable del ajuste, no su magnitud ni timing exacto. La credibilidad del BC es una variable continua acumulada en episodios anteriores; no se transfiere automáticamente a shocks futuros.",
    returnText: "← Volver a Lentes · petróleo · Chile 2026"
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
    evidenceNow: [
      "Spread EMBI o CDS soberano",
      "Expectativas inflacionarias de corto plazo",
      "Demanda de divisas / premium en cambio paralelo si existe"
    ],
    evidenceLater: [
      "Desanclaje persistente de expectativas a 24 meses",
      "Prima de riesgo soberana sostenida",
      "Salarios indexados acelerando ante inflación pasada"
    ],
    antiOverclaim: "La fragilidad institucional no es un destino inevitable: es el resultado de decisiones acumuladas. La trayectoria descrita ilustra un mecanismo, no una predicción para ningún país específico.",
    returnText: "← Volver a Lentes · petróleo · Anclaje frágil"
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
    evidenceNow: [
      "Precio del cobre (Cochilco, LME)",
      "CLP/USD en tiempo real",
      "Balance de la cuenta corriente (Banco Central)"
    ],
    evidenceLater: [
      "Balance fiscal efectivo vs. estructural (Dipres)",
      "Prima soberana chilena (CDS a 5 años)",
      "IMACEC sectorial: exportaciones no mineras"
    ],
    antiOverclaim: "IS-LM-BP simplifica la dinámica externa. El ajuste real depende del nivel de reservas, la credibilidad de la regla fiscal y el contexto global de liquidez en mercados emergentes.",
    returnText: "← Volver a Lentes · cobre · Chile 2026"
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
    evidenceNow: [
      "IMACEC mensual (Banco Central)",
      "TPM y tasa de política (BCCh)",
      "Prima soberana CDS a 5 años (Chile)"
    ],
    evidenceLater: [
      "Balance fiscal efectivo vs. estructural (Dipres)",
      "Expectativas de crecimiento a 12 meses",
      "Inversión privada bruta (cuentas nacionales)"
    ],
    antiOverclaim: "IS-LM supone economía cerrada o con canal externo simplificado. La lectura institucional agrega la dimensión de credibilidad que el modelo no formaliza. La magnitud del multiplicador real depende de factores no modelados.",
    returnText: "← Volver a Lentes · contracción fiscal · Chile 2026"
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
    evidenceNow: [
      "IMACEC mensual (Banco Central)",
      "Gasto de gobierno efectivo vs. presupuestado (Dipres)",
      "Balance del FEES (Dirección de Presupuestos)"
    ],
    evidenceLater: [
      "Cicatrización del mercado laboral (tasa de desempleo, NAIRU estimada)",
      "Recuperación de la inversión privada (FBCF)",
      "Balance fiscal estructural post-pandemia (CFA)"
    ],
    antiOverclaim: "La respuesta chilena a la pandemia fue posible en parte por condiciones institucionales previas únicas: espacio fiscal acumulado y credibilidad del BC. No es un modelo exportable sin ajustar por las condiciones de cada economía.",
    returnText: "← Volver a Lentes · pandemia · Chile 2026"
  }

});
