import { env } from "@/lib/env";
import "./css/styles.css";

async function startMocks() {
  if (!env.mocks) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({
    onUnhandledRequest(request, print) {
      if (new URL(request.url).pathname.startsWith("/api/")) print.error();
    },
  });
}

function showStartupFailure(error: unknown) {
  console.error(error);
  const root = document.getElementById("root")!;
  root.setAttribute("role", "alert");
  root.textContent =
    "Não foi possível iniciar a aplicação. Verifique a configuração e recarregue a página.";
}

async function bootstrap() {
  // A tela renderiza primeiro o que não depende da API; o worker do MSW (a maior parte do
  // JavaScript) só é baixado e iniciado depois que o navegador pintou o primeiro
  // quadro. Até lá as consultas ficam pausadas (ver renderApp) e o socket.io-client,
  // que captura o WebSocket ao ser avaliado, só é carregado depois do worker.
  let startWhenIdle!: () => void;
  const mocksReady = new Promise<void>((resolve, reject) => {
    startWhenIdle = () => {
      const start = () => startMocks().then(resolve, reject);
      // Depois do primeiro quadro pintado.
      window.requestAnimationFrame(() => window.setTimeout(start, 0));
    };
  });
  mocksReady.catch(showStartupFailure);
  const { renderApp } = await import("./app/render");
  // O MSW começa depois do primeiro commit da aplicação (e do quadro seguinte).
  renderApp(mocksReady, startWhenIdle);
}

void bootstrap().catch(showStartupFailure);
