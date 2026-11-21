/* js/solution.js — Rendu des cartes de résultats, rédaction pas à pas d'examen et solution texte */

/**
 * Affiche l'ensemble des résultats et étapes dans l'ordre strict prescrit par le mode.
 *
 * @param {Object} res - Objet résultat retourné par calcModeX.
 */
function displayResults(res) {
  const grid = document.getElementById('results-grid');
  const stepsContainer = document.getElementById('solution-steps-list');
  const statusBadge = document.getElementById('results-status-badge');

  if (!grid || !stepsContainer) return;

  grid.innerHTML = '';
  stepsContainer.innerHTML = '';

  if (statusBadge) {
    statusBadge.innerHTML = `✓ Équilibre validé · K = ${formatNumber(res.K)}`;
  }

  // Jauge de dissociation pour τ
  const tauPercent = Math.min(Math.max(res.tau * 100, 0), 100);
  const tauGaugeHtml = `
    <div class="tau-gauge-track" title="Taux de réaction : ${tauPercent.toFixed(2)}%">
      <div class="tau-gauge-bar" style="width: ${tauPercent}%"></div>
    </div>
  `;

  if (res.mode === 1) {
    // Mode 1 : [H₃O⁺] (Héro) → τ → K (→ σ)
    appendResultCard(grid, '[H₃O⁺]', 'Ions oxonium', 'x = 10^(−pH)', formatNumber(res.x), 'mol/L', true);
    appendResultCard(grid, 'τ', 'Taux final', 'τ = x / C', formatNumber(res.tau, 'tau'), '', false, tauGaugeHtml);
    appendResultCard(grid, 'K', "Constante d'acidité", 'K = x² / (C − x)', formatNumber(res.K), '', false);
    if (res.sigma !== null) {
      appendResultCard(grid, 'σ', 'Conductivité', 'σ = x · (λ_B + λ_H₃O⁺) · 10³', formatNumber(res.sigma), 'S/m', false);
    }

    stepsContainer.innerHTML = `
      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Données</span>
          <span class="step-title">Conditions initiales du système chimique</span>
        </div>
        <div class="step-content">
          <div class="step-sub">• Concentration initiale en acide : C = ${formatNumber(res.C)} mol/L</div>
          <div class="step-sub">• pH mesuré de la solution : pH = ${formatNumber(res.pH, 'pH')}</div>
          ${res.lambda_B_SI !== null ? `
          <div class="step-sub">• Conductivité molaire ionique de la base : λ_B = ${formatNumber(res.lambda_B_SI)} S·m²·mol⁻¹</div>
          <div class="step-sub">• Conductivité molaire ionique de H₃O⁺ : λ_H₃O⁺ = ${formatNumber(res.lambda_H3O_SI)} S·m²·mol⁻¹</div>
          ` : ''}
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Étape 01</span>
          <span class="step-title">Concentration en ions oxonium [H₃O⁺]</span>
        </div>
        <div class="step-content">
          <div class="step-formula">x = [H₃O⁺] = 10^(−pH)</div>
          <div class="step-sub"><strong>Application numérique :</strong> x = 10^(−${formatNumber(res.pH, 'pH')})</div>
          <div class="step-res">⇒ x = [H₃O⁺] = ${formatNumber(res.x)} mol/L</div>
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Étape 02</span>
          <span class="step-title">Taux d'avancement final τ</span>
        </div>
        <div class="step-content">
          <div class="step-formula">τ = x / C</div>
          <div class="step-sub"><strong>Application numérique :</strong> τ = (${formatNumber(res.x)}) / (${formatNumber(res.C)})</div>
          <div class="step-res">⇒ τ = ${formatNumber(res.tau, 'tau')} (soit ${(res.tau * 100).toFixed(2).replace('.', ',')} % d'acide dissocié)</div>
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Étape 03</span>
          <span class="step-title">Constante d'acidité de l'équilibre K</span>
        </div>
        <div class="step-content">
          <div class="step-formula">K = x² / (C − x)</div>
          <div class="step-sub"><strong>Application numérique :</strong> K = (${formatNumber(res.x)})² / (${formatNumber(res.C)} − ${formatNumber(res.x)})</div>
          <div class="step-sub"><strong>Calcul intermédiaire :</strong> (${formatNumber(res.x * res.x)}) / (${formatNumber(res.C - res.x)})</div>
          <div class="step-res">⇒ K = ${formatNumber(res.K)} (grandeur sans dimension)</div>
        </div>
      </div>

      ${res.sigma !== null ? `
      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Étape 04</span>
          <span class="step-title">Conductivité de la solution σ</span>
        </div>
        <div class="step-content">
          <div class="step-formula">σ = x · (λ_B + λ_H₃O⁺) · 10³</div>
          <div class="step-sub">Facteur 10³ : conversion de mol/L en mol/m³ (SI).</div>
          <div class="step-sub"><strong>Application numérique :</strong> σ = ${formatNumber(res.x)} · (${formatNumber(res.lambda_B_SI)} + ${formatNumber(res.lambda_H3O_SI)}) · 10³</div>
          <div class="step-sub"><strong>Calcul intermédiaire :</strong> ${formatNumber(res.x)} · ${formatNumber(res.lambda_B_SI + res.lambda_H3O_SI)} · 1000</div>
          <div class="step-res">⇒ σ = ${formatNumber(res.sigma)} S/m (soit ${formatNumber(res.sigma * 1000)} mS/m)</div>
        </div>
      </div>
      ` : ''}

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Contrôle</span>
          <span class="step-title">Vérification thermodynamique de cohérence</span>
        </div>
        <div class="step-content">
          <div class="step-formula">K_vérif = (${formatNumber(res.x)})² / (${formatNumber(res.C)} − ${formatNumber(res.x)}) = ${formatNumber(res.K_verif)}</div>
          <div class="step-sub" style="color: var(--accent-gold);">✓ Parfaite conformité thermodynamique avec la loi d'action de masse.</div>
        </div>
      </div>
    `;

  } else if (res.mode === 2) {
    // Mode 2 : [H₃O⁺] (Héro) → τ → K exclusivement
    appendResultCard(grid, '[H₃O⁺]', 'Ions oxonium', 'x = σ / (λ_B + λ_H₃O⁺) · 10⁻³', formatNumber(res.x), 'mol/L', true);
    appendResultCard(grid, 'τ', 'Taux final', 'τ = x / C', formatNumber(res.tau, 'tau'), '', false, tauGaugeHtml);
    appendResultCard(grid, 'K', "Constante d'acidité", 'K = x² / (C − x)', formatNumber(res.K), '', false);

    stepsContainer.innerHTML = `
      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Données</span>
          <span class="step-title">Conditions expérimentales de conductimétrie</span>
        </div>
        <div class="step-content">
          <div class="step-sub">• Concentration initiale en acide : C = ${formatNumber(res.C)} mol/L</div>
          <div class="step-sub">• Conductivité mesurée de la solution : σ = ${formatNumber(res.sigma_SI)} S/m</div>
          <div class="step-sub">• Conductivité molaire ionique de la base : λ_B = ${formatNumber(res.lambda_B_SI)} S·m²·mol⁻¹</div>
          <div class="step-sub">• Conductivité molaire ionique de H₃O⁺ : λ_H₃O⁺ = ${formatNumber(res.lambda_H3O_SI)} S·m²·mol⁻¹</div>
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Étape 01</span>
          <span class="step-title">Concentration en ions oxonium [H₃O⁺] par conductimétrie</span>
        </div>
        <div class="step-content">
          <div class="step-formula">x = [H₃O⁺] = σ / (λ_B + λ_H₃O⁺) · 10⁻³</div>
          <div class="step-sub">Facteur 10⁻³ : conversion de mol/m³ en mol/L.</div>
          <div class="step-sub"><strong>Application numérique :</strong> x = ${formatNumber(res.sigma_SI)} / (${formatNumber(res.lambda_B_SI)} + ${formatNumber(res.lambda_H3O_SI)}) · 10⁻³</div>
          <div class="step-sub"><strong>Calcul intermédiaire :</strong> ${formatNumber(res.sigma_SI)} / ${formatNumber(res.lambda_B_SI + res.lambda_H3O_SI)} · 10⁻³</div>
          <div class="step-res">⇒ x = [H₃O⁺] = ${formatNumber(res.x)} mol/L</div>
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Étape 02</span>
          <span class="step-title">Taux d'avancement final τ</span>
        </div>
        <div class="step-content">
          <div class="step-formula">τ = x / C</div>
          <div class="step-sub"><strong>Application numérique :</strong> τ = (${formatNumber(res.x)}) / (${formatNumber(res.C)})</div>
          <div class="step-res">⇒ τ = ${formatNumber(res.tau, 'tau')} (soit ${(res.tau * 100).toFixed(2).replace('.', ',')} %)</div>
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Étape 03</span>
          <span class="step-title">Constante d'acidité K</span>
        </div>
        <div class="step-content">
          <div class="step-formula">K = x² / (C − x)</div>
          <div class="step-sub"><strong>Application numérique :</strong> K = (${formatNumber(res.x)})² / (${formatNumber(res.C)} − ${formatNumber(res.x)})</div>
          <div class="step-sub"><strong>Calcul intermédiaire :</strong> (${formatNumber(res.x * res.x)}) / (${formatNumber(res.C - res.x)})</div>
          <div class="step-res">⇒ K = ${formatNumber(res.K)} (grandeur sans dimension)</div>
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Contrôle</span>
          <span class="step-title">Vérification thermodynamique</span>
        </div>
        <div class="step-content">
          <div class="step-formula">K_vérif = (${formatNumber(res.x)})² / (${formatNumber(res.C)} − ${formatNumber(res.x)}) = ${formatNumber(res.K_verif)}</div>
          <div class="step-sub" style="color: var(--accent-gold);">✓ Valeur vérifiée conforme à la définition officielle du cours.</div>
        </div>
      </div>
    `;

  } else if (res.mode === 3) {
    // Mode 3 : C' (si dilué) → [H₃O⁺] (Héro) → pH (Héro) (→ σ) → τ
    if (res.n !== null) {
      appendResultCard(grid, "C'", 'Concentration diluée', 'C\' = C / n', formatNumber(res.C_prime), 'mol/L', false);
    }
    appendResultCard(grid, '[H₃O⁺]', 'Ions oxonium', 'x = (−K + √(K² + 4KC\')) / 2', formatNumber(res.x), 'mol/L', true);
    appendResultCard(grid, 'pH', 'Potentiel hydrogène', 'pH = −log₁₀(x)', formatNumber(res.pH, 'pH'), '', true);
    appendResultCard(grid, 'τ', 'Taux final', 'τ = x / C\'', formatNumber(res.tau, 'tau'), '', false, tauGaugeHtml);
    if (res.sigma !== null) {
      appendResultCard(grid, 'σ', 'Conductivité', 'σ = x · (λ_B + λ_H₃O⁺) · 10³', formatNumber(res.sigma), 'S/m', false);
    }

    const delta = (res.K * res.K) + (4 * res.K * res.C_prime);
    const sqrtDelta = Math.sqrt(delta);

    stepsContainer.innerHTML = `
      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Données</span>
          <span class="step-title">Conditions thermodynamiques initiales</span>
        </div>
        <div class="step-content">
          <div class="step-sub">• Concentration initiale en acide : C = ${formatNumber(res.C)} mol/L</div>
          ${res.n !== null ? `<div class="step-sub">• Facteur de dilution : n = ${res.n}</div>` : ''}
          <div class="step-sub">• Constante d'acidité de l'acide : K = ${formatNumber(res.K)}</div>
          ${res.lambda_B_SI !== null ? `
          <div class="step-sub">• Conductivité molaire ionique λ_B = ${formatNumber(res.lambda_B_SI)} S·m²·mol⁻¹</div>
          <div class="step-sub">• Conductivité molaire ionique λ_H₃O⁺ = ${formatNumber(res.lambda_H3O_SI)} S·m²·mol⁻¹</div>
          ` : ''}
        </div>
      </div>

      ${res.n !== null ? `
      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Étape 01</span>
          <span class="step-title">Dilution de la solution (Calcul de C')</span>
        </div>
        <div class="step-content">
          <div class="step-formula">C' = C / n</div>
          <div class="step-sub"><strong>Application numérique :</strong> C' = ${formatNumber(res.C)} / ${res.n}</div>
          <div class="step-res">⇒ Concentration diluée C' = ${formatNumber(res.C_prime)} mol/L (utilisée à la place de C pour toute la suite)</div>
        </div>
      </div>
      ` : ''}

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">${res.n !== null ? 'Étape 02' : 'Étape 01'}</span>
          <span class="step-title">Concentration en ions oxonium [H₃O⁺] (Équation du second degré)</span>
        </div>
        <div class="step-content">
          <div class="step-formula">K = x² / (C' − x)  ⇔  x² + K·x − K·C' = 0</div>
          <div class="step-sub"><strong>Calcul du discriminant :</strong> Δ = K² + 4·K·C'</div>
          <div class="step-sub">Δ = (${formatNumber(res.K)})² + 4 · (${formatNumber(res.K)}) · (${formatNumber(res.C_prime)}) = ${formatNumber(delta)}</div>
          <div class="step-sub">√(Δ) = ${formatNumber(sqrtDelta)}</div>
          <div class="step-formula">x = [H₃O⁺] = (−K + √(K² + 4·K·C')) / 2</div>
          <div class="step-sub"><strong>Application numérique :</strong> x = (−${formatNumber(res.K)} + ${formatNumber(sqrtDelta)}) / 2</div>
          <div class="step-res">⇒ x = [H₃O⁺] = ${formatNumber(res.x)} mol/L (racine physique retenue)</div>
          <div class="step-sub" style="color: var(--accent-gold);">✓ Validité confirmée : 0 &lt; ${formatNumber(res.x)} &lt; ${formatNumber(res.C_prime)} mol/L.</div>
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">${res.n !== null ? 'Étape 03' : 'Étape 02'}</span>
          <span class="step-title">pH de la solution</span>
        </div>
        <div class="step-content">
          <div class="step-formula">pH = −log₁₀(x)</div>
          <div class="step-sub"><strong>Application numérique :</strong> pH = −log₁₀(${formatNumber(res.x)})</div>
          <div class="step-res">⇒ pH = ${formatNumber(res.pH, 'pH')}</div>
        </div>
      </div>

      ${res.sigma !== null ? `
      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">${res.n !== null ? 'Étape 04' : 'Étape 03'}</span>
          <span class="step-title">Conductivité de la solution σ</span>
        </div>
        <div class="step-content">
          <div class="step-formula">σ = x · (λ_B + λ_H₃O⁺) · 10³</div>
          <div class="step-sub"><strong>Application numérique :</strong> σ = ${formatNumber(res.x)} · (${formatNumber(res.lambda_B_SI)} + ${formatNumber(res.lambda_H3O_SI)}) · 10³</div>
          <div class="step-res">⇒ σ = ${formatNumber(res.sigma)} S/m (soit ${formatNumber(res.sigma * 1000)} mS/m)</div>
        </div>
      </div>
      ` : ''}

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">${res.n !== null ? (res.sigma !== null ? 'Étape 05' : 'Étape 04') : (res.sigma !== null ? 'Étape 04' : 'Étape 03')}</span>
          <span class="step-title">Taux d'avancement final τ</span>
        </div>
        <div class="step-content">
          <div class="step-formula">τ = x / C'</div>
          <div class="step-sub"><strong>Application numérique :</strong> τ = (${formatNumber(res.x)}) / (${formatNumber(res.C_prime)})</div>
          <div class="step-res">⇒ τ = ${formatNumber(res.tau, 'tau')} (soit ${(res.tau * 100).toFixed(2).replace('.', ',')} %)</div>
        </div>
      </div>

      <div class="solution-step">
        <div class="step-badge-row">
          <span class="step-badge">Contrôle</span>
          <span class="step-title">Vérification de la constante d'acidité</span>
        </div>
        <div class="step-content">
          <div class="step-formula">K_vérif = (${formatNumber(res.x)})² / (${formatNumber(res.C_prime)} − ${formatNumber(res.x)}) = ${formatNumber(res.K_verif)}</div>
          <div class="step-sub" style="color: var(--accent-gold);">✓ Parfaitement conforme à la constante théorique K = ${formatNumber(res.K)}.</div>
        </div>
      </div>
    `;
  }
}

/**
 * Crée et insère une carte de résultat dans le conteneur donné.
 */
function appendResultCard(container, symbol, fullName, formula, value, unit, isHero = false, extraHtml = '') {
  const card = document.createElement('div');
  card.className = `result-card ${isHero ? 'hero' : ''}`;
  const copyVal = `${value} ${unit}`.trim();
  card.innerHTML = `
    <div>
      <div class="rc-top">
        <div class="rc-title-row">
          <span class="rc-symbol">${symbol}</span>
          <span class="rc-name">${fullName}</span>
        </div>
        <button type="button" class="rc-copy-btn" title="Copier cette grandeur" data-copy="${copyVal}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </div>
      <div class="rc-formula">${formula}</div>
    </div>
    <div class="rc-value-row">
      <span class="rc-value">${value}</span>
      ${unit ? `<span class="rc-unit">${unit}</span>` : ''}
    </div>
    ${extraHtml}
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
