export const MOMENTS = [
  { avant: 5, moment: 'nuit' },
  { avant: 12, moment: 'matin' },
  { avant: 18, moment: 'apres-midi' },
  { avant: 23, moment: 'soir' },
  { avant: 24, moment: 'nuit' },
]

export const LIEUX = {
  'le-caire': { aVille: 'au Caire', deVille: 'du Caire' },
  'le-cap': { aVille: 'au Cap', deVille: 'du Cap' },
}

export const PAYS = {
  'Afrique du Sud': 'en Afrique du Sud',
  'Argentine': 'en Argentine',
  'Australie': 'en Australie',
  'Brésil': 'au Brésil',
  'Égypte': 'en Égypte',
  'Émirats arabes unis': 'aux Émirats arabes unis',
  'Espagne': 'en Espagne',
  'États-Unis': 'aux États-Unis',
  'France': 'en France',
  'Inde': 'en Inde',
  'Islande': 'en Islande',
  'Japon': 'au Japon',
  'Kenya': 'au Kenya',
  'Maroc': 'au Maroc',
  'Mexique': 'au Mexique',
  'Mongolie': 'en Mongolie',
  'Norvège': 'en Norvège',
  'Nouvelle-Calédonie': 'en Nouvelle-Calédonie',
  'Nouvelle-Zélande': 'en Nouvelle-Zélande',
  'Polynésie française': 'en Polynésie française',
  'Russie': 'en Russie',
  'Sénégal': 'au Sénégal',
  'Singapour': 'dans la cité-État',
}

export const OUVERTURES = {
  'ciel clair': {
    matin: [
      'Le soleil se lève sur {ville} et lave les façades d’une lumière neuve.',
      'Ce matin, le ciel {deVille} est d’un bleu sans une ride.',
    ],
    'apres-midi': [
      'Le grand soleil de l’après-midi pèse doucement sur {ville}.',
      '{ville} s’étire sous un ciel limpide, sans l’ombre d’un nuage.',
    ],
    soir: [
      'Le soir tombe sur {ville} dans un ciel parfaitement dégagé.',
      'Les dernières lueurs du jour s’attardent sur les toits {deVille}.',
    ],
    nuit: [
      'La nuit est claire {aVille}, et les étoiles s’y comptent une à une.',
      'Sous un ciel sans voile, {ville} dort à la lumière des étoiles.',
    ],
  },
  'ciel nuageux': {
    matin: [
      'Le jour se lève en demi-teinte sur {ville}, sous un ciel de coton.',
      'Des nuages pâles s’attardent au-dessus {deVille} ce matin.',
    ],
    'apres-midi': [
      'L’après-midi passe lentement {aVille}, sous un ciel gris perle.',
      'Les nuages jouent avec la lumière au-dessus {deVille}.',
    ],
    soir: [
      'Le soir s’installe {aVille} sous un ciel chargé de nuages.',
      'Un ciel couvert enveloppe {ville} à l’heure où les lampes s’allument.',
    ],
    nuit: [
      'La nuit est épaisse {aVille} : les nuages ont caché la lune.',
      'Sous un plafond de nuages, {ville} s’endort sans étoiles.',
    ],
  },
  brouillard: {
    matin: [
      'Un brouillard laiteux efface les rues {deVille} ce matin.',
      'Ce matin, {ville} se devine à peine derrière un voile de brume.',
    ],
    'apres-midi': [
      'Le brouillard ne s’est pas levé : {ville} flotte encore dans le blanc.',
      'L’après-midi s’écoule {aVille} dans une brume cotonneuse.',
    ],
    soir: [
      'La brume monte avec le soir et adoucit les lumières {deVille}.',
      'Le soir tombe {aVille}, noyé dans un brouillard tranquille.',
    ],
    nuit: [
      'Dans la nuit {deVille}, le brouillard étouffe chaque bruit.',
      'Les réverbères {deVille} ne sont plus que des halos dans la brume.',
    ],
  },
  pluie: {
    matin: [
      'Une pluie fine accompagne le réveil {deVille}.',
      'Ce matin, les trottoirs {deVille} brillent sous la pluie.',
    ],
    'apres-midi': [
      'L’averse rince les rues {deVille} en plein après-midi.',
      'La pluie tombe {aVille}, et l’air sent la terre mouillée.',
    ],
    soir: [
      'Le soir arrive {aVille} au rythme de la pluie sur les vitres.',
      'Sous la pluie du soir, les lumières {deVille} se reflètent dans les flaques.',
    ],
    nuit: [
      'La pluie tambourine doucement sur les toits {deVille}, et la nuit garde ses lampes allumées.',
      'Cette nuit, la pluie berce {ville} jusqu’au sommeil.',
    ],
  },
  neige: {
    matin: [
      'La neige a tout recouvert {aVille} pendant la nuit.',
      'Ce matin, {ville} s’éveille dans un silence de neige.',
    ],
    'apres-midi': [
      'Les flocons tombent sans hâte sur {ville} cet après-midi.',
      'L’après-midi est blanc et feutré {aVille}.',
    ],
    soir: [
      'Le soir bleuit la neige fraîche {deVille}.',
      'La neige du soir étouffe les pas dans les rues {deVille}.',
    ],
    nuit: [
      'La nuit {deVille} est blanche, et la neige tombe sans bruit.',
      'Sous la neige, {ville} dort d’un sommeil de coton.',
    ],
  },
  orage: {
    matin: [
      'Un orage gronde au-dessus {deVille} dès le matin.',
      'Ce matin, les éclairs zèbrent le ciel {deVille}.',
    ],
    'apres-midi': [
      'L’orage éclate {aVille}, et l’air se charge d’électricité.',
      'Le tonnerre roule au-dessus {deVille} en plein après-midi.',
    ],
    soir: [
      'Le soir s’allume d’éclairs au-dessus {deVille}.',
      'Un orage du soir fait trembler les vitres {deVille}.',
    ],
    nuit: [
      'La nuit {deVille} est déchirée d’éclairs.',
      'Le tonnerre veille sur {ville} toute la nuit.',
    ],
  },
  'temps indéterminé': {
    matin: [
      'Le matin hésite {aVille}, entre deux airs.',
      'Ce matin, le ciel {deVille} garde son secret.',
    ],
    'apres-midi': [
      'L’après-midi passe {aVille} sous un ciel indécis.',
      'Le ciel {deVille} ne se décide pas, cet après-midi.',
    ],
    soir: [
      'Le soir tombe {aVille} sous un ciel difficile à lire.',
      'Le ciel du soir {deVille} garde ses mystères.',
    ],
    nuit: [
      'La nuit {deVille} ne dit rien de son ciel.',
      'Cette nuit, le ciel {deVille} reste un mystère.',
    ],
  },
}

export const SENSATIONS = [
  {
    max: 0,
    phrases: [
      'Il fait {temperature} {dansPays} : l’air pique les joues et réveille les sens.',
      'Le froid mord à {temperature}, et chaque souffle devient nuage.',
      'À {temperature}, l’air est vif, presque cristallin.',
    ],
  },
  {
    max: 12,
    phrases: [
      'Il fait {temperature}, une fraîcheur qui invite à remonter son col.',
      'L’air est frais, {temperature}, et sent le dehors.',
      'Il fait {temperature} {dansPays}, de quoi garder les mains dans les poches.',
    ],
  },
  {
    max: 22,
    phrases: [
      'Il fait {temperature}, une douceur qui donne envie de flâner.',
      'L’air est doux, {temperature}, ni trop ni trop peu.',
      'Il fait {temperature} {dansPays}, la température idéale pour ne penser à rien.',
    ],
  },
  {
    max: 30,
    phrases: [
      'Il fait {temperature}, et la chaleur fait s’ouvrir les fleurs.',
      'Il fait {temperature} {dansPays}, une chaleur ronde et lumineuse.',
      'L’air est chaud, {temperature}, et la peau s’en souvient.',
    ],
  },
  {
    max: Infinity,
    phrases: [
      'Il fait {temperature} : la chaleur écrase les ombres et réveille les épices.',
      'Il fait {temperature} {dansPays}, et l’air vibre au-dessus du sol.',
      'À {temperature}, tout ralentit, même le temps.',
    ],
  },
]

export const CLOTURES = {
  'léger': [
    'Ce parfum se pose à peine, comme un secret qu’on chuchote.',
    'Son sillage est léger : il ne se révèle qu’à ceux qui s’approchent.',
    'Une trace discrète, qui s’efface déjà.',
  ],
  moyen: [
    'Son sillage vous suit d’une pièce à l’autre, sans jamais s’imposer.',
    'Un parfum présent, qui laisse derrière lui une jolie trace.',
    'Le vent l’emporte juste assez pour qu’on se retourne.',
  ],
  fort: [
    'Porté par le vent, son sillage remplit la pièce en un instant.',
    'Un sillage ample, qui annonce votre arrivée avant vous.',
    'Impossible de passer inaperçu : ce parfum a le souffle du large.',
  ],
}
