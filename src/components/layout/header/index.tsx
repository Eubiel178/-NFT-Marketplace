import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";

import { cartOptions } from "@/features/cart/api";
import { sessionOptions } from "@/features/session/api";

import { Icon } from "@/components";

const navigation = [
  { label: "Início", to: "/", match: (pathname: string) => pathname === "/" },
  {
    label: "Mercado",
    to: "/",
    match: (pathname: string) => pathname.startsWith("/nfts"),
  },
  { label: "Criadores", to: "/", match: () => false },
  { label: "Aprenda", to: "/", match: () => false },
] as const;

export function Header() {
  const { pathname } = useLocation();
  const session = useQuery(sessionOptions);
  const cart = useQuery({
    ...cartOptions(session.data?.user?.id ?? null),
    enabled: !session.isPending,
  });

  const cartCount =
    cart.data?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <header className="hidden px-6 md:px-12 lg:block">
      <div className="mx-auto flex h-17.25 max-w-content items-center border-b border-primary/25">
        <Link
          to="/"
          className="text-body-large-16 font-bold leading-auto text-foreground"
          aria-label="Kurio, início"
        >
          KURIO
        </Link>

        <nav aria-label="Principal" className="ml-82 self-stretch">
          <ul className="flex h-full gap-10">
            {navigation.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.label} className="flex">
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "relative flex items-center text-body-large-16 font-medium leading-auto text-text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                        : "flex items-center text-body-large-16 font-medium leading-auto text-foreground hover:text-text-accent"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-6">
          <Link
            to="/"
            aria-label="Buscar NFTs"
            className="rounded-6 p-1 text-foreground"
          >
            <Icon src="/assets/figma/mcp/svg/search.svg" className="size-6" />
          </Link>
          <Link
            to="/cart"
            aria-label={`Carrinho, ${cartCount} itens`}
            className="relative rounded-6 p-1 text-foreground"
          >
            <Icon src="/assets/figma/mcp/svg/shop.svg" className="size-6" />
            <span
              className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-primary text-tiny-9 font-bold leading-auto text-ink"
              aria-hidden="true"
            >
              {cartCount}
            </span>
          </Link>
          <Link
            to="/login"
            search={{ redirect: "/", expired: false }}
            className="flex h-8.75 items-center gap-1 rounded-6 bg-primary px-2.5 text-body-large-16 font-medium leading-auto text-ink"
          >
            <Icon src="/assets/figma/mcp/svg/iconly-curved-logout.svg" />
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
