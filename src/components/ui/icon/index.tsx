import { cn } from '@/lib/utils'

export interface IconProps {
  src: string
  className?: string
}

// Ícones do Figma (SVG) aplicados como máscara: a cor vem de text-* (bg-current),
// então o mesmo asset serve aos estados ativo, inativo e sobre fundos coloridos.
// A URL é dinâmica por uso, por isso vai em style.
export function Icon({ src, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block size-5 shrink-0 bg-current mask-contain mask-center mask-no-repeat', className)}
      style={{ maskImage: `url("${src}")` }}
    />
  )
}
