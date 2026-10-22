import {
  AdditiveBlending,
  BoxGeometry,
  ExtrudeGeometry,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Shape,
  ShapeGeometry,
} from 'three'
import { TEXTURE_DOUCE, TEXTURE_LAVIS } from './textures'

const LARGEUR = 3.6
const RAYON_ARCHE = 1.95
const HAUTEUR_PIEDROIT = 1.6
const EPAISSEUR_JONC = 0.06

function formeArche(rayon) {
  const forme = new Shape()
  forme.moveTo(-rayon, 0)
  forme.lineTo(-rayon, HAUTEUR_PIEDROIT)
  forme.absarc(0, HAUTEUR_PIEDROIT, rayon, Math.PI, 0, true)
  forme.lineTo(rayon, 0)
  forme.lineTo(-rayon, 0)
  return forme
}

function formeJonc(interieur, exterieur) {
  const forme = new Shape()
  forme.moveTo(-exterieur, 0)
  forme.lineTo(-exterieur, HAUTEUR_PIEDROIT)
  forme.absarc(0, HAUTEUR_PIEDROIT, exterieur, Math.PI, 0, true)
  forme.lineTo(exterieur, 0)
  forme.lineTo(interieur, 0)
  forme.lineTo(interieur, HAUTEUR_PIEDROIT)
  forme.absarc(0, HAUTEUR_PIEDROIT, interieur, 0, Math.PI, false)
  forme.lineTo(-interieur, 0)
  forme.lineTo(-exterieur, 0)
  return forme
}

const GEO_PLANCHE = new BoxGeometry(LARGEUR, 0.04, 0.5)
const GEO_REGLETTE = new BoxGeometry(LARGEUR * 0.9, 0.02, 0.02)
const GEO_NICHE = new ShapeGeometry(formeArche(RAYON_ARCHE), 24)
const GEO_JONC = new ExtrudeGeometry(formeJonc(RAYON_ARCHE, RAYON_ARCHE + EPAISSEUR_JONC), {
  depth: 0.03,
  bevelEnabled: false,
  curveSegments: 24,
})
const GEO_PLAN = new PlaneGeometry(1, 1)

const MAT_LAITON = new MeshStandardMaterial({ color: '#d4ad62', metalness: 0.6, roughness: 0.35 })
const MAT_NICHE = new MeshStandardMaterial({ color: '#2e2236', roughness: 0.9 })
const MAT_REGLETTE = new MeshBasicMaterial({ color: '#ffe2b8' })

const MAT_LAVIS = new MeshBasicMaterial({
  color: '#ffe2b8',
  map: TEXTURE_LAVIS,
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
  blending: AdditiveBlending,
})

const MAT_OMBRE = new MeshBasicMaterial({
  color: '#2e2236',
  map: TEXTURE_DOUCE,
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
})

export function Etagere({ angle, rayon, hauteurFlacons, basFlacons }) {
  const hautTablette = hauteurFlacons + 0.7
  const hauteurLavis = hautTablette - basFlacons

  return (
    <group rotation-y={-MathUtils.degToRad(angle)}>
      <mesh geometry={GEO_NICHE} material={MAT_NICHE} position={[0, 0, -(rayon + 0.45)]} />
      <mesh geometry={GEO_JONC} material={MAT_LAITON} position={[0, 0, -(rayon + 0.44)]} />
      <mesh
        geometry={GEO_PLAN}
        material={MAT_LAVIS}
        position={[0, basFlacons + hauteurLavis / 2, -(rayon + 0.43)]}
        scale={[LARGEUR, hauteurLavis, 1]}
      />
      <mesh geometry={GEO_PLANCHE} material={MAT_LAITON} position={[0, basFlacons - 0.02, -(rayon - 0.1)]} />
      <mesh geometry={GEO_PLANCHE} material={MAT_LAITON} position={[0, hautTablette, -(rayon - 0.1)]} />
      <mesh geometry={GEO_REGLETTE} material={MAT_REGLETTE} position={[0, hautTablette - 0.03, -(rayon - 0.25)]} />
      <mesh
        geometry={GEO_PLAN}
        material={MAT_OMBRE}
        position={[0, 0.01, -(rayon + 0.3)]}
        rotation-x={-Math.PI / 2}
        scale={[4.6, 1.2, 1]}
      />
    </group>
  )
}
