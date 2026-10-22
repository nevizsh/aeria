import { useEffect, useState } from 'react'
import { Brume, dureeJet } from './components/scene/Brume'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useParfums } from './hooks/useParfums'
import { Boutique } from './components/scene/Boutique'
import { FicheParfum } from './components/ui/FicheParfum'
import { VoileParfum } from './components/ui/VoileParfum'
import { NavigationCamera } from './components/scene/NavigationCamera'
import { Hud } from './components/ui/Hud'
import { Accueil } from './components/ui/Accueil'
import { FonduBlanc } from './components/ui/FonduBlanc'
import { AjustementCamera } from './components/scene/AjustementCamera'

export default function App() {
  const { parfums, source } = useParfums()
  const [selectionId, setSelectionId] = useState(null)

  // On retrouve l'objet à jour à partir de l'id (voir plus haut).
  const parfumSelectionne = parfums.find((p) => p.id === selectionId)
  const [jet, setJet] = useState(null)
  const [vaporisationEnCours, setVaporisationEnCours] = useState(false)

  const [sectionVisible, setSectionVisible] = useState('oceanie')
  const [navigation, setNavigation] = useState(null)

  const [etape, setEtape] = useState('accueil')
  const surAccueil = etape === 'accueil' || etape === 'fondu-entrant'
  const enBoutique = etape === 'fondu-sortant' || etape === 'boutique'

  function finDuFondu() {
    setEtape(etape === 'fondu-entrant' ? 'fondu-sortant' : 'boutique')
  }

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
        <AjustementCamera />
        <Boutique
          parfums={parfums}
          selectionId={selectionId}
          onSelect={setSelectionId}
        />
        <Brume jet={jet} />
        <NavigationCamera
          demande={navigation}
          onSectionVisible={setSectionVisible}
        />
        <OrbitControls
          // Mode consultation : la vue est figée tant qu'une fiche est ouverte
          makeDefault
          enabled={enBoutique && !selectionId}
          target={[0, 1.6, 0]}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.4}
        />
      </Canvas>
      {enBoutique && !parfumSelectionne && (
        <Hud
          sectionId={sectionVisible}
          source={source}
          onAller={(continentId) => setNavigation({ continentId })}
        />
      )}
      
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

            {surAccueil && <Accueil onEntrer={() => setEtape('fondu-entrant')} />}

      {(etape === 'fondu-entrant' || etape === 'fondu-sortant') && (
        <FonduBlanc
          phase={etape === 'fondu-entrant' ? 'entrant' : 'sortant'}
          onFin={finDuFondu}
        />
      )}
    </>
  )
}