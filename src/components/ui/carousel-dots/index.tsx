import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export interface CarouselDotsProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  activeIndex?: number
  count?: number
  onSelect?: (index: number) => void
}

export function CarouselDots({ activeIndex = 1, className, count = 3, onSelect, ...props }: CarouselDotsProps) {
  return (
    <div className={cn('carousel-dots', className)} role="tablist" aria-label="Páginas do carrossel" {...props}>
      {Array.from({ length: count }, (_, index) => (
        <button
          type="button"
          role="tab"
          aria-label={`Página ${index + 1}`}
          aria-selected={index === activeIndex}
          className={cn('carousel-dot', index === activeIndex && 'is-active')}
          onClick={onSelect ? () => onSelect(index) : undefined}
          key={index}
        />
      ))}
    </div>
  )
}
