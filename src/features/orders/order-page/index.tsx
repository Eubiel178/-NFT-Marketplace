import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { ExternalLink, X } from "lucide-react";

import { Button, Image } from "@/components";
import { catalogOptions } from "@/features/catalog/api";
import { getOrder } from "@/features/checkout/api";
import { sessionOptions } from "@/features/session/api";
import { fromWei, toWei } from "@/lib/eth";
import { connectOrder } from "@/lib/realtime";
import { keys } from "@/lib/query";

export function OrderPage({ id }: { id: string }) {
  const navigate = useNavigate();
  const [realtimeConnected, setRealtimeConnected] = useState<boolean | null>(null);
  const session = useQuery(sessionOptions);
  const order = useQuery({
    queryKey: keys.order(id),
    queryFn: ({ signal }) => getOrder(id, signal),
    refetchInterval: (query) =>
      query.state.data?.status === "pending" ? 500 : false,
  });
  const catalog = useQuery(
    catalogOptions({
      q: "",
      category: "all",
      collection: "all",
      network: "all",
      sort: "recent",
      page: 1,
    }),
  );
  useEffect(
    () =>
      session.data?.user
        ? connectOrder(session.data.user.id, id, setRealtimeConnected)
        : undefined,
    [id, session.data?.user],
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
    const notFound =
      axios.isAxiosError(order.error) && order.error.response?.status === 404;
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
  const items = order.data.quote.items.map((item) => ({
    item,
    nft: catalog.data?.items.find((candidate) => candidate.id === item.nftId),
  }));
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
            <dd>29 Jul, 2026</dd>
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
          {items.map(({ item, nft }) => {
            const price = item.price ?? nft?.price;
            const name = item.name ?? nft?.name ?? item.nftId;
            const image = item.image ?? nft?.image;
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
            Transação confirmada na Ethereum. A propriedade foi transferida para
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
