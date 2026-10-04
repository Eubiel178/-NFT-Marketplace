import type { ChangeEventHandler, ComponentProps, ReactNode } from "react";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface WalletSelectorWalletCardProps extends Omit<
  ComponentProps<"label">,
  "children" | "onChange"
> {
  children: ReactNode;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  icon?: ReactNode;
}

export function WalletSelectorWalletCard({
  checked = false,
  children,
  className,
  icon,
  name,
  onChange,
  value,
  ...props
}: WalletSelectorWalletCardProps) {
  return (
    <label
      className={cn(
        "relative flex min-h-23.25 min-w-0 cursor-pointer items-center gap-3 rounded-14 border border-border bg-surface-card px-4 py-3.75 text-foreground",
        checked && "shadow-wallet-selected",
        className,
      )}
      {...props}
    >
      <input
        className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span
        className="grid size-4 shrink-0 place-items-center rounded-full border border-border-soft text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-primary [&_svg]:size-3"
        aria-hidden="true"
      >
        {icon ?? (checked ? <Check /> : null)}
      </span>
      <span className="grid min-w-0 flex-1 gap-1">{children}</span>
    </label>
  );
}
