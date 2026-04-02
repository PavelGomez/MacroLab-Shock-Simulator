# MacroLab Shock Simulator · Macroeconomía II · Profesor Pável Gómez · 2026

Versión publicable, estática y pedagógicamente reforzada del laboratorio web **MacroLab Shock Simulator**.

## Qué es

Aplicación web educativa para ordenar mecanismos macroeconómicos, comparar shocks y practicar lectura de coyuntura chilena usando tres lentes base:

- IS-LM
- IS-LM-BP
- OA-DA

La app está pensada como:

> **Laboratorio de análisis macro y evaluación de escenarios de coyuntura: una herramienta de aprendizaje para identificar mecanismos, interpretar shocks y explicar trayectorias plausibles del entorno económico chileno.**

## Alcance de esta versión

Esta versión incluye:

- pestaña **Inicio** con secuencia analítica detallada;
- pestaña **Instrucciones de uso** con errores frecuentes y tabla de ejemplos por tipo de shock;
- simulador **IS-LM** con shocks fiscales, monetarios y de expectativas;
- simulador **IS-LM-BP** con shocks externos, cambiarios, fiscales y monetarios;
- simulador **OA-DA** reforzado con capa de oferta agregada y nota de ajuste de mediano plazo;
- pestaña **Shocks y transmisión**;
- pestaña **Marco institucional · Chile 2026**;
- pestaña **Tablero Macro** con datos anuales 2010–2025;
- **Glosario ampliado**;
- diseño sobrio, responsive y publicable directamente en GitHub Pages.

## Stack

- HTML
- CSS
- JavaScript puro
- Chart.js vía CDN

## Archivos

- `index.html`
- `styles.css`
- `script.js`
- `README.md`

## Datos del Tablero Macro

La versión publicada usa la serie contenida en el archivo suministrado:

- `Data Macro Chile 2010-2025.xlsx`

Variables incluidas:

- crecimiento PIB real anual (%)
- inflación anual (%)
- tasa de desempleo (%)
- TPM promedio anual (%)
- tipo de cambio nominal promedio anual (CLP/USD)

Ventana temporal:

- 2010–2025

## Criterio de diseño

La app privilegia:

- robustez antes que sobreingeniería;
- claridad visual para proyección en clase;
- pedagogía con formalización mínima robusta;
- conexión entre modelos, instituciones y coyuntura;
- uso estático inmediato sin backend.

## Fuentes institucionales y de contexto usadas para la capa conceptual

Fuentes oficiales y de referencia utilizadas para orientar textos institucionales y el posicionamiento macro de la versión publicada:

- https://www.bcentral.cl/areas/politica-monetaria
- https://www.bcentral.cl/el-banco/gobierno-corporativo/funciones-del-banco
- https://www.bcentral.cl/contenido/-/detalle/ver-mas-preguntas-frecuentes-7-3
- https://www.bcentral.cl/contenido/-/detalle/ver-mas-preguntas-frecuentes-8-4
- https://www.hacienda.cl/areas-de-trabajo/presupuesto-nacional/estado-de-la-hacienda-publica/estado-de-la-hacienda-publica-2022/capitulo-2-politica-fiscal
- https://old.hacienda.cl/preguntas-frecuentes/deberes-y-funciones/en-que-consiste-la-regla-del-balance.html
- https://cfachile.cl/acerca-del-consejo/funciones-y-atribuciones
- https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-25539.html
- https://www.cmfchile.cl/educa/621/w3-article-49525.html
- https://www.fne.gob.cl/nosotros/fne/mision-institucional/
- https://www.tdlc.cl/atribuciones-del-tdlc/
- https://www.ine.gob.cl/institucional/plan-estrategico-2022-2026/mision-vision-institucional-y-vision-superior
- https://gpm.fen.uchile.cl/

## Instrucciones paso a paso para publicar en GitHub Pages

1. Crear un repositorio nuevo en GitHub.
2. Subir `index.html`, `styles.css`, `script.js` y `README.md` al directorio raíz.
3. Ir a **Settings**.
4. Ir a **Pages**.
5. En **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/root`
6. Guardar.
7. Esperar la publicación.
8. Abrir la URL pública.
9. Probar en desktop y en iPhone/Safari.
10. Si un cambio no se refleja, verificar que los archivos estén realmente en la rama publicada y hacer **hard refresh**.

## Nota pedagógica

MacroLab es una herramienta de aprendizaje, no de predicción. Simplifica relaciones macroeconómicas para entrenar lectura de mecanismos, comparación de escenarios y evaluación de trayectorias plausibles. No reemplaza análisis econométrico, proyecciones oficiales ni diagnóstico de coyuntura detallado.
