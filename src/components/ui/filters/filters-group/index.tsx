import type { ReactNode } from 'react'

export interface FiltersGroupProps {
  title: string
  children: ReactNode
  className?: string
}

export function FiltersGroup({ title, children, className }: FiltersGroupProps) {
  return (
    <fieldset className={className}>
      <legend className="text-body-15-bold text-foreground">{title}</legend>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </fieldset>
  )
}
