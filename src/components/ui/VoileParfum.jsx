import styles from './VoileParfum.module.css'

export function VoileParfum({ couleur, duree }) {
  return (
    <div
      className={styles.voile}
      style={{ '--couleur': couleur, '--duree': `${duree}s` }}
      aria-hidden="true"
    />
  )
}