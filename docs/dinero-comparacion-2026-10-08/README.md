# Mercado de dinero: uno o dos equilibrios y mecanismo de ajuste

## Punto de partida y decisión de diseño

El rediseño anterior estaba integrado por el PR #68: `main`, commit `6278190`, directorio limpio al iniciar esta ampliación. Se trabaja en `fix/dinero-comparacion-ajuste`, sin commits ni publicación. Antes de la primera ampliación pasaron las 15 suites existentes: 4.899 comprobaciones contabilizadas. Antes de esta segunda iteración pasaron 16 suites: 4.994 comprobaciones.

La primera ampliación permitía guardar un inicial propio, pero obligaba a guardar ese punto de partida para comparar. Tras la revisión del usuario, se reemplazó ese recorrido por un selector y calibraciones explícitas, sin mantener un estado inicial oculto.

## Comportamiento final

- **Selector «¿Qué quieres observar?»**: «Observar un equilibrio» es el modo inicial; «Comparar dos equilibrios (inicial y final)» habilita la comparación directamente.
- **Separación visual**: «Estado final» tiene 24 px de separación superior y 8 px antes de sus etiquetas inferiores, para agruparlo con sus propios controles.
- **Controles independientes**: Y₁ y (M/P)₁ iniciales; Y₂ y (M/P)₂ finales. d₁ y d₂ son comunes. La actividad de solo efectivo conserva su excepción declarada d₂ = Y/100 para cada estado mientras se respete la restricción.
- **Un equilibrio**: se calcula y representa solo el inicial E₀. Los valores finales se conservan, pero no se utilizan, validan ni exportan como resultados activos. No aparecen tabla de comparación, E₁ ni precio final del bono. Incluso un Y₂ vacío, negativo o extremo no afecta al inicial válido.
- **Dos equilibrios**: tabla inicial/final con diferencias; E₀ y E₁ y curvas pertinentes; zoom que incluye ambos estados. Si coinciden, se declara E₀ = E₁. «Copiar estado inicial al final» permite partir de calibraciones iguales y aislar un cambio sin editar ambas a mano.
- **Oferta fijada**: ambas ofertas son editables. En comparación una compra o venta del banco central modifica exclusivamente (M/P)₂. En un equilibrio modifica exclusivamente (M/P)₁. Se rechazan ventas mayores que la oferta correspondiente, sin truncar.
- **Tasa objetivo**: una meta común determina la cantidad requerida para cada Y. Ambas ofertas se deshabilitan como entradas. Al pasar desde cantidad fijada se conserva como meta la tasa inicial válida; las cantidades se ajustan. Al volver se conservan ambas cantidades requeridas válidas. No se cambia Y₁ ni Y₂ por cambiar de régimen o de vista.
- **Actividades**: cargar o volver explícitamente a una actividad abre un equilibrio y prepara Y₂/M/P₂ con el mismo preset. La selección sola no carga nada. Restablecer el laboratorio vuelve a un equilibrio, con Y₁ = 1.000, Y₂ = 1.010 y ambas ofertas 760. Las actividades permanecen al final.
- **Mecanismo dinámico**: en comparación evalúa la demanda final a la tasa inicial, identifica el exceso de demanda/oferta y explica venta/compra de bonos, cambio inverso de precio y tasa. Bajo meta constante explica la provisión o el retiro requeridos. En un equilibrio describe únicamente el equilibrio observado.
- **Bonos**: VF editable y precio de referencia calculado como `VF/(1+i/100)`. En un equilibrio solo hay precio inicial; en comparación hay ambos precios y diferencia. Supuestos: sin cupones, un año, pago completo, sin comisiones ni impuestos, rendimiento igual al del único activo remunerado del modelo. No se identifica con cualquier bono real ni con la TPM.
- **Q_B es ilustrativo**: el esquema de bonos no calcula cantidades negociadas ni trayectorias temporales. Sus curvas y posiciones Q₀/Q₁ no son cifras ni predicciones de volumen. Con tasa constante la explicación describe la intervención que contrarresta la presión inicial y el esquema no muestra cambio neto de precio.
- **Validación**: un final inválido bloquea la comparación y elimina resultados anteriores, pero se ignora en la vista inicial. Un VF inválido o tasa ≤ −100 % elimina el precio/esquema de bonos, conservando el equilibrio monetario válido. Una tasa monetaria negativa se conserva sin sustituirla por cero.

Se mantienen #din, IDs originales de controles iniciales, identificadores de actividades, ruta por clases y campos heredados de exportación. `viewMode` identifica la vista. `initialParams` y `finalParams` describen las calibraciones activas; finalParams es null en un equilibrio. `comparison` es null en esa vista y contiene ambos equilibrios solo en comparación. Los campos heredados Y/MsReal/interestRate corresponden al estado mostrado (inicial en single, final en compare). `bondPrice` conserva su referencia explícita VF = 100.

## Verificación y cambio legítimo de contrato

La suite `macro1/test_dinero_comparacion.js` contiene 159 comprobaciones: modo inicial, independencia de Y₁/Y₂ y ofertas, conservación al cambiar de vista, final válido o inválido ignorado en single, exportación sin final inactivo, copia, shocks en ambos sentidos, compensación, coeficientes comunes, dos regímenes, intervención sobre el estado correcto, actividades, restablecimiento, zoom, VF independiente y limpieza de resultados inválidos. Incluye encuadre de ambos equilibrios y ausencia de solapamientos a 320, 390 y 620 de ancho.

Una prueba de `test_lab_lm.js` suponía que comprar bonos comparaba automáticamente con el preset. Se actualizó la preparación para seleccionar explícitamente compare antes de la compra. Se conservó la expectativa de dos entradas de leyenda y las restantes verificaciones numéricas y gráficas: el contrato de interacción cambió por solicitud del usuario, no para ocultar una regresión económica.

El motor gráfico reserva la leyenda antes de ubicar puntos, y prueba posiciones adicionales para rótulos próximos (por ejemplo, equilibrio e intercepto horizontal). El workflow de GitHub recorre test_*.js e incluye las dos suites nuevas que quedaban fuera de la antigua lista explícita.

Revisión real en navegador local, escritorio 1280 × 1000 y móvil emulado 390 × 844:

- Y₁ = 1.000, Y₂ = 2.000, ambas ofertas 760: comparación i₀ = 2 %, i₁ = 42 %. Al volver a single desaparecen final, tabla y precio final, y queda i₀ = 2 %. Al volver a compare se conserva Y₂ = 2.000.
- Y₂ vacío: single conserva el inicial válido; compare informa «Estado final» inválido sin resultados obsoletos.
- Y₁ = 1.000, Y₂ = 1.010, oferta fija 760: i₀ = 2 %, i₁ = 2,4 %, exceso de demanda a la tasa inicial 8, precio VF = 100: 98,039216 → 97,65625.
- Meta común 2 %: ofertas requeridas 760 y 768, precios constantes.
- «Copiar estado inicial al final» activado con Enter; tabla y gráficos en móvil sin desbordamiento horizontal; sin advertencias ni errores de consola. Se restauró el viewport temporal.

La evidencia final de pruebas está en pruebas.json. Las capturas de este directorio se actualizaron para mostrar el selector y controles independientes; un-equilibrio-escritorio.png muestra la vista inicial. La revisión móvil es emulada, no una prueba en teléfono físico ni de lector de pantalla.

## Continuar desde Terminal

Los cambios anteriores ya están en main. Esta ampliación corresponde a un commit nuevo, sin modificar los commits anteriores.

```sh
cd /Users/pgomez/Documents/GPT/Macro1_GPT/repo_macrolab_auditoria
git branch --show-current
git status --short --branch
git diff --check
node scripts/test-macro1-experimentacion.js
```

La rama esperada es `fix/dinero-comparacion-ajuste`. Después de aprobar la vista local:

```sh
git add -- \
  macro1/index.html \
  macro1/test_dinero_comparacion.js \
  macro1/test_lab_lm.js \
  .github/workflows/auditoria-pautas.yml \
  docs/dinero-comparacion-2026-10-08/README.md \
  docs/dinero-comparacion-2026-10-08/pruebas.json \
  docs/dinero-comparacion-2026-10-08/comparacion-escritorio.png \
  docs/dinero-comparacion-2026-10-08/un-equilibrio-escritorio.png \
  docs/dinero-comparacion-2026-10-08/estado-final-espaciado.png \
  docs/dinero-comparacion-2026-10-08/ajuste-bonos-escritorio.png \
  docs/dinero-comparacion-2026-10-08/tasa-objetivo-movil.png

git diff --cached --check
git diff --cached --stat
git commit -m "Compara equilibrios monetarios y explica el ajuste mediante bonos"

git fetch origin
git log --oneline HEAD..origin/main
```

Si el último listado está vacío, la rama ya contiene `origin/main`. Si aparecen commits nuevos, integra con `git merge origin/main` y vuelve a ejecutar las pruebas; si hay conflictos, detente para resolverlos antes de subir.

```sh
git push -u origin fix/dinero-comparacion-ajuste
open 'https://github.com/PavelGomez/MacroLab-Shock-Simulator/compare/main...fix%2Fdinero-comparacion-ajuste?expand=1'
```

Crea el PR hacia main, espera las comprobaciones y revisa sus archivos antes de fusionar. La fusión inicia la publicación según la configuración descrita en el README del repositorio.
