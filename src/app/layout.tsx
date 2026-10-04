import { Outlet, useLocation, useMatches } from "@tanstack/react-router";

import { Footer, Header, TabBar } from "@/components";
import { AuthMarketplaceBackground } from "@/features/auth/auth-marketplace-background";
import { cn } from "@/lib/utils";

export { PendingFeature } from "./pending-feature";

export function Layout() {
  const location = useLocation();

  const hideMobileTabBar = useMatches({
    select: (matches) => matches.some((match) => match.staticData.hideTabBar),
  });
  const hideChrome = useMatches({
    select: (matches) => matches.some((match) => match.staticData.hideChrome),
  });
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen w-full max-sm:overflow-x-clip max-sm:rounded-t-40">
      <a
        href="#main"
        className="sr-only z-[60] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-6 focus:bg-surface-card focus:p-4"
      >
        Pular para o conteúdo
      </a>

      {!hideChrome && <Header />}

      <main
        id="main"
        tabIndex={-1}
        className={cn(
          "mx-auto min-h-[60vh] w-full max-w-[calc(var(--container-content)+6rem)] px-6 pt-6 pb-[calc(8rem+env(safe-area-inset-bottom,0px))] md:px-12 lg:pb-24",
          hideMobileTabBar && "max-lg:pb-8",
        )}
      >
        {isAuthRoute && <AuthMarketplaceBackground />}
        <Outlet />
      </main>

      {!hideChrome && <Footer />}

      {!hideMobileTabBar && <TabBar />}
    </div>
  );
}
