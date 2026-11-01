# Alojamiento en MacroLab · Clase 8

[Volver a la Clase 8](../../index.html?clase=8#route). Abre index.html para estudiar en línea. La copia alojada añade el regreso a MacroLab; el ZIP conserva la versión autónoma. El registro SHA256_ARCHIVOS.txt describe el contenido de ese ZIP.

# IS–LM abierto · Mundell–Fleming

Abre **index.html**. Conserva las carpetas junto al archivo. Para compartir, envía **COMPARTIR_Mundell_Fleming_Macro1.zip**; se debe extraer antes de abrir la presentación.

7 capítulos · 24 diapositivas · 27:58 de audio propio incluido · 87 segundos de estudio. Una sola voz adulta sintética española: Kokoro / em_alex. No requiere conexión, modelos, cuentas ni instalaciones para estudiar.

La revisión visual 4 deja los interceptos en una ventana opcional «Ver interceptos», con un acceso por ejercicio resuelto. Mantiene las ecuaciones Y = F(i) y el gráfico del ajuste en el recorrido principal. La ventana pausa la voz y conserva el punto. Véase docs/revision_v4.html.

La revisión visual 3 añadió LM como Y = F(i) en cada calibración, las ecuaciones de las rectas comparadas y una vista completa de los interceptos de IS y LM. Conserva el detalle del equilibrio, la voz y todos los tiempos. Véase docs/revision_v3.html.

La revisión 2 incorpora un panel «Paso a paso» que sigue cada párrafo, permite revisar operaciones en pausa y ofrece el desarrollo completo. Mantiene A como gasto autónomo, a como coeficiente de Y y α = 1/a como multiplicador parcial. Corrige el avance de diapositivas ante relojes redondeados. El detalle docente está en docs/revision_v2.html.

La presentación incluye reproducción y pausa por acción del usuario, saltos de diez segundos, diapositivas, capítulos, barra temporal, velocidad, detención inicial al terminar capítulo, escucha continua opcional, texto de voz, transcripción temporal, ampliaciones, glosario, práctica con respuestas y retorno al punto de escucha. Guarda preferencias y posición cuando el navegador lo permite. Recargar vuelve en pausa.

- **docs/publicacion.html**: instrucciones para Moodle, alojamiento web, GitHub Pages y envío de enlace por correo.
- **docs/correo_estudiantes.txt**: correo para completar con la URL publicada.
- **docs/revision_v4.html**: interceptos opcionales, una vez por ejercicio.
- **docs/guia.html**: uso y teclado.
- **docs/guion.html**: guion íntegro con tiempos y audio por capítulo.
- **docs/storyboard.html**: objetivo, pantalla, figura, voz, pausa y ampliación de cada diapositiva.
- **docs/diapositivas.html**: consulta estática con respuestas, disponible sin JavaScript.
- **docs/nota_docente.html**: fuentes, supuestos, unidades, calibración y decisiones.
- **docs/revision_v3.html**: funciones de las rectas e interceptos.
- **docs/revision_v2.html**: respuesta a las observaciones y criterios para las diapositivas siguientes.
- **docs/verificacion.html**: controles realizados y pendientes.
- **sources/**: copias exactas de antecedentes; sin modificaciones.
- **production/**: guion fuente, tiempos y procedimientos.

Base: Nota de estudio 9 del curso, edición 1 de noviembre de 2026. E = CLP/USD; E mayor es depreciación. Las cifras del modelo son calibraciones docentes, no datos de Chile. Cada shock parte de una base común.

## Alcance de la revisión

870 comprobaciones del modelo/controlador en DOM simulado; siete MP3 decodificados; ocho silencios medidos; ocho pasajes y dos pasajes adicionales de notación examinados con reconocimiento automático local; revisión estática de las 24 diapositivas a tres anchos.

El navegador integrado bloqueó file://. Pendientes: reproducción y sincronización reales en navegadores de destino, interacción táctil, lector de pantalla y escucha humana completa. No se presenta la simulación como una prueba de navegador. Las diferencias del reconocedor al transcribir símbolos no certifican errores de voz ni garantizan pronunciación perfecta.

## Producción y reproducción de controles

La cadena local usa kokoro-onnx, NumPy, soundfile, onnxruntime, ffmpeg y ffprobe. MF_MODELS permite indicar la carpeta de modelos; no se distribuyen. Se reutilizó el modelo local del referente sin modificarlo. Regenerar contenido exige regenerar audio y tiempos.

Orden: `python3 production/content.py`, ejecutar `production/generate_audio.py` con el entorno de voz, `python3 production/build_docs.py`, `node production/export_slides.js`.

El contrato production/editorial-contract.json vincula los 72 párrafos con sus pasos visibles. Cambiar locución o apoyo requiere revisar el par, conforme a production/CRITERIOS_EDITORIALES.md.

`node production/verify.js` necesita linkedom; define MF_DOM_MODULE con su ruta. `production/verify_audio.py` usa Whisper base local. La composición estática usa WeasyPrint y Poppler. Estas dependencias solo sirven para producir y revisar, no para estudiar.

Los MP3 y recursos de uso están completos. Los archivos temporales de voz y las páginas de revisión se conservaron fuera de esta carpeta en 99_Tecnico_y_produccion/Produccion_Mundell_Fleming_2026-11-01. Los registros compactos permanecen en verification.

Profesor Pável Gómez · Ingeniería Comercial · Universidad Finis Terrae · noviembre de 2026.
