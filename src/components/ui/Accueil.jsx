import { enCeMoment } from './enCeMoment'
import styles from './Accueil.module.css'
import ornements from './ornements.module.css'

const ETAPES = [
  { numero: 'I', texte: 'Entrez' },
  { numero: 'II', texte: 'Choisissez un flacon' },
  { numero: 'III', texte: 'Vaporisez' },
]

export function Accueil({ parfums, onEntrer }) {
  const faits = enCeMoment(parfums)

  return (
    <>
      <div className={styles.fond} aria-hidden="true" />
      <section className={styles.accueil} aria-labelledby="accueil-titre">
        <p className={styles.logo}>AERIA</p>

        <div className={styles.carte}>
          <span className={ornements.losange} aria-hidden="true" />
          <p className={styles.surtitre}>Parfumerie des villes</p>
          <h1 id="accueil-titre" className={styles.titre}>
            Aeria
          </h1>
          <div className={`${ornements.separateur} ${styles.separateur}`} aria-hidden="true" />
          <p className={styles.accroche}>
            Chaque flacon renferme la météo d'une ville du monde, en ce moment même.
          </p>

          <div className={styles.moment} aria-live="polite">
            {faits.length > 0 && (
              <>
                <h2 className={styles.intitule}>En ce moment</h2>
                <p className={styles.faits}>{faits.join(' · ')}</p>
              </>
            )}
          </div>

          <ol className={styles.etapes}>
            {ETAPES.map(({ numero, texte }) => (
              <li key={numero}>
                <span className={styles.numero} aria-hidden="true">
                  {numero}
                </span>
                {texte}
              </li>
            ))}
          </ol>

          <button type="button" className={`${ornements.boutonOr} ${styles.entrer}`} onClick={onEntrer}>
            Entrer dans la boutique
          </button>
        </div>

        <p className={styles.credit}>
          Données météo :{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
        </p>
      </section>
    </>
  )
}
