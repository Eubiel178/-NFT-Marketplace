import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { ModalContext } from '../modal-context'

interface ModalRootProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
}

export function ModalRoot({ isOpen, onClose, children, size = 'sm', className }: ModalRootProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const modalId = useId()
  const [hasTitle, setHasTitle] = useState(false)
  const [hasDescription, setHasDescription] = useState(false)
  const contextValue = useMemo(() => ({
    titleId: `${modalId}-title`,
    descriptionId: `${modalId}-description`,
    setHasTitle,
    setHasDescription,
  }), [modalId])

  useEffect(() => {
    if (!isOpen) return
    previousActiveElement.current = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const focusable = contentRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const focusTarget = firstFocusable ?? contentRef.current
      focusTarget?.focus()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previousActiveElement.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={!hasTitle ? 'Dialog' : undefined}
      aria-labelledby={hasTitle ? `${modalId}-title` : undefined}
      aria-describedby={hasDescription ? `${modalId}-description` : undefined}
    >
      <ModalContext.Provider value={contextValue}>
        <div
          ref={contentRef}
          tabIndex={-1}
          className={cn(
            'relative w-full overflow-hidden rounded-8 bg-surface-card',
            size === 'sm' ? 'max-w-[500px]' : 'max-w-[578px]',
            className,
          )}
        >
          {children}
        </div>
      </ModalContext.Provider>
    </div>
  )

  return createPortal(modalContent, document.body)
}
