# MacroLab · Bitácora de sprints

Registro de los ciclos de mejora aplicados tras la versión base v1.7. Tono académico neutro. Cada entrada declara objetivo, costuras cerradas, archivos modificados, criterios verificados y riesgos residuales identificados.

---

## Sprint 1 · Capa narrativa editorial (aterrizaje + cierre)

**Fecha de merge:** commit `2c9c740` · 2026-05

**Objetivo.** Agregar una capa editorial sobre el flujo Lentes → modelo formal: cápsula de aterrizaje que contextualiza la llegada al simulador, bloque de cierre con hipótesis, filtro institucional, evidencia y advertencia de cautela, y botón de retorno a Lentes. Crear el registro canónico de rutas (`route-registry.es-ES.js`) y el motor de renderizado (`narrative-layer.js` + `narrative-layer.css`). Establecer `#lentes` (top-nav) como punto canónico del módulo institucional.

**Costuras del Diagnóstico v2.0 cerradas.**
- T1: el flujo Lentes → modelo formal tiene cápsula de aterrizaje visible.
- T2: el cierre editorial aparece tras el gráfico formal.
- T3: el botón de retorno devuelve a Lentes con contexto preservado.
- T4: el locale del documento se corrige a `es-ES`.

**Archivos creados.**
- `content/route-registry.es-ES.js` — cinco rutas editoriales con arrivalTitle, hipótesis, filtro, evidencia, advertencia y texto de retorno.
- `narrative-layer.js` — motor de renderizado: resolución de ruta, cápsula de aterrizaje, bloque de cierre, botón de retorno.
- `narrative-layer.css` — estilos de cápsula y cierre (`.route-closure-card`, `.route-closure-grid`, `.route-closure-actions`).

**Archivos modificados.**
- `index.html` — scripts nuevos en footer; sección `#lentes-explorador` con vitrina inicial.
- `assets/lentes.js` — conector de vitrina; CTA de OA-DA apuntado a `#lentes-explorador`.

**Criterios verificados.**
- Navegación Lentes → OA-DA → cierre → retorno funcional en escritorio.
- Cápsula visible al llegar al modelo desde el botón del grid comparativo.
- Bloque de cierre renderizado con los seis campos (hipótesis, filtro, límites, evidencia inmediata, evidencia posterior, cautela).

**Riesgos residuales.**
- Las crónicas con fuentes no estaban en la interfaz (pendiente Sprint 2).
- El botón de retorno volvía a la tarjeta única, no al grid comparativo (pendiente Sprint 2).
- El link "Lectura institucional" en OA-DA continuaba apuntando al explorador paralelo (pendiente Sprint 4).

---

## Sprint 2 · Unificación editorial + crónicas con fuentes

**Fecha de merge:** commit `2a70afe` · 2026-05

**Objetivo.** Unificar los dos módulos "Lentes" del proyecto declarando `#lentes` (top-nav) como punto canónico. Migrar las crónicas canónicas con fuentes al registro `cronicas-registry.es-ES.js` y renderizarlas como bloque `<details>` colapsable dentro del cierre editorial. Transformar `#lentes-explorador` en una vitrina de tres tarjetas enlazadas al top-nav. Simplificar `assets/lentes.js` a conector de vitrina. Corregir el botón de retorno para usar `renderLentesCompare()`.

**Costuras del Diagnóstico v2.0 cerradas.**
- T5: el cierre editorial incluye crónica con fuentes primarias verificables.
- T6: el botón de retorno lleva al grid comparativo de las cuatro configuraciones.
- T7: `#lentes-explorador` no opera como motor paralelo; es vitrina enlazada.

**Archivos creados.**
- `content/cronicas-registry.es-ES.js` — registro `window.MacroLabCronicasRegistryES` con cuatro crónicas canónicas: `chile_2021_2024`, `turkey_2018_2023`, `argentina_convertibility`, `chile_2008_2009`.

**Archivos modificados.**
- `content/route-registry.es-ES.js` — campo `cronicaKey` añadido a las cinco rutas.
- `narrative-layer.js` — lectura de `CRONICAS`; funciones `isSafeUrl` y `buildCronicaHtml`; bloque `<details>` en `closureHtml`; `renderLentesCompare` en retorno; `setTimeout` de foco en `focusArrival`; `setModelShock` simplificado a solo `dispatchEvent('change')`.
- `narrative-layer.css` — estilos `.route-closure-cronica-*` con foco WCAG en enlaces.
- `assets/lentes.js` — reducido a conector de 22 líneas para `.lentes-vitrine-btn`.
- `index.html` — `#lentes-explorador` reescrito como vitrina de tres tarjetas; `#lentes-modal` eliminado; script `cronicas-registry.es-ES.js` añadido al footer.

**Criterios verificados.**
- Smoke test 1: `<details>` de crónica visible en cierre de petróleo+CHL con tres párrafos, caveat y fuentes con `target="_blank"`.
- Smoke test 2: botones de vitrina activan tab Lentes con shock+config pre-cargados y llaman `renderLentesCompare()`.
- Smoke test 3: botón de retorno lleva al grid de cuatro configuraciones.
- Smoke test 4: combinaciones sin `cronicaKey` no muestran placeholder.

**Riesgos residuales.**
- El link "Lectura institucional" en OA-DA (`<a class="lentes__cta">`) ya no tiene handler activo (pendiente Sprint 4).
- `assets/lentes.js` ya no maneja `a.lentes__cta`: degradación silenciosa si quedan instancias en el HTML.

---

## Sprint 3 · Manifiesto de datos + WCAG 2.2 AA + presupuesto CWV

**Fecha de merge:** commit `f70da33` · 2026-05-07

**Objetivo.** Cumplir tres compromisos operativos: (a) replicabilidad de datos vía JSON versionado y CSV documentado; (b) hardening de accesibilidad WCAG 2.2 nivel AA verificable; (c) presupuesto Core Web Vitals medible con Lighthouse.

**Costuras del Diagnóstico v2.0 cerradas.**
- Accesibilidad: skip link, `:focus-visible` global, `aria-live` en regiones dinámicas, `<label for>` en selectores de Lentes, `prefers-reduced-motion` en CSS y Chart.js.
- Performance: `defer` en `chart.js` y `script.js`, `preconnect` para CDN, `aspect-ratio` en canvas.
- Datos: manifiesto JSON + dos CSV con 16 años de series anuales, tarjeta de descarga en el Tablero, guía de replicación en `docs/`.

**Archivos creados.**
- `data/source-manifest.json` — metadata de 11 series con fuente, URL, unidad y cobertura.
- `data/series-anuales.csv` — 16 filas × 7 series desde `dashboardData` en `script.js`, redondeadas a 3 decimales.
- `data/series-anuales-l2.csv` — 16 filas × 4 series desde `dashboardL2`.
- `docs/wcag-checklist.md` — 15 criterios WCAG 2.2 AA verificados con herramienta y resultado.
- `docs/cwv-baseline.md` — tabla LCP/INP/CLS con interpretación de cada cambio de performance.
- `docs/data-replication.md` — guía de 4 pasos por serie (11 series) para regenerar los CSV.

**Archivos modificados.**
- `index.html` — skip link, `id="main"`, `preconnect cdn.jsdelivr.net`, `defer` en scripts, `<label for>` en selectores de Lentes, `aria-live` en siete regiones, tarjeta de descarga en `#tablero`.
- `styles.css` — `.skip-link`, `:focus-visible` global, neutralización del outline débil, `canvas { aspect-ratio }`, `@media (prefers-reduced-motion: reduce)`.
- `narrative-layer.js` — `syncLocale()` deshabilita `Chart.defaults.animation` con `prefers-reduced-motion`.

**Criterios verificados.**
- CSV con 17 líneas exactas (cabecera + 16 años) y valores coincidentes con `dashboardData`/`dashboardL2`.
- Skip link visible al pulsar Tab; outline accent en elementos interactivos.
- `defer` en `chart.js` y `script.js` sin errores de consola.

**Riesgos residuales.**
- La baseline de Lighthouse no fue medida en producción antes del sprint: las métricas "Antes Sprint 3" en `cwv-baseline.md` están marcadas como "no medido".
- `.persist-badge.media` (amarillo sobre blanco) tiene ratio de contraste ~2.3:1: elemento decorativo sin texto alternativo, no crítico pero pendiente de revisión.
- La navegación de tabs en móvil (scroll horizontal) no fue abordada: sigue siendo fricción alta para el perfil M1.

---

## Sprint 4 · Fix link OA-DA + mapa de fricción + metodología + bitácora

**Fecha de merge:** commit pendiente · 2026-05-07

**Objetivo.** Tres compromisos: (a) activar el link inactivo "Lectura institucional" en OA-DA reutilizando el handler de la vitrina; (b) versionar un mapa de fricción de usuarios sintéticos como artefacto de Nivel 2 de evidencia; (c) documentar la metodología de los tres niveles de evidencia y la bitácora completa de sprints.

**Costuras del Diagnóstico v2.0 cerradas.**
- El link "Lectura institucional" en OA-DA responde: cambia a `#lentes` con `shock="petroleo"`, `config="CHL"` y muestra el grid comparativo.
- No quedan instancias de `<a class="lentes__cta">` en el repositorio.

**Archivos creados.**
- `docs/synthetic-users-friction-map.md` — cinco perfiles sintéticos (E1, E2, A1, P1, M1), cláusula anti-overclaim, tabla resumen de severidades, plantilla de actualización iterativa. Versión 1.0.
- `docs/synthetic-users-method.md` — tres niveles de evidencia, justificación del Nivel 2, limitaciones del Nivel 2 frente al Nivel 3, protocolo recomendado con tabla de preguntas y herramientas.
- `docs/sprint-history.md` — este archivo.

**Archivos modificados.**
- `index.html` — `<a class="lentes__cta">` reemplazado por `<button class="route-btn lentes-vitrine-btn" data-vitrine-shock="petroleo" data-vitrine-config="CHL">`. Sin JS nuevo: reutiliza handler existente en `assets/lentes.js`.
- `README.md` — sección "Mapa de fricción y metodología" con punteros a los dos documentos nuevos.

**Criterios verificados.**
- Clic en "Leer este shock bajo cuatro configuraciones →" en OA-DA activa tab Lentes con petróleo+CHL y muestra grid comparativo.
- Ningún `<a class="lentes__cta">` en el repositorio.
- Cinco perfiles completos en el mapa de fricción con los seis campos por perfil.
- Cláusula anti-overclaim explícita en el mapa de fricción.
- Tabla resumen de severidades presente.
- Documento metodológico con los tres niveles y protocolo recomendado.

**Riesgos residuales.**
- Las hipótesis testeables del mapa de fricción no han sido validadas con usuarios reales: siguen siendo inferencias de Nivel 2 hasta que se aplique Nivel 3.
- La navegación de tabs en móvil sigue sin abordarse (arrastrado de Sprint 3).
- El texto de la cápsula de aterrizaje puede ser denso para uso en proyector (perfil A1, severidad media, sin cambio).
- No existe una vista consolidada de todas las rutas registradas (perfil P1, severidad media, sin cambio).
