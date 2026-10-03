import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  position?: 'bottom' | 'top' | 'left' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'full'
  showDragHandle?: boolean
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  className?: string
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'bottom',
  size = 'full',
  showDragHandle = true,
  showCloseButton = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: SheetProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const titleId = 'sheet-title'
  const descriptionId = 'sheet-description'

  useEffect(() => {
    if (!isOpen) return
    previousActiveElement.current = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) onClose()
      if (e.key === 'Tab') {
        const focusableElements = contentRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
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
  }, [isOpen, closeOnEscape, onClose])

  if (!isOpen) return null

  const sheetContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex',
        position === 'bottom' && 'items-end',
        position === 'top' && 'items-start',
        position === 'left' && 'items-start justify-start',
        position === 'right' && 'items-start justify-end'
      )}
    >
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-40" onClick={closeOnOverlayClick ? onClose : undefined} aria-hidden="true" />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : 'Painel'}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-50 w-full',
          position === 'bottom' && 'bottom-0 left-0 right-0',
          position === 'top' && 'top-0 left-0 right-0',
          position === 'left' && 'left-0 top-0 bottom-0',
          position === 'right' && 'right-0 top-0 bottom-0',
          'bg-surface-card',
          'shadow-buy-bar',
          'overflow-y-auto',
          size === 'sm' && 'max-h-[40vh]',
          size === 'md' && 'max-h-[60vh]',
          size === 'lg' && 'max-h-[80vh]',
          size === 'full' && 'max-h-[90vh]',
          'rounded-40-t',
          className
        )}
      >
        {(showDragHandle || title || showCloseButton) && (
          <header className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-4 flex-1">
              {showDragHandle && <div className="w-10 h-1.5 bg-border-soft rounded-full mx-auto" aria-hidden="true" />}
              <div className="flex-1">
                {title && <h2 id={titleId} className="text-title-20-bold">{title}</h2>}
                {description && <p id={descriptionId} className="mt-1 text-body-14-regular text-text-secondary">{description}</p>}
              </div>
            </div>
            {showCloseButton && (
                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors text-text-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Fechar">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </header>
        )}
        <section className="p-6 pb-safe-bottom">{children}</section>
      </div>
    </div>
  )

  if (typeof window === 'undefined') return null
  return createPortal(sheetContent, document.body)
}
