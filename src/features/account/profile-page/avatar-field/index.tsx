import { useId, useRef, type ChangeEvent } from 'react'

import { ImageIcon } from 'lucide-react'

import { Button, Image } from '@/components'
import { cn } from '@/lib/utils'

import { useAvatar } from '../../hooks/use-avatar'

export interface AvatarFieldProps {
  avatar: string | null
  className?: string
}

export function AvatarField({ avatar, className }: AvatarFieldProps) {
  const labelId = useId()
  const errorId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const { pending, uploading, error, notice, upload, remove } = useAvatar(Boolean(avatar))

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Permite escolher o mesmo arquivo de novo depois de um erro.
    event.target.value = ''
    if (file) upload(file)
  }

  return (
    <div role="group" aria-labelledby={labelId} aria-busy={uploading} className={cn('flex flex-col', className)}>
      <span id={labelId} className="mb-2.5 text-body-15 leading-16">Avatar</span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className={cn('grid size-12.5 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-raised text-primary', uploading && 'opacity-60 motion-safe:animate-pulse')}>
          {avatar ? <Image src={avatar} alt="Avatar do perfil" width={50} height={50} className="size-full object-cover" /> : <ImageIcon className="size-5" aria-hidden="true" />}
        </div>
        <input ref={fileInput} type="file" accept="image/*" className="sr-only" aria-label="Selecionar avatar" onChange={handleChange} />
        <div className="flex items-center gap-5">
          <Button
            type="button"
            variant="primarySolid"
            size="sm"
            className="min-w-24.5 rounded-none font-bold tracking-normal"
            onClick={() => fileInput.current?.click()}
            loading={uploading}
            disabled={pending}
            aria-describedby={error ? errorId : undefined}
          >
            Alterar
          </Button>
          <Button type="button" variant="ghost" size="sm" className="px-0 text-foreground hover:bg-transparent hover:underline" onClick={remove} disabled={pending}>
            Remover
          </Button>
        </div>
      </div>
      <p role="status" className={cn('text-caption-12 text-text-secondary', !notice && 'sr-only', notice && 'mt-2')}>{uploading ? 'Enviando avatar…' : notice}</p>
      {error && <p id={errorId} role="alert" className="mt-2 text-caption-12 text-error">{error}</p>}
    </div>
  )
}
