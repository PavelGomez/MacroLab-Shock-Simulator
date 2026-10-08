# Evaluación e implementación · MacroLab Macroeconomía I

Fecha: 8 de octubre de 2026. Rama de trabajo: `redesign/laboratorios-experimentacion`. No se crearon commits ni se publicó.

## Versión elegida y estado inicial

Repositorio real: `/Users/pgomez/Documents/GPT/Macro1_GPT/repo_macrolab_auditoria`.

- Rama inicial: `audit/enlaces-publicos-2026-10-08`; árbol limpio, sin cambios ajenos que preservar. HEAD: `d07caf11dd25a4e28f275906f8e5120e7b6f28b6`.
- `git ls-remote origin HEAD refs/heads/main` confirmó ese mismo commit en `main`. No se hizo pull, reset ni actualización a ciegas.
- El HTML descargado de la [página publicada](https://pavelgomez.github.io/MacroLab-Shock-Simulator/macro1/#din) coincidió byte por byte con `macro1/index.html` antes de editar (`cmp`, salida 0).
- La copia `/Users/pgomez/Documents/Claude/Projects/Macroeconomia1/repo_macrolab` está en `269c2ec`, anterior a la auditoría de enlaces. Se usó como referencia de solo lectura. Las copias históricas de `06_MacroLab` no son la versión vigente. No se modificó material de `sources/` ni del proyecto Claude.
- Se leyó `CLAUDE.md` y README; no se encontraron AGENTS.md aplicables. La descripción de cinco ventanas en `CLAUDE.md` está desactualizada: el inventario publicado y local tenía ocho laboratorios: Índices, PIB por gasto, Mercado de bienes, Dinero / tasa, Relación LM, Curva IS, IS-LM y Mercado laboral. Ahora son nueve, al separar Bonos.
- Tecnología conservada: HTML, CSS y JavaScript autocontenidos; Canvas y motor SVG existentes. No se agregó framework ni dependencia. `jsdom` ya estaba declarado en package.json y package-lock.json; solo se instaló con `npm ci --ignore-scripts` para ejecutar pruebas.

### Mapa técnico verificado

En `macro1/index.html`: navegación `#tabs`, `activateTab` e `initTabs`; fórmulas `calcMeasurement`, `crossSolve`, `moneyInterest`, `lmSolve`, `isSolve`, `islmSolve`, `calcLabor` y `calcWsPs`; gráficos `drawMoney`, `drawCross`, `drawLm`, `drawIs`, `drawIslm`, `plotSvg` y `renderPlot`. Se verificó la existencia de `ACTIVITIES`, `buildActivities`, `loadActivity` y `applyPreset`. La ruta por clases, `loopLaunch`/`loopReturn`, `buildScenario`, fichas JSON e importación/exportación de aprendizaje viven en el mismo archivo. Los nuevos cálculos puros son `bondYield`, `bondPrice` y `moneySolve`; la presentación lee el estado de los controles.

## Matriz de evaluación

**E** = problema económico; **U** = dificultad de uso; **P** = oportunidad pedagógica. La columna de cambio describe lo implementado.

| Laboratorio | Objetivo | Qué puede modificar el estudiante | Qué calcula o representa | Problema detectado | Cambio propuesto e implementado | Criterio de verificación |
|---|---|---|---|---|---|---|
| Índices | Separar precios, cantidades e inflación | Precios, cantidades, canasta y ahora año base | PIB nominal/real, deflactor, IPC y variaciones | U/P: base fija y actividad antes de operar; vacíos podían valer cero | Tabla operativa primero, base 2019/2020/2021, resultados e interpretación antes de ejercicios; tablas desplazables por teclado | IPC y deflactor de la base = 100; pautas originales con base 2019; vacío elimina tabla; explicación reconoce coincidencias |
| PIB por gasto | Clasificar producción corriente | Categoría contable elegida para cada transacción | Aciertos y explicación del registro, incluidos C y M | U/P: selector auxiliar competía con la clasificación central | Transacciones desde el comienzo; guía posterior; práctica auxiliar plegable al final | Siguen las 14 transacciones y la retroalimentación contable; una única actividad auxiliar |
| Mercado de bienes | Encontrar Y* y explicar el multiplicador | c₀, c₁, I, G, T, t y régimen tributario | Equilibrio, consumo, ahorro, cierre y cruz keynesiana | U/P: guía y actividad antes de parámetros; lectura del resultado dispersa | Controles primero, interpretación dinámica junto al gráfico, guía y práctica al final | Pautas selladas, cierre I = S + T − G y circuito completo de Clase 3 sin regresiones |
| Bonos (antes dentro de Dinero / tasa) | Relacionar precio y rendimiento | VF y P_B en A; VF e i en B | Rendimiento y precio implícitos independientes | E/P: VF fijo, definición de i decimal confundible con porcentaje, cálculo mezclado con dinero | Nueva pestaña, fórmulas con sustitución, unidades, validación, supuestos a un año y práctica DIN-EX-01 al final | 100/95 → 5,2631579 %; 5 % → 95,2380952; cero, negativo, ida/vuelta, independencia y vacíos |
| Mercado de dinero | Resolver el equilibrio bajo un cierre explícito | d₁, d₂, Y y oferta real, o tasa objetivo; monto real de intervención | i* o M/P requerido; demanda, oferta, E e interceptos | E/U/P: tasa objetivo solo manual; gráfico cortaba resultados negativos y no mostraba interceptos; venta truncada silenciosamente | Dos regímenes operativos, oferta calculada deshabilitada, venta con límite explícito, vista completa/acercada/restauración y descripción dinámica | 2 %, 2,4 %, 768, interceptos 800 y 40 %, compra a 800 → 0 %; inviabilidad, zoom y cambio de régimen |
| LM | Construir pares (Y,i) desde dinero | Y inicial/final, M, P, d₁, d₂, shock y cierre | Mercados alineados, pendiente, interceptos y desplazamiento | U/P: actividad y explicación primero; texto demasiado categórico sobre tasas negativas | Construcción original conservada, unidades claras, resultados antes de guía y práctica; entrada inválida limpia representación; límites explicados | Actividades LM-EX-01…06; movimiento por Y frente a desplazamiento; cierre de tasa con oferta no negativa |
| IS | Construir la IS desde bienes | Consumo, inversión, fiscalidad, tasa y cambio | Cruces de bienes y pares de la IS, multiplicadores | U/P: práctica antes de configurar; resultado viejo frente a dato inválido | Mercados relacionados conservados; operación primero; práctica final; reinicio de valores iniciales y limpieza de datos inválidos | Seis actividades IS; movimientos por i, desplazamientos y solvers originales |
| IS-LM | Comparar equilibrios con un cierre monetario | Parámetros fiscales, monetarios, inversión, shocks y modo | IS/LM, equilibrios y efectos sobre inversión | U/P: selector de práctica ocupaba el acceso operativo | Cierres, comparación, zoom y modos conservados; guía/práctica posteriores; validación de factibilidad y escala | Seis actividades, solvers y gráficos; cierre horizontal no busca intercepto de LM ascendente; reportes conservados |
| Laboral | Leer indicadores y distinguirlos de WS–PS | Ocupados, desocupados, inactivos y margen m | PA, PET, tasas; salario real y uₙ en otro panel | E/U/P: cero denominador leído como 0 %; campos estrechos recortaban cifras; práctica central | Paneles independientes conservados, números completos visibles, tasas indefinidas como —, práctica al final | Indicadores ENE originales, fórmula WS–PS y cero denominador explicado |

## Decisiones de arquitectura: qué se replicó y qué se descartó

Todos los laboratorios abren con propósito, valores de referencia y controles; las guías conceptuales quedan plegables después de la operación. La clasificación contable comienza con transacciones porque esa es su operación central. Cada selector auxiliar aparece una sola vez, dentro del bloque final «Actividades opcionales para practicar». Elegir una opción no carga datos: el botón de carga lo hace. La carga identifica ejercicio y parámetros; los recálculos no reaplican presets. «Volver a los valores de la actividad» y «Restablecer valores iniciales del laboratorio» son acciones distintas. Se mantienen respuestas guardadas durante la sesión; restablecer elimina la actividad activa, no ese historial. Si hay un intento guiado de Clase 3 en curso, restablecer parámetros conserva su contexto y regreso, y lo informa. En la práctica de solo efectivo se conserva la relación especial d₂ = Y/100 y se advierte al explorar una demanda que no cumple esa restricción.

- **Índices:** se replicaron jerarquía, unidades, validación y reinicio. Se agregó la base editable. Se usan tablas de ancho completo y desplazamiento local; se descartaron zoom e interceptos, que no aportan a esta medición.
- **PIB por gasto:** se conservó el clasificador, las categorías y la explicación por transacción. No se convirtió en calculadora de equilibrio ni se agregó un gráfico artificial. El botón existente reinicia clasificación. No se ofrece un reinicio de parámetros de actividad que no existen en este módulo.
- **Bienes:** se replicó el recorrido y se añadió interpretación numérica del multiplicador; se conservan controles acotados y la comprobación del ahorro. No se añadió una calculadora de bonos ni otro zoom: la cruz existente cumple su función.
- **Bonos:** se crearon calculadoras independientes. Los casos A/B de DIN-EX-01 cargan explícitamente solo el panel A; B sirve para comprobar el cálculo inverso. Se conservaron los identificadores del verificador de las dos tasas. No se agregó un gráfico de mercado a una calculadora que no modela oferta y demanda de bonos.
- **Dinero:** aquí sí se justifican interceptos y zoom. La demanda tiene pendiente −1/d₂ en el plano (saldos,i); d₂ conserva unidades por punto porcentual. Cambiar de cantidad a objetivo conserva la tasa válida; volver conserva la oferta requerida válida. Un objetivo inviable deja el resultado vacío y explica la restricción M/P ≥ 0. Las ventas que exceden la oferta se rechazan sin truncar. El gráfico conserva tasas negativas y resume interceptos fuera de encuadre.
- **LM:** se conservaron los dos mercados alineados y los shocks que enseñan movimiento frente a desplazamiento. Su vista existente recorta bajo cero y ahora lo declara como límite de visualización, sin prohibición universal de tasas negativas. No se replicaron las calculadoras de bonos.
- **IS:** se conserva la construcción en dos gráficos; cambiar la tasa es movimiento, cambiar gasto autónomo es desplazamiento. No se convirtió en una IS independiente de su mercado de origen.
- **IS-LM:** se conservaron los dos cierres, zoom, comparación, desequilibrios y efectos sobre inversión. La leyenda del motor gráfico cambia de fila cuando no cabe junto al título; las coordenadas para interacción usan esos mismos márgenes. No se reescribieron las ecuaciones para acomodar el nuevo diseño.
- **Laboral:** indicadores y WS–PS siguen separados. Se descartaron interceptos o zoom monetarios: una tasa observada y el desempleo natural simplificado responden preguntas distintas.

## Compatibilidad económica y de estado

`#din` sigue siendo el mercado de dinero y los enlaces de la ruta continúan funcionando. `#bonos` es nuevo; `#bond-panel-a` y `#bond-panel-b` permiten enlazar el cálculo pertinente. Los accesos por fragmentos, historial y flechas de teclado conservan el motor de navegación. La tarjeta de contexto y el regreso de Clase 3 se preservan.

Se conservan IDs, consignas, pautas y esquema `macrolab-macro1-scenario/1.1`. En DIN-EX-01 se aclaró la fórmula porcentual; no cambiaron sus respuestas. La ficha de dinero mantiene `bondPrice` como referencia de compatibilidad (VF = 100), ahora con supuestos explícitos; la calculadora visible usa VF editable y no depende de ese campo. La ficha agrega el cierre efectivo en `params.regime`/`results.regime`; el `regime` superior sigue siendo el metadato original del ejercicio. Si la entrada monetaria es inválida se exporta `valid:false` con el motivo, no un resultado anterior.

Se explicitan ausencia de cupones, un año restante, pago completo, ausencia de impuestos/comisiones, tasa porcentual y diferencia entre mantener hasta el vencimiento y revender antes. El modelo monetario distingue saldos de flujos y Δ(M/P) de ΔM nominal; no atribuye creación de dinero agregado a una compraventa entre particulares.

La tarjeta chilena se contrastó con [el comunicado oficial del 8 de septiembre de 2026](https://www.bcentral.cl/c/document_library/get_file?groupId=33528&uuid=3cec1aa3-00d3-8486-98d6-1eeddb7d997e), [la Minuta N° 324](https://www.bcentral.cl/c/document_library/get_file?groupId=33528&uuid=d7da02ea-3316-9573-a768-a52fe296df46) y [el marco operacional del BCCh](https://www.bcentral.cl/web/banco-central/areas/politica-monetaria). Se distingue la TPM de la tasa interbancaria y del rendimiento de cualquier bono.

## Verificación realizada

- **Antes de editar:** 14 suites pasan, incluidas fórmulas selladas, paquete, retroalimentación, continuidad de exportación/importación, Clase 3, LM, IS, IS-LM y auditorías obligatorias. El primer intento no fue una falla económica: faltaba instalar jsdom. Registro: [pruebas-iniciales.json](pruebas-iniciales.json).
- **Después:** 15 suites pasan. El nuevo `test_experimentacion.js` comprueba 208 condiciones económicas, de estado, arquitectura, validación y rótulos responsive. Registro de salida real: [pruebas-finales.json](pruebas-finales.json).
- **Cambios legítimos de contrato en pruebas existentes:** carga mediante botón en los helpers de actividades, inventario de diez pestañas (ruta + nueve laboratorios), nuevo nombre del mercado de dinero, y sustitución visible que muestra 2 % sin exigir el antiguo HTML `<strong>2,00 %`. Se mantuvieron las expectativas numéricas selladas y la comparación gráfica de estados.
- **Navegador real:** Codex In-app Browser, escritorio con viewport solicitado 1280×1000; móvil solicitado 390×844 (el navegador informó ancho efectivo 433 por su escala). Se visitaron los nueve laboratorios; no hubo desbordamiento horizontal global (`scrollWidth 416 < innerWidth 433`). Las tablas y la barra de navegación tienen desplazamiento local deliberado.
- Se revisaron visualmente calculadoras y gráficos de dinero, bienes, LM, IS, IS-LM y WS–PS. Se verificaron zoom completo/acercado, oferta cero, tasa objetivo con Y = 1.010 → M/P = 768, negativo en bonos, mensaje con d₂ = 0 y desaparición del gráfico inválido; navegación por fragmento y flecha de teclado; selección/carga/modificación/exportación de DIN-EX-02 con Y = 1.010 y tasa 2,4 %. Consola: sin errores ni advertencias capturadas.
- La revisión encontró y corrigió: leyenda superpuesta al título en tamaños pequeños, interpretación «difieren» cuando ambos índices valían 100 con base 2020, y recorte de cifras completas en campos laborales.

Capturas: [Dinero en escritorio](dinero-escritorio.jpg), [Dinero en móvil](dinero-movil.jpg), [Bonos](bonos-escritorio.jpg).

## Límites y pendientes concretos

El laboratorio declara un límite numérico de ±10¹² para entradas y resultados; rechaza desbordamientos en cálculos, no los interpreta como fenómenos económicos. Es aritmética de punto flotante, con tolerancias en pruebas. Los valores negativos de tasa se admiten; la factibilidad no implica que una demanda lineal sea empíricamente válida en todo el rango.

La revisión móvil usa emulación de tamaño en el navegador disponible, no un teléfono físico. No se hizo una matriz de navegadores externos ni prueba con lector de pantalla. Las tasas negativas de LM/IS/IS-LM siguen sujetas a las vistas recortadas existentes; el nuevo mercado de dinero sí las representa. `npm ci` informó dos avisos de seguridad de las dependencias de desarrollo ya bloqueadas; no se actualizó el lockfile dentro de este rediseño. No quedan cambios funcionales pendientes para los dos nuevos laboratorios; commits y publicación corresponden al usuario.

Los pasos completos de Terminal están en [TERMINAL.md](TERMINAL.md).
