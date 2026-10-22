import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { pointVitrine } from './vitrine'

const centre = new Vector3()
const versCamera = new Vector3()

export function LumiereVitrine({ actif }) {
  const face = useRef()
  const contre = useRef()

  useFrame((state, delta) => {
    pointVitrine(state.camera, state.size, centre)
    versCamera.copy(state.camera.position).sub(centre).normalize()

    face.current.position.copy(centre).addScaledVector(versCamera, 0.8)
    face.current.position.y += 0.6

    contre.current.position.copy(centre).addScaledVector(versCamera, -0.6)
    contre.current.position.y += 0.4

    const t = 1 - Math.exp(-4 * delta)
    face.current.intensity += ((actif ? 6 : 0) - face.current.intensity) * t
    contre.current.intensity += ((actif ? 4 : 0) - contre.current.intensity) * t
  })

  return (
    <>
      <pointLight ref={face} color="#fff4e6" intensity={0} distance={3} decay={2} />
      <pointLight ref={contre} color="#d9ccff" intensity={0} distance={3} decay={2} />
    </>
  )
}