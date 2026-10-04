import { useState } from 'react'

import type { Wallet } from '@/contracts'

import { emptyWalletForm, toWalletForm, type WalletForm } from '../../lib/wallet-form'

type Editor = { mode: 'closed' } | { mode: 'new'; copy: boolean } | { mode: 'edit'; wallet: Wallet }

// Qual formulário da carteira secundária está aberto e com quais valores iniciais.
export function useSecondaryEditor(primary: Wallet | undefined) {
  const [editor, setEditor] = useState<Editor>({ mode: 'closed' })

  const initial: WalletForm =
    editor.mode === 'edit' ? toWalletForm(editor.wallet) : editor.mode === 'new' && editor.copy && primary ? toWalletForm(primary) : emptyWalletForm

  return {
    open: editor.mode !== 'closed',
    editingId: editor.mode === 'edit' ? editor.wallet.id : undefined,
    sameAsPrimary: editor.mode === 'new' && editor.copy,
    // Muda a cada abertura: o formulário remonta com os valores iniciais novos.
    formKey: editor.mode === 'edit' ? `edit-${editor.wallet.id}` : editor.mode === 'new' ? `new-${editor.copy}` : 'closed',
    initial,
    add: () => setEditor({ mode: 'new', copy: false }),
    edit: (wallet: Wallet) => setEditor({ mode: 'edit', wallet }),
    copyPrimary: (checked: boolean) => setEditor(checked ? { mode: 'new', copy: true } : { mode: 'new', copy: false }),
    close: () => setEditor({ mode: 'closed' }),
  }
}
