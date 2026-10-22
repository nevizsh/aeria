import { CONTINENTS } from '../../data/continents'
import styles from './Hud.module.css'

const LIBELLES_SOURCE = {
  api: 'Météo en direct',
  secours: 'Météo hors ligne',
}

export function Hud({ sectionId, source, onAller }) {
  const n = CONTINENTS.length
  const index = CONTINENTS.findIndex((c) => c.id === sectionId)
  const section = CONTINENTS[index]
  const precedent = index === -1 ? CONTINENTS[n - 1] : CONTINENTS[(index - 1 + n) % n]
  const suivant = CONTINENTS[(index + 1) % n]

  return (
    <div className={styles.hud}>
      <header className={styles.haut}>
        <p className={styles.logo}>AERIA</p>
        <p className={styles.source}>{LIBELLES_SOURCE[source] ?? 'Chargement…'}</p>
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