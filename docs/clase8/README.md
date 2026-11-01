# Clase 8 · Mundell-Fleming

La Clase 8 continúa las clases 6–7 con la Nota de estudio 9. Incluye seis materiales en HTML y PDF, la ruta de seis pasos y un laboratorio con flotación, cambio fijo y una prima exógena constante.

## Revisar la clase

Desde la raíz del repositorio, servir el sitio y abrir `macro1/index.html?clase=8#route`. El laboratorio está en `macro1/mundell-fleming.html`. El catálogo enumera los seis recursos y cada documento ofrece su PDF. La pauta web exige registrar un intento antes de mostrarse: es una condición didáctica para material de práctica público, no un control de acceso.

El núcleo presencial dura 70 minutos, con crónica y secciones 1–4 de la nota como preparación previa. El cuaderno diferencia tareas centrales y opcionales. La respuesta inicial de la ruta queda congelada durante la sesión; revisión, práctica y ticket se registran aparte. El reporte HTML es legible e imprimible; JSON es un respaldo. No hay persistencia ni datos personales. Las decisiones y cifras se comprueban; la calidad del razonamiento necesita lectura docente.

## Calibración

Flujos de producción y gasto de un mismo trimestre docente, a precios de referencia. Dinero real como saldo; tasas en porcentaje anual y E en CLP/USD. No es una estimación ni un pronóstico de Chile.

C = 100 + 0,75(Y − 80); I = 160 + 0,15Y − 15i; G = 200; XN = 140 − 0,10Y + 0,20E; M/P = 1.450; Md = 0,50Y − 50i; i* = 4. Base: Y = 3.300, i = 4 %, E = 900, XN = −10. Shocks separados: G +20; M/P +100; i* +1 punto porcentual; x₀ −20; prima +1 punto porcentual. Práctica nueva: G +30. Con cambio fijo, E = 900 y M/P final es endógeno.

`mf-model.js` contiene el solver y los SVG; `clase8.js`, la ruta; `mf-lab.js`, los controles del laboratorio. Se embeben los dos primeros en la aplicación para conservar su arquitectura autocontenida y las pruebas con JSDOM.

## Regenerar y comprobar

Se necesita Node y un directorio de dependencias con `marked` y `playwright`. `RUNTIME_NODE_MODULES` apunta al paquete de dependencias del entorno. El sitio debe servirse en `http://127.0.0.1:8768` para renderizar.

```sh
node scripts/embed-clase8.js
node scripts/embed-glosario.js
node docs/clase8/build.mjs
node docs/clase8/render.mjs
node scripts/embed-clase8.js --check
node scripts/embed-glosario.js --check
node scripts/check-manifest.js
node test_pautas_biblioteca.js
node macro1/test_clase8_mundell_fleming.js
```

Ejecutar también todas las suites `macro1/test_*.js` como hace el CI. La nueva suite usa fixtures derivados de los enunciados, eliminación gaussiana independiente, sustitución en las ecuaciones originales, barrido paramétrico, auditoría del motor histórico y un recorrido real de controles en JSDOM. Comprueba bloqueo de pauta, inmutabilidad del intento, revisión separada, invalidación al editar y recursos locales. Dos expectativas de navegación anteriores se amplían a once pestañas y a la nueva matriz editorial; las aserciones económicas existentes se conservan.

La versión de contenido propia de Clase 8 vive en `MANIFEST.class8`; las versiones y el esquema de continuidad de las clases anteriores permanecen. `fuentes.json` registra fuente oficial, consulta, período, unidad, frecuencia y estado de cada cifra histórica o proyectada. No se actualizan automáticamente esos valores.

## Auditoría del módulo principal y de materiales históricos

El módulo principal conserva su cálculo original. Allí `eRaw` entra en XN y la IS, mientras `eIndex = 100 + eRaw` se muestra como índice. Sus `fxShock` se suman después de obtener E del sistema: con ellos puede fallar la igualdad de bienes. No soporta cambio fijo ni prima. La aplicación principal enlaza al laboratorio de Clase 8, que resuelve las tres condiciones simultáneamente sin ese ajuste posterior.

Ayudantía 11: la versión original usa M/P = 900 y Md = 60 + 0,50Y − 0,20i. La v2 ya elimina la constante y usa 840, con expansión a 1.040 y dinero requerido bajo fijo de 940 (frente a 1.000 en v1). Se verifica la equivalencia; no se vuelve a tratar la v2 como una discrepancia pendiente. La Clase 8 usa una calibración nueva que continúa los coeficientes de consumo e inversión de la Clase 6.

La nota histórica revisada tenía el signo de depreciación esperada invertido en UIP. La edición nueva usa el signo positivo, el mismo horizonte y un factor 100 para tasas en porcentaje. El bloque v0.2 confundía en algunos pasajes una prima variable con una BP inclinada; aquí una prima exógena constante solo cambia la altura. Se retira la identificación automática de un canal dominante a partir de cobre y peso y se distinguen promedios de variaciones dentro del año. No se modifica ningún original histórico ni `sources/`.

La revisión editorial usa dos perspectivas (primera lectura y rigor) y revisión visual de páginas y figuras, incluyendo escala de grises. No se presenta como un experimento con estudiantes ni como una revisión firmada por personas independientes. No contiene material docente reservado ni pautas de evaluaciones futuras.
