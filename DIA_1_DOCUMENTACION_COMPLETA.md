# Documentación Completa: institutionalLayer

## Índice
1. [Resumen ejecutivo](#resumen-ejecutivo)
2. [Qué es institutionalLayer](#qué-es-institutionallayer)
3. [Schema formal](#schema-formal)
4. [Guía de rellenado (8 campos)](#guía-de-rellenado-8-campos)
5. [Ejemplo anotado: Argentina 2001–2002](#ejemplo-anotado-argentina-20012002)
6. [Ejemplo anotado: Chile 2008–2009](#ejemplo-anotado-chile-20082009)
7. [Checklist de validación](#checklist-de-validación)
8. [Preguntas frecuentes](#preguntas-frecuentes)

---

## Resumen ejecutivo

**¿Qué es?** Un objeto JavaScript de 8 campos que documenta el mecanismo institucional de cada crónica histórica en MacroLab.

**¿Dónde va?** Dentro de cada crónica en `cronicas-registry.es-ES.js` como propiedad hermana a `titulo`, `cronica`, `fuentes`, etc.

**¿Por qué?** Hacer explícita la cadena causal (shock → institución → credibilidad → expectativas) de forma que estudiantes no confundan "ver un resultado" con "entender por qué ocurre".

**¿Cuándo?** Desde Día 1 (validación de schema + 2 ejemplos) hasta Día 3 (integración en narrative-layer.js).

> **Nota sobre conteo de caracteres (schema v1.1):** Los límites se miden en **caracteres Unicode** (`python3 -c "print(len(texto))"` / `string.length` en JS), NO en bytes UTF-8 (`wc -c`). Para texto en español, `wc -c` subestima el conteo real en ~15–25% por las vocales acentuadas y flechas.

---

## Qué es institutionalLayer

### Definición pedagógica

`institutionalLayer` traduce cada episodio histórico a la **cadena explicativa obligatoria** del curso:

```
shock → institución → credibilidad → incentivos → expectativas → canal macroeconómico → trayectoria
```

Sin esta capa, estudiantes ven gráficos en MacroLab y piensan "eso pasó" sin entender **por qué las instituciones importan**.

### Estructura

```javascript
institutionalLayer: {
  institution: "...",              // Qué institución(es)
  mechanism: "...",                 // Cómo afecta el shock
  affectedVariables: [...],        // Variables controladas
  feedbackLoop: "...",             // Dinámicas no lineales
  policyFeasibility: "...",        // Restricciones políticas
  incidence: "...",                // Quién sufre el shock
  discriminatingEvidence: "...",   // Datos que confirman el mecanismo
  antiOverclaim: "..."             // Qué NO captura MacroLab
}
```

---

## Schema formal

Definición en JSON-Schema 2020-12 (consultar `DIA_1_institutionalLayer_schema.json`).

**Puntos clave:**
- `institutionalLayer` es un **objeto** (no array, no string)
- Los 8 campos son **obligatorios** (required: [...])
- Cada campo tiene **límites de caracteres estrictos** (en Unicode, no bytes)
- `affectedVariables` es un array de strings (máx 5 elementos)

**Límites schema v1.1 (caracteres Unicode):**

| Campo | Límite |
|-------|--------|
| institution | ≤200 |
| mechanism | ≤500 |
| feedbackLoop | ≤350 |
| policyFeasibility | ≤300 |
| incidence | ≤250 |
| discriminatingEvidence | ≤400 |
| antiOverclaim | ≤500 |
| affectedVariables | max 5 elementos |

---

## Guía de rellenado (8 campos)

### 1. institution (≤200 caracteres)

**¿Qué es?**  
La institución focal del episodio y su configuración clave.

**¿Qué NO es?**  
Genéricos ("el banco central", "el gobierno"). Debe ser específico al episodio.

**Estructura recomendada:**
```
[Institución] con [atributos clave que varían en el episodio]
```

**Ejemplos reales:**

✓ "Ley de Convertibilidad (1991–2002): régimen de paridad fija 1 ARS/USD sin discretion en Banco Central; dependencia de entradas de capital externo; estructura de deuda pública dolarizada."

✓ "BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible."

✗ "Banco Central" (genérico, no específico)

✗ "El gobierno regulaba la economía" (vago, sin mecanismo)

---

### 2. mechanism (≤500 caracteres)

**¿Qué es?**  
El mecanismo causal **completo y explícito** de la cadena:
```
shock → variable(s) afectada(s) → respuesta de institución → cómo credibilidad altera expectativas → resultado
```

**¿Qué NO es?**  
Una enumeración de hechos. Debe ser una cadena de causalidad.

**Estructura obligatoria:**
1. ¿Cuál es el shock?
2. ¿Qué variable macroeconómica afecta?
3. ¿Qué hace la institución en respuesta?
4. ¿Cómo la credibilidad altera la formación de expectativas?
5. ¿Cuál es el resultado?

**Ejemplo real (Argentina 1991–2002):**

```
Shock externo (crisis rusa 1998, devaluación Brasil 1999) → caída de 
salida de capital → presión sobre reservas internacionales → bajo 
Convertibilidad, BC no puede expandir monetariamente sin dólares → 
base monetaria se contrae mecánicamente → demanda agregada cae → 
desempleo sube. Sin devaluación posible, ajuste real traumático y 
expectativas de ruptura aumentan.
```

**Validación:** Cada variable en `affectedVariables` debe aparecer semánticamente en `mechanism`.

---

### 3. affectedVariables (array, máx 5)

**¿Qué es?**  
Variables macroeconómicas sobre las cuales la institución tiene control directo o que responden a credibilidad.

**¿Qué NO es?**  
Una lista exhaustiva de todas las variables mencionadas en la crónica. Solo las centrales.

**Regla:** Cada variable DEBE estar mencionada semánticamente en el campo `mechanism`.

**Ejemplo (Argentina):**
```javascript
[
  "reservas internacionales",
  "base monetaria",
  "tipo de cambio nominal (fijo por ley)",
  "demanda agregada",
  "expectativas de devaluación"
]
```

**Validación:** Si `mechanism` menciona "presión sobre reservas" y `affectedVariables` incluye "reservas internacionales", ✓ válido (sinonimia semántica aceptada).

---

### 4. feedbackLoop (≤350 caracteres)

**¿Qué es?**  
La dinámica de **retroalimentación no lineal**: cómo la reacción inicial amplifica o amortigua el shock.

**¿Qué NO es?**  
Una repetición del mechanism. Es lo que **pasa después**.

**Diferencia clave:**
- **mechanism:** shock inicial → respuesta inicial
- **feedbackLoop:** cómo la respuesta inicial desata dinámicas que amplif ican o amortiguan el shock

**Ejemplo (Argentina):**
```
Expectativas de ruptura del régimen → corridas de depósitos 
(conversión a dólares) → aún más caída de reservas → espiral 
contraccionista de base monetaria → depresión de actividad → 
mayor presión fiscal → inconsistencia se hace evidente → colapso 
final diciembre 2001.
```

**Ejemplo opuesto (Chile):**
```
Buffer fiscal gastado contracíclicamente → demanda cae menos → 
empleo se sostiene → credibilidad en regla fiscal se refuerza 
(deuda no explota) → expectativas de inflación no se desanclan 
→ BC mantiene tasa baja sin riesgo → recuperación hacia fines 2009.
```

---

### 5. policyFeasibility (≤300 caracteres)

**¿Qué es?**  
Las restricciones políticas, técnicas o institucionales que condicionan la respuesta de la institución al shock.

**¿Qué NO es?**  
Una descripción genérica ("hay presiones políticas"). Debe ser **específica al episodio**.

**Ejemplo (Argentina):**
```
Ley de Convertibilidad rigidiza política monetaria; BC sin 
discreción para responder contracíclicamente; presión política 
creciente por expansión fiscal provincial que erosiona 
consistencia macro; dependencia crítica de capital externo.
```

**Ejemplo (Chile):**
```
BC autónomo con meta de inflación consolidada desde 2000; regla 
fiscal flexible pero creíble (balance estructural) permite 
reacción contracíclica; TC flexible absorbe volatilidad; FEES 
acumulado predeterminadamente reduce restricción de caja.
```

---

### 6. incidence (≤250 caracteres)

**¿Qué es?**  
A **quién golpea el shock en primer lugar** y cómo se **distribuye el ajuste** entre sectores y grupos sociales.

**¿Qué NO es?**  
Una historia de "todos sufren igual". El foco es en **quién sufre primero y desigualmente**.

**Estructura recomendada:**
```
Shock golpea [sector/grupo específico] → luego se distribuye a 
[otros sectores/grupos]; distribución [equitativa/desigual/asimétrica]
```

**Ejemplo (Argentina):**
```
Shock golpea primero exportables (agricultura, manufactura) cuya 
competitividad se erosiona; luego caída agregada, desempleo 
manufacturing urbana, presión salarial formal y crisis de 
financiamiento de pymes.
```

**Nota:** Las cifras duras (desempleo 18%, etc.) van en `discriminatingEvidence`, no aquí.

---

### 7. discriminatingEvidence (≤400 caracteres)

**¿Qué es?**  
**Números, fechas y hechos específicos del episodio** que confirman o refutan que el mecanismo operó como se predice.

**¿Qué NO es?**  
Interpretación teórica. Es **evidencia empírica cruda** del episodio.

**Estructura recomendada:**
```
Variable X: valor_1 en fecha_1 → valor_2 en fecha_2. 
Variable Y: valor_1 en fecha_1 → valor_2 en fecha_2. 
Fuente: [Instituto/Organismo oficial]
```

**Ejemplo (Argentina):**
```
Reservas internacionales caen de US$ 26 mil millones (1992, pico) 
a US$ 10 mil millones (2001); desempleo abierto sube de 7% (1995) 
a 18% (2002); deuda externa representa 52% del PIB en 2001; default 
diciembre 2001; devaluación 200%+ en enero-febrero 2002. 
Fuentes: BCRA, INDEC, Mussa (2002).
```

---

### 8. antiOverclaim (≤500 caracteres)

**¿Qué es?**  
Aclaraciones explícitas sobre **qué NO captura MacroLab**, **qué es inferencia pedagógica pura**, y **límites de la extrapolación**.

**¿Qué NO es?**  
Una disculpa. Es una **limitación conceptual honesta**.

**Estructura recomendada:**
```
MacroLab NO captura: (i) [mecanismo/fenómeno 1], 
(ii) [mecanismo/fenómeno 2], (iii) [mecanismo/fenómeno 3]. 
La ficha ilustra [lo que sí muestra]; no [lo que no muestra].
```

**Ejemplo (Argentina):**
```
MacroLab NO captura: (i) dinámicas de corridas y contagio 
financiero que rompen regímenes rígidamente creíbles (Calvo 1998); 
(ii) costos políticos de desempleo masivo que pueden presionar por 
salida del régimen (Alesina & Drazen 1991); (iii) interacción entre 
rigidez cambiaria e inconsistencia fiscal como juego temporal. 
La ficha ilustra por qué la rigidez sin coherencia fiscal acumula 
tensión; no predice el timing exacto de colapso.
```

---

## Ejemplo anotado: Argentina 2001–2002

### Contexto histórico
- Ley de Convertibilidad (1991–2002): paridad fija 1 ARS = 1 USD
- Crisis rusa 1998 + devaluación Brasil enero 1999
- Acumulación de tensiones: déficit fiscal, deuda creciente, salarios rígidos
- Desenlace: corralito diciembre 2001, default, devaluación 200%+

### institutionalLayer completo

```javascript
"argentina_convertibility": {
  // ... campos de crónica (titulo, sub, preguntaGuia, cronica, caveat, fuentes)
  
  institutionalLayer: {
    institution: 
      "Ley de Convertibilidad (1991–2002): régimen de paridad fija 1 ARS/USD sin discretion en Banco Central; dependencia de entradas de capital externo; estructura de deuda pública dolarizada.",
    
    mechanism: 
      "Shock externo (crisis rusa 1998, devaluación Brasil 1999) → caída de salida de capital → presión sobre reservas internacionales → bajo Convertibilidad, BC no puede expandir monetariamente sin dólares → base monetaria se contrae mecánicamente → demanda agregada cae → desempleo sube. Sin devaluación posible, ajuste real traumático y expectativas de ruptura aumentan.",
    
    affectedVariables: [
      "reservas internacionales",
      "base monetaria",
      "tipo de cambio nominal (fijo por ley)",
      "demanda agregada",
      "expectativas de devaluación"
    ],
    
    feedbackLoop: 
      "Expectativas de ruptura del régimen → corridas de depósitos (conversión a dólares) → aún más caída de reservas → espiral contraccionista de base monetaria → depresión de actividad → mayor presión fiscal → inconsistencia se hace evidente → colapso final en diciembre 2001.",
    
    policyFeasibility: 
      "Ley de Convertibilidad rigidiza política monetaria; BC sin discreción para responder contracíclicamente; presión política creciente por expansión fiscal provincial que erosiona consistencia macro; dependencia crítica de capital externo para mantener reservas.",
    
    incidence: 
      "Shock golpea primero exportables (agricultura, manufactura) cuya competitividad se erosiona; luego caída agregada, desempleo manufacturing urbana, presión salarial formal y crisis de financiamiento de pymes.",
    
    discriminatingEvidence: 
      "Reservas internacionales caen de US$ 26 mil millones (1992, pico) a US$ 10 mil millones (2001); desempleo abierto sube de 7% (1995) a 18% (2002); deuda externa representa 52% del PIB en 2001; default de deuda soberana declarado diciembre 2001 bajo Ley 25.561; devaluación de 200%+ en enero-febrero 2002 vs USD. Fuentes: BCRA, INDEC, Mussa (2002).",
    
    antiOverclaim: 
      "MacroLab NO captura: (i) dinámicas de corridas y contagio financiero que rompen regímenes rígidamente creíbles (Calvo 1998); (ii) costos políticos de desempleo masivo que pueden presionar por salida del régimen (Alesina & Drazen 1991); (iii) interacción entre rigidez cambiaria e inconsistencia fiscal como juego temporal. La ficha ilustra por qué la rigidez sin coherencia fiscal acumula tensión; no predice el timing exacto de colapso."
  }
}
```

### Anotaciones sobre cada campo

**institution:** Específico (Ley 23.928 + paridad fija), no genérico ("banco central").

**mechanism:** 5 pasos causales encadenados. Cada variable en `affectedVariables` aparece semánticamente aquí.

**affectedVariables:** 5 variables. Todas mencionadas semánticamente en `mechanism`.

**feedbackLoop:** Describe **cómo** la caída inicial de reservas desata una espiral contraccionista. No repite mechanism.

**policyFeasibility:** 3 restricciones específicas al episodio (rigidez legal, presión política, dependencia de capital).

**incidence:** Orden de afectación: primero exportables, luego agregado, luego salarios formales y pymes.

**discriminatingEvidence:** Números reales (reservas, desempleo, deuda, fechas). Fuentes.

**antiOverclaim:** 3 límites del modelo + aclaración de qué sí muestra vs qué no.

---

## Ejemplo anotado: Chile 2008–2009

### Contexto histórico
- Crisis financiera global late 2008
- FEES acumulado: US$ 20.211 millones (15% PIB)
- Regla de balance estructural (fiscal creíble)
- BC autónomo con meta de IT (2-4%)
- Respuesta: TPM baja 775 pb, gasto fiscal 2,8% PIB
- Resultado: actividad cae 1,6% en 2009, recupera 5,1% en 2010, sin desanclaje de expectativas

### institutionalLayer completo

```javascript
"chile_2008_2009": {
  // ... campos de crónica
  
  institutionalLayer: {
    institution: 
      "BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible.",
    
    mechanism: 
      "Shock externo (crisis financiera global → caída de precios de cobre) → ingresos por divisas bajan → presión inicial en TC pero flexible → BC reduce TPM (775 pb entre ene-jun 2009) con credibilidad en meta de IT → Gobierno usa buffer FEES para gasto anticíclico (2,8% PIB) sin quebrantar regla fiscal → Si credibilidad en BC y regla fiscal es alta, mercados no anticipan inflación ni insostenibilidad → demanda se amortigua sin desanclaje de expectativas.",
    
    affectedVariables: [
      "tasa de política monetaria (TPM)",
      "expectativas de inflación 12-24 meses",
      "tipo de cambio nominal",
      "gasto fiscal/demanda agregada",
      "actividad económica y empleo"
    ],
    
    feedbackLoop: 
      "Buffer fiscal gastado contracíclicamente → demanda cae menos que en otro escenario → empleo se sostiene → credibilidad en regla fiscal se refuerza (deuda no explota) → expectativas de inflación no se desanclan → BC mantiene tasa baja sin riesgo → recuperación hacia fines 2009 sin inflación posterior.",
    
    policyFeasibility: 
      "BC autónomo con meta de inflación consolidada desde 2000; regla fiscal flexible pero creíble (balance estructural) permite reacción contracíclica; TC flexible absorbe volatilidad externa; FEES acumulado predeterminadamente en bonanza reduce restricción de caja.",
    
    incidence: 
      "Shock golpea sector cuprífero y exportables; estímulo fiscal (transferencias, subsidios empleo) amortigua caída de empleo formal/informal; distribución más equitativa que sin buffer.",
    
    discriminatingEvidence: 
      "TPM baja de 3,25% a 0,5% entre enero y junio 2009; inflación anual alcanza 1,4% en 2009 (bajo rango meta 2-4%); desempleo sube de 7% a 10,1% pero sin espiral; expectativas de inflación a 12-24m se mantienen en rango 2,5-3,5%, sin desanclaje. PIB cae 1,6% en 2009 pero rebota a 5,1% en 2010. FMI califica respuesta como 'vigorosa, coordinada'. Fuentes: INE, DIPRES, BCCh.",
    
    antiOverclaim: 
      "MacroLab NO captura: (i) dinámicas de reputación y construcción de credibilidad que permitieron el uso del buffer (De Gregorio & Valev 2003); (ii) ciclos políticos y costos electorales de políticas contracíclicas (Alesina & Passalacqua 2016); (iii) dependencia de la acumulación previa del buffer en rentas de recursos naturales. La ficha ilustra cómo credibilidad + buffer + regla fiscal amortiguan transmisión; no es modelo general ni prescriptivo."
  }
}
```

### Anotaciones

**institution:** Énfasis en **3 patas**: BC autónomo, regla fiscal creíble, FEES acumulado. No genérico.

**mechanism:** Contraste con Argentina: shock → BC PUEDE responder (credibilidad) → gobierno PUEDE gastar (buffer + regla). Ambas cosas juntas evitan desanclaje.

**affectedVariables:** 5 variables enlazadas a través del mechanism. Presencia semántica (no necesariamente literal) en mechanism.

**feedbackLoop:** El **opuesto** de Argentina. Aquí la dinámica es de **refuerzo positivo** (credibilidad se refuerza), no espiral negativa.

**policyFeasibility:** Énfasis en **fortalezas** institucionales, no restricciones.

**incidence:** Distribución más equitativa gracias al estímulo fiscal.

**discriminatingEvidence:** Números que muestran **ausencia** de desanclaje (expectativas se mantuvieron bajas), a diferencia de Argentina.

**antiOverclaim:** Advertencia: el éxito de Chile NO se debe solo al simulador; depende de decisiones de política previa (acumular buffer) que no se transfieren automáticamente.

---

## Checklist de validación

Antes de mergear cualquier institutionalLayer a production, verificar:

### Sintaxis
- [ ] El archivo `.js` pasa `node -c` sin errores
- [ ] Los 8 campos están presentes (sin omisiones)
- [ ] Las comillas, corchetes y llaves están balanceadas

### Límites de caracteres (schema v1.1 — Unicode)
- [ ] `institution`: ≤200 caracteres
- [ ] `mechanism`: ≤500 caracteres
- [ ] `feedbackLoop`: ≤350 caracteres
- [ ] `policyFeasibility`: ≤300 caracteres
- [ ] `incidence`: ≤250 caracteres
- [ ] `discriminatingEvidence`: ≤400 caracteres
- [ ] `antiOverclaim`: ≤500 caracteres

**Herramienta correcta:** `python3 -c "print(len('texto del campo'))"` — NO `wc -c`

### Consistencia interna
- [ ] `affectedVariables` (max 5) está mencionado semánticamente en `mechanism`
- [ ] `mechanism` incluye cadena shock→variable→institución→credibilidad→expectativas
- [ ] `feedbackLoop` conecta lógicamente con `mechanism` (no repite)
- [ ] `antiOverclaim` está en negativo (qué NO captura MacroLab)

### Contenido factual
- [ ] `discriminatingEvidence` incluye números/fechas reales del episodio
- [ ] Números y datos se pueden verificar en fuentes mencionadas (BCRA, INE, DIPRES, etc.)
- [ ] No hay especulación sin base en `mechanism`

### Pedagogía
- [ ] Cada campo es específico al episodio, no genérico
- [ ] Un estudiante que lee esto entiende **por qué** las instituciones importaron en este episodio
- [ ] Los límites de MacroLab están claros en `antiOverclaim`

---

## Preguntas frecuentes

### P: ¿Por qué 8 campos y no más/menos?

**R:** 8 campos representan la cadena pedagógica obligatoria:
1. **institution** — qué instituye estructura
2. **mechanism** — cómo opera la cadena causal
3. **affectedVariables** — variables clave
4. **feedbackLoop** — dinámicas no lineales
5. **policyFeasibility** — restricciones políticas
6. **incidence** — distribución de costos
7. **discriminatingEvidence** — confirmación empírica
8. **antiOverclaim** — honestidad sobre límites

Más campos = información redundante. Menos = pérdida de estructura.

### P: ¿Si excedo los límites en un campo, puedo simplemente acortarlo?

**R:** Sí, pero **preservando especificidad**. No convirtas:
```
"Ley de Convertibilidad (1991–2002): régimen de paridad fija 1 ARS/USD sin discretion en BC"
```
en:
```
"Banco Central argentino"  ← Pierdes toda la especificidad
```

Acorta eliminando redundancias, no especificidad.

### P: ¿Cuál es la herramienta correcta para contar caracteres?

**R:** `python3 -c "print(len('texto del campo'))"`. Nunca `wc -c` (cuenta bytes UTF-8, no caracteres Unicode). Para texto en español con acentos, `wc -c` subestima el conteo real en ~15–25%.

### P: ¿Puedo no rellenar todos los 8 campos?

**R:** No. Los 8 son obligatorios. Si uno no aplica, REPORTAR como inconsistencia, no dejarlo en blanco.

### P: ¿Quién valida estos campos antes de mergear a production?

**R:** 
1. **Claude Code** (Día 1): valida sintaxis y límites de caracteres
2. **Editorial audit skill** (Día 4-5): valida contenido pedagógico y congruencia con literatura
3. **Pável** (manual final): valida hechos históricos y consistencia macro-pedagógica

### P: ¿Puedo reutilizar textos de mechanism entre crónicas?

**R:** No. Cada mecanismo es específico al episodio. Aunque dos episodios compartan estructura (p.ej. ambos son "rigidez cambiaria"), sus mecanismos diferirán en detalles.

### P: ¿Cómo valido que `affectedVariables` está en `mechanism`?

**R:** Búsqueda semántica (no necesariamente literal). Si `mechanism` dice:
```
"presión sobre reservas internacionales"
```
y `affectedVariables` incluye:
```
"reservas internacionales"
```
✓ Válido (presencia semántica). Si hay sinonimia clara ("cantidad de dinero" ≈ "base monetaria"), también ✓ válido.

---

**Última actualización:** 2026-05-19 (schema v1.1 — límites en caracteres Unicode)  
**Documentación versión:** 1.1  
**Para consultas:** Véase DIA_1_PROTOCOLO_COMPLETO.md
