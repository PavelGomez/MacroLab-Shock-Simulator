# MacroLab-Macro1 v0.9.0 · Lab · Curva IS

## Cambio principal

- **Nueva ventana «Lab · Curva IS»**, después de Relación LM. Tiene la cruz keynesiana arriba y el plano (Y, i) abajo, alineados en la producción, como en la Figura 2 de la Nota 6. Muestra dos tasas o dos estados a la vez y la IS como la unión de los puntos.
- **Qué cambia:** la tasa (movimiento a lo largo de la IS) o, como desplazamiento, G, T (transferencia), t, c₀ o b₀. Cada flecha dice cuánto se corre la curva y cuánto gasto quita o agrega la tasa.
- **La inversión y sus dos efectos.** Una tabla con la inversión en cada equilibrio, el efecto acelerador (b₁·ΔY), el efecto de la tasa (−b₂·Δi), el cambio autónomo (b₀) y la comprobación por recálculo directo. Lleva el aviso de la Nota 6: «efecto desplazamiento» no es otro nombre de b₂.
- **Ecuación y lectura:** multiplicador con impuesto fijo o proporcional, pendiente −1/(m·b₂), interceptos, aviso si c₁ + b₁ ≥ 1 y la **coincidencia que hay que declarar** (1/(1 − c₁) da el multiplicador correcto solo si c₁·t = b₁), que el laboratorio detecta solo.
- **Puntos de partida:** economía del curso (T fijo y T = 0,2·Y), Nota 6 B3.1 y A3.2. Seis actividades (IS-EX-01 a 06) con el protocolo de enunciados.
- **Datos reales:** la Minuta N° 323 (postergación de proyectos con la TPM en 4,50 %: cae b₀) y la Ley de Presupuestos 2026 (DIPRES, 26-11-2025: crecimiento de 1,7 % respecto de la ley 2025). Los dos con el formato ancla / lo que permite decir / lo que no.
- **Motor gráfico:** guías verticales entre paneles apilados, marca de corte en el eje vertical, rótulos de flecha arriba de la flecha, marcas del eje con los decimales que corresponden a su paso (2,5 ya no se escribe «3») y sin ceros sobrantes.
- La Ruta (Clase 5) enlaza al nuevo laboratorio.

## Pruebas

- Nueva: `macro1/test_lab_is.js` (134 aserciones), agregada a CI. `test_lab_lm.js` suma pruebas del formato de números y de los valores de las marcas.
- Ajuste declarado: `test_loop_clase3.js` espera ahora ocho pestañas.
- Sin cambios en cifras selladas.
