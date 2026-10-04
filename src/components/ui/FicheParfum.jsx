import { useEffect } from 'react'
import { CONTINENTS } from '../../data/continents'
import styles from './FicheParfum.module.css'

// Nombre de segments remplis dans la jauge de sillage
const NIVEAUX_SILLAGE = { 'léger': 1, 'moyen': 2, 'fort': 3 }

export function FicheParfum({ parfum, onFermer, onVaporiser, vaporisationEnCours }) {
  // La touche Échap ferme la fiche : réflexe attendu pour tout panneau superposé.
  useEffect(() => {
    const surTouche = (e) => {
      if (e.key === 'Escape') onFermer()
    }
    window.addEventListener('keydown', surTouche)
    // Nettoyage : sans ça, chaque ouverture ajouterait un écouteur de plus.
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  const continent = CONTINENTS.find((c) => c.id === parfum.continent)
  const m = parfum.meteo

  // heureLocale vaut par exemple "2026-10-04T16:45" (déjà à l'heure de la ville,
  // grâce à timezone=auto). On découpe la chaîne plutôt que de passer par
  // new Date(), qui risquerait de la réinterpréter dans le fuseau de l'utilisateur.
  const heure = m.heureLocale.slice(11, 16)

  // Les données sont décrites dans des tableaux, puis affichées avec .map :
  // ajouter une mesure = ajouter une ligne, sans toucher au JSX.
  const mesures = [
    { label: 'Temp.', valeur: `${Math.round(m.temperature)} °C` },
    { label: 'Humidité', valeur: `${Math.round(m.humidite)} %` },
    { label: 'Vent', valeur: `${Math.round(m.vent)} km/h` },
    { label: 'Nuages', valeur: `${Math.round(m.nuages)} %` },
    { label: 'Pluie', valeur: `${m.precipitation} mm` },
    { label: 'Temps', valeur: parfum.notes.tete.raison }, // déjà calculé par la composition
  ]

  const pyramide = [
    { niveau: 'Tête', ...parfum.notes.tete },
    { niveau: 'Cœur', ...parfum.notes.coeur },
    { niveau: 'Fond', ...parfum.notes.fond },
  ]

  const segmentsPleins = NIVEAUX_SILLAGE[parfum.sillage.niveau]

  return (
    // aside + aria-labelledby : un lecteur d'écran annonce « Nouméa, complémentaire »
    <aside
      className={`${styles.fiche} ${vaporisationEnCours ? styles.retrait : ''}`}
      aria-labelledby="fiche-titre"
    >
      <header className={styles.entete}>
        <div>
          <p className={styles.surtitre}>
            {continent?.nom} · {parfum.pays}
          </p>
          <h2 id="fiche-titre" className={styles.titre}>
            {/* Pastille à la couleur du flacon : relie la fiche à la 3D.
                Style inline car la valeur vient des données, pas du CSS. */}
            <span
              className={styles.pastille}
              style={{ background: parfum.couleur }}
              aria-hidden="true"
            />
            {parfum.nom}
          </h2>
          <p className={styles.heure}>
            {heure} heure locale · {m.estJour ? 'jour' : 'nuit'}
          </p>
        </div>
        <button
          type="button"
          className={styles.fermer}
          onClick={onFermer}
          aria-label="Fermer la fiche"
        >
          ×
        </button>
      </header>

      <section>
        <h3 className={styles.rubrique}>Météo en direct</h3>
        {/* dl = liste de paires « intitulé : valeur », exactement notre cas */}
        <dl className={styles.mesures}>
          {mesures.map(({ label, valeur }) => (
            <div key={label} className={styles.mesure}>
              <dt>{label}</dt>
              <dd>{valeur}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h3 className={styles.rubrique}>Pyramide olfactive</h3>
        {/* ol et non ul : l'ordre tête → cœur → fond a un sens */}
        <ol className={styles.pyramide}>
          {pyramide.map((note) => (
            <li key={note.niveau}>
              <span className={styles.niveau}>{note.niveau}</span>
              <strong>{note.nom}</strong>
              <span className={styles.raison}>← {note.raison}</span>
            </li>
          ))}
        </ol>
        {/* accordNocturne vaut null le jour : rien ne s'affiche */}
        {parfum.accordNocturne && (
          <p className={styles.nocturne}>+ {parfum.accordNocturne}</p>
        )}
      </section>

      <section>
        <h3 className={styles.rubrique}>Sillage</h3>
        <div className={styles.sillage}>
          <div className={styles.jauge} aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <span key={i} className={i <= segmentsPleins ? styles.plein : undefined} />
            ))}
          </div>
          <span>{parfum.sillage.niveau}</span>
        </div>
      </section>

        <button
            type="button"
            className={styles.vaporiser}
            onClick={onVaporiser}
            disabled={vaporisationEnCours}
        >
            Vaporiser
        </button>
    </aside>
  )
}