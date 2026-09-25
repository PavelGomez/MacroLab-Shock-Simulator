# MacroLab-Macro1 v0.10.1 · Alineación de notas, ayudantías y labs (fase 6b)

Aplica el documento `Alineacion_notas_ayudantias_v1.md` (24-09-2026) con las decisiones del profesor del mismo día. No toca el MacroLab público ni los solvers.

## Laboratorios (`macro1/index.html`)

- **Notación del dinero.** La demanda de dinero es `Md`, la demanda **real** (`Md = d₁·Y − d₂·i`, en unidades de producto); el equilibrio es `M/P = Md`. Reemplaza `Mᵈ` y `Mᵈ/P` en los enunciados (ISLM-EX, LM-EX, Clase 4), en los rótulos de los gráficos de Dinero / tasa y Relación LM y en Desequilibrios («M/P − Md»). Ninguna cifra cambia.
- **Título de la Nota 8:** «Desequilibrios, efecto desplazamiento y efecto acelerador», en el enlace de la Ruta, en `notas/index.html`, en el MANIFEST (nota, ayudantía y pauta de la Clase 7) y en la crónica de la Clase 7.
- **Espacio antes de %** en los diagnósticos de las Clases 1 y 2 («2 %», «103 %», «25 %») y en el reporte de respuestas («equivale a 2,00 %»). Se dejan intactos la cita textual de la Ley de Presupuestos (línea 865), el CSS, las URL y `LOOP_META` de la Clase 3, que está sellado.
- **Guía de Dinero / tasa:** «Tampoco dibuja la LM» ahora remite también al Lab · Relación LM.
- **Glosario embebido** regenerado: aviso sobre Blanchard (su `Md` es nominal), `Ms/P` como sinónimo de la oferta real, nuevas ubicaciones en la Nota 5, la Nota 7 y las ayudantías.
- `lab_version` 0.10.0 → **0.10.1** en el MANIFEST, el pie de la extensión y todas las notas publicadas.

## Notas y materiales regenerados

- **Notas 5 a 8** (HTML del sitio y PDF): valor nominal, vencimiento y emisor en la Nota 5 A§3; operación de mercado abierto en N5 B§1 y N7 B§2; RPM del 8-09-2026 (Minuta N° 324) en N5 B§2; guías de laboratorio al día (Lab · Relación LM, Lab · Curva IS, Lab · IS-LM); `P_B`; *crowding out* sin guion; «pesa más» en la frase corregida de N8 §3; anclajes E7 y E9 en N8 §5, con fuente y fecha.
- **Ayudantías y pautas** de las Clases 4 a 7, la consolidación (72744) y el refuerzo (72745), en PDF: el control que se prepara (C5), pistas y comprobación por ejercicio, primer paso donde faltaba, laboratorios nuevos, fuentes corregidas, «por encima / por debajo», «pesa más» y «comprobación».

## Pruebas (cambios declarados)

- `test_lab_islm.js`: los nombres de dos aserciones dicen «M/P − Md» en vez de «M/P − Mᵈ». Mismas cifras.
- `test_loop_clase3.js`: espera «Reconociste que el 2 % pertenece a una proyección» (con espacio).
- `test_auditoria_transversal.js`: espera «(equivale a 2,00 %)» (con espacio).
- Ninguna cifra sellada cambió: `test_pautas_biblioteca.js` 35/35.
