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
    collection: "Arte digital",
    network: "ethereum",
    image: imagePaths[0],
    price: "1.19",
    available: 4,
    version: 1,
    tokenId: "#0042",
    description:
      "Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.",
    shortDescription:
      "Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum.",
    editions: ["1/1", "1/10", "1/50", "ABERTA"],
    attributes: ["Óculos", "Esmeralda", "Raro"],
    reviews: 19,
    rating: "4.8",
    gallery: [imagePaths[0], imagePaths[0], imagePaths[0], imagePaths[0]],
    details: {
      paragraphs: [
        "Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.",
        "A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.",
      ],
      network: "Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.",
      contract: "0x7A42...19E8 • Contrato inteligente ERC-721 verificado.",
      royalties: "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.",
    },
  },
  {
    id: "nft-2",
    name: "Sage Nomad #009",
    category: "music",
    collection: "Fotografia",
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
    collection: "Música",
    network: "polygon",
    image: imagePaths[2],
    price: "1.99",
    originalPrice: "2.29",
    rare: true,
    available: 2,
    version: 1,
  },
  {
    id: "nft-4",
    name: "Cosmic Bloom #118",
    category: "art",
    collection: "Arte 3D",
    network: "ethereum",
    image: imagePaths[1],
    price: "1.29",
    soldOutEditions: ["1/1"],
    available: 5,
    version: 1,
  },
  {
    id: "nft-5",
    name: "Violet Nomad #314",
    category: "music",
    collection: "Colecionáveis",
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
    collection: "Generativa",
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
    collection: "Jogos",
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
    collection: "Assinaturas",
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
    collection: "Assinaturas",
    network: "polygon",
    image: imagePaths[3],
    price: "0.39",
    available: 6,
    version: 1,
  },
];

// Coleções e redes do painel de filtros do Figma, na ordem e com as contagens do frame.
// As contagens do Figma não fecham entre si (coleções somam 239, redes 283): o catálogo
// tem 283 NFTs e os 44 que sobram ficam numa coleção fora do painel.
export const catalogCollections = [
  { value: "Arte digital", count: 33 },
  { value: "Fotografia", count: 12 },
  { value: "Música", count: 65 },
  { value: "Arte 3D", count: 39 },
  { value: "Colecionáveis", count: 23 },
  { value: "Generativa", count: 17 },
  { value: "Jogos", count: 19 },
  { value: "Assinaturas", count: 13 },
  { value: "Utilidade", count: 18 },
] as const;
const unlistedCollection = { value: "Edições avulsas", count: 44 };

export const catalogNetworks = [
  { value: "ethereum", label: "Ethereum", count: 119 },
  { value: "polygon", label: "Polygon", count: 78 },
  { value: "solana", label: "Solana", count: 86 },
] as const;

// Distribui as vagas restantes alternando entre os grupos, para cada página do
// catálogo misturar coleções e redes.
function interleave<T extends string>(groups: { value: T; count: number }[], taken: T[]) {
  const remaining = groups.map((group) => ({ value: group.value, left: group.count - taken.filter((value) => value === group.value).length }));
  const slots: T[] = [];
  while (remaining.some((group) => group.left > 0)) {
    for (const group of remaining) {
      if (group.left === 0) continue;
      slots.push(group.value);
      group.left -= 1;
    }
  }
  return slots;
}

// Preço em centavos de ETH, sem float: de 0,02 a 12,30.
function generatedPrice(index: number, last: boolean) {
  const cents = last ? 1230 : 2 + ((index * 389) % 1228);
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}

const networkLabels: Record<Nft["network"], string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
  solana: "Solana",
};

// Campos do detalhe que o frame mostra para todo NFT. Quem já tem o campo na
// fixture (nft-1) mantém o valor; os demais recebem um texto coerente com os dados.
function withDetails(nft: Nft, index: number): Nft {
  const network = networkLabels[nft.network];
  const number = Number(nft.id.replace("nft-", ""));
  return {
    ...nft,
    tokenId: nft.tokenId ?? `#${String(number).padStart(4, "0")}`,
    description:
      nft.description ??
      `Um colecionável digital da coleção ${nft.collection}, verificado na ${network}, com acesso para colecionadores.`,
    shortDescription: nft.shortDescription ?? nft.description ?? `Colecionável digital da coleção ${nft.collection}, verificado na ${network}.`,
    editions: nft.editions ?? ["1/1", "1/10", "1/50", "ABERTA"],
    attributes: nft.attributes ?? [nft.collection, network],
    reviews: nft.reviews ?? 3 + ((index * 7) % 40),
    rating: nft.rating ?? `4.${(index * 3) % 10}`,
    gallery: nft.gallery ?? [nft.image, nft.image, nft.image, nft.image],
    details: nft.details ?? {
      paragraphs: [
        `${nft.name} faz parte da coleção ${nft.collection} e tem seus atributos registrados nos metadados do token, verificados na ${network}.`,
        "A propriedade inclui a arte em alta resolução e um registro permanente de procedência na rede.",
      ],
      network: `Cunhado na ${network} com procedência imutável e metadados armazenados no IPFS.`,
      contract: `0x${(0x7a42 + number).toString(16).toUpperCase()}...${(0x19e8 + number).toString(16).toUpperCase()} • Contrato inteligente ERC-721 verificado.`,
      royalties: "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.",
    },
  };
}

export const createNfts = (): Nft[] => {
  const collections = interleave<string>([...catalogCollections, unlistedCollection], homeNfts.map((nft) => nft.collection));
  const networks = interleave<Nft["network"]>([...catalogNetworks], homeNfts.map((nft) => nft.network));
  const numbers = new Map<string, number>();
  return [
    ...homeNfts,
    ...collections.map((collection, index) => {
      const number = (numbers.get(collection) ?? 0) + 1;
      numbers.set(collection, number);
      return {
        id: `nft-${index + 10}`,
        name: `${collection} #${String(number).padStart(3, "0")}`,
        category: (["art", "music", "photography"] as const)[index % 3],
        collection,
        network: networks[index],
        image: imagePaths[index % imagePaths.length],
        price: generatedPrice(index, index === collections.length - 1),
        available: (index % 7) + 1,
        version: 1,
      };
    }),
  ].map(withDetails);
};
