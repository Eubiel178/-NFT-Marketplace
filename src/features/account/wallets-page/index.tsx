import { AccountLoadError } from '../account-load-error'
import { AccountShell } from '../account-shell'
import { useWallets } from '../hooks/use-wallets'

import { PrimarySection } from './primary-section'
import { SecondarySection } from './secondary-section'
import { WalletsSkeleton } from './wallets-skeleton'

export function WalletsPage() {
  const { query, primary, secondary } = useWallets()

  return (
    <AccountShell>
      <h2 className="sr-only">Carteiras</h2>
      {query.data ? (
        <>
          <PrimarySection primary={primary} />
          <SecondarySection primary={primary} secondary={secondary} />
        </>
      ) : query.isError ? (
        <AccountLoadError title="Não foi possível carregar suas carteiras" onRetry={() => void query.refetch()} />
      ) : (
        <WalletsSkeleton />
      )}
    </AccountShell>
  )
}
