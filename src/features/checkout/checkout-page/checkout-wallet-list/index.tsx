import type { RefObject } from 'react'

import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'

import type { Wallet } from '@/contracts'

interface CheckoutWalletListProps {
  wallets: Wallet[]
  selectedWalletId: string
  onWalletChange: (walletId: string) => void
  walletsRef: RefObject<HTMLFieldSetElement | null>
}

export function CheckoutWalletList({ wallets, selectedWalletId, onWalletChange, walletsRef }: CheckoutWalletListProps) {
  return (
    <fieldset ref={walletsRef} className="checkout-wallets">
      <legend>Carteiras cadastradas</legend>
      {wallets.length === 0 ? (
        <p className="checkout-error" role="status">Você ainda não cadastrou uma carteira. <Link to="/wallets">Cadastrar carteira</Link></p>
      ) : wallets.map((wallet) => (
        <label className={wallet.id === selectedWalletId ? 'checkout-wallet is-selected' : 'checkout-wallet'} key={wallet.id}>
          <input type="radio" name="wallet" value={wallet.id} checked={wallet.id === selectedWalletId} onChange={() => onWalletChange(wallet.id)} />
          <span><strong>{wallet.name}</strong><small>{wallet.ens || wallet.address}<br />{wallet.label}</small></span>
          {wallet.id === selectedWalletId && <Check aria-hidden="true" />}
        </label>
      ))}
    </fieldset>
  )
}
