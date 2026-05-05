# CLAUDE.md · MacroLab Shock Simulator

## Contexto del proyecto
Simulador pedagógico de macroeconomía para Chile (Macroeconomía II).
Sitio estático: index.html + script.js + styles.css. Sin frameworks. Sin bundler.
Dependencia externa única: Chart.js (CDN).

## Arquitectura
- SPA: todas las ventanas son <section class="tab-panel"> dentro de index.html
- Navegación: función activateTab(target) en script.js línea ~301
- Tabs: <button class="tab-button" data-tab="ID"> en el <nav class="tabs">
- Shocks existentes: objeto ATLAS_SHOCKS (script.js línea ~159)
- Cálculo: funciones calcISLM, calcISLMBP, calcOADA — NO TOCAR

## Sprint activo: módulo "Lentes institucionales"
Ventana nueva que compara cómo el mismo shock produce trayectorias distintas
según el marco institucional (4 configuraciones × 8 shocks = 32 celdas narrativas).

### ID de la nueva sección
id="lentes" (verificado: no colisiona con ningún ID existente)

### Archivos a modificar
1. index.html — agregar <section id="lentes"> y botón en <nav>
2. script.js — agregar datos INST_CONFIGS, INST_RESULTS y funciones de render
3. styles.css — agregar variables --persist-* y clases .lentes-*

### Archivos que NO deben tocarse en este sprint
- Las funciones calcISLM, calcISLMBP, calcOADA
- Los objetos ISLM_DEFAULTS, ISLMBP_DEFAULTS, OADA_DEFAULTS
- Los objetos ISLM_SHOCKS, ISLMBP_SHOCKS, OADA_SHOCKS
- El bloque DOMContentLoaded / función init()
- Cualquier ID que empiece por islm-, islmbp-, oada-, tablero-

### Convenciones de código del proyecto
- JavaScript vanilla sin clases ES6 (funciones nombradas)
- CSS con variables en :root, sin preprocesadores
- Sin innerHTML sobre input del usuario (todo contenido es estático en los datos)
- Comentarios de sección con: /* ========== NOMBRE ========== */
- Nomenclatura de IDs: kebab-case (lentes-shock, lentes-config, lentes-result)

## Variables CSS disponibles para reutilizar
--navy, --bg, --card, --line, --text, --muted, --accent, --accent-soft,
--green, --orange, --red, --purple, --blue, --shadow

## Clases CSS reutilizables confirmadas
.card, .compact-card, .atlas-card, .atlas-field,
.chip-rule, .chip-data, .chip-warning,
.home-grid, .tab-panel, .section-subhead, .notice-box

## Restricciones pedagógicas (no negociables)
- El módulo es narrativo, no numérico
- Cero sliders nuevos
- Lenguaje de dirección e intensidad relativa, nunca cifras duras
- Cada tarjeta: máximo 5 campos visibles
- Siempre incluir advertencia pedagógica por celda
