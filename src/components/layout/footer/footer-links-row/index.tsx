type SocialMark = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube'

function FooterSocialMark({ name }: { name: SocialMark }) {
  if (name === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor" /></svg>
  if (name === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
  if (name === 'twitter') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m19.8 7.1-1.9.5a3.3 3.3 0 0 0-5.7 2.2v.7A7.9 7.9 0 0 1 5 7.4s-2.1 4.7 2.6 7.1l-1.8.1s.6 2 3.7 2.5A7.3 7.3 0 0 1 5 18.5c4.8 2.7 11.2 0 11.2-6.7v-.4a4.5 4.5 0 0 0 1.7-2.1l-1.7.4 1-1.7-1.9.7-.5-1.6Z" fill="currentColor" /></svg>
  if (name === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8H3v10h3V8Zm.2-3.2C6.2 3.8 5.5 3 4.5 3S3 3.8 3 4.8s.7 1.8 1.5 1.8 1.7-.8 1.7-1.8ZM21 12.2c0-3-1.6-4.5-3.8-4.5-1.8 0-2.6 1-3.1 1.6V8h-3v10h3v-5.4c0-1.4.3-2.7 1.9-2.7 1.5 0 1.5 1.5 1.5 2.8V18h3v-5.8Z" fill="currentColor" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 7.3a2.5 2.5 0 0 0-1.8-1.8C16.8 5 12 5 12 5s-4.8 0-6.4.5a2.5 2.5 0 0 0-1.8 1.8C3.3 8.9 3.3 12 3.3 12s0 3.1.5 4.7a2.5 2.5 0 0 0 1.8 1.8C7.2 19 12 19 12 19s4.8 0 6.4-.5a2.5 2.5 0 0 0 1.8-1.8c.5-1.6.5-4.7.5-4.7s0-3.1-.5-4.7ZM10 15.5v-7l6 3.5-6 3.5Z" fill="currentColor" /></svg>
}

export function FooterLinksRow() {
  return (
    <section className="marketplace-footer-links-row" aria-label="Links do marketplace">
      <section>
        <h2>Meu perfil</h2>
        <a href="/profile">Meu perfil</a>
        <a href="/profile">Minha coleção</a>
        <a href="/profile">Atividade</a>
        <a href="/profile">Estúdio do criador</a>
        <a href="/profile">Lista de interesse</a>
      </section>
      <section>
        <h2>Central de ajuda</h2>
        <a href="/">Central de ajuda</a>
        <a href="/">Como comprar NFTs</a>
        <a href="/">Carteira e segurança</a>
        <a href="/">Política do mercado</a>
        <a href="/">Denunciar item</a>
      </section>
      <section>
        <h2>Coleções</h2>
        <a href="/">Arte digital</a>
        <a href="/">Fotografia</a>
        <a href="/">Música</a>
        <a href="/">Arte 3D</a>
        <a href="/">Utilidade</a>
      </section>
      <section className="marketplace-footer-socials">
        <h2>Redes sociais</h2>
        <div>
          <a href="/" aria-label="Facebook"><FooterSocialMark name="facebook" /></a>
          <a href="/" aria-label="Instagram"><FooterSocialMark name="instagram" /></a>
          <a href="/" aria-label="Twitter"><FooterSocialMark name="twitter" /></a>
          <a href="/" aria-label="LinkedIn"><FooterSocialMark name="linkedin" /></a>
          <a href="/" aria-label="YouTube"><FooterSocialMark name="youtube" /></a>
        </div>
        <h2>Carteiras compatíveis</h2>
        <p>METAMASK • WALLETCONNECT • COINBASE</p>
      </section>
    </section>
  )
}
