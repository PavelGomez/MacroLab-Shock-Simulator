# MacroLab · Mapa de fricción de usuarios sintéticos

Versión 1.0 · 2026-05-07

---

## Propósito

Este mapa es un artefacto de **Nivel 2 de evidencia**: simula el comportamiento de usuarios bajo supuestos explícitos y razonados, pero no mide ni observa comportamiento real. Su valor es operar como puente entre el diagnóstico experto (Nivel 1) y la validación empírica con usuarios reales (Nivel 3): permite priorizar qué rediseñar, reduce la incertidumbre de diseño sin costo de reclutamiento, y traduce la crítica de experto en hipótesis testeables. Cada perfil es una construcción razonada, no una persona real. Las severidades son inferencias de diseño fundamentadas en principios de usabilidad pedagógica, no en datos de sesiones.

---

## Cláusula anti-overclaim

Las severidades registradas en este documento son inferencias de diseño, no mediciones. Los recorridos esperados son hipótesis razonables construidas a partir del flujo de la interfaz y del conocimiento pedagógico del dominio; no son trayectorias observadas. Ninguna afirmación sobre "tiempo de tarea", "tasa de éxito" o "punto de abandono" tiene respaldo empírico en esta versión. Cualquier intervención de diseño respaldada en este mapa debe revalidarse cuando se apliquen instrumentos de Nivel 3 (analítica, think-aloud, test controlado). Actualizar este documento cuando la evidencia empírica contradiga una hipótesis declarada aquí.

---

## Cinco perfiles sintéticos

### E1 · Estudiante primera vez · conocimiento previo bajo · escritorio

- **Contexto.** Primer año de Ingeniería Comercial; nunca usó MacroLab; conoce IS-LM y OA-DA por clase teórica sin haber aplicado shocks en un simulador interactivo.
- **Tarea.** Leer la diferencia entre un alza del petróleo bajo Chile 2026 y bajo anclaje frágil, conectando el simulador formal con la lectura institucional.
- **Supuestos.** Atención efectiva aproximada de 3 minutos; comprensión lectora media; sin asistencia docente en el momento de uso; pantalla de escritorio 1366×768; primera visita.
- **Recorrido esperado.** Inicio → modal de bienvenida → tab Lentes institucionales → selector petróleo + CHL → tarjeta de resultado → botón "→ equilibrio formal en OA-DA" → cápsula de aterrizaje → cierre editorial → botón de retorno → selector FRG.
- **Fricciones modeladas.** (a) Llegada al modelo OA-DA sin texto que conecte el clic con lo que acaba de leer en Lentes: el estudiante no sabe por qué está viendo ese gráfico (severidad alta antes de Sprint 1; mitigada con cápsula de aterrizaje). (b) Cierre conceptual al final del scroll sin señal de completitud: el estudiante puede cerrar el tab sin leer el cierre editorial (severidad alta antes de Sprint 1; mitigada con bloque de cierre visible). (c) Ausencia de camino claro para volver a Lentes y seleccionar la segunda configuración FRG (severidad media antes de Sprint 1; mitigada con botón de retorno). (d) Sin crónica con fuentes para anclar la lectura en evidencia real (severidad media antes de Sprint 2; mitigada con bloque `<details>` en el cierre).
- **Intervenciones aplicadas.** Sprint 1: cápsula de aterrizaje + bloque de cierre editorial + botón de retorno con contexto. Sprint 2: crónica canónica con fuentes colapsable en el cierre. Sprint 3: foco automático al título del cierre + reducción de animación con prefers-reduced-motion.
- **Hipótesis testeable de Nivel 3.** Tiempo de tarea esperado tras Sprint 3: igual o menor a 2 minutos para llegar al cierre editorial y ejecutar el retorno a Lentes. A validar con think-aloud o instrumentación de clics y tiempo.

---

### E2 · Estudiante con curso avanzado · busca crónica reproducible con fuentes · escritorio

- **Contexto.** Tercer año de Economía; usa MacroLab para preparar un comentario escrito sobre el episodio inflacionario chileno 2021-2024; necesita citar fuentes primarias.
- **Tarea.** Localizar la crónica del episodio Chile 2021-2024, leer los tres párrafos, copiar las tres fuentes (IPoM, INE, FMI) y verificar que los enlaces abren en pestaña nueva.
- **Supuestos.** Familiaridad moderada con la interfaz; sesión de 10 minutos; uso académico con intención de cita; pantalla de escritorio amplia.
- **Recorrido esperado.** Tab Lentes → selector petróleo + CHL → botón "→ equilibrio formal en OA-DA" → cierre editorial → expandir `<details>` "Crónica canónica con fuentes · Chile, 2021-2024" → copiar fuentes → verificar enlaces externos.
- **Fricciones modeladas.** (a) La crónica no estaba accesible antes de Sprint 2: el estudiante no tenía fuentes primarias en la interfaz (severidad muy alta antes de Sprint 2; eliminada). (b) El bloque `<details>` está colapsado por defecto: un usuario que no explore puede no verlo (severidad baja; aceptable como decisión de diseño para no aumentar la carga cognitiva inicial). (c) Los enlaces de fuentes abren en pestaña nueva sin advertencia previa (severidad muy baja; comportamiento esperado con `target="_blank"`).
- **Intervenciones aplicadas.** Sprint 2: registro `window.MacroLabCronicasRegistryES` + renderizado de crónica en el cierre. Sprint 3: `rel="noopener noreferrer"` en todos los enlaces externos.
- **Hipótesis testeable de Nivel 3.** Al menos el 80% de los usuarios que llegan al cierre editorial expanden el `<details>` sin instrucción explícita. A validar con analítica de interacción o eye-tracking ligero.

---

### A1 · Ayudante de cátedra · prepara clase de 5 minutos · proyector

- **Contexto.** Ayudantía de Macroeconomía II; el ayudante necesita mostrar en pantalla la diferencia entre Chile 2026 y anclaje frágil ante un alza del petróleo, sin leer en voz alta texto largo.
- **Tarea.** Navegar desde Lentes → comparativa de las 4 configuraciones → entrar al modelo OA-DA con petróleo → mostrar el gráfico y la cápsula → volver al grid comparativo. Tiempo total disponible: 5 minutos incluyendo explicación oral.
- **Supuestos.** Uso en pantalla proyectada (1024×768 o similar); resolución reducida; el ayudante conoce la interfaz; no puede leer texto largo en voz alta.
- **Recorrido esperado.** Tab Lentes → selector petróleo → "Ver las 4 configuraciones" → tarjeta CHL → botón modelo → cápsula de aterrizaje (texto breve) → gráfico → botón de retorno → tarjeta FRG.
- **Fricciones modeladas.** (a) El texto de la cápsula de aterrizaje es denso para una pantalla proyectada: el ayudante necesita parafrasear en lugar de leer (severidad media; no eliminada, requiere decisión editorial de reducir longitud en sprint futuro). (b) El botón de retorno devolvía a la tarjeta única en lugar del grid comparativo antes de Sprint 2 (severidad alta; mitigada con `renderLentesCompare()`). (c) La tipografía puede resultar pequeña en proyectores de baja resolución (severidad media; no abordada en Sprints 1-3; pendiente).
- **Intervenciones aplicadas.** Sprint 2: botón de retorno corregido a `renderLentesCompare()`. Sprint 3: `prefers-reduced-motion` reduce distracciones visuales en pantallas compartidas.
- **Hipótesis testeable de Nivel 3.** El recorrido completo (Lentes → modelo → retorno al grid) es completable en menos de 90 segundos por un usuario familiarizado. A validar con grabación de pantalla en sesión de ayudantía.

---

### P1 · Profesor · revisa coherencia para evaluación · escritorio

- **Contexto.** Docente que diseña una pregunta de evaluación sobre el mecanismo institucional y quiere verificar que la capa narrativa del simulador es coherente con el material de clases y que las fuentes son citables.
- **Tarea.** Revisar que la hipótesis, el filtro institucional y los datos de evidencia de la ruta "petróleo + Chile 2026 + OA-DA" sean consistentes con lo que se enseñó en clases; verificar que la crónica cite fuentes primarias verificables.
- **Supuestos.** Lectura lenta y crítica; puede abrir varias pestañas del navegador; compara con apuntes propios; sesión de 15-20 minutos; escritorio.
- **Recorrido esperado.** Tab Lentes → selector petróleo + CHL → "Ver las 4 configuraciones" → tarjeta CHL → "→ equilibrio formal en OA-DA" → cierre editorial → leer hipótesis, filtro, límites, evidencia → expandir crónica → verificar cada enlace de fuente → abrir IPoM en pestaña nueva → comparar.
- **Fricciones modeladas.** (a) Los datos de evidencia son señales cualitativas ("IPC energía y transables") sin valores de referencia numéricos: el docente debe verificar por su cuenta (severidad media; decisión pedagógica explícita de no incluir cifras duras). (b) Las fuentes en la crónica son tres por episodio: puede ser insuficiente para un docente que quiere revisar exhaustivamente (severidad baja; la crónica declara ser ilustrativa, no exhaustiva). (c) No existe una vista de todas las rutas registradas en una sola pantalla: el docente debe navegar combinación por combinación (severidad media; no abordada en Sprints 1-3).
- **Intervenciones aplicadas.** Sprint 2: crónica con tres fuentes primarias verificables, caveat explícito sobre el carácter ilustrativo. Sprint 3: `target="_blank" rel="noopener noreferrer"` en todos los enlaces.
- **Hipótesis testeable de Nivel 3.** El docente califica las fuentes como "suficientes para una actividad de aula" en escala Likert de 5 puntos (puntuación media esperada ≥ 4). A validar con encuesta post-uso.

---

### M1 · Estudiante en modo móvil o pantalla angosta · primera vez

- **Contexto.** Estudiante que accede desde un teléfono o tableta en resolución angosta (≤ 768 px de ancho); puede estar en tránsito o en clase; primera visita.
- **Tarea.** Llegar a la comparativa de las 4 configuraciones para un shock de petróleo y leer al menos una tarjeta completa.
- **Supuestos.** Pantalla táctil; ancho ≤ 768 px; conexión 4G variable; atención dividida; sin teclado físico.
- **Recorrido esperado.** Inicio → descartar modal de bienvenida → tab Lentes (scroll horizontal en nav o scroll vertical) → selector petróleo → "Ver las 4 configuraciones" → scroll hasta tarjeta CHL → leer.
- **Fricciones modeladas.** (a) La navegación de tabs requiere scroll horizontal en pantallas estrechas: puede no ser obvio para un usuario de primera vez (severidad alta; no abordada en Sprints 1-3; pendiente). (b) El grid de 4 configuraciones usa `home-grid four` con `minmax(240px, 1fr)`: en pantalla angosta colapsa a columna única pero requiere mucho scroll (severidad media; aceptable por responsividad CSS). (c) Los botones de vitrina (`lentes-vitrine-btn`) son lo suficientemente grandes para toque táctil (severidad baja; cumple target size mínimo). (d) El bloque `<details>` de crónica requiere tap preciso en el `<summary>`: puede ser difícil en pantallas muy pequeñas (severidad baja).
- **Intervenciones aplicadas.** Sprint 3: `@media (prefers-reduced-motion: reduce)` y `canvas { aspect-ratio }` reducen saltos de layout en carga. WCAG 2.2 AA aplicado reduce barreras de interacción táctil.
- **Hipótesis testeable de Nivel 3.** Al menos el 70% de los usuarios en móvil llegan a la tarjeta de resultado sin abandonar antes de 90 segundos. A validar con analítica de sesión (Plausible, Umami o equivalente).

---

## Tabla resumen de severidades

| Perfil | Fricción principal | Severidad antes Sprints 1-3 | Severidad después Sprints 1-3 | Hipótesis testeable Nivel 3 |
|---|---|---|---|---|
| E1 · Estudiante primera vez | Sin cápsula de aterrizaje que conecte clic con lectura | Alta | Baja (mitigada) | Tiempo de tarea ≤ 2 min tras Sprint 3 |
| E1 · Estudiante primera vez | Sin camino claro de retorno a Lentes para comparar FRG | Media | Baja (mitigada) | Tasa de retorno al grid ≥ 60% |
| E2 · Estudiante avanzado | Ausencia de crónica con fuentes primarias en la interfaz | Muy alta | Eliminada | ≥ 80% expande el `<details>` sin instrucción |
| A1 · Ayudante cátedra | Retorno al grid comparativo imposible (volvía a tarjeta única) | Alta | Eliminada | Recorrido completo en < 90 s para usuario familiarizado |
| A1 · Ayudante cátedra | Texto de cápsula denso para pantalla proyectada | Media | Media (sin cambio) | Pendiente decisión editorial |
| P1 · Profesor | Sin vista consolidada de todas las rutas registradas | Media | Media (sin cambio) | Calificación de fuentes ≥ 4/5 en Likert |
| M1 · Móvil/pantalla angosta | Navegación de tabs no obvia en scroll horizontal | Alta | Alta (sin abordar) | ≥ 70% alcanzan tarjeta en < 90 s |
| M1 · Móvil/pantalla angosta | Grid de 4 configs requiere mucho scroll en columna única | Media | Baja (responsividad CSS) | — |

---

## Plantilla de actualización iterativa

Este mapa debe actualizarse en tres situaciones: (a) cuando se agrega una ruta editorial nueva (nueva combinación en el registro), porque el recorrido esperado cambia; (b) cuando cambia el flujo de aterrizaje o retorno (cualquier cambio en `narrative-layer.js` que afecte la cápsula, el cierre o el botón de retorno); (c) cuando se reciben señales empíricas de Nivel 3 que contradicen una hipótesis declarada aquí (analítica, think-aloud, encuesta).

En cada actualización: registrar la fecha, el sprint o versión que originó el cambio, y el diff de severidades (qué fricciones cambiaron de categoría). Las columnas que pueden variar entre actualizaciones son "Severidad después" e "Hipótesis testeable". Las columnas "Perfil" y "Fricción principal" son estables a menos que cambie radicalmente el flujo de la interfaz.

Para el versionado: incrementar la versión menor (1.0 → 1.1 → 1.2) en cada actualización iterativa. Incrementar la versión mayor (1.x → 2.0) solo si se incorpora evidencia empírica de Nivel 3 que valide o invalide un conjunto significativo de hipótesis. Registrar el hash del commit que da origen a cada versión.

---

Versión 1.0 · 2026-05-07
