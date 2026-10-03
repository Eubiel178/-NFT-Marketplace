export function FooterFeatureRow() {
  return (
    <section className="marketplace-footer-feature-row" aria-label="Benefícios do marketplace">
      <article>
        <span className="marketplace-footer-feature-icon" aria-hidden="true">W</span>
        <h2>Segurança da carteira</h2>
        <p>Proteja sua carteira e colecione arte digital verificada com confiança.</p>
      </article>
      <article>
        <span className="marketplace-footer-feature-icon" aria-hidden="true">C</span>
        <h2>Criadores em destaque</h2>
        <p>Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.</p>
      </article>
      <article>
        <span className="marketplace-footer-feature-icon" aria-hidden="true">D</span>
        <h2>Alertas de lançamentos</h2>
        <p>Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.</p>
      </article>
      <section className="marketplace-footer-newsletter" aria-labelledby="marketplace-footer-newsletter-title">
        <h2 id="marketplace-footer-newsletter-title">Antecipe-se ao próximo lançamento</h2>
        <form>
          <label className="sr-only" htmlFor="marketplace-footer-email">Seu e-mail</label>
          <input id="marketplace-footer-email" type="email" placeholder="digite seu e-mail..." />
          <button type="submit">Enviar</button>
        </form>
        <p>Receba lançamentos selecionados, histórias de criadores e novidades do mercado.</p>
      </section>
    </section>
  )
}
