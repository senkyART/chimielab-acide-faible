/* js/history.js — Gestion de l'historique en mémoire (5 derniers calculs) et rechargement */

/**
 * Ajoute un résultat de calcul à l'historique en mémoire (max 5 éléments).
 *
 * @param {Object} res - Résultat issu de calcModeX.
 */
function addToHistory(res) {
  const timeStr = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  state.history.unshift({ time: timeStr, res });
  if (state.history.length > 5) {
    state.history.pop();
  }
  renderHistory();
}

/**
 * Affiche l'historique dans le DOM avec des attributs data-history-index (aucun JSON dans le HTML).
 */
function renderHistory() {
  const sec = document.getElementById('history-section');
  const list = document.getElementById('history-list');
  if (!sec || !list) return;

  if (state.history.length === 0) {
    sec.style.display = 'none';
    return;
  }

  sec.style.display = 'block';
  list.innerHTML = '';

  state.history.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'history-item';
    const r = item.res;
    const desc = `Mode ${r.mode} : C = ${formatNumber(r.C)} mol/L | x = ${formatNumber(r.x)} mol/L, τ = ${(r.tau * 100).toFixed(2).replace('.', ',')}%, K = ${formatNumber(r.K)}`;
    row.innerHTML = `
      <div>
        <span style="font-weight: 600; color: var(--teal); margin-right: 6px;">[${item.time}]</span>
        <span class="history-meta">${desc}</span>
      </div>
      <button type="button" class="btn btn-glass btn-sm history-restore-btn" data-history-index="${index}">Recharger</button>
    `;
    list.appendChild(row);
  });
}

/**
 * Recharge un calcul depuis l'historique selon son index sans créer de doublon.
 * Restaure σ selon l'unité courante et restaure λ_H₃O⁺.
 *
 * @param {number} index - Position dans state.history.
 */
function restoreHistoryItem(index) {
  if (index < 0 || index >= state.history.length) return;
  const item = state.history[index];
  const r = item.res;

  selectMode(r.mode);

  setTimeout(() => {
    // Restauration de la concentration C
    const inpC = document.getElementById('inp-C');
    if (inpC) inpC.value = formatNumberPlain(r.C);

    // Restauration spécifique selon le mode
    if (r.mode === 1) {
      const inpPH = document.getElementById('inp-pH');
      if (inpPH) inpPH.value = formatNumberPlain(r.pH, 'pH');
    } else if (r.mode === 2) {
      const inpSigma = document.getElementById('inp-sigma');
      if (inpSigma) {
        // Fix F6 : Conversion de σ vers l'unité de conductivité actuellement sélectionnée
        const sigmaVal = sigmaFromSI(r.sigma_SI, state.sigmaUnit);
        inpSigma.value = sigmaVal.toString().replace('.', ',');
      }
    } else if (r.mode === 3) {
      const inpK = document.getElementById('inp-K');
      if (inpK) inpK.value = formatNumberPlain(r.K);

      const inpN = document.getElementById('inp-n');
      if (inpN) inpN.value = r.n !== null ? r.n.toString() : '';
    }

    // Restauration de λ_B
    const inpLambdaB = document.getElementById('inp-lambdaB');
    if (inpLambdaB) {
      if (r.lambda_B_SI !== null) {
        const lB = lambdaFromSI(r.lambda_B_SI, state.lambdaUnit);
        inpLambdaB.value = lB.toString().replace('.', ',');
      } else {
        inpLambdaB.value = '';
      }
    }

    // Restauration de λ_H₃O⁺
    const inpLambdaH3O = document.getElementById('inp-lambdaH3O');
    if (inpLambdaH3O) {
      const lH3O = lambdaFromSI(r.lambda_H3O_SI, state.lambdaUnit);
      if (lH3O === 35 && state.lambdaUnit === 'mS') {
        inpLambdaH3O.value = "35.0";
      } else if (lH3O === 0.035 && state.lambdaUnit === 'S') {
        inpLambdaH3O.value = "0.035";
      } else {
        inpLambdaH3O.value = lH3O.toString().replace('.', ',');
      }
    }

    // Déclenche le calcul sans enregistrer un doublon dans l'historique (Fix F6)
    triggerCalculate(false, false);
    showToast("Calcul rechargé depuis l'historique.");
  }, 50);
}
