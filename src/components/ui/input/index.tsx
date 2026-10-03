import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  variant?: 'text' | 'promo'
  size?: 'sm' | 'md'
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, id, disabled, required, type = 'text', variant = 'text', size = 'md', ...rest }, ref) => {
    const generatedId = useId()
    const inputId = id ?? `input-${generatedId}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-body-14-medium text-left mb-2 text-text-secondary">{label}{required && <span className="text-error ml-1" aria-hidden="true">*</span>}</label>}
        <div className="relative">
          {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" aria-hidden="true">{leftIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            className={cn(
              'w-full bg-surface-card border border-border rounded-md',
              'text-text placeholder:text-text-secondary',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:opacity-50 disabled:pointer-events-none disabled:bg-muted',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error focus-visible:ring-error',
              'px-4',
              size === 'sm' ? 'h-10' : 'h-[50px]',
              variant === 'promo' ? 'rounded-pill' : 'rounded-md',
            )}
            {...rest}
          />
          {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" aria-hidden="true">{rightIcon}</div>}
        </div>
        {error && <p id={errorId} className="mt-1.5 text-caption-12-regular text-error" role="alert">{error}</p>}
        {helperText && !error && <p id={helperId} className="mt-1.5 text-caption-12-regular text-text-secondary">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
