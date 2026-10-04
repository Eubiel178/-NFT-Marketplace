import { useLocation } from "@tanstack/react-router";

interface RealtimeConnectionStatusProps {
  connected: boolean | null;
}

export function RealtimeConnectionStatus({ connected }: RealtimeConnectionStatusProps) {
  const location = useLocation();

  if (connected !== false) return null;

  return (
    <p
      className={
        location.pathname.startsWith("/nfts/")
          ? "mobile-connection-status detail-connection-status"
          : "mobile-connection-status"
      }
      role="status"
    >
      Atualizações em tempo real desconectadas
    </p>
  );
}
