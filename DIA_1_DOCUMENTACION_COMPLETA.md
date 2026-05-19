# Documentación Completa — institutionalLayer

> MacroLab Shock Simulator · Sprint: validate-institutional-layer · 2026-05-19

---

## Parte 1 — Qué es el institutionalLayer

El campo `institutionalLayer` es una capa narrativa que se añade a cada crónica del registro canónico. Su propósito es mostrar, en términos pedagógicos, cómo el marco institucional vigente durante un episodio histórico determina la trayectoria de variables macroeconómicas frente a un shock externo.

El campo NO reemplaza la crónica; la complementa con análisis estructurado y verificable.

---

## Parte 2 — Los 8 campos y cómo rellenarlos

### `institution` (≤150 chars)
Describe el **marco institucional específico** vigente durante el episodio. Incluye: régimen cambiario o monetario, reglas operativas, organismos relevantes. NO es descripción general del país.

**Preguntas guía:**
- ¿Bajo qué régimen operaba el banco central?
- ¿Existía alguna regla fiscal vinculante?
- ¿Había alguna restricción cambiaria o legal relevante?

---

### `mechanism` (≤300 chars)
Cadena causal completa. Formato implícito: `shock → variable → institución → credibilidad → expectativas`. **CRÍTICO:** todos los strings de `affectedVariables` deben aparecer literalmente aquí.

**Preguntas guía:**
- ¿Cuál fue el shock inicial?
- ¿Qué variable golpeó primero?
- ¿Cómo amplificó o amortigó la institución el efecto?

---

### `affectedVariables` (exactamente 5 items)
Lista de 5 variables macroeconómicas clave del episodio. Cada string debe poder encontrarse por búsqueda literal dentro de `mechanism`.

**Verificación:** `mechanism.includes(affectedVariables[i])` para todo i.

---

### `feedbackLoop` (≤200 chars)
Describe cómo el mecanismo se retroalimenta. Puede ser:
- **Amplificador:** el efecto inicial se refuerza a sí mismo
- **Amortiguador:** el efecto inicial activa una respuesta que lo modera

Debe conectar causalmente con `mechanism`.

---

### `policyFeasibility` (≤200 chars)
Qué políticas eran o no viables dado el marco institucional. Restricciones específicas al episodio, no genéricas. Puede estructurarse por instrumento: monetario / fiscal / cambiario.

---

### `incidence` (≤150 chars)
Sobre quiénes recae el ajuste. Solo **dirección e intensidad relativa**. Prohibidas las cifras duras (van en `discriminatingEvidence`).

**Ejemplos de lenguaje válido:** "golpea primero", "se distribuye hacia", "amortigua", "menos asimétrico", "carga mayor sobre".

---

### `discriminatingEvidence` (≤250 chars)
Evidencia cuantitativa que distingue este episodio de otros. Mínimo 2 cifras y 1 fecha. Las cifras deben ser verificables en fuentes de la crónica base.

---

### `antiOverclaim` (≤200 chars)
Qué NO captura este análisis. Redactar en negativo. Ejemplos de estructuras válidas:
- "No captura…"
- "No estima contrafactual…"
- "No generaliza a…"
- "Omite…"

---

## Parte 3 — Ejemplos completos

### Ejemplo 1: argentina_convertibility

```javascript
var INST_LAYER_argentina_convertibility = {

  institution: "Caja de conversión 1991–2001: paridad 1:1 por ley; BC sin política monetaria autónoma; reservas respaldaban 100% la base monetaria.",
  // ↑ 131 chars ✓

  mechanism: "Sudden stop reduce reservas internacionales; sin autonomía, cae base monetaria y crédito; tipo de cambio nominal fijo amplifica pérdida competitiva real; demanda agregada colapsa en recesión; expectativas de devaluación aceleran salida de capitales cerrando el ciclo de colapso del régimen.",
  // ↑ 290 chars ✓

  affectedVariables: [
    "reservas internacionales",      // ✓ en mechanism
    "base monetaria",               // ✓ en mechanism
    "tipo de cambio nominal",       // ✓ en mechanism
    "demanda agregada",             // ✓ en mechanism
    "expectativas de devaluación"   // ✓ en mechanism
  ],

  feedbackLoop: "Caída de reservas → contracción de base monetaria → recesión → más desconfianza → fuga adicional de capitales → nuevas caídas de reservas: ciclo auto-reforzante hasta ruptura del régimen.",
  // ↑ 187 chars ✓

  policyFeasibility: "Devaluar exigía derogar la ley; deflación interna era políticamente inviable; FMI financió parcialmente pero deuda dolarizada y déficit crónico hacían insostenible el ajuste sin devaluación.",
  // ↑ 190 chars ✓

  incidence: "Shock golpea exportables; caída de demanda, desempleo manufacturing, presión salarial formal y crisis de financiamiento de pymes.",
  // ↑ 129 chars ✓

  discriminatingEvidence: "Reservas cayeron de USD 35.000M (jul-2001) a USD 10.000M (dic-2001); desempleo llegó a 21,5% (may-2002); peso devaluado de 1:1 a ~3,5:1; deuda en default USD 100.000M; ley derogada 6 ene 2002.",
  // ↑ 192 chars ✓

  antiOverclaim: "No captura heterogeneidad provincial ni efectos diferenciados del default entre tenedores; omite debate sobre si ajuste fiscal más temprano hubiera postergado el colapso."
  // ↑ 170 chars ✓

};
```

---

### Ejemplo 2: chile_2008_2009

```javascript
var INST_LAYER_chile_2008_2009 = {

  institution: "BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible.",
  // ↑ 125 chars ✓

  mechanism: "Caída del cobre estrecha exportaciones; BCCh baja tasa de política monetaria (TPM) 775 pb anclando expectativas de inflación 12-24 meses; tipo de cambio nominal se deprecia; gobierno activa FEES elevando gasto fiscal/demanda agregada, moderando caída de actividad económica y empleo.",
  // ↑ 283 chars ✓

  affectedVariables: [
    "tasa de política monetaria (TPM)",      // ✓ en mechanism
    "expectativas de inflación 12-24 meses", // ✓ en mechanism
    "tipo de cambio nominal",                // ✓ en mechanism
    "gasto fiscal/demanda agregada",         // ✓ en mechanism
    "actividad económica y empleo"           // ✓ en mechanism
  ],

  feedbackLoop: "Credibilidad del BC permite corte agresivo de TPM sin desanclar expectativas; TC flexible absorbe shock externo; estímulo fiscal opera sin costo de credibilidad por regla previa.",
  // ↑ 178 chars ✓

  policyFeasibility: "TPM: independencia permitió cortes rápidos. Fiscal: FEES (USD 20.211M) financió estímulo 2,8% PIB sin deuda relevante nueva. TC: flotación desde 1999 sin intervención forzada.",
  // ↑ 175 chars ✓

  incidence: "Shock golpea cuprífero; estímulo fiscal (transferencias, subsidios empleo) amortigua caída de empleo; distribución del ajuste menos asimétrica.",
  // ↑ 143 chars ✓

  discriminatingEvidence: "PIB cayó 1,6% en 2009 vs mediana OCDE ~-4%; TPM bajó a 0,5% (mínimo histórico); estímulo 2,8% PIB financiado con FEES; desempleo pico 11,1% jun-2009; economía rebotó +5,8% en 2010. FMI calificó la respuesta de 'vigorosa y bien equilibrada'.",
  // ↑ 240 chars ✓

  antiOverclaim: "No captura exposición heterogénea al cobre por región ni estima contrafactual sin FEES; el desempleo relativamente contenido pudo reflejar rigideces laborales, no solo el estímulo fiscal."
  // ↑ 187 chars ✓

};
```

---

## Parte 4 — Errores frecuentes a evitar

| Error | Ejemplo malo | Ejemplo bueno |
|---|---|---|
| `affectedVariables` no está en `mechanism` | var: "tasa interés", mech: "TPM" | var: "TPM", mech: "...TPM..." |
| `incidence` con cifras | "desempleo llegó a 21%" | "desempleo masivo en manufactura" |
| `institution` genérica | "Chile es una economía abierta" | "BC de Chile con IT (2-4%)..." |
| `antiOverclaim` en positivo | "También captura efectos de..." | "No captura efectos de..." |
| Campos fuera de límite | incidence de 280 chars | incidence de 143 chars |

---

## Parte 5 — Cómo fusionar en Día 2

En Día 2, el campo `institutionalLayer` se añade como una propiedad más a cada entrada de `window.MacroLabCronicasRegistryES`. Ejemplo:

```javascript
"argentina_convertibility": {
  titulo: "Argentina, convertibilidad 1991–2002",
  // ... campos existentes ...
  institutionalLayer: {
    institution: "Caja de conversión 1991–2001: ...",
    // ... resto de campos ...
  }
}
```

Los archivos `DIA_1_EJEMPLO_*.js` son la fuente directa de estos objetos.
