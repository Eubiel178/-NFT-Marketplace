import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

export interface HeaderNavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderNavigationProps {
  items: readonly HeaderNavigationItem[];
  logo?: ReactNode;
  className?: string;
}

export function HeaderNavigation({
  items,
  logo,
  className,
}: HeaderNavigationProps) {
  return (
    <nav aria-label="Principal" className={className}>
      <ul className="flex flex-wrap items-center gap-6">
        {logo && <li>{logo}</li>}

        {items.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            <Link
              to={item.href}
              href={item.href}
              className="relative text-body-15-medium text-text-secondary transition-colors hover:text-foreground focus-visible:text-foreground"
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
              {item.active && (
                <span
                  className="absolute -bottom-3 left-0 h-0.5 w-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
