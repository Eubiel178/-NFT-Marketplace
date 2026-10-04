import type { ReactNode } from "react";

import { Skeleton } from "../../ui/skeleton";

export function AuthMarketplaceBackground({ children }: { children: ReactNode }) {
  return (
    <div className="auth-marketplace-background" aria-hidden="true" inert>
      <div className="home-page home-loading">
        {children}
        <div className="home-loading-products">
          <Skeleton className="h-[470px] w-full" />
        </div>
      </div>
    </div>
  );
}
