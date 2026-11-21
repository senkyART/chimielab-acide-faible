/* js/parser.js — Analyseur numérique strict pour notations scientifiques et françaises */

/**
 * Analyse et convertit une chaîne représentant un nombre en nombre flottant.
 * Supporte : virgule décimale, notations scientifiques (1e-3, 1,58×10^-5, 1.58*10^-5, 1.58x10^-5, 1.58·10^-5),
 * et puissances pures de 10 (10^-3.41).
 * Rejette strictement les entrées non numériques ("12abc" renvoie NaN, "" renvoie NaN).
 *
 * @param {string|number} input - Valeur textuelle ou numérique à analyser.
 * @returns {number} Nombre flottant valide ou NaN.
 */
function parseNumber(input) {
  if (typeof input === 'number') {
    return isFinite(input) ? input : NaN;
  }
  if (input === null || input === undefined || typeof input !== 'string') {
    return NaN;
  }

  let s = input.trim();
  if (s === '') {
    return NaN;
  }

  // Suppression des espaces internes
  s = s.replace(/\s+/g, '');

  // Remplacement de la virgule décimale par un point
  s = s.replace(',', '.');

  // Détection de la forme pure 10^x ou 10^-x
  const powMatch = s.match(/^10\^([+-]?\d*(?:\.\d+)?)$/);
  if (powMatch) {
    const exponent = parseFloat(powMatch[1]);
    return isFinite(exponent) ? Math.pow(10, exponent) : NaN;
  }

  // Remplacement des variantes de multiplication scientifique (×, *, x, X, ·) par 'e'
  s = s.replace(/[×xX\*·]\s*10\^?([+-]?\d+)/, 'e$1');

  // Expression régulière stricte garantissant qu'aucun caractère parasite ne subsiste
  const strictNumberRegex = /^[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?$/;
  if (!strictNumberRegex.test(s)) {
    return NaN;
  }

  const val = parseFloat(s);
  return isFinite(val) ? val : NaN;
}
