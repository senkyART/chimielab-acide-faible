/* js/form.js — Gestion du formulaire de saisie, écouteurs d'événements et calcul en direct */

/**
 * Génère et insère les champs de saisie correspondant au mode actif.
 */
function renderFormInputs() {
  const container = document.getElementById('inputs-container');
  const title = document.getElementById('form-title');
  if (!container || !title) return;

  container.innerHTML = '';

  // Affichage initial de la valeur par défaut de λ_H₃O⁺ selon l'unité (Fix F4)
  const lambdaH3ODisplay = (state.lambdaUnit === 'mS') ? "35.0" : "0.035";

  if (state.mode === 1) {
    title.textContent = "Paramètres de l'exercice — Mode 1 (C et pH)";
    container.innerHTML = `
      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-C">Concentration initiale C</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-C" class="input-field" placeholder="ex: 1.0e-2 ou 0,01" value="1.0e-2">
          <span class="unit-badge">mol/L</span>
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-pH">pH mesuré</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-pH" class="input-field" placeholder="ex: 3.41" value="3.41">
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-lambdaB">Conductivité molaire λ_B</label>
          <span class="optional-tag">optionnel</span>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-lambdaB" class="input-field" placeholder="ex: 4.09 (pour σ)">
          <select id="sel-lambda-unit" class="unit-select">
            <option value="mS" ${state.lambdaUnit === 'mS' ? 'selected' : ''}>mS·m²·mol⁻¹</option>
            <option value="S" ${state.lambdaUnit === 'S' ? 'selected' : ''}>S·m²·mol⁻¹</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-lambdaH3O">Conductivité molaire λ_H₃O⁺</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-lambdaH3O" class="input-field" value="${lambdaH3ODisplay}">
          <span class="unit-badge" id="lbl-lambdaH3O-unit">${state.lambdaUnit === 'mS' ? 'mS·m²·mol⁻¹' : 'S·m²·mol⁻¹'}</span>
        </div>
      </div>
    `;
  } else if (state.mode === 2) {
    title.textContent = "Paramètres de l'exercice — Mode 2 (C et Conductimétrie)";
    container.innerHTML = `
      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-C">Concentration initiale C</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-C" class="input-field" placeholder="ex: 1.0e-2 ou 0,01" value="1.0e-2">
          <span class="unit-badge">mol/L</span>
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-sigma">Conductivité de la solution σ</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-sigma" class="input-field" placeholder="ex: 0.0152 ou 15,2" value="0.0152">
          <select id="sel-sigma-unit" class="unit-select">
            <option value="S/m" ${state.sigmaUnit === 'S/m' ? 'selected' : ''}>S/m</option>
            <option value="mS/m" ${state.sigmaUnit === 'mS/m' ? 'selected' : ''}>mS/m</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-lambdaB">Conductivité molaire λ_B</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-lambdaB" class="input-field" placeholder="ex: 4.09" value="${state.lambdaUnit === 'mS' ? '4.09' : '0.00409'}">
          <select id="sel-lambda-unit" class="unit-select">
            <option value="mS" ${state.lambdaUnit === 'mS' ? 'selected' : ''}>mS·m²·mol⁻¹</option>
            <option value="S" ${state.lambdaUnit === 'S' ? 'selected' : ''}>S·m²·mol⁻¹</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-lambdaH3O">Conductivité molaire λ_H₃O⁺</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-lambdaH3O" class="input-field" value="${lambdaH3ODisplay}">
          <span class="unit-badge" id="lbl-lambdaH3O-unit">${state.lambdaUnit === 'mS' ? 'mS·m²·mol⁻¹' : 'S·m²·mol⁻¹'}</span>
        </div>
      </div>
    `;
  } else if (state.mode === 3) {
    title.textContent = "Paramètres de l'exercice — Mode 3 (C et K)";
    container.innerHTML = `
      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-C">Concentration initiale C</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-C" class="input-field" placeholder="ex: 1.0e-2 ou 0,01" value="1.0e-2">
          <span class="unit-badge">mol/L</span>
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-K">Constante d'acidité K</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-K" class="input-field" placeholder="ex: 1.58e-5" value="1.58e-5">
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-n">Facteur de dilution n</label>
          <span class="optional-tag">optionnel (C' = C / n)</span>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-n" class="input-field" placeholder="ex: 10 pour C/10">
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-lambdaB">Conductivité molaire λ_B</label>
          <span class="optional-tag">optionnel (pour σ)</span>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-lambdaB" class="input-field" placeholder="ex: 4.09">
          <select id="sel-lambda-unit" class="unit-select">
            <option value="mS" ${state.lambdaUnit === 'mS' ? 'selected' : ''}>mS·m²·mol⁻¹</option>
            <option value="S" ${state.lambdaUnit === 'S' ? 'selected' : ''}>S·m²·mol⁻¹</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <div class="input-label-row">
          <label for="inp-lambdaH3O">Conductivité molaire λ_H₃O⁺</label>
        </div>
        <div class="input-wrapper">
          <input type="text" id="inp-lambdaH3O" class="input-field" value="${lambdaH3ODisplay}">
          <span class="unit-badge" id="lbl-lambdaH3O-unit">${state.lambdaUnit === 'mS' ? 'mS·m²·mol⁻¹' : 'S·m²·mol⁻¹'}</span>
        </div>
      </div>
    `;
  }

  attachInputListeners();
}

/**
 * Attache les écouteurs d'événements aux champs de formulaire et sélecteurs d'unités.
 */
function attachInputListeners() {
  // Sélecteur d'unité λ (Fix F4 : conversion exacte sans perte de chiffres via cleanFloat)
  const selLambda = document.getElementById('sel-lambda-unit');
  if (selLambda) {
    selLambda.addEventListener('change', (e) => {
      const oldUnit = state.lambdaUnit;
      const newUnit = e.target.value;
      if (oldUnit === newUnit) return;
      state.lambdaUnit = newUnit;

      // Conversion de λ_H₃O⁺
      const inpLambdaH3O = document.getElementById('inp-lambdaH3O');
      if (inpLambdaH3O) {
        const currentVal = parseNumber(inpLambdaH3O.value);
        if (!isNaN(currentVal)) {
          const valSI = lambdaToSI(currentVal, oldUnit);
          const converted = lambdaFromSI(valSI, newUnit);
          if (converted === 35 && newUnit === 'mS') {
            inpLambdaH3O.value = "35.0";
          } else if (converted === 0.035 && newUnit === 'S') {
            inpLambdaH3O.value = "0.035";
          } else {
            inpLambdaH3O.value = converted.toString().replace('.', ',');
          }
        }
      }

      const lblUnit = document.getElementById('lbl-lambdaH3O-unit');
      if (lblUnit) {
        lblUnit.textContent = (newUnit === 'mS') ? 'mS·m²·mol⁻¹' : 'S·m²·mol⁻¹';
      }

      // Conversion de λ_B s'il est renseigné
      const inpLambdaB = document.getElementById('inp-lambdaB');
      if (inpLambdaB && inpLambdaB.value.trim() !== '') {
        const bVal = parseNumber(inpLambdaB.value);
        if (!isNaN(bVal)) {
          const bSI = lambdaToSI(bVal, oldUnit);
          const convB = lambdaFromSI(bSI, newUnit);
          inpLambdaB.value = convB.toString().replace('.', ',');
        }
      }

      triggerCalculate(true, false);
    });
  }

  // Sélecteur d'unité σ (Fix F4)
  const selSigma = document.getElementById('sel-sigma-unit');
  if (selSigma) {
    selSigma.addEventListener('change', (e) => {
      const oldUnit = state.sigmaUnit;
      const newUnit = e.target.value;
      if (oldUnit === newUnit) return;
      state.sigmaUnit = newUnit;

      const inpSigma = document.getElementById('inp-sigma');
      if (inpSigma && inpSigma.value.trim() !== '') {
        const sVal = parseNumber(inpSigma.value);
        if (!isNaN(sVal)) {
          const sSI = sigmaToSI(sVal, oldUnit);
          const convS = sigmaFromSI(sSI, newUnit);
          inpSigma.value = convS.toString().replace('.', ',');
        }
      }

      triggerCalculate(true, false);
    });
  }

  // Écoute des saisies pour calcul en direct et touche Entrée
  const inputs = document.querySelectorAll('.input-field');
  inputs.forEach(input => {
    input.addEventListener('input', () => triggerCalculate(true, false));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerCalculate(false, true);
      }
    });
  });
}

/**
 * Déclenche le calcul, la validation stricte et la mise à jour de l'affichage.
 *
 * @param {boolean} [isLive=false] - Indique s'il s'agit d'une frappe en cours.
 * @param {boolean} [recordHistory=true] - Indique si le calcul doit être enregistré dans l'historique.
 */
function triggerCalculate(isLive = false, recordHistory = true) {
  const errBox = document.getElementById('error-box');
  const resSection = document.getElementById('results-section');
  if (!errBox || !resSection) return;

  try {
    const inpC = document.getElementById('inp-C');
    const C_raw = inpC ? parseNumber(inpC.value) : NaN;
    if (isNaN(C_raw) || C_raw <= 0) {
      throw new Error("La concentration C doit être un nombre strictement positif (> 0 mol/L).");
    }

    const inpLambdaH3O = document.getElementById('inp-lambdaH3O');
    const lambdaH3O_raw = inpLambdaH3O ? parseNumber(inpLambdaH3O.value) : NaN;
    if (isNaN(lambdaH3O_raw) || lambdaH3O_raw <= 0) {
      throw new Error("La conductivité molaire λ_H₃O⁺ doit être strictement positive (> 0).");
    }
    const lambda_H3O_SI = lambdaToSI(lambdaH3O_raw, state.lambdaUnit);

    // λ_B (optionnel en modes 1 et 3, obligatoire en mode 2)
    const inpLambdaB = document.getElementById('inp-lambdaB');
    let lambda_B_SI = null;
    if (inpLambdaB && inpLambdaB.value.trim() !== '') {
      const lB_raw = parseNumber(inpLambdaB.value);
      // Fix F5 : si λ_B est saisi mais invalide ou ≤ 0, lever une erreur explicite
      if (isNaN(lB_raw) || lB_raw <= 0) {
        throw new Error("La conductivité molaire λ_B saisie est invalide. Elle doit être strictement positive (> 0).");
      }
      lambda_B_SI = lambdaToSI(lB_raw, state.lambdaUnit);
    }

    let res = null;

    if (state.mode === 1) {
      const inpPH = document.getElementById('inp-pH');
      const pH_raw = inpPH ? parseNumber(inpPH.value) : NaN;
      if (isNaN(pH_raw) || !isFinite(pH_raw)) {
        throw new Error("Le pH doit être un nombre réel fini.");
      }

      res = calcMode1({
        C: C_raw,
        pH: pH_raw,
        lambda_B_SI,
        lambda_H3O_SI
      });

    } else if (state.mode === 2) {
      const inpSigma = document.getElementById('inp-sigma');
      const sigma_raw = inpSigma ? parseNumber(inpSigma.value) : NaN;
      if (isNaN(sigma_raw) || sigma_raw <= 0) {
        throw new Error("La conductivité σ doit être strictement positive (> 0).");
      }
      const sigma_SI = sigmaToSI(sigma_raw, state.sigmaUnit);

      if (lambda_B_SI === null) {
        throw new Error("En Mode 2, la conductivité molaire λ_B est requise et doit être strictement positive.");
      }

      res = calcMode2({
        C: C_raw,
        sigma_SI,
        lambda_B_SI,
        lambda_H3O_SI
      });

    } else if (state.mode === 3) {
      const inpK = document.getElementById('inp-K');
      const K_raw = inpK ? parseNumber(inpK.value) : NaN;
      if (isNaN(K_raw) || K_raw <= 0) {
        throw new Error("La constante d'équilibre K doit être un nombre strictement positif (> 0).");
      }

      const inpN = document.getElementById('inp-n');
      let n_raw = null;
      if (inpN && inpN.value.trim() !== '') {
        n_raw = parseNumber(inpN.value);
        // Fix F5 : si n est saisi mais invalide ou < 1, lever une erreur explicite
        if (isNaN(n_raw) || n_raw < 1) {
          throw new Error("Le facteur de dilution n doit être un nombre supérieur ou égal à 1 (n ≥ 1).");
        }
      }

      res = calcMode3({
        C: C_raw,
        K: K_raw,
        n: n_raw,
        lambda_B_SI,
        lambda_H3O_SI
      });
    }

    // Succès : mise à jour de l'affichage
    state.lastResult = res;
    errBox.style.display = 'none';
    errBox.textContent = '';
    resSection.style.display = 'block';

    displayResults(res);

    if (recordHistory && !isLive) {
      addToHistory(res);
    }

  } catch (err) {
    // Fix F7 : en cas d'erreur (même en direct), cacher les résultats obsolètes et afficher l'erreur
    state.lastResult = null;
    resSection.style.display = 'none';
    errBox.textContent = err.message || "Erreur lors du calcul.";
    errBox.style.display = 'block';
  }
}

/**
 * Sélectionne le mode actif (1, 2 ou 3) et met à jour l'interface.
 *
 * @param {number} m - Numéro du mode.
 */
function selectMode(m) {
  state.mode = m;
  document.querySelectorAll('.mode-card').forEach(c => {
    if (parseInt(c.getAttribute('data-mode'), 10) === m) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });
  renderFormInputs();
  triggerCalculate(true, false);
}
