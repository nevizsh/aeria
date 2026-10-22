import styles from './FonduBlanc.module.css'

export function FonduBlanc({ phase, onFin }) {
  return (
    <div
      className={`${styles.fondu} ${styles[phase]}`}
      onAnimationEnd={onFin}
      aria-hidden="true"
    />
  )
}