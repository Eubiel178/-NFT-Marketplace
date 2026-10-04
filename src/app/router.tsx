import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { catalogSearchSchema } from "@/contracts";
import { queryClient } from "@/lib/query";
import { isSessionExpired, sessionOptions } from "@/shared/api/session";
import { Layout } from "./layout";
import { ProfilePage } from "@/features/account/profile-page";
import { WalletsPage } from "@/features/account/wallets-page";
import { AuthPage } from "@/features/auth/auth-page";
import { CartPage } from "@/features/cart/cart-page";
import { CatalogPage, NftPage } from "@/features/catalog/pages";
import { CheckoutPage } from "@/features/checkout/checkout-page";
import { OrderPage } from "@/features/orders/order-page";

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
