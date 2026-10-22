import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, BufferAttribute, BufferGeometry, DoubleSide, Matrix4, Vector3 } from 'three'

const CHEMIN = '/modeles/flacons.glb'
export const HAUTEUR_FLACON = 0.45

const FLACON_PAR_CONTINENT = {
  europe: 1,
  asie: 2,
  oceanie: 3,
  afrique: 4,
  ameriques: 5,
}

function preparerVerre(materiau) {
  const verre = materiau.clone()
  verre.transparent = true
  verre.depthWrite = false
  verre.side = DoubleSide
  verre.roughness = 0.05
  verre.metalness = 0.1
  verre.envMapIntensity = 2
  return verre
}

const va = new Vector3()
const vb = new Vector3()

function trouverBords(geometrie) {
  const position = geometrie.attributes.position
  const index = geometrie.index
    ? Array.from(geometrie.index.array)
    : Array.from({ length: position.count }, (_, i) => i)
  const arrondi = (v) => Math.round(v * 1e4)
  const cle = (i) =>
    `${arrondi(position.getX(i))},${arrondi(position.getY(i))},${arrondi(position.getZ(i))}`

  const bords = new Map()
  for (let t = 0; t < index.length; t += 3) {
    for (let k = 0; k < 3; k++) {
      const a = index[t + k]
      const b = index[t + ((k + 1) % 3)]
      const inverse = `${cle(b)}|${cle(a)}`
      if (bords.has(inverse)) bords.delete(inverse)
      else bords.set(`${cle(a)}|${cle(b)}`, [a, b])
    }
  }
  return { index, aretes: [...bords.values()] }
}

function boucher(geometrie) {
  const { index, aretes } = trouverBords(geometrie)
  if (aretes.length === 0) return geometrie

  const position = geometrie.attributes.position
  const centre = new Vector3()
  aretes.forEach(([a]) => centre.add(va.fromBufferAttribute(position, a)))
  centre.divideScalar(aretes.length)

  const normale = new Vector3()
  aretes.forEach(([a, b]) => {
    va.fromBufferAttribute(position, a).sub(centre)
    vb.fromBufferAttribute(position, b).sub(centre)
    normale.add(vb.cross(va))
  })
  normale.normalize()

  const sources = [aretes[0][0], ...aretes.flatMap(([a, b]) => [b, a])]
  const depart = position.count
  const total = depart + sources.length

  const resultat = new BufferGeometry()
  for (const [nom, attribut] of Object.entries(geometrie.attributes)) {
    const taille = attribut.itemSize
    const tableau = new attribut.array.constructor(total * taille)
    tableau.set(attribut.array.subarray(0, depart * taille))
    sources.forEach((s, j) => {
      for (let c = 0; c < taille; c++) {
        tableau[(depart + j) * taille + c] = attribut.array[s * taille + c]
      }
    })
    resultat.setAttribute(nom, new BufferAttribute(tableau, taille, attribut.normalized))
  }

  resultat.attributes.position.setXYZ(depart, centre.x, centre.y, centre.z)
  if (resultat.attributes.normal) {
    for (let j = depart; j < total; j++) {
      resultat.attributes.normal.setXYZ(j, normale.x, normale.y, normale.z)
    }
  }

  const nouvelIndex = new Uint32Array(index.length + aretes.length * 3)
  nouvelIndex.set(index)
  aretes.forEach((_, k) => {
    const o = index.length + k * 3
    nouvelIndex[o] = depart + 1 + k * 2
    nouvelIndex[o + 1] = depart + 2 + k * 2
    nouvelIndex[o + 2] = depart
  })
  resultat.setIndex(new BufferAttribute(nouvelIndex, 1))
  resultat.computeBoundingBox()
  resultat.computeBoundingSphere()
  return resultat
}

function preparerFlacon(nodes, numero, verre) {
  const pieces = Object.values(nodes).filter(
    (n) => n.isMesh && n.name.startsWith(`Perfume_${numero}_`),
  )

  const geometries = pieces.map((p) => p.geometry.clone().applyMatrix4(p.matrixWorld))

  const boite = new Box3()
  geometries.forEach((g) => {
    g.computeBoundingBox()
    boite.union(g.boundingBox)
  })
  const taille = boite.getSize(new Vector3())
  const centre = boite.getCenter(new Vector3())
  const echelle = HAUTEUR_FLACON / taille.y

  const normalisation = new Matrix4()
    .makeScale(echelle, echelle, echelle)
    .multiply(new Matrix4().makeTranslation(-centre.x, -centre.y, -centre.z))

  geometries.forEach((g) => g.applyMatrix4(normalisation))

  return pieces.map((p, i) => {
    const estLiquide = p.name.includes('Liquido')
    return {
      geometry: estLiquide ? boucher(geometries[i]) : geometries[i],
      material: p.material.name === 'Material' ? verre : p.material,
      estLiquide,
    }
  })
}

export function useModelesFlacons() {
  const { scene, nodes, materials } = useGLTF(CHEMIN)

  return useMemo(() => {
    scene.updateMatrixWorld(true)
    const verre = preparerVerre(materials.Material)
    return Object.fromEntries(
      Object.entries(FLACON_PAR_CONTINENT).map(([continent, numero]) => [
        continent,
        preparerFlacon(nodes, numero, verre),
      ]),
    )
  }, [scene, nodes, materials])
}

useGLTF.preload(CHEMIN)