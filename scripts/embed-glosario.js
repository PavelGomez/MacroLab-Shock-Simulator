#!/usr/bin/env node
/* ========== EMBED GLOSARIO ==========
 * Copia el glosario para alumnos (macro1/glosario-alumno.json) dentro de
 * macro1/index.html, entre los marcadores GLOSARIO:INICIO y GLOSARIO:FIN.
 * El sub-app es un solo archivo sin bundler: el glosario va embebido para que
 * funcione también abierto desde el disco (file://), donde fetch() no sirve.
 *
 * Fuente del JSON: Macro1_GPT/07_Produccion_notas/Glosario/construir_glosario.py
 * Uso:        node scripts/embed-glosario.js
 * Comprobar:  node scripts/embed-glosario.js --check   (sale con 1 si está desfasado)
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "macro1", "glosario-alumno.json");
const HTML_PATH = path.join(ROOT, "macro1", "index.html");
const START = "/* GLOSARIO:INICIO — generado por scripts/embed-glosario.js; no editar a mano */";
const END = "/* GLOSARIO:FIN */";
// Campos que usan las pistas de término. El resto del glosario queda en el JSON.
const CAMPOS = ["termino", "definicion", "ejemplo", "aviso"];

function bloque() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const terms = {};
  Object.keys(data.terminos).sort().forEach(id => {
    const t = data.terminos[id];
    terms[id] = {};
    CAMPOS.forEach(c => { if (t[c]) terms[id][c] = t[c]; });
  });
  return `${START}\nconst GLOSARIO_ALUMNO=${JSON.stringify({version: data.version, fecha: data.fecha, terminos: terms})};\n${END}`;
}

function main() {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  const a = html.indexOf(START), b = html.indexOf(END);
  if (a < 0 || b < a) { console.error("✘ No encontré los marcadores GLOSARIO en macro1/index.html"); process.exit(1); }
  const nuevo = html.slice(0, a) + bloque() + html.slice(b + END.length);
  if (process.argv.includes("--check")) {
    if (nuevo !== html) { console.error("✘ El glosario embebido está desfasado: corre node scripts/embed-glosario.js"); process.exit(1); }
    console.log("✔ Glosario embebido al día.");
    return;
  }
  fs.writeFileSync(HTML_PATH, nuevo);
  console.log("✔ Glosario embebido en macro1/index.html.");
}

if (require.main === module) main();
module.exports = { bloque, START, END };
