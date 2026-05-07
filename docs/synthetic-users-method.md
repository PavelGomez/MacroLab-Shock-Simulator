# MacroLab · Metodología de evaluación por niveles de evidencia

Versión 1.0 · 2026-05-07

Este documento describe el marco metodológico que fundamenta el uso de usuarios sintéticos en MacroLab y delimita con precisión qué tipo de afirmaciones respalda cada nivel de evidencia.

---

## Tres niveles de evidencia

### Nivel 1 · Diagnóstico experto

**Qué incluye.** Revisión crítica de la interfaz por parte de un experto en usabilidad pedagógica o en el dominio disciplinar. Puede incluir heurísticas de Nielsen, evaluación de consistencia visual, lectura crítica de los textos editoriales y verificación de coherencia entre el modelo formal y la narrativa.

**Qué NO incluye.** Observación de usuarios reales. Medición de tiempos. Registro de errores cometidos. Cuantificación de tasas de éxito o abandono.

**Cuándo es apropiado.** En las etapas tempranas del diseño, antes de que exista una versión funcional completa, o cuando el costo de reclutar usuarios es desproporcionado respecto al alcance de la intervención. También como filtro previo antes de invertir en Nivel 3.

**Qué tipo de afirmaciones permite respaldar.** "Esta sección viola la heurística de consistencia." "El texto de la cápsula excede la capacidad de atención sostenida estimada para el perfil objetivo." "El flujo de navegación no sugiere un camino claro de retorno." Estas afirmaciones son válidas como diagnóstico, no como predicción de comportamiento.

---

### Nivel 2 · Simulación de usuarios sintéticos

**Qué incluye.** Construcción de perfiles de usuario con supuestos explícitos sobre conocimiento previo, tarea, contexto tecnológico y atención disponible. Modelado del recorrido esperado a través de la interfaz. Inferencia de fricciones (puntos donde el perfil sintético encontraría dificultad) y asignación de severidades (alta, media, baja) basadas en principios de usabilidad pedagógica y en el conocimiento del flujo de la interfaz.

**Qué NO incluye.** Observación de usuarios reales. Medición de ninguna variable cuantitativa. Validación de las severidades asignadas. Los supuestos sobre "tiempo de tarea", "tasa de éxito" o "punto de abandono" son hipótesis testeables, no datos.

**Cuándo es apropiado.** Como puente entre el diagnóstico experto (Nivel 1) y la validación empírica (Nivel 3). Útil para priorizar qué rediseñar cuando los recursos para pruebas con usuarios son limitados, para comunicar decisiones de diseño en forma estructurada, y para generar hipótesis testeables antes de invertir en analítica o reclutamiento.

**Qué tipo de afirmaciones permite respaldar.** "Bajo los supuestos declarados, el perfil E1 encontraría dificultad alta para conectar el clic con la lectura institucional antes de Sprint 1." "La fricción modelada en A1 respecto al retorno al grid fue abordada en Sprint 2." Estas afirmaciones son válidas como inferencias de diseño, condicionadas a los supuestos explicitados en cada perfil.

---

### Nivel 3 · Validación empírica

**Qué incluye.** Observación directa de usuarios reales interactuando con la interfaz. Puede tomar múltiples formas: think-aloud (pensar en voz alta), grabación de pantalla, analítica de comportamiento (clics, scroll depth, tiempo en página), encuestas post-uso, test A/B controlado.

**Qué NO incluye.** Las afirmaciones de Nivel 1 o Nivel 2 por sí solas. Un Nivel 3 bien diseñado no parte de los perfiles sintéticos como verdad: los usa como hipótesis a contrastar.

**Cuándo es apropiado.** Cuando se requiere tomar decisiones de diseño con consecuencias significativas (rediseño mayor, eliminación de funcionalidad, cambio de flujo principal). También cuando la evidencia de Nivel 2 genera hipótesis contradictorias entre sí o con las señales de uso disponibles.

**Qué tipo de afirmaciones permite respaldar.** "En una muestra de N usuarios del perfil objetivo, el tiempo mediano de tarea para llegar al cierre editorial fue X minutos." "El 72% de los participantes expandió el bloque de crónica sin instrucción." Estas afirmaciones son válidas como evidencia empírica, condicionada al tamaño y representatividad de la muestra.

---

## Por qué el Nivel 2 es útil aunque no sea empírico

La simulación de usuarios sintéticos cumple un rol de priorización que el diagnóstico experto no puede cumplir por sí solo. Mientras que el Nivel 1 identifica problemas en la interfaz, el Nivel 2 los contextualiza en recorridos concretos y los ordena por impacto esperado sobre perfiles específicos. Un experto puede señalar que "el botón de retorno no es visible"; el mapa de fricción permite inferir que esa fricción afecta especialmente al perfil A1 (ayudante en clase) más que al perfil P1 (profesor en revisión lenta), lo que cambia la prioridad de la intervención.

Adicionalmente, el Nivel 2 traduce la crítica de diseño en hipótesis testeables de Nivel 3. Sin ese paso intermedio, las intervenciones de diseño se evalúan de manera binaria (¿mejoró o no?) sin saber qué medir. El mapa de fricción especifica qué variable observar, en qué perfil y con qué umbral razonable, haciendo que la validación empírica posterior sea más eficiente.

Finalmente, el Nivel 2 reduce la incertidumbre de diseño antes de invertir en analítica o reclutamiento. En un proyecto de alcance pedagógico limitado, donde el reclutamiento de usuarios es costoso o logísticamente difícil, el mapa de fricción permite tomar decisiones de diseño razonadas con evidencia explícita de los supuestos asumidos, en lugar de depender solo de la intuición del diseñador.

---

## Por qué el Nivel 2 NO sustituye el Nivel 3

El Nivel 2 opera sobre supuestos construidos por el modelador, no sobre comportamiento observado. Esto introduce sesgos sistemáticos: el modelador tiende a imaginar usuarios más racionales, más atentos y más familiarizados con el dominio de lo que son en la práctica. Las fricciones que el modelador considera "obvias" para un usuario real pueden resultar invisibles en una sesión de think-aloud, y viceversa.

La ausencia de variabilidad real es la limitación más importante del Nivel 2. Dos usuarios del mismo perfil teórico pueden tener comportamientos radicalmente distintos según su experiencia previa con interfaces similares, su estado de atención en el momento del uso, o su interpretación de la tarea asignada. El perfil sintético colapsa esa variabilidad en un recorrido único, lo que puede sobre-simplificar la distribución real de dificultades.

Por último, el Nivel 2 no puede medir errores observados. Las fricciones modeladas son puntos donde el diseño crea condiciones para que ocurra un error, no registros de errores que efectivamente ocurrieron. Solo el Nivel 3 puede distinguir entre "el diseño favorece el error" y "los usuarios efectivamente cometen ese error". Sin esa distinción, las intervenciones de diseño pueden resultar sobredimensionadas o mal dirigidas.

---

## Protocolo recomendado

| Pregunta a responder | Nivel mínimo necesario | Herramienta sugerida | Salida esperada |
|---|---|---|---|
| ¿Hay inconsistencias evidentes en la interfaz? | Nivel 1 | Revisión heurística con checklist WCAG + Nielsen | Lista de problemas con severidad |
| ¿Cuáles fricciones afectan más a qué perfiles? | Nivel 2 | Mapa de fricción de usuarios sintéticos | Tabla de severidades priorizadas por perfil |
| ¿Los usuarios reales tardan más de 2 min en llegar al cierre? | Nivel 3 | Think-aloud con 5-8 participantes del perfil E1 | Tiempo mediano de tarea con rango intercuartil |
| ¿Qué proporción expande el bloque de crónica? | Nivel 3 | Analítica de interacción (clic en `<summary>`) | Tasa de expansión con intervalo de confianza |
| ¿El retorno al grid es usado espontáneamente? | Nivel 3 | Grabación de pantalla + analítica de navegación | Tasa de uso del botón de retorno |
| ¿Las fuentes son percibidas como suficientes? | Nivel 3 | Encuesta post-uso (Likert 5 puntos) | Puntuación media y distribución |

---

## Limitaciones declaradas

El mapa de fricción asume que los perfiles sintéticos son representativos de la distribución real de usuarios. Esta asunción no ha sido validada: no se cuenta con datos demográficos ni de uso que confirmen que E1, E2, A1, P1 y M1 cubren los casos más frecuentes de uso. Los supuestos de "atención efectiva" y "tiempo de tarea" son aproximaciones basadas en literatura general de usabilidad educativa, no en mediciones sobre este sitio. Las severidades "alta", "media" y "baja" no corresponden a una escala cuantitativa definida: son categorías ordinales asignadas por criterio de diseño. El modelador de los perfiles es el mismo equipo que diseñó la interfaz, lo que introduce un sesgo de confirmación que el Nivel 3 debe compensar. Finalmente, el mapa no modela usuarios con necesidades de accesibilidad específicas más allá del perfil M1 (pantalla angosta), lo que constituye una brecha que deberá abordarse en una versión futura.
