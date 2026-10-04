import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { BoxGeometry, MathUtils, MeshStandardMaterial, Vector3 } from 'three'
import { pointVitrine } from './vitrine'

const VITESSE = 6
const SENSIBILITE = 0.01
const INCLINAISON_MAX = 0.5

const GEO_CORPS = new BoxGeometry(0.26, 0.3, 0.1)
const GEO_BOUCHON = new BoxGeometry(0.09, 0.08, 0.09)
const MAT_BOUCHON = new MeshStandardMaterial({
  color: '#c9b37e',
  metalness: 0.3,
  roughness: 0.3,
})

const cible = new Vector3()

export function Flacon({ parfum, position, estSelectionne, onSelect }) {
  const ref = useRef()
  const pivot = useRef()
  const glissement = useRef(null)
  const [survole, setSurvole] = useState(false)
  const [positionInitiale] = useState(position)

  useCursor(survole, estSelectionne ? 'grab' : 'pointer')

  useFrame((state, delta) => {
    const t = 1 - Math.exp(-VITESSE * delta)

    if (estSelectionne) {
      pointVitrine(state.camera, state.size, cible)
    } else {
      cible.set(position[0], position[1], position[2])
    }
    ref.current.position.lerp(cible, t)

    if (!estSelectionne) {
      const r = pivot.current.rotation
      r.y = MathUtils.euclideanModulo(r.y + Math.PI, Math.PI * 2) - Math.PI
      r.y = MathUtils.lerp(r.y, 0, t)
      r.x = MathUtils.lerp(r.x, 0, t)
    }
  })

  function debutGlissement(e) {
    if (!estSelectionne) return
    e.stopPropagation()
    e.target.setPointerCapture(e.pointerId)
    const r = pivot.current.rotation
    glissement.current = { x: e.clientX, y: e.clientY, ry: r.y, rx: r.x }
  }

  function pendantGlissement(e) {
    const g = glissement.current
    if (!g) return
    const r = pivot.current.rotation
    r.y = g.ry + (e.clientX - g.x) * SENSIBILITE
    r.x = MathUtils.clamp(
      g.rx + (e.clientY - g.y) * SENSIBILITE,
      -INCLINAISON_MAX,
      INCLINAISON_MAX,
    )
  }

  function finGlissement(e) {
    if (!glissement.current) return
    glissement.current = null
    e.target.releasePointerCapture(e.pointerId)
  }

  const misEnValeur = survole || estSelectionne

  return (
    <group
      ref={ref}
      position={positionInitiale}
      scale={misEnValeur ? 1.15 : 1}
      onPointerOver={(e) => {
        e.stopPropagation()
        setSurvole(true)
      }}
      onPointerOut={() => setSurvole(false)}
      onClick={(e) => {
        e.stopPropagation()
        if (e.delta > 5) return
        onSelect(parfum.id)
      }}
      onPointerDown={debutGlissement}
      onPointerMove={pendantGlissement}
      onPointerUp={finGlissement}
      onPointerCancel={finGlissement}
    >
      <group ref={pivot}>
        <mesh geometry={GEO_CORPS}>
          <meshStandardMaterial
            color={parfum.couleur}
            emissive={parfum.couleur}
            emissiveIntensity={misEnValeur ? 0.4 : 0}
            roughness={0.25}
          />
        </mesh>
        <mesh geometry={GEO_BOUCHON} material={MAT_BOUCHON} position={[0, 0.19, 0]} />
      </group>
    </group>
  )
}