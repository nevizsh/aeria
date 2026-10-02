# Composition des parfums

Chaque parfum d'Aeria est composé à partir de la météo en direct de sa ville,
récupérée via Open-Meteo. La composition suit la structure classique de la
**pyramide olfactive** : chaque niveau du parfum est piloté par une seule
donnée météo, pour que le lien entre la donnée et le parfum reste explicable.

| Niveau | Rôle en parfumerie | Donnée météo |
|---|---|---|
| Note de tête | Perçue immédiatement, s'évapore vite | Type de temps |
| Note de cœur | Identité du parfum | Température |
| Note de fond | Persiste sur la peau | Humidité |

Implémentation : `src/composition/regles.js` (tables) et
`src/composition/composerParfums.js` (logique).

## Note de tête ← type de temps

Basée sur le code météo WMO renvoyé par Open-Meteo (`weather_code`).

| Temps | Codes WMO | Note |
|---|---|---|
| Ciel clair | 0, 1 | Bergamote |
| Nuageux | 2, 3 | Feuille de violette |
| Brouillard | 45, 48 | Iris |
| Pluie, bruine, averses | 51–57, 61–67, 80–82 | Pétrichor |
| Neige | 71–77, 85, 86 | Accord givré |
| Orage | 95, 96, 99 | Ozone |
| Code inconnu | — | Accord aérien |

## Note de cœur ← température

| Température | Note |
|---|---|
| Moins de 0 °C | Aiguilles de pin |
| De 0 à 12 °C | Lavande |
| De 12 à 22 °C | Rose |
| De 22 à 30 °C | Fleur d'oranger |
| 30 °C et plus | Safran |

## Note de fond ← humidité relative

| Humidité | Note |
|---|---|
| Moins de 30 % | Ambre |
| De 30 à 60 % | Cèdre |
| De 60 à 80 % | Vétiver |
| 80 % et plus | Mousse de chêne |

Pour chaque palier, la borne basse est incluse et la borne haute exclue
(ex. : 12 °C donne Rose, pas Lavande).

## Modificateurs

### Accord nocturne ← jour ou nuit

Lorsqu'il fait nuit dans la ville (`is_day = 0`), un **accord musqué nocturne**
s'ajoute aux trois notes.

### Sillage ← vitesse du vent

Le vent ne modifie pas l'odeur mais l'intensité de l'effet « vaporiser » à l'écran.

| Vent | Sillage |
|---|---|
| Moins de 15 km/h | Léger |
| De 15 à 35 km/h | Moyen |
| 35 km/h et plus | Fort |

L'intensité de l'animation est également calculée de façon continue, entre 0
(vent nul) et 1 (vent de 50 km/h ou plus).

## Couleur du flacon

La couleur est exprimée en HSL (teinte, saturation, luminosité).

| Composante | Donnée météo | Règle |
|---|---|---|
| Teinte | Température | De 220° (bleu) à −10 °C jusqu'à 20° (orange) à 35 °C, de façon continue |
| Saturation | — | Fixe, 70 % |
| Luminosité | Nuages et jour/nuit | 60 % de base, jusqu'à −20 points par ciel couvert, −15 points la nuit |

En dehors de l'intervalle −10 °C / 35 °C, la teinte reste bloquée à sa valeur
extrême.

## Exemple

Bergen, 9 °C, pluie, 88 % d'humidité, vent 22 km/h, de nuit, ciel couvert :

- Tête : Pétrichor (pluie)
- Cœur : Lavande (9 °C)
- Fond : Mousse de chêne (88 % d'humidité)
- Accord musqué nocturne
- Sillage moyen
- Couleur : bleu-violet sombre