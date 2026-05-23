/* ========== NAVIGATION CENTER ========== */
/* Brújula Pedagógica · Centro de Navegación Institucional · MacroLab */

(function () {
'use strict';

/* ---- Gospel data (sync with /data/navigation-center-config.json) ---- */
const NC = {
  pedagogicQuestions: [
    {
      id: 'q1', number: 1,
      question: '¿Qué son instituciones macroeconómicas?',
      pedagogyGoal: 'Entender qué dimensiones institucionales importan',
      module: 'marco-institucional', timeMinutes: 5,
      outputType: 'Matriz conceptual + 16 configuraciones',
      learningOutcomes: [
        'Identificar 4 ejes del diseño institucional',
        'Enumerar 16 combinaciones posibles',
        'Conectar cada régimen a su lógica de gobernanza'
      ]
    },
    {
      id: 'q2', number: 2,
      question: '¿Cómo moldean el Phillips curve?',
      pedagogyGoal: 'Observar cómo el mismo shock produce trayectorias distintas bajo diferentes instituciones',
      module: 'lentes-institucionales', timeMinutes: 10,
      outputType: 'Gráficos tiempo real (4 regímenes simultáneos)',
      learningOutcomes: [
        'Trazar la cadena shock→institución→credibilidad→trayectoria',
        'Interpretar velocidades de convergencia distintas',
        'Leer gráficos de inflación, desempleo, credibilidad'
      ]
    },
    {
      id: 'q3', number: 3,
      question: '¿Cuánto varían en magnitud entre regímenes?',
      pedagogyGoal: 'Cuantificar diferencias endógenas: convergencia, velocidad, estanflación',
      module: 'comparador-phillips', timeMinutes: 15,
      outputType: 'Gráficos comparativos + tablas parámetros + índices',
      learningOutcomes: [
        'Comparar parámetros Phillips entre regímenes',
        'Calcular índice de "dolor" (divergencia acumulada)',
        'Explicar por qué PFULD converge lentamente a π_target=3.5%'
      ]
    },
    {
      id: 'q4', number: 4,
      question: '¿Validamos con la realidad histórica?',
      pedagogyGoal: 'Anclar teoría en episodios reales; reconocer mecanismos en datos',
      module: 'atlas-lentes', timeMinutes: 20,
      outputType: 'Narrativa + mecanismo + serie histórica + comparador simulado',
      learningOutcomes: [
        'Identificar régimen institucional en episodio real',
        'Explicar trayectoria observada por cadena institucional',
        'Distinguir "qué pasó" (Atlas) vs "¿qué hubiera pasado?" (Lentes/Comparador)'
      ]
    }
  ],

  modules: [
    { id: 'marco-institucional',    name: 'Marco Institucional',             icon: '📘', question: 'q1', estimatedTime: 5,  exportOptions: ['PNG', 'CSV'] },
    { id: 'lentes-institucionales', name: 'Lentes Institucionales',          icon: '🔬', question: 'q2', estimatedTime: 10, exportOptions: ['PNG', 'SVG', 'CSV'] },
    { id: 'comparador-phillips',    name: 'Comparador Phillips',             icon: '📊', question: 'q3', estimatedTime: 15, exportOptions: ['PNG', 'SVG', 'CSV', 'Excel', 'JSON', 'R-code', 'Python-code'] },
    { id: 'atlas-lentes',           name: 'Crónicas históricas',             icon: '📚', question: 'q4', estimatedTime: 20, exportOptions: ['PDF', 'CSV'] }
  ],

  glossary: {
    acronyms: {
      'ER':                    { full: 'Esquema de tipo de cambio',                              explanation: '¿El banco central permite fluctuación cambiaria o mantiene paridad fija?',                      pedagogyRole: 'Define cómo se transmiten shocks externos (pass-through)' },
      'BC':                    { full: 'Banco Central',                                           explanation: 'Autoridad monetaria responsable de mantener estabilidad de precios y credibilidad',             pedagogyRole: 'Institución clave determinante de ρ inicial' },
      'π':                     { full: 'Inflación observada',                                     explanation: 'Variación de precios agregada. Converge a π_target según credibilidad',                        pedagogyRole: 'Variable observada clave en Phillips curve',                          formula: 'π_t = π^e_t - α(u_t - u*)' },
      'π^e':                   { full: 'Expectativas de inflación',                               explanation: 'Creencias de agentes sobre inflación futura; anclan a π_target si ρ es alta',                   pedagogyRole: 'Nudo central de credibilidad institucional',                          formula: 'π^e = ρ·π_target + (1-ρ)·π_{t-1}' },
      'π_target':              { full: 'Inflación objetivo de equilibrio',                        explanation: 'Hacia donde converge la economía según configuración institucional. NO es meta política del BC', pedagogyRole: 'Varía por régimen: FCHR=2.0%, PFULD=3.5%, FULD=3.5%' },
      'u':                     { full: 'Tasa de desempleo',                                       explanation: 'Porcentaje de población económicamente activa sin empleo',                                       pedagogyRole: 'Variable stock que se recupera lentamente según credibilidad' },
      'u*':                    { full: 'Tasa natural de desempleo (NAIRU)',                       explanation: 'Desempleo de largo plazo consistente con π estable' },
      'ρ':                     { full: 'Credibilidad institucional',                              explanation: 'Grado en que agentes creen que BC mantendrá π cerca de π_target',                               pedagogyRole: 'Variable central de cadena institucional; determina anclaje de expectativas', formula: 'ρ_t = ρ_{t-1} - λ·|π_t - π_target|' },
      'ρ_init':                { full: 'Credibilidad inicial del régimen',                        explanation: 'Punto de partida antes del shock. FCHR: 0.90, FULD: 0.50, PFULD: 0.35' },
      'α':                     { full: 'Pendiente Phillips',                                      explanation: 'Sensibilidad de π a desviaciones de u respecto u*. FIJO por régimen.',                          pedagogyRole: 'Determina cuánto presiona la brecha de desempleo sobre inflación' },
      'β':                     { full: 'Pass-through de tipo de cambio',                          explanation: 'Qué % de depreciación cambiaria se traslada a inflación doméstica',                             pedagogyRole: 'Vincula ER a dinámica inflacionaria; mecanismo de transmisión shocks externos' },
      'γ':                     { full: 'Inercialidad inflacionaria',                              explanation: 'Cuánto de π_t depende de π_{t-1} vs expectativas ancladas',                                     pedagogyRole: 'Determina persistencia de shocks' },
      'λ':                     { full: 'Tasa de aprendizaje de credibilidad',                     explanation: 'Velocidad con que ρ responde a desviaciones |π - π_target|',                                    pedagogyRole: 'Régimen-específica: Pegged=0.016, Uncredible=0.03, Credible=0.06' },
      'PFULD':                 { full: 'Pegged / (coord=No) / Uncredible / Discretion',           explanation: 'Tipo de cambio fijo, sin coordinación, baja credibilidad',                                      pedagogyRole: 'Estanflación periférica: π_target=3.5%, convergencia MUY lenta' },
      'FCHR':                  { full: 'Flexible / Coordination=Yes / High credibility / Rules',  explanation: 'Tipo de cambio flexible, coordinación fuerte, alta credibilidad, reglas fiscales',              pedagogyRole: 'Régimen moderno desarrollado: π_target=2.0%, convergencia RÁPIDA' },
      'FULD':                  { full: 'Flexible / Uncredible / Discretion',                      explanation: 'Tipo de cambio flexible, credibilidad media, sin reglas fiscales',                               pedagogyRole: 'Régimen emergente típico: π_target=3.5%, convergencia MEDIA' },
      'estanflación':          { full: 'ESTANcamiento + inFLACIÓN simultáneos',                  explanation: 'Inflación alta + desempleo alto persistentes bajo shocks de oferta con baja credibilidad',      pedagogyRole: 'Sello del régimen PFULD: ambas variables convergen lentamente' },
      'Phillips curve endógena': { full: 'Phillips curve cuya pendiente depende de instituciones', explanation: 'No hay una Phillips curve universal; cada régimen genera la suya',                              pedagogyRole: 'Concepto clave de Carlin & Soskice 2024; base de MacroLab' },
      'shock':                 { full: 'Perturbación exógena macroeconómica',                     explanation: 'Perturbación que altera el equilibrio. Tipos: demanda, oferta, términos de intercambio',        pedagogyRole: 'Punto de partida; parametrizable de -2pp a +2pp de brecha inicial' },
      'BCCh':                  { full: 'Banco Central de Chile',                                  explanation: 'Institución autónoma encargada de la política monetaria en Chile; fija la TPM y preserva la estabilidad de precios', pedagogyRole: 'Ejemplo empírico del régimen FCHR: alta credibilidad y reglas' },
      'NAIRU':                 { full: 'Non-Accelerating Inflation Rate of Unemployment',          explanation: 'Equivalente a u*: tasa de desempleo de largo plazo consistente con π estable. En Chile estimada entre 6.5-7.5%', pedagogyRole: 'Referencia para la brecha de desempleo u - u* en la Phillips curve' },
      'TPM':                   { full: 'Tasa de Política Monetaria',                              explanation: 'Tasa de interés que fija el BCCh como ancla del sistema financiero. Principal instrumento de política monetaria en Chile', pedagogyRole: 'Variable de política en el modelo IS-LM bajo régimen FCHR' }
    },
    concepts: {
      'pi_target_natural':        { definition: 'Inflación de equilibrio emergente de cada régimen', explanation: 'NO es meta política; es consecuencia de rigideces, credibilidad e instituciones', pedagogyRole: 'Central para entender por qué PFULD ≠ FCHR bajo el mismo shock' },
      'tipos_de_shock':           { definition: 'Perturbaciones clasificadas por origen', explanation: 'Demanda (caída inversión), oferta (alza petróleo), términos de intercambio (caída cobre). Cada tipo tiene canal de transmisión distinto.' },
      'credibilidad_institucional': { definition: 'Grado en que agentes creen que BC mantendrá π cerca de π_target', explanation: 'Cadena: Institución → ρ → π^e → Inercia → Velocidad convergencia', pedagogyRole: 'Concepto central del módulo Lentes Institucionales' },
      'pass_through':             { definition: 'Fracción de depreciación cambiaria que pasa a inflación doméstica', explanation: 'Δπ ≈ β × Δ(TC). Mayor en economías abiertas con poca credibilidad o tipo de cambio fijo.' },
      'brecha_de_desempleo':      { definition: 'u - u*: desviación respecto nivel natural', explanation: 'π = π^e - α(u - u*). Brecha negativa presiona π al alza.', pedagogyRole: 'Driver principal de la dinámica inflacionaria en el Comparador' },
      'velocidad_convergencia':   { definition: 'Trimestres para cerrar 50% de brecha inicial', explanation: 'FCHR: 2-3 trimestres. PFULD: 20+ trimestres. Determinada por α, λ y ρ_init.', pedagogyRole: 'Indicador central de comparación entre regímenes' },
      'caso_historico':           { definition: 'Episodio real que ejemplifica régimen institucional', explanation: 'Chile 1990-2010 (FCHR), Grecia 2010-2015 (PFULD), Turquía 2018-2023 (FULD)', pedagogyRole: 'Anclaje empírico en el Atlas de Lentes Institucionales' }
    }
  },

  recommendedRoutes: [
    {
      id: 'ruta-completa', name: 'Análisis Completo', timeMinutes: 50,
      description: 'Recorrido pedagógico de todas las preguntas',
      audience: ['profesor', 'investigador', 'estudiante-profundo'],
      steps: [
        { order: 1, module: 'marco-institucional',    action: 'Entiende 4 ejes y 16 regímenes',        timeMinutes: 5 },
        { order: 2, module: 'lentes-institucionales', action: 'Elige shock; observa 4 regímenes',       timeMinutes: 10 },
        { order: 3, module: 'comparador-phillips',    action: 'Expande a N regímenes; varía shock',     timeMinutes: 15 },
        { order: 4, module: 'atlas-lentes',           action: 'Busca caso histórico; valida',           timeMinutes: 20 }
      ]
    },
    {
      id: 'ruta-rapida', name: 'Análisis Rápido (Clase de Hoy)', timeMinutes: 15,
      description: 'Entrada por caso específico',
      audience: ['estudiante', 'docente-clase'],
      steps: [
        { order: 1, module: 'atlas-lentes',           action: 'Elige caso histórico',                  timeMinutes: 5 },
        { order: 2, module: 'lentes-institucionales', action: 'Simula episodio',                        timeMinutes: 10 }
      ]
    },
    {
      id: 'ruta-investigacion', name: 'Investigación Específica', timeMinutes: 25,
      description: 'Comparar 2+ países',
      audience: ['investigador', 'estudiante-tesis'],
      steps: [
        { order: 1, module: 'comparador-phillips', action: 'Selecciona 2 regímenes + shock', timeMinutes: 10 },
        { order: 2, module: 'atlas-lentes',        action: 'Busca casos reales',             timeMinutes: 10 },
        { order: 3,                                action: 'Exporta CSV + gráficos',         timeMinutes: 5 }
      ]
    },
    {
      id: 'ruta-perdido', name: 'Estoy Perdido', timeMinutes: 20,
      description: 'Introducción suave al laboratorio',
      audience: ['estudiante-primera-vez', 'visitante'],
      steps: [
        { order: 1, module: 'marco-institucional',    action: 'Lee 4 ejes institucionales',            timeMinutes: 5 },
        { order: 2, module: 'lentes-institucionales', action: 'Observa 4 regímenes con un shock',       timeMinutes: 10 },
        { order: 3,                                   action: 'Consulta glosario (Cmd+?)',              timeMinutes: 5 }
      ]
    },
    {
      id: 'ruta-sensibilidad', name: 'Análisis de Sensibilidad', timeMinutes: 20,
      description: '¿Qué pasa si varío parámetros?',
      audience: ['investigador', 'estudiante-avanzado'],
      steps: [
        { order: 1, module: 'comparador-phillips', action: 'Elige régimen base',              timeMinutes: 5 },
        { order: 2,                                action: 'Varía α, β, γ, λ',               timeMinutes: 10 },
        { order: 3,                                action: 'Exporta comparación',             timeMinutes: 5 }
      ]
    },
    {
      id: 'ruta-phillips', name: 'Phillips Curve Deep Dive', timeMinutes: 15,
      description: 'Entender Phillips sin contexto institucional previo',
      audience: ['economista', 'self-learner'],
      steps: [
        { order: 1, module: 'comparador-phillips', action: 'Compara pendientes α entre regímenes',           timeMinutes: 10 },
        { order: 2,                                action: 'Entiende fórmula π = π^e - α(u-u*)',            timeMinutes: 5 }
      ]
    }
  ]
};

/* ---- Mappings: SPA tab ID ↔ pedagogic module ID ---- */
/* Note: 'atlas' tab in SPA = "Atlas de shocks 2009-2026" — historical reference tool,
   NOT a Q step. The Q4 tab is 'atlas-lentes' ("Crónicas históricas"), embedded via iframe. */
const NC_TAB_TO_Q      = { institucional: 1, lentes: 2, comparador: 3, 'atlas-lentes': 4 };
const NC_TAB_TO_MODULE = {
  institucional:  'marco-institucional',
  lentes:         'lentes-institucionales',
  comparador:     'comparador-phillips',
  'atlas-lentes': 'atlas-lentes',           /* Q4 standalone: Atlas de Lentes Institucionales */
  atlas:          'atlas-shocks-referencia' /* reference tool, not a Q step */
};
const NC_MODULE_TO_TAB = Object.fromEntries(Object.entries(NC_TAB_TO_MODULE).map(([k, v]) => [v, k]));

/* ---- State ---- */
const _s = { isOpen: false, iTab: 'map', spaTab: null };

/* ---- DOM shortcut ---- */
const $id = id => document.getElementById(id);

/* ---- Escape HTML (never inject user input raw) ---- */
function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ========== SESSION STORAGE ========== */
const SESSION_KEY = 'macrolab-nav-sessions';

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || '[]'); }
  catch { return []; }
}

function saveSession(data) {
  let sessions = loadSessions();
  const moduleId = NC_TAB_TO_MODULE[_s.spaTab] || _s.spaTab || 'unknown';
  const mod = NC.modules.find(m => m.id === moduleId);
  sessions.push({ id: Date.now(), timestamp: new Date().toISOString(), page: moduleId, label: mod?.name || moduleId, data });
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  sessions = sessions.filter(s => new Date(s.timestamp).getTime() > cutoff).slice(-10);
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(sessions)); } catch { /* storage full */ }
}

/* ========== PANEL OPEN / CLOSE ========== */
function ncOpen() {
  _s.isOpen = true;
  const panel = $id('nav-center-panel');
  const overlay = $id('nav-center-overlay');
  if (panel) {
    panel.removeAttribute('hidden');
    panel.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => panel.classList.add('nc-open'));
  }
  if (overlay) {
    overlay.removeAttribute('hidden');
    requestAnimationFrame(() => overlay.classList.add('nc-visible'));
  }
  renderITab();
}

function ncClose() {
  _s.isOpen = false;
  const panel = $id('nav-center-panel');
  const overlay = $id('nav-center-overlay');
  if (panel) {
    panel.classList.remove('nc-open');
    panel.setAttribute('aria-hidden', 'true');
    setTimeout(() => { if (!_s.isOpen) panel.setAttribute('hidden', ''); }, 310);
  }
  if (overlay) {
    overlay.classList.remove('nc-visible');
    setTimeout(() => { if (!_s.isOpen) overlay.setAttribute('hidden', ''); }, 310);
  }
}

/* ========== INTERNAL TAB SWITCH ========== */
function switchITab(id) {
  _s.iTab = id;
  document.querySelectorAll('.nc-tab-btn').forEach(btn => {
    const active = btn.dataset.ncTab === id;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  renderITab();
}

function renderITab() {
  const el = $id('nav-center-content');
  if (!el) return;
  switch (_s.iTab) {
    case 'map':       el.innerHTML = renderMapTab();       break;
    case 'glossary':  el.innerHTML = renderGlossaryTab();  bindSearch();  break;
    case 'routes':    el.innerHTML = renderRoutesTab();    bindRoutes();  break;
    case 'export':    el.innerHTML = renderExportTab();    bindExport();  break;
    case 'structure': el.innerHTML = renderStructureTab(); break;
  }
}

/* ========== TAB: MAPA ========== */
function renderMapTab() {
  const curQ = NC_TAB_TO_Q[_s.spaTab];
  const isAtlasRef = _s.spaTab === 'atlas';
  let h = '<div class="nc-section">';

  h += `<div class="nc-orient-intro">
    <p>Esta brújula te orienta en MacroLab. Haz clic en las pestañas:</p>
    <ul class="nc-tabs-guide">
      <li><strong>📋 Mapa</strong>      <span>dónde estás y cómo se conectan los módulos</span></li>
      <li><strong>💬 Glosario</strong>  <span>busca π, FCHR, credibilidad, Phillips…</span></li>
      <li><strong>🚀 Rutas</strong>     <span>caminos según tu objetivo y tiempo</span></li>
      <li><strong>💾 Exportar</strong>  <span>descarga datos y retoma sesiones</span></li>
      <li><strong>🗂 Estructura</strong><span>visión global de todos los módulos</span></li>
    </ul>
  </div>`;

  /* Complementarity notice when on the reference atlas */
  if (isAtlasRef) {
    h += `<div class="nc-notice-box">
      <strong>Atlas de shocks ≠ Atlas de Lentes Institucionales</strong>
      <p>Esta página es el <em>repertorio histórico de shocks de Chile</em>: episodios, mecanismos y datos observados.</p>
      <p>Para ver cómo las instituciones moldean esos shocks, usa el <strong>módulo Q2 Lentes</strong> o el <strong>Q4 Atlas de Lentes</strong> (enlace externo).</p>
    </div>`;
  }

  /* Four-module complementarity chain */
  h += `<div class="nc-chain">
    <h3 class="nc-section-title">CADENA PEDAGÓGICA</h3>
    <p class="nc-chain-desc">Cuatro módulos con focos distintos y complementarios:</p>
    <div class="nc-chain-row">
      <div class="nc-chain-node${curQ===1?' nc-chain-active':''}">
        <span class="nc-chain-q">Q1</span>
        <strong>Marco</strong>
        <span>¿Qué son las instituciones?</span>
      </div>
      <div class="nc-chain-arrow">→</div>
      <div class="nc-chain-node${curQ===2?' nc-chain-active':''}">
        <span class="nc-chain-q">Q2</span>
        <strong>Lentes</strong>
        <span>¿Cómo moldean el shock?</span>
      </div>
      <div class="nc-chain-arrow">→</div>
      <div class="nc-chain-node${curQ===3?' nc-chain-active':''}">
        <span class="nc-chain-q">Q3</span>
        <strong>Comparador</strong>
        <span>¿Cuánto varían?</span>
      </div>
      <div class="nc-chain-arrow">→</div>
      <div class="nc-chain-node${_s.spaTab==='atlas-lentes'||(!_s.spaTab&&window.macrolarCurrentModule==='atlas-lentes')?' nc-chain-active':''}">
        <span class="nc-chain-q">Q4</span>
        <strong>Crónicas</strong>
        <span>¿Qué dice la historia?</span>
      </div>
    </div>
    <div class="nc-chain-ref">
      <span class="nc-chain-ref-icon">📚</span>
      <span><strong>Atlas de shocks</strong> — repertorio histórico; punto de entrada opcional, no es un paso Q</span>
    </div>
  </div>`;

  h += '<h3 class="nc-section-title" style="margin-top:.5rem">LAS 4 PREGUNTAS EN DETALLE</h3>';

  if (curQ) {
    h += `<div class="nc-current-banner">Estás en: <strong>PREGUNTA ${curQ} de 4</strong></div>`;
  } else if (isAtlasRef) {
    h += '<div class="nc-current-banner nc-banner-ref">Estás en: <strong>Atlas de shocks</strong> — herramienta de referencia histórica</div>';
  } else {
    h += '<div class="nc-current-banner nc-banner-neutral">Navega a un módulo pedagógico para ver tu posición.</div>';
  }

  NC.pedagogicQuestions.forEach(q => {
    const active = q.number === curQ;
    h += `<div class="nc-q-card${active ? ' nc-q-active' : ''}">
      <div class="nc-q-num">Q${q.number}</div>
      <div class="nc-q-body">
        <strong class="nc-q-question">${esc(q.question)}</strong>
        <p class="nc-q-goal">${esc(q.pedagogyGoal)}</p>
        <div class="nc-q-chips">
          <span class="nc-chip">⏱ ${q.timeMinutes} min</span>
          <span class="nc-chip nc-chip-muted">${esc(q.outputType)}</span>
        </div>`;
    if (active) {
      h += '<ul class="nc-outcomes">';
      q.learningOutcomes.forEach(lo => { h += `<li>✓ ${esc(lo)}</li>`; });
      h += '</ul>';
    }
    h += '</div></div>';
  });

  h += '<div class="nc-time-total">⏱ Ruta completa: <strong>50 minutos</strong></div>';
  h += '</div>';
  return h;
}

/* ========== TAB: GLOSARIO ========== */
function renderGlossaryTab() {
  return `<div class="nc-section">
    <input type="search" id="nc-search-input" class="nc-search-input"
      placeholder="Buscar: inflación, Phillips, ρ, FCHR…" autocomplete="off" aria-label="Buscar en el glosario">
    <div id="nc-search-out" aria-live="polite"></div>
    <div id="nc-glossary-quick">
      <h4 class="nc-section-subtitle">SIGLAS FRECUENTES</h4>
      <ul class="nc-quick-terms">
        <li><strong>π</strong> — Inflación observada</li>
        <li><strong>u</strong> — Tasa de desempleo</li>
        <li><strong>ρ</strong> — Credibilidad institucional</li>
        <li><strong>α</strong> — Pendiente Phillips</li>
        <li><strong>BC</strong> — Banco Central</li>
        <li><strong>FCHR</strong> — Flexible / Coord. alta / Alta credibilidad / Reglas</li>
        <li><strong>PFULD</strong> — Pegged / Sin coord. / Poco creíble / Discrecional</li>
        <li><strong>FULD</strong> — Flexible / Poco creíble / Discrecional</li>
      </ul>
    </div>
  </div>`;
}

function bindSearch() {
  const inp = $id('nc-search-input');
  if (!inp) return;
  inp.addEventListener('input', () => renderSearchResults(inp.value));
  setTimeout(() => inp.focus(), 50);
}

function renderSearchResults(query) {
  const out = $id('nc-search-out');
  const quick = $id('nc-glossary-quick');
  if (!out) return;
  const q = query?.trim() || '';
  if (!q) {
    out.innerHTML = '';
    if (quick) quick.style.display = '';
    return;
  }
  if (quick) quick.style.display = 'none';
  const results = searchGlossary(q);
  if (!results.length) {
    out.innerHTML = `<p class="nc-no-results">Sin resultados para "<em>${esc(q)}</em>". Intenta con π, u, α, FCHR, Phillips…</p>`;
    return;
  }
  let h = '<div class="nc-results">';
  results.forEach((item, i) => {
    const bodyId = `nc-term-body-${i}`;
    h += `<div class="nc-term">
      <button class="nc-term-hdr" aria-expanded="false" aria-controls="${bodyId}">
        <strong>${esc(item.displayKey)}</strong>${item.full ? ` — <em>${esc(item.full)}</em>` : ''}
      </button>
      <div class="nc-term-body" id="${bodyId}" hidden>
        ${item.explanation ? `<p>${esc(item.explanation)}</p>` : ''}
        ${item.definition  ? `<p>${esc(item.definition)}</p>`  : ''}
        ${item.pedagogyRole ? `<p class="nc-pedagogy"><em>Pedagogía: ${esc(item.pedagogyRole)}</em></p>` : ''}
        ${item.formula  ? `<p class="nc-formula"><code>${esc(item.formula)}</code></p>`  : ''}
      </div>
    </div>`;
  });
  h += '</div>';
  out.innerHTML = h;
  /* bind accordion after render */
  out.querySelectorAll('.nc-term-hdr').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = document.getElementById(btn.getAttribute('aria-controls'));
      if (!body) return;
      const open = body.hidden;
      body.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('nc-term-expanded', open);
    });
  });
}

function searchGlossary(query) {
  const lower = query.toLowerCase();
  const results = [];
  Object.entries(NC.glossary.acronyms || {}).forEach(([key, val]) => {
    if ([key, val.full || '', val.explanation || ''].join(' ').toLowerCase().includes(lower)) {
      results.push({ ...val, displayKey: key, type: 'acronym' });
    }
  });
  Object.entries(NC.glossary.concepts || {}).forEach(([key, val]) => {
    const dk = key.replace(/_/g, ' ');
    if ([dk, val.definition || '', val.explanation || ''].join(' ').toLowerCase().includes(lower)) {
      results.push({ ...val, displayKey: dk, type: 'concept' });
    }
  });
  results.sort((a, b) => (b.displayKey.toLowerCase() === lower ? 1 : 0) - (a.displayKey.toLowerCase() === lower ? 1 : 0));
  return results.slice(0, 6);
}

/* ========== TAB: RUTAS ========== */
function renderRoutesTab() {
  let h = '<div class="nc-section"><h3 class="nc-section-title">RUTAS SEGÚN TU OBJETIVO</h3>';
  NC.recommendedRoutes.forEach(route => {
    const firstWithModule = route.steps.find(s => s.module);
    h += `<div class="nc-route-card">
      <div class="nc-route-hdr">
        <strong class="nc-route-name">${esc(route.name)}</strong>
        <span class="nc-chip">⏱ ${route.timeMinutes} min</span>
      </div>
      <p class="nc-route-desc">${esc(route.description)}</p>
      <p class="nc-route-for">Para: ${esc(route.audience.join(' · '))}</p>
      <ol class="nc-route-steps">
        ${route.steps.map(s => `<li>${esc(s.action)}${s.timeMinutes ? ` <span class="nc-step-time">(${s.timeMinutes} min)</span>` : ''}</li>`).join('')}
      </ol>
      ${firstWithModule ? `<button class="nc-start-btn action-button" data-module="${esc(firstWithModule.module)}" data-route="${esc(route.id)}">Empezar →</button>` : ''}
    </div>`;
  });
  h += '</div>';
  return h;
}

function bindRoutes() {
  document.querySelectorAll('.nc-start-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = NC_MODULE_TO_TAB[btn.dataset.module];
      saveSession({ type: 'route', routeId: btn.dataset.route });
      if (tabId && typeof activateTab === 'function') {
        ncClose();
        activateTab(tabId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

/* ========== TAB: EXPORTAR ========== */
function renderExportTab() {
  const modId = NC_TAB_TO_MODULE[_s.spaTab];
  const mod = NC.modules.find(m => m.id === modId);
  const fmts = mod?.exportOptions || [];
  const sessions = loadSessions().slice(-5).reverse();

  let h = '<div class="nc-section"><h3 class="nc-section-title">EXPORTAR ANÁLISIS ACTUAL</h3>';
  if (fmts.length) {
    h += `<h4 class="nc-section-subtitle">Formatos disponibles${mod ? ' — ' + esc(mod.name) : ''}</h4>
    <div class="nc-export-grid">
      ${fmts.map(f => `<button class="nc-export-btn" data-format="${esc(f)}">↓ ${esc(f)}</button>`).join('')}
    </div>`;
  } else {
    h += '<p class="nc-muted">Navega a Marco, Lentes, Comparador o Atlas para ver las opciones de exportación.</p>';
  }

  h += '<h4 class="nc-section-subtitle" style="margin-top:1.4rem">Sesiones guardadas</h4>';
  if (sessions.length) {
    h += '<ul class="nc-sessions">';
    sessions.forEach(s => {
      const d = new Date(s.timestamp).toLocaleDateString('es-CL');
      const tabId = NC_MODULE_TO_TAB[s.page] || '';
      h += `<li class="nc-session">
        <span class="nc-session-lbl">${esc(s.label || s.page)} <em class="nc-session-date">${d}</em></span>
        ${tabId ? `<button class="nc-session-goto" data-tab="${esc(tabId)}">Retomar</button>` : ''}
      </li>`;
    });
    h += '</ul>';
  } else {
    h += '<p class="nc-muted">No hay sesiones guardadas. Usa las rutas recomendadas para registrar tu recorrido.</p>';
  }
  h += '</div>';
  return h;
}

function bindExport() {
  document.querySelectorAll('.nc-export-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      /* Each module implements its own export handler listening to this event */
      window.dispatchEvent(new CustomEvent('macrolab-export', {
        detail: { format: btn.dataset.format, module: _s.spaTab }
      }));
    });
  });
  document.querySelectorAll('.nc-session-goto').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      if (tabId && typeof activateTab === 'function') {
        ncClose();
        activateTab(tabId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

/* ========== TAB: ESTRUCTURA ========== */
function renderStructureTab() {
  const DESCS = {
    'marco-institucional':    '4 ejes institucionales · 16 configuraciones posibles · Matriz conceptual',
    'lentes-institucionales': '4 regímenes bajo el mismo shock · Gráficos en tiempo real',
    'comparador-phillips':    'Parámetros comparados · Índice de dolor · Tablas Phillips',
    'atlas-lentes':           'Episodios reales + mecanismo institucional + comparador simulado'
  };
  const isOnAtlas = _s.spaTab === 'atlas';

  let h = '<div class="nc-section"><h3 class="nc-section-title">ESTRUCTURA DE LA PLATAFORMA</h3>';

  /* --- Category 1: pedagogic Q chain --- */
  h += '<h4 class="nc-section-subtitle">Cadena pedagógica Q1 → Q4</h4>';
  h += '<div class="nc-modules">';
  NC.modules.forEach(m => {
    const active = NC_TAB_TO_MODULE[_s.spaTab] === m.id;
    const q = NC.pedagogicQuestions.find(pq => pq.id === m.question);
    h += `<div class="nc-module${active ? ' nc-module-active' : ''}">
      <div class="nc-module-icon">${m.icon}</div>
      <div class="nc-module-info">
        ${q ? `<span class="nc-q-badge">Q${q.number}</span>` : ''}
        <strong>${esc(m.name)}</strong>
        <p>${DESCS[m.id] || ''}</p>
        <div class="nc-module-meta">
          <span class="nc-chip">⏱ ${m.estimatedTime} min</span>
          <span class="nc-chip nc-chip-muted">${esc(m.exportOptions.slice(0, 3).join(', '))}</span>
        </div>
      </div>
    </div>`;
  });
  h += '</div>';

  /* --- Category 2: reference tool --- */
  h += '<h4 class="nc-section-subtitle" style="margin-top:.75rem">Herramienta de referencia</h4>';
  h += `<div class="nc-ref-block${isOnAtlas ? ' nc-module-active' : ''}">
    <div class="nc-ref-block-icon">📚</div>
    <div class="nc-ref-block-info">
      <strong>Atlas de shocks 2009–2026</strong>
      <p>Repertorio histórico de shocks en Chile: episodios reales, mecanismos y datos observados. No es un paso Q — es punto de entrada y ancla empírica opcional.</p>
      <div class="nc-module-meta" style="margin-top:.35rem">
        <span class="nc-chip">referencia</span>
        <span class="nc-chip nc-chip-muted">Historia real · datos observados</span>
      </div>
    </div>
  </div>`;

  h += `<div class="nc-flow">
    <h4 class="nc-section-subtitle">FLUJO RECOMENDADO</h4>
    <div class="nc-flow-line">📘 Marco → 🔬 Lentes → 📊 Comparador → 📚 Crónicas históricas</div>
    <div class="nc-flow-sub">Q1 → Q2 → Q3 → Q4 &nbsp;·&nbsp; <strong>50 minutos total</strong><br>
      <span style="font-size:.72rem">📚 Atlas de shocks: úsalo como referencia en cualquier momento</span>
    </div>
  </div></div>`;
  return h;
}

/* ========== BUTTON LABEL ========== */
function updateBtnLabel() {
  const btn = $id('nav-center-btn');
  if (!btn) return;
  const q = NC_TAB_TO_Q[_s.spaTab];
  btn.innerHTML = q
    ? `<span class="nc-btn-icon">?</span><span class="nc-btn-text">Ayuda</span><span class="nc-btn-badge">Q${q} / 4</span>`
    : `<span class="nc-btn-icon">?</span><span class="nc-btn-text">Ayuda</span>`;
  btn.setAttribute('title', q
    ? `Haz clic para orientarte en MacroLab — estás en Q${q} de 4 (Cmd+?)`
    : 'Haz clic para orientarte en MacroLab (Cmd+?)');
  btn.setAttribute('aria-label', q
    ? `Ayuda y navegación — MacroLab Q${q} de 4`
    : 'Ayuda y navegación — MacroLab');
}

/* ========== SPA TAB TRACKING ========== */
function trackSpaTab(tabId) {
  _s.spaTab = tabId;
  updateBtnLabel();
  if (_s.isOpen) renderITab();
}

/* ========== INIT ========== */
function navCenterInit() {
  if (window.self !== window.top) return; /* inside iframe — skip to avoid duplicate button */
  /* Detect current active SPA tab; fallback to page-level override for standalones */
  const activePanel = document.querySelector('.tab-panel.active');
  if (activePanel) {
    trackSpaTab(activePanel.id);
  } else if (window.macrolarCurrentModule) {
    trackSpaTab(window.macrolarCurrentModule);
  }

  /* Track SPA navigation (no-op on standalone pages) */
  document.querySelectorAll('.tab-button[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => trackSpaTab(btn.dataset.tab));
  });

  /* Hotkey: Cmd+? / Ctrl+? */
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === '?') { e.preventDefault(); _s.isOpen ? ncClose() : ncOpen(); }
    if (e.key === 'Escape' && _s.isOpen) ncClose();
  });

  /* Floating button */
  const navBtn = $id('nav-center-btn');
  if (navBtn) navBtn.addEventListener('click', () => _s.isOpen ? ncClose() : ncOpen());

  /* Close button + overlay */
  const closeBtn = $id('nav-center-close');
  if (closeBtn) closeBtn.addEventListener('click', ncClose);
  const overlay = $id('nav-center-overlay');
  if (overlay) overlay.addEventListener('click', ncClose);

  /* Internal tab buttons */
  document.querySelectorAll('.nc-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchITab(btn.dataset.ncTab));
  });

  updateBtnLabel();
}

/* ---- Startup ---- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', navCenterInit);
} else {
  navCenterInit();
}

})();
