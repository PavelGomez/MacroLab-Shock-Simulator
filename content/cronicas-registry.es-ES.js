/* ========== CRÓNICAS REGISTRY ES-ES ========== */
// Registro de crónicas canónicas con fuentes verificadas.
// Clave: identificador de episodio histórico.
// Migrado desde EJEMPLOS en assets/lentes.js (Sprint 2).
window.MacroLabCronicasRegistryES = Object.freeze({

  "chile_2021_2024": {
    titulo: "Chile, 2021–2024",
    sub: "Credibilidad en economía abierta",
    cronica: [
      "Tras la pandemia, los retiros previsionales y la liquidez global empujaron la inflación chilena. La variación anual del IPC alcanzó su peak en agosto de 2022 al llegar a 14,1%, el nivel más alto desde 1991, según el INE.",
      "El Banco Central llevó la TPM desde 0,5% en julio de 2021 hasta 11,25% en octubre de 2022, y la mantuvo en ese nivel durante casi un año. La comunicación insistió en que la convergencia a la meta de 3% era prioridad, incluso ante presiones por aliviar la carga financiera.",
      "La inflación cedió hacia el rango meta durante 2024, sin un desanclaje persistente de las expectativas a 24 meses. El costo del ajuste se distribuyó entre actividad y precios; los salarios reales tardaron en recuperarse y el desempleo se mantuvo por encima de 8% durante el proceso."
    ],
    caveat: "Ilustra una respuesta creíble de banco central en una economía abierta. No es prescripción para otros casos ni predicción para episodios futuros.",
    fuentes: [
      { texto: "IPoM diciembre 2022, Banco Central de Chile", url: "https://www.bcentral.cl/areas/politica-monetaria/informe-de-politica-monetaria" },
      { texto: "INE, IPC anual 2022", url: "https://www.ine.gob.cl" },
      { texto: "FMI, Article IV Chile 2023", url: "https://www.imf.org/en/Countries/CHL" }
    ]
  },

  "turkey_2018_2023": {
    titulo: "Turquía, 2018–2023",
    sub: "Anclaje frágil con presión política sobre el banco central",
    cronica: [
      "Entre 2018 y 2023 Turquía atravesó múltiples episodios cambiarios. La inflación, que ya rondaba 15% al inicio del periodo, alcanzó su peak en octubre de 2022 al llegar a 85,4% interanual, según TurkStat.",
      "Frente a un cuadro que sugería contracción monetaria, la autoridad operó bajo presión política. En varios momentos del periodo el banco central recortó tasas mientras la inflación subía. La rotación de presidentes del banco central acentuó la percepción de baja autonomía.",
      "Las expectativas se desanclaron, el pass-through cambiario se aceleró, y las medidas heterodoxas no contuvieron la dinámica. Tras las elecciones de mayo de 2023 hubo un giro hacia tasas más altas, con resultados graduales: la inflación bajó a 38% en junio de 2023 y siguió cediendo en los años siguientes, aunque a niveles aún elevados."
    ],
    caveat: "Ilustra un mecanismo de desanclaje de expectativas y presión política sobre la autoridad monetaria, no un destino atribuible al país. Ningún rasgo nacional explica por sí solo la trayectoria; lo que se enseña es el mecanismo institucional.",
    fuentes: [
      { texto: "TurkStat, CPI series", url: "https://data.tuik.gov.tr" },
      { texto: "BIS, reportes sobre desinflación en emergentes", url: "https://www.bis.org" },
      { texto: "Focus Economics, Turkey CPI", url: "https://www.focus-economics.com/country-indicator/turkey/inflation/" }
    ]
  },

  "argentina_convertibility": {
    titulo: "Argentina, convertibilidad 1991–2002",
    sub: "Rigidez cambiaria bajo inconsistencia fiscal",
    cronica: [
      "La Ley 23.928, sancionada en marzo de 1991 y vigente desde el 1 de abril de ese año, fijó la paridad un peso por un dólar y rompió un ciclo hiperinflacionario previo. Por casi una década, la inflación se mantuvo en niveles bajos y la economía recibió capitales.",
      "Las tensiones se acumularon: déficit fiscal sostenido a nivel nacional y provincial, deuda pública creciente y dolarizada, salarios reales rígidos a la baja, productividad insuficiente para sostener la paridad real. La crisis del Tequila (1994–1995) fue un primer aviso; la economía sobrevivió.",
      "Pero la crisis rusa de 1998 y la devaluación del real brasileño en enero de 1999 abrieron una recesión persistente. La salida de capitales emergentes, sumada a la rigidez del régimen, hizo el ajuste real traumático. El \"corralito\" de diciembre de 2001 y la renuncia de De la Rúa precipitaron el final. La Ley fue derogada el 6 de enero de 2002, con default y devaluación posterior."
    ],
    caveat: "Ilustra cómo un ancla rígida acumula tensión cuando no es consistente con el resto del marco fiscal y de productividad. No que toda rigidez fracase, ni que la convertibilidad fuera inútil siempre. Distintos autores han ofrecido explicaciones complementarias del colapso.",
    fuentes: [
      { texto: "Texto oficial Ley 23.928", url: "https://www.argentina.gob.ar/normativa/nacional/ley-23928-328" },
      { texto: "Déficit y convertibilidad, Scielo Chile", url: "https://www.scielo.cl/scielo.php?script=sci_arttext&pid=S0717-68212003012100050" },
      { texto: "Universidad de San Andrés, La crisis de la convertibilidad", url: "https://repositorio.udesa.edu.ar" }
    ]
  },

  "chile_2008_2009": {
    titulo: "Chile, 2008–2009",
    sub: "Buffers en versión emergente",
    cronica: [
      "Cuando la crisis financiera global se transmitió a Chile a fines de 2008, el FEES había acumulado US$ 20.211 millones gracias al superávit cuprífero del periodo 2005–2008. Junto al Fondo de Reserva de Pensiones y otros activos del Tesoro, los ahorros soberanos representaban cerca del 15% del PIB.",
      "Frente al shock, el Banco Central recortó la TPM en 775 puntos base entre comienzos de 2009 y mediados de ese año, llevándola a un mínimo histórico de 0,5%. El gobierno anunció un Plan de Estímulo Fiscal de 2,8% del PIB, financiado con recursos del FEES y emisión de deuda pública, dirigido a inversión, transferencias a hogares de bajos ingresos y subsidios al empleo.",
      "La actividad cayó en 2009 pero la economía volvió a expandirse hacia fines de ese año. La regla de balance estructural y los ahorros soberanos hicieron viable la respuesta sin comprometer la credibilidad ni la sostenibilidad. El FMI calificó la respuesta de \"vigorosa, bien equilibrada y coordinada\" en su Article IV de 2009."
    ],
    caveat: "Ilustra el uso de buffers fiscales y monetarios construidos en periodos buenos. No un blindaje absoluto; las condiciones —regla creíble, ahorro previo, supervisión funcional— hicieron viable la respuesta en ese momento.",
    fuentes: [
      { texto: "Informe FEES diciembre 2009, DIPRES", url: "https://www.dipres.gob.cl/598/articles-61210_doc_pdf.pdf" },
      { texto: "FMI, Article IV Chile 2009", url: "https://www.imf.org/es/News/Articles/2015/09/28/04/53/pn09111" },
      { texto: "Cumplimiento de las metas de regla fiscal en Chile, DIPRES 2022", url: "https://www.dipres.gob.cl/598/articles-299473_doc_pdf.pdf" }
    ]
  }

});
