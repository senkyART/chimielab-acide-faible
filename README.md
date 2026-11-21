# ChimieLab — Atelier Atomique pour Acide Faible dans l'Eau

ChimieLab est une application web d'avant-garde dédiée à la résolution rigoureuse des exercices de chimie sur les acides faibles dans l'eau (pH-métrie, conductimétrie, constante d'acidité $K$, dilution). Conçue sous la direction artistique **ATOMIC ATELIER**, elle fusionne typographie suisse expérimentale, mise en page éditoriale de luxe, visualisation moléculaire interactive et rédaction pas à pas conforme aux exigences académiques les plus strictes.

---

## Direction Artistique : « ATOMIC ATELIER »

- **Palette Espresso & Champagne Fondu** : Teintes espresso d'atelier (`#0C0A09`, `#14110F`, `#1A1613`), reflets champagne fondu (`#E2B874`), ambre minéral (`#E08A3C`) et ivoire chaud (`#F6F0E6`).
- **Trame d'Architecte & Vignette Atmosphérique** : Grille millimétrée subtile et halo lumineux zénithal évoquant un laboratoire d'orfèvrerie scientifique.
- **Visualisation Moléculaire Canvas** : Simulation dynamique en direct des particules d'équilibre ($HA \rightleftharpoons H_3O^+ + A^-$) avec réactivité gravitationnelle au curseur et respect de `prefers-reduced-motion`.
- **Système Typographique d'Avant-Garde** :
  - En-tête monumental & titres éditoriaux : *Instrument Serif*
  - Index de section, chiffres géants & badges : *Syne*
  - Interface utilisateur & cartouches scientifiques : *Manrope*
  - Équations, données et unités de laboratoire : *JetBrains Mono*

---

## Fonctionnalités Principales

1. **3 Modes de Calcul Scientifiques (Conformes au Cours)** :
   - **Mode 01 — $C$ et $\text{pH}$** : Mesure au pH-mètre $\rightarrow$ $[H_3O^+]$, $\tau$, $K$ (et $\sigma$ si $\lambda_B$ est fourni).
   - **Mode 02 — $C$ et $\sigma$** : Mesure conductimétrique $\rightarrow$ $[H_3O^+]$, $\tau$, $K$ exclusivement.
   - **Mode 03 — $C$ et $K$ (avec dilution facultative $n$)** : Résolution du second degré $\rightarrow$ $C'$, $[H_3O^+]$, $\text{pH}$, $\tau$ (et $\sigma$ si $\lambda_B$ est fourni).

2. **Console de Saisie Instrumentale** :
   - Champs tactiles haute précision (50px) avec sélecteurs d'unités intégrés ($\text{mol/L}$, $\text{S/m}$, $\text{mS/m}$, $\text{mS}\cdot\text{m}^2\cdot\text{mol}^{-1}$, $\text{S}\cdot\text{m}^2\cdot\text{mol}^{-1}$).
   - Prise en charge universelle des virgules, points décimaux et notations scientifiques ($1.0\text{e-}2$, $10^{-2}$).
   - En Modes 1 et 3, module conductimétrique optionnel : $\lambda_{H_3O^+}$ (défaut $35,0\text{ mS}\cdot\text{m}^2\cdot\text{mol}^{-1}$) n'est pris en compte que si $\lambda_B$ est renseigné.

3. **Restitution des Résultats de Type Monographie** :
   - **Carte Héro $[H_3O^+]$** : Grande typographie lumineuse avec badge de conformité thermodynamique.
   - **Jauge d'Équilibre Double** : Visualisation proportionnelle du taux de dissociation $\tau$ vs fraction intacte $(1-\tau)$.
   - Boutons de copie rapide sur chaque grandeur calculée.

4. **Rédaction Pas à Pas de Type Examen** :
   - Structure académique officielle en 5 étapes numérotées :
     - $01 \text{ — Données initiales}$
     - $02 \text{ — Formule littérale}$
     - $03 \text{ — Application numérique}$
     - $04 \text{ — Calcul intermédiaire (discriminant, substitutions)}$
     - $05 \text{ — Résultat encadré avec unités et validation}$
   - Bouton **« Copier la solution »** (texte brut structuré prêt à coller dans un rapport ou devoir).
   - Bouton **« Exporter en PDF »** (feuille d'examen vectorielle via la feuille de style `@media print`).

5. **Historique des 5 Derniers Calculs** :
   - Enregistrement automatique en mémoire de session.
   - Restauration instantanée du mode, des paramètres et des unités en un clic sur **Recharger**.

6. **Suite de Tests Automatisée (« Tester »)** :
   - Modale exécutant 27+ assertions numériques réelles sur le moteur de calcul scientifique (tolérance relative 0,5 %, pH : 0,01).

---

## Utilisation

1. Ouvrir le fichier `index.html` dans n'importe quel navigateur moderne (double-clic, compatible protocole local `file://`).
2. Sélectionner la situation de l'exercice (**Mode 01**, **Mode 02** ou **Mode 03**).
3. Renseigner les grandeurs numériques fournies par l'énoncé.
4. Cliquer sur **Calculer la solution** (ou appuyer sur la touche `Entrée`).
5. Consulter les cartes de résultats, la monographie d'examen ou exporter en PDF.

---

## Structure du Projet

```text
chimielab-acide-faible/
├── index.html            : Structure sémantique d'avant-garde (Atelier Atomique)
├── css/
│   ├── variables.css     : Jetons ATOMIC ATELIER (espresso, champagne, ambre, typographies)
│   ├── base.css          : Grille d'architecte, vignette, télémesure et styles d'impression PDF
│   └── components.css    : Cartes de mode avec grands index, console de saisie, jauge d'équilibre
├── js/
│   ├── canvas.js         : Visualisation moléculaire interactive (particules en équilibre dynamique)
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
