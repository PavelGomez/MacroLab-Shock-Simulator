/* ========== ROUTES REGISTRY ES-ES ========== */
/*
  Registro externo de rutas shock × configuración institucional del Atlas MacroLab.

  Objetivo:
  - Separar rutas de matriz de las crónicas históricas.
  - Mantener content/cronicas-registry.es-ES.js como fuente canónica de crónicas, caveats y fuentes.
  - Mantener este archivo como fuente futura de rutas operativas del Atlas.

  Estado:
  - Fase 2 · separación inicial de rutas.
  - El Atlas HTML todavía no consume este archivo.
  - atlas-lentes-institucionales.html conserva temporalmente su objeto MACROLAB embebido como fallback.
*/

window.MacroLabRouteRegistryES = Object.freeze({
  version: "0.1.0",
  updatedAt: "2026-05-12",

  configs: Object.freeze({
    CHL: "Chile 2026 · Credibilidad macro",
    FRG: "Anclaje frágil",
    RIG: "Rigidez cambiaria",
    CRD: "Alta credibilidad con buffer"
  }),

  lentes: Object.freeze({
    petroleo: {
      label: "Alza del petróleo / energía",
      tab: "oada"
    },
    cobre: {
      label: "Caída del cobre",
      tab: "islmbp"
    },
    pandemia: {
      label: "Pandemia",
      tab: "oada"
    },
    fiscalExpand: {
      label: "Expansión fiscal",
      tab: "islm"
    },
    fiscalContract: {
      label: "Contracción fiscal",
      tab: "islm"
    },
    monetaryContract: {
      label: "Contracción monetaria",
      tab: "islm"
    },
    globalRecession: {
      label: "Recesión global",
      tab: "islmbp"
    },
    guerra: {
      label: "Guerra / shock mixto",
      tab: "oada"
    }
  }),

  rutas_registradas: Object.freeze([
    {
      lente: "petroleo",
      config: "CHL",
      cronicaKey: "chile_2021_2024"
    },
    {
      lente: "petroleo",
      config: "FRG",
      cronicaKey: "turkey_2018_2023"
    },
    {
      lente: "cobre",
      config: "CHL",
      cronicaKey: "chile_2008_2009"
    },
    {
      lente: "fiscalContract",
      config: "CHL",
      cronicaKey: "chile_2008_2009"
    },
    {
      lente: "pandemia",
      config: "CHL",
      cronicaKey: "chile_2021_2024"
    },
    {
      lente: "pandemia",
      config: "CRD",
      cronicaKey: "noruega_2020"
    },
    {
      lente: "pandemia",
      config: "FRG",
      cronicaKey: "argentina_2020"
    },
    {
      lente: "fiscalContract",
      config: "CRD",
      cronicaKey: "suecia_1994_1998"
    },
    {
      lente: "fiscalContract",
      config: "FRG",
      cronicaKey: "grecia_2010_2015"
    },
    {
      lente: "globalRecession",
      config: "RIG",
      cronicaKey: "argentina_convertibility"
    },
    {
      lente: "fiscalContract",
      config: "RIG",
      cronicaKey: "argentina_convertibility"
    },
    {
      lente: "petroleo",
      config: "RIG",
      cronicaKey: "argentina_convertibility"
    }
  ]),

  gaps_prioritarios: Object.freeze([])
});
