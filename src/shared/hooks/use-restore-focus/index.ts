import { useRef } from 'react'

// Overlays do Radix devolvem o foco ao próprio Trigger. Quando quem abre é um
// botão de fora do componente, guardamos o elemento focado na abertura e
// devolvemos o foco a ele no fechamento.
export function useRestoreFocus() {
  const previous = useRef<HTMLElement | null>(null)

  return {
    onOpenAutoFocus() {
      previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    },
    onCloseAutoFocus(event: Event) {
      event.preventDefault()
      previous.current?.focus()
      previous.current = null
    },
  }
}
