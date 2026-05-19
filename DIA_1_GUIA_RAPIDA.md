# DÍA 1: Guía Rápida de Navegación
## "¿Qué archivo leo ahora?" — Mapa de decisiones

---

## Si quieres...

### Entender QUÉ es institutionalLayer y POR QUÉ
→ **Lee:** DIA_1_RESUMEN_PARA_PAVEL.md (5 minutos)  
→ **Secciones clave:** "Qué se entregó" + "El schema: 8 campos"

### Aprender el protocolo completo sin detalles
→ **Lee:** DIA_1_PROTOCOLO_COMPLETO.md (10 minutos)  
→ **Secciones clave:** 1, 2, 3, 5 (omite detalles técnicos si tienes prisa)

### Ver cómo se rellena cada uno de los 8 campos
→ **Lee:** DIA_1_DOCUMENTACION_COMPLETA.md (15 minutos)  
→ **Sección:** "Guía de rellenado (8 campos)" + "Ejemplo anotado: Argentina 2001–2002"

### Dar instrucciones a Claude Code para ejecutar Día 1
→ **Lee:** DIA_1_INSTRUCCIONES_PARA_CLAUDE_CODE.md (5 minutos, intro)  
→ **Luego:** Pasa el archivo completo a Claude Code y deja que lo ejecute

### Verificar que Día 1 está correcto (post-validación)
→ **Lee:** DIA_1_VALIDACION_FINAL.md (será generado por Claude Code)  
→ **Verifica:** Todos los checkmarks están marcados ✓

### Consultar la definición formal del schema
→ **Lee:** DIA_1_institutionalLayer_schema.json  
→ **Nota:** JSON-Schema 2020-12. Los límites son en caracteres Unicode (v1.1).

### Copiar el template para rellenar una nueva crónica
→ **Lee:** DIA_1_TEMPLATE_institutionalLayer.js  
→ **Usa:** Como base para Día 2 (ampliación a 3 crónicas piloto)

### Resolver una pregunta sobre un campo específico
→ **Lee:** DIA_1_DOCUMENTACION_COMPLETA.md → "Preguntas frecuentes"  
→ **Ejemplo:** "¿Si excedo el límite de `institution`, puedo acortarlo?" → Respuesta en FAQ

### Citar literatura en una crónica nueva
→ **Consulta:** Los 2 ejemplos (argentina_convertibility.js y chile_2008_2009.js)  
→ **Patrón:** Cita debe estar en `fuentes` de la crónica; en `discriminatingEvidence` cita números/hechos, no abstractos

---

## Árbol de lectura recomendado

```
Primero (5 min):
  └─ DIA_1_RESUMEN_PARA_PAVEL.md
     (Qué es, qué se entregó, por qué importa)

Segundo (15 min):
  ├─ DIA_1_PROTOCOLO_COMPLETO.md (secciones 1–3)
  │  (Contexto, estructura, reglas)
  │
  └─ O BIEN: DIA_1_DOCUMENTACION_COMPLETA.md (resumen + 8 campos)
     (Guía más amable, menos formal)

Tercero (20 min, si vas a usar):
  ├─ DIA_1_EJEMPLO_1_argentina_convertibility.js
  │  (Observa estructura de ejemplo 1)
  │
  └─ DIA_1_EJEMPLO_2_chile_2008_2009.js
     (Observa estructura de ejemplo 2)
     Compara: ¿Qué es igual? ¿Qué es distinto?

Cuarto (si necesitas):
  └─ DIA_1_DOCUMENTACION_COMPLETA.md → FAQ
     (Resolver dudas específicas)
```

---

## Archivos por propósito

### Para entender el proyecto
- DIA_1_RESUMEN_PARA_PAVEL.md
- DIA_1_PROTOCOLO_COMPLETO.md (secciones 1–2)
- DIA_1_DOCUMENTACION_COMPLETA.md (intro + resumen ejecutivo)

### Para ejecutar el trabajo
- DIA_1_INSTRUCCIONES_PARA_CLAUDE_CODE.md
- DIA_1_PROTOCOLO_COMPLETO.md (secciones 3–5, detalles técnicos)

### Para validar
- DIA_1_VALIDACION_FINAL.md (checklist)
- DIA_1_ERRORES_DETECTADOS.md (diagnóstico)
- DIA_1_institutionalLayer_schema.json (validación automática — usar v1.1)

### Para reutilizar (Día 2+)
- DIA_1_TEMPLATE_institutionalLayer.js
- DIA_1_EJEMPLO_1_argentina_convertibility.js (como referencia)
- DIA_1_EJEMPLO_2_chile_2008_2009.js (como referencia)
- DIA_1_DOCUMENTACION_COMPLETA.md (consulta cuando dudes)

---

## Diagrama: De Día 1 a Día 2

```
DÍA 1 (2026-05-19)
└─ Schema DEFINIDO (8 campos, límites Unicode v1.1)
   └─ 2 ejemplos VALIDADOS (argentina, chile)
      └─ Instrucciones LISTAS para Claude Code
         └─ FIN DÍA 1

         ↓ OVERNIGHT

DÍA 2 (2026-05-20)
└─ Ampliación: 3 crónicas NUEVAS con institutionalLayer
   └─ Usando template de Día 1
      └─ Validación (sintaxis + límites Unicode)
         └─ Commit a rama feature/institutional-layer-pilot
            └─ FIN DÍA 2

            ↓

DÍA 3
└─ Modificar narrative-layer.js
   └─ Renderizar paneles en simulador
      └─ Test de ruta piloto 1
         └─ FIN DÍA 3
```

---

## Errores comunes (evítalos)

| Error | Síntoma | Solución |
|---|---|---|
| "¿Qué es un institutionalLayer?" | No sé qué estoy leyendo | Lee DIA_1_RESUMEN_PARA_PAVEL.md primero |
| "¿Cuántos caracteres máximo?" | Lleno un campo y excede | Consulta tabla en DIA_1_RESUMEN_PARA_PAVEL.md → "El schema: 8 campos" |
| "¿Mido con wc -c?" | El conteo dice OK pero schema rechaza | NO. Usar `python3 -c "print(len('texto'))"` — mide Unicode, no bytes |
| "¿Puedo cambiar los 8 campos?" | Quiero añadir un noveno campo | NO. Los 8 son obligatorios. Consúltale a Pável si hay desviación |
| "¿Dónde va institutionalLayer?" | No sé dónde insertar el nuevo objeto | Es propiedad hermana de `titulo`, `cronica`, `fuentes` dentro del objeto de la crónica |
| "Mi mechanism es demasiado largo" | Excede 500 caracteres | Identifica lo esencial (shock → variable → institución → credibilidad → expectativa). Elimina detalles secundarios |

---

## Checklist: "¿Estoy listo para Día 2?"

- [ ] Leí DIA_1_RESUMEN_PARA_PAVEL.md
- [ ] Entiendo qué son los 8 campos y por qué
- [ ] He visto al menos un ejemplo completo (argentina o chile)
- [ ] He pasado DIA_1_INSTRUCCIONES_PARA_CLAUDE_CODE.md a Claude Code
- [ ] Claude Code completó los 7 pasos y generó:
  - [ ] DIA_1_ERRORES_DETECTADOS.md
  - [ ] DIA_1_VALIDACION_FINAL.md
  - [ ] DIA_1_RESUMEN_EJECUTIVO.md
- [ ] Todos los archivos de Día 1 existen en el repo sin estar vacíos
- [ ] No hay ambigüedad sobre qué hace Día 2

Si todo está ✓, ¡Día 2 está listo!

---

## Números clave (schema v1.1)

| Métrica | Valor |
|---|---|
| Campos en schema | 8 (obligatorios) |
| institution | ≤200 chars Unicode |
| mechanism | ≤500 chars Unicode |
| feedbackLoop | ≤350 chars Unicode |
| policyFeasibility | ≤300 chars Unicode |
| incidence | ≤250 chars Unicode |
| discriminatingEvidence | ≤400 chars Unicode |
| antiOverclaim | ≤500 chars Unicode |
| affectedVariables | max 5 items |
| Ejemplos validados | 2 (argentina, chile) |
| Herramienta de conteo | `python3 -c "print(len(text))"` — NO `wc -c` |

---

## Links internos (referencias cruzadas)

| Si estás aquí | Y necesitas saber | Consulta |
|---|---|---|
| DIA_1_RESUMEN_PARA_PAVEL.md | Detalles sobre un campo | DIA_1_DOCUMENTACION_COMPLETA.md → "Guía de rellenado" |
| DIA_1_PROTOCOLO_COMPLETO.md | Ejemplo completo | DIA_1_DOCUMENTACION_COMPLETA.md → "Ejemplo anotado" |
| DIA_1_TEMPLATE_institutionalLayer.js | Relleno paso a paso | DIA_1_DOCUMENTACION_COMPLETA.md → "Guía de rellenado" |
| DIA_1_INSTRUCCIONES_PARA_CLAUDE_CODE.md | Contexto más amplio | DIA_1_PROTOCOLO_COMPLETO.md |
| DIA_1_DOCUMENTACION_COMPLETA.md | Schema formal | DIA_1_institutionalLayer_schema.json |

---

**Última actualización:** 2026-05-19 (schema v1.1)  
**Público:** Pável + Claude Code

---

## TL;DR

**Hoy (Día 1):** Definimos un schema de 8 campos (límites en Unicode v1.1) para hacer explícita la cadena causal (shock → institución → credibilidad → expectativas) de cada crónica. Creamos 2 ejemplos validados.

**Mañana (Día 2):** Ampliamos a 3 crónicas más usando el template. Validación. Commit a feature branch.

**Pasado (Día 3–5):** Integración en simulador + atlas + validación editorial + cierre.

**Archivo de referencia única:** DIA_1_PROTOCOLO_COMPLETO.md  
**Para aprender:** DIA_1_DOCUMENTACION_COMPLETA.md  
**Para resumir:** Este archivo (DIA_1_GUIA_RAPIDA.md)
