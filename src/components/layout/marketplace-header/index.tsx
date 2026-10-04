import { Link, useLocation } from "@tanstack/react-router";

import { Image } from "../../ui/image";
import { Header } from "../header";

export function MarketplaceHeader() {
  const location = useLocation();
  const navigation = [
    { label: "Início", href: "/", active: location.pathname === "/" },
    {
      label: "Mercado",
      href: "/",
      active: location.pathname.startsWith("/nfts"),
    },
    { label: "Criadores", href: "/", active: false },
    { label: "Aprenda", href: "/", active: false },
  ] as const;

  return (
    <Header.Root>
      <Header.Navigation
        logo={
          <Link
            to="/"
            className="text-body-14-bold text-foreground"
            aria-label="Kurio, início"
          >
            KURIO
          </Link>
        }
        items={navigation}
        className="flex-1"
      />

      <Header.Actions>
        <Link
          to="/"
          aria-label="Buscar NFTs"
          className="rounded-md p-2 text-text-secondary hover:bg-surface-card hover:text-foreground"
        >
          <Image src="/assets/figma/mcp/svg/search.svg" alt="" width={20} height={20} aria-hidden="true" />
        </Link>
        <span className="header-cart">
          <Link
            to="/cart"
            aria-label="Carrinho"
            className="header-cart-link rounded-md p-2 text-text-secondary hover:bg-surface-card hover:text-foreground"
          >
            <Image src="/assets/figma/mcp/svg/shop.svg" alt="" width={20} height={20} aria-hidden="true" />
          </Link>
          <span className="header-cart-badge" aria-label="6 itens no carrinho">
            6
          </span>
        </span>
        <Link
          to="/login"
          search={{ redirect: "/", expired: false }}
          className="inline-flex min-h-10 items-center gap-2 rounded-6 bg-primary px-4 text-body-14-bold text-primary-foreground hover:opacity-90"
        >
          <Image src="/assets/figma/mcp/svg/iconly-curved-logout.svg" alt="" width={20} height={20} aria-hidden="true" />
          Entrar
        </Link>
      </Header.Actions>
    </Header.Root>
  );
}
