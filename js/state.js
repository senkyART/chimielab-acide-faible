/* js/state.js — Objet d'état global de l'application ChimieLab */

const state = {
  mode: 1,
  lambdaUnit: 'mS', // 'mS' ou 'S'
  sigmaUnit: 'S/m', // 'S/m' ou 'mS/m'
  lambdaH3O_SI: 0.035, // Valeur par défaut = 0.035 S·m²·mol⁻¹ (35.0 mS·m²·mol⁻¹)
  lastResult: null,
  history: []
};
