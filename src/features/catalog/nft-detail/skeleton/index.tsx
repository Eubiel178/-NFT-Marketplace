import { Skeleton as Block } from '@/components'

// Mesmas caixas do conteúdo final, para não haver salto de layout quando os dados chegam.
export function Skeleton({ mobile }: { mobile: boolean }) {
  if (mobile) {
    return (
      <div role="status" aria-label="Carregando NFT" className="-m-6 flex flex-col gap-4 bg-surface-card px-7 pt-6 pb-48">
        <div className="flex justify-between"><Block className="size-8.75 rounded-full" /><Block className="size-8.75 rounded-full" /></div>
        <Block className="aspect-square w-full rounded-t-24" />
        <Block className="h-6 w-3/4" />
        <Block className="h-18 w-full" />
        <Block className="h-7 w-2/3" />
      </div>
    )
  }
  return (
    <div role="status" aria-label="Carregando NFT" className="flex flex-col pt-2.5">
      <Block className="h-4 w-36" />
      <div className="mt-3 flex flex-col gap-8 lg:flex-row lg:gap-8.25">
        <div className="flex shrink-0 gap-7">
          <div className="flex flex-col gap-4">{Array.from({ length: 4 }, (_, index) => <Block key={index} className="size-25 rounded-8" />)}</div>
          <Block className="mt-0.5 size-111" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Block className="h-8 w-3/4" />
          <Block className="h-6 w-full" />
          <Block className="h-24 w-full" />
          <Block className="h-12 w-2/3" />
          <Block className="h-24 w-full" />
        </div>
      </div>
      <Block className="mt-23 h-86.5" />
      <Block className="mt-23.25 mb-0.5 h-101" />
    </div>
  )
}
