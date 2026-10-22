const FICHIERS = {
  musique: '/sons/musique.mp3',
  clic: '/sons/clic.mp3',
  whoosh: '/sons/whoosh.mp3',
  pshit: '/sons/pshit.mp3',
}

const VOLUME_MUSIQUE = 0.15
const VOLUME_EFFETS = 0.35
const FONDU_MUSIQUE = 2.5
const SEUIL_SILENCE = 1e-4
const CLE_STOCKAGE = 'aeria-son-coupe'

const tampons = {}
const abonnes = new Set()
let contexte = null
let volumeGeneral = null
let voieMusique = null
let voieEffets = null
let coupe = lireChoix()

function lireChoix() {
  try {
    return localStorage.getItem(CLE_STOCKAGE) === 'oui'
  } catch {
    return false
  }
}

function ecrireChoix(valeur) {
  try {
    localStorage.setItem(CLE_STOCKAGE, valeur ? 'oui' : 'non')
  } catch {
    return
  }
}

async function charger(nom) {
  try {
    const reponse = await fetch(FICHIERS[nom])
    if (!reponse.ok) return
    tampons[nom] = await contexte.decodeAudioData(await reponse.arrayBuffer())
  } catch {
    delete tampons[nom]
  }
}

function bornesSonores(tampon) {
  const canal = tampon.getChannelData(0)
  let debut = 0
  while (debut < canal.length - 1 && Math.abs(canal[debut]) < SEUIL_SILENCE) debut++
  let fin = canal.length - 1
  while (fin > debut && Math.abs(canal[fin]) < SEUIL_SILENCE) fin--
  return { debut: debut / tampon.sampleRate, fin: (fin + 1) / tampon.sampleRate }
}

function lancerMusique() {
  const tampon = tampons.musique
  if (!tampon) return
  const { debut, fin } = bornesSonores(tampon)
  const source = contexte.createBufferSource()
  source.buffer = tampon
  source.loop = true
  source.loopStart = debut
  source.loopEnd = fin
  source.connect(voieMusique)
  const maintenant = contexte.currentTime
  voieMusique.gain.setValueAtTime(0, maintenant)
  voieMusique.gain.linearRampToValueAtTime(VOLUME_MUSIQUE, maintenant + FONDU_MUSIQUE)
  source.start(0, debut)
}

function surClic(e) {
  const bouton = e.target.closest('button')
  if (!bouton || bouton.disabled || bouton.dataset.son === 'aucun') return
  jouer('clic')
}

function surVisibilite() {
  if (document.hidden) contexte.suspend()
  else contexte.resume()
}

export async function demarrer() {
  if (contexte) return
  const Contexte = window.AudioContext || window.webkitAudioContext
  if (!Contexte) return

  contexte = new Contexte()
  volumeGeneral = contexte.createGain()
  volumeGeneral.gain.value = coupe ? 0 : 1
  volumeGeneral.connect(contexte.destination)
  voieMusique = contexte.createGain()
  voieMusique.gain.value = 0
  voieMusique.connect(volumeGeneral)
  voieEffets = contexte.createGain()
  voieEffets.gain.value = VOLUME_EFFETS
  voieEffets.connect(volumeGeneral)

  document.addEventListener('click', surClic)
  document.addEventListener('visibilitychange', surVisibilite)
  contexte.resume()

  await Promise.all(Object.keys(FICHIERS).map(charger))
  lancerMusique()
}

export function jouer(nom) {
  if (!contexte || coupe || !tampons[nom]) return
  const source = contexte.createBufferSource()
  source.buffer = tampons[nom]
  source.connect(voieEffets)
  source.start()
}

export function estCoupe() {
  return coupe
}

export function basculerSon() {
  coupe = !coupe
  ecrireChoix(coupe)
  if (volumeGeneral) {
    volumeGeneral.gain.setTargetAtTime(coupe ? 0 : 1, contexte.currentTime, 0.1)
  }
  abonnes.forEach((prevenir) => prevenir())
}

export function abonner(prevenir) {
  abonnes.add(prevenir)
  return () => abonnes.delete(prevenir)
}
