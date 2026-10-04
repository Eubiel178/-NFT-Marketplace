import { Link } from "@tanstack/react-router";

import { Image } from "@/components";
import type { Nft } from "@/contracts";

export interface FeaturedProps {
  nft: Nft;
}

export function Featured({ nft }: FeaturedProps) {
  return (
    <article className="relative flex h-117.5 flex-col overflow-hidden bg-(image:--gradient-featured-banner)">
      <p className="mt-6.5 ml-5 text-heading-24-bold leading-30 text-primary">
        NFT EM DESTAQUE
      </p>

      <p className="mt-2 text-center text-title-20-bold leading-24">
        OFERTA LIMITADA
      </p>

      <Link
        to="/nfts/$nftId"
        params={{ nftId: nft.id }}
        aria-label={`Ver destaque ${nft.name}`}
        className="relative mt-auto block"
      >
        <Image
          src={nft.image}
          alt={nft.name}
          width={310}
          height={366}
          className="h-91.5 w-full rounded-22 object-cover"
        />
      </Link>
      <Image
        src="/assets/figma/featured-green-ring.svg"
        alt=""
        width={22}
        height={22}
        aria-hidden="true"
        className="absolute top-17.5 right-3"
      />
      <Image
        src="/assets/figma/featured-glow.svg"
        alt=""
        width={45}
        height={45}
        aria-hidden="true"
        className="absolute top-7.5 right-9"
      />
      <Image
        src="/assets/figma/featured-dot.svg"
        alt=""
        width={15}
        height={15}
        aria-hidden="true"
        className="absolute top-29 right-17.5"
      />
    </article>
  );
}
