// assets/lentes.js
(function() {
  'use strict';

  // ============================================================
  // DATOS
  // ============================================================

  const FAMILIA = {
    oferta:  'OA se desplaza hacia arriba o izquierda: precios suben, producto baja transitoriamente. La pregunta institucional es si el shock se queda en precios o se traslada a expectativas.',
    demanda: 'DA se desplaza: precios y producto se mueven en la misma dirección. El espacio que tenía la economía determina el reparto entre precios y actividad.',
    mixto:   'Desplazamientos simultáneos de OA y DA, posiblemente cruzados. Ningún canal único explica la trayectoria.'
  };

  const SHOCKS = {
    oil:            { name: 'Alza del petróleo',         family: 'oferta'  },
    imports:        { name: 'Costos importados',         family: 'oferta'  },
    productivity:   { name: 'Caída de productividad',    family: 'oferta'  },
    fiscal_exp:     { name: 'Expansión fiscal',          family: 'demanda' },
    monetary_tight: { name: 'Endurecimiento monetario',  family: 'demanda' },
    copper_drop:    { name: 'Caída del cobre',           family: 'mixto'   }
  };

  const CONFIGS = {
    chile_2026:        'Chile 2026',
    fragile:           'Anclaje frágil',
    rigid_fx:          'Rigidez cambiaria',
    high_cred_buffers: 'Alta credibilidad con buffers'
  };

  const DIM_RESUMEN = {
    chile_2026:        'expectativas ancladas con sesgo, pass-through moderado, persistencia moderada',
    fragile:           'expectativas poco ancladas, pass-through alto, persistencia alta',
    rigid_fx:          'ancla externa, pass-through bajo en corto plazo, ajuste vía cantidades',
    high_cred_buffers: 'expectativas muy ancladas, pass-through bajo, persistencia baja, buffers activos'
  };

  // Diez celdas redactadas
  const CELDAS = {
    'oil__chile_2026': {
      narrativa: 'Banco Central autónomo y meta creíble; expectativas tienden a anclarse pero pueden mostrar sesgo al alza ante shocks visibles. La regla fiscal limita acomodación discrecional. La apertura externa hace relevante el pass-through cambiario si el shock es global.',
      rezagos:   'Inflación inicial por sobre la meta; convergencia gradual en dos a cuatro trimestres si no se activa una segunda vuelta. Ajuste compartido entre precios y actividad; menor componente recesivo si la respuesta del Banco Central es percibida como creíble.',
      dato:      'Encuesta de Expectativas Económicas, IPC sin volátiles, expectativas a 12 y 24 meses, breakeven implícito, salarios en sectores indexados (UF).',
      ejemplo:   'chile_2021_2024'
    },
    'oil__fragile': {
      narrativa: 'Expectativas reaccionan rápido; presión política sobre la autoridad monetaria; dominancia fiscal latente; pass-through alto por dolarización informal y baja credibilidad histórica; indexación amplia y rápida.',
      rezagos:   'Inflación se aleja de la meta; persistencia alta; segunda vuelta probable; deterioro de prima soberana; ajuste real puede demorar y resultar abrupto cuando llega.',
      dato:      'Spread soberano, demanda de dólares, premium en cambio paralelo si existe, salarios indexados, breakeven implícito.',
      ejemplo:   'turkey_2018_2023'
    },
    'oil__rigid_fx': {
      narrativa: 'El régimen restringe la absorción nominal: el alza de costos importados llega a precios pero el tipo de cambio no la diluye. La consistencia fiscal-monetaria del régimen determina si el shock se contiene o se acumula.',
      rezagos:   'Inflación contenida si el régimen es consistente; tensiones acumulativas en reservas, salarios reales y empleo si no lo es. El costo del shock se concentra en cantidades y empleo, no en precios.',
      dato:      'Reservas internacionales, balance externo, salarios reales, empleo industrial, percepción de sostenibilidad del régimen.',
      ejemplo:   'argentina_convertibility'
    },
    'oil__high_cred_buffers': {
      narrativa: 'Expectativas firmemente ancladas; espacio fiscal y monetario disponibles; indexación reducida y puntual. El Banco Central acomoda gradualmente sin desanclar.',
      rezagos:   'Inflación se mueve poco respecto al objetivo; convergencia rápida; baja persistencia; segunda vuelta improbable. El costo real del ajuste se reparte entre actividad moderada y precios contenidos.',
      dato:      'Núcleo, expectativas, breakeven, ejecución del fondo de estabilización, precios mayoristas.',
      ejemplo:   'chile_2008_2009'
    },
    'imports__chile_2026': {
      narrativa: 'Como en petróleo: BC creíble y regla fiscal disciplinan expectativas. La apertura amplifica el canal cambiario; conviene observar si el shock es global (afecta a todos los socios) o relativo (solo a algunos productos).',
      rezagos:   'Inflación importada se transmite parcialmente; convergencia ordenada si no hay segunda vuelta; mayor presión sobre transables.',
      dato:      'Tipo de cambio nominal y real, IPC transables, márgenes mayoristas, expectativas.',
      ejemplo:   'chile_2021_2024'
    },
    'fiscal_exp__chile_2026': {
      narrativa: 'Regla fiscal acota la magnitud sostenible; el Banco Central evalúa si la brecha se cierra demasiado rápido y reacciona en tasas. Mercados miran cumplimiento real de la regla, no su existencia formal.',
      rezagos:   'Producto sube en el corto plazo; inflación responde si la brecha era pequeña o ya estaba cerrada. La magnitud de la respuesta depende del cumplimiento percibido de la regla.',
      dato:      'Deuda/PIB, prima soberana, tasas largas, expectativas, ejecución presupuestaria, holgura cíclica.',
      ejemplo:   'chile_2008_2009'
    },
    'fiscal_exp__fragile': {
      narrativa: 'Sin ancla fiscal creíble, la expansión activa expectativas inflacionarias rápido. Dominancia fiscal latente: el Banco Central enfrenta presión para acomodar; los mercados anticipan deterioro de solvencia.',
      rezagos:   'Producto inicialmente sube; pero inflación y prima de riesgo responden con fuerza; la trayectoria puede volverse contractiva cuando la prima soberana se traslada a tasas y a tipo de cambio.',
      dato:      'Spread soberano, ratio deuda/PIB, deuda en moneda extranjera, intervención cambiaria, demanda de dólares.',
      ejemplo:   'argentina_convertibility'
    },
    'fiscal_exp__high_cred_buffers': {
      narrativa: 'Espacio fiscal absorbe sin desanclaje de expectativas; el BC tiene holgura para acomodar gradualmente o para contener si la brecha se cierra; tasas largas se mueven poco si la regla es percibida como creíble.',
      rezagos:   'Brecha positiva contenida; inflación bajo control; mayor inversión privada si el marco es predecible; tasa neutral puede subir gradualmente.',
      dato:      'Deuda/PIB, prima soberana, tasas largas, expectativas, balance del fondo soberano, ejecución presupuestaria.',
      ejemplo:   'chile_2008_2009'
    },
    'monetary_tight__chile_2026': {
      narrativa: 'Banco Central creíble; transmisión funciona vía tasas largas, condiciones financieras y tipo de cambio. La regla fiscal no contrarresta la decisión monetaria.',
      rezagos:   'Demanda agregada se enfría; inflación cede gradualmente; la actividad puede desacelerar transitoriamente. Convergencia ordenada si la comunicación del BC es consistente con sus decisiones.',
      dato:      'Tasas reales esperadas, condiciones financieras, brecha de producto, IPC sin volátiles, expectativas.',
      ejemplo:   'chile_2021_2024'
    },
    'copper_drop__rigid_fx': {
      narrativa: 'El régimen cambiario restringe la absorción nominal; el ajuste pasa por actividad, reservas, salarios reales o solvencia. La consistencia fiscal-monetaria del régimen es decisiva: si falta, las tensiones se acumulan.',
      rezagos:   'Inflación contenida en el corto plazo si el régimen es consistente; tensiones acumulativas en cuenta corriente, reservas, precios relativos y empleo. Si la inconsistencia escala, riesgo de ruptura del régimen.',
      dato:      'Reservas, balance externo, dispersión cambio paralelo/oficial, salarios reales, flujos de capital, percepción de sostenibilidad.',
      ejemplo:   'argentina_convertibility'
    }
  };

  // Cuatro crónicas con cifras verificadas y fuentes
  const EJEMPLOS = {
    chile_2021_2024: {
      titulo: 'Chile, 2021–2024',
      sub: 'Credibilidad en economía abierta',
      cronica: [
        'Tras la pandemia, los retiros previsionales y la liquidez global empujaron la inflación chilena. La variación anual del IPC alcanzó su peak en agosto de 2022 al llegar a 14,1%, el nivel más alto desde 1991, según el INE.',
        'El Banco Central llevó la TPM desde 0,5% en julio de 2021 hasta 11,25% en octubre de 2022, y la mantuvo en ese nivel durante casi un año. La comunicación insistió en que la convergencia a la meta de 3% era prioridad, incluso ante presiones por aliviar la carga financiera.',
        'La inflación cedió hacia el rango meta durante 2024, sin un desanclaje persistente de las expectativas a 24 meses. El costo del ajuste se distribuyó entre actividad y precios; los salarios reales tardaron en recuperarse y el desempleo se mantuvo por encima de 8% durante el proceso.'
      ],
      caveat: 'Ilustra una respuesta creíble de banco central en una economía abierta. No es prescripción para otros casos ni predicción para episodios futuros.',
      fuentes: [
        { texto: 'IPoM diciembre 2022, Banco Central de Chile', url: 'https://www.bcentral.cl/areas/politica-monetaria/informe-de-politica-monetaria' },
        { texto: 'INE, IPC anual 2022', url: 'https://www.ine.gob.cl' },
        { texto: 'FMI, Article IV Chile 2023', url: 'https://www.imf.org/en/Countries/CHL' }
      ]
    },
    turkey_2018_2023: {
      titulo: 'Turquía, 2018–2023',
      sub: 'Anclaje frágil con presión política sobre el banco central',
      cronica: [
        'Entre 2018 y 2023 Turquía atravesó múltiples episodios cambiarios. La inflación, que ya rondaba 15% al inicio del periodo, alcanzó su peak en octubre de 2022 al llegar a 85,4% interanual, según TurkStat.',
        'Frente a un cuadro que sugería contracción monetaria, la autoridad operó bajo presión política. En varios momentos del periodo el banco central recortó tasas mientras la inflación subía. La rotación de presidentes del banco central acentuó la percepción de baja autonomía.',
        'Las expectativas se desanclaron, el pass-through cambiario se aceleró, y las medidas heterodoxas no contuvieron la dinámica. Tras las elecciones de mayo de 2023 hubo un giro hacia tasas más altas, con resultados graduales: la inflación bajó a 38% en junio de 2023 y siguió cediendo en los años siguientes, aunque a niveles aún elevados.'
      ],
      caveat: 'Ilustra un mecanismo de desanclaje de expectativas y presión política sobre la autoridad monetaria, no un destino atribuible al país. Ningún rasgo nacional explica por sí solo la trayectoria; lo que se enseña es el mecanismo institucional.',
      fuentes: [
        { texto: 'TurkStat, CPI series', url: 'https://data.tuik.gov.tr' },
        { texto: 'BIS, reportes sobre desinflación en emergentes', url: 'https://www.bis.org' },
        { texto: 'Focus Economics, Turkey CPI', url: 'https://www.focus-economics.com/country-indicator/turkey/inflation/' }
      ]
    },
    argentina_convertibility: {
      titulo: 'Argentina, convertibilidad 1991–2002',
      sub: 'Rigidez cambiaria bajo inconsistencia fiscal',
      cronica: [
        'La Ley 23.928, sancionada en marzo de 1991 y vigente desde el 1 de abril de ese año, fijó la paridad un peso por un dólar y rompió un ciclo hiperinflacionario previo. Por casi una década, la inflación se mantuvo en niveles bajos y la economía recibió capitales.',
        'Las tensiones se acumularon: déficit fiscal sostenido a nivel nacional y provincial, deuda pública creciente y dolarizada, salarios reales rígidos a la baja, productividad insuficiente para sostener la paridad real. La crisis del Tequila (1994–1995) fue un primer aviso; la economía sobrevivió.',
        'Pero la crisis rusa de 1998 y la devaluación del real brasileño en enero de 1999 abrieron una recesión persistente. La salida de capitales emergentes, sumada a la rigidez del régimen, hizo el ajuste real traumático. El "corralito" de diciembre de 2001 y la renuncia de De la Rúa precipitaron el final. La Ley fue derogada el 6 de enero de 2002, con default y devaluación posterior.'
      ],
      caveat: 'Ilustra cómo un ancla rígida acumula tensión cuando no es consistente con el resto del marco fiscal y de productividad. No que toda rigidez fracase, ni que la convertibilidad fuera inútil siempre. Distintos autores han ofrecido explicaciones complementarias del colapso.',
      fuentes: [
        { texto: 'Texto oficial Ley 23.928', url: 'https://www.argentina.gob.ar/normativa/nacional/ley-23928-328' },
        { texto: 'Déficit y convertibilidad, Scielo Chile', url: 'https://www.scielo.cl/scielo.php?script=sci_arttext&pid=S0717-68212003012100050' },
        { texto: 'Universidad de San Andrés, La crisis de la convertibilidad', url: 'https://repositorio.udesa.edu.ar' }
      ]
    },
    chile_2008_2009: {
      titulo: 'Chile, 2008–2009',
      sub: 'Buffers en versión emergente',
      cronica: [
        'Cuando la crisis financiera global se transmitió a Chile a fines de 2008, el FEES había acumulado US$ 20.211 millones gracias al superávit cuprífero del periodo 2005–2008. Junto al Fondo de Reserva de Pensiones y otros activos del Tesoro, los ahorros soberanos representaban cerca del 15% del PIB.',
        'Frente al shock, el Banco Central recortó la TPM en 775 puntos base entre comienzos de 2009 y mediados de ese año, llevándola a un mínimo histórico de 0,5%. El gobierno anunció un Plan de Estímulo Fiscal de 2,8% del PIB, financiado con recursos del FEES y emisión de deuda pública, dirigido a inversión, transferencias a hogares de bajos ingresos y subsidios al empleo.',
        'La actividad cayó en 2009 pero la economía volvió a expandirse hacia fines de ese año. La regla de balance estructural y los ahorros soberanos hicieron viable la respuesta sin comprometer la credibilidad ni la sostenibilidad. El FMI calificó la respuesta de "vigorosa, bien equilibrada y coordinada" en su Article IV de 2009.'
      ],
      caveat: 'Ilustra el uso de buffers fiscales y monetarios construidos en periodos buenos. No un blindaje absoluto; las condiciones —regla creíble, ahorro previo, supervisión funcional— hicieron viable la respuesta en ese momento.',
      fuentes: [
        { texto: 'Informe FEES diciembre 2009, DIPRES', url: 'https://www.dipres.gob.cl/598/articles-61210_doc_pdf.pdf' },
        { texto: 'FMI, Article IV Chile 2009', url: 'https://www.imf.org/es/News/Articles/2015/09/28/04/53/pn09111' },
        { texto: 'Cumplimiento de las metas de regla fiscal en Chile, DIPRES 2022', url: 'https://www.dipres.gob.cl/598/articles-299473_doc_pdf.pdf' }
      ]
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const $ = id => document.getElementById(id);

  function poblarPanel() {
    const shockId  = $('lentes-ex-shock').value;
    const configId = $('lentes-ex-config').value;
    const panel    = $('lentes-panel');

    if (!shockId || !configId) { panel.hidden = true; return; }
    panel.hidden = false;

    const shock  = SHOCKS[shockId];
    const config = CONFIGS[configId];
    const lecturaFamilia = FAMILIA[shock.family];
    const key    = shockId + '__' + configId;
    const celda  = CELDAS[key];

    $('lentes-panel-titulo').textContent = shock.name + ' bajo configuración ' + config;
    $('lentes-panel-lectura').textContent = lecturaFamilia;

    if (celda) {
      $('lentes-panel-aviso').hidden = true;
      $('lentes-panel-narrativa').textContent = celda.narrativa;
      $('lentes-panel-rezagos').textContent   = celda.rezagos;
      $('lentes-panel-dato').textContent      = celda.dato;

      if (celda.ejemplo) {
        var ej = EJEMPLOS[celda.ejemplo];
        $('lentes-panel-cronica-resumen').textContent =
          ej.titulo + '. ' + ej.sub + '. ' + ej.cronica[0];
        var link = $('lentes-panel-cronica-link');
        link.hidden = false;
        link.dataset.ejemplo = celda.ejemplo;
      } else {
        $('lentes-panel-cronica-resumen').textContent =
          'Esta combinación no tiene ejemplo canónico curado en el MVP.';
        $('lentes-panel-cronica-link').hidden = true;
      }
    } else {
      $('lentes-panel-aviso').hidden = false;
      $('lentes-panel-narrativa').textContent =
        'Bajo configuración ' + config.toLowerCase() + ', los rasgos institucionales modulan el mecanismo de la familia: ' + DIM_RESUMEN[configId] + '.';
      $('lentes-panel-rezagos').textContent =
        'La trayectoria específica para esta combinación no está redactada como pieza editorial. Como aproximación, la dirección la dan la lectura común de la familia y los rasgos de la tabla panorámica.';
      $('lentes-panel-dato').textContent =
        'Indicadores genéricos de la familia y rasgos de la configuración elegida (ver tabla panorámica).';
      $('lentes-panel-cronica-resumen').textContent =
        'Sin ejemplo canónico asociado.';
      $('lentes-panel-cronica-link').hidden = true;
    }
  }

  function abrirCronica(ejemploId) {
    var ej = EJEMPLOS[ejemploId];
    if (!ej) return;
    $('lentes-modal-titulo').textContent = ej.titulo;
    $('lentes-modal-sub').textContent    = ej.sub;
    $('lentes-modal-cronica-texto').innerHTML =
      ej.cronica.map(function(p) { return '<p>' + p + '</p>'; }).join('');
    $('lentes-modal-caveat').textContent = ej.caveat;
    $('lentes-modal-fuentes-lista').innerHTML =
      ej.fuentes.map(function(f) {
        return '<li><a href="' + f.url + '" target="_blank" rel="noopener">' + f.texto + ' ↗</a></li>';
      }).join('');
    $('lentes-modal').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function cerrarCronica() {
    $('lentes-modal').hidden = true;
    document.body.style.overflow = '';
  }

  // ============================================================
  // INIT (al DOMContentLoaded)
  // ============================================================

  function init() {
    if (!$('lentes-ex-shock')) return; // El módulo no está en esta página

    $('lentes-ex-shock').addEventListener('change', poblarPanel);
    $('lentes-ex-config').addEventListener('change', poblarPanel);

    $('lentes-panel-cronica-link').addEventListener('click', function(e) {
      e.preventDefault();
      abrirCronica(e.currentTarget.dataset.ejemplo);
    });

    document.querySelectorAll('[data-lentes-modal-cerrar]').forEach(function(el) {
      el.addEventListener('click', cerrarCronica);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !$('lentes-modal').hidden) cerrarCronica();
    });

    // CTAs desde otras secciones (por ejemplo, OA-DA)
    // Cualquier <a class="lentes__cta" data-lentes-shock="xxx"> hace pre-selección
    document.querySelectorAll('a.lentes__cta[data-lentes-shock]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof activateTab === 'function') {
          activateTab('institucional');
        }
        window.setTimeout(function() {
          var target = document.getElementById('lentes-explorador');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
        var sid = a.dataset.lentesShock;
        if (SHOCKS[sid]) {
          $('lentes-ex-shock').value = sid;
          poblarPanel();
        }
      });
    });

    // Pre-carga desde URL: ?shock=oil
    var params = new URLSearchParams(window.location.search);
    var preShock = params.get('shock');
    if (preShock && SHOCKS[preShock]) {
      $('lentes-ex-shock').value = preShock;
      poblarPanel();
      // Auto-scroll suave al explorador si llegamos con shock pre-seleccionado
      setTimeout(function() {
        var target = $('lentes-explorador');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
