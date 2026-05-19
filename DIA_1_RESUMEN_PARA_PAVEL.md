# DÍA 1: Resumen para Pável
## Schema de institutionalLayer — Entregables y Próximos Pasos

**Fecha:** 2026-05-19 (listo para Día 2, 2026-05-20)  
**Estado:** ✓ COMPLETO Y VALIDADO (schema v1.1)

---

## Qué se entregó

### Archivos principales (listos para mergear a prod)
1. **DIA_1_institutionalLayer_schema.json** — Schema formal JSON-Schema 2020-12 (v1.1: límites en caracteres Unicode reales)
2. **DIA_1_TEMPLATE_institutionalLayer.js** — Template anotado con ejemplos y límites de caracteres
3. **DIA_1_EJEMPLO_1_argentina_convertibility.js** — Crónica Argentina 1991–2002 + institutionalLayer (VALIDADO)
4. **DIA_1_EJEMPLO_2_chile_2008_2009.js** — Crónica Chile 2008–2009 + institutionalLayer (VALIDADO)

### Documentación de referencia
5. **DIA_1_DOCUMENTACION_COMPLETA.md** — Guía completa (8 campos + ejemplos anotados + FAQ)
6. **DIA_1_PROTOCOLO_COMPLETO.md** — Protocolo de trabajo (secciones 1–5)

### Instrucciones para Claude Code
7. **DIA_1_INSTRUCCIONES_PARA_CLAUDE_CODE.md** — Pasos ejecutivos

### Archivos de validación (generados por Claude Code)
8. **DIA_1_ERRORES_DETECTADOS.md** — Diagnóstico de errores y correcciones
9. **DIA_1_VALIDACION_FINAL.md** — Checklist de validación completado
10. **DIA_1_RESUMEN_EJECUTIVO.md** — Estado final del Día 1

---

## El schema: 8 campos obligatorios (límites v1.1)

| Campo | Límite v1.1 | Propósito | Ejemplo ARG |
|---|---|---|---|
| **institution** | ≤200 chars | Institución(es) focal(es) + configuración clave | "Ley de Convertibilidad (1991–2002): paridad fija 1 ARS/USD sin discretion en BC..." |
| **mechanism** | ≤500 chars | Cadena causal completa: shock→var→institución→expectativa | "Shock externo → caída de capital → presión sobre reservas → BC no puede expandir → base monetaria cae → demanda cae" |
| **affectedVariables** | array, max 5 | Variables que institución controla o que responden a credibilidad | ["reservas internacionales", "base monetaria", "tipo de cambio nominal (fijo por ley)", "demanda agregada", "expectativas de devaluación"] |
| **feedbackLoop** | ≤350 chars | Dinámicas no lineales: cómo reacción inicial amplifica/amortigua shock | "Expectativas de ruptura → corridas → caída de reservas → espiral contraccionista → colapso diciembre 2001" |
| **policyFeasibility** | ≤300 chars | Restricciones políticas/técnicas específicas al episodio | "Ley rigidiza política monetaria; BC sin discreción; presión fiscal provincial; dependencia de capital externo" |
| **incidence** | ≤250 chars | Quién golpea el shock primero; distribución del ajuste | "Shock golpea exportables; luego caída agregada, desempleo manufacturing, presión salarial formal" |
| **discriminatingEvidence** | ≤400 chars | Números/fechas/hechos reales del episodio que confirman mecanismo | "Reservas caen de US$ 26M (1992) → US$ 10M (2001); desempleo 7% (1995) → 18% (2002); deuda 52% PIB; default dic 2001" |
| **antiOverclaim** | ≤500 chars | Qué NO captura MacroLab; límites explícitos | "MacroLab NO captura: (i) corridas financieras (Calvo), (ii) costos políticos (Alesina-Drazen), (iii) timing de colapso" |

**Nota v1.1:** Los límites originales (150/300/200/200/150/250/200) usaban bytes UTF-8 (`wc -c`). Los límites v1.1 usan caracteres Unicode (`len()` Python / `string.length` JavaScript), que es la medida correcta para texto en español.

---

## Los 2 ejemplos validados

### Ejemplo 1: Argentina Convertibilidad (1991–2002)
**Lección pedagógica:** Cómo una rigidez cambiaria sin coherencia fiscal acumula tensión hasta colapsar.

**Mecanismo central:** Shock de caída de capital bajo régimen fijo → sin opción de expansión monetaria → contracción de base monetaria → depresión de actividad → desempleo masivo.

**Dinámica crítica (feedbackLoop):** Cada presión desata corridas que reducen reservas más, lo que intensifica contracción monetaria.

**Límite pedagógico (antiOverclaim):** El modelo muestra **acumulación de tensión**; no predice **cuándo exactamente** colapsa (fenómeno de corridas es endógeno y discontinuo).

---

### Ejemplo 2: Chile 2008–2009
**Lección pedagógica:** Cómo credibilidad institucional + buffer fiscal acumulado + regla fiscal creíble permiten respuesta contracíclica sin desanclaje de expectativas.

**Mecanismo central:** Shock externo → BC reduce tasas (credibilidad en IT) + Gobierno gasta (credibilidad en regla fiscal) → demanda se amortigua sin inflación anticipada.

**Dinámica crítica (feedbackLoop):** A diferencia de Argentina, aquí la dinámica es de **refuerzo positivo**: cada paso de respuesta refuerza credibilidad, no la mina.

**Límite pedagógico (antiOverclaim):** El modelo muestra mecanismos de **transmisión** bajo credibilidad; no explica cómo se **construye** esa credibilidad en el tiempo (pre-historia 1990–2007).

---

## Decisiones de arquitectura codificadas en el schema

### 1. institutionalLayer va en crónica, no en ruta
Una crónica es un episodio histórico fijo. El mecanismo institucional es fijo. Las rutas (shocks + configuraciones) son combinaciones de crónicas.

**Beneficio:** Una crónica correcta se reutiliza en múltiples rutas sin duplicación.

### 2. Límites de caracteres en Unicode, no bytes
Los límites del schema v1.1 se miden en caracteres Unicode (Python `len()` / JavaScript `string.length`), no en bytes UTF-8 (`wc -c`). Esto evita subestimación para texto en español.

**Beneficio:** Los límites son reales y verificables con cualquier herramienta estándar.

### 3. Cadena obligatoria shock→institución→credibilidad→expectativas
Los 8 campos codifican la cadena pedagógica del curso. No se puede rellenar `mechanism` sin pensar en cómo credibilidad altera expectativas.

**Beneficio:** Evita overlays narrativos débiles ("las instituciones importan" sin mecanismo).

---

## Cómo usar esto en Día 2

### Día 2: Ampliación de registros (3 pilotos)

Tarea: Editar `cronicas-registry.es-ES.js` para añadir `institutionalLayer` a **3 crónicas piloto** más.

**Opción A (recomendada):** Usa los 2 ejemplos como template
- Observa la estructura de institutionalLayer en argentina y chile
- Rellena lo mismo para 3 crónicas nuevas (p.ej. Turquía, Noruega, Grecia)

**Opción B:** Usa el template anotado
- Abre DIA_1_TEMPLATE_institutionalLayer.js
- Sigue instrucciones anotadas para cada campo

**Salida esperada:** 5 crónicas con institutionalLayer (los 2 ejemplos + 3 nuevas).

---

## Cómo validar antes de mergear

### Validación técnica
```bash
# Sintaxis JS
node -c DIA_1_EJEMPLO_1_argentina_convertibility.js
node -c DIA_1_EJEMPLO_2_chile_2008_2009.js

# Conteo de caracteres (usar Python, no wc -c)
python3 -c "print(len('texto del campo institution'))"   # Debe dar ≤200
```

### Validación semántica
```markdown
✓ Cada variable en affectedVariables aparece semánticamente en mechanism
✓ mechanism incluye shock→var→institución→expectativa
✓ feedbackLoop describe amplificación o amortiguación, no repite mechanism
✓ Todos los 8 campos están presentes (no faltan)
✓ antiOverclaim está en negativo (qué NO captura MacroLab)
```

---

## Próximos pasos (Día 2–5)

### Día 2 (2026-05-20)
- [ ] Ampliación de 3 crónicas piloto más con institutionalLayer
- [ ] Validación de sintaxis + límites de caracteres (Python)
- [ ] Commit a rama feature/institutional-layer-pilot

### Día 3
- [ ] Modificar narrative-layer.js para leer institutionalLayer
- [ ] Renderizar 3 paneles en simulador (A, B, C)
- [ ] Test: cargar ruta piloto 1, verificar paneles

### Día 4
- [ ] Migrar atlas a JSON externo
- [ ] Hacer fetch de institutionalLayer en atlas
- [ ] Renderizar paneles en tarjetas del atlas

### Día 5
- [ ] QA completo (navegadores, mobile, desktop)
- [ ] Validación editorial (skill)
- [ ] Documento de cierre con checklist final

---

**Documento de referencia:** DIA_1_PROTOCOLO_COMPLETO.md  
**Para ejemplos anotados:** DIA_1_DOCUMENTACION_COMPLETA.md  
**Para validación:** DIA_1_VALIDACION_FINAL.md + DIA_1_ERRORES_DETECTADOS.md
