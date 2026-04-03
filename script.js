const charts = {};
const EPS = 1e-9;

const dashboardData = {
  years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  gdp: [5.851416, 6.223897, 6.15534, 3.308508, 1.792649, 2.151942, 1.753039, 1.357695, 3.990029, 0.644223, -6.139697, 11.337403, 2.063919, 0.677025, 2.805126, 2.459255],
  inflation: [2.972868, 4.437733, 1.486965, 2.838075, 4.646381, 4.378512, 2.708725, 2.269594, 2.140987, 3.00048, 2.972871, 7.172841, 12.781654, 3.374501, 4.527165, 3.452404],
  unemployment: [7.210129, 6.81461, 6.224656, 5.781732, 6.205597, 5.870419, 6.200413, 6.512653, 7.146463, 7.063169, 10.286319, 7.189893, 7.862749, 8.475639, 8.07973, 8.049514],
  fx: [510.37664, 483.364048, 486.746559, 494.995161, 570.005904, 654.249, 676.832421, 649.328785, 640.290772, 702.631048, 792.221833, 759.27284, 872.33152, 839.073401, 943.582419, 951.64121],
  tpm: [1.422, 4.666667, 5.009109, 4.922379, 3.756024, 3.06, 3.5, 2.736842, 2.549797, 2.49498, 0.785857, 1.195, 8.508, 10.5, 6.219758, 4.886089],
  copper: [348.823308, 394.397167, 360.625583, 329.457917, 305.5595, 241.669231, 230.498417, 288.622167, 288.90875, 270.593667, 297.549917, 437.196692, 387.864667, 379.345083, 423.095833, 450.836667],
  wti: [80.196154, 95.978333, 93.738333, 97.93, 89.308333, 46.08, 46.808333, 52.5475, 63.305, 57.128333, 39.475833, 76.013077, 90.1925, 78.006667, 75.119167, 64.626667]
};

const ranges = {
  full: [0, dashboardData.years.length - 1],
  mid: [9, dashboardData.years.length - 1],
  recent: [11, dashboardData.years.length - 1]
};

const ISLM_DEFAULTS = {
  c0: 120,
  c1: 0.65,
  b0: 90,
  b1: 0.10,
  b2: 22,
  G: 220,
  T: 180,
  MP: 380,
  d1: 0.90,
  d2: 60,
  iFixed: 4.5
};

const ISLM_REGIMES = {
  upward: 'LM con pendiente positiva',
  horizontal: 'LM horizontal (i exógena)'
};

const ISLM_SHOCKS = {
  none: { label: 'Sin shock', delta: {}, watch: 'PIB/IMACEC, tasas de mercado, crédito e inversión', changedText: 'No cambia ningún parámetro.', reality: 'Base docente de referencia.' },
  fiscalExpand: { label: 'Expansión fiscal', delta: { G: 30 }, watch: 'actividad, balance fiscal, tasas largas, inversión y empleo', changedText: 'Aumenta G.', reality: 'Puede venir de reconstrucción, mayor gasto cíclico o transferencias.' },
  fiscalContract: { label: 'Contracción fiscal', delta: { G: -30 }, watch: 'actividad, consolidación fiscal, consumo y tasas', changedText: 'Disminuye G.', reality: 'Puede venir de consolidación, caída de ingresos permanentes o disciplina fiscal.' },
  monetaryExpand: { label: 'Expansión monetaria', delta: { MP: 55 }, watch: 'TPM, crédito, tasas de mercado y actividad', changedText: 'Aumenta M/P.', reality: 'Puede reflejar recorte de TPM o relajación del tono monetario.' },
  monetaryContract: { label: 'Contracción monetaria', delta: { MP: -55 }, watch: 'TPM, costo de financiamiento, crédito e inversión', changedText: 'Disminuye M/P.', reality: 'Suele venir de respuesta a inflación persistente o riesgo de desanclaje.' },
  betterExpectations: { label: 'Mejora de expectativas empresariales', delta: { b0: 25 }, watch: 'inversión, confianza empresarial, empleo y actividad', changedText: 'Aumenta b0.', reality: 'Puede venir de mejora política, recuperación externa o mayor visibilidad regulatoria.' },
  worseExpectations: { label: 'Deterioro de expectativas empresariales', delta: { b0: -25 }, watch: 'inversión, confianza empresarial y empleo', changedText: 'Disminuye b0.', reality: 'Puede provenir de incertidumbre política, shock externo o tensión financiera.' }
};

const ISLMBP_DEFAULTS = {
  c0: 120,
  c1: 0.62,
  b0: 90,
  b1: 0.08,
  b2: 18,
  x0: 70,
  x1: 0.10,
  x2: 0.28,
  G: 220,
  T: 180,
  MP: 420,
  d1: 1.05,
  d2: 75,
  iStar: 4.5
};

const ISLMBP_SHOCKS = {
  none: { label: 'Sin shock', delta: {}, fxShock: 0, watch: 'CLP/USD, cobre, exportaciones, balanza comercial y TPM', changedText: 'No cambia ningún parámetro.', reality: 'Base docente con flotación cambiaria.' },
  fiscalExpand: { label: 'Expansión fiscal', delta: { G: 30 }, fxShock: -10, watch: 'balance fiscal, tasas, CLP/USD y cuenta corriente', changedText: 'Aumenta G.', reality: 'En flotación suele apreciarse el tipo de cambio y aparecer crowding-out externo parcial.' },
  fiscalContract: { label: 'Contracción fiscal', delta: { G: -30 }, fxShock: 8, watch: 'actividad, gasto, CLP/USD y riesgo soberano', changedText: 'Disminuye G.', reality: 'Puede aliviar presión externa y ayudar a credibilidad, aunque enfría demanda.' },
  monetaryExpand: { label: 'Expansión monetaria', delta: { MP: 60 }, fxShock: 18, watch: 'TPM, CLP/USD, crédito y exportaciones netas', changedText: 'Aumenta M/P.', reality: 'En flotación suele ser una política especialmente eficaz en el corto plazo.' },
  monetaryContract: { label: 'Contracción monetaria', delta: { MP: -60 }, fxShock: -14, watch: 'TPM, crédito, CLP/USD e inflación', changedText: 'Disminuye M/P.', reality: 'Endurece condiciones financieras y suele apreciar o frenar depreciaciones.' },
  higherWorldRate: { label: 'Subida de la tasa internacional', delta: { iStar: 1.0 }, fxShock: 18, watch: 'Fed, CLP/USD, spreads, tasas largas y capitales', changedText: 'Aumenta i*.', reality: 'Eleva la exigencia externa y puede tensionar el CLP/USD y el costo de financiamiento.' },
  lowerWorldRate: { label: 'Caída de la tasa internacional', delta: { iStar: -1.0 }, fxShock: -14, watch: 'flujos de capital, CLP/USD y condiciones financieras internas', changedText: 'Disminuye i*.', reality: 'Relaja el entorno financiero internacional y puede aliviar presión sobre el tipo de cambio.' },
  copperDown: { label: 'Caída del precio del cobre', delta: { x0: -20 }, fxShock: 22, watch: 'cobre, CLP/USD, ingresos fiscales y exportaciones', changedText: 'Disminuye x0 neto y empeora el entorno externo.', reality: 'Chile lo siente rápido por exportaciones, tipo de cambio y recaudación.' },
  copperUp: { label: 'Aumento del precio del cobre', delta: { x0: 20 }, fxShock: -16, watch: 'cobre, CLP/USD, inversión minera y recaudación', changedText: 'Aumenta x0 neto y mejora el entorno externo.', reality: 'Mejora exportaciones y tiende a apreciar el peso.' },
  globalRecession: { label: 'Recesión global', delta: { x0: -24, b0: -10 }, fxShock: 24, watch: 'actividad global, exportaciones, CLP/USD y confianza', changedText: 'Cae la demanda externa y se enfría la inversión.', reality: 'Golpea fuerte a sectores exportadores y transables.' },
  oilUp: { label: 'Alza del petróleo', delta: { x0: -12 }, fxShock: 15, watch: 'combustibles, CLP/USD, IPC y costos logísticos', changedText: 'Empeora x0 neto y aumenta presión cambiaria.', reality: 'Conviene cruzarlo con OA-DA para capturar mejor el canal de costos.' },
  pesoDepreciation: { label: 'Depreciación del peso', delta: {}, fxShock: 40, watch: 'CLP/USD, precios importados, NX y expectativas', changedText: 'Aumenta E mediante un shock cambiario directo.', reality: 'Sirve para estudiar competitividad versus pass-through.' },
  pesoAppreciation: { label: 'Apreciación del peso', delta: {}, fxShock: -35, watch: 'CLP/USD, inflación transable y competitividad exportadora', changedText: 'Disminuye E mediante un shock cambiario directo.', reality: 'Alivia inflación importada, pero puede dañar transables.' }
};

const OADA_DEFAULTS = {
  daA: 1425,
  daB: 250,
  Pe: 1.0,
  mu: 0.20,
  gamma: 0.0020,
  z: 0.50,
  L: 950,
  A: 1.0,
  costShock: 0.00
};

const OADA_SHOCKS = {
  none: { label: 'Sin shock', delta: {}, watch: 'IPC, actividad y expectativas', changedText: 'No cambia ningún parámetro.', mediumRun: 'La economía se mantiene en su configuración base y la discusión relevante es qué tan cerca está de Yₙ.', reality: 'Base pedagógica de referencia.' },
  fiscalExpand: { label: 'Expansión fiscal', delta: { daA: 60 }, watch: 'actividad, empleo e inflación', changedText: 'Aumenta la demanda agregada autónoma.', mediumRun: 'Si la economía ya está cerca de capacidad, el efecto se vuelve más inflacionario que real.', reality: 'Útil para pensar estímulos fuertes o gasto de reconstrucción.' },
  fiscalContract: { label: 'Contracción fiscal', delta: { daA: -60 }, watch: 'actividad, empleo e inflación', changedText: 'Disminuye la demanda agregada autónoma.', mediumRun: 'Si Y queda bajo Yₙ, cede presión inflacionaria y el ajuste puede venir con holguras.', reality: 'Útil para pensar consolidación y costo real de corto plazo.' },
  monetaryExpand: { label: 'Expansión monetaria', delta: { daA: 50 }, watch: 'TPM, crédito, IPC y actividad', changedText: 'Se desplaza la DA hacia la derecha.', mediumRun: 'Si la brecha es positiva y persistente, aumentan precios y expectativas.', reality: 'Ilustra cómo un impulso de demanda puede reabrir actividad y luego tensionar precios.' },
  monetaryContract: { label: 'Contracción monetaria', delta: { daA: -50 }, watch: 'TPM, IPC SAE, crédito e inversión', changedText: 'Se desplaza la DA hacia la izquierda.', mediumRun: 'Ayuda a cerrar brechas positivas y a devolver la inflación hacia la meta.', reality: 'El ciclo 2021–2023 del BCCh es el ejemplo más claro.' },
  oilUp: { label: 'Alza del petróleo', delta: { costShock: 0.50 }, watch: 'combustibles, transporte, IPC y márgenes', changedText: 'Sube el shock de costos y desplaza OA hacia arriba.', mediumRun: 'Si el shock persiste, puede contaminar expectativas y salarios.', reality: 'Útil para leer shocks geopolíticos sobre energía y sus efectos estanflacionarios.' },
  productivityUp: { label: 'Mejora de productividad', delta: { A: 0.07, gamma: -0.0005 }, watch: 'productividad, costos unitarios y crecimiento tendencial', changedText: 'Aumenta A y la OA se vuelve menos empinada.', mediumRun: 'Eleva Yₙ y reduce tensión inflacionaria para un mismo nivel de actividad.', reality: 'Es el tipo de shock que mejora crecimiento sin castigar inflación.' },
  productivityDown: { label: 'Caída de productividad', delta: { A: -0.07, gamma: 0.0006 }, watch: 'productividad, inversión y crecimiento potencial', changedText: 'Disminuye A y la OA se vuelve más restrictiva.', mediumRun: 'Reduce Yₙ y hace más costoso sostener actividad sin inflación.', reality: 'Puede venir de trabas, daño de capital o deterioro del entorno productivo.' },
  socialUnrest: { label: 'Estallido social / incertidumbre institucional', delta: { daA: -40, costShock: 0.25, z: 0.12 }, watch: 'EMBI, CLP/USD, inversión, empleo e inflación', changedText: 'Cae DA y suben costos/rigideces.', mediumRun: 'Puede dejar una economía con menor inversión y menor producto natural si daña capital y coordinación.', reality: 'Combina demanda, incertidumbre y costos.' },
  earthquake: { label: 'Terremoto', delta: { daA: -25, A: -0.05, costShock: 0.35 }, watch: 'capacidad productiva, reconstrucción, precios y empleo', changedText: 'Cae capacidad y suben costos; luego puede aparecer demanda de reconstrucción.', mediumRun: 'En el primer momento domina la restricción de oferta; después la reconstrucción cambia la trayectoria.', reality: 'Sirve para pensar 2010 y shocks naturales severos.' },
  pandemic: { label: 'Pandemia / shock mixto', delta: { daA: -35, A: -0.04, costShock: 0.18 }, watch: 'movilidad, desempleo, inflación, servicios y política', changedText: 'Se combinan caída de demanda con restricción de oferta.', mediumRun: 'La secuencia temporal importa: primero domina oferta/caída; luego la reapertura puede activar demanda e inflación.', reality: 'Es el ejemplo clásico de shock mixto reciente.' }
};

const GUIDED_CASES = {
  iran: {
    kicker: 'Caso guiado · geopolítica y costos',
    title: 'Irán / energía / inflación',
    episode: 'Episodio: un conflicto en Medio Oriente tensiona petróleo, seguros, fletes y expectativas. Para Chile, la primera manifestación puede aparecer antes como costos importados más altos, presión inflacionaria y discusión sobre tasa de política.',
    why: 'Importa porque permite entrar a la macro desde una pregunta muy vigente: cómo un episodio geopolítico lejano termina alterando precios, tasa, actividad y márgenes en una economía abierta como la chilena.',
    manifestations: 'Se vuelve relevante cuando aparecen alzas en petróleo y combustibles, mayor presión sobre importados, dudas sobre inflación futura y un debate más duro sobre cuánto espacio tiene la política monetaria para acompañar actividad sin perder credibilidad.',
    questions: '¿Por qué el alza de energía no pega igual sobre producción y precios? ¿Cuándo domina primero el canal de costos y cuándo aparece el de actividad? ¿Qué papel juegan el BCCh, el pass-through y las expectativas?',
    mechanism: 'Shock de costos externos → suben petróleo, fletes y seguros → aumentan costos importados → OA se desplaza → cambian P, Y y la brecha respecto de Yₙ → la política monetaria, los márgenes y las expectativas condicionan la trayectoria posterior.',
    modelWhy: 'OA-DA ayuda más como primera entrada porque deja ver simultáneamente producción, precios y brecha respecto de Yₙ. IS-LM-BP sirve después para abrir el canal cambiario y externo, pero aquí conviene empezar por el corazón estanflacionario del episodio.',
    observe: 'Al llegar verás el simulador OA-DA. Primero mira si OA se desplazó hacia arriba; luego ubica el nuevo equilibrio; después compara la brecha respecto de Yₙ; y finalmente usa la lectura automática para pensar qué haría el BCCh y qué observarías después en combustibles, IPC y actividad.',
    targetTab: 'oada',
    targetShock: 'oilUp',
    highlight: '#oada .chart-card',
    arrival: {
      title: 'OA-DA · shock de costos energéticos',
      what: 'Estás entrando al simulador OA-DA. Esta página muestra cómo un shock puede mover simultáneamente precios y producción, y si además acerca o aleja a la economía de su producto natural Yₙ.',
      shock: 'Aquí estás analizando un shock geopolítico que sube costos energéticos e importados. La pregunta no es solo si sube la inflación, sino si el deterioro también erosiona actividad y cuánto de eso puede volverse persistente.',
      graph: 'En el gráfico, el eslabón central se ve cuando OA se desplaza hacia arriba. Ese movimiento cambia el punto de equilibrio: normalmente sube P, cae Y y la brecha respecto de Yₙ se vuelve más negativa o menos positiva.',
      next: 'Después de leer el gráfico, revisa la brecha respecto de Yₙ y la nota de mediano plazo. Luego vuelve a “Qué mirar en Chile” y pregunta: ¿están subiendo primero combustibles e IPC transable, o ya aparece daño en actividad y empleo?'
    }
  },
  copper: {
    kicker: 'Caso guiado · apertura y sector externo',
    title: 'Cobre / CLP-USD / sector externo',
    episode: 'Episodio: el precio del cobre cae o pierde impulso y el shock entra por exportaciones, ingresos externos, recaudación y tipo de cambio. Aquí la historia no se entiende bien en una economía cerrada.',
    why: 'Importa porque obliga a pensar a Chile como economía abierta: el ajuste no ocurre solo en producto o tasa; también pasa por E, NX, portafolios y vulnerabilidad externa.',
    manifestations: 'El caso se vuelve visible cuando el cobre pierde fuerza, el peso se deprecia, cambian expectativas sobre ingresos fiscales y aparece una discusión más intensa sobre cuenta corriente, inversión minera y disciplina externa.',
    questions: '¿Cómo se transmite una caída del cobre al peso? ¿Qué parte del ajuste la absorbe el tipo de cambio y qué parte termina en actividad? ¿Qué cambia cuando el shock afecta ingresos fiscales y expectativas?',
    mechanism: 'Deterioro de términos de intercambio → cae x₀ y empeora el entorno externo → presión sobre E y NX → cambian IS y el nuevo equilibrio bajo BP horizontal.',
    modelWhy: 'IS-LM-BP ayuda más porque hace visible algo crucial para Chile: parte importante del ajuste no se ve primero en Y, sino en el tipo de cambio y en exportaciones netas bajo flotación cambiaria.',
    observe: 'Al llegar verás IS-LM-BP. Mira la IS inicial y final, compara E y NX, y pregunta si el equilibrio final casi coincide con el inicial porque el ajuste principal está ocurriendo en el tipo de cambio.',
    targetTab: 'islmbp',
    targetShock: 'copperDown',
    highlight: '#islmbp .chart-card',
    arrival: {
      title: 'IS-LM-BP · términos de intercambio y flotación',
      what: 'Estás entrando al simulador IS-LM-BP. Esta página muestra cómo interactúan demanda, dinero, sector externo y tipo de cambio cuando la economía está abierta y opera con alta movilidad de capitales.',
      shock: 'Aquí analizas una caída del cobre. En Chile eso no es solo un problema exportador: también afecta ingresos externos, recaudación, expectativas y el precio relativo clave para absorber el shock, el tipo de cambio.',
      graph: 'En el gráfico, ubica primero la IS final y luego mira si el nuevo equilibrio cambia poco en Y pero mucho en E y NX. Esa es precisamente una de las enseñanzas centrales del modelo bajo flotación.',
      next: 'Después revisa “Qué mirar en Chile” y prueba la comparación con otros shocks externos. La pregunta útil es: ¿se está ajustando primero el peso, la cuenta externa o la actividad real?'
    }
  },
  fiscal: {
    kicker: 'Caso guiado · política fiscal y demanda',
    title: 'Ajuste fiscal / actividad / tasas',
    episode: 'Episodio: el gobierno reduce impulso fiscal o acelera consolidación. El punto de partida no es moralizar el ajuste, sino entender qué canal domina primero y cómo reaccionan actividad, tasa e inversión.',
    why: 'Importa porque muestra con claridad qué sí y qué no entrega IS-LM: multiplicador, crowding-out, acelerador y límites de una lectura en economía cerrada.',
    manifestations: 'Se vuelve relevante cuando el debate público gira en torno a menor gasto, credibilidad fiscal, desaceleración y posible alivio de tasas. Es una puerta de entrada muy útil para ver por qué el mismo ajuste puede leerse distinto según el peso del acelerador y del crowding-out.',
    questions: '¿Qué cae primero cuando disminuye G? ¿La tasa se mueve suficiente como para aliviar inversión? ¿Cuándo el acelerador vuelve más intensa la desaceleración?',
    mechanism: 'Menor G → se desplaza IS → cambian Y e i → la inversión reacciona por tasa y por nivel de actividad. La comparación entre crowding-out y acelerador ayuda a ordenar el diagnóstico.',
    modelWhy: 'IS-LM ayuda más porque deja ver con nitidez el juego entre mercado de bienes y mercado de dinero. No resuelve toda la historia, pero sí muestra el núcleo del ajuste sobre demanda, tasa e inversión.',
    observe: 'Al llegar verás IS-LM. Mira el desplazamiento de la IS, el cambio en Y, i e inversión, y luego compara en la caja lateral cuánto del resultado parece dominado por crowding-out y cuánto por acelerador.',
    targetTab: 'islm',
    targetShock: 'fiscalContract',
    highlight: '#islm .chart-card',
    arrival: {
      title: 'IS-LM · ajuste fiscal y demanda agregada',
      what: 'Estás entrando al simulador IS-LM. Esta página muestra cómo se determina el equilibrio conjunto entre mercado de bienes y mercado de dinero, y cómo un cambio fiscal altera producción, tasa e inversión.',
      shock: 'Aquí analizas una contracción fiscal. La pregunta central es si la caída de demanda domina, si la tasa baja lo suficiente para amortiguar el golpe y cómo responde la inversión en ese balance.',
      graph: 'En el gráfico, localiza la IS inicial y final. El mecanismo principal está allí: al caer G, se desplaza la IS y cambian simultáneamente Y e i. Luego mira si la inversión cae por menor actividad, por la tasa o por ambas.',
      next: 'Después revisa la comparación crowding-out vs acelerador y la caja de “Qué mirar en Chile”. La siguiente pregunta útil es: ¿la menor presión sobre tasas alcanza a compensar la desaceleración de la demanda?'
    }
  },
  dashboard: {
    kicker: 'Entrada directa al tablero',
    title: 'Tablero Macro',
    episode: 'Episodio: antes de elegir un modelo, conviene ubicar el presente dentro del ciclo chileno. El tablero resume crecimiento, inflación, desempleo, TPM, tipo de cambio, cobre y petróleo.',
    why: 'Importa porque evita leer cada dato como si estuviera aislado. El tablero ayuda a ver quiebres, rezagos y coexistencia de shocks antes de bajar al lente formal.',
    manifestations: 'La relevancia aparece cuando varias series parecen contar historias distintas al mismo tiempo: crecimiento moderado, inflación en baja, tipo de cambio alto, cobre y petróleo moviéndose por fuerzas globales y TPM todavía condicionando el ajuste.',
    questions: '¿Qué series reaccionan primero? ¿Qué cambios parecen venir de demanda, cuáles de costos y cuáles del sector externo? ¿Qué quiebres dominan el período?',
    mechanism: 'Observación histórica guiada → identificación de quiebres → selección del modelo útil.',
    modelWhy: 'El tablero ayuda más cuando todavía no sabes qué modelo elegir. Su valor está en obligarte a mirar secuencias, desacoples y convivencias de shocks antes de pasar a una formalización.',
    observe: 'Al llegar verás el tablero macro. Empieza por la lectura general, luego revisa snapshots 2025 y después compara las tres franjas de gráficos: actividad-precios-empleo; TPM y tipo de cambio; cobre y WTI.',
    targetTab: 'tablero',
    targetShock: '',
    highlight: '#tablero .dashboard-shell-v2',
    arrival: {
      title: 'Tablero Macro · secuencia y quiebres',
      what: 'Estás entrando al tablero histórico. Esta página no reemplaza los modelos: los prepara. Su función es mostrar qué variables reaccionan primero, cuáles con rezago y qué quiebres del período ayudan a escoger mejor el lente formal.',
      shock: 'Aquí no analizas un solo shock, sino una secuencia de episodios: desaceleración, estallido, pandemia, rebote inflacionario, endurecimiento monetario, términos de intercambio y energía.',
      graph: 'Mira primero la franja 1 para actividad, precios y empleo; luego la franja 2 para TPM y tipo de cambio; y termina en la franja 3 para cobre y petróleo. El mecanismo aparece en cómo esas series se desacoplan o se sincronizan.',
      next: 'Después elige un caso guiado o baja al modelo que mejor capture el canal dominante. La regla es simple: si domina precios y costos, parte por OA-DA; si domina apertura y tipo de cambio, parte por IS-LM-BP; si domina demanda interna, parte por IS-LM.'
    }
  }
};

const WATCH_GUIDES = {
  islm: {
    none: 'Pregunta clave: ¿qué combinación de actividad, tasa e inversión describe mejor la base? Mira IMACEC, tasas de mercado y formación bruta de capital para construir una línea de referencia antes de meter shocks.',
    fiscalExpand: 'Pregunta clave: ¿el impulso fiscal está levantando actividad más rápido de lo que suben las tasas? Mira IMACEC, ejecución fiscal, tasas largas e inversión. Si actividad sube pero la inversión privada no acompaña, el crowding-out puede estar ganando terreno.',
    fiscalContract: 'Pregunta clave: ¿la menor presión fiscal enfría demanda más rápido de lo que aliviana tasas? Mira IMACEC, inversión, empleo, tasas largas y balance estructural. Si las tasas ceden pero la inversión no repunta, el canal dominante sigue siendo la debilidad de actividad.',
    monetaryExpand: 'Pregunta clave: ¿la relajación monetaria está empujando crédito e inversión o solo estabilizando? Mira TPM, colocaciones, ventas e inversión. La trayectoria mejora si el crédito empieza a moverse antes que el empleo.',
    monetaryContract: 'Pregunta clave: ¿el enfriamiento entra primero por tasa, crédito o inversión? Mira TPM, tasas bancarias, crédito comercial e IPC. Si la inflación cede antes que la actividad, el ajuste está operando por el canal esperado.',
    betterExpectations: 'Pregunta clave: ¿la mejora de expectativas se traduce en inversión efectiva? Mira encuestas de confianza, anuncios de inversión, ventas y tasas. Si mejora la confianza pero no la inversión, el mecanismo sigue incompleto.',
    worseExpectations: 'Pregunta clave: ¿la caída de confianza ya está frenando gasto e inversión? Mira confianza empresarial, IMACEC, inversión y empleo. La señal fuerte aparece cuando el deterioro de expectativas empieza a contaminar decisiones reales.'
  },
  islmbp: {
    none: 'Pregunta clave: ¿la base se está moviendo más por tasa interna, por el entorno externo o por el tipo de cambio? Mira TPM, CLP/USD, cobre y balanza comercial para identificar cuál es la bisagra dominante.',
    fiscalExpand: 'Pregunta clave: ¿el impulso fiscal se está filtrando hacia apreciación y deterioro externo? Mira gasto, CLP/USD, cuenta corriente, tasas e importaciones. Si la demanda sube pero el peso se aprecia y NX empeora, estás viendo la fuga externa del impulso.',
    fiscalContract: 'Pregunta clave: ¿la consolidación fiscal reduce demanda más rápido de lo que mejora la percepción externa? Mira actividad, CLP/USD, riesgo soberano y cuenta corriente. Si mejora el peso o el riesgo, el filtro institucional puede estar amortiguando parte del costo real.',
    monetaryExpand: 'Pregunta clave: ¿la política monetaria está operando sobre E y NX además de Y? Mira TPM, CLP/USD, crédito y exportaciones netas. Bajo flotación, una parte clave del mecanismo debería aparecer primero en el tipo de cambio.',
    monetaryContract: 'Pregunta clave: ¿la contracción está apreciando el peso o frenando una depreciación previa? Mira CLP/USD, inflación transable, crédito e inversión. La trayectoria se clarifica cuando baja la presión cambiaria y luego cede la inflación.',
    higherWorldRate: 'Pregunta clave: ¿el shock global entra primero por spreads, por el peso o por el costo de financiamiento? Mira Fed, tasas largas locales, CLP/USD y spreads. Si el peso se deprecia rápido, el ajuste externo ya está en marcha.',
    lowerWorldRate: 'Pregunta clave: ¿la relajación internacional abre espacio para un alivio local sin tensionar el peso? Mira flujos, CLP/USD, tasas largas y crédito. El canal se confirma si mejoran condiciones financieras antes que actividad.',
    copperDown: 'Pregunta clave: ¿la caída del cobre ya está pasando al CLP/USD y a la percepción sobre ingresos externos? Mira cobre, CLP/USD, balanza comercial, recaudación minera y spreads. Si el peso se mueve primero y NX tarda, el ajuste está entrando por precios relativos.',
    copperUp: 'Pregunta clave: ¿la mejora del cobre se está traduciendo en apreciación, mayor inversión minera o más espacio fiscal? Mira cobre, CLP/USD, anuncios de inversión y recaudación. La trayectoria se fortalece si la mejora externa no se agota solo en el tipo de cambio.',
    globalRecession: 'Pregunta clave: ¿el golpe externo está entrando por exportaciones, confianza o ambas? Mira actividad global, exportaciones chilenas, CLP/USD e inversión. Si caen exportaciones y sube el dólar, el canal externo domina claramente.',
    oilUp: 'Pregunta clave: ¿el shock energético está entrando primero por el tipo de cambio, por importados o por ambos? Mira WTI, combustibles, CLP/USD, IPC transable y TPM. Si sube el dólar y también los combustibles, el canal externo y el de costos se están reforzando.',
    pesoDepreciation: 'Pregunta clave: ¿la depreciación está ayudando a NX más rápido de lo que daña inflación? Mira CLP/USD, balanza comercial, inflación transable y expectativas. La clave es ver si el pass-through domina o si aparece una mejora neta externa.',
    pesoAppreciation: 'Pregunta clave: ¿la apreciación alivia inflación más rápido de lo que erosiona competitividad? Mira CLP/USD, inflación transable, exportaciones y márgenes en transables. Si baja inflación importada pero empeora el sector exportador, el trade-off se vuelve visible.'
  },
  oada: {
    none: 'Pregunta clave: ¿la economía parece cerca, arriba o abajo de Yₙ? Mira inflación, actividad y expectativas. La utilidad del modelo empieza cuando puedes separar presiones de demanda de holguras o restricciones de oferta.',
    fiscalExpand: 'Pregunta clave: ¿el impulso está levantando más Y o más P? Mira IMACEC, empleo, IPC y expectativas. Si el producto ya estaba cerca de Yₙ, el mismo impulso se vuelve más inflacionario.',
    fiscalContract: 'Pregunta clave: ¿la consolidación está cerrando una brecha inflacionaria o abriendo holgura excesiva? Mira actividad, empleo, inflación y expectativas. La trayectoria importa más que el primer impacto aislado.',
    monetaryExpand: 'Pregunta clave: ¿la mayor demanda reabre actividad sin desanclar precios? Mira crédito, ventas, empleo e inflación subyacente. Si sube actividad pero también reaparece presión inflacionaria, DA ya está chocando con capacidad.',
    monetaryContract: 'Pregunta clave: ¿la desinflación viene con caída acotada de actividad o con brecha demasiado negativa? Mira TPM, IPC SAE, IMACEC, desempleo y expectativas. El equilibrio es mejor cuando baja la inflación sin un deterioro excesivo de Y frente a Yₙ.',
    oilUp: 'Pregunta clave: ¿domina el canal de costos o ya hay segunda vuelta en salarios y márgenes? Mira WTI, combustibles, IPC transable, expectativas, reajustes salariales y márgenes. Si primero suben combustibles y luego la inflación subyacente, el shock se está propagando.',
    productivityUp: 'Pregunta clave: ¿la mejora eleva Yₙ o solo empuja actividad transitoria? Mira productividad, costos unitarios, inversión y salarios reales. La señal fuerte es cuando mejora capacidad sin castigar inflación.',
    productivityDown: 'Pregunta clave: ¿la caída de productividad está achicando Yₙ o solo frenando demanda? Mira productividad, costos unitarios, inversión y márgenes. Si suben costos con crecimiento débil, el problema es más de oferta que de demanda.',
    socialUnrest: 'Pregunta clave: ¿predomina la caída de demanda o el daño sobre oferta, coordinación y riesgo? Mira EMBI, CLP/USD, inversión, empleo, inflación y daño físico. Si caen inversión y confianza mientras suben algunos costos, el shock es mixto y persistente.',
    earthquake: 'Pregunta clave: ¿domina primero la pérdida de capacidad o la demanda de reconstrucción? Mira capacidad productiva, empleo, precios, inversión pública y reconstrucción. La secuencia temporal es esencial: primero oferta, luego demanda.',
    pandemic: 'Pregunta clave: ¿el episodio está operando como caída de demanda, restricción de oferta o ambas? Mira movilidad, empleo, servicios, inflación y política. La composición del shock cambia en el tiempo y por eso el mismo episodio puede mover OA y DA sucesivamente.'
  }
};

function safeDiv(a, b) { return a / (Math.abs(b) < EPS ? (b < 0 ? -EPS : EPS) : b); }
function round(value, digits = 2) { return Number.isFinite(value) ? Number(value).toFixed(digits) : '—'; }
function clampPositive(v) { return Math.max(0, v); }
function signWord(delta, pos, neg, neutral='se mantiene aproximadamente estable') {
  if (Math.abs(delta) < 0.03) return neutral;
  return delta > 0 ? pos : neg;
}
function applyDelta(base, delta={}) {
  const out = {...base};
  Object.entries(delta).forEach(([k,v]) => out[k] = (out[k] ?? 0) + v);
  return out;
}
function readParams(prefix, defaults) {
  const out = {};
  Object.keys(defaults).forEach((k) => {
    const el = document.getElementById(`${prefix}-${k}`);
    out[k] = el ? Number(el.value) : defaults[k];
  });
  return out;
}
function fillInputs(prefix, defaults) {
  Object.keys(defaults).forEach((k) => {
    const el = document.getElementById(`${prefix}-${k}`);
    if (el) el.value = defaults[k];
  });
}
function populateSelect(id, optionsMap) {
  const select = document.getElementById(id);
  select.innerHTML = '';
  Object.entries(optionsMap).forEach(([key, obj]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = typeof obj === 'string' ? obj : obj.label;
    select.appendChild(opt);
  });
}
function bindInputs(prefix, defaults, callback) {
  Object.keys(defaults).forEach((k) => {
    const el = document.getElementById(`${prefix}-${k}`);
    if (el) el.addEventListener('input', callback);
  });
}
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}
function activateTab(target) {
  const buttons = [...document.querySelectorAll('.tab-button')];
  const panels = [...document.querySelectorAll('.tab-panel')];
  buttons.forEach(b => b.classList.toggle('active', b.dataset.tab === target));
  panels.forEach(p => p.classList.toggle('active', p.id === target));
}
function initTabs() {
  document.querySelectorAll('.tab-button').forEach((btn) => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
}
function buildLine(fn, xMin, xMax, n=50) {
  const points = [];
  const step = (xMax - xMin) / n;
  for (let i=0;i<=n;i++) {
    const x = xMin + i*step;
    points.push({x, y: fn(x)});
  }
  return points;
}
function centeredRange(values, minSpan=100, floor=0) {
  const vals = values.filter(v => Number.isFinite(v));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = Math.max(max - min, minSpan);
  const center = (min + max) / 2;
  return { min: Math.max(floor, center - span * 0.7), max: center + span * 0.7 };
}
function drawChart(key, canvasId, config) {
  if (charts[key]) charts[key].destroy();
  const ctx = document.getElementById(canvasId).getContext('2d');
  charts[key] = new Chart(ctx, config);
}
function pointDataset(label, x, y, style) {
  return {
    label,
    data: [{x,y}],
    showLine: false,
    pointRadius: style.radius,
    pointHoverRadius: style.radius + 1,
    pointBackgroundColor: style.bg,
    pointBorderColor: style.border,
    pointBorderWidth: style.borderWidth,
    pointStyle: style.pointStyle || 'circle'
  };
}

function highlightElement(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.remove('highlight-card');
  void el.offsetWidth;
  el.classList.add('highlight-card');
  setTimeout(() => el.classList.remove('highlight-card'), 2200);
}

function calcISLM(params, regime) {
  const A = 1 - params.c1 - params.b1;
  const K = params.c0 - params.c1*params.T + params.b0 + params.G;
  let Y, i;
  if (regime === 'horizontal') {
    i = params.iFixed;
    Y = safeDiv(K - params.b2*i, A);
  } else {
    Y = safeDiv(params.d2*K + params.b2*params.MP, params.d2*A + params.b2*params.d1);
    i = safeDiv(params.d1*Y - params.MP, params.d2);
  }
  const investment = params.b0 + params.b1*Y - params.b2*i;
  const acceleratorComponent = params.b1 * Y;
  return {A, K, Y, i, investment, acceleratorComponent};
}
function isCurve(params) {
  const A = 1 - params.c1 - params.b1;
  const K = params.c0 - params.c1*params.T + params.b0 + params.G;
  return (Y) => safeDiv(K - A*Y, params.b2);
}
function lmCurve(params, regime) {
  if (regime === 'horizontal') return () => params.iFixed;
  return (Y) => safeDiv(params.d1*Y - params.MP, params.d2);
}
function renderISLM() {
  const regime = document.getElementById('islm-regime').value;
  const shockKey = document.getElementById('islm-shock').value;
  const shock = ISLM_SHOCKS[shockKey];
  const base = readParams('islm', ISLM_DEFAULTS);
  const fin = applyDelta(base, shock.delta);
  const initial = calcISLM(base, regime);
  const final = calcISLM(fin, regime);

  const xr = centeredRange([initial.Y, final.Y], 320, 0);
  const yr = centeredRange([initial.i, final.i, base.iFixed, fin.iFixed], 4.5, 0);

  drawChart('islm','islm-chart',{
    type: 'scatter',
    data: {
      datasets: [
        {type:'line', label:'IS inicial', data:buildLine(isCurve(base), xr.min, xr.max), borderColor:'#2d6ea3', borderWidth:2.4, pointRadius:0},
        {type:'line', label:'IS final', data:buildLine(isCurve(fin), xr.min, xr.max), borderColor:'#7cb4df', borderWidth:2.4, borderDash:[6,6], pointRadius:0},
        {type:'line', label:'LM inicial', data:buildLine(lmCurve(base, regime), xr.min, xr.max), borderColor:'#16a34a', borderWidth:2.4, pointRadius:0},
        {type:'line', label:'LM final', data:buildLine(lmCurve(fin, regime), xr.min, xr.max), borderColor:'#8ad1a3', borderWidth:2.4, borderDash:[6,6], pointRadius:0},
        pointDataset('Eq. inicial', initial.Y, initial.i, {radius:5, bg:'#0f2740', border:'#0f2740', borderWidth:1}),
        pointDataset('Eq. final', final.Y, final.i, {radius:8, bg:'rgba(245,158,11,0.18)', border:'#f59e0b', borderWidth:3})
      ]
    },
    options: chartOptions('Producción (Y)', 'Tasa de interés (i)', xr, yr)
  });

  setText('islm-y0', round(initial.Y));
  setText('islm-y1', round(final.Y));
  setText('islm-i0', round(initial.i));
  setText('islm-i1', round(final.i));
  setText('islm-inv0', round(initial.investment));
  setText('islm-inv1', round(final.investment));
  setText('islm-equilibrium', `Equilibrio inicial: (Y=${round(initial.Y)}, i=${round(initial.i)}). Equilibrio final: (Y=${round(final.Y)}, i=${round(final.i)}).`);

  const dY = final.Y - initial.Y;
  const di = final.i - initial.i;
  const dI = final.investment - initial.investment;
  const curves = [];
  if (Object.keys(shock.delta).some(k => ['G','T','b0','c0','c1','b1','b2'].includes(k))) curves.push('IS');
  if (regime === 'upward' && Object.keys(shock.delta).some(k => ['MP','d1','d2'].includes(k))) curves.push('LM');
  if (regime === 'horizontal' && Object.keys(shock.delta).some(k => ['MP'].includes(k))) curves.push('el ajuste pasa por el nivel de Y con tasa fijada');
  const curveText = curves.length ? `Curvas afectadas: ${curves.join(', ')}.` : 'No se desplaza ninguna curva.';

  setText('islm-explanation',
    `Shock: ${shock.label}. ${shock.changedText} ${curveText} ` +
    `La producción ${signWord(dY,'sube','baja')} y la tasa ${signWord(di,'sube','baja')}. ` +
    `La inversión ${signWord(dI,'aumenta','cae')} y la lectura relevante es: ${shock.reality}`
  );

  const crowding = Math.max(0, fin.b2 * Math.max(0, di));
  const accelerator = Math.max(0, fin.b1 * Math.max(0, dY));
  let dominance = '';
  if (regime === 'horizontal') {
    dominance = 'Con LM horizontal no aparece crowding-out vía tasa; el acelerador domina si la actividad sube.';
  } else if (di <= 0 && dY > 0) {
    dominance = 'No aparece crowding-out relevante; domina el aumento de actividad.';
  } else if (dI > 0) {
    dominance = accelerator >= crowding ?
      'El acelerador prima: la mejora de actividad compensa o supera el encarecimiento del dinero.' :
      'Hay crowding-out parcial, pero no alcanza a revertir totalmente el impulso de inversión.';
  } else if (dI < 0) {
    dominance = crowding > accelerator ?
      'Prima el crowding-out: la tasa sube lo suficiente como para frenar la inversión pese al mayor nivel de actividad.' :
      'La inversión cae por combinación de menor actividad y/o tasas más altas.';
  } else {
    dominance = 'El balance entre acelerador y crowding-out es casi neutro.';
  }
  setText('islm-crowd', `Acelerador aproximado: b1·ΔY = ${round(accelerator)}. Crowding-out aproximado: b2·Δi = ${round(crowding)}. ${dominance}`);
  setHTML('islm-watch', `<strong>Dato a mirar en Chile.</strong> ${watchCopy('islm', shockKey, shock.watch)}`);
}

function calcISLMBP(params, fxShock=0) {
  const Y = safeDiv(params.MP + params.d2*params.iStar, params.d1);
  const A = 1 - params.c1 - params.b1 + params.x1;
  const K = params.c0 - params.c1*params.T + params.b0 + params.G + params.x0;
  const eRaw = safeDiv(A*Y - K + params.b2*params.iStar, params.x2) + fxShock;
  const eIndex = 100 + eRaw;
  const NX = params.x0 - params.x1*Y + params.x2*eRaw;
  return {A, K, Y, i: params.iStar, eRaw, eIndex, NX};
}
function isCurveBP(params, eRaw) {
  const A = 1 - params.c1 - params.b1 + params.x1;
  const K = params.c0 - params.c1*params.T + params.b0 + params.G + params.x0 + params.x2*eRaw;
  return (Y) => safeDiv(K - A*Y, params.b2);
}
function lmCurveBP(params) { return (Y) => safeDiv(params.d1*Y - params.MP, params.d2); }
function bpCurve(params) { return () => params.iStar; }
function renderISLMBP() {
  const shockKey = document.getElementById('islmbp-shock').value;
  const shock = ISLMBP_SHOCKS[shockKey];
  const base = readParams('islmbp', ISLMBP_DEFAULTS);
  const fin = applyDelta(base, shock.delta);
  const initial = calcISLMBP(base, 0);
  const final = calcISLMBP(fin, shock.fxShock);

  const xr = centeredRange([initial.Y, final.Y], 90, 0);
  const yr = centeredRange([initial.i, final.i], 0.8, 0);
  const overlap = Math.abs(initial.Y - final.Y) < 0.01 && Math.abs(initial.i - final.i) < 0.01;

  drawChart('islmbp','islmbp-chart',{
    type:'scatter',
    data:{
      datasets:[
        {type:'line', label:'IS inicial', data:buildLine(isCurveBP(base, initial.eRaw), xr.min, xr.max), borderColor:'#2d6ea3', borderWidth:2.4, pointRadius:0},
        {type:'line', label:'IS final', data:buildLine(isCurveBP(fin, final.eRaw), xr.min, xr.max), borderColor:'#7cb4df', borderWidth:2.4, borderDash:[6,6], pointRadius:0},
        {type:'line', label:'LM inicial', data:buildLine(lmCurveBP(base), xr.min, xr.max), borderColor:'#16a34a', borderWidth:2.4, pointRadius:0},
        {type:'line', label:'LM final', data:buildLine(lmCurveBP(fin), xr.min, xr.max), borderColor:'#8ad1a3', borderWidth:2.4, borderDash:[6,6], pointRadius:0},
        {type:'line', label:'BP inicial', data:buildLine(bpCurve(base), xr.min, xr.max), borderColor:'#7c3aed', borderWidth:2.4, pointRadius:0},
        {type:'line', label:'BP final', data:buildLine(bpCurve(fin), xr.min, xr.max), borderColor:'#b89af6', borderWidth:2.4, borderDash:[6,6], pointRadius:0},
        pointDataset('Eq. inicial', initial.Y, initial.i, {radius:5, bg:'#0f2740', border:'#0f2740', borderWidth:1}),
        pointDataset('Eq. final', final.Y, final.i, {radius: overlap ? 11 : 9, bg:'rgba(255,255,255,0.01)', border:'#f59e0b', borderWidth:3.5})
      ]
    },
    options: chartOptions('Producción (Y)', 'Tasa de interés (i)', xr, yr)
  });

  setText('islmbp-y0', round(initial.Y));
  setText('islmbp-y1', round(final.Y));
  setText('islmbp-i0', round(initial.i));
  setText('islmbp-i1', round(final.i));
  setText('islmbp-e0', round(initial.eIndex));
  setText('islmbp-e1', round(final.eIndex));
  setText('islmbp-nx0', round(initial.NX));
  setText('islmbp-nx1', round(final.NX));
  setText('islmbp-eq0', `(Y=${round(initial.Y)}, i=${round(initial.i)})`);
  setText('islmbp-eq1', `(Y=${round(final.Y)}, i=${round(final.i)})`);

  const dY = final.Y - initial.Y;
  const dE = final.eIndex - initial.eIndex;
  const dNX = final.NX - initial.NX;
  const moved = [];
  if (Object.keys(shock.delta).some(k => ['c0','c1','b0','b1','b2','x0','x1','x2','G','T'].includes(k)) || shock.fxShock !== 0) moved.push('IS');
  if (Object.keys(shock.delta).some(k => ['MP','d1','d2'].includes(k))) moved.push('LM');
  if (Object.keys(shock.delta).some(k => ['iStar'].includes(k))) moved.push('BP');
  let extra = '';
  if (overlap) extra = ' En este régimen, el nuevo equilibrio casi se superpone con el inicial: el ajuste principal se ve en E y en NX más que en grandes cambios de Y.';
  setText('islmbp-explanation',
    `Shock: ${shock.label}. ${shock.changedText} ${moved.length ? `Curvas afectadas: ${moved.join(', ')}.` : ''} ` +
    `La producción ${signWord(dY,'sube','baja')}, el tipo de cambio índice ${signWord(dE,'sube','baja')} y las exportaciones netas ${signWord(dNX,'mejoran','empeoran')}. ${shock.reality}${extra}`
  );
  setHTML('islmbp-watch', `<strong>Dato a mirar en Chile.</strong> ${watchCopy('islmbp', shockKey, shock.watch)}`);
}

function calcOADA(params) {
  const Yn = params.A * params.L;
  const oaBase = params.Pe * (1 + params.mu) + params.z + params.costShock;
  const Y = safeDiv(params.daA - params.daB * oaBase + params.daB * params.gamma * Yn, 1 + params.daB * params.gamma);
  const P = safeDiv(params.daA - Y, params.daB);
  const gap = Y - Yn;
  return {Yn, oaBase, Y, P, gap};
}
function daCurve(params) { return (Y) => safeDiv(params.daA - Y, params.daB); }
function oaCurve(params) {
  const Yn = params.A * params.L;
  const oaBase = params.Pe * (1 + params.mu) + params.z + params.costShock;
  return (Y) => oaBase + params.gamma * (Y - Yn);
}
function setGapBar(fillId, labelId, gap, maxAbsGap) {
  const fill = document.getElementById(fillId);
  const label = document.getElementById(labelId);
  const share = Math.max(6, Math.min(100, Math.abs(gap) / maxAbsGap * 100));
  fill.style.width = `${share}%`;
  fill.className = 'gap-fill ' + (gap > 0 ? 'positive' : gap < 0 ? 'negative' : 'neutral');
  label.textContent = gap > 0 ? `Sobre Yₙ (${round(gap)})` : gap < 0 ? `Bajo Yₙ (${round(gap)})` : 'En Yₙ';
}

function describeOADAPattern(dY, dP, initial, final, moved, shock) {
  const oaMoved = moved.includes('OA / Yₙ');
  const daMoved = moved.includes('DA');
  let title = 'Patrón mixto o de transición';
  let body = 'El shock está moviendo simultáneamente precios y producción de una manera que conviene leer con cautela: puede haber interacción entre demanda, costos y cambios en la capacidad o en Yₙ.';
  let graph = 'Busca primero qué curva cambió más. Si OA se desplaza hacia arriba, producir la misma cantidad exige un precio mayor; si DA se mueve, cambia el gasto compatible con cada nivel de precios.';
  let meaning = 'Cuando se mueven varias piezas a la vez, el valor del modelo está en obligarte a separar canales: demanda, costos, expectativas y capacidad no son sinónimos.';
  let next = 'Después de esta primera lectura, mira la brecha respecto de Yₙ, revisa la nota de mediano plazo y termina en “Qué mirar en Chile” para decidir qué datos conviene monitorear.';

  if (dY > 0.05 && dP > 0.05 && daMoved && !oaMoved) {
    title = 'Patrón compatible con presión de demanda';
    body = 'Suben producción y precios al mismo tiempo porque la demanda agregada empuja el equilibrio hacia arriba y a la derecha. La pregunta siguiente es si la economía se acerca demasiado a Yₙ y vuelve más inflacionario el mismo impulso.';
    graph = 'En el gráfico, la pista principal es una DA final desplazada hacia afuera. El nuevo cruce con OA queda con mayor Y y mayor P.';
    meaning = 'Este patrón suele leerse como expansión de demanda: el producto sube, pero también aumenta la presión sobre precios a medida que la economía se acerca a capacidad.';
  } else if (dY < -0.05 && dP > 0.05 && oaMoved) {
    title = 'Patrón compatible con shock de costos u oferta adversa';
    body = 'La combinación de menor producción y mayor nivel de precios es la señal clásica de un episodio estanflacionario. El interés analítico está en entender por qué producir se volvió más costoso o más difícil.';
    graph = 'La pista principal es una OA final más alta o más a la izquierda: para cualquier nivel de producción, ahora se requiere un precio mayor. El nuevo equilibrio combina más P con menos Y.';
    meaning = 'Este patrón es típico de energía, costos importados, interrupciones productivas o deterioro de productividad. No conviene tratarlo como un simple problema de demanda.';
  } else if (dY > 0.05 && dP < -0.05 && oaMoved) {
    title = 'Patrón compatible con mejora de oferta o productividad';
    body = 'La producción sube mientras los precios caen o se moderan. La economía puede producir más sin empujar tanto los costos, y eso vuelve menos tensionada la brecha respecto de Yₙ.';
    graph = 'La OA final se desplaza hacia abajo o hacia la derecha: el cruce con DA queda con más Y y menor P.';
    meaning = 'Este patrón sugiere alivio de costos, mejora tecnológica, normalización logística o aumento de capacidad. Es el caso más cómodo para una política macro que busca actividad sin inflación.';
  } else if (dY < -0.05 && dP < -0.05 && daMoved && !oaMoved) {
    title = 'Patrón compatible con enfriamiento o contracción de demanda';
    body = 'Caen producción y precios porque la demanda agregada se debilita. La pregunta crítica es si esto corrige una brecha inflacionaria previa o si abre demasiada holgura.';
    graph = 'La pista principal es una DA final desplazada hacia adentro. El nuevo equilibrio queda con menor Y y menor P.';
    meaning = 'Este patrón suele aparecer con consolidación fiscal, endurecimiento monetario o caída fuerte de confianza y gasto. La trayectoria importa más que la fotografía inicial.';
  }

  if (Math.abs(final.gap) > Math.abs(initial.gap) + 0.05) {
    next = 'La brecha final se amplía. Eso te obliga a preguntar si el shock aleja a la economía de Yₙ y qué mecanismo podría cerrar o agrandar esa distancia en el tiempo. Revisa luego la trayectoria de mediano plazo y los datos sugeridos para Chile.';
  } else if (Math.abs(final.gap) + 0.05 < Math.abs(initial.gap)) {
    next = 'La brecha final se reduce. Eso sugiere una economía más cerca de Yₙ, pero todavía debes decidir si esa convergencia ocurre por una mejora sana de oferta o por un enfriamiento costoso de demanda.';
  }

  return { title, body, graph, meaning, next };
}

function renderOADA() {
  const shockKey = document.getElementById('oada-shock').value;
  const shock = OADA_SHOCKS[shockKey];
  const base = readParams('oada', OADA_DEFAULTS);
  const fin = applyDelta(base, shock.delta);
  const initial = calcOADA(base);
  const final = calcOADA(fin);

  const xr = centeredRange([initial.Y, final.Y, initial.Yn, final.Yn], 70, 0);
  const yr = centeredRange([initial.P, final.P, base.Pe, fin.Pe], 0.35, 0);

  drawChart('oada','oada-chart',{
    type:'scatter',
    data:{
      datasets:[
        {type:'line', label:'DA inicial', data:buildLine(daCurve(base), xr.min, xr.max), borderColor:'#2d6ea3', borderWidth:2.5, pointRadius:0},
        {type:'line', label:'DA final', data:buildLine(daCurve(fin), xr.min, xr.max), borderColor:'#7cb4df', borderWidth:2.5, borderDash:[6,6], pointRadius:0},
        {type:'line', label:'OA inicial', data:buildLine(oaCurve(base), xr.min, xr.max), borderColor:'#ef4444', borderWidth:2.5, pointRadius:0},
        {type:'line', label:'OA final', data:buildLine(oaCurve(fin), xr.min, xr.max), borderColor:'#fca5a5', borderWidth:2.5, borderDash:[6,6], pointRadius:0},
        {type:'line', label:'Yₙ inicial', data:[{x:initial.Yn, y:yr.min},{x:initial.Yn, y:yr.max}], borderColor:'#16a34a', borderWidth:1.8, borderDash:[4,4], pointRadius:0},
        {type:'line', label:'Yₙ final', data:[{x:final.Yn, y:yr.min},{x:final.Yn, y:yr.max}], borderColor:'#86efac', borderWidth:1.8, borderDash:[4,4], pointRadius:0},
        pointDataset('Eq. inicial', initial.Y, initial.P, {radius:5, bg:'#0f2740', border:'#0f2740', borderWidth:1}),
        pointDataset('Eq. final', final.Y, final.P, {radius:9, bg:'rgba(255,255,255,0.01)', border:'#f59e0b', borderWidth:3.4})
      ]
    },
    options: chartOptions('Producción (Y)', 'Nivel de precios (P)', xr, yr)
  });

  setText('oada-y0', round(initial.Y));
  setText('oada-y1', round(final.Y));
  setText('oada-p0', round(initial.P));
  setText('oada-p1', round(final.P));
  setText('oada-gap0', round(initial.gap));
  setText('oada-gap1', round(final.gap));
  setText('oada-equilibrium', `Equilibrio inicial: (Y=${round(initial.Y)}, P=${round(initial.P)}). Equilibrio final: (Y=${round(final.Y)}, P=${round(final.P)}).`);

  const dY = final.Y - initial.Y;
  const dP = final.P - initial.P;
  const moved = [];
  if (Object.keys(shock.delta).some(k => ['daA','daB'].includes(k))) moved.push('DA');
  if (Object.keys(shock.delta).some(k => ['Pe','mu','gamma','z','L','A','costShock'].includes(k))) moved.push('OA / Yₙ');
  setText('oada-explanation',
    `Shock: ${shock.label}. ${shock.changedText} ${moved.length ? `Se afectan ${moved.join(' y ')}.` : ''} ` +
    `La producción ${signWord(dY,'sube','baja')} y el nivel de precios ${signWord(dP,'sube','baja')}. ${shock.reality}`
  );
  const pattern = describeOADAPattern(dY, dP, initial, final, moved, shock);
  setText('oada-pattern-title', pattern.title);
  setText('oada-pattern-body', pattern.body);
  setText('oada-graphread', pattern.graph);
  setText('oada-meaning', pattern.meaning);
  setText('oada-nextstep', pattern.next);
  setText('oada-mediumrun', `${shock.mediumRun} En esta simulación, Yₙ pasa de ${round(initial.Yn)} a ${round(final.Yn)} y la brecha final queda en ${round(final.gap)}.`);
  setHTML('oada-watch', `<strong>Dato a mirar en Chile.</strong> ${watchCopy('oada', shockKey, shock.watch)}`);

  setText('oada-deltaY', `${dY >= 0 ? '+' : ''}${round(dY)} en Y`);
  setText('oada-deltaP', `${dP >= 0 ? '+' : ''}${round(dP)} en P`);
  const maxAbsGap = Math.max(Math.abs(initial.gap), Math.abs(final.gap), 40);
  setGapBar('oada-gapbar0', 'oada-gap-label0', initial.gap, maxAbsGap);
  setGapBar('oada-gapbar1', 'oada-gap-label1', final.gap, maxAbsGap);
}

function chartOptions(xLabel, yLabel, xr, yr) {
  return {
    responsive:true,
    maintainAspectRatio:false,
    animation:false,
    plugins:{
      legend:{position:'bottom', labels:{usePointStyle:true, boxWidth:10}},
      tooltip:{mode:'nearest'}
    },
    scales:{
      x:{type:'linear', min:clampPositive(xr.min), max:xr.max, title:{display:true, text:xLabel}, grid:{color:'#edf2f7'}, ticks:{maxTicksLimit:7}},
      y:{min:clampPositive(yr.min), max:yr.max, title:{display:true, text:yLabel}, grid:{color:'#edf2f7'}, ticks:{maxTicksLimit:7}}
    }
  };
}

function formatSignedDelta(delta, suffix='pp') {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${round(delta, 2)} ${suffix}`;
}
function updateSnapshot(idBase, current, previous, suffix, deltaSuffix='pp') {
  setText(`snap-${idBase}-value`, `${round(current, idBase === 'fx' ? 1 : 2)}${suffix}`);
  setText(`snap-${idBase}-delta`, `vs 2024: ${formatSignedDelta(current - previous, deltaSuffix)}`);
  setText(`badge-${idBase}`, `${round(current, idBase === 'fx' ? 0 : 2)}${suffix.trim()}`);
}
function miniLineChart(key, canvasId, labels, values, color, yTitle, rangeKey) {
  if (charts[key]) charts[key].destroy();
  const [start, end] = ranges[rangeKey];
  const slicedLabels = labels.slice(start, end + 1);
  const slicedValues = values.slice(start, end + 1);
  const min = Math.min(...slicedValues);
  const max = Math.max(...slicedValues);
  const span = Math.max(max - min, 1);
  const pad = span * 0.18;
  const yMin = min - pad;
  const yMax = max + pad;
  const ctx = document.getElementById(canvasId).getContext('2d');
  charts[key] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: slicedLabels,
      datasets: [{
        data: slicedValues,
        borderColor: color,
        backgroundColor: color + '12',
        pointRadius: (context) => context.dataIndex === slicedValues.length - 1 ? 3.6 : 0,
        pointHoverRadius: 4.8,
        pointBackgroundColor: color,
        fill: true,
        tension: 0.16,
        borderWidth: 3.4
      }]
    },
    options: {
      responsive:true,
      maintainAspectRatio:false,
      animation:false,
      devicePixelRatio: window.devicePixelRatio || 2,
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'#10263f',
          displayColors:false,
          callbacks:{ label:(context)=> `${context.formattedValue} ${yTitle}` }
        }
      },
      interaction:{mode:'index', intersect:false},
      scales:{
        x:{ ticks:{autoSkip:true, maxTicksLimit: rangeKey === 'full' ? 8 : 6, color:'#5e7184', maxRotation:0}, title:{display:true, text:'Año', color:'#5e7184', font:{weight:'700'}}, grid:{display:false}},
        y:{ min:yMin, max:yMax, title:{display:true, text:yTitle, color:'#5e7184', font:{weight:'700'}}, ticks:{color:'#5e7184'}, grid:{color:'#e7eef5'} }
      }
    }
  });
}

function renderDashboard(rangeKey='full') {
  miniLineChart('dash-gdp','dash-gdp',dashboardData.years,dashboardData.gdp,'#2563eb','% anual',rangeKey);
  miniLineChart('dash-inflation','dash-inflation',dashboardData.years,dashboardData.inflation,'#f59e0b','% anual',rangeKey);
  miniLineChart('dash-tpm','dash-tpm',dashboardData.years,dashboardData.tpm,'#7c3aed','% anual',rangeKey);
  miniLineChart('dash-unemployment','dash-unemployment',dashboardData.years,dashboardData.unemployment,'#16a34a','% anual',rangeKey);
  miniLineChart('dash-fx','dash-fx',dashboardData.years,dashboardData.fx,'#ef4444','CLP/USD',rangeKey);
  miniLineChart('dash-copper','dash-copper',dashboardData.years,dashboardData.copper,'#0ea5a0','cUSD/lb',rangeKey);
  miniLineChart('dash-wti','dash-wti',dashboardData.years,dashboardData.wti,'#c2410c','USD/barril',rangeKey);

  const last = dashboardData.years.length - 1;
  const prev = last - 1;
  updateSnapshot('gdp', dashboardData.gdp[last], dashboardData.gdp[prev], '%', 'pp');
  updateSnapshot('inflation', dashboardData.inflation[last], dashboardData.inflation[prev], '%', 'pp');
  updateSnapshot('unemployment', dashboardData.unemployment[last], dashboardData.unemployment[prev], '%', 'pp');
  updateSnapshot('tpm', dashboardData.tpm[last], dashboardData.tpm[prev], '%', 'pp');
  updateSnapshot('fx', dashboardData.fx[last], dashboardData.fx[prev], ' CLP/USD', 'CLP');
  updateSnapshot('copper', dashboardData.copper[last], dashboardData.copper[prev], ' cUSD/lb', 'cUSD/lb');
  updateSnapshot('wti', dashboardData.wti[last], dashboardData.wti[prev], ' USD/barril', 'USD/barril');

  const summaries = {
    full: '2010–2025 muestra una economía que sale de reconstrucción y crecimiento relativamente alto, entra en una fase de desaceleración más larga, atraviesa estallido y pandemia, vive un rebote extraordinario con inflación muy alta y luego transita por endurecimiento monetario, desinflación y una normalización todavía expuesta a cobre, energía y tasa internacional.',
    mid: '2019–2025 permite leer la secuencia estallido → pandemia → rebote → inflación → TPM alta → desinflación, pero agrega algo importante: el cobre y el petróleo ayudan a ver que no todo se explica por demanda interna; también importan energía, términos de intercambio y vulnerabilidad externa.',
    recent: '2021–2025 concentra sobrecalentamiento, salto inflacionario, endurecimiento monetario y convergencia posterior. Aquí el tablero es especialmente útil para contrastar cuánto del episodio viene de demanda, cuánto de energía y cuánto del ajuste del entorno externo.'
  };
  setText('dashboard-summary', summaries[rangeKey]);
}

function initDashboardButtons() {
  document.querySelectorAll('.range-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-button').forEach(b => b.classList.toggle('active', b === btn));
      renderDashboard(btn.dataset.range);
    });
  });
}


function openGuidedCase(caseKey) {
  const config = GUIDED_CASES[caseKey];
  if (!config) return;
  setText('case-modal-kicker', config.kicker);
  setText('case-modal-title', config.title);
  setText('case-modal-episode', config.episode);
  setText('case-modal-why', config.why);
  setText('case-modal-manifest', config.manifestations);
  setText('case-modal-questions', config.questions);
  setText('case-modal-mechanism', config.mechanism);
  setText('case-modal-modelwhy', config.modelWhy);
  setText('case-modal-observe', config.observe);
  const modal = document.getElementById('case-modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const continueBtn = document.getElementById('case-modal-continue');
  continueBtn.onclick = () => {
    closeGuidedCase();
    activateTab(config.targetTab);
    if (config.targetTab === 'islm' && config.targetShock) {
      document.getElementById('islm-shock').value = config.targetShock;
      renderISLM();
    }
    if (config.targetTab === 'islmbp' && config.targetShock) {
      document.getElementById('islmbp-shock').value = config.targetShock;
      renderISLMBP();
    }
    if (config.targetTab === 'oada' && config.targetShock) {
      document.getElementById('oada-shock').value = config.targetShock;
      renderOADA();
    }
    if (config.targetTab === 'tablero') {
      renderDashboard(document.querySelector('.range-button.active')?.dataset.range || 'full');
    }
    showGuidedArrival(config.targetTab, config);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      highlightElement(`#${config.targetTab}-guided-arrival`);
      highlightElement(config.highlight);
    }, 220);
  };
}
function closeGuidedCase() {
  const modal = document.getElementById('case-modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function initQuickstartButtons() {
  document.querySelectorAll('.quickstart-button').forEach((button) => {
    button.addEventListener('click', () => openGuidedCase(button.dataset.case));
  });
  document.getElementById('case-modal-close').addEventListener('click', closeGuidedCase);
  document.querySelectorAll('[data-close-case]').forEach(el => el.addEventListener('click', closeGuidedCase));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeGuidedCase();
  });
}

function showGuidedArrival(tabId, config) {
  const prefix = `${tabId}-guided-`;
  const box = document.getElementById(`${tabId}-guided-arrival`);
  if (!box || !config.arrival) return;
  setText(`${prefix}title`, config.arrival.title);
  setText(`${prefix}what`, config.arrival.what);
  setText(`${prefix}shock`, config.arrival.shock);
  setText(`${prefix}graph`, config.arrival.graph);
  setText(`${prefix}next`, config.arrival.next);
  box.classList.remove('hidden');
}
function initGuidedArrivalClose() {
  document.querySelectorAll('[data-close-guided]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.closeGuided;
      document.getElementById(id)?.classList.add('hidden');
    });
  });
}
function watchCopy(model, shockKey, fallback) {
  return WATCH_GUIDES[model]?.[shockKey] || `Pregunta clave: ${fallback}`;
}

function attachReset(buttonId, prefix, defaults, callback) {
  document.getElementById(buttonId).addEventListener('click', () => {
    fillInputs(prefix, defaults);
    callback();
  });
}

function init() {
  if (window.Chart) {
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.color = '#5e7184';
    Chart.defaults.devicePixelRatio = Math.max(2, window.devicePixelRatio || 1);
  }
  initTabs();
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

  attachReset('islm-reset','islm',ISLM_DEFAULTS,renderISLM);
  attachReset('islmbp-reset','islmbp',ISLMBP_DEFAULTS,renderISLMBP);
  attachReset('oada-reset','oada',OADA_DEFAULTS,renderOADA);

  initDashboardButtons();
  initQuickstartButtons();
  initGuidedArrivalClose();

  renderISLM();
  renderISLMBP();
  renderOADA();
  renderDashboard('full');
}
document.addEventListener('DOMContentLoaded', init);
