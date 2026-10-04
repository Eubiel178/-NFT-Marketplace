import { HomeBlogCard } from '../../home-blog-card'

const blogPosts = [
  { date: '12 de setembro', readingTime: '6 min', title: 'Como funciona a propriedade de NFTs', description: 'Aprenda a colecionar, negociar e verificar ativos digitais.', image: '/assets/figma/neon-vessel.png', imageAlt: 'Arte digital em tons de roxo' },
  { date: '13 de setembro', readingTime: '2 min', title: '10 artistas digitais para acompanhar', description: 'Conheça criadores que moldam a cultura digital.', image: '/assets/figma/home-hero.png', imageAlt: 'Arte digital do marketplace' },
  { date: '15 de setembro', readingTime: '3 min', title: 'Raridade, atributos e procedência', description: 'Entenda raridade, procedência, direitos autorais e utilidade.', image: '/assets/figma/featured-nft.png', imageAlt: 'Obra digital em destaque' },
  { date: '15 de setembro', readingTime: '2 min', title: 'Como proteger sua carteira', description: 'Proteja sua carteira, seus ativos e sua identidade.', image: '/assets/figma/golden-beat.png', imageAlt: 'Arte digital dourada' },
] as const

export function HomeBlog() {
  return (
    <section className="home-blog" aria-labelledby="home-blog-title">
      <div className="home-section-heading"><div><h2 id="home-blog-title" className="text-body-large-17-bold">Diário da Cunhagem</h2><p className="text-body-14-regular text-text-secondary">Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.</p></div></div>
      <div className="home-blog-grid">{blogPosts.map((post) => <HomeBlogCard key={post.title} {...post} />)}</div>
    </section>
  )
}
