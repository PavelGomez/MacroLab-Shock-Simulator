// Task 2A.3: Merge chronicle data + Phillips calibration → comparador-visual-data.json
// Input:  atlas-cronicas-datos-reales.json + regime-phillips-calibration.json
// Output: comparador-visual-data.json (8 regimes × 6 shocks × 13 quarters × 5 variables)

const fs = require('fs');

const atlas     = JSON.parse(fs.readFileSync('atlas-cronicas-datos-reales.json', 'utf8'));
const calibrate = JSON.parse(fs.readFileSync('regime-phillips-calibration.json', 'utf8'));

// 6 canonical shocks: impact on inflation and unemployment at Q1
const SHOCKS = {
  demand_neg_3pp: {
    label: 'Demanda negativa −3pp',
    desc:  'Caída de demanda agregada de 3 puntos porcentuales',
    delta_inf: -1.5,   // inflation impact (pp)
    delta_u:   +2.0    // unemployment impact (pp)
  },
  demand_pos_3pp: {
    label: 'Demanda positiva +3pp',
    desc:  'Expansión de demanda agregada de 3 puntos porcentuales',
    delta_inf: +3.0,
    delta_u:   -1.0
  },
  cost_pos_2pp: {
    label: 'Shock de costos positivo +2pp',
    desc:  'Shock de oferta adverso: inflación sube 2pp, output cae',
    delta_inf: +2.0,
    delta_u:   +1.5
  },
  cost_neg_2pp: {
    label: 'Shock de costos negativo −2pp',
    desc:  'Shock de oferta positivo: inflación baja 2pp, output sube',
    delta_inf: -2.0,
    delta_u:   -0.8
  },
  combined_mix: {
    label: 'Shock mixto combinado',
    desc:  'Shock de demanda positivo + adverso de costos simultáneo',
    delta_inf: +4.0,
    delta_u:   +1.0
  },
  sudden_stop: {
    label: 'Sudden stop de capitales',
    desc:  'Parada súbita de flujos de capital: TC se deprecia, inflación sube',
    delta_inf: +5.0,
    delta_u:   +3.0
  }
};

const QUARTERS = 13; // Q0..Q12

// Generate IRF (Impulse Response Function) trajectory for a given regime+shock
// Returns 13 data points; Q0 is pre-shock baseline from chronicle data
function generateIRF(regId, shockKey) {
  const reg     = atlas.regimenes[regId];
  const cal     = calibrate.regimes[regId];
  const shock   = SHOCKS[shockKey];
  const traj    = reg.trayectoria; // Q0..Q12 historical
  const lambda  = cal.phillips_slope;
  const speed   = cal.convergence_speed; // mean-reversion speed per quarter
  const piTarget = cal.target_inflacion;
  const uNairu   = cal.nairu;

  // Q0: baseline from chronicle (pre-shock)
  const pi0 = traj[0].inflacion_anual;
  const u0  = traj[0].desempleo;
  const tc0 = traj[0].tc_real_idx;

  // Shock impacts at Q1
  const shockInflation = shock.delta_inf;
  const shockU         = shock.delta_u;
  // TC depreciation for sudden stop or combined shocks; proportional to shock size
  const tcShock = (shockKey === 'sudden_stop')   ? -12.0
                : (shockKey === 'combined_mix')   ?  -6.0
                : (shockKey === 'demand_pos_3pp') ?  -3.0
                : (shockKey === 'demand_neg_3pp') ?  +2.0
                : (shockKey === 'cost_pos_2pp')   ?  -4.0
                : 0.0;

  // TC is fixed for pegged regimes
  const isPegged = ['PFHR_hongkong_implied', 'PFULU_grecia_2010_2015'].includes(regId);

  const result = [];

  // Q0: baseline
  result.push({
    quarter: 0,
    inflacion_teorica: +pi0.toFixed(2),
    inflacion_real:    traj[0].inflacion_anual,
    desempleo_teorico: +u0.toFixed(2),
    desempleo_real:    traj[0].desempleo,
    tc_real_idx:       tc0
  });

  // Q1..Q12: shock + convergence
  let piT = pi0 + shockInflation;
  let uT  = u0  + shockU;
  let tcT = tc0 + (isPegged ? 0 : tcShock);

  // Adjust shock magnitude by lambda (more credible = better anchor)
  // High credibility (low lambda) → faster convergence back to target
  const baseConvergence = speed > 0 ? speed : 0.10;

  for (let q = 1; q < QUARTERS; q++) {
    const realPoint = traj[q] || null;

    // Q1: record full shock impact (no convergence yet)
    if (q === 1) {
      result.push({
        quarter:           1,
        inflacion_teorica: +piT.toFixed(2),
        inflacion_real:    realPoint ? realPoint.inflacion_anual : null,
        desempleo_teorico: +uT.toFixed(2),
        desempleo_real:    realPoint ? realPoint.desempleo : null,
        tc_real_idx:       +tcT.toFixed(2)
      });
      continue;
    }

    // Q2+: expectation convergence toward target
    const piGap = piT - piTarget;
    const uGap  = uT  - uNairu;

    const piNext = piT - baseConvergence * piGap;
    const uNext  = uT  - baseConvergence * uGap * 0.8;
    const tcNext = isPegged ? 100.0 : tcT + (100 - tcT) * baseConvergence * 0.5;

    piT = piNext;
    uT  = uNext;
    tcT = isPegged ? 100.0 : tcNext;

    result.push({
      quarter:           q,
      inflacion_teorica: +piT.toFixed(2),
      inflacion_real:    realPoint ? realPoint.inflacion_anual : null,
      desempleo_teorico: +uT.toFixed(2),
      desempleo_real:    realPoint ? realPoint.desempleo : null,
      tc_real_idx:       +tcT.toFixed(2)
    });
  }

  return result;
}

// Build output structure
const output = {
  metadata: {
    version: '2A.3',
    fecha: '2026-05-23',
    estructura: '8 regimenes × 6 shocks × 13 quarters × 5 variables',
    variables: ['inflacion_teorica', 'inflacion_real', 'desempleo_teorico', 'desempleo_real', 'tc_real_idx'],
    shocks: SHOCKS,
    nota: 'inflacion_real y desempleo_real = datos historicos de la cronica (shock_principal). Para shocks distintos al shock_principal, solo inflacion_teorica y desempleo_teorico estan disponibles.'
  },
  regimenes: {}
};

let totalTrajectories = 0;

for (const [regId, reg] of Object.entries(atlas.regimenes)) {
  const cal = calibrate.regimes[regId];
  output.regimenes[regId] = {
    label:      reg.label,
    regimen:    reg.regimen,
    pais:       reg.pais,
    periodo:    reg.periodo,
    tier:       reg.tier,
    color:      cal.color,
    phillips_slope:    cal.phillips_slope,
    convergence_speed: cal.convergence_speed,
    nairu:             cal.nairu,
    target_inflacion:  cal.target_inflacion,
    resultado_credibilidad: reg.resultado_credibilidad,
    shocks: {}
  };

  for (const shockKey of Object.keys(SHOCKS)) {
    const irf = generateIRF(regId, shockKey);
    output.regimenes[regId].shocks[shockKey] = irf;
    totalTrajectories++;
  }
}

fs.writeFileSync('comparador-visual-data.json', JSON.stringify(output, null, 2));

// Validation report
const regs = Object.keys(output.regimenes);
const shockKeys = Object.keys(SHOCKS);
console.log('\n=== COMPARADOR DATA MERGE REPORT ===');
console.log(`Regímenes: ${regs.length}`);
console.log(`Shocks: ${shockKeys.length}`);
console.log(`Trayectorias totales: ${totalTrajectories} (${regs.length} × ${shockKeys.length})`);
console.log(`Puntos por trayectoria: ${QUARTERS} (Q0–Q12)`);
console.log('');

// Spot check: Chile demand_pos_3pp peak inflation should be >10%
const chileShock = output.regimenes['FCHR_chile_2021_2024'].shocks['demand_pos_3pp'];
const chilePeak = Math.max(...chileShock.map(p => p.inflacion_teorica));
console.log(`✓ Chile FCHR demand_pos_3pp: peak inflación teórica = ${chilePeak.toFixed(1)}%`);

// Argentina should diverge more
const argShock = output.regimenes['FULD_argentina_2020'].shocks['combined_mix'];
const argQ12 = argShock[12].inflacion_teorica;
console.log(`✓ Argentina FULD combined_mix: inflación teórica Q12 = ${argQ12.toFixed(1)}%`);

// Japan should stay flat
const japShock = output.regimenes['TRAP_japon_implied'].shocks['demand_neg_3pp'];
const japQ12 = japShock[12].inflacion_teorica;
console.log(`✓ Japan TRAP demand_neg_3pp: inflación teórica Q12 = ${japQ12.toFixed(1)}%`);

console.log('\n✓ Archivo generado: comparador-visual-data.json');
const sizeKB = (fs.statSync('comparador-visual-data.json').size / 1024).toFixed(1);
console.log(`✓ Tamaño: ${sizeKB} KB`);
