import { useQuery } from '@tanstack/react-query'

import { keys } from '@/lib/query'
import { useSessionUserId } from '@/shared/api/session'

import { getProfile } from '../../api'

export function useProfile() {
  const userId = useSessionUserId()
  return useQuery({ queryKey: keys.profile(userId), queryFn: ({ signal }) => getProfile(signal), enabled: Boolean(userId) })
}
