# MacroLab Shock Simulator · Curso 2026 · v1.6

Simulador pedagógico de macroeconomía para Chile. Herramienta docente publicable en GitHub Pages.

## Descripción general

MacroLab v1.6 integra **11 ciclos de mejora** (C1–C11) organizados en **11 pestañas de navegación** y un stack puro de HTML + CSS + JavaScript + Chart.js (CDN). 

Diseño modular: estructura completa, tooltips en 34 parámetros, protocolo de lectura de datos en 5 pasos, ejercicios diagnósticos navegables, y modo oscuro para proyección.

---

## Arquitectura: 11 pestañas

| Pestaña | Función | Origen |
|---------|---------|--------|
| **Inicio** | Modal de bienvenida, 3 rutas de entrada, diferenciación visual clara | C0 (base) |
| **Instrucciones** | 4 ejercicios de diagnóstico (inflación+desempleo 2022, TPM sin recesión, cobre sin apreciación, 2020–2023) | C11 (hoy) |
| **IS-LM** | Modelo canonical + bloques de contexto Chile | C0 + C5 |
| **IS-LM-BP** | Trinidad imposible: 3 configuraciones comparadas (Chile = flotación + movilidad) | C5 |
| **OA-DA** | Bloque de expectativas, segunda vuelta, convergencia con 3 escenarios | C5 |
| **Shocks** | 12 shocks clasificados (tipo/canal/modelo/ejemplo) + 4 cadenas visuales nuevas | C2 |
| **Atlas** | 10 episodios históricos 2009–2026 (variables, mecanismos, modelos, enlaces internos) | C2 |
| **Marco institucional** | Argumento game-theoretic, 2 nuevos bienes públicos (FEES/FRP, CFA), tabla 8×6, filtro con 3 ejemplos, 7 tensiones Chile-específicas | C1 |
| **Tablero** | 4 bloques de lectura cruzada, timeline chips navegables, notas enriquecidas, gráficos renombrados con fuente (BCCh, INE, Cochilco, FRED) | C4 + C8 |
| **Lectura de datos** | Protocolo 5 pasos, tabla de transformaciones (6 tipos), contraste gráfico bueno vs malo, 6 errores, puente datos→modelo (4 ejemplos) | C10 (hoy) |
| **Glosario** | ~45 términos temáticos (±4 bloques). Expandido a C7. | C0 + C7 |

---

## 11 ciclos de mejora (C1–C11)

### **C1: Marco Institucional** (ayer)
- Argumento game-theoretic de bienes públicos macroeconómicos
- 2 nuevos bienes públicos: FEES/FRP (estabilidad cambiaria), CFA (credibilidad fiscal)
- Tabla analítica: 8 instituciones × 6 columnas (mandato, instrumento, meta, horizonte, interacción, riesgo)
- Sección "Filtro institucional": 3 ejemplos modelo→institución
- 7 tensiones Chile-específicas (autonomía vs presión política, etc.)

### **C2: Shocks y transmisión** (ayer)
- 4 nuevas cadenas visuales: pandemia, estallido 2019, shock Fed, productividad
- Tabla clasificatoria: 12 shocks (tipo / canal de transmisión / modelo sugerido / ejemplo histórico / botón simular)
- Botones "simular en [modelo]": navegación con shock precargado
- Mapa de transmisión con rezagos típicos

### **C3: Tooltips** (ayer)
- 34 parámetros editables: nombre descriptivo + tooltip explicativo
- Nota de calibración 2026 en cada simulador
- Mejora UX: claridad de inputs sin dejar la interfaz

### **C4: Tablero (análisis de series)** (ayer)
- 4 bloques de lectura cruzada de series macroeconómicas
- Timeline chips navegables que llevan al simulador con shock precargado
- Notas de gráficos enriquecidas con cifras + modelo recomendado

### **C5: Modelos avanzados** (ayer)
- **IS-LM-BP**: bloque completo de trinidad imposible con 3 configuraciones comparadas
  - Configuración Chile: flotación + movilidad de capitales
- **OA-DA**: bloque de expectativas, segunda vuelta, convergencia con 3 escenarios

### **C6: Modo oscuro (Modo proyección)** (ayer)
- Botón "Modo proyección" en navbar
- CSS dark mode completo (~40 selectores)
- JavaScript que actualiza colores de Chart.js en tiempo real
- UX: preserva usabilidad en proyección de aula

### **C7: Exportación PNG** (ayer)
- Botón en cada gráfico del simulador
- Descarga automática con nombre y fecha
- Integración: permite incorporar outputs en reportes docentes

### **C8: Gráficos renombrados + fuentes institucionales** (hoy)
- Todos los gráficos del Tablero con nombres descriptivos completos
- Fuente institucional en cada serie: BCCh, INE, Cochilco, FRED
- Mejora transparencia metodológica

### **C9: Panel desplegable de segundo nivel (Tablero)** (hoy)
- IMACEC, IPC SAE, EMBI Chile, cuenta corriente/PIB
- 4 mini-gráficos con notas de lectura
- Cada nota explica: qué mide, cuándo usarlo, conexión con simuladores

### **C10: Nueva pestaña "Lectura de datos"** (hoy)
- Protocolo de 5 pasos para leer datos macroeconométricos
- Tabla de transformaciones: 6 tipos (detrending, desestacionalización, diferenciación, deflación, normalización, rezagos)
  - Cada uno: cuándo sí, cuándo no, ejemplo
- Contraste gráfico: lectura buena vs lectura mala
- 6 errores frecuentes (ej. no desestacionalizar series que ya lo están)
- Puente datos→modelo: 4 ejemplos navegables hacia simulador

### **C11: Ejercicios de diagnóstico en Instrucciones** (hoy)
- **E1**: Inflación + desempleo 2022
  - Observación, pregunta, hipótesis, test en simulador, cierre analítico
- **E2**: TPM sin recesión
- **E3**: Cobre sin apreciación
- **E4**: Secuencia 2020–2023 (pandemia → recuperación → Fed)
- Cada ejercicio oculta cierre analítico hasta que estudiante simule

---

## Stack técnico

- **Frontend puro**: HTML + CSS + JavaScript (sin frameworks)
- **Gráficos**: Chart.js vía CDN
- **Sin backend, sin almacenamiento persistente**: todo en memoria + localStorage (opcional)
- **Deployment**: GitHub Pages desde rama `main`, `/` (root)

---

## Publicación en GitHub Pages

1. Sube los 4 archivos al directorio raíz del repositorio:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

2. En **Settings > Pages**, selecciona:
   - **Deploy from branch**
   - Branch: `main`
   - Folder: `/ (root)`

3. Guarda y espera la publicación (~2 min)

---

## Fuentes de datos

- **Banco Central de Chile**: PIB, inflación, desempleo, TPM, tipo de cambio (CLP/USD)
- **INE (Instituto Nacional de Estadísticas)**: IMACEC, IPC, tasa de actividad
- **Cochilco**: precio del cobre
- **Federal Reserve (FRED)**: tasas de interés EE.UU., índices globales

---

## Mejoras futuras posibles

- Exportación de gráficos como imagen (PNG/SVG)
- Modo oscuro para proyección
- Casos guiados adicionales
- Series trimestrales en el tablero
- Curva de Phillips como módulo separado
- Comparación simultánea de dos shocks

---

## Contribuidores

- **PavelGomez**: diseño pedagógico, arquitectura de ciclos, integración institucional
- **Claude**: asistencia técnica en HTML/CSS/JS, optimización de UX

---

**Última actualización**: 7 de abril de 2026 (v1.6 + C11)  
**Estado**: Publicado en GitHub Pages
