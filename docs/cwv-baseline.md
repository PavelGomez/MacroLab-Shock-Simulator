# Core Web Vitals – Baseline Sprint 3

Fecha: 2026-05-07  
URL de referencia: https://pavelgomez.github.io/MacroLab-Shock-Simulator/  
Herramienta: Lighthouse 12.x, modo escritorio (simulado), red 4G lenta.

> **Nota:** Las métricas "Antes Sprint 3" no fueron medidas formalmente antes de este sprint.
> Se marca "no medido" y se reporta la línea base post-sprint como referencia para sprints futuros.

## Resultados

| Métrica | Antes Sprint 3 | Después Sprint 3 | Presupuesto |
|---|---|---|---|
| LCP (Largest Contentful Paint) | no medido | ≤ 2.5 s (estimado) | ≤ 2.5 s |
| INP (Interaction to Next Paint) | no medido | ≤ 200 ms (estimado) | ≤ 200 ms |
| CLS (Cumulative Layout Shift) | no medido | ≤ 0.1 (estimado) | ≤ 0.1 |
| Performance score (Lighthouse) | no medido | ≥ 85 (estimado) | ≥ 85 |

## Cambios del Sprint 3 con impacto en CWV

### LCP
- `<script src="chart.js" defer>` elimina el bloqueo de parsing causado por Chart.js (era render-blocking). Impacto directo en LCP.
- `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>` reduce latencia de conexión al CDN de Chart.js.
- `<script src="script.js" defer>` mueve la inicialización del simulador al evento DOMContentLoaded, sin bloquear el render del HTML.

### INP
- Sin cambios en manejadores de eventos existentes. Los listeners del Sprint 3 (vitrina, skip link) son ligeros y no afectan INP.

### CLS
- `canvas { aspect-ratio: 16/9; max-width: 100%; }` reserva espacio visual para los canvas de Chart.js antes de que JavaScript los dibuje, eliminando saltos de layout. Las reglas más específicas con `height` explícito mantienen su tamaño; la regla general actúa como fallback para canvas sin altura fija.

## Verificación recomendada post-deploy

1. Ejecutar Lighthouse → Performance en modo escritorio sobre la URL de producción.
2. Registrar los valores reales de LCP, INP, CLS y Performance score en esta tabla.
3. Si LCP > 2.5 s: evaluar lazy-loading de Chart.js o preload del font.
4. Si CLS > 0.1: verificar tamaños de canvas en mobile vs. escritorio.
