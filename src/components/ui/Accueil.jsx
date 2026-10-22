import styles from './Accueil.module.css'

export function Accueil({ onEntrer }) {
  return (
    <section className={styles.accueil} aria-labelledby="accueil-titre">
      <p className={styles.logo}>AERIA</p>

      <div className={styles.carte}>
        <p className={styles.surtitre}>Parfumerie des villes</p>
        <h1 id="accueil-titre" className={styles.titre}>
          Aeria
        </h1>
        <p className={styles.accroche}>
          Chaque flacon renferme la météo d'une ville du monde, en ce moment même.
        </p>
        <button type="button" className={styles.entrer} onClick={onEntrer}>
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
  )
}