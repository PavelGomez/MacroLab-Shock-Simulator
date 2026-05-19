# DIA_1_PROTOCOLO_COMPLETO.md

> Documento de referencia única para el módulo `institutionalLayer` del MacroLab Shock Simulator.  
> Versión: 2026-05-19 · Sprint: validate-institutional-layer

---

## Sección 1 — Propósito y alcance

El campo `institutionalLayer` añade una capa narrativa a cada crónica del registro `cronicas-registry.es-ES.js`. Su función pedagógica es mostrar cómo el mismo shock externo produce trayectorias distintas según el marco institucional vigente.

**Alcance de Día 1:** Construir y validar dos ejemplos canónicos (`argentina_convertibility`, `chile_2008_2009`) que servirán de plantilla para las crónicas restantes.

**Alcance de Día 2:** Fusionar los ejemplos validados a `cronicas-registry.es-ES.js` y construir las 6 crónicas restantes con el mismo esquema.

**Lo que NO se hace en Día 1:**
- No se toca `cronicas-registry.es-ES.js`
- No se crean crónicas adicionales
- No se modifican funciones de render ni el HTML

---

## Sección 2 — Estructura del campo `institutionalLayer`

Cada entrada en `institutionalLayer` contiene exactamente 8 campos:

| Campo | Tipo | Límite | Descripción |
|---|---|---|---|
| `institution` | string | 150 chars | Marco institucional específico al episodio |
| `mechanism` | string | 300 chars | Cadena causal: shock→variable→institución→expectativas |
| `affectedVariables` | array | 5 items | Variables afectadas; todas deben aparecer en `mechanism` |
| `feedbackLoop` | string | 200 chars | Cómo el mecanismo se retroalimenta |
| `policyFeasibility` | string | 200 chars | Qué políticas eran viables dado el marco institucional |
| `incidence` | string | 150 chars | Sobre quiénes recae el ajuste (sin cifras duras) |
| `discriminatingEvidence` | string | 250 chars | Números, fechas y fuentes verificables |
| `antiOverclaim` | string | 200 chars | Qué NO captura el análisis (redactar en negativo) |

**Schema formal:** `DIA_1_institutionalLayer_schema.json`

---

## Sección 3 — Reglas de contenido (no negociables)

### 3.1 Regla de consistencia `affectedVariables` ↔ `mechanism`
Cada string de `affectedVariables` debe aparecer **literalmente** (copia exacta) dentro del campo `mechanism`. La verificación es textual, no semántica.

### 3.2 Regla de lenguaje para `incidence`
Solo dirección e intensidad relativa. **Prohibidas las cifras duras.** Los números van en `discriminatingEvidence`.

### 3.3 Regla de negativo para `antiOverclaim`
El campo debe redactarse en forma de limitación o ausencia: "No captura…", "No estima…", "No generaliza…". No debe sonar como extensión del análisis.

### 3.4 Regla de especificidad para `institution`
Debe describir el marco institucional **vigente durante el episodio** — no una caracterización general del país. Incluir régimen, organismo, regla operativa o restricción relevante.

### 3.5 Regla de evidencia para `discriminatingEvidence`
Mínimo 2 cifras numéricas y 1 fecha. Las cifras deben ser verificables en fuentes primarias (ya citadas en la crónica base o en `source-manifest.json`).

---

## Sección 4 — Flujo de trabajo Día 1

```
PASO 1: Lectura de contexto
  └─ Leer protocolo, schema, template y ejemplos crudos

PASO 2: Diagnóstico de errores
  └─ Identificar y documentar campos que exceden límites
  └─ Salida: DIA_1_ERRORES_DETECTADOS.md

PASO 3: Corrección mínima
  └─ Editar in-place los ejemplos
  └─ Criterio: preservar máximo sentido, eliminar lo mínimo

PASO 4: Validación sintáctica
  └─ node -c <archivo.js> para cada ejemplo
  └─ Cero errores o warnings

PASO 5: Validación semántica
  └─ Checklist por campo para cada ejemplo
  └─ Verificar reglas de Sección 3
  └─ Salida: DIA_1_VALIDACION_FINAL.md

PASO 6: Resumen ejecutivo
  └─ Salida: DIA_1_RESUMEN_EJECUTIVO.md

PASO 7: Cleanup y entrega
  └─ Verificar lista de archivos
  └─ Commit y push a rama designada
```

---

## Sección 5 — Archivos del módulo Día 1

### Archivos de entrada (deben existir antes de iniciar)
| Archivo | Propósito |
|---|---|
| `DIA_1_PROTOCOLO_COMPLETO.md` | Este documento |
| `DIA_1_institutionalLayer_schema.json` | Schema formal JSON |
| `DIA_1_TEMPLATE_institutionalLayer.js` | Template anotado |
| `DIA_1_EJEMPLO_1_argentina_convertibility.js` | Ejemplo 1 (crudo) |
| `DIA_1_EJEMPLO_2_chile_2008_2009.js` | Ejemplo 2 (crudo) |
| `DIA_1_DOCUMENTACION_COMPLETA.md` | Guía + ejemplos |
| `DIA_1_INSTRUCCIONES_PARA_CLAUDE_CODE.md` | Instrucciones del sprint |

### Archivos de salida (generados en Día 1)
| Archivo | Propósito |
|---|---|
| `DIA_1_ERRORES_DETECTADOS.md` | Diagnóstico de errores con conteos reales |
| `DIA_1_VALIDACION_FINAL.md` | Checklist completado campo por campo |
| `DIA_1_RESUMEN_EJECUTIVO.md` | Estado final y próximos pasos |

---

## Sección 5b — Restricciones de edición

- **NO** inventar nuevos campos fuera del schema
- **NO** crear ejemplos adicionales (solo argentina y chile)
- **NO** cambiar hechos históricos; si se detecta inexactitud, reportar
- **NO** exceder límites de caracteres; acortar preservando sentido
- **NO** tocar `cronicas-registry.es-ES.js` hasta Día 2
- **NO** modificar funciones `calcISLM`, `calcISLMBP`, `calcOADA`

---

*Fin del protocolo. Documento de referencia única.*
