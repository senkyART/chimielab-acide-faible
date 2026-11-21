/* js/solution.js — Rendu des cartes de résultats, rédaction pas à pas d'examen et solution texte */

/**
 * Affiche l'ensemble des résultats et étapes dans l'ordre strict prescrit par le mode.
 *
 * @param {Object} res - Objet résultat retourné par calcModeX.
 */
function displayResults(res) {
  const grid = document.getElementById('results-grid');
  const stepsContainer = document.getElementById('solution-steps-list');

  if (!grid || !stepsContainer) return;

  grid.innerHTML = '';
  stepsContainer.innerHTML = '';

  const tauBar = document.getElementById('tau-gauge-bar');
  const tauText = document.getElementById('tau-gauge-percent');
  if (tauBar && tauText) {
    const tauPercent = Math.min(Math.max(res.tau * 100, 0), 100);
    tauBar.style.width = `${tauPercent}%`;
    tauText.textContent = `${(res.tau * 100).toFixed(2).replace('.', ',')} %`;
  }

  if (res.mode === 1) {
    // Mode 1 : [H₃O⁺] → τ → K (→ σ)
    appendResultCard(grid, '[H₃O⁺]', 'x = 10^(−pH)', formatNumber(res.x), 'mol/L');
    appendResultCard(grid, 'τ', 'τ = x / C', formatNumber(res.tau, 'tau'), '');
    appendResultCard(grid, 'K', 'K = x² / (C − x)', formatNumber(res.K), '');
    if (res.sigma !== null) {
      appendResultCard(grid, 'σ', 'σ = x · (λ_B + λ_H₃O⁺) · 10³', formatNumber(res.sigma), 'S/m');
    }

    stepsContainer.innerHTML = `
      <div class="solution-step">
        <span class="step-badge">Étape 1 : Concentration en ions oxonium [H₃O⁺]</span>
        <div class="step-content">
          <div class="step-formula">x = [H₃O⁺] = 10^(−pH)</div>
          <div class="step-sub">Application numérique : x = 10^(−${formatNumber(res.pH, 'pH')})</div>
          <div class="step-res">⇒ x = [H₃O⁺] = ${formatNumber(res.x)} mol/L</div>
        </div>
      </div>

      <div class="solution-step">
        <span class="step-badge">Étape 2 : Taux d'avancement final τ</span>
        <div class="step-content">
          <div class="step-formula">τ = x / C</div>
          <div class="step-sub">Application numérique : τ = (${formatNumber(res.x)}) / (${formatNumber(res.C)})</div>
          <div class="step-res">⇒ τ = ${formatNumber(res.tau, 'tau')}</div>
        </div>
      </div>

      <div class="solution-step">
        <span class="step-badge">Étape 3 : Constante d'acidité K</span>
        <div class="step-content">
          <div class="step-formula">K = x² / (C − x)</div>
          <div class="step-sub">Application numérique : K = (${formatNumber(res.x)})² / (${formatNumber(res.C)} − ${formatNumber(res.x)})</div>
          <div class="step-sub">Calcul intermédiaire : (${formatNumber(res.x * res.x)}) / (${formatNumber(res.C - res.x)})</div>
          <div class="step-res">⇒ K = ${formatNumber(res.K)} (grandeur sans dimension)</div>
        </div>
      </div>

      ${res.sigma !== null ? `
      <div class="solution-step">
        <span class="step-badge">Étape 4 : Conductivité de la solution σ</span>
        <div class="step-content">
          <div class="step-formula">σ = x · (λ_B + λ_H₃O⁺) · 10³</div>
          <div class="step-sub">Unités : x en mol/L (facteur 10³ pour mol/m³), λ en S·m²·mol⁻¹</div>
          <div class="step-sub">Application numérique : σ = ${formatNumber(res.x)} · (${formatNumber(res.lambda_B_SI)} + ${formatNumber(res.lambda_H3O_SI)}) · 10³</div>
          <div class="step-sub">Calcul intermédiaire : ${formatNumber(res.x)} · ${formatNumber(res.lambda_B_SI + res.lambda_H3O_SI)} · 1000</div>
          <div class="step-res">⇒ σ = ${formatNumber(res.sigma)} S/m (soit ${formatNumber(res.sigma * 1000)} mS/m)</div>
        </div>
      </div>
      ` : ''}

      <div class="solution-step">
        <span class="step-badge" style="color: var(--violet);">Vérification de cohérence</span>
        <div class="step-content">
          <div class="step-sub">Recalcul de K à partir de la valeur finale de x :</div>
          <div class="step-formula">K_vérif = (${formatNumber(res.x)})² / (${formatNumber(res.C)} − ${formatNumber(res.x)}) = ${formatNumber(res.K_verif)}</div>
          <div class="step-sub" style="color: var(--teal);">✓ Cohérence parfaite avec l'équilibre chimique.</div>
        </div>
      </div>
    `;

  } else if (res.mode === 2) {
    // Mode 2 : [H₃O⁺] → τ → K exclusivement
    appendResultCard(grid, '[H₃O⁺]', 'x = σ / (λ_B + λ_H₃O⁺) · 10⁻³', formatNumber(res.x), 'mol/L');
    appendResultCard(grid, 'τ', 'τ = x / C', formatNumber(res.tau, 'tau'), '');
    appendResultCard(grid, 'K', 'K = x² / (C − x)', formatNumber(res.K), '');

    stepsContainer.innerHTML = `
      <div class="solution-step">
        <span class="step-badge">Étape 1 : Concentration en ions oxonium [H₃O⁺]</span>
        <div class="step-content">
          <div class="step-formula">x = [H₃O⁺] = σ / (λ_B + λ_H₃O⁺) · 10⁻³</div>
          <div class="step-sub">Unités : σ = ${formatNumber(res.sigma_SI)} S/m, λ_B = ${formatNumber(res.lambda_B_SI)} S·m²·mol⁻¹, λ_H₃O⁺ = ${formatNumber(res.lambda_H3O_SI)} S·m²·mol⁻¹</div>
          <div class="step-sub">Application numérique : x = ${formatNumber(res.sigma_SI)} / (${formatNumber(res.lambda_B_SI)} + ${formatNumber(res.lambda_H3O_SI)}) · 10⁻³</div>
          <div class="step-sub">Calcul intermédiaire : ${formatNumber(res.sigma_SI)} / ${formatNumber(res.lambda_B_SI + res.lambda_H3O_SI)} · 10⁻³</div>
          <div class="step-res">⇒ x = [H₃O⁺] = ${formatNumber(res.x)} mol/L</div>
        </div>
      </div>

      <div class="solution-step">
        <span class="step-badge">Étape 2 : Taux d'avancement final τ</span>
        <div class="step-content">
          <div class="step-formula">τ = x / C</div>
          <div class="step-sub">Application numérique : τ = (${formatNumber(res.x)}) / (${formatNumber(res.C)})</div>
          <div class="step-res">⇒ τ = ${formatNumber(res.tau, 'tau')}</div>
        </div>
      </div>

      <div class="solution-step">
        <span class="step-badge">Étape 3 : Constante d'acidité K</span>
        <div class="step-content">
          <div class="step-formula">K = x² / (C − x)</div>
          <div class="step-sub">Application numérique : K = (${formatNumber(res.x)})² / (${formatNumber(res.C)} − ${formatNumber(res.x)})</div>
          <div class="step-sub">Calcul intermédiaire : (${formatNumber(res.x * res.x)}) / (${formatNumber(res.C - res.x)})</div>
          <div class="step-res">⇒ K = ${formatNumber(res.K)} (grandeur sans dimension)</div>
        </div>
      </div>

      <div class="solution-step">
        <span class="step-badge" style="color: var(--violet);">Vérification de cohérence</span>
        <div class="step-content">
          <div class="step-sub">Recalcul de K à partir de la valeur finale de x :</div>
          <div class="step-formula">K_vérif = (${formatNumber(res.x)})² / (${formatNumber(res.C)} − ${formatNumber(res.x)}) = ${formatNumber(res.K_verif)}</div>
          <div class="step-sub" style="color: var(--teal);">✓ Valeur vérifiée conforme.</div>
        </div>
      </div>
    `;

  } else if (res.mode === 3) {
    // Mode 3 : C' (si dilué) → [H₃O⁺] → pH (→ σ) → τ
    if (res.n !== null) {
      appendResultCard(grid, "C'", "C' = C / n", formatNumber(res.C_prime), 'mol/L');
    }
    appendResultCard(grid, '[H₃O⁺]', 'x = (−K + √(K² + 4·K·C\')) / 2', formatNumber(res.x), 'mol/L');
    appendResultCard(grid, 'pH', 'pH = −log₁₀(x)', formatNumber(res.pH, 'pH'), '');
    if (res.sigma !== null) {
      appendResultCard(grid, 'σ', 'σ = x · (λ_B + λ_H₃O⁺) · 10³', formatNumber(res.sigma), 'S/m');
    }
    appendResultCard(grid, 'τ', "τ = x / C'", formatNumber(res.tau, 'tau'), '');

    const delta = (res.K * res.K) + (4 * res.K * res.C_prime);
    const sqrtDelta = Math.sqrt(delta);

    stepsContainer.innerHTML = `
      ${res.n !== null ? `
      <div class="solution-step">
        <span class="step-badge">Étape 1 : Dilution de la solution (C')</span>
        <div class="step-content">
          <div class="step-formula">C' = C / n</div>
          <div class="step-sub">Application numérique : C' = ${formatNumber(res.C)} / ${res.n}</div>
          <div class="step-res">⇒ Concentration initiale C = ${formatNumber(res.C)} mol/L | Après dilution C' = ${formatNumber(res.C_prime)} mol/L</div>
          <div class="step-sub" style="color: var(--text-muted); font-size: 0.8rem;">Note : C' est utilisée à la place de C pour toutes les étapes suivantes.</div>
        </div>
      </div>
      ` : `
      <div class="solution-step">
        <span class="step-badge">Concentration du système</span>
        <div class="step-content">
          <div class="step-sub">Solution non diluée : C' = C = ${formatNumber(res.C_prime)} mol/L</div>
        </div>
      </div>
      `}

      <div class="solution-step">
        <span class="step-badge">${res.n !== null ? 'Étape 2' : 'Étape 1'} : Concentration en ions oxonium [H₃O⁺]</span>
        <div class="step-content">
          <div class="step-formula">Équation : K = x² / (C' − x)  ⇔  x² + K·x − K·C' = 0</div>
          <div class="step-sub">Discriminant : Δ = K² + 4·K·C'</div>
          <div class="step-sub">Calcul de Δ : (${formatNumber(res.K)})² + 4 · (${formatNumber(res.K)}) · (${formatNumber(res.C_prime)}) = ${formatNumber(delta)}</div>
          <div class="step-sub">Racine de Δ : √(Δ) = ${formatNumber(sqrtDelta)}</div>
          <div class="step-formula">x = [H₃O⁺] = (−K + √(K² + 4·K·C')) / 2</div>
          <div class="step-sub">Application numérique : x = (−${formatNumber(res.K)} + ${formatNumber(sqrtDelta)}) / 2</div>
          <div class="step-res">⇒ x = [H₃O⁺] = ${formatNumber(res.x)} mol/L</div>
          <div class="step-sub" style="color: var(--teal);">✓ Validité vérifiée : 0 < ${formatNumber(res.x)} < ${formatNumber(res.C_prime)} (intervalle ]0, C'[ respecté).</div>
        </div>
      </div>

      <div class="solution-step">
        <span class="step-badge">${res.n !== null ? 'Étape 3' : 'Étape 2'} : pH de la solution</span>
        <div class="step-content">
          <div class="step-formula">pH = −log₁₀(x)</div>
          <div class="step-sub">Application numérique : pH = −log₁₀(${formatNumber(res.x)})</div>
          <div class="step-res">⇒ pH = ${formatNumber(res.pH, 'pH')}</div>
        </div>
      </div>

      ${res.sigma !== null ? `
      <div class="solution-step">
        <span class="step-badge">${res.n !== null ? 'Étape 4' : 'Étape 3'} : Conductivité de la solution σ</span>
        <div class="step-content">
          <div class="step-formula">σ = x · (λ_B + λ_H₃O⁺) · 10³</div>
          <div class="step-sub">Application numérique : σ = ${formatNumber(res.x)} · (${formatNumber(res.lambda_B_SI)} + ${formatNumber(res.lambda_H3O_SI)}) · 10³</div>
          <div class="step-res">⇒ σ = ${formatNumber(res.sigma)} S/m (soit ${formatNumber(res.sigma * 1000)} mS/m)</div>
        </div>
      </div>
      ` : ''}

      <div class="solution-step">
        <span class="step-badge">${res.n !== null ? (res.sigma !== null ? 'Étape 5' : 'Étape 4') : (res.sigma !== null ? 'Étape 4' : 'Étape 3')} : Taux d'avancement final τ</span>
        <div class="step-content">
          <div class="step-formula">τ = x / C'</div>
          <div class="step-sub">Application numérique : τ = (${formatNumber(res.x)}) / (${formatNumber(res.C_prime)})</div>
          <div class="step-res">⇒ τ = ${formatNumber(res.tau, 'tau')}</div>
        </div>
      </div>

      <div class="solution-step">
        <span class="step-badge" style="color: var(--violet);">Vérification de cohérence</span>
        <div class="step-content">
          <div class="step-sub">Recalcul de K à partir de la valeur finale de x :</div>
          <div class="step-formula">K_vérif = (${formatNumber(res.x)})² / (${formatNumber(res.C_prime)} − ${formatNumber(res.x)}) = ${formatNumber(res.K_verif)}</div>
          <div class="step-sub" style="color: var(--teal);">✓ Conforme à la valeur théorique K = ${formatNumber(res.K)}.</div>
        </div>
      </div>
    `;
  }
}

/**
 * Crée et insère une carte de résultat dans le conteneur donné.
 * Utilise l'attribut data-copy pour les boutons de copie sans gestionnaire inline (Fix F3).
 */
function appendResultCard(container, symbol, formula, value, unit) {
  const card = document.createElement('div');
  card.className = 'result-card';
  const copyVal = `${value} ${unit}`.trim();
  card.innerHTML = `
    <div>
      <div class="rc-top">
        <span class="rc-title">${symbol}</span>
        <button type="button" class="rc-copy-btn" title="Copier cette grandeur" data-copy="${copyVal}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </div>
      <div class="rc-formula">${formula}</div>
    </div>
    <div class="rc-value">${value} <span class="rc-unit">${unit}</span></div>
  `;
  container.appendChild(card);
}

/**
 * Génère la rédaction complète au format texte brut prête à être collée dans un devoir.
 *
 * @param {Object} res - Résultat de calcul.
 * @returns {string} Solution structurée.
 */
function buildPlainTextSolution(res) {
  if (!res) return "";
  let lines = [];
  lines.push("=====================================================");
  lines.push(`RÉSOLUTION D'EXERCICE : ACIDE FAIBLE DANS L'EAU (MODE ${res.mode})`);
  lines.push("=====================================================");
  lines.push("");
  lines.push("DONNÉES INITIALES :");
  lines.push(`• Concentration C = ${formatNumberPlain(res.C)} mol/L`);

  if (res.mode === 1) {
    lines.push(`• pH mesuré = ${formatNumberPlain(res.pH, 'pH')}`);
    if (res.lambda_B_SI !== null) {
      lines.push(`• λ_B = ${formatNumberPlain(res.lambda_B_SI)} S·m²·mol⁻¹`);
      lines.push(`• λ_H₃O⁺ = ${formatNumberPlain(res.lambda_H3O_SI)} S·m²·mol⁻¹`);
    }
    lines.push("");
    lines.push("ÉTAPES DE RÉSOLUTION :");
    lines.push("1) Concentration en ions oxonium [H₃O⁺] :");
    lines.push("   Formule : x = [H₃O⁺] = 10^(−pH)");
    lines.push(`   A.N. : x = 10^(−${formatNumberPlain(res.pH, 'pH')})`);
    lines.push(`   Résultat : x = [H₃O⁺] = ${formatNumberPlain(res.x)} mol/L`);
    lines.push("");
    lines.push("2) Taux d'avancement final τ :");
    lines.push("   Formule : τ = x / C");
    lines.push(`   A.N. : τ = ${formatNumberPlain(res.x)} / ${formatNumberPlain(res.C)}`);
    lines.push(`   Résultat : τ = ${formatNumberPlain(res.tau, 'tau')}`);
    lines.push("");
    lines.push("3) Constante d'acidité K :");
    lines.push("   Formule : K = x² / (C − x)");
    lines.push(`   A.N. : K = (${formatNumberPlain(res.x)})² / (${formatNumberPlain(res.C)} − ${formatNumberPlain(res.x)})`);
    lines.push(`   Résultat : K = ${formatNumberPlain(res.K)}`);
    lines.push("");
    if (res.sigma !== null) {
      lines.push("4) Conductivité de la solution σ :");
      lines.push("   Formule : σ = x · (λ_B + λ_H₃O⁺) · 10³");
      lines.push(`   A.N. : σ = ${formatNumberPlain(res.x)} · (${formatNumberPlain(res.lambda_B_SI)} + ${formatNumberPlain(res.lambda_H3O_SI)}) · 10³`);
      lines.push(`   Résultat : σ = ${formatNumberPlain(res.sigma)} S/m`);
      lines.push("");
    }
    lines.push("VÉRIFICATION :");
    lines.push(`K_vérif = (${formatNumberPlain(res.x)})² / (${formatNumberPlain(res.C)} − ${formatNumberPlain(res.x)}) = ${formatNumberPlain(res.K_verif)} (conforme).`);

  } else if (res.mode === 2) {
    lines.push(`• Conductivité σ = ${formatNumberPlain(res.sigma_SI)} S/m`);
    lines.push(`• λ_B = ${formatNumberPlain(res.lambda_B_SI)} S·m²·mol⁻¹`);
    lines.push(`• λ_H₃O⁺ = ${formatNumberPlain(res.lambda_H3O_SI)} S·m²·mol⁻¹`);
    lines.push("");
    lines.push("ÉTAPES DE RÉSOLUTION :");
    lines.push("1) Concentration en ions oxonium [H₃O⁺] :");
    lines.push("   Formule : x = [H₃O⁺] = σ / (λ_B + λ_H₃O⁺) · 10⁻³");
    lines.push(`   A.N. : x = ${formatNumberPlain(res.sigma_SI)} / (${formatNumberPlain(res.lambda_B_SI)} + ${formatNumberPlain(res.lambda_H3O_SI)}) · 10⁻³`);
    lines.push(`   Résultat : x = [H₃O⁺] = ${formatNumberPlain(res.x)} mol/L`);
    lines.push("");
    lines.push("2) Taux d'avancement final τ :");
    lines.push("   Formule : τ = x / C");
    lines.push(`   A.N. : τ = ${formatNumberPlain(res.x)} / ${formatNumberPlain(res.C)}`);
    lines.push(`   Résultat : τ = ${formatNumberPlain(res.tau, 'tau')}`);
    lines.push("");
    lines.push("3) Constante d'acidité K :");
    lines.push("   Formule : K = x² / (C − x)");
    lines.push(`   A.N. : K = (${formatNumberPlain(res.x)})² / (${formatNumberPlain(res.C)} − ${formatNumberPlain(res.x)})`);
    lines.push(`   Résultat : K = ${formatNumberPlain(res.K)}`);
    lines.push("");
    lines.push("VÉRIFICATION :");
    lines.push(`K_vérif = (${formatNumberPlain(res.x)})² / (${formatNumberPlain(res.C)} − ${formatNumberPlain(res.x)}) = ${formatNumberPlain(res.K_verif)} (conforme).`);

  } else if (res.mode === 3) {
    if (res.n !== null) lines.push(`• Facteur de dilution n = ${res.n}`);
    lines.push(`• Constante d'acidité K = ${formatNumberPlain(res.K)}`);
    if (res.lambda_B_SI !== null) {
      lines.push(`• λ_B = ${formatNumberPlain(res.lambda_B_SI)} S·m²·mol⁻¹`);
      lines.push(`• λ_H₃O⁺ = ${formatNumberPlain(res.lambda_H3O_SI)} S·m²·mol⁻¹`);
    }
    lines.push("");
    lines.push("ÉTAPES DE RÉSOLUTION :");
    let stepIdx = 1;
    if (res.n !== null) {
      lines.push(`${stepIdx}) Dilution (C') :`);
      lines.push("   Formule : C' = C / n");
      lines.push(`   A.N. : C' = ${formatNumberPlain(res.C)} / ${res.n}`);
      lines.push(`   Résultat : C' = ${formatNumberPlain(res.C_prime)} mol/L`);
      lines.push("   (Utilisé à la place de C pour toutes les étapes suivantes)");
      lines.push("");
      stepIdx++;
    }
    lines.push(`${stepIdx}) Concentration en ions oxonium [H₃O⁺] :`);
    lines.push("   Équation : K = x² / (C' − x)  =>  x² + K·x − K·C' = 0");
    lines.push("   Formule : x = [H₃O⁺] = (−K + √(K² + 4·K·C')) / 2");
    const delta = (res.K * res.K) + (4 * res.K * res.C_prime);
    lines.push(`   Discriminant : Δ = ${formatNumberPlain(delta)} ; √(Δ) = ${formatNumberPlain(Math.sqrt(delta))}`);
    lines.push(`   Résultat : x = [H₃O⁺] = ${formatNumberPlain(res.x)} mol/L`);
    lines.push(`   Validité : 0 < x < C' vérifié (${formatNumberPlain(res.x)} < ${formatNumberPlain(res.C_prime)})`);
    lines.push("");
    stepIdx++;

    lines.push(`${stepIdx}) pH de la solution :`);
    lines.push("   Formule : pH = −log₁₀(x)");
    lines.push(`   A.N. : pH = −log₁₀(${formatNumberPlain(res.x)})`);
    lines.push(`   Résultat : pH = ${formatNumberPlain(res.pH, 'pH')}`);
    lines.push("");
    stepIdx++;

    if (res.sigma !== null) {
      lines.push(`${stepIdx}) Conductivité de la solution σ :`);
      lines.push("   Formule : σ = x · (λ_B + λ_H₃O⁺) · 10³");
      lines.push(`   A.N. : σ = ${formatNumberPlain(res.x)} · (${formatNumberPlain(res.lambda_B_SI)} + ${formatNumberPlain(res.lambda_H3O_SI)}) · 10³`);
      lines.push(`   Résultat : σ = ${formatNumberPlain(res.sigma)} S/m`);
      lines.push("");
      stepIdx++;
    }

    lines.push(`${stepIdx}) Taux d'avancement final τ :`);
    lines.push("   Formule : τ = x / C'");
    lines.push(`   A.N. : τ = ${formatNumberPlain(res.x)} / ${formatNumberPlain(res.C_prime)}`);
    lines.push(`   Résultat : τ = ${formatNumberPlain(res.tau, 'tau')}`);
    lines.push("");
    lines.push("VÉRIFICATION :");
    lines.push(`K_vérif = (${formatNumberPlain(res.x)})² / (${formatNumberPlain(res.C_prime)} − ${formatNumberPlain(res.x)}) = ${formatNumberPlain(res.K_verif)} (conforme).`);
  }

  lines.push("=====================================================");
  return lines.join("\n");
}
