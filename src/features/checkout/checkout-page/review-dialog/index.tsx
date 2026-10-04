import { Button, Modal, Skeleton } from '@/components'
import type { Collector } from '@/contracts'

import type { Review } from '../../hooks/use-place-order'

export interface ReviewDialogProps {
  open: boolean
  review: Review | null
  reviewing: boolean
  reviewError: boolean
  submitting: boolean
  orderError: string
  liveNotice: string
  walletName: string
  networkLabel: string
  methodLabel: string
  collector: Collector
  onClose: () => void
  onRetry: () => void
  onSubmit: () => void
}

// Etapa de revisão: a cotação acabou de ser revalidada; qualquer mudança aparece
// em destaque e o envio só acontece com um novo clique em "Enviar pedido".
export function ReviewDialog({ open, review, reviewing, reviewError, submitting, orderError, liveNotice, walletName, networkLabel, methodLabel, collector, onClose, onRetry, onSubmit }: ReviewDialogProps) {
  return (
    <Modal.Root isOpen={open} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>Revise sua compra</Modal.Title>
        <Modal.Close />
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4 text-body-14 leading-24">
          {reviewing && !review && (
            <div role="status" aria-label="Revalidando cotação" className="flex flex-col gap-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          )}
          {reviewError && (
            <p role="alert" className="text-error">
              Não foi possível revalidar a cotação.{' '}
              <Button variant="link" size="sm" className="min-h-0 p-0" onClick={onRetry}>Tentar novamente</Button>
            </p>
          )}
          {/* Com o diálogo aberto o resto da página fica inerte: o aviso do nft.updated
              é repetido aqui, no mesmo alerta das mudanças da cotação. */}
          {(liveNotice || (review && review.changes.length > 0)) && (
            <div role="alert" className="rounded-6 border border-primary p-3">
              {liveNotice && <p className="text-text-secondary">{liveNotice}</p>}
              {review && review.changes.length > 0 && (
                <>
                  <p className="font-bold text-text-accent">A cotação mudou. Confira e confirme de novo.</p>
                  <ul className="mt-1 list-disc pl-5 text-text-secondary">
                    {review.changes.map((change) => <li key={change}>{change}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}
          {review && (
            <>
              <ul aria-label="Itens revisados" className="flex flex-col gap-1">
                {review.quote.items.map((item) => (
                  <li key={`${item.nftId}:${item.editionId}`} className="flex justify-between gap-4">
                    <span>{item.name ?? item.nftId} <span className="text-text-secondary">· {item.editionId} · x {item.quantity}</span></span>
                    <span>{item.price} ETH</span>
                  </li>
                ))}
              </ul>
              <dl className="flex flex-col border-t border-border pt-3">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{review.quote.subtotal} ETH</dd></div>
                <div className="flex justify-between"><dt>Desconto</dt><dd>(-) {review.quote.discount} ETH</dd></div>
                <div className="flex justify-between"><dt>Taxa de rede</dt><dd>{review.quote.networkFee} ETH</dd></div>
                <div className="flex justify-between font-bold"><dt>Total</dt><dd className="text-text-accent">{review.quote.total} ETH</dd></div>
              </dl>
              <dl className="flex flex-col border-t border-border pt-3 text-text-secondary">
                <div className="flex justify-between gap-4"><dt>Carteira</dt><dd className="text-foreground">{walletName} · {methodLabel}</dd></div>
                <div className="flex justify-between gap-4"><dt>Rede</dt><dd className="text-foreground">{networkLabel}</dd></div>
                <div className="flex justify-between gap-4"><dt>Endereço</dt><dd className="text-foreground">{collector.walletAddress}</dd></div>
                <div className="flex justify-between gap-4"><dt>Colecionador</dt><dd className="text-foreground">{collector.displayName} · {collector.email}</dd></div>
              </dl>
            </>
          )}
          {orderError && <p role="alert" className="text-error">{orderError}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={onClose}>Voltar</Button>
            <Button variant="primarySolid" size="sm" onClick={onSubmit} disabled={!review || reviewing} loading={submitting}>Enviar pedido</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal.Root>
  )
}
