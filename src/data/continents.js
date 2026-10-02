// Ordre et position des sections de la boutique.
// L'ordre du tableau = l'ordre de navigation (section précédente / suivante).
//
// angle : position autour de la caméra, en degrés, vue du dessus,
// d'après le plan au sol (docs/plan-au-sol.jpg) :
//   0° = face à l'entrée (Océanie), négatif = à gauche, positif = à droite.
//   L'entrée est derrière la caméra (180°), d'où l'écart de 60° entre sections.
// Valeurs provisoires : on les ajustera en construisant la scène.
export const CONTINENTS = [
  { id: 'europe',    nom: 'Europe',    angle: -120 },
  { id: 'asie',      nom: 'Asie',      angle: -60 },
  { id: 'oceanie',   nom: 'Océanie',   angle: 0 },
  { id: 'afrique',   nom: 'Afrique',   angle: 60 },
  { id: 'ameriques', nom: 'Amériques', angle: 120 },
]