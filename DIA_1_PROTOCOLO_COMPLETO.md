# DÍA 1: Definir Schema de institutionalLayer
## Protocolo Completo para Claude Code

**Fecha:** 2026-05-20  
**Responsable:** Claude Code (instrucciones explícitas paso a paso)  
**Objetivo:** Definir y validar schema institutionalLayer + crear 2 ejemplos completamente documentados  
**Duración estimada:** 4–6 horas  
**Tokens:** ~15k–20k (se minimizan retrabajos con protocolo explícito)

> **Nota schema v1.1 (2026-05-19):** Los límites de caracteres se actualizaron de bytes UTF-8 (`wc -c`) a caracteres Unicode (`python3 len()` / JS `string.length`). Los límites en este documento ya reflejan los valores v1.1.

---

## 1. ESTADO ACTUAL DEL REPO (Análisis sin asunciones)

### 1.1 Archivo canónico de crónicas
**Ubicación:** `content/cronicas-registry.es-ES.js`

**Estado:**
- Contiene 8 crónicas (confirmadas):
  1. `chile_2021_2024`
  2. `turkey_2018_2023`
  3. `argentina_convertibility` ← EJEMPLO 1 (Argentina 2001–2002)
  4. `chile_2008_2009` ← EJEMPLO 2
  5. `noruega_2020`
  6. `argentina_2020`
  7. `suecia_1994_1998`
  8. `grecia_2010_2015`

**Estructura actual de cada crónica:**
```javascript
"clave_cronica": {
  titulo: "string",
  sub: "string",
  preguntaGuia: "string",
  cronica: ["párrafo 1", "párrafo 2", "párrafo 3"],
  caveat: "string",
  fuentes: [{ texto: "string", url: "string" }, ...]
}
```

**Campos existentes:** 6 (titulo, sub, preguntaGuia, cronica, caveat, fuentes)  
**Campos a añadir:** 1 nuevo campo de nivel superior = `institutionalLayer` (objeto con 8 subpropiedades)

### 1.2 Archivos relacionados (NO se tocan en Día 1)
- `narrative-layer.js` — se modifica en Día 3
- `atlas-lentes-institucionales.html` — se modifica en Día 4
- `script.js` — NO se toca (mantener intacto)

---

## 2. DEFINICIÓN FORMAL DEL SCHEMA institutionalLayer

### 2.1 Estructura general
Cada crónica tendrá un nuevo campo `institutionalLayer` (objeto) con 8 propiedades obligatorias:

```javascript
institutionalLayer: {
  institution: "string",
  mechanism: "string",
  affectedVariables: ["var1", "var2", ...],
  feedbackLoop: "string",
  policyFeasibility: "string",
  incidence: "string",
  discriminatingEvidence: "string",
  antiOverclaim: "string"
}
```

### 2.2 Definición de cada campo (límites schema v1.1 — caracteres Unicode)

| Campo | Tipo | Límite v1.1 | Descripción | Ejemplo |
|-------|------|-------------|-------------|---------|
| **institution** | string | ≤200 caracteres | Qué institución(es) son el foco | "BC de Chile con IT (2-4%), independencia desde 1989; gobierno con regla de balance estructural y FEES acumulado; TC flexible." |
| **mechanism** | string | ≤500 caracteres | El mecanismo causal explícito (shock → variable → institución → expectativa) | "Shock externo → BC reduce TPM con credibilidad en meta IT → Gobierno usa FEES para gasto anticíclico → mercados no anticipan inflación → demanda se amortigua sin desanclaje de expectativas." |
| **affectedVariables** | array de strings | Max 5 elementos | Variables que controla la institución o que responden a ella | ["tasa de política monetaria (TPM)", "expectativas de inflación 12-24 meses", "tipo de cambio nominal"] |
| **feedbackLoop** | string | ≤350 caracteres | Cómo la dinámica de expectativas amplifica o amortigua el shock inicial | "Buffer fiscal gastado contracíclicamente → demanda cae menos → empleo se sostiene → credibilidad se refuerza → expectativas no se desanclan → BC mantiene tasa baja sin riesgo → recuperación." |
| **policyFeasibility** | string | ≤300 caracteres | Restricciones políticas, técnicas o institucionales que condicionan la respuesta de la institución | "BC autónomo (por ley) con meta consolidada. Regla fiscal flexible pero creíble. TC flexible absorbe volatilidad externa." |
| **incidence** | string | ≤250 caracteres | A quién golpea de verdad el shock inicial y cómo se distribuye el ajuste | "Shock golpea sector cuprífero y exportables; estímulo fiscal amortigua caída de empleo formal/informal; distribución más equitativa que sin buffer." |
| **discriminatingEvidence** | string | ≤400 caracteres | Qué datos/evidencias EN EL EPISODIO confirman o refutan que el mecanismo operó | "TPM baja de 3,25% a 0,5% entre ene-jun 2009; inflación 1,4% en 2009 (bajo rango meta 2-4%); desempleo sube de 7% a 10,1% sin espiral; expectativas a 12-24m: 2,5-3,5%, sin desanclaje. Fuentes: INE, DIPRES, BCCh." |
| **antiOverclaim** | string | ≤500 caracteres | Qué NO captura MacroLab; qué es inferencia pedagógica pura; límites de la extrapolación | "MacroLab NO captura: (i) dinámicas de reputación (De Gregorio & Valev); (ii) costos políticos de desempleo (Alesina-Drazen); (iii) cambios de régimen mid-episodio. Ilustra el mecanismo de credibilidad; no predice otros casos." |

### 2.3 Reglas de consistencia

1. **Mechanism debe incluir la cadena completa:** shock → variable(s) → institución → cómo credibilidad altera expectativas
2. **affectedVariables debe estar en el mechanism.** No pueden haber variables listadas que no se mencionen (semánticamente) en el texto del mecanismo.
3. **feedbackLoop debe conectar al mechanism.** Describe la dinámica NO lineal que emerge.
4. **policyFeasibility debe ser específica al episodio,** no genérica.
5. **discriminatingEvidence debe citar números/hechos** del episodio, no solo descriptivos.
6. **antiOverclaim debe estar en negativo** (qué NO captura) para evitar overclaims.

---

## 3. PROTOCOLO DE TRABAJO PASO A PASO

### Paso A: Preparación (Sin escribir código aún)

**A.1. Leer el presente documento en su totalidad.** Sin saltar secciones.

**A.2. Leer las 2 crónicas de ejemplo en el archivo actual:**
- `argentina_convertibility` en `content/cronicas-registry.es-ES.js`
- `chile_2008_2009` en `content/cronicas-registry.es-ES.js`

**A.3. Consultar ejemplos completados (en el repo):**
- `DIA_1_EJEMPLO_1_argentina_convertibility.js` — ficha ARG con institutionalLayer completo
- `DIA_1_EJEMPLO_2_chile_2008_2009.js` — ficha CHL con institutionalLayer completo

**A.4. Consultar documentación de referencia:**
- `DIA_1_DOCUMENTACION_COMPLETA.md` — guía de 8 campos + FAQ
- `DIA_1_institutionalLayer_schema.json` — schema formal JSON-Schema 2020-12

### Paso B: Crear el Schema (Con validación automática)

**B.1. Crear archivo:** `DIA_1_institutionalLayer_schema.json`

Contenido: Definición formal del schema en JSON Schema 2020-12 (para validar ejemplos después).

**B.2. Crear archivo:** `DIA_1_TEMPLATE_institutionalLayer.js`

Contenido:
- Template en JavaScript (como se verá en el registry final)
- Notas explicativas en comentarios para cada campo
- Indicadores de límite de caracteres (v1.1)

### Paso C: Crear Ejemplo 1 — Argentina Convertibilidad (1991–2002)

**C.1. Archivo:** `DIA_1_EJEMPLO_1_argentina_convertibility.js`

Contenido:
- La crónica COMPLETA argentina_convertibility (copiada de `content/cronicas-registry.es-ES.js`)
- + el nuevo campo `institutionalLayer` con los 8 subcampos rellenos

**C.2. Validación de Ejemplo 1:**
- Verificar que cada subcampo está dentro de límites de caracteres (v1.1)
- Verificar que `affectedVariables` está mencionado semánticamente en `mechanism`
- Verificar que `mechanism` incluye la cadena shock → variable → institución → expectativa
- Generar un checklist de validación

### Paso D: Crear Ejemplo 2 — Chile 2008–2009

**D.1. Archivo:** `DIA_1_EJEMPLO_2_chile_2008_2009.js`

Contenido:
- La crónica COMPLETA chile_2008_2009 (copiada de `content/cronicas-registry.es-ES.js`)
- + el nuevo campo `institutionalLayer` con los 8 subcampos rellenos

**D.2. Validación de Ejemplo 2:**
- (Mismo proceso que C.2)

### Paso E: Crear Documentación de Referencia

**E.1. Archivo:** `DIA_1_DOCUMENTACION_COMPLETA.md`

Contenido:
- Resumen ejecutivo (¿qué es institutionalLayer?)
- Schema formal (copiado de B.1, con límites v1.1)
- Guía de rellenado (instrucciones para editores futuros)
- Ejemplo anotado (argentina_convertibility + explicaciones de cada campo)
- Lista de validación (qué verificar antes de mergear a prod)

### Paso F: Crear Instrucciones para Claude Code (Próximo uso)

**F.1. Archivo:** `DIA_1_INSTRUCCIONES_PARA_CLAUDE_CODE.md`

Contenido:
- Cómo copiar los 2 ejemplos a `cronicas-registry.es-ES.js`
- Cómo validar sintaxis JavaScript
- Cómo testear que `window.MacroLabCronicasRegistryES` se expone correctamente
- Lista de comandos exactos a ejecutar

---

## 4. RESULTADOS ESPERADOS (Deliverables)

Al finalizar Día 1, debe existir en el repo:

```
MacroLab-Shock-Simulator/
├── DIA_1_institutionalLayer_schema.json        ← Schema formal JSON-Schema 2020-12 (v1.1)
├── DIA_1_TEMPLATE_institutionalLayer.js        ← Template vacío con comentarios
├── DIA_1_EJEMPLO_1_argentina_convertibility.js ← Crónica completa + institutionalLayer (ARG)
├── DIA_1_EJEMPLO_2_chile_2008_2009.js          ← Crónica completa + institutionalLayer (CHL)
├── DIA_1_DOCUMENTACION_COMPLETA.md             ← Guía + ejemplos + checklist (v1.1)
├── DIA_1_INSTRUCCIONES_PARA_CLAUDE_CODE.md     ← Cómo mergear y validar
├── DIA_1_PROTOCOLO_COMPLETO.md                 ← Este archivo (protocolo de trabajo)
├── DIA_1_RESUMEN_PARA_PAVEL.md                 ← Resumen ejecutivo para Pável
├── DIA_1_GUIA_RAPIDA.md                        ← Mapa de navegación de archivos
├── DIA_1_ERRORES_DETECTADOS.md                 ← Diagnóstico de correcciones aplicadas
├── DIA_1_VALIDACION_FINAL.md                   ← Checklist de validación completado
└── DIA_1_RESUMEN_EJECUTIVO.md                  ← Estado final del Día 1
```

**Validación de existencia:** `bash` script que lista los 12 archivos y verifica que no están vacíos.

---

## 5. VALIDACIÓN AUTOMÁTICA

### 5.1 Checklist sintáctico

```bash
# Cada archivo .js debe:
# - Contener "institutionalLayer: {"
# - Contener los 8 campos: institution, mechanism, affectedVariables, 
#   feedbackLoop, policyFeasibility, incidence, discriminatingEvidence, 
#   antiOverclaim
# - Tener corchetes/comillas balanceados
# - Pasar `node -c archivo.js`
```

### 5.2 Checklist semántico (Manual, pero explícito)

Para cada ejemplo (límites schema v1.1):
- [ ] `institution`: ≤200 caracteres, específico a episodio
- [ ] `mechanism`: ≤500 caracteres, incluye cadena shock→variable→institución→expectativa
- [ ] `affectedVariables`: max 5 elementos, todos mencionados semánticamente en mechanism
- [ ] `feedbackLoop`: ≤350 caracteres, conecta al mechanism, describe amplificación/amortiguación
- [ ] `policyFeasibility`: ≤300 caracteres, restricciones específicas del episodio
- [ ] `incidence`: ≤250 caracteres, quién sufre el shock y distribución del ajuste
- [ ] `discriminatingEvidence`: ≤400 caracteres, números/hechos del episodio
- [ ] `antiOverclaim`: ≤500 caracteres, límites del modelo en negativo

### 5.3 Herramienta de conteo correcta

```bash
# CORRECTO: caracteres Unicode (mismo que JS string.length)
python3 -c "print(len('texto del campo'))"

# INCORRECTO: bytes UTF-8 (sobreestima para texto en español)
echo -n "texto del campo" | wc -c
```

Las vocales acentuadas (á, é, í, ó, ú) y símbolos como → pesan 2-3 bytes en UTF-8 pero son **1 carácter Unicode**. Los límites del schema v1.1 están en caracteres Unicode.

---

## 6. NOTA SOBRE TOKENS Y EFICIENCIA

### Reducción de retrabajos
Este protocolo minimiza iteraciones porque:

1. **Especificidad:** Cada campo tiene límite de caracteres → evita redacciones recurrentes
2. **Validación previa:** Checklists se completan ANTES de mergear → evita rechazos post-merge
3. **Ejemplos anotados:** Los 2 casos sirven de template → reutilización para otros 6 episodios

### Token budget para Día 1
- Lectura del protocolo + archivos: ~2k tokens
- Crear schema.json: ~1k tokens
- Crear template.js: ~1.5k tokens
- Crear ejemplo 1 argentina (escritura + validación): ~5k tokens
- Crear ejemplo 2 chile (escritura + validación): ~5k tokens
- Documentación + instrucciones: ~3k tokens
- **Total estimado: ~17.5k tokens**

Mantener bajo este presupuesto es posible si se sigue el protocolo SIN creatividad adicional (= solo rellenar template, no inventar nuevos campos).

---

## 7. PRÓXIMO PASO: DÍA 2

```
DÍA 2 (2026-05-20)
└─ Editar cronicas-registry.es-ES.js
   └─ Añadir institutionalLayer a las 6 crónicas restantes:
      chile_2021_2024, turkey_2018_2023, noruega_2020,
      argentina_2020, suecia_1994_1998, grecia_2010_2015
   └─ Validación: node -c + python3 len() por campo
   └─ Commit a rama feature/institutional-layer-pilot
```

**Archivos fuente para Día 2:**
- `DIA_1_EJEMPLO_1_argentina_convertibility.js` → como modelo para crónicas similares (rigidez cambiaria)
- `DIA_1_EJEMPLO_2_chile_2008_2009.js` → como modelo para crónicas con buffer fiscal
- `DIA_1_TEMPLATE_institutionalLayer.js` → template para las 6 crónicas restantes
- `DIA_1_DOCUMENTACION_COMPLETA.md` → referencia de reglas y FAQ

---

**Documentación:** Este protocolo es el documento único de verdad para Día 1.  
**Última actualización:** 2026-05-19 (schema v1.1 — límites en caracteres Unicode)  
**Autor:** Análisis de primera capa + decisiones ejecutivas del proyecto
