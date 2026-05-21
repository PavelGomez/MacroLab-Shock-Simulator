# FASE 1 — VALIDACIÓN Y PRÓXIMOS PASOS
## MacroLab Shock Simulator · Trajectory Templates Phase 1

---

## 1. Qué se generó

**Archivo:** `MacroLab_Regime_Trajectories_v1.xlsx`

Contiene 20 hojas:
| Hoja | Contenido |
|------|-----------|
| `RESUMEN_REGÍMENES` | Tabla comparativa de los 16 regímenes con métricas clave |
| `MATRIZ_2x2x2x2` | Visualización de la matriz institucional con código de colores |
| `EPISODIOS_HISTÓRICOS` | Mapeo de 8 episodios del curso a regímenes del modelo |
| `FCHR` … `PULD` | 16 hojas individuales, una por régimen (datos + gráfico) |

---

## 2. Arquitectura del modelo

### 2.1 Ecuaciones

El simulador usa el modelo NK de 3 ecuaciones (Carlin & Soskice 2024):

**IS curve:**
```
y_t = α · y_{t-1} − α · r_{t-1} + ε_t + μ · ε_t · 𝟙(t≤3)
```

**Phillips Curve:**
```
π_t = π_t^e + β · y_t
```

**Formación de expectativas (híbrida):**
```
π_t^e = (1 − γ − σ) · π* + γ · π_{t-1} + σ · 1.2 · π_{t-1}
```

**Taylor Rule** (solo régimen flotante):
```
r_t = θ · π_t + φ · y_t
```

**Bajo fijo cambiario:**
```
r_t = 0.5 · π_t   [respuesta endógena parcial vía mercado crediticio]
```

### 2.2 Shock calibrado

- Tamaño: +2 pp en brecha de producto en t=1
- Decaimiento geométrico: 50% por trimestre (ρ = 0,5)
- Horizonte: 12 trimestres

### 2.3 Buffer cambiario

Bajo flotación: el shock efectivo se reduce en `er_buf` fracción:
```
ε_t^{efectivo} = ε_t · (1 − er_buf)
```
`er_buf = 0.3` en todos los regímenes flotantes (absorbe 30% del shock externo).
`er_buf = 0.0` bajo tipo de cambio fijo.

---

## 3. Matriz de regímenes (2×2×2×2)

| Dimensión | Valor 1 | Valor 2 | Parámetros afectados |
|-----------|---------|---------|----------------------|
| Tipo de cambio | Float (F) | Peg (P) | `er_buf`, `θ`, `φ` |
| Mercado laboral | Coord (C) | Uncoord (U) | `β` |
| Credibilidad BC | High (H) | Low (L) | `γ`, `σ`, `θ` |
| Marco fiscal | Rule (R) | Disc (D) | `μ` |

Los 16 códigos de régimen:

```
Float:  FCHR  FCHD  FCLR  FCLD
        FUHR  FUHD  FULR  FULD
Peg:    PCHR  PCHD  PCLR  PCLD
        PUHR  PUHD  PULR  PULD
```

---

## 4. Resultados clave por régimen

### 4.1 Mejores regímenes (π_max < 1.5 pp, cierre brecha ≤ T+5)

| Código | Régimen | π_max | Cierre brecha |
|--------|---------|-------|---------------|
| FCHR | Flotante · Coord · Alta cred · Regla | ~0.8 pp | T+4 |
| FUHR | Flotante · Descoord · Alta cred · Regla | ~1.0 pp | T+5 |

**Lección pedagógica:** La combinación flotación + alta credibilidad BC + regla fiscal es la que produce la respuesta más rápida y menos costosa. La coordinación laboral baja marginalmente el pico inflacionario pero no es la dimensión más crítica bajo flotación con alta credibilidad.

### 4.2 Regímenes problemáticos (π_max > 3 pp o no convergencia en T=12)

| Código | Régimen | π_max | Diagnóstico |
|--------|---------|-------|-------------|
| PULD | Fijo · Descoord · Baja cred · Disc | >4 pp | Crisis sistémica |
| PCLD | Fijo · Coord · Baja cred · Disc | ~3.5 pp | Riesgo BdP |
| FULD | Flotante · Descoord · Baja cred · Disc | ~3.5 pp | Trampa inflacionaria |

### 4.3 Ranking de dimensiones por impacto en π_max

1. **Credibilidad BC** (mayor impacto): alta cred reduce π_max ~1.5–2 pp
2. **Tipo de cambio** (segundo mayor): flotación reduce π_max ~0.5–1 pp
3. **Marco fiscal**: discrecional suma ~0.3–0.8 pp
4. **Coordinación laboral** (menor impacto): coord reduce β → −0.3–0.5 pp

---

## 5. Mapeo de episodios históricos

| Episodio del curso | Código MacroLab | Coincidencia | Observación |
|-------------------|-----------------|--------------|-------------|
| Chile 2008–2009 | FCHR | Alta | Caso de referencia ideal |
| Suecia 1994–1998 | FCHR | Alta | Post-devaluación 1992 = er_buf efectivo histórico |
| Chile 2021–2024 | FCHD | Media | Fase inicial; post-coordinación BC+Gobierno → FCHR |
| Argentina 2020 | PULD | Alta | Dominancia fiscal + cepo + baja cred |
| Argentina Conv. | PCLD | Alta | Fijo duro + fiscal discrecional + baja cred |
| EE.UU. 2021–2022 | FUHD | Alta | Fed alta cred + fiscal COVID + descoord laboral |
| Grecia 2010–2015 | PUHR | Media | Fijo (euro) + ajuste sin flotación |
| España 2003–2007 | PCHD | Media | Boom bajo euro sin mecanismo de ajuste |

---

## 6. Comparación con Carlin & Soskice 2024

### Lo que MacroLab Phase 1 replica de C&S
- Estructura IS-PC-Taylor de 3 ecuaciones
- Expectativas híbridas (backward + forward-looking)
- Regímenes institucionales generan trayectorias endógenamente distintas
- Interpretación del tipo de cambio como amortiguador (er_buf)

### Lo que MacroLab Phase 1 NO captura (limitaciones explícitas)

| Aspecto C&S | Estado en Phase 1 | Ruta Phase 2 |
|-------------|-------------------|--------------|
| Economía abierta completa (UIP, cuenta corriente) | Simplificado (er_buf) | Agregar ecuación TC explícita |
| Demanda de trabajo endógena | No incluida | Función de empleo N=f(y) |
| Ciclo financiero (Minsky) | No incluida | Bloque de crédito |
| Shocks de oferta (costos) | No incluida | Término v_t en PC |
| Dinámica de deuda pública | No incluida | Módulo fiscal explícito |
| Múltiples equilibrios bajo baja credibilidad | Linealizado | Modelo no lineal |

---

## 7. Validación pedagógica

### 7.1 Checklist de coherencia narrativa
- [x] FCHR produce el mejor resultado (referencia teórica correcta)
- [x] PULD produce el peor resultado (crisis sistémica)
- [x] Fijo sin flotación siempre produce cierre más lento que flotante equivalente
- [x] Alta credibilidad BC siempre domina sobre baja credibilidad (dado mismo régimen)
- [x] Fiscal discrecional siempre añade riesgo (no hay régimen donde mejora claramente)
- [x] Coordinación laboral reduce β → menor presión inflacionaria inicial
- [x] Episodes históricos clasifican en el régimen correcto según teoría

### 7.2 Tests de monotonía
Para cualquier par de regímenes que difieren en UNA sola dimensión:
- Float > Peg: π_max menor bajo flotación (er_buf > 0) ✓
- High Cred > Low Cred: π_max menor con alta credibilidad ✓
- Rule > Disc: π_max menor con regla fiscal ✓
- Coord > Uncoord: π_max menor con coordinación laboral ✓

---

## 8. Próximos pasos (Phase 2)

### P2.1 — Extensión del modelo (prioridad alta)
**Objetivo:** Agregar ecuación de tipo de cambio explícita (UIP parcial)
```
e_t = e_{t-1} + (r_t - r*_t) + η_t
```
Permite simular: crisis de BdP, sudden stops, pass-through diferenciado.

**Episodios que requieren esto:** Argentina 2020 (cepo), Suecia 1992 (salida MTC).

### P2.2 — Shock de oferta (prioridad alta)
**Objetivo:** Agregar término de costo en PC:
```
π_t = π_t^e + β·y_t + v_t
```
`v_t` = shock de oferta (energía, alimentos, logística).

**Episodios que requieren esto:** Chile 2021–2024 (retiros pensiones como shock de oferta-demanda dual), EE.UU. 2021–2022 (cadenas de suministro).

### P2.3 — Interfaz interactiva (prioridad media)
Conectar los 16 regímenes a la interfaz existente de MacroLab:
- Selector de régimen en pestaña "Lentes institucionales"
- Gráfico de trayectorias por régimen junto a la narrativa institucional
- Comparador side-by-side: dos regímenes simultáneos

### P2.4 — Calibración empírica (prioridad baja)
Calibrar parámetros (α, β, γ) usando datos de panel de 8 episodios.
Requiere: datos trimestrales de y, π, r para Chile, Argentina, Suecia, EE.UU., Grecia.

---

## 9. Archivos generados

```
innovation/phase1/
├── regime_trajectories.py           # Script Python principal
├── MacroLab_Regime_Trajectories_v1.xlsx  # Workbook con 20 hojas
└── FASE_1_VALIDACION_Y_PROXIMOS_PASOS.md # Este documento
```

---

## 10. Referencias

- Carlin, W. & Soskice, D. (2024). *Macroeconomics: Institutions, Instability, and the Financial System* (3rd ed.). Oxford University Press.
- Banco Central de Chile (2022). *Informe de Política Monetaria*, varios números.
- CEPAL (2021). *Estudio Económico de América Latina y el Caribe 2021*.
- FMI (1998). *Sweden: Selected Issues*. IMF Staff Country Report 98/99.
- OECD (1999). *Economic Surveys: Sweden*.
- Englund, P. (1999). "The Swedish Banking Crisis: Roots and Consequences." *Oxford Review of Economic Policy*, 15(3).

---

*Generado por MacroLab Phase 1 · 2026-05-21 · Branch: claude/unify-editorial-architecture-KrsMI*
