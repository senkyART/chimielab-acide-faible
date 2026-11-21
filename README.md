# ChimieLab — Acide faible dans l'eau
Calculateur web épuré pour résoudre les exercices d'acide faible dans l'eau (pH, conductimétrie, constante K), avec rédaction pas à pas de type examen.

## Fonctionnalités
- 3 modes de calcul correspondant aux 3 situations du cours (C et pH, C et σ, C et K)
- Flux direct et intuitif : sélection du mode (1, 2 ou 3), saisie des valeurs, puis clic sur **Calculer** (ou touche Entrée)
- Rédaction pas à pas détaillée : formule → application numérique → calcul intermédiaire → résultat avec unité
- Vérification de la cohérence de K à partir de la valeur finale de x
- Conversions d'unités automatiques (σ en S/m ou mS/m, λ en mS·m²·mol⁻¹ ou S·m²·mol⁻¹)
- Conductivités optionnelles en Modes 1 et 3 : λ_B et λ_H₃O⁺ sont facultatifs sous la légende *« Pour calculer σ (optionnel) »* ; la conductivité σ n'est calculée et affichée que si λ_B est renseigné
- Bouton « Copier la solution » prêt pour devoirs et examens
- Bouton « Tester » en pied de page : suite de tests automatisée avec assertions numériques réelles (PASS/FAIL)

## Utilisation
1. Choisir le mode de calcul : **Mode 1** (C et pH), **Mode 2** (C et σ) ou **Mode 3** (C et K).
2. Saisir les valeurs dans les champs du formulaire (en Modes 1 et 3, λ_B et λ_H₃O⁺ sont optionnels ; σ n'est calculé que si λ_B est fourni).
3. Cliquer sur le bouton **Calculer** (ou appuyer sur la touche Entrée) pour afficher les cartes de résultats et la solution détaillée pas à pas.
4. Ouvrir simplement `index.html` dans n'importe quel navigateur (double-clic, compatible `file://`). Aucun serveur ni installation requis.

## Notation
x = [H₃O⁺] (mol/L) ; C : concentration initiale ; C' : concentration après dilution ; τ : taux d'avancement final ; K : constante d'équilibre (sans dimension) ; σ : conductivité (S/m) ; λ_B : conductivité molaire ionique de la base conjuguée ; λ_H₃O⁺ : conductivité molaire ionique de H₃O⁺ (35,0 mS·m²·mol⁻¹ par défaut).

## Les 3 situations et leurs formules
### Situation 1 — Données : C et pH
1. x = [H₃O⁺] = 10^(−pH)
2. τ = x / C
3. K = x² / (C − x)
4. (si λ_B fourni) σ = x · (λ_B + λ_H₃O⁺) · 10³

### Situation 2 — Données : C, σ, λ_B et λ_H₃O⁺
1. x = [H₃O⁺] = σ / (λ_B + λ_H₃O⁺) · 10⁻³
2. τ = x / C
3. K = x² / (C − x)

### Situation 3 — Données : C (ou C' = C / n si dilution) et K
1. (si dilution) C' = C / n, et C' remplace C pour toute la suite
2. x = [H₃O⁺] = (−K + √(K² + 4·K·C')) / 2
3. pH = −log₁₀(x)
4. (si λ_B fourni) σ = x · (λ_B + λ_H₃O⁺) · 10³
5. τ = x / C'

## Unités et conversions
- σ : S/m (si mS/m : × 10⁻³)
- λ : S·m²·mol⁻¹ dans les formules (si mS·m²·mol⁻¹ : × 10⁻³)
- Le facteur 10³ convertit mol/L en mol/m³
- λ_H₃O⁺ par défaut : 35,0 mS·m²·mol⁻¹ = 0,035 S·m²·mol⁻¹ (modifiable, utilisé en Modes 1 et 3 uniquement si λ_B est renseigné)

## Structure du projet
```text
chimielab-acide-faible/
├── index.html            : Structure sémantique du site (aucun style ni script en ligne)
├── css/
│   ├── variables.css     : Jetons de design (thème clair unique épuré, couleur d'accent teal)
│   ├── base.css          : Reset, mise en page globale (colonne unique max 720px) et en-tête
│   └── components.css    : Boutons de mode, champs 44px, formulaire, résultats et modale
├── js/
│   ├── parser.js         : Analyse numérique stricte (virgule, puissances de 10)
│   ├── format.js         : Formatage scientifique d'affichage et texte brut
│   ├── units.js          : Conversions d'unités centralisées (source unique de vérité)
│   ├── calc.js           : Fonctions scientifiques pures des 3 modes (sans DOM)
│   ├── state.js          : Objet d'état global de l'application
│   ├── clipboard.js      : Gestion de la copie presse-papiers avec repli file://
│   ├── solution.js       : Rendu des cartes de résultats et rédaction détaillée d'examen
│   ├── form.js           : Gestion dynamique du formulaire et validation
│   ├── tester.js         : Suite de tests automatisée avec assertions numériques réelles
│   └── main.js           : Initialisation et liaison des événements DOM
├── README.md             : Documentation du projet
└── .gitignore            : Fichiers ignorés par Git
```

## Tests
Cliquer sur « Tester » en bas de page : chaque vérification affiche la valeur attendue, la valeur obtenue et PASS/FAIL (tolérance relative 0,5 % ; pH : 0,01).

## Auteur et licence
Senky — licence MIT.
