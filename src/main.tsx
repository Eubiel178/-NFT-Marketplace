import { env } from "@/lib/env";
import "./css/styles.css";

async function bootstrap() {
  if (env.mocks) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest(request, print) {
        if (new URL(request.url).pathname.startsWith("/api/")) print.error();
      },
    });
  }
  // socket.io-client captures WebSocket during module evaluation. Load the app
  // only AFTER MSW installs the interceptor, including in production demo builds.
  const { renderApp } = await import("./app/render");
  renderApp();
}
void bootstrap().catch((error: unknown) => {
  console.error(error);
  const root = document.getElementById("root")!;
  root.setAttribute("role", "alert");
  root.textContent =
    "Não foi possível iniciar a aplicação. Verifique a configuração e recarregue a página.";
});
