import { cn } from '@/lib/utils'

type SocialMark = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube'

const socials: { name: SocialMark; label: string }[] = [
  { name: 'facebook', label: 'Facebook' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'twitter', label: 'Twitter' },
  { name: 'linkedin', label: 'LinkedIn' },
  { name: 'youtube', label: 'YouTube' },
]

const features = [
  { mark: 'W', title: 'Segurança da carteira', text: 'Proteja sua carteira e colecione arte digital verificada com confiança.' },
  { mark: 'C', title: 'Criadores em destaque', text: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.' },
  { mark: 'D', title: 'Alertas de lançamentos', text: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.' },
]

const linkGroups = [
  { title: 'Meu perfil', href: '/profile', links: ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'] },
  { title: 'Central de ajuda', href: '/', links: ['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item'] },
  { title: 'Coleções', href: '/', links: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'] },
]

// Colunas medidas no frame de 1440: destaques a cada 266px a partir de x=168;
// contato e links a cada 303px a partir de x=152.
const contactColumns = 'grid-cols-[repeat(3,18.9375rem)_1fr]'
const columnTitle = 'text-body-large-18 font-bold leading-16'

function SocialIcon({ name }: { name: SocialMark }) {
  if (name === 'facebook') return <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor" /></svg>
  if (name === 'instagram') return <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
  if (name === 'twitter') return <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true"><path d="m19.8 7.1-1.9.5a3.3 3.3 0 0 0-5.7 2.2v.7A7.9 7.9 0 0 1 5 7.4s-2.1 4.7 2.6 7.1l-1.8.1s.6 2 3.7 2.5A7.3 7.3 0 0 1 5 18.5c4.8 2.7 11.2 0 11.2-6.7v-.4a4.5 4.5 0 0 0 1.7-2.1l-1.7.4 1-1.7-1.9.7-.5-1.6Z" fill="currentColor" /></svg>
  if (name === 'linkedin') return <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8H3v10h3V8Zm.2-3.2C6.2 3.8 5.5 3 4.5 3S3 3.8 3 4.8s.7 1.8 1.5 1.8 1.7-.8 1.7-1.8ZM21 12.2c0-3-1.6-4.5-3.8-4.5-1.8 0-2.6 1-3.1 1.6V8h-3v10h3v-5.4c0-1.4.3-2.7 1.9-2.7 1.5 0 1.5 1.5 1.5 2.8V18h3v-5.8Z" fill="currentColor" /></svg>
  return <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 7.3a2.5 2.5 0 0 0-1.8-1.8C16.8 5 12 5 12 5s-4.8 0-6.4.5a2.5 2.5 0 0 0-1.8 1.8C3.3 8.9 3.3 12 3.3 12s0 3.1.5 4.7a2.5 2.5 0 0 0 1.8 1.8C7.2 19 12 19 12 19s4.8 0 6.4-.5a2.5 2.5 0 0 0 1.8-1.8c.5-1.6.5-4.7.5-4.7s0-3.1-.5-4.7ZM10 15.5v-7l6 3.5-6 3.5Z" fill="currentColor" /></svg>
}

// Só a partir de lg: não há frame mobile com footer (decisão registrada em ARCHITECTURE.md).
export function Footer() {
  return (
    <footer className="hidden px-6 pb-7.5 text-foreground md:px-12 lg:block">
      <div className="mx-auto max-w-content">
        <section className="grid h-62.5 grid-cols-[15.5625rem_16.625rem_16.625rem_1fr] bg-surface-card pt-8 pr-7.5 pb-4 pl-12" aria-label="Benefícios do marketplace">
          {features.map((feature, index) => (
            <article key={feature.mark} className={cn('h-50.5 min-w-0 self-start border-r border-primary', index > 0 && 'pl-4.25')}>
              <span className="mb-2.75 grid size-18.5 place-items-center rounded-full bg-primary text-heading-24 font-bold text-ink" aria-hidden="true">{feature.mark}</span>
              <h2 className="mb-2.25 text-body-large-17 font-bold leading-20">{feature.title}</h2>
              <p className="max-w-48 text-body-14 leading-22 text-text-secondary">{feature.text}</p>
            </article>
          ))}
          <section className="min-w-0 pl-4" aria-labelledby="footer-newsletter-title">
            <h2 id="footer-newsletter-title" className={cn('mb-4', columnTitle)}>Antecipe-se ao próximo lançamento</h2>
            <form className="mb-3 flex h-10 overflow-hidden rounded-6">
              <label className="sr-only" htmlFor="footer-email">Seu e-mail</label>
              <input id="footer-email" type="email" placeholder="digite seu e-mail..." className="min-w-0 flex-1 bg-surface-dark pl-3.25 text-body-14 text-foreground placeholder:text-secondary" />
              <button type="submit" className="w-21.25 bg-primary pl-4.25 text-left text-body-large-18 font-bold text-ink">Enviar</button>
            </form>
            <p className="text-caption-13 leading-22 text-text-secondary">Receba lançamentos selecionados, histórias de criadores e novidades do mercado.</p>
          </section>
        </section>

        <section className={cn('grid h-22 items-center bg-surface-dark pl-8 text-body-14 leading-22', contactColumns)} aria-label="Informações de contato">
          <strong className="text-body-large-16 font-bold">KURIO</strong>
          <span className="max-w-60">Feito para colecionadores, criadores e cultura</span>
          <span>contato@email.com</span>
          <span>+55 11 4002 8922</span>
        </section>

        <section className={cn('grid h-59 bg-surface-card pt-8 pl-8', contactColumns)} aria-label="Links do marketplace">
          {linkGroups.map((group) => (
            <section key={group.title} className="flex flex-col gap-3">
              <h2 className={cn('mb-0.5', columnTitle)}>{group.title}</h2>
              {group.links.map((link) => <a key={link} href={group.href} className="text-body-14 leading-18 text-foreground">{link}</a>)}
            </section>
          ))}
          <section className="flex flex-col">
            <h2 className={cn('mb-4.75', columnTitle)}>Redes sociais</h2>
            <div className="-ml-0.5 flex gap-2">
              {socials.map((social) => (
                <a key={social.name} href="/" aria-label={social.label} className="grid size-8 place-items-center rounded-5 border border-primary text-primary">
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>
            <h2 className={cn('mt-8 mb-3', columnTitle)}>Carteiras compatíveis</h2>
            <p className="flex h-6.5 w-57 items-center rounded-5 border border-border-soft bg-surface-dark px-2.75 text-tiny-9 font-bold whitespace-pre text-primary">METAMASK  •  WALLETCONNECT  •  COINBASE</p>
          </section>
        </section>

        <p className="mt-2.25 text-center text-body-14">© 2026 Kurio. Propriedade digital para todos.</p>
      </div>
    </footer>
  )
}
