import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { catalogSearchSchema } from "@/contracts";
import { queryClient } from "@/lib/query";
import { Layout, PendingFeature } from "./layout";
import { sessionOptions } from "@/features/session/api";
import { CatalogPage, NftPage } from "@/features/catalog/pages";

const root = createRootRoute({
  component: Layout,
  notFoundComponent: () => <h1>Página não encontrada</h1>,
  errorComponent: () => (
    <div role="alert">
      Falha ao abrir a página. Recarregue para tentar novamente.
    </div>
  ),
});
const home = createRoute({
  getParentRoute: () => root,
  path: "/",
  validateSearch: (search) => catalogSearchSchema.parse(search),
  component: CatalogPage,
});
const nft = createRoute({
  getParentRoute: () => root,
  path: "/nfts/$nftId",
  component: function Detail() {
    const { nftId } = nft.useParams();
    return <NftPage id={nftId} />;
  },
});
const cart = createRoute({
  getParentRoute: () => root,
  path: "/cart",
  component: () => <PendingFeature name="Carrinho" />,
});
const login = createRoute({
  getParentRoute: () => root,
  path: "/login",
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === "string" &&
      search.redirect.startsWith("/") &&
      !search.redirect.startsWith("//")
        ? search.redirect
        : "/",
  }),
  component: () => <PendingFeature name="Login" />,
});
const register = createRoute({
  getParentRoute: () => root,
  path: "/register",
  component: () => <PendingFeature name="Cadastro" />,
});
const privateRoot = createRoute({
  getParentRoute: () => root,
  id: "authenticated",
  beforeLoad: async ({ location }) => {
    const session = await queryClient.fetchQuery(sessionOptions);
    if (!session.user)
      throw redirect({ to: "/login", search: { redirect: location.href } });
  },
});
const checkout = createRoute({
  getParentRoute: () => privateRoot,
  path: "/checkout",
  component: () => <PendingFeature name="Pagamento" />,
});
const profile = createRoute({
  getParentRoute: () => privateRoot,
  path: "/profile",
  component: () => <PendingFeature name="Perfil do colecionador" />,
});
const wallets = createRoute({
  getParentRoute: () => privateRoot,
  path: "/wallets",
  component: () => <PendingFeature name="Carteiras" />,
});
const order = createRoute({
  getParentRoute: () => privateRoot,
  path: "/orders/$orderId",
  component: () => <PendingFeature name="Estado do pedido" />,
});
export const router = createRouter({
  routeTree: root.addChildren([
    home,
    nft,
    cart,
    login,
    register,
    privateRoot.addChildren([checkout, profile, wallets, order]),
  ]),
  defaultPreload: "intent",
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
