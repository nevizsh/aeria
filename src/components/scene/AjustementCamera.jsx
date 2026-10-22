import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { MathUtils } from 'three'

const FOV_VERTICAL = 60
const CHAMP_HORIZONTAL_MIN = 42

export function AjustementCamera() {
  const camera = useThree((etat) => etat.camera)
  const largeur = useThree((etat) => etat.size.width)
  const hauteur = useThree((etat) => etat.size.height)

  useEffect(() => {
    const ratio = largeur / hauteur
    const demiHorizontal = MathUtils.degToRad(CHAMP_HORIZONTAL_MIN / 2)
    const fovNecessaire = MathUtils.radToDeg(2 * Math.atan(Math.tan(demiHorizontal) / ratio))
    camera.fov = Math.max(FOV_VERTICAL, fovNecessaire)
    camera.updateProjectionMatrix()
  }, [camera, largeur, hauteur])

  return null
}