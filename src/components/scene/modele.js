import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, DoubleSide, Matrix4, Vector3 } from 'three'

const CHEMIN = '/modeles/flacons.glb'
export const HAUTEUR_FLACON = 0.45

const FLACON_PAR_CONTINENT = {
  europe: 1,
  asie: 2,
  oceanie: 3,
  afrique: 4,
  ameriques: 5,
}

function preparerVerre(materiau) {
  const verre = materiau.clone()
  verre.transparent = true
  verre.depthWrite = false
  verre.side = DoubleSide
  verre.roughness = 0.05
  verre.metalness = 0.1
  verre.envMapIntensity = 2
  return verre
}

function preparerFlacon(nodes, numero, verre) {
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
    material: p.material.name === 'Material' ? verre : p.material,
    estLiquide: p.name.includes('Liquido'),
  }))
}

export function useModelesFlacons() {
  const { scene, nodes, materials } = useGLTF(CHEMIN)

  return useMemo(() => {
    scene.updateMatrixWorld(true)
    const verre = preparerVerre(materials.Material)
    return Object.fromEntries(
      Object.entries(FLACON_PAR_CONTINENT).map(([continent, numero]) => [
        continent,
        preparerFlacon(nodes, numero, verre),
      ]),
    )
  }, [scene, nodes, materials])
}

useGLTF.preload(CHEMIN)