import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { Quaternion, Vector3 } from 'three'
import { pointVitrine } from './vitrine'
import { useManipulation } from './useManipulation'

const VITESSE = 6
const ROTATION_LIBRE = 0.3

const cible = new Vector3()
const DROIT = new Quaternion()

export function Flacon({ parfum, pieces, position, estSelectionne, redresse, onSelect }) {
  const ref = useRef()
  const pivot = useRef()
  const [survole, setSurvole] = useState(false)
  const [positionInitiale] = useState(position)
  const { animer, arreter } = useManipulation(pivot, {
    actif: estSelectionne,
    partout: true,
    vitesseRepos: ROTATION_LIBRE,
    axeRepos: 'local',
  })

  useCursor(survole && !estSelectionne)

  useFrame((state, delta) => {
    const t = 1 - Math.exp(-VITESSE * delta)

    if (estSelectionne) {
      pointVitrine(state.camera, state.size, cible)
    } else {
      cible.set(position[0], position[1], position[2])
    }
    ref.current.position.lerp(cible, t)

    const q = pivot.current.quaternion

    if (redresse) {
      arreter()
      q.slerp(DROIT, t)
    } else if (estSelectionne) {
      animer(q, state.camera, delta)
    } else {
      arreter()
      q.slerp(DROIT, t)
    }
  })

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
    >
      <group ref={pivot}>
        <ContenuFlacon pieces={pieces} couleur={parfum.couleur} eclat={misEnValeur ? 0.7 : 0.35} />
      </group>
    </group>
  )
}

export function ContenuFlacon({ pieces, couleur, eclat }) {
  return pieces.map((piece, i) =>
    piece.estLiquide ? (
      <mesh key={i} geometry={piece.geometry} renderOrder={1}>
        <meshStandardMaterial
          color={couleur}
          emissive={couleur}
          emissiveIntensity={eclat}
          roughness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>
    ) : (
      <mesh key={i} geometry={piece.geometry} material={piece.material} renderOrder={2} />
    ),
  )
}