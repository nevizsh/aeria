import { Vector3 } from 'three'

const DISTANCE_VITRINE = 2
const LARGEUR_FICHE = 460
const POINT_BASCULE = 768

const direction = new Vector3()

export function pointVitrine(camera, size, sortie) {
  let x = 0
  let y = 0
  if (size.width > POINT_BASCULE) {
    x = -LARGEUR_FICHE / size.width
  } else {
    y = 0.6
  }
  direction.set(x, y, 0.5).unproject(camera).sub(camera.position).normalize()
  return sortie.copy(camera.position).addScaledVector(direction, DISTANCE_VITRINE)
}