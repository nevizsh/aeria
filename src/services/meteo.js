import villes from '../data/villes.json'
import meteoSecours from '../data/meteo-secours.json'

const URL_API = 'https://api.open-meteo.com/v1/forecast'

// Variables météo "actuelles" demandées à Open-Meteo.
const VARIABLES = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'wind_speed_10m',
  'cloud_cover',
  'is_day',
  'weather_code',
]

// Au-delà de ce délai, on abandonne et on passe au secours.
// Sans ça, un fetch peut rester bloqué très longtemps
// et l'utilisateur attendrait devant une boutique vide.
const DELAI_MAX_MS = 8000

// Traduit un résultat Open-Meteo dans le format d'Aeria.
// Le reste de l'application ne connaîtra QUE ce format :
// si un jour on change d'API, seul ce fichier sera modifié.
function normaliser(point) {
  const c = point.current
  return {
    temperature: c.temperature_2m,      // °C
    humidite: c.relative_humidity_2m,   // %
    precipitation: c.precipitation,     // mm
    vent: c.wind_speed_10m,             // km/h
    nuages: c.cloud_cover,              // %
    estJour: c.is_day === 1,            // l'API renvoie 0 ou 1
    codeMeteo: c.weather_code,          // code WMO (pluie, neige, orage…)
    heureLocale: c.time,                // grâce à timezone=auto
  }
}

export async function chargerMeteo() {
  // Une seule requête pour les 25 villes : coordonnées séparées par des virgules.
  const params = new URLSearchParams({
    latitude: villes.map((v) => v.latitude).join(','),
    longitude: villes.map((v) => v.longitude).join(','),
    current: VARIABLES.join(','),
    timezone: 'auto', // heure locale de chaque ville, pas la tienne
  })

  try {
    const reponse = await fetch(`${URL_API}?${params}`, {
      signal: AbortSignal.timeout(DELAI_MAX_MS),
    })

    // fetch ne lève PAS d'erreur sur un 404 ou un 500 :
    // il faut vérifier le statut nous-mêmes.
    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`)

    const donnees = await reponse.json()

    // Avec plusieurs coordonnées, Open-Meteo renvoie un tableau,
    // dans le même ordre que nos villes. Avec une seule, un objet.
    // On sécurise les deux cas.
    const resultats = Array.isArray(donnees) ? donnees : [donnees]

    // On range par id de ville. Après cette étape, plus personne
    // n'a besoin de connaître l'ordre des villes dans la requête.
    const meteo = {}
    villes.forEach((ville, i) => {
      meteo[ville.id] = normaliser(resultats[i])
    })

    return { source: 'api', meteo }
  } catch (erreur) {
    console.warn('Open-Meteo indisponible, repli sur la météo de secours :', erreur)
    return { source: 'secours', meteo: meteoSecours }
  }
}