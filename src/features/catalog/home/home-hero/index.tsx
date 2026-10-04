import type { Nft } from "@/contracts";
import { useMediaQuery } from "@/shared/hooks/use-media-query";

import { Desktop } from "./desktop";
import { Mobile } from "./mobile";

export interface HeroProps {
  artwork: Nft;
}

// Mobile e desktop têm textos e composição diferentes no Figma: só um vai para o DOM.
export function Hero({ artwork }: HeroProps) {
  const isDesktop = useMediaQuery("(width >= 40rem)");
  return isDesktop ? (
    <Desktop artwork={artwork} />
  ) : (
    <Mobile artwork={artwork} />
  );
}
