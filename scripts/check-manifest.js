#!/usr/bin/env node
/**
 * check-manifest.js — comprueba que todo lo declarado en macro1/MANIFEST.json
 * exista en disco y que las notas de bloque estén realmente enlazadas desde la
 * interfaz. Registrar una nota en el MANIFEST no la hace visible: el índice y
 * la tarjeta de la Ruta por clases son los que la exponen.
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const macro1 = path.join(root, 'macro1');

let fails = 0;
const fail = m => { console.log('  ✘ ' + m); fails++; };
const ok = m => console.log('  ✔ ' + m);

const manifest = JSON.parse(fs.readFileSync(path.join(macro1, 'MANIFEST.json'), 'utf8'));

console.log('── Archivos declarados en el MANIFEST');
for (const n of manifest.notes || []) {
  fs.existsSync(path.join(macro1, n.file)) ? ok(n.file) : fail(`falta ${n.file} (nota "${n.id}")`);
}
for (const img of manifest.images || []) {
  if (!fs.existsSync(path.join(macro1, img))) fail(`falta imagen ${img}`);
}
for (const t of manifest.tests || []) {
  const enRaiz = fs.existsSync(path.join(root, t));
  const enMacro1 = fs.existsSync(path.join(macro1, t));
  (enRaiz || enMacro1) ? ok(`test ${t}`) : fail(`falta test ${t}`);
}

console.log('\n── Visibilidad de las notas de bloque');
const idx = path.join(macro1, 'notas', 'index.html');
const home = fs.readFileSync(path.join(macro1, 'index.html'), 'utf8');
fs.existsSync(idx) ? ok('notas/index.html existe') : fail('falta notas/index.html');
const idxHtml = fs.existsSync(idx) ? fs.readFileSync(idx, 'utf8') : '';

for (const n of (manifest.notes || []).filter(n => n.kind === 'bloque')) {
  const file = n.file.split('/').pop();
  idxHtml.includes(file) ? ok(`${n.id} enlazado desde el índice`) : fail(`${n.id} NO aparece en notas/index.html`);
  if (!home.includes('notas/' + file)) fail(`${n.id} NO aparece en la Ruta por clases (macro1/index.html)`);
}

console.log('\n' + '─'.repeat(60));
if (fails) { console.log(`✘ ${fails} problema(s) de integridad.`); process.exit(1); }
console.log('✔ MANIFEST íntegro y notas de bloque visibles.');
