import { forwardRef, useEffect, useId, useRef, useState } from 'react'

import { Check, ChevronDown, ChevronUp } from 'lucide-react'

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

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
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
    },
    ref
  ) => {
    const [state, setState] = useState<{ isOpen: boolean; highlightedIndex: number }>({
      isOpen: false,
      highlightedIndex: -1,
    })
    const selectId = useId()
    const listboxId = `${selectId}-listbox`
    const errorId = error ? `${selectId}-error` : undefined
    const helperId = helperText ? `${selectId}-helper` : undefined
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined
    const dropdownRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const enabledOptions = options.filter((option) => !option.disabled)

    const open = () => {
      if (!disabled) {
        setState({
          isOpen: true,
          highlightedIndex: enabledOptions.findIndex((option) => option.value === value),
        })
      }
    }

    const close = () => {
      setState({ isOpen: false, highlightedIndex: -1 })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const currentIndex = state.highlightedIndex

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!state.isOpen) {
            open()
          } else {
            setState({
              isOpen: true,
              highlightedIndex: Math.min(Math.max(currentIndex, -1) + 1, enabledOptions.length - 1),
            })
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (state.isOpen) {
            setState({
              isOpen: true,
              highlightedIndex: Math.max(currentIndex < 0 ? enabledOptions.length - 1 : currentIndex - 1, 0),
            })
          }
          break
        case 'Enter':
        case ' ':
          if (state.isOpen && state.highlightedIndex >= 0) {
            e.preventDefault()
            const option = enabledOptions[state.highlightedIndex]
            onChange(option.value)
            close()
            triggerRef.current?.focus()
          } else {
            e.preventDefault()
            open()
          }
          break
        case 'Escape':
          if (state.isOpen) {
            close()
            triggerRef.current?.focus()
          }
          break
        case 'Tab':
          if (state.isOpen) close()
          break
      }
    }

    useEffect(() => {
      if (state.isOpen) {
        const handleClickOutside = (e: MouseEvent) => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target as Node) &&
            triggerRef.current &&
            !triggerRef.current.contains(e.target as Node)
          ) {
            close()
          }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [state.isOpen])

    const dropdown = (
      <div
        ref={dropdownRef}
        id={listboxId}
        className="absolute left-0 top-full z-50 mt-1 max-h-[240px] w-full overflow-y-auto rounded-md border border-border bg-surface-card shadow-cart-focus"
        role="listbox"
        aria-labelledby={selectId}
      >
        {options.map((option, optionIndex) => {
          const enabledIndex = enabledOptions.findIndex((enabledOption) => enabledOption.value === option.value)

          return (
            <div
              id={`${listboxId}-option-${optionIndex}`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className={cn(
                'px-4 py-3 text-body-14-regular',
                option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                'hover:bg-muted',
                'focus:bg-muted',
                'data-[highlighted]:bg-muted',
                option.value === value && 'bg-primary/10 text-primary',
                state.highlightedIndex === enabledIndex && !option.disabled && 'bg-muted',
              )}
              data-highlighted={state.highlightedIndex === enabledIndex}
              data-selected={option.value === value}
              onClick={() => {
                if (option.disabled) return
                onChange(option.value)
                setState({ isOpen: false, highlightedIndex: -1 })
                triggerRef.current?.focus()
              }}
              onMouseEnter={() => {
                if (!option.disabled) setState({ isOpen: true, highlightedIndex: enabledIndex })
              }}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {option.value === value && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
              </div>
            </div>
          )
        })}
      </div>
    )

    return (
      <div ref={ref} className="w-full relative">
        {label && <label id={`${selectId}-label`} htmlFor={selectId} className="block text-body-14-medium text-left mb-2 text-text-secondary">
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>}
         <div className="relative">
          <button
            ref={triggerRef}
            id={selectId}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={state.isOpen}
            aria-controls={listboxId}
             aria-activedescendant={state.isOpen && state.highlightedIndex >= 0 ? `${listboxId}-option-${options.findIndex((option) => !option.disabled && enabledOptions[state.highlightedIndex]?.value === option.value)}` : undefined}
            aria-labelledby={label ? `${selectId}-label` : undefined}
            aria-label={label ? undefined : ariaLabel}
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : 'false'}
            aria-required={required || undefined}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                if (state.isOpen) close()
                else open()
              }
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full relative flex items-center justify-between',
              'bg-surface-card border border-border rounded-md',
              'text-text placeholder:text-text-secondary',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:opacity-50 disabled:pointer-events-none disabled:bg-muted',
               'h-[50px] rounded-md px-4 text-body-14-regular',
              error && 'border-error focus-visible:ring-error'
            )}
          >
            <span className="truncate">
              {value ? (options.find((o) => o.value === value)?.label ?? value) : placeholder}
            </span>
            <span className="ml-2 flex-shrink-0 transition-transform">
              {state.isOpen ? (
                <ChevronUp className="h-4 w-4 text-text-secondary" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-text-secondary" aria-hidden="true" />
              )}
            </span>
          </button>
          {state.isOpen && dropdown}
        </div>
        {error && <p id={errorId} className="mt-1.5 text-caption-12-regular text-error" role="alert">{error}</p>}
        {!error && helperText && <p id={helperId} className="mt-1.5 text-caption-12-regular text-text-secondary">{helperText}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
