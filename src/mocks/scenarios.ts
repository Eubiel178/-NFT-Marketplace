export const scenarios = [
  "default",
  "empty",
  "slow",
  "variable-latency",
  "network-error",
  "timeout",
  "http-500",
  "unauthorized",
  "favorites-error",
  "payment-declined",
  "wallet-rejected",
  "payment-pending",
  "payment-held",
  "payment-timeout",
  "stale-quote",
  "cart-error",
  "cart-load-error",
  "quote-error",
  "profile-error",
  "wallets-error",
  "order-error",
] as const;
export type Scenario = (typeof scenarios)[number];
const key = "nft-marketplace:scenario";
export function getScenario(): Scenario {
  const value = localStorage.getItem(key);
  return scenarios.find((scenario) => scenario === value) || "default";
}
export function setScenario(scenario: Scenario) {
  localStorage.setItem(key, scenario);
}
