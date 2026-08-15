#!/usr/bin/env node
"use strict";
/*
 * test_paquete.js — prueba de integridad del paquete publicable MacroLab Macro 1.
 *
 * Uso:  node test_paquete.js   (desde publicar/macro1/)
 *
 * Sin dependencias externas: sólo fs y path.
 * Fuente de verdad de la versión publicada: MANIFEST.json.
 *
 * v0.5.1 · la versión deja de vivir en el nombre del archivo. El laboratorio se
 * publica como index.html en una URL estable y la versión se declara en el banner,
 * en el pie y en el manifiesto. Esta prueba valida esa estructura.
 *
 * Sale con código 1 y enumera los fallos si detecta:
 *   1. un href a notas/*.html desde el laboratorio que no exista en disco;
 *   2. una <img src="…"> en una nota cuyo archivo no exista;
 *   3. un enlace de retorno de una nota que no apunte al lab_file del manifiesto;
 *   4. un ancla interna href="#x" sin id="x" en la misma nota;
 *   5. una nota sin <h1>, con más de un <h1>, o con salto de nivel de encabezado;
 *   6. una <img> sin atributo alt;
 *   7. una referencia superviviente a un nombre de archivo versionado;
 *   8. incoherencia de versión o de identidad entre banner, pie y manifiesto;
 *   9. una suite declarada en el manifiesto que no exista en disco;
 *  10. cualquier rastro de identidad personal, backend o almacenamiento local.
 * Los <mark class="revisar"> no hacen fallar la prueba: se listan como advertencias.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const NOTES_DIR = path.join(ROOT, "notas");

const failures = [];
const warnings = [];
let checks = 0;

const fail = (code, msg) => failures.push(`[${code}] ${msg}`);
const warn = (code, msg) => warnings.push(`[${code}] ${msg}`);
const check = () => { checks += 1; };
const exists = p => { try { return fs.statSync(p).isFile(); } catch (_) { return false; } };
const rel = p => path.relative(ROOT, p) || path.basename(p);

/* ---------- utilidades de parseo (regex sobre HTML estático, sin dependencias) ---------- */

// Quita comentarios HTML para no auditar markup desactivado.
const stripComments = html => html.replace(/<!--[\s\S]*?-->/g, "");

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  if (!m) return null;
  return m[2] !== undefined ? m[2] : m[3];
}

function allTags(html, tagName) {
  const re = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return html.match(re) || [];
}

function decodeRef(value) {
  return String(value).replace(/&amp;/g, "&");
}
function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ---------- manifiesto ---------- */

const manifestPath = path.join(ROOT, "MANIFEST.json");
let manifest = null;
check();
if (!exists(manifestPath)) {
  fail("MANIFEST", "no existe MANIFEST.json; sin él no puede verificarse la versión publicada.");
} else {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    fail("MANIFEST", `MANIFEST.json no es JSON válido: ${err.message}`);
  }
}

const labFile = manifest && manifest.lab_file;
check();
if (manifest && !labFile) {
  fail("MANIFEST", "MANIFEST.json no declara lab_file.");
} else if (labFile && !exists(path.join(ROOT, labFile))) {
  fail("MANIFEST", `el laboratorio declarado en el manifiesto no existe en disco: ${labFile}`);
}

/* ---------- notas presentes ---------- */

let noteFiles = [];
check();
if (!fs.existsSync(NOTES_DIR)) {
  fail("PAQUETE", "no existe la carpeta notas/.");
} else {
  noteFiles = fs.readdirSync(NOTES_DIR).filter(f => /\.html$/i.test(f)).sort();
  if (noteFiles.length === 0) fail("PAQUETE", "la carpeta notas/ no contiene archivos .html.");
}

// Coherencia entre manifiesto y disco (no está en la lista 1–7, pero es barato y evita
// que el manifiesto se desincronice en silencio).
if (manifest && Array.isArray(manifest.notes)) {
  for (const note of manifest.notes) {
    check();
    if (!exists(path.join(ROOT, note.file))) {
      fail("MANIFEST", `la nota ${note.id} declarada en el manifiesto no existe: ${note.file}`);
    }
  }
}

/* ---------- 1. enlaces del laboratorio hacia las notas ---------- */

if (labFile && exists(path.join(ROOT, labFile))) {
  const lab = stripComments(fs.readFileSync(path.join(ROOT, labFile), "utf8"));
  const baseMatch = lab.match(/const\s+NOTES_BASE\s*=\s*"([^"]*)"/);
  const notesBase = baseMatch ? baseMatch[1] : "notas/";

  const targets = new Set();

  // (a) entradas de datos: href:"nota-01-….html" resueltas con NOTES_BASE,
  //     igual que hace el renderizador del laboratorio.
  const dataRe = /href\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = dataRe.exec(lab)) !== null) {
    const href = m[1];
    if (/^(?:[a-z]+:|\/|\.\.?\/|#)/i.test(href)) continue;
    targets.add(notesBase + href);
  }

  // (b) rutas literales que hayan quedado en el markup o en el script.
  const literalRe = /["'(]((?:\.\/)?notas\/[^"'()\s]+\.html)/g;
  while ((m = literalRe.exec(lab)) !== null) targets.add(m[1].replace(/^\.\//, ""));

  for (const target of [...targets].sort()) {
    check();
    const [fileTarget,fragment] = target.split("#",2);
    const abs = path.join(ROOT, decodeURIComponent(fileTarget));
    if (!exists(abs)) {
      fail("1", `${labFile} enlaza a «${fileTarget}», que no existe en disco.`);
      continue;
    }
    if(fragment){
      check();
      const noteHtml=stripComments(fs.readFileSync(abs,"utf8"));
      const decodedFragment=decodeURIComponent(fragment);
      if(!new RegExp(`\\bid\\s*=\\s*["']${escapeRegExp(decodedFragment)}["']`,"i").test(noteHtml)){
        fail("1", `${labFile} enlaza al ancla «#${decodedFragment}» de «${fileTarget}», pero esa sección no existe.`);
      }
    }
  }
}

/* ---------- 2 a 7: recorrido de cada nota ---------- */

for (const file of noteFiles) {
  const abs = path.join(NOTES_DIR, file);
  const raw = fs.readFileSync(abs, "utf8");
  const html = stripComments(raw);
  const where = rel(abs);
  const imgTags = allTags(html, "img");

  /* 2 y 6. imágenes: existencia del archivo y presencia de alt */
  for (const tag of imgTags) {
    const src = attr(tag, "src");

    check(); // 6. alt
    if (attr(tag, "alt") === null) {
      fail("6", `${where}: <img src="${src || "?"}"> sin atributo alt.`);
    }

    check(); // 2. archivo existente
    if (!src) {
      fail("2", `${where}: <img> sin atributo src.`);
    } else if (!/^(?:[a-z]+:|\/\/|data:)/i.test(src)) {
      const imgAbs = path.join(NOTES_DIR, decodeURIComponent(decodeRef(src)));
      if (!exists(imgAbs)) {
        fail("2", `${where}: la imagen «${src}» no existe (esperada en ${rel(imgAbs)}).`);
      }
    }
  }

  /* 3. enlace de retorno al laboratorio · ahora es ../index.html#route */
  const backRefs = [];
  const backRe = /href\s*=\s*"(\.\.\/[^"]*\.html[^"]*)"/gi;
  let bm;
  while ((bm = backRe.exec(html)) !== null) backRefs.push(decodeRef(bm[1]));

  check();
  if (backRefs.length === 0) {
    fail("3", `${where}: no tiene enlace de retorno al laboratorio.`);
  }
  for (const href of backRefs) {
    const clean = href.split("#")[0].split("?")[0];
    const targetAbs = path.resolve(NOTES_DIR, decodeURIComponent(clean));

    check();
    if (!exists(targetAbs)) {
      fail("3", `${where}: el enlace de retorno «${href}» apunta a un archivo inexistente.`);
      continue;
    }
    check();
    if (labFile && path.basename(clean) !== path.basename(labFile)) {
      fail("3", `${where}: el enlace de retorno apunta a «${path.basename(clean)}» y el manifiesto declara «${labFile}».`);
    }
  }

  /* 4. anclas internas */
  const ids = new Set();
  const idRe = /\bid\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let im;
  while ((im = idRe.exec(html)) !== null) ids.add(im[2] !== undefined ? im[2] : im[3]);

  const anchors = new Set();
  const aRe = /href\s*=\s*"#([^"]+)"/gi;
  let am;
  while ((am = aRe.exec(html)) !== null) anchors.add(decodeRef(am[1]));

  for (const anchor of [...anchors].sort()) {
    check();
    const decoded = (() => { try { return decodeURIComponent(anchor); } catch (_) { return anchor; } })();
    if (!ids.has(anchor) && !ids.has(decoded)) {
      fail("4", `${where}: el ancla interna «#${anchor}» no tiene ningún id correspondiente.`);
    }
  }

  /* 5. estructura de encabezados */
  const headings = [];
  const hRe = /<h([1-6])\b[^>]*>/gi;
  let hm;
  while ((hm = hRe.exec(html)) !== null) headings.push(Number(hm[1]));

  const h1count = headings.filter(l => l === 1).length;
  check();
  if (h1count === 0) fail("5", `${where}: no tiene <h1>.`);
  check();
  if (h1count > 1) fail("5", `${where}: tiene ${h1count} elementos <h1>; debe haber exactamente uno.`);

  let previous = null;
  headings.forEach((level, index) => {
    check();
    if (previous !== null && level > previous + 1) {
      fail("5", `${where}: salto de nivel de encabezado h${previous} → h${level} (encabezado n.º ${index + 1}).`);
    }
    previous = level;
  });

  /* 7. marcas de revisión abiertas (advertencia, no fallo) */
  const markRe = /<mark\s+class\s*=\s*"revisar"[^>]*>([\s\S]*?)<\/mark>/gi;
  let mm;
  while ((mm = markRe.exec(html)) !== null) {
    const text = mm[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    warn("7", `${where}: <mark class="revisar"> pendiente — «${text}»`);
  }
}

/* ---------- 7 a 10 · estructura publicable v0.5.1 ---------- */

const labPath = labFile ? path.join(ROOT, labFile) : null;
const labSource = labPath && exists(labPath) ? fs.readFileSync(labPath, "utf8") : "";
const noteSources = noteFiles.map(f => ({ file: f, html: fs.readFileSync(path.join(NOTES_DIR, f), "utf8") }));

/* 7. ninguna referencia superviviente a un nombre de archivo versionado */
check();
if (labFile !== "index.html") {
  fail("7", `el manifiesto declara lab_file="${labFile}"; la URL estable exige "index.html".`);
}
const legacyRe = /MacroLab_Macro1_ventanas_v[\d.]+[^"'\s]*\.html/g;
check();
{
  const hits = labSource.match(legacyRe) || [];
  if (hits.length) fail("7", `${labFile} conserva ${hits.length} referencia(s) al nombre versionado: ${[...new Set(hits)].join(", ")}.`);
}
for (const { file, html } of noteSources) {
  check();
  const hits = html.match(legacyRe) || [];
  if (hits.length) fail("7", `notas/${file} conserva una referencia al nombre versionado: ${[...new Set(hits)].join(", ")}.`);
}

/* 8. versión e identidad coherentes entre banner, pie y manifiesto */
const version = manifest && manifest.lab_version;
const identity = (manifest && manifest.identity_line) || "Macroeconomía · Profesor Pável Gómez · 2026";
const identityHtml = identity.replace(/·/g, "&middot;");
const hasIdentity = html => html.includes(identity) || html.includes(identityHtml);
/* El banner del laboratorio nombra el curso completo («Macroeconomía I»); las notas
   conservan la línea genérica del manifiesto. Ambas expectativas siguen siendo literales. */
const labIdentity = (manifest && manifest.lab_identity_line) || "Macroeconomía I · Profesor Pável Gómez · 2026";
const labIdentityHtml = labIdentity.replace(/·/g, "&middot;");

check();
if (!labSource.includes(labIdentity) && !labSource.includes(labIdentityHtml)) {
  fail("8", `${labFile}: falta la línea de identificación «${labIdentity}» en el banner.`);
}
check();
if (version && !labSource.includes(version)) {
  fail("8", `${labFile}: la versión ${version} del manifiesto no aparece declarada en el documento.`);
}
check();
{
  const contentMatch=labSource.match(/const\s+LEARNING_CONTENT_VERSION\s*=\s*"([^"]+)"/);
  const exportedContent=contentMatch&&contentMatch[1];
  if(manifest&&exportedContent!==manifest.content_version){
    fail("8", `${labFile}: LEARNING_CONTENT_VERSION (${exportedContent||"ausente"}) no coincide con content_version del manifiesto (${manifest.content_version}).`);
  }
}
check();
if (!/versión 0\.5\.1/.test(labSource) && !new RegExp(`versión ${String(version).replace(/\./g, "\\.")}`).test(labSource)) {
  fail("8", `${labFile}: el pie no declara la versión del paquete.`);
}
check();
if (!/Simulación pedagógica, no pronóstico\. Herramienta de aprendizaje, no de predicción\./.test(labSource)) {
  fail("8", `${labFile}: el pie no lleva la advertencia completa exigida.`);
}
for (const tag of ["og:title", "og:description", "og:image", "og:url", "twitter:card", "twitter:title", "twitter:image"]) {
  check();
  if (!labSource.includes(tag)) fail("8", `${labFile}: falta la etiqueta ${tag}.`);
}
for (const { file, html } of noteSources) {
  check();
  if (!hasIdentity(html)) fail("8", `notas/${file}: el banner no lleva la línea de identificación «${identity}».`);
  check();
  if (version && !html.includes(version)) fail("8", `notas/${file}: el pie no declara la versión ${version}.`);
  check();
  if (!/Herramienta de aprendizaje, no de predicción/.test(html)) {
    fail("8", `notas/${file}: el pie no lleva la advertencia pedagógica.`);
  }
}

/* 8b. tokens de identidad visual alineados con el sitio publicado */
for (const token of ["#2d6ea3", "#0f2740", "#091a2d", "#f3f6fa", "#d8e1ea", "#1c2a35"]) {
  check();
  if (!labSource.includes(token)) fail("8", `${labFile}: falta el token de color ${token} del sitio publicado.`);
}
check();
if (!/font-family:"Inter",system-ui,-apple-system,sans-serif/.test(labSource)) {
  fail("8", `${labFile}: la cascada tipográfica no coincide con la del sitio publicado.`);
}
check();
if (!/href="\.\.\/"/.test(labSource)) {
  fail("8", `${labFile}: falta el enlace de vuelta al laboratorio principal (../).`);
}

/* 9. suites declaradas en el manifiesto y presentes en disco */
if (manifest && Array.isArray(manifest.tests)) {
  for (const suite of manifest.tests) {
    check();
    if (!exists(path.join(ROOT, suite))) fail("9", `la suite declarada en el manifiesto no existe en disco: ${suite}.`);
  }
  check();
  if (manifest.tests.length !== 4) fail("9", `el manifiesto declara ${manifest.tests.length} suites; deben ser cuatro.`);
}

/* 10. privacidad: sin identidad personal, sin backend, sin almacenamiento local */
check();
if (/\b(localStorage|sessionStorage|indexedDB)\s*[.[]/.test(labSource)) {
  fail("10", `${labFile}: usa almacenamiento del navegador.`);
}
check();
if (/[^.\w]fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|new\s+WebSocket/.test(labSource)) {
  fail("10", `${labFile}: contiene una llamada de red o de telemetría.`);
}
for (const key of ["student_id", "alumno_id", "\"rut\"", "matricula", "user_id", "learner_name"]) {
  check();
  if (labSource.includes(key)) fail("10", `${labFile}: aparece un campo de identidad personal (${key}).`);
}
check();
if (!/type="file"/.test(labSource)) {
  fail("10", `${labFile}: no ofrece carga de ficha; la memoria longitudinal quedaría inaccesible.`);
}

/* 11. la rutina conserva seis pasos visibles y seis pestañas */
check();
{
  const steps = (labSource.match(/const\s+CLASS_STEP_LABELS\s*=\s*\[([^\]]*)\]/) || [, ""])[1];
  const count = steps ? steps.split(",").length : 0;
  if (count !== 6) fail("11", `${labFile}: la rutina declara ${count} pasos visibles; deben ser seis.`);
}
check();
{
  const tabs = (labSource.match(/role="tab"/g) || []).length;
  if (tabs < 6) fail("11", `${labFile}: se encontraron ${tabs} pestañas con role="tab"; deben ser al menos seis.`);
}

/* ---------- resumen ---------- */

const line = "─".repeat(72);
console.log(line);
console.log("Prueba de integridad del paquete publicable MacroLab Macro 1");
if (manifest) {
  console.log(`Manifiesto: ${manifest.package} · laboratorio ${manifest.lab_version} · contenido ${manifest.content_version}`);
}
console.log(`Notas revisadas: ${noteFiles.length}`);
console.log(line);

if (warnings.length) {
  console.log(`\nAdvertencias (${warnings.length}) — no hacen fallar la prueba, pero no publiques sin verlas:`);
  warnings.forEach(w => console.log("  ! " + w));
}

if (failures.length) {
  console.log(`\nFallos (${failures.length}):`);
  failures.forEach(f => console.log("  x " + f));
}

console.log(`\nComprobaciones: ${checks} · fallos: ${failures.length} · advertencias: ${warnings.length}`);
console.log(failures.length ? "RESULTADO: FALLA" : "RESULTADO: OK");
process.exit(failures.length ? 1 : 0);
