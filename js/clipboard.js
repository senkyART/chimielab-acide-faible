/* js/clipboard.js — Gestion du presse-papiers avec solution de repli (fallback file://) et notifications toast */

let toastTimer = null;

/**
 * Affiche une notification toast temporaire.
 *
 * @param {string} msg - Message à afficher.
 * @param {boolean} [isError=false] - Indique s'il s'agit d'une erreur.
 */
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = isError ? 'toast show error' : 'toast show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

/**
 * Solution de repli pour la copie dans le presse-papiers via document.execCommand.
 * Indispensable pour le protocole file:// ou contextes non sécurisés.
 *
 * @param {string} text - Texte à copier.
 * @param {Function} onSuccess - Callback en cas de succès.
 * @param {Function} onFail - Callback en cas d'échec.
 */
function fallbackCopy(text, onSuccess, onFail) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-99999px";
    ta.style.top = "0";
    ta.setAttribute("readonly", "");
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const success = document.execCommand("copy");
    document.body.removeChild(ta);
    if (success) {
      onSuccess();
    } else {
      onFail("Opération rejetée par le navigateur.");
    }
  } catch (e) {
    onFail(e.message || "Erreur inconnue");
  }
}

/**
 * Copie une chaîne dans le presse-papiers et affiche une confirmation en français.
 *
 * @param {string} text - Contenu à copier.
 * @param {string} [successMsg="Copié dans le presse-papiers !"] - Message de confirmation.
 */
function copyText(text, successMsg = "Copié dans le presse-papiers !") {
  if (!text) return;

  const onSuccess = () => showToast(successMsg, false);
  const onFail = (err) => showToast("Échec de la copie : " + (err || "accès refusé"), true);

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess, onFail));
  } else {
    fallbackCopy(text, onSuccess, onFail);
  }
}
