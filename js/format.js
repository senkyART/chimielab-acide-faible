/* js/format.js — Formatage scientifique, décimal et textuel pour affichage et copie */

/**
 * Formate un nombre selon son type pour un affichage soigné conforme aux standards d'examen.
 *
 * @param {number} val - Valeur numérique brute.
 * @param {string} [type='general'] - Type de valeur ('general', 'pH', 'tau').
 * @param {number} [digits=3] - Nombre de décimales en notation exponentielle.
 * @returns {string} Chaîne formatée avec virgule française et puissances unicode.
 */
function formatNumber(val, type = 'general', digits = 3) {
  if (val === null || val === undefined || isNaN(val)) {
    return '—';
  }
  if (type === 'pH') {
    return val.toFixed(2).replace('.', ',');
  }
  if (type === 'tau') {
    const dec = (val < 0.01) ? val.toPrecision(3).replace('.', ',') : val.toFixed(4).replace('.', ',');
    const pct = (val * 100).toFixed(2).replace('.', ',') + ' %';
    return `${dec} (soit ${pct})`;
  }
  if (val === 0) {
    return '0';
  }

  const abs = Math.abs(val);
  if (abs < 0.01 || abs > 1000) {
    const expStr = val.toExponential(digits);
    const [mantissa, exponent] = expStr.split('e');
    const expNum = parseInt(exponent, 10);
    const supers = {
      '-': '⁻', '+': '', '0': '⁰', '1': '¹', '2': '²', '3': '³',
      '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    const expSuper = String(expNum).split('').map(c => supers[c] || c).join('');
    return `${mantissa.replace('.', ',')} × 10${expSuper}`;
  } else {
    return Number(val.toPrecision(4)).toString().replace('.', ',');
  }
}

/**
 * Formate un nombre en texte brut lisible pour l'exportation et le presse-papiers.
 *
 * @param {number} val - Valeur numérique brute.
 * @param {string} [type='general'] - Type de valeur.
 * @param {number} [digits=3] - Nombre de décimales en exponentielle.
 * @returns {string} Chaîne textuelle standardisée.
 */
function formatNumberPlain(val, type = 'general', digits = 3) {
  if (val === null || val === undefined || isNaN(val)) {
    return '—';
  }
  if (type === 'pH') {
    return val.toFixed(2).replace('.', ',');
  }
  if (type === 'tau') {
    const dec = (val < 0.01) ? val.toPrecision(3).replace('.', ',') : val.toFixed(4).replace('.', ',');
    const pct = (val * 100).toFixed(2).replace('.', ',') + ' %';
    return `${dec} (soit ${pct})`;
  }
  if (val === 0) {
    return '0';
  }

  const abs = Math.abs(val);
  if (abs < 0.01 || abs > 1000) {
    const expStr = val.toExponential(digits);
    const [mantissa, exponent] = expStr.split('e');
    return `${mantissa.replace('.', ',')} × 10^(${parseInt(exponent, 10)})`;
  }
  return Number(val.toPrecision(4)).toString().replace('.', ',');
}
