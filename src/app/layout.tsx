import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Outlet, useLocation } from "@tanstack/react-router";

import {
  AuthMarketplaceBackground,
  DesktopLayout,
  MarketplaceFooter,
  MarketplaceHeader,
  MobileLayout,
  RealtimeConnectionStatus,
  Skeleton,
  TabBar,
  useLayoutMode,
} from "@/components";
import type { CatalogSearch } from "@/contracts";
import { catalogOptions } from "@/features/catalog/api";
import { HomeHero } from "@/features/catalog/home/home-hero";
import { connectCatalog } from "@/lib/realtime";

const backgroundSearch = {
  q: "",
  category: "all",
  collection: "all",
  network: "all",
  sort: "recent",
  page: 1,
} satisfies CatalogSearch;

export function Layout() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const location = useLocation();
  const layoutMode = useLayoutMode();

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
  const backgroundCatalog = useQuery({
    ...catalogOptions(backgroundSearch),
    enabled: isAuthRoute,
  });
  const backgroundArtwork = backgroundCatalog.data?.items[0];

  useEffect(() => connectCatalog(setConnected), []);

  const content = (
    <>
      {isAuthRoute && (
        <AuthMarketplaceBackground>
          {backgroundArtwork ? (
            <HomeHero artwork={backgroundArtwork} />
          ) : (
            <section className="home-hero-desktop">
              <Skeleton className="home-loading-hero" />
            </section>
          )}
        </AuthMarketplaceBackground>
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
        <DesktopLayout
          header={<MarketplaceHeader />}
          footer={<MarketplaceFooter />}
        >
          {content}
        </DesktopLayout>
      ) : (
        <MobileLayout tabBar={hideMobileTabBar ? undefined : <TabBar />}>
          {content}
        </MobileLayout>
      )}
      <RealtimeConnectionStatus connected={connected} />
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
