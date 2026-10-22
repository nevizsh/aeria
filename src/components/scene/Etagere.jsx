import { BoxGeometry, MathUtils, MeshStandardMaterial } from 'three'

const LARGEUR = 3.6

const GEO_PLANCHE = new BoxGeometry(LARGEUR, 0.04, 0.5)
const GEO_FOND = new BoxGeometry(LARGEUR, 1.3, 0.03)
const GEO_REGLETTE = new BoxGeometry(LARGEUR * 0.9, 0.02, 0.02)
const MAT_LAITON = new MeshStandardMaterial({ color: '#c9a45c', metalness: 0.85, roughness: 0.3 })
const MAT_FOND = new MeshStandardMaterial({ color: '#efe6d8', roughness: 0.9 })

export function Etagere({ angle, rayon, hauteurFlacons, basFlacons }) {
  const a = MathUtils.degToRad(angle)
  const placer = (distance, y) => [distance * Math.sin(a), y, -distance * Math.cos(a)]
  const orientation = [0, -a, 0]

  return (
    <group>
      <mesh geometry={GEO_PLANCHE} material={MAT_LAITON} position={placer(rayon - 0.1, basFlacons - 0.02)} rotation={orientation} />
      <mesh geometry={GEO_FOND} material={MAT_FOND} position={placer(rayon + 0.35, hauteurFlacons + 0.1)} rotation={orientation} />
      <mesh geometry={GEO_REGLETTE} material={MAT_LAITON} position={placer(rayon + 0.3, hauteurFlacons + 0.7)} rotation={orientation} />
      <pointLight position={placer(rayon - 0.4, hauteurFlacons + 0.6)} color="#fff4e6" intensity={4} distance={4} decay={2} />
    </group>
  )
}