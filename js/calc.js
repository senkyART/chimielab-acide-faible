/* js/calc.js — Fonctions scientifiques pures pour les 3 situations d'acide faible dans l'eau */

/**
 * SITUATION 1 (Mode 1) : Données C et pH.
 * Ordre de calcul :
 * 1) x = [H₃O⁺] = 10^(−pH)
 * 2) τ = x / C
 * 3) K = x² / (C − x)
 * 4) uniquement si λ_B fourni : σ = x · (λ_B + λ_H₃O⁺) · 10³
 *
 * @param {Object} params
 * @param {number} params.C - Concentration initiale en mol/L (> 0)
 * @param {number} params.pH - pH mesuré (réel fini)
 * @param {number|null} [params.lambda_B_SI=null] - Conductivité molaire de la base conjuguée en S·m²·mol⁻¹
 * @param {number} params.lambda_H3O_SI - Conductivité molaire de H₃O⁺ en S·m²·mol⁻¹
 * @returns {Object} Résultats du mode 1
 */
function calcMode1({ C, pH, lambda_B_SI = null, lambda_H3O_SI }) {
  if (typeof C !== 'number' || isNaN(C) || C <= 0) {
    throw new Error("La concentration C doit être un nombre strictement positif (> 0 mol/L).");
  }
  if (typeof pH !== 'number' || isNaN(pH) || !isFinite(pH)) {
    throw new Error("Le pH doit être un nombre réel fini.");
  }

  // 1) x = [H₃O⁺] = 10^(−pH)
  const x = Math.pow(10, -pH);

  // Validation acide faible : x < C
  if (x >= C) {
    throw new Error(`Pour un acide faible, la concentration à l'équilibre x = [H₃O⁺] (${formatNumber(x)} mol/L) doit être strictement inférieure à la concentration initiale C (${formatNumber(C)} mol/L).`);
  }

  // 2) τ = x / C
  const tau = x / C;

  // 3) K = x² / (C − x)
  const K = (x * x) / (C - x);

  // 4) uniquement si λ_B fourni : σ = x · (λ_B + λ_H₃O⁺) · 10³
  let sigma = null;
  if (lambda_B_SI !== null && lambda_B_SI !== undefined) {
    if (typeof lambda_B_SI !== 'number' || isNaN(lambda_B_SI) || lambda_B_SI <= 0) {
      throw new Error("La conductivité molaire λ_B doit être strictement positive (> 0 S·m²·mol⁻¹).");
    }
    if (typeof lambda_H3O_SI !== 'number' || isNaN(lambda_H3O_SI) || lambda_H3O_SI <= 0) {
      throw new Error("La conductivité molaire λ_H₃O⁺ doit être strictement positive (> 0 S·m²·mol⁻¹).");
    }
    sigma = x * (lambda_B_SI + lambda_H3O_SI) * 1000;
  }

  const K_verif = (x * x) / (C - x);

  return {
    mode: 1,
    C,
    pH,
    lambda_B_SI: (lambda_B_SI !== null && lambda_B_SI > 0) ? lambda_B_SI : null,
    lambda_H3O_SI,
    x,
    tau,
    K,
    sigma,
    K_verif
  };
}

/**
 * SITUATION 2 (Mode 2) : Données C, σ, λ_B et λ_H₃O⁺.
 * Ordre de calcul :
 * 1) x = [H₃O⁺] = σ / (λ_B + λ_H₃O⁺) · 10⁻³
 * 2) τ = x / C
 * 3) K = x² / (C − x)
 * Mode 2 calcule UNIQUEMENT [H₃O⁺], τ et K. Pas de pH, pas de σ.
 *
 * @param {Object} params
 * @param {number} params.C - Concentration initiale en mol/L (> 0)
 * @param {number} params.sigma_SI - Conductivité en S/m (> 0)
 * @param {number} params.lambda_B_SI - Conductivité molaire de la base conjuguée en S·m²·mol⁻¹ (> 0)
 * @param {number} params.lambda_H3O_SI - Conductivité molaire de H₃O⁺ en S·m²·mol⁻¹ (> 0)
 * @returns {Object} Résultats du mode 2
 */
function calcMode2({ C, sigma_SI, lambda_B_SI, lambda_H3O_SI }) {
  if (typeof C !== 'number' || isNaN(C) || C <= 0) {
    throw new Error("La concentration C doit être un nombre strictement positif (> 0 mol/L).");
  }
  if (typeof sigma_SI !== 'number' || isNaN(sigma_SI) || sigma_SI <= 0) {
    throw new Error("La conductivité σ doit être strictement positive (> 0 S/m).");
  }
  if (typeof lambda_B_SI !== 'number' || isNaN(lambda_B_SI) || lambda_B_SI <= 0) {
    throw new Error("La conductivité molaire λ_B doit être strictement positive (> 0 S·m²·mol⁻¹).");
  }
  if (typeof lambda_H3O_SI !== 'number' || isNaN(lambda_H3O_SI) || lambda_H3O_SI <= 0) {
    throw new Error("La conductivité molaire λ_H₃O⁺ doit être strictement positive (> 0 S·m²·mol⁻¹).");
  }

  // 1) x = [H₃O⁺] = σ / (λ_B + λ_H₃O⁺) · 10⁻³
  const sumLambda = lambda_B_SI + lambda_H3O_SI;
  const x = (sigma_SI / sumLambda) * 1e-3;

  // Validation acide faible : x < C
  if (x >= C) {
    throw new Error(`Pour un acide faible, la concentration à l'équilibre x = [H₃O⁺] (${formatNumber(x)} mol/L) doit être strictement inférieure à la concentration initiale C (${formatNumber(C)} mol/L).`);
  }

  // 2) τ = x / C
  const tau = x / C;

  // 3) K = x² / (C − x)
  const K = (x * x) / (C - x);

  const K_verif = (x * x) / (C - x);

  return {
    mode: 2,
    C,
    sigma_SI,
    lambda_B_SI,
    lambda_H3O_SI,
    x,
    tau,
    K,
    K_verif
  };
}

/**
 * SITUATION 3 (Mode 3) : Données C (ou C' = C / n si dilution n fois) et K.
 * Ordre de calcul :
 * 1) si dilution : C' = C / n (afficher C et C', utiliser C' partout ensuite)
 * 2) x = [H₃O⁺] = (−K + √(K² + 4·K·C')) / 2
 * 3) pH = −log10(x)
 * 4) uniquement si λ_B fourni : σ = x · (λ_B + λ_H₃O⁺) · 10³
 * 5) τ = x / C'
 * Vérification après étape 2 : 0 < x < C'.
 *
 * @param {Object} params
 * @param {number} params.C - Concentration initiale en mol/L (> 0)
 * @param {number} params.K - Constante d'équilibre K (> 0, sans dimension)
 * @param {number|null} [params.n=null] - Facteur de dilution (≥ 1 si présent)
 * @param {number|null} [params.lambda_B_SI=null] - Conductivité molaire de la base conjuguée en S·m²·mol⁻¹
 * @param {number} params.lambda_H3O_SI - Conductivité molaire de H₃O⁺ en S·m²·mol⁻¹
 * @returns {Object} Résultats du mode 3
 */
function calcMode3({ C, K, n = null, lambda_B_SI = null, lambda_H3O_SI }) {
  if (typeof C !== 'number' || isNaN(C) || C <= 0) {
    throw new Error("La concentration C doit être un nombre strictement positif (> 0 mol/L).");
  }
  if (typeof K !== 'number' || isNaN(K) || K <= 0) {
    throw new Error("La constante d'équilibre K doit être un nombre strictement positif (> 0).");
  }

  const isDiluted = (n !== null && n !== undefined);
  if (isDiluted) {
    if (typeof n !== 'number' || isNaN(n) || n < 1) {
      throw new Error("Le facteur de dilution n doit être un nombre supérieur ou égal à 1 (n ≥ 1).");
    }
  }

  // 1) si dilution : C' = C / n
  const C_prime = (isDiluted && n > 1) ? (C / n) : C;

  // 2) x = [H₃O⁺] = (−K + √(K² + 4·K·C')) / 2
  const delta = (K * K) + (4 * K * C_prime);
  const x = (-K + Math.sqrt(delta)) / 2;

  // Vérification stricte : 0 < x < C'
  if (!(x > 0 && x < C_prime)) {
    throw new Error(`Résultat invalide : la valeur calculée de x ([H₃O⁺] = ${formatNumber(x)} mol/L) n'est pas comprise dans l'intervalle ]0, C'[.`);
  }

  // 3) pH = −log10(x)
  const pH = -Math.log10(x);

  // 4) uniquement si λ_B fourni : σ = x · (λ_B + λ_H₃O⁺) · 10³
  let sigma = null;
  if (lambda_B_SI !== null && lambda_B_SI !== undefined) {
    if (typeof lambda_B_SI !== 'number' || isNaN(lambda_B_SI) || lambda_B_SI <= 0) {
      throw new Error("La conductivité molaire λ_B doit être strictement positive (> 0 S·m²·mol⁻¹).");
    }
    if (typeof lambda_H3O_SI !== 'number' || isNaN(lambda_H3O_SI) || lambda_H3O_SI <= 0) {
      throw new Error("La conductivité molaire λ_H₃O⁺ doit être strictement positive (> 0 S·m²·mol⁻¹).");
    }
    sigma = x * (lambda_B_SI + lambda_H3O_SI) * 1000;
  }

  // 5) τ = x / C'
  const tau = x / C_prime;

  const K_verif = (x * x) / (C_prime - x);

  return {
    mode: 3,
    C,
    n: (isDiluted && n > 1) ? n : null,
    C_prime,
    K,
    x,
    pH,
    sigma,
    tau,
    lambda_B_SI: (lambda_B_SI !== null && lambda_B_SI > 0) ? lambda_B_SI : null,
    lambda_H3O_SI,
    K_verif
  };
}
