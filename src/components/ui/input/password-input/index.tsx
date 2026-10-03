import { forwardRef, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface PasswordInputProps extends Omit<React.ComponentProps<'input'>, 'type' | 'size'> {
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md'
  showToggle?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, id, disabled, required, showToggle = true, size = 'md', ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const generatedId = useId()
    const inputId = id ?? `password-input-${generatedId}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-left text-body-14-medium text-text-secondary">
            {label}
            {required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
             className={cn(
               'w-full rounded-md border border-border bg-surface-card px-4 text-body-14-regular text-text',
               showToggle && 'pr-12',
              size === 'sm' ? 'h-10' : 'h-[50px]',
              'placeholder:text-text-secondary transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:pointer-events-none disabled:bg-muted disabled:opacity-50',
              error && 'border-error focus-visible:ring-error',
            )}
            {...rest}
          />
           {showToggle && <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
            disabled={disabled}
          >
            {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
           </button>}
        </div>
        {error && <p id={errorId} className="mt-1.5 text-caption-12-regular text-error" role="alert">{error}</p>}
        {helperText && !error && <p id={helperId} className="mt-1.5 text-caption-12-regular text-text-secondary">{helperText}</p>}
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
