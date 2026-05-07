// assets/lentes.js — conector de vitrina (Sprint 2)
// Conecta .lentes-vitrine-btn con la pestaña #lentes pre-cargada.
// CELDAS, FAMILIA, SHOCKS, CONFIGS, DIM_RESUMEN, EJEMPLOS migrados o eliminados.
(function() {
  'use strict';

  function init() {
    document.querySelectorAll('.lentes-vitrine-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (typeof activateTab === 'function') activateTab('lentes');
        var s = document.getElementById('lentes-shock');
        var c = document.getElementById('lentes-config');
        if (s) s.value = btn.getAttribute('data-vitrine-shock');
        if (c) c.value = btn.getAttribute('data-vitrine-config');
        if (typeof renderLentesCompare === 'function') renderLentesCompare();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
