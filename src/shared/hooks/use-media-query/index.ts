import { useSyncExternalStore } from 'react'

// Para os poucos casos em que mobile e desktop têm estrutura diferente: só a
// versão da largura atual vai para o DOM.
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}
