import { MOMENTS, LIEUX, PAYS, OUVERTURES, SENSATIONS, CLOTURES } from './recits'

const ESPACE = ' '
const VOYELLE = /^[aeiouyéèêâîôûœ]/i

function empreinte(texte) {
  let h = 0
  for (const caractere of texte) {
    h = (h * 31 + caractere.codePointAt(0)) >>> 0
  }
  return h
}

export function lieux(parfum) {
  const exception = LIEUX[parfum.id]
  return {
    ville: parfum.nom,
    aVille: exception?.aVille ?? `à ${parfum.nom}`,
    deVille: exception?.deVille ?? (VOYELLE.test(parfum.nom) ? `d’${parfum.nom}` : `de ${parfum.nom}`),
    dansPays: PAYS[parfum.pays] ?? `en ${parfum.pays}`,
  }
}

function remplir(modele, valeurs) {
  return modele.replace(/\{(\w+)\}/g, (_, cle) => valeurs[cle])
}

export function ecrireRecit(parfum, numero) {
  const m = parfum.meteo
  const heure = Number(m.heureLocale.slice(11, 13))
  const { moment } = MOMENTS.find((p) => heure < p.avant)
  const temps = OUVERTURES[parfum.notes.tete.raison] ?? OUVERTURES['temps indéterminé']
  const ouvertures = temps[moment]
  const sensations = SENSATIONS.find((p) => m.temperature < p.max).phrases
  const clotures = CLOTURES[parfum.sillage.niveau]

  let tirage = empreinte(parfum.id) + numero
  const choisir = (variantes) => {
    const choix = variantes[tirage % variantes.length]
    tirage = Math.floor(tirage / variantes.length)
    return choix
  }

  const valeurs = {
    ...lieux(parfum),
    temperature: `${Math.round(m.temperature)}${ESPACE}°C`,
  }

  return [choisir(ouvertures), choisir(sensations), choisir(clotures)].map((modele) =>
    remplir(modele, valeurs),
  )
}
