import { HomePromoCard } from '../../home-promo-card'

export function HomePromos() {
  return (
    <section className="home-promos" aria-labelledby="home-promos-title">
      <h2 id="home-promos-title" className="sr-only">Explore mais</h2>
      <div className="home-promos-grid">
        <HomePromoCard title="Lançamentos gênesis de edição limitada" description="Colecione edições escassas diretamente dos criadores antes da revelação pública." image="/assets/figma/home-hero.png" imageAlt="Arte de lançamento gênesis" maskSrc="/assets/figma/promo-genesis-mask.svg" />
        <HomePromoCard title="Arte digital selecionada e muito mais" description="Explore novos artistas, coleções verificadas e obras digitais que definem a cultura." image="/assets/figma/neon-vessel.png" imageAlt="Arte digital selecionada" maskSrc="/assets/figma/promo-curated-mask.svg" />
      </div>
    </section>
  )
}
