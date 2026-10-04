// Un flacon = un parfum. Forme provisoire (cylindre),
// qu'on remplacera plus tard par un vrai design de flacon.
export function Flacon({ parfum, position }) {
  return (
    <mesh position={position}>
      {/* rayon haut, rayon bas, hauteur, segments */}
      <cylinderGeometry args={[0.15, 0.15, 0.4, 24]} />
      {/* La chaîne "hsl(...)" produite par la composition est comprise directement */}
      <meshStandardMaterial color={parfum.couleur} />
    </mesh>
  )
}