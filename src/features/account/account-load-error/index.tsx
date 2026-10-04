import { Button } from '@/components'

export interface AccountLoadErrorProps {
  title: string
  onRetry: () => void
}

export function AccountLoadError({ title, onRetry }: AccountLoadErrorProps) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4">
      <h2 className="text-body-large-16-bold">{title}</h2>
      <Button onClick={onRetry}>Tentar novamente</Button>
    </div>
  )
}
