/* ========== NARRATIVE LAYER ========== */
(function narrativeLayerBootstrap() {
  "use strict";

  var ROUTES = (typeof window.MacroLabRouteRegistryES !== 'undefined')
    ? window.MacroLabRouteRegistryES
    : Object.freeze({});

  var CRONICAS = (typeof window.MacroLabCronicasRegistryES !== 'undefined')
    ? window.MacroLabCronicasRegistryES
    : Object.freeze({});

  var LENS_TO_MODEL = {
    petroleo:         { tab: 'oada',   shockKey: 'oilUp' },
    cobre:            { tab: 'islmbp', shockKey: 'copperDown' },
    pandemia:         { tab: 'oada',   shockKey: 'pandemic' },
    fiscalExpand:     { tab: 'islm',   shockKey: 'fiscalExpand' },
    fiscalContract:   { tab: 'islm',   shockKey: 'fiscalContract' },
    monetaryContract: { tab: 'islm',   shockKey: 'monetaryContract' },
    globalRecession:  { tab: 'islmbp', shockKey: 'globalRecession' },
    guerra:           { tab: 'oada',   shockKey: 'oilUp' }
  };

  var CONFIG_LABELS = {
    CHL: 'Chile 2026 · Credibilidad macro',
    FRG: 'Anclaje frágil',
    RIG: 'Rigidez cambiaria',
    CRD: 'Alta credibilidad con buffer'
  };

  var SHOCK_LABELS = {
    petroleo:         'Alza del petróleo / energía',
    cobre:            'Caída del cobre',
    pandemia:         'Pandemia',
    fiscalExpand:     'Expansión fiscal',
    fiscalContract:   'Contracción fiscal',
    monetaryContract: 'Contracción monetaria',
    globalRecession:  'Recesión global',
    guerra:           'Guerra / shock mixto'
  };

  var MODEL_LIMITS = {
    islm:   'IS-LM supone economía cerrada o con canal externo simplificado. No captura pass-through cambiario ni dinámica de balanza de pagos.',
    islmbp: 'IS-LM-BP asume perfecta movilidad de capitales y tipo de cambio flotante limpio. No modela expectativas inflacionarias ni histéresis.',
    oada:   'OA-DA muestra el equilibrio estático de corto plazo. No formaliza la dinámica de expectativas ni la heterogeneidad sectorial.'
  };

  var runtimeState = { lensShock: null, configKey: null, tab: null, modelShockKey: null };

  function escapeHtml(value) {
    if (value == null) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function motionBehavior() {
    return prefersReducedMotion() ? 'auto' : 'smooth';
  }

  function readLentesContext(triggerButton) {
    var lensShock = '';
    var configKey = '';
    var shockEl  = document.getElementById('lentes-shock');
    var configEl = document.getElementById('lentes-config');
    if (shockEl)  lensShock = shockEl.value;
    if (configEl) configKey = configEl.value;

    var tab           = triggerButton ? triggerButton.getAttribute('data-tab')   : null;
    var modelShockKey = triggerButton ? triggerButton.getAttribute('data-shock') : null;

    if ((!tab || !modelShockKey) && lensShock && LENS_TO_MODEL[lensShock]) {
      tab           = tab           || LENS_TO_MODEL[lensShock].tab;
      modelShockKey = modelShockKey || LENS_TO_MODEL[lensShock].shockKey;
    }

    return { lensShock: lensShock, configKey: configKey, tab: tab, modelShockKey: modelShockKey };
  }

  function buildFallbackNarrative(ctx) {
    var shockLabel  = SHOCK_LABELS[ctx.lensShock] || escapeHtml(ctx.lensShock) || 'no especificado';
    var configLabel = CONFIG_LABELS[ctx.configKey] || escapeHtml(ctx.configKey) || 'no especificado';
    var tabLabel    = ctx.tab
      ? ctx.tab.toUpperCase().replace('ISLMBP','IS-LM-BP').replace('ISLM','IS-LM').replace('OADA','OA-DA')
      : 'no especificado';

    return {
      arrivalTitle:  tabLabel + ' · ' + shockLabel + ' · ' + configLabel,
      what:          'Combinación ' + shockLabel + ' + ' + configLabel +
                     ' en modelo ' + tabLabel +
                     '. Esta combinación no tiene registro editorial curado en esta versión.',
      shock:         'no especificado',
      graph:         'no especificado',
      next:          'Explora el gráfico del modelo y lee la trayectoria disponible. Vuelve a Lentes para contrastar con otras configuraciones.',
      hypothesis:    'no especificado',
      filter:        configLabel,
      limits:        MODEL_LIMITS[ctx.tab] || 'no especificado',
      evidenceNow:   [],
      evidenceLater: [],
      antiOverclaim: 'no especificado',
      returnText:    '← Volver a Lentes institucionales'
    };
  }

  function resolveNarrative(ctx) {
    var exactKey = ctx.tab + '|' + ctx.modelShockKey + '|' + ctx.configKey;
    if (ROUTES[exactKey]) return ROUTES[exactKey];
    return buildFallbackNarrative(ctx);
  }

  function showGuidedArrival(tab, narrative) {
    var arrivalEl = document.getElementById(tab + '-guided-arrival');
    if (!arrivalEl) return;

    function setField(suffix, value) {
      var el = document.getElementById(tab + '-guided-' + suffix);
      if (el) el.textContent = value || '—';
    }

    setField('title', narrative.arrivalTitle);
    setField('what',  narrative.what);
    setField('shock', narrative.shock);
    setField('graph', narrative.graph);
    setField('next',  narrative.next);

    arrivalEl.classList.remove('hidden');
    arrivalEl.setAttribute('aria-hidden', 'false');
  }

  function ensureClosureMount(tab) {
    var mountId = tab + '-route-closure';
    if (document.getElementById(mountId)) return;

    var arrivalEl = document.getElementById(tab + '-guided-arrival');
    if (!arrivalEl) return;

    var mount = document.createElement('section');
    mount.id        = mountId;
    mount.className = 'route-closure-card';
    mount.setAttribute('aria-live', 'polite');
    arrivalEl.parentNode.insertBefore(mount, arrivalEl.nextSibling);
  }

  function buildListHtml(items) {
    if (!items || !items.length) return '<p>no especificado</p>';
    return '<ul class="route-closure-list">' +
      items.map(function(item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') +
      '</ul>';
  }

  function isSafeUrl(url) {
    return typeof url === 'string' &&
      (url.indexOf('https://') === 0 || url.indexOf('http://') === 0);
  }

  function buildCronicaHtml(cronicaKey) {
    if (!cronicaKey || !CRONICAS[cronicaKey]) return '';
    var c = CRONICAS[cronicaKey];
    var parrafos = '';
    if (c.cronica && c.cronica.length) {
      for (var i = 0; i < c.cronica.length; i++) {
        parrafos += '<p>' + escapeHtml(c.cronica[i]) + '</p>';
      }
    }
    var fuentes = '';
    if (c.fuentes && c.fuentes.length) {
      for (var j = 0; j < c.fuentes.length; j++) {
        var f = c.fuentes[j];
        var href = isSafeUrl(f.url) ? f.url : '#';
        fuentes += '<li><a href="' + href + '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(f.texto) + '</a></li>';
      }
    }
    return '<details class="route-closure-cronica">' +
      '<summary>Crónica canónica con fuentes · ' + escapeHtml(c.titulo) + '</summary>' +
      '<p class="route-closure-cronica-sub">' + escapeHtml(c.sub) + '</p>' +
      '<div class="route-closure-cronica-cuerpo">' + parrafos + '</div>' +
      '<p class="route-closure-cronica-caveat">' + escapeHtml(c.caveat) + '</p>' +
      '<div class="route-closure-cronica-fuentes">' +
        '<h5>Fuentes</h5>' +
        '<ul>' + fuentes + '</ul>' +
      '</div>' +
    '</details>';
  }

  function closureHtml(narrative, ctx) {
    var returnText = narrative.returnText || '← Volver a Lentes institucionales';

    return '' +
      '<div class="route-closure-head">' +
        '<p class="route-closure-kicker">Cierre editorial</p>' +
        '<h3 class="route-closure-title" tabindex="-1" ' +
            'id="' + escapeHtml(ctx.tab) + '-closure-title">' +
          escapeHtml(narrative.arrivalTitle) +
        '</h3>' +
      '</div>' +
      '<p class="route-closure-summary">' + escapeHtml(narrative.what) + '</p>' +
      '<div class="route-closure-grid">' +
        '<div class="route-closure-block"><h4>Hipótesis</h4>' +
          '<p>' + escapeHtml(narrative.hypothesis) + '</p></div>' +
        '<div class="route-closure-block"><h4>Filtro institucional</h4>' +
          '<p>' + escapeHtml(narrative.filter) + '</p></div>' +
        '<div class="route-closure-block"><h4>Límites del modelo</h4>' +
          '<p>' + escapeHtml(narrative.limits) + '</p></div>' +
        '<div class="route-closure-block"><h4>Evidencia inmediata</h4>' +
          buildListHtml(narrative.evidenceNow) + '</div>' +
        '<div class="route-closure-block"><h4>Evidencia posterior</h4>' +
          buildListHtml(narrative.evidenceLater) + '</div>' +
        '<div class="route-closure-block"><h4>Cautela</h4>' +
          '<p class="route-closure-warning">' + escapeHtml(narrative.antiOverclaim) + '</p></div>' +
      '</div>' +
      buildCronicaHtml(narrative.cronicaKey) +
      '<div class="route-closure-actions">' +
        '<button type="button" class="route-btn" ' +
            'data-route-return="lentes" ' +
            'data-return-shock="' + escapeHtml(ctx.lensShock) + '" ' +
            'data-return-config="' + escapeHtml(ctx.configKey) + '">' +
          escapeHtml(returnText) +
        '</button>' +
      '</div>';
  }

  function renderClosure(tab, narrative, ctx) {
    var mount = document.getElementById(tab + '-route-closure');
    if (!mount) return;

    mount.innerHTML = closureHtml(narrative, ctx);

    var returnBtn = mount.querySelector('[data-route-return="lentes"]');
    if (!returnBtn) return;

    returnBtn.addEventListener('click', function() {
      var lensShock  = returnBtn.getAttribute('data-return-shock');
      var lensConfig = returnBtn.getAttribute('data-return-config');

      if (typeof activateTab === 'function') activateTab('lentes');

      var shockSel  = document.getElementById('lentes-shock');
      var configSel = document.getElementById('lentes-config');
      if (shockSel  && lensShock)  shockSel.value  = lensShock;
      if (configSel && lensConfig) configSel.value = lensConfig;

      if (typeof renderLentesCompare === 'function') renderLentesCompare();
      window.scrollTo({ top: 0, behavior: motionBehavior() });
    });
  }

  function setModelShock(tab, modelShockKey) {
    var sel = document.getElementById(tab + '-shock');
    if (!sel || !modelShockKey) return;
    sel.value = modelShockKey;
    sel.dispatchEvent(new Event('change'));
  }

  function focusArrival(tab) {
    var arrivalEl = document.getElementById(tab + '-guided-arrival');
    if (!arrivalEl) return;

    arrivalEl.scrollIntoView({ behavior: motionBehavior(), block: 'start' });

    if (typeof highlightElement === 'function') {
      highlightElement('#' + tab + '-guided-arrival');
      highlightElement('#' + tab + '-route-closure');
    }

    window.setTimeout(function() {
      var titleEl = document.getElementById(tab + '-closure-title');
      if (titleEl && typeof titleEl.focus === 'function') titleEl.focus({ preventScroll: true });
    }, 220);
  }

  function openInstitutionalRoute(ctx) {
    if (!ctx || !ctx.tab) return;

    runtimeState.lensShock    = ctx.lensShock;
    runtimeState.configKey    = ctx.configKey;
    runtimeState.tab          = ctx.tab;
    runtimeState.modelShockKey = ctx.modelShockKey;

    if (typeof activateTab === 'function') activateTab(ctx.tab);
    setModelShock(ctx.tab, ctx.modelShockKey);

    var narrative = resolveNarrative(ctx);
    showGuidedArrival(ctx.tab, narrative);
    ensureClosureMount(ctx.tab);
    renderClosure(ctx.tab, narrative, ctx);

    window.setTimeout(function() { focusArrival(ctx.tab); }, 80);
  }

  function bindLentesBridge() {
    // Fase de captura: se adelanta al listener delegado de initLentes()
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.lentes-model-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      openInstitutionalRoute(readLentesContext(btn));
    }, true);
  }

  function syncLocale() {
    if (document.documentElement.lang === 'es') {
      document.documentElement.lang = 'es-ES';
    }
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        window.Chart && Chart.defaults) {
      Chart.defaults.animation = false;
    }
  }

  function init() {
    syncLocale();
    bindLentesBridge();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
