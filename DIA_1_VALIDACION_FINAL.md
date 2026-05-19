# Día 1: Validación Final

> Generado: 2026-05-19  
> Schema: v1.1 — límites en caracteres Unicode (`python3 len()` / `string.length`)  
> Herramienta de conteo: `python3 -c "print(len(texto))"` — NO `wc -c`

---

## Checklist: argentina_convertibility

### Límites de caracteres (schema v1.1)

- [x] `institution`: 186/200 chars ✓
- [x] `mechanism`: 366/500 chars ✓
- [x] `feedbackLoop`: 271/350 chars ✓
- [x] `policyFeasibility`: 259/300 chars ✓
- [x] `incidence`: 207/250 chars ✓ — **CORREGIDO** (versión cruda Cowork: 295 chars)
- [x] `discriminatingEvidence`: 346/400 chars ✓
- [x] `antiOverclaim`: 437/500 chars ✓

### affectedVariables — presencia semántica en mechanism

- [x] `"reservas internacionales"` → "presión sobre reservas internacionales" ✓
- [x] `"base monetaria"` → "base monetaria se contrae mecánicamente" ✓
- [x] `"tipo de cambio nominal (fijo por ley)"` → "Sin devaluación posible" (semántico) ✓
- [x] `"demanda agregada"` → "demanda agregada cae" ✓
- [x] `"expectativas de devaluación"` → "expectativas de ruptura aumentan" (semántico) ✓

### Reglas de contenido

- [x] `affectedVariables`: exactamente 5 items ✓
- [x] `discriminatingEvidence` tiene cifras numéricas ✓ (US$ 26M, US$ 10M, 7%, 18%, 52%, 200%+)
- [x] `discriminatingEvidence` tiene fechas ✓ (1992, 1995, 1999, 2001, diciembre 2001, enero-febrero 2002)
- [x] `antiOverclaim` redactado en negativo ✓ ("MacroLab NO captura...")
- [x] `incidence` sin cifras duras ✓
- [x] `institution` específico al episodio ✓ (Ley 23.928, paridad fija, deuda dolarizada)
- [x] `feedbackLoop` conecta con mechanism ✓ (expectativas → corridas → reservas → espiral)
- [x] `policyFeasibility` restricciones específicas al episodio ✓ (rigidez legal, fiscal provincial, dependencia capital)

### Validación sintáctica

- [x] `node -c DIA_1_EJEMPLO_1_argentina_convertibility.js` → sin errores ✓

### Resultado

**EJEMPLO 1: VALIDADO — todos los campos dentro de límites v1.1, semántica completa**

---

## Checklist: chile_2008_2009

### Límites de caracteres (schema v1.1)

- [x] `institution`: 125/200 chars ✓ — **CORREGIDO** (versión cruda Cowork: 235 chars)
- [x] `mechanism`: 454/500 chars ✓
- [x] `feedbackLoop`: 301/350 chars ✓
- [x] `policyFeasibility`: 261/300 chars ✓
- [x] `incidence`: 182/250 chars ✓ — **CORREGIDO** (versión cruda Cowork: 280 chars)
- [x] `discriminatingEvidence`: 370/400 chars ✓
- [x] `antiOverclaim`: 450/500 chars ✓

### affectedVariables — presencia semántica en mechanism

- [x] `"tasa de política monetaria (TPM)"` → "BC reduce TPM (775 pb entre ene-jun 2009)" ✓
- [x] `"expectativas de inflación 12-24 meses"` → "mercados no anticipan inflación" (semántico) ✓
- [x] `"tipo de cambio nominal"` → "presión inicial en TC pero flexible" ✓
- [x] `"gasto fiscal/demanda agregada"` → "gasto anticíclico (2,8% PIB)" (semántico) ✓
- [x] `"actividad económica y empleo"` → "demanda se amortigua" (semántico) ✓

### Reglas de contenido

- [x] `affectedVariables`: exactamente 5 items ✓
- [x] `discriminatingEvidence` tiene cifras numéricas ✓ (3,25%, 0,5%, 1,4%, 7%, 10,1%, 2,5-3,5%, 1,6%, 5,1%)
- [x] `discriminatingEvidence` tiene fechas ✓ (enero-junio 2009, 2009, 2010)
- [x] `antiOverclaim` redactado en negativo ✓ ("MacroLab NO captura...")
- [x] `incidence` sin cifras duras ✓
- [x] `institution` específico al episodio ✓ (IT 2-4%, independencia 1989, regla estructural, FEES, TC flexible)
- [x] `feedbackLoop` conecta con mechanism ✓ (buffer → demanda sostenida → credibilidad → expectativas ancladas)
- [x] `policyFeasibility` restricciones específicas al episodio ✓ (BC autónomo, regla creíble, TC flexible, FEES)

### Validación sintáctica

- [x] `node -c DIA_1_EJEMPLO_2_chile_2008_2009.js` → sin errores ✓

### Resultado

**EJEMPLO 2: VALIDADO — todos los campos dentro de límites v1.1, semántica completa**

---

## Resumen de validación Día 1

| Criterio | argentina_convertibility | chile_2008_2009 |
|---|---|---|
| Todos los campos ≤ límites v1.1 | ✓ | ✓ |
| affectedVariables en mechanism (semántico) | ✓ (5/5) | ✓ (5/5) |
| Sintaxis JS válida (node -c) | ✓ | ✓ |
| incidence sin cifras | ✓ | ✓ |
| antiOverclaim en negativo | ✓ | ✓ |
| discriminatingEvidence con números y fechas | ✓ | ✓ |
| institution específico al episodio | ✓ | ✓ |

**Estado final: AMBOS EJEMPLOS VALIDADOS — listos para Día 2**

---

## Correcciones aplicadas (Cowork → repo)

| Ejemplo | Campo | Chars Cowork (crudo) | Chars corregido | Reducción |
|---|---|---|---|---|
| argentina_convertibility | incidence | 295 | 207 | −88 |
| chile_2008_2009 | institution | 235 | 125 | −110 |
| chile_2008_2009 | incidence | 280 | 182 | −98 |

**Nota:** Los chars del Cowork "crudo" se midieron en bytes UTF-8 (`wc -c`), por lo que algunos campos aparecían como "excedidos" sin serlo y viceversa. Los chars en esta tabla son caracteres Unicode reales (Python `len()`).

---

## Pendientes editoriales (Día 4-5, no bloqueantes)

- [ ] Revisar si conviene añadir las frases literales de affectedVariables en mechanism (actualmente: presencia semántica aceptada)
- [ ] Auditoría editorial completa de discriminatingEvidence (verificar cifras vs fuentes primarias)
- [ ] Evaluar si mechanism de chile debe incluir las 5 variables con frases exactas para validación automática estricta
