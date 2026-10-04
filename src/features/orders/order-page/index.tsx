import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { Button, Image, NftReceiptArtwork, receiptColumns, Skeleton } from "@/components";
import { parseHttpError } from "@/lib/http";
import { cn } from "@/lib/utils";

import { useOrder } from "../hooks/use-order";
import {
  formatOrderDate,
  networkLabels,
  paymentMethodLabel,
  receiptLineTotal,
  transactionExplorer,
} from "../lib/order-receipt";

// Cartão do frame (578px, faixa laranja embaixo e "fechar" no canto) para todos
// os estados do pedido; só o confirmado mostra o recibo.
function OrderCard({ children, role }: { children: ReactNode; role?: "status" | "alert" }) {
  return (
    <section
      aria-labelledby="order-title"
      role={role}
      className="relative mx-auto mt-4 w-full max-w-144.5 border-b-10 border-b-primary bg-surface-card max-sm:-ml-6 max-sm:w-[calc(100%+3rem)] sm:mt-35.5"
    >
      <Link
        to="/"
        aria-label="Fechar confirmação"
        className="absolute top-2 right-1.75 grid size-8 place-items-center rounded-4"
      >
        <Image src="/assets/figma/mcp/svg/close-x.svg" alt="" width={18} height={18} className="size-4.5" />
      </Link>
      {children}
    </section>
  );
}

// Estados sem recibo: título, texto e ações no mesmo cartão.
function OrderState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid justify-items-center gap-4 px-11 pt-12 pb-12 text-center max-sm:px-5">
      <h1 id="order-title" className="text-body-large-16-bold leading-24 text-text-secondary">{title}</h1>
      {children}
    </div>
  );
}

export function OrderPage({ id }: { id: string }) {
  const { order, realtimeConnected } = useOrder(id);

  if (order.isPending)
    return (
      <OrderCard role="status">
        <div className="grid gap-4 px-11 pt-5.25 pb-12 max-sm:px-5">
          <span id="order-title" className="sr-only">Carregando pedido</span>
          <Skeleton className="mx-auto size-20" />
          <Skeleton className="mx-auto h-6 w-88.75 max-w-full" />
          <Skeleton className="h-16.25" />
          <Skeleton className="h-60" />
          <Skeleton className="mx-auto h-12 w-46.5" />
        </div>
      </OrderCard>
    );

  if (order.isError) {
    const notFound = parseHttpError(order.error).status === 404;
    return (
      <OrderCard role="alert">
        <OrderState title={notFound ? "Pedido não encontrado" : "Não foi possível carregar o pedido"}>
          <p className="text-body-14 leading-22 text-text-secondary">
            {notFound
              ? "Confira o link do pedido ou volte para o início."
              : "Ocorreu uma falha temporária ao consultar o pedido."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => void order.refetch()}>Tentar novamente</Button>
            <Button variant="secondary" asChild>
              <Link to="/">Voltar ao início</Link>
            </Button>
          </div>
        </OrderState>
      </OrderCard>
    );
  }

  if (order.data.status === "pending")
    return (
      <OrderCard role="status">
        <OrderState title="Confirmando sua compra">
          <p className="text-body-14 leading-22 text-text-secondary">
            Estamos aguardando a confirmação da rede. Esta página será atualizada automaticamente.
          </p>
          {realtimeConnected === false && (
            <p className="text-caption-13 text-error" role="alert">
              A conexão em tempo real foi interrompida. Continuaremos consultando o pedido.
            </p>
          )}
        </OrderState>
      </OrderCard>
    );

  if (order.data.status === "declined")
    return (
      <OrderCard role="alert">
        <OrderState title="Pagamento recusado">
          <p className="text-body-14 leading-22 text-text-secondary">
            Não foi possível confirmar o pagamento. Seus itens continuam no carrinho.
          </p>
          <Button asChild>
            <Link to="/cart">Voltar ao carrinho</Link>
          </Button>
        </OrderState>
      </OrderCard>
    );

  // Recibo: tudo vem do snapshot gravado no pedido (itens, preços, total, carteira),
  // não do catálogo atual.
  const { quote, wallet, transactionRef, createdAt } = order.data;
  const explorer = transactionExplorer(wallet.network, transactionRef);
  const meta = [
    { label: "ID da transação", value: transactionRef ?? "—", strong: true },
    { label: "Data", value: formatOrderDate(createdAt), strong: false },
    { label: "Total", value: `${quote.total} ETH`, strong: false },
    { label: "Carteira", value: paymentMethodLabel(wallet.method), strong: true },
  ];

  return (
    <OrderCard>
      <header className="grid justify-items-center gap-3.25 border-b border-primary px-11 pt-5.25 pb-4.5 text-center max-sm:px-5">
        <Image src="/assets/figma/mcp/svg/thank-you.svg" alt="" width={80} height={80} className="size-20" />
        <h1 id="order-title" className="text-body-large-16-bold leading-24 text-text-secondary">
          Seus NFTs agora estão na sua carteira
        </h1>
      </header>
      <dl className="flex justify-center border-b border-primary px-3 py-3 text-body-14 leading-20 text-text-secondary max-sm:grid max-sm:grid-cols-2 max-sm:gap-y-3 max-sm:px-5">
        {meta.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "flex flex-col sm:whitespace-nowrap",
              index > 0 && "ml-4.75 border-l border-primary pl-4.25",
              index === 2 && "max-sm:ml-0 max-sm:border-l-0 max-sm:pl-0",
            )}
          >
            <dt className={cn(item.strong && "font-bold")}>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="px-11 pt-5.25 pb-12 max-sm:px-5">
        <h2 className="text-body-15-bold text-foreground">Detalhes da transação</h2>
        <div aria-hidden="true" className={cn(receiptColumns, "mt-3 border-b border-border-soft pb-2.75 text-body-15-bold text-foreground max-sm:text-caption-12 max-sm:font-bold")}>
          <span>NFTs</span>
          <span className="text-center">Edições</span>
          <span className="text-right">Subtotal</span>
        </div>
        <ul aria-label="NFTs comprados" className="grid gap-3.5 pt-3.25">
          {quote.items.map((item) => (
            <li key={`${item.nftId}:${item.editionId}`}>
              <NftReceiptArtwork
                image={item.image}
                imageAlt=""
                name={item.name ?? item.nftId}
                tokenId={item.tokenId}
                quantity={item.quantity}
                totalEth={receiptLineTotal(item)}
              />
            </li>
          ))}
        </ul>
        <div className="mt-1.5 border-b border-border-soft pb-1.75">
          <dl className="ml-auto grid w-80.25 grid-cols-[1fr_auto] gap-y-1.5 max-sm:w-full">
            <dt className="text-body-15 leading-24 text-foreground">Taxa de rede</dt>
            <dd className="text-right text-body-large-18 leading-24 text-foreground">{quote.networkFee} ETH</dd>
            <dt className="text-body-15-bold leading-24 text-foreground">Total</dt>
            <dd data-testid="order-total" className="text-right text-body-large-18-bold leading-24 text-text-accent">{quote.total} ETH</dd>
          </dl>
        </div>
        <p className="mt-3.25 text-center text-body-14 leading-22 text-text-secondary">
          Transação confirmada na {networkLabels[wallet.network]}. A propriedade foi transferida para sua carteira
          conectada e registrada na rede.
        </p>
        <a
          href={explorer.href}
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-5 flex h-12 w-fit items-center rounded-4 bg-primary px-4 text-body-large-16-bold text-ink"
        >
          Ver no {explorer.name}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </OrderCard>
  );
}
