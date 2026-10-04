import { Input, Select } from '@/components'
import type { Network } from '@/contracts'

interface CheckoutCustomerFieldsProps {
  nameValue: string
  onNameChange: (value: string) => void
  network: Network
  onNetworkChange: (value: Network) => void
  walletAddressValue: string
  onWalletAddressChange: (value: string) => void
  walletOptions: Array<{ value: string; label: string }>
  selectedWalletId: string
  onWalletChange: (value: string) => void
  emailValue: string
  onEmailChange: (value: string) => void
}

export function CheckoutCustomerFields({
  nameValue,
  onNameChange,
  network,
  onNetworkChange,
  walletAddressValue,
  onWalletAddressChange,
  walletOptions,
  selectedWalletId,
  onWalletChange,
  emailValue,
  onEmailChange,
}: CheckoutCustomerFieldsProps) {
  const handleNetworkChange = (value: string) => {
    if (value === 'ethereum' || value === 'polygon') onNetworkChange(value)
  }

  return (
    <fieldset>
      <legend>Dados do colecionador</legend>
      <div className="checkout-fields">
        <Input label="Nome de exibição" required value={nameValue} onChange={(event) => onNameChange(event.target.value)} />
        <Input label="Nome de usuário" required defaultValue="ana-kurio" />
        <Select label="Rede" required options={[{ value: 'ethereum', label: 'Ethereum' }, { value: 'polygon', label: 'Polygon' }]} value={network} onChange={handleNetworkChange} />
        <Input label="Nome do perfil" required defaultValue="Ana Demo" />
        <Input label="Endereço da carteira" required value={walletAddressValue} onChange={(event) => onWalletAddressChange(event.target.value)} placeholder="Endereço 0x da carteira" />
        <Input label="ENS ou carteira secundária (opcional)" placeholder="ENS ou carteira secundária (opcional)" />
        <Select label="Tipo de carteira" required options={walletOptions} value={selectedWalletId} onChange={onWalletChange} />
        <Input label="Código de indicação" />
        <Input label="E-mail" required type="email" value={emailValue} onChange={(event) => onEmailChange(event.target.value)} />
        <Input label="Nome ENS" placeholder="Nome ENS" />
      </div>
      <label className="checkout-other-wallet"><input type="checkbox" /> Usar outra carteira?</label>
      <label className="checkout-note"><span>Observação do colecionador (opcional)</span><textarea /></label>
    </fieldset>
  )
}
