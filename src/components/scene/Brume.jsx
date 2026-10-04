import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CanvasTexture, Vector3 } from 'three'
import { pointVitrine } from './vitrine'

const NB_PARTICULES = 400
const HAUTEUR_BUSE = 0.27

const origine = new Vector3()
const versCamera = new Vector3()

function creerTextureDouce() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const degrade = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  degrade.addColorStop(0, 'rgba(255, 255, 255, 1)')
  degrade.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = degrade
  ctx.fillRect(0, 0, 64, 64)
  return new CanvasTexture(canvas)
}

const TEXTURE_DOUCE = creerTextureDouce()

export function dureeJet(sillage) {
  return 1.2 + sillage.intensite * 0.8
}

export function Brume({ jet }) {
  const points = useRef()
  const materiau = useRef()
  const temps = useRef(Infinity)
  const duree = useRef(0)
  const get = useThree((etat) => etat.get)

  const positions = useMemo(() => new Float32Array(NB_PARTICULES * 3), [])
  const vitesses = useMemo(() => new Float32Array(NB_PARTICULES * 3), [])

  useEffect(() => {
    if (!jet) return
    const { camera, size } = get()
    const { intensite } = jet.sillage

    pointVitrine(camera, size, origine)
    origine.y += HAUTEUR_BUSE
    versCamera.copy(camera.position).sub(origine).normalize()

    const vitesse = 0.8 + intensite * 1.2
    const ouverture = 0.25 + intensite * 0.6

    for (let i = 0; i < NB_PARTICULES; i++) {
      const j = i * 3
      const elan = vitesse * (0.5 + Math.random())
      positions[j] = origine.x
      positions[j + 1] = origine.y
      positions[j + 2] = origine.z
      vitesses[j] = (versCamera.x + (Math.random() - 0.5) * ouverture) * elan
      vitesses[j + 1] = (versCamera.y + (Math.random() - 0.5) * ouverture) * elan
      vitesses[j + 2] = (versCamera.z + (Math.random() - 0.5) * ouverture) * elan
    }

    materiau.current.color.set(jet.couleur)
    duree.current = dureeJet(jet.sillage)
    temps.current = 0
  }, [jet, get, positions, vitesses])

  useFrame((_, delta) => {
    if (temps.current >= duree.current) {
      points.current.visible = false
      return
    }
    points.current.visible = true
    temps.current += delta

    const frein = Math.exp(-1.5 * delta)
    for (let i = 0; i < NB_PARTICULES * 3; i += 3) {
      vitesses[i] *= frein
      vitesses[i + 1] = vitesses[i + 1] * frein + 0.15 * delta
      vitesses[i + 2] *= frein
      positions[i] += vitesses[i] * delta
      positions[i + 1] += vitesses[i + 1] * delta
      positions[i + 2] += vitesses[i + 2] * delta
    }
    points.current.geometry.attributes.position.needsUpdate = true

    const progression = temps.current / duree.current
    materiau.current.opacity = 0.8 * (1 - progression)
    materiau.current.size = 0.04 + progression * 0.08
  })

  return (
    <points ref={points} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materiau}
        map={TEXTURE_DOUCE}
        transparent
        depthWrite={false}
        opacity={0}
        size={0.04}
        sizeAttenuation
      />
    </points>
  )
}