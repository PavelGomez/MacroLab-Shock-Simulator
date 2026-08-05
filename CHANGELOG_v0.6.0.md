# MacroLab Macro 1 · cambios v0.6.0

## Resultado

La retroalimentación de las clases 1 y 2 deja de exigir que el alumno seleccione un código abstracto. Los pasos 4–6 ahora comparan la respuesta con la pauta, formulan orientaciones basadas en evidencia concreta, admiten incertidumbre y comprueban el aprendizaje mediante una práctica observable. La clase 3 conserva su loop cerrado y oculta los códigos internos en la interfaz.

## Cambios principales

- respuesta del alumno y pauta en dos cajas adyacentes, apiladas en pantallas angostas;
- observaciones «coincide / contradicción / falta explicar», sin puntaje de palabras clave;
- mapas de orientación específicos para las preguntas de las clases 1 y 2;
- pregunta diagnóstica discriminante con «no estoy seguro» y «ninguna corresponde»;
- ausencia de diagnóstico registrada como tal, sin clasificación forzada;
- práctica asignada automáticamente y vinculada con la orientación;
- criterio de éxito calculado desde respuestas observables y reescritura completa;
- posibilidad de cerrar con práctica pendiente sin fingir que la rutina se completó;
- contador de texto expresado como «N de mínimo» o «mínimo cumplido»;
- avisos de validación antiguos se limpian al corregir el campo;
- reporte estudiantil HTML como descarga principal, imprimible o guardable como PDF;
- JSON trasladado a «Respaldo técnico opcional» y explicado en lenguaje directo;
- códigos internos ocultos en la orientación y práctica de la clase 3;
- versión del laboratorio y de todas las notas actualizada a 0.6.0.

## Verificación

- `node macro1/test_paquete.js`: 540 comprobaciones.
- `node macro1/test_loop_clase3.js`: 229 aserciones.
- `node macro1/test_formulas_selladas.js`: 151 aserciones.
- recorrido visual local en navegador: pasos 4, 5 y 6 de la clase 1, vía «ninguna corresponde», criterio cumplido y descarga del reporte.
