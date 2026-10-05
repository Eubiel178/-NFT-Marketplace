import { useEffect } from "react";

// Chama `onCommit` uma vez, depois do primeiro commit da aplicação.
export function AfterFirstCommit({ onCommit }: { onCommit: () => void }) {
  useEffect(onCommit, [onCommit]);
  return null;
}
