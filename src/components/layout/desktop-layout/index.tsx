import type { ReactNode } from "react";

import { Header } from "./header";

export interface DesktopLayoutProps {
  children: ReactNode;
  footer: ReactNode;
}

export function DesktopLayout({ children, footer }: DesktopLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-stretch">
      <Header />

      <main id="main" tabIndex={-1} className="layout-main container-content min-w-0 flex-1">
        {children}
      </main>

      {footer}
    </div>
  );
}
