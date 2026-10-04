import { Skeleton } from '@/components'
import type { Quote } from '@/contracts'

// Valor do resumo; enquanto a cotação carrega, um bloco com a mesma altura.
function Value({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return loading ? <Skeleton className="h-6 w-24" /> : <>{children}</>
}

export function Totals({ quote, loading }: { quote: Quote | undefined; loading: boolean }) {
  return (
    <div>
      <p className="mt-1.75 text-center text-body-15">Tem um código promocional? Aplique aqui</p>
      <dl data-testid="checkout-totals" aria-label="Totais" aria-busy={loading} className="mt-0.5 flex flex-col">
        <div className="flex h-8 items-center justify-between text-body-15"><dt>Subtotal</dt><dd className="text-body-large-18"><Value loading={loading}>{quote?.subtotal} ETH</Value></dd></div>
        <div className="flex h-8 items-center justify-between text-body-15"><dt>Desconto do lançamento</dt><dd><Value loading={loading}>(-) {quote?.discount} ETH</Value></dd></div>
        <div className="relative mb-4 flex h-8 items-center justify-between text-body-15"><dt>Taxa de rede</dt><dd className="text-body-large-18"><Value loading={loading}>{quote?.networkFee} ETH</Value><small className="absolute inset-x-0 top-full mt-1.5 text-center text-caption-12 leading-16 text-text-accent">Taxa estimada</small></dd></div>
        <div className="mt-4.25 flex items-center border-t border-border pt-3.5 text-body-large-16-bold"><dt className="w-1/3 text-center">Total</dt><dd className="ml-auto text-body-large-18-bold text-text-accent"><Value loading={loading}>{quote?.total} ETH</Value></dd></div>
      </dl>
    </div>
  )
}
