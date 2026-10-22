# Aeria

**Une parfumerie de villes** : une boutique en 3D où chaque flacon contient la météo en direct d'une ville.

🔗 **Site en ligne : https://aeria-genevieve.netlify.app**

Projet réalisé dans le cadre du BUT MMI (3e année, parcours Développement web et dispositifs interactifs), Université de la Nouvelle-Calédonie.

## Le concept

La boutique compte 5 sections, une par continent (Europe, Asie, Océanie, Afrique, Amériques), et 5 flacons par section, soit 25 parfums. Chaque parfum est **composé à partir de la météo actuelle de sa ville** :

- le type de temps donne la **note de tête**, la température la **note de cœur** et l'humidité la **note de fond** ;
- la nuit ajoute un **accord nocturne** ;
- le vent règle le **sillage**, c'est-à-dire l'ampleur de l'effet « vaporiser » ;
- la température et la couverture nuageuse déterminent la **couleur du flacon**.

Les règles complètes sont décrites dans [`docs/composition-parfums.md`](docs/composition-parfums.md).

## Fonctionnalités

- Page d'accueil, puis entrée dans la boutique par un fondu au blanc.
- Boutique 3D vue depuis son centre : on regarde autour de soi en faisant glisser la vue.
- Survol et sélection d'un flacon : il vient se présenter face à l'utilisateur.
- Rotation du flacon présenté, à la souris ou au doigt.
- Fiche parfum en carte papier : la météo en direct racontée en une phrase, la pyramide olfactive avec la donnée qui explique chaque note, et le sillage.
- Bouton « Vaporiser » : brume de particules en 3D, puis voile coloré sur tout l'écran.
- Interface responsive : carte flottante sur ordinateur, panneau montant du bas sur mobile ; le flacon reste visible dans les deux cas.
- Repli automatique sur une météo de secours si l'API est indisponible.
- HUD et menu des 5 continents : la caméra pivote vers la section choisie, et le nom affiché suit le regard.

## Stack technique

- **React** (Vite) pour l'interface
- **Three.js** via **React Three Fiber** et **drei** pour la scène 3D
- **CSS Modules** pour les styles
- **Google Fonts** : WindSong (noms des villes) et Cormorant Garamond (fiche parfum)
- **Open-Meteo** pour la météo en direct
- **Netlify** pour le déploiement

## Données

- `src/data/villes.json` : les 25 villes (nom, pays, continent, coordonnées).
- `src/data/continents.js` : l'ordre et la position des 5 sections dans la boutique.
- `src/services/meteo.js` : la météo des 25 villes est récupérée en **une seule requête** groupée (coordonnées séparées par des virgules). En cas d'échec ou de délai dépassé, l'application bascule sur `src/data/meteo-secours.json`, un relevé réel au même format.
- `src/composition/` : transforme villes et météo en parfums, consommés par la scène 3D et par l'interface.

## Architecture

```
src/
├── data/          villes, continents, météo de secours
├── services/      appel à l'API Open-Meteo et repli
├── composition/   règles et calcul des parfums
├── hooks/         useParfums : chargement et composition
└── components/
    ├── scene/     éléments 3D (boutique, flacon, brume)
    └── ui/        interface HTML (fiche parfum, voile)
```

Le schéma d'intégration des données est disponible dans [`docs/`](docs/).

## Installation

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Pour produire et prévisualiser la version finale :

```bash
npm run build
npm run preview
```

## Organisation du travail

- Branches : `main` (version en ligne), `develop` (intégration) et `feature/*` (une branche par fonctionnalité).
- Messages de commit au format **Conventional Commits** (`feat`, `fix`, `docs`, `refactor`, `style`, `build`…).
- Déploiement automatique sur Netlify à chaque mise à jour de `main`.

## Documents de préparation

Tous les documents sont dans [`docs/`](docs/) :

- plan au sol de la boutique, arborescence et schéma d'intégration des données ;
- [wireframes](docs/aeria-wireframes.pdf) desktop et mobile ;
- planning ;
- [règles de composition des parfums](docs/composition-parfums.md).

## Crédits

Données météo : [Open-Meteo](https://open-meteo.com/), sous licence CC BY 4.0.
Polices : [WindSong](https://fonts.google.com/specimen/WindSong) et [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond), sous licence SIL Open Font License 1.1.
Modèles 3D des flacons : « Perfumes Bottles Pack - Low Poly » par [JiggleSticks](https://sketchfab.com/JiggleSticks), sous licence [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) ([source](https://sketchfab.com/3d-models/perfumes-bottles-pack-low-poly-655e262f3d2c41fbb7de78b348585b08)).