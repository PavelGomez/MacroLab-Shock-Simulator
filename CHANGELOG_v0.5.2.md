# MacroLab Macro 1 · cambios v0.5.2

## Experiencia de uso

- Añade la guía desplegable «¿Cómo utilizar MacroLab?» al comienzo de la ruta.
- Añade una instrucción contextual «Para avanzar» en los seis pasos de las tres clases.
- Hace visibles los requisitos mínimos de los campos y muestra contadores de caracteres.
- Identifica, marca y enfoca el primer campo pendiente con un mensaje específico.
- Sincroniza al enviar los valores visibles restaurados o autocompletados por el navegador.
- Corrige la aceptación accidental de campos numéricos vacíos como si fueran cero.

## Clase 3

- Cambia el rótulo ambiguo «intentos» por «escenarios calculados» para los recálculos del modelo.
- Añade «intentos de verificación», que cuenta sólo los clics explícitos en «Verificar el cierre».
- Conserva el historial de verificaciones en `application.verification_attempts` sin romper el campo histórico `application.attempts`.

## Verificación

- Añade regresiones para autocompletado silencioso, mensajes por campo, foco accesible, guía global y separación de contadores.
- Mantiene las suites de integridad, loop de Clase 3 y fórmulas selladas.
