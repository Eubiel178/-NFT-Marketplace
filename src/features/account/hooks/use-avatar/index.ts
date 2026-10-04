import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Profile } from '@/contracts'
import { parseHttpError } from '@/lib/http'
import { keys } from '@/lib/query'
import { useSessionUserId } from '@/shared/api/session'

import { removeAvatar, uploadAvatar } from '../../api'

// Upload simulado pelo MSW e remoção. Carregando e erro (de validação ou de rede) ficam disponíveis para a tela.
export function useAvatar() {
  const client = useQueryClient()
  const userId = useSessionUserId()
  const onSuccess = (next: Profile) => client.setQueryData(keys.profile(userId), next)

  const upload = useMutation({ mutationFn: uploadAvatar, onSuccess })
  const remove = useMutation({ mutationFn: removeAvatar, onSuccess })
  const failure = upload.error ?? remove.error
  const details = failure ? parseHttpError(failure) : null

  return {
    pending: upload.isPending || remove.isPending,
    uploading: upload.isPending,
    error: details ? (details.fields?.avatar ?? details.message ?? 'Não foi possível atualizar o avatar. Tente novamente.') : '',
    upload: (file: File) => {
      remove.reset()
      upload.mutate(file)
    },
    remove: () => {
      upload.reset()
      remove.mutate()
    },
  }
}
