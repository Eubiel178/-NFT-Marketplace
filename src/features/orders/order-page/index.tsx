import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ExternalLink, X } from "lucide-react";

import { Button, Image } from "@/components";
import { fromWei, toWei } from "@/lib/eth";
import { parseHttpError } from "@/lib/http";
import { keys } from "@/lib/query";
import { subscribeOrder, useRealtimeConnected } from "@/realtime";
import { sessionOptions } from "@/shared/api/session";

import { getOrder } from "../api";

function formatOrderDate(value: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).formatToParts(new Date(value));
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return `${day} ${month}, ${year}`;
}

export function OrderPage({ id }: { id: string }) {
  const navigate = useNavigate();
  const realtimeConnected = useRealtimeConnected();
  const session = useQuery(sessionOptions);
  const userId = session.data?.user?.id ?? "";
  // Mudanças de status chegam por order.updated; o REST só reconcilia ao
  // carregar e a cada (re)conexão do socket.
  const order = useQuery({
    queryKey: keys.order(userId, id),
    queryFn: ({ signal }) => getOrder(id, signal),
    enabled: Boolean(userId),
  });
  useEffect(
    () =>
      userId ? subscribeOrder(userId, id) : undefined,
    [id, userId],
  );
  if (order.isPending)
    return (
      <section className="order-page">
        <div
          className="checkout-skeleton"
          role="status"
          aria-label="Carregando pedido"
        />
      </section>
    );
  if (order.isError) {
    const notFound = parseHttpError(order.error).status === 404;
    return (
      <section className="order-page" role="alert">
        <h1>
          {notFound
            ? "Pedido não encontrado"
            : "Não foi possível carregar o pedido"}
        </h1>
        <p>
          {notFound
            ? "Confira o link do pedido ou volte para o início."
            : "Ocorreu uma falha temporária ao consultar o pedido."}
        </p>
        <Button onClick={() => void order.refetch()}>Tentar novamente</Button>
        <Button variant="secondary" asChild>
          <Link to="/">Voltar ao início</Link>
        </Button>
      </section>
    );
  }
  if (order.data.status === "pending")
    return (
      <section className="order-page" role="status">
        <article className="order-modal">
          <h1 id="order-title">Confirmando sua compra</h1>
          <p>
            Estamos aguardando a confirmação da rede. Esta página será
            atualizada automaticamente.
          </p>
          {realtimeConnected === false && (
            <p className="checkout-error" role="alert">
              A conexão em tempo real foi interrompida. Continuaremos
              consultando o pedido.
            </p>
          )}
        </article>
      </section>
    );
  if (order.data.status === "declined")
    return (
      <section className="order-page" role="alert">
        <article className="order-modal">
          <h1 id="order-title">Pagamento recusado</h1>
          <p>
            Não foi possível confirmar o pagamento. Seus itens continuam no
            carrinho.
          </p>
          <Button asChild>
            <Link to="/cart">Voltar ao carrinho</Link>
          </Button>
        </article>
      </section>
    );
  const items = order.data.quote.items;
  const networkLabel = order.data.wallet.network === "polygon" ? "Polygon" : "Ethereum";
  return (
    <section className="order-page" aria-labelledby="order-title">
      <div className="order-scrim" aria-hidden="true" />
      <article className="order-modal">
        <button
          className="order-close"
          type="button"
          onClick={() => void navigate({ to: "/" })}
          aria-label="Fechar confirmação"
        >
          <X aria-hidden="true" />
        </button>
        <header className="order-header">
          <Image src="/assets/figma/mcp/svg/thank-you.svg" alt="" width={80} height={80} />
          <h1 id="order-title">Seus NFTs agora estão na sua carteira</h1>
        </header>
        <dl className="order-meta">
          <div>
            <dt>ID da transação</dt>
            <dd>{order.data.transactionRef}</dd>
          </div>
          <div>
            <dt>Data</dt>
             <dd>{formatOrderDate(order.data.createdAt)}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{order.data.quote.total} ETH</dd>
          </div>
          <div>
            <dt>Carteira</dt>
            <dd>{order.data.wallet.name}</dd>
          </div>
        </dl>
        <div className="order-details">
          <h2>Detalhes da transação</h2>
          <div className="order-table-head">
            <span>NFTs</span>
            <span>Edições</span>
            <span>Subtotal</span>
          </div>
          {items.map((item) => {
            const name = item.name ?? item.nftId;
            const image = item.image;
            const price = item.price;
            return (
              <div className="order-line" key={item.nftId}>
                <div>
                  {image && (
                    <Image priority src={image} alt="" width={54} height={54} />
                  )}
                  <span>{name}</span>
                </div>
                <span>{item.quantity}</span>
                <strong>
                  {price
                    ? `${fromWei(toWei(price) * BigInt(item.quantity))} ETH`
                    : "—"}
                </strong>
              </div>
            );
          })}
          <dl className="order-totals">
            <div>
              <dt>Taxa de rede</dt>
              <dd>{order.data.quote.networkFee} ETH</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{order.data.quote.total} ETH</dd>
            </div>
          </dl>
        </div>
        <footer className="order-footer">
          <p>
            Transação confirmada na {networkLabel}. A propriedade foi transferida para
            sua carteira conectada e registrada na rede.
          </p>
          <a
            href={
              order.data.transactionRef
                ? `https://etherscan.io/tx/${encodeURIComponent(order.data.transactionRef)}`
                : "https://etherscan.io/"
            }
            target="_blank"
            rel="noreferrer"
          >
            Ver no Etherscan <ExternalLink aria-hidden="true" />
          </a>
        </footer>
      </article>
    </section>
  );
}
