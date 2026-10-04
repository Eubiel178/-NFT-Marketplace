import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";

import { Icon } from "@/components";
import { sessionOptions } from "@/shared/api/session";
import { useCartCount } from "@/shared/hooks/use-cart-count";
import { useLogout } from "@/shared/hooks/use-logout";

import { Avatar } from "../../ui/avatar";

const actionClass =
  "flex h-8.75 items-center gap-1 rounded-6 bg-primary px-2.5 text-body-large-16 font-medium leading-auto text-ink";

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
  const user = useQuery(sessionOptions).data?.user;
  const cartCount = useCartCount();
  const logout = useLogout();

  return (
    <header className="hidden px-6 md:px-12 lg:block">
      <div className="mx-auto flex items-center ga h-17.25 max-w-content  border-b border-primary/25">
        <Link
          to="/"
          className="text-foreground font-mono text-body-14 font-bold leading-normal tracking-[1.4px]"
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

          {user ? (
            <>
              <Link
                to="/profile"
                aria-label={`Perfil de ${user.name}`}
                className="rounded-full"
              >
                <Avatar fallback={user.name} size="sm" />
              </Link>
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className={actionClass}
              >
                <Icon src="/assets/figma/mcp/svg/iconly-curved-logout.svg" />
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              search={{ redirect: "/", expired: false }}
              className={actionClass}
            >
              <Icon src="/assets/figma/mcp/svg/iconly-curved-logout.svg" />
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
