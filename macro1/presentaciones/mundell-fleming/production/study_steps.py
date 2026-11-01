"""Apoyo visible de cada párrafo: operaciones, mecanismo y límites.
block es el índice del bloque del guion; los silencios conservan el paso previo.
No incluye tiempos estimados: estos se toman de los eventos del audio real.
"""
def p(block,title,lines,note='',flow=None):
 return dict(block=block,title=title,lines=lines,note=note,flow=flow or [])

STEPS={
1:[
 p(0,'La pregunta económica',['Compras públicas aumentan.','La empresa vende al exterior y compra maquinaria importada.','¿Basta el multiplicador de una economía cerrada?']),
 p(1,'Dos reglas para el mismo impulso',['Flotación: el precio del dólar puede ajustar.','Cambio fijo: la autoridad defiende una paridad.','Antes de conocer el resultado, predice si la producción cambia igual.']),
 p(2,'Qué podrás resolver',['Calcular un equilibrio abierto.','Comparar la misma política bajo ambos regímenes.','Explicar el resultado y los supuestos que lo sostienen.'])],
2:[
 p(0,'Definir cada operación',['X: bienes y servicios vendidos a no residentes.','IM: bienes y servicios comprados a no residentes.','IM designa importaciones; M se reserva al dinero.']),
 p(1,'Construir el saldo',['XN = X − IM','XN = 300 − 310 = −10','X sigue siendo positivo: un saldo negativo no es una exportación negativa.'],'Mismo trimestre y misma unidad. La cuenta corriente añade rentas y transferencias.'),
 p(2,'Separar comercio y cartera',['Comprar una máquina externa: importación de un bien.','Comprar un bono externo: adquisición de un activo financiero.','Ambas operaciones pueden demandar dólares; solo la primera entra en IM.'])],
3:[
 p(0,'Leer la cotización',['E = pesos chilenos / dólar estadounidense','E: 900 → 990 CLP/USD','E aumenta: depreciación del peso. E disminuye: apreciación.']),
 p(1,'Calcular el costo del horno',['USD 1.000 × 900 = $900.000','USD 1.000 × 990 = $990.000','Diferencia: $990.000 − $900.000 = $90.000','Variación: ($90.000 / $900.000) × 100 = 10 %'],'Mismo precio en dólares; se omiten fletes e impuestos.'),
 p(2,'Comparar la mirada del comprador externo',['Producto chileno de $9.000:','Con E = 900: 9.000 / 900 = USD 10','Con E = 990: 9.000 / 990 ≈ USD 9,09','En cambio fijo, elevar la paridad oficial se llama devaluación.'],'El margen de una empresa también depende de insumos, deuda y contratos.')],
4:[
 p(0,'Introducir la función',['XN = x₀ − x₁Y + x₂E','Y: producción e ingreso interno.','x₀: componente autónomo neto; no son las exportaciones totales.']),
 p(1,'Mostrar la calibración y las dos comparaciones',['XN = 140 − 0,10Y + 0,20E','Base: Y = 3.300; E = 900','XN₀ = 140 − 330 + 180 = −10','Solo Y aumenta: Y = 3.500; E = 900','XN = 140 − 350 + 180 = −30 → ΔXN = −20','Solo E aumenta: Y = 3.300; E = 1.000','XN = 140 − 330 + 200 = 10 → ΔXN = 20'],'Son dos comparaciones independientes desde la base, no shocks acumulados.'),
 p(2,'Precisar el supuesto comercial',['x₂ = 0,20 > 0: respuesta neta favorable al aumento de E.','Precios internos y externos dados; las cantidades deben poder ajustar.','No garantiza una mejora inmediata del valor del saldo.'])],
5:[
 p(0,'Pasar del gasto total a producción nacional',['Gasto de residentes: C + I + G','Agregar ventas a no residentes: + X','Restar producción extranjera incluida en el gasto: − IM']),
 p(1,'Separar definición y equilibrio',['Definición: XN = X − IM','Definición: Z = C + I + G + XN','Equilibrio de bienes: Y = Z'],'Fuera del equilibrio pueden aparecer inventarios involuntarios.'),
 p(2,'Conservar las funciones de conducta',['C = c₀ + c₁(Y − T)','I = b₀ + b₁Y − b₂i','T: impuestos fijos; c₁: fracción consumida del ingreso disponible.','b₁: respuesta de inversión a Y; b₂: respuesta por punto porcentual de i.','i = 4 representa 4 % anual.'])],
6:[
 p(0,'Sustituir y distribuir',['Y = c₀ + c₁(Y − T) + b₀ + b₁Y − b₂i + G + x₀ − x₁Y + x₂E','c₁(Y − T) = c₁Y − c₁T','Y = c₀ + c₁Y − c₁T + b₀ + b₁Y − b₂i + G + x₀ − x₁Y + x₂E']),
 p(1,'Reunir Y y mantener la notación del curso',['Restar c₁Y y b₁Y; sumar x₁Y en ambos lados.','(1 − c₁ − b₁ + x₁)Y = c₀ − c₁T + b₀ + G + x₀ − b₂i + x₂E','a = 1 − c₁ − b₁ + x₁','A = c₀ − c₁T + b₀ + G + x₀'],'A mayúscula sigue representando gasto autónomo. a minúscula es un coeficiente distinto.'),
 p(2,'Dividir todos los términos por a',['aY = A − b₂i + x₂E','(aY)/a = A/a − (b₂/a)i + (x₂/a)E','Y = (A − b₂i + x₂E)/a','α = 1/a = ∂Y/∂G, con i y E dados.'],'a es el inverso del multiplicador parcial α; A es el gasto autónomo.')],
7:[
 p(0,'Declarar el arbitraje',['Economía pequeña: la tasa externa se toma como dada.','Activos comparables y movilidad perfecta de capitales.','Un diferencial de rendimientos genera presión para cambiar la cartera.']),
 p(1,'Obtener la condición simplificada',['Prima por riesgo = 0','Depreciación esperada = 0','BP: i = i*','Ambas tasas se expresan en % anual y para el mismo horizonte.']),
 p(2,'No confundir dos condiciones',['i = i* no implica XN = 0.','Un déficit de bienes y servicios puede coexistir con financiamiento externo.','BP horizontal no es la identidad contable de toda la balanza de pagos.'])],
8:[
 p(0,'Despejar LM sin saltar operaciones',['M/P = d₁Y − d₂i','Sumar d₂i: M/P + d₂i = d₁Y','Dividir por d₁ > 0: Y = (M/P + d₂i)/d₁','Recta LM: Y = (M/P)/d₁ + (d₂/d₁)i','M/P: oferta real de dinero; d₁ y d₂: coeficientes positivos.']),
 p(1,'Resolver bajo flotación',['Dato de política: M/P','1. BP entrega i = i*.','2. LM entrega Y = (M/P + d₂i*)/d₁.','3. IS entrega E = (aY − A + b₂i*)/x₂.'],'Orden algebraico de relaciones simultáneas; no es un reloj de ajuste.'),
 p(2,'Resolver bajo cambio fijo',['Dato de política: E','1. BP entrega i = i*.','2. IS entrega Y = (A − b₂i* + x₂E)/a.','3. LM entrega M/P = d₁Y − d₂i*.'],'El dinero acomoda la defensa de la paridad.')],
9:[
 p(0,'Fijar unidades antes de calcular',['Y, C, I, G, T y XN: flujos reales por trimestre docente.','M/P y Md: stocks reales.','i e i*: porcentajes anuales. E: CLP/USD.']),
 p(1,'Leer la conducta de hogares y empresas',['C = 100 + 0,75(Y − 80)','I = 160 + 0,15Y − 15i','G = 200','c₀ = 100; c₁ = 0,75; T = 80.','b₀ = 160; b₁ = 0,15; b₂ = 15.']),
 p(2,'Preparar la base algebraica',['Md = 0,50Y − 50i; M/P = 1.450; i* = 4 %','LM: Y = (1.450 + 50i)/0,50 = 2.900 + 100i','a = 1 − 0,75 − 0,15 + 0,10 = 0,20','A = 100 − 0,75 × 80 + 160 + 200 + 140','A = 100 − 60 + 160 + 200 + 140 = 540','α = 1/0,20 = 5, con i y E dados.'],'A es gasto autónomo; a es el coeficiente de Y.')],
10:[
 p(0,'Usar BP y sustituir la tasa',['BP: i = i* = 4 %','LM: 1.450 = 0,50Y − 50 × 4','Recta LM: Y = 2.900 + 100i','50 × 4 = 200','1.450 = 0,50Y − 200']),
 p(1,'Sumar y después dividir',['1.450 + 200 = 0,50Y − 200 + 200','1.650 = 0,50Y','1.650 / 0,50 = (0,50Y) / 0,50','Y = 3.300']),
 p(2,'Interpretar el cruce',['LM ∩ BP: (Y, i) = (3.300; 4 %)','LM: i = 0 → Y = 2.900; Y = 0 → i = −29 %','La proyección sobre el eje horizontal entrega Y = 3.300.','Falta elegir E para que IS también pase por ese equilibrio.'])],
11:[
 p(0,'Dividir cada término de IS',['0,20Y = 540 − 15i + 0,20E','(0,20Y)/0,20 = 540/0,20 − (15/0,20)i + (0,20/0,20)E','540/0,20 = 2.700; 15/0,20 = 75; 0,20/0,20 = 1','Y = 2.700 − 75i + E']),
 p(1,'Sustituir Y e i para recuperar E',['3.300 = 2.700 − 75 × 4 + E','75 × 4 = 300','3.300 = 2.700 − 300 + E = 2.400 + E','3.300 − 2.400 = 2.400 + E − 2.400','E = 900 CLP/USD']),
 p(2,'Comprobar los tres cierres',['C = 100 + 0,75(3.300 − 80) = 2.515','I = 160 + 0,15 × 3.300 − 15 × 4 = 595','XN = 140 − 330 + 180 = −10','Bienes: 2.515 + 595 + 200 − 10 = 3.300','Dinero: 0,50 × 3.300 − 50 × 4 = 1.450','BP: 4 = 4'],'Las tres condiciones cierran aunque XN sea negativo.')],
12:[
 p(0,'Identificar qué permanece dado',['G: 200 → 220 → ΔG = 20','M/P = 1.450; i* = 4 %; impuestos y parámetros constantes.','LM sin cambios: Y = 2.900 + 100i','LM y BP no cambian.']),
 p(1,'Separar el impulso parcial',['a = 0,20 → α = 1/a = 5','Con i y E dados: ΔY de bienes = αΔG = 5 × 20 = 100','E está congelado solo en esta comparación parcial.'],'Todavía no es la respuesta final bajo flotación.'),
 p(2,'Predecir el equilibrio final',['Pregunta 1: ¿puede cambiar el cruce de LM y BP?','Pregunta 2: ¿qué debe ocurrir con E para cerrar IS?','Pregunta 3: ¿cómo cambia XN?'],'Anota tu intento antes de revelar la respuesta o pasar a la diapositiva 13.')],
13:[
 p(0,'Calcular el dólar después del aumento de G',['LM y BP sin cambios: Y = 3.300; i = 4 %','LM: Y = 2.900 + 100i','A: 540 → 560; A/a: 2.700 → 2.800','Nueva IS: Y = 2.800 − 75i + E','3.300 = 2.800 − 75 × 4 + E = 2.500 + E','E = 3.300 − 2.500 = 800 CLP/USD']),
 p(1,'Ver las presiones y el retorno de IS',['A E = 900, G + 20 desplaza IS hacia la derecha.','La presión de una tasa mayor aumenta la demanda por activos locales.','El peso se aprecia: E pasa de 900 a 800.','El menor XN devuelve IS a su posición inicial.'],'Las flechas comparan desplazamientos y presiones; no asignan tiempos de ajuste.',flow=['G ↑ 20','IS → a E fija','presión i ↑','demanda de activos locales ↑','E ↓ 100','XN ↓ 20','IS ←']),
 p(2,'Comprobar la compensación',['XN₀ = 140 − 330 + 180 = −10','XN₁ = 140 − 330 + 160 = −30','ΔXN = −30 − (−10) = −20','ΔG + ΔXN = 20 − 20 = 0','C = 2.515 e I = 595 no cambian.','2.515 + 595 + 220 − 30 = 3.300'])],
14:[
 p(0,'Reiniciar y cambiar solo dinero',['Base: G = 200; M/P = 1.450; E inicial = 900.','Nuevo dinero real: M/P = 1.550 → Δ(M/P) = 100','LM nueva: Y = 3.100 + 100i','i* = 4 % permanece dada.']),
 p(1,'Separar presión inicial y tasa final',['El exceso de oferta monetaria presiona a una tasa menor.','La compra de activos externos presiona a una depreciación.','Con la respuesta comercial supuesta aumenta demanda nacional.'],'No es una baja permanente de i por debajo de i*.',flow=['M/P ↑','presión i ↓','activos externos ↑','E ↑','demanda nacional ↑']),
 p(2,'Preparar tu cálculo',['1. BP: i = 4.','2. LM: 1.550 = 0,50Y − 200.','3. IS: Y = 2.400 + E.','4. XN: separar −0,10ΔY y 0,20ΔE.'],'Calcula antes de consultar los resultados de la diapositiva 15.')],
15:[
 p(0,'Resolver producción y dólar',['BP: i = 4 %','1.550 = 0,50Y − 200','LM nueva: Y = 3.100 + 100i','1.550 + 200 = 0,50Y → Y = 1.750/0,50 = 3.500','3.500 = 2.400 + E → E = 1.100','ΔY = 200; ΔE = 200']),
 p(1,'Separar ambos efectos sobre XN',['Efecto ingreso: −0,10 × 200 = −20','Efecto dólar: 0,20 × 200 = 40','ΔXN = −20 + 40 = 20','XN₁ = XN₀ + ΔXN = −10 + 20 = 10']),
 p(2,'Cerrar la inversión y las cuentas',['C = 100 + 0,75(3.500 − 80) = 2.665','I = 160 + 0,15 × 3.500 − 15 × 4 = 625','ΔI = 0,15 × 200 − 15 × 0 = 30','2.665 + 625 + 200 + 10 = 3.500'],'La tasa final no cambia: el aumento de I procede del canal de ingreso.')],
16:[
 p(0,'Cambiar la regla institucional',['Paridad defendida: E = 900 CLP/USD','Precios dados, reservas suficientes y compromiso creíble.','No se mantiene un dinero independiente mediante esterilización.']),
 p(1,'Mostrar las dos operaciones',['Presión de apreciación: comprar divisas y entregar pesos → M/P ↑','Presión de depreciación: vender divisas y recibir pesos → M/P ↓'],'Con P fijo, el efecto nominal también cambia el dinero real. No se calcula una trayectoria de reservas.'),
 p(2,'Resolver con dinero endógeno',['1. BP fija i = i*.','2. Con E dado, IS determina Y.','3. LM calcula el M/P requerido.','Recta con dinero endógeno: Y = 2(M/P) + 100i'],'El dinero que acomoda la defensa no es otra decisión independiente.')],
17:[
 p(0,'Intentar antes de revelar',['G = 220; E = 900; i = 4.','Y = 2.800 − 75 × 4 + 900','Después: M/P = 0,50Y − 50 × 4','LM: Y = 2(M/P) + 100i'],'Calcula ambas expresiones antes de revelar la solución.'),
 p(2,'Obtener la producción y el dinero requerido',['Y = 2.800 − 300 + 900 = 3.400','M/P = 0,50 × 3.400 − 50 × 4','M/P = 1.700 − 200 = 1.500','LM requerida: Y = 3.000 + 100i','Δ(M/P) = 1.500 − 1.450 = 50'],'Comprar divisas evita la apreciación y expande el dinero requerido.',flow=['G ↑ 20','IS →','presión de apreciación','compra de divisas','M/P ↑ 50','LM →']),
 p(3,'Comprobar el nuevo equilibrio',['C = 100 + 0,75(3.400 − 80) = 2.590','I = 160 + 0,15 × 3.400 − 15 × 4 = 610','XN = 140 − 340 + 180 = −20','2.590 + 610 + 220 − 20 = 3.400','ΔY = 3.400 − 3.300 = 100'])],
18:[
 p(0,'Comprobar si ambas metas pueden coexistir',['G = 200; E = 900; i = 4.','Intento: M/P = 1.550','LM del intento: Y = 3.100 + 100i','IS: Y = 2.700 − 75 × 4 + 900','Después calcula Md = 0,50Y − 50 × 4.']),
 p(2,'Mostrar la incompatibilidad y la defensa',['IS: Y = 2.700 − 300 + 900 = 3.300','Md = 0,50 × 3.300 − 50 × 4 = 1.450','LM inicial = final: Y = 2.900 + 100i','Oferta pretendida − demanda = 1.550 − 1.450 = 100','Para sostener E, la venta de divisas retira esos pesos.'],flow=['M/P intenta ↑ 100','presión i ↓','presión E ↑','venta de divisas','retiro de pesos','M/P vuelve a 1.450']),
 p(3,'Reconocer el equilibrio final',['Y = 3.300; i = 4 %; E = 900','M/P = 1.450; XN = −10','La LM final coincide con la inicial.'],'Sin autonomía monetaria permanente bajo este cierre; no se modela una crisis de reservas.')],
19:[
 p(0,'Leer primero la flotación',['Fiscal: M/P y BP sin cambios → ΔY = 0; E ajusta.','Monetaria: M/P aumenta → Y aumenta; E permite cerrar bienes.','La tabla principal muestra niveles finales.','LM base: Y = 2.900 + 100i; monetaria flotante: Y = 3.100 + 100i']),
 p(1,'Leer después la paridad fija',['Fiscal: E e i dados → Y aumenta; M/P acomoda.','Monetaria: la defensa revierte el intento de expansión autónoma.','i final = 4 % en los cuatro casos.','LM fiscal fija: Y = 3.000 + 100i; monetaria fija final: Y = 2.900 + 100i']),
 p(2,'Distinguir niveles y variaciones del saldo',['Fiscal, flotación: −30 − (−10) = −20','Monetaria, flotación: 10 − (−10) = 20','Fiscal, fijo: −20 − (−10) = −10','Intento monetario, fijo: −10 − (−10) = 0'],'Cada diferencia se calcula respecto de la misma base.')],
20:[
 p(0,'Plantear dos ejercicios independientes',['A: flotación, M/P = 1.450 + 50 = 1.500; G = 200.','B: cambio fijo, G = 200 + 10 = 210; E = 900.','En ambos: i* = 4 %.','Caso A, LM: Y = 3.000 + 100i. Caso B: Y = 2(M/P) + 100i.']),
 p(1,'Elegir el orden antes de calcular',['Caso A: BP → LM → IS.','Caso B: BP → IS → LM.','No acumules los shocks; cada uno parte de la base.'],'Anota tu intento antes de consultar la respuesta.'),
 p(3,'Resolver A y B con todas las operaciones',['A: Y = (1.500 + 50 × 4)/0,50 = 3.400','A: E = 3.400 − 2.700 + 75 × 4 = 1.000','B: A autónomo = 540 + 10 = 550; A/a = 2.750','B: Y = 2.750 − 75 × 4 + 900 = 3.350','B: M/P = 0,50 × 3.350 − 50 × 4 = 1.475','B, recta LM final: Y = 2.950 + 100i','i = 4 % en ambos.'],'Las letras A y B de los casos no sustituyen a la variable A de gasto autónomo.')],
21:[
 p(0,'Identificar las tres opciones',['Tipo de cambio fijo.','Libre movilidad de capitales.','Política monetaria independiente.','No pueden sostenerse las tres simultáneamente.']),
 p(1,'Detectar qué condición dejaría de cerrar',['Con E = 900 e i = 4, IS exige Y = 3.300.','Con ese Y e i, LM exige M/P = 1.450.','LM compatible: Y = 2.900 + 100i; intento: Y = 3.100 + 100i','Pretender M/P = 1.550 deja un exceso de oferta de 100.'],'Para conservarlo habría que cambiar una regla o el cierre.'),
 p(2,'Conectar con una política moderna',['Con flotación se abandona una meta fija de E.','Expectativas y riesgo permiten diferencias entre i e i* en un cierre más amplio.','No traslades literalmente i = i* a cualquier decisión de TPM.'])],
22:[
 p(0,'Producción y precios',['Precios dados + capacidad disponible → Y puede responder a demanda.','Con restricción de capacidad o precios variables, faltan ecuaciones de inflación y oferta.']),
 p(1,'Respuesta comercial',['x₂ > 0 resume la mejora neta después del ajuste de cantidades.','Antes pueden subir los pagos por importaciones.','El aumento de precios internos puede compensar la depreciación nominal.']),
 p(2,'Cierre financiero e institucional',['Prima y depreciación esperada nulas → i = i*.','Prima exógena constante ρ → i = i* + ρ: BP sigue horizontal.','Movilidad imperfecta requiere otra especificación.','En cambio fijo hacen falta reservas, credibilidad y acomodación monetaria.'])],
23:[
 p(0,'Ver el instrumento operacional',['Marco del BCCh: metas de inflación + flotación cambiaria.','TPM: tasa de política monetaria.','La liquidez se administra para orientar la tasa interbancaria hacia la TPM.'],flow=['objetivo de TPM','administración de liquidez','tasa interbancaria cercana al objetivo']),
 p(1,'Distinguir el ejercicio de la aplicación',['M/P dado es el cierre pedagógico usado aquí.','Una rebaja de TPM requiere expectativas, riesgos, crédito y precios.','La neutralización fiscal exacta no es un resultado empírico demostrado para Chile.']),
 p(2,'Precisar qué documenta la fuente',['Una intervención excepcional no es por sí sola una paridad permanente.','Fuente institucional: Banco Central de Chile, consulta 01-11-2026.','Los parámetros numéricos de la clase siguen siendo didácticos.'])],
24:[
 p(0,'Calcular el flujo neto expuesto',['USD 10.000 − USD 6.000 = USD 4.000','4.000 × 900 = $3.600.000','4.000 × 990 = $3.960.000','$3.960.000 − $3.600.000 = $360.000'],'Mismo período, cantidades y contratos; sin coberturas.'),
 p(1,'No confundirlo con utilidad',['Faltan salarios, impuestos, deuda, otros costos y fechas de pago.','Pedir monedas de facturación, vencimientos, capacidad y respuesta de clientes.','Una importadora sin cobros en dólares enfrenta otra exposición.']),
 p(2,'Responder el ticket de salida',['1. ¿Qué añade abrir IS–LM?','2. ¿Por qué BP horizontal admite XN negativo?','3. ¿Qué variable ajusta en cada régimen?','4. ¿Qué supuesto revisarías antes de aplicar el resultado?'])]
}
