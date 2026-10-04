export interface OptionProps {
  label: string
  count: number
  selected: boolean
  onToggle: () => void
}

// Linha do painel de filtros: o item escolhido fica com a cor de destaque.
export function Option({ label, count, selected, onToggle }: OptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className="flex h-10 w-full items-center justify-between text-left font-mono text-[0.9375rem] font-normal leading-10 text-text-secondary aria-pressed:text-text-accent"
    >
      <span>{label}</span>
      <span>({count})</span>
    </button>
  )
}
