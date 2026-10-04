import { useEffect, useState } from "react";

import { Outlet, useLocation } from "@tanstack/react-router";

import {
  DesktopLayout,
  MarketplaceFooter,
  MobileLayout,
  RealtimeConnectionStatus,
  TabBar,
  useLayoutMode,
} from "@/components";
import { AuthMarketplaceBackground } from "@/features/auth/auth-marketplace-background";
import { connectCatalog } from "@/lib/realtime";

export { PendingFeature } from "./pending-feature";

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
  useEffect(() => connectCatalog(setConnected), []);

  const content = (
    <>
      {isAuthRoute && <AuthMarketplaceBackground />}
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
        <DesktopLayout footer={<MarketplaceFooter />}>{content}</DesktopLayout>
      ) : (
        <MobileLayout tabBar={hideMobileTabBar ? undefined : <TabBar />}>
          {content}
        </MobileLayout>
      )}
      <RealtimeConnectionStatus connected={connected} />
    </>
  );
}
