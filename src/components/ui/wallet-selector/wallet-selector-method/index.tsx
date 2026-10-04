import type { ChangeEventHandler, ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface WalletSelectorMethodProps extends Omit<
  ComponentProps<"label">,
  "children" | "onChange"
> {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  icon?: ReactNode;
}

export function WalletSelectorMethod({
  checked = false,
  className,
  icon,
  label,
  name,
  onChange,
  value,
  ...props
}: WalletSelectorMethodProps) {
  return (
    <label
      className={cn(
        "relative flex min-h-16.25 min-w-0 cursor-pointer items-center gap-3 rounded-15 border border-border bg-surface-card px-4 py-3 text-foreground",
        checked && "shadow-coinbase-selected",
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
        className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-body-14 font-bold text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-primary"
        aria-hidden="true"
      >
        {icon ?? label.slice(0, 1)}
      </span>
      <span>{label}</span>
    </label>
  );
}
