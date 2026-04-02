const charts = {};
const EPS = 1e-9;

const dashboardData = {
  years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  gdp: [5.851415538936799, 6.223896785104821, 6.155340018560951, 3.308508247064812, 1.792649471410468, 2.1519424998116987, 1.7530387490482635, 1.3576953734787622, 3.9900294778549616, 0.6442234026743154, -6.139696941208294, 11.337403240996924, 2.0639186425519096, 0.6770248315859373, 2.8051263710562324, 2.4592547478091253],
  inflation: [2.972868111, 4.437732798, 1.486964626, 2.838074806, 4.646381038, 4.378512128, 2.70872463, 2.269593636, 2.14098658, 3.000480211, 2.972870899, 7.17284093, 12.78165415, 3.37450056, 4.527165172795, 3.45240376149631],
  unemployment: [7.2101288890971, 6.8146096671283, 6.2246556879872, 5.7817319689281, 6.2055968190967, 5.8704192154739, 6.2004127300428, 6.5126532130199, 7.1464633153887, 7.0631690877494, 10.286318749044, 7.1898934478904, 7.8627488308129, 8.4756393474728, 8.079730080387, 8.049513652087],
  tpm: [1.422, 4.66666666666667, 5.00910931174089, 4.92237903225806, 3.75602409638554, 3.06, 3.5, 2.73684210526316, 2.54979674796748, 2.49497991967871, 0.785856573705179, 1.195, 8.508, 10.5, 6.21975806451613, 4.88608870967742],
  fx: [510.37664, 483.364047619048, 486.746558704453, 494.995161290323, 570.005903614458, 654.249, 676.83242063492, 649.3287854251, 640.290772357724, 702.631048387097, 792.221832669323, 759.27284, 872.33152, 839.073400809716, 943.582419354839, 951.641209677419]
};

const dashboardRanges = {
  full: [0, dashboardData.years.length - 1],
  mid: [9, dashboardData.years.length - 1],
  recent: [11, dashboardData.years.length - 1]
};

const sequenceItems = [
  {
    title: 'Shock',
    body: 'Es el disparador identificable del episodio: guerra, alza del petróleo, pandemia, terremoto, endurecimiento de la Fed, ajuste fiscal o aumento de incertidumbre. No debe confundirse con sus manifestaciones posteriores, como depreciación, inflación o recesión.'
  },
  {
    title: 'Variable exógena',
    body: 'Es la magnitud que el modelo toma como dada para esa vuelta analítica: gasto público, dinero real, tasa externa, productividad, costo importado, demanda externa, confianza o precio del cobre.'
  },
  {
    title: 'Parámetro',
    body: 'Resume una regularidad de comportamiento: propensión a consumir, sensibilidad de la inversión a la tasa, demanda de dinero, pendiente de exportaciones netas o sensibilidad de precios a la brecha.'
  },
  {
    title: 'Curva',
    body: 'Representa de forma disciplinada una relación relevante. No agota la realidad, pero ayuda a ver qué combinaciones dejaron de ser compatibles con el equilibrio previo.'
  },
  {
    title: 'Equilibrio',
    body: 'Debe leerse como punto focal comparativo y no como estado real e inmutable. Permite responder hacia dónde tendería la economía si ese mecanismo dominara el ajuste.'
  },
  {
    title: 'Mecanismo de transmisión',
    body: 'Es la cadena causal: petróleo → costos → inflación → BCCh; cobre → exportaciones → tipo de cambio → recaudación; Fed → flujos de capital → depreciación → pass-through.'
  },
  {
    title: 'Trayectoria probable',
    body: 'Entre el primer impacto y el punto focal hay rezagos, compensaciones, segundas vueltas, fricciones y cambios de comportamiento. Por eso importa pensar en persistencia, convergencia o escalamiento.'
  },
  {
    title: 'Filtro institucional chileno',
    body: 'BCCh autónomo, flotación cambiaria, regla fiscal, CFA, CMF, competencia y estadísticas oficiales funcionan como una filigrana de incentivos que modifica la transmisión y el costo de la indisciplina.'
  },
  {
    title: 'Dato que conviene mirar',
    body: 'El cierre del análisis exige un observable: IPC, IPC SAE, TPM, CLP/USD, cobre, IMACEC, desempleo, crédito, spreads, exportaciones o balance fiscal. Sin eso, el análisis queda en intuición verbal.'
  }
];

const shockExamples = [
  {
    tipo: 'Shock de oferta / costos',
    disparador: 'Conflicto Irán / Hormuz 2026 o salto del petróleo',
    exogena: 'Costos energéticos, combustibles, seguros, fletes, costos importados',
    modelos: 'OA-DA + IS-LM-BP',
    mecanismo: 'Suben costos, se encarecen importados y puede aparecer depreciación con pass-through.',
    ejemplo: 'Guerra en Medio Oriente y presión sobre combustibles.',
    dato: 'Combustibles, IPC, IPC SAE, CLP/USD, costos logísticos',
    implicancia: 'Empresas: márgenes y costos; hogares: transporte e inflación; gobierno: presión distributiva y fiscal.'
  },
  {
    tipo: 'Shock de demanda',
    disparador: 'Expansión fiscal o monetaria relevante',
    exogena: 'G, M/P, confianza, crédito',
    modelos: 'IS-LM + OA-DA',
    mecanismo: 'Aumenta la demanda agregada, sube Y y eventualmente aparecen presiones de tasa y precios.',
    ejemplo: 'Transferencias extraordinarias o fuerte relajación financiera.',
    dato: 'PIB, IMACEC, inflación, tasas, crédito',
    implicancia: 'Empresas: ventas y capacidad; hogares: ingreso y consumo; gobierno: brecha, inflación y financiamiento.'
  },
  {
    tipo: 'Shock mixto oferta-demanda',
    disparador: 'Pandemia o reapertura abrupta',
    exogena: 'Productividad, movilidad, demanda reprimida, confianza',
    modelos: 'OA-DA + IS-LM',
    mecanismo: 'Primero cae la oferta y la movilidad; luego la reapertura puede empujar demanda y precios.',
    ejemplo: 'COVID-19 2020–2022.',
    dato: 'IMACEC, empleo, inflación subyacente, servicios, TPM',
    implicancia: 'Empresas: operación y ventas; hogares: empleo e ingresos; gobierno: estabilización y apoyo transitorio.'
  },
  {
    tipo: 'Shock externo-financiero',
    disparador: 'Subida de la tasa internacional o recesión global',
    exogena: 'i*, demanda externa, flujos de capital, prima de riesgo',
    modelos: 'IS-LM-BP',
    mecanismo: 'Cambian flujos y condiciones financieras; se mueve el tipo de cambio y se ajustan NX y actividad.',
    ejemplo: 'Endurecimiento de la Fed o desaceleración global.',
    dato: 'CLP/USD, tasas largas, cobre, exportaciones, spreads',
    implicancia: 'Empresas: financiamiento y exportaciones; hogares: crédito y empleo; gobierno: mayor costo de deuda.'
  },
  {
    tipo: 'Shock socio-político / incertidumbre',
    disparador: 'Estallido social, conflictividad o incertidumbre institucional',
    exogena: 'b0, c0, spread, confianza, prima de riesgo',
    modelos: 'IS-LM-BP + OA-DA',
    mecanismo: 'Cae inversión, sube riesgo y puede depreciarse la moneda; también puede dañarse oferta o coordinación.',
    ejemplo: 'Chile 2019–2023 en distintos momentos.',
    dato: 'CLP/USD, inversión, encuestas de expectativas, desempleo, spreads',
    implicancia: 'Empresas: posterga inversión; hogares: cautela y empleo; gobierno: presión de legitimidad y estabilización.'
  },
  {
    tipo: 'Shock de política económica',
    disparador: 'Endurecimiento o relajación de BCCh / ajuste fiscal',
    exogena: 'TPM, M/P, G, T',
    modelos: 'IS-LM, IS-LM-BP, OA-DA',
    mecanismo: 'La política altera demanda, crédito, tasa, tipo de cambio y trayectoria inflacionaria.',
    ejemplo: 'Endurecimiento 2021–2023 o consolidación fiscal.',
    dato: 'TPM, inflación, IMACEC, balance fiscal, CLP/USD',
    implicancia: 'Empresas: costo de capital; hogares: crédito y empleo; gobierno: credibilidad y sostenibilidad.'
  }
];

const shockTypeCards = [
  {
    title: 'Oferta y costos',
    body: 'Se ve mejor cuando el evento golpea energía, logística, capacidad, productividad o costos importados. Su firma típica es menor actividad con mayor presión de precios.'
  },
  {
    title: 'Demanda',
    body: 'Se observa cuando el episodio altera gasto autónomo, confianza, crédito o dinero real. Suele mover primero ventas, actividad y luego tasas o precios.'
  },
  {
    title: 'Mixto',
    body: 'Combina restricciones de oferta con cambios de demanda. Es frecuente en episodios grandes y secuenciales, como pandemia, reapertura o crisis político-social.'
  },
  {
    title: 'Externo-financiero',
    body: 'Fed, recesión global, cobre, riesgo geopolítico o reversión de flujos. Para Chile suele importar mucho el CLP/USD, la tasa y el canal de NX.'
  },
  {
    title: 'Socio-político',
    body: 'Afecta coordinación, inversión, legitimidad, confianza y prima de riesgo. No siempre aparece primero en precios; a veces la primera señal es la espera o el freno inversor.'
  },
  {
    title: 'Política económica',
    body: 'Cambios de TPM, liquidez, gasto o impuestos alteran el entorno macro desde dentro del sistema de política. Su eficacia depende del régimen y del punto del ciclo.'
  }
];

const transmissionRows = [
  {
    canal: 'Energía y combustibles',
    disparador: 'Guerra, sanciones, cuellos marítimos, alza del petróleo',
    primeras: 'Combustibles, fletes, costos importados, expectativas de inflación',
    modelos: 'OA-DA + IS-LM-BP',
    sector: 'Transporte, alimentos, agro, logística, manufactura intensiva en energía'
  },
  {
    canal: 'Cobre y términos de intercambio',
    disparador: 'Cambio en demanda china o precio internacional',
    primeras: 'Exportaciones, CLP/USD, recaudación, inversión minera',
    modelos: 'IS-LM-BP',
    sector: 'Minería, proveedores, regiones mineras, ingresos fiscales'
  },
  {
    canal: 'Tipo de cambio',
    disparador: 'Alza de i*, caída del cobre, riesgo local o shock externo',
    primeras: 'CLP/USD, precios importados, competitividad, costo de deuda',
    modelos: 'IS-LM-BP + OA-DA',
    sector: 'Importadores, exportadores, retail, consumo durable, deuda en dólares'
  },
  {
    canal: 'Tasas y crédito',
    disparador: 'Cambio en TPM o condiciones financieras',
    primeras: 'Tasas de mercado, crédito comercial, hipotecario y consumo',
    modelos: 'IS-LM + IS-LM-BP',
    sector: 'Construcción, inversión, consumo durable, pequeñas empresas'
  },
  {
    canal: 'Empleo y salarios',
    disparador: 'Desaceleración, shock sectorial o rebote cíclico',
    primeras: 'Vacantes, contratación, desempleo, salarios reales',
    modelos: 'OA-DA + IS-LM',
    sector: 'Servicios, comercio, construcción, sectores transables'
  },
  {
    canal: 'Consumo y confianza',
    disparador: 'Transferencias, caída de ingresos, incertidumbre o crédito',
    primeras: 'Ventas minoristas, consumo, encuestas de expectativas',
    modelos: 'IS-LM',
    sector: 'Retail, servicios personales, consumo durable'
  },
  {
    canal: 'Inversión e incertidumbre',
    disparador: 'Incertidumbre institucional, prima de riesgo, costo de capital',
    primeras: 'b0, proyectos postergados, importación de bienes de capital',
    modelos: 'IS-LM-BP + IS-LM',
    sector: 'Minería, infraestructura, construcción, M&A'
  },
  {
    canal: 'Exportaciones netas',
    disparador: 'Recesión global, depreciación, apreciación o shock comercial',
    primeras: 'Exportaciones, importaciones, balanza comercial',
    modelos: 'IS-LM-BP',
    sector: 'Minería, agro, salmones, forestal, comercio importador'
  }
];

const institutionRows = [
  {
    institucion: 'Banco Central de Chile',
    funcion: 'Velar por la estabilidad de la moneda y el normal funcionamiento de los pagos internos y externos; conducir la política monetaria y contribuir a la estabilidad financiera.',
    credibilidad: 'Ancla nominal, baja inflación, previsibilidad monetaria y funcionamiento del sistema de pagos.',
    oportunismo: 'Contiene la tentación de monetizar desequilibrios o usar la política monetaria con fines coyunturales de corto plazo.',
    senales: 'TPM, IPoM, RPM, IEF, minutas, regulación cambiaria excepcional.',
    rol: 'Amortigua shocks vía tasa, liquidez y comunicación; bajo flotación permite que el tipo de cambio absorba parte del ajuste.'
  },
  {
    institucion: 'Ministerio de Hacienda',
    funcion: 'Define y coordina la política fiscal y la conducción general de las finanzas públicas.',
    credibilidad: 'Sostiene reputación fiscal, financiamiento soberano y previsibilidad del manejo presupuestario.',
    oportunismo: 'Limita el sesgo procíclico y el uso discrecional del gasto sin justificación intertemporal.',
    senales: 'Presupuesto, metas fiscales, informes de finanzas públicas, deuda y estrategia de financiamiento.',
    rol: 'En shocks severos puede amortiguar con gasto y medidas transitorias, pero bajo disciplina fiscal.'
  },
  {
    institucion: 'Dirección de Presupuestos / marco fiscal',
    funcion: 'Opera el presupuesto y los cálculos del balance estructural; articula el marco fiscal de mediano plazo.',
    credibilidad: 'Ayuda a sostener consistencia entre ingresos estructurales, gasto y deuda.',
    oportunismo: 'Contiene la tentación de gastar ingresos transitorios como si fueran permanentes.',
    senales: 'Ejecución presupuestaria, IFP, balance estructural y trayectoria de deuda.',
    rol: 'Permite distinguir amortiguación legítima de deterioro fiscal persistente.'
  },
  {
    institucion: 'Consejo Fiscal Autónomo',
    funcion: 'Evalúa y monitorea reglas fiscales vigentes, sostenibilidad y metodología del balance estructural.',
    credibilidad: 'Aumenta transparencia, vigilancia técnica y costo reputacional de desvíos fiscales.',
    oportunismo: 'Contiene sesgos de maquillaje contable o relajación silenciosa de metas.',
    senales: 'Informes trimestrales, opiniones sobre reglas, advertencias de sostenibilidad.',
    rol: 'En shocks ayuda a separar respuesta contracíclica de riesgo fiscal acumulado.'
  },
  {
    institucion: 'Comisión para el Mercado Financiero',
    funcion: 'Regula, supervisa y fiscaliza el mercado financiero con foco en correcto funcionamiento, desarrollo y estabilidad.',
    credibilidad: 'Fortalece confianza en intermediarios, fe pública y estabilidad del sistema financiero.',
    oportunismo: 'Reduce arbitrajes, riesgo excesivo, problemas de conducta y fragilidad prudencial.',
    senales: 'Normativa, supervisión, comunicados y reportes del sistema financiero.',
    rol: 'Clave cuando el shock viaja por crédito, spreads, liquidez o stress financiero.'
  },
  {
    institucion: 'Grupo de Política Monetaria',
    funcion: 'Entrega una referencia académica no vinculante sobre la TPM y el entorno macro.',
    credibilidad: 'Aporta benchmarking externo y disciplina el debate público sobre inflación y actividad.',
    oportunismo: 'Reduce opacidad y facilita evaluación crítica de la decisión monetaria.',
    senales: 'Comunicados previos a reuniones de TPM y recomendaciones públicas.',
    rol: 'Útil para contrastar decisiones del BCCh con una referencia técnica externa.'
  },
  {
    institucion: 'Fiscalía Nacional Económica',
    funcion: 'Defiende y promueve la libre competencia en representación del interés público.',
    credibilidad: 'Ayuda a sostener mercados más competitivos y menos propensos a abusos de poder de mercado.',
    oportunismo: 'Contiene colusión, abusos de posición dominante y concentraciones dañinas.',
    senales: 'Investigaciones, control de concentraciones, acciones ante TDLC, advocacy.',
    rol: 'Importa cuando shocks de costos o precios se mezclan con márgenes o estructura de mercado.'
  },
  {
    institucion: 'TDLC',
    funcion: 'Órgano jurisdiccional especializado en libre competencia.',
    credibilidad: 'Vuelve creíble el enforcement de reglas de competencia y la corrección de conductas anticompetitivas.',
    oportunismo: 'Contiene prácticas que restrinjan oferta, eleven precios o distorsionen mercados.',
    senales: 'Sentencias, resoluciones, acuerdos extrajudiciales e instrucciones generales.',
    rol: 'Relevante para analizar persistencia de márgenes, concentración y rigideces sectoriales.'
  },
  {
    institucion: 'INE',
    funcion: 'Produce y difunde estadísticas oficiales del país y articula el sistema estadístico nacional.',
    credibilidad: 'Compra verificabilidad: sin datos confiables no hay evaluación seria de coyuntura ni política.',
    oportunismo: 'Reduce opacidad informativa y arbitrariedad diagnóstica.',
    senales: 'IPC, desempleo, encuestas y estadísticas oficiales.',
    rol: 'Provee la evidencia mínima para cerrar el circuito entre modelo, hipótesis y realidad.'
  },
  {
    institucion: 'Apertura comercial + flotación cambiaria',
    funcion: 'Arreglo institucional que expone a Chile a shocks globales, pero también facilita ajuste de precios relativos y reasignación.',
    credibilidad: 'Permite política monetaria independiente y una señal de precios externos más transparente.',
    oportunismo: 'Hace más visible el costo de desequilibrios y de políticas inconsistentes.',
    senales: 'CLP/USD, TCR, cuenta corriente, balanza comercial y términos de intercambio.',
    rol: 'Bajo shock externo, el tipo de cambio absorbe parte del ajuste y revela tensiones internas y globales.'
  }
];

const glossaryGroups = [
  {
    title: 'Bloque 1 · Núcleo analítico',
    items: [
      ['Shock', 'Perturbación exógena que altera el equilibrio previo. Ejemplo: guerra, alza del petróleo, pandemia o ajuste fiscal.'],
      ['Variable exógena', 'Magnitud tomada como dada por el modelo en esa vuelta analítica: G, M/P, i*, costo importado o productividad.'],
      ['Variable endógena', 'Magnitud determinada dentro del modelo: producción, tasa, precios o exportaciones netas.'],
      ['Parámetro', 'Coeficiente que resume una regularidad de comportamiento: c1, b2, x1, γ.'],
      ['Intercepto', 'Nivel base de una relación cuando otras variables relevantes se mantienen constantes.'],
      ['Pendiente', 'Mide cuánto cambia una variable ante la variación de otra; define inclinación y sensibilidad.'],
      ['Equilibrio', 'Punto donde las relaciones del modelo se satisfacen simultáneamente; sirve como foco comparativo.'],
      ['Mecanismo de transmisión', 'Cadena causal que conecta el shock con sus efectos económicos.'],
      ['Trayectoria', 'Camino plausible entre el impacto inicial y un resultado posterior, con rezagos y fricciones.'],
      ['Dato que conviene mirar', 'Observable que permite contrastar la lectura del modelo con la realidad.']
    ]
  },
  {
    title: 'Bloque 2 · Modelos y curvas',
    items: [
      ['IS', 'Conjunto de combinaciones de Y e i compatibles con equilibrio en bienes.'],
      ['LM', 'Conjunto de combinaciones de Y e i compatibles con equilibrio monetario.'],
      ['BP', 'Condición externa; en el MVP es horizontal por alta movilidad de capitales.'],
      ['OA', 'Oferta agregada; relaciona producción y precios consistentes con costos y expectativas.'],
      ['DA', 'Demanda agregada; combina producción y precios compatibles con equilibrio del lado de la demanda.'],
      ['Crowding-out', 'Desplazamiento de inversión privada por alza de tasa o apreciación asociada a impulso fiscal.'],
      ['Acelerador', 'Mecanismo por el cual una mayor actividad empuja inversión inducida.'],
      ['Producto natural', 'Nivel de producción consistente con inflación estable en el mediano plazo.'],
      ['Brecha de producto', 'Diferencia entre producción observada y producto natural.'],
      ['Shock de oferta', 'Golpea capacidad, costos o productividad.'],
      ['Shock de demanda', 'Mueve gasto autónomo, dinero o confianza.'],
      ['Shock mixto', 'Combina oferta y demanda en secuencia o simultáneamente.']
    ]
  },
  {
    title: 'Bloque 3 · Economía abierta, precios y política',
    items: [
      ['Tipo de cambio nominal', 'Precio de la moneda extranjera en pesos; un valor mayor implica depreciación del peso.'],
      ['Tipo de cambio real', 'Indicador de competitividad que ajusta el tipo de cambio por precios internos y externos.'],
      ['Inflación', 'Aumento sostenido del nivel general de precios.'],
      ['Desinflación', 'Caída de la inflación sin que los precios necesariamente retrocedan.'],
      ['Pass-through', 'Grado en que una depreciación se transmite a precios internos.'],
      ['Costos importados', 'Costo en pesos de insumos o bienes externos; sube con depreciación o shock global.'],
      ['Productividad', 'Producción obtenida por unidad de insumo; si mejora, eleva capacidad y reduce presión de costos.'],
      ['TPM', 'Tasa de Política Monetaria definida por el BCCh.'],
      ['Credibilidad', 'Creencia de que autoridades e instituciones harán lo que anuncian de forma consistente.'],
      ['Expectativas', 'Proyecciones de agentes sobre inflación, actividad, tipo de cambio o política.'],
      ['Prima de riesgo', 'Compensación adicional exigida por incertidumbre o vulnerabilidad.'],
      ['Flotación cambiaria', 'Régimen donde el tipo de cambio se determina principalmente por mercado.']
    ]
  },
  {
    title: 'Bloque 4 · Instituciones y orden macro',
    items: [
      ['Autonomía del banco central', 'Diseño que separa la política monetaria de incentivos políticos de corto plazo.'],
      ['Regla fiscal', 'Conjunto de criterios que disciplina el comportamiento del gasto, balance o deuda pública.'],
      ['Apertura comercial', 'Exposición de la economía al comercio global; abre oportunidades y transmite shocks externos.'],
      ['Coordinación', 'Capacidad de actores para ajustar expectativas y acciones de forma compatible con estabilidad.'],
      ['Enforcement', 'Capacidad efectiva de supervisar, exigir cumplimiento y sancionar desviaciones.'],
      ['Auditabilidad', 'Posibilidad de verificar decisiones, cifras y procedimientos.'],
      ['Transparencia', 'Disponibilidad de información suficiente para evaluar diagnósticos y políticas.'],
      ['Rendición de cuentas', 'Obligación de justificar decisiones y responder por sus resultados.']
    ]
  }
];

const ISLM_DEFAULTS = {
  c0: 120,
  c1: 0.68,
  b0: 95,
  b1: 0.08,
  b2: 22,
  G: 220,
  T: 180,
  MP: 390,
  d1: 0.9,
  d2: 55,
  iFixed: 4.5
};

const ISLM_REGIMES = {
  upward: 'LM con pendiente positiva',
  horizontal: 'LM horizontal con i fijada exógenamente'
};

const ISLM_SHOCKS = {
  none: {
    label: 'Sin shock',
    delta: {},
    trigger: 'No hay cambio exógeno adicional.',
    exogenous: 'Ninguna variable exógena cambia.',
    parameters: 'Se mantienen constantes los parámetros base.',
    curves: 'No se desplaza ninguna curva.',
    mechanism: 'La economía permanece en la configuración docente base.',
    trajectory: 'La trayectoria probable es de continuidad de la configuración inicial.',
    filter: 'El filtro institucional no cambia la lectura de base.',
    watch: 'PIB/IMACEC, tasas de mercado, crédito e inversión.',
    sector: 'Sirve como benchmark para comparar sensibilidad de consumo, inversión y tasa.',
    reality: 'Base pedagógica coherente con una economía cerrada simplificada.'
  },
  fiscalExpand: {
    label: 'Expansión fiscal',
    delta: { G: 30 },
    trigger: 'Aumenta el gasto público autónomo.',
    exogenous: 'Sube G.',
    parameters: 'Aumenta el gasto autónomo agregado.',
    curves: 'IS se desplaza a la derecha.',
    mechanism: 'El mayor gasto empuja la demanda agregada; si la LM tiene pendiente positiva, sube la tasa.',
    trajectory: 'Primero sube la actividad; luego puede aparecer crowding-out parcial si el costo del dinero sube.',
    filter: 'En Chile, la regla fiscal y la credibilidad del marco presupuestario condicionan cuán persistente puede ser este impulso.',
    watch: 'Actividad, balance fiscal, tasas largas, inversión y empleo.',
    sector: 'Favorece sectores ligados al gasto público y demanda interna; puede tensionar financiamiento.',
    reality: 'Puede venir de reconstrucción, mayor ejecución o una respuesta contracíclica intensa.'
  },
  fiscalContract: {
    label: 'Contracción fiscal',
    delta: { G: -30 },
    trigger: 'Cae el gasto público autónomo.',
    exogenous: 'Baja G.',
    parameters: 'Disminuye el gasto autónomo agregado.',
    curves: 'IS se desplaza a la izquierda.',
    mechanism: 'La demanda agregada se enfría y la tasa puede ceder si la LM es positiva.',
    trajectory: 'La actividad cae primero; luego puede mejorar la lectura de sostenibilidad o aliviar presiones de tasa.',
    filter: 'En Chile, una consolidación creíble puede comprar disciplina, pero su costo real depende del punto del ciclo.',
    watch: 'Actividad, empleo, balance fiscal y tasas.',
    sector: 'Golpea sectores dependientes del gasto interno y puede debilitar inversión complementaria.',
    reality: 'Útil para discutir ajuste, credibilidad y costo cíclico.'
  },
  monetaryExpand: {
    label: 'Expansión monetaria',
    delta: { MP: 55 },
    trigger: 'Aumenta el dinero real disponible o baja la tasa de política.',
    exogenous: 'Sube M/P.',
    parameters: 'Mejoran las condiciones monetarias.',
    curves: 'LM se desplaza a la derecha si tiene pendiente positiva; con LM horizontal el cambio es absorbido por la acomodación.',
    mechanism: 'Baja la tasa compatible con equilibrio monetario y mejora el gasto sensible al interés.',
    trajectory: 'En el corto plazo sube la actividad; si la economía estuviera cerca de capacidad, luego conviene mirar precios con OA-DA.',
    filter: 'En Chile, el BCCh ajusta este canal dentro de un régimen de metas de inflación y comunicación explícita.',
    watch: 'TPM, tasas de mercado, crédito, inversión y actividad.',
    sector: 'Favorece construcción, durables, inversión y consumo financiado.',
    reality: 'Sirve para leer relajación monetaria o abundancia de liquidez.'
  },
  monetaryContract: {
    label: 'Contracción monetaria',
    delta: { MP: -55 },
    trigger: 'Se reduce el dinero real o se endurecen condiciones monetarias.',
    exogenous: 'Baja M/P.',
    parameters: 'Se restringe la liquidez.',
    curves: 'LM se desplaza a la izquierda si tiene pendiente positiva; con LM horizontal domina la tasa fijada.',
    mechanism: 'Sube el costo del dinero y cae el gasto sensible a la tasa.',
    trajectory: 'Primero se enfría la actividad y la inversión; luego puede ayudar a reordenar presiones de precios.',
    filter: 'En Chile, el BCCh endurece cuando detecta riesgos de persistencia inflacionaria o desanclaje.',
    watch: 'TPM, crédito, inversión, actividad y expectativas.',
    sector: 'Golpea inversión, durables, inmobiliario y negocios apalancados.',
    reality: 'Es el lenguaje básico para discutir endurecimiento monetario.'
  },
  betterExpectations: {
    label: 'Mejora de expectativas empresariales',
    delta: { b0: 25 },
    trigger: 'Mejora la confianza o cae la incertidumbre.',
    exogenous: 'Sube la inversión autónoma.',
    parameters: 'Aumenta b0.',
    curves: 'IS se desplaza a la derecha.',
    mechanism: 'La inversión se adelanta y puede activar además el acelerador por mayor actividad.',
    trajectory: 'El impulso inicial puede realimentarse si la mejora de confianza persiste y la tasa no sube demasiado.',
    filter: 'En Chile, reglas creíbles y menor incertidumbre regulatoria pueden amplificar este canal.',
    watch: 'Inversión, confianza empresarial, bienes de capital y empleo.',
    sector: 'Favorece inversión privada, construcción, maquinaria y sectores cíclicos.',
    reality: 'Útil para discutir recuperación de confianza.'
  },
  worseExpectations: {
    label: 'Deterioro de expectativas empresariales',
    delta: { b0: -25 },
    trigger: 'Sube la incertidumbre o empeora la lectura de futuro.',
    exogenous: 'Cae la inversión autónoma.',
    parameters: 'Disminuye b0.',
    curves: 'IS se desplaza a la izquierda.',
    mechanism: 'La inversión se posterga y la caída de actividad puede amplificar el freno.',
    trajectory: 'La retracción puede persistir si se instala una espera prolongada de proyectos o crédito más caro.',
    filter: 'En Chile, la incertidumbre institucional o regulatoria puede reforzar este freno vía prima de riesgo.',
    watch: 'Inversión, confianza empresarial, CLP/USD y empleo.',
    sector: 'Golpea inversión, proyectos de largo plazo y empleo asociado.',
    reality: 'Sirve para formalizar el canal de incertidumbre.'
  }
};

const ISLMBP_DEFAULTS = {
  c0: 120,
  c1: 0.62,
  b0: 92,
  b1: 0.08,
  b2: 18,
  x0: 78,
  x1: 0.10,
  x2: 0.30,
  G: 220,
  T: 180,
  MP: 420,
  d1: 1.02,
  d2: 72,
  iStar: 4.5
};

const ISLMBP_SHOCKS = {
  none: {
    label: 'Sin shock',
    delta: {},
    fxShock: 0,
    trigger: 'No cambia el entorno externo ni la política.',
    exogenous: 'Se mantiene i*, el entorno externo y el régimen base.',
    parameters: 'No cambia ningún parámetro.',
    curves: 'No se desplazan las curvas base.',
    mechanism: 'Se conserva la configuración inicial.',
    trajectory: 'La trayectoria probable es continuidad del benchmark docente.',
    filter: 'La flotación y el BCCh siguen operando como amortiguadores de base.',
    watch: 'CLP/USD, cobre, exportaciones, TPM y tasas largas.',
    sector: 'Referencia útil para comparar sensibilidad de transables y no transables.',
    reality: 'Base pedagógica de economía abierta con flotación.'
  },
  fiscalExpand: {
    label: 'Expansión fiscal',
    delta: { G: 30 },
    fxShock: -9,
    trigger: 'Aumenta el gasto público.',
    exogenous: 'Sube G.',
    parameters: 'Aumenta la demanda autónoma interna.',
    curves: 'IS se desplaza a la derecha; E tiende a apreciarse relativamente.',
    mechanism: 'Parte del impulso se fuga vía apreciación y menor NX.',
    trajectory: 'La actividad mejora, pero el sector externo absorbe parte del ajuste bajo flotación.',
    filter: 'En Chile, disciplina fiscal y flotación moderan el impacto y hacen visible el costo externo.',
    watch: 'Balance fiscal, CLP/USD, cuenta corriente, tasas y actividad.',
    sector: 'Favorece demanda interna y no transables; puede perjudicar exportadores por apreciación.',
    reality: 'Buen caso para comparar con tipo de cambio fijo.'
  },
  fiscalContract: {
    label: 'Contracción fiscal',
    delta: { G: -30 },
    fxShock: 8,
    trigger: 'Cae el gasto público.',
    exogenous: 'Baja G.',
    parameters: 'Se reduce la demanda autónoma interna.',
    curves: 'IS se desplaza a la izquierda; el tipo de cambio puede depreciarse relativamente.',
    mechanism: 'La menor demanda enfría actividad, pero puede aliviar tensiones externas y mejorar credibilidad.',
    trajectory: 'Primero cae la demanda; luego pueden corregirse vulnerabilidades si la consolidación es creíble.',
    filter: 'La regla fiscal y el monitoreo del CFA importan para separar disciplina de ajuste procíclico excesivo.',
    watch: 'Actividad, balance fiscal, CLP/USD, spreads y empleo.',
    sector: 'Golpea sectores internos; puede aliviar presión sobre transables si mejora E.',
    reality: 'Útil para pensar consolidación y trade-offs.'
  },
  monetaryExpand: {
    label: 'Expansión monetaria',
    delta: { MP: 60 },
    fxShock: 16,
    trigger: 'Aumenta el dinero real o baja la tasa interna relativa.',
    exogenous: 'Sube M/P.',
    parameters: 'Se relajan las condiciones monetarias.',
    curves: 'LM se desplaza a la derecha; el peso tiende a depreciarse.',
    mechanism: 'La depreciación mejora NX y amplifica la expansión de la actividad.',
    trajectory: 'En flotación la política monetaria suele ser relativamente más potente que la fiscal.',
    filter: 'En Chile, BCCh autónomo y flotación permiten usar este canal con mayor independencia.',
    watch: 'TPM, CLP/USD, crédito, exportaciones netas e inflación.',
    sector: 'Favorece transables, crédito e inversión, pero puede elevar presión inflacionaria importada.',
    reality: 'Es el caso clásico de eficacia monetaria bajo flotación.'
  },
  monetaryContract: {
    label: 'Contracción monetaria',
    delta: { MP: -60 },
    fxShock: -14,
    trigger: 'Se reduce la liquidez o sube la tasa interna relativa.',
    exogenous: 'Baja M/P.',
    parameters: 'Se endurecen las condiciones monetarias.',
    curves: 'LM se desplaza a la izquierda; el peso tiende a apreciarse o a depreciarse menos.',
    mechanism: 'Se encarece el crédito, cae demanda y el tipo de cambio alivia parte de la inflación importada.',
    trajectory: 'La actividad se enfría primero; luego mejora la convergencia inflacionaria si el shock no persiste.',
    filter: 'En Chile, el BCCh usa este canal cuando el escenario de inflación lo exige.',
    watch: 'TPM, crédito, CLP/USD, inflación y actividad.',
    sector: 'Golpea demanda interna y apalancamiento; alivia parte del costo importado.',
    reality: 'Buen caso para unir IS-LM-BP con OA-DA.'
  },
  higherWorldRate: {
    label: 'Subida de tasa internacional',
    delta: { iStar: 1.0 },
    fxShock: 18,
    trigger: 'Endurece la tasa externa relevante.',
    exogenous: 'Sube i*.',
    parameters: 'Aumenta la referencia internacional.',
    curves: 'BP se desplaza hacia arriba; cae Y compatible con LM-BP y el peso tiende a depreciarse.',
    mechanism: 'Mayor exigencia externa tensiona capitales, tipo de cambio y costo de financiamiento.',
    trajectory: 'La primera señal suele verse en CLP/USD, spreads y tasas largas; luego en inversión y actividad.',
    filter: 'Flotación ayuda a absorber parte del shock, pero no elimina su costo sobre financiamiento e inflación importada.',
    watch: 'Fed, CLP/USD, tasas largas, spreads y actividad.',
    sector: 'Afecta financiamiento corporativo, construcción, activos durables y deuda.',
    reality: 'Muy útil para Chile como economía pequeña y abierta.'
  },
  lowerWorldRate: {
    label: 'Baja de tasa internacional',
    delta: { iStar: -1.0 },
    fxShock: -12,
    trigger: 'Se relaja la tasa externa relevante.',
    exogenous: 'Baja i*.',
    parameters: 'Mejoran las condiciones financieras globales.',
    curves: 'BP se desplaza hacia abajo; mejora Y compatible con LM-BP y el peso tiende a apreciarse.',
    mechanism: 'Se alivian los costos de financiamiento y la presión sobre el tipo de cambio.',
    trajectory: 'Puede apoyar actividad y bajar inflación importada, aunque con posible costo para transables.',
    filter: 'Bajo flotación, Chile gana margen monetario propio cuando el entorno externo afloja.',
    watch: 'Tasas internacionales, CLP/USD, crédito, actividad e inflación.',
    sector: 'Favorece financiamiento y demanda interna; puede restar algo de competitividad externa.',
    reality: 'Sirve para pensar ciclos globales benignos.'
  },
  copperDown: {
    label: 'Caída del precio del cobre',
    delta: { x0: -18 },
    fxShock: 20,
    trigger: 'Empeoran los términos de intercambio.',
    exogenous: 'Cae x0 externo.',
    parameters: 'Disminuye la demanda externa neta compatible con Chile.',
    curves: 'IS se desplaza a la izquierda y el peso tiende a depreciarse.',
    mechanism: 'Bajan exportaciones e ingresos asociados; el tipo de cambio compensa parcialmente.',
    trajectory: 'La señal aparece rápido en CLP/USD y recaudación; luego en inversión minera y actividad.',
    filter: 'La apertura y la flotación transparentan el shock; la regla fiscal importa para no gastar como si fuera transitorio favorable.',
    watch: 'Cobre, CLP/USD, ingresos fiscales, exportaciones e inversión.',
    sector: 'Golpea minería, proveedores y regiones mineras; puede mejorar algo la competitividad de otros transables vía depreciación.',
    reality: 'Shock clásico para la economía chilena.'
  },
  copperUp: {
    label: 'Aumento del precio del cobre',
    delta: { x0: 18 },
    fxShock: -16,
    trigger: 'Mejoran los términos de intercambio.',
    exogenous: 'Sube x0 externo.',
    parameters: 'Aumenta la demanda externa neta compatible con Chile.',
    curves: 'IS se desplaza a la derecha y el peso tiende a apreciarse.',
    mechanism: 'Mejoran exportaciones e ingresos; la apreciación modera parte del impulso por NX.',
    trajectory: 'Primero mejora el entorno externo; luego aparece el dilema entre impulso, apreciación y gasto fiscal.',
    filter: 'La disciplina fiscal ayuda a no convertir un ingreso transitorio en gasto permanente.',
    watch: 'Cobre, CLP/USD, recaudación, inversión minera y cuenta corriente.',
    sector: 'Favorece minería y proveedores; puede dificultar a otros transables por apreciación.',
    reality: 'Permite discutir bonanza y disciplina.'
  },
  globalRecession: {
    label: 'Recesión global',
    delta: { x0: -22, b0: -10 },
    fxShock: 22,
    trigger: 'Se debilita la demanda mundial y sube la cautela financiera.',
    exogenous: 'Cae demanda externa y empeoran expectativas.',
    parameters: 'Bajan x0 y b0.',
    curves: 'IS se desplaza a la izquierda y el peso tiende a depreciarse.',
    mechanism: 'Caen exportaciones y confianza; la depreciación amortigua, pero no compensa por completo.',
    trajectory: 'El golpe comienza en comercio exterior y expectativas; luego se propaga a inversión y empleo.',
    filter: 'Flotación ayuda a absorber parte del shock; política monetaria puede ganar relevancia si la inflación lo permite.',
    watch: 'PIB global, cobre, CLP/USD, exportaciones, expectativas y empleo.',
    sector: 'Golpea exportadores, inversión y empleo ligado al ciclo global.',
    reality: 'Escenario de alta relevancia para Chile.'
  },
  pesoDepreciation: {
    label: 'Depreciación del peso',
    delta: {},
    fxShock: 35,
    trigger: 'Aumenta la presión cambiaria por motivos financieros o externos.',
    exogenous: 'Sube E.',
    parameters: 'Cambia directamente el entorno cambiario.',
    curves: 'IS se mueve por mejora relativa de NX.',
    mechanism: 'Mejora competitividad externa, pero puede encarecer importados y presionar inflación.',
    trajectory: 'Primero cambia CLP/USD; luego se observa su efecto sobre precios y volumen externo.',
    filter: 'La flotación permite este ajuste; el BCCh reacciona si el pass-through amenaza la convergencia inflacionaria.',
    watch: 'CLP/USD, IPC transable, NX y expectativas.',
    sector: 'Favorece exportadores y castiga importadores y consumidores de bienes transables.',
    reality: 'Shock útil para estudiar competitividad versus pass-through.'
  },
  pesoAppreciation: {
    label: 'Apreciación del peso',
    delta: {},
    fxShock: -30,
    trigger: 'Cede la presión cambiaria o mejora abruptamente el entorno financiero/external.',
    exogenous: 'Baja E.',
    parameters: 'Cambia directamente el entorno cambiario.',
    curves: 'IS se mueve por menor impulso de NX.',
    mechanism: 'Alivia inflación importada, pero resta competitividad a exportadores y sustitutos de importación.',
    trajectory: 'Primero baja CLP/USD; luego se ven efectos sobre inflación y sectores transables.',
    filter: 'La flotación transparenta el ajuste y obliga a leer el trade-off entre inflación y competitividad.',
    watch: 'CLP/USD, inflación, exportaciones y márgenes de importadores.',
    sector: 'Favorece importadores y consumo; puede perjudicar transables.',
    reality: 'Caso útil para leer desinflación importada.'
  },
  oilUp: {
    label: 'Alza del petróleo',
    delta: { x0: -10 },
    fxShock: 14,
    trigger: 'Sube el precio internacional del petróleo.',
    exogenous: 'Empeora el costo externo y presiona el tipo de cambio.',
    parameters: 'Baja x0 neto y aumenta presión cambiaria.',
    curves: 'IS se desplaza algo a la izquierda y E tiende a subir.',
    mechanism: 'Se deteriora el entorno externo y aparecen mayores costos; conviene leerlo junto con OA-DA.',
    trajectory: 'El primer golpe se ve en combustibles y CLP/USD; luego en inflación, costos y consumo.',
    filter: 'En Chile el mecanismo institucional clave es el BCCh bajo metas de inflación y el rol de precios regulados/combustibles.',
    watch: 'Combustibles, IPC, CLP/USD, transporte y costos logísticos.',
    sector: 'Golpea transporte, alimentos, importadores y márgenes empresariales.',
    reality: 'Es un shock externo con pata real y de precios.'
  }
};

const OADA_DEFAULTS = {
  daA: 1425,
  daB: 250,
  Pe: 1.0,
  mu: 0.20,
  gamma: 0.0020,
  z: 0.50,
  L: 1000,
  A: 1.00,
  costShock: 0
};

const OADA_SHOCKS = {
  none: {
    label: 'Sin shock',
    delta: {},
    trigger: 'No hay perturbación adicional.',
    exogenous: 'Se mantiene la configuración base.',
    parameters: 'No cambian interceptos ni pendientes.',
    curves: 'DA y OA permanecen iguales.',
    mechanism: 'No hay cambio en la combinación base de producción y precios.',
    trajectory: 'La trayectoria probable es convergencia estable hacia la configuración inicial.',
    filter: 'El filtro institucional solo recuerda que la estabilidad requiere credibilidad y datos.',
    watch: 'IPC, IPC SAE, actividad y expectativas.',
    mediumRun: 'Si Y coincide con Yₙ, la presión de ajuste de mediano plazo es mínima.',
    sector: 'Funciona como benchmark para comparar shocks de demanda, costos o productividad.',
    reality: 'Base docente con inflación y producto ordenados.'
  },
  fiscalExpand: {
    label: 'Expansión fiscal',
    delta: { daA: 55 },
    trigger: 'Aumenta la demanda autónoma.',
    exogenous: 'Sube el componente autónomo de DA.',
    parameters: 'Aumenta el intercepto de DA.',
    curves: 'DA se desplaza a la derecha.',
    mechanism: 'Suben actividad y precios; la magnitud relativa depende de la cercanía a capacidad.',
    trajectory: 'Si Y supera Yₙ, con el tiempo las expectativas y costos pueden empujar más OA hacia arriba.',
    filter: 'En Chile, regla fiscal y BCCh importan para que el impulso no se vuelva persistencia inflacionaria.',
    watch: 'PIB, IMACEC, inflación, balance fiscal y TPM.',
    mediumRun: 'Si la brecha final es positiva, la convergencia exige enfriamiento posterior o una oferta que responda mejor.',
    sector: 'Favorece demanda interna y empleo; puede tensionar precios si la oferta es rígida.',
    reality: 'Buen caso para explicar por qué el mismo impulso puede ser más real o más inflacionario según contexto.'
  },
  fiscalContract: {
    label: 'Contracción fiscal',
    delta: { daA: -55 },
    trigger: 'Cae la demanda autónoma.',
    exogenous: 'Baja el componente autónomo de DA.',
    parameters: 'Disminuye el intercepto de DA.',
    curves: 'DA se desplaza a la izquierda.',
    mechanism: 'Bajan actividad y precios relativos al escenario base.',
    trajectory: 'Si Y queda bajo Yₙ, con el tiempo cede presión de costos y puede facilitar desinflación.',
    filter: 'En Chile, la calidad del ajuste y la credibilidad fiscal son decisivas para evaluar su costo y retorno.',
    watch: 'Actividad, empleo, inflación y balance fiscal.',
    mediumRun: 'Una brecha negativa prolongada reduce presión inflacionaria, pero puede castigar empleo y capacidad futura.',
    sector: 'Golpea demanda interna; puede aliviar algo de inflación y tasas a mediano plazo.',
    reality: 'Sirve para discutir consolidación y costo cíclico.'
  },
  monetaryExpand: {
    label: 'Expansión monetaria',
    delta: { daA: 42 },
    trigger: 'Se relajan condiciones monetarias y de crédito.',
    exogenous: 'Sube la demanda agregada compatible con menores tasas.',
    parameters: 'Aumenta el intercepto de DA.',
    curves: 'DA se desplaza a la derecha.',
    mechanism: 'Suben producción y precios; la persistencia depende del punto del ciclo y de expectativas.',
    trajectory: 'Si la economía ya estaba cerca de Yₙ, el efecto adicional será más visible en precios que en actividad.',
    filter: 'BCCh evalúa este canal dentro de metas de inflación; la credibilidad evita que un impulso transitorio desancle expectativas.',
    watch: 'TPM, crédito, inflación, actividad y expectativas.',
    mediumRun: 'Una brecha positiva sostenida tiende a corregirse mediante mayor inflación o política monetaria más restrictiva después.',
    sector: 'Favorece crédito, inversión y consumo durable; puede tensionar importados y precios.',
    reality: 'Útil para conectar OA-DA con decisiones monetarias.'
  },
  monetaryContract: {
    label: 'Contracción monetaria',
    delta: { daA: -42 },
    trigger: 'Se endurecen condiciones monetarias y financieras.',
    exogenous: 'Baja la demanda agregada compatible con mayores tasas.',
    parameters: 'Disminuye el intercepto de DA.',
    curves: 'DA se desplaza a la izquierda.',
    mechanism: 'Se enfrían actividad y precios; la desinflación gana fuerza si las expectativas responden.',
    trajectory: 'El costo aparece primero en demanda, crédito e inversión; luego ayuda a reconducir inflación.',
    filter: 'En Chile, el BCCh aplica este canal cuando la meta de inflación está en riesgo.',
    watch: 'TPM, IPC SAE, crédito, actividad y desempleo.',
    mediumRun: 'Cerrar una brecha positiva requiere tiempo; el beneficio es mayor si evita segunda vuelta y persistencia.',
    sector: 'Golpea construcción, durables y financiamiento; ayuda a estabilizar poder adquisitivo.',
    reality: 'Clave para entender 2021–2024.'
  },
  oilUp: {
    label: 'Alza del petróleo',
    delta: { costShock: 0.40 },
    trigger: 'Sube el costo energético global.',
    exogenous: 'Aumentan costos importados.',
    parameters: 'Aumenta shock de costos.',
    curves: 'OA se desplaza hacia arriba / izquierda.',
    mechanism: 'Suben precios y cae la producción relativa al escenario base.',
    trajectory: 'Si el shock persiste, puede contaminar expectativas y salarios; si revierte, la presión cede gradualmente.',
    filter: 'BCCh y la flotación cambiaria importan para evitar que un shock de costos transitorio se vuelva persistente.',
    watch: 'Combustibles, IPC, IPC SAE, CLP/USD, costos logísticos.',
    mediumRun: 'El ajuste de mediano plazo depende de cuánto del shock se propaga a expectativas y contratos.',
    sector: 'Golpea transporte, alimentos, logística y márgenes empresariales.',
    reality: 'Ejemplo claro de shock estanflacionario.'
  },
  productivityUp: {
    label: 'Mejora de productividad',
    delta: { A: 0.05, gamma: -0.0003 },
    trigger: 'Mejora capacidad productiva o eficiencia.',
    exogenous: 'Sube A y cae rigidez relativa.',
    parameters: 'Aumenta Yₙ y OA se vuelve menos empinada.',
    curves: 'OA se desplaza hacia abajo / derecha y Yₙ aumenta.',
    mechanism: 'La economía puede producir más con menor presión de precios.',
    trajectory: 'Si la mejora persiste, la ganancia no es solo cíclica: cambia la capacidad del sistema.',
    filter: 'Un buen diseño institucional favorece que estas mejoras se materialicen y no se frenen por incertidumbre.',
    watch: 'Productividad, costos unitarios, inversión, crecimiento tendencial.',
    mediumRun: 'Mejorar Yₙ es el modo más sano de crecer sin inflación persistente.',
    sector: 'Favorece competitividad, salarios reales sostenibles e inversión.',
    reality: 'Es el shock más deseable desde la perspectiva de bienestar.'
  },
  productivityDown: {
    label: 'Caída de productividad',
    delta: { A: -0.05, gamma: 0.0004 },
    trigger: 'Se deteriora la capacidad productiva o la eficiencia.',
    exogenous: 'Baja A y aumenta rigidez relativa.',
    parameters: 'Cae Yₙ y OA se vuelve más restrictiva.',
    curves: 'OA se desplaza hacia arriba / izquierda y Yₙ cae.',
    mechanism: 'La economía produce menos y enfrenta más presión de precios para un mismo nivel de demanda.',
    trajectory: 'Puede dejar daños persistentes si cae inversión, aprendizaje o coordinación.',
    filter: 'Instituciones que favorezcan certeza, inversión y competencia ayudan a contener este deterioro.',
    watch: 'Productividad, inversión, costos, empleo y crecimiento tendencial.',
    mediumRun: 'La corrección exige recomponer capacidad, no solo enfriar demanda.',
    sector: 'Golpea crecimiento potencial, márgenes y salarios reales.',
    reality: 'Útil para pensar estancamiento o daño de capacidad.'
  },
  socialUnrest: {
    label: 'Estallido social / incertidumbre',
    delta: { daA: -32, costShock: 0.22, z: 0.10 },
    trigger: 'Sube la incertidumbre y se daña coordinación u operación.',
    exogenous: 'Cae DA y suben rigideces/costos.',
    parameters: 'Baja intercepto de DA y sube OA.',
    curves: 'DA cae y OA sube.',
    mechanism: 'Se combinan menor actividad, mayor cautela y presiones de costos o disrupción.',
    trajectory: 'El episodio puede dejar cicatrices vía inversión y confianza, incluso si el daño físico es acotado.',
    filter: 'La solidez institucional define si el shock se contiene o escala a riesgo macro persistente.',
    watch: 'Inversión, empleo, CLP/USD, spreads, inflación y expectativas.',
    mediumRun: 'La recuperación depende tanto de la normalización política como del reanclaje de expectativas.',
    sector: 'Golpea comercio, inversión, turismo, transporte y coordinación económica.',
    reality: 'Caso muy relevante para la experiencia chilena reciente.'
  },
  earthquake: {
    label: 'Terremoto',
    delta: { daA: -20, A: -0.04, costShock: 0.30 },
    trigger: 'Se daña capacidad productiva y logística.',
    exogenous: 'Baja productividad y suben costos.',
    parameters: 'Cae A y sube shock de costos.',
    curves: 'OA se desplaza arriba/izquierda; DA puede caer al inicio.',
    mechanism: 'En el impacto domina la restricción de oferta; luego puede aparecer demanda de reconstrucción.',
    trajectory: 'La secuencia es importante: daño inicial, disrupción, reconstrucción y posible recuperación de demanda.',
    filter: 'La capacidad fiscal, institucional y logística define la velocidad de recuperación.',
    watch: 'Actividad sectorial, empleo, reconstrucción, precios y gasto público.',
    mediumRun: 'La convergencia depende de la velocidad con que se recupere capacidad y se coordine reconstrucción.',
    sector: 'Golpea infraestructura, comercio y capacidad; luego favorece construcción y materiales.',
    reality: 'Sirve para pensar shocks naturales severos.'
  },
  geopolitical: {
    label: 'Shock geopolítico externo',
    delta: { costShock: 0.25, daA: -10 },
    trigger: 'Conflicto externo eleva costos y deteriora confianza.',
    exogenous: 'Suben costos importados y cae algo la demanda.',
    parameters: 'Aumenta OA y cae levemente DA.',
    curves: 'OA sube y DA puede retroceder.',
    mechanism: 'Aparece presión de costos con debilidad de actividad: patrón estanflacionario.',
    trajectory: 'Primero suben precios de insumos; luego se ajustan márgenes, consumo y política monetaria.',
    filter: 'En Chile importa mucho el canal de combustibles, CLP/USD y la reacción del BCCh.',
    watch: 'Combustibles, IPC, inflación subyacente, CLP/USD y TPM.',
    mediumRun: 'Si el shock se vuelve persistente, la desinflación se retrasa y el costo real aumenta.',
    sector: 'Golpea intensivos en energía, importadores y hogares por costo de vida.',
    reality: 'Caso útil para conectar Medio Oriente 2026 con Chile.'
  },
  reopening: {
    label: 'Reapertura / normalización de oferta',
    delta: { A: 0.03, costShock: -0.15, daA: 15 },
    trigger: 'Se normalizan cadenas logísticas y capacidad.',
    exogenous: 'Mejora productividad y cede el shock de costos; además mejora algo la demanda.',
    parameters: 'Sube A, cae shock de costos y mejora modestamente DA.',
    curves: 'OA se desplaza hacia abajo/derecha y DA sube algo.',
    mechanism: 'La actividad mejora sin tanto castigo inflacionario; incluso puede ayudar a desinflar.',
    trajectory: 'Se alivian cuellos de botella y presiones de oferta; luego la política puede normalizarse con menor costo.',
    filter: 'Bajo credibilidad monetaria, este tipo de normalización acelera la convergencia inflacionaria.',
    watch: 'Costos logísticos, inflación de bienes, actividad y TPM.',
    mediumRun: 'Es la mejor combinación para crecer y desinflar al mismo tiempo.',
    sector: 'Favorece importadores, manufactura, retail y hogares por menores costos.',
    reality: 'Clave para leer normalización post-pandemia o post-disrupción.'
  }
};

function safeDiv(a, b) {
  const denom = Math.abs(b) < EPS ? (b >= 0 ? EPS : -EPS) : b;
  return a / denom;
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  return Number(value).toFixed(digits);
}

function clampMinZero(v) {
  return Math.max(0, v);
}

function wordDirection(delta, up, down, flat = 'se mantiene casi estable') {
  if (Math.abs(delta) < 0.03) return flat;
  return delta > 0 ? up : down;
}

function applyDelta(base, delta = {}) {
  const copy = { ...base };
  Object.entries(delta).forEach(([k, v]) => {
    copy[k] = (copy[k] ?? 0) + v;
  });
  return copy;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function fillInputs(prefix, defaults) {
  Object.keys(defaults).forEach((key) => {
    const input = document.getElementById(`${prefix}-${key}`);
    if (input) input.value = defaults[key];
  });
}

function readInputs(prefix, defaults) {
  const out = {};
  Object.keys(defaults).forEach((key) => {
    const input = document.getElementById(`${prefix}-${key}`);
    out[key] = input ? Number(input.value) : defaults[key];
  });
  return out;
}

function bindInputs(prefix, defaults, callback) {
  Object.keys(defaults).forEach((key) => {
    const input = document.getElementById(`${prefix}-${key}`);
    if (input) input.addEventListener('input', callback);
  });
}

function populateSelect(id, optionsMap) {
  const select = document.getElementById(id);
  select.innerHTML = '';
  Object.entries(optionsMap).forEach(([key, obj]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = typeof obj === 'string' ? obj : obj.label;
    select.appendChild(option);
  });
}

function initTabs() {
  const buttons = [...document.querySelectorAll('.tab-button')];
  const panels = [...document.querySelectorAll('.tab-panel')];
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((panel) => panel.classList.toggle('active', panel.id === btn.dataset.tab));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function buildLine(fn, xMin, xMax, n = 60) {
  const points = [];
  const step = (xMax - xMin) / n;
  for (let i = 0; i <= n; i += 1) {
    const x = xMin + i * step;
    const y = fn(x);
    points.push({ x, y });
  }
  return points;
}

function chartRange(values, floor = 0, allowNegative = false) {
  const finite = values.filter((v) => Number.isFinite(v));
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const spread = Math.max(max - min, 1);
  const pad = spread * 0.18 + 2;
  return {
    min: allowNegative ? min - pad : Math.max(floor, min - pad),
    max: max + pad
  };
}

function destroyChart(key) {
  if (charts[key]) {
    charts[key].destroy();
    charts[key] = null;
  }
}

function createChart(key, canvasId, config) {
  destroyChart(key);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  charts[key] = new Chart(canvas.getContext('2d'), config);
}

function baseChartOptions(xTitle, yTitle, xRange, yRange, allowNegativeY = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        type: 'linear',
        min: xRange.min,
        max: xRange.max,
        title: { display: true, text: xTitle },
        grid: { color: '#e8eef6' }
      },
      y: {
        min: allowNegativeY ? yRange.min : clampMinZero(yRange.min),
        max: yRange.max,
        title: { display: true, text: yTitle },
        grid: { color: '#e8eef6' }
      }
    }
  };
}

function renderSimpleTable(id, headers, rows) {
  const table = document.getElementById(id);
  const head = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`;
  const body = `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
  table.innerHTML = head + body;
}

function renderSequenceCards() {
  const container = document.getElementById('sequence-cards');
  container.innerHTML = sequenceItems.map((item) => `
    <article class="sequence-card">
      <strong>${item.title}</strong>
      <p>${item.body}</p>
    </article>
  `).join('');
}

function renderShockExampleTable() {
  renderSimpleTable(
    'shock-examples-table',
    ['Tipo de shock', 'Disparador primario', 'Variable(s) exógena(s) afectada(s)', 'Modelo(s) donde se ve mejor', 'Mecanismo principal', 'Ejemplo chileno o internacional', 'Qué dato conviene mirar', 'Implicancia para empresas / hogares / gobierno'],
    shockExamples.map((item) => [item.tipo, item.disparador, item.exogena, item.modelos, item.mecanismo, item.ejemplo, item.dato, item.implicancia])
  );
}

function renderShockCards() {
  const container = document.getElementById('shock-cards');
  container.innerHTML = shockTypeCards.map((item) => `
    <article class="card">
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `).join('');
}

function renderTransmissionTable() {
  renderSimpleTable(
    'transmission-table',
    ['Canal', 'Disparador típico', 'Variables que reaccionan primero', 'Modelo(s) donde mejor se observan', 'Implicancias sectoriales'],
    transmissionRows.map((row) => [row.canal, row.disparador, row.primeras, row.modelos, row.sector])
  );
}

function renderInstitutionTable() {
  renderSimpleTable(
    'institution-table',
    ['Institución', 'Función macro relevante', 'Qué credibilidad ayuda a comprar o sostener', 'Qué problema de comportamiento oportunista ayuda a contener', 'Qué datos / decisiones / señales produce', 'Qué rol cumple en escenarios de shock'],
    institutionRows.map((row) => [row.institucion, row.funcion, row.credibilidad, row.oportunismo, row.senales, row.rol])
  );
}

function renderGlossary() {
  const root = document.getElementById('glossary-groups');
  root.innerHTML = glossaryGroups.map((group) => `
    <section class="glossary-group">
      <h3>${group.title}</h3>
      <div class="glossary-grid">
        ${group.items.map(([term, definition]) => `
          <article class="glossary-item">
            <strong>${term}</strong>
            <p>${definition}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function calcISLM(params, regime) {
  const A = 1 - params.c1 - params.b1;
  const K = params.c0 - params.c1 * params.T + params.b0 + params.G;
  let Y, i;
  if (regime === 'horizontal') {
    i = params.iFixed;
    Y = safeDiv(K - params.b2 * i, A);
  } else {
    Y = safeDiv(params.d2 * K + params.b2 * params.MP, params.d2 * A + params.b2 * params.d1);
    i = safeDiv(params.d1 * Y - params.MP, params.d2);
  }
  const investment = params.b0 + params.b1 * Y - params.b2 * i;
  const accelerator = params.b1 * Y;
  return { A, K, Y, i, investment, accelerator };
}

function isCurve(params) {
  const A = 1 - params.c1 - params.b1;
  const K = params.c0 - params.c1 * params.T + params.b0 + params.G;
  return (Y) => safeDiv(K - A * Y, params.b2);
}

function lmCurve(params, regime) {
  if (regime === 'horizontal') return () => params.iFixed;
  return (Y) => safeDiv(params.d1 * Y - params.MP, params.d2);
}

function renderISLM() {
  const regime = document.getElementById('islm-regime').value;
  const shockKey = document.getElementById('islm-shock').value;
  const shock = ISLM_SHOCKS[shockKey];
  const base = readInputs('islm', ISLM_DEFAULTS);
  const fin = applyDelta(base, shock.delta);

  const initial = calcISLM(base, regime);
  const final = calcISLM(fin, regime);

  const xRange = chartRange([initial.Y, final.Y, 650, 1100], 0);
  const yRange = chartRange([initial.i, final.i, base.iFixed, fin.iFixed, 0.5], 0);

  createChart('islm', 'islm-chart', {
    type: 'scatter',
    data: {
      datasets: [
        {
          type: 'line',
          label: 'IS inicial',
          data: buildLine(isCurve(base), xRange.min, xRange.max),
          borderColor: '#2563eb',
          borderWidth: 2.2,
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'IS final',
          data: buildLine(isCurve(fin), xRange.min, xRange.max),
          borderColor: '#60a5fa',
          borderWidth: 2.2,
          borderDash: [6, 6],
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'LM inicial',
          data: buildLine(lmCurve(base, regime), xRange.min, xRange.max),
          borderColor: '#16a34a',
          borderWidth: 2.2,
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'LM final',
          data: buildLine(lmCurve(fin, regime), xRange.min, xRange.max),
          borderColor: '#86efac',
          borderWidth: 2.2,
          borderDash: [6, 6],
          pointRadius: 0
        },
        {
          label: 'Equilibrio inicial',
          data: [{ x: initial.Y, y: initial.i }],
          backgroundColor: '#10283f',
          pointRadius: 6
        },
        {
          label: 'Equilibrio final',
          data: [{ x: final.Y, y: final.i }],
          backgroundColor: '#f59e0b',
          pointRadius: 6
        }
      ]
    },
    options: baseChartOptions('Producción (Y)', 'Tasa de interés (i)', xRange, yRange)
  });

  setText('islm-y0', formatNumber(initial.Y));
  setText('islm-y1', formatNumber(final.Y));
  setText('islm-i0', formatNumber(initial.i));
  setText('islm-i1', formatNumber(final.i));
  setText('islm-inv0', formatNumber(initial.investment));
  setText('islm-inv1', formatNumber(final.investment));

  const dY = final.Y - initial.Y;
  const di = final.i - initial.i;
  const dI = final.investment - initial.investment;
  const crowding = regime === 'horizontal' ? 0 : Math.max(0, fin.b2 * Math.max(di, 0));
  const acceleratorGain = Math.max(0, fin.b1 * Math.max(dY, 0));
  let crowdingText = '';
  if (regime === 'horizontal') {
    crowdingText = 'Con LM horizontal, la tasa queda fijada exógenamente: el crowding-out vía interés prácticamente desaparece y el acelerador domina si la actividad aumenta.';
  } else if (dI > 0) {
    crowdingText = acceleratorGain >= crowding
      ? 'Predomina el acelerador: el mayor nivel de actividad compensa o supera el encarecimiento del dinero.'
      : 'Hay crowding-out parcial: la tasa sube y resta parte del impulso inversor, aunque no lo revierte del todo.';
  } else if (dI < 0) {
    crowdingText = crowding > acceleratorGain
      ? 'Predomina el crowding-out o el freno financiero: la tasa castiga suficientemente la inversión.'
      : 'La inversión cae por combinación de menor actividad y condiciones financieras menos favorables.';
  } else {
    crowdingText = 'El balance entre acelerador y crowding-out es casi neutro en esta calibración.';
  }
  setText('islm-crowding', `Acelerador aproximado = b1·ΔY = ${formatNumber(acceleratorGain)}. Crowding-out aproximado = b2·Δi = ${formatNumber(crowding)}. ${crowdingText}`);
  setText('islm-sector', shock.sector);

  const auto = `
    <ol>
      <li><strong>Shock seleccionado:</strong> ${shock.label}.</li>
      <li><strong>Disparador y variable exógena afectada:</strong> ${shock.trigger} ${shock.exogenous}</li>
      <li><strong>Parámetros que cambian:</strong> ${shock.parameters}</li>
      <li><strong>Curvas que se desplazan:</strong> ${shock.curves}</li>
      <li><strong>Qué ocurre con el equilibrio:</strong> Y ${wordDirection(dY, 'sube', 'baja')} y la tasa ${wordDirection(di, 'sube', 'baja')}. La inversión ${wordDirection(dI, 'aumenta', 'cae')}.</li>
      <li><strong>Mecanismo de transmisión dominante:</strong> ${shock.mechanism}</li>
      <li><strong>Trayectoria probable:</strong> ${shock.trajectory}</li>
      <li><strong>Filtro institucional chileno:</strong> ${shock.filter}</li>
      <li><strong>Dato que conviene mirar:</strong> ${shock.watch}</li>
    </ol>
  `;
  setHTML('islm-auto', auto);
}

function calcISLMBP(params, fxShock = 0) {
  const A = 1 - params.c1 - params.b1 + params.x1;
  const Y = safeDiv(params.MP + params.d2 * params.iStar, params.d1);
  const K = params.c0 - params.c1 * params.T + params.b0 + params.G + params.x0;
  const eRaw = safeDiv(A * Y - K + params.b2 * params.iStar, params.x2) + fxShock;
  const NX = params.x0 - params.x1 * Y + params.x2 * eRaw;
  return { A, K, Y, i: params.iStar, eRaw, NX };
}

function isCurveBP(params, eRaw) {
  const A = 1 - params.c1 - params.b1 + params.x1;
  const K = params.c0 - params.c1 * params.T + params.b0 + params.G + params.x0 + params.x2 * eRaw;
  return (Y) => safeDiv(K - A * Y, params.b2);
}

function lmCurveBP(params) {
  return (Y) => safeDiv(params.d1 * Y - params.MP, params.d2);
}

function bpCurve(params) {
  return () => params.iStar;
}

function renderISLMBP() {
  const shockKey = document.getElementById('islmbp-shock').value;
  const shock = ISLMBP_SHOCKS[shockKey];
  const base = readInputs('islmbp', ISLMBP_DEFAULTS);
  const fin = applyDelta(base, shock.delta);

  const initial = calcISLMBP(base, 0);
  const final = calcISLMBP(fin, shock.fxShock);
  const eBaseIndex = 100;
  const eFinalIndex = 100 + (final.eRaw - initial.eRaw);

  const xRange = chartRange([initial.Y, final.Y, 550, 860], 0);
  const yRange = chartRange([initial.i, final.i, 1, 9], 0);

  createChart('islmbp', 'islmbp-chart', {
    type: 'scatter',
    data: {
      datasets: [
        {
          type: 'line',
          label: 'IS inicial',
          data: buildLine(isCurveBP(base, initial.eRaw), xRange.min, xRange.max),
          borderColor: '#2563eb',
          borderWidth: 2.2,
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'IS final',
          data: buildLine(isCurveBP(fin, final.eRaw), xRange.min, xRange.max),
          borderColor: '#60a5fa',
          borderWidth: 2.2,
          borderDash: [6, 6],
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'LM inicial',
          data: buildLine(lmCurveBP(base), xRange.min, xRange.max),
          borderColor: '#16a34a',
          borderWidth: 2.2,
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'LM final',
          data: buildLine(lmCurveBP(fin), xRange.min, xRange.max),
          borderColor: '#86efac',
          borderWidth: 2.2,
          borderDash: [6, 6],
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'BP inicial',
          data: buildLine(bpCurve(base), xRange.min, xRange.max),
          borderColor: '#7c3aed',
          borderWidth: 2.2,
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'BP final',
          data: buildLine(bpCurve(fin), xRange.min, xRange.max),
          borderColor: '#c4b5fd',
          borderWidth: 2.2,
          borderDash: [6, 6],
          pointRadius: 0
        },
        {
          label: 'Equilibrio inicial',
          data: [{ x: initial.Y, y: initial.i }],
          backgroundColor: '#10283f',
          pointRadius: 6
        },
        {
          label: 'Equilibrio final',
          data: [{ x: final.Y, y: final.i }],
          backgroundColor: '#f59e0b',
          pointRadius: 6
        }
      ]
    },
    options: baseChartOptions('Producción (Y)', 'Tasa de interés (i)', xRange, yRange)
  });

  setText('islmbp-y0', formatNumber(initial.Y));
  setText('islmbp-y1', formatNumber(final.Y));
  setText('islmbp-i0', formatNumber(initial.i));
  setText('islmbp-i1', formatNumber(final.i));
  setText('islmbp-e0', formatNumber(eBaseIndex));
  setText('islmbp-e1', formatNumber(eFinalIndex));
  setText('islmbp-nx0', formatNumber(initial.NX));
  setText('islmbp-nx1', formatNumber(final.NX));

  const dY = final.Y - initial.Y;
  const dNX = final.NX - initial.NX;
  const dE = eFinalIndex - eBaseIndex;

  const auto = `
    <ol>
      <li><strong>Shock seleccionado:</strong> ${shock.label}.</li>
      <li><strong>Disparador y variable exógena afectada:</strong> ${shock.trigger} ${shock.exogenous}</li>
      <li><strong>Parámetros que cambian:</strong> ${shock.parameters}</li>
      <li><strong>Curvas que se desplazan:</strong> ${shock.curves}</li>
      <li><strong>Qué ocurre con el equilibrio:</strong> Y ${wordDirection(dY, 'sube', 'baja')}, E ${wordDirection(dE, 'sube', 'baja')} y NX ${wordDirection(dNX, 'mejora', 'empeora')}.</li>
      <li><strong>Mecanismo de transmisión dominante:</strong> ${shock.mechanism}</li>
      <li><strong>Trayectoria probable:</strong> ${shock.trajectory}</li>
      <li><strong>Filtro institucional chileno:</strong> ${shock.filter}</li>
      <li><strong>Dato que conviene mirar:</strong> ${shock.watch}</li>
    </ol>
  `;
  setHTML('islmbp-auto', auto);
  setText('islmbp-filter', shock.filter);
}

function calcOADA(params) {
  const Yn = params.A * params.L;
  const oaBase = params.Pe * (1 + params.mu) + params.z + params.costShock;
  const Y = safeDiv(params.daA - params.daB * oaBase + params.daB * params.gamma * Yn, 1 + params.daB * params.gamma);
  const P = safeDiv(params.daA - Y, params.daB);
  const gap = Y - Yn;
  return { Yn, oaBase, Y, P, gap };
}

function daCurve(params) {
  return (Y) => safeDiv(params.daA - Y, params.daB);
}

function oaCurve(params) {
  const Yn = params.A * params.L;
  const oaBase = params.Pe * (1 + params.mu) + params.z + params.costShock;
  return (Y) => oaBase + params.gamma * (Y - Yn);
}

function renderOADA() {
  const shockKey = document.getElementById('oada-shock').value;
  const shock = OADA_SHOCKS[shockKey];
  const base = readInputs('oada', OADA_DEFAULTS);
  const fin = applyDelta(base, shock.delta);

  const initial = calcOADA(base);
  const final = calcOADA(fin);

  const xRange = chartRange([initial.Y, final.Y, initial.Yn, final.Yn, 850, 1120], 0);
  const yRange = chartRange([initial.P, final.P, 0.8, 2.6], 0);

  createChart('oada', 'oada-chart', {
    type: 'scatter',
    data: {
      datasets: [
        {
          type: 'line',
          label: 'DA inicial',
          data: buildLine(daCurve(base), xRange.min, xRange.max),
          borderColor: '#2563eb',
          borderWidth: 2.2,
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'DA final',
          data: buildLine(daCurve(fin), xRange.min, xRange.max),
          borderColor: '#60a5fa',
          borderWidth: 2.2,
          borderDash: [6, 6],
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'OA inicial',
          data: buildLine(oaCurve(base), xRange.min, xRange.max),
          borderColor: '#dc2626',
          borderWidth: 2.2,
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'OA final',
          data: buildLine(oaCurve(fin), xRange.min, xRange.max),
          borderColor: '#fca5a5',
          borderWidth: 2.2,
          borderDash: [6, 6],
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'Yₙ inicial',
          data: [{ x: initial.Yn, y: yRange.min }, { x: initial.Yn, y: yRange.max }],
          borderColor: '#16a34a',
          borderWidth: 1.6,
          borderDash: [4, 4],
          pointRadius: 0
        },
        {
          type: 'line',
          label: 'Yₙ final',
          data: [{ x: final.Yn, y: yRange.min }, { x: final.Yn, y: yRange.max }],
          borderColor: '#86efac',
          borderWidth: 1.6,
          borderDash: [4, 4],
          pointRadius: 0
        },
        {
          label: 'Equilibrio inicial',
          data: [{ x: initial.Y, y: initial.P }],
          backgroundColor: '#10283f',
          pointRadius: 6
        },
        {
          label: 'Equilibrio final',
          data: [{ x: final.Y, y: final.P }],
          backgroundColor: '#f59e0b',
          pointRadius: 6
        }
      ]
    },
    options: baseChartOptions('Producción (Y)', 'Nivel de precios (P)', xRange, yRange)
  });

  setText('oada-y0', formatNumber(initial.Y));
  setText('oada-y1', formatNumber(final.Y));
  setText('oada-p0', formatNumber(initial.P));
  setText('oada-p1', formatNumber(final.P));
  setText('oada-gap0', formatNumber(initial.gap));
  setText('oada-gap1', formatNumber(final.gap));

  const dY = final.Y - initial.Y;
  const dP = final.P - initial.P;

  const auto = `
    <ol>
      <li><strong>Shock seleccionado:</strong> ${shock.label}.</li>
      <li><strong>Disparador y variable exógena afectada:</strong> ${shock.trigger} ${shock.exogenous}</li>
      <li><strong>Parámetros que cambian:</strong> ${shock.parameters}</li>
      <li><strong>Curvas que se desplazan:</strong> ${shock.curves}</li>
      <li><strong>Qué ocurre con el equilibrio:</strong> Y ${wordDirection(dY, 'sube', 'baja')} y P ${wordDirection(dP, 'sube', 'baja')}.</li>
      <li><strong>Mecanismo de transmisión dominante:</strong> ${shock.mechanism}</li>
      <li><strong>Trayectoria probable:</strong> ${shock.trajectory}</li>
      <li><strong>Filtro institucional chileno:</strong> ${shock.filter}</li>
      <li><strong>Dato que conviene mirar:</strong> ${shock.watch}</li>
    </ol>
  `;
  setHTML('oada-auto', auto);
  setText('oada-medium', `${shock.mediumRun} En esta calibración, Yₙ pasa de ${formatNumber(initial.Yn)} a ${formatNumber(final.Yn)} y la brecha final queda en ${formatNumber(final.gap)}.`);
  setText('oada-watch', `${shock.watch} ${shock.sector}`);
}

function dashboardSummary(rangeKey) {
  const summaries = {
    full: '2010–2025 muestra una secuencia nítida: alto crecimiento tras reconstrucción, desaceleración prolongada desde mediados de la década, shock político en 2019, pandemia en 2020, rebote excepcional e inflación en 2021–2022, endurecimiento monetario fuerte y una convergencia posterior todavía sensible al entorno externo.',
    mid: '2019–2025 permite ver muy bien la cadena estallido social → pandemia → rebote → sobrecalentamiento e inflación → ajuste monetario y fiscal → desinflación con crecimiento más ordenado.',
    recent: '2021–2025 concentra el período más útil para Macro II: exceso de demanda, shock externo de costos, salto de inflación, TPM alta y posterior normalización con un CLP/USD todavía sensible a shocks internacionales.'
  };
  return summaries[rangeKey];
}

function renderMiniLine(key, canvasId, labels, values, color, yTitle, rangeKey, allowNegative = false) {
  destroyChart(key);
  const [start, end] = dashboardRanges[rangeKey];
  const subLabels = labels.slice(start, end + 1);
  const subValues = values.slice(start, end + 1);
  const min = Math.min(...subValues);
  const max = Math.max(...subValues);
  const spread = Math.max(max - min, 1);
  const pad = spread * 0.18 + 0.5;

  charts[key] = new Chart(document.getElementById(canvasId).getContext('2d'), {
    type: 'line',
    data: {
      labels: subLabels,
      datasets: [{
        data: subValues,
        borderColor: color,
        backgroundColor: `${color}22`,
        pointRadius: 0,
        tension: 0.22,
        fill: true,
        borderWidth: 2.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          title: { display: true, text: 'Año' },
          ticks: { color: '#627487', maxTicksLimit: 6 },
          grid: { display: false }
        },
        y: {
          min: allowNegative ? min - pad : clampMinZero(min - pad),
          max: max + pad,
          title: { display: true, text: yTitle },
          ticks: { color: '#627487' },
          grid: { color: '#e8eef6' }
        }
      }
    }
  });
}

function renderDashboard(rangeKey = 'full') {
  renderMiniLine('dash-gdp', 'dash-gdp', dashboardData.years, dashboardData.gdp, '#2563eb', '% anual', rangeKey, true);
  renderMiniLine('dash-inflation', 'dash-inflation', dashboardData.years, dashboardData.inflation, '#f59e0b', '% anual', rangeKey, false);
  renderMiniLine('dash-unemployment', 'dash-unemployment', dashboardData.years, dashboardData.unemployment, '#16a34a', '% anual', rangeKey, false);
  renderMiniLine('dash-tpm', 'dash-tpm', dashboardData.years, dashboardData.tpm, '#7c3aed', '% anual', rangeKey, false);
  renderMiniLine('dash-fx', 'dash-fx', dashboardData.years, dashboardData.fx, '#dc2626', 'CLP/USD', rangeKey, false);
  setText('dashboard-summary', dashboardSummary(rangeKey));
}

function initDashboardButtons() {
  document.querySelectorAll('.range-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-button').forEach((b) => b.classList.toggle('active', b === btn));
      renderDashboard(btn.dataset.range);
    });
  });
}

function attachReset(buttonId, prefix, defaults, callback) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  button.addEventListener('click', () => {
    fillInputs(prefix, defaults);
    callback();
  });
}

function init() {
  initTabs();
  renderSequenceCards();
  renderShockExampleTable();
  renderShockCards();
  renderTransmissionTable();
  renderInstitutionTable();
  renderGlossary();

  populateSelect('islm-regime', ISLM_REGIMES);
  populateSelect('islm-shock', ISLM_SHOCKS);
  populateSelect('islmbp-shock', ISLMBP_SHOCKS);
  populateSelect('oada-shock', OADA_SHOCKS);

  fillInputs('islm', ISLM_DEFAULTS);
  fillInputs('islmbp', ISLMBP_DEFAULTS);
  fillInputs('oada', OADA_DEFAULTS);

  bindInputs('islm', ISLM_DEFAULTS, renderISLM);
  bindInputs('islmbp', ISLMBP_DEFAULTS, renderISLMBP);
  bindInputs('oada', OADA_DEFAULTS, renderOADA);

  document.getElementById('islm-regime').addEventListener('change', renderISLM);
  document.getElementById('islm-shock').addEventListener('change', renderISLM);
  document.getElementById('islmbp-shock').addEventListener('change', renderISLMBP);
  document.getElementById('oada-shock').addEventListener('change', renderOADA);

  attachReset('islm-reset', 'islm', ISLM_DEFAULTS, renderISLM);
  attachReset('islmbp-reset', 'islmbp', ISLMBP_DEFAULTS, renderISLMBP);
  attachReset('oada-reset', 'oada', OADA_DEFAULTS, renderOADA);

  initDashboardButtons();

  renderISLM();
  renderISLMBP();
  renderOADA();
  renderDashboard('full');
}

document.addEventListener('DOMContentLoaded', init);
