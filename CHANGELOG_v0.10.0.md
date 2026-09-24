# MacroLab-Macro1 v0.10.0 · Lab · IS-LM

## Cambio principal

- **Nueva ventana «Lab · IS-LM»**, después de Curva IS. Tiene un solo gráfico (Y, i), siempre con la IS y la LM iniciales y finales, y tres modos:
  - **Equilibrio y políticas.** El cruce se lee primero en el gráfico y después con la cuenta, que va en un desplegable. Los cambios posibles son ΔG, ΔT, Δ(M/P), Δb₀ y la mezcla de políticas. Con la LM horizontal se puede cambiar la tasa fija y el laboratorio muestra el M/P que tiene que entregar el Banco Central. Las flechas dicen cuánto se corre cada curva, y se muestra el multiplicador en IS-LM (ΔY/ΔG) frente al del mercado de bienes.
  - **Desequilibrios.** El punto se escribe o se marca con un clic en el gráfico. El laboratorio calcula la tasa que pide cada curva y clasifica el punto en uno de los cuatro cuadrantes, con Z − Y y M/P − Mᵈ y su unidad. El camino de ajuste va con dos velocidades: primero, en horas, el tramo vertical hasta la LM; después, en semanas, el avance a lo largo de la LM. Se ve paso a paso. La escalera de escalones ajustables se pega a la LM cuando los escalones se achican. El botón «El día del anuncio» parte del equilibrio viejo y muestra que no hay tramo vertical.
  - **Efecto acelerador, efecto de la tasa y efecto desplazamiento.** Una cascada lleva de I₀ a I₁ pasando por el cambio autónomo, el efecto acelerador (b₁·ΔY) y el efecto de la tasa (−b₂·Δi), con la comprobación por recálculo directo. Muestra la regla de dominancia (b₁ frente a b₂·d₁/d₂). El veredicto «hay efecto desplazamiento» aparece solo si la inversión baja ante una expansión fiscal. Un deslizador de b₂ dibuja la curva de ΔI según b₂, que no es una recta. Si ΔI = 0, el laboratorio avisa que es una coincidencia. Con la LM horizontal no hay efecto desplazamiento.
- **Mismas ecuaciones que `calcISLM` del MacroLab público.** La prueba compara los dos en 36 combinaciones: tres economías, dos regímenes, dos tipos de impuesto y tres niveles de G.
- **Puntos de partida:** la economía del curso, con impuesto fijo y con impuesto proporcional, y el ejercicio histórico de la Nota 8, con dinero fijo y con la tasa fija en 8 %.
- **Actividades:** seis, de ISLM-EX-11 a ISLM-EX-16. Se numeran desde 11 para no chocar con los códigos sellados ISLM-EX-01 a 05 de la biblioteca.
- **Datos reales** (del tercero en adelante, verificados por el profesor en fuentes primarias):
  - FBCF 2024-2025 con la baja de la TPM: los dos efectos empujan a favor, sin atribuir causalidad.
  - El ciclo de alzas hasta 11,25 %: es efecto de la tasa por una decisión monetaria, **no** efecto desplazamiento.
  - Las dos velocidades en la RPM de julio de 2023: sorpresa de 25 pb (la EOF esperaba −75 y se recortaron 100), el bono a 2 años baja 20 pb en la primera rueda y el Imacec y la FBCF cambian con rezagos, sin atribuir causalidad.
  - Expansión fiscal con la tasa en su piso (2020): TPM de 0,50 % y gasto del Gobierno Central Presupuestario +11,0 % real (DIPRES). La tarjeta advierte que no es el ΔG del modelo.
  - El efecto acelerador llega con rezago (2024): el consumo de los hogares vuelve a crecer en T1 y la maquinaria y equipo en T3.
- **RPM del 8 de septiembre de 2026** (TPM en 4,50 %, por unanimidad; Minuta N° 324): actualiza las tarjetas de la TPM de Dinero / tasa y Relación LM, el minigráfico y el glosario.
- **Motor gráfico:**
  - curvas de muchos puntos, para ΔI según b₂;
  - un nuevo estado de dibujo para los caminos de ajuste;
  - lectura del clic sobre el gráfico;
  - rótulos del eje vertical separados 15 px.
- **Ruta:** las Clases 6 y 7 enlazan al nuevo laboratorio. Se conserva el enlace a la pestaña pública que usan las notas.

## Pruebas

- Nueva: `macro1/test_lab_islm.js` (281 aserciones), agregada a CI.
- Ajuste declarado: `test_loop_clase3.js` espera nueve pestañas.
- Ninguna cifra sellada cambió.
