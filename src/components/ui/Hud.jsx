import { CONTINENTS } from '../../data/continents'
import styles from './Hud.module.css'

const LIBELLES_SOURCE = {
  api: 'Météo en direct',
  secours: 'Météo hors ligne',
}

export function Hud({ sectionId, source, onAller, sonCoupe, onBasculerSon }) {
  const n = CONTINENTS.length
  const index = CONTINENTS.findIndex((c) => c.id === sectionId)
  const section = CONTINENTS[index]
  const precedent = index === -1 ? CONTINENTS[n - 1] : CONTINENTS[(index - 1 + n) % n]
  const suivant = CONTINENTS[(index + 1) % n]

  return (
    <div className={styles.hud}>
      <header className={styles.haut}>
        <p className={styles.logo}>AERIA</p>
        <div className={styles.reglages}>
          <p className={styles.source}>{LIBELLES_SOURCE[source] ?? 'Chargement…'}</p>
          <button
            type="button"
            className={styles.son}
            onClick={onBasculerSon}
            aria-label="Couper le son"
            aria-pressed={sonCoupe}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 9h4l5-4v14l-5-4H4z" />
              {sonCoupe ? (
                <path d="M16.5 9.5l5 5m0-5l-5 5" />
              ) : (
                <path d="M16 9a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div className={styles.titre} aria-live="polite">
        {section ? (
          <>
            <p className={styles.compteur}>
              {index + 1} / {n}
            </p>
            <h1 className={styles.nom}>{section.nom}</h1>
          </>
        ) : (
          <h1 className={styles.nom}>Entrée</h1>
        )}
      </div>

      <div className={styles.bas}>
        <p className={styles.aide}>
          Glissez pour regarder autour de vous · Touchez un flacon pour le découvrir
        </p>

        <nav className={styles.navigation} aria-label="Sections de la boutique">
          <button
            type="button"
            className={styles.fleche}
            onClick={() => onAller(precedent.id)}
            aria-label={`Section précédente : ${precedent.nom}`}
          >
            ‹
          </button>

          <ul className={styles.sections}>
            {CONTINENTS.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={styles.section}
                  onClick={() => onAller(c.id)}
                  aria-label={c.nom}
                  aria-current={c.id === sectionId ? 'true' : undefined}
                >
                  <span className={styles.libelle}>{c.nom}</span>
                  <span className={styles.point} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={styles.fleche}
            onClick={() => onAller(suivant.id)}
            aria-label={`Section suivante : ${suivant.nom}`}
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  )
}