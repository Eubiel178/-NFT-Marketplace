import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

import { cn } from '@/lib/utils'

import { ToastContext } from './toast-context'
import type { Toast } from './toast-context'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (typeof window === 'undefined') return null

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[380px] max-w-[90vw]"
      role="region"
      aria-label="Notificações"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  )
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    let dismissTimer: ReturnType<typeof setTimeout> | undefined

    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsExiting(true)
        dismissTimer = setTimeout(() => onDismiss(toast.id), 200)
      }, toast.duration ?? 5000)
      return () => {
        clearTimeout(timer)
        if (dismissTimer) clearTimeout(dismissTimer)
      }
    }
  }, [toast, onDismiss])

  const icons = {
    default: Info,
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const variantStyles = {
    default: 'bg-surface-card border-border',
    success: 'bg-primary/10 border-primary',
    error: 'bg-error/10 border-error',
    warning: 'bg-error/10 border-error',
    info: 'bg-primary/10 border-primary',
  }
  const iconStyles = {
    default: 'text-foreground',
    success: 'text-primary',
    error: 'text-error',
    warning: 'text-error',
    info: 'text-primary',
  }

  const Icon = icons[toast.variant]
  const action = toast.action

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4',
        'bg-surface-card border',
        'rounded-10 shadow-cart-focus',
        'animate-slide-in',
        isExiting && 'animate-slide-out opacity-0',
        variantStyles[toast.variant]
      )}
      role="alert"
      aria-live="assertive"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[toast.variant])} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-body-14-medium text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-body-14-regular text-text-secondary">{toast.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action && (
          <button
            type="button"
            onClick={() => {
              action.onClick()
              onDismiss(toast.id)
            }}
            className="text-body-14-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {action.label}
          </button>
        )}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="p-1 text-text-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
           aria-label="Fechar notificação"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
