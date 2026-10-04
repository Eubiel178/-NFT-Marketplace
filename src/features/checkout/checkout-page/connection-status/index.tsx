import { Button } from '@/components'

import type { ConnectionStatus as Status } from '../../hooks/use-wallet-connection'

export interface ConnectionStatusProps {
  status: Status
  methodLabel: string
  error: string
  onDisconnect: () => void
  onConnect: () => void
}

// Estado da conexão simulada com a carteira, anunciado aos leitores de tela.
export function ConnectionStatus({ status, methodLabel, error, onDisconnect, onConnect }: ConnectionStatusProps) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-6 items-center justify-between gap-3 text-caption-13">
      {status === 'connecting' && <span className="text-text-secondary">Conectando à {methodLabel}…</span>}
      {status === 'connected' && (
        <>
          <span className="text-text-secondary">{methodLabel} conectada</span>
          <Button variant="link" size="sm" className="min-h-0 p-0 text-caption-13" onClick={onDisconnect}>Desconectar</Button>
        </>
      )}
      {status === 'rejected' && (
        <>
          <span className="text-error">{error}</span>
          <Button variant="link" size="sm" className="min-h-0 shrink-0 p-0 text-caption-13" onClick={onConnect}>Tentar de novo</Button>
        </>
      )}
      {status === 'disconnected' && (
        <>
          <span className="text-text-secondary">Carteira desconectada</span>
          <Button variant="link" size="sm" className="min-h-0 p-0 text-caption-13" onClick={onConnect}>Conectar</Button>
        </>
      )}
    </div>
  )
}
