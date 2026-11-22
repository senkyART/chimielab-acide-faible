# ChimieLab — Instrument Scientifique pour l'Enseignement de la Chimie

ChimieLab est une application web d'excellence pour la résolution rigoureuse des exercices de chimie sur les acides faibles dans l'eau (pH-métrie, conductimétrie, constante d'acidité $K$, dilution). Conçue selon la direction **Timeless Academic Luxury**, elle allie l'élégance éditoriale d'un traité de chimie classique et la lisibilité irréprochable d'un logiciel pédagogique moderne à destination des professeurs et étudiants.

---

## Esthétique et Direction : « Timeless Academic Luxury »

- **Palette Chocolat Noir & Or Champagne** : Teintes chocolat profond (`#14110F`, `#201B18`, `#29221D`), texte ivoire crémeux à fort contraste (`#F5F0E8`, `#C2B6A7`) et accents or champagne (`#D6B477`).
- **Mode Clair Parchemin Académique** : Thème haute couture inspiré des planches imprimées universitaires (`#F7F4EE`, encre sépia `#1A1614`).
- **Confort de Lecture et Accessibilité Maximale** :
  - Corps de texte entre 16 et 18px.
  - Libellés d'entrées confortables à 16px.
  - Grands titres éditoriaux en *Instrument Serif* (26–30px).
  - Champs de saisie tactiles et spacieux (52px de hauteur).
  - Aucune information véhiculée par la seule couleur ; contrastes validés WCAG.
- **Système Typographique** :
  - Titres et élégance académique : *Instrument Serif*
  - Interface, explications et lisibilité : *Manrope*
  - Notations mathématiques, formules et données : *JetBrains Mono*

---

## Fonctionnalités Principales

1. **3 Modes de Calcul Scientifiques (Conformes aux Programmes)** :
   - **Mode 01 — $C$ et $\text{pH}$** : Mesure au pH-mètre $\rightarrow$ $[H_3O^+]$, $\tau$, $K$ (et $\sigma$ si $\lambda_B$ est fourni).
   - **Mode 02 — $C$ et $\sigma$** : Mesure conductimétrique $\rightarrow$ $[H_3O^+]$, $\tau$, $K$ exclusivement.
   - **Mode 03 — $C$ et $K$ (avec dilution facultative $n$)** : Résolution du second degré $\rightarrow$ $C'$, $[H_3O^+]$, $\text{pH}$, $\tau$ (et $\sigma$ si $\lambda_B$ est fourni).

2. **Bannière Contextuelle Dynamique** :
   - Explication limpide sous les cartes de mode avec distinction immédiate entre *Données fournies* et *Grandeurs calculées*.

3. **Workspace de Saisie Instrumentale** :
   - Champs haute précision avec sélecteurs d'unités ($\text{mol/L}$, $\text{S/m}$, $\text{mS/m}$, $\text{mS}\cdot\text{m}^2\cdot\text{mol}^{-1}$, $\text{S}\cdot\text{m}^2\cdot\text{mol}^{-1}$).
   - Prise en charge des virgules, des points et des puissances de 10 ($1,0\text{e-}2$, $10^{-2}$).
   - En Modes 1 et 3, regroupement optionnel : $\lambda_{H_3O^+}$ (défaut $35,0\text{ mS}\cdot\text{m}^2\cdot\text{mol}^{-1}$) n'est pris en compte que si $\lambda_B$ est renseigné.

4. **Présentation des Résultats de Type Rapport Scientifique** :
   - Grande carte héro $[H_3O^+]$ avec badge de conformité thermodynamique ($K_{\text{vérifié}} = K_{\text{théorique}}$).
   - Jauge d'équilibre clair : pourcentage dissocié ($\tau$) vs intact ($1-\tau$).
   - Boutons de copie rapide sur chaque grandeur.

5. **Rédaction Pas à Pas de Type Examen** :
   - Structure académique officielle en 5 étapes numérotées :
     - $01 \text{ — Données initiales}$
     - $02 \text{ — Formule littérale}$
     - $03 \text{ — Application numérique}$
     - $04 \text{ — Calcul intermédiaire (discriminant, substitutions)}$
     - $05 \text{ — Résultat encadré avec unités et validation}$
   - Bouton **« Copier la solution »** (texte brut soigné prêt à coller dans un rapport).
   - Bouton **« Exporter en PDF »** (feuille d'examen vectorielle via `@media print`).

6. **Historique des 5 Derniers Calculs** :
   - Mémorisation de session avec rechargement instantané de l'état, des paramètres et des unités.

7. **Suite de Tests Automatisée (« Tester »)** :
   - Modale exécutant 29 assertions numériques réelles sur le moteur thermodynamique (tolérance relative 0,5 %, pH : 0,01).

---

## Utilisation

1. Ouvrir le fichier `index.html` dans n'importe quel navigateur moderne (double-clic, compatible protocole local `file://`).
2. Sélectionner la situation de l'exercice (**Mode 1**, **Mode 2** ou **Mode 3**).
3. Renseigner les grandeurs numériques fournies par l'énoncé.
4. Cliquer sur **Calculer la solution** (ou appuyer sur `Entrée`).
5. Consulter le bilan des grandeurs, la rédaction pas à pas ou exporter en PDF.

---

## Structure du Projet

```text
chimielab-acide-faible/
├── index.html            : Structure sémantique épurée (Timeless Academic Luxury)
├── css/
│   ├── variables.css     : Jetons de design (chocolat noir, or champagne, ivoire, parchemin)
│   ├── base.css          : Mise en page centrée (max 860px), en-tête et styles d'impression PDF
│   └── components.css    : Cartes de mode (plaque ivoire active), formulaires (52px), résultats et modale
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
