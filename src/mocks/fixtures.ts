import type { Nft } from "@/contracts";

export const users = [
  {
    id: "collector-1",
    name: "Ana Demo",
    email: "ana@example.test",
    passwordSalt: "ana-salt-v1",
    passwordHash:
      "03ea30c3e16727ffdc949aff49e6f518e67e7c389e465a5adeb8574c31d8edd6",
  },
  {
    id: "collector-2",
    name: "Bruno Demo",
    email: "bruno@example.test",
    passwordSalt: "bruno-salt-v1",
    passwordHash:
      "b56c0c7ed87f32327bd1de2a1256889230cec9dd4083dfcaf71b1fe79db78b60",
  },
];

export const defaultCart = [
  { nftId: "nft-1", editionId: "1/1", quantity: 2 },
  { nftId: "nft-5", editionId: "1/10", quantity: 6 },
  { nftId: "nft-6", editionId: "1/50", quantity: 9 },
];

export function createDefaultCart() {
  return defaultCart.map((item) => ({ ...item }));
}

const imagePaths = [
  "/assets/figma/home-hero.png",
  "/assets/figma/featured-nft.png",
  "/assets/figma/neon-vessel.png",
  "/assets/figma/golden-beat.png",
] as const;

const homeNfts: Nft[] = [
  {
    id: "nft-1",
    name: "Emerald Ape #042",
    category: "art",
    collection: "Kurio Apes",
    network: "ethereum",
    image: imagePaths[0],
    price: "1.19",
    available: 4,
    version: 1,
    tokenId: "#0042",
    description:
      "Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.",
    editions: ["1/1", "1/10", "1/50", "ABERTA"],
    attributes: ["Óculos", "Esmeralda", "Raro"],
    reviews: 19,
    gallery: [imagePaths[0], imagePaths[0], imagePaths[0], imagePaths[0]],
  },
  {
    id: "nft-2",
    name: "Sage Nomad #009",
    category: "music",
    collection: "Sage Nomads",
    network: "ethereum",
    image: imagePaths[1],
    price: "1.69",
    available: 3,
    version: 1,
  },
  {
    id: "nft-3",
    name: "Neon Vessel #552",
    category: "photography",
    collection: "Neon Vessels",
    network: "polygon",
    image: imagePaths[2],
    price: "1.99",
    available: 2,
    version: 1,
  },
  {
    id: "nft-4",
    name: "Cosmic Bloom #118",
    category: "art",
    collection: "Cosmic Blooms",
    network: "ethereum",
    image: imagePaths[1],
    price: "1.29",
    available: 5,
    version: 1,
  },
  {
    id: "nft-5",
    name: "Violet Nomad #314",
    category: "music",
    collection: "Violet Nomads",
    network: "polygon",
    image: imagePaths[1],
    price: "1.39",
    available: 6,
    version: 1,
  },
  {
    id: "nft-6",
    name: "Ivory Baron #088",
    category: "photography",
    collection: "Ivory Barons",
    network: "ethereum",
    image: imagePaths[2],
    price: "1.79",
    available: 9,
    version: 1,
  },
  {
    id: "nft-7",
    name: "Golden Beat #207",
    category: "art",
    collection: "Golden Beats",
    network: "polygon",
    image: imagePaths[3],
    price: "0.99",
    available: 8,
    version: 1,
  },
  {
    id: "nft-8",
    name: "Golden Signal #160",
    category: "music",
    collection: "Golden Signals",
    network: "ethereum",
    image: imagePaths[3],
    price: "0.39",
    available: 6,
    version: 1,
  },
  {
    id: "nft-9",
    name: "Golden Signal #160",
    category: "photography",
    collection: "Golden Signals",
    network: "polygon",
    image: imagePaths[3],
    price: "0.39",
    available: 6,
    version: 1,
  },
];

export const createNfts = (): Nft[] => [
  ...homeNfts,
  ...Array.from({ length: 24 }, (_, index) => ({
    id: `nft-${index + 10}`,
    name: `Coleção ${String(index + 1).padStart(2, "0")}`,
    category: (["art", "music", "photography"] as const)[index % 3],
    collection: `Coleção ${String(index + 1).padStart(2, "0")}`,
    network: (["ethereum", "polygon"] as const)[index % 2],
    image: imagePaths[index % imagePaths.length],
    price: `0.${String(index + 1).padStart(3, "0")}`,
    available: (index % 7) + 1,
    version: 1,
  })),
];
