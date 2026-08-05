# Auditoría de fricciones UX · MacroLab Macro 1 v0.5.2

Fecha: 5 de agosto de 2026

Alcance: seis pasos de las clases 1, 2 y 3, más el tránsito entre la ruta y el laboratorio de mercado de bienes.

## Decisión de interfaz

Se incorporó un desplegable persistente **«¿Cómo utilizar MacroLab?»** al comienzo de la ruta y una ayuda breve **«Para avanzar»** dentro de cada paso. No se usó una ventana modal porque interrumpiría el trabajo, ocultaría el contexto y repetiría instrucciones que deben permanecer consultables.

La estrategia tiene tres capas:

1. orientación global antes de comenzar;
2. requisitos visibles junto a cada campo;
3. error específico, foco y marcado del primer campo pendiente.

## Matriz por paso y clase

| Paso | Clases 1 y 2 | Clase 3 | Fricción anticipada | Respuesta incorporada |
|---|---|---|---|---|
| 1 · Lectura | Lectura breve y casilla de reconstrucción | Añade recuperación de memoria y explicación del ciclo | La casilla puede parecer una formalidad o el bloqueo puede no entenderse | Guía «Para avanzar», mensaje que explica cuándo marcarla y foco en la casilla |
| 2 · Indicadores | Cinco datos de una fuente | Mismos cinco datos antes del loop | Fecha autocompletada no registrada; varios mínimos invisibles; mensaje agregado poco diagnóstico | Sincronización al enviar, requisitos junto a cada campo, contador y error por campo |
| 3 · Pregunta | Clase 1: prosa; Clase 2: dos cifras y mecanismo | Dirección y mecanismo antes de abrir el laboratorio | Umbral de texto oculto; campos numéricos vacíos podían ser interpretados como cero; botón aparentemente bloqueado | Reglas visibles, validación estricta de vacío numérico, explicación de obligatorios y opcionales |
| 4 · Retroalimentación | Cobertura verbal, pauta, reflexión y contradicción | Discrepancia importada, narrativa y decisión sobre texto prellenado | Cobertura confundida con corrección; demasiadas decisiones sin orden; prellenado aceptado pasivamente | Jerarquía ya existente entre cálculo y cobertura, guía contextual, validación secuencial y decisión explícita |
| 5 · Error | Código dominante y evidencia | Hipótesis de diagnóstico, código alternativo o rechazo | Mensaje genérico; dificultad para saber si falta selección, evidencia o justificación dependiente | Error nombra el campo; foco; evidencia vinculada al código elegido; explicación sólo cuando corresponde |
| 6 · Entrenamiento | Rutina, criterio y plan; descarga | Práctica dirigida, variante y dos formas de cierre | Descarga inesperada; diferencia poco visible entre cerrar sesión y completar rutina; pérdida del avance | Guía contextual, botones con rótulos distintos, aviso de persistencia y criterios visibles |

## Hallazgos transversales corregidos

### Autocompletado y estado interno

Antes, el estado se actualizaba sólo con eventos `input` o `change`. Un navegador podía mostrar una fecha restaurada sin emitirlos. Ahora cada acción sincroniza primero los valores visibles del panel.

### Umbrales de texto

Los mínimos de caracteres estaban repartidos en las funciones de avance. Ahora viven en un registro único que alimenta simultáneamente etiqueta, contador y validación. El mensaje indica el campo, el mínimo y la longitud actual.

Los caracteres siguen siendo un umbral de suficiencia, no una medida de calidad. La pauta y la retroalimentación conceptual mantienen la función pedagógica principal.

### Escenarios e intentos

El contador anterior llamaba «intento» a cada configuración distinta de parámetros. Se separaron:

- **escenarios calculados**: configuraciones distintas del modelo, incluido el escenario inicial;
- **intentos de verificación**: clics explícitos en «Verificar el cierre».

El campo histórico `application.attempts` se conserva por compatibilidad con fichas existentes, pero la interfaz ya no lo presenta como respuesta del alumno. Las verificaciones nuevas se guardan en `application.verification_attempts`.

## Riesgos que conviene observar con estudiantes reales

1. Si los contadores inducen a escribir relleno para alcanzar el mínimo. Si ocurre, reemplazar el umbral por una lista breve de elementos esperados.
2. Si el desplegable global se descubre sin intervención docente. Puede probarse abierto por defecto durante la primera semana del curso, pero no se dispone de almacenamiento para recordar que ya fue leído.
3. Si «escenario calculado» sigue creciendo demasiado al arrastrar controles. No afecta el número de verificaciones; si distrae, puede retirarse de la interfaz y conservarse sólo en la ficha técnica.
4. Si la Clase 3 presenta demasiada densidad en los pasos 4–6. La recomendación es observar tiempo, abandonos y preguntas, no añadir más texto preventivo sin evidencia.

## Criterios de aceptación

- Una fecha visible funciona aunque no haya emitido eventos de edición.
- Ningún umbral que bloquee el avance permanece oculto.
- El primer campo pendiente recibe foco y `aria-invalid="true"`.
- Un clic en «Verificar el cierre» produce exactamente un intento de verificación.
- La guía global puede consultarse sin modal y todos los pasos muestran una instrucción de avance.
- Las fichas v0.5.1 sin `verification_attempts` siguen siendo legibles.
