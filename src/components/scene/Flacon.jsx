import { useState } from 'react'
import { useCursor } from '@react-three/drei'

export function Flacon({ parfum, position, estSelectionne, onSelect }) {
  const [survole, setSurvole] = useState(false)

  // drei change le curseur en "main" pendant le survol,
  // comme sur un lien : l'utilisateur comprend que c'est cliquable.
  useCursor(survole)

  const misEnValeur = survole || estSelectionne

  return (
    <mesh
      position={position}
      scale={misEnValeur ? 1.15 : 1}
      onPointerOver={(e) => {
        // Le rayon de la souris peut traverser plusieurs objets alignés.
        // stopPropagation : seul le flacon le plus proche réagit.
        e.stopPropagation()
        setSurvole(true)
      }}
      onPointerOut={() => setSurvole(false)}
      onClick={(e) => {
        e.stopPropagation()
        // e.delta = distance (en pixels) parcourue entre l'appui et le relâchement.
        // Au-delà de quelques pixels, l'utilisateur faisait glisser la vue
        // pour regarder autour de lui : ce n'était pas un clic sur le flacon.
        if (e.delta > 5) return
        onSelect(parfum.id)
      }}
    >
      <cylinderGeometry args={[0.15, 0.15, 0.4, 24]} />
      <meshStandardMaterial
        color={parfum.couleur}
        // emissive : le matériau émet sa propre lumière, il « s'illumine »
        emissive={parfum.couleur}
        emissiveIntensity={misEnValeur ? 0.4 : 0}
      />
    </mesh>
  )
}