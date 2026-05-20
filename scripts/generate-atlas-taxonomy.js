#!/usr/bin/env node
/* ========== GENERATE ATLAS TAXONOMY ========== */
/**
 * Genera data/atlas-taxonomy.json desde institutionalLayer
 * de content/cronicas-registry.es-ES.js.
 *
 * Uso: node scripts/generate-atlas-taxonomy.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

/* ---- Cargar registro de crónicas ---- */
const cronicasPath = path.join(__dirname, '../content/cronicas-registry.es-ES.js');
const rawJs = fs.readFileSync(cronicasPath, 'utf-8');

// Ejecuta el JS en un contexto mínimo que expone window.MacroLabCronicasRegistryES
const fakeWindow = {};
const wrapped = '(function(window){ ' + rawJs + ' })(fakeWindow);';
eval(wrapped); // eslint-disable-line no-eval
const CRONICAS = fakeWindow.MacroLabCronicasRegistryES;

if (!CRONICAS) {
  console.error('ERROR: window.MacroLabCronicasRegistryES no encontrado en el archivo.');
  process.exit(1);
}

/* ---- Heurísticas de taxonomía ---- */

function extractShockType(mechanism, institution) {
  var t = (mechanism + ' ' + institution).toLowerCase();
  if (t.includes('presión política') || t.includes('destitución') || t.includes('remoción')) return 'shock_politico_sobre_bc';
  if (t.includes('pandemia') || t.includes('covid'))    return 'shock_pandemia_o_dual';
  if (t.includes('convertibilidad') || t.includes('paridad fija') || t.includes('corridas')) return 'fx_capital_flight';
  if (t.includes('petróleo') || t.includes('cobre') || t.includes('términos de intercambio')) return 'shock_commodity';
  if (t.includes('crisis financiera global') || t.includes('recesión')) return 'crisis_financiera_global';
  if (t.includes('déficit') || t.includes('troika') || t.includes('multiplicador')) return 'shock_fiscal_externo';
  return 'shock_externo_mixto';
}

function extractExchangeRegime(institution, mechanism) {
  var t = (institution + ' ' + (mechanism || '')).toLowerCase();
  if (t.includes('eurozona') || t.includes('euro'))           return 'union_monetaria';
  if (t.includes('paridad fija') || t.includes('convertibilidad')) return 'ancla_cambiaria_rigida';
  if (t.includes('flotación administrada'))                    return 'flotacion_administrada';
  // Managed float: currency depreciates significantly but no hard peg (e.g. TRY)
  if ((t.includes('try') || t.includes('lira')) && t.includes('deprecia')) return 'flotacion_administrada';
  if (t.includes('flotante') || t.includes('flexible'))       return 'flotacion_cambiaria';
  if (t.includes('banda'))                                     return 'banda_cambiaria';
  return 'regimen_mixto';
}

function extractBcAutonomy(policyFeasibility, institution) {
  var t = (policyFeasibility + ' ' + institution).toLowerCase();
  if (t.includes('sin política monetaria') || t.includes('sin moneda propia')) return 'bc_ausente_union_monetaria';
  if (t.includes('erosionada') || t.includes('remoción') || t.includes('destitución')) return 'bc_autonomia_erosionada';
  if (t.includes('sin discreción') || t.includes('rigidiza')) return 'bc_sin_discrecion';
  if (t.includes('independencia') && (t.includes('consolidada') || t.includes('autónomo'))) return 'bc_autonomo_con_it';
  return 'bc_autonomia_limitada';
}

function extractFiscalSpace(policyFeasibility, mechanism) {
  var t = (policyFeasibility + ' ' + mechanism).toLowerCase();
  if (t.includes('fees') || t.includes('buffer') || t.includes('fondo soberano') || t.includes('gpfg')) return 'espacio_amplio_con_buffer';
  if (t.includes('sin acceso a mercados') || t.includes('condicional a ajuste') || t.includes('troika')) return 'sin_espacio_bajo_condicionalidad';
  if (t.includes('déficit') && t.includes('default')) return 'sin_espacio_bajo_condicionalidad';
  if (t.includes('rigidiza') || t.includes('sin discreción')) return 'espacio_limitado_por_regimen';
  if (t.includes('sin regla') || t.includes('dominancia')) return 'espacio_con_dominancia_fiscal';
  return 'espacio_fiscal_moderado';
}

function extractOutcome(antiOverclaim, mechanism) {
  var t = (mechanism + ' ' + antiOverclaim).toLowerCase();
  if (t.includes('desanclaje autorreferente') || t.includes('desanclaje persistente')) return 'desanclaje_persistente';
  if (t.includes('sin desanclaje') || t.includes('ancladas') || t.includes('recupera')) return 'expectativas_ancladas';
  if (t.includes('espiral') || t.includes('auto-reforzante') || t.includes('autorreferente')) return 'espiral_contraccionista';
  if (t.includes('colap') || t.includes('default') || t.includes('ruptura')) return 'colapso_del_regimen';
  return 'trayectoria_mixta';
}

/* ---- Procesar crónicas ---- */
const taxonomy = {};
var processed = 0;
var skipped = 0;

Object.keys(CRONICAS).forEach(function(id) {
  var c = CRONICAS[id];
  var il = c.institutionalLayer;

  if (!il) {
    console.warn('⚠  ' + id + ': sin institutionalLayer — omitido');
    skipped++;
    return;
  }

  taxonomy[id] = {
    titulo:          c.titulo,
    shockType:       extractShockType(il.mechanism, il.institution),
    exchangeRegime:  extractExchangeRegime(il.institution, il.mechanism),
    bcAutonomy:      extractBcAutonomy(il.policyFeasibility, il.institution),
    fiscalSpace:     extractFiscalSpace(il.policyFeasibility, il.mechanism),
    credibilityOutcome: extractOutcome(il.antiOverclaim, il.mechanism),
    il_chars: {
      institution:          il.institution.length,
      mechanism:            il.mechanism.length,
      feedbackLoop:         il.feedbackLoop.length,
      policyFeasibility:    il.policyFeasibility.length,
      incidence:            il.incidence.length,
      discriminatingEvidence: il.discriminatingEvidence.length,
      antiOverclaim:        il.antiOverclaim.length
    }
  };
  processed++;
});

/* ---- Escribir output ---- */
const outDir  = path.join(__dirname, '../data');
const outPath = path.join(outDir, 'atlas-taxonomy.json');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(taxonomy, null, 2), 'utf-8');

console.log('\n✓ atlas-taxonomy.json generado');
console.log('  Procesadas: ' + processed + '  |  Sin institutionalLayer: ' + skipped);
console.log('  Ubicación: ' + outPath);
console.log('\n=== TAXONOMÍA ===\n');
Object.entries(taxonomy).forEach(function(entry) {
  var id = entry[0]; var t = entry[1];
  console.log(id);
  console.log('  shockType:          ' + t.shockType);
  console.log('  exchangeRegime:     ' + t.exchangeRegime);
  console.log('  bcAutonomy:         ' + t.bcAutonomy);
  console.log('  fiscalSpace:        ' + t.fiscalSpace);
  console.log('  credibilityOutcome: ' + t.credibilityOutcome);
  console.log('');
});
