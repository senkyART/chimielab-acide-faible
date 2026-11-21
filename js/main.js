/* js/main.js — Initialisation de l'application, écouteurs globaux et délégation d'événements */

document.addEventListener('DOMContentLoaded', () => {
  // Sélection des cartes de mode via clic et clavier
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      const m = parseInt(card.getAttribute('data-mode'), 10);
      selectMode(m);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const m = parseInt(card.getAttribute('data-mode'), 10);
        selectMode(m);
      }
    });
  });

  // Soumission du formulaire (Fix F3 : écouteur submit sans attribut HTML)
  const form = document.getElementById('calc-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerCalculate(false, true);
    });
  }

  // Bouton Calculer
  const btnCalc = document.getElementById('btn-calc');
  if (btnCalc) {
    btnCalc.addEventListener('click', () => triggerCalculate(false, true));
  }

  // Bouton Réinitialiser
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      renderFormInputs();
      triggerCalculate(true, false);
      showToast("Champs réinitialisés.");
    });
  }

  // Bouton Copier la solution
  const btnCopySolution = document.getElementById('btn-copy-solution');
  if (btnCopySolution) {
    btnCopySolution.addEventListener('click', () => {
      if (state.lastResult) {
        const text = buildPlainTextSolution(state.lastResult);
        copyText(text, "Solution complète copiée dans le presse-papiers !");
      }
    });
  }

  // Délégation d'événements pour les boutons de copie des cartes de résultat (Fix F3)
  const resultsGrid = document.getElementById('results-grid');
  if (resultsGrid) {
    resultsGrid.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.rc-copy-btn');
      if (copyBtn && copyBtn.dataset.copy) {
        copyText(copyBtn.dataset.copy, "Valeur copiée dans le presse-papiers !");
      }
    });
  }

  // Délégation d'événements pour le rechargement de l'historique (Fix F3)
  const historyList = document.getElementById('history-list');
  if (historyList) {
    historyList.addEventListener('click', (e) => {
      const restoreBtn = e.target.closest('.history-restore-btn');
      if (restoreBtn && restoreBtn.dataset.historyIndex !== undefined) {
        const idx = parseInt(restoreBtn.dataset.historyIndex, 10);
        restoreHistoryItem(idx);
      }
    });
  }

  // Bascule du Thème (Sombre / Clair)
  const themeBtn = document.getElementById('btn-theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (themeBtn && themeIcon) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      themeIcon.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
    });
  }

  // Modale du Testeur
  const modal = document.getElementById('tester-modal');
  const btnOpenTester = document.getElementById('btn-open-tester');
  const btnCloseTester = document.getElementById('btn-close-tester');

  if (btnOpenTester && modal) {
    btnOpenTester.addEventListener('click', () => {
      runSelfTests();
      modal.classList.add('active');
    });
  }

  if (btnCloseTester && modal) {
    btnCloseTester.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Rendu initial
  renderFormInputs();
  triggerCalculate(true, false);
});
