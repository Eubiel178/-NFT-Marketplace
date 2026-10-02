import { useEffect, useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { connectCatalog } from "@/lib/realtime";

export function Layout() {
  const [connected, setConnected] = useState(false);
  useEffect(() => connectCatalog(setConnected), []);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:bg-background focus:p-4"
      >
        Pular para o conteúdo
      </a>
      <header className="border-b border-border p-6">
        <nav
          aria-label="Principal"
          className="mx-auto flex max-w-6xl flex-wrap gap-6"
        >
          <Link
            to="/"
            search={{ q: "", category: "all", sort: "name", page: 1 }}
          >
            NFT Marketplace
          </Link>
          <Link to="/cart">Carrinho</Link>
          <Link to="/profile">Perfil</Link>
          <Link to="/wallets">Carteiras</Link>
        </nav>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl p-6">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-6 py-4">
        <p role="status">
          {connected
            ? "Atualizações em tempo real conectadas"
            : "Atualizações em tempo real desconectadas"}
        </p>
      </footer>
    </>
  );
}

export function PendingFeature({ name }: { name: string }) {
  return (
    <section>
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="mt-4">
        Rota preparada. Este fluxo ainda não foi implementado.
      </p>
    </section>
  );
}
