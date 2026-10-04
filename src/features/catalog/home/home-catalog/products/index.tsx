import type { CatalogSearch, Nft } from "@/contracts";

import { CatalogCard } from "../../../catalog-card";
import { Sort } from "../sort";
import { Tabs } from "../tabs";

export interface ProductsProps {
  items: Nft[];
  search: CatalogSearch;
  total: number;
  isFetching: boolean;
  onUpdateSearch: (changes: Partial<CatalogSearch>) => void;
}

export function Products({
  items,
  search,
  total,
  isFetching,
  onUpdateSearch,
}: ProductsProps) {
  const changeSort = (sort: CatalogSearch["sort"]) => onUpdateSearch({ sort });

  return (
    <div className="min-w-0 flex-1 max-sm:-mt-0.5 lg:pt-0.75">
      <div className="flex items-center justify-between gap-6">
        <Tabs sort={search.sort} onSortChange={changeSort} />

        <div className="max-sm:hidden">
          <Sort sort={search.sort} onSortChange={changeSort} />
        </div>
      </div>

      <p role="status" className="sr-only">
        {isFetching ? "Atualizando catálogo…" : `${total} NFTs encontrados`}
      </p>

      <ul
        aria-label="NFTs do catálogo"
        className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 pb-8 sm:mt-7 sm:grid-cols-3 sm:gap-x-8.5 sm:gap-y-[4.5625rem] sm:pb-0"
      >
        {items.map((nft, index) => (
          <li key={nft.id} className="max-sm:even:translate-y-8">
            <CatalogCard nft={nft} priority={index < 3} />
          </li>
        ))}
      </ul>
    </div>
  );
}
