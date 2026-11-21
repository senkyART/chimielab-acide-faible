# ChimieLab — Acide faible dans l'eau
Calculateur web pour résoudre les exercices d'acide faible dans l'eau (pH, conductimétrie, constante K), avec rédaction pas à pas de type examen.

## Fonctionnalités
- 3 modes de calcul correspondant aux 3 situations du cours
- Rédaction détaillée : formule → application numérique → calcul → résultat avec unité
- Vérification de K à partir de x
- Conversions d'unités automatiques (σ et λ)
- Bouton « Copier la solution » (compatible file://), historique des 5 derniers calculs, thème sombre/clair
- Bouton « Tester » : tests numériques réels avec PASS/FAIL

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
- λ_H₃O⁺ par défaut : 35,0 mS·m²·mol⁻¹ = 0,035 S·m²·mol⁻¹ (modifiable)

## Utilisation
Ouvrir index.html dans un navigateur (double-clic). Aucune installation, aucun serveur. Connexion internet utile uniquement pour les polices Google Fonts.

## Structure du projet
chimielab-acide-faible/
├── index.html            : Structure sémantique du site (aucun style ni script en ligne)
├── css/
│   ├── variables.css     : Jetons de design et variables pour thèmes sombre et clair
│   ├── base.css          : Reset, mise en page globale, arrière-plan et en-tête
│   └── components.css    : Cartes, boutons, champs, résultats, modale et notifications
├── js/
│   ├── parser.js         : Analyse numérique stricte (virgule, puissances de 10)
│   ├── format.js         : Formatage scientifique d'affichage et texte brut
│   ├── units.js          : Conversions d'unités centralisées (source unique de vérité)
│   ├── calc.js           : Fonctions scientifiques pures des 3 modes (sans DOM)
│   ├── state.js          : Objet d'état global de l'application
│   ├── clipboard.js      : Gestion de la copie presse-papiers avec repli file://
│   ├── history.js        : Gestion de l'historique en mémoire (5 derniers calculs)
│   ├── solution.js       : Rendu des cartes de résultats et rédaction détaillée d'examen
│   ├── form.js           : Gestion dynamique du formulaire et calcul en direct
│   ├── tester.js         : Suite de tests automatisée avec assertions numériques réelles
│   └── main.js           : Initialisation et liaison des événements DOMContentLoaded
├── README.md             : Documentation du projet
├── .gitignore            : Fichiers ignorés par Git
└── LICENSE               : Licence MIT

## Tests
Cliquer sur « Tester » : chaque vérification affiche la valeur attendue, la valeur obtenue et PASS/FAIL (tolérance relative 0,5 % ; pH : 0,01).

## Auteur et licence
<MON_NOM> — licence MIT.
