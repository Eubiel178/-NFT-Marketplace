import { Link } from '@tanstack/react-router'
import { EllipsisVertical } from 'lucide-react'

import { WalletSelector } from '@/components'
import type { Wallet } from '@/contracts'

export interface WalletCardsProps {
  wallets: readonly Wallet[]
  selectedId: string
  onSelect: (wallet: Wallet) => void
}

// Carteiras cadastradas no mobile: rádio à esquerda e menu para gerenciar a carteira.
export function WalletCards({ wallets, selectedId, onSelect }: WalletCardsProps) {
  return (
    <WalletSelector.Root id="checkout-wallets" aria-label="Carteiras cadastradas" className="gap-5">
      {wallets.map((wallet) => (
        <div key={wallet.id} className="relative">
          <WalletSelector.WalletCard
            name="checkout-wallet"
            value={wallet.id}
            checked={wallet.id === selectedId}
            onChange={() => onSelect(wallet)}
            icon={wallet.id === selectedId ? <span className="size-2 rounded-full bg-primary" /> : <span />}
            className="min-h-23.25 items-start rounded-14 pt-4 pr-12 pl-4.5 shadow-none has-checked:[&>span:nth-of-type(1)]:border-primary"
          >
            <strong className="text-body-15-bold">{wallet.name}</strong>
            <span className="text-caption-13 leading-20 text-text-secondary">{wallet.ens || wallet.address}</span>
            <span className="-mt-1 text-caption-13 leading-20 text-text-secondary">{wallet.label}</span>
          </WalletSelector.WalletCard>
          <Link to="/wallets" aria-label={`Gerenciar ${wallet.name}`} className="absolute top-8.5 right-4 grid size-6 place-items-center text-text-accent">
            <EllipsisVertical aria-hidden="true" className="size-4" />
          </Link>
        </div>
      ))}
    </WalletSelector.Root>
  )
}
