import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from "@tanstack/react-router";
import { catalogSearchSchema } from "@/contracts";
import { queryClient } from "@/lib/query";
import { isSessionExpired, sessionOptions } from "@/shared/api/session";
import { Layout } from "./layout";
import { discardExpiredSession } from "./session-expiry";
import { CatalogPage, NftPage } from "@/features/catalog/pages";

// Telas que a Início e o Detalhe não usam saem do pacote inicial e carregam por rota.
const ProfilePage = lazyRouteComponent(() => import("@/features/account/profile-page"), "ProfilePage");
const WalletsPage = lazyRouteComponent(() => import("@/features/account/wallets-page"), "WalletsPage");
const AuthPage = lazyRouteComponent(() => import("@/features/auth/auth-page"), "AuthPage");
const CartPage = lazyRouteComponent(() => import("@/features/cart/cart-page"), "CartPage");
const CheckoutPage = lazyRouteComponent(() => import("@/features/checkout/checkout-page"), "CheckoutPage");
const OrderPage = lazyRouteComponent(() => import("@/features/orders/order-page"), "OrderPage");

function safeRedirect(value: unknown) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function authSearch(search: Record<string, unknown>) {
  return { redirect: safeRedirect(search.redirect), expired: search.expired === true || search.expired === "true" };
}

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
  staticData: { hideTabBar: true },
  component: function Detail() {
    const { nftId } = nft.useParams();
    return <NftPage id={nftId} />;
  },
});
const cart = createRoute({
  getParentRoute: () => root,
  path: "/cart",
  staticData: { hideTabBar: true },
  component: CartPage,
});
const login = createRoute({
  getParentRoute: () => root,
  path: "/login",
  staticData: { hideTabBar: true },
  validateSearch: authSearch,
  component: () => <AuthPage mode="login" />,
});
const register = createRoute({
  getParentRoute: () => root,
  path: "/register",
  staticData: { hideTabBar: true },
  validateSearch: authSearch,
  component: () => <AuthPage mode="register" />,
});
const privateRoot = createRoute({
  getParentRoute: () => root,
  id: "authenticated",
  beforeLoad: async ({ location }) => {
    let session;
    try {
      session = await queryClient.fetchQuery(sessionOptions);
    } catch (error) {
      if (isSessionExpired(error)) {
        // Expirou entre uma navegação e outra: descarta o que era do usuário antes de ir ao login.
        await discardExpiredSession();
        throw redirect({ to: "/login", search: { redirect: location.href, expired: true } });
      }
      throw error;
    }
    if (!session.user)
      throw redirect({ to: "/login", search: { redirect: location.href, expired: false } });
  },
});
const checkout = createRoute({
  getParentRoute: () => privateRoot,
  path: "/checkout",
  staticData: { hideTabBar: true },
  component: CheckoutPage,
});
const profile = createRoute({
  getParentRoute: () => privateRoot,
  path: "/profile",
  staticData: { hideTabBar: true },
  component: ProfilePage,
});
const wallets = createRoute({
  getParentRoute: () => privateRoot,
  path: "/wallets",
  staticData: { hideTabBar: true },
  component: WalletsPage,
});
const order = createRoute({
  getParentRoute: () => privateRoot,
  path: "/orders/$orderId",
  // O frame da confirmação mostra só o recibo, sem header e footer.
  staticData: { hideTabBar: true, hideChrome: true },
  component: function OrderRoute() {
    const { orderId } = order.useParams();
    return <OrderPage id={orderId} />;
  },
});
// Sessão expirada fora de uma navegação (ação na própria página): login com retorno ao destino atual.
export function goToLoginExpired() {
  const { pathname, href } = router.latestLocation;
  if (pathname === "/login" || pathname === "/register") return;
  void router.navigate({ to: "/login", search: { redirect: href, expired: true }, replace: true });
}
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
  // Rotas com barra de compra ou formulário próprio escondem a tab bar mobile.
  interface StaticDataRouteOption {
    hideTabBar?: boolean;
    // Telas que o Figma desenha sem header e footer.
    hideChrome?: boolean;
  }
  interface Register {
    router: typeof router;
  }
}
