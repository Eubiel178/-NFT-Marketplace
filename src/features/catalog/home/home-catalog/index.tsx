import { Button, Icon, Pagination } from "@/components";
import type { CatalogFacets, CatalogSearch, Nft } from "@/contracts";

import { Featured } from "./featured";
import { Filters } from "./filters";
import { Products } from "./products";

export interface CatalogProps {
  items: Nft[];
  search: CatalogSearch;
  pageCount: number;
  total: number;
  isFetching: boolean;
  facets: CatalogFacets;
  featuredNft: Nft;
  showSidebar: boolean;
  onUpdateSearch: (changes: Partial<CatalogSearch>) => void;
}

// Um único grid: duas colunas desencontradas no mobile, três a partir de sm.
export function Catalog({
  items,
  search,
  pageCount,
  total,
  isFetching,
  facets,
  featuredNft,
  showSidebar,
  onUpdateSearch,
}: CatalogProps) {
  return (
    <section
      id="home-products"
      aria-labelledby="home-products-title"
      className="scroll-mt-6"
    >
      <h2 id="home-products-title" className="sr-only">
        Produtos
      </h2>

      <div className="lg:flex lg:items-start lg:gap-12">
        {showSidebar && (
          <div className="flex w-77.5 shrink-0 flex-col gap-6">
            <Filters
              key={`${search.priceMin}-${search.priceMax}`}
              facets={facets}
              search={search}
              onChange={onUpdateSearch}
            />
            <Featured nft={featuredNft} />
          </div>
        )}

        <Products
          items={items}
          search={search}
          total={total}
          isFetching={isFetching}
          onUpdateSearch={onUpdateSearch}
        />
      </div>

      <div className="mt-14.75 flex items-center justify-end gap-2 max-sm:hidden">
        <Pagination
          currentPage={search.page}
          totalPages={pageCount}
          onPageChange={(page) => onUpdateSearch({ page })}
          showFirstLast={false}
          showPrevNext={false}
          maxVisiblePages={4}
        />

        <Button
          variant="secondary"
          onClick={() => onUpdateSearch({ page: search.page + 1 })}
          disabled={search.page >= pageCount}
          aria-label="Próxima página"
          className="min-h-0 size-8.75 rounded-4 p-0"
        >
          <Icon
            src="/assets/figma/mcp/svg/iconly-curved-arrow-right-2.svg"
            className="size-4"
          />
        </Button>
      </div>
    </section>
  );
}
