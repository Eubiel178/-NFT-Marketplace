import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { onlineManager, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "@/components";
import { queryClient } from "@/lib/query";
import { startRealtime } from "@/realtime";
import { AfterFirstCommit } from "./after-first-commit";
import { goToLoginExpired, router } from "./router";
import { installSessionExpiry } from "./session-expiry";

// `apiReady` resolve quando a API (o MSW, na demonstração) já responde: até lá as consultas
// ficam pausadas, sem falhar, e a tela mostra o que não depende delas. `startApi` é chamado
// uma vez, depois do primeiro commit.
export function renderApp(apiReady: Promise<void>, startApi: () => void) {
  onlineManager.setOnline(false);
  // Se a API não subir, main.tsx mostra a falha de inicialização.
  void apiReady
    .then(() => {
      onlineManager.setOnline(true);
      return startRealtime();
    })
    .catch(() => undefined);
  installSessionExpiry(goToLoginExpired);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <AfterFirstCommit onCommit={startApi} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
