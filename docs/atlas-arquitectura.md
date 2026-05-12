# Arquitectura del Atlas shock × configuración institucional

Estado del documento: Fase 1 · estabilización arquitectónica  
Fecha de referencia: 2026-05-12  
Simulador: MacroLab Shock Simulator  
Archivo visible del Atlas: `atlas-lentes-institucionales.html`

---

## 1. Propósito del documento

Este documento registra la arquitectura operativa del Atlas shock × configuración institucional de MacroLab y fija reglas mínimas para evitar inconsistencias futuras entre la versión visible del Atlas y los registros de contenido del simulador.

El objetivo inmediato no es rediseñar el Atlas ni ampliar todas las celdas de la matriz, sino estabilizar la relación entre:

1. el archivo HTML visible del Atlas;
2. los registros de crónicas;
3. los futuros registros de rutas shock × configuración institucional;
4. la documentación de cobertura y auditoría de fuentes.

---

## 2. Estado actual del Atlas

El Atlas muestra una matriz operativa compuesta por:

- 4 configuraciones institucionales;
- 8 lentes o shocks;
- 32 combinaciones posibles.

Actualmente existen 12 rutas registradas en `MacroLabRouteRegistryES`, equivalentes a aproximadamente 38% de cobertura de la matriz.

La matriz visible también muestra crónicas o tarjetas históricas curadas. Estas tarjetas se apoyan en casos históricos, caveats y fuentes documentales seleccionadas.

---

## 3. Problema arquitectónico detectado

El archivo `atlas-lentes-institucionales.html` funciona actualmente como un archivo standalone. Dentro del HTML existe un bloque de datos embebidos del tipo:

```js
const DATA = /* @atlas_data_json_inline */ {
  ...
}
