type CheckoutPaymentMethod = 'walletconnect' | 'metamask' | 'coinbase'

interface CheckoutPaymentMethodsProps {
  paymentMethod: CheckoutPaymentMethod
  onPaymentMethodChange: (method: CheckoutPaymentMethod) => void
}

export function CheckoutPaymentMethods({ paymentMethod, onPaymentMethodChange }: CheckoutPaymentMethodsProps) {
  return (
    <div className="checkout-payment-methods">
      <h3>Carteira e rede</h3>
      <div>
        <button type="button" className={paymentMethod === 'walletconnect' ? 'is-selected' : undefined} aria-pressed={paymentMethod === 'walletconnect'} onClick={() => onPaymentMethodChange('walletconnect')}>W<br /><small>WalletConnect</small></button>
        <button type="button" className={paymentMethod === 'metamask' ? 'is-selected' : undefined} aria-pressed={paymentMethod === 'metamask'} onClick={() => onPaymentMethodChange('metamask')}>M<br /><small>MetaMask</small></button>
        <button type="button" className={paymentMethod === 'coinbase' ? 'is-selected' : undefined} aria-pressed={paymentMethod === 'coinbase'} onClick={() => onPaymentMethodChange('coinbase')}>◈<br /><small>Coinbase Wallet</small></button>
      </div>
    </div>
  )
}

export type { CheckoutPaymentMethod }
