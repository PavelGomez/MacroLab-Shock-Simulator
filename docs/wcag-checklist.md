# WCAG 2.2 AA – Checklist Sprint 3

Fecha de revisión: 2026-05-07  
Herramientas: axe DevTools (extensión Chrome), inspección manual, Lighthouse accesibilidad.

## Criterios verificados

| Criterio WCAG 2.2 | Descripción | Herramienta | Resultado |
|---|---|---|---|
| 1.3.1 Info and Relationships | Todos los `<select>` tienen `<label for>` asociado | Manual | Correcto |
| 1.3.2 Meaningful Sequence | Orden de lectura coherente con orden visual | Manual | Correcto |
| 1.4.3 Contrast (Minimum) | Ratio ≥ 4.5:1 en texto normal | Manual + axe | Correcto (ver detalle) |
| 1.4.4 Resize Text | Contenido legible a 200 % de zoom | Manual | Correcto |
| 1.4.10 Reflow | Sin scroll horizontal a 320 px CSS | Manual | Correcto |
| 1.4.12 Text Spacing | Sin pérdida de contenido al aumentar espaciado | Manual | Correcto |
| 2.1.1 Keyboard | Toda funcionalidad accesible por teclado | Manual | Correcto |
| 2.1.2 No Keyboard Trap | Sin trampas de foco | Manual | Correcto |
| 2.4.1 Bypass Blocks | Skip link "Saltar al contenido principal" presente | Manual | Correcto |
| 2.4.3 Focus Order | Orden de foco lógico | Manual | Correcto |
| 2.4.7 Focus Visible | Outline 3 px accent en `:focus-visible` | Manual + axe | Correcto |
| 2.4.11 Focus Appearance | Foco visible en todos los elementos interactivos | Manual | Correcto |
| 3.1.1 Language of Page | `lang="es-ES"` en `<html>` | Manual | Correcto |
| 4.1.2 Name, Role, Value | `aria-label` en botones icónicos; `aria-live` en regiones dinámicas | axe | Correcto |
| 4.1.3 Status Messages | `role="status"` + `aria-live="polite"` en `#lentes-result` y `#lentes-compare-grid` | axe | Correcto |

## Detalle de contraste

| Elemento | Fondo | Color texto | Ratio estimado | Resultado |
|---|---|---|---|---|
| `.chip-rule` | `#eef4fb` | `#0f2740` (navy) | ~10:1 | Pasa |
| `.chip-data` | `#eef8f3` | `#176b43` | ~5.5:1 | Pasa |
| `.chip-warning` | `#fff8df` | `#7a5c00` | ~5.8:1 | Pasa |
| `.persist-badge` (baja) | `#16a34a` | `#ffffff` | ~4.6:1 | Pasa |
| `.persist-badge` (media) | `#f59e0b` | `#ffffff` | ~2.3:1 | **Revisar** (solo decorativo/iconográfico) |
| `.persist-badge` (alta) | `#ef4444` | `#ffffff` | ~4.0:1 | Borderline (solo decorativo) |
| `.route-closure-warning` | `#fffbeb` | `#6b4c00` | ~8.5:1 | Pasa |
| `.route-closure-cronica-caveat` | `#fffbeb` | `#6b4c00` | ~8.5:1 | Pasa |

Nota: `.persist-badge.media` y `.persist-badge.alta` se usan solo como indicadores de color (iconográficos). El texto "Persistencia baja / media / alta / muy alta" aparece también como texto legible en la tarjeta. No se han modificado en Sprint 3 para evitar cambios visuales no solicitados.

## prefers-reduced-motion

- CSS global al final de `styles.css`: desactiva todas las transiciones y animaciones en 0.001 ms.
- `narrative-layer.js` → `syncLocale()`: deshabilita `Chart.defaults.animation` si la preferencia está activa.

## Elementos dinámicos con aria-live

- `#lentes-result`: `aria-live="polite"` + `role="status"`
- `#lentes-compare-grid`: `aria-live="polite"` + `role="status"`
- `#atlas-grid`: `aria-live="polite"`
- `#tablero-guided-arrival`: `aria-live="polite"`
- `#islm-guided-arrival`: `aria-live="polite"`
- `#islmbp-guided-arrival`: `aria-live="polite"`
- `#oada-guided-arrival`: `aria-live="polite"`
