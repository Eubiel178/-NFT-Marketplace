import { z } from "zod";
import {
  nftSchema,
  orderSchema,
  type CartItem,
  type Nft,
  type Order,
  type Profile,
  type Quote,
  type Wallet,
} from "@/contracts";
import { createDefaultCart, createNfts, users } from "./fixtures";

const key = "nft-marketplace:mock-db:v1";
export interface MockDb {
  nfts: Nft[];
  users: Array<{
    id: string;
    name: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
  }>;
  sessionUserId: string | null;
  sessionExpired: boolean;
  carts: Record<string, CartItem[]>;
  favorites: Record<string, string[]>;
  profiles: Record<string, Profile>;
  wallets: Record<string, Wallet[]>;
  orders: Order[];
  quotes: Record<string, { quote: Quote; coupon?: string }>;
  idempotency: Record<string, { payload: string; orderId: string }>;
}
const schema = z.object({
  nfts: z.array(nftSchema),
  users: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      passwordSalt: z.string(),
      passwordHash: z.string(),
    }),
  ),
  sessionUserId: z.string().nullable(),
  sessionExpired: z.boolean(),
  carts: z.record(
    z.string(),
    z.array(
      z.object({
        nftId: z.string(),
        editionId: z.string(),
        quantity: z.number().int().positive(),
      }),
    ),
  ),
  favorites: z.record(z.string(), z.array(z.string())),
  profiles: z.record(
    z.string(),
    z.object({
      userId: z.string(),
      displayName: z.string(),
      username: z.string(),
      bio: z.string(),
      ens: z.string(),
      website: z.string(),
      avatar: z.string().nullable(),
    }),
  ),
  wallets: z.record(
    z.string(),
    z.array(
      z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        alias: z.string(),
        address: z.string(),
        network: z.enum(["ethereum", "polygon"]),
        label: z.string(),
        tag: z.string(),
        ens: z.string(),
        primary: z.boolean(),
      }),
    ),
  ),
  orders: z.array(orderSchema),
  quotes: z.record(z.string(), z.object({ quote: z.object({ id: z.string(), version: z.number().int().positive(), expiresAt: z.string(), items: z.array(z.object({ nftId: z.string(), editionId: z.string(), quantity: z.number().int().positive(), price: z.string().optional(), name: z.string().optional(), image: z.string().optional(), tokenId: z.string().optional() })), subtotal: z.string(), discount: z.string(), networkFee: z.string(), total: z.string() }), coupon: z.string().optional() })),
  idempotency: z.record(
    z.string(),
    z.object({ payload: z.string(), orderId: z.string() }),
  ),
});
const initialState = (): MockDb => ({
  nfts: createNfts(),
  users: users.map((user) => ({ ...user })),
  sessionUserId: null,
  sessionExpired: false,
  carts: { "collector-1": createDefaultCart() },
  favorites: { "collector-1": [], "collector-2": [] },
  profiles: {
    "collector-1": {
      userId: "collector-1",
      displayName: "Ana Demo",
      username: "ana-kurio",
      bio: "Colecionadora de arte digital e histórias da internet.",
      ens: "ana.kurio.eth",
      website: "https://kurio.example",
      avatar: null,
    },
  },
  wallets: {
    "collector-1": [
      {
        id: "wallet-1",
        userId: "collector-1",
        name: "Principal",
        alias: "Carteira principal",
        address: "0xA91F…E82C",
        network: "ethereum" as const,
        label: "Rede principal Ethereum",
        tag: "Principal",
        ens: "",
        primary: true,
      },
      {
        id: "wallet-2",
        userId: "collector-1",
        name: "Reserva",
        alias: "Carteira reserva",
        address: "0xA91F…E82C",
        network: "polygon" as const,
        label: "Rede Polygon",
        tag: "Reserva",
        ens: "nova.kurio.eth",
        primary: false,
      },
    ],
  },
  orders: [],
  quotes: {},
  idempotency: {},
});
function read() {
  try {
    const saved = schema.safeParse(
      JSON.parse(localStorage.getItem(key) || "null"),
    );
    return saved.success ? saved.data : initialState();
  } catch {
    return initialState();
  }
}
export const db: MockDb = read();
export function saveDb() {
  localStorage.setItem(key, JSON.stringify(db));
}
export function resetDb() {
  Object.assign(db, initialState());
  saveDb();
}
