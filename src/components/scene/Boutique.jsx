import { MathUtils } from 'three'
import { CONTINENTS } from '../../data/continents'
import { Flacon } from './Flacon'

const RAYON = 6        // distance entre la caméra (au centre) et les étagères
const ECART_DEG = 8    // écart angulaire entre deux flacons d'une même section
const HAUTEUR = 1.4    // un peu sous le niveau des yeux (1.6)

// Convertit un angle du plan au sol (0° = devant, positif = à droite)
// en position 3D. Par défaut, la caméra Three.js regarde vers -Z :
// "devant" correspond donc à z négatif.
function positionSurCercle(angleDeg) {
  const a = MathUtils.degToRad(angleDeg)
  return [RAYON * Math.sin(a), HAUTEUR, -RAYON * Math.cos(a)]
}

export function Boutique({ parfums }) {
  return (
    <>
      {CONTINENTS.map((continent) => {
        const flacons = parfums.filter((p) => p.continent === continent.id)

        return (
          // Un group par section : on pourra plus tard le déplacer,
          // le mettre en surbrillance ou lui ajouter une étagère d'un bloc.
          <group key={continent.id}>
            {flacons.map((parfum, i) => {
              // Centre les flacons autour de l'angle de la section,
              // quel que soit leur nombre : pour 5 flacons → -16°, -8°, 0°, 8°, 16°
              const decalage = (i - (flacons.length - 1) / 2) * ECART_DEG
              return (
                <Flacon
                  key={parfum.id}
                  parfum={parfum}
                  position={positionSurCercle(continent.angle + decalage)}
                />
              )
            })}
          </group>
        )
      })}
    </>
  )
}