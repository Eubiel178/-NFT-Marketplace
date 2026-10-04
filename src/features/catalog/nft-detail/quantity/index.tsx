import { cva } from 'class-variance-authority'
import { Minus, Plus } from 'lucide-react'

const step = cva('grid place-items-center rounded-full bg-primary text-ink disabled:cursor-not-allowed disabled:opacity-50', {
  variants: {
    size: { lg: 'h-12 w-7.75', sm: 'h-7.5 w-5 border border-ink' },
  },
})

const value = cva('text-center text-foreground', {
  variants: {
    size: { lg: 'w-9.75 text-title-20 leading-24', sm: 'w-9 text-title-20-bold leading-24' },
  },
})

export interface QuantityProps {
  quantity: number
  canDecrease: boolean
  canIncrease: boolean
  onDecrease: () => void
  onIncrease: () => void
  size: 'lg' | 'sm'
}

// Seletor de quantidade: pílulas altas no desktop e pequenas na barra de compra do mobile.
export function Quantity({ quantity, canDecrease, canIncrease, onDecrease, onIncrease, size }: QuantityProps) {
  return (
    <div className="flex items-center" role="group" aria-label="Quantidade">
      <button type="button" aria-label="Diminuir quantidade" disabled={!canDecrease} onClick={onDecrease} className={step({ size })}>
        <Minus aria-hidden="true" className={size === 'lg' ? 'size-5' : 'size-3'} strokeWidth={2.5} />
      </button>
      <output aria-label="Quantidade" aria-live="polite" className={value({ size })}>{quantity}</output>
      <button type="button" aria-label="Aumentar quantidade" disabled={!canIncrease} onClick={onIncrease} className={step({ size })}>
        <Plus aria-hidden="true" className={size === 'lg' ? 'size-5' : 'size-3'} strokeWidth={2.5} />
      </button>
    </div>
  )
}
