/* js/main.js — Initialisation de l'application, écouteurs globaux et délégation d'événements */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialisation du Thème (Dark par défaut)
  const savedTheme = localStorage.getItem('chimielab_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Bascule du Thème
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('chimielab_theme', next);
      updateThemeIcon(next);
      showToast(next === 'dark' ? 'Mode Sombre Champagne activé.' : 'Mode Clair Éditorial activé.');
    });
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;
    if (theme === 'dark') {
      // Icône Soleil
      icon.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
      icon.setAttribute('title', 'Passer au mode clair');
    } else {
      // Icône Lune
      icon.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      icon.setAttribute('title', 'Passer au mode sombre');
    }
  }

  // 2. Sélection des boutons de mode via clic et clavier
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

  // 3. Soumission du formulaire
  const form = document.getElementById('calc-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerCalculate(true);
    });
  }

  // 4. Grand bouton Calculer
  const btnCalc = document.getElementById('btn-calc');
  if (btnCalc) {
    btnCalc.addEventListener('click', () => triggerCalculate(true));
  }

  // 5. Bouton Réinitialiser
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
      showToast("Paramètres réinitialisés aux valeurs types.");
    });
  }

  // 6. Bouton Copier la solution
  const btnCopySolution = document.getElementById('btn-copy-solution');
  if (btnCopySolution) {
    btnCopySolution.addEventListener('click', () => {
      if (state.lastResult) {
        const text = buildPlainTextSolution(state.lastResult);
        copyText(text, "Solution d'examen copiée dans le presse-papiers !");
      }
    });
  }

  // 7. Bouton Exporter en PDF (Impression d'examen)
  const btnExportPdf = document.getElementById('btn-export-pdf');
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => {
      if (state.lastResult) {
        window.print();
      } else {
        showToast("Veuillez d'abord effectuer un calcul pour exporter.", true);
      }
    });
  }

  // 8. Bouton bascule de la section Historique
  const btnToggleHistory = document.getElementById('btn-toggle-history');
  const historySec = document.getElementById('history-section');
  if (btnToggleHistory && historySec) {
    btnToggleHistory.addEventListener('click', () => {
      const isVisible = historySec.style.display !== 'none';
      historySec.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        historySec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 9. Délégation d'événements pour les boutons de copie des cartes de résultat
  const resultsGrid = document.getElementById('results-grid');
  if (resultsGrid) {
    resultsGrid.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.rc-copy-btn');
      if (copyBtn && copyBtn.dataset.copy) {
        copyText(copyBtn.dataset.copy, "Valeur copiée dans le presse-papiers !");
      }
    });
  }

  // 10. Délégation d'événements pour le rechargement de l'historique
  const historyList = document.getElementById('history-list');
  if (historyList) {
    historyList.addEventListener('click', (e) => {
      const restoreBtn = e.target.closest('.btn-restore-history');
      if (restoreBtn && restoreBtn.dataset.historyIndex !== undefined) {
        const idx = parseInt(restoreBtn.dataset.historyIndex, 10);
        restoreHistoryItem(idx);
      }
    });
  }

  // 11. Modale du Testeur
  const modal = document.getElementById('tester-modal');
  const btnOpenTester = document.getElementById('btn-open-tester');
  const btnFooterTester = document.getElementById('btn-footer-tester');
  const btnCloseTester = document.getElementById('btn-close-tester');

  if (modal) {
    const openTester = () => {
      runSelfTests();
      modal.classList.add('active');
    };
    if (btnOpenTester) btnOpenTester.addEventListener('click', openTester);
    if (btnFooterTester) btnFooterTester.addEventListener('click', openTester);
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
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }

  // 12. Rendu initial des entrées et de l'indicateur actif
  renderFormInputs();
  renderHistory();
  const initActiveIndicator = document.querySelector('.mode-card.active .mode-indicator');
  if (initActiveIndicator) {
    initActiveIndicator.innerHTML = '<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.8 7L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
});
