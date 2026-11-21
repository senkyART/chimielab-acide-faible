/* js/history.js — Gestion de l'historique en mémoire (5 derniers calculs) et rechargement */

/**
 * Ajoute un calcul réussi à l'historique en mémoire (max 5).
 *
 * @param {Object} res - Objet résultat retourné par calcModeX.
 */
function addToHistory(res) {
  if (!res) return;

  const timeStr = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  state.history.unshift({
    time: timeStr,
    mode: res.mode,
    C: res.C,
    pH: res.pH !== undefined ? res.pH : null,
    sigma_SI: res.sigma_SI !== undefined ? res.sigma_SI : null,
    sigma: res.sigma !== undefined ? res.sigma : null,
    K: res.K,
    tau: res.tau,
    x: res.x,
    n: res.n !== undefined ? res.n : null,
    C_prime: res.C_prime !== undefined ? res.C_prime : null,
    lambda_B_SI: res.lambda_B_SI !== undefined ? res.lambda_B_SI : null,
    lambda_H3O_SI: res.lambda_H3O_SI !== undefined ? res.lambda_H3O_SI : null,
    lambdaUnit: state.lambdaUnit,
    sigmaUnit: state.sigmaUnit
  });

  if (state.history.length > 5) {
    state.history.pop();
  }

  renderHistory();
}

/**
 * Affiche les 5 derniers calculs dans l'interface.
 */
function renderHistory() {
  const list = document.getElementById('history-list');
  const emptyState = document.getElementById('history-empty');
  const countBadge = document.getElementById('history-count-badge');

  if (countBadge) {
    countBadge.textContent = state.history.length;
    countBadge.style.display = state.history.length > 0 ? 'inline-block' : 'none';
  }

  if (!list) return;

  if (state.history.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    list.innerHTML = '';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  list.innerHTML = '';

  state.history.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'history-item';

    let summaryText = `C = ${formatNumberPlain(item.C)} mol/L`;
    if (item.mode === 1) {
      summaryText += ` · pH = ${formatNumberPlain(item.pH, 'pH')}`;
    } else if (item.mode === 2) {
      summaryText += ` · σ = ${formatNumberPlain(item.sigma_SI)} S/m`;
    } else if (item.mode === 3) {
      if (item.n) summaryText += ` · n = ${item.n}`;
      summaryText += ` · K = ${formatNumberPlain(item.K)}`;
    }
    summaryText += ` ⇒ x = ${formatNumberPlain(item.x)} mol/L · τ = ${(item.tau * 100).toFixed(2).replace('.', ',')}%`;

    row.innerHTML = `
      <div class="history-meta-group">
        <span class="history-time">[${item.time}]</span>
        <span class="history-mode-pill">MODE ${item.mode}</span>
        <span class="history-summary">${summaryText}</span>
      </div>
      <button type="button" class="btn-restore-history" data-history-index="${index}">
        Recharger
      </button>
    `;
    list.appendChild(row);
  });
}

/**
 * Restaure un calcul depuis l'historique sans duplication.
 *
 * @param {number} index - Position dans state.history.
 */
function restoreHistoryItem(index) {
  if (index < 0 || index >= state.history.length) return;
  const item = state.history[index];

  selectMode(item.mode);

  setTimeout(() => {
    const inpC = document.getElementById('inp-C');
    if (inpC) inpC.value = formatNumberPlain(item.C);

    if (item.mode === 1) {
      const inpPH = document.getElementById('inp-pH');
      if (inpPH && item.pH !== null) inpPH.value = formatNumberPlain(item.pH, 'pH');
    } else if (item.mode === 2) {
      const inpSigma = document.getElementById('inp-sigma');
      if (inpSigma && item.sigma_SI !== null) {
        const sVal = sigmaFromSI(item.sigma_SI, state.sigmaUnit);
        inpSigma.value = sVal.toString().replace('.', ',');
      }
    } else if (item.mode === 3) {
      const inpK = document.getElementById('inp-K');
      if (inpK) inpK.value = formatNumberPlain(item.K);
      const inpN = document.getElementById('inp-n');
      if (inpN) inpN.value = item.n ? item.n.toString() : '';
    }

    // Restauration de λ_B
    const inpLambdaB = document.getElementById('inp-lambdaB');
    if (inpLambdaB) {
      if (item.lambda_B_SI !== null) {
        const lB = lambdaFromSI(item.lambda_B_SI, state.lambdaUnit);
        inpLambdaB.value = lB.toString().replace('.', ',');
      } else {
        inpLambdaB.value = '';
      }
    }

    // Restauration de λ_H₃O⁺
    const inpLambdaH3O = document.getElementById('inp-lambdaH3O');
    if (inpLambdaH3O && item.lambda_H3O_SI !== null) {
      const lH3O = lambdaFromSI(item.lambda_H3O_SI, state.lambdaUnit);
      if (lH3O === 35 && state.lambdaUnit === 'mS') {
        inpLambdaH3O.value = "35.0";
      } else if (lH3O === 0.035 && state.lambdaUnit === 'S') {
        inpLambdaH3O.value = "0.035";
      } else {
        inpLambdaH3O.value = lH3O.toString().replace('.', ',');
      }
    }

    // Calcul immédiat sans réenregistrer de doublon
    triggerCalculate(false);
    showToast("Calcul restauré depuis l'historique.");
  }, 50);
}
