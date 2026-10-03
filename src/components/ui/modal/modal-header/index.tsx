interface ModalHeaderProps {
  children: React.ReactNode
}

export function ModalHeader({ children }: ModalHeaderProps) {
  return <header className="flex items-center justify-between border-b border-border p-6">{children}</header>
}
