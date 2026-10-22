import { useCallback, useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Quaternion, Vector3 } from 'three'

const SENSIBILITE = 0.012
const FREIN_INERTIE = 3
const DELAI_ARRET = 80

const HAUT = new Vector3()
const DROITE = new Vector3()
const VERTICALE = new Vector3(0, 1, 0)
const pas = new Quaternion()

function tourner(quaternion, camera, horizontal, vertical) {
  HAUT.set(0, 1, 0).applyQuaternion(camera.quaternion)
  DROITE.set(1, 0, 0).applyQuaternion(camera.quaternion)
  quaternion.premultiply(pas.setFromAxisAngle(HAUT, horizontal))
  quaternion.premultiply(pas.setFromAxisAngle(DROITE, vertical))
}

export function useManipulation(pivot, { actif, partout, vitesseRepos, axeRepos }) {
  const canvas = useThree((etat) => etat.gl.domElement)
  const camera = useThree((etat) => etat.camera)
  const glissement = useRef(null)
  const elan = useRef({ x: 0, y: 0 })
  const [immobile] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const commencer = useCallback(
    (x, y, pointerId) => {
      glissement.current = { x, y, temps: performance.now() }
      elan.current = { x: 0, y: 0 }
      canvas.setPointerCapture(pointerId)
      canvas.style.cursor = 'grabbing'
    },
    [canvas],
  )

  useEffect(() => {
    if (!actif) return
    const curseurRepos = partout ? 'grab' : ''

    const debut = (e) => commencer(e.clientX, e.clientY, e.pointerId)

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
      canvas.style.cursor = curseurRepos
    }

    canvas.style.cursor = curseurRepos
    if (partout) canvas.addEventListener('pointerdown', debut)
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
  }, [actif, partout, canvas, camera, commencer, pivot])

  const saisir = useCallback(
    (e) => {
      if (!actif || partout) return
      e.stopPropagation()
      commencer(e.nativeEvent.clientX, e.nativeEvent.clientY, e.pointerId)
    },
    [actif, partout, commencer],
  )

  const animer = useCallback(
    (quaternion, cameraActuelle, delta) => {
      if (glissement.current) return
      const amorti = Math.exp(-FREIN_INERTIE * delta)
      elan.current.x *= amorti
      elan.current.y *= amorti
      tourner(quaternion, cameraActuelle, elan.current.y * delta * 60, elan.current.x * delta * 60)
      if (immobile) return
      pas.setFromAxisAngle(VERTICALE, vitesseRepos * delta)
      if (axeRepos === 'monde') quaternion.premultiply(pas)
      else quaternion.multiply(pas)
    },
    [immobile, vitesseRepos, axeRepos],
  )

  const arreter = useCallback(() => {
    elan.current.x = 0
    elan.current.y = 0
  }, [])

  return { saisir, animer, arreter }
}
