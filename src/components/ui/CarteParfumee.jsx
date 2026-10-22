import { useEffect, useRef } from 'react'
import styles from './CarteParfumee.module.css'

export function CarteParfumee({ carte, onFermer }) {
  const dialogue = useRef(null)

  useEffect(() => {
    if (!dialogue.current.open) dialogue.current.showModal()
  }, [])

  return (
    <dialog
      ref={dialogue}
      className={styles.carte}
      aria-labelledby="carte-titre"
      aria-describedby="carte-texte"
      onClose={onFermer}
    >
      <span
        className={styles.pastille}
        style={{ '--couleur': carte.couleur }}
        aria-hidden="true"
      />
      <p className={styles.surtitre}>Carte parfumée</p>
      <h2 id="carte-titre" className={styles.titre}>
        {carte.ville}
      </h2>
      <div className={styles.separateur} aria-hidden="true" />
      <p id="carte-texte" className={styles.texte}>
        {carte.phrases.join(' ')}
      </p>
      <p className={styles.signature}>— Aeria</p>
      <button
        type="button"
        className={styles.fermer}
        onClick={() => dialogue.current.close()}
      >
        Refermer la carte
      </button>
    </dialog>
  )
}
