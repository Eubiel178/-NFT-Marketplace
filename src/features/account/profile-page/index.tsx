import { AccountLoadError } from '../account-load-error'
import { AccountShell } from '../account-shell'
import { useProfile } from '../hooks/use-profile'

import { ProfileForm } from './profile-form'
import { ProfileSkeleton } from './profile-skeleton'

export function ProfilePage() {
  const profile = useProfile()

  return (
    <AccountShell>
      {profile.data ? (
        <ProfileForm key={profile.data.userId} profile={profile.data} />
      ) : profile.isError ? (
        <AccountLoadError title="Não foi possível carregar o perfil" onRetry={() => void profile.refetch()} />
      ) : (
        <ProfileSkeleton />
      )}
    </AccountShell>
  )
}
