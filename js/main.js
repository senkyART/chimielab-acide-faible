/* js/main.js — Initialisation de l'application, écouteurs globaux et délégation d'événements */

document.addEventListener('DOMContentLoaded', () => {
  // Sélection des boutons de mode via clic et clavier
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
      triggerCalculate();
    });
  }

  // Grand bouton Calculer
  const btnCalc = document.getElementById('btn-calc');
  if (btnCalc) {
    btnCalc.addEventListener('click', () => triggerCalculate());
  }

  // Bouton Réinitialiser
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      state.lastResult = null;
      const resSection = document.getElementById('results-section');
      if (resSection) resSection.style.display = 'none';
      const errBox = document.getElementById('error-box');
      if (errBox) {
        errBox.style.display = 'none';
        errBox.textContent = '';
      }
      renderFormInputs();
      showToast("Champs réinitialisés.");
    });
  }

  // Bouton Copier la solution (situé sous la rédaction pas à pas)
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

  // Rendu initial (aucun calcul automatique avant clic sur Calculer)
  renderFormInputs();
});
