import { lieux } from '../../composition/ecrireRecit'

const ESPACE = ' '

const TEMPS_MARQUANTS = {
  orage: (lieu) => `Orage ${lieu}`,
  neige: (lieu) => `Il neige ${lieu}`,
  pluie: (lieu) => `Il pleut ${lieu}`,
  brouillard: (lieu) => `Brouillard ${lieu}`,
}

const CIELS = {
  'ciel clair': (lieu) => `Ciel dégagé ${lieu}`,
  'ciel nuageux': (lieu) => `Ciel couvert ${lieu}`,
}

function faitDuCiel(parfums) {
  for (const [temps, phrase] of Object.entries({ ...TEMPS_MARQUANTS, ...CIELS })) {
    const parfum = parfums.find((p) => p.notes.tete.raison === temps)
    if (parfum) return { parfum, texte: phrase(lieux(parfum).aVille) }
  }
  return null
}

function faitDeChaleur(parfums, dejaCites) {
  const parfum = parfums
    .filter((p) => !dejaCites.includes(p))
    .reduce((plusChaud, p) => (p.meteo.temperature > plusChaud.meteo.temperature ? p : plusChaud))
  return {
    parfum,
    texte: `${Math.round(parfum.meteo.temperature)}${ESPACE}°C ${lieux(parfum).aVille}`,
  }
}

function faitDuJour(parfums, dejaCites) {
  const restants = parfums.filter((p) => !dejaCites.includes(p))
  const nuits = restants.filter((p) => !p.meteo.estJour)
  const jours = restants.filter((p) => p.meteo.estJour)
  const nuitMinoritaire = nuits.length > 0 && nuits.length <= jours.length
  const parfum = nuitMinoritaire || jours.length === 0 ? nuits[0] : jours[0]
  if (!parfum) return null
  const moment = parfum.meteo.estJour ? 'Plein jour' : 'Nuit'
  return { parfum, texte: `${moment} ${lieux(parfum).aVille}` }
}

export function enCeMoment(parfums) {
  if (parfums.length < 3) return []
  const faits = []
  const cites = () => faits.map((f) => f.parfum)

  const ciel = faitDuCiel(parfums)
  if (ciel) faits.push(ciel)
  faits.push(faitDeChaleur(parfums, cites()))
  const jour = faitDuJour(parfums, cites())
  if (jour) faits.push(jour)

  return faits.map((f) => f.texte)
}
