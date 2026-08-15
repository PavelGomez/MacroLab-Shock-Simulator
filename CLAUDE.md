# CLAUDE.md · MacroLab Shock Simulator

## Contexto del proyecto
Simulador pedagógico de macroeconomía para Chile.
Sitio estático: index.html + script.js + styles.css. Sin frameworks. Sin bundler.
Dependencia externa única: Chart.js (CDN).

**Arquitectura de dos capas** (distinguirlas antes de auditar o afirmar nada):
- **Capa superior** — Shock Simulator, raíz del repo. Publicada en
  `https://pavelgomez.github.io/MacroLab-Shock-Simulator/`.
  Pestañas: Inicio · Tablero macro · Lectura de datos · Shocks y transmisión ·
  **IS-LM** · **IS-LM-BP** · **OA-DA** · Atlas de shocks · Marco institucional ·
  Lentes institucionales · Comparador Phillips · Crónicas · Glosario · Instrucciones.
- **Capa inferior** — sub-app `macro1/` (Macroeconomía I). Cinco ventanas de
  laboratorio: `Lab · Índices`, `Lab · PIB por gasto`, `Lab · Mercado de bienes`,
  `Lab · Dinero / tasa`, `Lab · Mercado laboral`, más `Ruta por clases`.

> Auditar `macro1/index.html` y concluir que "no existe el módulo IS-LM" es un error
> de capa. Ocurrió el 2026-08-15. Verificar SIEMPRE en qué capa vive lo que se afirma.

## Arquitectura técnica
- SPA: todas las ventanas son `<section class="tab-panel">` dentro de index.html
- Navegación: `activateTab(target)` en script.js
- Shocks: objeto `ATLAS_SHOCKS`
- Cálculo: `calcISLM`, `calcISLMBP`, `calcOADA`

## ⚠ Capa de auditoría — obligatoria antes de cualquier commit

**Origen.** El 2026-08-15 se detectó que la pauta sellada de `ISLM-EX-03` de la
biblioteca de bloques tenía la IS mal despejada: `0,1Y = 160 − 5i` da **1.600**, y
el material decía 1.200. El error sobrevivió a revisión humana y sólo apareció al
confrontar la pauta con una segunda implementación (el solver del simulador).
Arrastraba además a `ISLM-EX-04`. También se corrigió un redondeo propagado en
`ISLM-EX-01` (`Y* = 5.564,6`, no 5.563,5).

**Regla.** Toda pauta sellada de la biblioteca debe coincidir con el solver del
simulador. La comprobación no depende de que alguien la recuerde:

```
node test_pautas_biblioteca.js     # 35 comprobaciones · pautas vs solvers
node scripts/check-manifest.js     # integridad del MANIFEST y visibilidad de notas
```

- **Hook de pre-commit:** `sh scripts/install-hooks.sh` (una vez por clon).
  Los hooks viven en `.git/hooks/`, que no se versiona.
- **CI:** `.github/workflows/auditoria-pautas.yml` corre ambos en cada push y PR.
- Si un test falla: **corregir la fuente, no el test**, y declarar el cambio.
- `git commit --no-verify` sólo con motivo declarado en el mensaje del commit.

## Estado de los solvers

`calcISLM(p, regime, taxMode='fixed')` — **modificada el 2026-08-15**. Antes recibía
dos argumentos. Ahora acepta un tercer parámetro de régimen tributario:

- `taxMode='fixed'` → `A = 1 − c₁ − b₁`, `K = c₀ − c₁·T + b₀ + G`  (comportamiento previo)
- `taxMode='proportional'` → `A = 1 − c₁(1−t) − b₁`, `K = c₀ + b₀ + G`

El valor por defecto preserva el comportamiento anterior, de modo que los llamadores
no actualizados siguen funcionando. `isCurve(p, taxMode)` recibió el mismo tratamiento.
`ISLM_DEFAULTS` incorpora `t: 0.20`; se agregó `ISLM_TAXMODES` y el selector
`#islm-taxmode` en index.html.

**Motivo pedagógico:** el impuesto proporcional es el estabilizador automático. Con la
calibración de `ISLM-EX-02`, subir `t` de 0,20 a 0,40 baja el multiplicador de 2,5 a
1,82 y amortigua el mismo `ΔG = +60` de `ΔY = 100` a `ΔY = 80`. Antes esto sólo podía
mostrarse con una equivalencia manual (`c₁ ← c₁(1−t)`), que inducía a error.

**Antes de tocar cualquier solver:** correr la auditoría, hacer el cambio, volver a
correrla. Si cambian cifras selladas, actualizar la biblioteca de bloques **y**
declarar el cambio en el bloque correspondiente.

## Notas del sub-app macro1

**Registrar una nota en `macro1/MANIFEST.json` NO la hace visible.** El MANIFEST no se
lee en runtime. Para que una nota aparezca hacen falta tres cosas:

1. el archivo en `macro1/notas/`
2. una fila en `macro1/notas/index.html`
3. un enlace en la tarjeta de la Ruta por clases de `macro1/index.html`

`scripts/check-manifest.js` verifica las tres. Los siete bloques de la biblioteca
(`nota-b1-medicion` … `nota-b7-mercado-laboral`) están publicados así desde v0.7.0.

## Convenciones de código
- JavaScript vanilla sin clases ES6 (funciones nombradas)
- CSS con variables en `:root`, sin preprocesadores
- Sin `innerHTML` sobre input del usuario
- Comentarios de sección: `/* ========== NOMBRE ========== */`
- IDs en kebab-case

## Variables CSS reutilizables
`--navy, --bg, --card, --line, --text, --muted, --accent, --accent-soft,
--green, --orange, --red, --purple, --blue, --shadow`

## Clases CSS reutilizables
`.card, .compact-card, .atlas-card, .atlas-field, .chip-rule, .chip-data,
.chip-warning, .home-grid, .tab-panel, .section-subhead, .notice-box`

## Convenciones de contenido (selladas · GOB-CONV-ED)
- Formato numérico chileno: coma decimal, punto de miles, espacio antes de `%`,
  signo menos tipográfico `−`
- Tipo de cambio: `E = CLP/USD`, con `E↑ = depreciación`, `x₂ > 0`
- Tasas en por ciento (`i* = 6` significa 6 %, no 0,06)
- **Coincidencia frente a regla:** si un resultado se cumple por la calibración y no
  por la estructura, declararlo donde aparece, en tres partes: resultado · condición
  paramétrica · dónde deja de cumplirse
- Todo dato de coyuntura lleva **fuente y fecha de publicación**
- No sobreatribuir al simulador: si una ventana no implementa algo, decirlo

## Sprint cerrado: "Lentes institucionales"
Entregado. El módulo existe (`data-tab="lentes"`, `atlas-lentes-institucionales.html`).
Las restricciones de ese sprint —incluida la de no tocar `calcISLM`— ya no rigen;
las sustituye la disciplina de auditoría de arriba.
