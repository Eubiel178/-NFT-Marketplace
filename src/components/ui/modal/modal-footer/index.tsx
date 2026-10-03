interface ModalFooterProps {
  children: React.ReactNode
}

export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <footer className="flex items-center justify-end gap-3 border-t border-border p-6">
      {children}
    </footer>
  )
}
