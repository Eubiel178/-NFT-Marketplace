import { Card } from './card'

export function Promos() {
  return (
    <section aria-labelledby="home-promos-title" className="max-sm:hidden">
      <h2 id="home-promos-title" className="sr-only">Explore mais</h2>
      <div className="grid gap-7 lg:grid-cols-2">
        <Card title={`Lançamentos gênesis\nde edição limitada`} description="Colecione edições escassas diretamente dos criadores antes da revelação pública." image="/assets/figma/home-hero.png" imageAlt="Arte de lançamento gênesis" maskSrc="/assets/figma/promo-genesis-mask.svg" />
        <Card title={`Arte digital selecionada\ne muito mais`} description="Explore novos artistas, coleções verificadas e obras digitais que definem a cultura." image="/assets/figma/neon-vessel.png" imageAlt="Arte digital selecionada" maskSrc="/assets/figma/promo-curated-mask.svg" />
      </div>
    </section>
  )
}
