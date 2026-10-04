import { Link } from "@tanstack/react-router";

import { Button, Image } from "@/components";
import type { Nft } from "@/contracts";

import { Dots } from "../dots";

export function Desktop({ artwork }: { artwork: Nft }) {
  return (
    <section
      className="mt-2 -mb-2 flex w-full justify-center"
      aria-labelledby="home-hero-title"
    >
      <div className="flex w-full max-w-content items-center justify-between gap-5">
        <div className="flex w-full max-w-[37.5rem] flex-col pl-10">
          <p className="mb-2 font-mono text-sm font-medium leading-4 tracking-wide text-foreground">
            Bem-vindo à Kurio
          </p>

          <h1
            id="home-hero-title"
            className="mb-1 font-mono text-display-43 font-bold leading-70 text-foreground"
          >
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </h1>

          <p className="mb-8 font-mono text-sm font-normal leading-6 text-text-secondary">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </p>

          <Button
            asChild
            variant="primarySolid"
            size="sm"
            className="h-10 w-35 items-center justify-center gap-2.5 rounded-[0.375rem] bg-primary py-2.5 pr-9 pl-7"
          >
            <a href="#home-products">EXPLORAR</a>
          </Button>

          <Dots className="mt-11 -mr-10 self-end" />
        </div>

        <Link
          to="/nfts/$nftId"
          params={{ nftId: artwork.id }}
          aria-label={`Ver ${artwork.name}`}
          className="w-fit shrink-0 overflow-hidden"
        >
          <Image
            src={artwork.image}
            alt={artwork.name}
            width={450}
            height={450}
            priority
            className="block aspect-square w-full max-w-[28.125rem] rounded-[1.5rem] object-cover"
          />
        </Link>
      </div>
    </section>
  );
}
