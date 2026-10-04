import { X } from 'lucide-react'

interface ModalCloseProps {
  onClose: () => void
}

export function ModalClose({ onClose }: ModalCloseProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="p-1 rounded-full hover:bg-surface-card transition-colors text-text-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Fechar"
    >
      <X className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
