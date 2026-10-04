import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";

import { Icon } from "@/components";
import { cn } from "@/lib/utils";
import { sessionOptions } from "@/shared/api/session";
import { useCartCount } from "@/shared/hooks/use-cart-count";
import { useLogout } from "@/shared/hooks/use-logout";

import { Avatar } from "../../ui/avatar";

const actionClass =
  "flex h-8.75 w-25 flex-row items-center justify-center gap-2.5 rounded-6 bg-primary font-mono text-base font-medium leading-normal text-ink";

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
  const [selectedNavigation, setSelectedNavigation] = useState<{
    label: string;
    pathname: string;
  }>();
  const user = useQuery(sessionOptions).data?.user;
  const cartCount = useCartCount();
  const logout = useLogout();

  return (
    <header className="hidden lg:flex lg:justify-center">
      <div className="flex h-11.25 max-w-content items-center justify-between border-b border-primary/25 w-full pt-6">
        <Link
          to="/"
          className="font-mono text-sm font-bold leading-normal tracking-wide text-foreground"
          aria-label="Kurio, início"
        >
          KURIO
        </Link>

        <nav
          aria-label="Principal"
          className="flex flex-1 justify-center self-stretch"
        >
          <ul className="flex h-full gap-10">
            {navigation.map((item) => {
              const active =
                selectedNavigation?.pathname === pathname
                  ? selectedNavigation.label === item.label
                  : item.match(pathname);
              return (
                <li key={item.label} className="flex">
                  <Link
                    to={item.to}
                    onClick={() =>
                      setSelectedNavigation({ label: item.label, pathname })
                    }
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-full items-center font-mono text-base leading-normal hover:text-text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5",
                      active
                        ? "font-bold text-text-accent after:bg-primary"
                        : "font-normal text-foreground after:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            aria-label="Buscar NFTs"
            className="flex size-5 items-center justify-center text-foreground"
          >
            <Icon
              src="/assets/figma/mcp/svg/search.svg"
              className="size-full"
            />
          </Link>

          <Link
            to="/cart"
            aria-label={`Carrinho, ${cartCount} itens`}
            className="relative flex size-6 items-center justify-center text-foreground"
          >
            <Icon
              src="/assets/figma/mcp/svg/shopping.svg"
              className="size-full"
            />
            <span
              className="absolute top-1.25 -right-1 grid size-4 place-items-center rounded-full border-2 border-ink bg-primary text-tiny-9 font-bold leading-auto text-ink"
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
