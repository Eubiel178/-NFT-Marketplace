import { delay, http, HttpResponse } from "msw";
import { z } from "zod";
import {
  catalogSearchSchema,
  cartItemSchema,
  collectorSchema,
  ethSchema,
  passwordChangeSchema,
  profileInputSchema,
  walletInputSchema,
  orderStatusSchema,
  paymentMethodSchema,
  type CartItem,
  type Order,
  type Profile,
  type Wallet,
} from "@/contracts";
import { fromWei, toWei } from "@/lib/eth";
import { db, resetDb, saveDb, type StoredProfile } from "./db";
import { catalogCollections, catalogNetworks } from "./fixtures";
import { getScenario, scenarios, setScenario } from "./scenarios";
import {
  broadcastNft,
  broadcastOrder,
  disconnectSockets,
  openSocketCount,
} from "./socket";

const error = (
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string>,
) =>
  HttpResponse.json(
    { code, message, ...(fields ? { fields } : {}) },
    { status },
  );
const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
const registerBodySchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});
const cartMutationSchema = z.object({
  nftId: z.string(),
  editionId: z.string(),
  quantity: z.number().int().positive(),
});
const quoteBodySchema = z.object({
  items: z.array(cartItemSchema),
  coupon: z.string().optional(),
});
const walletCreateSchema = walletInputSchema.extend({ primary: z.boolean().optional() });
// Códigos de indicação aceitos pela API (só ela sabe quais existem).
const referralCodes = ["KURIO-2026"];
const orderBodySchema = z.object({
  quoteId: z.string(),
  quoteVersion: z.number().int().positive(),
  walletId: z.string(),
  network: z.enum(["ethereum", "polygon"]),
  collector: collectorSchema,
});
// Erros de validação por campo, no formato do contrato de erro (fields).
function fieldErrors(issues: z.ZodIssue[]) {
  return Object.fromEntries(
    issues.map((issue) => [String(issue.path.at(-1)), issue.message]),
  );
}
const scheduledOrders = new Set<string>();
// Contagens e faixa de preço do catálogo inteiro, independentes da busca atual.
function catalogFacets() {
  const prices = db.nfts.map((nft) => nft.price);
  const byWei = (a: string, b: string) => (toWei(a) < toWei(b) ? -1 : toWei(a) > toWei(b) ? 1 : 0);
  const sorted = [...prices].sort(byWei);
  return {
    collections: catalogCollections.map(({ value }) => ({
      value,
      count: db.nfts.filter((nft) => nft.collection === value).length,
    })),
    networks: catalogNetworks.map(({ value, label }) => ({
      value,
      label,
      count: db.nfts.filter((nft) => nft.network === value).length,
    })),
    price: { min: sorted[0] ?? "0", max: sorted.at(-1) ?? "0" },
  };
}
function findSessionUser() {
  return db.sessionExpired
    ? null
    : (db.users.find((user) => user.id === db.sessionUserId) ?? null);
}
function publicUser(user: (typeof db.users)[number]) {
  return { id: user.id, name: user.name, email: user.email };
}
function profileFor(user: { id: string; name: string; email: string }): Profile {
  const stored: StoredProfile = db.profiles[user.id] ?? {
    userId: user.id,
    displayName: user.name,
    username: user.name.toLowerCase().replaceAll(" ", "-"),
    ens: "",
    walletAlias: "",
    avatar: null,
  };
  db.profiles[user.id] = stored;
  return { ...stored, email: user.email };
}
const avatarMaxBytes = 512 * 1024;
function toDataUrl(bytes: Uint8Array, type: string) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return `data:${type};base64,${btoa(binary)}`;
}
function unknownReferral(code: string) {
  return referralCodes.includes(code.trim().toUpperCase())
    ? null
    : error(422, "VALIDATION_ERROR", "Confira os dados da carteira", {
        referralCode: "Código de indicação não encontrado",
      });
}
function currentUser() {
  const user = findSessionUser();
  return user ? publicUser(user) : null;
}
function userError() {
  return error(401, "UNAUTHORIZED", "Faça login para continuar");
}
function permissionError() {
  return error(
    403,
    "FORBIDDEN",
    "Você não tem permissão para acessar este recurso",
  );
}
function cartItems(userId: string): CartItem[] {
  return db.carts[userId] ?? [];
}
// Unidades do NFT já no carrinho, somando todas as edições (menos a linha que está mudando).
function reservedUnits(items: CartItem[], nftId: string, exceptEditionId?: string) {
  return items
    .filter((item) => item.nftId === nftId && item.editionId !== exceptEditionId)
    .reduce((total, item) => total + item.quantity, 0);
}
function cartOwnerId() {
  return currentUser()?.id ?? "visitor";
}
function mergeCartItems(...groups: CartItem[][]) {
  const merged = new Map<string, CartItem>();
  for (const group of groups)
    for (const item of group) {
      const key = `${item.nftId}:${item.editionId}`;
      const previous = merged.get(key);
      merged.set(
        key,
        previous
          ? { ...previous, quantity: previous.quantity + item.quantity }
          : { ...item },
      );
    }
  return [...merged.values()];
}
async function hashPassword(password: string, salt: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${password}`),
  );
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function orderPayload(input: z.infer<typeof orderBodySchema>) {
  return JSON.stringify(input);
}
function confirmOrder(orderId: string) {
  const current = db.orders.find((candidate) => candidate.id === orderId);
  if (!current || current.status !== "pending") return current;
  current.status = "confirmed";
  current.transactionRef = "0xA91F…E82C";
  current.version += 1;
  removePurchasedItems(current.userId, current.quote.items);
  saveDb();
  broadcastOrder({
    eventId: `${current.id}:${current.version}`,
    resourceId: current.id,
    version: current.version,
    userId: current.userId,
    status: current.status,
  });
  return current;
}
function scheduleOrderConfirmation(order: Order) {
  // payment-held mantém o pedido pendente até POST /__mock/orders/:id/confirm.
  if (getScenario() === "payment-held") return;
  if (order.status !== "pending" || scheduledOrders.has(order.id)) return;
  scheduledOrders.add(order.id);
  setTimeout(() => {
    scheduledOrders.delete(order.id);
    confirmOrder(order.id);
  }, 400);
}
function cartLines(userId: string) {
  return cartItems(userId)
    .map((item) => ({
      ...item,
      nft: db.nfts.find((nft) => nft.id === item.nftId),
    }))
    .filter((line): line is typeof line & { nft: (typeof db.nfts)[number] } =>
      Boolean(line.nft),
    );
}
function snapshotItems(items: CartItem[]) {
  return items.map((item) => {
    const nft = db.nfts.find((candidate) => candidate.id === item.nftId);
    return {
      ...item,
      price: nft?.price ?? "0",
      name: nft?.name,
      image: nft?.image,
      tokenId: nft?.tokenId,
    };
  });
}
function removePurchasedItems(userId: string, purchasedItems: CartItem[]) {
  const remaining = cartItems(userId)
    .map((line) => {
      const purchased = purchasedItems.find(
        (item) =>
          item.nftId === line.nftId && item.editionId === line.editionId,
      );
      return purchased
        ? { ...line, quantity: line.quantity - purchased.quantity }
        : line;
    })
    .filter((line) => line.quantity > 0);
  db.carts[userId] = remaining;
}
// Cupons que existiram e já venceram: resposta diferente de um código inexistente.
const expiredCoupons = ["KURIO5"];
function calculateQuote(items: CartItem[], coupon?: string) {
  const subtotalWei = items.reduce((total, item) => {
    const nft = db.nfts.find((candidate) => candidate.id === item.nftId);
    return nft ? total + toWei(nft.price) * BigInt(item.quantity) : total;
  }, 0n);
  const discountWei = coupon === "KURIO10" ? subtotalWei / 10n : 0n;
  return {
    subtotal: fromWei(subtotalWei),
    discount: fromWei(discountWei),
    networkFee: "0.016" as const,
    total: fromWei(subtotalWei - discountWei + toWei("0.016")),
  };
}
async function conditions(request: Request) {
  const scenario = getScenario();
  const page = Number(new URL(request.url).searchParams.get("page") || 1);
  await delay(
    scenario === "slow"
      ? 2_000
      : scenario === "variable-latency"
        ? page % 2
          ? 900
          : 100
        : 80,
  );
  if (scenario === "network-error") return HttpResponse.error();
  if (scenario === "http-500")
    return error(
      503,
      "TRANSIENT_FAILURE",
      "Serviço temporariamente indisponível",
    );
  if (scenario === "unauthorized")
    return error(401, "SESSION_EXPIRED", "Sessão expirada");
}
export const handlers = [
  http.get("/api/session", () =>
    db.sessionExpired
      ? error(401, "SESSION_EXPIRED", "Sua sessão expirou")
      : HttpResponse.json({ user: currentUser() }),
  ),
  http.post("/api/auth/login", async ({ request }) => {
    const body = loginBodySchema.safeParse(await request.json());
    if (!body.success)
      return error(422, "VALIDATION_ERROR", "Informe email e senha válidos", {
        email: "Informe um email válido",
        password: "Informe sua senha",
      });
    const user = db.users.find(
      (candidate) => candidate.email === body.data.email,
    );
    if (
      !user ||
      (await hashPassword(body.data.password, user.passwordSalt)) !==
        user.passwordHash
    )
      return error(401, "INVALID_CREDENTIALS", "Email ou senha inválidos");
    db.sessionUserId = user.id;
    db.sessionExpired = false;
    db.carts[user.id] = mergeCartItems(
      db.carts[user.id] ?? [],
      db.carts.visitor ?? [],
    );
    delete db.carts.visitor;
    saveDb();
    return HttpResponse.json({ user: publicUser(user) });
  }),
  http.post("/api/auth/register", async ({ request }) => {
    const body = registerBodySchema.safeParse(await request.json());
    if (!body.success)
      return error(422, "VALIDATION_ERROR", "Confira os campos do cadastro", {
        username: "Use pelo menos 3 caracteres",
        email: "Informe um email válido",
        password: "Use pelo menos 8 caracteres",
        confirmPassword: "Confirme sua senha",
      });
    if (body.data.password !== body.data.confirmPassword)
      return error(422, "VALIDATION_ERROR", "As senhas precisam ser iguais", {
        confirmPassword: "As senhas precisam ser iguais",
      });
    if (db.users.some((user) => user.email === body.data.email))
      return error(409, "EMAIL_CONFLICT", "Este email já está cadastrado", {
        email: "Este email já está cadastrado",
      });
    const passwordSalt = createSalt();
    const user = {
      id: `collector-${db.users.length + 1}`,
      name: body.data.username,
      email: body.data.email,
      passwordSalt,
      passwordHash: await hashPassword(body.data.password, passwordSalt),
    };
    db.users.push(user);
    db.sessionUserId = user.id;
    db.sessionExpired = false;
    db.profiles[user.id] = {
      userId: user.id,
      displayName: body.data.username,
      username: body.data.username,
      ens: "",
      walletAlias: "",
      avatar: null,
    };
    db.carts[user.id] = mergeCartItems(
      db.carts[user.id] ?? [],
      db.carts.visitor ?? [],
    );
    delete db.carts.visitor;
    db.wallets[user.id] = [];
    saveDb();
    return HttpResponse.json({ user: publicUser(user) }, { status: 201 });
  }),
  http.post("/api/auth/logout", () => {
    db.sessionUserId = null;
    db.sessionExpired = false;
    saveDb();
    return new HttpResponse(null, { status: 204 });
  }),
  http.post("/api/__mock/session/expire", () => {
    db.sessionExpired = true;
    saveDb();
    return new HttpResponse(null, { status: 204 });
  }),
  http.get("/api/nfts", async ({ request }) => {
    const failure = await conditions(request);
    if (failure) return failure;
    const search = catalogSearchSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    const priceMin = search.priceMin ? toWei(search.priceMin) : null;
    const priceMax = search.priceMax ? toWei(search.priceMax) : null;
    const items =
      getScenario() === "empty"
        ? []
        : db.nfts
            .filter((nft) => {
              return (
                nft.name.toLowerCase().includes(search.q.toLowerCase()) &&
                (search.category === "all" ||
                  nft.category === search.category) &&
                (search.collection === "all" ||
                  nft.collection === search.collection) &&
                (search.network === "all" || nft.network === search.network)
              );
            })
            .filter((nft) => {
              const price = toWei(nft.price);
              return (
                (priceMin === null || price >= priceMin) &&
                (priceMax === null || price <= priceMax)
              );
            })
            .sort((a, b) => {
              if (search.sort === "recent") return 0;
              if (search.sort === "name") return a.name.localeCompare(b.name);
              const delta = toWei(a.price) - toWei(b.price);
              const order = delta < 0n ? -1 : delta > 0n ? 1 : 0;
              return search.sort === "price-asc" ? order : -order;
            });
    return HttpResponse.json({
      items: items.slice((search.page - 1) * 9, search.page * 9),
      total: items.length,
      page: search.page,
      pageSize: 9,
      facets: catalogFacets(),
    });
  }),
  http.get("/api/nfts/:id", async ({ request, params }) => {
    const failure = await conditions(request);
    if (failure) return failure;
    const nft = db.nfts.find((item) => item.id === params.id);
    return nft
      ? HttpResponse.json(nft)
      : error(404, "NOT_FOUND", "NFT não encontrado");
  }),
  http.get("/api/favorites", () => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "favorites-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível carregar os favoritos",
      );
    return HttpResponse.json({ items: db.favorites[user.id] ?? [] });
  }),
  http.put("/api/favorites/:nftId", ({ params }) => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "favorites-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível atualizar os favoritos",
      );
    if (!db.nfts.some((nft) => nft.id === params.nftId))
      return error(404, "NOT_FOUND", "NFT não encontrado");
    const items = db.favorites[user.id] ?? [];
    db.favorites[user.id] = items.includes(String(params.nftId))
      ? items
      : [...items, String(params.nftId)];
    saveDb();
    return HttpResponse.json({ items: db.favorites[user.id] });
  }),
  http.delete("/api/favorites/:nftId", ({ params }) => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "favorites-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível atualizar os favoritos",
      );
    db.favorites[user.id] = (db.favorites[user.id] ?? []).filter(
      (id) => id !== params.nftId,
    );
    saveDb();
    return HttpResponse.json({ items: db.favorites[user.id] });
  }),
  http.post("/api/__mock/reset", () => {
    resetDb();
    setScenario("default");
    return new HttpResponse(null, { status: 204 });
  }),
  http.post("/api/__mock/scenario", async ({ request }) => {
    const body = (await request.json()) as { scenario?: string };
    const scenario = scenarios.find((item) => item === body.scenario);
    if (!scenario)
      return error(422, "VALIDATION_ERROR", "Cenário desconhecido");
    setScenario(scenario);
    return HttpResponse.json({ scenario });
  }),
  http.post("/api/__mock/nfts/:id/update", ({ params }) => {
    const nft = db.nfts.find((item) => item.id === params.id);
    if (!nft) return error(404, "NOT_FOUND", "NFT não encontrado");
    nft.version += 1;
    nft.price = "0.125";
    saveDb();
    broadcastNft({
      eventId: `${nft.id}:${nft.version}`,
      resourceId: nft.id,
      version: nft.version,
      nft,
    });
    return HttpResponse.json(nft);
  }),
  // Reemite um nft.updated sem mexer no banco (duplicata ou versão antiga): o payload pode
  // carregar um preço diferente do banco, que o cliente nunca deve aplicar.
  http.post("/api/__mock/nfts/:id/event", async ({ request, params }) => {
    const nft = db.nfts.find((item) => item.id === params.id);
    if (!nft) return error(404, "NOT_FOUND", "NFT não encontrado");
    const body = z
      .object({ version: z.number().int().positive().optional(), price: ethSchema.optional() })
      .safeParse(await request.json().catch(() => ({})));
    if (!body.success) return error(422, "VALIDATION_ERROR", "Evento de NFT inválido");
    const version = body.data.version ?? nft.version;
    const event = {
      eventId: `${nft.id}:${version}:${crypto.randomUUID()}`,
      resourceId: nft.id,
      version,
      nft: { ...nft, version, price: body.data.price ?? nft.price },
    };
    broadcastNft(event);
    return HttpResponse.json(event);
  }),
  http.post("/api/__mock/orders/:id/confirm", ({ params }) => {
    const order = confirmOrder(String(params.id));
    if (!order) return error(404, "NOT_FOUND", "Pedido não encontrado");
    return HttpResponse.json(order);
  }),
  http.post("/api/__mock/orders/:id/event", async ({ request, params }) => {
    const order = db.orders.find((candidate) => candidate.id === params.id);
    if (!order) return error(404, "NOT_FOUND", "Pedido não encontrado");
    const body = z
      .object({
        version: z.number().int().positive().optional(),
        status: orderStatusSchema.optional(),
      })
      .safeParse(await request.json().catch(() => ({})));
    if (!body.success)
      return error(422, "VALIDATION_ERROR", "Evento de pedido inválido");
    const event = {
      eventId: `${order.id}:${body.data.version ?? order.version}:${crypto.randomUUID()}`,
      resourceId: order.id,
      version: body.data.version ?? order.version,
      userId: order.userId,
      status: body.data.status ?? order.status,
    };
    broadcastOrder(event);
    return HttpResponse.json(event);
  }),
  http.get("/api/__mock/socket/clients", () =>
    HttpResponse.json({ open: openSocketCount() }),
  ),
  http.post("/api/__mock/socket/disconnect", () => {
    disconnectSockets();
    return new HttpResponse(null, { status: 204 });
  }),
  http.get("/api/cart", () => {
    if (getScenario() === "cart-load-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível carregar o carrinho",
      );
    return HttpResponse.json({ items: cartLines(cartOwnerId()) });
  }),
  http.post("/api/cart/items", async ({ request }) => {
    if (getScenario() === "cart-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível atualizar o carrinho",
      );
    const body = cartMutationSchema.safeParse(await request.json());
    if (!body.success)
      return error(422, "VALIDATION_ERROR", "Item de carrinho inválido");
    const nft = db.nfts.find((item) => item.id === body.data.nftId);
    const ownerId = cartOwnerId();
    const items = cartItems(ownerId);
    const existing = items.find(
      (item) =>
        item.nftId === body.data.nftId &&
        item.editionId === body.data.editionId,
    );
    if (nft?.soldOutEditions?.includes(body.data.editionId))
      return error(409, "OUT_OF_STOCK", "Esta edição está esgotada");
    if (!nft || nft.available < reservedUnits(items, nft.id) + body.data.quantity)
      return error(409, "OUT_OF_STOCK", "Edição indisponível");
    if (existing) existing.quantity += body.data.quantity;
    else items.push(body.data);
    db.carts[ownerId] = items;
    saveDb();
    return HttpResponse.json({ items: cartLines(ownerId) }, { status: 201 });
  }),
  http.patch("/api/cart/items/:nftId", async ({ request, params }) => {
    if (getScenario() === "cart-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível atualizar o carrinho",
      );
    const body = cartMutationSchema.safeParse(await request.json());
    if (!body.success)
      return error(422, "VALIDATION_ERROR", "Quantidade inválida");
    const ownerId = cartOwnerId();
    const items = cartItems(ownerId);
    const item = items.find(
      (candidate) =>
        candidate.nftId === params.nftId &&
        candidate.editionId === body.data.editionId,
    );
    if (!item) return error(404, "NOT_FOUND", "Item não encontrado");
    const nft = db.nfts.find((candidate) => candidate.id === params.nftId);
    if (nft?.soldOutEditions?.includes(item.editionId))
      return error(409, "OUT_OF_STOCK", "Esta edição está esgotada");
    if (
      !nft ||
      nft.available <
        reservedUnits(items, nft.id, item.editionId) + body.data.quantity
    )
      return error(409, "OUT_OF_STOCK", "Edição indisponível");
    item.quantity = body.data.quantity;
    saveDb();
    return HttpResponse.json({ items: cartLines(ownerId) });
  }),
  http.delete("/api/cart/items/:nftId", ({ request, params }) => {
    if (getScenario() === "cart-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível atualizar o carrinho",
      );
    const ownerId = cartOwnerId();
    const editionId = new URL(request.url).searchParams.get("editionId");
    db.carts[ownerId] = cartItems(ownerId).filter(
      (item) =>
        item.nftId !== params.nftId ||
        (editionId !== null && item.editionId !== editionId),
    );
    saveDb();
    return HttpResponse.json({ items: cartLines(ownerId) });
  }),
  http.post("/api/quote", async ({ request }) => {
    if (getScenario() === "slow") await delay(2_000);
    if (getScenario() === "quote-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível calcular a cotação",
      );
    const body = quoteBodySchema.safeParse(await request.json());
    if (!body.success) return error(422, "VALIDATION_ERROR", "Itens inválidos");
    if (body.data.coupon && expiredCoupons.includes(body.data.coupon))
      return error(409, "COUPON_EXPIRED", "Este cupom expirou");
    if (body.data.coupon && body.data.coupon !== "KURIO10")
      return error(409, "INVALID_COUPON", "Cupom inválido");
    const id = `quote-${crypto.randomUUID()}`;
    const quote = {
      id,
      version: 1,
      expiresAt: new Date(Date.now() + 600_000).toISOString(),
      items: snapshotItems(body.data.items),
      ...calculateQuote(body.data.items, body.data.coupon),
    };
    db.quotes[id] = { quote, coupon: body.data.coupon };
    saveDb();
    return HttpResponse.json(quote);
  }),
  http.get("/api/profile", async () => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "slow") await delay(2_000);
    if (getScenario() === "profile-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível carregar o perfil",
      );
    return HttpResponse.json(profileFor(user));
  }),
  http.patch("/api/profile", async ({ request }) => {
    const user = findSessionUser();
    if (!user) return userError();
    if (getScenario() === "profile-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível salvar o perfil",
      );
    const body = profileInputSchema.safeParse(await request.json());
    if (!body.success)
      return error(
        422,
        "VALIDATION_ERROR",
        "Confira os dados do perfil",
        fieldErrors(body.error.issues),
      );
    const username = body.data.username.toLowerCase();
    if (
      Object.values(db.profiles).some(
        (other) => other.userId !== user.id && other.username.toLowerCase() === username,
      )
    )
      return error(409, "USERNAME_TAKEN", "Revise os campos destacados", {
        username: "Este nome de usuário já está em uso",
      });
    const email = body.data.email.toLowerCase();
    if (db.users.some((other) => other.id !== user.id && other.email.toLowerCase() === email))
      return error(409, "EMAIL_CONFLICT", "Revise os campos destacados", {
        email: "Este e-mail já está em uso",
      });
    const profile = profileFor(publicUser(user));
    db.profiles[user.id] = {
      userId: user.id,
      displayName: body.data.displayName,
      username: body.data.username,
      ens: body.data.ens,
      walletAlias: body.data.walletAlias,
      avatar: profile.avatar,
    };
    user.name = body.data.displayName;
    user.email = body.data.email;
    saveDb();
    return HttpResponse.json(profileFor(publicUser(user)));
  }),
  // Upload simulado: valida o arquivo, demora um pouco e guarda a imagem como data URL.
  http.post("/api/profile/avatar", async ({ request }) => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "profile-error")
      return error(503, "TRANSIENT_FAILURE", "Não foi possível enviar o avatar");
    const file = (await request.formData().catch(() => null))?.get("avatar");
    const invalid = (message: string) =>
      error(422, "VALIDATION_ERROR", "Avatar inválido", { avatar: message });
    if (!(file instanceof File)) return invalid("Escolha uma imagem para enviar");
    if (!file.type.startsWith("image/"))
      return invalid("Use um arquivo de imagem (PNG, JPG ou SVG)");
    if (file.size > avatarMaxBytes) return invalid("A imagem deve ter até 512 KB");
    await delay(700);
    const avatar = toDataUrl(new Uint8Array(await file.arrayBuffer()), file.type);
    profileFor(user);
    db.profiles[user.id] = { ...db.profiles[user.id], avatar };
    saveDb();
    return HttpResponse.json(profileFor(user));
  }),
  http.delete("/api/profile/avatar", () => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "profile-error")
      return error(503, "TRANSIENT_FAILURE", "Não foi possível remover o avatar");
    profileFor(user);
    db.profiles[user.id] = { ...db.profiles[user.id], avatar: null };
    saveDb();
    return HttpResponse.json(profileFor(user));
  }),
  http.patch("/api/profile/password", async ({ request }) => {
    const user = findSessionUser();
    if (!user) return userError();
    const body = passwordChangeSchema.safeParse(await request.json());
    if (!body.success)
      return error(
        422,
        "VALIDATION_ERROR",
        "Confira as senhas",
        fieldErrors(body.error.issues),
      );
    if (
      (await hashPassword(body.data.currentPassword, user.passwordSalt)) !==
      user.passwordHash
    )
      return error(422, "INVALID_PASSWORD", "Confira as senhas", {
        currentPassword: "A senha atual está incorreta",
      });
    const passwordSalt = createSalt();
    user.passwordSalt = passwordSalt;
    user.passwordHash = await hashPassword(body.data.newPassword, passwordSalt);
    saveDb();
    return new HttpResponse(null, { status: 204 });
  }),
  http.get("/api/wallets", async () => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "slow") await delay(2_000);
    if (getScenario() === "wallets-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível carregar as carteiras",
      );
    return HttpResponse.json({ items: db.wallets[user.id] ?? [] });
  }),
  http.post("/api/wallets", async ({ request }) => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "wallets-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível salvar a carteira",
      );
    const body = walletCreateSchema.safeParse(await request.json());
    if (!body.success)
      return error(
        422,
        "VALIDATION_ERROR",
        "Confira os dados da carteira",
        fieldErrors(body.error.issues),
      );
    const rejected = unknownReferral(body.data.referralCode);
    if (rejected) return rejected;
    const { primary: wantsPrimary, ...input } = body.data;
    const owned = db.wallets[user.id] ?? [];
    // A principal é única: a primeira carteira vira principal e uma nova principal rebaixa a anterior.
    const primary = owned.length === 0 || wantsPrimary === true;
    const wallet: Wallet = {
      ...input,
      id: `wallet-${Date.now()}`,
      userId: user.id,
      primary,
    };
    db.wallets[user.id] = [
      ...owned.map((item) => (primary ? { ...item, primary: false } : item)),
      wallet,
    ];
    saveDb();
    return HttpResponse.json(wallet, { status: 201 });
  }),
  // Simulação de conexão com a extensão da carteira: aceita, recusa (cenário) e desconecta.
  http.post("/api/wallets/:walletId/connect", async ({ request, params }) => {
    const user = currentUser();
    if (!user) return userError();
    const body = z.object({ method: paymentMethodSchema }).safeParse(await request.json());
    if (!body.success) return error(422, "VALIDATION_ERROR", "Escolha como conectar a carteira");
    const wallet = (db.wallets[user.id] ?? []).find((item) => item.id === params.walletId);
    if (!wallet) return error(404, "NOT_FOUND", "Carteira não encontrada");
    await delay(300);
    if (getScenario() === "wallet-rejected")
      return error(409, "WALLET_REJECTED", "A conexão foi recusada na carteira. Tente de novo ou escolha outra opção.");
    db.walletConnections[user.id] = { walletId: wallet.id, method: body.data.method };
    saveDb();
    return HttpResponse.json(db.walletConnections[user.id]);
  }),
  http.post("/api/wallets/:walletId/disconnect", ({ params }) => {
    const user = currentUser();
    if (!user) return userError();
    if (db.walletConnections[user.id]?.walletId === params.walletId) delete db.walletConnections[user.id];
    saveDb();
    return new HttpResponse(null, { status: 204 });
  }),
  http.get("/api/wallets/connection", () => {
    const user = currentUser();
    if (!user) return userError();
    return HttpResponse.json({ connection: db.walletConnections[user.id] ?? null });
  }),
  http.patch("/api/wallets/:walletId", async ({ request, params }) => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "wallets-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível salvar a carteira",
      );
    const body = walletInputSchema.safeParse(await request.json());
    const belongsToAnotherUser = Object.entries(db.wallets).some(
      ([userId, wallets]) =>
        userId !== user.id &&
        wallets.some((wallet) => wallet.id === params.walletId),
    );
    if (belongsToAnotherUser) return permissionError();
    const wallet = (db.wallets[user.id] ?? []).find(
      (item) => item.id === params.walletId,
    );
    if (!wallet) return error(404, "NOT_FOUND", "Carteira não encontrada");
    if (!body.success)
      return error(
        422,
        "VALIDATION_ERROR",
        "Confira os dados da carteira",
        fieldErrors(body.error.issues),
      );
    const rejected = unknownReferral(body.data.referralCode);
    if (rejected) return rejected;
    Object.assign(wallet, body.data);
    saveDb();
    return HttpResponse.json(wallet);
  }),
  // Troca a principal: a anterior vira secundária no mesmo passo, então só existe uma principal.
  http.patch("/api/wallets/:walletId/primary", async ({ params }) => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "wallets-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível trocar a carteira principal",
      );
    const belongsToAnotherUser = Object.entries(db.wallets).some(
      ([userId, wallets]) =>
        userId !== user.id &&
        wallets.some((wallet) => wallet.id === params.walletId),
    );
    if (belongsToAnotherUser) return permissionError();
    const owned = db.wallets[user.id] ?? [];
    if (!owned.some((wallet) => wallet.id === params.walletId))
      return error(404, "NOT_FOUND", "Carteira não encontrada");
    await delay(300);
    db.wallets[user.id] = owned.map((wallet) => ({
      ...wallet,
      primary: wallet.id === params.walletId,
    }));
    saveDb();
    return HttpResponse.json({ items: db.wallets[user.id] });
  }),
  http.post("/api/orders", async ({ request }) => {
    const user = currentUser();
    if (!user) return userError();
    const body = orderBodySchema.safeParse(await request.json());
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!body.success)
      return error(
        422,
        "VALIDATION_ERROR",
        "Revise os campos destacados",
        fieldErrors(body.error.issues),
      );
    if (!idempotencyKey)
      return error(422, "VALIDATION_ERROR", "Pedido sem chave de idempotência");
    const referral = body.data.collector.referralCode.trim().toUpperCase();
    if (referral && !referralCodes.includes(referral))
      return error(422, "VALIDATION_ERROR", "Revise os campos destacados", {
        referralCode: "Código de indicação não encontrado",
      });
    const payload = orderPayload(body.data);
    const previousAttempt = db.idempotency[idempotencyKey];
    if (previousAttempt && previousAttempt.payload !== payload)
      return error(
        409,
        "IDEMPOTENCY_CONFLICT",
        "A chave de idempotência já foi usada com outro pedido",
      );
    if (previousAttempt) {
      const previousOrder = db.orders.find(
        (candidate) =>
          candidate.id === previousAttempt.orderId &&
          candidate.userId === user.id,
      );
      if (previousOrder)
        return HttpResponse.json(previousOrder, { status: 200 });
      return permissionError();
    }
    if (getScenario() === "stale-quote")
      return error(
        409,
        "QUOTE_STALE",
        "A cotação mudou. Revise a compra antes de confirmar",
      );
    const storedQuote = db.quotes[body.data.quoteId];
    if (!storedQuote || storedQuote.quote.version !== body.data.quoteVersion)
      return error(
        409,
        "QUOTE_STALE",
        "A cotação mudou. Revise a compra antes de confirmar",
      );
    const currentItems = cartItems(user.id);
    const requestedItems = storedQuote.quote.items.map(
      ({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity }),
    );
    const currentQuote = calculateQuote(requestedItems, storedQuote.coupon);
    const matchesCart =
      storedQuote.quote.subtotal === currentQuote.subtotal &&
      storedQuote.quote.discount === currentQuote.discount &&
      storedQuote.quote.networkFee === currentQuote.networkFee &&
      storedQuote.quote.total === currentQuote.total &&
      storedQuote.quote.items.every((item) => {
        const currentLine = currentItems.find(
          (line) =>
            line.nftId === item.nftId && line.editionId === item.editionId,
        );
        const currentNft = db.nfts.find((nft) => nft.id === item.nftId);
        return (
          currentLine &&
          currentLine.quantity >= item.quantity &&
          currentNft?.price === item.price
        );
      });
    if (!matchesCart)
      return error(
        409,
        "QUOTE_STALE",
        "A cotação mudou. Revise a compra antes de confirmar",
      );
    const wallet = (db.wallets[user.id] ?? []).find(
      (candidate) => candidate.id === body.data.walletId,
    );
    if (!wallet)
      return error(409, "WALLET_REQUIRED", "Selecione uma carteira cadastrada");
    if (db.walletConnections[user.id]?.walletId !== wallet.id)
      return error(
        409,
        "WALLET_NOT_CONNECTED",
        "Conecte a carteira antes de confirmar a compra",
      );
    if (body.data.quoteVersion !== 1)
      return error(
        409,
        "QUOTE_STALE",
        "A cotação mudou. Revise a compra antes de confirmar",
      );
    const fullQuote = storedQuote.quote;
    const status =
      getScenario() === "payment-declined"
        ? "declined"
        : getScenario() === "payment-pending" ||
            getScenario() === "payment-held" ||
            getScenario() === "payment-timeout"
          ? "pending"
          : "confirmed";
    const order: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      version: 1,
      status,
      createdAt: new Date().toISOString(),
      quote: fullQuote,
      transactionRef: status === "confirmed" ? "0xA91F…E82C" : null,
      wallet: {
        address: wallet.address,
        network: body.data.network,
        name: wallet.name,
        // Snapshot do aplicativo da carteira usado na compra (conexão conferida acima).
        method: db.walletConnections[user.id].method,
      },
    };
    db.orders.push(order);
    db.idempotency[idempotencyKey] = { payload, orderId: order.id };
    if (status === "confirmed")
      removePurchasedItems(user.id, order.quote.items);
    saveDb();
    broadcastOrder({
      eventId: `${order.id}:1`,
      resourceId: order.id,
      version: 1,
      userId: user.id,
      status: order.status,
    });
    scheduleOrderConfirmation(order);
    if (getScenario() === "payment-timeout")
      return error(
        504,
        "ORDER_TIMEOUT",
        "A confirmação demorou. O pedido será recuperado automaticamente",
      );
    return HttpResponse.json(order, { status: 201 });
  }),
  http.get("/api/orders/by-key/:key", ({ params }) => {
    const user = currentUser();
    if (!user) return userError();
    const attempt = db.idempotency[String(params.key)];
    const order = attempt
      ? db.orders.find((candidate) => candidate.id === attempt.orderId)
      : undefined;
    if (order && order.userId !== user.id) return permissionError();
    return order
      ? HttpResponse.json(order)
      : error(404, "NOT_FOUND", "Pedido não encontrado");
  }),
  http.get("/api/orders/:id", ({ params }) => {
    const user = currentUser();
    if (!user) return userError();
    if (getScenario() === "order-error")
      return error(
        503,
        "TRANSIENT_FAILURE",
        "Não foi possível carregar o pedido",
      );
    const order = db.orders.find(
      (candidate): candidate is Order =>
        typeof candidate === "object" &&
        candidate !== null &&
        "id" in candidate &&
        candidate.id === params.id,
    );
    if (order && order.userId !== user.id) return permissionError();
    if (order?.status === "pending") scheduleOrderConfirmation(order);
    return order
      ? HttpResponse.json(order)
      : error(404, "NOT_FOUND", "Pedido não encontrado");
  }),
];
