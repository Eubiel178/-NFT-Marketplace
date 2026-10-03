import { useEffect, useState } from "react";

import { Link, Outlet, useLocation } from "@tanstack/react-router";

import {
  DesktopLayout,
  Footer,
  Header,
  Image,
  MobileLayout,
  TabBar,
  useLayoutMode,
} from "@/components";
import { HomePage } from "@/features/catalog/home/home-page";
import { connectCatalog } from "@/lib/realtime";

export function Layout() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const location = useLocation();
  const layoutMode = useLayoutMode();

  useEffect(() => connectCatalog(setConnected), []);

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
  const hideMobileTabBar =
    [
      "/cart",
      "/checkout",
      "/login",
      "/register",
      "/profile",
      "/wallets",
      "/orders",
    ].some((path) => location.pathname.startsWith(path)) ||
    location.pathname.startsWith("/nfts/");
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  const desktopHeader = (
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

  const desktopFooter = (
    <Footer.Root className="marketplace-footer">
      <Footer.FeatureRow />
      <Footer.ContactRow />
      <Footer.LinksRow />
      <p className="marketplace-footer-copyright">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </Footer.Root>
  );
  const content = (
    <>
      {isAuthRoute && (
        <div className="auth-marketplace-background" aria-hidden="true" inert>
          <HomePage />
        </div>
      )}
      <Outlet />
    </>
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-surface-card focus:p-4"
      >
        Pular para o conteúdo
      </a>
      {layoutMode === "desktop" ? (
        <DesktopLayout header={desktopHeader} footer={desktopFooter}>
          {content}
        </DesktopLayout>
      ) : (
        <MobileLayout tabBar={hideMobileTabBar ? undefined : <TabBar />}>
          {content}
        </MobileLayout>
      )}
      {connected === false && (
        <p
          className={
            location.pathname.startsWith("/nfts/")
              ? "mobile-connection-status detail-connection-status"
              : "mobile-connection-status"
          }
          role="status"
        >
          Atualizações em tempo real desconectadas
        </p>
      )}
    </>
  );
}

export function PendingFeature({ name }: { name: string }) {
  return (
    <section>
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="mt-4">
        Rota preparada. Este fluxo ainda não foi implementado.
      </p>
    </section>
  );
}
