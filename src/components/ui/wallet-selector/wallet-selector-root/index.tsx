import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function WalletSelectorRoot({
  className,
  children,
  ...props
}: ComponentProps<"fieldset">) {
  return (
    <fieldset className={cn("m-0 grid min-w-0 gap-4 border-0 p-0", className)} {...props}>
      {children}
    </fieldset>
  );
}
