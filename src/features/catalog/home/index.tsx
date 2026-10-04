import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Button, Sheet } from "@/components";
import { useMediaQuery } from "@/shared/hooks/use-media-query";

import { catalogOptions } from "../api";
import { useCatalogSearch } from "../hooks/use-catalog-search";
import { pageCountOf } from "../lib/catalog-search";
import { Blog } from "./home-blog";
import { Catalog } from "./home-catalog";
import { Filters } from "./home-catalog/filters";
import { Hero } from "./home-hero";
import { Loading } from "./home-loading";
import { Promos } from "./home-promos";
import { SearchBar } from "./home-search-bar";

export function HomePage() {
  const { search, updateSearch, updateQuery } = useCatalogSearch();
  const catalog = useQuery(catalogOptions(search));
  // Abaixo de lg os filtros viram drawer: só uma das duas versões fica no DOM.
  const hasSidebar = useMediaQuery("(width >= 64rem)");
  const [filtersOpen, setFiltersOpen] = useState(false);

  if (catalog.isPending) return <Loading />;

  if (catalog.isError) {
    return (
      <section role="alert">
        <h1 className="text-heading-28-bold">
          Não foi possível carregar a Home
        </h1>
        <p className="mt-4 text-body-14-regular">
          Tente novamente para carregar os destaques e o catálogo.
        </p>
        <Button className="mt-6" onClick={() => void catalog.refetch()}>
          Tentar novamente
        </Button>
      </section>
    );
  }

  const { items, facets, total, pageSize } = catalog.data;
  if (items.length === 0) {
    return (
      <section role="status">
        <h1 className="text-heading-28-bold">Nenhum NFT encontrado</h1>
        <p className="mt-4 text-body-14-regular">
          Ajuste sua busca ou remova os filtros para explorar o catálogo.
        </p>
      </section>
    );
  }

  const pageCount = pageCountOf(total, pageSize);
  const mobileFilters = (
    <Filters
      key={`${search.priceMin}-${search.priceMax}`}
      facets={facets}
      search={search}
      onChange={updateSearch}
    />
  );

  return (
    <section
      aria-labelledby="home-page-title"
      className="flex flex-col gap-4 sm:gap-24"
    >
      <h2 id="home-page-title" className="sr-only">
        Marketplace de NFTs
      </h2>

      {!hasSidebar && (
        <SearchBar
          defaultValue={search.q}
          onSearch={updateQuery}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      )}

      <Hero artwork={items[0]} />

      <Catalog
        items={items}
        search={search}
        pageCount={pageCount}
        total={total}
        isFetching={catalog.isFetching}
        facets={facets}
        featuredNft={items[1] ?? items[0]}
        showSidebar={hasSidebar}
        onUpdateSearch={updateSearch}
      />

      <Promos />

      <Blog />
      {!hasSidebar && (
        <Sheet
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          title="Filtros"
          description="Refine a visualização do catálogo."
        >
          {mobileFilters}
        </Sheet>
      )}
      <span className="sr-only">
        Página {search.page} de {pageCount}
      </span>
    </section>
  );
}
