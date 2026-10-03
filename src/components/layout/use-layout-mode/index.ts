import { useSyncExternalStore } from 'react'

const desktopQuery = '(min-width: 1024px)'

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined

  const mediaQuery = window.matchMedia(desktopQuery)
  mediaQuery.addEventListener('change', onStoreChange)

  return () => mediaQuery.removeEventListener('change', onStoreChange)
}

function getSnapshot() {
  return typeof window !== 'undefined' && window.matchMedia(desktopQuery).matches
}

function getServerSnapshot() {
  return false
}

export function useLayoutMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) ? 'desktop' : 'mobile'
}
