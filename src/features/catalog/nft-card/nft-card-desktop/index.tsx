import { NftCardView } from '../nft-card-view'

import type { NftCardProps } from '../nft-card-types'

export function NftCardDesktop(props: NftCardProps) {
  return <NftCardView {...props} variant="desktop" />
}
