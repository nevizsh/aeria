import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useParfums } from './hooks/useParfums'
import { Boutique } from './components/scene/Boutique'

export default function App() {
  const { parfums } = useParfums()
  const [selectionId, setSelectionId] = useState(null)

  // On retrouve l'objet à jour à partir de l'id (voir plus haut).
  const parfumSelectionne = parfums.find((p) => p.id === selectionId)

  return (
    <>
      <Canvas camera={{ position: [0, 1.6, 0.01], fov: 60 }}>
        <hemisphereLight args={['#ffffff', '#444444', 1.5]} />
        <Boutique
          parfums={parfums}
          selectionId={selectionId}
          onSelect={setSelectionId}
        />
        <OrbitControls
          target={[0, 1.6, 0]}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.4}
        />
      </Canvas>

      {/* PROVISOIRE : sert seulement à vérifier la sélection.
          Sera remplacé par la vraie fiche parfum, d'après le wireframe. */}
      {parfumSelectionne && (
        <pre
          style={{
            position: 'fixed', bottom: 16, left: 16, margin: 0,
            padding: 12, background: '#fff', color: '#000', fontSize: 12,
          }}
        >
          {parfumSelectionne.nom}
          {'\n'}
          {JSON.stringify(parfumSelectionne.notes, null, 2)}
        </pre>
      )}
    </>
  )
}