# Capa de retroalimentación pedagógica · Clases 1–3

## Flujo existente antes del cambio

La fuente de verdad de las tres rutas vive en `macro1/index.html`, dentro de `CLASS_ROUTES`. Cada clase declara objetivos, lecturas, una pregunta tipo prueba, la pauta (`test.model`), resultados numéricos cuando corresponden (`test.expected`) y señales verbales (`test.keywords`). Las Notas de Estudio están en `macro1/notas/nota-01-…html` a `nota-05-…html` y se enlazan desde `CLASS_ROUTES.preparation`.

El recorrido común tiene seis pasos: lectura breve, ficha de indicador, pregunta tipo prueba, comparación, orientación y práctica. Al entregar la pregunta, `scoreClassTest()` produce la evaluación base: una lista de comprobaciones booleanas y el conteo `score/max`. `renderVerifiableBlock()` presenta cálculos o decisiones objetivas y `renderCoverageBlock()` presenta coincidencias verbales. Las clases 1 y 2 agregan `guidedAnalysis()`, diagnóstico guiado y reescritura. La clase 3 abre el laboratorio de mercado de bienes, importa sus resultados con `loopReturn()`, calcula una discrepancia y continúa con diagnóstico y transferencia. Los reportes descargables se construyen con `guidedStudentReport()` y `loopStudentReport()`.

## Diferencias entre clases

- Clase 1: respuesta abierta; dos decisiones previas verificables y cuatro señales de lectura de evidencia. Su revisión conserva la respuesta inicial y pide sólo los ajustes ausentes.
- Clase 2: tres cálculos verificables y cuatro criterios conceptuales escritos. Su revisión solicita cifras corregidas y una respuesta completa.
- Clase 3: los dos cálculos llegan automáticamente del laboratorio; la explicación evaluada es la predicción escrita antes de simular. Además conserva discrepancia, diagnóstico y una variante de transferencia.

## Decisión de arquitectura

La evaluación base permanece como fuente de puntaje y cumplimiento. La nueva capa compartida se representa con el esquema `macrolab-pedagogical-feedback/1.0` y transforma cada comprobación base en una explicación vinculada a un criterio. Cada entrada conserva: identificador del criterio, estado, evidencia literal o ausencia explícita, expectativa, logro, brecha tipificada, razón, acción, ejemplo y trazabilidad hacia pregunta, pauta, Nota de Estudio y comprobación base.

La capa no vuelve a puntuar ni infiere una idea que el estudiante no escribió. Si no encuentra evidencia pertinente, lo declara. Si una señal textual no permite distinguir entre omisión y error, conserva la incertidumbre. Las tres clases usan el mismo generador y el mismo renderizador; sólo cambian las definiciones declarativas de sus criterios.

## Aplicación en las tres rutas

- Clase 1: cuatro criterios explican la condición de la cifra, la diferencia entre futuro y dato observado, los datos que permiten identificar la cifra y la diferencia entre describir un escenario y explicar una causa. La expresión «pasaporte del dato» se conserva sólo como recordatorio de las cinco piezas definidas en la Nota 1; no se usa sola como instrucción o diagnóstico.
- Clase 2: cinco criterios explican crecimiento real, deflactor, identidad PNB = PIB + PNF, cobertura deflactor–IPC y diferencia entre PNF e inversión acumulada.
- Clase 3: cinco criterios explican ambos equilibrios y la cadena inventarios → producción e ingreso → consumo. Los cálculos siguen llegando del laboratorio; la capa no los reemplaza.

La vista estudiantil omite los identificadores internos. El respaldo JSON conserva esos identificadores y las comprobaciones de origen para auditoría. Los reportes HTML de las tres clases incluyen el mismo resumen y detalle por criterio.

## Validación y casos representativos

`test_retroalimentacion_pedagogica.js` cubre respuestas completamente correctas de las tres clases, respuestas parciales e incorrectas, un criterio omitido, vocabulario alternativo válido, mención sin mecanismo, error conceptual, respuesta breve, respuesta vacía y mezcla de criterios logrados y pendientes. También comprueba que una evidencia marcada como exacta sea una subcadena real del campo del estudiante, que los ejemplos estén rotulados, que las acciones comiencen con un verbo ejecutable y que `score/max` permanezca igual al resultado de `scoreClassTest()`.

Durante la validación se cerraron tres falsos positivos de cobertura: PNF definido como stock, deflactor presentado como equivalente al IPC e inventarios con dirección equivocada. No se agregaron criterios ni se modificaron pesos o máximos; una contradicción conceptual explícita ya no cuenta como presencia válida del mismo criterio.

La sección 7 del reporte de Clase 1 distingue ahora la comprobación de alternativas de la revisión del texto escrito. Para cada aspecto muestra lo esperado, el fragmento encontrado, lo logrado y —sólo cuando corresponde— el contenido pendiente, una acción y un ejemplo. «Banco Central para 2026» se reconoce como avance parcial: identifica la institución y el período, pero no la publicación específica IPoM. El reporte también separa explícitamente la evaluación de la respuesta inicial de la lectura posterior de la respuesta inicial junto con sus ajustes.

La impresión mantiene unidos los títulos con el primer bloque de cada sección y evita dividir tarjetas de retroalimentación. Como los encabezados `file:///…` son añadidos por el navegador y no por MacroLab, el botón de impresión indica desactivar «Encabezados y pies de página».

## Limitaciones

La aplicación es local y no usa un modelo de lenguaje. La extracción se basa en fragmentos y patrones acotados, por lo que puede conservar incertidumbre ante formulaciones muy indirectas. La capa no decide la calidad global de una argumentación ni sustituye revisión docente. Los campos obligatorios de la interfaz impiden entregar una respuesta vacía durante el recorrido normal; ese caso se mantiene cubierto en la función pura y en las pruebas para proteger importaciones o futuros cambios de interfaz.
