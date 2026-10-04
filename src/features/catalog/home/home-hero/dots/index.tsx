import { cn } from '@/lib/utils'

// Indicador decorativo do Figma: o destaque tem um único slide.
export function Dots({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-auto w-10 text-primary', className)}
      viewBox="0 0 40 8"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="4" r="4" fill="currentColor" />
      <circle cx="36" cy="4" r="4" fill="currentColor" />
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  )
}
