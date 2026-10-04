import type { ReactNode } from "react";

import { Header } from "./header";

export interface DesktopLayoutProps {
  children: ReactNode;
  footer: ReactNode;
}

export function DesktopLayout({ children, footer }: DesktopLayoutProps) {
  return (
    <div className="flex flex-col items-stretch min-h-screen w-full max-w-[62.5vw]">
      <Header />

      <main tabIndex={-1} className="layout-main container-content">
        {children}
      </main>

      {footer}
    </div>
  );
}
