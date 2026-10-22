import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, Vector3 } from 'three'
import { pointVitrine } from './vitrine'
import { HAUTEUR_FLACON } from './modele'
import { TEXTURE_DOUCE } from './textures'

const NB_GOUTTES = 80
const HAUTEUR_BOUCHON = HAUTEUR_FLACON * 0.55
const RECUL_HALO = 0.25
const BLANC = new Color('#ffffff')

const origine = new Vector3()
const versCamera = new Vector3()
const direction = new Vector3()

export function dureeJet(sillage) {
  return 1 + sillage.intensite * 0.6
}

export function Brume({ jet }) {
  const gouttes = useRef()
  const materiauGouttes = useRef()
  const halo = useRef()
  const materiauHalo = useRef()
  const temps = useRef(Infinity)
  const duree = useRef(0)
  const tailleHalo = useRef(1)
  const avecGouttes = useRef(true)
  const get = useThree((etat) => etat.get)

  const positions = useMemo(() => new Float32Array(NB_GOUTTES * 3), [])
  const vitesses = useMemo(() => new Float32Array(NB_GOUTTES * 3), [])

  useEffect(() => {
    if (!jet) return
    const { camera, size } = get()
    const { intensite } = jet.sillage

    pointVitrine(camera, size, origine)
    origine.y += HAUTEUR_BOUCHON
    versCamera.copy(camera.position).sub(origine).normalize()
    direction.copy(versCamera).multiplyScalar(0.6).add({ x: 0, y: 0.8, z: 0 }).normalize()

    const vitesse = 0.5 + intensite * 0.7
    const ouverture = 0.12 + intensite * 0.25

    for (let i = 0; i < NB_GOUTTES; i++) {
      const j = i * 3
      const elan = vitesse * (0.6 + Math.random() * 0.8)
      positions[j] = origine.x
      positions[j + 1] = origine.y
      positions[j + 2] = origine.z
      vitesses[j] = (direction.x + (Math.random() - 0.5) * ouverture) * elan
      vitesses[j + 1] = (direction.y + (Math.random() - 0.5) * ouverture) * elan
      vitesses[j + 2] = (direction.z + (Math.random() - 0.5) * ouverture) * elan
    }
    gouttes.current.geometry.attributes.position.needsUpdate = true

    materiauGouttes.current.color.set(jet.couleur).lerp(BLANC, 0.4)
    materiauHalo.current.color.set(jet.couleur)
    halo.current.position.copy(origine).addScaledVector(versCamera, -RECUL_HALO)
    halo.current.position.y -= HAUTEUR_BOUCHON * 0.6
    halo.current.quaternion.copy(camera.quaternion)
    tailleHalo.current = 0.9 + intensite * 0.6

    avecGouttes.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    duree.current = dureeJet(jet.sillage)
    temps.current = 0
  }, [jet, get, positions, vitesses])

  useFrame((_, delta) => {
    if (temps.current >= duree.current) {
      gouttes.current.visible = false
      halo.current.visible = false
      return
    }
    temps.current += delta
    const progression = Math.min(temps.current / duree.current, 1)

    halo.current.visible = true
    const ouvertureHalo = 1 - (1 - progression) ** 3
    halo.current.scale.setScalar(tailleHalo.current * (0.4 + 0.6 * ouvertureHalo))
    materiauHalo.current.opacity = 0.45 * Math.sin(Math.PI * progression)

    gouttes.current.visible = avecGouttes.current
    if (!avecGouttes.current) return

    const frein = Math.exp(-2.5 * delta)
    for (let i = 0; i < NB_GOUTTES * 3; i += 3) {
      vitesses[i] *= frein
      vitesses[i + 1] = vitesses[i + 1] * frein + 0.05 * delta
      vitesses[i + 2] *= frein
      positions[i] += vitesses[i] * delta
      positions[i + 1] += vitesses[i + 1] * delta
      positions[i + 2] += vitesses[i + 2] * delta
    }
    gouttes.current.geometry.attributes.position.needsUpdate = true
    materiauGouttes.current.opacity = 0.7 * (1 - progression)
    materiauGouttes.current.size = 0.012 + progression * 0.02
  })

  return (
    <>
      <mesh ref={halo} visible={false} renderOrder={0}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={materiauHalo}
          map={TEXTURE_DOUCE}
          transparent
          depthWrite={false}
          opacity={0}
        />
      </mesh>
      <points ref={gouttes} visible={false} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materiauGouttes}
          map={TEXTURE_DOUCE}
          transparent
          depthWrite={false}
          opacity={0}
          size={0.012}
          sizeAttenuation
        />
      </points>
    </>
  )
}
