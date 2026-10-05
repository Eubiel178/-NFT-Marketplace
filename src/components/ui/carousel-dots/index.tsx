import type { ComponentProps } from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Área de toque de 1.25rem × 1.5rem (a largura é o passo de 20px do Figma, sem sobreposição)
// em volta de um ponto de 0.75rem, que continua a cada 20px.
const dot = cva(
  "relative -my-1.5 h-6 w-5 cursor-pointer rounded-full bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary before:absolute before:top-1/2 before:left-1/2 before:size-3 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border before:border-primary before:content-['']",
  {
    variants: {
      active: { true: 'before:bg-primary', false: '' },
    },
  },
)

export interface CarouselDotsProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  activeIndex?: number
  count?: number
  onSelect?: (index: number) => void
}

export function CarouselDots({ activeIndex = 1, className, count = 3, onSelect, ...props }: CarouselDotsProps) {
  return (
    <div className={cn('flex h-3 items-center justify-center', className)} role="tablist" aria-label="Páginas do carrossel" {...props}>
      {Array.from({ length: count }, (_, index) => (
        <button
          type="button"
          role="tab"
          aria-label={`Página ${index + 1}`}
          aria-selected={index === activeIndex}
          className={dot({ active: index === activeIndex })}
          onClick={onSelect ? () => onSelect(index) : undefined}
          key={index}
        />
      ))}
    </div>
  )
}
