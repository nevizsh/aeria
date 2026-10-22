import { useEffect, useState } from 'react'
import { Brume, dureeJet } from './components/scene/Brume'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useParfums } from './hooks/useParfums'
import { Boutique } from './components/scene/Boutique'
import { FicheParfum } from './components/ui/FicheParfum'
import { VoileParfum } from './components/ui/VoileParfum'

export default function App() {
  const { parfums } = useParfums()
  const [selectionId, setSelectionId] = useState(null)

  // On retrouve l'objet à jour à partir de l'id (voir plus haut).
  const parfumSelectionne = parfums.find((p) => p.id === selectionId)
    const [jet, setJet] = useState(null)
  const [vaporisationEnCours, setVaporisationEnCours] = useState(false)

  useEffect(() => {
    if (!vaporisationEnCours) return
    const minuteur = setTimeout(
      () => setVaporisationEnCours(false),
      dureeJet(jet.sillage) * 1000,
    )
    return () => clearTimeout(minuteur)
  }, [vaporisationEnCours, jet])

  function vaporiser() {
    setJet({ couleur: parfumSelectionne.couleur, sillage: parfumSelectionne.sillage })
    setVaporisationEnCours(true)
  }

  function fermerFiche() {
    setSelectionId(null)
    setVaporisationEnCours(false)
  }

  return (
    <>
      <Canvas camera={{ position: [0, 1.6, 0.01], fov: 60 }}>
        <hemisphereLight args={['#ffffff', '#444444', 1.5]} />
        <Boutique
          parfums={parfums}
          selectionId={selectionId}
          onSelect={setSelectionId}
        />
        <Brume jet={jet} />
        <OrbitControls
          // Mode consultation : la vue est figée tant qu'une fiche est ouverte
          enabled={!selectionId}
          target={[0, 1.6, 0]}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.4}
        />
      </Canvas>

      {parfumSelectionne && (
        <FicheParfum
          parfum={parfumSelectionne}
          onFermer={fermerFiche}
          onVaporiser={vaporiser}
          vaporisationEnCours={vaporisationEnCours}
        />
      )}

      {vaporisationEnCours && (
        <VoileParfum couleur={jet.couleur} duree={dureeJet(jet.sillage)} />
      )}
    </>
  )
}