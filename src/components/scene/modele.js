import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Matrix4, Vector3 } from 'three'

const CHEMIN = '/modeles/flacons.glb'
const HAUTEUR_FLACON = 0.3

const FLACON_PAR_CONTINENT = {
  europe: 1,
  asie: 2,
  oceanie: 3,
  afrique: 4,
  ameriques: 5,
}

function preparerFlacon(nodes, numero) {
  const pieces = Object.values(nodes).filter(
    (n) => n.isMesh && n.name.startsWith(`Perfume_${numero}_`),
  )

  const geometries = pieces.map((p) => p.geometry.clone().applyMatrix4(p.matrixWorld))

  const boite = new Box3()
  geometries.forEach((g) => {
    g.computeBoundingBox()
    boite.union(g.boundingBox)
  })
  const taille = boite.getSize(new Vector3())
  const centre = boite.getCenter(new Vector3())
  const echelle = HAUTEUR_FLACON / taille.y

  const normalisation = new Matrix4()
    .makeScale(echelle, echelle, echelle)
    .multiply(new Matrix4().makeTranslation(-centre.x, -centre.y, -centre.z))

  geometries.forEach((g) => g.applyMatrix4(normalisation))

  return pieces.map((p, i) => ({
    geometry: geometries[i],
    material: p.material,
    estLiquide: p.name.includes('Liquido'),
  }))
}

export function useModelesFlacons() {
  const { scene, nodes } = useGLTF(CHEMIN)

  return useMemo(() => {
    scene.updateMatrixWorld(true)
    return Object.fromEntries(
      Object.entries(FLACON_PAR_CONTINENT).map(([continent, numero]) => [
        continent,
        preparerFlacon(nodes, numero),
      ]),
    )
  }, [scene, nodes])
}

useGLTF.preload(CHEMIN)