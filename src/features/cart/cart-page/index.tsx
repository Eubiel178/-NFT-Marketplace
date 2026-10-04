import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button, Skeleton } from "@/components";
import { catalogOptions, withCatalogDefaults } from "@/features/catalog";
import { cn } from "@/lib/utils";
import { useRealtimeConnected } from "@/realtime";
import { sessionOptions } from "@/shared/api/session";

import { useCartLines } from "../hooks/use-cart-lines";
import { useCartLiveNotice } from "../hooks/use-cart-live-notice";
import { useCartQuote } from "../hooks/use-cart-quote";
import { lineKey, maxQuantity } from "../lib/cart-line";
import { CartLine, cartColumns } from "./cart-line";
import { CartRelated } from "./cart-related";
import { CartSummary } from "./cart-summary";

const relatedSearch = withCatalogDefaults({});

const page =
  "mx-auto flex w-full max-w-content flex-col gap-8 max-sm:-ml-6 max-sm:w-[calc(100%+3rem)] max-sm:gap-4 max-sm:px-7";

// Mesmas caixas da página carregada: trilha, título, três linhas e o resumo.
function CartSkeleton() {
  return (
    <section className={page} role="status" aria-label="Carregando carrinho">
      <Skeleton className="h-6 w-60 max-sm:hidden" />
      <Skeleton className="mt-3.5 h-6 w-64 sm:hidden" />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20.75rem] lg:items-start">
        <div className="grid gap-3">
          {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-25 sm:h-17.5" />)}
        </div>
        <Skeleton className="h-117.25" />
      </div>
    </section>
  );
}

export function CartPage() {
  const session = useQuery(sessionOptions);
  if (session.isPending) return <CartSkeleton />;
  const userId = session.data?.user?.id ?? null;
  return <CartContent key={userId ?? "visitor"} userId={userId} />;
}

function CartContent({ userId }: { userId: string | null }) {
  const navigate = useNavigate();
  const cart = useCartLines(userId);
  const quote = useCartQuote(userId, cart.items);
  const liveNotice = useCartLiveNotice(cart.lines);
  const realtimeConnected = useRealtimeConnected();
  const related = useQuery(catalogOptions(relatedSearch));

  // Visitante também vê o resumo; finalizar leva ao login e volta ao pagamento.
  const goToCheckout = () => {
    if (userId) void navigate({ to: "/checkout" });
    else void navigate({ to: "/login", search: { redirect: "/checkout", expired: false } });
  };

  if (cart.cart.isPending) return <CartSkeleton />;
  if (cart.cart.isError)
    return (
      <section className={page} role="alert">
        <h1>Não foi possível carregar o carrinho</h1>
        <Button onClick={() => void cart.cart.refetch()}>Tentar novamente</Button>
      </section>
    );

  const quoteLoading = quote.quote.isFetching && !quote.quote.data;

  return (
    <section className={page} aria-labelledby="cart-title">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body-15 text-text-secondary max-sm:hidden sm:-mb-6">
        <Link to="/">Início</Link>
        <span>/</span>
        <Link to="/">Mercado</Link>
        <span>/</span>
        <strong>Carrinho</strong>
      </nav>
      <div className="relative flex items-center justify-center gap-4 pt-3.5 sm:contents">
        <Link to="/" aria-label="Voltar" className="absolute left-0 grid size-9 place-items-center rounded-full border border-border text-foreground sm:hidden">
          <ArrowLeft aria-hidden="true" />
        </Link>
        {/* O frame desktop não tem título visível: a trilha vai direto para a tabela. */}
        <h1 id="cart-title" className="text-title-20 sm:sr-only">Carrinho de NFTs</h1>
      </div>
      {cart.lines.length === 0 ? (
        <div className="grid justify-items-center gap-4 bg-surface-card px-8 py-16 text-center">
          <h2>Seu carrinho está vazio</h2>
          <p>Descubra obras digitais para começar sua coleção.</p>
          <Button asChild>
            <Link to="/">Explorar NFTs</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-stretch gap-4 sm:grid sm:gap-8 lg:grid-cols-[minmax(0,1fr)_20.75rem] lg:items-start lg:gap-12">
            <div role="list" aria-label="Itens do carrinho" className="min-w-0 max-sm:w-[calc(100%+1.5rem)]">
              <div aria-hidden="true" className={cn(cartColumns, "border-b border-border pr-6 pb-3 text-body-large-16 text-text-secondary max-sm:hidden")}>
                <span>NFTs</span>
                <span>Preço</span>
                <span>Edições</span>
                <span>Total</span>
                <span />
              </div>
              {cart.lines.map((line) => (
                <CartLine
                  key={lineKey(line)}
                  line={line}
                  max={maxQuantity(line, cart.lines)}
                  quantityPending={cart.updating}
                  removePending={cart.removingKey === lineKey(line)}
                  onQuantityChange={(quantity) => cart.changeQuantity(line, quantity)}
                  onRemove={() => cart.removeLine(line)}
                />
              ))}
            </div>
            <CartSummary
              coupon={quote.coupon}
              onCouponChange={quote.setCoupon}
              onApplyCoupon={quote.applyCoupon}
              applyCouponPending={quote.applying}
              couponError={quote.couponError}
              hasCoupon={quote.hasCoupon}
              onRemoveCoupon={quote.removeCoupon}
              realtimeConnected={realtimeConnected}
              liveNotice={liveNotice}
              quantityMutationError={cart.updateError}
              removeMutationError={cart.removeError}
              quoteError={quote.quote.isError}
              onRetryQuote={() => void quote.quote.refetch()}
              quoteLoading={quoteLoading}
              quote={quote.quote.data}
              checkoutDisabled={!quote.quote.data || quote.quote.isFetching || quote.quote.isError || cart.updating || cart.removing}
              onCheckout={goToCheckout}
            />
          </div>
          <CartRelated
            isPending={related.isPending}
            isError={related.isError}
            items={related.data?.items ?? []}
            onRetry={() => void related.refetch()}
          />
        </>
      )}
    </section>
  );
}
