"""Storyboard y guion original. Las copias en sources/ no se editan."""
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
chapters = [
 ('abrir','¿Qué cambia al abrir la economía?'),
 ('modelo','¿Cómo se conectan bienes, dinero y activos?'),
 ('base','¿Cómo se resuelve el equilibrio inicial?'),
 ('flotacion','¿Qué ocurre cuando el dólar flota?'),
 ('fijo','¿Qué cambia si se defiende una paridad?'),
 ('recuperar','¿Puedes resolver y explicar el mecanismo?'),
 ('interpretar','¿Hasta dónde llega la conclusión?')
]
slides=[]
def s(ch,title,goal,kicker,visual,screen,paragraphs,terms,deep='',pause=0,prompt='',answer='',reveal_after=None):
 blocks=[]
 for p in paragraphs:
  if isinstance(p,tuple): blocks.append(dict(kind='study',seconds=p[0],text=p[1]))
  else: blocks.append(dict(kind='speech',text=p))
 if pause: blocks.append(dict(kind='study',seconds=pause,text=prompt))
 slides.append(dict(id=len(slides)+1,chapter=ch,title=title,goal=goal,kicker=kicker,visual=visual,screen=screen,blocks=blocks,terms=terms,deep=deep,prompt=prompt,answer=answer,revealAfter=reveal_after,source='nota9'))

s(0,'Una misma política, dos regímenes',
 'Predecir por qué el régimen cambiario modifica la respuesta de la producción.',
 'UNA PREGUNTA PARA EMPEZAR','opening',
 ['El Gobierno aumenta sus compras.','¿Sube lo mismo la producción si el dólar flota o si se mantiene fijo?'],[
 'Una empresa vende vino al exterior y compra maquinaria importada. Sus ventas dependen de la actividad, pero sus ingresos y sus costos también dependen del precio del dólar. Ahora imagina que el Gobierno aumenta sus compras. ¿Basta con el multiplicador que aprendimos en una economía cerrada para anticipar cuánto crecerá la producción?',
 'El modelo de Mundell y Fleming abre esa pregunta. Añade el comercio de bienes y servicios, las decisiones sobre activos internacionales y una regla cambiaria. Compararemos la misma expansión bajo flotación y bajo un dólar fijo. Antes de avanzar, escribe una predicción, aunque todavía no sepas justificarla.',
 'El objetivo es que puedas resolver un equilibrio abierto y explicar quién ajusta en cada régimen. Escucha por capítulos. Las consultas pausan la voz y permiten regresar al mismo instante. Todas las cifras del modelo serán ejercicios docentes, no estimaciones ni pronósticos de Chile.'
 ],['mundell','regimen'],pause=8,prompt='Predice: ¿el régimen cambiario puede cambiar el efecto del gasto público sobre la producción?')

s(0,'Exportar, importar y comprar activos',
 'Distinguir comercio real, saldo externo y transacciones financieras.',
 'BIENES, SERVICIOS Y ACTIVOS','trade',
 ['X: ventas a no residentes. IM: compras a no residentes.','XN = X − IM'],[
 'Una viña residente en Chile vende vino a un comprador de Canadá: exporta un bien. Un hotel chileno recibe a una visitante residente en Perú: exporta un servicio. Llamaremos equis a las exportaciones de bienes y servicios. Importar es la operación inversa: residentes compran bienes o servicios a no residentes. Usaremos i eme para importaciones, porque eme ya significa dinero.',
 'Las exportaciones netas, equis ene, son exportaciones menos importaciones. Si, en un mismo trimestre y en unidades comparables, exportamos trescientos e importamos trescientos diez, el saldo es menos diez. No significa que las exportaciones sean negativas. Tampoco es toda la cuenta corriente: faltan, entre otros componentes, rentas y transferencias.',
 'Comprar un bono extranjero es adquirir un activo financiero. No es importar una máquina ni exportar un servicio. Esa separación importa: puede aumentar la demanda de dólares sin que cambie hoy el comercio. Mantendremos identificados el canal comercial y el canal financiero durante toda la clase.'
 ],['exportaciones','importaciones','xn','activos'],deep='saldos')

s(0,'El precio del dólar: E = CLP/USD',
 'Leer correctamente una depreciación y calcular su efecto en una compra en dólares.',
 'CONVENCIÓN DEL CURSO','exchange',
 ['E ↑: depreciación del peso. E ↓: apreciación.','Un horno de USD 1.000: $900.000 → $990.000'],[
 'E mayúscula es el número de pesos chilenos que cuesta un dólar estadounidense. La unidad se escribe pesos chilenos por dólar. Si pasa de novecientos a novecientos noventa, cada dólar cuesta más pesos: el peso se deprecia. Si e disminuye, el peso se aprecia. No inviertas esta convención al leer los gráficos.',
 'Un horno de mil dólares cuesta novecientos mil pesos con e igual a novecientos, y novecientos noventa mil con e igual a novecientos noventa. Conservamos fijo su precio en dólares y omitimos fletes e impuestos. La diferencia es noventa mil pesos. Dividirla por el costo inicial da un aumento de diez por ciento.',
 'Para un comprador extranjero, un producto chileno de nueve mil pesos puede abaratarse en dólares. Pero una empresa exportadora también puede importar insumos o deber dólares. La depreciación no mejora automáticamente sus utilidades. Bajo un régimen fijo, cambiar oficialmente la paridad hacia arriba se llama devaluación; mantenerla constante es otra decisión.'
 ],['e','depreciacion','apreciacion','devaluacion'],deep='real')

s(0,'Ingreso y dólar afectan el saldo externo',
 'Separar un movimiento por ingreso de un desplazamiento por tipo de cambio.',
 'UNA RELACIÓN DE COMPORTAMIENTO','xn',
 ['XN = 140 − 0,10Y + 0,20E','Y ↑ → más importaciones. E ↑ → mejora neta supuesta.'],[
 'Resumamos el canal comercial. La función de exportaciones netas es equis sub cero, menos equis sub uno por ye, más equis sub dos por e. Ye es producción e ingreso interno. El componente autónomo reúne factores que dejamos dados, incluida la demanda externa. No representa las exportaciones totales.',
 'En nuestra calibración, equis ene es ciento cuarenta menos cero coma diez por ye, más cero coma veinte por e. Con un dólar de novecientos y producción de tres mil trescientos, obtenemos menos diez. Si solo aumenta la producción en doscientas unidades, el saldo baja veinte. Es un movimiento sobre la misma recta. Si solo sube e en cien pesos por dólar, el saldo sube veinte y la recta se desplaza.',
 'El signo positivo del dólar es un supuesto de respuesta comercial favorable después del ajuste de cantidades, con precios dados. Las importaciones pueden encarecerse antes de que sus cantidades cambien. El modelo no afirma que el saldo mejore inmediatamente ni fija cuántos meses tarda.'
 ],['xn','x0','x1','x2','y'],deep='comercio')

s(1,'La demanda por producción nacional',
 'Introducir la IS abierta distinguiendo definición de gasto y condición de equilibrio.',
 'EL PUENTE DESDE IS–LM CERRADO','goods',
 ['Z = C + I + G + X − IM','Equilibrio de bienes: Y = Z'],[
 'En la economía cerrada sumábamos consumo, inversión y compras públicas. Ahora parte de esas compras puede corresponder a producción extranjera. Para obtener demanda por producción nacional, restamos las importaciones y sumamos lo que los no residentes compran de nuestra producción.',
 'Zeta designa esa demanda planeada. Se define como ce más i mayúscula más ge más equis ene. La igualdad entre ye y zeta es una condición distinta: el equilibrio del mercado de bienes. Fuera del equilibrio, las ventas planeadas y la producción pueden diferir, generando inventarios involuntarios. No confundas esa condición sobre planes con la identidad de las cuentas realizadas.',
 'Conservamos las relaciones conocidas. El consumo es ce sub cero más ce sub uno por el ingreso disponible, ye menos impuestos te. La inversión es be sub cero más be sub uno por ye, menos be sub dos por la tasa i. Te es un monto fijo. La tasa entra en porcentaje anual: cuatro significa cuatro por ciento. Abrir el modelo añade el saldo externo, pero conserva estos mecanismos.'
 ],['is','z','consumo','inversion','tasa'],deep='identidad')

s(1,'Construir la IS abierta, paso a paso',
 'Sustituir, distribuir y reunir términos para obtener la relación de equilibrio de bienes.',
 'DERIVACIÓN','derive',
 ['A = c₀ − c₁T + b₀ + G + x₀','a = 1 − c₁ − b₁ + x₁ > 0','aY = A − b₂i + x₂E; α = 1/a'],[
 'Sustituyamos consumo, inversión y exportaciones netas en la condición ye igual a zeta. Distribuir el consumo entrega ce sub uno por ye menos ce sub uno por te. La inversión añade be sub uno por ye y resta el efecto de la tasa. El saldo externo resta equis sub uno por ye y añade el efecto del dólar.',
 'Reunimos los términos con ye a la izquierda. Restamos ce sub uno por ye y be sub uno por ye, y sumamos equis sub uno por ye en ambos lados. El coeficiente que queda es uno menos ce sub uno menos be sub uno más equis sub uno. Lo llamaremos a minúscula. Reservamos a mayúscula para el gasto autónomo, como en las clases previas: consumo autónomo, menos el consumo reducido por impuestos, más inversión autónoma, compras públicas y componente autónomo neto externo. Mayúscula y minúscula cumplen funciones distintas.',
 'La ecuación dice que a minúscula, multiplicada por la producción, es igual al gasto autónomo a mayúscula, menos be sub dos multiplicado por la tasa, más equis sub dos multiplicado por el tipo de cambio. Dividimos todos los términos por a minúscula, que suponemos positiva. Su inverso es alfa, el multiplicador de bienes a un dólar y una tasa dados. Esa respuesta parcial todavía no es el efecto final bajo flotación: allí también cambia el dólar.'
 ],['coeficiente','autonomo','is','multiplicador'],deep='derivacion')

s(1,'La condición externa: BP horizontal',
 'Explicar el cierre financiero simplificado y por qué no obliga a XN = 0.',
 'UNA CONDICIÓN, NO UNA IDENTIDAD','bp',
 ['BP: i = i*','Movilidad perfecta + activos comparables + prima y depreciación esperada nulas'],[
 'Una pequeña economía abierta toma la tasa internacional como dada. Pequeña significa que sus decisiones no cambian esa tasa mundial. Si los activos son comparables y existe movilidad perfecta de capitales, una diferencia de rendimientos genera presión para cambiar de cartera.',
 'Para escribir i igual a i asterisco, añadimos dos supuestos decisivos: prima por riesgo nula y depreciación esperada nula en el horizonte considerado. I asterisco es la tasa externa; ambas tasas usan el mismo horizonte anual y la misma unidad porcentual. La condición financiera aparece como una recta horizontal a esa tasa. La llamaremos be pe, por la representación tradicional del equilibrio externo.',
 'La recta no exige exportaciones netas iguales a cero. Un déficit de bienes y servicios puede tener financiamiento externo. Tampoco es la identidad contable de toda la balanza de pagos. Estamos usando una condición de equilibrio financiero simplificada. En la profundización veremos cómo entran las expectativas y una prima constante sin confundirlas con movilidad imperfecta.'
 ],['bp','movilidad','tasaexterna','prima'],deep='paridad')

s(1,'El régimen decide qué variable ajusta',
 'Elegir el orden de solución correcto y conectar la LM conocida con el cierre externo.',
 'ANTES DE CALCULAR','regimes',
 ['LM: M/P = d₁Y − d₂i','Flotación: i → Y → E. Fijo: i → Y → M/P.'],[
 'La ele eme conserva su significado: oferta real de dinero igual a demanda real. Eme es dinero nominal y pe es el nivel de precios. La demanda aumenta con producción y disminuye con tasa. Los coeficientes de sub uno y de sub dos son positivos. Con dinero real dado, sumar de sub dos por i y dividir por de sub uno permite despejar ye.',
 'Bajo flotación, en este modelo la política fija el dinero real y el dólar ajusta. Primero be pe da la tasa, luego ele eme da la producción, y finalmente i ese permite recuperar el dólar. No significa que el dólar ocurra después en un reloj: es un orden algebraico para resolver relaciones simultáneas.',
 'Bajo cambio fijo, la autoridad fija e y debe permitir que el dinero acomode la defensa de esa paridad. Primero be pe da i; luego i ese, con el dólar dado, entrega ye; por último ele eme calcula el dinero requerido. No puedes fijar independientemente dólar y dinero y exigir que todas las ecuaciones sigan cerrando.'
 ],['lm','dinero','regimen'],deep='cierre')

s(2,'Una sola economía para comparar',
 'Leer parámetros, unidades y valores exógenos de la calibración común.',
 'CALIBRACIÓN DIDÁCTICA · NO DATOS DE CHILE','calibration',
 ['C = 100 + 0,75(Y − 80)','I = 160 + 0,15Y − 15i','XN = 140 − 0,10Y + 0,20E','G = 200; M/P = 1.450; i* = 4 %'],[
 'Usaremos la misma economía en los cuatro experimentos. Producto y gastos son flujos reales de un trimestre docente, medidos a precios de referencia. El dinero real es un saldo, no un gasto trimestral. Los coeficientes de su demanda conectan ese saldo con el ingreso del trimestre. Las tasas son porcentajes anuales y e se mide en pesos por dólar.',
 'El consumo autónomo es cien y la propensión marginal a consumir es cero coma setenta y cinco. Los impuestos fijos son ochenta. La inversión autónoma es ciento sesenta; por cada unidad adicional de producción aumenta cero coma quince, y por cada punto porcentual de tasa disminuye quince. El gasto público inicial es doscientos.',
 'La demanda real de dinero es cero coma cincuenta por ye menos cincuenta por i. La oferta real es mil cuatrocientos cincuenta y la tasa externa es cuatro por ciento. Con los coeficientes comerciales anteriores, a minúscula resulta cero coma veinte y el gasto autónomo a mayúscula resulta quinientos cuarenta. Conservaremos precisión en las cuentas y redondearemos solo al mostrar. Cada política partirá nuevamente de esta base.'
 ],['calibracion','coeficiente','autonomo','dinero','tasa'],deep='parametros')

s(2,'Resolver primero BP y LM',
 'Determinar tasa y producción iniciales con el cierre de flotación.',
 'EQUILIBRIO INICIAL · PASOS 1 Y 2','solveLM',
 ['i = i* = 4 %','1.450 = 0,50Y − 50 × 4','1.650 = 0,50Y → Y = 3.300'],[
 'Partimos con flotación y dinero real dado. Be pe fija la tasa doméstica en cuatro por ciento. Sustituye ese cuatro en ele eme: mil cuatrocientos cincuenta es igual a cero coma cincuenta por la producción, menos cincuenta por cuatro. Multiplicar cincuenta por cuatro da doscientos.',
 'Sumamos doscientos a ambos lados para conservar la igualdad. Quedan mil seiscientos cincuenta iguales a cero coma cincuenta por ye. Ahora dividimos ambos lados por cero coma cincuenta. Obtenemos ye igual a tres mil trescientos. Ya tenemos el par que satisface dinero y la condición externa.',
 'En la figura, localiza la horizontal be pe en cuatro por ciento y busca su cruce con ele eme. La proyección vertical entrega tres mil trescientos en el eje de producción. Todavía debemos encontrar el dólar que permite que bienes también cierre. La intersección de estas dos relaciones no nos autoriza a elegir cualquier e: esa elección debe satisfacer i ese.'
 ],['bp','lm','y'],deep='base')

s(2,'Recuperar E y cerrar las cuentas',
 'Resolver el dólar inicial y comprobar bienes, dinero y condición externa.',
 'EQUILIBRIO INICIAL · PASOS 3 Y 4','base',
 ['IS: Y = 2.700 − 75i + E','3.300 = 2.400 + E → E = 900','C = 2.515; I = 595; XN = −10'],[
 'La i ese calibrada es cero coma veinte por ye igual a quinientos cuarenta menos quince por i más cero coma veinte por e. Dividir cada término por cero coma veinte entrega ye igual a dos mil setecientos menos setenta y cinco por i más e.',
 'Sustituimos una producción de tres mil trescientos y una tasa de cuatro por ciento. Multiplicar setenta y cinco por cuatro da trescientos. Por tanto, tres mil trescientos es igual a dos mil cuatrocientos más el tipo de cambio. Restamos dos mil cuatrocientos y obtenemos e igual a novecientos pesos por dólar. Este precio corresponde a la economía docente, no a una predicción de mercado.',
 'Comprobemos con las funciones originales. El consumo es dos mil quinientos quince, la inversión quinientos noventa y cinco y las exportaciones netas menos diez. Sumados a doscientos de gasto público dan tres mil trescientos. La demanda de dinero es mil seiscientos cincuenta menos doscientos: mil cuatrocientos cincuenta. La tasa local y la externa son cuatro. Los tres cierres se cumplen aunque el saldo comercial ampliado sea negativo.'
 ],['is','xn','equilibrio'],deep='base')

s(3,'G aumenta y el dólar puede flotar',
 'Predecir qué variables pueden cambiar sin confundir el impulso inicial con el resultado final.',
 'PREDICE ANTES DE MIRAR LA RESPUESTA','questionFiscal',
 ['G: 200 → 220. M/P: 1.450. i*: 4 %.','¿Cambian Y, E y XN?'],[
 'Vuelve al equilibrio inicial. El Gobierno aumenta ge de doscientos a doscientos veinte y deja constantes los impuestos. Seguimos con flotación, dinero real de mil cuatrocientos cincuenta y tasa externa de cuatro por ciento. Antes de responder por intuición, identifica qué dos ecuaciones quedaron exactamente iguales.',
 'Si congeláramos el dólar y la tasa, el multiplicador de bienes sería cinco: veinte de gasto desplazaría la i ese en cien unidades de producción. Pero congelar el dólar es solo una comparación parcial. En el régimen que estamos estudiando, e tiene permiso para ajustar.',
 'Anticipa tres resultados: producción final, precio del dólar y saldo externo. Pregúntate si ele eme y be pe pueden seguir cruzándose en otro producto sin cambiar sus parámetros. Luego explica qué tendría que ocurrir con las compras externas netas para absorber más gasto público cuando producción e inversión no aumentan. Tienes unos segundos para anotar tu respuesta; la siguiente diapositiva cierra el mecanismo.'
 ],['flotacion','multiplicador','xn'],pause=12,prompt='Anota tu predicción para ΔY, ΔE y ΔXN.',answer='Con el cierre básico: ΔY = 0; ΔE = −100 CLP/USD; ΔXN = −20.')

s(3,'La apreciación compensa el impulso fiscal',
 'Resolver y explicar el desplazamiento de gasto externo bajo flotación.',
 'POLÍTICA FISCAL · FLOTACIÓN','floatFiscal',
 ['Y = 3.300; i = 4 %','E: 900 → 800; XN: −10 → −30','ΔG + ΔXN = 20 − 20 = 0'],[
 'Ele eme y be pe no cambiaron: la producción final permanece en tres mil trescientos y la tasa en cuatro. La nueva i ese es ye igual a dos mil ochocientos menos setenta y cinco por i más e. Sustituir los valores finales entrega tres mil trescientos iguales a dos mil quinientos más e. El dólar baja a ochocientos: el peso se aprecia.',
 'A la tasa inicial, la expansión de demanda tendería a elevar el rendimiento local. La presión por comprar activos locales aprecia el peso. Con la respuesta comercial supuesta, esa apreciación reduce exportaciones netas y neutraliza la expansión de demanda nacional. Las flechas explican presiones; no describen una trayectoria temporal estimada.',
 'El saldo externo baja de menos diez a menos treinta: cae veinte, lo mismo que aumentó ge. Consumo e inversión no cambian. Observa que la i ese final coincide con la inicial en el plano de producción y tasa, aunque ge y e son distintos. El efecto nulo sobre producción agregada es un resultado condicional: cambian el dólar, la composición del gasto y las exposiciones sectoriales.'
 ],['flotacion','apreciacion','xn'],deep='fiscalflota')

s(3,'Más dinero con flotación',
 'Predecir el canal cambiario de la expansión monetaria desde la base común.',
 'UN EXPERIMENTO NUEVO DESDE LA BASE','questionMoney',
 ['M/P: 1.450 → 1.550. G vuelve a 200.','¿Puede bajar permanentemente i si i* sigue en 4 %?'],[
 'Regresa otra vez a la base. No sumes este experimento al aumento anterior de gasto. Ge vuelve a doscientos y el dólar inicial es novecientos. Ahora la oferta real de dinero aumenta en cien: pasa de mil cuatrocientos cincuenta a mil quinientos cincuenta. Se mantienen los precios y la tasa externa.',
 'En una economía cerrada reconocerías una presión inicial a la baja de la tasa. Aquí los inversionistas pueden comprar activos externos. Si el rendimiento doméstico tendiera a bajar de cuatro, esa recomposición presionaría al alza el precio del dólar: el peso se depreciaría. Después, la respuesta comercial ayuda a elevar la demanda por producción nacional.',
 'Predice el resultado final antes de calcularlo. Usa be pe para i, luego ele eme para ye y finalmente i ese para e. ¿El mayor ingreso puede empeorar una parte del saldo externo aunque el dólar aumente? Separa el efecto de las importaciones inducidas del efecto cambiario. Esa distinción permitirá comprobar la cuenta completa.'
 ],['flotacion','dinero','depreciacion'],pause=12,prompt='Resuelve 1.550 = 0,50Y − 200; después usa IS para E.',answer='Y = 3.500; i = 4 %; E = 1.100; XN = 10.')

s(3,'El dólar y el ingreso cierran la expansión',
 'Resolver la expansión monetaria y descomponer XN e inversión.',
 'POLÍTICA MONETARIA · FLOTACIÓN','floatMoney',
 ['Y: 3.300 → 3.500; E: 900 → 1.100','ΔXN = −0,10 × 200 + 0,20 × 200 = 20','ΔI = 0,15 × 200 − 15 × 0 = 30'],[
 'Be pe mantiene la tasa en cuatro. La nueva ele eme da mil quinientos cincuenta iguales a cero coma cincuenta por ye menos doscientos. Sumamos doscientos y dividimos por cero coma cincuenta: la producción aumenta a tres mil quinientos. En la i ese original, tres mil quinientos es igual a dos mil cuatrocientos más e. El dólar llega a mil cien.',
 'El saldo externo mejora de menos diez a diez. Su cambio tiene dos componentes: el mayor ingreso reduce el saldo en veinte por importaciones inducidas, mientras la depreciación lo mejora en cuarenta. El cambio neto es más veinte. No confundas el efecto aislado del dólar con el saldo final después del aumento de producción.',
 'El consumo sube a dos mil seiscientos sesenta y cinco y la inversión a seiscientos veinticinco. La inversión crece treinta porque el ingreso aumenta doscientas unidades y la tasa final no cambia. Sumamos consumo, inversión, gasto público y saldo externo: obtenemos tres mil quinientos. El efecto de este modelo con dinero dado no es una estimación de una rebaja de la tasa de política chilena.'
 ],['flotacion','xn','inversion'],deep='monetariaflota')

s(4,'Defender una paridad cambia el cierre',
 'Explicar por qué M/P se vuelve endógeno bajo tipo de cambio fijo.',
 'E = 900 SE MANTIENE FIJO','intervention',
 ['Comprar divisas → entregar pesos → M aumenta','Vender divisas → recibir pesos → M disminuye'],[
 'Cambiemos la regla institucional. La autoridad se compromete a sostener el dólar en novecientos pesos. Para que esa promesa sea creíble, suponemos reservas suficientes y ausencia de una esterilización que intente mantener independiente la cantidad de dinero. Los precios siguen dados.',
 'Si existe presión de apreciación, la autoridad compra divisas y entrega pesos. Esa operación aumenta el dinero local. Si hay presión de depreciación, vende divisas y recibe pesos, retirando dinero. Con precios constantes, esos cambios nominales también modifican la oferta real. No calcularemos la pérdida de reservas porque el modelo no especifica un balance completo ni una trayectoria de flujos.',
 'La producción se determina ahora en i ese con e e i dados. Ele eme nos dice cuánto dinero necesita ese equilibrio. La causalidad institucional importa: el dinero que aparece después de una expansión fiscal es acomodación para defender la paridad. No es una segunda política independiente que podamos elegir libremente. Predice cómo cambia, por eso, la respuesta fiscal que acabamos de estudiar bajo flotación.'
 ],['fijo','reservas','esterilizacion'],deep='intervencion')

s(4,'Expansión fiscal con dólar fijo',
 'Calcular la producción y el dinero requerido por la defensa de la paridad.',
 'G: 200 → 220 · E = 900','fixedFiscal',
 ['Primero: BP e IS con E fijo','Después: LM calcula el dinero necesario'],[
 'Desde la misma base, aumenta ge de doscientos a doscientos veinte. Esta vez el dólar permanece en novecientos. La tasa sigue en cuatro. Antes de revelar el gráfico final, calcula la producción con la nueva i ese: dos mil ochocientos menos setenta y cinco por cuatro, más novecientos. Luego calcula la demanda de dinero correspondiente.',
 (10,'Calcula Y y el M/P requerido con E = 900.'),
 'La producción llega a tres mil cuatrocientos. La ele eme exige la mitad de tres mil cuatrocientos, menos cincuenta por cuatro. La mitad son mil setecientos y el segundo término son doscientos. Al restar queda una oferta de dinero real de mil quinientos: cincuenta más que al inicio. La compra de divisas evita la apreciación y acomoda esa expansión monetaria. El desplazamiento fiscal permanece en el equilibrio final.',
 'El saldo externo cae a menos veinte por las importaciones inducidas, aunque el dólar no cambió. El consumo es dos mil quinientos noventa y la inversión seiscientos diez. Sumados a doscientos veinte de gasto público y menos veinte de saldo externo dan tres mil cuatrocientos. La producción aumenta cien, con dinero endógeno y paridad creíble. Cada cifra describe el mismo equilibrio, no decisiones independientes superpuestas.'
 ],['fijo','reservas','lm'],deep='fiscalfijo',prompt='¿Cuánto dinero real requiere la defensa de E = 900?',answer='Y = 3.400; M/P = 1.500; XN = −20.',reveal_after=2)

s(4,'Un intento monetario que se revierte',
 'Detectar la incompatibilidad de una expansión monetaria autónoma permanente con la paridad.',
 'M/P INTENTA SUBIR A 1.550 · E = 900','fixedMoney',
 ['¿Pueden coexistir E = 900 y M/P = 1.550?','Comprueba bienes, dinero y BP antes de responder.'],[
 'Vuelve a la base del régimen fijo, con ge igual a doscientos. La autoridad intenta aumentar el dinero real de mil cuatrocientos cincuenta a mil quinientos cincuenta, pero mantiene la promesa del dólar a novecientos. ¿Puede conservar ambos objetivos con movilidad perfecta y tasa externa de cuatro? Usa primero i ese, que no cambió.',
 (10,'Con i = 4 y E = 900, calcula Y y luego la demanda real de dinero.'),
 'I ese mantiene la producción en tres mil trescientos. A ese ingreso y esa tasa, la demanda real de dinero sigue siendo mil cuatrocientos cincuenta. Una oferta de mil quinientos cincuenta no sería equilibrio monetario. La presión inicial a una tasa menor induce salida hacia activos externos y presión de depreciación. Para defender la paridad, la autoridad vende divisas y retira dinero local.',
 'La expansión autónoma se revierte y la ele eme final coincide con la inicial. La producción, la tasa, el dólar y el saldo externo vuelven a sus valores de base. La conclusión se refiere a la falta de autonomía monetaria permanente bajo estos supuestos. No dice que las operaciones sobre reservas no importen ni describe una crisis de reservas agotadas.'
 ],['fijo','reservas','trilema'],deep='monetariafijo',prompt='¿Qué ecuación falla si dejas M/P en 1.550?',answer='La demanda es 1.450: sobra 100 de oferta real. La defensa revierte la expansión.',reveal_after=2)

s(4,'Comparar las cuatro políticas',
 'Sintetizar resultados condicionados al régimen sin memorizar etiquetas de eficacia.',
 'CADA EXPERIMENTO PARTE DE LA BASE','matrix',
 ['Flotación: ajusta E. Fijo: ajusta M/P.','La tasa final es 4 % en las cuatro comparaciones.'],[
 'Mira la tabla por columnas antes de memorizar resultados. En flotación, dinero y be pe determinan el producto. El aumento de ge modifica el dólar y el saldo externo, pero no ye. El aumento de dinero modifica ye y requiere una depreciación que permita cerrar bienes.',
 'En el régimen fijo, la tasa y el dólar están dados. La expansión fiscal eleva la producción y la autoridad acomoda el dinero. El intento de expansión monetaria independiente se revierte al defender la paridad. En los cuatro experimentos la tasa final es cuatro. Eso no significa que el canal financiero esté ausente: justamente su restricción explica los ajustes.',
 'Los cambios del saldo externo tampoco son iguales: menos veinte con la expansión fiscal flotante, más veinte con la monetaria flotante, menos diez con la fiscal fija y cero con el intento monetario fijo. Son cambios respecto de la base, no niveles finales. El cuadro resume una economía con movilidad perfecta, precios dados y respuesta comercial favorable. Sin declarar esas condiciones, la tabla deja de ser una conclusión rigurosa.'
 ],['regimen','flotacion','fijo','xn'],deep='resultados',pause=8,prompt='Sin mirar la tabla, explica qué variable ajusta en cada régimen.')

s(5,'Un ejercicio nuevo para recuperar el método',
 'Transferir el orden de solución a shocks pequeños y comprobarlo sin copiar resultados.',
 'INTENTA ANTES DE REVELAR','retrieval',
 ['A. Flotación: M/P aumenta en 50.','B. Cambio fijo: G aumenta en 10.','Cada caso parte de la base.'],[
 'Ahora resuelve dos ejercicios nuevos. En el caso a, hay flotación y el dinero real aumenta cincuenta, con ge constante. En el caso be, el dólar permanece en novecientos y el gasto público aumenta diez. Ambos parten de la base, por separado. Anota para cada uno producción, tasa, dólar y dinero final.',
 'En el primero, empieza por be pe y ele eme. Después usa i ese para el dólar. En el segundo, empieza por be pe e i ese con e fijo; ele eme entrega el dinero requerido. No cambies el orden porque el impulso se parezca al ejercicio anterior. El régimen decide qué variable queda dada.',
 (15,'Calcula ambos casos. Puedes pausar si necesitas más tiempo.'),
 'En el caso a, la producción llega a tres mil cuatrocientos y el dólar a mil pesos; el dinero final es mil quinientos. En el caso be, la producción llega a tres mil trescientos cincuenta, el dólar sigue en novecientos y el dinero requerido es mil cuatrocientos setenta y cinco. La tasa es cuatro en ambos. Abre la práctica para sustituir en las ecuaciones originales y comparar tu procedimiento, no solo el resultado.'
 ],['equilibrio','flotacion','fijo'],deep='practica',prompt='Resuelve A y B antes de consultar la solución.',answer='A: Y = 3.400; i = 4 %; E = 1.000; M/P = 1.500. B: Y = 3.350; i = 4 %; E = 900; M/P = 1.475.',reveal_after=3)

s(5,'El trilema y la variable que falta',
 'Explicar la incompatibilidad entre las tres opciones institucionales.',
 'UNA RESTRICCIÓN DEL CIERRE','trilemma',
 ['Tipo de cambio fijo','Movilidad libre de capitales','Política monetaria independiente'],[
 'El trilema resume una incompatibilidad. No podemos mantener simultáneamente un tipo de cambio fijo, libre movilidad de capitales y una política monetaria independiente. En nuestro caso básico, la movilidad perfecta y la paridad creíble fijan la tasa local. Defender el dólar obliga a acomodar el dinero.',
 'Si una autoridad pretende conservar el dólar fijo y un dinero arbitrario, prueba a sustituir ambas metas en i ese, ele eme y be pe. En general, alguna condición no cerrará. El problema no se resuelve agregando una flecha a un gráfico: hay que modificar una regla, restringir la movilidad o abandonar la independencia monetaria.',
 'Con flotación se abandona la meta fija de e. En una aplicación moderna con tasa de política, las expectativas cambiarias permiten diferencias entre la tasa local y la externa. Por eso nuestro i igual a i asterisco no debe trasladarse literalmente a toda decisión real. Ya puedes explicar el mecanismo central: cada régimen define qué precio o cantidad absorbe la presión creada por una política.'
 ],['trilema','movilidad','regimen'],deep='paridad')

s(6,'Los supuestos sostienen la conclusión',
 'Reconocer los límites de la respuesta comercial y del cierre financiero.',
 'ANTES DE APLICAR EL RESULTADO','limits',
 ['Precios dados y capacidad de respuesta','Arbitraje sin prima ni depreciación esperada','Respuesta comercial favorable; paridad creíble'],[
 'La comparación se apoya en varios supuestos que tienen funciones distintas. Los precios dados y la capacidad disponible permiten que la demanda modifique producción en el corto plazo. Si la capacidad está restringida o cambian los precios, la respuesta puede incluir inflación y otros ajustes que aquí no calculamos.',
 'El coeficiente positivo del dólar en exportaciones netas supone que las cantidades responden favorablemente en el horizonte relevante. En el corto plazo, el valor de las importaciones puede subir antes de que bajen sus cantidades. La profundización sobre la curva jota explica ese riesgo. Tampoco basta la depreciación nominal si los precios internos suben al mismo tiempo.',
 'La tasa igual a la externa requiere los supuestos financieros que declaramos. Una prima por riesgo constante mueve la horizontal a otra altura; no crea por sí sola una be pe inclinada. La movilidad imperfecta necesita una especificación adicional. En el régimen fijo, reservas, credibilidad y ausencia de esterilización incompatible sostienen el resultado. Estas condiciones explican cuándo usar el modelo y cuándo ampliar sus ecuaciones.'
 ],['precios','prima','curvaj','esterilizacion'],deep='comercio')

s(6,'Chile: flotación con una tasa de política',
 'Distinguir el cierre pedagógico de la operación monetaria del Banco Central de Chile.',
 'CONTEXTO INSTITUCIONAL · FUENTE PRIMARIA','chile',
 ['Chile: metas de inflación + tipo de cambio flexible','La TPM es el instrumento operacional principal.','Una decisión de TPM requiere un cierre distinto.'],[
 'El Banco Central de Chile describe su marco como metas de inflación con tipo de cambio flexible. La tasa de política monetaria, llamada te pe eme, es su principal instrumento operacional. La liquidez se administra para orientar la tasa interbancaria hacia ese objetivo. No es la misma regla que escoger un dinero real fijo en cada ejercicio.',
 'La comparación de Mundell y Fleming sigue siendo útil para identificar canales: cartera, dólar, comercio y producción. Pero el resultado de más dinero con tasa externa fija no mide directamente el efecto de una rebaja de la te pe eme. Para estudiar esa decisión necesitamos expectativas, riesgos, otras tasas y la reacción de precios. Tampoco la neutralización fiscal exacta es una conclusión empírica sobre Chile.',
 'La institución admite intervenciones cambiarias excepcionales. Eso no equivale por sí solo a prometer una paridad permanente. Esta diapositiva utiliza información institucional verificada del Banco Central; no usa series de coyuntura ni estima coeficientes. En las fuentes puedes revisar la fecha de consulta y distinguir este contexto real de las calibraciones docentes del resto de la clase.'
 ],['tpm','flotacion','paridad'],deep='chile')

s(6,'Explicar antes de decidir',
 'Aplicar los canales a una exposición empresarial y formular una síntesis con límites.',
 'CIERRE Y TICKET DE SALIDA','business',
 ['Cobros: USD 10.000; pagos: USD 6.000','Flujo neto expuesto: USD 4.000','E: 900 → 990 → diferencia de $360.000'],[
 'Volvamos a la empresa. En un caso ficticio, cobra diez mil dólares y paga seis mil dólares de insumos en el mismo período. Sin cambios de cantidades, contratos ni coberturas, queda expuesta por cuatro mil dólares netos. Con un dólar de novecientos, ese flujo equivale a tres millones seiscientos mil pesos. Con novecientos noventa, equivale a tres millones novecientos sesenta mil: la diferencia es trescientos sesenta mil pesos.',
 'Ese cambio no es utilidad neta. Faltan salarios, impuestos, deuda, otros costos y fechas de pago. Una importadora sin cobros en dólares enfrenta otra exposición. El modelo ayuda a ordenar preguntas, pero no decide por sí solo si conviene comprar, esperar o cubrir un pago. Para una decisión concreta pediríamos monedas de facturación, vencimientos, capacidad y respuesta de clientes.',
 'Cierra con cuatro frases propias. Primero, qué añade abrir i ese ele eme. Segundo, por qué be pe horizontal admite un saldo externo negativo. Tercero, qué variable ajusta en cada régimen. Cuarto, qué supuesto revisarías antes de aplicar la conclusión a una empresa chilena. Si puedes responder sin mirar, has recuperado el mecanismo y también su alcance.'
 ],['exposicion','xn','regimen'],deep='empresa',pause=12,prompt='Escribe las cuatro frases del ticket de salida.')

glossary=[
 ('mundell','Mundell–Fleming','Extensión de IS–LM a una pequeña economía abierta. Añade comercio, activos internacionales y régimen cambiario; sus resultados dependen del cierre elegido.'),
 ('exportaciones','X · Exportaciones','Ventas de bienes y servicios de residentes a no residentes. No exige que el servicio cruce físicamente la frontera.'),
 ('importaciones','IM · Importaciones','Compras de bienes y servicios de residentes a no residentes. Se usa IM para reservar M al dinero.'),
 ('xn','XN · Exportaciones netas','X − IM, con mismo período, valoración y unidad. No es toda la cuenta corriente ni el saldo de toda la balanza de pagos.'),
 ('activos','Activos financieros','Derechos a pagos futuros, como bonos o depósitos. Comprar activos externos pertenece al canal financiero, no a IM.'),
 ('e','E · Tipo de cambio nominal','CLP/USD: pesos chilenos por dólar. E mayor significa depreciación del peso. En los ejercicios E es un precio docente, no una cotización observada.'),
 ('depreciacion','Depreciación','Aumento de E en CLP/USD bajo flotación: el peso pierde valor respecto del dólar.'),
 ('apreciacion','Apreciación','Disminución de E en CLP/USD bajo flotación: el peso gana valor respecto del dólar.'),
 ('devaluacion','Devaluación y revaluación','En un régimen fijo, elevar la paridad oficial en CLP/USD es devaluar; reducirla es revaluar.'),
 ('x0','x₀ · Componente autónomo neto','Término de XN que reúne factores dados, incluida demanda externa. No equivale a exportaciones totales.'),
 ('x1','x₁ · Respuesta a Y','Unidades reales adicionales importadas por una unidad adicional de ingreso, con lo demás constante. Es 0,10 en la calibración.'),
 ('x2','x₂ · Respuesta a E','Variación de XN por un CLP/USD adicional, manteniendo Y constante. El signo positivo resume una respuesta comercial favorable, no necesariamente inmediata.'),
 ('y','Y · Producción e ingreso','Flujo real por trimestre docente. Los gastos se valoran en una unidad real común a precios de referencia.'),
 ('z','Z · Demanda planeada','C + I + G + XN: demanda por producción nacional. Y = Z es la condición de equilibrio de bienes.'),
 ('is','IS abierta','Relación de equilibrio de bienes: aY = A − b₂i + x₂E. A cada E dada tiene pendiente negativa en el plano (Y, i).'),
 ('lm','LM','Condición M/P = Md = d₁Y − d₂i. Despejada: Y = (M/P)/d₁ + (d₂/d₁)i. Base: Y = 2.900 + 100i. Con dinero real 1.500: Y = 3.000 + 100i; con 1.550: Y = 3.100 + 100i. Las rectas son crecientes.'),
 ('bp','BP horizontal','Condición externa simplificada i = i*. Requiere movilidad perfecta, activos comparables, prima y depreciación esperada nulas. No impone XN = 0.'),
 ('consumo','C · Consumo','C = c₀ + c₁(Y − T). c₀ = 100, c₁ = 0,75 y T = 80 son supuestos docentes. T es fijo.'),
 ('inversion','I · Inversión planeada','I = b₀ + b₁Y − b₂i. Responde al nivel de Y y a i; b₁Y no es el acelerador dinámico basado en el cambio de producción.'),
 ('tasa','i · Tasa doméstica','Porcentaje anual. i = 4 significa 4 %, no 0,04. Pasar de 4 a 5 son +1 punto porcentual y +25 % relativo.'),
 ('tasaexterna','i* · Tasa internacional','Tasa exógena de activos comparables, para el mismo horizonte de i. El asterisco no denota aquí producción potencial ni equilibrio de Y.'),
 ('coeficiente','a · Coeficiente de Y','a = 1 − c₁ − b₁ + x₁ = 0,20 > 0. Aparece al reunir términos en bienes. Esta condición no demuestra estabilidad dinámica de todo el modelo.'),
 ('autonomo','A · Gasto autónomo','A = c₀ − c₁T + b₀ + G + x₀ = 540 en la base. Mantiene la función de A de las clases previas. El factor del lado de Y se llama a minúscula; el multiplicador es α = 1/a.'),
 ('multiplicador','Multiplicador de bienes','α = ∂Y/∂G = 1/a = 5 manteniendo i, E, T y parámetros constantes. El efecto final depende del régimen.'),
 ('dinero','M/P y Md · Dinero real','M/P es oferta real; Md es demanda real. Son stocks, distintos de los flujos de gasto. d₁ = 0,50; d₂ = 50.'),
 ('regimen','Régimen cambiario','Regla sobre el tipo de cambio. El ejercicio distingue flotación con M/P dado y E endógeno, de fijo con E dado y M/P endógeno.'),
 ('flotacion','Flotación','E ajusta sin una paridad objetivo permanente. El cierre pedagógico usa dinero dado; no representa directamente el régimen operacional de TPM.'),
 ('fijo','Tipo de cambio fijo','La autoridad defiende E con operaciones de divisas. En el caso básico M/P acomoda, con paridad creíble y reservas suficientes.'),
 ('reservas','Reservas internacionales','Activos externos de la autoridad. Comprarlas entregando pesos expande dinero; venderlas recibiendo pesos lo contrae, sin esterilización.'),
 ('esterilizacion','Esterilización','Operación que compensa el efecto monetario de una intervención cambiaria. El cierre fijo básico excluye mantener así un dinero independiente permanentemente.'),
 ('movilidad','Movilidad perfecta de capitales','Caso límite de arbitraje con activos comparables. No basta por sí sola para escribir i = i*: también se fijan prima y depreciación esperada en cero.'),
 ('prima','ρ · Prima por riesgo','Compensación adicional en puntos porcentuales. Una prima exógena constante desplaza una BP horizontal; no genera por sí sola una BP inclinada.'),
 ('paridad','Paridad descubierta de tasas (UIP)','Aproximación: i ≈ i* + 100(E esperado − E actual)/E actual + ρ. Usa tasas y expectativas del mismo horizonte. La versión básica anula los últimos términos.'),
 ('trilema','Trilema','Incompatibilidad entre cambio fijo, libre movilidad de capitales y autonomía monetaria simultáneas.'),
 ('precios','Precios dados','Se mantienen los precios internos y externos para aislar mecanismos. No implica que la inflación real sea siempre cero.'),
 ('curvaj','Curva J','Posible deterioro inicial del saldo tras depreciación, seguido de mejora al ajustar cantidades. No es una ley universal.'),
 ('tpm','TPM · Tasa de política monetaria','Principal instrumento operacional del BCCh. La liquidez se administra para orientar la tasa interbancaria al objetivo; difiere del dinero fijo del ejercicio.'),
 ('equilibrio','Equilibrio y comprobación','Deben cumplirse simultáneamente bienes, dinero y condición externa. Se comprueba sustituyendo en las funciones originales.'),
 ('calibracion','Calibración didáctica','Parámetros elegidos para estudiar mecanismos y comparar escenarios. No son estimaciones de Chile ni datos observados.'),
 ('exposicion','Exposición cambiaria','Sensibilidad de flujos, activos o pasivos a E. Su efecto depende de monedas, cantidades, contratos, coberturas y fechas; no equivale automáticamente a utilidad.')
]

deep={
 'saldos':('Qué incluye cada saldo','<p><strong>XN = X − IM</strong> incluye bienes y servicios. La balanza comercial de bienes excluye servicios. La cuenta corriente añade ingresos primarios y secundarios. La identidad de la balanza de pagos no es la recta BP del gráfico.</p><p>Ejercicio: X = 300 e IM pasa de 310 a 330. XN pasa de −10 a −30 aunque X no cambie.</p>'),
 'real':('Tipo de cambio nominal y real','<p><strong>q = E·P<sub>ext</sub>/P</strong>. q compara el precio de una canasta externa, convertido a pesos, con el de una canasta interna comparable. P<sub>ext</sub> es precio externo en moneda extranjera; P, precio interno.</p><p>A precios dados, q se mueve proporcionalmente con E; no son numéricamente iguales. Si usas índices, declara su base. Una inflación interna mayor puede compensar la depreciación nominal.</p>'),
 'comercio':('La respuesta comercial y sus rezagos','<p>El supuesto x₂ &gt; 0 resume una mejora neta tras ajustar cantidades. El valor en pesos de importaciones puede aumentar primero.</p><p>La condición de Marshall–Lerner, en su versión habitual alrededor de un saldo inicialmente equilibrado y bajo supuestos de oferta y precios, requiere que las elasticidades precio de las cantidades exportadas e importadas, en valor absoluto, sumen más de uno. Una elasticidad es el cambio porcentual de una cantidad ante 1 % de cambio en su precio relativo.</p><p>La curva J describe un posible deterioro inicial seguido de mejora. No garantiza una forma temporal ni un número de meses.</p>'),
 'identidad':('Contabilidad, conducta y equilibrio','<p><strong>Definición:</strong> XN = X − IM y Z = C + I + G + XN.</p><p><strong>Conducta:</strong> C, I, XN y Md son planes descritos por funciones supuestas.</p><p><strong>Equilibrio:</strong> Y = Z elimina inventarios involuntarios; M/P = Md cierra dinero; i = i* cierra el caso financiero simplificado. La identidad realizada de bienes incorpora inversión efectivamente realizada e inventarios.</p>'),
 'derivacion':('La derivación completa y el multiplicador parcial','<div class="equation small-eq">Y = c₀ + c₁Y − c₁T + b₀ + b₁Y − b₂i + G + x₀ − x₁Y + x₂E<br>(1 − c₁ − b₁ + x₁)Y = c₀ − c₁T + b₀ + G + x₀ − b₂i + x₂E<br>aY = A − b₂i + x₂E<br>Y = (A − b₂i + x₂E)/a</div><p>Con c₁ = 0,75; b₁ = 0,15, el denominador cerrado es 0,10. Al añadir x₁ = 0,10 es 0,20. A i y E dadas, el multiplicador de G baja de 10 a 5. No es el efecto fiscal final bajo flotación.</p>'),
 'paridad':('Expectativas y prima: una extensión del cierre','<div class="equation small-eq">i ≈ i* + 100·(E<sub>esperado</sub> − E)/E + ρ</div><p>Es una aproximación de la paridad descubierta para rendimientos de igual horizonte, con tasas expresadas en porcentaje y prima ρ en puntos porcentuales. La depreciación esperada tiene signo positivo con E = CLP/USD.</p><p>Si E esperado = E y ρ = 0, queda i = i*. Si ρ es exógena y constante, BP sigue horizontal en i = i* + ρ. Movilidad imperfecta requiere especificar una relación adicional; una prima distinta entre escenarios no produce por sí sola pendiente.</p>'),
 'cierre':('Variables dadas y endógenas','<p>En ambos regímenes se fijan impuestos, parámetros, precios y tasa externa. <strong>Flotación:</strong> se da M/P y se resuelven i, Y, E. <strong>Fijo:</strong> se da E y se resuelven i, Y, M/P.</p><p>El orden de despeje no indica un reloj de ajuste. El sistema compara equilibrios estáticos; las presiones financieras explican el mecanismo sin asignarles tiempos ni velocidades.</p>'),
 'parametros':('Unidades y parámetros de la base','<p>Flujos reales por trimestre docente: Y, C, I, G, T, X e IM. Stocks reales: M/P y Md. Tasas i e i*: % anual, con valor 4 para 4 %. E: CLP/USD. Precios dados.</p><p>c₀ = 100; c₁ = 0,75; T = 80; b₀ = 160; b₁ = 0,15; b₂ = 15; G = 200; x₀ = 140; x₁ = 0,10; x₂ = 0,20; d₁ = 0,50; d₂ = 50; M/P = 1.450; i* = 4.</p><p>Descomposición compatible, en el rango de estos ejercicios: X = 210 + 0,10E; IM = 70 + 0,10Y − 0,10E. El efecto de E ya está incorporado: no se vuelven a multiplicar IM por E.</p>'),
 'base':('Comprobar el equilibrio inicial','<div class="equation small-eq">C = 100 + 0,75(3.300 − 80) = 2.515<br>I = 160 + 0,15·3.300 − 15·4 = 595<br>XN = 140 − 0,10·3.300 + 0,20·900 = −10<br>2.515 + 595 + 200 − 10 = 3.300<br>0,50·3.300 − 50·4 = 1.450<br>i − i* = 4 − 4 = 0</div><p>X = 300 e IM = 310 en la descomposición compatible. BP no impone XN = 0.</p>'),
 'fiscalflota':('Fiscal en flotación: cuentas y alcance','<p>G = 220; i = 4; M/P = 1.450; Y = 3.300; E = 800; C = 2.515; I = 595; XN = −30.</p><div class="equation">2.515 + 595 + 220 − 30 = 3.300</div><p>Con dinero, tasa externa y precios dados, ΔY = 0. En IS: x₂ΔE = −ΔG; ΔE = −20/0,20 = −100. Como ΔY = 0, ΔXN = x₂ΔE = −20.</p><p>La curva inicial y la final coinciden en (Y, i), aunque G y E difieran. La curva discontinua con G nuevo y E inicial es una comparación parcial, no un equilibrio final de los tres cierres.</p>'),
 'monetariaflota':('Monetaria en flotación: cuentas y canales','<p>M/P = 1.550; i = 4; G = 200; Y = 3.500; E = 1.100; C = 2.665; I = 625; XN = 10.</p><div class="equation">2.665 + 625 + 200 + 10 = 3.500</div><p>ΔY = Δ(M/P)/d₁ = 200. En bienes, aΔY = x₂ΔE, por lo que ΔE = 200. ΔXN = −20 + 40 = 20. ΔI = b₁ΔY − b₂Δi = 30.</p>'),
 'intervencion':('Intervención y dinero endógeno','<p>Comprar divisas entregando pesos aumenta dinero; vender divisas recibiendo pesos lo reduce. Con P fijo se mueve M/P. Se omiten detalles de multiplicación bancaria y una contabilidad completa de reservas.</p><p>La esterilización compensa el efecto monetario de una intervención. Sostener permanentemente una cantidad de dinero independiente no es compatible con este cierre de cambio fijo y movilidad perfecta. No se modelan crisis, reservas agotadas ni ataques especulativos.</p>'),
 'fiscalfijo':('Fiscal con paridad: todas las cuentas','<p>G = 220; E = 900; i = 4; Y = 3.400; M/P = 1.500; C = 2.590; I = 610; XN = −20.</p><div class="equation">2.590 + 610 + 220 − 20 = 3.400</div><p>ΔY = ΔG/a = 100. Dinero requerido: Δ(M/P) = d₁ΔY = 50. El dinero acomoda la defensa del dólar; no es otro impulso autónomo.</p>'),
 'monetariafijo':('El intento monetario y la inconsistencia','<p>Con G = 200; E = 900 e i = 4, IS da Y = 3.300. LM requiere M/P = 1.450.</p><div class="equation">1.550 − (0,50·3.300 − 50·4) = 100</div><p>El residuo monetario de 100 muestra por qué la combinación pretendida no cierra. Vender divisas y retirar pesos revierte la expansión. El modelo no cuantifica una trayectoria ni el stock final de reservas.</p>'),
 'resultados':('Resultados y unidades','<div id="resultsTable"></div><p>Los cuatro shocks son independientes desde la base. Los cambios de i son puntos porcentuales; E está en CLP/USD; Y, C, I y XN son flujos reales por trimestre docente; M/P es stock real.</p>'),
 'practica':('Soluciones de la recuperación','<p><strong>A, flotación:</strong> M/P = 1.500; i = 4; Y = 3.400; E = 1.000; C = 2.590; I = 610; XN = 0. Suma de bienes: 2.590 + 610 + 200 + 0 = 3.400.</p><p><strong>B, fijo:</strong> G = 210; i = 4; E = 900; Y = 3.350; M/P = 1.475; C = 2.552,5; I = 602,5; XN = −15. Suma: 2.552,5 + 602,5 + 210 − 15 = 3.350.</p>'),
 'chile':('El cierre pedagógico y el marco del BCCh','<p>El BCCh combina metas de inflación y flotación. Su principal instrumento operacional es la TPM; administra liquidez para que la tasa interbancaria se ubique en torno a ese objetivo. No mantiene una paridad cambiaria permanente y admite intervenciones excepcionales.</p><p>Fuente primaria: <a href="https://www.bcentral.cl/es/web/banco-central/areas/politica-monetaria" target="_blank" rel="noopener">Banco Central de Chile, Política Monetaria</a>, consulta 1 de noviembre de 2026. La página documenta instituciones; no estima el modelo. Sus indicadores de coyuntura no se incorporan a esta presentación.</p>'),
 'empresa':('Exposición empresarial: cálculo y datos faltantes','<div class="equation small-eq">USD 10.000 − USD 6.000 = USD 4.000<br>4.000 × 900 = $3.600.000<br>4.000 × 990 = $3.960.000<br>Diferencia = $360.000</div><p>Caso ficticio, mismo período, sin cobertura ni cambio de cantidades. No es utilidad neta. Faltan costos, impuestos, financiamiento y fechas. Para decidir se requieren contratos, monedas, vencimientos, capacidad, demanda y coberturas.</p>')
}

# Rectas explícitas también en las ampliaciones asociadas a cada calibración.
for key,formula in {
 'cierre':'LM: Y = (M/P)/d₁ + (d₂/d₁)i',
 'parametros':'LM de la base: Y = 2.900 + 100i',
 'base':'IS: Y = 3.600 − 75i; LM: Y = 2.900 + 100i',
 'fiscalflota':'IS inicial = final: Y = 3.600 − 75i; IS parcial: Y = 3.700 − 75i; LM: Y = 2.900 + 100i',
 'monetariaflota':'IS final: Y = 3.800 − 75i; LM final: Y = 3.100 + 100i',
 'fiscalfijo':'IS final: Y = 3.700 − 75i; LM final: Y = 3.000 + 100i',
 'monetariafijo':'LM inicial = final: Y = 2.900 + 100i; intento: Y = 3.100 + 100i',
 'practica':'Caso A: LM, Y = 3.000 + 100i. Caso B: LM, Y = 2.950 + 100i'
}.items():
 title,body=deep[key];deep[key]=(title,body+'<div class="equation small-eq">'+formula+'</div>')

D=dict(title='IS–LM abierto · Mundell–Fleming',subtitle='El régimen cambiario cambia el mecanismo',date='2026-11-01',chapters=[dict(id=k,index=i,title=t) for i,(k,t) in enumerate(chapters)],slides=slides,glossary=[dict(key=k,label=l,definition=d) for k,l,d in glossary],deep={k:dict(title=t,html=h) for k,(t,h) in deep.items()},voice=dict(engine='Kokoro-82M ONNX v1.0',voice='em_alex',lang='es',speed=.90,atempo=1.04))
from study_steps import STEPS
for scene in slides:
 scene['steps'] = STEPS[scene['id']]
D['revision'] = '2-pasos-visibles'
D['visualRevision'] = '3-rectas-interceptos'
D['previousTimeline'] = json.loads((ROOT/'production/previous-timeline.json').read_text())
(ROOT/'production/storyboard.json').write_text(json.dumps(D,ensure_ascii=False,indent=2))
print(f'{len(slides)} diapositivas; {sum(len(b.get("text", "").split()) for s in slides for b in s["blocks"] if b["kind"]=="speech")} palabras; {sum(b.get("seconds",0) for s in slides for b in s["blocks"])} s de pausas de estudio.')
