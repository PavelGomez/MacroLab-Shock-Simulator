# MacroLab-Macro1 v0.8.0 · enunciados legibles, motor gráfico común y Lab · Relación LM

## Cambio principal

- **Nueva ventana «Lab · Relación LM»**, entre Dinero / tasa y Mercado laboral. Muestra dos paneles alineados en la tasa: el mercado de dinero y el plano (Y, i). Dibuja el equilibrio inicial y el final a la vez, y la LM como la unión de los puntos. Permite cuatro cambios: sube Y (movimiento a lo largo), el Banco Central compra o vende bonos, cambian los precios o la demanda de dinero cambia por otra razón. También tiene un interruptor para el enfoque de tasa fija (LM horizontal), la lectura de la pendiente d₁/d₂ y de los interceptos, seis actividades (LM-EX-01 a 06) y la TPM 2020-2026 dibujada como una sucesión de LM horizontales.
- **Motor gráfico común (SVG)**, reutilizable por Curva IS e IS-LM. Dibuja dos estados (inicial en línea continua, final en discontinua) con leyenda, equilibrios rotulados con proyecciones y su valor sobre el eje, marcas redondas (1, 2, 2,5 o 5 × 10ᵏ), flechas con el tamaño del desplazamiento, paneles alineados y rótulos que no se solapan. El gráfico se dibuja al ancho real del contenedor, así que se lee igual en el teléfono.
- **Dinero / tasa** usa el motor: el eje de la tasa parte en 0, desaparecen las marcas 9,8 / 20,5 / 31,3 y 257 / 513 / 770, y el gráfico compara el estado de partida con el actual.
- **Enunciados con el protocolo v1** en todas las actividades (22) y en la pregunta tipo prueba de las Clases 1 a 7. Cada uno tiene situación, datos con unidad, partes con verbo y formato, primer paso, términos del glosario, cómo saber si está bien, qué busca mostrar y errores como síntoma → corrección.
- **Glosario para alumnos embebido** (87 términos), generado desde el glosario canónico del curso (`scripts/embed-glosario.js`).
- **Terminología:** «efecto desplazamiento (crowding out)» y «efecto de la tasa» con la convención de las Notas 6 y 8, también en la Clase 7. Cero ocurrencias de la terminología antigua en el texto visible.

## Motivo

Los alumnos no entendían qué se les pedía («un pago de 100» era el valor nominal, pero nadie lo decía) y faltaban los laboratorios del núcleo del curso. La LM es materia del Control 3 (5 y 9 de octubre de 2026).

## Pruebas

- Nuevas: `macro1/test_enunciados_glosario.js` (549 aserciones) y `macro1/test_lab_lm.js` (163). Las dos corren en CI; el MANIFEST sigue declarando solo sus cinco suites.
- Ajustes declarados en pruebas existentes: formato «2,00 %» con espacio (`test_formulas_selladas.js`); ejemplo de cita del IPoM sin la cifra no verificada (`test_retroalimentacion_pedagogica.js`); siete pestañas y versión leída del MANIFEST (`test_loop_clase3.js`).
- Sin cambios en ninguna cifra sellada: `test_pautas_biblioteca.js` (35) y todas las suites de `macro1/` en verde.
