import { useEffect } from 'react'
import { CONTINENTS } from '../../data/continents'
import { raconterMeteo } from './raconterMeteo'
import styles from './FicheParfum.module.css'

const NIVEAUX_SILLAGE = { 'léger': 1, 'moyen': 2, 'fort': 3 }

export function FicheParfum({
  parfum,
  onFermer,
  onVaporiser,
  vaporisationEnCours,
  carteOuverte,
  boutonRef,
}) {
  useEffect(() => {
    if (carteOuverte) return
    const surTouche = (e) => {
      if (e.key === 'Escape') onFermer()
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer, carteOuverte])

  const continent = CONTINENTS.find((c) => c.id === parfum.continent)
  const m = parfum.meteo
  const heure = m.heureLocale.slice(11, 16)
  const recit = raconterMeteo(parfum.nom, m, parfum.notes.tete.raison)

  const pyramide = [
    { niveau: 'Tête', ...parfum.notes.tete },
    { niveau: 'Cœur', ...parfum.notes.coeur },
    { niveau: 'Fond', ...parfum.notes.fond },
  ]

  const segmentsPleins = NIVEAUX_SILLAGE[parfum.sillage.niveau]

  return (
    <aside
      className={`${styles.fiche} ${vaporisationEnCours ? styles.retrait : ''}`}
      aria-labelledby="fiche-titre"
    >
      <button
        type="button"
        className={styles.fermer}
        onClick={onFermer}
        aria-label="Fermer la fiche"
      >
        ×
      </button>

      <header className={styles.entete}>
        <span
          className={styles.pastille}
          style={{ '--couleur': parfum.couleur }}
          aria-hidden="true"
        />
        <h2 id="fiche-titre" className={styles.titre}>
          {parfum.nom}
        </h2>
        <p className={styles.origine}>
          {continent?.nom} · {parfum.pays}
        </p>
        <p className={styles.heure}>
          {heure} heure locale · {m.estJour ? 'jour' : 'nuit'}
        </p>
      </header>

      <div className={styles.separateur} aria-hidden="true" />

      <section className={styles.encadre} aria-labelledby="fiche-meteo">
        <h3 id="fiche-meteo" className={styles.etiquette}>
          Météo en direct
        </h3>
        <p className={styles.recit}>{recit}</p>
      </section>

      <section className={styles.encadre} aria-labelledby="fiche-pyramide">
        <h3 id="fiche-pyramide" className={styles.etiquette}>
          Pyramide olfactive
        </h3>
        <ol className={styles.pyramide}>
          {pyramide.map((note) => (
            <li key={note.niveau}>
              <span className={styles.niveau}>{note.niveau}</span>
              <span className={styles.composition}>
                <strong className={styles.note}>{note.nom}</strong>
                <span className={styles.raison}>{note.raison}</span>
              </span>
            </li>
          ))}
        </ol>
        {parfum.accordNocturne && (
          <p className={styles.nocturne}>
            <span aria-hidden="true">☾ </span>
            {parfum.accordNocturne}
          </p>
        )}
      </section>

      <section className={styles.sillage} aria-labelledby="fiche-sillage">
        <h3 id="fiche-sillage" className={styles.etiquette}>
          Sillage
        </h3>
        <span className={styles.jauge} aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= segmentsPleins ? styles.plein : undefined} />
          ))}
        </span>
        <span className={styles.niveauSillage}>{parfum.sillage.niveau}</span>
      </section>

      <button
        ref={boutonRef}
        type="button"
        className={styles.vaporiser}
        data-son="aucun"
        onClick={onVaporiser}
        disabled={vaporisationEnCours}
      >
        Vaporiser
      </button>
    </aside>
  )
}
