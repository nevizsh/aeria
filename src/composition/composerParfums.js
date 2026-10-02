import {
  NOTES_TETE, NOTE_TETE_PAR_DEFAUT, NOTES_COEUR, NOTES_FOND,
  SILLAGES, VENT_MAX, ACCORD_NOCTURNE, COULEUR,
} from './regles'

// ── Petits outils mathématiques

// Garde une valeur entre min et max.
const limiter = (valeur, min, max) => Math.min(Math.max(valeur, min), max)

// Règle de trois bornée : ramène une valeur de l'intervalle [a, b]
// vers l'intervalle [c, d]. Ex. : -10 °C → 220 (bleu), 35 °C → 20 (orange).
function convertir(valeur, a, b, c, d) {
  const progression = limiter((valeur - a) / (b - a), 0, 1) // entre 0 et 1
  return c + progression * (d - c)
}

const choisirPalier = (paliers, valeur) => paliers.find((p) => valeur < p.max)

// ── Une fonction par dimension du parfum

function noteDeTete(codeMeteo) {
  const regle = NOTES_TETE.find((r) => r.codes.includes(codeMeteo)) ?? NOTE_TETE_PAR_DEFAUT
  return { nom: regle.note, raison: regle.temps }
}

function couleurDuFlacon(m) {
  const teinte = convertir(
    m.temperature,
    COULEUR.temperatureMin, COULEUR.temperatureMax,
    COULEUR.teinteFroide, COULEUR.teinteChaude,
  )
  const luminosite =
    COULEUR.luminositeBase
    - (m.nuages / 100) * COULEUR.effetNuages
    - (m.estJour ? 0 : COULEUR.effetNuit)

  // Une chaîne CSS : comprise à la fois par Three.js (la scène)
  // et par le navigateur (la fiche). Un seul format pour deux usages.
  return `hsl(${Math.round(teinte)}, ${COULEUR.saturation}%, ${Math.round(luminosite)}%)`
}

function composerUnParfum(ville, m) {
  return {
    // Identité : reprise telle quelle de villes.json
    id: ville.id,
    nom: ville.nom,
    pays: ville.pays,
    continent: ville.continent,

    // Données brutes conservées, pour que la fiche puisse les afficher
    meteo: m,

    // La pyramide olfactive, avec la « raison » de chaque note
    notes: {
      tete: noteDeTete(m.codeMeteo),
      coeur: {
        nom: choisirPalier(NOTES_COEUR, m.temperature).note,
        raison: `${Math.round(m.temperature)} °C`,
      },
      fond: {
        nom: choisirPalier(NOTES_FOND, m.humidite).note,
        raison: `${Math.round(m.humidite)} % d'humidité`,
      },
    },
    accordNocturne: m.estJour ? null : ACCORD_NOCTURNE,

    // Pour l'effet « pshit » : un niveau lisible ET une valeur continue
    sillage: {
      niveau: choisirPalier(SILLAGES, m.vent).niveau,
      intensite: limiter(m.vent / VENT_MAX, 0, 1), // entre 0 et 1
    },

    couleur: couleurDuFlacon(m),
  }
}

// ── Point d'entrée : villes + météo → parfums
export function composerParfums(villes, meteo) {
  return villes
    .filter((ville) => {
      if (!meteo[ville.id]) {
        console.warn(`Pas de météo pour ${ville.nom}, flacon ignoré.`)
        return false
      }
      return true
    })
    .map((ville) => composerUnParfum(ville, meteo[ville.id]))
}