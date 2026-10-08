# Auditoría de enlaces públicos de MacroLab — 2026-10-08

## Estado

**Cambios locales listos para revisión; publicación no realizada.** La auditoría de código, pruebas, generación de PDF y recorridos de navegador ejecutados antes del límite de uso quedó registrada. El último reintento de navegador y de GET externo fue bloqueado por el revisor automático al alcanzar el límite de uso; por eso esos recorridos finales quedan marcados como pendientes y no se declaran verificados.

## Repositorio y relación con lo publicado

La ruta indicada `repo_macrolab` es un enlace simbólico a `/Users/pgomez/Documents/Claude/Projects/Macroeconomia1/repo_macrolab`. Para no modificar esa copia ni `sources/`, se creó la copia de auditoría local:

`/Users/pgomez/Documents/GPT/Macro1_GPT/repo_macrolab_auditoria`

La copia conserva el remoto `https://github.com/PavelGomez/MacroLab-Shock-Simulator.git` y parte del mismo estado publicado (commit de referencia `269c2ec657e53a56e750999db9ce48b0474a08b6`). Los hashes de `index.html`, `macro1/index.html` y `script.js` coincidían con la versión pública consultada antes de editar. No se hizo commit, push ni publicación.

## Reproducción y causa comprobada

En la ruta `Clase 4 → Dinero → Preparación ordenada`, los dos enlaces problemáticos sí cambiaban la URL a `#din` y `#lm`, pero no activaban el panel del laboratorio. El controlador antiguo estaba limitado al contenedor del resumen de clase; los enlaces de preparación vivían fuera de ese contenedor. El hash cambiaba sin que se ejecutara la transición de pestaña, de modo que el panel permanecía oculto. Abrir directamente `macro1/#din` o `macro1/#lm` sí permitía seleccionar el panel, lo que confirmó que el problema era de navegación/controlador y no del laboratorio.

La corrección usa un único delegado para anclas internas, valida que el destino sea una pestaña real, activa el panel, actualiza `aria-selected`/`hidden`, enfoca el destino y conserva la entrada de historial. Se añadió manejo de `hashchange`, navegación atrás/adelante, teclado y fragmentos anidados. En la portada, la activación por `?tab=islm` conserva el fragmento y el estado de escenario.

## Inventario

El inventario está en [inventario-enlaces.csv](./inventario-enlaces.csv) y se genera desde [audit-links.cjs](../../scripts/audit-links.cjs).

| Medida | Resultado |
|---|---:|
| Páginas HTML recorridas por código | 32 |
| Ocurrencias de enlaces/controles | 686 |
| Destinos declarados únicos | 351 |
| Contextos sintéticos de clases y actividades | 47 |
| Controles dinámicos incluidos | 168 |
| Apariciones de descarga | 103 |
| Destinos externos únicos observados en el inventario | 33 |
| Problemas estructurales locales detectados por el inventario | 0 |

Las filas sintéticas de clase/paso están identificadas por la columna `contexto`; no se presentan como clics de navegador. Los controles intencionalmente deshabilitados se conservaron como controles y no se clasificaron como enlaces rotos.

## Correcciones aplicadas

- `macro1/index.html`: navegación delegada y robusta entre paneles, fragmentos directos, teclado, foco e historial.
- `script.js` e `index.html`: activación segura por `?tab=`, preservación de fragmentos de escenario y enlaces de retorno accesibles.
- Referencias del Atlas y del registro de crónicas:
  - CEPAL: se reemplazó el slug 404 por el registro vigente de *Estudio Económico 2021*.
  - FMI Chile: se corrigió el registro a CR 24/41 y a la página oficial correspondiente.
  - Demiralp & Demiralp: se corrigió el DOI a `10.1080/14683849.2018.1505512`.
  - Garriga & Rodriguez: se corrigió el DOI a `10.1016/j.econmod.2019.05.009`.
  - FMI Noruega: se corrigió el registro a CR 21/104 y su página oficial.
- `macro1/notas/index.html` y la vista de fuentes de clase: acciones emparejadas `Leer en línea` / `Descargar PDF` o `Abrir PDF` según el comportamiento esperado.
- Se generaron PDF estáticos para las crónicas de Clases 3–7 a partir del HTML canónico:
  - [cronica-clase3.pdf](../../macro1/notas/cronica-clase3.pdf), 3 páginas.
  - [cronica-clase4.pdf](../../macro1/notas/cronica-clase4.pdf), 4 páginas.
  - [cronica-clase5.pdf](../../macro1/notas/cronica-clase5.pdf), 3 páginas.
  - [cronica-clase6.pdf](../../macro1/notas/cronica-clase6.pdf), 3 páginas.
  - [cronica-clase7.pdf](../../macro1/notas/cronica-clase7.pdf), 3 páginas.

El mapa completo de 22 pares HTML/PDF está en [pdf-map.json](./pdf-map.json). Los cinco PDF nuevos tienen texto extraíble, título, pie de página y gráficos/tablas conservados; la revisión visual de primera página está en [pdf-contact-final-v2.png](./evidencia/pdf-contact-final-v2.png) y los metadatos en [pdf-final.json](./evidencia/pdf-final.json). Los PDF son representaciones estáticas: no ejecutan laboratorios ni conservan parámetros interactivos.

## Evidencia de navegador

La evidencia se conserva en [evidencia/](./evidencia/):

- [browser-cases.json](./evidencia/browser-cases.json): clic en Dinero y LM, panel visible correcto, foco, atrás/adelante y teclado.
- [clase4-din.png](./evidencia/clase4-din.png) y [clase4-lm.png](./evidencia/clase4-lm.png): paneles resultantes.
- [mobile-din.png](./evidencia/mobile-din.png) y [mobile-lm.png](./evidencia/mobile-lm.png): recorrido móvil con ambos enlaces y recarga.
- [public-home-panels.json](./evidencia/public-home-panels.json): navegación de portada y consola sin errores registrados.
- [pages-browser.json](./evidencia/pages-browser.json): páginas públicas, títulos, anclas y controles revisados.
- [atlas-dialogs.json](./evidencia/atlas-dialogs.json) y [atlas-external-final.json](./evidencia/atlas-external-final.json): tarjetas del Atlas y fuentes externas comprobadas antes del límite de uso.
- [downloads-verified.json](./evidencia/downloads-verified.json): 36 archivos PDF existentes descargados desde el navegador, hash coincidente y apertura comprobada.

Los dos enlaces reportados quedan comprobados en la evidencia: el clic activa el laboratorio correspondiente, el panel queda visible, se puede volver a la Clase 4 y atrás/adelante conserva el avance. La prueba automatizada equivalente contiene 27 aserciones y pasa.

## Pruebas

[tests-final.json](./tests-final.json) registra 15 suites aprobadas y 0 fallos. Incluye `macro1/test_navigation.js`, `test_formulas_clases4_7.js`, `test_formulas_selladas.js`, los laboratorios IS/LM/ISLM, continuidad de exportación/importación, manifiesto, glosario, paquete y pruebas pedagógicas. Las suites que usan `jsdom` se ejecutaron con el `NODE_PATH` indicado en ese archivo.

## Límites pendientes

La red del entorno quedó sin resolución DNS para la comprobación Python de 217 URLs (registro técnico en [http-blocked-dns.json](./http-blocked-dns.json)) y el revisor automático bloqueó los últimos accesos de navegador por límite de uso. Esas dos limitaciones no se interpretan como enlaces rotos: los estados HTTP finales de esas URLs quedan **sin verificar en esta ejecución**. Las fuentes que sí se abrieron en navegador y las páginas oficiales encontradas por búsqueda quedan documentadas por título y URL en la evidencia; la publicación debe esperar a repetir el lote externo y una recarga final del sitio local cuando el navegador vuelva a estar disponible.
