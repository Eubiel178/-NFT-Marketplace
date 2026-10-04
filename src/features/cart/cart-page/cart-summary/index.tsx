import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button, Input, Skeleton } from "@/components";
import type { Quote } from "@/contracts";

interface CartSummaryProps {
  coupon: string;
  onCouponChange: (coupon: string) => void;
  onApplyCoupon: () => void;
  applyCouponPending: boolean;
  couponError: string;
  hasCoupon: boolean;
  onRemoveCoupon: () => void;
  realtimeConnected: boolean | null;
  liveNotice: string;
  quantityMutationError: boolean;
  removeMutationError: boolean;
  quoteError: boolean;
  onRetryQuote: () => void;
  quoteLoading: boolean;
  quote: Quote | undefined;
  checkoutDisabled: boolean;
  onCheckout: () => void;
}


// Valor do resumo ou, enquanto a cotação carrega, um bloco com a mesma altura.
function Amount({ loading, children, tall = false }: { loading: boolean; children: React.ReactNode; tall?: boolean }) {
  if (loading) return <Skeleton className={tall ? "h-13 w-20" : "h-6 w-20"} />;
  return <>{children}</>;
}

export function CartSummary({
  coupon,
  onCouponChange,
  onApplyCoupon,
  applyCouponPending,
  couponError,
  hasCoupon,
  onRemoveCoupon,
  realtimeConnected,
  liveNotice,
  quantityMutationError,
  removeMutationError,
  quoteError,
  onRetryQuote,
  quoteLoading,
  quote,
  checkoutDisabled,
  onCheckout,
}: CartSummaryProps) {
  return (
    <aside
      aria-labelledby="cart-summary-title"
      className="flex flex-col gap-6 max-sm:-mx-7 max-sm:w-[calc(100%+3.5rem)] max-sm:rounded-t-40 max-sm:bg-surface-card max-sm:px-7 max-sm:pt-6 max-sm:pb-9"
    >
      <h2 id="cart-summary-title" className="text-body-large-18">
        Resumo da carteira
      </h2>
      <div className="grid grid-cols-[1fr_6.0625rem] items-end sm:grid-cols-[1fr_6.375rem] [&_input]:h-10 [&_input]:rounded-l-3 [&_input]:rounded-r-none">
        <Input
          label="Código promocional"
          value={coupon}
          onChange={(event) => onCouponChange(event.target.value)}
          placeholder="Digite o código promocional..."
          size="sm"
          error={couponError || undefined}
        />
        <Button
          variant="apply"
          size="sm"
          onClick={onApplyCoupon}
          loading={applyCouponPending}
          disabled={!coupon.trim()}
          className="h-10 rounded-l-none rounded-r-3"
        >
          Aplicar
        </Button>
      </div>

      {realtimeConnected === false && (
        <p className="m-0 text-caption-13 text-error" role="alert">
          As atualizações em tempo real estão indisponíveis. O carrinho continua
          sincronizado ao tentar novamente.
        </p>
      )}

      <p className="m-0 text-caption-13 text-primary empty:hidden" role="status" aria-live="polite">
        {liveNotice}
      </p>

      {quantityMutationError && (
        <p className="m-0 text-caption-13 text-error" role="alert">
          Não foi possível atualizar a quantidade. Tente novamente.
        </p>
      )}
      {removeMutationError && (
        <p className="m-0 text-caption-13 text-error" role="alert">
          Não foi possível remover o item. Tente novamente.
        </p>
      )}
      {quoteError && (
        <p className="m-0 text-caption-13 text-error" role="alert">
          Não foi possível atualizar o resumo.{" "}
          <Button variant="link" size="sm" onClick={onRetryQuote}>
            Tentar novamente
          </Button>
        </p>
      )}
      {hasCoupon && (
        <Button variant="ghost" size="sm" onClick={onRemoveCoupon}>
          Remover cupom
        </Button>
      )}
      <p className="sr-only" role="status">
        {quoteLoading ? "Calculando resumo..." : ""}
      </p>
      <dl data-testid="cart-totals" aria-label="Totais" aria-busy={quoteLoading} className="m-0 grid gap-3 [&_dd]:m-0 [&_dt]:m-0">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd className="flex flex-col items-end gap-1 text-text-accent">
            <Amount loading={quoteLoading}>{quote?.subtotal ?? "—"} ETH</Amount>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Desconto do lançamento</dt>
          <dd className="flex flex-col items-end gap-1 text-text-accent">
            <Amount loading={quoteLoading}>-{quote?.discount ?? "0"} ETH</Amount>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Taxa de rede</dt>
          <dd className="flex flex-col items-end gap-1 text-text-accent">
            <Amount loading={quoteLoading} tall>
              <span>{quote?.networkFee ?? "—"} ETH</span>
              <small className="text-caption-12 font-normal text-text-accent">Taxa estimada</small>
            </Amount>
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3 font-bold text-foreground">
          <dt>Total</dt>
          <dd className="flex flex-col items-end gap-1 text-foreground">
            <Amount loading={quoteLoading}>{quote?.total ?? "—"} ETH</Amount>
          </dd>
        </div>
      </dl>
      <Button
        size="sm"
        disabled={checkoutDisabled}
        onClick={onCheckout}
        className="w-full justify-between max-sm:min-h-15 max-sm:rounded-40"
      >
        Conectar e finalizar <ArrowRight aria-hidden="true" />
      </Button>
      <Link className="self-center text-body-15 text-text-secondary" to="/">
        Continuar explorando
      </Link>
    </aside>
  );
}
