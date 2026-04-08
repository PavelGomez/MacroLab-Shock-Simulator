const charts = {};
const EPS = 1e-9;

const dashboardData = {
  years: [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],
  gdp: [5.851416,6.223897,6.15534,3.308508,1.792649,2.151942,1.753039,1.357695,3.990029,0.644223,-6.139697,11.337403,2.063919,0.677025,2.805126,2.459255],
  inflation: [2.972868,4.437733,1.486965,2.838075,4.646381,4.378512,2.708725,2.269594,2.140987,3.00048,2.972871,7.172841,12.781654,3.374501,4.527165,3.452404],
  unemployment: [7.210129,6.81461,6.224656,5.781732,6.205597,5.870419,6.200413,6.512653,7.146463,7.063169,10.286319,7.189893,7.862749,8.475639,8.07973,8.049514],
  fx: [510.37664,483.364048,486.746559,494.995161,570.005904,654.249,676.832421,649.328785,640.290772,702.631048,792.221833,759.27284,872.33152,839.073401,943.582419,951.64121],
  tpm: [1.422,4.666667,5.009109,4.922379,3.756024,3.06,3.5,2.736842,2.549797,2.49498,0.785857,1.195,8.508,10.5,6.219758,4.886089],
  copper: [348.823308,394.397167,360.625583,329.457917,305.5595,241.669231,230.498417,288.622167,288.90875,270.593667,297.549917,437.196692,387.864667,379.345083,423.095833,450.836667],
  wti: [80.196154,95.978333,93.738333,97.93,89.308333,46.08,46.808333,52.5475,63.305,57.128333,39.475833,76.013077,90.1925,78.006667,75.119167,64.626667]
};
const ranges = { full:[0,15], mid:[9,15], recent:[11,15] };

const dashboardL2 = {
  years: [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],
  imacec: [6.1,5.3,5.6,3.4,1.8,2.2,1.7,1.4,4.0,0.6,-6.1,11.3,2.1,0.7,2.8,2.5],
  ipcSae: [1.8,2.2,1.4,1.9,4.1,4.6,2.3,1.7,1.8,2.6,2.4,5.2,10.1,5.8,3.9,3.2],
  embi: [130,150,142,158,155,208,198,132,148,180,285,165,195,145,135,128],
  ccPib: [1.5,-1.3,-3.6,-4.1,-1.7,-2.3,-1.7,-2.3,-3.6,-3.4,1.4,-6.8,-8.4,-3.2,-2.1,-1.8]
};

const ISLM_DEFAULTS = { c0:120, c1:0.65, b0:90, b1:0.10, b2:22, G:220, T:180, MP:380, d1:0.90, d2:60, iFixed:4.5 };
const ISLM_REGIMES = { upward:'LM con pendiente positiva', horizontal:'LM horizontal (i exógena)' };
const ISLM_SHOCKS = {
  none:{label:'Sin shock',delta:{},watch:'PIB/IMACEC, tasas de mercado, crédito e inversión',changedText:'No cambia ningún parámetro.',reality:'Base docente de referencia.'},
  fiscalExpand:{label:'Expansión fiscal',delta:{G:30},watch:'actividad, balance fiscal, tasas largas, inversión y empleo',changedText:'Aumenta G.',reality:'Puede venir de reconstrucción, mayor gasto cíclico o transferencias.'},
  fiscalContract:{label:'Contracción fiscal',delta:{G:-30},watch:'actividad, consolidación fiscal, consumo y tasas',changedText:'Disminuye G.',reality:'Puede venir de consolidación, caída de ingresos o disciplina fiscal.'},
  monetaryExpand:{label:'Expansión monetaria',delta:{MP:55},watch:'TPM, crédito, tasas de mercado y actividad',changedText:'Aumenta M/P.',reality:'Puede reflejar recorte de TPM o relajación del tono monetario.'},
  monetaryContract:{label:'Contracción monetaria',delta:{MP:-55},watch:'TPM, costo de financiamiento, crédito e inversión',changedText:'Disminuye M/P.',reality:'Suele venir de respuesta a inflación persistente o riesgo de desanclaje.'},
  betterExpectations:{label:'Mejora de expectativas empresariales',delta:{b0:25},watch:'inversión, confianza empresarial, empleo y actividad',changedText:'Aumenta b0.',reality:'Puede venir de mejora política, recuperación externa o mayor visibilidad regulatoria.'},
  worseExpectations:{label:'Deterioro de expectativas empresariales',delta:{b0:-25},watch:'inversión, confianza empresarial y empleo',changedText:'Disminuye b0.',reality:'Puede provenir de incertidumbre política, shock externo o tensión financiera.'}
};

const ISLMBP_DEFAULTS = { c0:120, c1:0.62, b0:90, b1:0.08, b2:18, x0:70, x1:0.10, x2:0.28, G:220, T:180, MP:420, d1:1.05, d2:75, iStar:4.5 };
const ISLMBP_SHOCKS = {
  none:{label:'Sin shock',delta:{},fxShock:0,watch:'CLP/USD, cobre, exportaciones, balanza comercial y TPM',changedText:'No cambia ningún parámetro.',reality:'Base docente con flotación cambiaria.'},
  fiscalExpand:{label:'Expansión fiscal',delta:{G:30},fxShock:-10,watch:'balance fiscal, tasas, CLP/USD y cuenta corriente',changedText:'Aumenta G.',reality:'En flotación suele apreciarse el tipo de cambio y aparecer crowding-out externo.'},
  fiscalContract:{label:'Contracción fiscal',delta:{G:-30},fxShock:8,watch:'actividad, gasto, CLP/USD y riesgo soberano',changedText:'Disminuye G.',reality:'Puede aliviar presión externa y ayudar a credibilidad.'},
  monetaryExpand:{label:'Expansión monetaria',delta:{MP:60},fxShock:18,watch:'TPM, CLP/USD, crédito y exportaciones netas',changedText:'Aumenta M/P.',reality:'En flotación suele ser especialmente eficaz.'},
  monetaryContract:{label:'Contracción monetaria',delta:{MP:-60},fxShock:-14,watch:'TPM, crédito, CLP/USD e inflación',changedText:'Disminuye M/P.',reality:'Endurece condiciones financieras y suele apreciar.'},
  higherWorldRate:{label:'Subida de la tasa internacional',delta:{iStar:1.0},fxShock:18,watch:'Fed, CLP/USD, spreads, tasas largas y capitales',changedText:'Aumenta i*.',reality:'Eleva exigencia externa y puede tensionar CLP/USD.'},
  lowerWorldRate:{label:'Caída de la tasa internacional',delta:{iStar:-1.0},fxShock:-14,watch:'flujos de capital, CLP/USD y condiciones financieras',changedText:'Disminuye i*.',reality:'Relaja el entorno financiero internacional.'},
  copperDown:{label:'Caída del precio del cobre',delta:{x0:-20},fxShock:22,watch:'cobre, CLP/USD, ingresos fiscales y exportaciones',changedText:'Disminuye x0.',reality:'Chile lo siente rápido por exportaciones, tipo de cambio y recaudación.'},
  copperUp:{label:'Aumento del precio del cobre',delta:{x0:20},fxShock:-16,watch:'cobre, CLP/USD, inversión minera y recaudación',changedText:'Aumenta x0.',reality:'Mejora exportaciones y tiende a apreciar el peso.'},
  globalRecession:{label:'Recesión global',delta:{x0:-24,b0:-10},fxShock:24,watch:'actividad global, exportaciones, CLP/USD y confianza',changedText:'Cae demanda externa y se enfría inversión.',reality:'Golpea fuerte a sectores exportadores y transables.'},
  oilUp:{label:'Alza del petróleo',delta:{x0:-12},fxShock:15,watch:'combustibles, CLP/USD, IPC y costos logísticos',changedText:'Empeora x0 y aumenta presión cambiaria.',reality:'Conviene cruzarlo con OA-DA para el canal de costos.'},
  pesoDepreciation:{label:'Depreciación del peso',delta:{},fxShock:40,watch:'CLP/USD, precios importados, NX y expectativas',changedText:'Aumenta E mediante shock cambiario directo.',reality:'Para estudiar competitividad versus pass-through.'},
  pesoAppreciation:{label:'Apreciación del peso',delta:{},fxShock:-35,watch:'CLP/USD, inflación transable y competitividad',changedText:'Disminuye E.',reality:'Alivia inflación importada pero puede dañar transables.'}
};

const OADA_DEFAULTS = { daA:1425, daB:250, Pe:1.0, mu:0.20, gamma:0.0020, z:0.50, L:950, A:1.0, costShock:0.00 };
const OADA_SHOCKS = {
  none:{label:'Sin shock',delta:{},watch:'IPC, actividad y expectativas',changedText:'No cambia ningún parámetro.',mediumRun:'La economía se mantiene en su configuración base.',reality:'Base pedagógica.'},
  fiscalExpand:{label:'Expansión fiscal',delta:{daA:60},watch:'actividad, empleo e inflación',changedText:'Aumenta DA autónoma.',mediumRun:'Si la economía ya está cerca de capacidad, el efecto se vuelve más inflacionario.',reality:'Estímulos fuertes o reconstrucción.'},
  fiscalContract:{label:'Contracción fiscal',delta:{daA:-60},watch:'actividad, empleo e inflación',changedText:'Disminuye DA autónoma.',mediumRun:'Si Y queda bajo Yₙ, cede presión inflacionaria.',reality:'Consolidación y costo real de corto plazo.'},
  monetaryExpand:{label:'Expansión monetaria',delta:{daA:50},watch:'TPM, crédito, IPC y actividad',changedText:'Se desplaza DA a la derecha.',mediumRun:'Si brecha positiva y persistente, aumentan precios.',reality:'Impulso de demanda puede reabrir actividad y luego tensionar precios.'},
  monetaryContract:{label:'Contracción monetaria',delta:{daA:-50},watch:'TPM, IPC SAE, crédito e inversión',changedText:'Se desplaza DA a la izquierda.',mediumRun:'Ayuda a cerrar brechas positivas.',reality:'El ciclo 2021–2023 del BCCh es ejemplo claro.'},
  oilUp:{label:'Alza del petróleo',delta:{costShock:0.50},watch:'combustibles, transporte, IPC y márgenes',changedText:'Sube shock de costos, OA sube.',mediumRun:'Si persiste, puede contaminar expectativas y salarios.',reality:'Shocks geopolíticos sobre energía.'},
  productivityUp:{label:'Mejora de productividad',delta:{A:0.07,gamma:-0.0005},watch:'productividad, costos unitarios y crecimiento',changedText:'Aumenta A y OA se vuelve menos empinada.',mediumRun:'Eleva Yₙ y reduce tensión inflacionaria.',reality:'Mejora crecimiento sin castigar inflación.'},
  productivityDown:{label:'Caída de productividad',delta:{A:-0.07,gamma:0.0006},watch:'productividad, inversión y crecimiento potencial',changedText:'Disminuye A y OA se vuelve más restrictiva.',mediumRun:'Reduce Yₙ y hace más costoso sostener actividad.',reality:'Trabas, daño de capital o deterioro productivo.'},
  socialUnrest:{label:'Estallido social / incertidumbre',delta:{daA:-40,costShock:0.25,z:0.12},watch:'EMBI, CLP/USD, inversión, empleo e inflación',changedText:'Cae DA y suben costos.',mediumRun:'Puede dejar menor inversión y menor Yₙ.',reality:'Combina demanda, incertidumbre y costos.'},
  earthquake:{label:'Terremoto',delta:{daA:-25,A:-0.05,costShock:0.35},watch:'capacidad productiva, reconstrucción y precios',changedText:'Cae capacidad y suben costos.',mediumRun:'Primero oferta; después demanda de reconstrucción.',reality:'Sirve para pensar 2010.'},
  pandemic:{label:'Pandemia / shock mixto',delta:{daA:-35,A:-0.04,costShock:0.18},watch:'movilidad, desempleo, inflación y política',changedText:'Caída de demanda con restricción de oferta.',mediumRun:'La secuencia temporal importa: primero oferta, luego reapertura activa demanda.',reality:'Ejemplo clásico de shock mixto.'}
};

const GUIDED_CASES = {
  iran: {
    kicker:'Caso guiado · geopolítica y costos', title:'Irán / energía / inflación',
    episode:'Un conflicto en Medio Oriente tensiona petróleo, seguros, fletes y expectativas.',
    why:'Permite entrar a la macro desde una pregunta vigente: cómo un episodio geopolítico lejano termina alterando precios, tasa, actividad y márgenes.',
    manifestations:'Alzas en petróleo y combustibles, mayor presión sobre importados, dudas sobre inflación futura.',
    questions:'¿Por qué el alza de energía no pega igual sobre producción y precios? ¿Cuándo domina el canal de costos y cuándo el de actividad?',
    mechanism:'Shock de costos externos → suben petróleo, fletes → aumentan costos importados → OA se desplaza → cambian P, Y y brecha.',
    modelWhy:'OA-DA ayuda más porque deja ver simultáneamente producción, precios y brecha respecto de Yₙ.',
    observe:'Al llegar verás OA-DA. Mira si OA se desplazó; ubica el nuevo equilibrio; compara la brecha.',
    targetTab:'oada', targetShock:'oilUp', highlight:'#oada .chart-card',
    arrival:{ title:'OA-DA · shock de costos energéticos', what:'Simulador OA-DA: cómo un shock mueve precios y producción simultáneamente.', shock:'Shock geopolítico que sube costos energéticos.', graph:'OA se desplaza hacia arriba. Sube P, cae Y.', next:'Revisa brecha respecto de Yₙ y nota de mediano plazo.' }
  },
  copper: {
    kicker:'Caso guiado · apertura y sector externo', title:'Cobre / CLP-USD / sector externo',
    episode:'El precio del cobre cae y el shock entra por exportaciones, ingresos externos, recaudación y tipo de cambio.',
    why:'Obliga a pensar a Chile como economía abierta: el ajuste pasa por E, NX, portafolios y vulnerabilidad.',
    manifestations:'Peso se deprecia, cambian expectativas sobre ingresos fiscales, discusión sobre cuenta corriente.',
    questions:'¿Cómo se transmite una caída del cobre al peso? ¿Qué parte absorbe el tipo de cambio?',
    mechanism:'Deterioro de términos de intercambio → cae x₀ → presión sobre E y NX → cambian IS y equilibrio.',
    modelWhy:'IS-LM-BP hace visible que parte del ajuste ocurre en E y NX, no solo en Y.',
    observe:'Al llegar verás IS-LM-BP. Mira IS inicial y final, compara E y NX.',
    targetTab:'islmbp', targetShock:'copperDown', highlight:'#islmbp .chart-card',
    arrival:{ title:'IS-LM-BP · términos de intercambio', what:'Simulador IS-LM-BP: demanda, dinero, sector externo y tipo de cambio.', shock:'Caída del cobre: afecta exportaciones, recaudación y CLP/USD.', graph:'Ubica IS final y mira si equilibrio cambia poco en Y pero mucho en E y NX.', next:'Revisa "Qué mirar en Chile" y prueba otros shocks externos.' }
  },
  fiscal: {
    kicker:'Caso guiado · política fiscal y demanda', title:'Ajuste fiscal / actividad / tasas',
    episode:'El gobierno reduce impulso fiscal o acelera consolidación.',
    why:'Muestra qué sí y qué no entrega IS-LM: multiplicador, crowding-out, acelerador y límites.',
    manifestations:'Debate sobre menor gasto, credibilidad fiscal, desaceleración y posible alivio de tasas.',
    questions:'¿Qué cae primero cuando disminuye G? ¿La tasa se mueve suficiente como para aliviar inversión?',
    mechanism:'Menor G → IS se desplaza → cambian Y e i → inversión reacciona por tasa y actividad.',
    modelWhy:'IS-LM deja ver con nitidez el juego entre mercado de bienes y mercado de dinero.',
    observe:'Al llegar verás IS-LM. Mira el desplazamiento de la IS, cambio en Y, i e inversión.',
    targetTab:'islm', targetShock:'fiscalContract', highlight:'#islm .chart-card',
    arrival:{ title:'IS-LM · ajuste fiscal', what:'Simulador IS-LM: equilibrio conjunto bienes y dinero.', shock:'Contracción fiscal: ¿domina la caída de demanda o baja la tasa lo suficiente?', graph:'IS se desplaza. Cambian Y e i simultáneamente.', next:'Revisa crowding-out vs acelerador y "Qué mirar en Chile".' }
  },
  dashboard: {
    kicker:'Entrada directa al tablero', title:'Tablero Macro',
    episode:'Antes de elegir modelo, conviene ubicar el presente dentro del ciclo chileno.',
    why:'Evita leer cada dato aislado. Muestra quiebres, rezagos y coexistencia de shocks.',
    manifestations:'Varias series parecen contar historias distintas al mismo tiempo.',
    questions:'¿Qué series reaccionan primero? ¿Qué cambios vienen de demanda, costos o sector externo?',
    mechanism:'Observación guiada → identificación de quiebres → selección del modelo.',
    modelWhy:'El tablero ayuda cuando todavía no sabes qué modelo elegir.',
    observe:'Al llegar verás el tablero macro. Empieza por la lectura general.',
    targetTab:'tablero', targetShock:'', highlight:'#tablero .dashboard-shell-v2',
    arrival:{ title:'Tablero Macro · secuencia y quiebres', what:'Tablero histórico: prepara los modelos, no los reemplaza.', shock:'Secuencia de episodios: desaceleración, estallido, pandemia, rebote, energía.', graph:'Franja 1: actividad/precios/empleo. Franja 2: TPM/CLP. Franja 3: cobre/WTI.', next:'Elige un caso guiado o baja al modelo que capture el canal dominante.' }
  }
};

const WATCH_GUIDES = {
  islm: {
    none:'Pregunta clave: ¿qué combinación de actividad, tasa e inversión describe mejor la base? ¿La TPM subió o bajó? ¿Hay crowding-out? ¿La inversión reaccionó más a la tasa o a la actividad?',
    fiscalExpand:'¿El impulso fiscal levanta actividad más rápido de lo que suben las tasas? ¿Hay crowding-out? ¿El impulso fiscal es transitorio o persistente?',
    fiscalContract:'¿La menor presión fiscal enfría demanda más rápido de lo que aliviana tasas? ¿La inversión reaccionó más a la tasa o a la actividad?',
    monetaryExpand:'¿La relajación monetaria empuja crédito e inversión? ¿La TPM subió o bajó?',
    monetaryContract:'¿El enfriamiento entra primero por tasa, crédito o inversión?',
    betterExpectations:'¿La mejora de expectativas se traduce en inversión efectiva?',
    worseExpectations:'¿La caída de confianza ya frena gasto e inversión?'
  },
  islmbp: {
    none:'¿La base se mueve más por tasa interna, entorno externo o tipo de cambio? Mira CLP/USD, cobre, TPM vs tasa externa, exportaciones netas y spreads.',
    fiscalExpand:'¿El impulso fiscal se filtra hacia apreciación y deterioro externo?',
    fiscalContract:'¿La consolidación fiscal reduce demanda más rápido de lo que mejora percepción externa?',
    monetaryExpand:'¿La política monetaria opera sobre E y NX además de Y?',
    monetaryContract:'¿La contracción aprecia el peso o frena depreciación previa?',
    higherWorldRate:'¿El shock global entra primero por spreads, por el peso o por financiamiento?',
    lowerWorldRate:'¿La relajación internacional abre espacio local sin tensionar el peso?',
    copperDown:'¿La caída del cobre ya pasa al CLP/USD y a percepción sobre ingresos externos?',
    copperUp:'¿La mejora del cobre se traduce en apreciación, inversión minera o espacio fiscal?',
    globalRecession:'¿El golpe externo entra por exportaciones, confianza o ambas?',
    oilUp:'¿El shock energético entra primero por tipo de cambio, importados o ambos?',
    pesoDepreciation:'¿La depreciación ayuda a NX más rápido de lo que daña inflación?',
    pesoAppreciation:'¿La apreciación alivia inflación más rápido de lo que erosiona competitividad?'
  },
  oada: {
    none:'¿La economía parece cerca, arriba o abajo de Yₙ? ¿El IPC sube por demanda o por costos? ¿Hay holgura o presión de capacidad?',
    fiscalExpand:'¿El impulso levanta más Y o más P? ¿Hay holgura o presión de capacidad?',
    fiscalContract:'¿La consolidación cierra brecha inflacionaria o abre holgura excesiva?',
    monetaryExpand:'¿La mayor demanda reabre actividad sin desanclar precios?',
    monetaryContract:'¿La desinflación viene con caída acotada de actividad? ¿La TPM frena inflación sin hundir demasiado actividad?',
    oilUp:'¿Domina el canal de costos o ya hay segunda vuelta? ¿Qué pasa con salarios, energía y tipo de cambio? ¿La trayectoria sugiere convergencia o persistencia?',
    productivityUp:'¿La mejora eleva Yₙ o solo empuja actividad transitoria?',
    productivityDown:'¿La caída de productividad achica Yₙ o solo frena demanda?',
    socialUnrest:'¿Predomina caída de demanda o daño sobre oferta?',
    earthquake:'¿Domina primero la pérdida de capacidad o la demanda de reconstrucción?',
    pandemic:'¿El episodio opera como caída de demanda, restricción de oferta o ambas?'
  }
};

const ATLAS_SHOCKS = [
  {name:'Terremoto 2010',period:'Feb 2010',origin:'Terremoto 8.8 en Chile central',vars:'Capacidad productiva, infraestructura, empleo',mechanisms:'Destrucción de capital → caída de oferta → luego demanda de reconstrucción',models:['OA-DA','IS-LM'],effects:'Contracción inicial seguida de rebote por reconstrucción. PIB cayó en Q1 pero el año cerró con crecimiento alto.',watch:'Capacidad instalada, empleo, inversión pública, precios de materiales',tabs:['oada','islm','tablero']},
  {name:'Fin del súper ciclo del cobre',period:'2013–2016',origin:'Desaceleración china y sobreoferta global',vars:'Precio del cobre, CLP/USD, ingresos fiscales',mechanisms:'Caída de términos de intercambio → depreciación → menor recaudación → ajuste fiscal',models:['IS-LM-BP'],effects:'Desaceleración prolongada, depreciación del peso, ajuste del gasto público.',watch:'Cobre, CLP/USD, balanza comercial, inversión minera',tabs:['islmbp','tablero']},
  {name:'Estallido social 2019',period:'Oct 2019',origin:'Crisis socio-política doméstica',vars:'Inversión, confianza, prima de riesgo, tipo de cambio',mechanisms:'Shock de incertidumbre → caída de inversión y confianza → presión cambiaria → costos',models:['IS-LM-BP','OA-DA'],effects:'Caída de inversión, depreciación, aumento de spreads, daño a capacidad productiva.',watch:'EMBI, CLP/USD, inversión, empleo, confianza empresarial',tabs:['islmbp','oada','tablero']},
  {name:'Pandemia 2020',period:'Mar–Dic 2020',origin:'COVID-19 global',vars:'Movilidad, empleo, demanda de servicios, producción',mechanisms:'Restricción de oferta + caída de demanda → shock mixto → política fiscal y monetaria extraordinaria',models:['OA-DA','IS-LM'],effects:'PIB –6.1%, desempleo 10.3%, política fiscal masiva, TPM a mínimos históricos.',watch:'IMACEC, desempleo, movilidad, IPC, TPM, transferencias',tabs:['oada','islm','tablero']},
  {name:'Reapertura y rebote 2021–2022',period:'2021–2022',origin:'Vacunación, retiros de fondos, estímulo fiscal',vars:'Demanda agregada, liquidez, inflación, empleo',mechanisms:'Exceso de demanda + cuellos de oferta → sobrecalentamiento → inflación alta',models:['OA-DA','IS-LM'],effects:'PIB +11.3% en 2021, inflación llegó a 12.8% en 2022.',watch:'PIB, IPC, IPC SAE, consumo, crédito, empleo',tabs:['oada','islm','tablero']},
  {name:'Guerra Rusia-Ucrania',period:'Feb 2022–',origin:'Invasión rusa a Ucrania',vars:'Petróleo, gas, granos, fletes, seguros',mechanisms:'Shock de costos energéticos y alimentarios → OA sube → presión inflacionaria global',models:['OA-DA','IS-LM-BP'],effects:'Alza de combustibles e IPC en Chile, presión adicional sobre CLP/USD.',watch:'WTI, combustibles, IPC transable, CLP/USD, fletes',tabs:['oada','islmbp','tablero']},
  {name:'Inflación global / energía',period:'2021–2023',origin:'Confluencia de demanda excesiva, costos y disrupciones logísticas',vars:'IPC, expectativas inflacionarias, salarios',mechanisms:'Demanda + costos + expectativas → espiral de precios → bancos centrales endurecen',models:['OA-DA'],effects:'Inflación más alta en décadas. BCCh subió TPM a 11.25%.',watch:'IPC, IPC SAE, expectativas, TPM, salarios',tabs:['oada','tablero']},
  {name:'Endurecimiento monetario internacional',period:'2022–2024',origin:'Fed, BCE y otros bancos centrales suben tasas',vars:'Tasa internacional, flujos de capital, CLP/USD, spreads',mechanisms:'Sube i* → presión sobre tipo de cambio → encarece financiamiento externo',models:['IS-LM-BP'],effects:'Depreciación del peso, mayor costo de financiamiento, salida de capitales.',watch:'Fed funds, CLP/USD, spreads, tasas largas locales',tabs:['islmbp','tablero']},
  {name:'Medio Oriente / energía 2025–2026',period:'2025–2026',origin:'Tensiones geopolíticas en Medio Oriente',vars:'Petróleo, combustibles, costos de transporte, seguros',mechanisms:'Riesgo de interrupción energética → suben costos importados → presión sobre OA e inflación',models:['OA-DA','IS-LM-BP'],effects:'Presión renovada sobre combustibles e IPC, discusión sobre TPM.',watch:'WTI, combustibles, IPC, CLP/USD, expectativas, TPM',tabs:['oada','islmbp','tablero']},
  {name:'Tensiones arancelarias / fragmentación comercial',period:'2024–2026',origin:'Rivalidad EEUU-China, aranceles, nearshoring',vars:'Comercio internacional, cadenas de suministro, costos',mechanisms:'Fragmentación → encarece importaciones → altera ventajas comparativas → presión de costos',models:['IS-LM-BP','OA-DA'],effects:'Incertidumbre sobre cadenas de suministro, reconfiguración comercial.',watch:'Exportaciones, importaciones, costos de insumos, CLP/USD, inversión',tabs:['islmbp','oada','tablero']}
];

const TAB_TITLES = {
  inicio:'Inicio',
  instrucciones:'Instrucciones',
  islm:'IS-LM',
  islmbp:'IS-LM-BP',
  oada:'OA-DA',
  shocks:'Shocks y transmisión',
  atlas:'Atlas de shocks',
  institucional:'Marco institucional',
  tablero:'Tablero macro',
  lectura:'Lectura de datos',
  glosario:'Glosario'
};

const MODEL_META = {
  islm: {
    label:'IS-LM',
    title:'IS-LM · economía cerrada',
    defaults:ISLM_DEFAULTS,
    shocks:ISLM_SHOCKS,
    starter:'Prueba primero un shock fiscal o monetario y compara actividad, tasa e inversión antes de apilar complejidad.',
    trajectoryVars:[
      {key:'Y',label:'Actividad (Y)',color:'#2563eb'},
      {key:'i',label:'Tasa (i)',color:'#16a34a'},
      {key:'investment',label:'Inversión',color:'#f59e0b'}
    ]
  },
  islmbp: {
    label:'IS-LM-BP',
    title:'IS-LM-BP · economía abierta con flotación',
    defaults:ISLMBP_DEFAULTS,
    shocks:ISLMBP_SHOCKS,
    starter:'Prueba primero cobre, tipo de cambio o tasa internacional y compara E, NX y actividad antes de sacar conclusiones.',
    trajectoryVars:[
      {key:'Y',label:'Actividad (Y)',color:'#2563eb'},
      {key:'eIndex',label:'Tipo de cambio (E)',color:'#ef4444'},
      {key:'NX',label:'Exportaciones netas',color:'#7c3aed'}
    ]
  },
  oada: {
    label:'OA-DA',
    title:'OA-DA · producción, precios y expectativas',
    defaults:OADA_DEFAULTS,
    shocks:OADA_SHOCKS,
    starter:'Prueba primero un shock de costos o de demanda y mira si el ajuste cae en precios, en producto o en ambos.',
    trajectoryVars:[
      {key:'Y',label:'Producción (Y)',color:'#2563eb'},
      {key:'P',label:'Precios (P)',color:'#ef4444'},
      {key:'Yn',label:'Producto potencial (Yₙ)',color:'#16a34a'}
    ]
  }
};

const TRAJECTORY_LABELS = ['t0','t1','t2','t3','t4','t5','t6'];
const TRAJECTORY_PROFILES = {
  flat:[0,0,0,0,0,0,0],
  immediate:[0,0.58,0.82,0.93,0.98,1,1],
  frontloaded:[0,0.45,0.72,0.88,0.95,0.99,1],
  medium:[0,0.32,0.58,0.78,0.91,0.97,1],
  delayed:[0,0.18,0.38,0.62,0.82,0.94,1],
  persistent:[0,0.28,0.52,0.74,0.88,0.96,1]
};

const QUIZ_BANK = {
  islm: {
    question:'Si el gobierno reduce gasto y la LM no se mueve, ¿cuál es la lectura más consistente dentro de IS-LM?',
    choices:[
      'Y cae e i tiende a bajar, porque la menor demanda reduce actividad y también presión sobre el mercado de dinero.',
      'Y cae e i sube necesariamente, porque toda contracción fiscal encarece el crédito.',
      'Y sube e i cae, porque la menor presión fiscal libera inversión privada de inmediato.'
    ],
    correctIndex:0,
    correctExplanation:'Correcta. En IS-LM, una contracción fiscal desplaza la IS a la izquierda: cae Y y, si la LM no cambia, la menor demanda de dinero tiende a empujar i a la baja.',
    distractorExplanation:'El distractor “Y cae e i sube” suena plausible si uno piensa sólo en recesión y spreads, pero dentro de este modelo la tasa no sube por una caída de G si la LM permanece fija.',
    incorrectExplanations:[
      '',
      'No es la mejor respuesta. Ese razonamiento mezcla el modelo con un shock financiero distinto: aquí el ajuste viene por IS, no por una LM más contractiva.',
      'No es la mejor respuesta. La inversión puede aliviarse por tasas menores, pero el efecto dominante de corto plazo sigue siendo la caída de la demanda agregada.'
    ]
  },
  islmbp: {
    question:'Con tipo de cambio flotante y alta movilidad de capitales, una expansión monetaria en IS-LM-BP tiende primero a...',
    choices:[
      'depreciar el tipo de cambio, mejorar NX y luego empujar la actividad.',
      'fijar el tipo de cambio y volver irrelevante el canal externo.',
      'mover sólo la tasa internacional, sin alterar el CLP/USD.'
    ],
    correctIndex:0,
    correctExplanation:'Correcta. Bajo flotación, la expansión monetaria opera con fuerza vía depreciación: E sube, mejoran NX y luego aparece el impulso sobre Y.',
    distractorExplanation:'El distractor del tipo de cambio fijo es plausible porque muchos manuales comparan ambos regímenes, pero Chile opera con flotación y allí el ajuste externo sí importa.',
    incorrectExplanations:[
      '',
      'No es la mejor respuesta. Esa descripción correspondería a un régimen de tipo de cambio fijo o a otra elección de la trinidad imposible, no al caso chileno.',
      'No es la mejor respuesta. La tasa internacional i* es un dato externo; el shock doméstico relevante aquí pasa por E, capitales y NX.'
    ]
  },
  oada: {
    question:'Si tras un alza del petróleo observas P↑ y Y↓ en OA-DA, ¿cuál es el diagnóstico más consistente?',
    choices:[
      'Shock de oferta/costos: la OA sube y aparece una lectura estanflacionaria.',
      'Shock de demanda pura: la DA sube y por eso precios y actividad se mueven en direcciones opuestas.',
      'Cambio sólo nominal: no se altera ninguna curva real y por eso el producto cae.'
    ],
    correctIndex:0,
    correctExplanation:'Correcta. El patrón P↑ con Y↓ es la huella clásica de un shock de oferta adverso: la OA se desplaza y la economía enfrenta más inflación con menos actividad.',
    distractorExplanation:'El distractor de demanda es plausible porque también puede haber inflación alta, pero un shock de demanda pura suele empujar P y Y en la misma dirección.',
    incorrectExplanations:[
      '',
      'No es la mejor respuesta. Si la DA fuera la única que se desplaza, lo usual es ver Y y P subir juntos, no esa combinación estanflacionaria.',
      'No es la mejor respuesta. Aquí sí cambia una relación real: suben costos, se desplaza la OA y por eso caen actividad y producto.'
    ]
  }
};

const scenarioState = {};

/* ========== UTILITY FUNCTIONS ========== */
function safeDiv(a,b){return a/(Math.abs(b)<EPS?(b<0?-EPS:EPS):b)}
function round(v,d=2){return Number.isFinite(v)?Number(v).toFixed(d):'—'}
function roundNum(v,d=2){return Number.isFinite(v)?Number(v.toFixed(d)):0}
function clampPositive(v){return Math.max(0,v)}
function signWord(d,p,n,neutral='se mantiene aproximadamente estable'){return Math.abs(d)<0.03?neutral:d>0?p:n}
function applyDelta(base,delta={}){const o={...base};Object.entries(delta).forEach(([k,v])=>o[k]=(o[k]??0)+v);return o}
function readParams(prefix,defaults){const o={};Object.keys(defaults).forEach(k=>{const el=document.getElementById(`${prefix}-${k}`);o[k]=el?Number(el.value):defaults[k]});return o}
function fillInputs(prefix,defaults){Object.keys(defaults).forEach(k=>{const el=document.getElementById(`${prefix}-${k}`);if(el)el.value=defaults[k]})}
function populateSelect(id,optionsMap){const s=document.getElementById(id);s.innerHTML='';Object.entries(optionsMap).forEach(([key,obj])=>{const o=document.createElement('option');o.value=key;o.textContent=typeof obj==='string'?obj:obj.label;s.appendChild(o)})}
function bindInputs(prefix,defaults,cb){Object.keys(defaults).forEach(k=>{const el=document.getElementById(`${prefix}-${k}`);if(el)el.addEventListener('input',cb)})}
function setText(id,v){const el=document.getElementById(id);if(el)el.textContent=v}
function setHTML(id,v){const el=document.getElementById(id);if(el)el.innerHTML=v}
function activateTab(target){
  document.querySelectorAll('.tab-button').forEach(b=>{
    const active=b.dataset.tab===target;
    b.classList.toggle('active',active);
    if(b.dataset.tab)b.setAttribute('aria-current',active?'page':'false');
  });
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id===target));
  document.title=`MacroLab Shock Simulator · ${TAB_TITLES[target]||'Inicio'} · v1.7`;
}
function initTabs(){document.querySelectorAll('.tab-button[data-tab]').forEach(btn=>btn.addEventListener('click',()=>activateTab(btn.dataset.tab)));document.querySelectorAll('.back-to-inicio').forEach(a=>a.addEventListener('click',()=>{activateTab('inicio');window.scrollTo({top:0,behavior:'smooth'})}));document.querySelectorAll('.route-btn[data-tab]').forEach(btn=>{if(!btn.classList.contains('quickstart-button'))btn.addEventListener('click',()=>{activateTab(btn.dataset.tab);window.scrollTo({top:0,behavior:'smooth'})})})}
function buildLine(fn,xMin,xMax,n=50){const pts=[];const step=(xMax-xMin)/n;for(let i=0;i<=n;i++){const x=xMin+i*step;pts.push({x,y:fn(x)})}return pts}
function centeredRange(values,minSpan=100,floor=0){const vals=values.filter(v=>Number.isFinite(v));const min=Math.min(...vals);const max=Math.max(...vals);const span=Math.max(max-min,minSpan);const center=(min+max)/2;return{min:Math.max(floor,center-span*0.7),max:center+span*0.7}}
function drawChart(key,canvasId,config){if(charts[key])charts[key].destroy();const ctx=document.getElementById(canvasId).getContext('2d');charts[key]=new Chart(ctx,config)}
function pointDataset(label,x,y,style){return{label,data:[{x,y}],showLine:false,pointRadius:style.radius,pointHoverRadius:style.radius+1,pointBackgroundColor:style.bg,pointBorderColor:style.border,pointBorderWidth:style.borderWidth,pointStyle:style.pointStyle||'circle'}}
function highlightElement(sel){const el=document.querySelector(sel);if(!el)return;el.classList.remove('highlight-card');void el.offsetWidth;el.classList.add('highlight-card');setTimeout(()=>el.classList.remove('highlight-card'),2200)}
function watchCopy(model,shockKey,fallback){return WATCH_GUIDES[model]?.[shockKey]||`Pregunta clave: ${fallback}`}
function chartOptions(xL,yL,xr,yr){return{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:10}},tooltip:{mode:'nearest'}},scales:{x:{type:'linear',min:clampPositive(xr.min),max:xr.max,title:{display:true,text:xL},grid:{color:'#edf2f7'},ticks:{maxTicksLimit:7}},y:{min:clampPositive(yr.min),max:yr.max,title:{display:true,text:yL},grid:{color:'#edf2f7'},ticks:{maxTicksLimit:7}}}}}

function summarizeParameterChanges(params,defaults){
  const changes=Object.entries(defaults).filter(([k,base])=>Math.abs((params[k]??base)-base)>0.0001).map(([k])=>`${k}=${round(params[k],Math.abs(params[k])>=10?1:2)}`);
  if(!changes.length)return'Parámetros base 2026. Si editas inputs, esta ficha mostrará tus ajustes.';
  return`Ajustes manuales: ${changes.slice(0,4).join(', ')}${changes.length>4?` +${changes.length-4} más.`:'.'}`;
}

function buildResultLine(modelKey,initial,final_){
  if(modelKey==='islm')return`Y ${round(initial.Y)} → ${round(final_.Y)}, i ${round(initial.i)} → ${round(final_.i)}, inversión ${round(initial.investment)} → ${round(final_.investment)}.`;
  if(modelKey==='islmbp')return`Y ${round(initial.Y)} → ${round(final_.Y)}, E ${round(initial.eIndex)} → ${round(final_.eIndex)}, NX ${round(initial.NX)} → ${round(final_.NX)}.`;
  return`Y ${round(initial.Y)} → ${round(final_.Y)}, P ${round(initial.P)} → ${round(final_.P)}, Yₙ ${round(initial.Yn)} → ${round(final_.Yn)}.`;
}

function updateScenarioCard(modelKey,context){
  const meta=MODEL_META[modelKey];
  const shock=meta.shocks[context.shockKey];
  const baseScenario=context.shockKey==='none';
  const headline=baseScenario?'Base pedagógica 2026 activa':`Escenario activo: ${shock.label}`;
  const status=baseScenario
    ?'Todavía no hay shock aplicado. Usa este equilibrio base como referencia y luego compara el antes/después con un caso concreto.'
    :'Comparas un equilibrio base con un shock pedagógico. Revisa primero el gráfico, luego la trayectoria y finalmente el dato chileno relevante.';
  const summary=baseScenario
    ?`${meta.title}. ${modelKey==='islm'?`Régimen actual: ${ISLM_REGIMES[context.regime]}. `:''}${shock.reality}`
    :`${shock.changedText} ${shock.reality} ${buildResultLine(modelKey,context.initial,context.final)}`;
  setText(`${modelKey}-scenario-headline`,headline);
  setText(`${modelKey}-scenario-status`,status);
  setText(`${modelKey}-scenario-summary`,summary);
  setText(`${modelKey}-scenario-next`,baseScenario?meta.starter:watchCopy(modelKey,context.shockKey,shock.watch));
  setText(`${modelKey}-scenario-params`,summarizeParameterChanges(context.params,meta.defaults));
}

function indexTarget(initialValue,finalValue){
  if(!Number.isFinite(initialValue)||Math.abs(initialValue)<EPS)return 100;
  return roundNum((finalValue/initialValue)*100,2);
}

function buildTrajectorySeries(initialValue,finalValue,profileKey){
  const target=indexTarget(initialValue,finalValue);
  const profile=TRAJECTORY_PROFILES[profileKey]||TRAJECTORY_PROFILES.medium;
  if(Math.abs(target-100)<0.05)return TRAJECTORY_LABELS.map(()=>100);
  return profile.map(frac=>roundNum(100+((target-100)*frac),2));
}

function getTrajectoryProfiles(modelKey,shockKey){
  if(shockKey==='none'){
    return modelKey==='islm'
      ?{Y:'flat',i:'flat',investment:'flat'}
      :modelKey==='islmbp'
        ?{Y:'flat',eIndex:'flat',NX:'flat'}
        :{Y:'flat',P:'flat',Yn:'flat'};
  }
  if(modelKey==='islm'){
    if(['monetaryExpand','monetaryContract'].includes(shockKey))return{Y:'delayed',i:'immediate',investment:'medium'};
    if(['fiscalExpand','fiscalContract'].includes(shockKey))return{Y:'frontloaded',i:'medium',investment:'delayed'};
    return{Y:'medium',i:'delayed',investment:'frontloaded'};
  }
  if(modelKey==='islmbp'){
    if(['copperDown','copperUp','higherWorldRate','lowerWorldRate','pesoDepreciation','pesoAppreciation','oilUp'].includes(shockKey))return{Y:'delayed',eIndex:'immediate',NX:'medium'};
    if(['monetaryExpand','monetaryContract'].includes(shockKey))return{Y:'medium',eIndex:'immediate',NX:'medium'};
    return{Y:'frontloaded',eIndex:'medium',NX:'delayed'};
  }
  if(['oilUp','socialUnrest','earthquake','pandemic'].includes(shockKey))return{Y:'delayed',P:'immediate',Yn:'persistent'};
  if(['productivityUp','productivityDown'].includes(shockKey))return{Y:'medium',P:'delayed',Yn:'frontloaded'};
  return{Y:'frontloaded',P:'medium',Yn:'flat'};
}

function describeTrajectory(modelKey,shockKey,initial,final_){
  if(shockKey==='none'){
    return{
      story:'Sin shock, la trayectoria coincide con la base 2026. Úsala como línea de referencia antes de interpretar un caso.',
      lag:'La línea plana te ayuda a distinguir mecanismo, rezago y magnitud cuando actives un shock.',
      end:'El escenario base queda listo para comparación disciplinada.'
    };
  }
  if(modelKey==='islm'){
    if(['monetaryExpand','monetaryContract'].includes(shockKey)){
      return{
        story:'La tasa reacciona primero y la actividad ajusta después vía crédito e inversión.',
        lag:'El canal financiero entra más rápido que el multiplicador sobre Y.',
        end:`Al período 6, Y ${signWord(final_.Y-initial.Y,'queda por encima','queda por debajo')} de la base e i ${signWord(final_.i-initial.i,'termina más alta','termina más baja','termina cerca de la base')}.`
      };
    }
    return{
      story:'La demanda mueve primero la actividad; luego la tasa y la inversión acomodan parte del ajuste.',
      lag:'El crowding-out o el alivio de tasas aparecen con algo más de rezago que el cambio inicial en Y.',
      end:`Al período 6, la inversión ${signWord(final_.investment-initial.investment,'termina más alta','termina más baja','termina cerca de la base')}.`
    };
  }
  if(modelKey==='islmbp'){
    return{
      story:'En economía abierta el tipo de cambio suele absorber primero el shock y luego reordenar actividad y exportaciones netas.',
      lag:'E reacciona rápido; Y y NX suelen mostrar un ajuste más gradual que el del mercado cambiario.',
      end:`Al período 6, E ${signWord(final_.eIndex-initial.eIndex,'permanece más alto','permanece más bajo','queda cerca de la base')} y NX ${signWord(final_.NX-initial.NX,'termina mejor','termina peor','queda cerca de la base')}.`
    };
  }
  if(['oilUp','socialUnrest','earthquake','pandemic'].includes(shockKey)){
    return{
      story:'Los costos pegan primero en precios; la producción siente el ajuste con más rezago y la capacidad puede tardar en recomponerse.',
      lag:'P reacciona rápido; Y y Yₙ absorben el costo del ajuste en un segundo momento.',
      end:`Al período 6, P ${signWord(final_.P-initial.P,'permanece más alto','permanece más bajo','queda cerca de la base')} y Y ${signWord(final_.Y-initial.Y,'queda por encima','queda por debajo')} del punto inicial.`
    };
  }
  return{
    story:'La demanda o la productividad alteran el equilibrio y la trayectoria muestra cuánto del ajuste cae en producción versus precios.',
    lag:'Y suele reaccionar antes; P y Yₙ terminan de revelar si el cambio era transitorio o más estructural.',
    end:`Al período 6, Yₙ ${signWord(final_.Yn-initial.Yn,'termina por encima','termina por debajo','queda cerca de la base')} del valor inicial.`
  };
}

function renderTrajectory(modelKey,initial,final_,shockKey){
  const meta=MODEL_META[modelKey];
  const profileMap=getTrajectoryProfiles(modelKey,shockKey);
  const datasets=[{
    label:'Base = 100',
    data:TRAJECTORY_LABELS.map(()=>100),
    borderColor:'#94a3b8',
    borderDash:[6,6],
    borderWidth:2,
    pointRadius:0,
    tension:0
  }];
  meta.trajectoryVars.forEach(v=>{
    datasets.push({
      label:v.label,
      data:buildTrajectorySeries(initial[v.key],final_[v.key],profileMap[v.key]),
      borderColor:v.color,
      backgroundColor:'transparent',
      borderWidth:3,
      pointRadius:2.8,
      pointHoverRadius:4,
      tension:0.24
    });
  });
  const values=datasets.flatMap(d=>d.data);
  const min=Math.min(...values);
  const max=Math.max(...values);
  drawChart(`${modelKey}Trajectory`,`${modelKey}-trajectory-chart`,{
    type:'line',
    data:{labels:TRAJECTORY_LABELS,datasets},
    options:{
      responsive:true,
      maintainAspectRatio:false,
      animation:false,
      interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:10}},
        tooltip:{backgroundColor:'#10263f',displayColors:true}
      },
      scales:{
        x:{grid:{display:false},title:{display:true,text:'Períodos pedagógicos'}},
        y:{min:roundNum(min-4,1),max:roundNum(max+4,1),title:{display:true,text:'Índice base = 100'},grid:{color:'#edf2f7'}}
      }
    }
  });
  const narrative=describeTrajectory(modelKey,shockKey,initial,final_);
  setText(`${modelKey}-trajectory-story`,narrative.story);
  setText(`${modelKey}-trajectory-lag`,narrative.lag);
  setText(`${modelKey}-trajectory-end`,narrative.end);
}

function renderQuiz(modelKey){
  const quiz=QUIZ_BANK[modelKey];
  if(!quiz)return;
  const questionEl=document.getElementById(`${modelKey}-quiz-question`);
  const optionsEl=document.getElementById(`${modelKey}-quiz-options`);
  const feedbackEl=document.getElementById(`${modelKey}-quiz-feedback`);
  if(!questionEl||!optionsEl||!feedbackEl)return;
  questionEl.textContent=quiz.question;
  feedbackEl.textContent='Elige una respuesta para recibir feedback inmediato.';
  feedbackEl.className='quiz-feedback neutral';
  optionsEl.innerHTML='';
  quiz.choices.forEach((choice,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='quiz-option';
    button.textContent=choice;
    button.addEventListener('click',()=>{
      optionsEl.querySelectorAll('.quiz-option').forEach((btn,btnIndex)=>{
        btn.classList.toggle('is-correct',btnIndex===quiz.correctIndex);
        btn.classList.toggle('is-incorrect',btnIndex===index&&btnIndex!==quiz.correctIndex);
      });
      if(index===quiz.correctIndex){
        feedbackEl.textContent=`${quiz.correctExplanation} ${quiz.distractorExplanation}`;
        feedbackEl.className='quiz-feedback success';
      }else{
        feedbackEl.textContent=`${quiz.incorrectExplanations[index]} ${quiz.correctExplanation}`;
        feedbackEl.className='quiz-feedback caution';
      }
    });
    optionsEl.appendChild(button);
  });
}

function buildScenarioSummary(modelKey){
  const state=scenarioState[modelKey];
  if(!state)return'';
  const meta=MODEL_META[modelKey];
  const shock=meta.shocks[state.shockKey];
  const lines=[
    'MacroLab Shock Simulator',
    meta.title,
    `Shock: ${shock.label}`
  ];
  if(state.regime)lines.push(`Régimen: ${ISLM_REGIMES[state.regime]||state.regime}`);
  lines.push(`Resultados: ${buildResultLine(modelKey,state.initial,state.final)}`);
  lines.push(`Parámetros: ${summarizeParameterChanges(state.params,meta.defaults)}`);
  lines.push('Nota: trayectoria pedagógica plausible, no pronóstico.');
  return lines.join('\n');
}

function encodeScenarioState(modelKey){
  const state=scenarioState[modelKey];
  if(!state)return'';
  return btoa(JSON.stringify({
    modelKey:state.modelKey,
    shockKey:state.shockKey,
    regime:state.regime||'',
    params:state.params
  }));
}

function buildScenarioUrl(modelKey){
  const encoded=encodeScenarioState(modelKey);
  const url=new URL(window.location.href);
  url.searchParams.set('tab',modelKey);
  if(encoded)url.searchParams.set('scenario',encoded);
  return url.toString();
}

function fallbackCopyText(text){
  const textArea=document.createElement('textarea');
  textArea.value=text;
  textArea.setAttribute('readonly','');
  textArea.style.position='absolute';
  textArea.style.left='-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

async function copyText(text){
  if(navigator.clipboard&&window.isSecureContext){
    await navigator.clipboard.writeText(text);
    return;
  }
  fallbackCopyText(text);
}

function setShareFeedback(modelKey,message){setText(`${modelKey}-share-feedback`,message)}

function initShareButtons(){
  document.querySelectorAll('.share-btn').forEach(btn=>{
    btn.addEventListener('click',async()=>{
      const modelKey=btn.dataset.shareModel;
      const kind=btn.dataset.shareKind;
      const content=kind==='link'?buildScenarioUrl(modelKey):buildScenarioSummary(modelKey);
      try{
        await copyText(content);
        setShareFeedback(modelKey,kind==='link'?'Enlace copiado: conserva tab, shock y parámetros actuales.':'Ficha copiada: resume shock, parámetros y resultados actuales.');
      }catch(error){
        setShareFeedback(modelKey,'No pude copiar automáticamente. Vuelve a intentarlo o usa el enlace visible del navegador.');
      }
    });
  });
}

function restoreScenarioFromUrl(){
  const url=new URL(window.location.href);
  const encoded=url.searchParams.get('scenario');
  const tab=url.searchParams.get('tab');
  let restored=false;
  if(encoded){
    try{
      const state=JSON.parse(atob(encoded));
      if(state?.modelKey&&MODEL_META[state.modelKey]){
        Object.entries(state.params||{}).forEach(([key,value])=>{
          const input=document.getElementById(`${state.modelKey}-${key}`);
          if(input)input.value=value;
        });
        if(state.modelKey==='islm'&&state.regime)document.getElementById('islm-regime').value=state.regime;
        const shockSelect=document.getElementById(`${state.modelKey}-shock`);
        if(shockSelect&&state.shockKey)shockSelect.value=state.shockKey;
        if(state.modelKey==='islm')renderISLM();
        if(state.modelKey==='islmbp')renderISLMBP();
        if(state.modelKey==='oada')renderOADA();
        activateTab(tab||state.modelKey);
        restored=true;
      }
    }catch(error){
      restored=false;
    }
  }
  if(!restored&&tab&&TAB_TITLES[tab])activateTab(tab);
}

/* ========== IS-LM ========== */
function calcISLM(p,regime){const A=1-p.c1-p.b1;const K=p.c0-p.c1*p.T+p.b0+p.G;let Y,i;if(regime==='horizontal'){i=p.iFixed;Y=safeDiv(K-p.b2*i,A)}else{Y=safeDiv(p.d2*K+p.b2*p.MP,p.d2*A+p.b2*p.d1);i=safeDiv(p.d1*Y-p.MP,p.d2)}const investment=p.b0+p.b1*Y-p.b2*i;return{A,K,Y,i,investment}}
function isCurve(p){const A=1-p.c1-p.b1;const K=p.c0-p.c1*p.T+p.b0+p.G;return Y=>safeDiv(K-A*Y,p.b2)}
function lmCurve(p,regime){if(regime==='horizontal')return()=>p.iFixed;return Y=>safeDiv(p.d1*Y-p.MP,p.d2)}
function renderISLM(){
  const regime=document.getElementById('islm-regime').value;
  const shockKey=document.getElementById('islm-shock').value;
  const shock=ISLM_SHOCKS[shockKey];
  const base=readParams('islm',ISLM_DEFAULTS);
  const fin=applyDelta(base,shock.delta);
  const initial=calcISLM(base,regime);
  const final_=calcISLM(fin,regime);
  const xr=centeredRange([initial.Y,final_.Y],320,0);
  const yr=centeredRange([initial.i,final_.i,base.iFixed,fin.iFixed],4.5,0);
  drawChart('islm','islm-chart',{type:'scatter',data:{datasets:[
    {type:'line',label:'IS inicial',data:buildLine(isCurve(base),xr.min,xr.max),borderColor:'#2d6ea3',borderWidth:2.4,pointRadius:0},
    {type:'line',label:'IS final',data:buildLine(isCurve(fin),xr.min,xr.max),borderColor:'#7cb4df',borderWidth:2.4,borderDash:[6,6],pointRadius:0},
    {type:'line',label:'LM inicial',data:buildLine(lmCurve(base,regime),xr.min,xr.max),borderColor:'#16a34a',borderWidth:2.4,pointRadius:0},
    {type:'line',label:'LM final',data:buildLine(lmCurve(fin,regime),xr.min,xr.max),borderColor:'#8ad1a3',borderWidth:2.4,borderDash:[6,6],pointRadius:0},
    pointDataset('Eq. inicial',initial.Y,initial.i,{radius:5,bg:'#0f2740',border:'#0f2740',borderWidth:1}),
    pointDataset('Eq. final',final_.Y,final_.i,{radius:8,bg:'rgba(245,158,11,0.18)',border:'#f59e0b',borderWidth:3})
  ]},options:chartOptions('Producción (Y)','Tasa de interés (i)',xr,yr)});
  setText('islm-y0',round(initial.Y));setText('islm-y1',round(final_.Y));
  setText('islm-i0',round(initial.i));setText('islm-i1',round(final_.i));
  setText('islm-inv0',round(initial.investment));setText('islm-inv1',round(final_.investment));
  setText('islm-equilibrium',`Equilibrio inicial: (Y=${round(initial.Y)}, i=${round(initial.i)}). Final: (Y=${round(final_.Y)}, i=${round(final_.i)}).`);
  const dY=final_.Y-initial.Y;const di=final_.i-initial.i;const dI=final_.investment-initial.investment;
  setText('islm-explanation',`Shock: ${shock.label}. ${shock.changedText} La producción ${signWord(dY,'sube','baja')} y la tasa ${signWord(di,'sube','baja')}. La inversión ${signWord(dI,'aumenta','cae')}. ${shock.reality}`);
  const crowding=Math.max(0,fin.b2*Math.max(0,di));const accelerator=Math.max(0,fin.b1*Math.max(0,dY));
  let dom='';if(regime==='horizontal'){dom='Con LM horizontal no aparece crowding-out vía tasa; el acelerador domina si la actividad sube.'}else if(di<=0&&dY>0){dom='No aparece crowding-out relevante; domina el aumento de actividad.'}else if(dI>0){dom=accelerator>=crowding?'El acelerador prima.':'Hay crowding-out parcial.'}else if(dI<0){dom=crowding>accelerator?'Prima el crowding-out.':'La inversión cae por menor actividad y/o tasas más altas.'}else{dom='Balance casi neutro.'}
  setText('islm-crowd',`Acelerador: b1·ΔY = ${round(accelerator)}. Crowding-out: b2·Δi = ${round(crowding)}. ${dom}`);
  setHTML('islm-watch',`<strong>Dato a mirar en Chile.</strong> ${watchCopy('islm',shockKey,shock.watch)}`);
  scenarioState.islm={modelKey:'islm',shockKey,regime,params:{...base},initial,final:final_};
  updateScenarioCard('islm',scenarioState.islm);
  renderTrajectory('islm',initial,final_,shockKey);
}

/* ========== IS-LM-BP ========== */
function calcISLMBP(p,fxShock=0){const Y=safeDiv(p.MP+p.d2*p.iStar,p.d1);const A=1-p.c1-p.b1+p.x1;const K=p.c0-p.c1*p.T+p.b0+p.G+p.x0;const eRaw=safeDiv(A*Y-K+p.b2*p.iStar,p.x2)+fxShock;const eIndex=100+eRaw;const NX=p.x0-p.x1*Y+p.x2*eRaw;return{A,K,Y,i:p.iStar,eRaw,eIndex,NX}}
function isCurveBP(p,eRaw){const A=1-p.c1-p.b1+p.x1;const K=p.c0-p.c1*p.T+p.b0+p.G+p.x0+p.x2*eRaw;return Y=>safeDiv(K-A*Y,p.b2)}
function lmCurveBP(p){return Y=>safeDiv(p.d1*Y-p.MP,p.d2)}
function bpCurve(p){return()=>p.iStar}
function renderISLMBP(){
  const shockKey=document.getElementById('islmbp-shock').value;
  const shock=ISLMBP_SHOCKS[shockKey];
  const base=readParams('islmbp',ISLMBP_DEFAULTS);
  const fin=applyDelta(base,shock.delta);
  const initial=calcISLMBP(base,0);
  const final_=calcISLMBP(fin,shock.fxShock);
  const xr=centeredRange([initial.Y,final_.Y],90,0);
  const yr=centeredRange([initial.i,final_.i],0.8,0);
  const overlap=Math.abs(initial.Y-final_.Y)<0.01&&Math.abs(initial.i-final_.i)<0.01;
  drawChart('islmbp','islmbp-chart',{type:'scatter',data:{datasets:[
    {type:'line',label:'IS inicial',data:buildLine(isCurveBP(base,initial.eRaw),xr.min,xr.max),borderColor:'#2d6ea3',borderWidth:2.4,pointRadius:0},
    {type:'line',label:'IS final',data:buildLine(isCurveBP(fin,final_.eRaw),xr.min,xr.max),borderColor:'#7cb4df',borderWidth:2.4,borderDash:[6,6],pointRadius:0},
    {type:'line',label:'LM inicial',data:buildLine(lmCurveBP(base),xr.min,xr.max),borderColor:'#16a34a',borderWidth:2.4,pointRadius:0},
    {type:'line',label:'LM final',data:buildLine(lmCurveBP(fin),xr.min,xr.max),borderColor:'#8ad1a3',borderWidth:2.4,borderDash:[6,6],pointRadius:0},
    {type:'line',label:'BP inicial',data:buildLine(bpCurve(base),xr.min,xr.max),borderColor:'#7c3aed',borderWidth:2.4,pointRadius:0},
    {type:'line',label:'BP final',data:buildLine(bpCurve(fin),xr.min,xr.max),borderColor:'#b89af6',borderWidth:2.4,borderDash:[6,6],pointRadius:0},
    pointDataset('Eq. inicial',initial.Y,initial.i,{radius:5,bg:'#0f2740',border:'#0f2740',borderWidth:1}),
    pointDataset('Eq. final',final_.Y,final_.i,{radius:overlap?11:9,bg:'rgba(255,255,255,0.01)',border:'#f59e0b',borderWidth:3.5})
  ]},options:chartOptions('Producción (Y)','Tasa de interés (i)',xr,yr)});
  setText('islmbp-y0',round(initial.Y));setText('islmbp-y1',round(final_.Y));
  setText('islmbp-i0',round(initial.i));setText('islmbp-i1',round(final_.i));
  setText('islmbp-e0',round(initial.eIndex));setText('islmbp-e1',round(final_.eIndex));
  setText('islmbp-nx0',round(initial.NX));setText('islmbp-nx1',round(final_.NX));
  setText('islmbp-eq0',`(Y=${round(initial.Y)}, i=${round(initial.i)})`);setText('islmbp-eq1',`(Y=${round(final_.Y)}, i=${round(final_.i)})`);
  const dY=final_.Y-initial.Y;const dE=final_.eIndex-initial.eIndex;const dNX=final_.NX-initial.NX;
  let extra='';if(overlap)extra=' El ajuste principal se ve en E y NX más que en Y.';
  setText('islmbp-explanation',`Shock: ${shock.label}. ${shock.changedText} La producción ${signWord(dY,'sube','baja')}, E ${signWord(dE,'sube','baja')} y NX ${signWord(dNX,'mejoran','empeoran')}. ${shock.reality}${extra}`);
  setHTML('islmbp-watch',`<strong>Dato a mirar en Chile.</strong> ${watchCopy('islmbp',shockKey,shock.watch)}`);
  scenarioState.islmbp={modelKey:'islmbp',shockKey,params:{...base},initial,final:final_};
  updateScenarioCard('islmbp',scenarioState.islmbp);
  renderTrajectory('islmbp',initial,final_,shockKey);
}

/* ========== OA-DA ========== */
function calcOADA(p){const Yn=p.A*p.L;const oaBase=p.Pe*(1+p.mu)+p.z+p.costShock;const Y=safeDiv(p.daA-p.daB*oaBase+p.daB*p.gamma*Yn,1+p.daB*p.gamma);const P=safeDiv(p.daA-Y,p.daB);const gap=Y-Yn;return{Yn,oaBase,Y,P,gap}}
function daCurve(p){return Y=>safeDiv(p.daA-Y,p.daB)}
function oaCurve(p){const Yn=p.A*p.L;const oaBase=p.Pe*(1+p.mu)+p.z+p.costShock;return Y=>oaBase+p.gamma*(Y-Yn)}
function setGapBar(fillId,labelId,gap,maxAbsGap){const fill=document.getElementById(fillId);const label=document.getElementById(labelId);const share=Math.max(6,Math.min(100,Math.abs(gap)/maxAbsGap*100));fill.style.width=`${share}%`;fill.className='gap-fill '+(gap>0?'positive':gap<0?'negative':'neutral');label.textContent=gap>0?`Sobre Yₙ (${round(gap)})`:gap<0?`Bajo Yₙ (${round(gap)})`:'En Yₙ'}

function describeOADAPattern(dY,dP,initial,final_,moved){
  const oaMoved=moved.includes('OA / Yₙ');const daMoved=moved.includes('DA');
  let title='Patrón mixto o de transición',body='El shock mueve precios y producción de manera que conviene leer con cautela.',graph='Busca qué curva cambió más.',meaning='Cuando se mueven varias piezas, el valor del modelo está en separar canales.',next='Mira brecha respecto de Yₙ, luego "Qué mirar en Chile".';
  if(dY>0.05&&dP>0.05&&daMoved&&!oaMoved){title='Presión de demanda';body='Suben Y y P porque DA empuja hacia arriba-derecha.';graph='DA final desplazada hacia afuera.';meaning='Expansión de demanda: sube producto pero también presión sobre precios.';}
  else if(dY<-0.05&&dP>0.05&&oaMoved){title='Shock de costos / oferta adversa';body='Menor Y y mayor P: señal estanflacionaria.';graph='OA final más alta o más a la izquierda.';meaning='Típico de energía, costos importados o deterioro de productividad.';}
  else if(dY>0.05&&dP<-0.05&&oaMoved){title='Mejora de oferta / productividad';body='Sube Y mientras caen precios. Más producción sin tensión.';graph='OA final más abajo o más a la derecha.';meaning='Alivio de costos, mejora tecnológica o normalización.';}
  else if(dY<-0.05&&dP<-0.05&&daMoved&&!oaMoved){title='Enfriamiento de demanda';body='Caen Y y P porque DA se debilita.';graph='DA final desplazada hacia adentro.';meaning='Consolidación fiscal, endurecimiento monetario o caída de confianza.';}
  if(Math.abs(final_.gap)>Math.abs(initial.gap)+0.05){next='La brecha se amplía. ¿El shock aleja de Yₙ? ¿Qué mecanismo podría cerrarla?';}
  else if(Math.abs(final_.gap)+0.05<Math.abs(initial.gap)){next='La brecha se reduce. ¿Es convergencia sana o enfriamiento costoso?';}
  return{title,body,graph,meaning,next};
}

function renderOADA(){
  const shockKey=document.getElementById('oada-shock').value;
  const shock=OADA_SHOCKS[shockKey];
  const base=readParams('oada',OADA_DEFAULTS);
  const fin=applyDelta(base,shock.delta);
  const initial=calcOADA(base);
  const final_=calcOADA(fin);
  const xr=centeredRange([initial.Y,final_.Y,initial.Yn,final_.Yn],70,0);
  const yr=centeredRange([initial.P,final_.P,base.Pe,fin.Pe],0.35,0);
  drawChart('oada','oada-chart',{type:'scatter',data:{datasets:[
    {type:'line',label:'DA inicial',data:buildLine(daCurve(base),xr.min,xr.max),borderColor:'#2d6ea3',borderWidth:2.5,pointRadius:0},
    {type:'line',label:'DA final',data:buildLine(daCurve(fin),xr.min,xr.max),borderColor:'#7cb4df',borderWidth:2.5,borderDash:[6,6],pointRadius:0},
    {type:'line',label:'OA inicial',data:buildLine(oaCurve(base),xr.min,xr.max),borderColor:'#ef4444',borderWidth:2.5,pointRadius:0},
    {type:'line',label:'OA final',data:buildLine(oaCurve(fin),xr.min,xr.max),borderColor:'#fca5a5',borderWidth:2.5,borderDash:[6,6],pointRadius:0},
    {type:'line',label:'Yₙ inicial',data:[{x:initial.Yn,y:yr.min},{x:initial.Yn,y:yr.max}],borderColor:'#16a34a',borderWidth:1.8,borderDash:[4,4],pointRadius:0},
    {type:'line',label:'Yₙ final',data:[{x:final_.Yn,y:yr.min},{x:final_.Yn,y:yr.max}],borderColor:'#86efac',borderWidth:1.8,borderDash:[4,4],pointRadius:0},
    pointDataset('Eq. inicial',initial.Y,initial.P,{radius:5,bg:'#0f2740',border:'#0f2740',borderWidth:1}),
    pointDataset('Eq. final',final_.Y,final_.P,{radius:9,bg:'rgba(255,255,255,0.01)',border:'#f59e0b',borderWidth:3.4})
  ]},options:chartOptions('Producción (Y)','Nivel de precios (P)',xr,yr)});
  setText('oada-y0',round(initial.Y));setText('oada-y1',round(final_.Y));
  setText('oada-p0',round(initial.P));setText('oada-p1',round(final_.P));
  setText('oada-gap0',round(initial.gap));setText('oada-gap1',round(final_.gap));
  setText('oada-equilibrium',`Equilibrio inicial: (Y=${round(initial.Y)}, P=${round(initial.P)}). Final: (Y=${round(final_.Y)}, P=${round(final_.P)}).`);
  const dY=final_.Y-initial.Y;const dP=final_.P-initial.P;
  const moved=[];
  if(Object.keys(shock.delta).some(k=>['daA','daB'].includes(k)))moved.push('DA');
  if(Object.keys(shock.delta).some(k=>['Pe','mu','gamma','z','L','A','costShock'].includes(k)))moved.push('OA / Yₙ');
  setText('oada-explanation',`Shock: ${shock.label}. ${shock.changedText} ${moved.length?`Se afectan ${moved.join(' y ')}.`:''} La producción ${signWord(dY,'sube','baja')} y el nivel de precios ${signWord(dP,'sube','baja')}. ${shock.reality}`);
  const pattern=describeOADAPattern(dY,dP,initial,final_,moved);
  setText('oada-pattern-title',pattern.title);setText('oada-pattern-body',pattern.body);
  setText('oada-graphread',pattern.graph);setText('oada-meaning',pattern.meaning);setText('oada-nextstep',pattern.next);
  setText('oada-mediumrun',`${shock.mediumRun} Yₙ pasa de ${round(initial.Yn)} a ${round(final_.Yn)} y la brecha final queda en ${round(final_.gap)}.`);
  setHTML('oada-watch',`<strong>Dato a mirar en Chile.</strong> ${watchCopy('oada',shockKey,shock.watch)}`);
  setText('oada-deltaY',`${dY>=0?'+':''}${round(dY)} en Y`);setText('oada-deltaP',`${dP>=0?'+':''}${round(dP)} en P`);
  const maxAbsGap=Math.max(Math.abs(initial.gap),Math.abs(final_.gap),40);
  setGapBar('oada-gapbar0','oada-gap-label0',initial.gap,maxAbsGap);setGapBar('oada-gapbar1','oada-gap-label1',final_.gap,maxAbsGap);
  scenarioState.oada={modelKey:'oada',shockKey,params:{...base},initial,final:final_};
  updateScenarioCard('oada',scenarioState.oada);
  renderTrajectory('oada',initial,final_,shockKey);
}

/* ========== DASHBOARD ========== */
function formatSignedDelta(d,s='pp'){return `${d>0?'+':''}${round(d,2)} ${s}`}
function updateSnapshot(idBase,current,previous,suffix,deltaSuffix='pp'){setText(`snap-${idBase}-value`,`${round(current,idBase==='fx'?1:2)}${suffix}`);setText(`snap-${idBase}-delta`,`vs 2024: ${formatSignedDelta(current-previous,deltaSuffix)}`);setText(`badge-${idBase}`,`${round(current,idBase==='fx'?0:2)}${suffix.trim()}`)}
function miniLineChart(key,canvasId,labels,values,color,yTitle,rangeKey){
  if(charts[key])charts[key].destroy();
  const[start,end]=ranges[rangeKey];const sL=labels.slice(start,end+1);const sV=values.slice(start,end+1);
  const mn=Math.min(...sV);const mx=Math.max(...sV);const sp=Math.max(mx-mn,1);const pd=sp*0.18;
  const ctx=document.getElementById(canvasId).getContext('2d');
  charts[key]=new Chart(ctx,{type:'line',data:{labels:sL,datasets:[{data:sV,borderColor:color,backgroundColor:color+'12',pointRadius:c=>c.dataIndex===sV.length-1?3.6:0,pointHoverRadius:4.8,pointBackgroundColor:color,fill:true,tension:0.16,borderWidth:3.4}]},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#10263f',displayColors:false,callbacks:{label:c=>`${c.formattedValue} ${yTitle}`}}},interaction:{mode:'index',intersect:false},scales:{x:{ticks:{autoSkip:true,maxTicksLimit:rangeKey==='full'?8:6,color:'#5e7184',maxRotation:0},title:{display:true,text:'Año',color:'#5e7184',font:{weight:'700'}},grid:{display:false}},y:{min:mn-pd,max:mx+pd,title:{display:true,text:yTitle,color:'#5e7184',font:{weight:'700'}},ticks:{color:'#5e7184'},grid:{color:'#e7eef5'}}}}});
}
function renderDashboardL2(rangeKey='full'){
  miniLineChart('dash-imacec','dash-imacec',dashboardL2.years,dashboardL2.imacec,'#2563eb','% anual',rangeKey);
  miniLineChart('dash-ipcsae','dash-ipcsae',dashboardL2.years,dashboardL2.ipcSae,'#f59e0b','% anual',rangeKey);
  miniLineChart('dash-embi','dash-embi',dashboardL2.years,dashboardL2.embi,'#7c3aed','pb',rangeKey);
  miniLineChart('dash-ccpib','dash-ccpib',dashboardL2.years,dashboardL2.ccPib,'#ef4444','% PIB',rangeKey);
}
function renderDashboard(rangeKey='full'){
  miniLineChart('dash-gdp','dash-gdp',dashboardData.years,dashboardData.gdp,'#2563eb','% anual',rangeKey);
  miniLineChart('dash-inflation','dash-inflation',dashboardData.years,dashboardData.inflation,'#f59e0b','% anual',rangeKey);
  miniLineChart('dash-tpm','dash-tpm',dashboardData.years,dashboardData.tpm,'#7c3aed','% anual',rangeKey);
  miniLineChart('dash-unemployment','dash-unemployment',dashboardData.years,dashboardData.unemployment,'#16a34a','% anual',rangeKey);
  miniLineChart('dash-fx','dash-fx',dashboardData.years,dashboardData.fx,'#ef4444','CLP/USD',rangeKey);
  miniLineChart('dash-copper','dash-copper',dashboardData.years,dashboardData.copper,'#0ea5a0','cUSD/lb',rangeKey);
  miniLineChart('dash-wti','dash-wti',dashboardData.years,dashboardData.wti,'#c2410c','USD/barril',rangeKey);
  const last=15;const prev=14;
  updateSnapshot('gdp',dashboardData.gdp[last],dashboardData.gdp[prev],'%','pp');
  updateSnapshot('inflation',dashboardData.inflation[last],dashboardData.inflation[prev],'%','pp');
  updateSnapshot('unemployment',dashboardData.unemployment[last],dashboardData.unemployment[prev],'%','pp');
  updateSnapshot('tpm',dashboardData.tpm[last],dashboardData.tpm[prev],'%','pp');
  updateSnapshot('fx',dashboardData.fx[last],dashboardData.fx[prev],' CLP/USD','CLP');
  updateSnapshot('copper',dashboardData.copper[last],dashboardData.copper[prev],' cUSD/lb','cUSD/lb');
  updateSnapshot('wti',dashboardData.wti[last],dashboardData.wti[prev],' USD/barril','USD/barril');
  const summaries={full:'2010–2025: de reconstrucción y crecimiento alto, a desaceleración, estallido y pandemia, rebote extraordinario con inflación alta, endurecimiento monetario y normalización expuesta a cobre, energía y tasa internacional.',mid:'2019–2025: estallido → pandemia → rebote → inflación → TPM alta → desinflación, con cobre y petróleo mostrando que no todo se explica por demanda interna.',recent:'2021–2025: sobrecalentamiento, salto inflacionario, endurecimiento monetario y convergencia posterior.'};
  setText('dashboard-summary',summaries[rangeKey]);
  renderDashboardL2(rangeKey);
}

/* ========== WELCOME MODAL ========== */
let welcomeDismissed = false;
function initWelcomeModal(){
  const modal=document.getElementById('welcome-modal');
  const btn=document.getElementById('welcome-start');
  const check=document.getElementById('welcome-dismiss');
  const backdrop=document.getElementById('welcome-backdrop');
  if(!modal)return;
  btn.addEventListener('click',()=>{if(check.checked)welcomeDismissed=true;modal.classList.add('hidden')});
  backdrop.addEventListener('click',()=>{modal.classList.add('hidden')});
}

/* ========== ATLAS ========== */
function renderAtlas(){
  const grid=document.getElementById('atlas-grid');
  if(!grid)return;
  grid.innerHTML='';
  ATLAS_SHOCKS.forEach(s=>{
    const tabNames={islm:'IS-LM',islmbp:'IS-LM-BP',oada:'OA-DA',tablero:'Tablero',shocks:'Shocks'};
    const links=s.tabs.map(t=>`<span class="atlas-link" data-tab="${t}">${tabNames[t]||t}</span>`).join('');
    const card=document.createElement('article');
    card.className='atlas-card';
    card.innerHTML=`<h4>${s.name}</h4><p class="atlas-period">${s.period} · ${s.origin}</p><div class="atlas-field"><strong>Variables afectadas:</strong> ${s.vars}</div><div class="atlas-field"><strong>Mecanismos:</strong> ${s.mechanisms}</div><div class="atlas-field"><strong>Modelos útiles:</strong> ${s.models.join(', ')}</div><div class="atlas-field"><strong>Efectos en Chile:</strong> ${s.effects}</div><div class="atlas-field"><strong>Qué mirar:</strong> ${s.watch}</div><div class="atlas-links">${links}</div>`;
    grid.appendChild(card);
  });
  grid.querySelectorAll('.atlas-link').forEach(link=>{
    link.addEventListener('click',()=>{activateTab(link.dataset.tab);window.scrollTo({top:0,behavior:'smooth'})});
  });
}

/* ========== GUIDED CASES ========== */
function openGuidedCase(caseKey){
  const config=GUIDED_CASES[caseKey];if(!config)return;
  setText('case-modal-kicker',config.kicker);setText('case-modal-title',config.title);
  setText('case-modal-episode',config.episode);setText('case-modal-why',config.why);
  setText('case-modal-manifest',config.manifestations);setText('case-modal-questions',config.questions);
  setText('case-modal-mechanism',config.mechanism);setText('case-modal-modelwhy',config.modelWhy);
  setText('case-modal-observe',config.observe);
  const modal=document.getElementById('case-modal');
  modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  document.getElementById('case-modal-continue').onclick=()=>{
    closeGuidedCase();activateTab(config.targetTab);
    if(config.targetTab==='islm'&&config.targetShock){document.getElementById('islm-shock').value=config.targetShock;renderISLM()}
    if(config.targetTab==='islmbp'&&config.targetShock){document.getElementById('islmbp-shock').value=config.targetShock;renderISLMBP()}
    if(config.targetTab==='oada'&&config.targetShock){document.getElementById('oada-shock').value=config.targetShock;renderOADA()}
    if(config.targetTab==='tablero'){renderDashboard(document.querySelector('.range-button.active')?.dataset.range||'full')}
    showGuidedArrival(config.targetTab,config);
    window.scrollTo({top:0,behavior:'smooth'});
    setTimeout(()=>{highlightElement(`#${config.targetTab}-guided-arrival`);highlightElement(config.highlight)},220);
  };
}
function closeGuidedCase(){const m=document.getElementById('case-modal');m.classList.add('hidden');m.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function showGuidedArrival(tabId,config){
  const prefix=`${tabId}-guided-`;const box=document.getElementById(`${tabId}-guided-arrival`);
  if(!box||!config.arrival)return;
  setText(`${prefix}title`,config.arrival.title);setText(`${prefix}what`,config.arrival.what);
  setText(`${prefix}shock`,config.arrival.shock);setText(`${prefix}graph`,config.arrival.graph);
  setText(`${prefix}next`,config.arrival.next);box.classList.remove('hidden');
}
function initQuickstartButtons(){
  document.querySelectorAll('.quickstart-button').forEach(b=>b.addEventListener('click',()=>openGuidedCase(b.dataset.case)));
  document.getElementById('case-modal-close').addEventListener('click',closeGuidedCase);
  document.querySelectorAll('[data-close-case]').forEach(el=>el.addEventListener('click',closeGuidedCase));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeGuidedCase()});
}
function initGuidedArrivalClose(){document.querySelectorAll('[data-close-guided]').forEach(btn=>btn.addEventListener('click',()=>{document.getElementById(btn.dataset.closeGuided)?.classList.add('hidden')}))}
function initExportButtons(){
  document.querySelectorAll('.export-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const key=btn.dataset.chart;const chart=charts[key];
      if(!chart)return;
      const link=document.createElement('a');
      link.download=`macrolab-${key}-${new Date().toISOString().slice(0,10)}.png`;
      link.href=chart.toBase64Image('image/png',1);
      link.click();
    });
  });
}
function initDarkMode(){
  const btn=document.getElementById('dark-toggle');if(!btn)return;
  btn.addEventListener('click',()=>{
    document.body.classList.toggle('dark-mode');
    const isDark=document.body.classList.contains('dark-mode');
    btn.textContent=isDark?'Modo claro':'Modo proyección';
    const fontColor=isDark?'#8fa3b8':'#5e7184';
    const gridColor=isDark?'#243447':'#edf2f7';
    if(window.Chart){Chart.defaults.color=fontColor}
    Object.values(charts).forEach(c=>{
      if(c.options?.scales?.x){c.options.scales.x.grid.color=gridColor;c.options.scales.x.ticks.color=fontColor;if(c.options.scales.x.title)c.options.scales.x.title.color=fontColor}
      if(c.options?.scales?.y){c.options.scales.y.grid.color=gridColor;c.options.scales.y.ticks.color=fontColor;if(c.options.scales.y.title)c.options.scales.y.title.color=fontColor}
      c.update();
    });
  });
}
function initMechanismSimButtons(){
  document.querySelectorAll('.mechanism-sim-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const tab=btn.dataset.tab;const shock=btn.dataset.shock;
      activateTab(tab);
      if(tab==='islm'&&shock){document.getElementById('islm-shock').value=shock;renderISLM()}
      if(tab==='islmbp'&&shock){document.getElementById('islmbp-shock').value=shock;renderISLMBP()}
      if(tab==='oada'&&shock){document.getElementById('oada-shock').value=shock;renderOADA()}
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });
}
function attachReset(buttonId,prefix,defaults,cb){document.getElementById(buttonId).addEventListener('click',()=>{fillInputs(prefix,defaults);cb()})}

/* ========== INIT ========== */
function init(){
  if(window.Chart){Chart.defaults.font.family='Inter, system-ui, sans-serif';Chart.defaults.color='#5e7184';Chart.defaults.devicePixelRatio=Math.max(2,window.devicePixelRatio||1)}
  initTabs();initWelcomeModal();initDarkMode();initExportButtons();
  populateSelect('islm-regime',ISLM_REGIMES);
  populateSelect('islm-shock',ISLM_SHOCKS);
  populateSelect('islmbp-shock',ISLMBP_SHOCKS);
  populateSelect('oada-shock',OADA_SHOCKS);
  fillInputs('islm',ISLM_DEFAULTS);fillInputs('islmbp',ISLMBP_DEFAULTS);fillInputs('oada',OADA_DEFAULTS);
  bindInputs('islm',ISLM_DEFAULTS,renderISLM);bindInputs('islmbp',ISLMBP_DEFAULTS,renderISLMBP);bindInputs('oada',OADA_DEFAULTS,renderOADA);
  document.getElementById('islm-regime').addEventListener('change',renderISLM);
  document.getElementById('islm-shock').addEventListener('change',renderISLM);
  document.getElementById('islmbp-shock').addEventListener('change',renderISLMBP);
  document.getElementById('oada-shock').addEventListener('change',renderOADA);
  attachReset('islm-reset','islm',ISLM_DEFAULTS,renderISLM);
  attachReset('islmbp-reset','islmbp',ISLMBP_DEFAULTS,renderISLMBP);
  attachReset('oada-reset','oada',OADA_DEFAULTS,renderOADA);
  document.querySelectorAll('.range-button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.range-button').forEach(b=>b.classList.toggle('active',b===btn));renderDashboard(btn.dataset.range)}));
  initQuickstartButtons();initGuidedArrivalClose();initMechanismSimButtons();renderAtlas();
  renderQuiz('islm');renderQuiz('islmbp');renderQuiz('oada');
  renderISLM();renderISLMBP();renderOADA();renderDashboard('full');
  initShareButtons();
  activateTab('inicio');
  restoreScenarioFromUrl();
}
document.addEventListener('DOMContentLoaded',init);
