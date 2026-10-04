import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function WalletSelectorRoot({
  className,
  children,
  ...props
}: ComponentProps<"fieldset">) {
  return (
    <fieldset className={cn("wallet-selector-root", className)} {...props}>
      {children}
    </fieldset>
  );
}
