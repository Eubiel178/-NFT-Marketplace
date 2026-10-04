import { Footer } from "../footer";

export function MarketplaceFooter() {
  return (
    <Footer.Root className="marketplace-footer">
      <Footer.FeatureRow />
      <Footer.ContactRow />
      <Footer.LinksRow />
      <p className="marketplace-footer-copyright">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </Footer.Root>
  );
}
