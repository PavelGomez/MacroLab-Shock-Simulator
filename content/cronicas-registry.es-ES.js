/* ========== CRÓNICAS REGISTRY ES-ES js ========== */
// Registro de crónicas canónicas con fuentes verificadas.
// Clave: identificador de episodio histórico.
// Migrado desde EJEMPLOS en assets/lentes.js (Sprint 2).
// Lote 1: preguntaGuia añadida a 4 legacy; 4 crónicas nuevas.
// Lote 2 (auditoría 2026-05-09): correcciones factuales menores y
//   actualización de fuentes a Q1 2018-2026 con DOIs / repositorios
//   oficiales. Detalle en
//   MacroLab_Macro2_Lentes_Institucionales_2026/03_auditoria/
//   y _CLAUDE_CODE/CHANGELOG.md
window.MacroLabCronicasRegistryES = Object.freeze({

  "chile_2021_2024": {
    titulo: "Chile, 2021–2024",
    sub: "Credibilidad en economía abierta",
    preguntaGuia: "¿Qué hace que un episodio de alta inflación no termine en un desanclaje permanente de expectativas?",
    cronica: [
      "Tras la pandemia, los retiros previsionales y la liquidez global empujaron la inflación chilena. La variación anual del IPC alcanzó su peak en agosto de 2022 al llegar a 14,1%, el nivel más alto desde septiembre de 1992, según el INE.",
      "El Banco Central llevó la TPM desde 0,5% en julio de 2021 hasta 11,25% en octubre de 2022, y la mantuvo en ese nivel durante casi un año. La comunicación insistió en que la convergencia a la meta de 3% era prioridad, incluso ante presiones por aliviar la carga financiera.",
      "La inflación cedió hacia el rango meta durante 2024, sin un desanclaje persistente de las expectativas a 24 meses. El costo del ajuste se distribuyó entre actividad y precios; los salarios reales tardaron en recuperarse y el desempleo se mantuvo por encima de 8% durante el proceso."
    ],
    caveat: "Ilustra una respuesta creíble de banco central en una economía abierta. No es prescripción para otros casos ni predicción para episodios futuros.",
    fuentes: [
      { texto: "BCCh (2022). IPoM diciembre 2022.", url: "https://www.bcentral.cl/contenido/-/detalle/ipom-diciembre-2022" },
      { texto: "INE Chile. IPC — series y notas técnicas.", url: "https://www.ine.gob.cl/estadisticas/economia/indices-de-precio-e-inflacion/indice-de-precios-al-consumidor" },
      { texto: "FMI (2024). Chile: 2023 Article IV Consultation. CR 24/29.", url: "https://www.imf.org/en/Publications/CR/Issues/2024/02/06/Chile-2023-Article-IV-Consultation-Press-Release-Staff-Report-545020" },
      { texto: "Albagli, Grigoli & Luttini (2024). Inflation Expectations and the Supply Chain.", url: "https://www.imf.org/-/media/files/conferences/2024/global-challenges-and-channels-for-fiscal-and-monetary-policy/inflation-expectations-and-the-supply-chain-albagli-grigoli-and-luttini.pdf" },
      { texto: "Coibion, Gorodnichenko, Kumar & Pedemonte (2020). Inflation expectations as a policy tool? Journal of International Economics 124.", url: "https://doi.org/10.1016/j.jinteco.2020.103297" }
    ],
    institutionalLayer: {
      institution: "BC de Chile con IT (meta 3%), independencia formal 1989; gobierno con acceso a mercados y regla fiscal; TC flotante; coordinación BC-gobierno bajo presión electoral adversa.",
      mechanism: "Shock inflacionario dual: demanda post-pandemia + retiros extraordinarios fondos de pensiones (específico Chile) → BC sube TPM de 0,5% (jul 2021) a 11,25% (oct 2022): +1.075 pb; Gobierno consolida de déficit 7,7% PIB a superávit 1,1% PIB en 2022: +8,8 pp. Coordinación BC + Gobierno señala compromiso con anclaje pese a presiones electorales. Expectativas a 24 meses no se desanclan; inflación retorna a meta 3% en 2024. En 2023 déficit sube a 2,4%, sugiriendo límites políticos.",
      affectedVariables: ["tasa de política monetaria (TPM)", "expectativas de inflación 24 meses", "balance fiscal", "salarios reales", "desempleo"],
      feedbackLoop: "BC sube tasa + gobierno consolida fiscal → doble señal de compromiso → expectativas a 24 meses se anclan → sin espiral inflacionaria. En 2023 déficit sube a 2,4%, sugiriendo límites políticos a la coordinación sostenida.",
      policyFeasibility: "BC autónomo con IT (meta 3%); gobierno con regla fiscal y acceso a mercados; coordinación explícita BC-gobierno requirió consenso político pese a incentivos electorales contrarios al ajuste.",
      incidence: "Asalariados variables y desempleados (ajuste vía cantidades); pensionistas que retiraron fondos (perdieron rendimiento); deudores hipotecarios en UF.",
      discriminatingEvidence: "IPC peak: 14,1% interanual (ago 2022, INE); TPM: 0,5% (jul 2021) → 11,25% (oct 2022), +1.075 pb; balance fiscal: -7,7% PIB (2021) → +1,1% PIB (2022), +8,8 pp (mejor desde 2012); -2,4% PIB en 2023; desempleo >8% durante ajuste; inflación retorna a rango meta en 2024; expectativas a 24 meses no se desanclan. Fuentes: INE, BCCh, DIPRES.",
      antiOverclaim: "MacroLab NO captura: (i) la economía política que permitió coordinación BC (sube 1.075 pb) + gobierno (consolida 8,8 pp PIB) pese a presiones electorales; (ii) por qué en 2023 se relajó el ajuste (déficit 2,4%), sugiriendo límites del consenso; (iii) que el anclaje resultó de coordinación política BC-gobierno, no solo de independencia técnica del BC. La ficha ilustra que el anclaje requiere COORDINACIÓN, no solo independencia formal."
    }
  },

  "turkey_2018_2023": {
    titulo: "Turquía, 2018–2023",
    sub: "Anclaje frágil con presión política sobre el banco central",
    preguntaGuia: "¿Cuándo la presión política sobre la autoridad monetaria deja de ser ruido y se vuelve constitutiva del régimen nominal?",
    cronica: [
      "Entre 2018 y 2023 Turquía atravesó múltiples episodios cambiarios. La inflación, que ya rondaba 15% al inicio del periodo, alcanzó su peak en octubre de 2022 al llegar a 85,51% interanual, según TÜİK.",
      "Frente a un cuadro que sugería contracción monetaria, la autoridad operó bajo presión política. En varios momentos del periodo el banco central recortó tasas mientras la inflación subía. La rotación de presidentes del banco central acentuó la percepción de baja autonomía.",
      "Las expectativas se desanclaron, el pass-through cambiario se aceleró, y las medidas heterodoxas no contuvieron la dinámica. Tras las elecciones de mayo de 2023 hubo un giro hacia tasas más altas, con resultados graduales: la inflación bajó a 38% en junio de 2023 y siguió cediendo en los años siguientes, aunque a niveles aún elevados."
    ],
    caveat: "Ilustra un mecanismo de desanclaje de expectativas y presión política sobre la autoridad monetaria, no un destino atribuible al país. Ningún rasgo nacional explica por sí solo la trayectoria; lo que se enseña es el mecanismo institucional.",
    fuentes: [
      { texto: "TÜİK (2022). CPI Turquía — boletín octubre 2022 (peak 85,51%).", url: "https://data.tuik.gov.tr/Bulten/Index?p=Tuketici-Fiyat-Endeksi-Ekim-2022-45798" },
      { texto: "BIS (2023). Navigating the disinflation journey. AER 2023.", url: "https://www.bis.org/publ/arpdf/ar2023e1.htm" },
      { texto: "Demiralp & Demiralp (2019). Erosion of central bank independence in Turkey. EER 9.", url: "https://doi.org/10.1007/s40822-018-0118-0" },
      { texto: "Garriga & Rodriguez (2020). CBI and inflation in developing countries. JIMF 104.", url: "https://doi.org/10.1016/j.jimonfin.2020.102166" },
      { texto: "Focus Economics, Turkey CPI.", url: "https://www.focus-economics.com/country-indicator/turkey/inflation/" }
    ],
    institutionalLayer: {
      institution: "Banco Central de Turquía (TCMB) con cuatro cambios de presidencia (2019–2023); independencia erosionada por presión ejecutiva que impuso recortes de tasa en contexto inflacionario.",
      mechanism: "Shock inflacionario (depreciación TRY desde 2018, pass-through cambiario) → TCMB recorta tasa de política monetaria bajo presión política con inflación superando 15% → señal contradictoria erosiona credibilidad del banco central → agentes actualizan expectativas de inflación al alza → pass-through cambiario se acelera → tipo de cambio nominal TRY sigue depreciándose → inflación alcanza 85,51% (oct 2022) → ciclo de desanclaje autorreferente.",
      affectedVariables: ["tasa de política monetaria", "expectativas de inflación", "tipo de cambio nominal (TRY/USD)", "pass-through cambiario", "credibilidad del banco central"],
      feedbackLoop: "Desanclaje de expectativas → depreciación anticipada de TRY → mayor inflación observada → nueva presión política por recorte de tasa → mayor desanclaje; ciclo se interrumpe solo cuando giro post-electoral 2023 permite tasas reales positivas.",
      policyFeasibility: "Ejecutivo con poder de remoción directa del gobernador del BC; cuatro ceses entre 2019–2023; restricción política impidió tasas reales positivas hasta giro post-electoral de junio 2023.",
      incidence: "Hogares de bajos ingresos y ahorristas en TRY golpeados por erosión de salarios reales; empresas con deuda dolarizada presionadas por depreciación.",
      discriminatingEvidence: "Inflación peak: 85,51% interanual (oct 2022, TÜİK); TRY pasa de 3,8 a 18 TRY/USD entre 2018–2022; TCMB reduce tasa de 19% a 8,5% (sep–nov 2021) con inflación en ascenso; tras cambio de gobernadora (jun 2023), tasa sube a 40%; inflación baja a ~38% en jun 2024. Fuentes: TÜİK, BIS 2023, Demiralp & Demiralp 2019.",
      antiOverclaim: "MacroLab NO captura: (i) la economía política de destituciones del gobernador e incentivos electorales pro-tasas-bajas; (ii) dolarización de balances que altera el pass-through; (iii) el rol de choques geopolíticos y sanciones externas en la depreciación de TRY. La ficha ilustra el desanclaje por erosión de independencia monetaria; no predice cuándo ni cómo se restablece credibilidad."
    }
  },

  "argentina_convertibility": {
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
      { texto: "IMF Independent Evaluation Office (2004). The IMF and Argentina, 1991–2001.", url: "https://www.imf.org/en/Publications/Independent-Evaluation-Office-Reports/Issues/2016/12/31/The-IMF-and-Argentina-1991-2001-17590" },
      { texto: "Calvo, Izquierdo & Mejía (2008). Systemic Sudden Stops. NBER WP 14026.", url: "https://www.nber.org/papers/w14026" },
      { texto: "De la Torre, Levy Yeyati & Schmukler (2003). Living and Dying with Hard Pegs: The Rise and Fall of Argentina’s Currency Board. World Bank Policy Research Working Paper 2980.", url: "https://openknowledge.worldbank.org/entities/publication/f2d65dac-fecc-5f39-b180-654ce710aaca" }
    ],
    institutionalLayer: {
      institution: "Ley de Convertibilidad (1991–2002): régimen de paridad fija 1 ARS/USD sin discretion en Banco Central; dependencia de capital externo; estructura de deuda pública dolarizada.",
      mechanism: "Shock externo (crisis rusa 1998, devaluación Brasil 1999) → caída de salida de capital → presión sobre reservas internacionales → bajo Convertibilidad, BC no puede expandir monetariamente sin dólares → base monetaria se contrae mecánicamente → demanda agregada cae → desempleo sube. Sin devaluación posible, ajuste real traumático y expectativas de ruptura aumentan.",
      affectedVariables: ["reservas internacionales", "base monetaria", "tipo de cambio nominal (fijo por ley)", "demanda agregada", "expectativas de devaluación"],
      feedbackLoop: "Expectativas de ruptura del régimen → corridas de depósitos → aún más caída de reservas → espiral contraccionista de base monetaria → depresión de actividad → mayor presión fiscal → inconsistencia se hace evidente → colapso final en diciembre 2001.",
      policyFeasibility: "Ley de Convertibilidad rigidiza política monetaria; BC sin discreción contracíclica; expansión fiscal provincial erosiona consistencia macro; dependencia crítica de capital externo.",
      incidence: "Exportables (agricultura, manufactura) golpeados primero; desempleo urbano formal; crisis de financiamiento de pymes.",
      discriminatingEvidence: "Reservas internacionales caen de US$ 26 mil millones (1992, pico) a US$ 10 mil millones (2001); desempleo abierto sube de 7% (1995) a 18% (2002); deuda externa representa 52% del PIB en 2001; default de deuda soberana declarado diciembre 2001 bajo Ley 25.561; devaluación de 200%+ en enero-febrero 2002 vs USD. Fuentes: BCRA, INDEC, Mussa (2002).",
      antiOverclaim: "MacroLab NO captura: (i) dinámicas de corridas y contagio financiero que rompen regímenes rígidamente creíbles (Calvo 1998); (ii) costos políticos de desempleo masivo que pueden presionar por salida del régimen (Alesina & Drazen 1991); (iii) interacción entre rigidez cambiaria e inconsistencia fiscal como juego temporal. La ficha ilustra por qué la rigidez sin coherencia fiscal acumula tensión; no predice el timing exacto de colapso."
    }
  },

  "chile_2008_2009": {
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
      { texto: "Végh & Vuletin (2012). Overcoming the Fear of Free Falling: Monetary Policy Graduation in Emerging Markets. NBER Working Paper 18175.", url: "https://www.nber.org/papers/w18175" }
    ],
    institutionalLayer: {
      institution: "BC de Chile con IT (meta 3%, ±1pp), independencia 1989; régimen flotante; gobierno con regla de balance estructural y FEES acumulado (US$20.211 millones ≈15% PIB).",
      mechanism: "Shock externo (crisis financiera global → caída de precios de cobre) → ingresos por divisas bajan → presión inicial en TC pero flotante lo absorbe → BC reduce TPM (775 pb entre ene-jun 2009) con credibilidad en IT → Gobierno usa buffer FEES para gasto anticíclico (2,8% PIB) sin quebrantar regla fiscal → credibilidad en BC y regla fiscal mantiene expectativas ancladas → demanda se amortigua sin desanclaje ni espiral.",
      affectedVariables: ["tasa de política monetaria (TPM)", "expectativas de inflación 12-24 meses", "tipo de cambio nominal", "gasto fiscal/demanda agregada", "actividad económica y empleo"],
      feedbackLoop: "Buffer anticíclico → demanda cae menos → empleo se sostiene → credibilidad en regla fiscal se refuerza (deuda no explota) → expectativas de inflación no se desanclan → BC mantiene tasa baja → recuperación 2009 sin inflación.",
      policyFeasibility: "BC autónomo con IT consolidada; regla fiscal creíble (balance estructural) permite reacción contracíclica; TC flexible absorbe volatilidad; FEES acumulado en bonanza reduce restricción de caja.",
      incidence: "Cuprífero y exportables (primer impacto); desempleados y trabajadores informales amortiguados por transferencias y subsidios del Plan Fiscal.",
      discriminatingEvidence: "TPM baja de 3,25% a 0,5% entre enero y junio 2009; inflación anual alcanza 1,4% en 2009 (bajo rango meta 2-4%); desempleo sube de 7% a 10,1% pero sin espiral; expectativas de inflación a 12-24m se mantienen en rango 2,5-3,5%, sin desanclaje. PIB cae 1,6% en 2009 pero rebota a 5,1% en 2010. FMI califica respuesta como 'vigorosa, coordinada'. Fuentes: INE, DIPRES, BCCh.",
      antiOverclaim: "MacroLab NO captura: (i) dinámicas de reputación y construcción de credibilidad que permitieron el uso del buffer (De Gregorio & Valev 2003); (ii) ciclos políticos y costos electorales de políticas contracíclicas (Alesina & Passalacqua 2016); (iii) dependencia de la acumulación previa del buffer en rentas de recursos naturales. La ficha ilustra cómo credibilidad + buffer + regla fiscal amortiguan transmisión; no es modelo general ni prescriptivo."
    },
    cronicaCompletaUrl: "https://github.com/PavelGomez/MacroLab-Shock-Simulator/blob/main/episodios/CHILE_2008_2009_LAYER0.md"
  },

  "noruega_2020": {
    titulo: "Noruega, 2020",
    sub: "Buffer soberano y banco central creíble frente a un shock dual: pandemia y caída del petróleo",
    preguntaGuia: "¿Qué permite que un Estado use gasto fiscal extraordinario sin desanclar expectativas?",
    cronica: [
      "En el primer trimestre de 2020 Noruega enfrentó un shock dual: la pandemia de covid-19 y, simultáneamente, una fuerte caída del precio del petróleo que debilitó la corona y deterioró las expectativas del sector de hidrocarburos. Norges Bank documentó explícitamente esta combinación: la actividad doméstica se contrajo no solo por restricciones sanitarias internas, sino por la transmisión externa de ambos canales. La autoridad monetaria redujo la tasa de política desde 1,5% a 0,25% en dos reuniones consecutivas en marzo y la llevó a 0% el 7 de mayo de 2020, primer cero histórico para la institución. La economía continental se contrajo cerca de 2,5% en 2020, una caída más leve que la mediana de la OCDE.",
      "El marco fiscal noruego permitió un uso extraordinario del fondo soberano por encima de la senda de referencia habitual. Las transferencias netas del Government Pension Fund Global al presupuesto durante 2020 alcanzaron cerca de 417 mil millones de coronas, equivalentes a aproximadamente 3,4% del valor del fondo, un máximo histórico. El desempleo registrado se elevó respecto del nivel pre-pandemia pero retornó a niveles cercanos hacia fines de 2021. Las expectativas de inflación a mediano plazo no se desanclaron en ningún momento del episodio, según los registros de Norges Bank.",
      "La interpretación más parsimoniosa es que Noruega enfrentó el shock dual desde una posición institucional excepcional —fondo soberano operativo, regla fiscal flexible pero creíble, banco central con meta de inflación consolidada— y esa combinación permitió absorber parte del golpe mediante gasto fiscal extraordinario y política monetaria expansiva sin convertir el episodio en una crisis de expectativas. La replicabilidad del caso es limitada: la acumulación previa del fondo dependió de una estructura de rentas petroleras y un consenso político que no se transfieren mecánicamente. La pregunta abierta no es solo si una economía tiene buffer, sino si tiene legitimidad política para usarlo."
    ],
    caveat: "Ilustra una configuración institucional e histórica específica frente a un shock dual; no caracteriza permanentemente al país. La acumulación previa del fondo dependió de una estructura de rentas petroleras y de un consenso político que no se transfieren mecánicamente. No demuestra inmunidad ante shocks futuros: el fondo se reduce con cada uso y su sostenibilidad depende del retorno real prospectivo.",
    fuentes: [
      { texto: "Bjørnland & Thorsrud (2016). Boom or Gloom? Economic Journal 126(598).", url: "https://doi.org/10.1111/ecoj.12302" },
      { texto: "van der Ploeg (2011). Natural Resources: Curse or Blessing? JEL 49(2).", url: "https://doi.org/10.1257/jel.49.2.366" },
      { texto: "van den Bremer & van der Ploeg (2013). Managing and Harnessing Volatile Oil Windfalls. IMF Economic Review 61(1).", url: "https://doi.org/10.1057/imfer.2013.4" },
      { texto: "Norges Bank (2020). Monetary Policy Report 1/2020.", url: "https://www.norges-bank.no/en/news-events/news-publications/Reports/Monetary-Policy-Report-with-financial-stability-assessment/2020/mpr-12020/" },
      { texto: "Norges Bank (2020). Monetary Policy Report 2/2020.", url: "https://www.norges-bank.no/en/news-events/news-publications/Reports/Monetary-Policy-Report-with-financial-stability-assessment/2020/mpr-22020/" },
      { texto: "FMI (2021). Norway: 2021 Article IV Consultation. CR 21/197.", url: "https://www.imf.org/en/Publications/CR/Issues/2021/09/13/Norway-2021-Article-IV-Consultation-Press-Release-Staff-Report-466009" },
      { texto: "OECD (2022). OECD Economic Surveys: Norway 2022. DOI 10.1787/df7b87ab-en.", url: "https://doi.org/10.1787/df7b87ab-en" },
      { texto: "Norwegian Ministry of Finance (2022). Sound economic governance — fiscal budget and Government Pension Fund key figures.", url: "https://www.regjeringen.no/en/aktuelt/sound-economic-governance/id2912392/" }
    ],
    institutionalLayer: {
      institution: "Norges Bank con IT (2%) e independencia consolidada; gobierno con regla fiscal del 3% del GPFG y cláusula cíclica; corona noruega flotante sin intervención sistemática.",
      mechanism: "Shock dual (pandemia + caída precio petróleo) → ingresos externos caen, tipo de cambio (NOK) se deprecia → Norges Bank reduce tasa de política monetaria a 0% (may 2020) con credibilidad en IT → gobierno activa GPFG (~417 bn NOK, 3,4% del fondo) bajo regla fiscal → gasto fiscal y demanda agregada sostenidas → credibilidad en regla + IT mantienen expectativas de inflación a mediano plazo ancladas → actividad económica continental cae moderadamente y recupera en 2021.",
      affectedVariables: ["tasa de política monetaria", "tipo de cambio (NOK)", "gasto fiscal y demanda agregada", "expectativas de inflación a mediano plazo", "actividad económica continental"],
      feedbackLoop: "Gasto anticíclico sostiene demanda → empleo cae moderadamente → expectativas de inflación ancladas → BC mantiene tasa en 0% sin riesgo inflacionario → crédito fluye → recuperación visible en 2021; uso del buffer reduce capacidad futura sin anularla.",
      policyFeasibility: "Regla fiscal del 3% del GPFG con cláusula de excepción cíclica; consenso político previo sobre acumulación y uso del fondo; BC independiente con IT desde 2001 sin presiones de financiamiento fiscal.",
      incidence: "Sector hidrocarburos y hostelería golpeados primero; trabajadores temporales afectados; transferencias amortiguan caída del ingreso disponible.",
      discriminatingEvidence: "TPM baja de 1,5% a 0% en dos recortes (mar–may 2020), primer cero histórico de Norges Bank; GPFG transfiere ~417 bn NOK (~3,4% del fondo); PIB continental cae ~2,5% en 2020, menos que la mediana OCDE; desempleo retorna a niveles pre-pandemia en 2021; expectativas de inflación a 2A no se desanclan. Fuentes: Norges Bank MPR 1/2020 y 2/2020, FMI 2021.",
      antiOverclaim: "MacroLab NO captura: (i) la acumulación del GPFG requirió cuatro décadas de rentas petroleras y consenso político no replicable; (ii) la economía política de la regla del 3% y su cláusula de excepción; (iii) efectos de riqueza del fondo sobre consumo y tipo de cambio de largo plazo. La ficha muestra cómo buffer + IT + regla flexible reducen transmisión del shock; no implica que economías sin fondo puedan replicar la trayectoria."
    }
  },

  "argentina_2020": {
    titulo: "Argentina, 2020",
    sub: "Pandemia sobre default soberano, brecha cambiaria y anclaje frágil",
    preguntaGuia: "¿Cuándo una respuesta fiscal-monetaria de emergencia se convierte en señal de dominancia fiscal?",
    cronica: [
      "La pandemia llegó a Argentina con una economía ya en recesión desde 2018, una negociación de reestructuración soberana en curso y el cepo cambiario reinstaurado en septiembre de 2019. El default técnico sobre los bonos en dólares se declaró el 22 de mayo de 2020. La reestructuración con tenedores privados se cerró en agosto, pero el estrés cambiario y monetario continuó. En este marco, la respuesta fiscal-monetaria de emergencia no opera como un estímulo neutral: se interpreta dentro de una historia previa de dominancia fiscal, baja demanda de dinero, controles cambiarios y expectativas de depreciación.",
      "La asistencia monetaria al Tesoro fue el principal canal de financiamiento del déficit pandémico: la base monetaria creció más de 60% en 2020. La economía cayó 9,9% en 2020 según CEPAL. La inflación, medida diciembre-contra-diciembre, fue 36,1% en 2020, 50,9% en 2021 y 94,8% en 2022; medida como promedio anual, las cifras son distintas (CEPAL reporta 42,0% para 2020). La brecha entre el tipo de cambio oficial y los tipos de cambio paralelos y financieros superó ampliamente el 100% en octubre de 2020; el contado con liquidación llegó a 130% el 22 de octubre. Las expectativas de inflación a 12 meses permanecieron persistentemente desancladas según el REM del BCRA.",
      "La interpretación parsimoniosa es que un marco institucional con banco central de autonomía formal pero limitada en la práctica, sin regla fiscal vinculante y con historia reciente de default, transformó el shock pandémico común en un episodio de aceleración inflacionaria persistente. El mecanismo no se reduce a 'emisión genera inflación': combina dominancia fiscal, baja demanda de dinero, brecha cambiaria, controles y restricción externa, alterando Pᵉ y la formación de precios posterior. La asignación de DEG por parte del FMI en agosto de 2021 alivió temporalmente la cuenta de reservas, pero no modificó la trayectoria nominal subyacente."
    ],
    caveat: "Ilustra una configuración institucional e histórica específica frente a un shock global común; no caracteriza permanentemente al país. La fragilidad institucional se construye y se desarma con decisiones acumuladas. Otros países latinoamericanos con shocks comparables y marcos institucionales más robustos —Chile, Perú, Uruguay— tuvieron trayectorias significativamente diferentes.",
    fuentes: [
      { texto: "Calvo & Reinhart (2002). Fear of Floating. QJE 117(2).", url: "https://doi.org/10.1162/003355302753650274" },
      { texto: "Mosquera & Sturzenegger (2021). Cepo para principiantes. Desarrollo Económico 61(234).", url: "https://revistas.ides.org.ar/desarrollo-economico/article/view/165" },
      { texto: "Sturzenegger (2020). ¿Necesitamos repensar la política de deuda en Latinoamérica? UNDP LAC C19 PDS No. 23.", url: "https://www.undp.org/sites/g/files/zskgke326/files/2023-01/CD19-PDS-Number23%20Deuda%20ES.pdf" },
      { texto: "FMI (2021). Argentina: Ex Post Evaluation 2018 SBA. CR 21/279.", url: "https://www.imf.org/en/Publications/CR/Issues/2021/12/22/Argentina-Ex-Post-Evaluation-of-Exceptional-Access-Under-the-2018-Stand-By-Arrangement-511289" },
      { texto: "CEPAL (2021). Estudio Económico de América Latina y el Caribe 2021.", url: "https://www.cepal.org/es/publicaciones/47192-estudio-economico-america-latina-caribe-2021" },
      { texto: "BCRA. Relevamiento de Expectativas de Mercado (REM) 2020-2022.", url: "https://www.bcra.gob.ar/PublicacionesEstadisticas/relevamiento_expectativas_de_mercado.asp" }
   ],
    institutionalLayer: {
      institution: "BCRA con autonomía formal erosionada; Tesoro dependiente de asistencia monetaria; cepo cambiario desde sep 2019; sin regla fiscal vinculante; default soberano declarado may 2020.",
      mechanism: "Shock pandémico sobre recesión preexistente y default soberano (may 2020). Déficit financiado con asistencia monetaria: base monetaria +60% en 2020. Dominancia fiscal → BC sin espacio para restricción → baja demanda de dinero + brecha cambiaria >100% (CCL 130%, oct 2020) → inflación: 36,1% (2020), 50,9% (2021), 94,8% (2022). Expectativas a 12 meses persistentemente desancladas (REM BCRA). Marco institucional débil transforma shock común en inflación persistente.",
      affectedVariables: ["base monetaria", "brecha cambiaria oficial/paralela", "expectativas de inflación", "inflación (aceleración persistente)", "reservas internacionales"],
      feedbackLoop: "Emisión para déficit → baja demanda de pesos → brecha cambiaria sube → agentes anticipan depreciación → precios suben → nueva presión fiscal → mayor emisión. Sin ancla nominal creíble, el ciclo no se interrumpe endógenamente.",
      policyFeasibility: "BC sin independencia efectiva bajo dominancia fiscal; cepo cambiario vigente; sin regla fiscal; acceso a mercados cerrado (default 2020); espacio de política nominal virtualmente inexistente.",
      incidence: "Asalariados de ingresos rígidos; ahorristas en pesos; importadores bajo cepo cambiario; hogares pobres (alto gasto en alimentos).",
      discriminatingEvidence: "Base monetaria +60% en 2020; inflación dic-dic: 36,1% (2020), 50,9% (2021), 94,8% (2022); brecha cambiaria: CCL llegó a 130% (oct 2020); PIB cae 9,9% en 2020 (CEPAL); expectativas a 12m persistentemente desancladas (REM BCRA); default declarado may 2020; reestructuración cerrada ago 2020. Fuentes: BCRA, INDEC, CEPAL 2021.",
      antiOverclaim: "MacroLab NO captura: (i) la historia acumulada de dominancia fiscal que condiciona demanda de dinero y expectativas (≠ shock exógeno aislado); (ii) la economía política del cepo y la reestructuración de deuda; (iii) el rol de la restricción externa en el pass-through. La ficha ilustra cómo dominancia fiscal transforma un shock común en inflación persistente; no modela la dinámica de largo plazo ni los múltiples regímenes cambiarios argentinos."
    }
  },

  "suecia_1994_1998": {
    titulo: "Suecia, 1994-1998",
    sub: "Consolidación fiscal con anclaje creíble tras crisis bancaria",
    preguntaGuia: "¿Cuándo una contracción fiscal puede ser interpretada como restauración de solvencia y no como profundización de crisis?",
    cronica: [
      "Tras la crisis financiera 1991-1993 —marcada por la quiebra controlada de Nordbanken, la creación de Securum como \"banco malo\" y la salida de la corona del MTC en noviembre de 1992—, Suecia enfrentaba un déficit fiscal cercano al 12% del PIB y una deuda pública en trayectoria de aproximarse al 80% del PIB. El gobierno socialdemócrata electo en 1994 inició un programa de consolidación que, con apoyo amplio entre coaliciones, redujo el déficit a posición de superávit hacia 1998. El Riksbank, ya operando bajo meta de inflación adoptada en enero de 1993 y aplicada formalmente desde 1995, en camino a la independencia formal de 1999, mantuvo expectativas ancladas durante todo el ajuste.",
      "El ajuste combinó reducciones de gasto y aumentos de ingresos, con un peso relevante de las medidas de gasto según varias reconstrucciones, aunque la proporción exacta depende del período y de la clasificación utilizada. La deuda pública/PIB cayó desde su máximo cercano al 78% en 1994 hasta alrededor del 65% en 1998. El crecimiento del PIB se mantuvo positivo durante el ajuste: 4,0% (1994), 3,9% (1995), 1,5% (1996), 2,7% (1997). La tasa de desempleo bajó desde su máximo de 9,9% en 1993 a niveles cercanos al 6% hacia fin de 1998 —aún elevada en términos históricos—. El spread soberano sueco se mantuvo bajo control y los rendimientos largos convergieron hacia los alemanes.",
      "La interpretación parsimoniosa combina credibilidad nominal acumulada, consenso político transversal y un sistema bancario ya saneado por intervención pública previa: esa combinación permitió ejecutar el ajuste fiscal sin recesión adicional ni desanclaje de expectativas. El caso no debe leerse como demostración de 'austeridad expansiva': el contexto incluyó una depreciación cambiaria previa que actuó como amortiguador externo y un ciclo global expansivo; el desempleo se mantuvo alto durante todo el período y la composición del ajuste sigue siendo objeto de debate académico. Otros países con consolidaciones contemporáneas en marcos menos creíbles tuvieron resultados sustancialmente peores."
    ],
    caveat: "Ilustra una configuración institucional e histórica específica; no caracteriza permanentemente al país. No demuestra que toda consolidación pueda ejecutarse sin recesión: el contexto sueco incluyó un sistema bancario ya saneado, un tipo de cambio que actuó como amortiguador externo en 1992-1993 y un ciclo global expansivo. La generalización requiere atender al estado del sistema financiero, al régimen cambiario y al ciclo externo.",
    fuentes: [
      { texto: "Englund (1999). The Swedish Banking Crisis. Oxford REP 15(3).", url: "https://doi.org/10.1093/oxrep/15.3.80" },
      { texto: "Calmfors & Wren-Lewis (2011). What should fiscal councils do? Economic Policy 26(68).", url: "https://doi.org/10.1111/j.1468-0327.2011.00273.x" },
      { texto: "Henriksson (2007). Ten Lessons about Budget Consolidation. Bruegel.", url: "https://www.bruegel.org/opinion-piece/10-lessons-about-budget-consolidation" },
      { texto: "Sveriges Riksbank. Inflation target history (1993, formal from 1995).", url: "https://www.riksbank.se/en-gb/monetary-policy/the-inflation-target/" },
      { texto: "FMI (1998). Sweden: Selected Issues. IMF Staff Country Report 98/124.", url: "https://www.imf.org/external/pubs/ft/scr/1998/cr98124.pdf" },
      { texto: "OECD (1999). OECD Economic Surveys: Sweden 1999.", url: "https://www.oecd.org/en/publications/oecd-economic-surveys-sweden_19990448.html" }
    ],
    institutionalLayer: {
      institution: "Riksbank con IT (meta 2%, formal desde 1995); corona flotante (salida MTC nov 1992); sistema bancario saneado; gobierno con amplio consenso político para consolidación fiscal.",
      mechanism: "Tras crisis bancaria 1991–1993 y salida del MTC (nov 1992), corona depreció mejorando competitividad exportadora. Gobierno electo en 1994 inicia consolidación: déficit ~12% PIB → superávit (1998). PORQUE hubo depreciación previa, ajuste fiscal NO requirió deflación nominal adicional. Riksbank mantuvo expectativas ancladas (meta 2%) durante todo el proceso. Resultado: PIB creció 4,0% (1994), 3,9% (1995), 1,5% (1996), 2,7% (1997); desempleo bajó desde 9,9% (1993) a ~6% (1998).",
      affectedVariables: ["tipo de cambio real (corona sueca)", "balance fiscal", "expectativas de inflación", "PIB real", "desempleo"],
      feedbackLoop: "Depreciación 1992 → competitividad exportadora mejora → demanda externa sostiene PIB → credibilidad Riksbank mantiene expectativas ancladas → ajuste fiscal sin espiral contractiva. Sistema bancario saneado elimina riesgo de credit crunch.",
      policyFeasibility: "Riksbank bajo IT sin presión de monetización; gobierno con consenso transversal; corona flotante permite ajuste real sin deflación; sistema bancario previamente saneado elimina riesgo de crisis.",
      incidence: "Trabajadores públicos y beneficiarios de prestaciones (recortes directos); desempleados; sector exportador beneficiado por depreciación 1992.",
      discriminatingEvidence: "Déficit fiscal: ~12% PIB (1994) → superávit (1998); deuda pública/PIB: ~78% (1994) → ~65% (1998); PIB: +4,0% (1994), +3,9% (1995), +1,5% (1996), +2,7% (1997); desempleo: 9,9% (1993) → ~6% (1998); corona sale MTC nov 1992; Riksbank IT formal 1995. Fuentes: OECD 1999, FMI 1998, Riksbank, Englund 1999.",
      antiOverclaim: "MacroLab NO captura: (i) devaluación 1992 fue amortiguador CRÍTICO —sin ella, consolidación requeriría deflación severa (cf. Grecia, sin flotación); (ii) ciclo global expansivo 1994–1998 fue favorable (no generaliza a post-2008); (iii) debate sobre composición del ajuste (gasto vs ingresos). La consolidación evitó recesión porque: (a) banca saneada, (b) régimen flotante, (c) ciclo favorable, (d) BC creíble. NO aplica a contextos distintos."
    }
  },

  "grecia_2010_2015": {
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
    institutionalLayer: {
      institution: "Grecia en eurozona sin política monetaria propia; BCE como prestamista de última instancia limitado; Troika (CE, BCE, FMI) como prestamista condicional a ajuste fiscal.",
      mechanism: "Revelación de déficit fiscal real (15,4% PIB, 2009) → pérdida de acceso a mercados → consolidación severa con multiplicador fiscal subestimado → PIB cae más de lo proyectado → ratio deuda/PIB sube → spread soberano se dispara (~3.000 pb, mar 2012) → bancos griegos en estrés, crédito bancario interno se contrae → actividad cae más; expectativas de permanencia en el euro se deterioran, elevan prima de riesgo; sin tipo de cambio, ajuste se desplaza a deflación de salarios nominales y empleo.",
      affectedVariables: ["spread soberano", "multiplicador fiscal", "crédito bancario interno", "salarios nominales y empleo", "expectativas de permanencia en el euro"],
      feedbackLoop: "Consolidación contrae PIB → ratio deuda/PIB sube → desconfianza aumenta → spread soberano sube → bancos en estrés → crédito bancario cae → PIB cae más → nueva austeridad exigida; ausencia de tipo de cambio hace el ajuste exclusivamente deflacionario.",
      policyFeasibility: "Sin moneda propia, devaluación imposible; financiamiento 100% condicional a ajuste fiscal; gobierno sin acceso a mercados desde 2010; resistencia social creciente limita el ritmo de ajuste.",
      incidence: "Trabajadores públicos y pensionistas golpeados primero (cortes directos); desempleo juvenil >50%; sector exportable pequeño sin buffer cambiario.",
      discriminatingEvidence: "PIB cae ~25% acumulado 2008–2013; desempleo: 27,5% (2013), juvenil >50%; spread 10A: ~3.000 pb (mar 2012); déficit revelado: 15,4% PIB (2009); PSI: reducción nominal 53,5%, pérdida VPN 70–75%; multiplicador estimado 0,5, real ~1,5 (Blanchard & Leigh 2013). Fuentes: Eurostat, FMI CR 13/156.",
      antiOverclaim: "MacroLab NO captura: (i) el rol del BCE/OMT (2012) en el restablecimiento parcial de la calma del mercado (De Grauwe 2012); (ii) el debate sobre diseño incompleto de la unión monetaria y ausencia de prestamista fiscal común; (iii) el doom loop entre bancos y soberano como amplificador autónomo. La ficha ilustra la espiral contraccionista bajo rigidez cambiaria; no modela contagio transfronterizo ni mecanismos supranacionales de estabilización."
    }
  }

});
