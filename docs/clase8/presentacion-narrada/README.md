# Presentación narrada de Mundell–Fleming

Acceso: MacroLab → Macro 1 → Ruta por clases → Clase 8 → Teoría → **Presentación narrada**.

La ventana de estudio mantiene cargada la ruta de Clase 8. Cerrar, Escape o «Volver a Clase 8» pausa la voz y devuelve el foco al acceso de origen. Reabrir la ventana conserva el reproductor y su punto. «Abrir en pestaña completa» ofrece todo el ancho del navegador; la voz de la ventana anterior se pausa. El audio comienza por acción del estudiante.

Dirección directa prevista al publicar esta revisión:

https://pavelgomez.github.io/MacroLab-Shock-Simulator/macro1/presentaciones/mundell-fleming/

Enlace a la ruta de Clase 8:

https://pavelgomez.github.io/MacroLab-Shock-Simulator/macro1/index.html?clase=8#route

La carpeta `macro1/presentaciones/mundell-fleming/` contiene HTML, recursos, siete MP3 y el ZIP autónomo descargable. La lectura, glosario, transcripción y controles siguen siendo locales. Se publica la revisión visual 4 aprobada: interceptos en consulta opcional, con un acceso por ejercicio; IS y LM como Y = F(i) y el detalle del ajuste permanecen en el recorrido principal. No cambia la voz ni los tiempos.

Se conserva intacta la entrega original `PRESENTACION_MUNDELL_FLEMING/` y sus fuentes. La copia publicada agrega únicamente un puente de alojamiento (`assets/macrolab.js`) y su carga en el HTML. El ZIP conserva la versión autónoma aprobada, que se extrae antes de usarla sin conexión. `SHA256_ARCHIVOS.txt` se refiere a esa versión autónoma, no al puente de alojamiento.

Pruebas: 26 comprobaciones de integración de ventana y conservación de ruta con JSDOM, hashes de los siete MP3, suites existentes de Macro 1, auditoría de pautas, manifiesto y sincronización de los bloques embebidos. El paquete original contiene el registro de sus 870 comprobaciones del reproductor/modelo y la composición estática en tres tamaños. JSDOM y el audio simulado no certifican reproducción multimedia en un navegador. Los resultados locales quedan en `suites-locales.json`.

Reproducción de las comprobaciones:

```
node scripts/embed-clase8.js --check
node scripts/embed-glosario.js --check
node scripts/check-manifest.js
node test_pautas_biblioteca.js
node macro1/test_presentacion_clase8.js
```

Las suites `macro1/test_*.js` necesitan jsdom, declarado en el package.json de la raíz. No se publica node_modules. La integración no cambia los solvers, las evaluaciones ni las versiones de continuidad de las clases anteriores.
