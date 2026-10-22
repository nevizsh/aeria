import { useLayoutEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { Euler, Vector3 } from 'three'
import { ContenuFlacon } from './Flacon'
import { useModelesFlacons } from './modele'
import { useManipulation } from './useManipulation'

const DISTANCE = 1.6
const ECHELLE = 1.5
const POINT_BASCULE = 768
const VITESSE_APPARITION = 2.5
const INCLINAISON_DEPART = new Euler(0.3, 0, 0.15)

const direction = new Vector3()

export function FlaconAccueil({ parfum }) {
  const groupe = useRef()
  const pivot = useRef()
  const apparition = useRef(0)
  const modeles = useModelesFlacons()
  const [survole, setSurvole] = useState(false)
  const [immobile] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const { saisir, animer } = useManipulation(pivot, {
    actif: true,
    partout: false,
    vitesseRepos: 0.5,
    axeRepos: 'monde',
  })

  useCursor(survole, 'grab')

  useLayoutEffect(() => {
    pivot.current.quaternion.setFromEuler(INCLINAISON_DEPART)
  }, [])

  useFrame(({ camera, size }, delta) => {
    const surOrdinateur = size.width > POINT_BASCULE
    direction
      .set(surOrdinateur ? 0.45 : 0, surOrdinateur ? -0.05 : 0.5, 0.5)
      .unproject(camera)
      .sub(camera.position)
      .normalize()
    groupe.current.position.copy(camera.position).addScaledVector(direction, DISTANCE)

    apparition.current = immobile ? 1 : Math.min(apparition.current + delta * VITESSE_APPARITION, 1)
    const douceur = 1 - (1 - apparition.current) ** 3
    groupe.current.scale.setScalar(ECHELLE * douceur)

    animer(pivot.current.quaternion, camera, delta)
  })

  return (
    <group
      ref={groupe}
      onPointerDown={saisir}
      onPointerOver={(e) => {
        e.stopPropagation()
        setSurvole(true)
      }}
      onPointerOut={() => setSurvole(false)}
    >
      <group ref={pivot}>
        <ContenuFlacon pieces={modeles[parfum.continent]} couleur={parfum.couleur} eclat={0.5} />
      </group>
    </group>
  )
}
