const MOMENTS = [
  { avant: 5, texte: 'Cette nuit' },
  { avant: 12, texte: 'Ce matin' },
  { avant: 18, texte: 'Cet après-midi' },
  { avant: 23, texte: 'Ce soir' },
  { avant: 24, texte: 'Cette nuit' },
]

const VENTS = [
  { avant: 6, texte: 'un vent calme' },
  { avant: 20, texte: 'une brise légère' },
  { avant: 39, texte: 'un vent modéré' },
  { avant: Infinity, texte: 'un vent fort' },
]

const AIRS = [
  { avant: 40, texte: 'l’air sec' },
  { avant: 70, texte: 'l’air doux' },
  { avant: Infinity, texte: 'l’air humide' },
]

const ESPACE = ' '

function palier(paliers, valeur) {
  return paliers.find((p) => valeur < p.avant).texte
}

function nombre(valeur) {
  return valeur.toLocaleString('fr-FR')
}

export function raconterMeteo(ville, meteo, ciel) {
  const heure = Number(meteo.heureLocale.slice(11, 13))
  const vent = Math.round(meteo.vent)
  const humidite = Math.round(meteo.humidite)
  const nuages = Math.round(meteo.nuages)
  const couverture = nuages === 0 ? 'pas un nuage' : `${nuages}${ESPACE}% de nuages`
  const pluie =
    meteo.precipitation > 0
      ? `${nombre(meteo.precipitation)}${ESPACE}mm de précipitations`
      : 'sans pluie'

  return (
    `${palier(MOMENTS, heure)} à ${ville}${ESPACE}: ${ciel}, ` +
    `${Math.round(meteo.temperature)}${ESPACE}°C, ` +
    `${palier(AIRS, humidite)} à ${humidite}${ESPACE}%, ` +
    `${palier(VENTS, vent)} de ${vent}${ESPACE}km/h, ` +
    `${couverture}, ${pluie}.`
  )
}
