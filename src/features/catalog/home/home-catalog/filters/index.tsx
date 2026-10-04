import { useState } from "react";

import { Button } from "@/components";
import type { CatalogFacets, CatalogSearch } from "@/contracts";

import { formatEthLabel } from "../../../lib/eth-label";
import { Option } from "./option";

export interface FiltersProps {
  facets: CatalogFacets;
  search: CatalogSearch;
  onChange: (changes: Partial<CatalogSearch>) => void;
}

const groupTitle = "mb-3 font-mono text-lg font-bold leading-4 text-foreground";
const rangeInput =
  "pointer-events-none absolute inset-x-0 top-0 h-4 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[1.3125rem] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[0.1875rem] [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[1.3125rem] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[0.1875rem] [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-primary";

// Coleções, rede e faixa de preço vêm dos facets da API; a faixa só é aplicada no "Aplicar".
export function Filters({ facets, search, onChange }: FiltersProps) {
  const [priceMin, setPriceMin] = useState(search.priceMin ?? facets.price.min);
  const [priceMax, setPriceMax] = useState(search.priceMax ?? facets.price.max);

  return (
    <aside
      aria-label="Filtros do catálogo"
      className="flex flex-col bg-surface-card pt-7 pr-5 pb-4.5 pl-5"
    >
      <fieldset>
        <legend className={groupTitle}>Coleções</legend>
        <div className="pr-3 pl-3">
          {facets.collections.map((collection) => (
            <Option
              key={collection.value}
              label={collection.value}
              count={collection.count}
              selected={search.collection === collection.value}
              onToggle={() =>
                onChange({
                  collection:
                    search.collection === collection.value
                      ? "all"
                      : collection.value,
                })
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className={groupTitle}>Faixa de preço</legend>
        <div className="relative mt-0.5 ml-3 h-4 before:absolute before:top-1.75 before:left-0 before:h-1 before:w-full before:bg-primary">
          <input
            aria-label="Preço mínimo"
            type="range"
            min={facets.price.min}
            max={facets.price.max}
            step="0.01"
            value={priceMin}
            onChange={(event) => setPriceMin(event.target.value)}
            className={rangeInput}
          />
          <input
            aria-label="Preço máximo"
            type="range"
            min={facets.price.min}
            max={facets.price.max}
            step="0.01"
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
            className={rangeInput}
          />
        </div>
        <output className="mt-3.5 block pl-3 font-mono text-[0.9375rem] font-normal leading-normal text-foreground">{`Preço: ${formatEthLabel(priceMin)} - ${formatEthLabel(priceMax)} ETH`}</output>
        <Button
          variant="primarySolid"
          size="sm"
          className="mt-3 ml-3 min-h-0 flex items-center rounded-[0.375rem] bg-primary px-3 py-2 font-mono text-base font-bold leading-5 tracking-normal text-ink"
          onClick={() => onChange({ priceMin, priceMax })}
        >
          Aplicar
        </Button>
      </fieldset>

      <fieldset className="mt-9.5">
        <legend className={groupTitle}>Rede</legend>
        <div className="pl-3">
          {facets.networks.map((network) => (
            <Option
              key={network.value}
              label={network.label}
              count={network.count}
              selected={search.network === network.value}
              onToggle={() =>
                onChange({
                  network:
                    search.network === network.value ? "all" : network.value,
                })
              }
            />
          ))}
        </div>
      </fieldset>
    </aside>
  );
}
