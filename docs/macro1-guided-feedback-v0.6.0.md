# Plan ejecutado · orientación y retroalimentación guiada v0.6.0

## Objetivo pedagógico

Ayudar a un estudiante que todavía no sabe nombrar su confusión. MacroLab debe separar una respuesta correcta, una respuesta incompleta, una contradicción observable y un caso no diagnosticable. Nunca convierte una omisión en evidencia automática de error.

## Flujo implementado

1. **Comparar:** muestra la respuesta original y la pauta, conservando el texto íntegro.
2. **Observar:** señala coincidencias, contradicciones y elementos que falta explicar.
3. **Comprobar:** hace una pregunta específica del contenido; admite «no sé» y «ninguna».
4. **Orientar:** registra una hipótesis sólo cuando hay evidencia; de lo contrario conserva diagnóstico nulo.
5. **Practicar:** asigna un ejercicio coherente con la orientación o una práctica fundamental si no hubo diagnóstico.
6. **Producir nueva evidencia:** exige una respuesta revisada y evalúa un criterio observable.
7. **Entregar:** descarga un reporte HTML legible; el JSON queda como respaldo técnico opcional.

## Alcance por clase

- **Clase 1:** conclusión verdadera/falsa, significado del PNF, territorio frente a residencia, stock frente a flujo y renta factorial frente a comercio exterior.
- **Clase 2:** cálculo de crecimiento real, cálculo e interpretación del deflactor, índice frente a tasa y deflactor frente a IPC.
- **Clase 3:** conserva diagnóstico por discrepancias calculadas, práctica dirigida y transferencia; los códigos siguen disponibles internamente para el registro, pero no se muestran al alumno.

## Estrategia de bajo costo

La versión 0.6.0 no llama servicios de IA ni envía respuestas fuera del navegador. Utiliza:

- reglas conceptuales pequeñas y auditables por pregunta;
- expresiones regulares sólo para detectar postura, conceptos y relaciones explícitas;
- cálculos deterministas para resultados numéricos;
- preguntas discriminantes preparadas por el profesor;
- pruebas locales con Node y jsdom;
- un único archivo HTML publicado, sin backend ni base de datos.

Esto tiene costo de tokens cero durante el uso estudiantil. Si se incorpora IA posteriormente, se recomienda usarla sólo para analizar en lote respuestas que quedaron sin mapear, no para cada interacción del alumno.

## Siguiente fase propuesta, no necesaria para publicar v0.6.0

1. Reunir voluntariamente una muestra anonimizada de respuestas y reportes.
2. Codificarla por dos docentes y medir acuerdo sobre las confusiones.
3. Comparar las orientaciones de MacroLab con esa codificación: precisión, falsos positivos y casos «no sé/ninguna».
4. Añadir nuevas alternativas únicamente cuando aparezca un patrón recurrente.
5. Pilotear, si fuese necesario, un modelo de lenguaje acotado a la pauta docente, siempre citando la frase que sustenta su sugerencia y declarando incertidumbre.

## Indicadores de evaluación

- proporción de diagnósticos rechazados o clasificados como «ninguna»;
- abandono en pasos 4–6;
- cumplimiento del ejercicio dirigido;
- corrección de la respuesta revisada;
- desempeño en una pregunta de transferencia posterior;
- utilidad declarada del reporte en conversación con profesor o ayudante;
- falsos positivos del diagnóstico frente a codificación docente.

