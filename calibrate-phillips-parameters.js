// Task 2A.2: Calibrate Phillips curve parameters per regime
// Input:  atlas-cronicas-datos-reales.json
// Output: regime-phillips-calibration.json

const fs = require('fs');

const atlas = JSON.parse(fs.readFileSync('atlas-cronicas-datos-reales.json', 'utf8'));

// NAIRU estimates per regime (natural rate of unemployment)
const NAIRU = {
  FCHR_chile_2021_2024:    7.0,
  FCHD_suecia_1992_1998:   6.0,
  FUHR_brasil_implied:     8.5,
  FUHD_turquia_2018_2023: 10.0,
  FULD_argentina_2020:     8.0,
  PFHR_hongkong_implied:   3.0,
  PFULU_grecia_2010_2015: 12.0,
  TRAP_japon_implied:      4.5
};

// Target inflation per regime (meta BC)
const TARGET_INF = {
  FCHR_chile_2021_2024:    3.0,
  FCHD_suecia_1992_1998:   2.0,
  FUHR_brasil_implied:     4.5,
  FUHD_turquia_2018_2023:  5.0,
  FULD_argentina_2020:    25.0,
  PFHR_hongkong_implied:   2.5,
  PFULU_grecia_2010_2015:  2.0,
  TRAP_japon_implied:      0.5
};

// Tier color mapping
const TIER_COLORS = { 1: '#22c55e', 2: '#eab308', 3: '#f97316', 4: '#ef4444' };
const TRAP_COLOR = '#6b7280';

// Generate synthetic Phillips curve: inflation_gap vs unemployment_gap
// π - π* = -λ(u - u*)  → Carlin-Soskice form
function generatePhillipsCurve(lambda, uNairu, piTarget, points = 20) {
  const curve = [];
  const uMin = uNairu * 0.3;
  const uMax = uNairu * 3.0;
  const step = (uMax - uMin) / (points - 1);
  for (let i = 0; i < points; i++) {
    const u = +(uMin + i * step).toFixed(2);
    const uGap = u - uNairu;
    const pi = +(piTarget - lambda * uGap).toFixed(2);
    curve.push({ desempleo: u, inflacion: pi, desempleo_gap: +uGap.toFixed(2) });
  }
  return curve;
}

// Estimate lambda from chronicle trajectory via OLS on (u_gap, pi_gap) pairs
function estimateLambdaFromTrajectory(traj, uNairu, piTarget) {
  let sumXY = 0, sumXX = 0, n = 0;
  traj.forEach(pt => {
    if (pt.quarter === 0) return; // skip baseline
    const uGap = pt.desempleo - uNairu;
    const piGap = pt.inflacion_anual - piTarget;
    sumXY += (-uGap) * piGap;
    sumXX += (-uGap) * (-uGap);
    n++;
  });
  if (sumXX < 0.001) return null;
  return +(sumXY / sumXX).toFixed(4);
}

const output = {
  metadata: {
    version: '2A.2',
    fecha: '2026-05-23',
    metodo: 'OLS sobre (u_gap × pi_gap) desde trayectoria cronica; override por prior teorico donde OLS no convergente',
    fuente_input: 'atlas-cronicas-datos-reales.json'
  },
  regimes: {}
};

for (const [regId, reg] of Object.entries(atlas.regimenes)) {
  const uNairu  = NAIRU[regId];
  const piTarget = TARGET_INF[regId];
  const lambdaOls = estimateLambdaFromTrajectory(reg.trayectoria, uNairu, piTarget);
  const prior = reg.phillips_slope_estimado;
  // Use OLS only if positive, in plausible range, and not wildly different from prior
  const olsValid = (lambdaOls !== null
    && lambdaOls > 0.05
    && lambdaOls < 3.0
    && lambdaOls / prior < 4.0
    && prior / lambdaOls < 4.0);
  const lambdaFinal = olsValid ? lambdaOls : prior;

  const color = reg.regimen === 'TRAP' ? TRAP_COLOR : TIER_COLORS[reg.tier] || '#6b7280';
  const phillipsCurve = generatePhillipsCurve(lambdaFinal, uNairu, piTarget);

  output.regimes[regId] = {
    label:             reg.label,
    regimen:           reg.regimen,
    tier:              reg.tier,
    color,
    nairu:             uNairu,
    target_inflacion:  piTarget,
    phillips_slope:    lambdaFinal,
    phillips_slope_ols: lambdaOls,
    phillips_slope_prior: reg.phillips_slope_estimado,
    convergence_speed: reg.convergence_speed_estimado,
    resultado_credibilidad: reg.resultado_credibilidad,
    phillips_curve:    phillipsCurve,
    interpretacion: lambdaFinal < 0.4
      ? 'Alta credibilidad: pequeña pendiente, shocks se absorben rapido'
      : lambdaFinal < 0.8
      ? 'Credibilidad media: pendiente moderada, convergencia lenta'
      : lambdaFinal < 1.5
      ? 'Credibilidad baja: pendiente alta, shocks persisten'
      : 'Colapso/trampa: pendiente muy alta o vertical, divergencia persistente'
  };
}

fs.writeFileSync('regime-phillips-calibration.json', JSON.stringify(output, null, 2));

// Summary report
const regimes = Object.entries(output.regimes);
console.log('\n=== PHILLIPS CALIBRATION REPORT ===');
console.log(`Regímenes calibrados: ${regimes.length}`);
regimes.forEach(([id, r]) => {
  const ols = r.phillips_slope_ols !== null ? r.phillips_slope_ols.toFixed(3) : 'N/A';
  console.log(`  ${id.padEnd(32)} λ=${r.phillips_slope.toFixed(3)}  (OLS=${ols}, prior=${r.phillips_slope_prior.toFixed(2)}) tier=${r.tier}`);
});
console.log('\n✓ Archivo generado: regime-phillips-calibration.json');
