import { useSyncExternalStore } from 'react'
import { abonner, estCoupe } from '../services/son'

export function useSonCoupe() {
  return useSyncExternalStore(abonner, estCoupe)
}
