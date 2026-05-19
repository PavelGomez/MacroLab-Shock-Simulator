# Errores Detectados en Ejemplos Crudos

> Generado: 2026-05-19  
> Herramienta de conteo: `python3 -c "print(len(text))"` (Unicode code points)  
> Nota: los conteos del protocolo original diferían por método de conteo.
> Se usan los conteos Python como referencia canónica.

---

## Ejemplo 1: argentina_convertibility

### Estado global: 1 error

| Campo | Límite | Actual | Exceso | Estado |
|---|---|---|---|---|
| institution | 150 | 131 | — | ✓ OK |
| mechanism | 300 | 290 | — | ✓ OK |
| affectedVariables | 5 items | 5 items | — | ✓ OK |
| feedbackLoop | 200 | 187 | — | ✓ OK |
| policyFeasibility | 200 | 190 | — | ✓ OK |
| **incidence** | **150** | **295** | **+145** | **✗ EXCEDE** |
| discriminatingEvidence | 250 | 192 | — | ✓ OK |
| antiOverclaim | 200 | 170 | — | ✓ OK |

---

### Error 1.1 — Campo: `incidence`

- **Límite:** 150 caracteres
- **Actual:** 295 caracteres
- **Exceso:** +145 caracteres

**Versión errónea (295 chars):**
```
Shock golpea primero a sectores exportables (agricultura, manufactura) cuya competitividad se erosiona con TC real apreciado; luego se distribuye vía caída agregada de demanda, desempleo masivo de manufacturing urbana, presión sobre salarios reales formales, y crisis de financiamiento de pymes.
```

**Versión corregida (129 chars):**
```
Shock golpea exportables; caída de demanda, desempleo manufacturing, presión salarial formal y crisis de financiamiento de pymes.
```

**Criterio de acortamiento:** se eliminó la enumeración parentética de sectores, la referencia al TC real (que aparece en mechanism), "masivo" y "urbana" (redundantes), "sobre salarios reales" simplificado a "salarial". El sentido distribuido del shock se conserva.

---

## Ejemplo 2: chile_2008_2009

### Estado global: 2 errores

| Campo | Límite | Actual | Exceso | Estado |
|---|---|---|---|---|
| **institution** | **150** | **235** | **+85** | **✗ EXCEDE** |
| mechanism | 300 | 283 | — | ✓ OK |
| affectedVariables | 5 items | 5 items | — | ✓ OK |
| feedbackLoop | 200 | 178 | — | ✓ OK |
| policyFeasibility | 200 | 175 | — | ✓ OK |
| **incidence** | **150** | **280** | **+130** | **✗ EXCEDE** |
| discriminatingEvidence | 250 | 240 | — | ✓ OK |
| antiOverclaim | 200 | 187 | — | ✓ OK |

---

### Error 2.1 — Campo: `institution`

- **Límite:** 150 caracteres
- **Actual:** 235 caracteres
- **Exceso:** +85 caracteres

**Versión errónea (235 chars):**
```
Banco Central de Chile con régimen de inflación objetivo (2-4%), independencia desde 1989, comunicación transparente; gobierno con regla de balance estructural y Fondo de Estabilización Económico y Social (FEES) acumulado; TC flexible.
```

**Versión corregida (125 chars):**
```
BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible.
```

**Criterio de acortamiento:** "Banco Central de Chile" → "BC de Chile"; "régimen de inflación objetivo" → "IT"; se eliminó "comunicación transparente" (atributo, no institución); "Fondo de Estabilización Económico y Social (FEES)" → "FEES" (ya definido en crónica base).

---

### Error 2.2 — Campo: `incidence`

- **Límite:** 150 caracteres
- **Actual:** 280 caracteres
- **Exceso:** +130 caracteres

**Versión errónea (280 chars):**
```
Shock golpea primero sector cuprífero y exportables; luego se distribuye a manufactureros y constructoras; pero estímulo fiscal (transferencias, subsidios de empleo) amortigua caída de empleo informal y formal; distribución del ajuste menos asimétrica que en economías sin buffer.
```

**Versión corregida (143 chars):**
```
Shock golpea cuprífero; estímulo fiscal (transferencias, subsidios empleo) amortigua caída de empleo; distribución del ajuste menos asimétrica.
```

**Criterio de acortamiento:** se unificó la distribución secundaria (manufactureros, constructoras) en el efecto sobre empleo; se mantuvo el contraste amortiguador del estímulo fiscal; se eliminó la referencia comparativa "que en economías sin buffer" (implícita en el contexto del módulo).

---

## Resumen de correcciones

| Ejemplo | Campo | Chars antes | Chars después | Reducción |
|---|---|---|---|---|
| argentina_convertibility | incidence | 295 | 129 | −166 |
| chile_2008_2009 | institution | 235 | 125 | −110 |
| chile_2008_2009 | incidence | 280 | 143 | −137 |

## Nota sobre conteos del protocolo original

El protocolo indicaba conteos distintos (168 / 160 / 169 chars para los campos erróneos). La diferencia se debe al método de conteo utilizado en la redacción del protocolo. Los conteos Python (Unicode code points) son la referencia canónica para validación.
