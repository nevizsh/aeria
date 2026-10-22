import { BoxGeometry, MathUtils, MeshStandardMaterial } from 'three'

const LARGEUR = 3.6

const GEO_PLANCHE = new BoxGeometry(LARGEUR, 0.04, 0.5)
const GEO_FOND = new BoxGeometry(LARGEUR, 1.3, 0.03)
const MAT_PLANCHE = new MeshStandardMaterial({ color: '#4a3f57', roughness: 0.8 })
const MAT_FOND = new MeshStandardMaterial({ color: '#221c2b', roughness: 0.9 })

export function Etagere({ angle, rayon, hauteurFlacons }) {
  const a = MathUtils.degToRad(angle)
  const placer = (distance, y) => [distance * Math.sin(a), y, -distance * Math.cos(a)]
  const basFlacons = hauteurFlacons - 0.15

  return (
    <group rotation={[0, 0, 0]}>
      <mesh
        geometry={GEO_PLANCHE}
        material={MAT_PLANCHE}
        position={placer(rayon - 0.1, basFlacons - 0.02)}
        rotation={[0, -a, 0]}
      />
      <mesh
        geometry={GEO_FOND}
        material={MAT_FOND}
        position={placer(rayon + 0.35, hauteurFlacons + 0.1)}
        rotation={[0, -a, 0]}
      />
    </group>
  )
}