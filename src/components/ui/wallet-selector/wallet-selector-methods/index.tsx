import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function WalletSelectorMethods({
  className,
  children,
  ...props
}: ComponentProps<"fieldset">) {
  return (
    <fieldset className={cn("m-0 grid min-w-0 gap-4 border-0 p-0 sm:grid-cols-3", className)} {...props}>
      {children}
    </fieldset>
  );
}
