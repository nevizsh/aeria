import { useEffect, useState } from 'react'
import villes from '../data/villes.json'
import { chargerMeteo } from '../services/meteo'
import { composerParfums } from '../composition/composerParfums'

// Charge la météo, compose les parfums et expose le résultat à React.
// C'est le seul endroit qui enchaîne service → composition.
export function useParfums() {
  const [etat, setEtat] = useState({
    chargement: true,
    parfums: [],
    source: null, // 'api' ou 'secours', pour le futur HUD
  })

  useEffect(() => {
    // Si le composant disparaît avant la fin du chargement (ou si
    // StrictMode relance l'effet en dev), on ignore le résultat obsolète.
    let annule = false

    chargerMeteo().then(({ source, meteo }) => {
      if (annule) return
      setEtat({
        chargement: false,
        parfums: composerParfums(villes, meteo),
        source,
      })
    })

    // Fonction de nettoyage : React l'appelle quand l'effet est défait.
    return () => {
      annule = true
    }
  }, [])

  return etat
}