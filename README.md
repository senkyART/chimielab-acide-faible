# ChimieLab — Instrument Scientifique pour Acide Faible dans l'Eau

ChimieLab est une application web d'excellence pour la résolution rigoureuse des exercices de chimie sur les acides faibles dans l'eau (pH-métrie, conductimétrie, constante d'acidité $K$, dilution). Conçue à la croisée d'un instrument scientifique de laboratoire et d'une publication éditoriale haut de gamme, elle offre une expérience de calcul fluide et une rédaction pas à pas conforme aux exigences des examens et concours.

---

## Esthétique et Identité Visuelle

- **Palette Dark Chocolate & Champagne** : Teintes chocolat noir profond (`#12100F`, `#191614`, `#201C19`), accents or champagne (`#D4AD70`) et texte ivoire crémeux (`#F5EFE5`).
- **Mode Clair Éditorial** : Thème champagne clair inspiré des traités scientifiques classiques.
- **Typographie de Haute Précision** :
  - Titres et élégance éditoriale : *Instrument Serif*
  - Interface et lisibilité : *Manrope*
  - Équations, données et unités : *JetBrains Mono*

---

## Fonctionnalités Principales

1. **3 Modes de Calcul Scientifiques (Conformes au Cours)** :
   - **Mode 01 — $C$ et $\text{pH}$** : Mesure au pH-mètre $\rightarrow$ $[H_3O^+]$, $\tau$, $K$ (et $\sigma$ si $\lambda_B$ est fourni).
   - **Mode 02 — $C$ et $\sigma$** : Mesure conductimétrique $\rightarrow$ $[H_3O^+]$, $\tau$, $K$ exclusivement.
   - **Mode 03 — $C$ et $K$ (avec dilution facultative $n$)** : Équation du second degré $\rightarrow$ $C'$, $[H_3O^+]$, $\text{pH}$, $\tau$ (et $\sigma$ si $\lambda_B$ est fourni).

2. **Bannière Contextuelle Dynamique** :
   - Présentation claire des données requises par l'énoncé et des grandeurs calculées par ChimieLab.

3. **Workspace de Saisie Instrumentale** :
   - Champs confortables (hauteur 48px) avec sélecteurs d'unités intégrés ($\text{mol/L}$, $\text{S/m}$, $\text{mS/m}$, $\text{mS}\cdot\text{m}^2\cdot\text{mol}^{-1}$, $\text{S}\cdot\text{m}^2\cdot\text{mol}^{-1}$).
   - Prise en charge des virgules, points et notations scientifiques ($1.0\text{e-}2$, $10^{-2}$).
   - En Modes 1 et 3, regroupement optionnel sous *« Pour calculer la conductivité $\sigma$ (optionnel) »* : $\lambda_{H_3O^+}$ avec sa valeur par défaut ($35,0\text{ mS}\cdot\text{m}^2\cdot\text{mol}^{-1}$) n'est requis que si $\lambda_B$ est renseigné.

4. **Présentation des Résultats de Type Rapport Scientifique** :
   - Carte Héro mise en avant pour la grandeur principale ($[H_3O^+]$).
   - Jauge de dissociation $\tau$ intégrée directement dans la carte de taux d'avancement.
   - Badge de conformité thermodynamique ($K_{\text{vérifié}} = K_{\text{théorique}}$).
   - Boutons de copie rapide sur chaque grandeur.

5. **Rédaction Pas à Pas de Type Examen** :
   - Structure académique officielle :
     - $01 \text{ — Données initiales}$
     - $02 \text{ — Formule littérale}$
     - $03 \text{ — Application numérique}$
     - $04 \text{ — Calcul intermédiaire (discriminant, substitutions)}$
     - $05 \text{ — Résultat encadré avec unités et validation}$
   - Bouton **« Copier la solution »** (texte brut structuré prêt à coller dans un rapport ou devoir).
   - Bouton **« Exporter en PDF »** (feuille d'examen vectorielle via la feuille de style `@media print`).

6. **Historique des 5 Derniers Calculs** :
   - Enregistrement automatique en mémoire de session.
   - Restauration instantanée du mode, des paramètres et des unités en un clic sur **Recharger**.

7. **Suite de Tests Automatisée (« Tester »)** :
   - Modale exécutant 27+ assertions numériques réelles sur le moteur de calcul scientifique (tolérance relative 0,5 %, pH : 0,01).

---

## Utilisation

1. Ouvrir le fichier `index.html` dans n'importe quel navigateur moderne (double-clic, compatible protocole local `file://`).
2. Sélectionner la situation de l'exercice (**Mode 01**, **Mode 02** ou **Mode 03**).
3. Renseigner les grandeurs numériques fournies par l'énoncé.
4. Cliquer sur **Calculer la solution** (ou appuyer sur la touche `Entrée`).
5. Consulter les cartes de résultats, la rédaction d'examen ou exporter en PDF.

---

## Structure du Projet

```text
chimielab-acide-faible/
├── index.html            : Structure sémantique complète (Dark Chocolate & Champagne)
├── css/
│   ├── variables.css     : Jetons de design (thèmes sombre & clair, typographie, or champagne)
│   ├── base.css          : Reset, mise en page éditoriale (max 880px), en-tête et styles d'impression PDF
│   └── components.css    : Cartes de mode, workspace de saisie, cartes héro, rédaction d'examen et modale
├── js/
│   ├── parser.js         : Analyse numérique stricte (virgule décimale, puissances de 10)
│   ├── format.js         : Formatage scientifique d'affichage et texte brut
│   ├── units.js          : Conversions d'unités centralisées (source unique de vérité)
│   ├── calc.js           : Moteur scientifique pur des 3 modes (invariable)
│   ├── state.js          : État réactif de l'application
│   ├── clipboard.js      : Copie presse-papiers avec repli compatible file://
│   ├── history.js        : Gestion de l'historique en mémoire (5 derniers calculs) et rechargement
│   ├── solution.js       : Rendu des cartes héro, rédaction pas à pas et solution texte
│   ├── form.js           : Gestion dynamique du formulaire, bannière contextuelle et validation
│   ├── tester.js         : Suite de tests automatisée avec assertions numériques réelles
│   └── main.js           : Initialisation, bascule de thème, modale et délégation d'événements
├── README.md             : Documentation complète du projet
└── .gitignore            : Fichiers exclus de Git
```

---

## Tests et Validation Scientifique

Le bouton **Tester** dans l'en-tête exécute les vérifications numériques en temps réel :
- Mode 1 : $C = 1,00\cdot 10^{-2}\text{ mol/L}$, $\text{pH} = 3,41 \rightarrow x \approx 3,89\cdot 10^{-4}\text{ mol/L}$, $\tau \approx 0,0389$, $K \approx 1,57\cdot 10^{-5}$.
- Mode 2 : $C = 1,00\cdot 10^{-2}\text{ mol/L}$, $\sigma = 0,0152\text{ S/m}$, $\lambda_B = 4,09\text{ mS}\cdot\text{m}^2\cdot\text{mol}^{-1}$, $\lambda_{H_3O^+} = 34,98\text{ mS}\cdot\text{m}^2\cdot\text{mol}^{-1} \rightarrow x \approx 3,89\cdot 10^{-4}\text{ mol/L}$, $\tau \approx 0,0389$, $K \approx 1,57\cdot 10^{-5}$.
- Mode 3 : $C = 1,00\cdot 10^{-2}\text{ mol/L}$, $K = 1,58\cdot 10^{-5} \rightarrow x \approx 3,897\cdot 10^{-4}\text{ mol/L}$, $\text{pH} \approx 3,41$, $\tau \approx 0,0390$.
- Dilution : $C = 0,10\text{ mol/L}$, $n = 10 \rightarrow C' = 0,010\text{ mol/L}$.
- Validations d'erreurs : rejet si $x \ge C$, si $n < 1$, ou si entrées négatives/invalides.

---

## Auteur et Licence

Créé par **Senky** — Distribué sous licence MIT.
