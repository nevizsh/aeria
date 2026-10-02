// Règles de composition d'Aeria.
// Ce fichier ne contient QUE des données : pour changer une note
// ou un seuil, on le modifie ici, jamais dans la logique.
// Spécification correspondante : docs/composition-des-parfums.md

// ── Note de tête ← type de temps (codes WMO renvoyés par Open-Meteo)
export const NOTES_TETE = [
  { codes: [0, 1], note: 'Bergamote', temps: 'ciel clair' },
  { codes: [2, 3], note: 'Feuille de violette', temps: 'ciel nuageux' },
  { codes: [45, 48], note: 'Iris', temps: 'brouillard' },
  { codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], note: 'Pétrichor', temps: 'pluie' },
  { codes: [71, 73, 75, 77, 85, 86], note: 'Accord givré', temps: 'neige' },
  { codes: [95, 96, 99], note: 'Ozone', temps: 'orage' },
]

// Si l'API renvoie un code imprévu, on ne plante pas : note neutre.
export const NOTE_TETE_PAR_DEFAUT = { note: 'Accord aérien', temps: 'temps indéterminé' }

// ── Paliers : triés par ordre croissant, on prend le premier
// dont la valeur reste strictement sous "max".
// Infinity sert de dernier palier « au-dessus de tout ».

// Note de cœur ← température (°C)
export const NOTES_COEUR = [
  { max: 0, note: 'Aiguilles de pin' },
  { max: 12, note: 'Lavande' },
  { max: 22, note: 'Rose' },
  { max: 30, note: "Fleur d'oranger" },
  { max: Infinity, note: 'Safran' },
]

// Note de fond ← humidité (%)
export const NOTES_FOND = [
  { max: 30, note: 'Ambre' },
  { max: 60, note: 'Cèdre' },
  { max: 80, note: 'Vétiver' },
  { max: Infinity, note: 'Mousse de chêne' },
]

// Sillage ← vent (km/h)
export const SILLAGES = [
  { max: 15, niveau: 'léger' },
  { max: 35, niveau: 'moyen' },
  { max: Infinity, niveau: 'fort' },
]
export const VENT_MAX = 50 // vent (km/h) correspondant à une intensité de 1

export const ACCORD_NOCTURNE = 'Accord musqué nocturne'

// ── Couleur du flacon (format HSL : teinte, saturation, luminosité)
export const COULEUR = {
  temperatureMin: -10, // à cette température ou en dessous → teinte froide
  temperatureMax: 35,  // à cette température ou au-dessus → teinte chaude
  teinteFroide: 220,   // bleu (en degrés sur le cercle chromatique)
  teinteChaude: 20,    // orange
  saturation: 70,      // %
  luminositeBase: 60,  // %
  effetNuages: 20,     // points de luminosité perdus à 100 % de nuages
  effetNuit: 15,       // points de luminosité perdus la nuit
}