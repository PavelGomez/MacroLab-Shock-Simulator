# DÍA 1: Instrucciones Ejecutivas para Claude Code
## Formato: Órdenes paso a paso (sin ambigüedad)

**Objetivo final:** Validar y preparar 2 ejemplos de institutionalLayer para que puedan mergear a `cronicas-registry.es-ES.js` en Día 2.

**Rama de trabajo:** `claude/validate-institutional-layer-ijfxy`

---

## PASO 1: Lectura de contexto (SIN COMENZAR EDICIÓN)

**Archivo único de verdad:** `DIA_1_PROTOCOLO_COMPLETO.md`

Archivos a leer:
1. `DIA_1_PROTOCOLO_COMPLETO.md` — protocolo completo (secciones 1–5)
2. `DIA_1_institutionalLayer_schema.json` — schema JSON formal
3. `DIA_1_TEMPLATE_institutionalLayer.js` — template anotado
4. `DIA_1_EJEMPLO_1_argentina_convertibility.js` — ejemplo crudo (incidence excede límite)
5. `DIA_1_EJEMPLO_2_chile_2008_2009.js` — ejemplo crudo (institution e incidence exceden límite)

---

## PASO 2: Identificar y documentar errores

Crear `DIA_1_ERRORES_DETECTADOS.md` con tabla de errores, conteos exactos (usando Python `len()`), y sugerencias de corrección mínima.

---

## PASO 3: Corregir errores en ejemplos

Editar IN PLACE los dos archivos de ejemplo con correcciones mínimas que preserven el sentido del campo.

Criterios de acortamiento:
- Eliminar enumeraciones parentéticas redundantes con la crónica base
- Simplificar términos ya establecidos (e.g., nombre completo del fondo → sigla)
- Eliminar adjetivos que no añaden precisión institucional
- Unificar efectos secundarios en descripción de impacto agregado

---

## PASO 4: Validación sintáctica

```bash
node -c DIA_1_EJEMPLO_1_argentina_convertibility.js
node -c DIA_1_EJEMPLO_2_chile_2008_2009.js
```

Cero errores.

---

## PASO 5: Validación semántica

Verificar manualmente para cada ejemplo:
- Todos los campos respetan límites de caracteres (verificar con Python `len()`)
- Todos los items de `affectedVariables` aparecen literalmente en `mechanism`
- `incidence` no contiene cifras duras
- `antiOverclaim` está redactado en negativo
- `discriminatingEvidence` tiene mínimo 2 cifras y 1 fecha

Salida: `DIA_1_VALIDACION_FINAL.md`

---

## PASO 6: Resumen ejecutivo

Crear `DIA_1_RESUMEN_EJECUTIVO.md` con estado de todos los archivos y próximos pasos.

---

## PASO 7: Cleanup y entrega

Verificar que existen los 10 archivos del módulo Día 1. Commit y push a rama designada.

---

## Restricciones

- NO inventar nuevos campos
- NO crear ejemplos adicionales
- NO cambiar hechos históricos
- NO exceder límites de caracteres
- NO tocar `cronicas-registry.es-ES.js` hasta Día 2

---

**Última actualización:** 2026-05-19
