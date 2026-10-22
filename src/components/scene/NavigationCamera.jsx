import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import { CONTINENTS } from '../../data/continents'

const VITESSE = 4
const DEMI_SECTION = MathUtils.degToRad(30)

function ecartAngulaire(a, b) {
  return MathUtils.euclideanModulo(a - b + Math.PI, Math.PI * 2) - Math.PI
}

function angleDeVue(camera, cible) {
  return Math.atan2(cible.x - camera.position.x, -(cible.z - camera.position.z))
}

function sectionVisible(angle) {
  const proche = CONTINENTS.find(
    (c) => Math.abs(ecartAngulaire(angle, MathUtils.degToRad(c.angle))) <= DEMI_SECTION,
  )
  return proche ? proche.id : null
}

export function NavigationCamera({ demande, onSectionVisible }) {
  const controls = useThree((etat) => etat.controls)
  const angleVise = useRef(null)
  const derniereSection = useRef(undefined)

  useEffect(() => {
    if (!demande) return
    const continent = CONTINENTS.find((c) => c.id === demande.continentId)
    angleVise.current = MathUtils.degToRad(continent.angle)
  }, [demande])

  useEffect(() => {
    if (!controls) return
    const annuler = () => {
      angleVise.current = null
    }
    controls.addEventListener('start', annuler)
    return () => controls.removeEventListener('start', annuler)
  }, [controls])

  useFrame(({ camera }, delta) => {
    if (!controls) return
    const cible = controls.target
    let angle = angleDeVue(camera, cible)

    if (angleVise.current !== null) {
      const ecart = ecartAngulaire(angleVise.current, angle)
      if (Math.abs(ecart) < 0.001) {
        angleVise.current = null
      } else {
        angle += ecart * (1 - Math.exp(-VITESSE * delta))
        const rayon = camera.position.distanceTo(cible)
        camera.position.set(
          cible.x - Math.sin(angle) * rayon,
          cible.y,
          cible.z + Math.cos(angle) * rayon,
        )
        controls.update()
      }
    }

    const section = sectionVisible(angle)
    if (section !== derniereSection.current) {
      derniereSection.current = section
      onSectionVisible(section)
    }
  })

  return null
}