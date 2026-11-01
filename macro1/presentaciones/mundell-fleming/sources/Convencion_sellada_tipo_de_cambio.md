# Convención sellada del tipo de cambio (E = CLP/USD)

**Paquete:** `MAC-GRAPH-MVP` · **ID:** `GOB-CONV-E` · **Estado:** SELLADA · **Fecha:** 2026-07-23
**Aplica a:** todos los bloques, notas, ayudantías, pruebas y a MacroLab. Resuelve el crítico **BL-01** de la auditoría.

> Esta hoja es la **fuente única de verdad** para el tipo de cambio en todo el curso. Cualquier material que no la respete se reabre y corrige.

---

## 1. La convención (chilena, cotización directa)

- **Símbolo:** `E`.
- **Definición:** **E = CLP/USD = número de pesos chilenos por dólar** (cotización directa, la que usa el Banco Central y la que ve la gente: "el dólar está a $950").
- **E ↑ = DEPRECIACIÓN** del peso (el dólar cuesta más pesos; el peso vale menos).
- **E ↓ = APRECIACIÓN** del peso (el dólar cuesta menos pesos; el peso vale más).

Esta es exactamente la convención que ya usan tus propias pruebas: la Solemne 2 (11-nov-2025) define depreciación como **"más pesos por dólar"**, y el Examen (9-jul-2025) describe una apreciación como que **"cae el valor del dólar"**. También es la que usa **MacroLab** ("dólar sube → E↑ → NX cambia"). Sellar E = CLP/USD no cambia nada de tu material; lo **unifica y lo hace explícito**.

---

## 2. Consecuencias de signo (memorizar y verificar en cada ejercicio)

| Relación | Signo | Lectura |
|---|---|---|
| Exportaciones netas vs E | `XN = x0 − x1·Y + x2·E`, **x2 > 0** | Depreciación (E↑) **mejora** XN (exporta más, importa menos) |
| Término de E en la IS | **+β·E** (β > 0) | E↑ ⇒ Y↑ vía XN |
| Término de la tasa en la IS | **−α·i** (α > 0) | i↑ ⇒ Y↓ vía inversión |
| Escala de la tasa | en **%** (i* = 6 significa 6 %) | no usar 0,06 con coeficientes calibrados en % |

> Regla operativa: en la forma lineal **`Y = a − α·i + β·E`**, el signo de E es **positivo** y el de i **negativo**. Si en un ejercicio aparecen invertidos, la convención está mal aplicada (ABR-ERR-01).

---

## 3. Auditoría de consistencia en los materiales

| Material | Uso de E | Estado |
|---|---|---|
| Ayudantía 11 (IS-LM-BP) | `XN = 50 − 0,10Y + 0,30E` (x2 > 0); E↑ = depreciación | ✅ consistente — es la referencia |
| Solemne 2 (11-nov-2025) | "depreciación = más pesos por dólar" | ✅ consistente |
| Examen (9-jul-2025) | apreciación = "cae el valor del dólar" (ΔG en flexible) | ✅ consistente |
| MacroLab | "dólar sube → E↑ → NX cambia → IS-LM-BP" | ✅ consistente |
| Nota de Estudio 10 (visión integrada) | revisar que el término de E en la IS aparezca con **+** | ⚠️ verificar y anotar la convención en el encabezado |
| Bloque `ABR` de este paquete | convención sellada en §0 | ✅ ya incorpora esta hoja |

**Acción pendiente (edición de originales):** agregar, en el encabezado de cada nota de economía abierta, la línea *"Convención: E = CLP/USD; E↑ = depreciación; x2 > 0"* y verificar que ningún gráfico ni ecuación use la cotización inversa (USD/CLP). No se detectaron inversiones de signo en los materiales revisados; el riesgo es de **omisión de la declaración**, no de error de signo.

---

## 4. Frase estándar para insertar en cada material

> **Convención de tipo de cambio (curso Macro 1, UFT).** Usamos `E = CLP/USD` (pesos por dólar, cotización directa chilena). Una subida de E es una **depreciación** del peso y **mejora** las exportaciones netas (`XN = x0 − x1·Y + x2·E`, con `x2 > 0`). Las tasas se expresan en porcentaje.

---
*Sellada el 2026-07-23. Consistente con Ayudantía 11, Solemnes/Examen 2025 y MacroLab. Referencia única para todo el paquete.*
