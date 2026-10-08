#!/usr/bin/env node
"use strict";
const fs = require('fs'), path = require('path'), assert = require('assert');
const {JSDOM, VirtualConsole} = require('jsdom');
const errors = [], console = new VirtualConsole();
console.on('jsdomError', error => errors.push(error.message));
const dom = new JSDOM(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'), {
  runScripts: 'dangerously', url: 'http://localhost/macro1/#din', pretendToBeVisual: true,
  virtualConsole: console,
  beforeParse(w) {
    w.Element.prototype.scrollIntoView = () => {};
    w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {
      get: (_, key) => key === 'measureText' ? () => ({width: 10}) : () => {}, set: () => true
    });
  }
});
const w = dom.window, d = w.document, L = w.MacroLabLoop.lab;
let count = 0;
const el = id => d.getElementById(id);
const click = id => el(id).click();
const text = id => el(id).textContent;
const check = (condition, label) => { count++; assert.ok(condition, label); };
const near = (a, b, label) => check(Number.isFinite(a) && Math.abs(a-b) < 1e-7, label);
function set(id, value) { L.setValue(id, value); el(id).dispatchEvent(new w.Event('input')); }
function regime(value) { el('money-regime').value = value; el('money-regime').dispatchEvent(new w.Event('change')); }
const comparison = () => L.results('din').comparison;
const reset = () => click('moneyReset');

function view(value) { el('money-view').value = value; el('money-view').dispatchEvent(new w.Event('change')); }
function compareEqual() { reset(); view('compare'); click('money-copy'); }

// Contrato explícito: single calcula únicamente el inicial; compare calcula dos estados.
reset();
check(el('money-view').value === 'single', 'modo inicial de un equilibrio');
check(el('money-final-fields').hidden, 'controles finales ocultos en single');
near(L.moneyInterest(), 2, 'equilibrio inicial 2 %');
check(L.results('din').comparison === null, 'single no exporta comparación');
check(L.params('din').finalParams === null, 'single no exporta calibración final inactiva');
check(!el('money-comparison').innerHTML, 'single no presenta tabla de dos estados');
check(text('moneyChart').includes('E₀') && !text('moneyChart').includes('E₁'), 'single presenta solo E₀');
check(!text('money-bond-result').includes('P_B₁'), 'bonos solo presenta precio inicial en single');
for (const [y, ms] of [[2000, 0], ['', ''], [-1, -1], ['1e100', '1e100']]) {
  set('moneyY2', y); set('moneyMs2', ms);
  near(L.moneyInterest(), 2, 'valores finales no afectan single');
  check(!el('moneyFeedback').classList.contains('error'), 'final inválido ignorado en single');
  check(!text('moneyChart').includes('E₁'), 'no se representa final almacenado');
  check(L.results('din').comparison === null, 'no se exporta final almacenado');
}
reset(); set('moneyY', 2000); set('moneyY2', 1010);
near(L.moneyInterest(), 42, 'se muestra el inicial editado, no el final almacenado');
check(!text('moneyChart').includes('E₁'), 'inicial 2000 sin final adicional');

reset(); view('compare');
check(!el('money-final-fields').hidden, 'comparación habilita calibradores finales');
near(comparison().initial.params.Y, 1000, 'inicial explícito');
near(comparison().final.params.Y, 1010, 'final precargado de laboratorio');
near(comparison().initial.interest, 2, 'i inicial');
near(comparison().final.interest, 2.4, 'i final');
near(comparison().gap, 8, 'exceso de demanda a la tasa inicial');
check(text('moneyChart').includes('E₀') && text('moneyChart').includes('E₁'), 'dos equilibrios identificados');
check(text('money-adjustment').includes('a la derecha') && text('money-adjustment').includes('vender bonos'), 'desplazamiento y ajuste por bonos');
check(text('money-bond-result').includes('La tasa sube y el precio baja'), 'relación inversa');
check(el('money-comparison').querySelectorAll('tbody tr').length === 3, 'tabla de Y, M/P e i');
set('moneyY2', 1020); near(comparison().initial.params.Y, 1000, 'Y₂ no modifica Y₁');
set('moneyY', 1010); near(comparison().final.params.Y, 1020, 'Y₁ no modifica Y₂');
near(comparison().di, .4, 'comparación de dos calibraciones independientes');
const storedY = L.num('moneyY2'), storedMs = L.num('moneyMs2');
view('single'); near(L.moneyInterest(), 2.4, 'volver a single muestra tasa inicial');
check(!text('moneyChart').includes('E₁') && !el('money-comparison').innerHTML, 'single borra comparación anterior');
check(!text('money-bond-result').includes('P_B₁'), 'single borra precio final anterior');
view('compare'); near(L.num('moneyY2'), storedY, 'cambio de vista conserva Y₂');
near(L.num('moneyMs2'), storedMs, 'cambio de vista conserva M/P₂');
click('money-copy'); near(L.num('moneyY2'), L.num('moneyY'), 'copia inicial a final explícita');
near(comparison().di, 0, 'copia iguala equilibrios');
check(text('moneyChart').includes('E₀ = E₁'), 'coincidencia declarada');

for (const [field, value, interest, pressure] of [
  ['moneyY2', 1010, 2.4, 'vender bonos'],
  ['moneyY2', 990, 1.6, 'comprar bonos'],
  ['moneyMs2', 800, 0, 'comprar bonos'],
  ['moneyMs2', 720, 4, 'vender bonos']
]) {
  compareEqual(); set(field, value);
  near(comparison().final.interest, interest, 'equilibrio final '+field+' '+value);
  near(comparison().initial.interest, 2, 'conserva equilibrio inicial');
  check(text('money-adjustment').includes(pressure), 'dirección del mecanismo '+field);
  check(text('moneyChart').includes('E₀') && text('moneyChart').includes('E₁'), 'equilibrios para '+field);
}
compareEqual(); set('moneyY2', 1010); set('moneyMs2', 768);
near(comparison().di, 0, 'cambios de Y y oferta pueden compensarse');
check(text('money-adjustment').includes('se compensan'), 'no inventa cambio de tasa');
set('moneyD2', 25);
near(comparison().initial.params.d2, 25, 'coeficiente compartido inicial');
near(comparison().final.params.d2, 25, 'coeficiente compartido final');

compareEqual(); regime('target'); set('moneyY2', 1010);
near(comparison().initial.quantity, 760, 'cantidad inicial endógena');
near(comparison().final.quantity, 768, 'cantidad final endógena');
near(comparison().di, 0, 'meta común constante');
check(el('moneyMs').disabled && el('moneyMs2').disabled, 'ambas ofertas son resultados');
check(text('money-adjustment').includes('proveer 8'), 'provisión requerida');
check(text('money-bond-result').includes('precio se mantienen'), 'precio invariante con la meta');
set('moneyY2', 990); near(comparison().final.quantity, 752, 'retiro con menor Y');
check(text('money-adjustment').includes('retirar 8'), 'retiro requerido');
set('money-target', 3);
near(comparison().initial.interest, 3, 'meta editada para inicial');
near(comparison().final.interest, 3, 'misma meta editada para final');
regime('quantity'); near(L.num('moneyMs'), 740, 'transición conserva oferta inicial');
near(L.num('moneyMs2'), 732, 'transición conserva oferta final');
check(!el('moneyMs').disabled && !el('moneyMs2').disabled, 'ambas ofertas vuelven a ser entradas');

compareEqual(); click('omoBuy');
near(L.num('moneyMs'), 760, 'intervención no modifica inicial');
near(L.num('moneyMs2'), 800, 'compra modifica final');
near(comparison().di, -2, 'compra reduce tasa final');
click('omoSell'); near(L.num('moneyMs2'), 760, 'venta modifica final');
set('money-step', 761); click('omoSell');
near(L.num('moneyMs2'), 760, 'venta excesiva no trunca final');
check(text('moneyFeedback').includes('máximo es 760'), 'límite comunicado');
set('moneyY', ''); click('omoBuy'); near(L.num('moneyMs2'), 760, 'inicial inválido impide intervención');
reset(); click('omoBuy'); near(L.num('moneyMs'), 800, 'single modifica solo inicial');
near(L.num('moneyMs2'), 760, 'single no altera final almacenado');

reset(); view('compare');
const before = JSON.stringify(comparison());
click('money-zoom'); check(JSON.stringify(comparison()) === before, 'zoom conserva ambos estados');
click('money-full'); check(JSON.stringify(comparison()) === before, 'vista completa conserva comparación');
const monetary = L.moneyInterest(); set('money-bond-vf', 250);
near(L.moneyInterest(), monetary, 'VF no altera mercado de dinero');
check(text('money-bond-result').includes('VF = 250'), 'VF configurable');
check(text('money-bond-alt').includes('no son cantidades calculadas'), 'Q_B no se presenta como solver');
set('money-bond-vf', ''); check(!el('moneyBondChart').innerHTML, 'VF inválido limpia esquema');
near(L.moneyInterest(), monetary, 'VF inválido no invalida mercado monetario');
compareEqual(); set('moneyMs2', 3000);
near(L.moneyInterest(), -110, 'tasa monetaria menor que −100 preservada');
check(!el('moneyBondChart').innerHTML, 'no produce precio negativo ficticio');
check(text('money-bond-result').includes('mayores que −100'), 'límite del bono explicado');
for (const field of ['moneyY', 'moneyY2', 'moneyMs', 'moneyMs2', 'moneyD2']) {
  compareEqual(); set(field, field === 'moneyD2' ? 0 : '');
  check(!el('money-comparison').innerHTML && !el('moneyBondChart').innerHTML, 'inválido limpia ambos resultados '+field);
  check(L.results('din').valid === false, 'exportación inválida '+field);
}
compareEqual(); set('moneyY2', ''); view('single');
near(L.moneyInterest(), 2, 'single recupera inicial válido aunque final siga vacío');
check(el('moneyY2').value === '', 'single no corrige ni sobrescribe final vacío');
view('compare'); check(el('moneyFeedback').classList.contains('error'), 'compare vuelve a validar final vacío');
compareEqual(); regime('target'); set('moneyY2', 0);
check(!el('money-comparison').innerHTML, 'final con objetivo inviable no conserva tabla');
view('single'); near(L.moneyInterest(), 2, 'objetivo final inviable no afecta inicial válido');

reset();
const host = d.querySelector('.activity[data-window="din"]'), select = host.querySelector('select');
select.value = '0'; select.dispatchEvent(new w.Event('change')); host.querySelector('.load-activity').click();
check(moneyModeValue() === 'single', 'carga actividad abre un equilibrio');
near(L.num('moneyY'), 1000, 'carga inicial del preset');
near(L.num('moneyY2'), 1000, 'prepara final del mismo preset');
view('compare'); set('moneyY2', 1010); host.querySelector('.reset-activity').click();
near(L.num('moneyY2'), 1000, 'volver a actividad restablece sus valores');
check(moneyModeValue() === 'single', 'volver a actividad restaura vista de un equilibrio');
check(el('din').lastElementChild.matches('details.practice'), 'actividades siguen al final');
function moneyModeValue() { return el('money-view').value; }

for (const width of [320, 390, 620]) {
  el('moneyChart').getBoundingClientRect = () => ({width});
  for (const [field, value] of [['moneyY2', 1010], ['moneyY2', 2000], ['moneyMs2', 800], ['moneyMs2', 900]]) {
    compareEqual(); set(field, value); click('money-zoom');
    const layout = w.eval('plotScales.moneyChart'), c = comparison();
    check([c.initial, c.final].every(r => r.quantity >= layout.x.min && r.quantity <= layout.x.max && r.interest >= layout.y.min && r.interest <= layout.y.max), 'zoom incluye ambos equilibrios '+width+' '+field);
    check(text('moneyChart').includes('E₀') && text('moneyChart').includes('E₁'), 'etiquetas de ambos equilibrios '+width+' '+field);
    const boxes = L.plotLayouts.moneyChart.filter(b => !b.line); let overlap = false;
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++) {
      const a=boxes[i], b=boxes[j];
      if(a.x<b.x+b.w-.5 && b.x<a.x+a.w-.5 && a.y<b.y+b.h-.5 && b.y<a.y+a.h-.5)overlap=true;
    }
    check(!overlap, 'rótulos sin solapamiento '+width+' '+field);
  }
}
reset(); check(moneyModeValue() === 'single', 'reset final vuelve a single');
near(L.num('moneyY2'), 1010, 'reset final restaura valor final de laboratorio');
check(!errors.length, 'sin errores de ejecución');
process.stdout.write(`test_dinero_comparacion.js — ${count} aserciones · RESULTADO: OK\n`);
dom.window.close();
