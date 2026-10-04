import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button, Checkbox, Input, Select } from '@/components'
import type { Wallet } from '@/contracts'
import { parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'

import { AccountShell } from '../account-shell'
import { getWallets, saveWallet } from '../api'

type WalletForm = Omit<Wallet, 'id' | 'userId' | 'primary'> & { extraField: string }
type SaveWalletInput = WalletForm & { id?: string }

const emptyWallet: WalletForm = { name: '', alias: '', address: '', network: 'ethereum', label: '', tag: '', ens: '', extraField: '' }

function getWalletForm(wallet: Wallet): WalletForm {
  return { name: wallet.name, alias: wallet.alias, address: wallet.address, network: wallet.network, label: wallet.label, tag: wallet.tag, ens: wallet.ens, extraField: '' }
}

function getErrorMessage(error: unknown) {
  return parseHttpError(error).message ?? 'Não foi possível salvar a carteira. Confira os dados e tente novamente.'
}

function WalletFields({ form, update, wallets, editingId, onSelect }: { form: WalletForm; update: (field: keyof WalletForm, value: string) => void; wallets: Wallet[]; editingId?: string; onSelect: (id: string) => void }) {
  return <>
    <Input label="Nome da carteira" value={form.name} onChange={(event) => update('name', event.target.value)} required />
    <Input label="Apelido" value={form.alias} onChange={(event) => update('alias', event.target.value)} />
    <Select label="Rede" options={[{ value: 'ethereum', label: 'Ethereum' }, { value: 'polygon', label: 'Polygon' }]} value={form.network} onChange={(value) => update('network', value)} required />
    <Input label="Rótulo da carteira" value={form.label} onChange={(event) => update('label', event.target.value)} />
    <Input label="Endereço 0x da carteira" value={form.address} onChange={(event) => update('address', event.target.value)} required />
    <Input label="ENS ou carteira secundária (opcional)" value={form.ens} onChange={(event) => update('ens', event.target.value)} />
    <Select label="Carteira" options={wallets.map((wallet) => ({ value: wallet.id, label: wallet.name }))} value={editingId ?? ''} onChange={onSelect} placeholder="Selecione uma carteira" />
    <Input label="Tag" value={form.tag} onChange={(event) => update('tag', event.target.value)} />
    <Input label="Campo adicional" value={form.extraField} onChange={(event) => update('extraField', event.target.value)} />
    <Select label="ENS" options={[{ value: '', label: 'Selecione um ENS' }, { value: 'ana.kurio.eth', label: 'ana.kurio.eth' }, { value: 'nova.kurio.eth', label: 'nova.kurio.eth' }]} value={form.ens} onChange={(value) => update('ens', value)} />
  </>
}

export function WalletsPage() {
  const client = useQueryClient()
  const wallets = useQuery({ queryKey: keys.wallets, queryFn: ({ signal }) => getWallets(signal) })
  const [primaryForm, setPrimaryForm] = useState(emptyWallet)
  const [secondaryForm, setSecondaryForm] = useState(emptyWallet)
  const [editingPrimaryId, setEditingPrimaryId] = useState<string | undefined>()
  const [editingSecondaryId, setEditingSecondaryId] = useState<string | undefined>()
  const [sameAsPrimary, setSameAsPrimary] = useState(false)
  const [showSecondaryForm, setShowSecondaryForm] = useState(false)
  const mutation = useMutation({
    mutationFn: (input: SaveWalletInput) => saveWallet(input),
    onSuccess: () => { void client.invalidateQueries({ queryKey: keys.wallets }) },
  })
  const walletItems = wallets.data?.items ?? []
  const primary = walletItems.find((wallet) => wallet.primary)
  const secondaryItems = walletItems.filter((wallet) => !wallet.primary)
  const updatePrimary = (field: keyof WalletForm, value: string) => setPrimaryForm((current) => ({ ...current, [field]: value }))
  const updateSecondary = (field: keyof WalletForm, value: string) => setSecondaryForm((current) => ({ ...current, [field]: value }))
  const selectPrimary = (id: string) => {
    const wallet = walletItems.find((candidate) => candidate.id === id && candidate.primary)
    if (wallet) { setEditingPrimaryId(wallet.id); setPrimaryForm(getWalletForm(wallet)) }
  }
  const selectSecondary = (id: string) => {
    const wallet = walletItems.find((candidate) => candidate.id === id && !candidate.primary)
    if (wallet) { setEditingSecondaryId(wallet.id); setSecondaryForm(getWalletForm(wallet)); setSameAsPrimary(false) }
  }
  const copyPrimary = (checked: boolean) => {
    setSameAsPrimary(checked)
    if (checked) setShowSecondaryForm(true)
    if (checked) setSecondaryForm(primary ? getWalletForm(primary) : primaryForm)
  }
  if (wallets.isPending) return <section className="account-page"><div className="checkout-skeleton" role="status" aria-label="Carregando carteiras" /></section>
  if (wallets.isError) return <section className="account-page" role="alert"><h1>Não foi possível carregar suas carteiras</h1><Button onClick={() => void wallets.refetch()}>Tentar novamente</Button></section>
  return <AccountShell>
    <h2>Carteiras</h2>
    <section className="wallet-section">
      <div className="wallet-section-heading"><div><h3>Carteira principal</h3><p>Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.</p></div><Button variant="link" type="button" onClick={() => { setPrimaryForm(emptyWallet); setEditingPrimaryId(undefined) }}>Adicionar</Button></div>
      <form className="wallet-form" onSubmit={(event) => { event.preventDefault(); mutation.mutate({ ...primaryForm, id: editingPrimaryId }) }}>
        <WalletFields form={primaryForm} update={updatePrimary} wallets={walletItems.filter((wallet) => wallet.primary)} editingId={editingPrimaryId} onSelect={selectPrimary} />
        <Button type="submit" loading={mutation.isPending}>Salvar carteira</Button>
      </form>
      {mutation.isError && <p className="checkout-error" role="alert">{getErrorMessage(mutation.error)}</p>}
    </section>
    <section className="wallet-secondary">
      <div className="wallet-section-heading"><div><h3>Carteira secundária</h3></div><Button variant="link" type="button" onClick={() => { setSecondaryForm(emptyWallet); setEditingSecondaryId(undefined); setSameAsPrimary(false); setShowSecondaryForm(true) }}>Adicionar</Button></div>
      <Checkbox label="Igual à carteira principal" checked={sameAsPrimary} onChange={(event) => copyPrimary(event.target.checked)} />
      {secondaryItems.length > 0 && !showSecondaryForm ? <div><p>{secondaryItems.length} carteira(s) secundária(s) cadastrada(s).</p><Button variant="link" type="button" onClick={() => { const wallet = secondaryItems[0]; setEditingSecondaryId(wallet.id); setSecondaryForm(getWalletForm(wallet)); setShowSecondaryForm(true) }}>Editar carteira</Button></div> : !showSecondaryForm ? <p>Você ainda não adicionou uma carteira secundária.</p> : <form className="wallet-form" onSubmit={(event) => { event.preventDefault(); mutation.mutate({ ...secondaryForm, id: editingSecondaryId }) }}>
        <WalletFields form={secondaryForm} update={updateSecondary} wallets={secondaryItems} editingId={editingSecondaryId} onSelect={selectSecondary} />
        <Button type="submit" loading={mutation.isPending}>Salvar carteira</Button>
      </form>}
    </section>
  </AccountShell>
}
