import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useParfums } from './hooks/useParfums'
import { Boutique } from './components/scene/Boutique'

export default function App() {
  const { parfums } = useParfums()

  return (
    // Caméra au centre de la boutique, à hauteur des yeux.
    // Le 0.01 en z est voulu (voir OrbitControls ci-dessous).
    <Canvas camera={{ position: [0, 1.6, 0.01], fov: 60 }}>
      {/* Lumière venant du ciel (blanc) et du sol (gris) : éclaire
          uniformément tout autour, contrairement à une lumière directionnelle
          qui laisserait certaines sections dans l'ombre. */}
      <hemisphereLight args={['#ffffff', '#444444', 1.5]} />

      <Boutique parfums={parfums} />

      {/* Astuce PROVISOIRE : en plaçant la caméra quasiment sur sa cible,
          « tourner autour de la cible » revient à « regarder autour de soi ».
          rotateSpeed négatif : glisser vers la droite fait regarder à droite. */}
      <OrbitControls
        target={[0, 1.6, 0]}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={-0.4}
      />
    </Canvas>
  )
}