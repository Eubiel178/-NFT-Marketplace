import { useId } from 'react'

import { Check, ChevronDown } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
  'aria-label'?: string
}

export function Select({
  label,
  error,
  helperText,
  placeholder = 'Selecione uma opção',
  options,
  value,
  onChange,
  disabled = false,
  required,
  'aria-label': ariaLabel,
}: SelectProps) {
  const selectId = useId()
  const errorId = error ? `${selectId}-error` : undefined
  const helperId = helperText ? `${selectId}-helper` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined
  // O Radix não aceita item com valor vazio: a opção "" vira o placeholder.
  const emptyOption = options.find((option) => option.value === '')
  const items = options.filter((option) => option.value !== '')

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-left text-body-14-medium text-text-secondary">
          {label}
          {required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled} required={required}>
        <SelectPrimitive.Trigger
          id={selectId}
          aria-label={label ? undefined : ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn(
            'flex h-12.5 w-full items-center justify-between rounded-6 border border-border bg-surface-card px-4 text-left text-body-14-regular text-foreground transition-colors duration-200',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            error && 'border-error focus-visible:ring-error',
          )}
        >
          <span className="truncate">
            <SelectPrimitive.Value placeholder={emptyOption?.label ?? placeholder} />
          </span>
          <SelectPrimitive.Icon className="ml-2 shrink-0">
            <ChevronDown className="size-4 text-text-secondary" aria-hidden="true" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-60 w-(--radix-select-trigger-width) overflow-y-auto rounded-6 border border-border bg-surface-card shadow-cart-focus"
          >
            <SelectPrimitive.Viewport>
              {items.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-4 py-3 text-body-14-regular outline-none select-none',
                    'data-highlighted:bg-surface-raised data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary',
                    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
                  )}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4 text-primary" aria-hidden="true" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p id={errorId} className="mt-1.5 text-caption-12-regular text-error" role="alert">{error}</p>}
      {!error && helperText && <p id={helperId} className="mt-1.5 text-caption-12-regular text-text-secondary">{helperText}</p>}
    </div>
  )
}
