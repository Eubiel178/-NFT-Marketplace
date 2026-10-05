import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "@/components";
import { queryClient } from "@/lib/query";
import { startRealtime } from "@/realtime";
import { goToLoginExpired, router } from "./router";
import { installSessionExpiry } from "./session-expiry";

export function renderApp() {
  startRealtime();
  installSessionExpiry(goToLoginExpired);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </StrictMode>,
  );
}
