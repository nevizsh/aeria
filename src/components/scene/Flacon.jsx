import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { Quaternion, Vector3 } from 'three'
import { pointVitrine } from './vitrine'

const VITESSE = 6
const SENSIBILITE = 0.012
const FREIN_INERTIE = 3
const ROTATION_LIBRE = 0.3
const DELAI_ARRET = 80

const cible = new Vector3()
const AXE_LOCAL = new Vector3(0, 1, 0)
const HAUT = new Vector3()
const DROITE = new Vector3()
const pas = new Quaternion()
const DROIT = new Quaternion()

function tourner(quaternion, camera, horizontal, vertical) {
  HAUT.set(0, 1, 0).applyQuaternion(camera.quaternion)
  DROITE.set(1, 0, 0).applyQuaternion(camera.quaternion)
  quaternion.premultiply(pas.setFromAxisAngle(HAUT, horizontal))
  quaternion.premultiply(pas.setFromAxisAngle(DROITE, vertical))
}

export function Flacon({ parfum, pieces, position, estSelectionne, onSelect }) {
  const ref = useRef()
  const pivot = useRef()
  const glissement = useRef(null)
  const elan = useRef({ x: 0, y: 0 })
  const [survole, setSurvole] = useState(false)
  const [positionInitiale] = useState(position)
  const canvas = useThree((etat) => etat.gl.domElement)
  const camera = useThree((etat) => etat.camera)

  useCursor(survole && !estSelectionne)

  useEffect(() => {
    if (!estSelectionne) return

    const debut = (e) => {
      glissement.current = { x: e.clientX, y: e.clientY, temps: performance.now() }
      elan.current = { x: 0, y: 0 }
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = 'grabbing'
    }

    const deplacement = (e) => {
      const g = glissement.current
      if (!g) return
      const dx = (e.clientX - g.x) * SENSIBILITE
      const dy = (e.clientY - g.y) * SENSIBILITE
      tourner(pivot.current.quaternion, camera, dx, dy)
      elan.current = { x: dy, y: dx }
      glissement.current = { x: e.clientX, y: e.clientY, temps: performance.now() }
    }

    const fin = (e) => {
      const g = glissement.current
      if (!g) return
      if (performance.now() - g.temps > DELAI_ARRET) {
        elan.current = { x: 0, y: 0 }
      }
      glissement.current = null
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId)
      }
      canvas.style.cursor = 'grab'
    }

    canvas.style.cursor = 'grab'
    canvas.addEventListener('pointerdown', debut)
    canvas.addEventListener('pointermove', deplacement)
    canvas.addEventListener('pointerup', fin)
    canvas.addEventListener('pointercancel', fin)

    return () => {
      canvas.removeEventListener('pointerdown', debut)
      canvas.removeEventListener('pointermove', deplacement)
      canvas.removeEventListener('pointerup', fin)
      canvas.removeEventListener('pointercancel', fin)
      canvas.style.cursor = ''
      glissement.current = null
    }
  }, [estSelectionne, canvas, camera])

  useFrame((state, delta) => {
    const t = 1 - Math.exp(-VITESSE * delta)

    if (estSelectionne) {
      pointVitrine(state.camera, state.size, cible)
    } else {
      cible.set(position[0], position[1], position[2])
    }
    ref.current.position.lerp(cible, t)

    const q = pivot.current.quaternion

    if (estSelectionne) {
      if (!glissement.current) {
        const amorti = Math.exp(-FREIN_INERTIE * delta)
        elan.current.x *= amorti
        elan.current.y *= amorti
        tourner(q, state.camera, elan.current.y * delta * 60, elan.current.x * delta * 60)
        q.multiply(pas.setFromAxisAngle(AXE_LOCAL, ROTATION_LIBRE * delta))
      }
    } else {
      elan.current.x = 0
      elan.current.y = 0
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
        {pieces.map((piece, i) =>
          piece.estLiquide ? (
            <mesh key={i} geometry={piece.geometry} renderOrder={1}>
              <meshStandardMaterial
                color={parfum.couleur}
                emissive={parfum.couleur}
                emissiveIntensity={misEnValeur ? 0.7 : 0.35}
                roughness={0.1}
                transparent
                opacity={0.92}
              />
            </mesh>
          ) : (
            <mesh key={i} geometry={piece.geometry} material={piece.material} renderOrder={2} />
          ),
        )}
      </group>
    </group>
  )
}