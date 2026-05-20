# DÍA 3: Checklist de Validación

**Fecha:** 2026-05-21  
**Rama:** `claude/expand-pilot-chronicles-cHPL2`

---

## Componentes entregados

| Componente | Descripción | Validación | Status |
|---|---|---|---|
| `content/cronicas-registry.es-ES.js` | institutionalLayer fusionado (5 crónicas × 8 campos) | `node -e` → 5 OK, 8 campos c/u | ✓ |
| `narrative-layer.js` | `buildInstitutionalLensesHtml()` + inyección en `closureHtml()` | `node -c` sin errores | ✓ |
| `narrative-layer.css` | Estilos `.il-lenses`, `.il-grid`, `.il-panel*`, `.il-secondary` | Sin errores CSS | ✓ |
| `scripts/generate-atlas-taxonomy.js` | Genera `atlas-taxonomy.json` desde institutionalLayer | `node -c` + ejecución OK | ✓ |
| `data/atlas-taxonomy.json` | 5 crónicas × 5 categorías taxonómicas | 5/5 crónicas, 5 campos c/u | ✓ |
| `atlas-lentes-institucionales.html` | `INSTITUTIONAL_LAYERS` const + detalle expandible en `showDetail()` | Sintaxis JS válida | ✓ |

---

## institutionalLayer en cronicas-registry.es-ES.js

| Crónica | Campos | Status |
|---|---|---|
| `turkey_2018_2023` | 8/8 | ✓ |
| `argentina_convertibility` | 8/8 | ✓ |
| `chile_2008_2009` | 8/8 | ✓ |
| `noruega_2020` | 8/8 | ✓ |
| `grecia_2010_2015` | 8/8 | ✓ |
| `chile_2021_2024` | — (pendiente Día 4+) | ○ |
| `argentina_2020` | — (pendiente Día 4+) | ○ |
| `suecia_1994_1998` | — (pendiente Día 4+) | ○ |

---

## Taxonomía generada (atlas-taxonomy.json)

| Crónica | shockType | exchangeRegime | bcAutonomy | fiscalSpace | credibilityOutcome |
|---|---|---|---|---|---|
| turkey_2018_2023 | shock_politico_sobre_bc | flotacion_administrada | bc_autonomia_erosionada | espacio_fiscal_moderado | desanclaje_persistente |
| argentina_convertibility | fx_capital_flight | ancla_cambiaria_rigida | bc_sin_discrecion | espacio_limitado_por_regimen | colapso_del_regimen |
| chile_2008_2009 | shock_commodity | flotacion_cambiaria | bc_autonomo_con_it | espacio_amplio_con_buffer | expectativas_ancladas |
| noruega_2020 | shock_pandemia_o_dual | flotacion_cambiaria | bc_autonomo_con_it | espacio_amplio_con_buffer | expectativas_ancladas |
| grecia_2010_2015 | shock_fiscal_externo | union_monetaria | bc_ausente_union_monetaria | sin_espacio_bajo_condicionalidad | espiral_contraccionista |

---

## Cómo funciona en el simulador (narrative-layer.js)

Cuando el usuario abre una ruta editorial con `cronicaKey` que tiene institutionalLayer:

1. `closureHtml()` llama a `buildInstitutionalLensesHtml(narrative.cronicaKey)`
2. Si `CRONICAS[cronicaKey].institutionalLayer` existe, renderiza sección `<section class="il-lenses">`
3. La sección muestra 4 paneles principales: Institución, Mecanismo, Variables afectadas, Feedback Loop, Viabilidad
4. Un `<details>` expandible muestra: Incidencia, Evidencia discriminante, Límite MacroLab

---

## Cómo funciona en el Atlas (atlas-lentes-institucionales.html)

- `INSTITUTIONAL_LAYERS` const contiene los 8 campos para las 5 crónicas piloto
- `showDetail(id)` lee `INSTITUTIONAL_LAYERS[c.id]` y renderiza sección "Lentes institucionales"
- Si la crónica no tiene institutionalLayer (chile_2021_2024, argentina_2020, suecia), la sección simplemente no aparece
- Sección principal: 4 paneles (institución, mecanismo, feedbackLoop, policyFeasibility)
- `<details>` expandible: incidencia, evidencia discriminante, límite

---

## Próximos pasos para Pável

1. **Verificación visual:** Abre `atlas-lentes-institucionales.html` en navegador
   - Click en "Ver detalle" en una de las 5 crónicas piloto → debe aparecer sección "Lentes institucionales"
   - Verifica que el `<details>` expandible funcione
   
2. **Verificación en simulador:** Abre `index.html`, ve a Lentes Institucionales, selecciona shock + config para Turquía, Noruega o Grecia → el Cierre Editorial debe mostrar la sección "Lentes institucionales" encima de la Crónica canónica

3. **Revisión taxonómica:** Verifica `data/atlas-taxonomy.json`:
   - ¿Las categorías de `exchangeRegime` coinciden con lo esperado para Turquía? (flotacion_administrada ✓)
   - ¿Las categorías de `fiscalSpace` para Grecia? (sin_espacio_bajo_condicionalidad ✓)
   - Ajusta heurísticas en `scripts/generate-atlas-taxonomy.js` si necesitas y re-ejecuta `node scripts/generate-atlas-taxonomy.js`

4. **Si todo OK:** Mergear a `main` y avanzar a Día 4 (las 3 crónicas sin institutionalLayer)

5. **Si hay ajustes necesarios:** Comunicar para iterar antes del merge

---

## Regenerar taxonomía

Si se añaden institutionalLayer a más crónicas:

```bash
node scripts/generate-atlas-taxonomy.js
# Actualiza data/atlas-taxonomy.json automáticamente
```
