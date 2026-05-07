# Replicabilidad de datos – MacroLab Shock Simulator

Versión: Sprint 3 · 2026-05-07  
Cobertura: 2010–2025 (observado). 2026 es año docente, no incluido en CSV.

Los archivos `data/series-anuales.csv` y `data/series-anuales-l2.csv` contienen los valores
que alimentan el Tablero Macro del sitio. Esta guía describe cómo regenerarlos desde las
fuentes oficiales.

---

## Serie: gdp — PIB, variación anual (%)

1. **Dónde descargar:** Banco Central de Chile, Base de Datos Estadísticos (BDE).  
   URL: <https://si3.bcentral.cl/Siete/ES/Siete/Cuadro>  
   Sección: Cuentas Nacionales → PIB nominal y real → Variación anual del PIB real.

2. **Qué columna tomar:** Variación porcentual anual del PIB a precios encadenados.

3. **Transformación:** Promedio de los cuatro trimestres anuales, expresado como variación porcentual.  
   Si la fuente entrega variación anual del año completo directamente, usar ese valor sin promedio.

4. **Nombre en CSV:** `gdp`

---

## Serie: inflation — IPC, variación anual (%)

1. **Dónde descargar:** INE, Índice de Precios al Consumidor.  
   URL: <https://www.ine.gob.cl/estadisticas/economia/indices-de-precio/ipc>

2. **Qué columna tomar:** Variación porcentual anual del IPC general (diciembre vs. diciembre anterior).

3. **Transformación:** Variación diciembre-diciembre (no promedio mensual). Si se dispone solo del promedio anual de variaciones mensuales, documentar el cambio explícitamente.

4. **Nombre en CSV:** `inflation`

---

## Serie: unemployment — Tasa de desempleo (%)

1. **Dónde descargar:** INE, Encuesta Nacional de Empleo (ENE).  
   URL: <https://www.ine.gob.cl/estadisticas/sociales/mercado-laboral/ocupacion-y-desocupacion>

2. **Qué columna tomar:** Tasa de desocupación nacional (trimestre móvil o anual).

3. **Transformación:** Promedio de las cuatro mediciones trimestrales del año calendario.

4. **Nombre en CSV:** `unemployment`

---

## Serie: fx — Tipo de cambio CLP/USD (promedio anual)

1. **Dónde descargar:** Banco Central de Chile, BDE.  
   URL: <https://www.bcentral.cl>  
   Sección: Mercados financieros → Tipo de cambio observado.

2. **Qué columna tomar:** Tipo de cambio observado (dólares comprador o promedio comprador-vendedor, según disponibilidad).

3. **Transformación:** Promedio aritmético de los valores diarios del año calendario.

4. **Nombre en CSV:** `fx`

---

## Serie: tpm — Tasa de política monetaria (% promedio anual)

1. **Dónde descargar:** Banco Central de Chile, BDE.  
   URL: <https://www.bcentral.cl>  
   Sección: Política monetaria → TPM.

2. **Qué columna tomar:** Tasa de política monetaria (TPM), vigente en cada fecha.

3. **Transformación:** Promedio ponderado por días de vigencia dentro del año calendario.  
   ⚠️ La transformación exacta utilizada en el sitio no está documentada en detalle; verificar contra los valores publicados del BCCh para cada año.

4. **Nombre en CSV:** `tpm`

---

## Serie: copper — Precio del cobre (US ctvs/lb, promedio anual)

1. **Dónde descargar:** Cochilco, Estadísticas del mercado del cobre.  
   URL: <https://www.cochilco.cl/Paginas/Estadisticas/Bases%20de%20Datos/Mercado%20del%20Cobre.aspx>

2. **Qué columna tomar:** Precio del cobre BML (Bolsa de Metales de Londres), en US centavos por libra.

3. **Transformación:** Promedio simple de los precios diarios o mensuales del año.

4. **Nombre en CSV:** `copper`

---

## Serie: wti — Petróleo WTI (USD/bbl, promedio anual)

1. **Dónde descargar:** FRED (Federal Reserve Bank of St. Louis).  
   URL: <https://fred.stlouisfed.org/series/DCOILWTICO>  
   Serie: DCOILWTICO (Crude Oil Prices: West Texas Intermediate).

2. **Qué columna tomar:** Precio diario en USD por barril.

3. **Transformación:** Promedio aritmético de los precios diarios del año calendario.

4. **Nombre en CSV:** `wti`

---

## Serie: imacec — IMACEC, variación anual (%)

1. **Dónde descargar:** Banco Central de Chile, BDE.  
   URL: <https://www.bcentral.cl>  
   Sección: Actividad económica → IMACEC.

2. **Qué columna tomar:** Variación anual del IMACEC (serie original o desestacionalizada, según disponibilidad).

3. **Transformación:** Promedio simple de las variaciones anuales mensuales del año.

4. **Nombre en CSV:** `imacec`

---

## Serie: ipc_sae — IPC SAE, variación anual (%)

1. **Dónde descargar:** INE, IPC por componentes.  
   URL: <https://www.ine.gob.cl/estadisticas/economia/indices-de-precio/ipc>

2. **Qué columna tomar:** Variación anual del IPC sin alimentos ni energía (SAE).

3. **Transformación:** Promedio anual de las variaciones anuales mensuales.

4. **Nombre en CSV:** `ipc_sae`

---

## Serie: embi — EMBI Chile (puntos base, promedio anual)

1. **Dónde descargar:** Bloomberg Terminal o JPMorgan EMBI database (acceso institucional).  
   Proxy público: Focus Economics, Sovereign spreads.  
   URL referencial: <https://www.focus-economics.com>  
   ⚠️ Esta serie no tiene fuente pública de descarga directa y gratuita. Los valores en el sitio son aproximaciones anuales basadas en reportes secundarios.

2. **Qué columna tomar:** EMBI Chile (JP Morgan Emerging Market Bond Index), en puntos base.

3. **Transformación:** Promedio simple de los valores disponibles en el año.  
   ⚠️ La transformación exacta no está documentada; los valores pueden diferir según la fuente proxy utilizada.

4. **Nombre en CSV:** `embi`

---

## Serie: cc_pib — Cuenta corriente / PIB (% del PIB)

1. **Dónde descargar:** Banco Central de Chile, BDE.  
   URL: <https://www.bcentral.cl>  
   Sección: Sector externo → Balanza de pagos → Cuenta corriente.

2. **Qué columna tomar:** Saldo de cuenta corriente anual en millones de USD; PIB en USD del mismo año.

3. **Transformación:** Cociente (Cuenta corriente / PIB) × 100. El PIB en USD se obtiene del BCCh o del FMI (World Economic Outlook).

4. **Nombre en CSV:** `cc_pib`
