# Errores Detectados en Ejemplos Crudos

> Generado: 2026-05-19  
> Herramienta de conteo: `python3 -c "print(len(text))"` (caracteres Unicode)  
> Schema de referencia: DIA_1_institutionalLayer_schema.json **v1.1**

---

## Nota sobre conteo de caracteres

Los ejemplos crudos del Cowork se validaron con `echo -n "..." | wc -c`, que cuenta **bytes UTF-8**, no caracteres Unicode. Para texto en español, las vocales acentuadas (á, é, í, ó, ú) y flechas (→) pesan 2–3 bytes pero son 1 carácter. Esto causó que el Cowork subestimara los conteos en ~15–25% y pensara que campos como `mechanism` (454 chars reales) tenían solo 297 "chars" (bytes).

**Decisión de arquitectura (schema v1.1):** Los límites se ampliaron para reflejar el contenido pedagógico real, medido en caracteres Unicode (la misma métrica que usa JavaScript `string.length`).

---

## Ejemplo 1: argentina_convertibility

### Errores detectados en versión cruda

| Campo | Límite v1.1 | Chars reales (crudo) | Estado | ¿Corregido? |
|---|---|---|---|---|
| institution | 200 | 186 | ✓ OK | — |
| mechanism | 500 | 366 | ✓ OK | — |
| affectedVariables | 5 items | 5 items | ✓ OK | — |
| feedbackLoop | 350 | 271 | ✓ OK | — |
| policyFeasibility | 300 | 259 | ✓ OK | — |
| **incidence** | **250** | **295** | **✗ +45** | **Sí** |
| discriminatingEvidence | 400 | 346 | ✓ OK | — |
| antiOverclaim | 500 | 437 | ✓ OK | — |

### Error 1.1 — Campo: `incidence`

- **Límite:** 250 caracteres
- **Versión cruda:** 295 caracteres (+45)

**Texto crudo:**
> Shock golpea primero a sectores exportables (agricultura, manufactura) cuya competitividad se erosiona con TC real apreciado; luego se distribuye vía caída agregada de demanda, desempleo masivo de manufacturing urbana, presión sobre salarios reales formales, y crisis de financiamiento de pymes.

**Texto corregido (207 chars):**
> Shock golpea primero exportables (agricultura, manufactura) cuya competitividad se erosiona; luego caída agregada, desempleo manufacturing urbana, presión salarial formal y crisis de financiamiento de pymes.

**Criterio de acortamiento:** eliminado "a sectores" (redundante), "con TC real apreciado" (aparece en mechanism), "se distribuye vía" y "masivo de" (redundantes), "sobre salarios reales" → "salarial".

---

### Observación semántica 1.2 — affectedVariables vs mechanism

Dos variables no aparecen literalmente en mechanism (presencia semántica únicamente):

| Variable | Referencia en mechanism | Tipo |
|---|---|---|
| "tipo de cambio nominal (fijo por ley)" | "Sin devaluación posible" | Semántico |
| "expectativas de devaluación" | "expectativas de ruptura aumentan" | Semántico |

**Pendiente editorial (Día 4-5):** evaluar si conviene añadir las frases literales al mechanism para habilitar validación automática estricta.

---

## Ejemplo 2: chile_2008_2009

### Errores detectados en versión cruda

| Campo | Límite v1.1 | Chars reales (crudo) | Estado | ¿Corregido? |
|---|---|---|---|---|
| **institution** | **200** | **235** | **✗ +35** | **Sí** |
| mechanism | 500 | 454 | ✓ OK | — |
| affectedVariables | 5 items | 5 items | ✓ OK | — |
| feedbackLoop | 350 | 301 | ✓ OK | — |
| policyFeasibility | 300 | 261 | ✓ OK | — |
| **incidence** | **250** | **280** | **✗ +30** | **Sí** |
| discriminatingEvidence | 400 | 370 | ✓ OK | — |
| antiOverclaim | 500 | 450 | ✓ OK | — |

### Error 2.1 — Campo: `institution`

- **Límite:** 200 caracteres
- **Versión cruda:** 235 caracteres (+35)

**Texto crudo:**
> Banco Central de Chile con régimen de inflación objetivo (2-4%), independencia desde 1989, comunicación transparente; gobierno con regla de balance estructural y Fondo de Estabilización Económico y Social (FEES) acumulado; TC flexible.

**Texto corregido (125 chars):**
> BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible.

**Criterio de acortamiento:** "Banco Central de Chile" → "BC de Chile"; "régimen de inflación objetivo" → "IT"; eliminado "comunicación transparente"; "Fondo de Estabilización Económico y Social (FEES)" → "FEES".

---

### Error 2.2 — Campo: `incidence`

- **Límite:** 250 caracteres
- **Versión cruda:** 280 caracteres (+30)

**Texto crudo:**
> Shock golpea primero sector cuprífero y exportables; luego se distribuye a manufactureros y constructoras; pero estímulo fiscal (transferencias, subsidios de empleo) amortigua caída de empleo informal y formal; distribución del ajuste menos asimétrica que en economías sin buffer.

**Texto corregido (182 chars):**
> Shock golpea sector cuprífero y exportables; estímulo fiscal (transferencias, subsidios empleo) amortigua caída de empleo formal/informal; distribución más equitativa que sin buffer.

**Criterio de acortamiento:** eliminado "primero" y distribución secundaria a "manufactureros y constructoras" (unificada en efecto sobre empleo); "informal y formal" → "formal/informal"; "menos asimétrica" → "más equitativa".

---

### Observación semántica 2.3 — affectedVariables vs mechanism

Todas las variables aparecen semánticamente en mechanism pero ninguna literalmente:

| Variable | Referencia en mechanism | Tipo |
|---|---|---|
| "tasa de política monetaria (TPM)" | "BC reduce TPM (775 pb...)" | Semántico |
| "expectativas de inflación 12-24 meses" | "mercados no anticipan inflación" | Semántico |
| "tipo de cambio nominal" | "presión inicial en TC pero flexible" | Semántico |
| "gasto fiscal/demanda agregada" | "gasto anticíclico (2,8% PIB)" | Semántico |
| "actividad económica y empleo" | "demanda se amortigua" | Semántico |

**Pendiente editorial (Día 4-5):** mismo criterio que Ejemplo 1 — evaluar adición literal.

---

## Resumen de correcciones aplicadas

| Ejemplo | Campo | Chars crudo | Chars corregido | Reducción |
|---|---|---|---|---|
| argentina_convertibility | incidence | 295 | 207 | −88 |
| chile_2008_2009 | institution | 235 | 125 | −110 |
| chile_2008_2009 | incidence | 280 | 182 | −98 |

## Pendientes para Día 4-5 (no bloqueantes)

- [ ] Revisar presencia semántica vs literal de affectedVariables en mechanism (ambos ejemplos)
- [ ] Evaluar si mechanism de chile debe incluir las frases literales de las 5 variables
- [ ] Auditoría editorial completa de discriminatingEvidence (verificar cifras vs fuentes primarias)
