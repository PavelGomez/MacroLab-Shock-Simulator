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
      { texto: "Coibion, Gorodnichenko, Kumar & Pedemonte (2020). Inflation expectations as a policy tool? JME 116.", url: "https://doi.org/10.1016/j.jmoneco.2020.07.002" }
    ]
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
    ]
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
      { texto: "Mussa (2002). Argentina and the Fund: From Triumph to Tragedy. PIIE Policy Analysis 67.", url: "https://www.piie.com/bookstore/argentina-and-fund-triumph-tragedy" },
      { texto: "Calvo, Izquierdo & Mejía (2008). Systemic Sudden Stops. NBER WP 14026.", url: "https://www.nber.org/papers/w14026" },
      { texto: "De la Torre, Levy Yeyati & Schmukler (2003). Living and Dying with Hard Pegs. Economía 3(2).", url: "https://muse.jhu.edu/article/41432" }
    ]
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
      { texto: "Vegh & Vuletin (2014). Overcoming the Fear of Free Falling. AER 104(5).", url: "https://doi.org/10.1257/aer.104.5.131" },
      { texto: "Frankel, Vegh & Vuletin (2013). On graduation from fiscal procyclicality. JIE 100(1).", url: "https://doi.org/10.1016/j.jinteco.2012.12.008" }
    ]
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
      { texto: "van den Bremer & van der Ploeg (2013). Managing Volatile Oil Windfalls. Oxford REP 29(1).", url: "https://doi.org/10.1093/oxrep/grt001" },
      { texto: "Norges Bank (2020). Monetary Policy Report 1/2020.", url: "https://www.norges-bank.no/en/news-events/news-publications/Reports/Monetary-Policy-Report-with-financial-stability-assessment/2020/mpr-12020/" },
      { texto: "Norges Bank (2020). Monetary Policy Report 2/2020.", url: "https://www.norges-bank.no/en/news-events/news-publications/Reports/Monetary-Policy-Report-with-financial-stability-assessment/2020/mpr-22020/" },
      { texto: "FMI (2021). Norway: 2021 Article IV Consultation. CR 21/197.", url: "https://www.imf.org/en/Publications/CR/Issues/2021/09/13/Norway-2021-Article-IV-Consultation-Press-Release-Staff-Report-466009" },
      { texto: "OECD (2022). OECD Economic Surveys: Norway 2022. DOI 10.1787/df7b87ab-en.", url: "https://doi.org/10.1787/df7b87ab-en" },
      { texto: "Reuters (2020). Norway shatters wealth fund spending cap amid pandemic.", url: "https://www.reuters.com/article/business/norway-shatters-wealth-fund-spending-cap-amid-pandemic-idUSKBN22O1GP/" }
    ]
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
      { texto: "Sturzenegger & Zettelmeyer (2008). Haircuts. JIMF 27(5).", url: "https://doi.org/10.1016/j.jimonfin.2007.10.005" },
      { texto: "Sturzenegger (2022). Hyperinflation: A Concise Review. LJCB 3(2).", url: "https://doi.org/10.1016/j.latcb.2022.100052" },
      { texto: "FMI (2021). Argentina: Ex Post Evaluation 2018 SBA. CR 21/279.", url: "https://www.imf.org/en/Publications/CR/Issues/2021/12/22/Argentina-Ex-Post-Evaluation-of-Exceptional-Access-Under-the-2018-Stand-By-Arrangement-511289" },
      { texto: "CEPAL (2021). Estudio Económico de América Latina y el Caribe 2021.", url: "https://www.cepal.org/es/publicaciones/47192-estudio-economico-america-latina-caribe-2021" },
      { texto: "BCRA. Relevamiento de Expectativas de Mercado (REM) 2020-2022.", url: "https://www.bcra.gob.ar/PublicacionesEstadisticas/relevamiento_expectativas_de_mercado.asp" }
    ]
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
      { texto: "Henriksson (2007). Ten Lessons about Budget Consolidation. Bruegel.", url: "https://www.bruegel.org/essay-and-lecture/ten-lessons-about-budget-consolidation" },
      { texto: "Sveriges Riksbank. Inflation target history (1993, formal from 1995).", url: "https://www.riksbank.se/en-gb/monetary-policy/the-inflation-target/" },
      { texto: "FMI (1998). Sweden: Selected Issues. CR 98/124.", url: "https://www.imf.org/en/Publications/CR/Issues/2016/12/30/Sweden-Selected-Issues-2752" },
      { texto: "OECD (1999). OECD Economic Surveys: Sweden 1999.", url: "https://www.oecd.org/en/publications/oecd-economic-surveys-sweden_19990448.html" }
    ]
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
      { texto: "IEO-IMF (2016). The IMF and the Crises in Greece, Ireland, and Portugal.", url: "https://ieo.imf.org/en/our-work/Evaluations/Completed/2016-0728-the-imf-and-the-crises-in-greece-ireland-and-portugal" },
      { texto: "ESM (2019). Safeguarding the euro in times of crisis.", url: "https://www.esm.europa.eu/publications/safeguarding-euro-times-crisis" }
    ]
  }

});
