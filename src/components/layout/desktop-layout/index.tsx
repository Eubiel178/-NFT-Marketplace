import type { ReactNode } from "react";

export interface DesktopLayoutProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}

export function DesktopLayout({
  children,
  header,
  footer,
}: DesktopLayoutProps) {
  return (
    <div className="desktop-layout">
      {header}

      <main id="main" tabIndex={-1} className="layout-main container-content">
        {children}
      </main>
      {footer}
    </div>
  );
}
