# MacroLab Shock Simulator · Curso 2026 · v1.6

Simulador pedagógico de macroeconomía para Chile. Herramienta docente publicable en GitHub Pages.

## Archivos
- `index.html` — estructura completa
- `styles.css` — estilos
- `script.js` — lógica, simuladores y datos
- `README.md` — documentación

## Qué cambia en v1.6

### Onboarding y navegación
- **Modal de bienvenida** al abrir el sitio (una vez por sesión).
- **Tres rutas de entrada** en el Inicio: casos contemporáneos, modelos, datos y contexto.
- **"← Volver al Inicio"** visible en todas las secciones.
- Diferenciación visual clara entre botones de navegación y contenido informativo.

### Nuevas secciones
- **Atlas de shocks 2009–2026**: fichas de 10 episodios históricos con variables, mecanismos, modelos útiles y enlaces internos.
- **"Si vienes desde una noticia"**: mini-secuencias en Instrucciones para pasar de un titular a un modelo.

### Mejoras a secciones existentes
- **IS-LM**: recuadro "Cuándo usar este modelo", "Qué gana y qué pierde".
- **IS-LM-BP**: recuadro "Cuándo conviene usar IS-LM-BP", "Cómo leer el mecanismo aquí".
- **OA-DA**: bloque de interpretación más sustancioso con clasificación de patrones, cuarta pendiente "OA casi vertical".
- **Shocks y transmisión**: hipótesis rivales (oferta vs demanda, transitorio vs régimen, costos vs credibilidad).
- **Marco institucional**: reorganizado por bienes públicos institucionales + tensiones.
- **Glosario**: expandido a 4 bloques temáticos (~45 términos).
- **Tablero macro**: mantenido sin retrocesos.

## Stack
- HTML + CSS + JavaScript puro
- Chart.js vía CDN
- Sin frameworks, sin backend, sin almacenamiento persistente

## Publicación en GitHub Pages
1. Sube los 4 archivos al directorio raíz del repositorio.
2. En Settings > Pages, selecciona Deploy from branch.
3. Elige `main` y `/(root)`.
4. Guarda y espera la publicación.

## Fuentes de datos
- **Banco Central de Chile**, Base de Datos Estadísticos (PIB, inflación, desempleo, TPM, CLP/USD).
- **Cochilco** (cobre).
- **Federal Reserve Bank of St. Louis vía FRED** (WTI).

## Mejoras futuras posibles
- Exportación de gráficos como imagen.
- Modo oscuro para proyección.
- Casos guiados adicionales.
- Series trimestrales en el tablero.
- Curva de Phillips como módulo separado.
- Comparación simultánea de dos shocks.
