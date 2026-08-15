#!/usr/bin/env node
/**
 * check-manifest.js — verificación de integridad y conformidad editorial.
 *
 * Comprueba tres cosas que test_paquete.js también exige, pero aquí corren en el
 * hook de pre-commit, es decir ANTES de que el fallo llegue al CI:
 *
 *   1. Que todo lo declarado en macro1/MANIFEST.json exista en disco.
 *   2. Que las notas de bloque estén realmente VISIBLES: registrar una nota en el
 *      MANIFEST no basta, porque el MANIFEST no se lee en runtime.
 *   3. Que cada nota cumpla las convenciones editoriales del paquete: banner de
 *      identidad, versión del manifiesto declarada en el pie, y advertencia
 *      pedagógica.
 *
 * Origen de (3): el 2026-08-15 se publicaron siete notas nuevas sin esas marcas.
 * test_paquete.js las rechazó con 41 fallos, pero recién en el CI. Duplicar la
 * regla aquí adelanta la detección al momento del commit.
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const macro1 = path.join(root, 'macro1');

let fails = 0;
const fail = m => { console.log('  ✘ ' + m); fails++; };
const ok = m => console.log('  ✔ ' + m);

const manifest = JSON.parse(fs.readFileSync(path.join(macro1, 'MANIFEST.json'), 'utf8'));
const version = manifest.lab_version;
const identity = manifest.identity_line || 'Macroeconomía · Profesor Pável Gómez · 2026';
const identityHtml = identity.replace(/·/g, '&middot;');
const ADVERTENCIA = 'Herramienta de aprendizaje, no de predicción';

/* ── 1 · archivos declarados ──────────────────────────────────────────────── */
console.log('── Archivos declarados en el MANIFEST');
for (const n of manifest.notes || []) {
  fs.existsSync(path.join(macro1, n.file)) ? ok(n.file) : fail(`falta ${n.file} (nota "${n.id}")`);
}
for (const img of manifest.images || []) {
  if (!fs.existsSync(path.join(macro1, img))) fail(`falta imagen ${img}`);
}
for (const t of manifest.tests || []) {
  const existe = fs.existsSync(path.join(root, t)) || fs.existsSync(path.join(macro1, t));
  existe ? ok(`test ${t}`) : fail(`falta test ${t}`);
}
// test_paquete.js exige exactamente cuatro suites de macro1
if ((manifest.tests || []).length !== 4) {
  fail(`el MANIFEST declara ${(manifest.tests || []).length} suites; test_paquete.js exige exactamente 4. ` +
       `Los tests de la raíz (p. ej. test_pautas_biblioteca.js) NO se declaran aquí.`);
}

/* ── 2 · visibilidad efectiva de las notas de bloque ──────────────────────── */
console.log('\n── Visibilidad de las notas de bloque');
const idxPath = path.join(macro1, 'notas', 'index.html');
fs.existsSync(idxPath) ? ok('notas/index.html existe') : fail('falta notas/index.html');
const idxHtml = fs.existsSync(idxPath) ? fs.readFileSync(idxPath, 'utf8') : '';
const homeHtml = fs.readFileSync(path.join(macro1, 'index.html'), 'utf8');

const bloques = (manifest.notes || []).filter(n => n.kind === 'bloque');
const publicados = bloques.filter(n => n.published !== false);
const retirados  = bloques.filter(n => n.published === false);

for (const n of publicados) {
  const file = n.file.split('/').pop();
  idxHtml.includes(file) ? ok(`${n.id} enlazado desde el índice`) : fail(`${n.id} NO aparece en notas/index.html`);
  if (!homeHtml.includes('notas/' + file)) fail(`${n.id} NO aparece en la Ruta por clases (macro1/index.html)`);
}

// Un bloque con published:false debe estar retirado de VERDAD de los dos sitios.
// Así, despublicar es una decisión verificable y no un olvido a medias.
for (const n of retirados) {
  const file = n.file.split('/').pop();
  const enIndice = idxHtml.includes(file);
  const enRuta   = homeHtml.includes('notas/' + file);
  if (enIndice) fail(`${n.id} está marcado published:false pero SIGUE enlazado en notas/index.html`);
  if (enRuta)   fail(`${n.id} está marcado published:false pero SIGUE enlazado en la Ruta por clases`);
  if (!enIndice && !enRuta) ok(`${n.id} retirado de la navegación (published:false), archivo conservado`);
}
if (retirados.length) {
  console.log(`  · ${retirados.length} bloque(s) deliberadamente fuera de la navegación; ${publicados.length} publicado(s).`);
}

/* ── 3 · conformidad editorial de cada nota ───────────────────────────────── */
console.log('\n── Conformidad editorial de las notas');
let conformes = 0;
const revisables = [
  ...(manifest.notes || []).filter(n => n.published !== false).map(n => n.file),
  'notas/index.html',
].filter((v, i, a) => a.indexOf(v) === i);

for (const rel of revisables) {
  const abs = path.join(macro1, rel);
  if (!fs.existsSync(abs)) continue;          // ya reportado arriba
  const html = fs.readFileSync(abs, 'utf8');
  const problemas = [];
  if (!html.includes(identity) && !html.includes(identityHtml)) {
    problemas.push(`falta la línea de identidad «${identity}»`);
  }
  if (version && !html.includes(version)) {
    problemas.push(`el pie no declara la versión ${version}`);
  }
  if (!html.includes(ADVERTENCIA)) {
    problemas.push(`falta la advertencia «${ADVERTENCIA}»`);
  }
  if (problemas.length) problemas.forEach(p => fail(`${rel}: ${p}`));
  else conformes++;
}
ok(`${conformes} de ${revisables.length} documentos cumplen las tres reglas editoriales`);

/* ── resumen ──────────────────────────────────────────────────────────────── */
console.log('\n' + '─'.repeat(60));
if (fails) {
  console.log(`✘ ${fails} problema(s).`);
  console.log('  Recuerda: registrar una nota en el MANIFEST no la hace visible,');
  console.log('  y una nota sin banner, versión y advertencia será rechazada por test_paquete.js.');
  process.exit(1);
}
console.log('✔ MANIFEST íntegro, notas visibles y editorialmente conformes.');
