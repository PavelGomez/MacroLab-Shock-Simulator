# Auditoría de fuentes del Atlas shock × configuración institucional

Estado del documento: Fase 1 · estabilización documental  
Fecha de referencia: 2026-05-12  
Simulador: MacroLab Shock Simulator  
Archivo visible del Atlas: `atlas-lentes-institucionales.html`  
Registro canónico provisional: `content/cronicas-registry.es-ES.js`

---

## 1. Propósito del documento

Este documento registra los criterios de auditoría de fuentes utilizados para revisar las crónicas históricas del Atlas shock × configuración institucional de MacroLab.

Su función es dejar trazabilidad sobre:

1. qué tipo de fuente se considera aceptable;
2. qué errores deben corregirse;
3. qué relación debe existir entre título, autoría, fecha, revista, institución y enlace;
4. cómo deben sincronizarse las correcciones entre el registro de crónicas y el HTML visible;
5. qué casos ya fueron revisados en la primera etapa de auditoría.

Este documento no reemplaza las fuentes primarias ni las referencias académicas. Su función es operativa: ayudar a mantener consistencia, verificabilidad y estabilidad en el Atlas.

---

## 2. Problema que motivó la auditoría

Durante la revisión inicial del Atlas se detectaron inconsistencias entre referencias visibles, enlaces y registros internos.

El problema principal no fue solo bibliográfico, sino también arquitectónico: algunas referencias corregidas en `content/cronicas-registry.es-ES.js` no aparecían en la versión publicada porque el Atlas seguía leyendo una copia embebida dentro de `atlas-lentes-institucionales.html`.

Por tanto, la auditoría de fuentes debe coordinarse con la arquitectura del Atlas.

Mientras exista duplicación entre el HTML y el registro de crónicas, toda corrección debe aplicarse en ambos lugares.

---

## 3. Regla operativa de corrección

Toda corrección futura de fuentes debe seguir este orden:

1. Revisar primero la referencia en `content/cronicas-registry.es-ES.js`.
2. Corregir allí título, autoría, año, institución, revista, URL o comentario contextual.
3. Replicar la misma corrección en `atlas-lentes-institucionales.html` mientras el HTML conserve datos embebidos.
4. Verificar que la versión publicada del Atlas muestre la corrección.
5. Registrar en este documento los casos relevantes de auditoría, especialmente cuando el enlace original era incorrecto o ambiguo.

Esta regla es temporal. Cuando el Atlas lea directamente desde registros externos, el paso de replicar correcciones en el HTML deberá eliminarse.

---

## 4. Criterios de fuente aceptable

Una fuente se considera aceptable cuando cumple al menos una de las siguientes condiciones.

### 4.1. Fuente académica verificable

Puede ser:

- artículo publicado en revista académica;
- working paper institucional;
- capítulo o libro académico;
- documento con autoría, título, fecha y afiliación verificables.

Cuando el texto completo no esté disponible, el enlace debe conducir al menos a una página donde puedan verificarse:

- título;
- autor o autores;
- año;
- revista, editorial o institución;
- resumen o descripción del contenido.

Ejemplos de destinos aceptables:

- página de la revista;
- ScienceDirect, JSTOR, Cambridge Core, Oxford Academic u otro repositorio editorial;
- NBER, CEPR, IMF, World Bank, BIS u otra institución reconocida;
- página oficial del autor o institución académica.

### 4.2. Fuente institucional verificable

Puede ser:

- banco central;
- ministerio de finanzas;
- organismo fiscal;
- FMI;
- Banco Mundial;
- OCDE;
- BIS;
- CEPAL;
- Comisión Europea;
- institución estadística oficial;
- organismo regulador.

Debe verificarse que el enlace lleve a un documento o página directamente relevante para el caso citado.

No basta con enlazar a la portada general de una institución si la tarjeta afirma algo específico.

### 4.3. Fuente histórica o periodística de apoyo

Puede usarse como apoyo contextual cuando:

- documenta un episodio histórico;
- ayuda a ubicar fecha, secuencia o actores;
- no reemplaza una fuente académica o institucional cuando la afirmación requiere mayor rigor.

Debe evitarse usar prensa como única fuente para afirmaciones analíticas fuertes sobre causalidad macroeconómica, credibilidad institucional o efectos de política.

---

## 5. Criterios de rechazo o revisión

Una fuente debe corregirse o marcarse para revisión cuando ocurra cualquiera de los siguientes problemas:

1. El enlace dirige a una página no relacionada con la referencia.
2. El título visible no coincide con el documento enlazado.
3. La autoría indicada no coincide con la fuente real.
4. El año indicado no coincide con la publicación.
5. La fuente enlazada no permite verificar la referencia.
6. El enlace dirige solo a una portada institucional demasiado general.
7. El enlace está roto.
8. El documento es relevante para el tema general, pero no para la afirmación específica de la tarjeta.
9. La referencia parece inventada, incompleta o no trazable.
10. La fuente es periodística pero se usa para sostener una afirmación que requiere evidencia académica o institucional.

---

## 6. Casos revisados en la primera etapa

Durante la primera etapa de auditoría se revisaron y corrigieron referencias en las siguientes tarjetas o crónicas:

1. Argentina 2020.
2. Chile 2021–2024.
3. Noruega 2020.
4. Argentina convertibilidad 1991–2002.
5. Chile 2008–2009.
6. Suecia 1994–1998.
7. Grecia 2010–2015.

Estas correcciones fueron aplicadas tanto en `content/cronicas-registry.es-ES.js` como en `atlas-lentes-institucionales.html`.

La duplicación se mantuvo de manera deliberada porque el Atlas visible todavía conserva datos embebidos.

---

## 7. Estado de sincronización actual

Al cierre de esta etapa, la versión publicada del Atlas muestra correctamente al menos las referencias corregidas que fueron revisadas.

Sin embargo, el riesgo de desincronización persiste mientras el HTML siga conservando una copia embebida de los datos.

Por tanto, la auditoría de fuentes debe considerarse estabilizada solo de manera provisional.

La estabilización completa requerirá que el Atlas lea sus datos desde registros externos.

---

## 8. Registro operativo de auditoría

Cada nueva corrección relevante deberá registrarse usando esta estructura:

- Caso:
- Archivo corregido:
- Referencia anterior:
- Problema detectado:
- Referencia corregida:
- URL corregida:
- Criterio aplicado:
- Verificación en versión publicada:
- Fecha:

Ejemplo:

- Caso: Suecia 1994–1998
- Archivo corregido: `content/cronicas-registry.es-ES.js` y `atlas-lentes-institucionales.html`
- Referencia anterior: enlace no suficientemente relevante o no verificable
- Problema detectado: la fuente no permitía confirmar adecuadamente el episodio citado
- Referencia corregida: documento académico o institucional verificable sobre consolidación fiscal sueca
- URL corregida: registrar URL en el archivo fuente, no necesariamente aquí
- Criterio aplicado: fuente académica/institucional verificable
- Verificación en versión publicada: referencia visible correctamente en la tarjeta
- Fecha: 2026-05-12

---

## 9. Relación con futuras fases

Este documento se vincula con las siguientes fases del protocolo.

### Fase 2

Cuando se cree `content/routes-registry.es-ES.js`, deberá distinguirse claramente entre:

- fuente de una crónica histórica;
- ruta operativa de una celda de matriz;
- justificación conceptual de una combinación shock × configuración institucional.

### Fase 3

Cuando se agreguen rutas usando crónicas existentes, no se deberán crear nuevas fuentes si la ruta solo reutiliza una crónica ya auditada.

### Fase 4

Cuando el Atlas se conecte a registros externos, deberá verificarse que las tarjetas visibles lean efectivamente desde `content/cronicas-registry.es-ES.js`.

### Fase 6

Cuando se creen nuevos casos históricos, cada nuevo caso deberá pasar por auditoría de fuentes antes de ser tratado como ruta curada.

---

## 10. Principio de cierre

La auditoría de fuentes debe servir a la claridad pedagógica y a la trazabilidad académica del Atlas.

No se trata de multiplicar referencias por volumen, sino de asegurar que cada tarjeta histórica tenga fuentes suficientes, verificables y coherentes con la afirmación analítica que sostiene.
