/* js/units.js — Gestion centralisée des conversions d'unités (conductivité σ et conductivités molaires λ) */

/**
 * Nettoie les erreurs d'arrondi binaire en conservant 12 chiffres significatifs.
 *
 * @param {number} v - Valeur à nettoyer.
 * @returns {number} Valeur flottante épurée.
 */
function cleanFloat(v) {
  if (typeof v !== 'number' || isNaN(v)) {
    return NaN;
  }
  return Number(v.toPrecision(12));
}

/**
 * Convertit une conductivité molaire ionique λ en unité SI (S·m²·mol⁻¹).
 *
 * @param {number} value - Valeur numérique.
 * @param {string} unit - 'mS' (mS·m²·mol⁻¹) ou 'S' (S·m²·mol⁻¹).
 * @returns {number} Valeur en S·m²·mol⁻¹.
 */
function lambdaToSI(value, unit) {
  if (typeof value !== 'number' || isNaN(value)) {
    return NaN;
  }
  if (unit === 'mS') {
    return cleanFloat(value * 1e-3);
  }
  return cleanFloat(value);
}

/**
 * Convertit une conductivité molaire ionique λ depuis le SI vers l'unité choisie.
 *
 * @param {number} valueSI - Valeur en S·m²·mol⁻¹.
 * @param {string} unit - 'mS' ou 'S'.
 * @returns {number} Valeur dans l'unité demandée.
 */
function lambdaFromSI(valueSI, unit) {
  if (typeof valueSI !== 'number' || isNaN(valueSI)) {
    return NaN;
  }
  if (unit === 'mS') {
    return cleanFloat(valueSI * 1000);
  }
  return cleanFloat(valueSI);
}

/**
 * Convertit une conductivité σ en unité SI (S/m).
 *
 * @param {number} value - Valeur numérique.
 * @param {string} unit - 'mS/m' ou 'S/m'.
 * @returns {number} Valeur en S/m.
 */
function sigmaToSI(value, unit) {
  if (typeof value !== 'number' || isNaN(value)) {
    return NaN;
  }
  if (unit === 'mS/m') {
    return cleanFloat(value * 1e-3);
  }
  return cleanFloat(value);
}

/**
 * Convertit une conductivité σ depuis le SI vers l'unité choisie.
 *
 * @param {number} valueSI - Valeur en S/m.
 * @param {string} unit - 'mS/m' ou 'S/m'.
 * @returns {number} Valeur dans l'unité demandée.
 */
function sigmaFromSI(valueSI, unit) {
  if (typeof valueSI !== 'number' || isNaN(valueSI)) {
    return NaN;
  }
  if (unit === 'mS/m') {
    return cleanFloat(valueSI * 1000);
  }
  return cleanFloat(valueSI);
}
