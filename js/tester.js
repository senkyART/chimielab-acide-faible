/* js/tester.js — Suite de tests automatisée avec assertions numériques réelles */

/**
 * Exécute la suite complète de vérifications scientifiques et affiche les résultats PASS/FAIL.
 */
function runSelfTests() {
  const tbody = document.getElementById('test-results-tbody');
  const summary = document.getElementById('tester-summary');
  if (!tbody || !summary) return;

  tbody.innerHTML = '';
  const tests = [];

  function checkRel(val, exp, tol = 0.005) {
    if (typeof val !== 'number' || isNaN(val)) return false;
    return Math.abs(val - exp) / exp <= tol;
  }

  function checkAbs(val, exp, tol = 0.01) {
    if (typeof val !== 'number' || isNaN(val)) return false;
    return Math.abs(val - exp) <= tol;
  }

  // 1. Mode 3 : C = 1.0e-2, K = 1.58e-5 -> x ≈ 3.897e-4, pH ≈ 3.41, τ ≈ 0.0390
  const m3 = calcMode3({ C: 1.0e-2, K: 1.58e-5, n: null, lambda_B_SI: null, lambda_H3O_SI: 0.035 });
  tests.push({ name: "Mode 3 : x = [H₃O⁺]", exp: "≈ 3.897e-4", got: m3.x.toExponential(3), pass: checkRel(m3.x, 3.897e-4) });
  tests.push({ name: "Mode 3 : pH", exp: "≈ 3.41", got: m3.pH.toFixed(2), pass: checkAbs(m3.pH, 3.41) });
  tests.push({ name: "Mode 3 : τ", exp: "≈ 0.0390", got: m3.tau.toFixed(4), pass: checkRel(m3.tau, 0.0390) });

  // 2. Mode 1 : C = 1.0e-2, pH = 3.41 -> x ≈ 3.890e-4, τ ≈ 0.0389, K ≈ 1.57e-5
  const m1 = calcMode1({ C: 1.0e-2, pH: 3.41, lambda_B_SI: null, lambda_H3O_SI: 0.035 });
  tests.push({ name: "Mode 1 : x = [H₃O⁺]", exp: "≈ 3.890e-4", got: m1.x.toExponential(3), pass: checkRel(m1.x, 3.890e-4) });
  tests.push({ name: "Mode 1 : τ", exp: "≈ 0.0389", got: m1.tau.toFixed(4), pass: checkRel(m1.tau, 0.0389) });
  tests.push({ name: "Mode 1 : K", exp: "≈ 1.57e-5", got: m1.K.toExponential(2), pass: checkRel(m1.K, 1.57e-5) });

  // 3. Mode 2 : C = 1.0e-2, σ = 0.0152 S/m, λ_B = 4.09 mS·m²·mol⁻¹, λ_H₃O⁺ = 34.98 mS·m²·mol⁻¹
  const lB_SI = lambdaToSI(4.09, 'mS');
  const lH3O_SI = lambdaToSI(34.98, 'mS');
  const m2 = calcMode2({ C: 1.0e-2, sigma_SI: 0.0152, lambda_B_SI: lB_SI, lambda_H3O_SI: lH3O_SI });
  tests.push({ name: "Mode 2 : x = [H₃O⁺]", exp: "≈ 3.890e-4", got: m2.x.toExponential(3), pass: checkRel(m2.x, 3.890e-4) });
  tests.push({ name: "Mode 2 : τ", exp: "≈ 0.0389", got: m2.tau.toFixed(4), pass: checkRel(m2.tau, 0.0389) });
  tests.push({ name: "Mode 2 : K", exp: "≈ 1.57e-5", got: m2.K.toExponential(2), pass: checkRel(m2.K, 1.57e-5) });
  tests.push({
    name: "Mode 2 : Pas de pH ni de σ calculé",
    exp: "aucun",
    got: `${m2.pH === undefined && m2.sigma === undefined ? 'aucun' : 'présent'}`,
    pass: (m2.pH === undefined && m2.sigma === undefined)
  });

  // 4. Mode 3 avec dilution : C = 0.10, n = 10, K = 1.58e-5 -> C' = 0.010, mêmes résultats
  const m3_dil = calcMode3({ C: 0.10, K: 1.58e-5, n: 10, lambda_B_SI: null, lambda_H3O_SI: 0.035 });
  tests.push({ name: "Mode 3 dilution : C'", exp: "0.010", got: m3_dil.C_prime.toFixed(3), pass: checkRel(m3_dil.C_prime, 0.010) });
  tests.push({ name: "Mode 3 dilution : x", exp: "≈ 3.897e-4", got: m3_dil.x.toExponential(3), pass: checkRel(m3_dil.x, 3.897e-4) });
  tests.push({ name: "Mode 3 dilution : pH", exp: "≈ 3.41", got: m3_dil.pH.toFixed(2), pass: checkAbs(m3_dil.pH, 3.41) });
  tests.push({ name: "Mode 3 dilution : τ", exp: "≈ 0.0390", got: m3_dil.tau.toFixed(4), pass: checkRel(m3_dil.tau, 0.0390) });

  // 5. Tests de parsing virgule et notations scientifiques
  const p1 = parseNumber("1,58e-5");
  const p2 = parseNumber("1,58×10^-5");
  tests.push({ name: 'Parsing "1,58e-5"', exp: "1.58e-5", got: p1.toExponential(2), pass: checkRel(p1, 1.58e-5) });
  tests.push({ name: 'Parsing "1,58×10^-5"', exp: "1.58e-5", got: p2.toExponential(2), pass: checkRel(p2, 1.58e-5) });
  const pStrict = parseNumber("12abc");
  tests.push({ name: 'Parsing strict "12abc" -> NaN', exp: "NaN", got: String(pStrict), pass: isNaN(pStrict) });
  const pEmpty = parseNumber("");
  tests.push({ name: 'Parsing chaîne vide "" -> NaN', exp: "NaN", got: String(pEmpty), pass: isNaN(pEmpty) });

  // 6. Conversions d'unités via units.js (Fix F2)
  const s_to_si = sigmaToSI(15.2, 'mS/m');
  const s_from_si = sigmaFromSI(0.0152, 'mS/m');
  const l_to_si = lambdaToSI(4.09, 'mS');
  const l_from_si = lambdaFromSI(0.00409, 'mS');
  tests.push({ name: "sigmaToSI(15.2, 'mS/m')", exp: "0.0152 S/m", got: `${s_to_si} S/m`, pass: checkRel(s_to_si, 0.0152) });
  tests.push({ name: "sigmaFromSI(0.0152, 'mS/m')", exp: "15.2 mS/m", got: `${s_from_si} mS/m`, pass: checkRel(s_from_si, 15.2) });
  tests.push({ name: "lambdaToSI(4.09, 'mS')", exp: "0.00409 S·m²·mol⁻¹", got: `${l_to_si} S·m²·mol⁻¹`, pass: checkRel(l_to_si, 0.00409) });
  tests.push({ name: "lambdaFromSI(0.00409, 'mS')", exp: "4.09 mS·m²·mol⁻¹", got: `${l_from_si} mS·m²·mol⁻¹`, pass: checkRel(l_from_si, 4.09) });

  // 7. Aller-retour 34.98 mS·m²·mol⁻¹ -> S -> mS (Fix F4)
  const roundtrip = lambdaFromSI(lambdaToSI(34.98, 'mS'), 'mS');
  tests.push({ name: "Aller-retour 34.98 mS -> S -> mS", exp: "34.98", got: String(roundtrip), pass: (roundtrip === 34.98) });

  // 8. λ_H₃O⁺ défaut physique invariant (Fix F1)
  const def_mS = lambdaFromSI(0.035, 'mS');
  const def_back_S = lambdaToSI(def_mS, 'mS');
  tests.push({
    name: "λ_H₃O⁺ défaut physique invariant (0.035 S -> mS -> S)",
    exp: "0.035 S·m²·mol⁻¹",
    got: `${def_back_S} S·m²·mol⁻¹`,
    pass: (def_back_S === 0.035 && def_mS === 35)
  });

  // 9. Absence de σ si λ_B non renseigné (Modes 1 et 3)
  const m1_no_b = calcMode1({ C: 0.01, pH: 3.41, lambda_B_SI: null, lambda_H3O_SI: 0.035 });
  const m3_no_b = calcMode3({ C: 0.01, K: 1.58e-5, n: null, lambda_B_SI: null, lambda_H3O_SI: 0.035 });
  tests.push({ name: "Mode 1 sans λ_B : σ absent", exp: "null", got: String(m1_no_b.sigma), pass: (m1_no_b.sigma === null) });
  tests.push({ name: "Mode 3 sans λ_B : σ absent", exp: "null", got: String(m3_no_b.sigma), pass: (m3_no_b.sigma === null) });

  // 10. Mode 3 avec λ_B fourni : calcul de σ
  const lB_m3 = lambdaToSI(4.09, 'mS');
  const lH_m3 = lambdaToSI(35.0, 'mS');
  const m3_with_b = calcMode3({ C: 1.0e-2, K: 1.58e-5, n: null, lambda_B_SI: lB_m3, lambda_H3O_SI: lH_m3 });
  const exp_sigma_m3 = m3_with_b.x * (lB_m3 + lH_m3) * 1000;
  tests.push({
    name: "Mode 3 avec λ_B (4.09 mS) : σ calculé",
    exp: exp_sigma_m3.toExponential(3),
    got: m3_with_b.sigma !== null ? m3_with_b.sigma.toExponential(3) : "null",
    pass: (m3_with_b.sigma !== null && checkRel(m3_with_b.sigma, exp_sigma_m3))
  });

  // 11. Mode 1 avec pH = 1 et C = 1.0e-2 -> erreur attendue (x ≥ C)
  let errMode1Caught = false;
  try {
    calcMode1({ C: 1.0e-2, pH: 1.0, lambda_B_SI: null, lambda_H3O_SI: 0.035 });
  } catch (e) {
    errMode1Caught = true;
  }
  tests.push({
    name: "Mode 1 (pH = 1, C = 0.01) -> rejet (x ≥ C)",
    exp: "Erreur levée",
    got: errMode1Caught ? "Erreur levée" : "Aucune erreur",
    pass: errMode1Caught
  });

  // 12. Mode 3 avec n = 0.5 -> erreur attendue (n ≥ 1)
  let errMode3DilCaught = false;
  try {
    calcMode3({ C: 1.0e-2, K: 1.58e-5, n: 0.5, lambda_B_SI: null, lambda_H3O_SI: 0.035 });
  } catch (e) {
    errMode3DilCaught = true;
  }
  tests.push({
    name: "Mode 3 avec n = 0.5 -> rejet (n ≥ 1)",
    exp: "Erreur levée",
    got: errMode3DilCaught ? "Erreur levée" : "Aucune erreur",
    pass: errMode3DilCaught
  });

  // Rendu du tableau
  let allPass = true;
  tests.forEach(t => {
    if (!t.pass) allPass = false;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.name}</td>
      <td>${t.exp}</td>
      <td>${t.got}</td>
      <td><span class="${t.pass ? 'test-badge-pass' : 'test-badge-fail'}">${t.pass ? 'PASS' : 'FAIL'}</span></td>
    `;
    tbody.appendChild(tr);
  });

  summary.innerHTML = allPass
    ? `<span style="color: var(--teal);">✓ Tous les tests sont validés avec succès (${tests.length}/${tests.length} PASS). Conformité 100%.</span>`
    : `<span style="color: #EF4444;">✗ Certains tests ont échoué.</span>`;
}
