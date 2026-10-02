import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function App() {
  return (
    // Canvas crée pour toi la scène, la caméra et le renderer Three.js.
    // position : [x, y, z]. y = 1.6 correspond à peu près à la hauteur
    // des yeux, ce qui préfigure la vue « debout dans la boutique ».
    <Canvas camera={{ position: [0, 1.6, 5], fov: 60 }}>
      {/* Lumière douce partout, sinon les zones non éclairées seraient noires */}
      <ambientLight intensity={0.5} />
      {/* Lumière directionnelle, qui donne du relief au volume */}
      <directionalLight position={[3, 5, 2]} intensity={1} />

      {/* Un cylindre comme flacon provisoire */}
      <mesh position={[0, 1, 0]}>
        {/* args : rayon haut, rayon bas, hauteur, nombre de segments */}
        <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
        {/* meshStandardMaterial réagit à la lumière, contrairement à meshBasicMaterial */}
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      {/* Permet de tourner autour de la scène à la souris.
          Provisoire : on remplacera ça par une navigation adaptée
          à la boutique (caméra au centre qui pivote vers les sections). */}
      <OrbitControls />
    </Canvas>
  )
}